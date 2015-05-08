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
			if( self.grids._.offsetTop > relativeY ){ return; }

			// Set position
			self.tracker._.style.top = self.trackerLabel._.style.top = relativeY + "px";
			self.trackerLabel._.style.left = (e.pageX - rect.left) + "px";

			// Calculate offeset in percent
			var percent = (relativeY - self.grids._.offsetTop) / self.grids._.offsetHeight;

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



	function Week(options){
		options = options || {};
		this.start = typeof options.start === "number" ? options.start : 9*60;
		this.end = typeof options.end === "number" ? options.end : (12+10)*60;


		this.$ = E("div", { class: "week columns" });


		createGrid.apply(this);

		createTracker.apply(this);

		this.days = [];
		this.events = [];

		var self = this;

		["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"]
		.forEach(function(name){
			addDay.apply(self, [name + "day"]);
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