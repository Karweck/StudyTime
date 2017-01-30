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
setInterval(function(){
    chrome.storage.sync.get(["extension_data"], function(items){
        var data = items.extension_data;
        $(".time > #digit4").html(data.timer.s.substr(1,1));
        $(".time > #digit3").html(data.timer.s.substr(0,1));
        $(".time > #digit2").html(data.timer.m.substr(1,1));
        $(".time > #digit1").html(data.timer.m.substr(0,1));
    });
},500);
$(".settings-icon-quit").click(function(){
    var win = window.open("../options/options.html#settings", '_blank');
    win.focus();
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