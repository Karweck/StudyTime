var data;


//Datenbank für Browserhistory uvm.

var dbName = "StudyTimeDB";
var browserHistory = "BrowserHistory";
var workTimeHistory = "WorkTimeHistory";
var db;
var req = indexedDB.open(dbName, 11);
req.onsuccess = function (evt) {
    db = req.result;
};
req.onerror = function (evt) {
    alert(evt.target.errorCode);
};
req.onupgradeneeded = function (evt) {
    var db = evt.target.result;
    //BrowserHistory
    if (db.objectStoreNames.contains(browserHistory)) {
      db.deleteObjectStore(browserHistory);
    }
    var browserHistoryStore = db.createObjectStore(
        browserHistory, { keyPath: "date", autoIncrement: true });
    //StudyHistory
    if (db.objectStoreNames.contains(workTimeHistory)) {
      db.deleteObjectStore(workTimeHistory);
    }
    var workTimeHistoryStore = db.createObjectStore(
        workTimeHistory, { keyPath: "date", autoIncrement: true });
};

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
    page: {date:"",URL:"",domain:"",duration:0,isBlocked:false,keywords:[],URLs:[]},
    currentWorkTime: {date:"",duration:0,isWorkTime:false},
    visitedDomains: []
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
    if(zyklus%2==1 || data.status == 0){
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
    
    updateData(changes);
    //Website Statistik fortsetzen
    logWorkTime();
    //URL des aktiven Tabs für den nächsten Zyklus bereitstellen
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        data.pageURL = tabs[0].url;
        logPage(data,tabs[0].url);
        
    });
    
    
    //Updateintervall
},1000);
//Alle Funktionen:

function logPage(data,url){
    var transaction = db.transaction("BrowserHistory", "readwrite");
    var store = transaction.objectStore("BrowserHistory");
    var domain = extractDomain(url);
    var dateTime = Date.now();
    if(domain != data.page.domain || data.page.isBlocked != data.isBlocked){
        //Domainwechsel: Letzten Seitenaufenthalt in DB speichern
        if(data.page.date != ""){
            store.add(data.page);
        }
        var page = {
            date:dateTime,
            URL:url,
            URLs:[url],
            domain:domain,
            isBlocked: data.isBlocked,
            keywords:[],
            duration:0
        }
        data.page = page;
    } else{
        //Seitenaufenthaltsobjekt updaten
        if(url != data.page.URL){
            data.page.URLs.push(url);
            data.page.URL = url;
        }
        data.page.duration++;
    }
}
function logWorkTime(){
    var transaction = db.transaction("WorkTimeHistory", "readwrite");
    var store = transaction.objectStore("WorkTimeHistory");
    var dateTime = Date.now();
    if(data.currentWorkTime.isWorkTime != data.isWorkTime){
        if(data.currentWorkTime.date != ""){
            store.add(data.currentWorkTime);
        }
        var currentWorkTime = {
            date:dateTime,
            duration:0,
            isWorkTime:data.isWorkTime
        };
        data.currentWorkTime = currentWorkTime;
    } else{
        data.currentWorkTime.duration++;
    }
}
function loadBrowserHistory(lowerBoundKeyRange,callback){
    var transaction = db.transaction("BrowserHistory", "readwrite");
    var store = transaction.objectStore("BrowserHistory");
    var records = [];
    store.openCursor(lowerBoundKeyRange).onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            records.push(cursor.value);
            cursor.continue();
        } else{
            if(typeof callback === "function"){
                callback(records);
            }
        }
    };
}
function extractDomain(url){
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
    return domain;
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
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            chrome.tabs.update(tabs[0].id, {url: "quit/quit.html"});
        });
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

