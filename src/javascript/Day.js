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
			// console.log("\tCollision", evnt.name, "with", columns[i].events[columns[i].events.length-1].name);
			// console.log("\t\t", evnt.name, "new local:", evnt.localColumns+1);
			// console.log("\t\t", columns[i].events[columns[i].events.length-1].localColumns);


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

		clearTimeout(this.renderTO);
		console.log("\n\nEvent added", evnt.name);

		var _evnt = Object.create(evnt);
		_evnt.$ = E("div", { class: "event" });

		_evnt.$time = E("div", { class: "time", text: formatTime(evnt.start) + " ~ " + formatTime(evnt.end) });
		_evnt.$name = E("div", { class: "name", text: evnt.name });

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