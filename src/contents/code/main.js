/***************************************************************************
 *   Copyright (C) 2012 - 2023 Neil Castine <neil.castine@gmail.com>       *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 *   This program is distributed in the hope that it will be useful,       *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 *   GNU General Public License for more details.                          *
 *                                                                         *
 *   You should have received a copy of the GNU General Public License     *
 *   along with this program; if not, write to the                         *
 *   Free Software Foundation, Inc.,                                       *
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA .        *
 *                                                                         *
 *   Darths & Droids webcomic is copyright of "The Comic Irregulars."      *
 *   The webcomic KDE plasma plugin was adapted with permission.           *
 ***************************************************************************/

// Originally inspired by
// https://techbase.kde.org/Development/Tutorials/Plasma4/ComicPlugin

const BASE_URL = 'https://www.darthsanddroids.net'

// Enable display of debug messages in comic Alt text
const ENABLE_DEBUG = true

// Regular expression to get comic image URL and title from within page HTML
const IMAGE_URL_PARSER = new RegExp(/<img.*?src="(\/comics\/darths(\d{4}).jpg)".*?alt="([^"]*)"/)

// Fallback storage for debug messages.
// Needed for Docker since builtin print(...) requires full X Session.
debugMessages = []

// Called by the comic engine for a page that is not cached yet
function init() {
    comic.websiteUrl = BASE_URL
    comic.comicAuthor = 'The Comic Irregulars'
    comic.shopUrl = 'http://www.cafepress.com/mezzacotta/6391587'
    // This comic starts at episode 1
    comic.firstIdentifier = 1

    debugEnv()

    // Visit home page to determine latest episode ID
    comic.requestPage(BASE_URL, comic.User)
}

// Called by the comic engine when data is downloaded.
// The 'id' is just a number for the type of request that was made.
function pageRetrieved(id, data) {
    debug('Page fetched: ' + id)

    // "User" indicates the latest comic (home page) was fetched.
    // DO NOT render or download related image. Just capture information.
    // Comic engine gets confused if you render during User response.
    if (id == comic.User) {
        // Darths & Droids home page has latest comic image
        var matchLast = IMAGE_URL_PARSER.exec(data)

        if (matchLast != null) {
            // API has a "helpful" quirk. When we set comic.lastIdentifier
            // it also sets comic.identifier to last when undefined or 0.
            // This forces us to start at last episode when nothing cached.
            comic.lastIdentifier = getComicNumber(matchLast[2])
            debug('Parsed last ID: ' + comic.lastIdentifier + ' current ID: ' + comic.identifier)
            // Fetch comic for the specified identifier
            navigateToEpisode(comic.identifier)
        } else {
            debug('Failed to read latest page: ' + data)
            comic.error()
        }
    }

    // Normal episode fetch
    if (id == comic.Page) {
        // A standard page parsing. Find the image.
        var matchComic = IMAGE_URL_PARSER.exec(data)

        if (matchComic != null) {
            var imageUrl = BASE_URL + matchComic[1]

            comic.title = matchComic[3]

            // Get additional text from page
            var addText = getAdditionalText(data)

            if (addText) {
                comic.additionalText = addText
            }

            // Fetch just the image. The engine will display it in panel.
            comic.requestPage(imageUrl, comic.Image)
        } else {
            debug('Failed to read episode page: ' + data)
            comic.error()
        }
    }
}

// Attempt to print the current environment
function debugEnv() {
    var envStr = 'comic(' + listProperties(comic) + ') '
    debug(envStr.trim())
}

// String-ify object properties
function listProperties(obj) {
    if (!obj) return ''
    var propStr = ''
    var keys = Object.getOwnPropertyNames(obj)
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i]
        propStr += key + '[' + obj[key] + '] '
    }
    return propStr.trim()
}

// Helper to accumulate debug messages when enabled
function debug(message) {
    if (ENABLE_DEBUG) {
        debugMessages.push(message)
    }
    // This does nothing unless full X Session is running. So NOT in Docker.
    // Prefix, since it goes to shared file (generally ~/.xsession-errors).
    print('Comic(Darths&Droids) ' + new Date().toISOString() + ': ' + message)
}

// Go to and render the comic episode for the given identifier
function navigateToEpisode(identifier) {
    var url = buildEpisodeUrl(identifier)
    // Set current URL to specific episode
    comic.websiteUrl = url
    debug('Fetching comic ' + url)
    comic.requestPage(url, comic.Page)
}

// Build a URL for a specific episode (comic number) defined by the identifier.
// TODO: Support language code in the identifier.
function buildEpisodeUrl(identifier) {
    var normalized = zeroPad(getComicNumber(identifier))
    return BASE_URL + '/episodes/' + normalized + '.html'
}

// Get additional text from Darths & Droids HTML page data
function getAdditionalText(html) {
    var result = ''
    var copyOn = false
    var lines = html.split("\n")

    for (var index in lines) {
        var line = lines[index]

        if (line.match(/.*<div class="text">.*/i) != null) {
            copyOn = true // Begin adding to result string
        } else if (line.match(/.*<h3>Transcript.*/i) != null) {
            copyOn = false
        } else if (copyOn) {
            result += line
        }
    }

    // Prepend any debug messages, to ensure they can be seen
    if (debugMessages.length > 0) {
        var debugHeader = ''
        for (var index in debugMessages) {
            debugHeader += '<p>' + debugMessages[index] + '</p>'
        }
        debugHeader += ' END DEBUG'
        result = debugHeader + result
    }

    return result
}

// Zero-pad a number string from the left.
// Default is 4 digits.
function zeroPad(input, totalDigits) {
    // Ensure input is in string format
    input = new String(input)
    // Default to 4 digits
    totalDigits = new Number(totalDigits || 4)

    var result = input

    if (totalDigits > input.length) {
        for (i = 0; i < (totalDigits - input.length); i++) {
            result = '0' + result
        }
    }

    return result.toString() // Return as simple string
}

// Get the comic number part from an identifier string.
// Result is a plain number without any padding.
// In the future the identifier may also include language code.
function getComicNumber(identifier) {
    // Need to specify base-10 since numbers starting with "0" are
    // interpreted as octal by some JavaScript implementations
    return parseInt(identifier, 10)
}
