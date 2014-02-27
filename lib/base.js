// 避免IE警告提示框
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/***************************************************************************************************************
    模拟ECMAScript5常用的API
    說明：
    1.覆蓋原生Array.prototype.indexOf 與 Array.prototype.lastIndexOf方法
      --理由：避免[123,3,5].indexOf(new Number(123)) = -1的情況
    2.除上述兩個，餘下的優先採用瀏覽器原生方法
****************************************************************************************************************/
if(!Function.prototype.bind){
    Function.prototype.bind = function (boundThis) {
        var _slice = [].slice,
            //this預綁定參數方法
            targetFunction = this,
            boundArgs = _slice.call(arguments, 1),
            F = function () {
                //作為構造器的情況
                if(this instanceof F){
                    //採用new方式調用F(this == fn的一個實例)
                    var obj,
                        ret,
                        //新建一個構造器
                        temp = function () {};
                    temp.prototype = targetFunction.prototype;
                    obj = new temp;//obj只擁有目標函數的原型，不具備實例變量
                    ret = targetFunction.apply(obj, boundArgs.concat(_slice.call(arguments)));
                    //允許目標函數返回自身，IE8-與其他瀏覽器行為保持一致
                    return (typeof ret == 'object' || typeof ret == 'function') && ret !== null ? ret : obj;
                }
                //採用普通方式調用F(this == window)
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
            f.call(oThis, this[i], i, this); //p1 上下文环境 p2 数组元素 p3 索引 p4 数组对象
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

//比较对象是否于参数obj 相等..
function compare(obj1, obj2) {
    if (obj1 == null || obj2 == null) return (obj1 === obj2);
    //避免[1,2,3].constructor != ele('iframe').contentWindow.Array->obj1.constructor.toString() == obj2.constructor
    return (obj1 == obj2 && obj1.constructor.toString() == obj2.constructor);
}

//修复ff等其他实现 indexOf方法的浏览器中值类型于引用类型比较相等性一律返回false问题
Array.prototype.indexOf = function(obj) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (compare(this[i], obj)) return i;
    }
    return -1;
}

//修复ff等其他实现 indexOf方法的浏览器中值类型于引用类型比较相等性一律返回false问题
Array.prototype.lastIndexOf = function(obj) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (compare(this[i], obj)) return i;
    }
    return -1;
}

if (!String.prototype.trim) {
    var trimBeginRegexp = /^\s+/; // /\s+/ == /^\s+/ == /^\s+/g (IE8-要顯式用/^\s+/)
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
        //IE8- 与DOM书写顺序相反,倒序处理
        return c.reverse();
    }
}

//擴展字符串提取數字
String.prototype.toNum = function () {
    var regexp = /^-*\d+/
        ,result = String(this).match(regexp)[0]; //String(this).match 返回類型數組
    return result == null ? 0 : parseFloat(result);
};

/*格式化日期
    eg:
    (new Date).format("yy年MM月dd紀念日"); // 13年05月09紀念日
    (new Date).format("yyyy年M月d紀念日"); // 2013年5月9紀念日
    (new Date).format("yyyy\u5e74M\u6708d\u65e5"); // 2013年5月9日
*/
Date.prototype.format = function(a) {
    var b = {
        // ‘+’輔助生成reg
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
        0 : "\u65e5", //日
        1 : "\u4e00", //一
        2 : "\u4e8c", //二
        3 : "\u4e09", //三
        4 : "\u56db", //四
        5 : "\u4e94", //五
        6 : "\u516d"  //六 
        // \u6708 月
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
                //不補0
                replace = b[d];
            }else{
                //補0
                var len = ("" + b[d]).length;
                replace = ("00" + b[d]).substr(len);
            }
            a = a.replace(RegExp.$1, replace);
        }
    }
    return a;
}

/***************************************************************************************************************
    微型庫
    1.基於ECMAScript5
    2.API遵循Jquery
    3.兼容Mobile,Desktop
    4.收納項目中常用方法
****************************************************************************************************************/
var DS
    ,Q;

