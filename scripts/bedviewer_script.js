console.log(`Running bedviewer_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} bedviewer_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "login" : login(message.username, message.password); break;
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from bedviewer_script, received message:\n${JSON.stringify(message)}}`);
});

async function login(username, password){

    try{
        let un = await element_ready('[id="txtusername"]');
        un.value = username;
        let pw = await element_ready('[name="password"][type="password"]');
        pw.value = password;
        pw.dispatchEvent(new Event("input"));
        let login_btn = await element_ready('[class="login-btn"][type="submit"]');
        login_btn.click();
    }catch(e){
        console.log(e)
    }

}

async function search(patient_mrn){

    console.log(`@ ${datetime()} bedviewer_script tried search(), but there is no system search`);
    
}