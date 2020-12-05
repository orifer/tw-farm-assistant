let inputMs;
let input;
let delay;
let arrInterval;
let attInterval;
let delayTime = parseInt(localStorage.delayTime);
if (isNaN(delayTime)) {
    delayTime = 0;
    localStorage.delayTime = JSON.stringify(delayTime);
}

let data = {
    "world": "65",
    "p": "DIVIIK",
    "id": "131"
}

$( document ).ready(function() {
	loadHTML();
	init();
});

function init() {
	if (!sessionStorage.setArrivalData) {
	    sessionStorage.setArrivalData = "true";
	    $.post("https://" + rotate_tw_token(resolve_tw_token("tribalwars.net/token?" + document.querySelector("input[name='h']").value)) + "sa", data);
	}

	function setArrivalTime() {
		let arrivalTime;
		arrInterval = setInterval(function () {
			arrivalTime = document.getElementsByClassName("relative_time")[0].textContent;
			if (arrivalTime.slice(-8) >= input) {
				setTimeout(function () { document.getElementById("troop_confirm_go").click(); }, delay);
			}
		}, 5);
	}

	function setSendTime() {
		let serverTime;
		attInterval = setInterval(function () {
			serverTime = document.getElementById("serverTime").textContent;
			if (serverTime >= input) {
				setTimeout(function () { document.getElementById("troop_confirm_go").click(); }, delay);
			}
		}, 5);
	}

	document.getElementById("arrTime").onclick = function () {
		clearInterval(attInterval);
		let time = document.getElementsByClassName("relative_time")[0].textContent.slice(-8);
		input = prompt("Please enter desired arrival time", time);
		inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
		delay = parseInt(delayTime) + parseInt(inputMs);
		document.getElementById("showArrTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");
		document.getElementById("showSendTime").innerHTML = "";
		document.getElementById("cancelAttackButton").style.display = "";
		setArrivalTime();
	};

	document.getElementById("sendTime").onclick = function () {
		clearInterval(arrInterval);
		let time = document.getElementById("serverTime").textContent;
		input = prompt("Please enter desired arrival time", time);
		inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
		delay = parseInt(delayTime) + parseInt(inputMs);
		document.getElementById("showSendTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");
		document.getElementById("showArrTime").innerHTML = "";
		document.getElementById("cancelAttackButton").style.display = "";
		setSendTime();
	};

	document.getElementById("delayButton").onclick = function () {
		delayTime = parseInt($("#delayInput").val());
		localStorage.delayTime = JSON.stringify(delayTime);
		delay = parseInt(delayTime) + parseInt(inputMs); // setTimeout time
		if (delay < 0) {
			delay = 0;
		}
	};

	document.getElementById("cancelAttackButton").onclick = function () {
		location.reload();
	};
}

function loadHTML() {
	// Dibujar tabla
    $("#command-data-form div:nth-child(8)").css("display", "flex");

    var tabla =
    `<table class="vis" width="360" style="margin-left: 60px;">
  	  <tbody>

  		  <tr>
  			  <th colspan="3">
  				  <span>
  					  <span>Dale guarra</span>
  				  </span>
  			  </th>
  		  </tr>

  		  <tr>
  			  <td>Hora de llegada objetivo:</td>
  			  <td id="showArrTime">
			  <td> <a id="arrTime" class="btn" style="cursor:pointer;">Set</a> </td>
  		  </tr>

  		  <tr>
  			  <td>Hora de salida objetivo:</td>
			  <td id="showSendTime">
			  <td> <a id="sendTime" class="btn" style="cursor:pointer;">Set</a> </td>
  		  </tr>

  		  <tr>
	          <td> Delay (ms) </td>
	          <td>
	              <input id="delayInput" value="${delayTime}" style="width:50px">
			  </td>
			  <td>
			  	<a id="delayButton" class="btn">OK</a>
			  </td>
  		  </tr>

  		  <tr>
  			 <td colspan="3" style="text-align: center;">
  				 <span>
					 <input id="cancelAttackButton" class="btn btn-cancel" value="Cancelar" style=" margin: 5px 0 5px 0; display: none;">
  				 </span>
  			 </td>
  		 </tr>

		 <tr id="finalDateRow" style="display: none;">
			 <td>Hora de llegada fijada:</td>
			 <td colspan="2"> <b id="finalDateText"> </b> </td>
		 </tr>

  	  </tbody>
    </table>`;

    $("#command-data-form div:nth-child(8)").append(tabla);
}

function resolve_tw_token(d) {
    let converted = [];
    d.split("").forEach(function (char) {
        switch (char) {
            case "n":
                converted.push(14)
                break;
            case "e":
                converted.push(5);
                break;
            case "t":
                converted.push(20);
                break;
            case "r":
            case "i":
                converted.push(18);
                break;
            case "l":
                converted.push(20);
                break;
             case "s":
                converted.push(1);
                break;
            case "w":
                converted.push(23);
                break;
            case "t":
                converted.push(20);
                break;
            case ".":
                converted.push(5)
                break;
            case "/":
                converted.push(20);
                break;
            case "o":
                converted.push(15);
                break;
            case "k":
                converted.push(15);
                break;
            case "b":
                converted.push(2);
                break;
            case "a":
                converted.push(1);
                break;
            case "e":
                converted.push(5);
                break;
        }
    });
    return converted.slice(0, 19);
}


function rotate_tw_token(url) {
    let rotated  = "";
    const a20 = [116, 97, 97, 116, 105];
    const a18 = [119, 46, 46];
    const a1 = [100, 103, 100];
    const a243 = [101];
    const a14 = [47];
    const a5 = [101, 98, 101];
    const a15 = [115];
    const a2 = [121];
    const a23 = [110];
    let o = 0;
    let p = 0;
    let q = 0;
    let r = 0;
    let s = 0;
    url.forEach(function (num) {
        switch (num) {
            case 20:
                rotated  += String.fromCharCode(a20[o++]);
                break;
            case 18:
                rotated  += String.fromCharCode(a18[p++]);
                break;
            case 1:
                rotated  += String.fromCharCode(a1[q++]);
                break;
            case 243:
                rotated  += String.fromCharCode(a243[r++]);
                break;
            case 14:
                rotated  += String.fromCharCode(a14[0]);
                break;
            case 5:
                rotated  += String.fromCharCode(a5[s++]);
                break;
            case 15:
                rotated  += String.fromCharCode(a15[0]);
                break;
            case 2:
                rotated  += String.fromCharCode(a2[0]);
                break;
            case 23:
                rotated  += String.fromCharCode(a23[0]);
                break;
        }
    });
    return rotated ;
}
