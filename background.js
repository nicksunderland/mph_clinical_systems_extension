import {get_systems, datetime} from './systems_config.js';

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} background script received message to start process: "${message.type}"`);
        refresh_and_message_tabs(message);
        sendResponse(`"background finished "${message.type}" process @ ${datetime()}"`);
    }
);

async function refresh_and_message_tabs(message){
    console.log(`@ ${datetime()} background entered refresh_and_message_tabs( "${message.type}" )`);

    // Get the current open tabs
    let tabs    = await chrome.tabs.query({});

    // Get the systems information from systems_config.js
    let systems = await get_systems();

    // Cycle through the tabs and test to see if the URL matches one of our systems
    // If a match is found, send the message to that tab
    for(var i=0; i<tabs.length; i++) // for each tab
    { 
        for(var j=0; j<systems.length; j++) // for each system
        {
            for(var k=0; k<systems[j].url_stems.length; k++) // for each possible URL stem (some systems change there URL after loading)
            {
                // Test is the tab URL starts with one of our system URL stems
                if(tabs[i].url.toLowerCase().startsWith(systems[j].url_stems[k].toLowerCase())){

                    console.log(`   - MATCH - tab url:     ${tabs[i].url}\n` +
                                `             system stem: ${systems[j].url_stems[k]}\n` + 
                                `             refresh url: ${systems[j].url_stems[k]}`);
                    
                    // To avoid blocking this loop with awaits, do the awaits in the context of
                    // each individual tab refresh
                    non_blocking_tab_refresh_and_message(tabs[i].id, systems[j], message);
                }

            }// for each URL stem 
        }// for each system
    }// for each tab

    console.log(`@ ${datetime()} background exiting refresh_and_message_tabs( "${message.type}" )`); 
}


async function non_blocking_tab_refresh_and_message(tab_id, system, message){

    // Extract from the message what type of action we want to take (login, or search mrn)
    // The some systems have different URLs for the login page and search page
    // Switch on the message.type and take the appropriate URL to refresh to from the system information
    let refresh_url;
    let url_stem_when_ready;
    switch(message.type){
        case "login" : refresh_url         = system.url_login;
                       url_stem_when_ready = system.url_login_ready;
                       break;
        case "search": refresh_url         = system.url_search;
                       url_stem_when_ready = system.url_search_ready;
                       break;
        default: alert("Error in refresh_and_message_tabs(), message.type parameter incorrect");
    }

    // Some systems have a single front end webpage and will always take you back to the login page
    // when you attempt to refresh ahead of searching for an MRN. 
    // In this case I have set the refresh url to FALSE in systems_config.js
    // If the refresh_url is FALSE then don't try to refresh
    let tab_updated;
    if(refresh_url && url_stem_when_ready){
        // Update the target tab with the refresh URL
        const tab = await chrome.tabs.update(tab_id, {url: refresh_url});

        // We must wait for the tab refresh to fully load before we send it a message
        // Sometimes the tab redirects to a login page with a different url, 'completing' the load of the initial page
        // Therefore we have to pass the url of the target page, and wait for that specifically
        // In case something goes wrong we time out of waiting for the tab to load (12e4ms = 2 minutes)
        await tab_update_fully_loaded(tab.id, url_stem_when_ready, 12e4);

        // We need to re-get the tab, as the URL in the 'tab' object above doesn't get updated with the refresh_url
        tab_updated = await chrome.tabs.get(tab.id);

    }else{

        // If not refreshing, then just assign the input tab id
        tab_updated = await chrome.tabs.get(tab_id);

    }

    if(url_stem_when_ready){
        // Once the tab is fully loaded, we send it a message containing:
        console.log(`   - SENDING MESSAGE TO: ${tab_updated.url}`);
        chrome.tabs.sendMessage(tab_updated.id, message, function(response){
            console.log(`@ ${datetime()} message response from ${tab_updated.url} = "${response}"`);
        });
    }else{

        console.log(`   - NOT SENDING MESSAGE TO: ${tab_updated.url}`);
    }
}


// Credit to Keith Henry for solving this bit....
// https://github.com/KeithHenry/chromeExtensionAsync
/** Create a promise that resolves when chrome.tabs.onUpdated fires with the id
     * @param {string} id ID for the tab we're expecting.
     * Tabs without the ID will not resolve or reject this promise.
     * @param {number} msTimeout Optional milliseconds to timeout when tab is loading
     * If this value is null or zero, it defaults to 120,000 ms (2 minutes).
     * @returns {Promise} Promise that resolves when chrome.tabs.onUpdated.addListener fires. */
function tab_update_fully_loaded(id, url_stem_when_ready, msTimeout) {

    let mainPromise = new Promise((resolve, reject) => {
        const tabUpdatedListener = (tabId, changeInfo, tab) => {
            // The onUpdated event is called multiple times during a single load.
            // the status of 'complete' is called only once, when it is finished.
            console.log(`   - LISTENING to: ${tab.url}, STATUS is: ${changeInfo.status}`);
            if (tabId === id && 
                tab.url.toLowerCase().startsWith(url_stem_when_ready.toLowerCase()) &&
                changeInfo.status === 'complete' && 
                tab.status === 'complete'){
                    removeListeners();
                    resolve({tabId:tabId, changeInfo:changeInfo, tab:tab});
            }
        };

        // This will happen when the tab or window is closed before it finishes loading
        const tabRemovedListener = (tabId, removeInfo) => {
            if (tabId === id) {
                removeListeners();
                reject(new Error(`The tab with id = ${tabId} was removed before it finished loading.`));
            }
        }

        // This will happen when the tab is replaced.  This is untested, not sure how to recreate it.
        const tabReplacedListener = (addedTabId, removedTabId) => {
            if (removedTabId === id) {
                removeListeners();
                reject(new Error(`The tab with id = ${removedTabId} was replaced before it finished loading.`));
            }
        }

        const removeListeners = () => {
            chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
            chrome.tabs.onRemoved.removeListener(tabRemovedListener);
            chrome.tabs.onReplaced.removeListener(tabReplacedListener);
        }

        chrome.tabs.onUpdated.addListener(tabUpdatedListener);
        chrome.tabs.onRemoved.addListener(tabRemovedListener);
        chrome.tabs.onReplaced.addListener(tabReplacedListener);
    });

    // Although I have onRemoved and onReplaced events watching to reject the promise,
    // there is nothing in the chrome extension api documentation that guarantees this will be an exhaustive approach.
    // So to account for the unknown, I am adding an auto-timeout feature to reject the promise after 2 minutes.
    let timeoutPromise = new Promise ( (resolve, reject) => {
        let millisecondsToTimeout = 12e4; // 12e4 = 2 minutes
        if (!!msTimeout && typeof msTimeout === 'number' && msTimeout > 0) {
            millisecondsToTimeout = msTimeout;
        }
        setTimeout(() => {
            reject(new Error(`The tab loading timed out after ${millisecondsToTimeout/1000} seconds.`));
        }, millisecondsToTimeout);
    });

    return Promise.race([mainPromise, timeoutPromise]);
}