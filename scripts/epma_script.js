console.log(`Running epma_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} epma_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from epma_script, received message:\n${JSON.stringify(message)}}`);
});

async function search(patient_mrn){

    try{
        let mrn = await element_ready('[class^="patient-search-input"]');
        mrn.value = patient_mrn;
        mrn.dispatchEvent(new Event("input")); 
        let mrn_search_btn = await element_ready('[id^="ngb-typeahead"][type="button"]');
        mrn_search_btn.click();

    }catch(e){
        console.log(e)
    }



}