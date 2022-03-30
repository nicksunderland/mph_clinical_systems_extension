console.log(`Running medcon_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} medcon_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "login" : login(message.username, message.password); break;
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from medcon_script, received message:\n${JSON.stringify(message)}}`);
});

async function login(username, password){

    try{
        let un = await element_ready('[id="Username"]');
        un.value = username;
        let pw = await element_ready('[id="Password"]');
        pw.value = password;
        let login_submit_btn = await element_ready('[name="button"][class="btn btn-primary loginButton"]');
        login_submit_btn.click();
    }catch(e){
        console.log(e)
    }

}

async function search(patient_mrn){

    try{
        let mrn = await element_ready('[id="PatientMedicalId_FilterInput"]');
        mrn.value = patient_mrn;
        mrn.dispatchEvent(new Event("input")); // an input event, gives focus
        mrn.dispatchEvent(new KeyboardEvent("keydown"), {bubbles: true, cancelable: true, keyCode: 13}); //says that enter key pressed
        mrn.dispatchEvent(new KeyboardEvent("keyup"), {bubbles: true, cancelable: true, keyCode: 13}); //says that enter key released

    }catch(e){
        console.log(e)
    }



}