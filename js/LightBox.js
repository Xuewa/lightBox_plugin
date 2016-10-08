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
			e.data.global.displayDescDom.hide();
			// e.data.global.display_img.hide();
			//遮罩层
			e.data.global.maskDom.fadeIn();
			// console.log(imgDom);
			var src=imgDom.attr('src');
			var text=imgDom.attr('text');
			var index=imgDom.attr('index');
			var groupIndex=imgDom.attr('groupIdx');
			var winWidth=$(window).width();
			var winHeight=$(window).height();
			e.data.global.displayBoxDom.css({
				width:winWidth*.5,
				height:winHeight*.5,
				left:winWidth*.5/2+'px',
				top:-winHeight+'px',
			}).fadeIn().animate({
				top:winHeight*.5/2+'px',
			},700,function(){
				e.data.global.loadPic(src);
				e.data.global.display_img.attr('index',index);
				e.data.global.display_img.attr('groupIdx',groupIndex);
			});
			
		},
		loadPic:function(src){
			//获取该图片的大小
			var _this=this;
			var callback=function(){
				_this.display_img.attr('src',src);
				_this.display_img.removeClass('loading_img');
				var picWidth=_this.display_img.width();
				var picHeight=_this.display_img.height();
				_this.display_img.hide();
				// console.log(picWidth+'-----'+picHeight);
				_this.changPic(picWidth,picHeight);
			};

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
			img.src=src;
		},
		changPic:function(width,height){
			var _this=this;
			var winWidth=$(window).width()*.8;
			var winHeight=$(window).height()*.8;
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
			this.displayBoxDom.animate({
				left:($(window).width()-width)/2+'px',
				top:($(window).height()-height)/2+'px',
				width:width,
				height:height
			},600,function(){
					_this.display_img.css({
						width:width,
						height:height
					}).fadeIn();
				}
			);
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
		},
		closeFunc:function(e){
			e.data.global.maskDom.fadeOut();
			e.data.global.displayBoxDom.fadeOut();
			e.data.global.display_img.fadeOut();
		},
		showPrevOrNext:function(e){
			var index=e.data.global.display_img.attr('index');
			var groupIndex=e.data.global.display_img.attr('groupIdx');
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