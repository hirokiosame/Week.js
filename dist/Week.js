(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Week = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function(){
	
	'use strict';
	
	var E = require("./Element");


	function formatTime(time) {
		var hr = ~~(time/60),
			APM = hr >= 12 ? "PM" : "AM";

		return ((hr = hr%12) ? hr : 12) + ":" + ("0"+(~~time)%60).slice(-2) + APM;
	}


	function findColumn(evnt, columns){

		var i = 0;

		// if( typeof evnt.localColumns !== "number" ){
			evnt.localColumns = 1;
		// }

		// Find a column
		while ( 1 ) {

			// Start with -1
			// acknowledged that no event ends at t = 0
			if( !columns[i] ){ columns[i] = { lastEventEnds: -1, events: [] }; }

			// If currently placed event in column has already ended, secure a spot
			if (columns[i].lastEventEnds <= evnt.start) {
				return i;
			}
			console.log("\tCollision", evnt.name, "with", columns[i].events[columns[i].events.length-1].name);
			console.log("\t\t", evnt.name, "new local:", evnt.localColumns+1);
			console.log("\t\t", columns[i].events[columns[i].events.length-1].localColumns);


			// If it collides, increment number of neighbors
			evnt.localColumns++;

			// Must reciprocate to the event that is being collided with...
			columns[i].events[columns[i].events.length-1].localColumns++;

			// Check next column
			i++;
		}
	}


	function allocate2Columns(events){

		// Sort events
		events.sort(function(a, b) {
			return (a.start - b.start) || (b.end - a.end);
		});

		// Hashmap/Array to allocate events in
		// Each key is a column and holds the ending time of the last entered event
		var columns = {};

		// Allocate each event
		events.forEach(function(evnt){

			console.log("Allocating", evnt.name);

			// Find collumn
			var idx = evnt.inColumn = findColumn(evnt, columns);

			console.log("\tAllocated", evnt.inColumn, evnt.localColumns);

			// Save position in column
			columns[idx].lastEventEnds = evnt.end;

			columns[idx].events.push(evnt);

		});
	}


	function Day(week, name){

		// Reference parent
		this.week = week;

		// Store events
		this.events = [];


		this.$title = E("div", { class: "title", _text: "div", text: name });
		this.$events = E("div", { class: "events" });

		this.$ = E("div", { class: "column day" });
		this.$.append(this.$title, this.$events);

		// var self = this;
		// this.$.addEventListener("click", function(){


		// 	console.log(self.events);
		// });

	}

	Day.prototype.addEvent = function(evnt){

		console.log("\n\nEvent added", evnt.name);

		var _evnt = Object.create(evnt);
		_evnt.$ = E("div", { class: "event" });

		var $time = E("div", { class: "time", text: formatTime(evnt.start) + " ~ " + formatTime(evnt.end) });
		var $name = E("div", { class: "name", text: evnt.name });

		_evnt.$.append( $time, $name );

		this.events.push(_evnt);
		this.render();
	};

	Day.prototype.removeEvent = function(){

		for( var i = 0; i < this.events.length; i++ ){
			console.log( i, this.events[i] );
		}
	};

	Day.prototype.renderEvent = function(evnt){

		console.log("   Rendering event:", evnt.name);
		console.log("   Local Columns:",evnt.localColumns);
		console.log("   In Column:", evnt.inColumn);
		console.log("\n");

		var startPercent = (evnt.start - this.week.start) / (this.week.end - this.week.start) * 100,
			height = (evnt.end - evnt.start ) / (this.week.end - this.week.start) * 100;

		evnt.$._.style.top = startPercent + "%";
		evnt.$._.style.height = height + "%";

		evnt.$._.style.width = (1/(evnt.localColumns)*100) + "%";
		evnt.$._.style.left = (evnt.inColumn/evnt.localColumns*100) + "%";

	};

	Day.prototype.render = function(){

		var self = this;

		console.log("Render invoked");

		allocate2Columns(this.events);

		this.events.forEach(function(evnt){

			self.renderEvent(evnt);

			self.$events.append( evnt.$ );
		});
	};

	Day.prototype.resizeText = function(){

		// console.dir(this.$title);
		// console.log(this.$title.textContent);
		// console.log(this.$title.offsetHeight);
		// console.log(this.$title.offsetWidth);
		// console.log();

		this.$title._.style.fontSize = (this.$title._.offsetHeight/3) + "px";

		this.events.forEach(function(evnt){
			// evnt.$time.style.fontSize = (evnt.$.clientHeight/4.5) + "px";
			// evnt.$name.style.fontSize = (evnt.$.clientHeight/5) + "px";
			evnt.$time._.style.fontSize = (evnt.$._.clientWidth/17) + "px";
			evnt.$name._.style.fontSize = (evnt.$._.clientWidth/19) + "px";
		});
	};

	return Day;
})();
},{"./Element":2}],2:[function(require,module,exports){
module.exports = (function(){
	'use strict';

	function E(){}

	E.prototype.addClass = function addClass(className){
		var split = className.split(" ");

		for( var i = 0; i < split.length; i++ ){
			if( !split[i] ){ continue; }
			if( this._.classList ){ this._.classList.add(split[i]); }
			else{ this._.className = split[i]; }
		}
		return this;
	};

	E.prototype.removeClass = function removeClass(className){
		if( this._.classList ){ this._.classList.remove(className); }
		else{
			this._.className = this._.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
		return this;
	};

	E.prototype.hide = function hide(){
		if( this._.style.display !== "none" ){
			this._.style.display = "none";
		}
		return this;
	};

	E.prototype.show = function show(){
		if( this._.style.display !== "block" ){
			this._.style.display = "block";
		}
		return this;
	};

	E.prototype.on = function on(eventName, eventCallback){
		this._.addEventListener(eventName, eventCallback, false);
		return this;
	};

	E.prototype.off = function off(eventName, eventCallback){
		this._.removeEventListener(eventName, eventCallback);
		return this;
	};

	E.prototype.append = function append(){

		var args = [].slice.apply(arguments);
		for( var i = 0; i < args.length; i++ ){
			this._.appendChild( args[i] instanceof E ? args[i]._ : args[i] );
		}

		return this;
	};

	E.prototype.text = function text(textContent){

		if( this._text ){
			this._text.textContent = textContent;
		}else{
			this._.textContent = textContent;	
		}

		return this;
	};


	return function (el, opts){

		var instance = new E();

		// el is a string
		if( typeof el === "string" ){

			// Create element
			instance._ = document.createElement(el);

			if( typeof opts === "object" ){

				var _opts = Object.create(opts);


				// Text container element
				if( typeof _opts._text === "string" ){

					instance._text = document.createElement(_opts._text);
					instance._.appendChild( instance._text );
				}

				// Inner text
				if( typeof _opts.text === "string" ){
					instance.text(_opts.text);
				}

				// Inner HTML
				if( typeof _opts.html === "string" ){
					instance._.innerHTML = _opts.html;
				}

				// Set everything else as an attribute
				for( var at in _opts ){
					if( _opts[at] ){
						instance._.setAttribute(at, _opts[at]);
					}
				}
			}
		}else{
			instance._ = el;
		}

		return instance;
	};
})();
},{}],3:[function(require,module,exports){
/*jshint unused: false */
module.exports = (function(){

	'use strict';

	var E = require("./Element");

	var Day = require("./Day");


	function formatTime(time) {
		var hr = ~~(time/60),
			APM = hr >= 12 ? "PM" : "AM";

		return ((hr = hr%12) ? hr : 12) + ":" + ("0"+(~~time)%60).slice(-2) + APM;
	}


	function createTracker(){

		this.tracker = E("hr", { class: "tracker" });
		this.tracker.hide();

		this.trackerLabel = E("div", { class: "trackerLabel" });
		this.trackerLabel.hide();

		this.$.append(this.tracker, this.trackerLabel);

		var self = this;
		function trackMouse(e){
			// console.dir(self.grids);

			if( self.grids._.offsetTop > (e.pageY - self.$._.offsetTop) ){ return; }

			// Set position
			self.tracker._.style.top = self.trackerLabel._.style.top = (e.pageY - self.$._.offsetTop) + "px";
			self.trackerLabel._.style.left = (e.pageX - self.$._.offsetLeft) + "px";

			// Calculate offeset in percent
			var percent = (e.pageY - self.$._.offsetTop - self.grids._.offsetTop) / self.grids._.offsetHeight;

			// Render time
			self.trackerLabel.text( formatTime( ((self.end - self.start) * percent ) + self.start ) );
		}

		this.$.on("mouseenter", function(e){

			self.tracker.show();
			self.trackerLabel.show();

			self.$
				.on("mousemove", trackMouse)
				.on("mouseleave", function leaveMouse(){

					self.$
						.off("mouseleave", leaveMouse)
						.off("mousemove", trackMouse);

					self.tracker.hide();
					self.trackerLabel.hide();
				});
		});
	}

	function createGrid(){

		this.grids = E("div", { class: "grid" });
		this.$.append(this.grids);

		for( var i = this.start + 60; i < this.end; i+=60 ){
			var hr = document.createElement("hr");

			hr.style.top = (((i) - this.start) / (this.end - this.start)*100) + "%";

			this.grids.append( hr );
		}
	}

	function addDay(day){

		var createDay = new Day(this, day);

		// Add to array
		this.days.push( createDay );

		// Append to DOM
		this.$.append(createDay.$);
	}



	function Week(){

		this.start = 9*60;
		this.end = (12+10)*60;


		this.$ = E("div", { class: "week columns" });

		createGrid.apply(this);

		createTracker.apply(this);

		this.days = [];

		var self = this;

		["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"].forEach(function(name){
			addDay.apply(self, [name + "day"]);
		});


		window.addEventListener("resize", function(e){
			self.days.forEach(function(day){
				day.resizeText();
			});
		});
	}

	Week.prototype.appendTo = function(dom){
		dom.appendChild(this.$._);

		return this;
	};

	Week.prototype.remove = function(){
		this.$.parentNode.removeChild(this.$);

		return this;
	};

	Week.prototype.addEvent = function(evnt){

		if( !evnt.day ){ return; }

		if( evnt.day instanceof Array ){
			
			for( var i = 0; i<evnt.day.length; i++){

				// Add event per day
				this.days[ evnt.day[i] ].addEvent(evnt);
			}
		}else{
			this.days[evnt.day].addEvent(evnt);
		}

		return this;
	};

	Week.prototype.removeEvent = function(evnt){
		if( evnt.day instanceof Array ){

			for( var i = 0; i<evnt.day.length; i++){

				// Add event per day
				this.days[ evnt.day[i] ].removeEvent(evnt);
			}
		}else{
			this.days[evnt.day].removeEvent(evnt);
		}

		return this;
	};


	return Week;
})();
},{"./Day":1,"./Element":2}]},{},[3])(3)
});