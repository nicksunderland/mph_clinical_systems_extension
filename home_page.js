let ordercomms_btn = document.getElementById("ordercomms_btn");
let epma_btn       = document.getElementById("epma_btn");
let epro_btn       = document.getElementById("epro_btn");
let eobs_btn       = document.getElementById("eobs_btn");
let pacs_btn       = document.getElementById("pacs_btn");
let medcon_btn     = document.getElementById("medcon_btn");
let maxims_btn     = document.getElementById("maxims_btn");
let emis_btn       = document.getElementById("emis_btn");
let bhi_btn        = document.getElementById("bhi_btn");
let sider_btn      = document.getElementById("sider_btn");
let bedviewer_btn  = document.getElementById("bedviewer_btn");
let open_all_btn   = document.getElementById("open_all_btn");

ordercomms_btn.addEventListener("click", open_order_comms);
epma_btn.addEventListener("click", open_EPMA);
epro_btn.addEventListener("click", open_epro);
eobs_btn.addEventListener("click", open_Obs);
pacs_btn.addEventListener("click", open_pacs);
medcon_btn.addEventListener("click", open_medcon);
maxims_btn.addEventListener("click", open_maxims);
emis_btn.addEventListener("click", open_emis);
bhi_btn.addEventListener("click", open_bhi_remote);
sider_btn.addEventListener("click", open_sider);
bedviewer_btn.addEventListener("click", open_bedviewer);
open_all_btn.addEventListener("click", open_all);


function open_order_comms(){
    chrome.tabs.create({url: "https://ordercomms.tst.nhs.uk/Review/login.aspx"});
}

function open_EPMA(){
    chrome.tabs.create({url: "https://eprportal.tst.nhs.uk/"});
}

function open_epro(){
    chrome.tabs.create({url: "https://epro.tst.nhs.uk/epro"});
}

function open_Obs(){
    chrome.tabs.create({url: "https://patientrack.tst.nhs.uk"});
}

function open_pacs(){
    chrome.tabs.create({url: "https://rbapacs.tst.nhs.uk/Portal/Login.aspx?ReturnUrl=/Portal"});
}

function open_medcon(){
    chrome.tabs.create({url: "https://mph-medconweb.tst.nhs.uk/webclient"});
}

function open_maxims(){
    chrome.tabs.create({url: "https://epr.tst.nhs.uk/MAXIMS_PROD/ideagz.html"});
}

function open_emis(){
    chrome.tabs.create({url: "sds6:6ca21804-2941-44b6-9d80-82da914c5b86"});
}

function open_bhi_remote(){
    chrome.tabs.create({url: "https://uhbpulse.uhbristol.nhs.uk/dana-na/auth/url_GKZ9fq9r1kA9wJ0m/welcome.cgi"});
}

function open_sider(){
    chrome.tabs.create({url: "https://pyrusapps.blackpear.com/home/"});
}

function open_bedviewer(){
    chrome.tabs.create({url: "https://eprmobile.tst.nhs.uk/www/#/login"});
}

function open_all(){	
    open_order_comms();
    open_EPMA();
    open_epro();
    open_Obs();
    open_pacs();
    open_medcon();
    open_sider();
    open_bedviewer();
}