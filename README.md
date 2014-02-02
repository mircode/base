# base.js 簡易基礎庫

## 定位：
 - 兼容性：面向pc端、移動設備端。
 - 功能性：能基本滿足前端工作需求。
 - 结构性：简单，易于理解、维护、二次开发。

工具類
======

nmg.support
----------------
检测浏览器CSS3特性，触屏事件。 
``` js
nmg.support.hasTouch //是否支持触屏事件
nmg.support.has3d //是否支持CSS3 3d特性
```

nmg.browser
-----------
检测浏览器种类与设备系统 
``` js
nmg.browser.isIPad //是否IPAD设备
nmg.browser.isIPhoneOrIPod //是否IPhone或IPod设备
nmg.browser.isNexus7 //是否Nexus7设备
nmg.browser.isIOS //是否IOS系统
nmg.browser.isAndroid //是否Android系统  
nmg.browser.isWP //是否WinPhone系统  
nmg.browser.isMeeGo //是否MeeGo系统
nmg.browser.isUC //是否UC浏览器
nmg.browser.isOpera //是否Opera浏览器 
nmg.browser.isIE //是否IE浏览器
nmg.browser.isChrome //是否Chrome浏览器
nmg.browser.isAndroidOriginalBrowser //是否Android原生浏览器
nmg.browser.isDesktop //是否PC端浏览器 
nmg.browser.isSamSungPad //是否三星平板设备
nmg.browser.isFirefox //是否Firefox浏览器
nmg.browser.isWebkit //是否Webkit浏览器 
```

nmg.screen
-----------
獲取瀏覽器窗體寬度與高度 
``` js
nmg.screen.getWidth() //獲取瀏覽器窗體寬度
nmg.screen.getHeight() //獲取瀏覽器窗體高度
```
.extend
-------
扩展对象属性
``` js
nmg.extend(obj, obj_ext); //obj对象已得到扩展
```

DOM
===

.toType()
---------
精确获取对象类型  
``` html
<div id="obj_id"></div>
```
``` js
nmg.toType(nmg('#obj_id')); //返回 "array"
```

.closest()
----------
查找最近的上级元素 
``` html
<div id="obj_id">
   <div class="aaa"></div>
</div>
```
``` js
//返回 [div#obj_id]元素，具备baseJS扩展方法
nmg('.aaa').closest('div');
```

.end()
------
返回首次使用的对象（针对链式调用） 
``` html
<div id="obj_id">
   <div class="aaa"></div>
   <div class="aaa"></div>
</div>
```
``` js
//返回 "obj_id"
nmg('#obj_id').find('.aaa').end().attr('id');
```

.find()
-------
查找元素
``` html
<div id="obj_id">
   <div class="aaa"></div>
   <div class="aaa"></div>
</div>
```
``` js
//返回 [div.aaa, div.aaa]元素，具备baseJS扩展方法
nmg('#obj_id').find('.aaa');
```

.first()
--------
获取第一个元素
``` html
<div class="top">1</div>
<div class="top">2</div>
<div class="top">3</div>
```
``` js
//返回 <div class='top'>1</div> 元素，具备baseJS扩展方法
nmg('.top').first();
```

.last()
-------
获取最后一个元素
``` html
<div class="top">1</div>
<div class="top">2</div>
<div class="top">3</div>
```
``` js
//返回 <div class='top'>3</div> 元素，具备baseJS扩展方法
nmg('.top').last();
```

.eq()
-----
获取第n+1个元素，基于0

- number：元素的位置索引
- 返回：object

``` html
<div class="top">1</div>
<div class="top">2</div>
<div class="top">3</div>
```
``` js
//返回 <div class='top'>2</div> 元素，具备baseJS扩展方法
nmg('.top').eq(1);
```

.fragment()
-----------
将标签转化成object

- string：标签
- 返回：[object,...]

``` html
<div class="top">1</div>
<div class="top">2</div>
<div class="top">3</div>
```
``` js
//返回 [div.aaa]，不具备baseJS扩展方法
nmg.fragment("<div class='aaa'></div>");
```

.clone()
--------
克隆对象，深层拷贝

- 返回：object

``` js
//返回的克隆对象拥有baseJS扩展的方法
nmg('#obj_id').clone();
```

