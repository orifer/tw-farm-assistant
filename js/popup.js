var currentVillage = [];
var villages = [];
var abandonedCounter = 0;
var attackNum = 0;

/**
 *
 * Sends message to content script
 * @param message Message to be sent
 *
 */
function sendMessage(type, data, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {type: type, data: data}, callback);
	});
};

function renderStatus(statusText) {
	document.getElementById('status').textContent = statusText;
}

function restore_options(callback) {
	chrome.storage.sync.get({
		villagesArray: [],
		unitsArray: []
	}, callback);
}

function addVillage(village, units){
	var table=document.getElementById('villagesTable');
	var tableLength = table.rows.length;
	var newRow = table.insertRow(tableLength);
	newRow.align = "center";
	if(village.isAbandoned){
		newRow.className = 'abandonedVillage'; // class to change css if the village is abandoned
	}

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell0 = newRow.insertCell(0);
	var cell1 = newRow.insertCell(1);
	var cell2 = newRow.insertCell(2);
	var cell3 = newRow.insertCell(3);
	var cell4 = newRow.insertCell(4);

	// Add village name
	cell0.innerHTML = village.name;

	// Add village coordinates to the first cell
	cell1.innerHTML = "(" + village.coords[0] + "|" + village.coords[1] + ")";
	cell1.className = "villagePadding";
	cell2.innerHTML = village.dist;

	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.checked = village.isAbandoned ? true : false;
	checkbox.addEventListener('click', function(){
		village.isAbandoned = !village.isAbandoned;
		updateVillage(village);
		$(this).closest('tr').toggleClass("abandonedVillage");
	}, false);
	cell3.appendChild(checkbox);

	var  modelsButtons = getUnitsButton(village.coords[0], village.coords[1], units);
	$.each(modelsButtons, function( i, val ) {
		cell4.append(val);
	});
}

function getUnitsButton(coord1, coord2, units){
	var charsArray = "ABCDEFGHIJKLMOPQRSTUVWXYZ".split("");
	var buttons = [];
	$.each(units, function( i, val ) {
		var unitButton = document.createElement("BUTTON");
		unitButton.innerHTML = charsArray[i];
		unitButton.className = "btn model-btn";
		unitButton.addEventListener('click', function(){ addAttackToQueue(coord1, coord2, val) }, false);
		buttons.push(unitButton);
	});
	return buttons;
}

function getUnitsMassiveButton(units){
	var charsArray = "ABCDEFGHIJKLMOPQRSTUVWXYZ".split("");
	var buttons = [];
	$.each(units, function( i, val ) {
		var unitButton = document.createElement("BUTTON");
		unitButton.innerHTML = charsArray[i];
		unitButton.className = "btn model-btn";
		unitButton.addEventListener('click', function(){ massiveAttack(val)}, false);
		buttons.push(unitButton);
	});
	return buttons;
}

function massiveAttack(unitTemplate){
	var attacks = [];
	$.each(villages, function (i, val) {
		if (val.isAbandoned) {
			var attack = [[val.coords[0],val.coords[1]],unitTemplate];
			attacks.push(attack);
		}
	});

	chrome.storage.sync.set({ attackNum: 0 });

	window.setInterval(function(){
		chrome.storage.sync.get({
			attackNum: attackNum
		}, function(items) {
			$("#autoattackInfo").text("Sending attack to village " + items.attackNum + " of " + attacks.length);
		});
	}, 500);

	$("#autoattackPanel").removeClass("hide");
	addAttackListToQueue(attacks);
}

function addAttackListToQueue(attacks){
	chrome.storage.sync.get({
		attacksQueue: []
	}, function(items) {
		var attacksQueue = items.attacksQueue;
		$.each(attacks, function (i, val) {
			attacksQueue.push(val);
		});
		chrome.storage.sync.set({
			attacksQueue: attacksQueue
		}, function() {
			// console.log("Attack in queue");
		});
	});
}

function addAttackToQueue(coord1, coord2, val){
	var attack = [[coord1,coord2],val];

	chrome.storage.sync.get({
		attacksQueue: []
	}, function(items) {
		var attacksQueue = items.attacksQueue;
		attacksQueue.push(attack);
		chrome.storage.sync.set({
			attacksQueue: attacksQueue
		}, function() {
			// console.log("Attack in queue");
		});
	});
}

function clearAttackQueue(){
	chrome.storage.sync.set({ stopAttack: true });
	// window.clearTimeout();
}

document.addEventListener('DOMContentLoaded', function() {
	// add click listener to options button (redirect to options page)
	document.getElementById("options_link").addEventListener("click", function(){chrome.tabs.create({'url': "/html/options.html"}); });
	document.getElementById("autoattackBtn").addEventListener("click", function(){clearAttackQueue()});

	//gets current village
	sendMessage('getCurrentVillage', null, function (response){
		currentVillage = response;
		console.log(currentVillage);
		if(typeof currentVillage === 'undefined'){
			$('#currentVillage').text('Please go to Tribalwars tab.');
		} else {
			$('#currentVillage').text(currentVillage.name + ' (' + currentVillage.coords[0] + '|' + currentVillage.coords[1] + ')');

			// after receiving currentVillage get stored villages and units models and displays them
			restore_options(function (items) {
				var orderedVillages = items.villagesArray;
				// console.log(orderedVillages);

				// add distance to the current village parameter
				$.each(orderedVillages, function (i, val) {
					val['dist'] = distanceBetweenVillages(val.coords, currentVillage.coords);
				});

				// sort by distance
				orderedVillages.sort(function (a, b) {
					return a['dist'] - b['dist']
				});

				// add villages to the table and display in popup
				$.each(orderedVillages, function (i, village) {
					addVillage(village, items.unitsArray);
					if (village.isAbandoned) abandonedCounter++;
				});

				// add massive attack buttons
				villages = orderedVillages;
				var modelsButtons = getUnitsMassiveButton(items.unitsArray);
				$.each(modelsButtons, function( i, btn ) {
					document.getElementById('massive').appendChild(btn);
				});

			});
		}
	});

});
