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
        day: [ 4 ],
        start: 660,
        end: 700,
        color: b()
    }), a.addEvent({
        name: "Test 2",
        day: [ 4 ],
        start: 570,
        end: 660,
        color: b()
    }), a.addEvent({
        name: "Test 3",
        day: [ 4 ],
        start: 594,
        end: 714,
        color: b()
    }), a.addEvent({
        name: "Test 4",
        day: [ 4 ],
        start: 570,
        end: 660,
        color: b()
    }), a.addEvent({
        name: "Test 5",
        day: [ 4 ],
        start: 660,
        end: 700,
        color: b()
    }), a.addEvent({
        name: "Test 6",
        day: [ 4 ],
        start: 660,
        end: 700,
        color: b()
    });
}();