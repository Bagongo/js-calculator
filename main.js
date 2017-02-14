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

	document.getElementById("equal").addEventListener("click", makeCalculation);

	function numPressed()
	{
		evaluateAndStoreEntry(false);

		if(!isNumber(opChain[opChain.length-1]))
		{
			tempEntry += this.dataset.key;
			printToDisplays();
		}
	}

	function operatorPressed()
	{		
		evaluateAndStoreEntry(true);

		if(isNumber(opChain[opChain.length-1]))
		{
			tempEntry = this.dataset.key;
			printToDisplays();
		}
	}

	function clearerPressed()
	{
		if(this.dataset.key === "ac" || opChain.length < 1)
		{
			opChain = [];
			clearDisplay(opDisplay);						
		}
		
		tempEntry = "";
		clearDisplay(entryDisplay);
		opDisplay.innerHTML = opChain.join("");
	}

	function evaluateAndStoreEntry(mustbeNum)
	{
		if(mustbeNum === isNumber(tempEntry))		
		{
			if(tempEntry !== "")
				opChain.push(tempEntry);

			tempEntry = "";
		}
	}

	function isNumber(value)
	{
		return (value !== "" && value !== null && !isNaN(value));
	}

	function printToDisplays()
	{
		entryDisplay.innerHTML = tempEntry;
		opDisplay.innerHTML = opChain.join("") + tempEntry;
	}

	function clearDisplay(display)
	{
		display.innerHTML = "";
	}

	function makeCalculation()
	{
		evaluateAndStoreEntry(true);

		if(opChain.length > 2)
		{
			var result = parseFloat(opChain[0]);

			for(var i=1; i < opChain.length; i+=2)
			{
				if(opChain.length - 1 < i+1)
					break;

				var secondTerm = parseFloat(opChain[i+1]);

				switch(opChain[i]) 
				{
					case "+" :
						result += secondTerm;	
						break;
					case "-" :
						result -= secondTerm;	
						break;
					case "x" :
						result *= secondTerm;
						break;
					case "/" :
						result /= secondTerm;
						break;
					default :
					console.log("error while calculating.");
				}
			}

			displayResult(result);
		}
	}

	function displayResult(result)
	{
		if(!isNumber(opChain[opChain.length - 1]))
			opChain[opChain.length - 1] = "=";
		else
			opChain.push("=");

		tempEntry = result;
		printToDisplays();
		opChain = [];
		tempEntry = "";
	}

};