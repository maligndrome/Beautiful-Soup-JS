! function() {
    if (typeof jQuery === 'undefined') {
        return;
    }
    String.prototype.replaceAll = function(tagList,replacee) {
        var _this=this;
        for(var i=0;i<tagList.length;i++) {
            _this=_this.replace('<'+tagList[i]+'>',replacee);
            _this=_this.replace('</'+tagList[i]+'>',replacee);
        }
        return _this;
    };
    styleTags=['b','strong','i','em','del','ins','mark','small','sub','sup','u'];
    get = function(obj,attr) {
        obj=obj['self'];
        var returnValue;
        Object.keys(obj).forEach(function(key, index) {
            if(key==attr){
                returnValue=obj[key];
            }
        });
        return returnValue;
    };
    selectedArray = function(jsonForm, selector,attrToQuery){
        if(attrToQuery==undefined)
        {
            var attrToQuery='';
            if(selector[0]=='#'){ attrToQuery='id'; selector=selector.slice(1,selector.length);}
            else if(selector[0]=='.'){ attrToQuery='class'; selector=selector.slice(1,selector.length);}
            else if(selector[0]=='['){ attrToQuery=selector.slice(1,selector.indexOf('=')); selector=selector.slice(selector.indexOf('=')+1,selector.length-1);}
            else {attrToQuery='tagName'}
            
        }
        var elems=[];
        if(jsonForm.self){
        Object.keys(jsonForm).forEach(function(key, index) {
            if(key=='self'){
                if(jsonForm[key][attrToQuery]==selector)
                    elems.push(jsonForm);
            } else {
                if(jsonForm[key].length>=1)
                {
                    
                    for(var i=0;i<jsonForm[key].length;i++){
                        var _elems=selectedArray(jsonForm[key][i],selector,attrToQuery);
                        if(_elems)
                            for(var j=0;j<_elems.length;j++){
                                elems.push(_elems[j]);
                            }
                    }
                } else {
                    
                    return;
                }
                    
                }
            });
        return elems;
    }
    else
        return;
    };
    prettifyCode = function(jsonForm) {
        var prettyCode = '';
        prettyCode += '&lt;' + jsonForm.self.tagName + '&gt;' + prettifyChildren(jsonForm.children, 1) + '&#13;&lt;/' + jsonForm.self.tagName + '&gt;';
        return prettyCode;
    }
    prettifyChildren = function(children, tabLvl) {
        var singletonTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source'];
        var childrenCode = '';
        for (var i = 0; i < children.length; i++) {
            if (children[i].children) {
                var child = '&#13;';
                for (var j = 0; j < tabLvl; j++) {
                    child += '&#9;';
                }
                child += '&lt;' + children[i].self.tagName + printAttributes(children[i].self) + '&gt;' + prettifyChildren(children[i].children, tabLvl + 1);
                if (children[i].self.innerContent == '') {
                    for (var j = 0; j < tabLvl + 1; j++) {
                        child += '&#9;';
                    }
                    child += children[i].self.innerContent + '&#13;';
                } else {
                    child += '&#13;';
                }
                if (singletonTags.indexOf(children[i].self.tagName) == -1) {
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += '&lt;/' + children[i].self.tagName + '&gt;';
                }
            } else {
                if (children[i].tagName !== 'TEXT_NODE' && children[i].tagName !== 'COMMENT_NODE') {
                    var child = '&#13;';
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += '&lt;' + children[i].tagName + printAttributes(children[i]) + '&gt;';
                    if (children[i].innerContent) {
                        child += '&#13;';
                        for (var j = 0; j < tabLvl + 1; j++) {
                            child += '&#9;';
                        }
                        child += children[i].innerContent + '&#13;';
                        for (var j = 0; j < tabLvl; j++) {
                            child += '&#9;';
                        }
                    }
                    if (singletonTags.indexOf(children[i].tagName) == -1) {
                        for (var j = 0; j < tabLvl; j++) {
                            child += '&#9;';
                        }
                        child += '&lt;/' + children[i].tagName + '&gt;';
                    }
                } else if (children[i].tagName === 'COMMENT_NODE') {
                    var child = '&#13;';
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += '&lt;!--' + children[i].innerContent + '--&gt;';
                } else if (children[i].tagName === 'TEXT_NODE') {
                    var child = '&#13;';
                    for (var j = 0; j < tabLvl; j++) {
                        child += '&#9;';
                    }
                    child += children[i].innerContent;
                }
            }

            childrenCode += child;
        }
        return childrenCode;
    }
    printAttributes = function(self) {
        var attributeString = '';
        Object.keys(self).forEach(function(key, index) {
            if (key != 'tagName' && key != 'children' && key != 'innerContent') {
                attributeString += ' ' + key + '="' + self[key] + '"';
            }

        });
        return attributeString;
    }
    htmlToJSON = function(iframeId) {
        constructTagTree = function(tags) {
            if (tags.length != 1 || $(tags[0]).eq(0).contents().length != 0) {
                var newObj = {};

                $.each(tags, function() {
                    var childrenLength = $(this).eq(0).contents().length;
                    var newerObj = [];
                    var count = $(this).eq(0).contents().length;
                    $.each($(this).eq(0).contents(), function() {
                        var child = constructTagTree($(this).eq(0));
                        if (child)
                            newerObj.push(child);
                    });
                    newObj['children'] = (newerObj);
                    newObj['self'] = (constructAttributeObject($(this).eq(0)));

                });
            } else {
                var newObj = {};
                $.each(tags, function() {
                    newObj['children']='';
                    newObj['self'] = (constructAttributeObject($(this).eq(0)));
                });
            }
            return newObj;
        };
        constructAttributeObject = function(element) {
            var attrObj = {};
            element = element[0];
            if ($(element).prop('tagName'))
                attrObj['tagName'] = ($(element).prop('tagName')).toLowerCase();
            else if (element.nodeType == 8) {
                attrObj['tagName'] = 'COMMENT_NODE';
                attrObj['innerContent'] = element.nodeValue;
            } else {
                attrObj['tagName'] = 'TEXT_NODE';
                var x = element.nodeValue;
                x = x.replace(/(\r\n|\n|\r)/gm, " ");
                if (/\S/.test(x)) {
                    attrObj['innerContent'] = x;
                } else {
                    return;
                }
            }
            attrObj['children'] = '';
            if ($(element).prop('tagName'))
                $.each(element.attributes, function() {
                    attrObj[this.name] = this.value;
                });

            return attrObj;
        };
        obj = constructTagTree($(iframeId).contents().eq(0).children().eq(0));
        
        return obj;
    }
    beautifulSoup = function(url) {
        var _this = this;
        _this.url = url;
        _this.loaded = false;
        _this.content = '';
        _this.onReady = function(action, params) {
            if (_this.loaded === false) {
                var promise=new Promise(function(resolve,reject){
                     $.get(_this.url, function(data) {                        
                        var iframe = document.createElement('iframe');
                        iframe.id="doc";
                        var html = data;
                        document.body.appendChild(iframe);
                        iframe.contentWindow.document.open();
                        iframe.contentWindow.document.write(html);
                        iframe.contentWindow.document.close();
                        var iframe2 = document.createElement('iframe');
                        iframe2.id="stripped";
                        var html2 = data.replaceAll(styleTags,'');
                        document.body.appendChild(iframe2);
                        iframe2.contentWindow.document.open();
                        iframe2.contentWindow.document.write(html2);
                        iframe2.contentWindow.document.close();
                        var loaded=0;
                        $('#doc, #stripped').load(function (){
                            if (++loaded === 2) {
                                console.log('heh');
                                _this.loaded = true;
                                _this.content = data;
                                _this.jsonForm = htmlToJSON('iframe#doc');
                                _this.jsonFormStripped = htmlToJSON('iframe#stripped');
                                resolve(execute(action,params));
                            }
                        });
                        
                    });
                });
                return promise;   
               // );
            } else {
            	
                return execute(action, params);
            }
        }
        _this.html2json = function(varToStoreJSON) {
            return _this.jsonForm;
        };
        _this.prettify = function(divToPopulate) {
            var pretty=prettifyCode(_this.jsonForm);
            $(divToPopulate).append($('<textarea />').append(pretty).css({width:'800px',height:'80vh'}));
            return pretty;
        };
        _this.findAll = function( tag ){
            return selectedArray(_this.jsonForm,tag);
        };
        _this.getText = function( param ){
            console.log(";'(");
            var textObj=selectedArray(selectedArray(_this.jsonFormStripped,'body')[0],'TEXT_NODE');
            var textLines=[];
            for(var i=0;i<textObj.length;i++){
                textLines.push(textObj[i]['self']['innerContent']);
            }
            return textLines;
        };
        execute = function(action, params) {
            if (action === 'html2json') {
                return _this.html2json(params);
            } else if (action === 'prettify') {
                return _this.prettify(params);
            } else if (action === 'findAll') {
                return _this.findAll(params);
            } else if (action === 'getText') {
                return _this.getText(params);
            }
        };
    };

}();
