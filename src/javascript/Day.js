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