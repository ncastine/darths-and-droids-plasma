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
 *   Darths & Droids web comic is copyright of "The Comic Irregulars."     *
 *   This KDE plasma Comic strip plugin was adapted with permission.       *
 ***************************************************************************/

// Comic developer guide: https://develop.kde.org/docs/plasma/comic-plugin

/* global comic */

const BASE_URL = 'https://www.darthsanddroids.net'

// Enable display of debug messages in comic Alt text
const ENABLE_DEBUG = false

// Regular expression to get comic image URL and title from within page HTML.
// NOTE: Named capturing groups do not seem to be supported in KDE.
const IMAGE_URL_PARSER = /<img.*?src="(\/comics\/darths(\d{4}).jpg)".*?alt="([^"]*)"/i

// Fallback storage for debug messages.
// Needed for Docker since builtin print(...) requires full X Session.
const debugMessages = []

// Called by the comic engine for a page that is not cached yet.
// eslint-disable-next-line no-unused-vars
function init () {
  // NOTE: DO NOT set comic.websiteUrl to overall website.
  // Delay until we have specific episode URL. Better for caching.
  comic.comicAuthor = 'The Comic Irregulars'
  comic.shopUrl = 'http://www.cafepress.com/mezzacotta/6391587'

  if (ENABLE_DEBUG) {
    debugEnv()
  }

  // Fetch page directly if we don't need more information
  if (comic.identifierSpecified && comic.lastIdentifier) {
    navigateToEpisode(comic.identifier)
  } else {
    // Visit home page to determine latest episode ID
    comic.requestPage(BASE_URL, comic.User)
  }
}

// Called by the comic engine when data is downloaded.
// The 'id' is just a number for the type of request that was made.
// eslint-disable-next-line no-unused-vars
function pageRetrieved (id, data) {
  // Determine the latest episode
  if (id === comic.User) {
    debug('Looking up latest episode')
    // Darths & Droids home page has latest comic image
    const matchLast = IMAGE_URL_PARSER.exec(data)

    if (matchLast != null) {
      debug('match(' + matchLast + ')')
      // API has a "helpful" quirk. When we set comic.lastIdentifier
      // it also sets comic.identifier to last when undefined or 0.
      // This forces us to start at last episode when nothing cached.
      comic.lastIdentifier = getComicNumber(matchLast[2])
      debug('Parsed last ID: ' + comic.lastIdentifier + ' current ID: ' + comic.identifier)
      // Switch to specified episode if different from last
      if (comic.identifierSpecified && comic.lastIdentifier !== comic.identifier) {
        navigateToEpisode(comic.identifier)
        return
      }
      // Set URL to permanent link for current episode
      comic.websiteUrl = buildEpisodeUrl(comic.identifier)
    } else {
      debug('Failed to read latest page: ' + data)
      comic.error()
      return
    }
  }

  // Normal episode fetch
  if (id === comic.Page || id === comic.User) {
    debug('Rendering episode: ' + comic.identifier)
    // A standard page parsing. Find the image.
    const matchComic = IMAGE_URL_PARSER.exec(data)

    if (matchComic != null) {
      debug('match(' + matchComic + ')')
      const imageUrl = BASE_URL + matchComic[1]

      comic.title = matchComic[3]

      // Get additional text from page
      const addText = getAdditionalText(data)

      if (addText) {
        comic.additionalText = addText
      }

      // Fetch just the image. The engine will display it in panel.
      comic.requestPage(imageUrl, comic.Image)
      return
    } else {
      debug('Failed to read episode page: ' + data)
      comic.error()
      return
    }
  }

  if (id === comic.Image) {
    debug('Image downloaded')
  } else {
    debug('Ignored request type ID: ' + id + ', data: ' + data)
  }
}

// Attempt to print the current environment
function debugEnv () {
  const envStr = 'comic(' + listProperties(comic) + ') '
  debug(envStr.trim())
}

// String-ify object properties
function listProperties (obj) {
  if (!obj) return ''
  let propStr = ''
  const keys = Object.getOwnPropertyNames(obj)
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]
    propStr += key + '[' + obj[key] + '] '
  }
  return propStr.trim()
}

// Helper to accumulate debug messages when enabled
function debug (message) {
  if (ENABLE_DEBUG) {
    debugMessages.push(message)
  }
  // This does nothing unless full X Session is running. So NOT in Docker.
  // Prefix, since it goes to shared file (generally ~/.xsession-errors).
  print('Comic(Darths&Droids) ' + new Date().toISOString() + ': ' + message)
}

// Go to and render the comic episode for the given identifier
function navigateToEpisode (identifier) {
  const url = buildEpisodeUrl(identifier)
  // Set current URL to specific episode
  comic.websiteUrl = url
  debug('Fetching comic ' + url)
  comic.requestPage(url, comic.Page)
}

// Build a URL for a specific episode (comic number) defined by the identifier.
// TODO: Support language code in the identifier.
function buildEpisodeUrl (identifier) {
  const normalized = zeroPad(getComicNumber(identifier))
  return BASE_URL + '/episodes/' + normalized + '.html'
}

// Get additional text from Darths & Droids HTML page data
function getAdditionalText (html) {
  let result = ''
  let copyOn = false
  const lines = html.split('\n')

  for (const index in lines) {
    const line = lines[index]

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
    let debugHeader = ''
    for (const index in debugMessages) {
      debugHeader += '<p>' + debugMessages[index] + '</p>'
    }
    debugHeader += ' END DEBUG'
    result = debugHeader + result
  }

  return result
}

// Zero-pad a number string from the left.
// Default is 4 digits.
function zeroPad (input, totalDigits) {
  // Default to 4 digits.
  // eslint-disable-next-line no-new-wrappers
  totalDigits = new Number(totalDigits || 4)

  // Want a string result. Avoid undefined input value.
  let result = input ? '' + input : ''

  const addCount = totalDigits - result.length
  for (let i = 0; i < addCount; i++) {
    result = '0' + result
  }

  return result
}

// Get the comic number part from an identifier string.
// Result is a plain number without any padding.
// In the future the identifier may also include language code.
function getComicNumber (identifier) {
  // Need to specify base-10 since numbers starting with "0" are
  // interpreted as octal by some JavaScript implementations
  return parseInt(identifier, 10)
}

// Need to export any functions that will be unit tested by Jest
module.exports = { zeroPad }
