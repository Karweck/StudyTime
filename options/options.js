//Make Backgrounddata available
var background = chrome.extension.getBackgroundPage();
var data = background.data;

$(".menu > div").click(function(){
    var id = $(this).attr("id");
    $(".tab").hide();
    $("#"+id+"-tab").show();
	$(".menu > div").removeClass("active");
	$(this).addClass("active");
});

if(location.hash != ""){
    $(".tab").hide();
    $("#"+location.hash.replace("#","")+"-tab").show();
	$("#"+location.hash.replace("#","")).addClass("active");
} else{
	$("#settings-tab").show();
	$("#settings").addClass("active");
}
//!Reihenfolge beachten: zuerst Elemente generieren, dann Clickevent
showBlacklist();
showWhitelist();
function showBlacklist(){
    $(".blacklist-box").html("");
    for(var i=0;i<data.blacklist.length;i++){
        $(".blacklist-box").append("<div class='col-md-3 col-xs-6 col-lg-2'><div class='blacklist-element'>"+data.blacklist[i]+"<i  class='fa fa-times' aria-hidden='true'></i></div></div>");
    }
    $(".blacklist-element > i").click(function(){
        if(!confirm("Willst du diesen Filtereintrag wirklich loeschen?")){
            return;
        }
        var filtertext = $(this).parent().html();
        var blacklist = data.blacklist.filter(function(val){
            return filtertext.search(val) == -1;
        });
        var changes = {blacklist:blacklist};
        updateStorage(changes);
        updateData(changes);
        showBlacklist();
    });
    $(".blacklist-box").append("<div class='col-md-3 col-xs-6 col-lg-2'><div class=''><input id='blacklist-input' type='text'></input><i class='fa blacklist-add fa-check' aria-hidden='true'></i></div></div>");
    $(".blacklist-add").click(function(){
        var filtertext = $("#blacklist-input").val(); 
        var blacklist = data.blacklist;
        blacklist.push(filtertext);
        var changes = {blacklist: blacklist};
        updateStorage(changes);
        updateData(changes);
        showBlacklist();
    });
}

function showWhitelist(){
    $(".whitelist-box").html("");
    for(var i=0;i<data.whitelist.length;i++){
        $(".whitelist-box").append("<div class='col-md-3 col-xs-6 col-lg-2'><div class='whitelist-element'>"+data.whitelist[i]+"<i class='fa fa-times' aria-hidden='true'></i></div></div>");
    }
    $(".whitelist-element > i").click(function(){
        if(!confirm("Willst du diesen Filtereintrag wirklich loeschen?")){
            return;
        }
        var filtertext = $(this).parent().html();
        var whitelist = data.whitelist.filter(function(val){
            return filtertext.search(val) == -1;
        });
        var changes = {whitelist:whitelist};
        updateStorage(changes);
        updateData(changes);
        showWhitelist();
    });
    $(".whitelist-box").append("<div class='col-md-3 col-xs-6 col-lg-2'><div class=''><input id='whitelist-input' type='text'></input><i class='fa whitelist-add fa-check' aria-hidden='true'></i></div></div>");
    $(".whitelist-add").click(function(){
        var filtertext = $("#whitelist-input").val();
        var whitelist = data.whitelist;
        whitelist.push(filtertext);
        var changes = {whitelist: whitelist};
        updateStorage(changes);
        updateData(changes);
        showWhitelist();
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