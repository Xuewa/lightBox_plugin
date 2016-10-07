define(['jquery'],function($){
	function Widget(){

	};
	Widget.prototype={
		extend:function(config){
			this.config=$.extend(this.config,config);
		},
		render:function(){
			this.renderUI();
			this.bindUI();
			return this;
		},
		renderUI:function(){

		},
		bindUI:function(){

		}

	};
	return {Widget:Widget};
});