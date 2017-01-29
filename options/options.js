$(".menu > div").click(function(){
    var id = $(this).attr("id");
    $(".tab").hide();
    $("#"+id+"-tab").show();
});
if(location.hash != ""){
    $(".tab").hide();
    $("#"+location.hash.replace("#","")+"-tab").show();
}
