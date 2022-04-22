import {get_systems} from './systems_config.js';

create_html_objects_for_systems();

async function create_html_objects_for_systems(){
  
  let systems = await get_systems();
  let save_btn = document.getElementById("save_btn");
  
  for(var i=0; i<systems.length; i++){

    //Checkbox
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "checkbox_" + systems[i].name.replace(/\s/g, "_").toLowerCase());
    checkbox.addEventListener('change', save);
    checkbox.checked = systems[i].active;

    //Label
    var label = document.createElement("label");
    label.setAttribute("for", "checkbox_" + systems[i].name.replace(/\s/g, "_").toLowerCase());
    label.innerHTML = systems[i].name;
    
    //Line breaks
    var linebreak1 = document.createElement("br");
    var linebreak2 = document.createElement("br");

    //Add to document
    document.body.insertBefore(label, save_btn);
    document.body.insertBefore(checkbox, save_btn);
    document.body.insertBefore(linebreak1, save_btn);
    document.body.insertBefore(linebreak2, save_btn);
  }
}

//Save the tabs to open
async function save(){
  
  let systems = await get_systems();

  for(var i=0; i<systems.length; i++){
    let checkbox_id = "checkbox_" + systems[i].name.replace(/\s/g, "_").toLowerCase();
    let checkbox = document.getElementById(checkbox_id);
    systems[i].active = checkbox.checked;
  }

  chrome.storage.local.set({"systems": systems}); //Set local storage


  window.close()
}


