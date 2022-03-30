console.log("Running utils script"); 

function element_ready(selector, selector_all = false, timeout_ms = 5000){

  let element_promise = new Promise( (resolve, reject) => {

    if(selector_all){

      let node_list = document.querySelectorAll(selector);
      if(node_list){
        console.log(`Found list of elements immediately with: querySelectorAll(${selector})`)
        resolve(node_list);
        return;
      }
      const callback = function(mutationRecords, observer){
        let node_list = document.querySelectorAll(selector);
        if(node_list){
          console.log(`Found list of elements after mutationObserver with: querySelectorAll(${selector})`)
          resolve(node_list); 
          observer.disconnect();
        }
      }
      const config = {childList: true, subtree: true};
      const observer = new MutationObserver(callback);
      observer.observe(document.documentElement, config);
      
    }else{

      let element = document.querySelector(selector);
      if(element){
        console.log(`Found element immediately with: querySelector(${selector})`)
        resolve(element); 
        return;
      }
      const callback = function(mutationRecords, observer){
        let element = document.querySelector(selector);
        if(element){
          console.log(`Found element after mutationObserver with: querySelector(${selector})`)
          resolve(element); 
          observer.disconnect();
        }
      }
      const config = {childList: true, subtree: true};
      const observer = new MutationObserver(callback);
      observer.observe(document.documentElement, config);
    }


  });

  let timeout_promise = new Promise ( (resolve, reject) => {
    setTimeout(() => {
      if(selector_all){
        reject(new Error(`Failed to find list of elements after ${timeout_ms/1000} seconds, with querySelectorAll(${selector})`));
      }else{
        reject(new Error(`Failed to find element after ${timeout_ms/1000} seconds, with querySelector(${selector})`));
      }
    }, timeout_ms);
  });

  return Promise.race([element_promise, timeout_promise]);
}

function datetime(){
    var d = new Date();
    var h = addZero(d.getHours(), 2);
    var m = addZero(d.getMinutes(), 2);
    var s = addZero(d.getSeconds(), 2);
    var ms = addZero(d.getMilliseconds(), 3);
    var fullDate = h + ":" + m + ":" + s + ":" + ms;
    return(fullDate);
}
function addZero(x, n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
  }

  