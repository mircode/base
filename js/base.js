/***************************************************************************************************************
	ģ��ECMAScript5���õ�API
	�f����
	1.���wԭ��Array.prototype.indexOf �c Array.prototype.lastIndexOf����
	  --���ɣ�����[123,3,5].indexOf(new Number(123)) = -1����r
	2.�������ɂ����N�µă��Ȓ��Þg�[��ԭ������
****************************************************************************************************************/
if(!Function.prototype.bind){
	Function.prototype.bind = function (boundThis) {
		var _slice = [].slice,
			//this�A������������
			targetFunction = this,
			boundArgs = _slice.call(arguments, 1),
			F = function () {
				//���阋��������r
				if(this instanceof F){
					//����new��ʽ�{��F(this == fn��һ������)
					var obj,
						ret,
						//�½�һ��������
						temp = function () {};
					temp.prototype = targetFunction.prototype;
					obj = new temp;//objֻ����Ŀ�˺�����ԭ�ͣ����߂䌍��׃��
					ret = targetFunction.apply(obj, boundArgs.concat(_slice.call(arguments)));
					//���SĿ�˺�����������IE8-�c�����g�[���О鱣��һ��
					return (typeof ret == 'object' || typeof ret == 'function') && ret !== null ? ret : obj;
				}
				//������ͨ��ʽ�{��F(this == window)
				return targetFunction.apply(boundThis, boundArgs.concat(_slice.call(arguments)));
			};
		return F;  
	};
}

if (!Array.prototype.forEach) { 
	Array.prototype.forEach = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		for (var i = 0, len = this.length; i < len; i++) {
			f.call(oThis, this[i], i, this); //p1 �����Ļ��� p2 ����Ԫ�� p3 ���� p4 �������
		}
	}
}

if (!Array.prototype.filter) {
	Array.prototype.filter = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		var a = [];
		for (var i = 0, len = this.length; i < len; i++) {
			if (f.call(oThis, this[i], i, this)) a.push(this[i]);
		}
		return a;
	}
}

if (!Array.prototype.map) {
	Array.prototype.map = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		var a = [];
		for (var i = 0, len = this.length; i < len; i++) {
			a.push(f.call(oThis, this[i], i, this));
		}
		return a;
	}
}

if (!Array.prototype.every) {
	Array.prototype.every = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		for (var i = 0, len = this.length; i < len; i++) {
			if (!f.call(oThis, this[i], i, this)) return false;
		}
		return true;
	}
}

if (!Array.prototype.some) {
	Array.prototype.some = function(f, oThis) {
		if (!f || f.constructor != Function.toString()) return;
		oThis = oThis || window;
		for (var i = 0, len = this.length; i < len; i++) {
			if (f.call(oThis, this[i], i, this)) return true;
		}
		return false;
	}
}

//�Ƚ϶����Ƿ��ڲ���obj ���..
function compare(obj1, obj2) {
	if (obj1 == null || obj2 == null) return (obj1 === obj2);
	//����[1,2,3].constructor != ele('iframe').contentWindow.Array->obj1.constructor.toString() == obj2.constructor
	return (obj1 == obj2 && obj1.constructor.toString() == obj2.constructor);
}

//�޸�ff������ʵ�� indexOf�������������ֵ�������������ͱȽ������һ�ɷ���false����
Array.prototype.indexOf = function(obj) {
	for (var i = 0, len = this.length; i < len; i++) {
		if (compare(this[i], obj)) return i;
	}
	return -1;
}

//�޸�ff������ʵ�� indexOf�������������ֵ�������������ͱȽ������һ�ɷ���false����
Array.prototype.lastIndexOf = function(obj) {
	for (var i = this.length - 1; i >= 0; i--) {
		if (compare(this[i], obj)) return i;
	}
	return -1;
}

if (!String.prototype.trim) {
    var trimBeginRegexp = /^\s+/; // /\s+/ == /^\s+/ == /^\s+/g (IE8-Ҫ�@ʽ��/^\s+/)
    var trimEndRegexp = /\s+$/; // /\s+$/ == /\s+$/g
    String.prototype.trim = function () {
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    };
}

if(typeof document.getElementsByClassName != 'function'){  
	document.getElementsByClassName = function(classname){  
		var d=document;  
		var e=d.getElementsByTagName('*');  
		var c=new RegExp('\\b'+classname+'\\b');  
		var r=[];  
		  
		for(var i=0,l=e.length;i<l;i++){  
			var cn=e[i].className;  
			if(c.test(cn)){  
				r.push(e[i]);  
			}  
		}  
		return r;  
	};  
}

if(typeof document.querySelectorAll != 'function'){  
	var s=document.createStyleSheet();
	document.querySelectorAll = function(r, c, i, j, a) {
		a=document.all, c=[], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
		for (i=r.length; i--;) {
			s.addRule(r[i], 'k:v');
			for (j=a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
			s.removeRule(0);
		}
		//IE8- ��DOM��д˳���෴,������
		return c.reverse();
	}
}

//�Uչ�ַ�����ȡ����
String.prototype.toNum = function () {
	var regexp = /^-*\d+/
		,result = String(this).match(regexp)[0]; //String(this).match ������͔��M
	return result == null ? 0 : parseFloat(result);
};

/*��ʽ������
	eg:
	(new Date).format("yy��MM��dd�o����"); // 13��05��09�o����
	(new Date).format("yyyy��M��d�o����"); // 2013��5��9�o����
	(new Date).format("yyyy\u5e74M\u6708d\u65e5"); // 2013��5��9��
*/
Date.prototype.format = function(a) { 
	var b = {
		// ��+���o������reg
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours() > 12 ? this.getHours() - 12 : this.getHours(),//0 == this.getHours() ? 12 : this.getHours(),
		"H+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3), 
		S: this.getMilliseconds()
	},
	c = {
		0 : "\u65e5", //��
		1 : "\u4e00", //һ
		2 : "\u4e8c", //��
		3 : "\u4e09", //��
		4 : "\u56db", //��
		5 : "\u4e94", //��
		6 : "\u516d"  //�� 
		// \u6708 ��
	};
	if( /(y+)/.test(a) ){
		var len = 4 - RegExp.$1.length 
			,replace = (this.getFullYear() + "").substr(len);
		a = a.replace(RegExp.$1, replace);
	};
	if( /(E+)/.test(a) ){
		var replace 
			,replace_temp =  + c[this.getDay() + ""];
		if( RegExp.$1.length > 1 ){
			if( RegExp.$1.length > 2 ){
				replace_temp = "\u661f\u671f";
			}else{
				replace_temp = "\u5468";
			}
		}else{
			replace_temp = "";
		};
		replace = replace_temp + c[this.getDay() + ""];
		a = a.replace(RegExp.$1, replace);
	};
	for (var d in b) {
		if( RegExp("(" + d + ")").test(a) ){
			var replace;
			if( 1 == RegExp.$1.length ){
				//���a0
				replace = b[d];
			}else{
				//�a0
				var len = ("" + b[d]).length;
				replace = ("00" + b[d]).substr(len);
			}
			a = a.replace(RegExp.$1, replace);
		}
	}
	return a;
}

/***************************************************************************************************************
	΢�͎�
	1.���ECMAScript5
	2.API��ѭJquery
	3.����Mobile,Desktop
	4.�ռ{�Ŀ�г��÷���
****************************************************************************************************************/
var DS
	,Q;

DS = (function() {
	var nmg, EMPTY_ARRAY, _slice;
	_slice = [].slice;
	EMPTY_ARRAY = [];
	nmg = function(selector) {
		var dom;
		/*  ����@ȡ������
			1.selector���x��� string ���� document / element / window / documentFragment
		*/
		dom = nmg.getDOMObject(selector);
		return Q(dom);
	};
	Q = function(dom) {
		/*	
			1.dom.__proto__ = Q.prototype; // DOM Object->webkit SUPPORT,FF�� NOT SUPPORT
			2.for(var fn in Q.prototype){ dom.__proto__[fn] =  Q.prototype[fn]; } // ���Uչ�����cDOM Object����ͬ���rʧЧ ��style
			̎����DOM Object�M�b�����M��֮�ᆖ�}��
			1.dom.__proto__ = Q.prototype; // IE8- NOT SUPPORT
			̎�������M��һ��ӔUչ�ķ���
		*/

		if( nmg.isObjArray(dom) ){
			return dom;
		}
		for(var fn in Q.prototype){ dom[fn] =  Q.prototype[fn]; }
		return dom;
	};
	nmg.extend = function(target) {
		_slice.call(arguments, 1).forEach(function(source) {
			var key, _results;
			_results = [];
			for (key in source) {
					_results.push(target[key] = source[key]);
			}
			return _results;
		});
		return target;
	};
	//fn ���·����x��oͨ�^nmg('id')�@ȡ��DOMԪ�أ������߂�nmg.xxx��Ƶķ���
	Q.prototype = nmg.fn = {};
	return nmg;
})();

window.DS = DS;

"nmg" in window || (window.nmg = DS);

//���ԙz�y
nmg.support = (function() {
	"use strict";
	var support
		,div = document.createElement("div")
		,ipt = document.createElement("input");
	// Setup
	div.setAttribute( "className", "t" );
	var has3d = function () {
		var style = document.documentElement.style,
			str = 'perspective',
			css3s = 'Webkit Moz O ms'.split(' '),
			cstr = str.charAt(0).toUpperCase() + str.substr(1),  //����ĸת���ɴ�д
			rstr = (cstr + ' ' + css3s.join(cstr + ' ') + cstr).split(' '),//���Զ�����ǰ׺
			result = null; 
		for(var i=0,len=rstr.length;i<len;i++){
			if(rstr[i] in style){
				result = rstr[i];
				break;
			}
		}
		return !!result;
	};
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute : div.className !== "t"
		// �Ƿ�֧��oninput�¼�
		,hasOnInput : typeof ipt.oninput == 'object'
		// �Ƿ�֧���|���¼�
		,hasTouch : "ontouchstart" in window
		,has3d : has3d()
	};
	return support;
})();

