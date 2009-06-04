var interval="";
var pos = 0;

function leadinInit() {
	var imageNodes = dojo.query("a", "leadinServices");
	var menuNodes = dojo.query("td", "homeLeadinMenu");
	interval = setInterval(function() { cycleLeadin(menuNodes, imageNodes) }, 7000);
	dojo.query("td", "homeLeadinMenu").onclick(function(evt){
		window.clearInterval(interval);
		cycleLeadin(menuNodes, imageNodes, evt);
	});
	
}
function cycleLeadin(menuNodes, imageNodes, evt) {
	var currentIndex = dojo.query("td", "homeLeadinMenu").map(function(n){ return n.className }).indexOf("current");
	//currentIndex = currentIndex==-1 ? 0 : currentIndex;
	var newIndex = "";
	if(evt) {
		newIndex = menuNodes.indexOf(evt.currentTarget);
		if(newIndex == currentIndex) {
			return;
		}
	} else {
		newIndex = (currentIndex == menuNodes.length-1) ? 0 : currentIndex+1;
	}
	changeStyles(imageNodes[currentIndex], imageNodes[newIndex], menuNodes[currentIndex], menuNodes[newIndex]);
}


var _spConnects = [];
var _anim, _anim1, _anim2;
function changeStyles(currentImageNode, nextImageNode, currentMenuNode, nextMenuNode) {
	dojo.forEach(_spConnects,dojo.disconnect);
	delete _anim1;
	delete _anim2;
	_anim1 = dojo.fadeOut({ node: currentImageNode, duration: 550 });
	_anim2 = dojo.fadeIn({ 
		node: nextImageNode, 
		duration: 550
	});
	_anim = dojo.fx.combine([_anim1,_anim2]);
	_spConnects.push(dojo.connect(_anim,"onEnd",function(){
		dojo.addClass(nextImageNode, "current");
		dojo.removeClass(currentImageNode, "current");
		dojo.style(currentImageNode,"display","none");
	}));
	
	dojo.style(nextImageNode,{ opacity:"0", display:"block" });
	_anim.play();	
	dojo.removeClass(currentMenuNode, "current");
	dojo.addClass(nextMenuNode, "current");
}