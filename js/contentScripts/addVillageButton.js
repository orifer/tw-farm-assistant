$( document ).ready(function() {

	// get village coords
	var coords = $("#content_value table tbody tr table:first-child tbody tr:nth-child(3) td:last-child").text();
	coords = [parseInt(coords.substr(0, 3)), parseInt(coords.substr(4, 3))]; //parse to array
	// get village coords
	var isAbandoned = $("#content_value table tbody tr table:first-child tbody tr:nth-child(5) td:last-child").is(":empty");

	villageIsAlreadyStored(coords, function(villageIsAlreadyStored) {
		if (!villageIsAlreadyStored) {

			// inject button
			$("#content_value table tbody tr table:last-child tbody").append('<tr>' +
				'<td colspan="2" id="injectedTd">' +
				'<a id="addVillageButton" href=#><span class="action-icon-container">' +
				'<span class="icon header favorite_add"></span></span> Add to farm assistant' +
				'</a>' +
				'<input type="text" id="nameInput" placeholder="Name">' +
				'</td>' +
				'</tr>');

			$("#nameInput").val($("#content_value table tbody tr table:first-child tbody tr:nth-child(5) td:last-child").text());

			// add listener
			$("#addVillageButton").click(function () {
				var newVillage = {
					isAbandoned: isAbandoned,
					name: $("#nameInput").val(),
					coords: coords
				};

				saveVillage(newVillage, function () {
					$('#injectedTd').remove()
				});
			});

		// villageIsAlreadyStored
		} else {
			// Remove village from list
			// inject button
			$("#content_value table tbody tr table:last-child tbody").append('<tr>' +
				'<td colspan="2" id="injectedTd1">' +
				'<a id="removeVillageButton" href=#><span class="action-icon-container">' +
				'<span class="icon header favorite_remove"></span></span> Delete from farm assistant' +
				'</a>' +
				'</td>' +
				'</tr>');

			// add listener
			$("#removeVillageButton").click(function () {
				var village = {
					isAbandoned: isAbandoned,
					coords: coords
				};

				removeVillage(village, function () {
					$('#injectedTd1').remove()
				});
			});


			// Mark village as abandoned
			// inject button
			$("#content_value table tbody tr table:last-child tbody").append('<tr>' +
				'<td colspan="2" id="injectedTd1">' +
				'<span class="action-icon-container">' +
				'<span class="icon header village"></span></span> Mark village as ' +
				'<a id="activeVillageButton" href=#>active</a>' +
				' or ' +
				'<a id="abandonedVillageButton" href=#>abandoned</a>' +
				'</td>' +
				'</tr>');

			// add listener
			$("#activeVillageButton").click(function () {
				var village = { isAbandoned: false, coords: coords };
				updateVillage(village, function () {});
			});
			$("#abandonedVillageButton").click(function () {
				var village = {	isAbandoned: true, coords: coords };
				updateVillage(village, function () {});
			});
		}
	});
});
