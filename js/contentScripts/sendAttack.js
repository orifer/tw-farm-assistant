var delay, programmed, targetTime, targetTimeWithDelay;
var syncInterval, goInterval;

$( document ).ready(function() {
	load();
	init();
});

function init() {
	// Get duration
	var duration = getDuration();
	var duration_H = duration[0];
	var duration_M = duration[1];
	var duration_S = duration[2];

	// Get arrival date
	var date = getArrivalDate(duration);

	// Sync the time
	if (date)
		date = sync(date);
}

function sync(date) {
	if (date) {
		var first = getArrivalWeb();
		var second = first;

		syncInterval = setInterval(function() {
			var second = getArrivalWeb();
			if (first != second) {
				clearInterval(syncInterval);
				date.setSeconds(date.getSeconds() + 1);
				date.setMilliseconds(0);
				 $("#targetTime").val(targetTime);
				go(date);
			}
		}, 10);
	}
}

function go(date) {
	// Time live update
	var milis;
	var finalDate;

	goInterval = setInterval(function(){
		milis = date.getMilliseconds();
		finalDate = date.toLocaleTimeString() + "." + milis;
		$("#arrival_milis").text(finalDate);
		date.setMilliseconds(date.getMilliseconds() + 10);

		// console.log("Data actual: " + finalDate + " - Data objetivo: " + targetTime);

		// SEND THE ATTACK IF THE CONDITIONS ARE MET
		if (programmed && (finalDate === targetTimeWithDelay)) {
			console.log("Send it");
			$("input#troop_confirm_go").click();
		}
	}, 10);
}

function getArrivalWeb() {
	tiempo = $("#date_arrival > span");
	tiempo = (tiempo[0].innerHTML).substring(tiempo[0].innerHTML.length-8);
	return tiempo;
}

function getArrivalDate(duration) {
	var duration_H = duration[0];
	var duration_M = duration[1];
	var duration_S = duration[2];

	var date = new Date();
	date.setHours(date.getHours() + parseInt(duration_H));
	date.setMinutes(date.getMinutes() + parseInt(duration_M));
	date.setSeconds(date.getSeconds() + parseInt(duration_S));
	date.setMilliseconds(0);

	return date;
}

function getDuration() {
	var duration = $("#command-data-form div:nth-child(8) table:nth-child(1) tbody tr:nth-child(3) td:nth-child(2)")[0].innerHTML;
	duration = duration.split(':');
	return duration;
}

function load() {
	programmed = false;
	delay = 40;
	targetTime = "00:00:00";

	// Dibujar tabla
    $("#command-data-form div:nth-child(8)").css("display", "flex");

    var tabla =
    '<table class="vis" width="360" style="margin-left: 60px;">'+
  	  '<tbody>'+

  		  '<tr>'+
  			  '<th colspan="3">'+
  				  '<span>'+
  					  '<span>Dale guarra</span>'+
  				  '</span>'+
  			  '</th>'+
  		  '</tr>'+

  		  '<tr>'+
  			  '<td>Llegada:</td>'+
  			  '<td id="arrival_milis">1:34:13:462</td>'+
			  '<td> <input id="syncBtn" class="btn" value="Sync" style="width:35px"></td>'+
  		  '</tr>'+

  		  '<tr>'+
  			  '<td>Hora objetivo:</td>'+
  			  '<td colspan="2"> <input type="time" id="targetTime" step="0.1"></input> </td>'+
  		  '</tr>'+

  		  '<tr>'+
  			  '<td>Delay (ms):</td>'+
  			  '<td colspan="2"> <input type="number" id="delay" value="40" step="10"></input> </td>'+
  		  '</tr>'+

  		  '<tr>'+
  			 '<td colspan="3" style="text-align: center;">'+
  				 '<span>'+
  					 '<input id="programAttackButton" class="btn btn-attack programAttackButton" value="Programar ataque" style=" margin: 5px 0 5px 0;">'+
					 '<input id="cancelProgramAttackButton" class="btn btn-cancel programAttackButton" value="Cancel" style=" margin: 5px 0 5px 0; display: none;">'+
  				 '</span>'+
  			 '</td>'+
  		 '</tr>'+

		 '<tr id="finalDateRow" style="display: none;">'+
			 '<td>Hora de llegada fijada:</td>'+
			 '<td colspan="2"> <b id="finalDateText"> </b> </td>'+
		 '</tr>'+

  	  '</tbody>'+
    '</table>';

    $("#command-data-form div:nth-child(8)").append(tabla);

	// Listeners
	// When value change (delayInput)
	var delayInput = $("#delay");
	delayInput.change(function() {
		if (delayInput.val()[0] == '0')
			delayInput.val(0);

		delayInput.val( delayInput.val().substring(0,delayInput.val().length-1) + '0');

		delay = delayInput.val();
	});

	// When value change (targetTimeInput)
	var targetInput = $("#targetTime");
	targetInput.change(function() {
		var temp = targetInput.val();

		if (temp[0] == '0')
			temp = temp.substring(1,temp.length);

		if (temp.length == 7 || temp.length == 8)
			temp += ".000";

		if (temp.length == 11 || temp.length == 12) {
			temp = temp.substring(0,temp.length - 1);
			temp += '0';
		}

		console.log("// DEBUG: ");
		console.log(temp);

		targetTime = temp;
	});

	// When clicked (programAttackButton)
	var programAttackButton = $(".programAttackButton");
	programAttackButton.click(function() {
		console.log("Programmed: " + programmed);
		programmed = !programmed;
		if (programmed) {
			$("#programAttackButton").css("display", "none");
			$("#cancelProgramAttackButton").css("display", "");
			$("#finalDateRow").show();
		} else {
			$("#programAttackButton").css("display", "");
			$("#cancelProgramAttackButton").css("display", "none");
			$("#finalDateRow").hide();
		}
		targetInput.val( targetInput.val().substring(0,targetInput.val().length-1) + '0');
		calculateTimeWithDelay();
	});

	// When clicked (syncBtn)
	var syncBtn = $("#syncBtn");
	syncBtn.click(function() {
		clearIntervals();
		init();
	});
}

function calculateTimeWithDelay() {
	console.log(targetTime);
	console.log(delay);
	var milis = parseInt(targetTime.substring(targetTime.length-3)) + delay;
	console.log(milis);
	if (milis < 100)
		targetTimeWithDelay = targetTime.substring(0,targetTime.length-2) + milis;
	else
		targetTimeWithDelay = targetTime.substring(0,targetTime.length-3) + milis;
	console.log(targetTimeWithDelay);
	$("#finalDateText").text(targetTimeWithDelay);
}

function clearIntervals() {
	clearInterval(syncInterval);
	clearInterval(goInterval);
}
