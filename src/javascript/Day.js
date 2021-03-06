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
				[].push.apply(queue, event.neighbors);
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

		processEvents(this.events);

		this.renderTO = setTimeout(this.render.bind(this), 50);

		return _evnt.columnSize + 1;
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

		processEvents(this.events);

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