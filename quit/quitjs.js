var Citations = 
["Ich sage dir nicht, dass es leicht wird. Ich sage dir, dass es sich lohnen wird.",
"Ich k\u00e4mpfte mich sozusagen durch den Dschungel, um Dschungelk\u00f6nig zu werden.",
"Und wie l\u00e4ufts mit lernen? Bin jetzt bei Staffel 8.",
"Es gibt kein 'Ich kann das nicht', h\u00f6chstens, 'ich kann das noch nicht'."];

var index = Math.floor(Math.random()*4);

$("#citation").html(Citations[index]);

$("#stop-quit").click(function(){
    updateStorage({status:0,time:0,isBlocked:false});
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
