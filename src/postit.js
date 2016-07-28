var notes = {};
var noteID = 0;
//record z-index of note on top, will break after ~200m interactions
var topStackOrder = 0;

window.onload = function() {
    var noteBoard = document.createElement("div");
    noteBoard.id = "noteBoard";
    document.body.appendChild(noteBoard);
};

function generateNote() {
    noteID++;
    topStackOrder++;
    notes["note" + noteID] = new Note(noteID, topStackOrder);
    drawNote(notes["note" + noteID]);
}

function deleteNote (note) {
    delete notes["note" + note.id];
}

function Note(noteID, stackOrder){
    this.id = noteID;
    this.colour = "yellow";
    this.text = "hello";
    this.x = 0;
    this.y = 0;
    this.stackOrder = stackOrder;
}

Note.prototype.changeColour = function(colour) {
    this.colour = colour;
    drawNote(this);
};

Note.prototype.move = function (x,y) {
    this.x = x;
    this.y = y;
    topStackOrder++;
    this.stackOrder = topStackOrder;
    drawNote(this);
};

Note.prototype.editText = function (text) {
    this.text = text;
    drawNote(this);
};

function drawNote(note) {

    //console.log(note);
    //console.log(notes);

    var notediv = getNote(note);
    //colour
    notediv.className = "note " + note.colour + "Note";
    //text
    notediv.textArea.value = note.text;
    //position
    notediv.style.left = note.x + "px";
    notediv.style.top = note.y + "px";
    notediv.style.zIndex = note.stackOrder;
}

function getNote(note) {
    var notediv = document.getElementById("note" + note.id);
    if (notediv === null) {
        notediv = document.createElement("div");
        notediv.id = "note" + note.id;
        notediv.style.zIndex = note.stackOrder;

        //text
        notediv.textArea = document.createElement("textarea");
        notediv.textArea.className = "edNote";
        notediv.textArea.onblur = function(event) {
            note.editText(event.target.value);
        };
        notediv.appendChild(notediv.textArea);

        //moving
        notediv.draggable = true;
        notediv.ondragstart = function(event) {
            //record mouse position relative to topleft
            //data format: moving note id + x offset + y offset
            var data = note.id + " " + (event.pageX - note.x) + " " + (event.pageY - note.y);
            event.dataTransfer.setData("text", data);
        };
        document.getElementById("noteBoard").ondrop = function (event) {
            var data = event.dataTransfer.getData("text");
            var notePosition = _.zipObject(["id", "x", "y"], data.split(" "));
            notes["note" + notePosition.id].move(event.pageX - notePosition.x, event.pageY - notePosition.y);
            event.preventDefault();
        };
        //drop event only fires if dragover default is cancelled so cancel it here
        document.getElementById("noteBoard").ondragover = function (event) {
            event.preventDefault();
        };

        //menu
        //note menu button
        var menuButton = document.createElement("div");
        menuButton.className = "menuButton";
        menuButton.onclick = function() {
            if(menu.style.display === "block") {
                menu.style.display = "none";
            }
            else menu.style.display = "block";
        };
        notediv.appendChild(menuButton);

        //note menu
        var menu = document.createElement("div");
        menu.className = "menu";
        notediv.appendChild(menu);

        //delete menu item
        delItem = document.createElement("div");
        delItem.className = "menuItem";
        trashCan = document.createElement("img");
        trashCan.src = "assets/trash.png";
        trashCan.style.height = "30px";
        delItem.appendChild(trashCan);
        delItem.onclick = function () {
            document.getElementById("noteBoard").removeChild(document.getElementById("note" + note.id));
            deleteNote(note);
        };
        menu.appendChild(delItem);

        //colour change menu item
        colourItem = document.createElement("div");
        colourItem.className = "menuItem";

        //set up colour change boxes for menu
        var noteColours = ["yellow", "pink", "blue", "green"];

        colourBoxes = _.map(noteColours, function(value) {
            var box = document.createElement("div");
            box.className = "colourBox " + value + "Box";
            box.onclick = function (event) {
                note.changeColour(value);
                menu.style.display = "none";
            };
            return box;
        });

        _.forEach(colourBoxes, function(value) {
            colourItem.appendChild(value);
        });

        menu.appendChild(colourItem);

        document.getElementById("noteBoard").appendChild(notediv);
    }
    return notediv;
}
