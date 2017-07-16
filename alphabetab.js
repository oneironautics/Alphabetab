/*
The MIT License

Copyright (c) 2017 Mike Smith https://oneironautics.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

document.addEventListener('DOMContentLoaded', function() {
    var manifest = chrome.runtime.getManifest();
    document.getElementById('version').innerText = manifest.version;

    document.querySelectorAll('.sortOption').forEach(function(element) {
        element.addEventListener('click', sortTabs)
    });

    document.querySelectorAll('.killOption').forEach(function(element) {
        element.addEventListener('click', killTabs)
    });
});

function killTabs(e) {
    var killType = e.currentTarget.getAttribute('data-kill');
    var queryInfo = {};

    switch ( killType ) {
        case 'audible':
            queryInfo.audible = true;
            break;
        default:
            break;
    }

    if ( !Object.keys(queryInfo).length ) {
        return;
    }

    chrome.tabs.query(queryInfo, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.remove(tab.id);
        });
    });
}

function sortTabs(e) {
    var sortType = e.currentTarget.getAttribute('data-sort');
   
    chrome.tabs.query({}, function(tabs) {
        tabs = tabs.sort(function(lhs, rhs) {
            var lhsDomain = document.createElement('a');
            var rhsDomain = document.createElement('a');

            lhsDomain.href = lhs.url;
            rhsDomain.href = rhs.url;

            var lhsHost = lhsDomain.hostname.replace(/^www\./, '');
            var rhsHost = rhsDomain.hostname.replace(/^www\./, '');

            switch ( sortType ) {
                case 'hostname':
                    return lhsHost.localeCompare(rhsHost);
                case 'title': 
                    return lhs.title.localeCompare(rhs.title);
                case 'audible':
                    return lhs.audible;
                default:
                    return 0;
            }
        });

        for ( var x = 0; x < tabs.length; ++x ) {
            chrome.tabs.move(tabs[x].id, { index : x } );
        }
    });
}