require.config({
	paths: {
        jquery: 'jquery-1.9.1.min'
    },
});
require(['jquery','LightBox'],function($,lb){
	var lightBox=new lb.LightBox({
		pics:[
				[	{src:'images/1-1.jpg',desc:'abcccccccccccccccccccccc'},
					{src:'images/1-2.jpg',desc:'katingcheCar............'},
					{src:'images/1-3.jpg',desc:'moutaining...............................'},
					{src:'images/1-4.jpg',desc:'moutaining...............................'},
					{src:'images/1-5.jpg',desc:'moutaining...............................'},
				],
				[
					{src:'images/2-1.jpg',desc:'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk'},
					{src:'images/2-2.jpg',desc:'kojohihishfdjdshfwheruhewfbjkdvhdgfbwfef'},
					{src:'images/2-3.jpg',desc:'kojohihishfdjdshfwheru...........kojohihishfdjdshfwheru'}
				],
				[
					{src:'images/3-1.jpg',desc:'kojohihishfdjdshfwherukojohihishfdjdshfwherukojohihishfdjdshfwheru'},
					{src:'images/3-2.jpg',desc:'kojohihishfdjdshfwherusfdsfdsfdsfdsfsdffsfddsfds'},
					{src:'images/3-3.jpg',desc:'kojohihishfdjdshfwherusdfsfsafwefwfwfewjuiuoiuouiyu'}
				],
		],
	}).render();
});