/*jshint unused: false */
module.exports = (function(){

	'use strict';

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