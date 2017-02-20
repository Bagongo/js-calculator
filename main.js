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
		tempEntry = "";

		if(this.dataset.key === "ac" || opChain.length < 1)
		{
			opChain = [];
			clearDisplays();
			animateCalculator("hard-shake");
		}
		else
		{
			entryDisplay.innerHTML = "";
			opDisplay.innerHTML = opChain.join("");
			animateCalculator("soft-shake");
		}
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

		var type = isNumber(tempEntry) ? "number" : "operator";

		if(tempEntry !== "")
		{
			opChain.push(tempEntry);
			setParticleProperties(type, tempEntry);
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

	function clearDisplays()
	{
		entryDisplay.innerHTML = opDisplay.innerHTML = "0";
	}

	function digitCheck()
	{
		if(opDisplay.innerHTML.toString().length > maxDigits)
		{
			clearDisplays();
			opDisplay.innerHTML = "digit limit exceeded";
			opChain = [];
			tempEntry = "";
		}
		else
			return true;
	}

	function makeCalculation()
	{
		evaluateEntry(true);

		if(opChain.length > 2)
		{
			var result = opChain[0];

			for(var i=1; i < opChain.length; i+=2)
				result = makeBinaryOperation(result, opChain[i+1], opChain[i]);

			formatAndDisplayResult(result);
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

	function formatAndDisplayResult(result)
	{
		if(!isNumber(opChain[opChain.length - 1]))
			opChain[opChain.length - 1] = "=";
		else
			opChain.push("=");

		tempEntry = result;
		printToDisplays();

		if(digitCheck())
		{
			setParticleProperties("result", result);
			opChain = [];
			tempEntry = "";
		}				
	}


////////////////////////////////// ANIMATION SYSTEM ///////////////////////////////////////////

	
	function setParticleProperties(type, value)
	{
		var properties = {};

		switch(type) 
		{
			case "number":
				properties = {color:"green", left:"0%", animation:"animate-input"};
				break;
			case "operator":
				properties = {color:"purple", left:"0%", animation:"animate-input"};
				break;
			case "result":
				properties = {color:"blue", top:"10%", left:"50%", animation:"animate-output"};
				break;
			default:
				return;
		}

		createParticle(properties, value);
	}

	function createParticle(properties, value)
	{
		var particle = document.createElement("div");
		particle.innerHTML = value;
		particle.addEventListener("webkitAnimationEnd", removeParticle);
		particle.addEventListener("animationend", removeParticle);
		particle.addEventListener("oanimationend", removeParticle);
		document.getElementById("ext-field").appendChild(particle);
		particle.style.color = properties.color;
		particle.style.left = properties.left;
		particle.style.top = properties.top || Math.random() * 100 + "%";
		particle.classList.add("particle", properties.animation);
	}

	function removeParticle()
	{
		this.parentNode.removeChild(this);
	}

	function animateCalculator(animationClass)
	{
		var calculator = document.getElementById("calc-body");
		calculator.addEventListener("webkitAnimationEnd", removeCalculatorAnimation);
		calculator.addEventListener("animationend", removeCalculatorAnimation);
		calculator.addEventListener("oanimationend", removeCalculatorAnimation);
		calculator.classList.add(animationClass);
	}

	function removeCalculatorAnimation()
	{
		if(this.classList.contains("soft-shake"))
			this.classList.remove("soft-shake");

		if(this.classList.contains("hard-shake"))
			this.classList.remove("hard-shake");
	}

};