.before()
---------
将某个元素移到自身之前，或添加新元素到自身之前

- object / string：移动的元素 / 标签
- 返回：N/A

``` html
<div id="obj_id"></div>
<div id="obj_id2"></div>

应用后：

<div id="obj_id2"></div>
<div id="obj_id"></div>
``` 
``` js
nmg('#obj_id').before('#obj_id2');
// 等价于
nmg('#obj_id').before(nmg('#obj_id2'));
```
``` html
<div id="obj_id"></div>

应用后：

<p></p>
<div id="obj_id"></div>
``` 
``` js
nmg('#obj_id').before("<p/>");
```

.remove()
---------
移除节点

- 返回：N/A

``` html
<div id="obj_id">
    <div id="obj_id2"></div>
</div>

应用后：

<div id="obj_id"></div>
```
``` js
nmg('#obj_id2').remove();
```

.append()
---------
添加内部元素

- object / string：添加的元素 / 标签
- 返回：N/A

``` html
<div id="obj_id"></div>
<div id="obj_id2"></div>

应用后：

<div id="obj_id">
   <div id="obj_id2"></div>
</div>
```
``` js
nmg('#obj_id').append(nmg('#obj_id2'));
```
``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id">
   <p></p>
</div>
```
``` js
nmg('#obj_id').append(document.createElement("p"));
```
``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id">
   <p></p>
</div>
```
``` js
nmg('#obj_id').append("<p/>");
```

.appendTo()
-----------
将自身添加到某个元素

- string：选择器名
- 返回：N/A

``` html
<div id="obj_id"></div>
<div id="obj_id2"></div>

应用后：

<div id="obj_id2">
    <div id="obj_id"></div>
</div>
```
``` js
nmg('#obj_id').appendTo('#obj_id2');
```

.hasClass()
-----------
是否含有某个class

- string：class名
- 返回：boolean

``` html
<div id="obj_id" class="top bottom"></div>
```
``` js
nmg('#obj_id').hasClass('bottom'); //返回 true
nmg('#obj_id').hasClass('left'); //返回 false
```

.addClass()
-----------
添加class

- string：class名
- 返回：N/A

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id" class="top"></div>
```
``` js
nmg('#obj_id').addClass('top');
```

.removeClass()
--------------
移除class

- string【可选】：class名
- 返回：N/A

``` html
<div id="obj_id" class="top bottom"></div>

应用后：

<div id="obj_id" class="bottom"></div>
```
``` js
nmg('#obj_id').removeClass('top');
```
``` html
<div id="obj_id" class="top bottom left right"></div>

应用后：

<div id="obj_id" class="left right"></div>
```
``` js
nmg('#obj_id').removeClass('top bottom');
```
``` html
<div id="obj_id" class="top bottom left right"></div>

应用后：

<div id="obj_id" class=""></div>
```
``` js
nmg('#obj_id').removeClass();
```

.css()
------
获取、设置css属性

- string：css属性
- 返回：N/A / string

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id" style="transform: translate3d(0px, 28px, 0px);"></div>
```
``` js
//不支持3d的切换为translate:(0,28px)
nmg('#obj_id').css('translate','0,28px');

//返回 "translate3d(0px, 28px, 0px)"
nmg('#obj_id').css('transform')
```

.width()
--------
获取、设置宽度

- string【可选】：宽度
- 返回：N/A / string

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id" style="width:28px"></div>
```
``` js
nmg('#obj_id').width('28px');
nmg('#obj_id').width(); //"28px"
```

.height()
---------
获取、设置高度

- string【可选】：高度
- 返回：N/A / string

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id" style="height:28px"></div>
```
``` js
nmg('#obj_id').height('28px');
nmg('#obj_id').height(); //"28px"
```

.show()
-------
显示

- 返回：N/A

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id" style="display:block;"></div>
```
``` js
nmg('#obj_id').show();
```

.hide()
-------
隐藏

- 返回：N/A

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id" style="display:none;"></div>
```
``` js
nmg('#obj_id').hide();
```

.html()
-------
为元素添加文本内容

