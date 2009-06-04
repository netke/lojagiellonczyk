	dojo.require("dojo.fx");

	function init() {
		theForm = dojo.byId("contactForm");
		if(theForm) {
			email = dojo.byId("emailNode");
			errorMessageContainer = dojo.byId("errorMessageNode");
			userMessage = dojo.byId("theMessage");
			//userQuestions = dojo.byId("proposedQuestions");
			dojo.connect(theForm, "onsubmit", "validate");
			dojo.connect(userMessage, "onblur", function(){ validateInput(userMessage); });
			//dojo.connect(userQuestions, "onblur", function(){ validateInput(userQuestions); });
			dojo.connect(email, "onblur", "validateEmail");
		}
	}
	
	function validate(evt) {
		//Clear previous validate messages
		dojo.stopEvent(evt); // prevent normal action should it bubble

		//Form starts out valid. Check all inputs to make sure they are filled in
		//If they are not filled in, the isValid boolean is decremented.
		
		var isValid = 1;
		
		if(!validateEmail()) {
			isValid--;
		}
		
		if(!validateInput(userMessage)) {
			isValid--;
		}

		//if(!validateInput(userQuestions)) {
		//	isValid--;
		//}		
		
		if(isValid != 1) { isValid = 0 }
		//If it's invalid stop the event and print out the form errors
		if(!isValid) {
			return false;
		}
		
		// everything worked: move on:
		submitForm();
		return false;
	}
	
	function validateInput(node) {
		if(node.value.length < 1) {
			setInputWarning(node);
			return false;
		} else {
			removeInputWarning(node);
			return true;
		}
	}
	
	function validateEmail() {
		var emailFilter=/^.+@.+\..{2,3}$/; 
		
		if(!emailFilter.test(email.value)) {
			setInputWarning(email);
			return false;
		} else {
			removeInputWarning(email);
			return true;
		}
	}
	
	function setInputWarning(node) {
		dojo.addClass(node, "inputError");
		displayError(dojo.query("img", node.parentNode)[0]);
	}
	
	function displayError(node) {
		dojo.fx.slideTo({
			node: node,
			easing: dojox.fx.easing.bounceOut,
			left:410,
			top:0,
			unit:"px",
			beforeBegin: function() {
	       		dojo.style(node, "display", "block");
				dojo.style(node, "opacity", "1");
				dojo.style(node, "left", "500px");
	   		}
		}).play();
	}
	
	function removeInputWarning(node) {
		dojo.removeClass(node, "inputError");
		removeError(dojo.query("img", node.parentNode)[0]);
	}
	
	function removeError(node) {
		dojo.fadeOut({
			node: node,
			duration: 400
		}).play();
	}
	
	function submitForm(){
		// summary: We've passed validation, but haven't heard back from server
		// pseudo:
		// block form, submit data, get callback, fail-> unblock, succed-> hide form, show responsemessage
		var s = dojo.coords("contactForm");
		var ov = dojo.byId("formOverlay") || dojo.doc.createElement('div');
		if(!ov.id){
			ov.id ="formOverlay";
			dojo.byId("contactForm").appendChild(ov);
		}
		dojo.style(ov,"height",s.h+"px");
		dojo.style(ov,"width",s.w+"px");
		dojo.style(ov,"opacity","0");
		dojo.style(ov,"top",s.t+"px");
		dojo.style(ov,"left",s.l+"px");
		dojo._fade({
			node:ov, end:0.65, duration:300,
			onEnd:function(){
				_submitForm();
			}
		}).play(5);
		return false;
	}
	
	function _submitForm(){
		dojo.xhrPost({
			form:"contactForm",
			url:"/contact/submitContactForm.php",
			handleAs:"json",
			load:function(data){
				if(data.status == "SUCCESS"){
					var n = dojo.query(".mainContent")[0];
					var anim = dojo.fadeOut({
						node:n,
						duration:275,
						onEnd:function(){
							_replaceContent(n,data);
						}
					});
					anim.play(3);
				}
				// FIXME: check for data.status == "FAIL"? there will be
				//	an array dojo.forEach(data.errors, ... ) not sure how
				// to best present
			},
			error:function(){
				// FIXME: no error messages being shown to user, but this error
				// is only 404/500.  "real failures" 
				_resetOverlay().play();
			}
		});
	}

	function _replaceContent(node,data){
		var inquiryNode = dojo.byId("inquiry");
		if (inquiryNode) {
			var inquiryType = inquiryNode.value;
		} else {
			var inquiryType = "";
		}
		node.innerHTML = "<h1 class='heading'></h1><div class='messageArea'></div>";
		dojo.query(".heading",node)[0].innerHTML = data.message;
		dojo.query(".messageArea",node)[0].innerHTML = data.preview;
		dojo.fadeIn({ node: node, duration:375 }).play(10);
		pageTracker.trackPageView("/contact/" + inquiryType);
	}
	
	function _resetOverlay(){
		return dojo.fadeOut({ node:"formOverlay", duration:275,
			onEnd: function(){
				dojo.style("formOverlay","width","1px");
				dojo.style("formOverlay","height","1px");
			}
		});
	}

dojo.addOnLoad(init);
