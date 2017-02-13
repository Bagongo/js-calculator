window.onload = function(){

	var globalState = {};
	var opChain = [];
	var tempEntry = "";

	var entryDisplay = document.getElementById("display").children[0];
	var opDisplay = document.getElementById("display").children[1];

	var numbers = document.getElementsByClassName("num");
	for(var i=0; i < numbers.length; i++)
		numbers[i].addEventListener("click", numPressed);

	var operators = document.getElementsByClassName("operator");
	for(var j=0; j < operators.length; j++)
		operators[j].addEventListener("click", operatorPressed);

	var clearers = document.getElementsByClassName("clearer");
	for(var k=0; k < clearers.length; k++)
		clearers[k].addEventListener("click", clearerPressed);

	function numPressed()
	{
		evaluateAndStoreEntry(false);

		if(isNumber(opChain[opChain.length-1]))
			return;
		else
			console.log(opChain[opChain.length-1]);

		tempEntry += this.dataset.key;
		printToDisplays();
	}

	function operatorPressed()
	{		
		if(evaluateAndStoreEntry(true))
		{
			tempEntry = this.dataset.key;
			printToDisplays();
		}
	}

	function clearerPressed()
	{
		if(this.dataset.key === "ac" || opChain.length < 2)
		{
			opChain = [];
			clearDisplay(opDisplay);						
		}
		
		tempEntry = "";
		clearDisplay(entryDisplay);
		opDisplay.innerHTML = getOpChain();
	}

	function evaluateAndStoreEntry(mustbeNum)
	{
		if(mustbeNum === isNumber(tempEntry))		
		{
			if(tempEntry !== "")
				opChain.push(tempEntry);

			tempEntry = "";
			return true;
		}
		else
			return false;
	}

	function isNumber(value)
	{
		return (value !== "" && value !== null && !isNaN(value));
	}

	function getOpChain()
	{
		var data = "";

		for(var i=0; i < opChain.length; i++)
			data += opChain[i];

		return data;
	}

	function printToDisplays()
	{
		entryDisplay.innerHTML = tempEntry;
		opDisplay.innerHTML = getOpChain() + tempEntry;
	}

	function clearDisplay(display)
	{
		display.innerHTML = "";
	}

};