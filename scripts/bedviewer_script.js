console.log(`Running bedviewer_script @ ${datetime()}`); 

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        console.log(`@ ${datetime()} bedviewer_script attempting ${message.type} with message:\n${JSON.stringify(message)} `);
        switch(message.type){
            case "search": search(message.patient_mrn); break;
        }
        sendResponse(`hello from bedviewer_script, received message:\n${JSON.stringify(message)}}`);
});

async function search(patient_mrn){

    console.log(`@ ${datetime()} bedviewer_script tried search(), but there is no system search`);
    
}