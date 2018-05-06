/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

(function() {
  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // 16 cards, 8 matches needed to win game
  const SUCCESSFUL_MATCHES_TO_WIN = 8;

  const domElementCheck = o => o instanceof Element;

  const addAttributes = (domElement, attributeObj) => {
    if (!domElementCheck(domElement))
      throw new Error('First argument must be a DOM element!');

    const attributes = Object.getOwnPropertyNames(attributeObj);
    const domElWithAttributes = attributes.reduce((acc, attribute) => {
      acc.setAttribute(attribute, attributeObj[attribute]);
      return acc;
    }, domElement);

    return domElWithAttributes;
  };

  class GameState {
    constructor({
      numFlippableCards = 0,
      secondsElapsed = 0,
      starRating = 3,
      numMovesMade = 0,
      numSuccessMatches = 0,
      numFailedMatches = 0
    } = {}) {
      this.numFlippableCards = numFlippableCards;
      this.secondsElapsed = secondsElapsed;
      this.starRating = starRating;
      this.numMovesMade = numMovesMade;
      this.numSuccessMatches = numSuccessMatches;
      this.numFailedMatches = numFailedMatches;
    }
  }
/*
  class Game {
    constructor(state = new GameState()) {
        this.state = state;
    }

    handleClick(e) {
        e.preventDefault();
        console.log('handleClick called');
    }

    setSecondsElapsed(num) {
        this.state.secondsElapsed = num;
        return this.state.secondsElapsed;
    }

    setStarRating(num) {
        this.state.starRating = num;
        return this.starRating;
    }

    setMovesMade(num) {
        this.state.numMovesMade = num;
        return this.state.numMovesMade;
    }
  }
  */

  class Card {
    constructor() {}
  }

  class FlippableCard extends Card {
    constructor() {
      super();
    }
  }
})();
