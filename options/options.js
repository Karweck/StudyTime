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
