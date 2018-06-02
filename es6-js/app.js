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

  const appendAll = (...children) => parent =>
    children.forEach(child => parent.appendChild(child));

  const setCssClass = cssClassString => htmlElement =>
    htmlElement.setAttribute('class', cssClassString);

  const FunctionalMixin = behavior => target => Object.assign(target, behavior);

  // mixin makeIcon method into a class
  const canMakeIcons = FunctionalMixin({
    makeIcon(classString) {
      const icon = document.createElement('I');

      setCssClass(classString)(icon);

      return icon;
    }
  });

  class GameOverModal {
    makeModal() {
      const modalContainer = document.createElement('div');
      const modalGameOverText = document.createElement('span');
      const modalTimeSpanTag = document.createElement('span');
      const modalMovesMadeTag = document.createElement('span');
      const modalRatingSpanTag = document.createElement('span');
      const modalButton = document.createElement('button');

      modalGameOverText.innerText = 'Game over! Your final stats are: ';
      modalButton.innerText = 'Play again!';

      setCssClass('modal-game-over-text')(modalGameOverText);
      setCssClass('modal-time')(modalTimeSpanTag);
      setCssClass('modal-moves-made')(modalMovesMadeTag);
      setCssClass('modal-rating')(modalRatingSpanTag);
      setCssClass('modal-button')(modalButton);

      appendAll(
        modalGameOverText,
        modalTimeSpanTag,
        modalMovesMadeTag,
        modalRatingSpanTag,
        modalButton
      )(modalContainer);

      setCssClass('modal')(modalContainer);

      return modalContainer;
    }
  }

  class ScorePanel {
    makeStartButton() {
      const startButton = document.createElement('div');

      setCssClass('move-right start')(startButton);

      return startButton;
    }

    makeRestartButton() {
      const aDiv = document.createElement('div');
      const repeatIcon = this.makeIcon('fa fa-repeat');

      aDiv.appendChild(repeatIcon);

      setCssClass('restart')(aDiv);

      return aDiv;
    }

    makeMovesTag(numOfMoves) {
      const spanTag = document.createElement('span');

      spanTag.innerText = numOfMoves;
      setCssClass('move-right moves')(spanTag);

      return spanTag;
    }

    makeTimerTag(timeString) {
      const spanTag = document.createElement('span');

      spanTag.innerText = timeString;
      setCssClass('move-right timer')(spanTag);

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

      setCssClass('stars')(unorderedList);

      appendAll(unorderedList, movesTag, timerTag, startButton, restartButton)(
        section
      );

      setCssClass(classString)(section);

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
      setCssClass(str)(frontFace);

      return frontFace;
    }

    makeBackFace(str) {
      const backFace = document.createElement('div');

      setCssClass(str)(backFace);

      return backFace;
    }

    makeCard() {
      const frontFace = this.makeFrontFace('front');
      const backFace = this.makeBackFace('back');
      const card = document.createElement('LI');

      setCssClass('card')(card);

      appendAll(frontFace, backFace)(card);

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

      setCssClass('deck')(deck);

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

    resetTimer({ currentState }) {      
      this.stopTimer(currentState);

      currentState.secondsElapsed = 0;
      currentState.timerId = null;
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

    stopTimer(currentState) {
      const { timerId } = currentState;
      if (timerId !== null) {
        clearInterval(timerId);
        currentState.timerId = null;
        // clear event listeners for timeTick event
        this.emitter.events = {};
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

    toggleGameStarted(currentState) {
      const { playingGame } = currentState;

      currentState.playingGame = !playingGame;
    }

    checkIfGameWon({ numSuccessMatches, numMatchesToWin }) {
      return numSuccessMatches === numMatchesToWin;
    }

    getModalContainer() {
      return document.getElementsByClassName('modal')[0];
    }

    getModalTimeTag() {
      return document.getElementsByClassName('modal-time')[0];
    }

    getModalMovesMadeTag() {
      return document.getElementsByClassName('modal-moves-made')[0];
    }

    getModalRatingTag() {
      return document.getElementsByClassName('modal-rating')[0];
    }

    setModalTimeValue(modalTimeHtmlElement, timeString) {
      console.log('setModalTimeValue called');
      console.log('modalTimeHtmlElement is', modalTimeHtmlElement);
      console.log('timeString is', timeString);
      return (modalTimeHtmlElement.innerText = timeString);
    }

    setModalMovesMadeValue(modalMovesMadeHtmlElement, numMovesMade) {
      return (modalMovesMadeHtmlElement.innerText = `You've made ${numMovesMade} moves in this game`);
    }

    setModalRatingValue(modalRatingHtmlElement, numOfStars) {
      console.log('setModalRatingValue called');
      console.log('modalRatingHtmlElement is', modalRatingHtmlElement);
      console.log('numOfStars is', numOfStars);
      return (modalRatingHtmlElement.innerText = numOfStars);
    }

    endGame(state, timer, view) {
      console.log('endGame called');

      this.toggleGameStarted(state);

      timer.stopTimer(state);

      const {
        currentState: { numMovesMade, secondsElapsed, starRating }
      } = state;
      const timeString = timer.getTimeElapsedString(secondsElapsed);

      timer.resetTimer(state);

      this.setModalTimeValue(this.getModalTimeTag(), timeString);
      this.setModalMovesMadeValue(
        this.getModalMovesMadeTag(),
        `You've made ${numMovesMade} moves`
      );
      this.setModalRatingValue(this.getModalRatingTag(), starRating);

      view.setCssDisplay(this.getModalContainer(), 'flex');
    }

    resetGame(timer, state, view) {
      this.matchEmitter = new Emitter();

      timer.resetTimer(state);

      state.currentState = new GameState();

      this.getScorePanelElement().remove();
      this.getDeckElement().remove();

      view.renderGame({
        container: this.getGameContainer(),
        state
      });

      this.getStartButton().addEventListener(
        'click',
        e =>
          Controller.handleStartClick(
            e,
            State,
            Timer,
            View,
            this.getTimerElement()
          ),
        false
      );

      this.getRestartButton().addEventListener(
        'click',
        e => this.handleRestartClick(Timer, State, View),
        false
      );

      this.getDeckElement().addEventListener(
        'click',
        e => this.handleDeckClick(e, State),
        false
      );
    }

    handleRestartClick(timer, state, view) {
      console.log('handleRestartClick called');

      this.resetGame(timer, state, view);
    }

    handleStartClick(e, state, timerObj, viewObj, timerElement) {
      console.log('start clicked');
      const { currentState } = state;
      const { playingGame } = currentState;

      // if game already started, start button does nothing
      if (playingGame) {
        return;
      }

      this.toggleGameStarted(currentState);

      timerObj.startTimerAndEmitTimeTickEvent(currentState);
      timerObj.emitter.on('timeTick', () =>
        viewObj.renderTimerValue(
          timerObj.getTimeElapsedString(currentState.secondsElapsed),
          timerElement
        )
      );

      this.matchEmitter.on('successfulMatch', () => {
        console.log('successfulMatch event emitted');
        this.setSuccessMatches(currentState, ++currentState.numSuccessMatches);
        const gameWon = this.checkIfGameWon(currentState);
        if (gameWon) {
          return this.endGame(state, timerObj, viewObj);
        }
      });

      // TODO: check if at limit for star degredation
      // if it is change star rating
      // render new stars
      this.matchEmitter.on('failedMatch', () => {
        console.log('failedMatch event emitted');
        this.setFailedMatches(currentState, ++currentState.numFailedMatches);
      });

      this.matchEmitter.on('moveMade', () => {
        console.log('moveMade event emitted');
        this.setMovesMade(currentState, ++currentState.numMovesMade);
        viewObj.renderNumMovesMade(
          `${currentState.numMovesMade}`,
          this.getMovesElement()
        );
      });
    }

    toggleCurrentlyAnimating(state) {
      state.currentlyAnimating = !state.currentlyAnimating;
    }

    makeDeckUnclickable(state, seconds) {
      setTimeout(() => this.toggleCurrentlyAnimating(state), seconds);
      this.toggleCurrentlyAnimating(state);
    }

    handleDeckClick(e, stateObj) {
      console.log('handleDeckClick e.target', e.target);
      const { currentState } = stateObj;
      const { playingGame, currentlyAnimating } = currentState;
      // UNCOMMENT WHEN FINISHED
      if (!playingGame || currentlyAnimating) {
        return;
      }

      const { target } = e;
      const { parentNode } = target;

      const card = isCard(target);
      const matched = isMatched(target);
      // parentNode because 'show' class is toggled on parent
      const showing = isShowing(parentNode);

      if (!card || matched || showing) {
        return;
      }

      flip(parentNode);

      // so player can't cheat by flipping too many cards at once
      // this.makeDeckUnclickable(currentState, 740);

      const { firstCardPickedIcon } = currentState;

      if (!firstCardPickedIcon) {
        // store reference to <i> tag containing icon className
        const firstCardIcon = target.previousSibling.firstChild;

        return this.setFirstCardPickedIcon(currentState, firstCardIcon);
      }

      // only increment moves if user is on second pick
      this.matchEmitter.emit('moveMade');

      // store reference to <i> tag containing icon className
      const secondCardPickedIcon = target.previousSibling.firstChild;
      const cardsPicked = [firstCardPickedIcon, secondCardPickedIcon];

      const firstCardIconValue = firstCardPickedIcon.className;
      const secondCardIconValue = secondCardPickedIcon.className;

      const cardsAreMatch = firstCardIconValue === secondCardIconValue;

      // card element that contains both back and front faces is
      // grandparent of icon tag that contains card value
      const cards = cardsPicked.map(iconTag => iconTag.parentNode.parentNode);

      if (cardsAreMatch) {
        setCardsAsMatched(...cards);

        this.matchEmitter.emit('successfulMatch');
      } else {
        animateFailedMatch(...cards);

        // flip back the failed matches
        setTimeout(() => flip(...cards), 1500);

        this.matchEmitter.emit('failedMatch');
      }

      this.setFirstCardPickedIcon(currentState, null);

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
          throw new Error(`setCardsToMatched error: ${e}`);
        }
      }
    }

    setFirstCardPickedIcon(stateObj, cardStringOrNull) {
      stateObj.firstCardPickedIcon = cardStringOrNull;
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

    getGameContainer() {
      return document.getElementsByClassName('container')[0];
    }

    getScorePanelElement() {
      return document.getElementsByClassName('score-panel')[0];
    }

    
    getTimerElement() {
      return document.getElementsByClassName('timer')[0];
    }

    getMovesElement() {
      return document.getElementsByClassName('moves')[0];
    }

    getDeckElement() {
      return document.getElementsByClassName('deck')[0];
    }

    getStartButton() {
      return document.getElementsByClassName('start')[0];
    }

    getRestartButton() {
      return document.getElementsByClassName('restart')[0];
    }

    getModalButton() {
      return document.getElementsByClassName('modal-button')[0];
    }

    handleModalButtonClick(timer, state, view) {
      console.log('handleModalButtonClick called');
      this.resetGame(timer, state, view);
      view.setCssDisplay(this.getModalContainer(), 'none');
    }
  }

  class GameView {
    renderGame({
      container,
      state: {
        currentState: { gameOverModal, scorePanel, currentDeck }
      }
    }) {
      const docFrag = document.createDocumentFragment();

      appendAll(gameOverModal, scorePanel, currentDeck)(docFrag);

      container.appendChild(docFrag);
    }

    renderNumMovesMade(num, movesElement) {
      movesElement.innerText = `${num} Moves`;
    }

    renderTimerValue(val, timerElement) {
      timerElement.innerText = val;
    }

    setCssDisplay(element, displayValue) {
      element.style.display = displayValue;
    }
  }

  class GameState {
    constructor({
      playingGame = false,
      timerId = null,
      firstCardPickedIcon = null,
      numFlippableCards = 16,
      secondsElapsed = 0,
      starRating = 3,
      numMovesMade = 0,
      numSuccessMatches = 0,
      numFailedMatches = 0,
      numMatchesToWin = SUCCESSFUL_MATCHES_TO_WIN,
      arrOfIconStrings = CARD_ICONS,
      currentlyAnimating = false
    } = {}) {
      this.playingGame = playingGame;
      this.timerId = timerId;
      this.firstCardPickedIcon = firstCardPickedIcon;
      this.numFlippableCards = numFlippableCards;
      this.secondsElapsed = secondsElapsed;
      this.starRating = starRating;
      this.numMovesMade = numMovesMade;
      this.numSuccessMatches = numSuccessMatches;
      this.numFailedMatches = numFailedMatches;
      this.numMatchesToWin = numMatchesToWin;
      this.arrOfIconStrings = arrOfIconStrings;
      this.currentDeck = new Deck().makeDeck(this.arrOfIconStrings);
      this.scorePanel = new ScorePanel().makePanel(
        this.starRating,
        'score-panel'
      );
      this.gameOverModal = new GameOverModal().makeModal();
      this.currentlyAnimating = currentlyAnimating;
      this.deckElement = null;
      this.startButton = null;
      this.restartButton = null;
    }
  }

  const Timer = new GameTimer();
  const Controller = new GameController();
  const State = {
    currentState: new GameState()
  };
  const View = new GameView();

  // initial render, subsequent renders handled by Controller
  View.renderGame({
    container: Controller.getGameContainer(),
    state: State
  });

  // refactored to not cache startButton, deckElement, and restartButton
  // HTML elements in variables so they (along with their listeners)
  // can be garbage collected when removed from DOM
  Controller.getStartButton().addEventListener(
    'click',
    e =>
      Controller.handleStartClick(
        e,
        State,
        Timer,
        View,
        Controller.getTimerElement()
      ),
    false
  );

  Controller.getDeckElement().addEventListener(
    'click',
    e => Controller.handleDeckClick(e, State),
    false
  );

  Controller.getRestartButton().addEventListener(
    'click',
    e => Controller.handleRestartClick(Timer, State, View),
    false
  );

  Controller.getModalButton().addEventListener(
    'click',
    e => Controller.handleModalButtonClick(Timer, State, View),
    false
  );

  Controller.setModalTimeValue(Controller.getModalTimeTag(), '15:57');
  Controller.setModalRatingValue(Controller.getModalRatingTag(), '3');

  // View.setCssDisplay(Controller.getModalContainer(), 'flex');
})();