//�z�y��
nmg.browser = (function() {
	"use strict";
	 var ua = navigator.userAgent.toLowerCase()
		  ,isOpera = (/opera/i).test(ua)
		  ,isAndroid = (/android/i).test(ua)
	      ,isUC = navigator.appVersion.indexOf("UC")!= -1
          ,isMeeGo = (/meego/i).test(ua)
          ,isWP = (/windows phone os/i).test(ua)
		  ,isIOS = (/mac os/i).test(ua);
	return {
		ua_lowerCase : ua.toLowerCase() //�Ƚ�
		//�豸���
		,isIPad : (/ipad/i).test(ua) //�Ƚ�
		,isIPhoneOrIPod : (/iphone/i).test(ua) || (/ipod/i).test(ua) //�Ƚ�
		,isNexus7 : window.devicePixelRatio == 1.3312499523162842 //��ʱ
		//ϵͳ���
		,isIOS : isIOS //�Ƚ�
		,isAndroid : isAndroid //�Ƚ�
		,isWP : isWP //�Ƚ�
		,isMeeGo : isMeeGo //�Ƚ�
		//��������
		,isUC : isUC //�Ƚ�
		,isOpera : isOpera //�Ƚ�
		,isIE : (/msie/i).test(ua) //�Ƚ�
		,isChrome : (/chrome/i).test(ua) //�Ƚ�
		,isAndroidOriginalBrowser : isAndroid && !isUC && !isOpera //���Ƚ�	  ����UC Opera Mobile/HD �����������������QQ�������
		,isDesktop : !isWP && !isIOS && !isAndroid && !isMeeGo && !(/opera mobi/i).test(ua) //�뷀��_��ʹ�� �ֻ�ϵͳ���������
		,isSamSungPad : window.devicePixelRatio == 1 && !isIOS //������ Android�µ�UC�Ȟg�[��Ҳ�����c���Д�ƥ��
		/* IE/Safari/Chrome��uaҲ��mozilla�֘� */
		,isFirefox : /firefox/.test(ua) //�Ƚ�
		,isWebkit : /webkit/.test(ua)	 //�Ƚ�
		//���Լ��
		,isHeightPR : "devicePixelRatio" in window && window.devicePixelRatio > 1
	}
})();

//Screen
nmg.screen = (function() {
	"use strict";
	return function(){
		return {
			getWidth: function(){ 
				return typeof window.innerWidth != 'undefined' 
				? window.innerWidth : document.getElementsByTagName('html')[0].clientWidth;
			}
			,getHeight: function(){
				return typeof window.innerHeight != 'undefined' 
				? window.innerHeight : document.getElementsByTagName('html')[0].clientHeight;
			}
		}
	}();
})();

//ȫ��׃��
var arr = []
	,pop = arr.pop
	,push = arr.push
	,slice = arr.slice
	,_forEach = arr.forEach
	,_map = arr.map
	,propFix = {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	}
	,vendor = nmg.browser.isWebkit ? "webkit":
				nmg.browser.isFirefox ? "Moz": 
				nmg.browser.isOpera ? "O":
				nmg.browser.isIE ? "ms":
				""
	,eventFix = {
		click: nmg.support.hasTouch ? 'touchstart' : 'click'
		,resize: "onorientationchange" in window ? "orientationchange": "resize"
		,mousedown: nmg.support.hasTouch ? "touchstart" : "mousedown"
		,mousemove: nmg.support.hasTouch ? "touchmove" : "mousemove"
		,mouseup: nmg.support.hasTouch ? "touchend" : "mouseup"
		/* 
			1. 'onwheel' : DOM 3 �˜ʣ�Firefox 17+ ie9+
			2. 'onmousewheel' : ֻ��firefox��֧��
			3. 'DOMMouseScroll' : ֻ��firefox֧��
		*/
		,mousewheel: nmg.browser.isFirefox ? 'DOMMouseScroll' : 'mousewheel'
		,transitionend : nmg.browser.isWebkit ? "webkitTransitionEnd":
			nmg.browser.isFirefox ? "transitionend": 
			nmg.browser.isOpera ? 'otransitionend': //��ʹ��"oTransitionEnd"ԭ��:opera event.typeΪ'otransitionend'
			nmg.browser.isIE ? "MSTransitionEnd": //IE9 ���ɲ�֧�֣�Ŀǰֻ��IE10֧��
			""
		,input: nmg.support.hasOnInput ? "input" : "propertychange"
	}
	,cssFix = {
		transitionduration : vendor + "TransitionDuration"
		,transform : vendor + "Transform"
		,translate : vendor + "Transform"
		,perspective : vendor + 'Perspective'
	}
	,mouseButton = {
		button:{
			left: 0//IE9�Ѿ�����Ϊ0��IE8-:nmg.browser.isIE ? 1 : 0(Ŀǰ����IE8-�������Դ���)
			,center: nmg.browser.isIE ? 4 : 1
			,right: 2
		}	
	}
	,getSetAttribute = nmg.support.getSetAttribute;

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
};

