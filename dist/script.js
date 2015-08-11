!function() {
    "use strict";
    var a = new Week({
        start: 420
    });
    a.appendTo(document.getElementById("demo3"));
    var b = function() {
        var a = (1 + Math.sqrt(5)) / 2, b = 10;
        return function() {
            return b = (Math.random() * a * 361 + b) % 361, "hsl(" + b + ", 45%, 55%)";
        };
    }();
    console.log(a.addEvent({
        name: "Test 1",
        days: [ 4 ],
        startTime: 660,
        endTime: 700,
        color: b()
    })), console.log(a.addEvent({
        name: "Test 2",
        days: [ 4 ],
        startTime: 570,
        endTime: 660,
        color: b()
    })), console.log(a.addEvent({
        name: "Test 22",
        days: [ 4, 1 ],
        startTime: 570,
        endTime: 660,
        color: b()
    })), console.log(a.addEvent({
        name: "Test 22",
        days: [ 1, 4 ],
        startTime: 870,
        endTime: 900,
        color: b()
    }));
}();