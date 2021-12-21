

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
let soundFile = 'sounds/cards.m4a';


//let ACE_TEST = null;
let HANDS_DIV = null;
let TOTALS_DIV = null;

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

function nextPlayer(refreshLastPlayersHand) {
    currentPlayer++;
    if (refreshLastPlayersHand) {
        players[currentPlayer - 1].updatePlayerDisplay();
    }

    if (currentPlayer < players.length) {
        players[currentPlayer].updatePlayerDisplay();
    }

    //console.log("PLAYER: " + currentPlayer);
    if (currentPlayer >= players.length) {
        //console.log("ON TO DEALER");

        // let dealerCard1 = document.getElementById("dealerCard1");
        dealer.updatePlayerDisplay();

        // sleep(2000);
        // dealerCard1.src = dealer.cards[0].imageUrl;
        sleep(2000).then(() => {
            let stop = (dealer.totalValue > 17 || (dealer.totalValue == 17 && !dealer.soft));

            while (!stop) {
                // await sleep(2000);
                dealer.hit();//auto updates total and display
                // dealer.updatePlayerTotal();
                stop = (dealer.totalValue > 17 || (dealer.totalValue == 17 && !dealer.soft));
            }


            for (let player of players) {
                let totalEl = document.getElementById(player.id + "totalSpan");
    
                let playerTotals = getTotals();
                
                //function saveTotalsToLocalStorage(playerScores){


                if (player.totalValue > 21) {
                    //totalEl.textContent = player.totalValue + " BUST";
                    //something for localvalue to log a loss
                    playerTotals.loss++;

                    // this.win = 0;
                    // this.push = 0;
                
                } else if (dealer.totalValue > 21) {
                    totalEl.textContent = "WINNER. DEALER BUST";
                    playerTotals.win++;

                } else if (dealer.totalValue > player.totalValue) {
                    totalEl.textContent = "LOSER. " + player.totalValue;
                    playerTotals.loss++;

                } else if (dealer.totalValue == player.totalValue) {
                    totalEl.textContent = "PUSH. " + player.totalValue;
                    playerTotals.push++;

                } else if (dealer.totalValue < player.totalValue) {
                    totalEl.textContent = "WINNER. " + player.totalValue;
                    playerTotals.win++;

                }

                saveTotalsToLocalStorage(playerTotals);

                let totalSpan = document.getElementById("totalSpan");
                totalSpan.textContent = "Wins: " + playerTotals.win + " Losses: " + playerTotals.loss + " Draws: " + playerTotals.push;
        
            }

        });




    }

}

function dealCards() {

        //reset values in case this is a new draw not just page refresh

        cardArrayPos = 0;
        currentPlayer = 0;

        HANDS_DIV = document.getElementById("hands");
        TOTALS_DIV = document.getElementById("totals");


        //added a play sound from here. 
        //https://stackoverflow.com/questions/15567426/async-play-sound-in-javascript/41317657
        try {
            new Audio(soundFile).play();
        }catch{
            //nothing to worry about, it fails because DOM must be interacted with before play runs
            //chrome did not want sounds to auto play
            //https://developer.chrome.com/blog/autoplay/
        }
        
        // ADD THE BUTTONS TO DEAL, RESET SCORE
        let newDeal = document.createElement("button");
        newDeal.onclick = function () {
            HANDS_DIV.innerHTML = null;
            TOTALS_DIV.innerHTML = null;
            dealCards();
            // alert("test");
        }
        newDeal.append("New Deal");
        let playerTotals = getTotals();
        let totalSpan = document.createElement("span");
        totalSpan.id = "totalSpan";
        totalSpan.textContent = "Wins: " + playerTotals.win + " Losses: " + playerTotals.loss + " Draws: " + playerTotals.push;
        TOTALS_DIV.append(totalSpan);
        TOTALS_DIV.appendChild(document.createElement("br"));
        TOTALS_DIV.appendChild(document.createElement("br"));
        
        TOTALS_DIV.append(newDeal);

        
        TOTALS_DIV.append("\xa0\xa0\xa0");

        let resetScore = document.createElement("button");
        resetScore.onclick = function () {
            HANDS_DIV.innerHTML = null;
            TOTALS_DIV.innerHTML = null;
            resetTheTotals();
            dealCards();
            // alert("test");
        }
        resetScore.append("Reset Score and New Deal");
        TOTALS_DIV.append(resetScore);

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


        // console.log("CARDS DEALT: " + (cardArrayPos));
        // console.log("DEALER CARDS: " + (dealer.cards.length));
        // for (i = 0; i < numOfPlayer; i++) {
        //     console.log("PLAYER " + i + " CARDS: " + (players[i].cards.length));
        // }
        // let cardsDiv = document.getElementById("hands");

        for (i = 0; i < numOfPlayer; i++) {

            players[i].updatePlayerTotal();

        }

        //dealer hand
        {

            dealer.updatePlayerTotal();

        }


        if (dealer.cards[1].value === 1) {
            //update to ask for inurance 
            // lets assume insurnace is a suckers bet and skip the question for now.

            if(dealer.cards[0].value === 10){
                for(count = 0;  count = players.length; count++ ){
                    nextPlayer(true);
                }
            }


        }

   
        
}




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


