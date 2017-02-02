//Make Backgrounddata available to all EventListeners
var background = chrome.extension.getBackgroundPage();
var data = background.data;

var colors = ["#92b745","#D9000F"];
var statuses = ["Start Studying","Stop Studying?"];
var headers = ["Pause!","Arbeitszeit!","STATUS"];

setInterval(function(){
    $("#start-stop").html(statuses[data.status]);
    $("#start-stop").css("background-color", colors[data.status]);
    $("#start-stop").attr("name",data.status);

    if(data.status == 1){
        $("#modus").html(headers[data.isWorkTime ? 1 : 0]);
    } else{
        $("#modus").html(headers[2]);
    }
    $("#modus").html();
    if(data.status == 1){
        timer = data.timer;
        $("#timer").html(timer.h+"h "+timer.m+"m "+timer.s+"s");
    } else{
        $("#timer").html("TIMER");
    }
},500);

$("#close").click(function(){
	window.close();
});
$("#start-stop").click(function(){
    var changes = {};
    if($(this).attr("name")=="0"){
        changes.status = 1;
        changes.time = new Date().getTime();
    } else{
        var win = window.open("quit/quit.html", '_blank');
        win.focus();
    }
    updateData(changes);
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
function updateData(obj){
    Object.keys(obj).forEach(function (key) {
        data[key] = obj[key]; 
    });
}