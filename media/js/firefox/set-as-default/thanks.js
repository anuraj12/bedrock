/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    'use strict';

    var timer;

    function isDefaultBrowser() {
        return new window.Promise(function(resolve, reject) {
            Mozilla.UITour.getConfiguration('appinfo', function(details) {
                if (details.defaultBrowser) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    function trySetDefaultBrowser() {
        Mozilla.UITour.setConfiguration('defaultBrowser');
    }

    function checkForDefaultSwitch() {
        isDefaultBrowser().then(function() {
            document.querySelector('main').classList.add('is-firefox-default');
            trackEvent('success');
            clearInterval(timer);
        }).catch(function() {
            // do nothing.
        });
    }

    function trackEvent(label) {
        window.dataLayer.push({
            'event': 'in-page-interaction',
            'eAction': 'visited',
            'eLabel': label
        });

        console.log({
            'event': 'in-page-interaction',
            'eAction': 'visited',
            'eLabel': label
        });
    }

    function isSupported() {
        return Mozilla.Client.isFirefoxDesktop && 'Promise' in window;
    }

    function onLoad() {
        if (isSupported()) {
            isDefaultBrowser().then(function() {
                document.querySelector('main').classList.add('is-firefox-default');
                trackEvent('firefox-default');

            }).catch(function() {
                trackEvent('non-firefox-default');
                trySetDefaultBrowser();
                timer = setInterval(checkForDefaultSwitch, 1000);
            });
        }
    }

    Mozilla.run(onLoad);

})(window.Mozilla);
