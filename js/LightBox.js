define(['jquery','Widget'],function($,w) {
	function LightBox(config){
		this.extend(config);
		// console.log(this.config);
	};
	LightBox.prototype=$.extend({},new w.Widget(),{
		renderUI:function(){
			/*生成小图部分*/
			this.groupContainer=$('<div class="pic_s_container"></div>');
			for (var i =0;i<= this.config.pics.length-1;i++) {
				var groupItem=this.config.pics[i];
				var groupItemDom=$('<div class="picGroup_s"></div>');
				var groupItemHeader=$('<h3>第'+(i+1)+'组图片</h3>');
				var groupItemContainer=$('<div class="imgs_container_s"></div>');
				for (var j=0;j<= groupItem.length- 1; j++) {
					var imgDom=$('<img class="pic_s" groupIdx="'+(i+1)+'"index="'+(j+1)+'"text="'+groupItem[j].desc+'" src="'+groupItem[j].src+'" width="100" height="100"/>');
					groupItemContainer.append(imgDom);
				};
				groupItemDom.append(groupItemHeader);
				groupItemDom.append(groupItemContainer);
				this.groupContainer.append(groupItemDom);
			}
			$('body').append(this.groupContainer);
			// console.log('renderUI');
			this.maskDom=$('<div class="lightBox_mask"></div>');
			this.displayBoxDom=$('<div class="display_box"></div');
			this.prev_btn=$('<span class="prev_btn"><span class="prev_icon"></span></span>');
			this.display_img=$('<img src="images/loading.gif" class="display_img loading_img"/>');
			this.next_btn=$('<span class="next_btn"><span class="next_icon"></span></span>');
			this.displayDescDom=$('<div class="display_desc"></div>');
			this.descTextDom=$('<div class="desc_text"></div>');
			this.close_btn=$('<span class="close_btn"></span>');

			this.displayBoxDom.append(this.prev_btn);
			this.displayBoxDom.append(this.display_img);
			this.displayBoxDom.append(this.next_btn);
			this.displayDescDom.append(this.descTextDom);
			this.displayDescDom.append(this.close_btn);
			this.displayBoxDom.append(this.displayDescDom);

			$('body').append(this.maskDom);
			$('body').append(this.displayBoxDom);
			this.prev_btn.hide();
			this.next_btn.hide();
			this.maskDom.hide();
			this.displayBoxDom.hide();
		},
		/*展示框淡入*/
		firstFadeIn:function(e){
			// console.log('click');
			var imgDom=e.data.imgDom;
			var src=imgDom.attr('src');
			var text=imgDom.attr('text');
			var index=imgDom.attr('index');
			var groupIndex=imgDom.attr('groupIdx');
			var winWidth=$(window).width();
			var winHeight=$(window).height();

			e.data.global.displayDescDom.hide();
			//遮罩层淡入
			e.data.global.maskDom.fadeIn();
			//弹出框初始位置和大小设置
			e.data.global.displayBoxDom.css({
				width:winWidth*0.5,
				height:winHeight*0.5,
				left:winWidth*0.5/2+'px',
				top:-winHeight+'px',
			})//淡入+下移动画
			.fadeIn().animate({
				top:winHeight*0.5/2+'px',
			},700,
			//伸缩大小+加载图片
			function(){
				e.data.global.loadPic(src,index,groupIndex);
				e.data.global.afterLoadPic(index,groupIndex,text);
				
			});
		},
		loadPic:function(src){
			//获取该图片的大小
			var _this=this;
			var callback=function(){
				//设置src是为了获取大小，并没有真的展示
				_this.display_img.attr('src',src).removeClass('loading_img');
				var picWidth=_this.display_img.width();
				var picHeight=_this.display_img.height();
				_this.display_img.attr('src',_this.config.loading_src).addClass('loading_img');
				//伸缩大小
				console.log('src:'+src+';old:'+picWidth+'-----'+picHeight);
				var sizeObj=_this.changPic(picWidth,picHeight);
				//图片淡入
				_this.displayBoxDom.animate({
					left:($(window).width()-sizeObj.width)/2+'px',
					top:($(window).height()-sizeObj.height)/2+'px',
					width:sizeObj.width,
					height:sizeObj.height
				},600,function(){
					// console.log(_this.display_img);
					_this.display_img.removeClass('loading_img').
					attr('src',src).css({
						width:sizeObj.width,
						height:sizeObj.height
					}).fadeIn();
				});
			};
			//加载图片
			var img=new Image();
			if(!!window.ActiveXObject){
				img.onreadystatechange==function(){
					if(this.readyState=='complete')
						callback();
				}
			}else{
				img.onload=function(){
					callback();
				}
			}
			//设置图片
			img.src=src;
		},
		//伸缩大小
		changPic:function(width,height){
			var _this=this;
			var winWidth=$(window).width()*0.8;
			var winHeight=$(window).height()*0.8;
			var per_x=width/winWidth;
			var per_y=height/winHeight;
			//两个方向均超出
			if(per_x>1 && per_y>1) {
				if(per_x>=per_y) {
					height=winHeight/per_x;
					width=winWidth;
				}else if(per_y>per_x){
					width=winWidth/per_y;
					height=winHeight;
				}
			}
			//横向超出
			else if(per_x>1){
				height=winHeight/per_x;
				width=winWidth;
			}
			//垂直方向超出
			else if(per_y>1){
				width=winWidth/per_y;
				height=winHeight;
			}
				
			console.log('new:'+width+'-----'+height);
			return {width:width,height:height};
			
		},
		//加载图片后，设置index、groupIdx、desc...
		afterLoadPic:function(index,groupIndex,descText){
			this.display_img.attr('index',index);
			this.display_img.attr('groupIdx',groupIndex);
			this.descTextDom.text(descText);
			this.displayDescDom.show();
			this.close_btn.show();
		},
		bindUI:function(){
			var _this=this;
			$('.pic_s').each(function(){
				// console.log('bindUi');
				$(this).on('click',{global:_this,imgDom:$(this)},_this.firstFadeIn);
			});
			this.maskDom.on('click',{global:_this},this.closeFunc);
			this.close_btn.on('click',{global:_this},this.closeFunc);
			this.displayBoxDom.on('mouseover',{global:_this},this.showPrevOrNext);
			this.displayBoxDom.on('mouseout',{global:_this},this.hidePrevOrNext);
			this.prev_btn.on('click',function(){
				var index=parseInt(_this.display_img.attr('index'));
				index--;
				var groupIndex=parseInt(_this.display_img.attr('groupIdx'));
				var text=_this.config.pics[groupIndex-1][index-1].desc;
				console.log(text);
				var item=$('[index='+index+'][groupIdx='+groupIndex+']');
				// console.log(item);
				var src=item.attr('src');
				_this.display_img.attr('src',_this.config.loading_src).css({
					width:'auto',
					height:'auto'
				}).addClass('loading_img');
				// debugger
				_this.loadPic(src);
				_this.afterLoadPic(index,groupIndex,text);
			});
			this.next_btn.on('click',function(){
				var index=parseInt(_this.display_img.attr('index'));
				index++;
				var groupIndex=parseInt(_this.display_img.attr('groupIdx'));
				var text=_this.config.pics[groupIndex-1][index-1].desc;
				console.log(text);
				var item=$('[index='+index+'][groupIdx='+groupIndex+']');
				// console.log(item);
				var src=item.attr('src');
				_this.display_img.attr('src',_this.config.loading_src).css({
					width:'auto',
					height:'auto'
				}).addClass('loading_img');
				// debugger
				_this.loadPic(src);
				_this.afterLoadPic(index,groupIndex,text);
			});
		},
		closeFunc:function(e){
			e.data.global.maskDom.fadeOut();
			e.data.global.displayBoxDom.fadeOut();
			e.data.global.display_img.attr('src',e.data.global.config.loading_src).
			css({width:'auto',height:'auto'}).addClass('loading_img');
		},
		showPrevOrNext:function(e){
			var index=e.data.global.display_img.attr('index');
			var groupIndex=e.data.global.display_img.attr('groupIdx');
			// console.log(e.data.global.config.pics[groupIndex-1]);
			var groupSize=e.data.global.config.pics[groupIndex-1].length;
			if(index>1)	e.data.global.prev_btn.show();
			if(index<groupSize) e.data.global.next_btn.show();
		},
		hidePrevOrNext:function(e){
			e.data.global.prev_btn.hide();
			e.data.global.next_btn.hide();
		},

	});
	return{LightBox:LightBox};
});