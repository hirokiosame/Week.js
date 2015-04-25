!function() {
    "use strict";
    var a = new Week();
    a.appendTo(document.getElementById("demo3"));
    var b = function() {
        var a = (1 + Math.sqrt(5)) / 2, b = 10;
        return function() {
            return b = (Math.random() * a * 361 + b) % 361, "hsl(" + b + ", 45%, 55%)";
        };
    }();
    a.addEvent({
        name: "Test 1",
        days: [ 4 ],
        startTime: 660,
        endTime: 700,
        color: b()
    }), a.addEvent({
        name: "Test 2",
        days: [ 4 ],
        startTime: 570,
        endTime: 660,
        color: b()
    }), a.addEvent({
        semester: "Fall 2015",
        section: "A1",
        days: "W",
        location: "ARR",
        start: 1080,
        end: 1140,
        instructor: {
            instructorName: "David Sullivan"
        },
        sectionType: {
            sectionTypeName: "LEC"
        },
        name: "CAS CS 111 A1",
        day: [ 3 ],
        color: "hsl(106.96337272204937, 45%, 55%)",
        added: 0
    }), a.addEvent({
        semester: "Fall 2015",
        section: "B1",
        days: "W",
        location: "ARR",
        start: 1080,
        end: 1140,
        instructor: {
            instructorName: "Aaron Stevens"
        },
        sectionType: {
            sectionTypeName: "LEC"
        },
        name: "CAS CS 111 B1",
        day: [ 3 ],
        color: "hsl(162.29619381789348, 45%, 55%)",
        added: 0
    });
}();