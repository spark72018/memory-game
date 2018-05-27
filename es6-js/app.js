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

  // used to mixin behavior into classes
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

  class Emitter {
    constructor(events = {}) {
      this.events = events;
    }

    on(type, listener) {
      this.events[type] = this.events[type] || [];
      if (typeof listener === 'function') {
        this.events[type].push(listener);
      } else {
        throw new Error('listener must be a function!');
      }
    }

    emit(type) {
      if (this.events[type]) {
        this.events[type].forEach(listener => listener());
      } else {
        throw new Error(`${type} does not exist on events object!`);
      }
    }
  }

  class Timer {
    constructor() {
      this.emitter = new Emitter();
    }
    increaseSeconds(stateObj, amount) {
      stateObj.secondsElapsed += amount;
    }

    resetSeconds(stateObj) {
      this.pauseTimer();
      stateObj.secondsElapsed = 0;
      stateObj.timerId = null;
      console.log('resetSeconds', stateObj.secondsElapsed, stateObj.timerId);
    }

    getMinutes(seconds) {
      return Math.floor(seconds / 60);
    }

    getRemainingSeconds(seconds) {
      const minutes = this.getMinutes(seconds);
      const remainingSeconds = seconds - minutes * 60;

      return remainingSeconds;
    }

    getTimeElapsedString(seconds) {
      const minutes = this.getMinutes(seconds);
      const remainingSeconds = this.getRemainingSeconds(seconds);

      return `${minutes}:${
        remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds
      }`;
    }

    startTimerAndEmitTimeTickEvent(stateObj) {
      this.emitter.on('timeTick', () => this.increaseSeconds(stateObj, 1));

      stateObj.timerId = setInterval(() => {
        this.emitter.emit('timeTick');
      }, 1000);
    }

    pauseTimer(stateObj) {
      const timerId = stateObj.timerId;
      if (timerId !== null) {
        clearInterval(timerId);
        stateObj.timerId = null;
        // clear event listeners for timeTick event
        this.emitter.events = {};
      }
    }
  }

  class GameController {
    constructor() {
      this.matchEmitter = new Emitter();
    }
    toggleGameStarted(stateObj) {
      const currentState = stateObj.playingGame;

      stateObj.playingGame = !currentState;
    }

    checkIfGameWon(stateObj) {
      return stateObj.numSuccessMatches === stateObj.numMatchesToWin;
    }

    endGame(stateObj, timerObj, viewObj, timerElement) {
      console.log('endGame called');
    }

    handleStartClick(e, stateObj, timerObj, viewObj, timerElement) {
      console.log('start clicked');

      this.matchEmitter.on('successfulMatch', () => {
        console.log('successfulMatch event emitted');
        this.setSuccessMatches(stateObj, ++stateObj.numSuccessMatches);
        const gameWon = this.checkIfGameWon(stateObj);
        if(gameWon) {
          return this.endGame(stateObj, timerObj, viewObj, timerElement);
        }
      });

      // TODO: check if at limit for star degredation
        // if it is change star rating
        // render new stars
      this.matchEmitter.on('failedMatch', () => {
        console.log('failedMatch event emitted');
        this.setFailedMatches(stateObj, ++stateObj.numFailedMatches);

      });

      this.matchEmitter.on('moveMade', () => {
        console.log('moveMade event emitted');
        this.setMovesMade(stateObj, ++stateObj.numMovesMade);

        const movesTag = document.getElementsByClassName('moves')[0];
        viewObj.renderNumMovesMade(`${stateObj.numMovesMade} Moves`, movesTag);
      });

      this.toggleGameStarted(stateObj);
      const currentlyPlaying = stateObj.playingGame;

      if (currentlyPlaying) {
        timerObj.startTimerAndEmitTimeTickEvent(stateObj);
        timerObj.emitter.on('timeTick', () =>
          viewObj.renderTimerValue(
            timerObj.getTimeElapsedString(stateObj.secondsElapsed),
            timerElement
          )
        );
      } else {
        timerObj.pauseTimer(stateObj);
      }
    }

    handleDeckClick(e, stateObj) {
      // UNCOMMENT AT END
      // if(!stateObj.playingGame) {
      //   return;
      // }
      console.log('top level', e.target);
      const target = e.target;
      const parent = e.target.parentNode;

      const card = isCard(target);
      const matched = isMatched(target);
      // parentNode because 'show' class is toggled on parent
      const showing = isShowing(parent);

      if (!card || matched || showing) {
        return;
      }

      flip(parent);
      
      const firstCardPicked = stateObj.firstCardPicked;
      
      if (!firstCardPicked) {
        // store reference to <i> tag containing icon className
        const firstCard = target.previousSibling.firstChild;

        return this.setFirstCardPicked(stateObj, firstCard);
      }

      this.matchEmitter.emit('moveMade');

      // store reference to <i> tag containing icon className
      const secondCardPicked = target.previousSibling.firstChild;
      const cardsPicked = [firstCardPicked, secondCardPicked];

      const secondCardValue = target.previousSibling.firstChild.className;
      const firstCardValue = firstCardPicked.className;

      const cardsAreMatch = firstCardValue === secondCardValue;
      const cardContainers = cardsPicked.map(iconTag => iconTag.parentNode.parentNode);

      if (cardsAreMatch) {
        setCardsAsMatched(...cardContainers);

        this.matchEmitter.emit('successfulMatch');
      }else {
        // TODO: animateFailedMatch(...cardContainers);
        setTimeout(() => flip(...cardContainers), 1000);

        this.matchEmitter.emit('failedMatch');
      }

      this.setFirstCardPicked(stateObj, null);

      // utility functions
      function isCard(element) {
        return (
          element.classList.contains('back') ||
          element.classList.contains('front')
        );
      }

      function isMatched(element) {
        return element.classList.contains('match');
      }

      function isShowing(element) {
        return element.classList.contains('show');
      }

      function flip(...elements) {
        elements.forEach(element => {
          element.classList.toggle('open');
          element.classList.toggle('show');
        });
      }

      function removeClasses(...classesToRemove) {
        return function(card) {
          card.classList.remove(...classesToRemove);

          return card;
        };
      }

      function addClasses(...classesToAdd) {
        return function(card) {
          card.classList.add(...classesToAdd);

          return card;
        };
      }

      function compose(fn1, fn2) {
        return function(initVal) {
          return fn1(fn2(initVal));
        };
      }

      function setCardsAsMatched(firstCard, secondCard) {
        const setCardToMatched = compose(
          addClasses('match'),
          removeClasses('open', 'show')
        );

        try {
          setCardToMatched(firstCard);
          setCardToMatched(secondCard);
          return true;
        } catch (e) {
          throw new Error(`setCardsAsMatched error: ${e}`);
        }
      }
    }

    setSecondsElapsed(stateObj, secondsElapsed) {
      stateObj.secondsElapsed = secondsElapsed;
      return stateObj;
    }

    setFirstCardPicked(stateObj, cardStringOrNull) {
      stateObj.firstCardPicked = cardStringOrNull;
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

    renderTimerValue(val, timerElement) {
      timerElement.innerText = val;
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
      numMatchesToWin = SUCCESSFUL_MATCHES_TO_WIN,
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
      this.numMatchesToWin = numMatchesToWin;
      this.arrOfIconStrings = arrOfIconStrings;
    }
  }

  const gameContainer = document.getElementsByClassName('container')[0];
  const timer = new Timer();
  const State = new GameState();
  const Controller = new GameController();
  const View = new GameView();

  const deckOfCards = new Deck().makeDeck(State.arrOfIconStrings);
  const scorePanel = new ScorePanel().makePanel(3, 'score-panel');

  View.renderGame({
    container: gameContainer,
    arrOfGameElements: [scorePanel, deckOfCards]
  });

  const deck = document.getElementsByClassName('deck')[0];
  const startButton = document.getElementsByClassName('start')[0];
  const timerElement = document.getElementsByClassName('timer')[0];

  startButton.addEventListener(
    'click',
    e => Controller.handleStartClick(e, State, timer, View, timerElement),
    false
  );
  deck.addEventListener(
    'click',
    e => Controller.handleDeckClick(e, State),
    false
  );

  const moves = document.getElementsByClassName('moves')[0];
})();
