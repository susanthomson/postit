var noteBoard;
//record z-index of note on top, will break after ~200m interactions
var topZ = 0;

window.onload = function() {
    console.log(document.styleSheets);
    noteBoard = document.createElement("div");
    noteBoard.className = "noteBoard";
    document.body.appendChild(noteBoard);
};

function createNote() {
    topZ++;
    var note = document.createElement("div");
    note.colour = "yellow";
    note.className = "note yellowNote";
    note.draggable = "true";
    note.style.zIndex = topZ;
    var mouseX;
    var mouseY;

    //note text
    var textArea = document.createElement("textarea");
    textArea.className = "edNote";
    note.appendChild(textArea);

    //move note
    //TODO: handle dragging out of board
    note.ondragstart = function(event) {
        //bring note to top
        topZ++;
        event.target.style.zIndex = topZ;
        //record mouse position relative to topleft of note
        //need to remove "px" from style values
        mouseX = event.pageX - event.target.style.left.slice(0,event.target.style.left.length-2);
        mouseY = event.pageY - event.target.style.top.slice(0,event.target.style.top.length-2);
    };
    note.ondragend = function(event) {
        event.target.style.left = (event.pageX - mouseX) + "px";
        event.target.style.top = (event.pageY - mouseY) + "px";
    };

    //note menu button
    var menuButton = document.createElement("div");
    menuButton.className = "menuButton";
    menuButton.onclick = function() {
        //bring note to top, toggle menu visibility
        topZ++;
        note.style.zIndex = topZ;
        if(menu.style.display === "block") {
            menu.style.display = "none";
        }
        else menu.style.display = "block";
    };

    //note menu
    var menu = document.createElement("div");
    menu.className = "menu";
    note.appendChild(menu);

    var delItem = document.createElement("div");
    delItem.className = "menuItem";
    var trashCan = document.createElement("img");
    trashCan.src = "assets/trash.png";
    trashCan.style.height = "30px";
    delItem.appendChild(trashCan);
    delItem.onclick = function () {
        noteBoard.removeChild(note);
    };

    var colourItem = document.createElement("div");
    colourItem.className = "menuItem";

    //set up colour change boxes for menu
    var noteColours = ["yellow", "pink", "blue", "green"];

    var colourBoxes = _.map(noteColours, function(value) {
        var box = document.createElement("div");
        box.className = "colourBox " + value + "Box";
        box.onclick = function (event) {
            event.target.parentNode.parentNode.parentNode.className = "note " + value + "Note";
            event.target.parentNode.parentNode.style.display = "none";
        };
        return box;
    });

    _.forEach(colourBoxes, function(value) {
       colourItem.appendChild(value);
    });

    menu.appendChild(colourItem);
    menu.appendChild(delItem);

    note.appendChild(menuButton);

    noteBoard.appendChild(note);
    note.style.left = note.offsetLeft;
    note.style.top = note.offsetTop;
}
