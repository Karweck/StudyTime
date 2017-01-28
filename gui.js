
var colors = ["#92b745","#D9000F"];
var statuses = ["Start Studying","Stop Studying?"];
var timer;
var time = 0;
chrome.storage.sync.get(["extension_data"], function(items){
	
	
	
	chrome.storage.sync.get(["extension_data"], function(items){
	var initData = {
		status: 0,
		time: 0
	};
	if(JSON.stringify(items) == JSON.stringify({})){
		chrome.storage.sync.set({'extension_data': initData});
	}
});

	//alert(JSON.stringify(items));
	var data = items.extension_data;
	
	$("#start-stop").html(status[data.status]);
	$("#start-stop").css("background-color", colors[data.status]);
	//alert(colors[data.status]);
	$("#start-stop").click(function(){
		
			data.status = (data.status+1)%2;
			
			if(data.status == 1){
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
					setTimer(now-time);
				},1000);
			} else{
				$("#start-stop").unbind("click");
			}
			
			
			$("#start-stop").css("background-color", colors[data.status]);
			$("#start-stop").html(statuses[data.status]);
			
			
			var newData = data;
			newData.time = time;
			chrome.storage.sync.set({'extension_data': newData});
			
	});
	if(data.time != 0){
		time = data.time;
		timer = setInterval(function(){
			var now = new Date().getTime();
			setTimer(now-time);
		},500);
	} else{
		timer = 0;
	}
	function setTimer(time){
		var sec = Math.round(time/1000);
		var min = Math.floor(sec/60);
		var hour = Math.floor(min/60);
		$("#timer").html(hour+"h "+min+"min "+sec+"s");
	}
});