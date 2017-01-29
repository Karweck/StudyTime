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
chrome.storage.sync.get(["extension_data"], function(items){
    var data = items.extension_data;
    for(var i=0;i<data.blacklist.length;i++){
        $(".blacklist-box").append("<div class='col-xs-4'>"+data.blacklist[i]+"<i style='float:right' class='fa fa-times' aria-hidden='true'></i></div>");
    }
    
});