- string【可选】：文本内容
- 返回：N/A / string

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id">为元素添加文本内容</div>
```
``` js
nmg('#obj_id').html("为元素添加文本内容");
nmg('#obj_id').html(); //返回 "为元素添加文本内容"
```

.empty()
--------
清空元素包裹的内容

- 返回：N/A / string

``` html
<div id="obj_id"><div></div> 文本</div>

应用后：

<div id="obj_id"></div>
```
``` js
nmg('#obj_id').empty();
```

.attr()
-------
获取或设置元素属性 

- string：属性名
- 可变类型【可选】：属性值
- 返回：可变类型/object

``` html
<div id="obj_id"></div>

应用后：

<div id="obj_id2"></div>
```
``` js
nmg('#obj_id').attr("id"); //返回 "obj_id"
nmg('#obj_id').attr("id", "obj_id2"); //返回 nmg("obj_id")
```

.removeAttr()
-------------
移除元素属性 

- 返回：N/A

``` html
<div id="obj_id" class="current"></div>

应用后：

<div id="obj_id"></div>
```
``` js
nmg('#obj_id').removeAttr("class");
```

.index()
--------
获取元素在兄弟元素中的序列，基于0。
元素不存在 或 没有父级元素，返回-1 

- 返回：number

``` html
<div>
   <div></div>
   <div id="obj_id"></div>
   <div></div>
</div>
```
``` js
nmg('#obj_id').index(); //返回1
```

Event
=====

- 传统事件在触屏设备做了转换
- 1.mousedown =》touchstart
- 2.mousemove =》touchmove
- 3.mouseup =》touchend
- 4.resize =》orientationchange
- 5.click =》touchstart
- 事件兼容
- 1.transitionend =》webkitTransitionEnd || otransitionend || MSTransitionEnd
- 2.input（不支持的浏览器） =》propertychange
- 作用域处理
- 1.当对象作为事件句柄时，对象handleEvent方法的this指向对象自身。针对扩展1中做了转换处理的事件，在分辨事件类型时，使用eventFix，如eventFix.mousedown，eventFix.resize等

.bind()
-------
绑定事件。

- 返回：N/A

``` js
var handler = function(){ alert("I'm handler"); };
nmg('#obj_id').bind('mousedown', handler); //触屏转为touchstart
nmg('#obj_id').bind('mousemove', handler); //触屏转为touchmove
nmg('#obj_id').bind('mouseup', handler); //触屏转为touchend
nmg('#obj_id').bind('resize', handler); //触屏转为orientationchange
nmg('#obj_id').bind('mouseup', handler); //触屏转为touchend
nmg('#obj_id').bind('click', handler); //触屏转为touchstart
nmg('#obj_id').bind('transitionend', handler); //过渡动画结束后触发
nmg('#obj_id').bind('input', handler); //输入字符后触发

var OBJ = function(){
	nmg('#obj_id').bind('mousedown',this);
	nmg('#obj_id').bind('mousemove',this);
	nmg('#obj_id').bind('mouseup',this);
	nmg('#obj_id').bind('resize',this);
	nmg('#obj_id').bind('transitionend',this);
};
OBJ._start = function(event){ alert("mousedown/touchstart") };
OBJ._move = function(event){ alert("mousemove/touchmove") };
OBJ._end = function(event){ alert("mouseup/touchend") };
OBJ._resize = function(event){ alert("resize/orientationchange") };
OBJ._transitionend = function(event){ alert("transitionend") };
OBJ.handleEvent = function(event) {
	var t = this;//this指向OBJ实例
	switch (event.type) {
		case eventFix.mousedown:
			t._start(event);
			break;
		case eventFix.mousemove:
			t._move(event);
			break;
		case eventFix.mouseup:
			t._end(event);
			break;
		case eventFix.resize:
			t._resize(event);
			break;
		case eventFix.transitionend:
			t._transitionend(event);
			break;
	}
};
new OBJ();
```

Animate-JS
==========

.animate()
----------
效果：过渡到变化后的css属性 

- jason object 变化后的css属性
- 动画时间配置【可选】
- 1.string: 动画快慢（快: 200ms，慢: 600ms）
- 2.number: 经历的时间（ms）
- 3.缺省: 400ms
- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#obj_id').animate( { width: '600px' } );

nmg('#obj_id').animate( { width: '600px' }, 'slow');

nmg('#obj_id').animate( { width: '600px' }, 'fast');

nmg('#obj_id').animate( { width: '600px' }, 5000);

nmg('#obj_id').animate( { opacity: '0'}
 , function(){ alert('效果结束'); });

nmg('#obj_id').animate( { opacity: '0', width '500px'}, 5000
 , function(){ alert('效果结束'); });
```

