setInterval(function(){
    chrome.storage.sync.get(["extension_data"], function(items){
    var data = items.extension_data;
        //alert(JSON.stringify(items));
        if(data.isBlocked == true){
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
});
},3000);

function updateStorage(obj){
    chrome.storage.sync.get(["extension_data"], function(items){
        var data = items.extension_data;
        Object.keys(obj).forEach(function (key) {
           data[key] = obj[key]; 
        });
        chrome.storage.sync.set({'extension_data': data});
    });
    
}


