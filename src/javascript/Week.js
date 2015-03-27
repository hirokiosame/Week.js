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
	}

	function createGrid(){

		this.grids = E.lement("div", { class: "grid" });
		this.$.appendChild(this.grids);

		for( var i = this.start + 60; i < this.end; i+=60 ){
			var hr = document.createElement("hr");

			hr.style.top = (((i) - this.start) / (this.end - this.start)*100) + "%";

			this.grids.appendChild( hr );
		}
	}

	function addDay(day){

		var createDay = new Day(this, day);

		// Add to array
		this.days.push( createDay );

		// Append to DOM
		this.$.appendChild(createDay.$);
	}
/*
	function createTimes(){

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
	};*/


	function Week(){

		this.start = 9*60;
		this.end = (12+10)*60;


		this.$ = E.lement("div", { class: "week columns" });

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
		dom.appendChild(this.$);

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