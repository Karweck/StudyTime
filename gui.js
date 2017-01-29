
var colors = ["#92b745","#D9000F"];
var statuses = ["Start Studying","Stop Studying?"];
var timer;
var time = 0;
chrome.storage.sync.get(["extension_data"], function(items){
	chrome.storage.sync.get(["extension_data"], function(items){
	var initData = {
		status: 0,
		time: 0,
        workTimeline: [1,1,1,1],
        isBlocked: false
	};
	if(JSON.stringify(items) == JSON.stringify({})){
		chrome.storage.sync.set({'extension_data': initData});
	}
});

	//alert(JSON.stringify(items));
	var data = items.extension_data;
	
	$("#start-stop").html(statuses[data.status]);
	$("#start-stop").css("background-color", colors[data.status]);
	//alert(colors[data.status]);
	$("#start-stop").click(function(){
		
			
			
			if(data.status == 0){
                data.status = 1;
				//show timer
				if(data.time == 0){
					time = new Date().getTime();
				} else{
					time = data.time;
				}
				$("#start-stop").click(function(){
					var win = window.open("quit/quit.html", '_blank');
					win.focus();
				});
				timer = setInterval(function(){
					var now = new Date().getTime();
					setTimer(now-time,data.workTimeline);
				},1000);
			}
			
			
			$("#start-stop").css("background-color", colors[data.status]);
			$("#start-stop").html(statuses[data.status]);
			
			
			updateStorage({time:time,status:data.status});
			
	});
	if(data.time != 0 && data.status == 0){
		time = data.time;
		timer = setInterval(function(){
			var now = new Date().getTime();
			setTimer(now-time,data.workTimeline);
		},500);
	} else{
		timer = 0;
	}
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
            $("#modus").html("Arbeitszeit!");
            $("#timer").css("color","red");
            updateStorage({isBlocked:true});
        } else{
            $("#modus").html("Pause!");
            updateStorage({isBlocked:false});
            $("#timer").css("color","green");
        }
		$("#timer").html(Math.floor((mins-min)/60)+"h "+(mins-min-1)%60+"min "+(59-sec%60)+"s");
	}
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