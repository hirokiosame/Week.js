(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Week = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*		this.$title = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.$title.classList.add("title");
		this.$title.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
		this.$title.setAttributeNS(null, "width", "100%");
		this.$title.setAttributeNS(null, "height", "10%");
		this.$title.setAttributeNS(null, "viewBox", "0 0 60 30");


		var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		txt.textContent = name;
		// txt.setAttributeNS(null, "x", "50%");
		txt.setAttributeNS(null, "x", "0");
		txt.setAttributeNS(null, "y", "50%");
		// txt.setAttributeNS(null, "text-anchor", "end");
		// txt.setAttributeNS(null, "alignment-baseline", "middle");

		// this.$title.appendChild( txt );
*/

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

		if( typeof evnt.localColumns !== "number" ){
			evnt.localColumns = 1;
		}

		// Find a column
		while ( 1 ) {

			// Start with -1
			// acknowledged that no event ends at t = 0
			if( !columns[i] ){ columns[i] = { lastEventEnds: -1, events: [] }; }

			// If currently placed event in column has already ended, secure a spot
			if (columns[i].lastEventEnds <= evnt.start) {
				return i;
			}

			// If it collides, increment number of neighbors
			evnt.localColumns++;

			// Must reciprocate to the event that is being collided with...
			columns.events[columns.events.length-1].localColumns++;

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
		events.forEach(function(event1){

			// Find collumn
			var idx = event1.inColumn = findColumn(event1, columns);

			// Save position in column
			columns[idx].lastEventEnds = event1.end;

			columns[idx].events.push(event1);

		});
	}


	function Day(week, name){

		// Reference parent
		this.week = week;

		// Store events
		this.events = [];


		this.$title = E.lement("div", { class: "title", html: '<div>' + name + '</div>' });

		this.$events = E.lement("div", { class: "events" });

		this.$ = E.lement("div", { class: "column day" });
		this.$.appendChild(this.$title);
		this.$.appendChild(this.$events);

		var self = this;
		this.$.addEventListener("click", function(){
			console.log(self.events);
		});

	}

	Day.prototype.addEvent = function(evnt){

		var _evnt = Object.create(evnt);
		_evnt.$ = E.lement("div", { class: "event" });

		_evnt.$time = E.lement("div", { class: "time", text: formatTime(evnt.start) + " ~ " + formatTime(evnt.end) });
		_evnt.$name = E.lement("div", { class: "name", text: evnt.name });

		_evnt.$.appendChild( _evnt.$time );
		_evnt.$.appendChild( _evnt.$name );

		this.events.push(_evnt);
		this.render();
	};


	Day.prototype.renderEvent = function(evnt){

		var startPercent = (evnt.start - this.week.start) / (this.week.end - this.week.start) * 100,
			height = (evnt.end - evnt.start ) / (this.week.end - this.week.start) * 100;

		evnt.$.style.top = startPercent + "%";
		evnt.$.style.height = height + "%";

		evnt.$.style.width = (1/(evnt.localColumns-1)*100) + "%";
		evnt.$.style.left = (evnt.inColumn/evnt.localColumns*100) + "%";

	};

	Day.prototype.render = function(){

		var self = this;

		allocate2Columns(this.events);

		this.events.forEach(function(evnt){

			self.renderEvent(evnt);

			self.$events.appendChild( evnt.$ );
		});
	};

	Day.prototype.resizeText = function(){

		// console.dir(this.$title);
		// console.log(this.$title.textContent);
		// console.log(this.$title.offsetHeight);
		// console.log(this.$title.offsetWidth);
		// console.log();

		this.$title.style.fontSize = (this.$title.offsetHeight/3) + "px";

		this.events.forEach(function(evnt){
			// evnt.$time.style.fontSize = (evnt.$.clientHeight/4.5) + "px";
			// evnt.$name.style.fontSize = (evnt.$.clientHeight/5) + "px";
			evnt.$time.style.fontSize = (evnt.$.clientWidth/17) + "px";
			evnt.$name.style.fontSize = (evnt.$.clientWidth/19) + "px";
		});
	};

	return Day;
})();
},{"./Element":2}],2:[function(require,module,exports){
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

	function Week(){

		this.start = 9*60;
		this.end = (12+10)*60;


		this.$ = E.lement("div", { class: "week columns" });

		this.createGrid();

		this.createTracker();

		this.days = [];

		var self = this;
		["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"].forEach(function(name){
			self.addDay(name + "day");
		});


		window.addEventListener("resize", function(e){
			
			self.days.forEach(function(day){
				day.resizeText();
			});
		});
	}

	Week.prototype.createTracker = function(){

		this.tracker = E.lement("hr", { class: "tracker" });
		this.tracker.style.display = "none";

		this.trackerLabel = E.lement("div", { class: "trackerLabel" });
		this.trackerLabel.style.display = "none";

		this.$.appendChild(this.tracker);
		this.$.appendChild(this.trackerLabel);

		var self = this;
		function trackMouse(e){
			// console.dir(self.grids);


			if( self.grids.offsetTop > (e.pageY - self.$.offsetTop) ){ return; }


			self.trackerLabel.style.top = (e.pageY - self.$.offsetTop) + "px";
			self.trackerLabel.style.left = (e.pageX - self.$.offsetLeft) + "px";


			var percent = (e.pageY - self.$.offsetTop - self.grids.offsetTop) / self.grids.offsetHeight;
			self.trackerLabel.textContent = formatTime( ((self.end - self.start) * percent ) + self.start );


			self.tracker.style.top = (e.pageY - self.$.offsetTop) + "px";
		}

		this.$.addEventListener("mouseenter", function(e){

			self.tracker.style.display = "block";
			self.trackerLabel.style.display = "block";

			self.$.addEventListener("mousemove", trackMouse, false);
			self.$.addEventListener("mouseleave", function leaveMouse(){
				self.$.removeEventListener("mouseleave", leaveMouse);
				self.$.removeEventListener("mousemove", trackMouse);
				self.tracker.style.display = "none";
				self.trackerLabel.style.display = "none";
			}, false);
		}, false);
	};

	Week.prototype.createGrid = function(){

		this.grids = E.lement("div", { class: "grid" });
		this.$.appendChild(this.grids);

		for( var i = this.start + 60; i < this.end; i+=60 ){
			var hr = document.createElement("hr");

			hr.style.top = (((i) - this.start) / (this.end - this.start)*100) + "%";

			this.grids.appendChild( hr );
		}
	};


	Week.prototype.createTimes = function(){

		this.$sidebar = E.lement("div", { class: "column sidebar" });

		this.$sidebar.appendChild( E.lement("div", { class: "title" }) );

		this.$times = E.lement("div", { class: "times" });

		for( var i = this.start; i <= this.end; i+=30 ){

			var time = E.lement("div", {
				text: formatTime(i),
				class: "time" + ((i % 60) ? " half" : "")
			});

			time.style.top = (((i) - this.start) / (this.end - this.start)*100) + "%";
			this.$times.appendChild( time );
		}

		this.$sidebar.appendChild(this.$times);
	};

	Week.prototype.addDay = function(day){

		var createDay = new Day(this, day);

		// Add to array
		this.days.push( createDay );

		// Append to DOM
		this.$.appendChild(createDay.$);
	};

	Week.prototype.appendTo = function(dom){
		dom.appendChild(this.$);
	};

	Week.prototype.addEvent = function(evnt){

		if( !evnt.day ){ return; }

		if( evnt.day instanceof Array ){
			var self = this;
			evnt.day.forEach(function(day){
				self.days[day].addEvent(evnt);
			});
		}else{
			this.days[evnt.day].addEvent(evnt);			
		}
	};

	return Week;
})();
},{"./Day":1,"./Element":2}]},{},[3])(3)
});