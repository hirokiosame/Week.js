!function() {
    "use strict";
    var a = new Week();
    a.appendTo(document.getElementById("demo3")), a.addEvent({
        name: "CS 108 A1",
        day: [ 2, 4 ],
        start: 570,
        end: 660
    }), a.addEvent({
        name: "CS 101 A1",
        day: [ 2, 4 ],
        start: 750,
        end: 840
    }), a.addEvent({
        name: "CS 460 A1",
        day: [ 2, 4 ],
        start: 930,
        end: 1020
    }), a.addEvent({
        name: "CS 103 A1",
        day: [ 1, 3 ],
        start: 1080,
        end: 1170
    }), a.addEvent({
        name: "CS 460 A3",
        day: 3,
        start: 900,
        end: 960
    }), a.addEvent({
        name: "CS 101 A5",
        day: 3,
        start: 960,
        end: 1020
    }), a.addEvent({
        name: "CS 108 A3",
        day: 3,
        start: 1020,
        end: 1080
    }), a.addEvent({
        name: "CS 103 A4",
        day: 2,
        start: 1020,
        end: 1080
    });
}();