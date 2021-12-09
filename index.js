

const SUITES = ["Hearts", "Diamonds", "Clubs", "Spades"];

let DECK = new Array(52);
let cardArrayPos = 0;
const numOfPlayer = 1;

let dealerCards = [];
let players = [];

function createAndShufflDeck(){
    let count = 0;

    let imgBaseUrl = "images/1920px-Playing_card_";

    for(let suite of SUITES ){

        let localImgBaseUrl = imgBaseUrl;

        if(suite == "Hearts"){
            localImgBaseUrl = imgBaseUrl.concat("heart_");
        }else if(suite == "Diamonds"){
            localImgBaseUrl = imgBaseUrl.concat("diamond_");
        }else if(suite == "Clubs"){
            localImgBaseUrl = imgBaseUrl.concat("club_");
        }else if(suite == "Spades"){
            localImgBaseUrl = imgBaseUrl.concat("spade_");
        }    

        for(i = 1; i <= 13; i++){
            let cardImgName;
            let cardValue;
            let altVal;
            if(i == 1){
                cardImgName = "A";
                cardValue = i;
                altVal = "Ace of " + suite;
            }else if(i == 11){
                cardImgName = "J";
                cardValue = 10;
                altVal = "Jack of " + suite;
            }else if(i == 12){
                cardImgName = "Q";
                cardValue = 10;
                altVal = "Queen of " + suite;
            }else if(i == 13){
                cardImgName = "K";
                cardValue = 10;
                altVal = "King of " + suite;
            }else{
                cardImgName = i;
                cardValue = i;
                altVal = i + " of " + suite;
            }

            let imgUrl = localImgBaseUrl.concat(cardImgName, ".svg.png");
            DECK[count++] = new Card(suite, imgUrl, cardValue, altVal);
        }
    
    }

   shuffle(DECK);

}


// shuffle an array code found here. 
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
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

  function dealCards(){

    document.addEventListener("DOMContentLoaded", function(){

        
        createAndShufflDeck();

        for(initCard = 0; initCard < 2; initCard++){

            dealerCards.push(DECK[cardArrayPos++]);

            for(i = 0; i < numOfPlayer; i++){
                if(initCard == 0){
                    players[i] = new Array();
                }

                players[i].push(DECK[cardArrayPos++])
            }
        }

        console.log("CARDS DEALT: " + (cardArrayPos));
        console.log("DEALER CARDS: " + (dealerCards.length));
        let cardsDiv = document.getElementById("hands");
        
        for(i = 0; i < numOfPlayer; i++){

            console.log("PLAYER " + i + " CARDS: " + (players[i].length));

            let span = document.createElement("span");
            span.id = "player" + i;
            span.style = "width: 400px; border-style  solid; display: inline-block";

            span.append("Player " + (i + 1) + " hand");
            span.appendChild(document.createElement("br"));

            for(card of players[i]){

                let cardSpan = document.createElement("span");
                cardSpan.style = "display: inline-block";

                let img = document.createElement("img");
                img.src = card.imageUrl;
                img.alt = card.altVal;
                img.style = "width: 20%; height: 20%";
                img.src = card.imageUrl;
    
                cardSpan.appendChild(img);
                cardSpan.appendChild(document.createElement("br"));
                cardSpan.append(card.altVal);

                span.append(cardSpan);
                //span.appendChild(document.createElement("br"));
               
            }

            // span.appendChild(document.createElement("br"));
               
            cardsDiv.append(span);

        }

        //dealer hand
        {            
            console.log("DEALER CARDS: ");

            let span = document.createElement("span");
            span.id = "dealer";
            span.style = "width: 400px;";

            span.append("Dealer's hand");
            span.appendChild(document.createElement("br"));
            span.style = "width: 400px;  border-style  solid; display: inline-block";

            for(card of dealerCards){

                let cardSpan = document.createElement("span");
                cardSpan.style = "display: inline-block";

                let img = document.createElement("img");
                img.src = card.imageUrl;
                img.alt = card.altVal;
                img.style = "width: 20%; height: 20%";
                img.src = card.imageUrl;
    
                cardSpan.appendChild(img);
                cardSpan.appendChild(document.createElement("br"));
                cardSpan.append(card.altVal);

                span.append(cardSpan);
                //span.appendChild(document.createElement("br"));
            
            }

            span.appendChild(document.createElement("br"));
            
            cardsDiv.append(span);
        }


        
//    <span style="width: 400px;" id="">
 //   players hand
//</span>

//<span style="width: 400px;">
 //   dealers hand
//</span>


        for(card of DECK){

            let img = document.createElement("img");
            img.src = card.imageUrl;
            img.alt = card.altVal;
            img.style = "width: 10%; height: 10%"
            img.src = card.imageUrl;

            document.body.appendChild(img);
            document.body.appendChild(document.createElement("br"));
            document.body.append(card.altVal);
            document.body.appendChild(document.createElement("br"));
           
        }
    })
  }

  class Card {
    constructor(suite, imageUrl, value, altVal) {
      this.suite = suite;
      this.imageUrl = imageUrl;
      this.value = value;
      this.altVal = altVal;
    }

    isAce(){
        if(this.value === 1){
            return true;
        }
        return false;
    }
  }

  dealCards();

  