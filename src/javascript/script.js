/*global Week:false */
(function(){
	
	'use strict';

	// var week1 = new Week();
	// week1.appendTo(document.getElementById("demo1"));

	// var week2 = new Week();
	// week2.appendTo(document.getElementById("demo2"));

	var week3 = new Week();
	week3.appendTo(document.getElementById("demo3"));



	week3.addEvent({
		name: "CS 108 A1",
		day: [2, 4],
		start: 9.5*60,
		end: 11*60
	});

	week3.addEvent({
		name: "CS 101 A1",
		day: [2, 4],
		start: (12.5)*60,
		end: (2+12)*60
	});
	week3.addEvent({
		name: "CS 460 A1",
		day: [2, 4],
		start: (3.5+12)*60,
		end: (5+12)*60
	});



	week3.addEvent({
		name: "CS 103 A1",
		day: [1, 3],
		start: (6+12)*60,
		end: (7.5+12)*60
	});


	week3.addEvent({
		name: "CS 460 A3",
		day: 3,
		start: (3+12)*60,
		end: (4+12)*60
	});

	week3.addEvent({
		name: "CS 101 A5",
		day: 3,
		start: (4+12)*60,
		end: (5+12)*60
	});

	week3.addEvent({
		name: "CS 108 A3",
		day: 3,
		start: (5+12)*60,
		end: (6+12)*60
	});


	week3.addEvent({
		name: "CS 103 A4",
		day: 2,
		start: (5+12)*60,
		end: (6+12)*60
	});

})();
