/**
 * Kaitlyn Hennessy
 * kmh319
 * Mobile App- 2048
 */

const sloths = new Map([[0, "img/empty.png"], [2, "img/sloth1.png"], [4, "img/sloth2.png"], [8, "img/sloth3.png"], [16, "img/sloth4.png"], [32, "img/sloth5.png"], [64, "img/sloth6.png"], 
    [128, "img/sloth7.png"], [256, "img/sloth8.png"], [512, "img/sloth9.png"], [1024, "img/sloth10.png"], [2048, "img/sloth11.png"]]);

let ch = $('.board').height();
let score = 2;

$(document).ready(function(){
    initialize();
    bind();
    score = 2;
});

$('.board').css({
    'width': ch + 'px'
});


/**
 * Get some random empty cell from the current board.
 */
function getRandomEmptyCell(){
    let cell;

    while(1){
        let row = Math.floor(Math.random() * Math.floor(3)) + 1;
        let col = Math.floor(Math.random() * Math.floor(3)) + 1;
        cell = row + "" + col;
        let card = document.getElementById(cell).getAttribute("card");
        if (card == 0){
            return cell;
        }
    }
    return cell;
}


/**
 * Initialize the game with two cards.
 */
function initialize(){
    let cellA = getRandomEmptyCell();
    document.getElementById(cellA).setAttribute("card", "2");
    document.getElementById("img" + cellA).setAttribute("src", sloths.get(2));

    let cellB = getRandomEmptyCell();
    document.getElementById(cellB).setAttribute("card", "2");
    document.getElementById("img" + cellB).setAttribute("src", sloths.get(2));
}


/**
 * Bind the swipes.
 */
function bind(){
    $("body").bind("swiperight", function(event) {
        slideBoardRight();
    });
    $("body").bind("swipeleft", function(event) {
        slideBoardLeft();
    });
    $("body").bind("swipeup", function(event) {
        slideBoardUp();
    });
    $("body").bind("swipedown", function(event) {
        slideBoardDown();
    });
}


/**
 * Move temp card to the neighbor's position.
 * 
 * @param {*} neighborId 
 * @param {*} tempId 
 */
function moveCard(neighborId, tempId){
    try{
        // Move borked
        let temp = document.getElementById(tempId);
        let neighbor = document.getElementById(neighborId);
        let tempCard = parseInt(temp.getAttribute("card"));
        let neighborCard = parseInt(neighbor.getAttribute("card"));

        // Neighbor is populated, has same value as temp.
        if ((neighborCard === tempCard) || (neighborCard === 0)){
            if ((neighborCard !== 0) && (neighborCard === tempCard)){
                let newCardVal = tempCard * 2;
                neighbor.setAttribute("card", newCardVal);
                document.getElementById("img" + neighborId).setAttribute("src", sloths.get(parseInt(newCardVal)));
                document.getElementById("img" + neighborId).setAttribute("alt", "Sloth " + newCardVal);

                if (newCardVal > score){
                    score = newCardVal;
                    document.getElementById("score").innerHTML = "<b>Score: </b>" + score;
                    document.getElementById("scoreImg").setAttribute("src", sloths.get(newCardVal));
                }
                if (newCardVal == 2048){
                    alert("You win!");
                }

                // Empty out card to finish slide
                temp.setAttribute("card", 0);
                document.getElementById("img" + tempId).setAttribute("src", sloths.get(0));
                document.getElementById("img" + tempId).setAttribute("alt", "Empty Cell");
                return true;
            }

            // Slide card over.
            else if (neighborCard === 0){
                neighbor.setAttribute("card", tempCard);
                document.getElementById("img" + neighborId).setAttribute("src", sloths.get(parseInt(tempCard, 10)));
                document.getElementById("img" + neighborId).setAttribute("alt", "Sloth " + tempCard);
                
                // Empty out card to finish slide
                temp.setAttribute("card", 0);
                document.getElementById("img" + tempId).setAttribute("src", sloths.get(0));
                document.getElementById("img" + tempId).setAttribute("alt", "Empty Cell");
                return true;
            }
        }
    }
    catch(err){
        console.log("Error: " + err);
    }
}


