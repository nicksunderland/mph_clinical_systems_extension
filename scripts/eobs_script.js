console.log(`Running eobs_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} eobs_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "login" : login(message.username, message.password); break;
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from eobs_script, received message:\n${JSON.stringify(message)}}`);
});

async function login(username, password){

    try{
        let un = await element_ready('[id="username"]');
        un.value = username;
        let pw = await element_ready('[id="password"]');
        pw.value = password;
        let login_submit_form = await element_ready('[name="form"]');
        login_submit_form.submit();
    }catch(e){
        console.log(e)
    }

}

async function search(patient_mrn){

    // try{
    //     const event = new KeyboardEvent("keydown",{
    //         'key': 'Escape'
    //     });
    //     document.dispatchEvent(event);
    // }catch(e){
    //     console.log(e)
    // }

    try{
        let mrn = await element_ready('[id="clearabletextbox-1141-inputEl"]');
        mrn.value = patient_mrn;
        let mrn_search_btn = await element_ready('[id="button-1146-btnIconEl"]');
        mrn_search_btn.click();
    }catch(e){
        console.log(e)
    }
    
}