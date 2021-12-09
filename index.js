

const SUITES = ["Hearts", "Diamonds", "Clubs", "Spades"];

const DECK = new Array(52);

function createAndShufflDeck(){
    let count = 0;

    for(let suite of SUITES ){

        DECK[count++] = new Card(suite, )

    }

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


  class Card {
    constructor(suite, imageUrl, value) {
      this.suite = suite;
      this.imageUrl = imageUrl;
      this.value = value;
    }

    isAce(){
        if(this.value === 1){
            return true;
        }
        return false;
    }
  }