//DOM(�����ʽ̎��)
(function(nmg) {
	/*		
		1.�����S�����б���ͬ������
		2.�����Sδ������׃��
	*/
	"use strict";
	var OBJECT_PROTOTYPE, CLASS_SELECTOR, ID_SELECTOR, TAG_SELECTOR, IS_HTML_FRAGMENT, HTML_CONTAINERS
		, _existsClass, _computedStyle, _toElesArray, _find, _getPxCssVal, _sizeAccess, _eq, _Q;
	OBJECT_PROTOTYPE = Object.prototype;
	CLASS_SELECTOR = /^\.([\w-]+)$/;
	ID_SELECTOR = /^#[\w\d-]+$/;
	TAG_SELECTOR = /^[\w-]+$/;
	IS_HTML_FRAGMENT = /^\s*<(\w+|!)[^>]*>/;
	HTML_CONTAINERS = document.createElement("div");

	_existsClass = function(name, className) {
		var classes;
		classes = className.split(/\s+/);	//split(/\s+/) == split(/\s+/g)
		return classes.indexOf(name) >= 0;
    };

	_computedStyle = function(element, property) {
		var ret = (element.currentStyle? element.currentStyle : window.getComputedStyle(element, null))[property];
		if( ret == 'auto' || ret.indexOf('%') > 1 ){
			switch(property){
				case 'width':
					if( nmg.browser.isIE ){
						ret = element.offsetWidth + 'px';
					}else{
						ret = element.clientWidth + 'px';
					}
					break;
				case 'height':
					if( nmg.browser.isIE ){
						ret = element.offsetHeight + 'px';
					}else{
						ret = element.clientHeight + 'px';
					}
					break;
				default:
					break;
			}
		}
		return ret;
	};

	// HTMLCollection / NodeList �e��DOMԪ�س鵽���M
	_toElesArray = function(nodelist){ 
		var elements
			,results = []
			,elementTypes = [1, 9, 11];
		elements = [];
		push.apply( results, slice.call(nodelist, 0) );
		_forEach.call( results, function(value){
			if( typeof value.nodeType != 'undefined' && elementTypes.indexOf(value.nodeType) >= 0){
				elements.push(value);
			}
		});
		return elements;	
	};
	
	/*���_�@ȡ�������
	  eg:
		 �ctypeof ���ȣ�
	     typeof new Date // "object"
		 nmg.toType(new Date) // "date"	���Ӿ��_
	*/
	nmg.toType = function(obj) {
		return OBJECT_PROTOTYPE.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	};

	nmg.isObjArray = function(dom){
		if( !!dom && typeof dom.append == 'function' ){
			return true;
		}
		return false;
	};

	nmg.fn.closest = function(tagName){
		var ret = []
			,tagName = tagName.toUpperCase();
		_forEach.call(this, function(element){
			while (element.parentNode.tagName !== tagName) {
				element = element.parentNode;
			};
			ret.push(element.parentNode);
		});
		ret.prevObject = this;
		return Q(ret);
	};

	nmg.query = function(selector) { 
		var elements;
		selector = selector.trim();
		if( CLASS_SELECTOR.test(selector) ){
			// IE8- NOT SUPPORT
			return _toElesArray( document.getElementsByClassName(selector.replace(/^./,'')) );
		}else if( ID_SELECTOR.test(selector) ){
			return [ document.getElementById(selector.replace(/^#/,'')) ];
		}else if( TAG_SELECTOR.test(selector) ){
			return _toElesArray(document.getElementsByTagName( selector ));
		}else{
			// IE8- NOT SUPPORT
			return _toElesArray(document.querySelectorAll( selector ));
		};
	};

	_find = function(selector, Mode){
		var ret = []
			,hasChild = function(element){ return element.children.length > 0; }
			,isMatch = function(element){ return  selector == element; }
			,self = this[0]
			,recursion = function(element){ //�f�w
				isMatch(element) && self != element && ret.push(element);
				if( hasChild(element) ){
					_forEach.call(element.children, function(element){
						recursion(element);
					});
				};
			};
		
		if(Mode == 'string'){
			selector = selector.trim();	
			if( CLASS_SELECTOR.test(selector) ){
				isMatch = function(element){ 
					var arr = !!nmg(element).attr('class') ? nmg(element).attr('class').split(' ') : []; 
					for(var i = 0; i < arr.length; i++){
						if( arr[i] == selector.replace(/^./,'') )	{
							return true;
						}
					};			
					return false;
				};
			}else if( ID_SELECTOR.test(selector) ){
				isMatch = function(element){ return nmg(element).attr('id') == selector.replace(/^#/,''); }		
			}else if( TAG_SELECTOR.test(selector) ){
				isMatch = function(element){ return  element.tagName.toLowerCase() == selector.toLowerCase(); }		
			}
		}else if(Mode == 'objs'){
			isMatch = function(element){
				var ret = false;
				_forEach.call(selector, function(ele){
					if(ele == element){
						ret = true;
					}
				});
				return ret;
			};
		};
		_forEach.call(this, function(element){
			recursion(element);
		});			
		return ret;
	};
	
	nmg.fn.end = function(){
		return this.prevObject;
	};

	//���ƻ��ԡ�����
	nmg.fn.find = function(selector){
		var elementTypes, type, ret;
		elementTypes = [1, 3, 9, 11];
		type = nmg.toType(selector);
		if (type === "string") {
			ret = _find.call(this, selector, 'string');
		}else if(elementTypes.indexOf(selector.nodeType) >= 0){
			ret = _find.call(this, selector, 'obj');
		}else if( nmg.isObjArray(selector) ){
			ret = _find.call(this, selector, 'objs');
		}
		ret.prevObject = this;
		return Q(ret);
	};

	_Q = function(dom) {
		for(var fun in nmg.fn){ dom[fun] = nmg.fn[fun]; }
		return dom;
	};	

	_eq = function(i){
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		var ret = j >= 0 && j < len ? [ this[j] ] : [];
		return _Q(ret);
	};

	nmg.fn.first = function() {
		var ret = _eq.call(this, 0);
		ret.prevObject = this;
		return ret;
	};

	nmg.fn.last =  function() {
		var ret = _eq.call(this, -1);
		ret.prevObject = this;
		return ret;
	};

	nmg.fn.eq =  function(i) {
		var ret = _eq.call(this, i);
		ret.prevObject = this;
		return ret;
	};

	nmg.getDOMObject = function(selector) { 
		var elementTypes, type, domobj;
		//���c���: 1.ELEMENT_NODE 2.ATTRIBUTE_NODE 3.TEXT_NODE 8.COMMENT_NODE 9.DOCUMENT_NODE 11.DOCUMENT_FRAGMENT_NODE
		//http://www.w3schools.com/dom/dom_nodetype.asp
		//Notes: iframe.nodeType -> 1, document.createDocumentFragment().nodeType -> 11, window.nodeType -> undefined
		elementTypes = [1, 3, 9, 11];
		type = nmg.toType(selector);
		
		if (type === "string" && IS_HTML_FRAGMENT.test(selector)) { //����Ԫ�� nmg("<a href='#'></a>")
			domobj = nmg.fragment(selector);
		}else if (type === "string"){
			domobj = nmg.query(selector);
		}else if(elementTypes.indexOf(selector.nodeType) >= 0 || selector === window){
			domobj = [selector];
		}else if(nmg.isObjArray(selector)){
			return selector;
		}else if(type === 'htmlcollection' || typeof selector.length == 'number'){
			return _toElesArray(selector);
		}
		return domobj;
	};

	nmg.fragment = function(markup){
		var container = HTML_CONTAINERS;
		container.innerHTML = markup.trim();
		return _map.call(container.childNodes, function(element, index, array) {
			return container.removeChild(element);
		});	
	};
	
	nmg.fn.clone = function(){
		var ret = this.map( function(element){
			return element.cloneNode(true);
		});
		return _Q(ret);
	};
	
	nmg.fn.before = function(t){
		_forEach.call(this, function(element){
			var parentNode = element.parentNode;
			for(var i = 0; i < nmg(t).length; i++){ 
				parentNode.insertBefore(nmg(t)[i], element);
			}
		});	
	};

	// �Ƴ����c
	nmg.fn.remove = function(){
		_forEach.call(this, function(element){
			var parentNode = element.parentNode;
			parentNode.removeChild(element);
		});	
	};

	nmg.fn.append = function(markup){
		var domobj = nmg.isObjArray(markup) ? markup : nmg(markup);
		if( !!domobj && domobj.length > 0 ){
			_forEach.call(this, function(element, idx){
				domobj = idx > 0 ? nmg(domobj).clone() : domobj;
				_forEach.call(domobj, function(ele){
					element.appendChild(ele);
				});
			});
		}

		return this;
	};

	nmg.fn.appendTo = function(selector){
		nmg(selector).append(this);
		return this;
	};

	//�����з���ֵ�������ʽ̎��
	nmg.fn.hasClass = function(name) {
		return _existsClass(name, this[0].className);
    };

	nmg.fn.addClass = function(name) {
		_forEach.call(this, function(element){
			if (!_existsClass(name, element.className)) {
				element.className += " " + name;
				element.className = element.className.replace(/\s+/g, " ").trim();
			}
		});
		return this;
	};

	nmg.fn.removeClass = function(name) {
		var proceed = arguments.length === 0 || typeof name === "string" && name;
		name = name.match(/\S+/g);
		_forEach.call(this, function(element){
			if (proceed) {
				if (!name) {
					element.className = '';
				}else {
					var arr = element.className.split(/\s+/);
					name.forEach(function(val){
						if (_existsClass(val, element.className)) {
							for(var i = 0; i < arr.length; i++){
								  if( arr[i] == val ){
									   delete arr[i];
								  }
							}
						}	
					});
					element.className = arr.join(' ').replace(/\s+/, ' ');
				}
			}
		});
		return this;
	};
	
	nmg.fn.css = function(property, value) {
		var rdashAlpha = /-([\da-z])/gi
			,rmsPrefix = /^-ms-/
			,fcamelCase = function( all, letter ) {
				return letter.toUpperCase();
			}
			,camelCase = function( string ) {
				return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
			}
			,has3d = nmg.support.has3d
			,value = property.toLowerCase() == 'translate'  && value != void 0 && value != 'none'? 
				( 'translate' + (has3d ? '3d(': '(') + value + (has3d ? ',0)': ')') )
				: value
			,property = camelCase( !!cssFix[property] ? cssFix[property] : property );
		if ( typeof value !== 'undefined' ) {
			_forEach.call(this, function(element) {
				element.style[property] = value;
			});
		} else {
			var computeStyleResult = _computedStyle(this[0], property);
			return this[0].style[property] || (computeStyleResult == 'auto' || computeStyleResult == '' ? '0px' : computeStyleResult);
		}
		return this;
	};

	_getPxCssVal = function(value){
		return typeof value == 'number' ? value + 'px' : typeof value == 'string' ? value : 0;
	};

	_sizeAccess = function(val, isWidth){
		var attr = isWidth ? 'width' : 'height';
		if( val != void 0 ){
			if( typeof val != 'function' ){
				this.css(attr, _getPxCssVal(val));
			}else{
				var idx = 0, width;
				_forEach.call(this, function(element) {
					width = val(idx, nmg(element).css(attr));
					nmg(element).css(attr, _getPxCssVal(width));
					idx++;
				});				
			}
		}
		else{
			return this.css(attr);
		}
		return this;
	};
	
	nmg.fn.width = function(val) {
		return _sizeAccess.call(this, val, true);
	};

	nmg.fn.height = function(val) {
		return _sizeAccess.call(this, val, false);
	};

	nmg.fn.show = function() {
		//ʹ��this.css('display', 'block') ��� this.css('display', '')ԭ��display:none��display:''Ҫ����
		return this.css('display', 'block');
	};

	nmg.fn.hide = function() {
		return this.css("display", "none");
	};

	nmg.fn.html = function(cnt){
		var element = this[0]
			,hasTextContent = typeof element.textContent != 'undefined'
			,isScriptNode = element.nodeName.toLowerCase() == 'script'
			,hasInnerText = typeof element.innerText != 'undefined'
			,argLength = arguments.length
			,textContent = '';

		_forEach.call(this, function(element){
			if( argLength === 0 ){
				if( hasTextContent ){
					textContent = element.textContent;	
				}else if( isScriptNode ){
					textContent = element.text;
				}else if( hasInnerText ){
					textContent = element.innerText;		
				}			
			}else if( typeof cnt === 'number' || typeof cnt === 'string' ){
				if( hasTextContent ){
					element.textContent = cnt;	
				}else if( isScriptNode ){
					element.text = cnt; 
				}else if( hasInnerText ){
					element.innerText = cnt;		
				}			
			}		
		});
		if( argLength === 0 ){
			return textContent;
		}
	};

	nmg.fn.empty = function(){
		this.html('');
	};

	nmg.fn.attr = function(name, value) {
		// null/0/false !== void 0; undefined === void 0;
		// 0/false != void 0; undefined/null == void 0;
		if (nmg.toType(name) === "string" && value === void 0) {
			var _this = this[0];
			if(typeof _this.getAttribute != 'undefined'){
				if( name == 'class' && nmg.toType(_this.attributes) == 'object' ){
					//IE7 Use: this[0].getAttribute(name).nodeValue 
					//nmg.toType(_this.attributes)
					//IE7-8:'object'
					//Other:'namednodemap'
					return !!_this.attributes(name) && _this.attributes(name).nodeValue ? _this.attributes(name).nodeValue : '';
				}else if(name == "href"){
					//IE7 ���ؽ^��·�� ������this[0].getAttribute( name, 2 )
					return _this.getAttribute( 'href', 2 );
				}else{
					return _this.getAttribute(name);
				}
			}
		} else {
			if( value === null ){
				nmg.fn.removeAttr.call(this,name);
				return;
			}
			_forEach.call(this, function(element) {
				return element.setAttribute(name, value);
			});
		}
		return this;
	};

	nmg.fn.removeAttr = function(name) {
		var propName = propFix[ name ] || name;
		_forEach.call(this, function(element) {
			element.removeAttribute( getSetAttribute ? name : propName ); // IE7- 'className'
		});
		return this;
	};
	//�����з���ֵ�������ʽ̎��
	nmg.fn.index = function() {
		//return index in parent
		if( this[0] && this[0].parentNode ){
			var currEle = this[0]
				,parentChildren = currEle.parentNode.children;
			for( var i = 0; i < parentChildren.length; i++){
				if(currEle === parentChildren[i]){
					return i;
				}
			};
		}else{
			return -1;
		}
	};
})(DS);

//Extend
(function(nmg) {
	"use strict";
	var _set;

	nmg.extend = function(obj, ext_obj) {
		ext_obj = ext_obj || {};
		for (var key in ext_obj) {
			obj[key] = ext_obj[key];
		}
		return obj;		
	};
})(DS);

//Event
(function(nmg) {
	//"use strict";
	var HANDLERS, ELEMENT_ID, READY_EXPRESSION, _createProxyCallback, _getElementId,
		_subscribe, _findHandlers, _unsubscribe, _getEventName, _getCallBack, _getNormalEvent;
	ELEMENT_ID = 1; 
	HANDLERS = {};
	READY_EXPRESSION = /complete|loaded|interactive/;

	nmg.fn.ready = function(callback) {
		/*safari ��strict Mode�²����S�a��δ����׃��*/
		var st = setTimeout;
		if (nmg.browser.isWebkit) { // safari
			setTimeout(function(){
				if ( READY_EXPRESSION.test(document.readyState) ) {
					callback();
				} else {
				  setTimeout(arguments.callee,10);
				}
			}, 10); 
		} else if ( (
			( nmg.browser.isFirefox && !nmg.browser.isCompatible )
			|| nmg.browser.isOpera ) ) { // opera/moz
			nmg(document).bind("DOMContentLoaded", callback);
		} else if (nmg.browser.isIE) {
			(function (){ 
				var tempNode = document.createElement('document:ready'); 
				try {
					tempNode.doScroll('left'); 
					callback(); 
					tempNode = null; 
				} catch(e) { 
					st(arguments.callee, 0); 
				} 
			})();
		} else {
			window.onload = callback;
		}
	};

	//��event����������
	_getNormalEvent = function(event){
		//����ͨ�^opera ����ģʽ�������g�[������ģʽ�]���}
		!!event.srcElement && (event.target = event.srcElement);
		//event.point = nmg.support.hasTouch ? event.touches[0] : undefined; // mobile �a�����}
		return event;
	};

	_createProxyCallback = function(callback, callbackTarget) {
		var proxy;
		callback = callback;
		proxy = function(event) {
				var result;
				event = _getNormalEvent(event);
				result = callback.apply(callbackTarget, [event]);
				if (result === false) {
					nmg.preventDefault(event);
				}
				return result;
		};
		return proxy;
	};

	_getElementId = function(element) {
		return element._id || (element._id = ELEMENT_ID++);
	};

	_subscribe = function(element, callbackTarget, event, callback) {
		var handler, element_id, element_handlers;
		element_id = _getElementId(element);
		element_handlers = HANDLERS[element_id] || (HANDLERS[element_id] = []); 
		handler = {
			event: event,
			callback: callback,
			proxy: _createProxyCallback(callback, callbackTarget),
			index: element_handlers.length
		};
		element_handlers.push(handler);	
		return nmg.fn.addHandler(element, handler.event, handler.proxy);
	};

	_findHandlers = function(element_id, event, fn) {
		return (HANDLERS[element_id] || []).filter(function(handler) {
		return handler && (!event || handler.event === event) && (!fn || handler.callback === fn) }
	)};

	_unsubscribe = function(element, event, callback) {
		var element_id;
		element_id =  _getElementId(element);
		return _findHandlers(element_id, event, callback).forEach(function(handler) {
			delete HANDLERS[element_id][handler.index];
			return nmg.fn.removeHandler(element, handler.event, handler.proxy);
		});
    };
	
	_getEventName = function(event){
		var ret = typeof eventFix[event] == 'undefined' ? event : eventFix[event];
		return ret;
	};

	_getCallBack = function(callback){
		var hasHandleEvent = typeof callback.handleEvent == 'function';
		return {
			callback : hasHandleEvent ? callback.handleEvent : callback
			,target : hasHandleEvent ? callback : undefined
		};
	};

    nmg.fn.bind = function(event, callback) {
		var callbackInfo = _getCallBack(callback);
		event = _getEventName(event);
		_forEach.call(this, function(element, index){
			element._index = index;
			var callbackTarget = !!callbackInfo.target ? callbackInfo.target : element;
			_subscribe(element, callbackTarget, event, callbackInfo.callback);
		});
	};
        
	nmg.fn.unbind = function(event, callback) {
		var callbackInfo = _getCallBack(callback);
		event = _getEventName(event);
		_forEach.call(this, function(element){
			_unsubscribe(element, event, callbackInfo.callback);
		});
	};

	nmg.fn.addHandler =  function(ele, type, handler){
		if(ele.addEventListener){
			ele.addEventListener(type,handler,false);
		}else if(ele.attachEvent){//IE8-
			ele.attachEvent('on' + type,handler);
		}else{
			ele['on' + type] = handler;
		}
	};

	nmg.fn.removeHandler =  function(ele, type, handler){
		if(ele.removeEventListener){
			ele.removeEventListener(type,handler,false);
		}else if(ele.detachEvent){
			ele.detachEvent('on' + type, handler);
		}else{
			ele['on' + type] = null
		}
	};
	
	nmg.preventDefault = function(evt){
		if( evt && evt.preventDefault ) evt.preventDefault();
		else window.event.returnValue = false; 			
	};

	// ��˻�݆�¼����󣬫@ȡ�Ƿ����L
	nmg.isWheelDown= function( event ){
		var ret = false;
		if( nmg.browser.isFirefox ){
			if( event.detail > 0 ){
				ret = true;
			}else{
				ret = false;
			}
		}else{
			if( event.wheelDelta < 0 ){
				ret = true;	
			}else{
				ret = false;
			}
		}
		return ret;
	}
})(DS);

//Animation
(function(nmg) {
	"use strict";
	var tween, getJsonMap, css, init, go, play, stop, delay, Animate, _getTime;

	tween = {
		eain:function(t, b, c, d){ return - c * (t /= d) * (t - 2) + b}
	};

	getJsonMap = function(jsonMap){
		var arr = [];
		var a = null;
		for(a in jsonMap){
			var json = {};
			var test = String(jsonMap[a]).match(/(-*\d+)($|([a-z]+))/);
			json.interval = null;
			json.style = a;
			json.val = typeof jsonMap[a] == "number" ? jsonMap[a] : parseFloat(test[1]);
			json.px = test[3];
			arr[arr.length] = json;
		}
		return arr;
	};

	//��ȡElement����css����ֵ
	css = window.getComputedStyle ?
		function(a, b, c){
			if( c == undefined){
				b = b.replace(/([A-Z])/g, "-$1");
				b = b.toLowerCase();
				return window.getComputedStyle(a, null).getPropertyValue(b);
			}else{
				a.style[b] = c;
			}
		}
		:function(a, b, c){
			if( c == undefined){
				if(b == "opacity"){
					return a.style.filter.indexOf("opacity=") >= 0 ? parseFloat(a.style.filter.match(/opacity=([^)]*)/)[1]) / 100 : "1";
				}else { 
					return a.currentStyle[b] == "auto" ? 0 : a.currentStyle[b];}
				}else{
				if(b == "opacity"){
					a.style.filter = (a.filter || "").replace(/alpha\([^)]*\)/, "") + "alpha(opacity=" + c * 100 + ")";
				}else{ 
					a.style[b] = c 
				}
			}
		}; 

	go = function(element, style, val, callBack, time, px, systemCallBack){
		px = px || '';
		var b = parseFloat( css(element, style) ) || 0;
		val = val - b;
		var st = new Date().getTime();
		var a = setInterval(function(){
			var t = new Date().getTime() - st;
			if( t > time){
				t = time;
				clearInterval(a);
				callBack&&callBack(element);
			}
			css(element, style, parseFloat(tween.eain(t, b, val, time))+ px, 2);
			}, 10);
		return a;
	};

	play = function(element){
		var config = element._animateConfig;
		if(config.delay){
			setTimeout(function(){ play(element); }, config.delay);
			element._animateConfig.delay = 0;
			return element;
		}

		var callBack = config.callBack;
		var time = config.time;
		var i = 0;
		var j = 0;
		var len = config.jsonMap.length;

		var systemCallBack = function(){
			if(++j == len){
				callBack && callBack(element);
			};
		}

		for(; i<len; i++){
			var style = config.jsonMap[i].style
				,val = config.jsonMap[i].val
				,px = config.jsonMap[i].px;
			element._animateConfig.jsonMap[i].interval = go(element, style, val, callBack, time, px, systemCallBack);
		}
		return element;
	};

	nmg.speeds = {		
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	};

	nmg.getTime = function(speed){
		var time;
		time = nmg.speeds['_default'];
		if( typeof speed == 'string' ){
			typeof nmg.speeds[speed] != 'undefined' && ( time = nmg.speeds[speed] );
		}else if( typeof speed == 'number' ){
			time = speed; 
		}
		return time;
	};

	nmg.fn.animate = function(jsonMap, speed, callBack){
		typeof speed == 'function' && ( callBack = speed );
		_forEach.call(this, function(element, index, array) {
			element['_animateConfig'] = {
				delay:0,
				jsonMap:getJsonMap(jsonMap),
				time: nmg.getTime(speed),
				callBack: callBack && callBack.bind(element)
			};
			element = play(element);
		});
		return this;
	};

	nmg.fn.fadeIn= function(speed, callBack){
		this.css('opacity', 0);
		this.show();
		typeof speed == 'function' && ( callBack = speed );
		nmg.fn.animate.call(this, { opacity: '1' }, nmg.getTime(speed), callBack);
	};

	nmg.fn.fadeOut= function(speed, callBack){
		typeof speed == 'function' && ( callBack = speed );
		nmg.fn.animate.call(this, { opacity: '0' }, nmg.getTime(speed), callBack);
	}
})(DS);

//CSS Animation
(function(nmg) {
	"use strict";
	var animateTime = 300
		,_in = function(type, cb){ 
			var t = nmg(this)
				,ele = this;
			t.addClass(type).removeClass('out').addClass('in'); 
			if( cb != void 0 && typeof cb == 'function' ){
				setTimeout(function(){ 
					cb.call(ele); 
				}
				, animateTime);
			}
		}
		,_out = function(type, cb){ 
			var t = nmg(this)
				,ele = this;
			t.addClass(type).removeClass('in').addClass('out');
			if( cb != void 0 && typeof cb == 'function' ){
				setTimeout(function(){ 
					cb.call(ele); 
				}
				, animateTime);
			}			
		};

	/* ���뵭�� */
	nmg.fn.fadeIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'fade', cb);
		});			
	};
	nmg.fn.fadeOut = function(cb){ 
		_forEach.call(this, function(element){
			_out.call(element, 'fade', cb);
		});			
	};

	/* ׃��ԭ�ߴ�K���룬ԭ�ߴ絭�� 
	   reverse ԭ�ߴ絭�룬ԭ�ߴ�sС�K����
	*/
	nmg.fn.popIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'pop', cb); 
		});		
	};
	nmg.fn.popOut = function(cb){ 
		_forEach.call(this, function(element){
			_out.call(element, 'pop', cb); 
		});	
	};

	/* ���һ��룬���󻬳� 
	   reverse �����룬���һ��� 
	*/
	nmg.fn.slideIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'slide', cb);
		});	
	};
	nmg.fn.slideOut = function(cb){ 
		_forEach.call(this, function(element){
			_out.call(element, 'slide', cb);
		});	
	};

	/* ���룬���󻬳� 
	   reverse ���룬���һ��� 
	*/
	nmg.fn.slidefadeIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'slidefade', cb);
		});	
	};
	nmg.fn.slidefadeOut = function(cb){ 
		_forEach.call(this, function(element){
			_out.call(element, 'slidefade', cb);
		});			
	};

	/* ���»��룬����
	   reverse ���룬���ϻ���
	*/
	nmg.fn.slidedownIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'slidedown', cb);
		});	
	};
	nmg.fn.slidedownOut = function(cb){ 
		_forEach.call(this, function(element){
			_out.call(element, 'slidedown', cb);
		});	
	};	

	/* ���ϻ��룬����
	   reverse ���룬���»���
	*/
	nmg.fn.slideupIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'slideup', cb);
		});	
	};		
	nmg.fn.slideupOut = function(cb){
		_forEach.call(this, function(element){
			_out.call(element, 'slideup', cb);
		});	
	};			

	/* �sС�K형r����D90�ȵ����棨ԭʼ�ߴ磩,����형r����D90�ȁK�sС
	   reverse: �sС�K��r����D90�ȵ����棨ԭʼ�ߴ磩,������r����D90�ȁK�sС
	*/
	nmg.fn.flipIn = function(cb){ 
		nmg(document.body).addClass('viewport'); 
		_forEach.call(this, function(element){
			_in.call(element, 'flip', cb);
		});	
	};
	nmg.fn.flipOut = function(cb){ 
		nmg(document.body).addClass('viewport'); 
		_forEach.call(this, function(element){
			_out.call(element, 'flip', cb);
		});	
	};		

	/* 형r����D90�ȵ����棬형r����D90����ʧ
	   reverse: ��r����D90�ȵ����棬��r����D90����ʧ
	*/
	nmg.fn.turnIn = function(cb){ 
		nmg(document.body).addClass('viewport'); 
		_forEach.call(this, function(element){
			_in.call(element, 'turn', cb);
		});	
	};
	nmg.fn.turnOut = function(cb){ 
		nmg(document.body).addClass('viewport'); 
		_forEach.call(this, function(element){
			_out.call(element, 'turn', cb);
		});	
	};

	/* �sС�K���һ��루ԭʼ�ߴ磩���sС���󻬳�
	   reverse: �sС�K�����루ԭʼ�ߴ磩���sС���һ���
	*/
	nmg.fn.flowIn = function(cb){ 
		_forEach.call(this, function(element){
			_in.call(element, 'flow', cb);
		});	
	};
	nmg.fn.flowOut = function(cb){ 
		_forEach.call(this, function(element){
			_out.call(element, 'flow', cb);
		});	
	}
})(DS);

