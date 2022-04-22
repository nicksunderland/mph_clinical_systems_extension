import {get_systems, datetime} from './systems_config.js';

let open_systems_btn = document.getElementById("open_systems_btn");
let update_btn       = document.getElementById("update_btn");
let mrn_textbox      = document.getElementById("patient_mrn");

open_systems_btn.addEventListener("click", open_systems);
update_btn.addEventListener("click", search);

mrn_textbox.addEventListener("keyup", function(event) {
event.preventDefault();
if (event.key === 'Enter') {
  update_btn.click();
}
});

function search(){
  console.log(`--> Search()`);

  // Get the patient MRN textbox
  var search_textbox = document.getElementById("patient_mrn");
  
  // First copy the MRN to the clipboard for use with systems that do not work with the extension
  navigator.clipboard.writeText("RBA" + search_textbox.value).then(function() {
    console.log(`successfully copied RBA + '${search_textbox.value}' to the clipboard`);
  }, function() {
    console.log(`failed to copy RBA + '${search_textbox.value}' to the clipboard`);
  });

 /** Create a message containing:
  * @param {object} message
  *   @param {string} type either "login" or "search"
  *   @param {string} username the username
  *   @param {string} password the password
  *   @param {string} patient_mrn the patient medical records number
  * The tab content scripts then have methods to deal with the data and insert it into the
  * system's page
  **/
  var _patient_mrn = search_textbox.value;
  let message      = {type: "search",
                      username: undefined,
                      password: undefined,
                      patient_mrn: _patient_mrn};

  // Send the message to teh background (and other non-content script areas)
  // use runtime, whereas we use tabs to send to content sacripts
  chrome.runtime.sendMessage(message, function(response){ // use runtime to send to background (and other non-content script areas); use tabs to send to content sacript
    console.log(`@ ${datetime()} popup received message response: ${response}`);
  });

  console.log(`<-- Search()`);
}


async function open_systems(){

  // Get the current open tabs and the systems information from system_config.js (via get_systems)
  let [tabs, systems] = await Promise.all([chrome.tabs.query({}), get_systems()]);

  // Cycle the tabs and check whether our landing page exists
  let landing_page_exists = false;
  for(var i=0; i<tabs.length; i++) // for each tab
  { 
    // If it exists, make sure it is the first tab
    if(tabs[i].url.toLowerCase().endsWith("home_page.html")){
      chrome.tabs.move(tabs[i].id, {index: 0});
      landing_page_exists = true;
      break;
    }
  }
  // If it doesn't exist, create the landing page as the first tab
  if(!landing_page_exists){
    console.log(`Going to create the landing page`);
    chrome.tabs.create({url: chrome.runtime.getURL("home_page.html"), 
                        index: 0});
  }

  // Cycle again through the tabs and test to see if the URL matches one of our systems
  // If a match is found, update that tab with the login page for that system
  for(var j=0; j<systems.length; j++) // for each system
  {
    let system_exists = false; // track whether we've found it
    for(var k=0; k<systems[j].url_stems.length; k++) // for each possible URL stem (some systems change there URL after loading)
    {
      for(var i=0; i<tabs.length; i++) // for each tab
      { 
          // Test if the tab URL starts with one of our system URL stems
          if(tabs[i].url.toLowerCase().startsWith(systems[j].url_stems[k].toLowerCase())){
            // If the tab url matches the system's, update the tab to the login page
            chrome.tabs.update(tabs[i].id, {url: systems[j].url_login});
            system_exists = true;
          }
      }// for each URL stem 
    }// for each system
    // If the system has not been found in any of the tabs, and it is active, then create a new tab
    if(!system_exists && systems[j].active){
      chrome.tabs.create({url: systems[j].url_login})
    }
  }// for each tab
}



