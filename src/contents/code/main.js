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

const baseUrl = "https://www.darthsanddroids.net";

// Enable display of debug messages in comic Alt text
const ENABLE_DEBUG = true;

// Fallback storage for debug messages.
// Needed for Docker since builtin print(...) requires full X Session.
debugMessages = [];

// Helper to accumulate debug messages when enabled
function debug(message) {
    if (ENABLE_DEBUG) {
        debugMessages.push(message);
    }
    // This does nothing unless full X Session is running. So NOT in Docker.
    // Prefix, since it goes to shared file (generally ~/.xsession-errors).
    print("Comic(Darths&Droids): " + message);
}

// Called for a page that is not cached yet
function init() {
    comic.websiteUrl = baseUrl;
    comic.comicAuthor = "The Comic Irregulars";
    comic.shopUrl = "http://www.cafepress.com/mezzacotta/6391587";
    comic.firstIdentifier = 1;

    debug("[Init] Specified: " + comic.identifierSpecified +
        " Current: " + comic.identifier +
        " Previous: " + comic.previousIdentifier +
        " Next: " + comic.nextIdentifier +
        " First: " + comic.firstIdentifier +
        " Last: " + comic.lastIdentifier);

    comic.requestPage(comic.websiteUrl, comic.User);
}

function pageRetrieved(id, data) {
    debug("Page fetched: " + id);

    // Regular expression to get comic image URL and title from web page
    const expImageId = new RegExp("<img.*?src=\"(/comics/darths(\\d{4}).jpg)\".*?alt=\"([^\"]*)\"");

    // Find the most recent comic
    if (id == comic.User) {
        // Darths & Droids home page has latest comic image
        matchLast = expImageId.exec(data);

        if (matchLast != null) {
            // Need to specify base-10 since numbers starting with "0" are
            // interpreted as octal by some JavaScript implementations
            comic.lastIdentifier = parseInt(matchLast[2], 10);

            var url = baseUrl + "/episodes/";
            url += PadDigits(comic.identifier, 4) + ".html";

            comic.requestPage(url, comic.Page);
        } else {
            comic.error();
        }
    }

    if (id == comic.Page) {
        matchComic = expImageId.exec(data);

        if (matchComic != null) {
            var imageUrl = baseUrl + matchComic[1];

            comic.title = matchComic[3];

            // Get additional text from page
            var addText = GetAdditionalText(data);

            if (addText != "") {
                comic.additionalText = addText;
            }

            comic.requestPage(imageUrl, comic.Image);
        } else {
            comic.error();
        }
    }
}

// Get additional text from Darths & Droids HTML page data
function GetAdditionalText(html) {
    var result = "";
    var copyOn = false;
    var lines = html.split("\n");

    for (var index in lines) {
        var line = lines[index];

        if (line.match(/.*<div class="text">.*/i) != null) {
            copyOn = true; // Begin adding to result string
        } else if (line.match(/.*<h3>Transcript.*/i) != null) {
            copyOn = false;
        } else if (copyOn) {
            result += line;
        }
    }

    // Prepend any debug messages, to ensure they can be seen
    if (debugMessages.length > 0) {
        var debugHeader = "";
        for (var index in debugMessages) {
            debugHeader += "<p>" + debugMessages[index] + "</p>";
        }
        debugHeader += " END DEBUG";
        result = debugHeader + result;
    }

    return result;
}

function PadDigits(input, totalDigits) {
    input = new String(input); // Ensure input is in string format
    totalDigits = new Number(totalDigits);

    var result = input;

    if (totalDigits > input.length) {
        for (i = 0; i < (totalDigits - input.length); i++) {
            result = '0' + result;
        }
    }

    return result.toString(); // Return as simple string
}
