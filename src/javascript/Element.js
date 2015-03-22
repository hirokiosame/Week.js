module.exports = (function(){
	'use strict';


	function makeFunction(func){
		return function(){
			var args = [].slice.apply(arguments);

			var el = this.el || args.shift();

			func.apply(el, args);

			return this.el ? this : newInstance(el);	
		};
	}

	function newInstance(el){
		var instance = Object.create(methods);
		instance.el = el;
		return instance;
	}



	var methods = {
		lement: function(tag, options){
			var el = document.createElement(tag);

			if( typeof options === "object" ){
				options.class && this.addClass(el, options.class);
				options.text && (el.innerText = options.text);
				options.html && (el.innerHTML = options.html);
			}

			return el;
		},
		addClass: makeFunction(function(className){

			var split = className.split(" ");

			for( var i = 0; i < split.length; i++ ){
				if( !split[i] ){ continue; }
				if( this.classList ){ this.classList.add(split[i]); }
				else{ this.className = split[i]; }
			}
		}),

		removeClass: makeFunction(function(className){
			if( this.classList ){ this.classList.remove(className); }
			else{
				this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		}),

		hide: makeFunction(function(){
			if( this.style.display !== "none" ){
				this.style.display = "none";
			}
		}),

		show: makeFunction(function(){
			if( this.style.display !== "block" ){
				this.style.display = "block";
			}
		})
	};

	return methods;
})();