//Mobile ( �����]PC�� )
var IndexedDB_Config = {
	// �汾��(number)
	dbVersion : 1
	// ͼƬ·��(array)
	,photoURLs : []
};
(function(nmg) {
	"use strict";
	/* ���_����ˢ�����r�[�ص�ַ�� */
	nmg.hideAddressBar = function(){
		window.onload = function(){
			setTimeout(function(){
				window.scrollTo(0, 0);
			}, 0);			
		};
	}
	
	//�@ȡ�DƬ��ԭʼ����
	nmg.getOriginalWidthOfImg = function(a) {
		var b = new Image;
		b.src = nmg(a).attr('src');
		return b.width;
	};

	nmg.getOriginalHeightOfImg = function(a) {
		var b = new Image;
		b.src = nmg(a).attr('src');
		return b.height;
	};
	
	/* ����JS
	* url : script·��
	* cb  : script���d�ɹ��c�񶼻��{
	* charset  : script �ַ���, eg: utf-8, gbk...
	*/
	nmg.importJs = function(url, cb, charset) {
		var scriptEle = document.createElement("script");
		scriptEle.src = url;
		if( !!charset ){
			scriptEle.charset = charset;
		};
		// IE NOT SUPPORT <script> onload/onerror
		// ����IE http://blog.andrewcantino.com/blog/2008/11/23/replacement-for-script-onload-in-ie/
		scriptEle.onload = function() {
			var t = this;
			t.onload = t.onerror = null;
			t.parentNode.removeChild(t);
			if( !!cb ){
				cb(true);
			};
		};
		scriptEle.onerror = function() {
			var t = this;
			t.onload = t.onerror = null;
			t.parentNode.removeChild(t);
			if( !!cb ){
				cb(false);
			};
		};
		document.head.appendChild(scriptEle); // IE: document.documentElement.childNodes.item(0) ��� document.head
	};

	/* �O��Cookie
	* key �ֶ�
	* value ֵ
	* expiresTime �^�ڕr�g
	* secure �Ƿ��԰�ȫ��ʽ���fcookie��Ĭ�J��false
	*    true - document.cookie�@ȡ����
	*    false - document.cookie���ԫ@ȡ
	* tip: 
	*	1.�����O��cookie,host/baseDomain�ֶΌ����
	*      �����������O�ã��g�[���Ԅ����
	*	2.�^��cookieӛ䛣�document.cookie�@ȡ����
	*	  ����cookies.splite�������п����ѳ�
	* eg:
	* nmg.cookie.set("theCity", e.cityCode, "30d")
	* nmg.cookie.get("theCity")
	*/	
	nmg.cookie = {
		hasUnits : /[smhdMy]$/
		,toSeconds : {
			s: 1, // ��
			m: 60, // ��
			h: 3600, // С�r
			d: 86400, // ��
			M: 2592e3, // 30��
			y: 31536e3 // 365��
		}
		,encoder: window.encodeURIComponent
		,decoder: window.decodeURIComponent
		,get: function(key) {
			var cookie_obj = nmg.cookie;
			key = cookie_obj.encoder(key) + "=";
			var cookie_len
				,cookie = document.cookie
				,key_pos;
			key_pos = cookie.indexOf(key);
			if( - 1 === key_pos ){
				return undefined;
			}else{
				 key_pos += key.length;
				 /*indexOf( searchvalue,fromindex )
					'abc;bb;tcd;a'.indexOf( ';', 4 ) => 6
				 */
				 cookie_len = cookie.indexOf(";", key_pos);
				 if( -1 === cookie_len ){
					 cookie_len = cookie.length; 
				 };
				 return cookie_obj.decoder( cookie.substring(key_pos, cookie_len) );					
			}
		}
		,set: function(key, value, expiresTime, secure) {
			var cookie_obj = nmg.cookie
				,cookie_arr = [cookie_obj.encoder(key) + "=" + cookie_obj.encoder(value)];
			if ( expiresTime ) {
				var dateObj, l;
				 if( "date" === nmg.toType(expiresTime) ){
					dateObj = expiresTime;
				 }else{
					// '30d'
					if( "string" == typeof expiresTime && cookie_obj.hasUnits.test(expiresTime) ){
						// ȥ����λ
						expiresTime = expiresTime.substring(0, expiresTime.length - 1);
						l = RegExp.lastMatch;		
					}	
					if( !isNaN(expiresTime) ){ // number
						dateObj = new Date;
						dateObj.setTime(dateObj.getTime() + 1e3 * expiresTime * cookie_obj.toSeconds[l || "m"]);
					}
				 };
				 if( dateObj ){
					 cookie_arr.push( "expires=" + dateObj.toUTCString() );
				 }
			};
			if( secure ){
				cookie_arr.push("secure");
			};
			document.cookie = cookie_arr.join(";"); // arr to string
		}
		,del: function(key) {
			var cookie_obj = nmg.cookie;
			// key=; ���Ԅh��cookie
			document.cookie = cookie_obj.encoder(key) + "=";
		}
	}

	/*  localStorage
	*   ����: 50�lӛ�
	*	localstorage	��� cookie
	*	API:
	*	nmg.removeAll();
	*	nmg.storage.removeItem( key );	 key->string
	*	nmg.storage.save( key, value ); //�½� �� ���ü�¼
	*	nmg.storage.getItem( key )	; // ��ȡkey��Ӧֵ
	*/
	nmg.storage = {
		//localStorageΪ��������
		storage: window.localStorage
		,hasStorage: !!window.localStorage
		//�ܼ�¼����
		,SIZE: 50
		//��¼����
		,getNewItemIndex: function() {	
			var t = this;
			if ( t.hasStorage ) {
				if( !window.localStorage.index ){
					try {
						window.localStorage.index = 0;
					} catch(ex) {
						alert(ex);
						return null;
					}	
				}
				return window.localStorage.index 
			}else{
				return null;
			}
		} 
		//key / value������[�洢��storage.map] to Obj
		,keyValueIndexObj: function() {
			if( !!window.localStorage ){
				if( !!window.localStorage.map ){
					//	�����л�
					return JSON.parse( window.localStorage.map );
				}else{	
					return {};
				}
			}else{
				return null;
			}
		} ()
		//�Ƴ����м�¼
		,removeAll: function(){
			var t = this
				 ,storage = t.storage;
				 //items ֻ��	 t.keyValueIndexObj��һ��ֵ����
				 //,items = t.keyValueIndexObj;
			if( t.hasStorage ){
				storage.clear();
				//ά�� keyValueIndexObj	
				t.keyValueIndexObj = {};	
				//ά�� storage.map	  
				storage.map = "{}";
			}
		}
		//�Ƴ�ĳһ����¼	  key->string
		,removeItem: function( key ){
			var t = this
				 ,storage = t.storage;
				 //,items = t.keyValueIndexObj;
			if( t.hasStorage ){
				storage.removeItem( 	t.keyValueIndexObj[key] );	
				//ά�� keyValueIndexObj	 , key->string 
				delete t.keyValueIndexObj[key];	
				//ά�� storage.map	  
				storage.map = JSON.stringify(t.keyValueIndexObj);
			}
		}
		//�Ƴ��ɵ�ֵ����[ά�� keyValueIndexObj	��ά�� storage.map]
		,removeOldValueIndex: function( index ){
			var t = this
				 ,storage = t.storage
				 ,items = t.keyValueIndexObj
				 ,appearTimes = 0
				 //��һ����indexƥ���key
				 ,key;
			for( var i in items ){
				if(	items[i] == index ){
					appearTimes++;
					if( appearTimes == 1 ){
						key = i;	
					}else if( appearTimes == 2 ){
						delete items[key];
						break;
					}
				}
			}
			storage.map = JSON.stringify(items);
		}
		//�����¼
		,save: function( key, value ) {
			var t = this
				,items = t.keyValueIndexObj
				,storage = t.storage
				,index = t.getNewItemIndex();
			if( storage && index !== null ){
				if( key && items[key] ){
					//�޸�����ֵ
					storage.setItem( items[key], value );
				}else{
					storage.setItem( index, value );
					if( key ){
						items[key] = index;
						storage.map = JSON.stringify(items);
						//ά�� keyValueIndexObj	��ά�� storage.map
						t.removeOldValueIndex( index );
					}
					if( ++index === t.SIZE ){ 
						index = 0; 
					}
					storage.index = index;						
				}
			}
		}
		,getItem: function( key ) {
			var t = this
				,items = t.keyValueIndexObj
				,storage = t.storage
				,index = t.getNewItemIndex();
			if( storage && null !== index && key ){
				return storage.getItem(items[key]);
			}else{
				return undefined;
			}
		}
	}

	/*  indexedDB [ Firefox�´惦blob��͈DƬ ]
	*	API:
	*	nmg.indexedDB.removeDatabase();
	*	nmg.indexedDB.getPhotoSRCs( function( SRCs ){ // SRCs ·���б� } );
	*/
	nmg.indexedDB = {   
		// IndexedDB�������ݿ�
		indexedDB : window.indexedDB 
							|| window.webkitIndexedDB 
							|| window.mozIndexedDB 
							|| window.OIndexedDB 
							|| window.msIndexedDB
		,IDBTransaction : window.IDBTransaction 
									|| window.webkitIDBTransaction 
									|| window.OIDBTransaction 
									|| window.msIDBTransaction
		,URL : window.URL || window.webkitURL
		//�Ƿ���Ҫ���»�ȡ��Դ
		,isNeedGetAgain : false
		// IndexedDB ���ݿ�ʵ��
		,request : {}
		// �����ļ�
		,config : IndexedDB_Config
		// �򻯻ص���������
		,Utils : {
			errorHandler: function( err_callback ) {
				return function( event ) {
					if( err_callback ) {
						err_callback( event );
					} else {
						throw new Error( 'û�ж������ʱ�Ļص�����' );
					}
				};
			}
			,request: function ( req, callback, err_callback ) {
				var self = this;
				if ( callback ) {
					req.onsuccess = function ( event ) {
						callback( event );
					};
				}
				req.onerror = self.errorHandler( err_callback );
			}
		}
		// �Ƴ�IndexedDB�����쌍���еĔ�����
		,removeDatabase : function(){
			var self = this;
			self.indexedDB.deleteDatabase( 'database_hjw' );
			console.log( '�ɹ��Ƴ�IndexedDB���ݿ��������ݱ�' );
		}
		// ���IndexedDB���ݿ���ָ�����ݱ����������
		,clear : function( database, storeName ){
			var self = this;
			var clearTransaction = database.transaction( [], self.IDBTransaction.READ_WRITE );
			if( database.objectStoreNames.contains( storeName ) ){
				var clearRequest = clearTransaction.objectStore( storeName ).clear();
				clearRequest.onsuccess = function( event ){
					console.log( '�ɹ����IndexedDB���ݿ���ָ�����ݱ����������' );
				};    
			}else{
				console.log( 'IndexedDB���ݿ��в�����ָ�����ݱ�' );
			}
		}
		// indexedDB��һ�����ݿ�,������԰���������ݱ���������ݱ����ָ�Լ�ֵ����ʽ��ʾ�����ݶ���,�봫ͳ��ά���ݱ��в��졣��
		,db : {}
		// ����һ�����ݱ�
		,createObjectStore : function ( database ) {
			var self = this;
			console.log( '���ڴ������ݱ�' );
			if( !database.objectStoreNames.contains( 'table_hjw' ) ){
				// ����"imgs"���ݱ�
				database.createObjectStore( 'table_hjw' );
				var hasTable = database.objectStoreNames.contains( 'table_hjw' );
				if( hasTable ){
					console.log( 'table_hjw ���ݱ����ɹ�' );
				}
			}else{
				console.log( 'table_hjw ���ݱ��Ѿ�����' );
			}
		}	
		// ��ȡ�DƬSRC, ���{cb���Յ���SRCs {}
		,getPhotoSRCs_work : function( cb ){
			var self = this
				,photoURLs = IndexedDB_Config.photoURLs
				,transaction
				,loadTimes = 0
				,table_name = 'table_hjw' // ���ݿ������_str
				,SRCs = {};
			transaction = self.db.transaction( [ table_name ], self.IDBTransaction.READ_WRITE );
			var objStore = transaction.objectStore( table_name );
			
			for( var i = 0; i < photoURLs.length; i++ ){ 
				var photoURL = photoURLs[i];
				self.Utils.request( objStore.get( photoURL ) , function( photoURL ){
					return function( event ){
								console.log( '��indexedDB ��ȡ ' + photoURL + ' ͼƬ�ɹ�!' );
								loadTimes++;
								var blob = event.target.result;
								SRCs[ photoURL ] = self.URL.createObjectURL( blob );
								if( loadTimes == photoURLs.length ){
									cb( SRCs );
								}
						   };
				}( photoURL ), function( photoURL ){
					return function(){
								console.log( '��indexedDB ��ȡ ' + photoURL + ' ͼƬʧ��!' );
								loadTimes++;
								SRCs[ photoURL ] = null;
								if( loadTimes == photoURLs.length ){
									cb( SRCs );
								}
						   };			
				}( photoURL ) );
			}
		}    
		// �@ȡ�DƬ�YԴ
		,getPhotos : function( cb ){
			var self = this	
				,blobs = {}
				,photoURLs = IndexedDB_Config.photoURLs
				,loadTimes = 0;
			
			for( var i = 0; i < photoURLs.length; i++ ){
				var xhr = new XMLHttpRequest()
					,photoURL = photoURLs[i];
				xhr.open( 'GET', photoURL, true );
				xhr.responseType = 'blob';
				xhr.addEventListener( 'load', function ( photoURL, xhr ) {
					return function(){
								if ( xhr.status === 200 ) {
									console.log( '��ȡ ' + photoURL + ' ͼƬ' );
									var blob = xhr.response;
									console.log( 'Blob : ' + blob );
									loadTimes++;
									blobs[photoURL] = blob;
								}
								else{
									loadTimes++;
									blobs[photoURL] = null;
									console.log( '��ȡ ' + photoURL + ' ͼƬʧ��' );
								}
								if( loadTimes == photoURLs.length ){
									cb( blobs );
								} 
						   };
				}( photoURL, xhr ), false);

				xhr.send();	
			}
		}
		,save : function ( blobs, cb ) {
			var self = this
				,transaction
				,photoURLs = IndexedDB_Config.photoURLs;

			console.log( '���ڽ�ͼƬ���浽IndexedDB���ݿ�' );
			transaction = self.db.transaction( [ 'table_hjw' ], self.IDBTransaction.READ_WRITE );
			var objStore = transaction.objectStore( 'table_hjw' );
			self.Utils.request( objStore, null, function(event){
				console.log( '�@ȡ����������쳣' );
			});

			for( var i = 0; i < photoURLs.length; i++ ){
				var photoURL = photoURLs[i];
				// put( value, key ) ���з���ֵ
				objStore.put( blobs[photoURL], photoURL );
			}
			console.log( '�����ꮅ' );
			if( typeof cb == 'function' ){
				cb();
			}
		}
		// ��ͼƬ���浽IndexedDB cb: openDatabase��@ȡ�����P����
		,savePhotos : function( cb ){
			var self = this
				,photoURLs = IndexedDB_Config.photoURLs;
			if( self.isNeedGetAgain ){ 
				self.getPhotos( function( blobs ){
					self.save( blobs, cb );
				});
			}else{
				cb();
			}
		}
		// ���_������ [ work : ��, cb_work : �ջ��{����]
		,openDatabase : function( work , cb_work ){
			var self = this;
			self.config = IndexedDB_Config;
			self.Utils.request(
				self.request = self.indexedDB.open( 'database_hjw', self.config.dbVersion, 2000 )
				,function(event) {
					console.log( '�ɹ��� �� ���� IndexedDB ���ݿ�' );
					self.Utils.request( self.db = self.request.result, null, function(e){ 
							console.log( '�� �� ���� IndexedDB ���ݿ� ʧ��' );
					});
					//�汾���ƣ��°汾���«@ȡ�ٱ��棬��t�����κ���
					self.savePhotos( function(){
						if( typeof work == 'function' ){
							work( cb_work );
						}					
					});
				}
				,function(event){
					console.log( '�� �� ���� IndexedDB ���ݿ� ʧ��' );
				}
			);    
			self.request.onupgradeneeded = function ( event ) {
				console.log( '����ǰ indexedDB�汾�� Ϊ �� ' 
								  + event.target.result.version 
								  + '�������и��°汾��');
				nmg.indexedDB.isNeedGetAgain = true;
				self.createObjectStore( event.target.result ); // event.target.result �����쌍��
			};
		}
		// ���{cb_work���Յ���SRCs {}
		,getPhotoSRCs : function( cb_work ){
			var self = this;
			self.openDatabase( self.getPhotoSRCs_work.bind(self), cb_work );
		}
	}
})(DS);

