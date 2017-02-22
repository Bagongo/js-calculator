window.onload = function(){

	var opChain = [];
	var tempEntry = "";
	var maxDigits = 35;

	var entryDisplay = document.getElementById("display").children[0];
	var opDisplay = document.getElementById("display").children[1];

	var numbers = document.getElementsByClassName("number");
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
			tempEntry += this.value;
			printToDisplays();
			digitCheck();
			setParticleProperties("number", this.value);
		}
	}

	function operatorPressed()
	{		
		evaluateEntry(true);

		if(isNumber(opChain[opChain.length-1]))
		{
			tempEntry = this.value;
			printToDisplays();
			setParticleProperties("operator", this.value);
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
		if(this.value === "ac" || opChain.length < 1)
		{
			animateCalculator("hard-shake");
			opChain = [];
			clearDisplays();
		}
		else
		{
			animateCalculator("soft-shake");
			entryDisplay.innerHTML = "";
			opDisplay.innerHTML = opChain.join("");
		}

		tempEntry = "";
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
				properties = {html: value, color:"green", left:"0%", animation:"animate-input"};
				break;
			case "operator":
				properties = {html: value, color:"purple", left:"0%", animation:"animate-input"};
				break;
			case "result":
				properties = {html: value, color:"blue", top:"8%", left:"50%", animation:"animate-output"};
				break;
			case "eject":
				var anim = Math.random() > 0.5 ? "eject-input-l" : "eject-input-r";
				var dur = Math.random() * (800 - 500) + 500 + "ms";
				properties = {html: value, color:"gray", left:"50%", animation: anim, duration: dur};
				break;
			default:
				return;
		}

		createParticle(properties);
	}

	function createParticle(properties)
	{
		var particle = document.createElement("div");
		particle.innerHTML = properties.html;
		particle.addEventListener("webkitAnimationEnd", removeParticle);
		particle.addEventListener("animationend", removeParticle);
		particle.addEventListener("oanimationend", removeParticle);
		document.getElementById("ext-field").appendChild(particle);
		particle.style.color = properties.color;
		particle.style.left = properties.left;
		particle.style.top = properties.top || Math.random() * (95 - 5) + 5 + "%";
		particle.classList.add("particle", properties.animation);
		particle.style.animationDuration = properties.duration || particle.style.animationDuration ;
		particle.style.webkitTransitionDuration = properties.duration || particle.style.webkitTransitionDuration;
	}

	function removeParticle()
	{
		this.parentNode.removeChild(this);
	}

	function animateCalculator(type)
	{
		var calculator = document.getElementById("calc-body");
		calculator.addEventListener("webkitAnimationEnd", removeCalculatorAnimation);
		calculator.addEventListener("animationend", removeCalculatorAnimation);
		calculator.addEventListener("oanimationend", removeCalculatorAnimation);
		calculator.classList.add(type);

		var toEject = type === "soft-shake" ? tempEntry : opChain.join("") + tempEntry;
		for(var i=0; i < toEject.length; i++)
			setParticleProperties("eject", toEject[i]);
	}

	function removeCalculatorAnimation()
	{
		if(this.classList.contains("soft-shake"))
			this.classList.remove("soft-shake");

		if(this.classList.contains("hard-shake"))
			this.classList.remove("hard-shake");
	}

};