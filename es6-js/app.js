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

  class ScorePanel {
    makeStartButton() {
      const startButton = document.createElement('div');
      startButton.setAttribute('class', 'move-right start');

      return startButton;
    }

    makeRestartButton() {
      const aDiv = document.createElement('div');
      const repeatIcon = this.makeIcon('fa fa-repeat');
      aDiv.appendChild(repeatIcon);
      aDiv.setAttribute('class', 'restart');

      return aDiv;
    }

    makeMovesTag(numOfMoves) {
      const spanTag = document.createElement('span');

      spanTag.innerText = numOfMoves;
      spanTag.setAttribute('class', 'move-right moves');

      return spanTag;
    }

    makeTimerTag(initialTime) {
      const spanTag = document.createElement('span');

      spanTag.innerText = initialTime;
      spanTag.setAttribute('class', 'move-right timer');

      return spanTag;
    }

    makeListItem(...children) {
      const listItem = document.createElement('LI');
      const listItemWithChildren = children.reduce((acc, child) => {
        acc.appendChild(child);
        return acc;
      }, listItem);

      return listItemWithChildren;
    }

    makePanel(numberOfStars, classString) {
      const startButton = this.makeStartButton();
      const restartButton = this.makeRestartButton();
      const section = document.createElement('SECTION');
      const unorderedList = document.createElement('ul');
      const movesTag = this.makeMovesTag('0 Moves');
      const timerTag = this.makeTimerTag('0:00');

      for (let i = 0; i < numberOfStars; i++) {
        const iconWithCssClass = this.makeIcon('fa fa-star');
        const listItem = this.makeListItem(iconWithCssClass);
        unorderedList.appendChild(listItem);
      }

      unorderedList.setAttribute('class', 'stars');

      section.appendChild(unorderedList);
      section.appendChild(movesTag);
      section.appendChild(timerTag);
      section.appendChild(startButton);
      section.appendChild(restartButton);

      section.setAttribute('class', classString);

      return section;
    }
  }

  canMakeIcons(ScorePanel.prototype);

  const domElementCheck = o => o instanceof Element;

  class Card {
    constructor(iconClass) {
      this.iconClass = iconClass;
    }

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

    makeDeckOfCards(arrOfIconStrings) {
      const arrOfCards = arrOfIconStrings.reduce((acc, iconClass) => {
        const firstCard = new Card(iconClass).makeCard();
        const secondCard = new Card(iconClass).makeCard();

        acc.push(firstCard);
        acc.push(secondCard);

        return acc;
      }, []);
      const shuffledDeck = this.shuffleDeck(arrOfCards);
      return shuffledDeck;
    }

    makeDeck(arrOfIconStrings) {
      const shuffledCards = this.makeDeckOfCards(arrOfIconStrings);

      const deck = shuffledCards.reduce((acc, card) => {
        acc.appendChild(card);
        return acc;
      }, document.createElement('ul'));

      deck.setAttribute('class', 'deck');

      return deck;
    }
  }

  class Timer {

    increaseSeconds(stateObj, amount) {
      stateObj.secondsElapsed += amount;
      console.log('new time', stateObj.secondsElapsed);
    }

    resetSeconds() {
      this.pauseTimer();
      this.startingSeconds = 0;
      this.timerId = null;
      console.log(this.startingSeconds, this.timerId);
    }

    getMinutes(seconds) {
      return Math.floor(seconds / 60);
    }

    getSeconds(seconds) {
      const minutes = this.getMinutes(seconds);
      const remainingSeconds = seconds - minutes * 60;

      return remainingSeconds;
    }

    startTimer(stateObj) {
      this.timerId = setInterval(() => this.increaseSeconds(stateObj, 1), 1000);
    }

    pauseTimer(stateObj) {
      if (this.timerId !== null) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    }
  }

  class GameController {
    toggleGameStarted(stateObj) {
      const currentState = stateObj.playingGame;

      stateObj.playingGame = !currentState;
    }

    handleStartClick(e, stateObj, timerObj) {
      console.log('start clicked');
      this.toggleGameStarted(stateObj);
      const currentlyPlaying = stateObj.playingGame;
      if(currentlyPlaying) {
        timerObj.startTimer(stateObj);
      }else {
        timerObj.pauseTimer(stateObj);
      }
      console.log('stateObj after togggle is', stateObj);
    }

    handleDeckClick(e, stateObj) {
      console.log('top level', e.target);
      const cssClasses = e.target.classList;
      const isCard =
        cssClasses.contains('back') || cssClasses.contains('front');
      const matched = e.target.parentNode.classList.contains('match');
      if (isCard && !matched) {
        console.log('isCard and !matched e.target', e.target);
        const parent = e.target.parentNode;
        parent.classList.toggle('open');
        parent.classList.toggle('show');
      } else {
        console.log('not isCard or is matched');
      }
    }

    setSecondsElapsed(stateObj, secondsElapsed) {
      stateObj.secondsElapsed = secondsElapsed;
      return stateObj;
    }

    setStarRating(stateObj, numberOfStars) {
      stateObj.starRating = numberOfStars;
      return stateObj;
    }

    setMovesMade(stateObj, numberOfMoves) {
      stateObj.numMovesMade = numberOfMoves;
      return stateObj;
    }

    setSuccessMatches(stateObj, numberOfSuccessMatches) {
      stateObj.numSuccessMatches = numberOfSuccessMatches;
      return stateObj;
    }

    setFailedMatches(stateObj, numberOfFailedMatches) {
      stateObj.numFailedMatches = numberOfFailedMatches;
      return stateObj;
    }

    getSecondsElapsed({ secondsElapsed }) {
      return secondsElapsed;
    }

    getStarRating({ starRating }) {
      return starRating;
    }

    getNumMovesMade({ numMovesMade }) {
      return numMovesMade;
    }

    getNumSuccessMatches({ numSuccessMatches }) {
      return numSuccessMatches;
    }

    getNumFailedMatches({ numFailedMatches }) {
      return numFailedMatches;
    }
  }

  class GameView {
    renderGame({ container, arrOfGameElements }) {
      arrOfGameElements.forEach(gameElement =>
        container.appendChild(gameElement)
      );
    }

    renderNumMovesMade(num, movesElement) {
      movesElement.innerText = `${num} Moves`;
    }
  }

  class GameState {
    constructor({
      playingGame = false,
      timerId = null,
      firstCardPicked = null,
      numFlippableCards = 16,
      secondsElapsed = 0,
      starRating = 3,
      numMovesMade = 0,
      numSuccessMatches = 0,
      numFailedMatches = 0,
      arrOfIconStrings = CARD_ICONS
    } = {}) {
      this.playingGame = playingGame;
      this.timerId = timerId;
      this.firstCardPicked = firstCardPicked;
      this.numFlippableCards = numFlippableCards;
      this.secondsElapsed = secondsElapsed;
      this.starRating = starRating;
      this.numMovesMade = numMovesMade;
      this.numSuccessMatches = numSuccessMatches;
      this.numFailedMatches = numFailedMatches;
      this.arrOfIconStrings = arrOfIconStrings;
    }
  }

  const gameContainer = document.getElementsByClassName('container')[0];
  const timer = new Timer();
  const gameState = new GameState();
  const gameController = new GameController();
  const gameView = new GameView();

  const deckOfCards = new Deck().makeDeck(gameState.arrOfIconStrings);
  const scorePanel = new ScorePanel().makePanel(3, 'score-panel');

  gameView.renderGame({
    container: gameContainer,
    arrOfGameElements: [scorePanel, deckOfCards]
  });

  const deck = document.getElementsByClassName('deck')[0];
  const startButton = document.getElementsByClassName('start')[0];

  startButton.addEventListener(
    'click',
    e => gameController.handleStartClick(e, gameState, timer),
    false
  );
  deck.addEventListener(
    'click',
    e => gameController.handleDeckClick(e, gameState),
    false
  );

  const moves = document.getElementsByClassName('moves')[0];
})();