//���ɳ��÷���(�����ʽ̎��)
(function(nmg) {
	"use strict";
	var tolang;

	nmg.fn.tolang = function(wrap_id, mode){
		var id = '#' + this.attr('id') + ' '
			,wrapEle = nmg('#' + wrap_id);
		if( mode == void 0 ){
			var tag_a = nmg(id + 'a')
				,lanclass = tag_a.length == 3 ? ['tc', 'sc', 'en'] : ['tc', 'en'];
				
				wrapEle.addClass('tc');
				tag_a.bind('click', function(){
					nmg(id + '.curr').removeClass('curr');
					nmg(this).addClass('curr');
					wrapEle.removeClass('tc sc en');
					wrapEle.addClass(lanclass[this._index]);
				});
		}else if( mode == 'toggle'){
			var tc = nmg(nmg(id + 'a')[0])
				,en = nmg(nmg(id + 'a')[1]);

			en.hide();
			wrapEle.addClass('tc');

			tc.bind('click', function(){
				nmg(this).hide();
				en.show();
				wrapEle.removeClass('tc en');
				wrapEle.addClass('en');
			});
			en.bind('click', function(){
				nmg(this).hide();
				tc.show();	
				wrapEle.removeClass('tc en');
				wrapEle.addClass('tc');
			});			
		}
		return this;
	};

	nmg.fn.toScrollBar = function(){
		var id = this.attr('id');
		if( typeof ScrollEmulate != 'undefined' ){
			new ScrollEmulate(id);
		}else{
			alert('Ո����base_scrollbar.js !');
		}
		return this;
	};

	nmg.fn.toSlideBox = function(speeds){
		var id = '#' + this.attr('id') + ' '
			,time = nmg.getTime(speeds)
			,slidebox_list = nmg(id + '.j_slidebox_list')
			,items = nmg(id + ' .j_slidebox_nav a').length
			,li_width = nmg(id + ' .j_slidebox_item').css('width').toNum()
			,lis_width = li_width * items;

		slidebox_list.css('width', lis_width + 'px');
		
		nmg(id + '.j_slidebox_nav a').bind('click', function(evt){
			nmg(id + ' .curr').removeClass('curr');
			nmg(this).addClass('curr');
			slidebox_list.animate({'left' : -this._index*li_width + 'px'}, time);
		});
		return this;
	};

	nmg.fn.toPageList = function(pages,langVers){
		var fileName, fileName_tem, fragment = document.createDocumentFragment(), c_h, c_a, a_a;
		c_h = function(){
			var tag_h = document.createElement('h1');
			nmg(tag_h).html('�ļ��б�');
			return tag_h;
		};
		c_a = function(){
			var tag_a = document.createElement('a');
			nmg(tag_a).attr('target', '_blank');
			return tag_a;
		};
		a_a = function(fileName){
			var a;
			a = c_a();
			nmg(a).attr('href', fileName);
			nmg(a).html(fileName);
			fragment.appendChild( a );			
		};
		fragment.appendChild(c_h());
		if( nmg.toType(pages) == 'array' ){
			//name1,name2,name3,....
			pages.forEach(function(name){
				fileName = name + '.html';
				a_a(fileName);	
			});
		}else{
			// p1_sc,p1_en,p1_tc,....
			for(var i = 1; i < pages + 1; i++){
				fileName_tem = 'p' + i +'_';
				for( var j = 0; j < langVers.length; j++ ){
					fileName = fileName_tem + langVers[j] + '.html';
					a_a(fileName);	
				}
			}
		}
		this[0].appendChild(fragment);
		this.addClass('j_pageList');

		return this;
	};
	//#xxx#׃��ɫ��TextArea
	nmg.fn.toTextArea = function(){
		this.find('textarea').bind('input',function(e){
			var html = this.value.replace(/\n/g,'<br>').replace(/\s/g,'&nbsp;')
				,bg = nmg(this.parentNode).find('.j_bg');
			bg[0].innerHTML = html.replace(/#([^#]*)#/g, "<span class='j_spanbg'>#$1#</span>" );
		});	
	};
})(DS);

