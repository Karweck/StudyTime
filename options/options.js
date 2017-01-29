$(".menu > div").click(function(){
    var id = $(this).attr("id");
    $(".tab").hide();
    $("#"+id+"-tab").show();
});
$("#settings-tab").show();