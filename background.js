var blacklist = ["conrad","amazon","youtube"];
var whitelist = ["youtube.com"];
setInterval(function(){
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var forbidden = false;
        for(var i=0;i<blacklist.length;i++){
            if(url.search(blacklist[i]) != -1){
                forbidden = true;
            }
        }
        for(var i=0;i<whitelist.length;i++){
            if(url.search(whitelist[i]) != -1){
                forbidden = false;
            }
        }
        if(forbidden){
            chrome.tabs.update(tabs[0].id, {url: "quit/quit.html"});
        }
    });  
},1000);

