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
  const CARD_ICONS = [
    'fa fa-diamond',
    'fa fa-paper-plane-o',
    'fa fa-anchor',
    'fa fa-bolt',
    'fa fa-cube',
    'fa fa-leaf',
    'fa fa-bicycle',
    'fa fa-bomb'
  ];

  const deck = document.getElementsByClassName('deck')[0];
  const documentBody = document.body;

  const handler = e => {
    console.log(e.target);
    const isCard =
      e.target.classList.contains('back') ||
      e.target.classList.contains('front');
    const matched = e.target.parentNode.classList.contains('match');
    if (isCard && !isMatched) {
      console.log('card!');
      const parent = e.target.parentNode;
      parent.classList.toggle('open');
      parent.classList.toggle('show');
      console.log(e.target);
    } else {
      console.log('something else');
    }
  };

  documentBody.addEventListener('click', handler, true);

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

  /*
    <li class="card">
        <div class="front">
            <i class="fa fa-diamond"></i>
        </div>
        <div class="back"></div>
    </li>
  */

  class Card {
    constructor(iconClass) {
      this.iconClass = iconClass;
      this.icon = document.createElement('I');
      this.frontFace = document.createElement('div');
      this.backFace = document.createElement('div');
      this.card = document.createElement('LI');
    }
    completeIcon() {
      this.icon.setAttribute('class', this.iconClass);
    }

    completeFrontFace(str) {
      this.completeIcon();
      this.frontFace.appendChild(this.icon);
      this.frontFace.setAttribute('class', str);
    }

    completeBackFace(str) {
      this.backFace.setAttribute('class', 'back');
    }

    makeCard() {
      this.completeFrontFace('front');
      this.completeBackFace('back');

      this.card.appendChild(this.frontFace);
      this.card.appendChild(this.backFace);

      this.card.setAttribute('class', 'card');
      
      return this.card;
    }
  }

  class GameState {
    constructor({
      numFlippableCards = 16,
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

  class Game {
    constructor(state = new GameState()) {
      this.state = state;
      this.handleClick.bind(this);
    }

    handleClick(e) {
      e.preventDefault();
      console.log('handleClick called');
    }

    setSecondsElapsed(num) {
      this.state.secondsElapsed = num;
    }

    setStarRating(num) {
      this.state.starRating = num;
    }

    setMovesMade(num) {
      this.state.numMovesMade = num;
    }

    setSuccessMatches(num) {
      this.state.numSuccessMatches = num;
    }

    setFailedMatches(num) {
      this.state.numFailedMatches = num;
    }

    getSecondsElapsed() {
      return this.state.secondsElapsed;
    }

    getStarRating() {
      return this.state.starRating;
    }

    getNumMovesMade() {
      return this.state.numMovesMade;
    }

    getNumSuccessMatches() {
      return this.state.numSuccessMatches;
    }

    getNumFailedMatches() {
      return this.state.numFailedMatches;
    }
  }
})();
