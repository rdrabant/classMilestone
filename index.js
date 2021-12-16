

const SUITES = ["Hearts", "Diamonds", "Clubs", "Spades"];

let DECK = new Array(52);
let cardArrayPos = 0;
const numOfPlayer = 1;
let currentPlayer = 0;

// const CARD_WIDTH = "96px";//1920
// const CARD_HEIGHT = "120px;"//2400
const CARD_WIDTH = "124px";//1920
const CARD_HEIGHT = "156px;"//2400

let dealer = null;
let players = [];
let playerTotal = [];

let ACE_TEST = null;
let HANDS_DIV = null;


function createAndShufflDeck() {
    let count = 0;

    let imgBaseUrl = "images/1920px-Playing_card_";

    for (let suite of SUITES) {

        let localImgBaseUrl = imgBaseUrl;

        if (suite == "Hearts") {
            localImgBaseUrl = imgBaseUrl.concat("heart_");
        } else if (suite == "Diamonds") {
            localImgBaseUrl = imgBaseUrl.concat("diamond_");
        } else if (suite == "Clubs") {
            localImgBaseUrl = imgBaseUrl.concat("club_");
        } else if (suite == "Spades") {
            localImgBaseUrl = imgBaseUrl.concat("spade_");
        }

        for (i = 1; i <= 13; i++) {
            let cardImgName;
            let cardValue;
            let altVal;
            if (i === 1) {
                cardImgName = "A";
                cardValue = i;
                altVal = "Ace of " + suite;
            } else if (i === 11) {
                cardImgName = "J";
                cardValue = 10;
                altVal = "Jack of " + suite;
            } else if (i === 12) {
                cardImgName = "Q";
                cardValue = 10;
                altVal = "Queen of " + suite;
            } else if (i === 13) {
                cardImgName = "K";
                cardValue = 10;
                altVal = "King of " + suite;
            } else {
                cardImgName = i;
                cardValue = i;
                altVal = i + " of " + suite;
            }

            let imgUrl = localImgBaseUrl.concat(cardImgName, ".svg.png");
            // if (cardValue === 1) {
            //     ACE_TEST = new Card(suite, imgUrl, cardValue, altVal);
            // }
            DECK[count++] = new Card(suite, imgUrl, cardValue, altVal);
        }

    }

    shuffle(DECK);

}


// shuffle an array code found here. 
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

async function nextPlayer(refreshLastPlayersHand){
    currentPlayer++;
    if(refreshLastPlayersHand){
        players[currentPlayer - 1].updatePlayerDisplay();
    }
    
    if(currentPlayer < players.length){
        players[currentPlayer].updatePlayerDisplay();
    }

    console.log("PLAYER: " + currentPlayer);
    if(currentPlayer >= players.length){
        console.log("ON TO DEALER");

        // let dealerCard1 = document.getElementById("dealerCard1");
        dealer.updatePlayerDisplay();

        await sleep(2000);
        // dealerCard1.src = dealer.cards[0].imageUrl;
    
        let stop = (dealer.totalValue > 17 || (dealer.totalValue == 17 && !dealer.soft));

        while(!stop){
            // await sleep(2000);
            dealer.hit();
            dealer.updatePlayerTotal();
            stop = (dealer.totalValue > 17 || (dealer.totalValue == 17 && !dealer.soft));
        }




    }
    // players[currentPlayer -1].updatePlayerTotal();  

}

