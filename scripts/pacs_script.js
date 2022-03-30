console.log(`Running pacs_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} pacs_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "login" : login(message.username, message.password); break;
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from pacs_script, received message:\n${JSON.stringify(message)}}`);
});

async function login(username, password){

    try{
        let un = await element_ready('[id="loginUsernameInput"]');
        un.value = username;
        let pw = await element_ready('[id="loginPassword"]');
        pw.value = password;
        let login_submit_btn = await element_ready('[id="login-button"]');
        login_submit_btn.click();
    }catch(e){
        console.log(e)
    }

}

async function search(patient_mrn){

    // Try to get the close previous patient button, and if it does exist, click it
    try{
        let close_previous_patient_btn = await element_ready('[class="mtbCloseBtn_normal"]', false, 500); //only wait 500ms, the default is 5 seconds
        close_previous_patient_btn.click()
    }catch(e){
        console.log(e)
    }

    try{
        let mrn = await element_ready('[id="sptGeneralDetailsInput"]');
        mrn.value = "RBA" + patient_mrn;
        let mrn_search_btn = await element_ready('[id="sptSearchSubmitBtn"]');
        mrn_search_btn.click();
    }catch(e){
        console.log(e)
    }


}