var Tutorial = {
	currentStepIndex: 0,
	currentTutorial: "None",
	setTutorial: function(tutorial){
		Tutorial.currentTutorial=window[tutorial];
		Tutorial.currentStepIndex = 0;
		Tutorial.numFailedAttempts = 0;
		Tutorial.changeText(Tutorial.currentTutorial.steps[Tutorial.currentStepIndex].text);
	},

	changeText: function(message){
	    var step_message = "<p> Step: " + (Tutorial.currentStepIndex + 1) + "/" + Tutorial.currentTutorial.steps.length + "</p>";
		document.getElementById('tutorialDialog').getElementsByClassName("Caption")[0].innerHTML=step_message + message;
		document.getElementById('tutorialDialog').style.width= "415px";
	},

	changePosition: function(top, left){
		var div=document.getElementById("tutorialDialog");
		div.style.left=left+"px";
		div.style.top=top+"px";
	},

	changeImage: function(img_src){
		var e=document.getElementById("Tutorial_frame");
		e.src=img_src;
	},

	/**Use to switch between steps **/
	nextStep: function(formName){
		var nextStepErrorMsg = document.getElementById("nextStepErrorMsg");
		if (Tutorial.currentStepIndex !== Tutorial.currentTutorial.steps.length-1){
			var currentStep = Tutorial.currentTutorial.steps[Tutorial.currentStepIndex];
			if (!currentStep.validate || currentStep.validate(formName)) {
			    Tutorial.numFailedAttempts = 0;
				document.getElementById("backButton").style.visibility = 'visible';
				nextStepErrorMsg.style.display = 'none';

				Tutorial.currentStepIndex += 1;
				var newStep = Tutorial.currentTutorial.steps[Tutorial.currentStepIndex]
				Tutorial.changeText(newStep.text);
				Tutorial.changePosition(newStep.top, newStep.left);
				//Tutorial.changeImage(Tutorial.currentTutorial.steps[Tutorial.currentStepIndex].url);
				if (Tutorial.currentStepIndex === Tutorial.currentTutorial.steps.length - 1) {
					//hide Next button if on last step
					document.getElementById("nextButton").style.visibility = 'hidden';
				}
				if (newStep.hintNeeded(formName)){
				    document.getElementById("hintButton").style.visibility = 'visible';
				    document.getElementById("hintButton").style.display = 'inline-block';
				}
				else {
				    document.getElementById("hintButton").style.visibility = 'hidden';
				    document.getElementById("hintButton").style.display = 'none';
				}
			} else {
				//there is a next step, but the user has not finished this step yet.
				nextStepErrorMsg.style.display = 'block';
				if (Tutorial.numFailedAttempts > 0){
				    nextStepErrorMsg.style.color = 'white';
				    setTimeout(function(){
				            nextStepErrorMsg.style.color = 'darkred';
                        }, 200);
				}
				Tutorial.numFailedAttempts += 1;
			}
		}
	},

	/**Use to implement the hint at steps **/
    hintStep: function(formName){
        //var nextStepErrorMsg = document.getElementById("nextStepErrorMsg");
        var currentStep = Tutorial.currentTutorial.steps[Tutorial.currentStepIndex];
        currentStep.hint(formName);
    },

    /**Use to return to the previous step **/
	backStep: function(formName){
		if (Tutorial.currentStepIndex!=0){
			Tutorial.currentStepIndex=Tutorial.currentStepIndex-1;
			var newStep = Tutorial.currentTutorial.steps[Tutorial.currentStepIndex]
			Tutorial.changeText(newStep.text);
			Tutorial.changePosition(newStep.top, newStep.left);
			document.getElementById("nextButton").style.visibility = 'visible';
			document.getElementById("nextStepErrorMsg").style.display = 'none';
			if (Tutorial.currentStepIndex == 0) {
				document.getElementById("backButton").style.visibility = 'hidden';
				document.getElementById("hintButton").style.visibility = 'hidden';
			}
			if (newStep.hintNeeded(formName)){
                document.getElementById("hintButton").style.visibility = 'visible';
            }
            else {
                document.getElementById("hintButton").style.visibility = 'hidden';
            }
		}
	},

	testForComponent: function(component_name){
		var componentsArrayList=BlocklyPanel_GetComponentNames();
		var components = componentsArrayList.array;
		for (var i=0; i<components.length; i++){
			if (components[i]==component_name){
				return true;
			}
		}
		return false;
	},

	testForBlock: function(formName, validatingFunction) {
		return Tutorial.testForBlocks(formName, validatingFunction, 1);
	},

	testForBlocks: function(formName, validatingFunction, times) {
		var blocklies = Blocklies[formName];
		var count = 0;
		if (blocklies != null){
			var allBlocks = blocklies.mainWorkspace.getAllBlocks();
			for (var j = 0; j < allBlocks.length; j++) {
				if (allBlocks[j] != null &&
					validatingFunction(allBlocks[j])) {
					count++;
					if (count >= times) {
						return true;
					}
				}
			}
		}
		return false;
	},

	returnBlock: function(formName, validatingFunction){
	    var blocklies = Blocklies[formName];
        var count = 0;
        if (blocklies != null){
            var allBlocks = blocklies.mainWorkspace.getAllBlocks();
            for (var j = 0; j < allBlocks.length; j++) {
                if (allBlocks[j] != null &&
                    validatingFunction(allBlocks[j])) {
                    return allBlocks[j];
                }
            }
        }
	},

	getTutorialMetaData: function() {
		var tutorialFileNames = Object.keys(window).filter(function(key) {
			return key.startsWith("Tutorial_");
		});
		return tutorialFileNames.map(function(fileName) {
			return {
				fileName: fileName,
				title: window[fileName].title,
				difficulty: window[fileName].difficulty
			};
		});
	},

	highlight: function(className, num) {
	    document.getElementsByClassName(className)[num].style.border = 'yellow 5pt solid';
	    setTimeout(function(){
            document.getElementsByClassName(className)[num].style.border = 'none';
        }, 400);
	}
};