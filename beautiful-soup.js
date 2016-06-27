//Beautiful Soup JS
//Inspired by Beautiful Soup, served with love in JS
//Author: maligndrome
!function(){
	if (typeof jQuery === 'undefined') {
  console.log("Beautiful Soup requires JQuery.");
  return;
}
htmlToJSON = function(HTMLstring) {
	//strategy: Let's create a hidden element on the page and exploit jQuery to fetch the tags!
	var elem=$('<div id="doc"></div>').html(HTMLstring).css({display:'none'});
	$('body').append(elem);
	//helper function!
	constructTagTree= function(tags){
		var newObj=[];
		$.each(tags, function(){
			var childrenLength=$(this).eq(0).children().length;
			if(childrenLength==0){
				console.log("Hmm");
				newObj.push(constructAttributeObject($(this).eq(0)));
			}
			else {
				console.log("k");
				$.each($(this).eq(0).children(),function(){
					newObj.push(constructTagTree($(this).eq(0)));
				});
				newObj.push($(this).eq(0)
			        .clone()    //clone the element
			        .children() //select all the children
			        .remove()   //remove all the children
			        .end()  //again go back to selected element
			        .text());    //get the text of element
						}
		});
		return newObj;
	};
	constructAttributeObject = function(element) {
		var attrObj={};
		element=element[0];
		attrObj['tagName']=$(element).prop('tagName');
		attrObj['innerContent']=$(element).text();
		$.each(element.attributes, function(){
			attrObj[this.name]=this.value;
		});
		console.log(attrObj);
		return attrObj;
	};
	obj = constructTagTree($('#doc>*'));
	console.log(obj);
	return ;
}
beautifulSoup = function(url){
	var _this=this;
	this.url=url;
	this.loaded=false;
	this.content='';
	this.onReady = function(action){
		console.log(action);
		if(this.loaded===false){
			$.get(this.url, function(data) {
			   _this.loaded=true;
			   _this.content=data;
			   execute(action);
			   return;
			});
		}
		else {
			execute(action);
			return;
		}
	}
	_this.writeToConsole = function(){
		//if(this.loaded)
		//console.log(_this.content);
		htmlToJSON(_this.content);
		//else
	}
	execute= function(action){
		console.log('executing...');
		if(action==='writeToConsole'){
			_this.writeToConsole();
		}
	};
};

}();