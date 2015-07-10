(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Week = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function(){
	
	'use strict';
	
	var E = require("Element");


	function formatTime(time) {
		var hr = ~~(time/60),
			APM = hr >= 12 ? "PM" : "AM";

		return ((hr = hr%12) ? hr : 12) + ":" + ("0"+(~~time)%60).slice(-2) + APM;
	}

/*
	function findColumn(evnt, columns){

		var i = 0;

		// Declare as at least 1 column
		evnt.localColumns = 1;

		// Find a column
		while ( 1 ) {

			// Start with -1
			// acknowledged that no event ends at t = 0
			if( !columns[i] ){ columns[i] = { lastEventEnds: -1, events: [] }; }

			// If currently placed event in column has already ended, secure a spot
			if (columns[i].lastEventEnds <= evnt.start) {
				return i;
			}
			console.log("\tCollision with", columns[i].events[columns[i].events.length-1].name);
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

			// console.log("\tAllocated", evnt.inColumn, evnt.localColumns);

			// Save position in column
			columns[idx].lastEventEnds = evnt.end;

			columns[idx].events.push(evnt);

		});
	}*/


	// Allocate events
	function allocateEvents(events) {

		// Hashmap/Array to allocate events in
		// Each key is a column and holds the ending time of the last entered event
		var allocation = {};

		// Allocate each event
		events.forEach(function(event) {

			var i = 0;

			// Find a column
			while ( 1 ) {

				// Start with -1
				// acknowledged that no event ends at t = 0
				allocation[i] = allocation[i] || -1;

				// If currently placed event in column has already ended, secure a spot
				if (allocation[i] <= event.startTime) {
					allocation[i] = event.endTime;
					event.column = i;
					break;
				}

				// Check next column
				i++;
			}
		});
	}

	// Find Neighbors of an event
	function findNeighbors(events) {

		events.forEach(function(event1) {

			// Contain neighbors
			event1.neighbors = [];

			// Contain columns neighbors are in
			var neighborColumns = [];

			// Find neighbors
			events.forEach(function(event2) {

				// Ignore if same event
				if (event1 === event2) { return; }

				if (
					// E2 in range of E1

					// E1 starts before E2 / E2 starts after E1
					// E2 starts before E1 ends / E1 ends after E2 starts
					( event1.startTime <= event2.startTime && event2.startTime < event1.endTime ) ||

					// E1 in range of E2
					( event2.startTime <= event1.startTime && event1.startTime < event2.endTime )
				) {

					// Add nieghbor
					event1.neighbors.push(event2);

					// Keep track of unique columns neighbors are in
					if (neighborColumns.indexOf(event2.column) === -1) { neighborColumns.push(event2.column); }
				}
			});

			// Declare column size -- gets updated later depending on indirect neighbors
			event1.columnSize = neighborColumns.length;
		});
	}


	// Adjust column depending on indirect neighbors	
	function readjustColumns(events) {

		// Copy events
		var queue = events.slice(), event;


		function perEvent(neighbor) {
			if (neighbor.columnSize > event.columnSize) {

				// Update column size
				event.columnSize = neighbor.columnSize;

				// Requeue it's neighbors
				Array.prototype.push.apply(queue, event.neighbors);
			}
		}

		// Until the queue is empty
		while ((event = queue.shift()) !== undefined) {

			// Iterate neighbors to check if they have a bigger column size
			event.neighbors.forEach(perEvent);
		}
	}


	// Process Events
	function processEvents(events) {

		// Sort events
		events.sort(function(a, b) {
			return (a.startTime - b.startTime) || (b.endTime - a.endTime);
		});

		// 1. Allocate events to respective columns
		allocateEvents(events);

		// 2. Find Neighbors
		findNeighbors(events);

		// 3. Readjust columns to consider indirect neighbors
		readjustColumns(events);
	}


	function Day(week, name){

		// Reference parent
		this.week = week;

		// Store events
		this.events = [];


		this.$title = E("div", { class: "title", textWrap: "div", text: name });
		this.$events = E("div", { class: "events" });

		this.$ = E("div", { class: "column day" });
		this.$.append(this.$title, this.$events);

	}

	Day.prototype.addEvent = function addEvent(evnt){

		clearTimeout(this.renderTO);

		var _evnt = Object.create(evnt);
		_evnt.$ = E("div", { class: "event" });

		// Make accessible if request indicated
		if( evnt.$events instanceof Array ){
			evnt.$events.push( _evnt.$ );
		}

		_evnt.$name = E("div", { class: "name", text: evnt.name });
		_evnt.$time = E("div", { class: "time", text: formatTime(evnt.startTime) + " ~ " + formatTime(evnt.endTime) });

		if( typeof _evnt.color === "string" ){
			_evnt.$._.style.backgroundColor = _evnt.color;
		}

		_evnt.$.append( _evnt.$name, _evnt.$time );

		this.events.push(_evnt);

		this.renderTO = setTimeout(this.render.bind(this), 50);
	};

	Day.prototype.removeEvent = function removeEvent(evnt){

		clearTimeout(this.renderTO);

		for( var i = 0; i < this.events.length; i++ ){
			if( evnt.isPrototypeOf(this.events[i]) ){

				var removed = this.events.splice(i, 1);

				// Remove DOM
				removed[0].$.remove();

				break;
			}
		}

		this.renderTO = setTimeout(this.render.bind(this), 50);
	};

	Day.prototype.renderEvent = function(evnt){

		evnt.columnSize++;

		var startPercent = (evnt.startTime - this.week.start) / (this.week.end - this.week.start) * 100,
			height = (evnt.endTime - evnt.startTime ) / (this.week.end - this.week.start) * 100;

		evnt.$.css({
			"top": startPercent + "%",
			"height": height + "%",
			"width": (100/evnt.columnSize) + "%",
			"left": (evnt.column/evnt.columnSize*100) + "%",
		});
	};

	Day.prototype.render = function(){

		var self = this;

		processEvents(this.events);

		this.events.forEach(function(evnt){

			self.renderEvent(evnt);

			self.$events.append( evnt.$ );
		});
	};
/*
	Day.prototype.resizeText = function(){

		this.$title._.style.fontSize = (this.$title._.offsetHeight/3) + "px";

		this.events.forEach(function(evnt){
			// evnt.$time.style.fontSize = (evnt.$.clientHeight/4.5) + "px";
			// evnt.$name.style.fontSize = (evnt.$.clientHeight/5) + "px";
			evnt.$time._.style.fontSize = (evnt.$._.clientWidth/17) + "px";
			evnt.$name._.style.fontSize = (evnt.$._.clientWidth/19) + "px";
		});
	};
*/
	return Day;
})();
},{"Element":3}],2:[function(require,module,exports){
/*jshint unused: false */
module.exports = (function(){

	'use strict';

	var E = require("Element");

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
			var rect = self.$._.getBoundingClientRect(),
				relativeY = e.pageY - rect.top;

			// Ignore if above the grids
			if( self.$grids._.offsetTop > relativeY ){ return; }

			// Set position
			self.tracker._.style.top = self.trackerLabel._.style.top = relativeY + "px";
			self.trackerLabel._.style.left = (e.pageX - rect.left) + "px";

			// Calculate offeset in percent
			var percent = (relativeY - self.$grids._.offsetTop) / self.$grids._.offsetHeight;

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

		this.$grids = E("div", { class: "grid" });
		this.$.append(this.$grids);

		var percent, $hr, time, $time;
		for( var i = this.start + 60, end = this.end; i < end; i+=60 ){

			percent = (i - this.start) / (this.end - this.start) * 100;

			$hr = document.createElement("hr");
			$hr.style.top = percent + "%";

			// Calculate display time
			time = ~~(i/60);

			if( time % 2 === 0 ){
				// if( time === 12 ){ time += " PM"; }
				if( time > 12 ){ time -= 12; }
			}else{ time = ""; }

			$time =	E("div", {
						class: "time" + ( time === 12 ? " pm" : ""),
						text: time
					})
					.css({
						top: percent-1.5 + "%"
					});

			this.$times.append( $time );
			this.$grids.append( $hr );
		}
	}





	function Week(options){
		options = options || {};
		this.start = typeof options.start === "number" ? options.start : 9*60;
		this.end = typeof options.end === "number" ? options.end : (12+10)*60;


		this.$times = E("div", { class: "times" });
		var $sideBar = E("div", { class: "column sideBar" }).append( E("div", { class: "title" }), this.$times);
		this.$ = E("div", { class: "week columns" }).append($sideBar);



		createGrid.apply(this);

		createTracker.apply(this);

		this.days = [];
		this.events = [];

		var self = this;

		["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"]
		.forEach(function addDay(day){

			day += "day";

			var createDay = new Day(self, day);

			// Add to array
			self.days.push( createDay );

			// Append to DOM
			self.$.append(createDay.$);
		});

/*
		window.addEventListener("resize", function(e){
			self.days.forEach(function(day){
				day.resizeText();
			});
		});*/
	}

	Week.prototype.appendTo = function(dom){
		dom.appendChild(this.$._);

		return this;
	};

	Week.prototype.remove = function(){
		this.$.remove();

		return this;
	};

	Week.prototype.addEvent = function(evnt){

		if( !evnt.days ){ return; }

		if( evnt.days instanceof Array ){
			
			for( var i = 0; i<evnt.days.length; i++){

				// Add event per day
				this.days[ evnt.days[i] ].addEvent(evnt);
			}
		}else{
			this.days[evnt.days].addEvent(evnt);
		}

		this.events.push(evnt);

		return this;
	};

	Week.prototype.removeEvent = function(evnt){
		if( evnt.days instanceof Array ){

			for( var i = 0; i<evnt.days.length; i++){

				// Add event per day
				this.days[ evnt.days[i] ].removeEvent(evnt);
			}
		}else{
			this.days[evnt.days].removeEvent(evnt);
		}

		var idx = this.events.indexOf(evnt);
		if( idx !== -1 ){
			this.events.splice(idx, 1);
		}

		return this;
	};


	return Week;
})();
},{"./Day":1,"Element":3}],3:[function(require,module,exports){
module.exports = (function(){
	'use strict';

	function E(lement){
		this._ = lement;
	}

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

	E.prototype.shown = function shown(){
		return this._.style.display !== "none";
	};

	E.prototype.on = function on(eventNames, eventCallback, useCapture){

		useCapture = !!useCapture;
		eventNames = eventNames.split(" ");

		for( var i = 0, len = eventNames.length; i < len; i++ ){
			this._.addEventListener(eventNames[i], eventCallback, useCapture);
		}

		return this;
	};

	E.prototype.off = function off(eventNames, eventCallback){

		eventNames = eventNames.split(" ");

		for( var i = 0, len = eventNames.length; i < len; i++ ){
			this._.removeEventListener(eventNames[i], eventCallback);
		}

		return this;
	};

	E.prototype.one = function one(eventName, eventCallback){
		var self = this;
		return this.on(eventName, function cb(){
			self.off(eventName, cb);
			eventCallback.apply(this, [].slice.apply(arguments));
		});
	};

	E.prototype.append = function append(arr){

		var args = arr instanceof Array ? arr : arguments;

		for( var i = 0, len = args.length; i < len; i++ ){
			this._.appendChild( args[i] instanceof E ? args[i]._ : args[i] );
		}

		return this;
	};

	E.prototype.replaceWith = function replaceWith(el){

		el = el instanceof E ? el._ : el;

		if( this._.parentNode ){
			this._.parentNode.replaceChild(el, this._);
		}

		this._ = el;

		return this;
	};

	E.prototype.text = function text(textContent, append){

		var el = this.textWrap || this._;

		if( arguments.length === 0 ){ return el.textContent; }

		// Change text  
		// textContent is faster than innerText
		// but textContent isn't aware of style
		// line breaks dont work

		// Back to textContent - firefox doesn't support innertext...
		el.textContent = (append ? el.textContent : "") + textContent;

		return this;
	};

	E.prototype.html = function html(htmlContent, append){

		// Change html
		this._.innerHTML = (append ? this._.innerHTML : "") + htmlContent;

		return this;
	};


	E.prototype.attr = function attr(name, value){

		if( typeof name !== "string" ){ throw new Error("An attribute name is required"); }

		if( typeof value !== "string" ){ return this._.getAttribute(name); }

		this._.setAttribute(name, value);

		return this;
	};

	E.prototype.remove = function remove(){
		if( !this._.parentNode ){ return; }
		this._.parentNode.removeChild(this._);

		return this;
	};


	E.prototype.offset = function offset(top, left){

		this._.style.top = top;
		this._.style.left = left;

		return this;
	};

	E.prototype.css = function css(name, value){

		if( typeof name === "string"){
			if( typeof value === "string" ){
				this._.style[name] = value;
			}else{
				return getComputedStyle(this._)[name];
			}
		}
		else if( name instanceof Object ){
			for( var prop in name ){
				this._.style[prop] = name[prop];
			}
		}

		return this;
	};

	E.prototype.trigger = function trigger(eventName){

		var evnt = new Event(eventName);

		this._.dispatchEvent(evnt);

		return this;
	};


	E.prototype.prev = function prev(){
		if( this._.previousSibling ){
			return new E(this._.previousSibling);	
		}
	};
	E.prototype.next = function next(){
		if( this._.nextSibling ){
			return new E(this._.nextSibling);	
		}
	};

	return function (el, opts){

		// Ignore if already an instance
		if( el instanceof E ){ return el; }

		var instance = new E();

		// el is a string
		if( typeof el === "string" ){

			// Create element
			instance._ = document.createElement(el);

			if( typeof opts === "object" ){

				var _opts = Object.create(opts);


				// Text container element
				if( typeof _opts.textWrap === "string" ){

					instance.textWrap = document.createElement(_opts.textWrap);
					instance._.appendChild( instance.textWrap );
					_opts.textWrap = null;
				}

				// Inner text
				if( _opts.text !== undefined && opts.text !== null ){
					instance.text(_opts.text);
					_opts.text = null;
				}

				// Inner HTML
				if( typeof _opts.html === "string" ){
					instance.html(_opts.html);
					_opts.html = null;
				}

				// Add Class
				if( typeof _opts.class === "string" ){
					instance.addClass(_opts.class);
					_opts.class = null;
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
},{}]},{},[2])(2)
});