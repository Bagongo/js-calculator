window.onload = function(){

	var opChain = [];
	var tempEntry = "";
	var maxDigits = 35;

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

	document.getElementById("point").addEventListener("click", pointPressed);
	document.getElementById("equal").addEventListener("click", makeCalculation);

	function numPressed()
	{
		evaluateEntry(false);

		if(!isNumber(opChain[opChain.length-1]))
		{
			tempEntry += this.dataset.key;
			printToDisplays();
			digitCheck();
		}
	}

	function operatorPressed()
	{		
		evaluateEntry(true);

		if(isNumber(opChain[opChain.length-1]))
		{
			tempEntry = this.dataset.key;
			printToDisplays();
		}
	}

	function pointPressed()
	{
		if(tempEntry.indexOf(".") < 0)
		{			
			if(isNumber(tempEntry))
				tempEntry += ".";
			else
			{
				evaluateEntry(false);
				tempEntry = "0.";
			}

			printToDisplays();	
		}
	}

	function clearerPressed()
	{
		tempEntry = entryDisplay.innerHTML = "";

		if(this.dataset.key === "ac" || opChain.length < 1)
		{
			opChain = [];
			clearDisplay(opDisplay);
		}
		else
			opDisplay.innerHTML = opChain.join("");
	}

	function evaluateEntry(mustbeNum)
	{
		if(mustbeNum === isNumber(tempEntry))		
			formatAndStoreEntry();
	}

	function formatAndStoreEntry()
	{
		if(tempEntry[tempEntry.length - 1] === ".")
			tempEntry = tempEntry.slice(0, -1);

		if(isNumber(tempEntry))
			tempEntry = parseFloat(tempEntry);

		if(tempEntry !== "")
		{
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
		display.innerHTML = "0";
	}

	function digitCheck()
	{
		if(opDisplay.innerHTML.toString().length > maxDigits)
		{
			opDisplay.innerHTML = "digit limit exceeded";
			clearDisplay(entryDisplay);
			opChain = [];
			tempEntry = "";
		}
	}

	function makeCalculation()
	{
		evaluateEntry(true);

		if(opChain.length > 2)
		{
			var result = opChain[0];

			for(var i=1; i < opChain.length; i+=2)
				result = makeBinaryOperation(result, opChain[i+1], opChain[i]);

			displayResult(result);
		}
	}

	function makeBinaryOperation(firstNum, secondNum, operator)
	{
		switch(operator) 
		{
			case "+" :
				return firstNum += secondNum;	
			case "-" :
				return firstNum -= secondNum;	
			case "x" :
				return firstNum *= secondNum;	
			case "/" :
				return firstNum /= secondNum;	
			default :
				console.log("unknown operator");
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
		digitCheck();
		opChain = [];
		tempEntry = "";		
	}

};