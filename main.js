window.onload = function(){

	var globalState = {};
	var opChain = [];
	var numbers = document.getElementsByClassName("num");
	for(var i=0; i < numbers.length; i++)
		numbers[i].addEventListener("click", numPressed);

	var operators = document.getElementsByClassName("operator");
	for(var j=0; j < operators.length; j++)
		operators[j].addEventListener("click", operatorPressed);

	var clearers = document.getElementsByClassName("clearer");
	for(var k=0; k < clearers.length; k++)
		clearers[k].addEventListener("click", clearerPressed);

	var display = document.getElementById("display");

	function numPressed()
	{
		display.innerHTML = display.innerHTML.toString() + this.dataset.key.toString();
	}

	function operatorPressed()
	{
		display.innerHTML = this.dataset.key;
	}

	function clearerPressed()
	{
		globalState.storedVal = null;
		display.innerHTML = "";
	}

	function calculate()
	{
		var result;

		if(globalState.opInitiated === "+")
			result = display.innerHTML + globalState.storedVal;
		else if(globalState.opInitiated === "-")
			result = display.innerHTML - globalState.storedVal;
		else if(globalState.opInitiated === "x")
			result = display.innerHTML * globalState.storedVal;
		else if(globalState.opInitiated === "/")
			result = display.innerHTML / globalState.storedVal;

		display.innerHTML = result;
	}

};