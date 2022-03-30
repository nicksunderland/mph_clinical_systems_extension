console.log(`Running ordercomms_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} ordercomms_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "login" : login(message.username, message.password); break;
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from ordercomms_script, received message:\n${JSON.stringify(message)}}`);
});

async function login(username, password){

    try{
        let un = await element_ready('[id="login_user"]');
        un.value = username;
        let pw = await element_ready('[id="login_password"]');
        pw.value = password;
        // let login_submit_btn = await element_ready('[id="login_changeuser"]');
        // login_submit_btn.click();
    }catch(e){
        console.log(e)
    }

}

async function search(patient_mrn){

    try{
        let un = await element_ready('[id="search_value"]');
        un.value = "RBA" + patient_mrn;

        // let mrn_search_btn      = await element_ready('[name="find"]');
        // mrn_search_btn.click();

    }catch(e){
        console.log(e)
    }



}