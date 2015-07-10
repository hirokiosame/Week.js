/*global Week:false */
(function(){
	
	'use strict';

	// var week1 = new Week();
	// week1.appendTo(document.getElementById("demo1"));

	// var week2 = new Week();
	// week2.appendTo(document.getElementById("demo2"));

	var week3 = new Week({
		start: 7*60
	});
	week3.appendTo(document.getElementById("demo3"));


	// var evnt1 = {
	// 	name: "CS 108 A1",
	// 	days: [2, 4],
	// 	startTime: 9.5*60,
	// 	Timeend: 11*60
	// };
	// week3.addEvent(evnt1);

	// week3.addEvent({
	// 	name: "CS 108 A1",
	// 	days: [2, 4],
	// 	startTime: 9.5*60,
	// 	eTimend: 11*60
	// });
	// week3.removeEvent(evnt1);

	var generateColor = (function(){

		var PHI = (1 + Math.sqrt(5))/2;

		var generated = 10;

		return function(){

			generated = (Math.random() * PHI * 361 + generated)%361;

			return "hsl(" + generated + ", 45%, 55%)";
		};
	})();


	week3.addEvent({
		name: "Test 1",
		days: [4],
		startTime: 11*60,
		endTime: 11*60 + 40,
		color: generateColor()
	});
	// week3.addEvent({
	// 	name: "Test 2",
	// 	days: [4],
	// 	start: 660,
	// 	end: 700,
	// 	color: generateColor()
	// });

	week3.addEvent({
		name: "Test 2",
		days: [4],
		startTime: 9.5*60,
		endTime: 11*60,
		color: generateColor()

	});
/*
	week3.addEvent({
		name: "Test 3",
		day: [4],
		start: 9.9*60,
		end: 11.9*60,
		color: generateColor()
	});

	week3.addEvent({
		// name: "Test 4",
		day: [4],
		start: 9.5*60,
		end: 11*60,
		color: generateColor()
	});
	week3.addEvent({
		name: "Test 5",
		day: [4],
		start: 660,
		end: 700,
		color: generateColor()
	});
	week3.addEvent({
		name: "Test 6",
		day: [4],
		start: 660,
		end: 700,
		color: generateColor()
	});
*/



	week3.addEvent({
		"semester":"Fall 2015",
		"section":"A1",
		"days":"W",
		"location":"ARR",
		"start":1080,
		"end":1140,
		"instructor":{
			"instructorName":"David Sullivan"
		},
		"sectionType":{
			"sectionTypeName":"LEC"
		},
		"name":"CAS CS 111 A1",
		"day":[3],
		"color":"hsl(106.96337272204937, 45%, 55%)",
		"added":0
	});

	week3.addEvent({
		"semester":"Fall 2015",
		"section":"B1",
		"days":"W",
		"location":"ARR",
		"start":1080,
		"end":1140,
		"instructor":{
			"instructorName":"Aaron Stevens"
		},
		"sectionType":{
			"sectionTypeName":"LEC"
		},
		"name":"CAS CS 111 B1",
		"day":[3],
		"color":"hsl(162.29619381789348, 45%, 55%)",
		"added":0
	});


/*
	week3.addEvent({
		name: "CS 101 A1",
		days: [2, 4],
		startTime: (12.5)*60,
		endTime: (2+12)*60,
		color: generateColor()
	});
	week3.addEvent({
		name: "CS 460 A1",
		days: [2, 4],
		startTime: (3.5+12)*60,
		endTime: (5+12)*60,
		color: generateColor()
	});



	week3.addEvent({
		name: "CS 103 A1",
		days: [1, 3],
		startTime: (6+12)*60,
		endTime: (7.5+12)*60,
		color: generateColor()
	});


	week3.addEvent({
		name: "CS 460 A3",
		days: 3,
		startTime: (3+12)*60,
		endTime: (4+12)*60,
		color: generateColor()
	});

	week3.addEvent({
		name: "CS 101 A5",
		days: 3,
		startTime: (4+12)*60,
		endTime: (5+12)*60,
		color: generateColor()
	});
	week3.addEvent({
		name: "CS 108 A3",
		days: 3,
		startTime: (5+12)*60,
		endTime: (6+12)*60,
		color: generateColor()
	});


	week3.addEvent({
		name: "CS 103 A4",
		days: 2,
		startTime: (5+12)*60,
		endTime: (6+12)*60,
		color: generateColor()
	});*/

})();
