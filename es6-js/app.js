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
  // utility functions

  // used to mixin behavior into classes rather than
  // "extend"ing since multiple inheritance isn't supported
  const FunctionalMixin = behavior => target => Object.assign(target, behavior);

  // mixin makeIcon method into a class
  const canMakeIcons = FunctionalMixin({
    makeIcon(classString) {
      const icon = document.createElement('I');
      icon.setAttribute('class', classString);

      return icon;
    }
  });

  /*
    <section class="score-panel">
        <ul class="stars">
            <li>
                <i class="fa fa-star"></i>
            </li>
            <li>
                <i class="fa fa-star"></i>
            </li>
            <li>
                <i class="fa fa-star"></i>
            </li>
        </ul>

        <span class="moves">3</span> Moves

        <div class="restart">
            <i class="fa fa-repeat"></i>
        </div>
    </section>
  */

  // TODO
  // add method to change # of stars
  class ScorePanel {
    constructor(numberOfStars = 3) {
      this.numberOfStars = numberOfStars;
    }

    makeRestartButton() {
      const aDiv = document.createElement('div');
      const repeatIcon = this.makeIcon('fa fa-repeat');
      aDiv.appendChild(repeatIcon);

      return aDiv;
    }

    makeListItem(...children) {
      const listItem = document.createElement('LI');
      const listItemWithChildren = children.reduce((acc, child) => {
        acc.appendChild(child);
        return acc;
      }, listItem);

      return listItemWithChildren;
    }

    makePanel(classString) {
      const restartButton = this.makeRestartButton();
      const section = document.createElement('SECTION');
      const unorderedList = document.createElement('ul');

      for (let i = 0; i < this.numberOfStars; i++) {
        const iconWithCssClass = this.makeIcon('fa fa-star');
        const listItem = this.makeListItem(iconWithCssClass);
        unorderedList.appendChild(listItem);
      }

      section.appendChild(unorderedList);
      section.appendChild(restartButton);
      section.setAttribute('class', classString);

      return section;
    }
  }

  canMakeIcons(ScorePanel.prototype);

  // TODO
  const handler = e => {
    console.log('top level', e.target);
    const cssClasses = e.target.classList;
    const isCard = cssClasses.contains('back') || cssClasses.contains('front');
    const matched = e.target.parentNode.classList.contains('match');
    if (isCard && !matched) {
      console.log('isCard and !matched e.target', e.target);
      const parent = e.target.parentNode;
      parent.classList.toggle('open');
      parent.classList.toggle('show');
    } else {
      console.log('not isCard or is matched');
    }
  };

  const documentBody = document.body;
  documentBody.addEventListener('click', handler, true);

  const domElementCheck = o => o instanceof Element;

  class Card {
    constructor(iconClass) {
      this.iconClass = iconClass;
    }

    // makeIcon(classString) {
    //   const icon = document.createElement('I');
    //   icon.setAttribute('class', classString);

    //   return icon;
    // }

    makeFrontFace(str) {
      const icon = this.makeIcon(this.iconClass);
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

  canMakeIcons(Card.prototype);

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
      this.scorePanel = new ScorePanel().makePanel('score-panel');
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
      try {
        const docFrag = this.makeDeckDocFrag();
        domElement.appendChild(docFrag);
        return true;
      } catch (e) {
        throw new Error('error with appendDeckTo method', e);
      }
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
  console.log('game scorePanel is', game.scorePanel);
  game.appendDeckTo(deckTag);
  const moves = document.getElementsByClassName('moves')[0];
  moves.innerText = 1000;
  console.log('moves.innerTest is', moves.innerText);
})();