function dealCards() {

    document.addEventListener("DOMContentLoaded", function () {

        HANDS_DIV = document.getElementById("hands");

        dealer = new Player("dealer", new Array())

        createAndShufflDeck();

        for (initCard = 0; initCard < 2; initCard++) {

            dealer.cards.push(DECK[cardArrayPos++]);

            for (i = 0; i < numOfPlayer; i++) {
                if (initCard == 0) {
                    players[i] = new Player(i, new Array());
                }

                players[i].cards.push(DECK[cardArrayPos++])
            }
        }

        //debug forcing aces to player hand
        // players[0].push(ACE_TEST)
        // players[0].push(ACE_TEST)
        // players[0].push(ACE_TEST)


        console.log("CARDS DEALT: " + (cardArrayPos));
        console.log("DEALER CARDS: " + (dealer.cards.length));
        for (i = 0; i < numOfPlayer; i++) {
            console.log("PLAYER " + i + " CARDS: " + (players[i].cards.length));
        }
        // let cardsDiv = document.getElementById("hands");

        for (i = 0; i < numOfPlayer; i++) {

            players[i].updatePlayerTotal();

        }

        //dealer hand
        {

            dealer.updatePlayerTotal();
            //console.log("DEALER CARDS: ");

            // let span = document.createElement("span");
            // span.id = "dealer";
            // span.style = "width: 400px;";

            // span.append("Dealer's hand");
            // span.appendChild(document.createElement("br"));
            // span.style = "width: 400px;  border-style  solid; display: inline-block";

            // let firstCard = true;
            // for (card of dealer.cards) {

            //     let cardSpan = document.createElement("span");
            //     cardSpan.style = "display: inline-block";

            //     let img = document.createElement("img");
            //     if (firstCard) {
            //         firstCard = false;
            //         img.src = "images/Oak-Leaf-Back.jpg";

            //     } else {
            //         img.src = card.imageUrl;
            //     }
            //     img.alt = card.altVal;
            //     img.style = "width: " + CARD_WIDTH + "; height: " + CARD_HEIGHT + ";";

            //     cardSpan.appendChild(img);
            //     cardSpan.appendChild(document.createElement("br"));
            //     cardSpan.append(card.altVal);

            //     span.append(cardSpan);
            //     //span.appendChild(document.createElement("br"));

            // }

            // span.appendChild(document.createElement("br"));

            // cardsDiv.append(span);
        }



        //    <span style="width: 400px;" id="">
        //   players hand
        //</span>

        //<span style="width: 400px;">
        //   dealers hand
        //</span>


        for (card of DECK) {

            let img = document.createElement("img");
            img.src = card.imageUrl;
            img.alt = card.altVal;
            img.style = "width: " + CARD_WIDTH + "; height: " + CARD_HEIGHT + ";";
            img.src = card.imageUrl;

            document.body.appendChild(img);
            document.body.appendChild(document.createElement("br"));
            document.body.append(card.altVal);
            document.body.appendChild(document.createElement("br"));

        }


        // console.log("PLAYER 0 CARDS: " + players[0].cards.length);
        // players[0].hit();
    })
}

//   /**
//    * pass a player id, or "dealer" to total it
//    * @param {} elementId 
//    */
//   function updatePlayerTotal(id){

//         let elementId = null;
//         let cardArray;
//         if(id !== "dealer"){
//             elementId = "player" + i + "total";
//             cardArray = players[i];
//         }else{
//             elementId = "dealerTotal";
//             cardArray =  dealerCards;
//         }

//         //console.log("PLAYER " + elementId + " CARDS: " + (players[i].length));
//         //console.log("getting element: \"" + elementId + "\"");
//         let theSpan = document.getElementById(elementId);

//         //console.log("theSpan element: " + theSpan);

//         let cardTotal = 0;
//         let totalAces = 0;
//         for(card of cardArray){
//            if(card.isAce()){
//                 // console.log("card to add (is ace) " + card.value)
//                 totalAces++;
//            }else{
//             // console.log("card to add (not ace) " + card.value)
//             cardTotal += card.value;
//            }
//         }

//         let totalAceValue = 0;
//         let soft = false;
//         if(totalAces > 0){
//             // for(pos = totalAces; pos > 0; pos--){
//             //     totalAceValue = (pos * 11) + ((totalAces - pos) * 1);

//             //      console.log("pos " + pos + " trying ace: " + (totalAceValue /*+ cardTotal*/));

//             //     if((totalAceValue + cardTotal) < 21){
//             //         break;
//             //     }

//             //     //see if the total 