DS = (function() {
    var nmg, EMPTY_ARRAY, _slice;
    _slice = [].slice;
    EMPTY_ARRAY = [];
    nmg = function(selector) {
        var dom;
        /*  對象獲取器參數
            1.selector：選擇符 string 或對象 document / element / window / documentFragment
        */
        dom = nmg.getDOMObject(selector);
        return Q(dom);
    };
    Q = function(dom) {
        /*  
            1.dom.__proto__ = Q.prototype; // DOM Object->webkit SUPPORT,FF等 NOT SUPPORT
            2.for(var fn in Q.prototype){ dom.__proto__[fn] =  Q.prototype[fn]; } // 當擴展方法與DOM Object屬性同名時失效 如style
            處理：將DOM Object組裝到數組。之後問題：
            1.dom.__proto__ = Q.prototype; // IE8- NOT SUPPORT
            處理：對數組逐一添加擴展的方法
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
    //fn 旗下方法賦予給通過nmg('id')獲取的DOM元素，但不具備nmg.xxx類似的方法
    Q.prototype = nmg.fn = {};
    return nmg;
})();

window.DS = DS;

"nmg" in window || (window.nmg = DS);

//特性檢測
// 检测是否支持csstransforms 2d
;window.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!D("transform")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+s.join(" "):""),e}(this,this.document);
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
            cstr = str.charAt(0).toUpperCase() + str.substr(1),  //首字母转换成大写
            rstr = (cstr + ' ' + css3s.join(cstr + ' ') + cstr).split(' '),//属性都加上前缀
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
        // 是否支持oninput事件
        ,hasOnInput : typeof ipt.oninput == 'object'
        // 是否支持觸屏事件
        ,hasTouch : "ontouchstart" in window
        ,has3d : has3d()
        ,hasTranslate2d : Modernizr.csstransforms
    };
    return support;
})();

//檢測器
nmg.browser = (function() {
    "use strict";
     var ua = navigator.userAgent.toLowerCase()
          // Opera已经采用Webkit内核了，该判断已失效
          //,isOpera = /opera/.test(ua) ---- deleted
          ,isAndroid = /android/.test(ua)
          ,isUC = navigator.appVersion.indexOf('UC') != -1
          ,isMeeGo = /meego/.test(ua)
          ,isWP = /windows phone os/.test(ua)
          ,isIOS = /mac os/i.test(ua)
          ,is360 = /360browser/.test(ua)
          ,isChrome = /chrome/.test(ua) && !is360; // 360瀏覽器ua包含chrome字樣
    return {
        /* tip：原生ua與海豚瀏覽器一致 */
        ua_lowerCase : ua.toLowerCase()
        //设备检测
        ,isIPad : /ipad/.test(ua) 
        ,isIPhoneOrIPod : /iphone/.test(ua) || /ipod/.test(ua)
        ,isNexus7 : window.devicePixelRatio == 1.3312499523162842 //临时
        //系统检测
        ,isIOS : isIOS 
        ,isAndroid : isAndroid
        ,isWP : isWP
        ,isMeeGo : isMeeGo 
        //浏览器检测
        ,isUC : isUC 
        //,isOpera : isOpera ---- deleted
        /*
           USER-AGENT
           IE10: Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)
           IE11: Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv 11.0) like Gecko
           特点：IE11去除‘MSIE’字样，新增其他现代浏览器均有的标识‘like Gecko’
                 应采用‘trident’判断IE
        */
        ,isIE : /msie/.test(ua) || /trident/.test(ua)       
        //半稳健 除了UC Opera Mobile/HD 还有其他浏览器，如QQ浏览器等
        //,isAndroidOriginalBrowser : isAndroid && !isUC && !isOpera  "&& !isOpera" ---- deleted
        ,isAndroidOriginalBrowser : isAndroid && !isUC
        ,isDesktop : !isWP && !isIOS && !isAndroid && !isMeeGo && !/opera mobi/.test(ua) //半穩健_已使用 手机系统还有塞班等
        ,isSamSungPad : window.devicePixelRatio == 1 && !isIOS //不穩健 Android下的UC等瀏覽器也可能與此判斷匹配
        /* IE/Safari/Chrome的ua也有mozilla字樣 */
        ,isFirefox : /firefox/.test(ua)
        ,isSafari : /safari/.test(ua) && !isChrome 
        ,is360 : is360
        ,isChrome : isChrome
        ,isWebkit : /webkit/.test(ua)
        ,isBaidu : /baidubrowser/.test(ua)
        ,isQQ : /mqqbrowser/.test(ua)
        ,isMaxthon : /maxthon/.test(ua) // 傲遊
        //特性检测
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

//全局變量
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
    //nmg.browser.isOpera ? "O": ---- deleted
    ,vendor = nmg.browser.isWebkit ? "webkit":
                nmg.browser.isFirefox ? "Moz": 
                nmg.browser.isIE ? "ms":
                ""
    // Page Visibility API : document[DOCUMENT_HIDDEN_ATTR] 获取页面选项卡是否隐藏
    ,DOCUMENT_HIDDEN_ATTR = document['hidden'] !== undefined ? 'hidden' 
                            : document[vendor.toLowerCase() + 'Hidden'] !== undefined ? vendor.toLowerCase() + 'Hidden' 
                            : undefined     
    ,eventFix = {
        click: nmg.support.hasTouch ? 'touchstart' : 'click'
        ,resize: "onorientationchange" in window ? "orientationchange": "resize"
        ,mousedown: nmg.support.hasTouch ? "touchstart" : "mousedown"
        ,mousemove: nmg.support.hasTouch ? "touchmove" : "mousemove"
        ,mouseup: nmg.support.hasTouch ? "touchend" : "mouseup"
        ,mouseleave: nmg.browser.isWebkit ? "mouseout" : "mouseleave"
        /* 
            1. 'onwheel' : DOM 3 標準：Firefox 17+ ie9+
            2. 'onmousewheel' : 只有firefox不支持
            3. 'DOMMouseScroll' : 只有firefox支持
        */
        ,mousewheel: nmg.browser.isFirefox ? 'DOMMouseScroll' : 'mousewheel'
        /*
            //不使用"oTransitionEnd"原因:opera event.type为'otransitionend'
            nmg.browser.isOpera ? 'otransitionend': ---- deleted
        */
        ,transitionend : nmg.browser.isWebkit ? "webkitTransitionEnd":
            nmg.browser.isFirefox ? "transitionend": 
            nmg.browser.isIE ? "MSTransitionEnd": //IE9 依旧不支持，目前只有IE10支持
            ""
        ,input: nmg.support.hasOnInput ? "input" : "propertychange"
        ,visibilitychange: document['hidden'] !== undefined ? 'visibilitychange'
                           : document[vendor.toLowerCase() + 'Hidden'] !== undefined ? vendor.toLowerCase() + 'visibilitychange' 
                           : undefined  
        ,animationend:  nmg.browser.isWebkit ? "webkitAnimationEnd": 
            nmg.browser.isIE ? "MSAnimationEnd": 
            "animationend"                              
    }
    ,cssFix = {
        transitionduration : vendor + "TransitionDuration"
        ,transform : vendor + "Transform"
        ,translate : vendor + "Transform"
        ,perspective : vendor + 'Perspective'
    }
    ,mouseButton = {
        button:{
            left: 0//IE9已经更正为0，IE8-:nmg.browser.isIE ? 1 : 0(目前不对IE8-做兼容性处理)
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

//DOM(已作鍊式處理)
(function(nmg) {
    /*
        1.不允許參數列表有同名參數
        2.不允許未經聲明的變量
    */
    "use strict";
    var OBJECT_PROTOTYPE, CLASS_SELECTOR, ID_SELECTOR, TAG_SELECTOR, IS_HTML_FRAGMENT, HTML_CONTAINERS
        , _existsClass, _computedStyle, _toElesArray, _find, _getPxCssVal, _sizeAccess, _eq, _Q
        , _createQuerySelectorAll, _createGetElementsByClassName;
    OBJECT_PROTOTYPE = Object.prototype;
    CLASS_SELECTOR = /^\.([\w-]+)$/;
    ID_SELECTOR = /^#[\w\d-]+$/;
    TAG_SELECTOR = /^[\w-]+$/;
    IS_HTML_FRAGMENT = /^\s*<(\w+|!)[^>]*>/;
    HTML_CONTAINERS = document.createElement("div");

    _existsClass = function(name, className) {
        var classes;
        classes = className.split(/\s+/);   //split(/\s+/) == split(/\s+/g)
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

    // HTMLCollection / NodeList 裡的DOM元素抽到數組
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

    /*
    * 服务于IE8-
    * 重点研究--涉及find部分
    * 调用nmg.query的方法
    */  
    _createQuerySelectorAll = function( domain ){
        var s = document.createStyleSheet();
        domain.querySelectorAll = function(r, c, i, j, a) {
            a=domain.all, c=[], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
            for (i=r.length; i--;) {
                s.addRule(r[i], 'k:v');
                for (j=a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
                s.removeRule(0);
            }
            //IE8- 与DOM书写顺序相反,倒序处理
            return c.reverse();
        }
    }   
    
    /*
    * 服务于IE8-
    * 重点研究--涉及find部分
    * 调用nmg.query的方法
    */  
    _createGetElementsByClassName = function( domain ){
        domain.getElementsByClassName = function(classname){  
            var d=domain;  
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

    /*精確獲取數據類型
      eg:
         與typeof 對比：
         typeof new Date // "object"
         nmg.toType(new Date) // "date" 更加精確
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

    /*
    * 修改find实现，联动修改query基础方法
    * 未修改前参数列表：nmg.query = function( selector ) {
    * document替换为domain
    * 重点研究--涉及find部分
    * 调用nmg.query的方法
    * 1.nmg.getDOMObject 锁死宿主为document
    * 2.nmg.fn.find 新增domain参数专为find而设计
    */
    nmg.query = function(domain, selector) { 
        var elements;
        selector = selector.trim();
        if( CLASS_SELECTOR.test(selector) ){
            if( domain != document && typeof domain.getElementsByClassName != 'function' ) {
                _createGetElementsByClassName( domain );
            }
            return _toElesArray( domain.getElementsByClassName(selector.replace(/^./,'')) ); // IE8- NOT SUPPORT
            // return _toElesArray( document.getElementsByClassName(selector.replace(/^./,'')) ); // old
        }else if( ID_SELECTOR.test(selector) ){
            return [ domain.getElementById(selector.replace(/^#/,'')) ];
            // return [ document.getElementById(selector.replace(/^#/,'')) ]; // old
        }else if( TAG_SELECTOR.test(selector) ){
            return _toElesArray(domain.getElementsByTagName( selector ));
            // return _toElesArray(document.getElementsByTagName( selector )); // old
        }else{
            // IE8- 让非document元素拥有QuerySelectorAll，为find方法服务
            if( domain != document && typeof domain.querySelectorAll != 'function' ) {
                _createQuerySelectorAll( domain );
            }
            return _toElesArray(domain.querySelectorAll( selector )); // IE8- NOT SUPPORT
            //return _toElesArray(document.querySelectorAll( selector )); // old
        };
    };

    /*
    * 重点研究--涉及find部分
    * 查找元素部分锁死宿主为document
    */
    nmg.getDOMObject = function(selector) { 
        var elementTypes, type, domobj;
        //節點類型: 1.ELEMENT_NODE 2.ATTRIBUTE_NODE 3.TEXT_NODE 8.COMMENT_NODE 9.DOCUMENT_NODE 11.DOCUMENT_FRAGMENT_NODE
        //http://www.w3schools.com/dom/dom_nodetype.asp
        //Notes: iframe.nodeType -> 1, document.createDocumentFragment().nodeType -> 11, window.nodeType -> undefined
        elementTypes = [1, 3, 9, 11];
        type = nmg.toType(selector);
        
        if (type === "string" && IS_HTML_FRAGMENT.test(selector)) { //創建元素 nmg("<a href='#'></a>")
            domobj = nmg.fragment(selector);
        }else if (type === "string"){
            domobj = nmg.query(document, selector);
            // domobj = nmg.query(selector); // old
        }else if(elementTypes.indexOf(selector.nodeType) >= 0 || selector === window){
            domobj = [selector];
        }else if(nmg.isObjArray(selector)){
            return selector;
        }else if(type === 'htmlcollection' || typeof selector.length == 'number'){
            return _toElesArray(selector);
        }
        return domobj;
    };

    /*
    * “破坏性” 操作
    * 返回：nmg封装的对象
    * 重点研究--涉及find部分
    */
    nmg.fn.find = function(selector) {
        var result;
        // 在一个元素内查找
        if (this.length === 1) {
            result = nmg.query(this[0], selector);
        }
        // 在多个元素内查找 
        else {
            // _result ->[ [original_dom_1], [original_dom_2, original_dom_3].. ] 
            var _result = _map.call(this, function(element, index, array){
                return nmg.query(element, selector);
            });

            // result - >[ original_dom_1, original_dom_2, original_dom_3.. ]
            var result = [];
            _forEach.call( _result, function( elementGroup ){
                result = result.concat( elementGroup );
            });
        }
        return Q(result);
    };

    /*
    * 注析原因：更换find的实现
    * 新实现基于querySelectorAll
    * 支持.find('.box .slt')方式获取对象
    * 更新日期：2013年8月7日
    */  
    // _find = function(selector, Mode){
    //  var ret = []
    //      ,hasChild = function(element){ return element.children.length > 0; }
    //      ,isMatch = function(element){ return  selector == element; }
    //      ,self = this[0]
    //      ,recursion = function(element){ //遞歸
    //          isMatch(element) && self != element && ret.push(element);
    //          if( hasChild(element) ){
    //              _forEach.call(element.children, function(element){
    //                  recursion(element);
    //              });
    //          };
    //      };
    //  if(Mode == 'string'){
    //      selector = selector.trim(); 
    //      if( CLASS_SELECTOR.test(selector) ){
    //          isMatch = function(element){ 
    //              var arr = !!nmg(element).attr('class') ? nmg(element).attr('class').split(' ') : []; 
    //              for(var i = 0; i < arr.length; i++){
    //                  if( arr[i] == selector.replace(/^./,'') )   {
    //                      return true;
    //                  }
    //              };          
    //              return false;
    //          };
    //      }else if( ID_SELECTOR.test(selector) ){
    //          isMatch = function(element){ return nmg(element).attr('id') == selector.replace(/^#/,''); }     
    //      }else if( TAG_SELECTOR.test(selector) ){
    //          isMatch = function(element){ return  element.tagName.toLowerCase() == selector.toLowerCase(); }     
    //      }
    //  }else if(Mode == 'objs'){
    //      isMatch = function(element){
    //          var ret = false;
    //          _forEach.call(selector, function(ele){
    //              if(ele == element){
    //                  ret = true;
    //              }
    //          });
    //          return ret;
    //      };
    //  };
    //  _forEach.call(this, function(element){
    //      recursion(element);
    //  });         
    //  return ret;
    // };
    // nmg.fn.find = function(selector){
    //  var elementTypes, type, ret;
    //  elementTypes = [1, 3, 9, 11];
    //  type = nmg.toType(selector);
    //  if (type === "string") {
    //      ret = _find.call(this, selector, 'string');
    //  }else if(elementTypes.indexOf(selector.nodeType) >= 0){
    //      ret = _find.call(this, selector, 'obj');
    //  }else if( nmg.isObjArray(selector) ){
    //      ret = _find.call(this, selector, 'objs');
    //  }
    //  ret.prevObject = this;
    //  return Q(ret);
    // };

    nmg.fn.end = function(){
        return this.prevObject;
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

    // 移除節點
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

    //自身有返回值，不作鍊式處理
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
                if( property != 'opacity' || nmg.support.hasTranslate2d ){
                    element.style[property] = value;
                }else{
                    element.style.filter = (element.filter || "").replace(/alpha\([^)]*\)/, "") + "alpha(opacity=" + value * 100 + ")";     
                }
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
        //使用this.css('display', 'block') 替代 this.css('display', '')原因，display:none比display:''要更高
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
                    //IE7 返回絕對路徑 修正為this[0].getAttribute( name, 2 )
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
    //自身有返回值，不作鍊式處理
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
        /*safari 在strict Mode下不允許產生未聲明的變量*/
        var st = setTimeout;
        if (nmg.browser.isWebkit) { // safari
            setTimeout(function(){
                if ( READY_EXPRESSION.test(document.readyState) ) {
                    callback();
                } else {
                  setTimeout(arguments.callee,10);
                }
            }, 10); 
        } else if ( nmg.browser.isFirefox && !nmg.browser.isCompatible ) { // moz
            //|| nmg.browser.isOpera ) { // opera/moz ---- deleted
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

    //將event參數正常化
    _getNormalEvent = function(event){
        //不能通過opera 嚴格模式，其他瀏覽器嚴格模式沒問題
        !!event.srcElement && (event.target = event.srcElement);
        //event.point = nmg.support.hasTouch ? event.touches[0] : undefined; // mobile 產生問題
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
    
    /*
    * base.js 扩展
    * 功能：
    * 返回恰当的事件名称
    * 注意：
    * 在eventFix中找不到对应值的以传入的事件名称为准
    **/
    _getEventName = function(event){
        var ret = typeof eventFix[event] == 'undefined' ? event : eventFix[event];
        return ret;
    };

    /*
    * base.js 扩展
    * 功能：
    * 返回响应事件的句柄对象{}
    * 注意：
    * callback为对象a时：[为了配合外部事件]
    * 1.持有handleEvent属性，则{}.callback = a.handleEvent
    * 2.{}.callback的作用域->{}.target = a 
    * callback为普通函数b时：
    * 1.{}.callback = b
    * 2.{}.callback的作用域->{}.target = undefined 
    **/
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

    // 鼠標滑輪事件對象，獲取是否向下滾
    nmg.isWheelDown = function( event ){
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

    //获取Element对象css属性值
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
// 检测是否支持cssanimations
;window.Modernizr=function(a,b,c){function w(a){i.cssText=a}function x(a,b){return w(prefixes.join(a+";")+(b||""))}function y(a,b){return typeof a===b}function z(a,b){return!!~(""+a).indexOf(b)}function A(a,b){for(var d in a){var e=a[d];if(!z(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function B(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:y(f,"function")?f.bind(d||b):f}return!1}function C(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+m.join(d+" ")+d).split(" ");return y(b,"string")||y(b,"undefined")?A(e,b):(e=(a+" "+n.join(d+" ")+d).split(" "),B(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l="Webkit Moz O ms",m=l.split(" "),n=l.toLowerCase().split(" "),o={},p={},q={},r=[],s=r.slice,t,u={}.hasOwnProperty,v;!y(u,"undefined")&&!y(u.call,"undefined")?v=function(a,b){return u.call(a,b)}:v=function(a,b){return b in a&&y(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=s.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(s.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(s.call(arguments)))};return e}),o.cssanimations=function(){return C("animationName")};for(var D in o)v(o,D)&&(t=D.toLowerCase(),e[t]=o[D](),r.push((e[t]?"":"no-")+t));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)v(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},w(""),h=j=null,e._version=d,e._domPrefixes=n,e._cssomPrefixes=m,e.testProp=function(a){return A([a])},e.testAllProps=C,e}(this,this.document);
(function(nmg) {
    "use strict";
    // 不支持css Animations，不覆盖Animation
    if( Modernizr.cssanimations == false ) return;
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

    /* 淡入淡出 */
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

    /* 變大到原尺寸並淡入，原尺寸淡出 
       reverse 原尺寸淡入，原尺寸縮小並淡出
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

    /* 由右滑入，由左滑出 
       reverse 由左滑入，由右滑出 
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

    /* 淡入，由左滑出 
       reverse 淡入，由右滑出 
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

    /* 往下滑入，淡出
       reverse 淡入，往上滑出
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

    /* 往上滑入，淡出
       reverse 淡入，往下滑出
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

    /* 縮小並順時針旋轉90度到正面（原始尺寸）,正面順時針旋轉90度並縮小
       reverse: 縮小並逆時針旋轉90度到正面（原始尺寸）,正面逆時針旋轉90度並縮小
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

    /* 順時針旋轉90度到正面，順時針旋轉90度消失
       reverse: 逆時針旋轉90度到正面，逆時針旋轉90度消失
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

    /* 縮小並由右滑入（原始尺寸），縮小往左滑出
       reverse: 縮小並由左滑入（原始尺寸），縮小往右滑出
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

//集成常用方法(已作鍊式處理)
(function(nmg) {
    nmg.fn.toScrollBar = function(){
        var id = this.attr('id');
        if( typeof ScrollEmulate != 'undefined' ){
            new ScrollEmulate(id);
        }else{
            alert('請引用scroll.js !');
        }
        return this;
    };
    
    /* 多图切换 */
    nmg.fn.toPhotoSlider = function( config ){
        var id = this.attr('id');
        config.id = id;
        if( typeof NMGUI.photoSlider != 'undefined' ){
            new NMGUI.photoSlider( config );
        }else{
            alert('請引用base_photoSlider.js !');
        }
        return this;
    };  

    /* 水平横拨图片 */
    nmg.fn.toHscroll = function( config ){
        var id = this.attr('id');
        if( typeof NMGUI.hScroll != 'undefined' ){
            new NMGUI.hScroll(nmg('#' + id)[0], config);
        }else{
            alert('請引用base_hscroll.js !');
        }
    };      

    /* 图片渐变插件 */
    nmg.fn.toPhotoFade = function( config ){
        var id = this.attr('id')
            ,_config = !!config ? config : {}; 

        if( typeof PhotoFade != 'undefined' ){
            _config.wrapID = id;
            new PhotoFade( _config );
        }else{
            alert('請引用base_photoFade.js !');
        }
    };  
})(DS);
