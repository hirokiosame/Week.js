(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function(){
	
	var E = require("./Element");


	function formatTime(time) {
		var hr = ~~(time/60),
			APM = hr >= 12 ? "PM" : "AM";

		return ((hr = hr%12) ? hr : 12) + ":" + ("0"+time%60).slice(-2) + APM;
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


		// Draw grids







		this.addEvent({
			name: "Event1",
			start: 9*60 + 30,
			end: (5+12)*60 + 45
		});
		this.addEvent({
			name: "Event1",
			start: 11*60 + 30,
			end: (8+12)*60 + 45
		});
		this.addEvent({
			name: "Event1",
			start: 11*60 + 30,
			end: (8+12)*60 + 45
		});
		this.addEvent({
			name: "Event1",
			start: (7+12)*60 + 45,
			end: (9+12)*60 + 45
		});
		this.addEvent({
			name: "Event1",
			start: 9*60,
			end: 10*60
		});
		// for( var i = 9; i<(12+10); i++ ){

		// 	var start = ;
		// 	var end = ;

		// 	this.addEvent({
		// 		name: formatTime(start) + "~" + formatTime(end),
		// 		start: (i*60),
		// 		end: ((i+1)*60)
		// 	});
		// }
	}

	Day.prototype.addEvent = function(evnt){
		evnt.$ = E.lement("div", { class: "event", text: evnt.name });
		this.events.push(evnt);
		this.render();
	};


	function findColumn(event, columns){

		var i = 0;

		// Find a column
		while ( 1 ) {

			// Start with -1
			// acknowledged that no event ends at t = 0
			columns[i] = columns[i] || -1;

			// If currently placed event in column has already ended, secure a spot
			if (columns[i] < event.start) {
				return i;
			}

			// Check next column
			i++;
		}
	}


	function allocate2Columns(events){

		// Hashmap/Array to allocate events in
		// Each key is a column and holds the ending time of the last entered event
		var columns = {};

		// Allocate each event
		events.forEach(function(event){

			var idx = findColumn(event, columns);

			columns[idx] = event.end;
			event.column = idx;	
		});
		return Object.keys(columns).length;
	}

	Day.prototype.renderEvent = function(evnt, columns){

		var startPercent = (evnt.start - this.week.start) / (this.week.end - this.week.start) * 100,
			height = (evnt.end - evnt.start) / (this.week.end - this.week.start) * 100;

	
		evnt.$.style.top = startPercent + "%";
		evnt.$.style.width = (1/columns*100) + "%";
		evnt.$.style.height = height + "%";

		evnt.$.style.left = (evnt.column/columns*100) + "%";

	};

	Day.prototype.render = function(){

		var self = this;


		// Sort events
		this.events.sort(function(a, b) {
			return (a.start - b.start) || (b.end - a.end);
		});


		var columns = allocate2Columns(this.events);

		this.events.forEach(function(evnt){

			self.renderEvent(evnt, columns);

			self.$events.appendChild( evnt.$ );
		});
	};


/*
	Day.prototype.addEvent = function(e){

		var startPercent = (e.startTime - this.week.startTime) / (this.week.endTime - this.week.startTime) * 100,
			height = (e.endTime - e.startTime) / (this.week.endTime - this.week.startTime) * 100;

		var eventDOM = E.lement("div", { class: "event", text: e.name });
		eventDOM.style.top = startPercent + "%";
		eventDOM.style.height = height + "%";

		this.$events.appendChild(eventDOM);
	};*/

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

			options.class && this.addClass(el, options.class);
			options.text && (el.innerText = options.text);
			options.html && (el.innerHTML = options.html);

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
module.exports = (function(){

	var E = require("./Element");

	var Day = require("./Day");


	function formatTime(time) {
		var hr = ~~(time/60),
			APM = hr >= 12 ? "PM" : "AM";

		return ((hr = hr%12) ? hr : 12) + ":" + ("0"+time%60).slice(-2) + APM;
	}


	function Week(){

		this.start = 9*60;
		this.end = (12+10)*60;


		this.$ = E.lement("div", { class: "week columns" });

		this.createTimes();
		this.$.appendChild(this.$sidebar);
		// this.$.appendChild(this.$days);

		this.days = [];

		var self = this;
		["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"].forEach(function(name){
			self.addDay(name + "day");
		});
	}

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


	return Week;
})();
},{"./Day":1,"./Element":2}],4:[function(require,module,exports){
module.exports = (function(){

	var Week = require("./Week");

	var week1 = new Week();
	week1.appendTo(document.getElementById("demo1"));

	var week2 = new Week();
	week2.appendTo(document.getElementById("demo2"));

	var week3 = new Week();
	week3.appendTo(document.getElementById("demo3"));

})();
},{"./Week":3}]},{},[4]);
