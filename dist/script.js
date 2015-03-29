!function() {
    "use strict";
    var a = new Week();
    a.appendTo(document.getElementById("demo3"));
    var b = {
        name: "CS 108 A1",
        day: [ 2, 4 ],
        start: 570,
        end: 660
    };
    a.addEvent(b), a.addEvent({
        name: "CS 108 A1",
        day: [ 2, 4 ],
        start: 570,
        end: 660
    }), a.removeEvent(b);
}();