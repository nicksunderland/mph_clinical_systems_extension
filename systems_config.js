console.log("Running system_config script"); 

export const systems = {

//epro:  {name: "EPRO", 
//        url_stems:        ["..."],     <- an array of url stems that we will use to identify a particular system 
//        url_login:        "",          <- the url that points to the login page
//        url_login_ready:  "",          <- the url when the login page has fully loaded and is read to receive the login details
//        url_search:       "" OR false, <- the url of the page where the patients MRN gets entered; or FALSE, in which case we do not refresh to this page
//        url_search_ready: "" OR false, <- the url when the search page has fully loaded and is read to receive the patient MRN; if FALSE then no message is sent because this system does not have a search function
//        active:           true},       <- whether of not the system opens when "Open systems" button is clicked

epro:  {name: "EPRO", 
        url_stems:      ["https://epro.tst.nhs.uk/epro"], 
        url_login:       "https://epro.tst.nhs.uk/epro",
        url_login_ready: "https://epro.tst.nhs.uk/epro",
        url_search:       false, //doesn't need to refresh, MRN box always available
        url_search_ready:"https://epro.tst.nhs.uk/epro",
        active:           true},

epma:  {name: "EPMA", 
        url_stems:      ["https://eprportal.tst.nhs.uk", "https://sso.tst.nhs.uk"], 
        url_login:       "https://eprportal.tst.nhs.uk",
        url_login_ready: "https://sso.tst.nhs.uk/auth/realms/TST/protocol/openid-connect/auth",
        url_search:      "https://eprportal.tst.nhs.uk",
        url_search_ready:"https://eprportal.tst.nhs.uk",
        active:           true},

ebos:  {name: "eObs", 
        url_stems:      ["https://patientrack.tst.nhs.uk"], 
        url_login:       "https://patientrack.tst.nhs.uk",
        url_login_ready: "https://patientrack.tst.nhs.uk/ptauth/login",
        url_search:      "https://patientrack.tst.nhs.uk/ui/#views",
        url_search_ready:"https://patientrack.tst.nhs.uk/ui/#views",
        active:           true},

ordercomms:{name: "ORDERCOMMS", 
        url_stems:      ["https://ordercomms.tst.nhs.uk"], 
        url_login:       "https://ordercomms.tst.nhs.uk/Review/login.aspx",
        url_login_ready:  false, 
        url_search:       false, 
        url_search_ready: false, 
        active:           true}, 

pacs:  {name: "PACS", 
        url_stems:      ["https://rbapacs.tst.nhs.uk"], 
        url_login:       "https://rbapacs.tst.nhs.uk/portal",
        url_login_ready: "https://rbapacs.tst.nhs.uk/portal/WebLogin",
        url_search:       false,
        url_search_ready:"https://rbapacs.tst.nhs.uk/portal/WebLogin",
        active:           true},

medcon:{name: "MEDCON", 
        url_stems:      ["https://mph-medconweb.tst.nhs.uk"], 
        url_login:       "https://mph-medconweb.tst.nhs.uk/webclient",
        url_login_ready: "https://mph-medconweb.tst.nhs.uk/IdentityServer/Account/Login",
        url_search:       false,
        url_search_ready: "https://mph-medconweb.tst.nhs.uk/MCD/index#/proceduresListNav/proceduresList",
        active:           false},

maxims:{name: "MAXIMS", 
        url_stems:      ["https://epr.tst.nhs.uk/MAXIMS_PROD"], 
        url_login:       "https://epr.tst.nhs.uk/MAXIMS_PROD/ideagz.html",
        url_login_ready:  false,
        url_search:       false, 
        url_search_ready: false, 
        active:           false}, 

bedviewer:{name: "BedViewer", 
        url_stems:      ["https://eprmobile.tst.nhs.uk"], 
        url_login:       "https://eprmobile.tst.nhs.uk/www",
        url_login_ready: "https://eprmobile.tst.nhs.uk/www/#/login", 
        url_search:       false, 
        url_search_ready: false, 
        active:           false}, 

sider:  {name: "Sider", 
        url_stems:      ["https://pyrusapps.blackpear.com"], 
        url_login:       "https://pyrusapps.blackpear.com/home",
        url_login_ready: "https://pyrusapps.blackpear.com/home", 
        url_search:       false, 
        url_search_ready: false, 
        active:           false}
};

export function get_systems(){
  return new Promise(function(resolve, reject){

        chrome.storage.local.get("systems", function (result) {
                if(result.systems === undefined){ // this happens when the user first runs/installs the extension
                  chrome.storage.local.set({"systems": systems}); //Set local storage
                  resolve(Object.values(systems)) //Return the original systems data from the systems_data.js file
                }else{
                  resolve(Object.values(result.systems)); // Return the result we got from local storage
                }
        });
        
  });
}


export function datetime(){
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
    