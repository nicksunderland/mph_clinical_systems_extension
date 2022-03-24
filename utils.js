console.log("Running utils script"); 

function element_ready(selector){

  let element_promise = new Promise( (resolve, reject) => {
    let element = document.querySelector(selector);
    if(element){
      resolve(element); 
      return;
    }
    const callback = function(mutationRecords, observer){
      let element = document.querySelector(selector);
      if(element){
        resolve(element); 
        observer.disconnect();
      }
    }
    const config = {childList: true, subtree: true};
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, config);
  });

  let timeout_promise = new Promise ( (resolve, reject) => {
    let milliseconds_to_timeout = 5000;
    setTimeout(() => {
        reject(new Error(`Finding element ${selector} failed and timed out after ${milliseconds_to_timeout/1000} seconds.`));
    }, milliseconds_to_timeout);
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

  