/**
 * Add a new card.
 * @param {*} cell 
 */
function newCard(cell){
    document.getElementById(cell).setAttribute("card", "2");
    document.getElementById("img" + cell).setAttribute("src", sloths.get(2));
    document.getElementById("img" + cell).setAttribute("alt", "Sloth 2");
}


/**
 * Slide everything to the left.
 */
function slideBoardLeft(){
    //console.log("Left");
    let moved = false;
    let newFlag = false;

    for (let j = 5; j > 1; j--){
        for (let row = 1; row < 5; row++){
            for (let col = 2; col < j; col++){
                let tempId = row + "" + col;
                let temp = document.getElementById(tempId);
                let tempCard = parseInt(temp.getAttribute("card"));

                // Card has a value
                if (tempCard !== 0){
                    let neighborId = (row) + "" + (col - 1);
                    moved = moveCard(neighborId, tempId);
                    if (moved === true){
                        newFlag = true;
                    }
                }
            }
        }
    }

    if (newFlag === true){
        newCard(getRandomEmptyCell());
    }
}


/**
 * Slide everything to the right.
 */
function slideBoardRight(){
    //console.log("Right");
    let moved = false;
    let newFlag = false;

    for (let j = 0; j < 3; j++){
         for (let row = 1; row < 5; row++){
            for (let col = 3; col > j; col--){
                let tempId = row + "" + col;
                let temp = document.getElementById(tempId);
                //console.log("tempID: " + tempId);
                let tempCard = parseInt(temp.getAttribute("card"));

                // Card has a value
                if (tempCard !== 0){
                    let neighborId = (row) + "" + (col + 1);
                    moved = moveCard(neighborId, tempId);
                    if (moved === true){
                        newFlag = true;
                    }
                }
            }
        }
    }

    if (newFlag === true){
        newCard(getRandomEmptyCell());
    }
}


/**
 * Slide everything up.
 */
function slideBoardUp(){
    //console.log("Up");
    let moved = false;
    let newFlag = false;

    for (let j = 5; j > 1; j--){
        for (let row = 2; row < j; row++){
            for (let col = 1; col < 5; col++){
                let tempId = row + "" + col;
                let temp = document.getElementById(tempId);
                let tempCard = parseInt(temp.getAttribute("card"));

                // Card has a value
                if (tempCard !== 0){
                    let neighborId = (row - 1) + "" + col;
                    moved = moveCard(neighborId, tempId);
                    if (moved === true){
                        newFlag = true;
                    }
                }
            }
        }
    }

    if (newFlag === true){
        newCard(getRandomEmptyCell());
    }
}


/**
 * Slide everything down.
 */
function slideBoardDown(){
    //console.log("Down");
    let moved = false;
    let newFlag = false;

    for (let j = 0; j < 5; j++){
        for (let row = 3; row > j; row--){
            for (let col = 1; col < 5; col++){
                let tempId = row + "" + col;
                let temp = document.getElementById(tempId);
                //console.log("tempId: " + tempId);
                let tempCard = parseInt(temp.getAttribute("card"));
                
                // Card has a value
                if (tempCard !== 0){
                    let neighborId = (row + 1) + "" + col;
                    moved = moveCard(neighborId, tempId);
                    if (moved === true){
                        newFlag = true;
                    }
                }
            }
        }
    }

    if (newFlag === true){
        newCard(getRandomEmptyCell());
    }
}


/**
 * Reset the board.
 */
function restart(){
    for (let i = 1; i < 5; i++){
        for (let j = 1; j < 5; j++){
            let id = i + "" + j;
            document.getElementById(id).setAttribute("card", "0");
            document.getElementById("img" + id).setAttribute("src", sloths.get(0));
        }
    }
    location.reload(true);
}