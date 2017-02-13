var data;
var initData = {
	status: 0,
	time: 0,
    timer: {h:"00",m:"00",s:"00"},
    workTimeline: {name:"Pomodoro Timer",description:"",timeline:[25,5,25,15]},
    isWorkTime: false,
    isBlocked: false,
    blacklist: ["minecraft","Spielaffe","1001Spiele","web.whatsapp","Facebook","Twitter","Amazon","Instagram","Netflix","Sport1","Apple","9gag","Wdr","Gamestar","Skype","Samsung","Prosieben","Pearl","Jetztspielen","Sat1","Nike","Pc-magazin","Parship","Youtube","Conrad"],
    whitelist: [],
    timelines: [
            {name:"Pomodoro Timer",description:"",timeline:[25,5,25,15]},
            {name:"Power Hour",description:"",timeline:[60,20,60,20]},
            {name:"Schule",description:"",timeline:[45,5,45,15]}
        ],
    pageURL: "",
    visitedDomains: {}
};
//Data aus Storage laden oder Storage initialisieren
chrome.storage.sync.get(["extension_data"], function(items){
    if(JSON.stringify(items) == JSON.stringify({})){
        chrome.storage.sync.set({'extension_data': initData},function(){
            data = initData;
        });
    }
    data = items.extension_data;
});
//Mainloop
setInterval(function(){
    var changes = {};
    if(data.status == 1){
        changes.timer = setTimer(data);
    } else {
        changes.timer = {h:"00",m:"00",s:"00"};
    }
    
    //Index der aktuellen Zeit in der WorkTimeline
    var zyklus = getZyklus(data);
    
    //Festlegen was freigeschaltet sein soll
    if(zyklus%2==1){
        changes.isWorkTime = false;
        changes.isBlocked = false;
    } else{
        changes.isWorkTime = true;
        changes.isBlocked = true;
    }
    
    //alert(JSON.stringify(data));
    //Events beim Wechsel zwischen Arbeit und Freizeit
    if(zyklus%2==1 && data.isWorkTime==true){
        playSound("dong.mp3");
    }
    if(zyklus%2==0 && data.isWorkTime==false){
        playSound("dong.mp3");
    }
    if(data.isBlocked == true && data.status == 1){
        redirect(data);
    }
    
    //Website Statistik fortsetzen
    
    //URL des aktiven Tabs für den nächsten Zyklus bereitstellen
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        data.pageURL = tabs[0].url;
    });
    logPage(data);
    updateData(changes);
    
    //Updateintervall
},200);
//Domain-Statistik dauerhaft speichern
setInterval(function(){
    var changes = {visitedDomains:data.visitedDomains};
    updateStorage(changes);
},30000);

//Alle Funktionen:
function logPage(data){
    var domains = Object.keys(data.visitedDomains);
    var url = data.pageURL;
    
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    if(domain == ""){
        domain = "NaN";
    }
    var check = false;
    for(var i=0;i<domains.length;i++){
        if(domains[i] == domain){
            check = true;
        }
    }
    if(check){
        data.visitedDomains[domain].ticks++; 
    } else{
        data.visitedDomains[domain] = {ticks:1};
    }
}
function redirect(data){
    var url = data.pageURL;
    var forbidden = false;
    var blacklist = data.blacklist;
    var whitelist = data.whitelist;
    for(var i=0;i<blacklist.length;i++){
        if(url.search(blacklist[i].toLowerCase()) != -1){
            forbidden = true;
        }
    }
    for(var i=0;i<whitelist.length;i++){
        if(url.search(whitelist[i].toLowerCase()) != -1){
            forbidden = false;
        }
    }
    if(forbidden){
        chrome.tabs.update(tabs[0].id, {url: "quit/quit.html"});
    }
}
function updateStorage(obj,callback){
    chrome.storage.sync.get(["extension_data"], function(items){
        var data = items.extension_data;
        Object.keys(obj).forEach(function (key) {
           data[key] = obj[key]; 
        });
        chrome.storage.sync.set({'extension_data': data});
    });
}
function updateData(obj){
    Object.keys(obj).forEach(function (key) {
        data[key] = obj[key]; 
    });
}
function getZyklus(data){
    var workTimeline = data.workTimeline.timeline;
    var now = new Date().getTime();
    var sec = Math.floor((now-data.time)/1000);
    var min = Math.floor(sec/60);
    var mins = 0;
    for(var i=0;i<workTimeline.length*20;i++){
        if(min<mins){
            var stat = i%workTimeline.length;
            break;
        } else{
            mins += workTimeline[i%workTimeline.length];
        }
    }
    return stat-1;
}

function setTimer(data){
    var workTimeline = data.workTimeline.timeline;
    var now = new Date().getTime();
    var sec = Math.floor((now-data.time)/1000);
    var min = Math.floor(sec/60);
    var mins = 0;
    for(var i=0;i<workTimeline.length*20;i++){
        if(min<mins){
            var stat = i%workTimeline.length;
            break;
        } else{
            mins += workTimeline[i%workTimeline.length];
        }
    }
    var hours = zeropad(Math.floor((mins-min)/60),2);
    var minutes = zeropad(Math.floor((mins-min-1)%60),2);
    var seconds = zeropad(Math.floor((59-sec%60)),2);
    return {h:hours,m:minutes,s:seconds};
}
function zeropad(integer,len){
    string = integer + "";
    while(string.length < len){
        string = "0"+string;
    }
    return string;
}
function playSound(url){
    var myAudio = new Audio();
    myAudio.src = url;
    myAudio.play()
}

