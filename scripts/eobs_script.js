console.log(`Running eobs_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} eobs_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from eobs_script, received message:\n${JSON.stringify(message)}}`);
});

async function search(patient_mrn){

    try{
        let mrn = await element_ready('[id="clearabletextbox-1141-inputEl"]');
        mrn.value = patient_mrn;
        let mrn_search_btn = await element_ready('[id="button-1146-btnIconEl"]');
        mrn_search_btn.click();
    }catch(e){
        console.log(e)
    }
    
}