class PlayerScores {
    constructor() {
        this.loss = 0;
        this.win = 0;
        this.push = 0;
    }
}


class Player {
    constructor(id) {
        this.cards = new Array();
        this.id = id;
        this.totalValue = 0
        this.soft = false;
        this.askForInsurance = false;

        // console.log("init PLAYER " + id + " CARDS: " + (this.cards.length));

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
            cardSpan.style = "display: inline-block; vertical-align: text-top;";

            let img = document.createElement("img");


            if (this.id == "dealer" && firstCard) {
                if (currentPlayer < players.length) {
                    img.src = "images/Oak-Leaf-Back.jpg";
                } else {
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

            if (!(this.id == "dealer" && currentPlayer < players.length) || !firstCard) {
                cardSpan.append(card.altVal);
            }
            
            this.span.append(cardSpan);
            firstCard = false;
                
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


        let totalSpan = document.createElement("span");
        this.span.appendChild(totalSpan);
        totalSpan.id = this.id + "totalSpan";

        // console.log("ID: " + this.id + " currentPlayer: " + currentPlayer  +" players.length: " + players.length);
        if (this.id != "dealer" || currentPlayer >= players.length) {
            if (this.totalValue == 21) {
                if (this.cards.length == 2) {
                    totalSpan.append("TOTAL: " + (this.totalValue) + " BLACKJACK!!!!!");
                } else {
                    totalSpan.append("TOTAL: " + (this.totalValue));
                }   //this.lost = true;
                //this.stay = true;
                if (this.id != "dealer") {
                    nextPlayer(false);
                }

            } else if (this.totalValue > 21) {
                totalSpan.append("BUST YOU LOSER - TOTAL: " + (this.totalValue));
                if (this.id != "dealer") {
                    nextPlayer(false);
                }

            } else if (!this.soft) {
                totalSpan.append("CARD TOTAL: " + (this.totalValue));
            } else {
                totalSpan.append("CARD TOTAL - SOFT: " + (this.totalValue));
            }
        }

        this.span.appendChild(document.createElement("br"));

        // if((this.id != "dealer" && !this.lost)
        //  || this.id == "dealer"){
        if (this.id == currentPlayer) {

            let hitMe = document.createElement("button");
            
            const anId = this.id;
            hitMe.onclick = function () {
                // console.log("ID TO HIT: " + anId);
                players[anId].hit();
            }
            hitMe.append("Hit Me");
            this.span.append(hitMe);
            //nbsp didnt work, so had to look up how to do add it via stack overflow.
            //https://stackoverflow.com/questions/5237989/how-is-a-non-breaking-space-represented-in-a-javascript-string
            //this.span.append("&nbsp;");
            this.span.append("\xa0\xa0\xa0");


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
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


function resetTheTotals(){

    window.localStorage.removeItem("totals")
}

function getTotals() {
    let playerScores = JSON.parse(window.localStorage.getItem("totals"));

    //if not "truthy"
    if (!playerScores) {
        console.log("totals are null")

        playerScores = new PlayerScores()
    }

    //console.log("SCORES: " + JSON.stringify(playerScores));

    return playerScores;
}

function saveTotalsToLocalStorage(playerScores){
 
    localStorage.setItem('totals', JSON.stringify(playerScores));
}


document.addEventListener("DOMContentLoaded", function () {
    dealCards();                
})



