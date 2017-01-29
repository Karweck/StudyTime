var Citations = 
["Ich sage dir nicht, dass es leicht wird. Ich sage dir, dass es sich lohnen wird.",
"Ich k\u00e4mpfte mich sozusagen durch den Dschungel, um Dschungelk\u00f6nig zu werden.",
"Und wie l\u00e4ufts mit lernen? Bin jetzt bei Staffel 8.",
"Es gibt kein 'Ich kann das nicht', h\u00f6chstens, 'ich kann das noch nicht'."];

var index = Math.floor(Math.random()*4);
var citation = Citations[index];
$("#citation").html(citation);

$("#stop-quit").click(function(){
    updateStorage({status:0,time:0,isBlocked:false});
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        chrome.tabs.update(tabs[0].id, {url: "http://google.de"});
    });
});
function updateStorage(obj){
    chrome.storage.sync.get(["extension_data"], function(items){
        var data = items.extension_data;
        Object.keys(obj).forEach(function (key) {
           data[key] = obj[key]; 
        });
        chrome.storage.sync.set({'extension_data': data});
    });
  
}
chrome.storage.sync.get(["extension_data"], function(items){
    var data = items.extension_data;
    setInterval(function(){
      var now = new Date().getTime();
        setTimer(now-data.time,data.workTimeline);  
    },500);
    
});

function setTimer(time,timeline){
		var sec = Math.round(time/1000);
		var min = Math.floor(sec/60);
		var hour = Math.floor(min/60);
        var mins = 0;
        for(var i=0;i<timeline.length*20;i++){
            if(min<mins){
                var stat = i%timeline.length;
                break;
            } else{
                mins += timeline[i%timeline.length];
            }
        }
        if(stat%2==1){
            $("#citation").html(citation);
        } else{
            $("#citation").html("Du hast jetzt Pause!");
        }
		$(".time > #digit4").html(zeropad(59-sec%60,2).substr(1,1));
        $(".time > #digit3").html(zeropad(59-sec%60,2).substr(0,1));
        $(".time > #digit2").html(zeropad((mins-min-1)%60,2).substr(1,1));
        $(".time > #digit1").html(zeropad((mins-min-1)%60,2).substr(0,1));
	}
$(".settings-icon-quit").click(function(){
        var win = window.open("../options/options.html#settings", '_blank');
        win.focus();
    });
function zeropad(integer,len){
    string = integer + "";
    while(string.length < len){
        string = "0"+string;
    }
    return string;
    
}