(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Week = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function(){
	
	'use strict';
	
	var E = require("./Element");


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

		console.log("allocateEvents");

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
				if (allocation[i] <= event.start) {
					allocation[i] = event.end;
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

		console.log("findNeighbors");

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
					( event1.start < event2.start && event2.start < event1.end ) ||

					// E1 in range of E2
					( event2.start < event1.start && event1.start < event2.end )
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


		console.log("readjustColumns");

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

		console.log("processEvents");

		// Sort events
		events.sort(function(a, b) {
			return (a.start - b.start) || (b.end - a.end);
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

		clearTimeout(this.renderTO);
		// console.log("\n\nEvent added", evnt.name);

		var _evnt = Object.create(evnt);
		_evnt.$ = E("div", { class: "event" });

		_evnt.$time = E("div", { class: "time", text: evnt.name, a: formatTime(evnt.start) + " ~ " + formatTime(evnt.end) });
		_evnt.$name = E("div", { class: "name", text: evnt.name });

		if( typeof _evnt.color === "string" ){
			_evnt.$._.style.backgroundColor = _evnt.color;
		}

		_evnt.$.append( _evnt.$time, _evnt.$name );

		this.events.push(_evnt);

		this.renderTO = setTimeout(this.render.bind(this), 50);
	};

	Day.prototype.removeEvent = function(evnt){

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

		// console.log("   Rendering event:", evnt.name);
		// console.log("   Local Columns:",evnt.localColumns);
		// console.log("   In Column:", evnt.inColumn);
		// console.log("\n");

		evnt.columnSize++;

		var startPercent = (evnt.start - this.week.start) / (this.week.end - this.week.start) * 100,
			height = (evnt.end - evnt.start ) / (this.week.end - this.week.start) * 100;

		evnt.$._.style.top = startPercent + "%";
		evnt.$._.style.height = height + "%";

		evnt.$._.style.width = (100/evnt.columnSize) + "%";
		evnt.$._.style.left = (evnt.column/evnt.columnSize*100) + "%";

	};

	Day.prototype.render = function(){

		var self = this;

		console.log("Render invoked");

		processEvents(this.events);

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

	E.prototype.remove = function(){
		if( !this._.parentNode ){ return; }
		this._.parentNode.removeChild(this._);

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
		this.$.remove();

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