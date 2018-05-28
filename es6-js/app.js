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

    makeShuffledCards(arrOfIconStrings) {
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
      const shuffledCards = this.makeShuffledCards(arrOfIconStrings);

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

  class GameTimer {
    constructor() {
      this.emitter = new Emitter();
    }
    increaseSeconds(stateObj, amount) {
      stateObj.secondsElapsed += amount;
    }

    resetTimer(state) {
      console.log('resetTimer called');
      this.stopTimer(state.currentState);
      state.currentState.secondsElapsed = 0;
      state.currentState.timerId = null;
      console.log('resetTimer end', state);
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

    stopTimer(stateObj) {
      const timerId = stateObj.timerId;

      if (timerId !== null) {
        clearInterval(timerId);
        stateObj.timerId = null;
        // clear event listeners for timeTick event
        this.emitter.events = {};
      } else {
        throw new Error(`stopTimer error`);
      }
    }
  }

  class GameController {
    constructor() {
      this.matchEmitter = new Emitter();
    }

    makeDeck(deckObj, arrOfIconStrings) {
      return deckObj.makeDeck(arrOfIconStrings);
    }

    toggleGameStarted(stateObj) {
      const currentState = stateObj.playingGame;

      stateObj.playingGame = !currentState;
    }

    checkIfGameWon(stateObj) {
      return stateObj.numSuccessMatches === stateObj.numMatchesToWin;
    }

    endGame(state, timer, view, timerElement) {
      console.log('endGame called');

      // pause timer
      // cause modal to display
      // modal should:
      // - ask if they want to play again
      // - display time it took to win game
      // - display their star rating
      timer.stopTimer(state);
    }

    handleRestartClick({
      timer,
      state,
      view,
      gameContainer,
      startButton,
      deckHtmlEl
    }) {
      console.log('handleRestartClick called');

      timer.resetTimer(state);

      // reset state
      state.currentState = new GameState();

      // remove 

      // renderGame anew


      // attach listeners to startbutton and deckhtmlel


      /*
        const deckOfCards = new Deck().makeDeck(State.arrOfIconStrings);
        const scorePanel = new ScorePanel().makePanel(3, 'score-panel');
      */
    }

    handleStartClick(e, stateObj, timerObj, viewObj, timerElement) {
      console.log('start clicked');
      const currentlyPlaying = stateObj.currentState.playingGame;

      // if game already started, start button does nothing
      if (currentlyPlaying) {
        return;
      }

      this.toggleGameStarted(stateObj.currentState);

      timerObj.startTimerAndEmitTimeTickEvent(stateObj.currentState);
      timerObj.emitter.on('timeTick', () =>
        viewObj.renderTimerValue(
          timerObj.getTimeElapsedString(stateObj.currentState.secondsElapsed),
          timerElement
        )
      );

      this.matchEmitter.on('successfulMatch', () => {
        console.log('successfulMatch event emitted');
        this.setSuccessMatches(
          stateObj.currentState,
          ++stateObj.currentState.numSuccessMatches
        );
        const gameWon = this.checkIfGameWon(stateObj.currentState);
        if (gameWon) {
          return this.endGame(
            stateObj.currentState,
            timerObj,
            viewObj,
            timerElement
          );
        }
      });

      // TODO: check if at limit for star degredation
      // if it is change star rating
      // render new stars
      this.matchEmitter.on('failedMatch', () => {
        console.log('failedMatch event emitted');
        this.setFailedMatches(
          stateObj.currentState,
          ++stateObj.currentState.numFailedMatches
        );
      });

      this.matchEmitter.on('moveMade', () => {
        console.log('moveMade event emitted');
        this.setMovesMade(
          stateObj.currentState,
          ++stateObj.currentState.numMovesMade
        );

        const movesTag = document.getElementsByClassName('moves')[0];
        viewObj.renderNumMovesMade(
          `${stateObj.currentState.numMovesMade} Moves`,
          movesTag
        );
      });
    }

    handleDeckClick(e, stateObj) {
      // UNCOMMENT WHEN FINISHED
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

      // only increment moves if user is on second pick
      this.matchEmitter.emit('moveMade');

      // store reference to <i> tag containing icon className
      const secondCardPicked = target.previousSibling.firstChild;
      const cardsPicked = [firstCardPicked, secondCardPicked];

      const secondCardValue = secondCardPicked.className;
      const firstCardValue = firstCardPicked.className;

      const cardsAreMatch = firstCardValue === secondCardValue;
      const cardContainers = cardsPicked.map(
        iconTag => iconTag.parentNode.parentNode
      );

      if (cardsAreMatch) {
        setCardsAsMatched(...cardContainers);

        this.matchEmitter.emit('successfulMatch');
      } else {
        animateFailedMatch(...cardContainers);

        // flip back the failed matches
        setTimeout(() => flip(...cardContainers), 1500);

        this.matchEmitter.emit('failedMatch');
      }

      this.setFirstCardPicked(stateObj, null);

      // utility functions
      function addFailClassTo(element) {
        return addClasses('fail')(element);
      }

      function removeFailClassFrom(element) {
        return removeClasses('fail')(element);
      }

      function animateFailedMatch(...elements) {
        elements.forEach(element => {
          setTimeout(() => addFailClassTo(element), 600);
          setTimeout(() => removeFailClassFrom(element), 1500);
        });
      }

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
      const docFrag = document.createDocumentFragment();
      arrOfGameElements.forEach(gameElement =>
        docFrag.appendChild(gameElement)
      );

      container.appendChild(docFrag);
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
      this.currentDeck = new Deck().makeDeck(this.arrOfIconStrings);
      this.scorePanel = new ScorePanel().makePanel(3, 'score-panel');
    }
  }

  const Timer = new GameTimer();
  const Controller = new GameController();
  const State = { currentState: new GameState() };
  const View = new GameView();

  ///////////////////////////////////////////////////////////////////////
  // consider if these are Controller's responsibility
  const gameContainer = document.getElementsByClassName('container')[0];
  // maybe store deckOfCards in another property within State?
  // so I can just set it to a new Deck().makeDeck(State.currentState.arrOfIconStrings)
  // when resetting game.
  const deckOfCards = State.currentState.currentDeck;
  const scorePanel = State.currentState.scorePanel;

  // initial render, subsequent renders handled by Controller
  View.renderGame({
    container: gameContainer,
    arrOfGameElements: [scorePanel, deckOfCards]
  });
  //////////////////////////////////////////////////////////////////////////
  const deckElement = document.getElementsByClassName('deck')[0];
  const startButton = document.getElementsByClassName('start')[0];
  const restartButton = document.getElementsByClassName('restart')[0];
  const timerElement = document.getElementsByClassName('timer')[0];

  function startButtonListenerFn({
    controller,
    state,
    timer,
    view,
    timerHtmlEl
  }) {
    return function(e) {
      return controller.handleStartClick(e, state, timer, view, timerHtmlEl);
    };
  }

  function deckListenerFn(controller, state) {
    return function(e) {
      return controller.handleDeckClick(e, state);
    };
  }
  function restartButtonListenerFn(obj) {
    return function(e) {
      return obj.controller.handleRestartClick(obj);
    };
  }

  startButton.addEventListener(
    'click',
    startButtonListenerFn({
      controller: Controller,
      state: State,
      timer: Timer,
      view: View,
      timerHtmlEl: timerElement
    }),
    false
  );
  // e, timer, state, view, gameContainer, startButton, deckEl
  deckElement.addEventListener(
    'click',
    deckListenerFn(Controller, State),
    false
  );
  restartButton.addEventListener(
    'click',
    restartButtonListenerFn({
      timer: Timer,
      controller: Controller,
      state: State,
      view: View,
      gameContainer: gameContainer,
      startButton: startButton,
      deckHtmlEl: deckElement
    }),
    false
  );
})();
