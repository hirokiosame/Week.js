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

		// var self = this;
		// this.$.addEventListener("click", function(){


		// 	console.log(self.events);
		// });

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