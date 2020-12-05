$( document ).ready(function() {

	var checked = false;
	var table = document.getElementById("plunder_list");

	// Checkbox injection
	// $("#plunder_list tbody tr:nth-child(1) th:nth-child(9)").append('<a id="autoButton" href=# class="farm_icon farm_icon_a"></a>');
	$("#plunder_list tbody tr:nth-child(1) th:nth-child(9)").append('<input type="checkbox" id="autoCheck" value="second_checkbox"> <label for="autoCheck">Auto</label>');

	// Listener
	$("#autoCheck").click(function () {
		checked = !checked;
	});

	// var A_Button = $("#plunder_list tbody tr:nth-child(3) td:nth-child(9) a");
	// A_Button.click();

	var clickeableButton = $(".farm_icon");
	clickeableButton.click(function () {
		console.log("cheko");
		if (checked) {
			table.deleteRow(2);
		}
	});

});