.fadeIn()
---------
效果：淡入 

- jason object 变化后的css属性
- 动画时间配置【可选】
- 1.string: 动画快慢（快: 200ms，慢: 600ms）
- 2.number: 经历的时间（ms）
- 3.缺省: 400ms
- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#obj_id').fadeIn();

nmg('#obj_id').fadeIn( 'fast');

nmg('#obj_id').fadeIn( 'slow', function(){ alert('效果结束'); });
```

.fadeOut()
----------
效果：淡出  

- jason object 变化后的css属性
- 动画时间配置【可选】
- 1.string: 动画快慢（快: 200ms，慢: 600ms）
- 2.number: 经历的时间（ms）
- 3.缺省: 400ms
- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#obj_id').fadeOut();

nmg('#obj_id').fadeOut( 'fast');

nmg('#obj_id').fadeOut( 'slow', function(){ alert('效果结束'); });
```

Animate-CSS
===========

- 依赖animate.css(设置动画时间为300ms)
- 依赖prefixfree.js(用作补充css的前缀)
- 回调函数在动画开始后延时300ms执行

.fadeIn()
---------
效果：淡入 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').fadeIn();
nmg('#objId').fadeIn(function(){ alert("效果结束"); });
```

.fadeOut()
----------
效果：淡出 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').fadeOut();
nmg('#objId').fadeOut(function(){ alert("效果结束"); });
```

.popIn()
--------
效果：缩小到原尺寸並淡入  

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').popIn();
nmg('#objId').popIn(function(){ alert("效果结束"); });
```

.popOut()
---------
效果：原尺寸淡出 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').popOut();
nmg('#objId').popOut(function(){ alert("效果结束"); });
```

.slideIn()
----------
效果：由右滑入

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').slideIn();
nmg('#objId').slideIn(function(){ alert("效果结束"); });
```

.slideOut()
-----------
效果：由左滑出 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').slideOut();
nmg('#objId').slideOut(function(){ alert("效果结束"); });
```

.slidedownIn()
--------------
效果：往下滑入  

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').slidedownIn();
nmg('#objId').slidedownIn(function(){ alert("效果结束"); });
```

.slidedownOut()
---------------
效果：淡出  

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').slideupOut();
nmg('#objId').slideupOut(function(){ alert("效果结束"); });
```

.slideupIn()
------------
效果：往上滑入   

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').slideupIn();
nmg('#objId').slideupIn(function(){ alert("效果结束"); });
```

.slideupOut()
-------------
效果：淡出  

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').slideupOut();
nmg('#objId').slideupOut(function(){ alert("效果结束"); });
```

.flipIn()
---------
效果：縮小並順時針旋轉90度到正面（原始尺寸） 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').flipIn();
nmg('#objId').flipIn(function(){ alert("效果结束"); });
```

.flipOut()
----------
效果：正面順時針旋轉90度並縮小  

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').flipOut();
nmg('#objId').flipOut(function(){ alert("效果结束"); });
```

.turnIn()
---------
效果：順時針旋轉90度到正面 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').turnIn();
nmg('#objId').turnIn(function(){ alert("效果结束"); });
```

.turnOut()
----------
效果：順時針旋轉90度消失 

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').turnOut();
nmg('#objId').turnOut(function(){ alert("效果结束"); });
```

.flowIn()
---------
效果：縮小並由右滑入（原始尺寸）

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').flowIn();
nmg('#objId').flowIn(function(){ alert("效果结束"); });
```


.flowOut()
----------
效果：縮小往左滑出

- 动画结束后回调函数【可选】
- 1.function
- 返回：N/A

``` js
nmg('#objId').flowOut();
nmg('#objId').flowOut(function(){ alert("效果结束"); });
```

Mobile-Setting
==============

.hideAddressBar()
-----------------
效果：打開頁面或刷新頁面時隱藏地址欄

- 返回：N/A

``` js
nmg.hideAddressBar();
```











