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

  // TODO
  const handler = e => {
    console.log(e.target);
    const isCard =
      e.target.classList.contains('back') ||
      e.target.classList.contains('front');
    const matched = e.target.parentNode.classList.contains('match');
    if (isCard && !matched) {
      console.log('card!');
      const parent = e.target.parentNode;
      parent.classList.toggle('open');
      parent.classList.toggle('show');
      console.log(e.target);
    } else {
      console.log('something else');
    }
  };

  const documentBody = document.body;
  documentBody.addEventListener('click', handler, true);

  const domElementCheck = o => o instanceof Element;

  class Card {
    constructor(iconClass) {
      this.iconClass = iconClass;
    }

    makeIcon() {
      const icon = document.createElement('I');
      icon.setAttribute('class', this.iconClass);

      return icon;
    }

    makeFrontFace(str) {
      const icon = this.makeIcon();
      const frontFace = document.createElement('div');

      frontFace.appendChild(icon);
      frontFace.setAttribute('class', str);

      return frontFace;
    }

    makeBackFace(str) {
      const backFace = document.createElement('div');

      backFace.setAttribute('class', str);

      return backFace;
    }

    makeCard() {
      const frontFace = this.makeFrontFace('front');
      const backFace = this.makeBackFace('back');
      const card = document.createElement('LI');
      card.setAttribute('class', 'card');

      card.appendChild(frontFace);
      card.appendChild(backFace);

      return card;
    }
  }

  class Deck {
    constructor(arrOfIconValues) {
      this.arrOfIconValues = arrOfIconValues;
    }

    shuffleDeck(deckArray) {
      // Shuffle function from http://stackoverflow.com/a/2450976
      var currentIndex = deckArray.length,
        temporaryValue,
        randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = deckArray[currentIndex];
        deckArray[currentIndex] = deckArray[randomIndex];
        deckArray[randomIndex] = temporaryValue;
      }

      return deckArray;
    }

    makeDeck() {
      const deck = this.arrOfIconValues.reduce((acc, iconClass) => {
        const firstCard = new Card(iconClass).makeCard();
        const secondCard = new Card(iconClass).makeCard();

        acc.push(firstCard);
        acc.push(secondCard);

        return acc;
      }, []);
      const shuffledDeck = this.shuffleDeck(deck);
      return shuffledDeck;
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

    makeDeckDocFrag() {
      const deck = new Deck(CARD_ICONS).makeDeck();
      const docFrag = deck.reduce((acc, card) => {
        acc.appendChild(card);
        return acc;
      }, document.createDocumentFragment());

      return docFrag;
    }

    appendDeckTo(domElement) {
      const docFrag = this.makeDeckDocFrag();
      domElement.appendChild(docFrag);
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

  const deckTag = document.getElementsByClassName('deck')[0];
  const game = new Game();
  game.appendDeckTo(deckTag);
})();
