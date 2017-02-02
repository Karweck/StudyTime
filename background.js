var data;
var initData = {
	status: 0,
	time: 0,
    timer: {h:"00",m:"00",s:"00"},
    workTimeline: [25,5,25,15],
    isWorkTime: false,
    isBlocked: false,
    blacklist: ["minecraft","Spielaffe","1001Spiele","web.whatsapp","Facebook","Twitter","Amazon","Instagram","Netflix","Sport1","Apple","9gag","Wdr","Gamestar","Skype","Samsung","Prosieben","Pearl","Jetztspielen","Sat1","Nike","Pc-magazin","Parship","Youtube","Conrad"],
    whitelist: []
};

chrome.storage.sync.get(["extension_data"], function(items){
    if(JSON.stringify(items) == JSON.stringify({})){
        chrome.storage.sync.set({'extension_data': initData},function(){
            data = initData;
        });
    }
    data = items.extension_data;
});
//MainLoop
setInterval(function(){
    var changes = {};
    if(data.status == 1){
        changes.timer = setTimer(data);
    } else {
        changes.timer = {h:"00",m:"00",s:"00"};
    }
    
    //index in der WorkTimeline
    var zyklus = getZyklus(data);
    if(zyklus%2==1){
        changes.isWorkTime = false;
        changes.isBlocked = false;
    } else{
        changes.isWorkTime = true;
        changes.isBlocked = true;
    }
    //alert(JSON.stringify(data));
    if(zyklus%2==1 && data.isWorkTime==true){
        alert("Pause!");
    }
    if(zyklus%2==0 && data.isWorkTime==false){
        alert("Auf an die Arbeit!");
    }
    if(data.isBlocked == true && data.status == 1){
        redirect(data);
    }
    updateData(changes);
},100);
//Functions
function redirect(data){
     chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
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
    });  
}
function updateStorage(obj){
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
    var now = new Date().getTime();
    var sec = Math.floor((now-data.time)/1000);
    var min = Math.floor(sec/60);
    var mins = 0;
    for(var i=0;i<data.workTimeline.length*20;i++){
        if(min<mins){
            var stat = i%data.workTimeline.length;
            break;
        } else{
            mins += data.workTimeline[i%data.workTimeline.length];
        }
    }
    return stat-1;
}

function setTimer(data){
    var now = new Date().getTime();
    var sec = Math.floor((now-data.time)/1000);
    var min = Math.floor(sec/60);
    var mins = 0;
    for(var i=0;i<data.workTimeline.length*20;i++){
        if(min<mins){
            var stat = i%data.workTimeline.length;
            break;
        } else{
            mins += data.workTimeline[i%data.workTimeline.length];
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