//             // }
//             //2 aces will always be over 21. So total it with 1 ace as 11, then try it with all
//             // aces as value of 1 each
//             totalAceValue = 11 + (totalAces -1);

//             console.log("(totalAceValue + cardTotal) > 21 (" + totalAceValue + " + " + cardTotal + ") > 21")
//             if((totalAceValue + cardTotal) > 21){
//                 totalAceValue = totalAces;
//             }else{
//                 soft = true;
//             }

//             console.log("pos " + 0 + " trying ace: " + (totalAceValue + cardTotal));

//         }

//         // span.appendChild(document.createElement("br"));
//         // console.log("CARD TOTAL: " + totalAceValue = totalAces);  
//         if(!soft){
//             theSpan.innerText = "CARD TOTAL: " + (totalAceValue + cardTotal);
//         }else{
//             theSpan.innerText = "CARD TOTAL: SOFT " + (totalAceValue + cardTotal);
//         }

//     }



class Card {
    constructor(suite, imageUrl, value, altVal) {
        this.suite = suite;
        this.imageUrl = imageUrl;
        this.value = value;
        this.altVal = altVal;
    }

    isAce() {
        if (this.value === 1) {
            return true;
        }
        return false;
    }
}

class Player {
    constructor(id) {
        this.cards = new Array();
        this.id = id;
        this.totalValue = 0
        this.soft = false;
        // this.lost = false;
        // this.stay = false;

        console.log("init PLAYER " + id + " CARDS: " + (this.cards.length));

        this.span = document.createElement("span");
        this.span.id = "player" + id;
        this.span.style = "width: 400px; border-style  solid; display: inline-block";

        HANDS_DIV.append(this.span);

    }


    /**
     * hit
     */
    hit() {
        this.cards.push(DECK[cardArrayPos++]);
        this.updatePlayerTotal();
    }

