console.log(`Running epro_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} epro_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "login" : login(message.username, message.password); break;
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from epro_script, received message:\n${JSON.stringify(message)}}`);
});

async function login(username, password){

    try{
        let un = await element_ready('[id="txtUsername"]');
        un.value = username;
        let pw = await element_ready('[id="txtPassword"]');
        pw.value = password;
        let login_submit_btn = await element_ready('[id="btnLogon"]');
        login_submit_btn.click();
    }catch(e){
        console.log(e)
    }

}

async function search(patient_mrn){

    try{
        // Get the textbox element
        let mrn = await element_ready('[id="txtToolbarSearch"]');
        
        // Use the standard .value method to set the value to our MRN
        mrn.value = patient_mrn;

        // Then we need to inject a script that utilises the webpages javascript functions
        // To allow this we need to declare it as a web_accessible_resource in the manifest file
        // Create a script element
        var s = document.createElement('script');

        // Set the code to that in our file (must be in a file for MV3)
        s.src = chrome.runtime.getURL('scripts/epro_inject_to_web.js');

        /* epro_inject_to_web.js looks like this
            // Pick up the value, that we just set, on the web page side
            var mrn = document.querySelector('[id="txtToolbarSearch"]').value;
            
            // Use it to fire the EPRO's doLiveSearch()
            document.querySelector('[id="txtToolbarSearch"]').doLiveSearch(mrn);
        */

        // Remove once file
        s.onload = function() {
            this.remove();
        };

        // Add the script to the web page and run
        (document.head || document.documentElement).appendChild(s);

    }catch(e){
        console.log(e)
    }



}