    /**
     * pass a player id, or "dealer" to total it
     * @param {} elementId 
     */
    updatePlayerDisplay() {

        // console.log("CARDS ARE: " + this.cards);

        this.span.innerHTML = null;
        if (this.id != "dealer") {
            this.span.append("Player " + (this.id + 1) + " hand");
        } else {
            this.span.append("Dealer hand");
        }

        this.span.appendChild(document.createElement("br"));

        let firstCard = true;
        for (let card of this.cards) {

            let cardSpan = document.createElement("span");
            cardSpan.style = "display: inline-block";

            let img = document.createElement("img");


            if (this.id == "dealer" && firstCard) {
                firstCard = false;
                if(currentPlayer < players.length){
                    img.src = "images/Oak-Leaf-Back.jpg";
                }else{
                    img.src = card.imageUrl;
                }
                img.id = "dealerCard1";
            } else {
                img.src = card.imageUrl;
            }


            img.alt = card.altVal;
            img.style = "width: " + CARD_WIDTH + "; height: " + CARD_HEIGHT + ";";

            cardSpan.appendChild(img);
            cardSpan.appendChild(document.createElement("br"));
            cardSpan.append(card.altVal);

            this.span.append(cardSpan);
            //span.appendChild(document.createElement("br"));

        }

        this.span.appendChild(document.createElement("br"));
        let totalValueSpan = document.createElement("span");
        totalValueSpan.id = "player" + i + "total";
        this.span.appendChild(totalValueSpan);

        // span.appendChild(document.createElement("br"));


        let elementId = null;
        // let cardArray;
        if (this.id !== "dealer") {
            elementId = "player" + i + "total";
            // cardArray = players[i];
        } else {
            elementId = "dealerTotal";
            // cardArray =  dealerCards;
        }

        //console.log("PLAYER " + elementId + " CARDS: " + (players[i].length));
        //console.log("getting element: \"" + elementId + "\"");
        // let theSpan = document.getElementById(elementId);

        //console.log("theSpan element: " + theSpan);

        // let cardTotal = 0;
        // let totalAces = 0;
        // for (let card of this.cards) {
        //     if (card.isAce()) {
        //         // console.log("card to add (is ace) " + card.value)
        //         totalAces++;
        //     } else {
        //         // console.log("card to add (not ace) " + card.value)
        //         cardTotal += card.value;
        //     }
        // }

        // let totalAceValue = 0;
        // this.soft = false;
        // if (totalAces > 0) {

        //     //2 aces will always be over 21. So total it with 1 ace as 11, then try it with all
        //     // aces as value of 1 each
        //     totalAceValue = 11 + (totalAces - 1);

        //     console.log("(totalAceValue + cardTotal) > 21 (" + totalAceValue + " + " + cardTotal + ") > 21")
        //     if ((totalAceValue + cardTotal) > 21) {
        //         totalAceValue = totalAces;
        //     } else {
        //         this.soft = true;
        //     }

        //     console.log("pos " + 0 + " trying ace: " + (totalAceValue + cardTotal));

        // }

        // // span.appendChild(document.createElement("br"));
        // // console.log("CARD TOTAL: " + totalAceValue = totalAces);  
        // this.totalValue = totalAceValue + cardTotal;
        if (this.totalValue == 21) {
            if(this.cards.length  == 2){
                this.span.append("TOTAL: " + (this.totalValue) + " BLACKJACK!!!!!");
            }else{
                this.span.append("TOTAL: " + (this.totalValue));
            }   //this.lost = true;
            //this.stay = true;
            if(this.id != "dealer"){
                nextPlayer(false);
            }

        }else if (this.totalValue > 21) {
            this.span.append("BUST YOU LOSER - TOTAL: " + (this.totalValue));
            //this.lost = true;
            //this.stay = true;
            if(this.id != "dealer"){
                nextPlayer(false);
            }

        }else if (!this.soft) {
            this.span.append("CARD TOTAL: " + (this.totalValue));
        } else {
            this.span.append("CARD TOTAL - SOFT: " + (this.totalValue));
        }

        this.span.appendChild(document.createElement("br"));

        // if((this.id != "dealer" && !this.lost)
        //  || this.id == "dealer"){
        if (this.id == currentPlayer) {

            let hitMe = document.createElement("button");
            // hitMe.onclick = this.hit;
            // hitMe.addEventListener( 'click', this.hit(this), false );

            // hitMe.onclick = players[this.id].hit();
            //             var object = new ClassName();
            // document.getElementById('x').addEventListener('click', function ()
            // {
            //   object.method()
            // }, false);
            const anId = this.id;
            hitMe.onclick = function () {
                // console.log("ID TO HIT: " + anId);
                players[anId].hit();
            }
            hitMe.append("Hit Me");
            this.span.append(hitMe);


            let stay = document.createElement("button");
            stay.onclick = function () {
                nextPlayer(true);
            }
            stay.append("Stay");
            this.span.append(stay);
        }

    }

    updatePlayerTotal() {

        // console.log("CARDS ARE: " + this.cards);
        let cardTotal = 0;
        let totalAces = 0;
        for (let card of this.cards) {
            if (card.isAce()) {
                // console.log("card to add (is ace) " + card.value)
                totalAces++;
            } else {
                // console.log("card to add (not ace) " + card.value)
                cardTotal += card.value;
            }
        }

        let totalAceValue = 0;
        this.soft = false;
        if (totalAces > 0) {

            //2 aces will always be over 21. So total it with 1 ace as 11, then try it with all
            // aces as value of 1 each
            totalAceValue = 11 + (totalAces - 1);

            // console.log("(totalAceValue + cardTotal) > 21 (" + totalAceValue + " + " + cardTotal + ") > 21")
            if ((totalAceValue + cardTotal) > 21) {
                totalAceValue = totalAces;
            } else {
                this.soft = true;
            }

            // console.log("pos " + 0 + " trying ace: " + (totalAceValue + cardTotal));

        }

        // span.appendChild(document.createElement("br"));
        // console.log("CARD TOTAL: " + totalAceValue = totalAces);  
        this.totalValue = totalAceValue + cardTotal;

        this.updatePlayerDisplay();

    }

}

//function stolen from https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

//players[0].hitMe()
dealCards();

