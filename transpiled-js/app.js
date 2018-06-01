'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  // 16 cards, 8 matches needed to win game
  var SUCCESSFUL_MATCHES_TO_WIN = 8;
  var CARD_ICONS = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];
  // utility functions

  // used to mixin behavior into classes
  var FunctionalMixin = function FunctionalMixin(behavior) {
    return function (target) {
      return Object.assign(target, behavior);
    };
  };

  // mixin makeIcon method into a class
  var canMakeIcons = FunctionalMixin({
    makeIcon: function makeIcon(classString) {
      var icon = document.createElement('I');
      icon.setAttribute('class', classString);

      return icon;
    }
  });

  var GameOverModal = function () {
    function GameOverModal() {
      _classCallCheck(this, GameOverModal);
    }

    _createClass(GameOverModal, [{
      key: 'makeModal',
      value: function makeModal() {
        var modalContainer = document.createElement('div');
        var modalTimeSpanTag = document.createElement('span');
        var modalRatingSpanTag = document.createElement('span');

        modalTimeSpanTag.setAttribute('class', 'modal-time');
        modalRatingSpanTag.setAttribute('class', 'modal-rating');

        modalContainer.appendChild(modalTimeSpanTag);
        modalContainer.appendChild(modalRatingSpanTag);

        modalContainer.setAttribute('class', 'modal');

        return modalContainer;
      }
    }]);

    return GameOverModal;
  }();

  var ScorePanel = function () {
    function ScorePanel() {
      _classCallCheck(this, ScorePanel);
    }

    _createClass(ScorePanel, [{
      key: 'makeStartButton',
      value: function makeStartButton() {
        var startButton = document.createElement('div');

        startButton.setAttribute('class', 'move-right start');

        return startButton;
      }
    }, {
      key: 'makeRestartButton',
      value: function makeRestartButton() {
        var aDiv = document.createElement('div');
        var repeatIcon = this.makeIcon('fa fa-repeat');

        aDiv.appendChild(repeatIcon);
        aDiv.setAttribute('class', 'restart');

        return aDiv;
      }
    }, {
      key: 'makeMovesTag',
      value: function makeMovesTag(numOfMoves) {
        var spanTag = document.createElement('span');

        spanTag.innerText = numOfMoves;
        spanTag.setAttribute('class', 'move-right moves');

        return spanTag;
      }
    }, {
      key: 'makeTimerTag',
      value: function makeTimerTag(timeString) {
        var spanTag = document.createElement('span');

        spanTag.innerText = timeString;
        spanTag.setAttribute('class', 'move-right timer');

        return spanTag;
      }
    }, {
      key: 'makeListItem',
      value: function makeListItem() {
        var listItem = document.createElement('LI');

        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
          children[_key] = arguments[_key];
        }

        var listItemWithChildren = children.reduce(function (acc, child) {
          acc.appendChild(child);
          return acc;
        }, listItem);

        return listItemWithChildren;
      }
    }, {
      key: 'makePanel',
      value: function makePanel(numberOfStars, classString) {
        var startButton = this.makeStartButton();
        var restartButton = this.makeRestartButton();
        var section = document.createElement('SECTION');
        var unorderedList = document.createElement('ul');
        var movesTag = this.makeMovesTag('0 Moves');
        var timerTag = this.makeTimerTag('0:00');

        for (var i = 0; i < numberOfStars; i++) {
          var iconWithCssClass = this.makeIcon('fa fa-star');
          var listItem = this.makeListItem(iconWithCssClass);
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
    }]);

    return ScorePanel;
  }();

  canMakeIcons(ScorePanel.prototype);

  var Card = function () {
    function Card(iconClass) {
      _classCallCheck(this, Card);

      this.iconClass = iconClass;
    }

    _createClass(Card, [{
      key: 'makeFrontFace',
      value: function makeFrontFace(str) {
        var icon = this.makeIcon(this.iconClass);
        var frontFace = document.createElement('div');

        frontFace.appendChild(icon);
        frontFace.setAttribute('class', str);

        return frontFace;
      }
    }, {
      key: 'makeBackFace',
      value: function makeBackFace(str) {
        var backFace = document.createElement('div');

        backFace.setAttribute('class', str);

        return backFace;
      }
    }, {
      key: 'makeCard',
      value: function makeCard() {
        var frontFace = this.makeFrontFace('front');
        var backFace = this.makeBackFace('back');
        var card = document.createElement('LI');
        card.setAttribute('class', 'card');

        card.appendChild(frontFace);
        card.appendChild(backFace);

        return card;
      }
    }]);

    return Card;
  }();

  canMakeIcons(Card.prototype);

  var Deck = function () {
    function Deck() {
      _classCallCheck(this, Deck);
    }

    _createClass(Deck, [{
      key: 'shuffleDeck',
      value: function shuffleDeck(deckArray) {
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
    }, {
      key: 'makeShuffledCards',
      value: function makeShuffledCards(arrOfIconStrings) {
        var arrOfCards = arrOfIconStrings.reduce(function (acc, iconClass) {
          var firstCard = new Card(iconClass).makeCard();
          var secondCard = new Card(iconClass).makeCard();

          acc.push(firstCard);
          acc.push(secondCard);

          return acc;
        }, []);
        var shuffledDeck = this.shuffleDeck(arrOfCards);

        return shuffledDeck;
      }
    }, {
      key: 'makeDeck',
      value: function makeDeck(arrOfIconStrings) {
        var shuffledCards = this.makeShuffledCards(arrOfIconStrings);

        var deck = shuffledCards.reduce(function (acc, card) {
          acc.appendChild(card);
          return acc;
        }, document.createElement('ul'));

        deck.setAttribute('class', 'deck');

        return deck;
      }
    }]);

    return Deck;
  }();

  var Emitter = function () {
    function Emitter() {
      var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Emitter);

      this.events = events;
    }

    _createClass(Emitter, [{
      key: 'on',
      value: function on(type, listener) {
        this.events[type] = this.events[type] || [];
        if (typeof listener === 'function') {
          this.events[type].push(listener);
        } else {
          throw new Error('listener must be a function!');
        }
      }
    }, {
      key: 'emit',
      value: function emit(type) {
        if (this.events[type]) {
          this.events[type].forEach(function (listener) {
            return listener();
          });
        } else {
          throw new Error(type + ' does not exist on events object!');
        }
      }
    }]);

    return Emitter;
  }();

  var GameTimer = function () {
    function GameTimer() {
      _classCallCheck(this, GameTimer);

      this.emitter = new Emitter();
    }

    _createClass(GameTimer, [{
      key: 'increaseSeconds',
      value: function increaseSeconds(stateObj, amount) {
        stateObj.secondsElapsed += amount;
      }
    }, {
      key: 'resetTimer',
      value: function resetTimer(_ref) {
        var currentState = _ref.currentState;

        console.log('resetTimer called');

        this.stopTimer(currentState);
        currentState.secondsElapsed = 0;
        currentState.timerId = null;
        console.log('resetTimer end', currentState);
      }
    }, {
      key: 'getMinutes',
      value: function getMinutes(seconds) {
        return Math.floor(seconds / 60);
      }
    }, {
      key: 'getRemainingSeconds',
      value: function getRemainingSeconds(seconds) {
        var minutes = this.getMinutes(seconds);
        var remainingSeconds = seconds - minutes * 60;

        return remainingSeconds;
      }
    }, {
      key: 'getTimeElapsedString',
      value: function getTimeElapsedString(seconds) {
        var minutes = this.getMinutes(seconds);
        var remainingSeconds = this.getRemainingSeconds(seconds);

        return minutes + ':' + (remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds);
      }
    }, {
      key: 'startTimerAndEmitTimeTickEvent',
      value: function startTimerAndEmitTimeTickEvent(stateObj) {
        var _this = this;

        this.emitter.on('timeTick', function () {
          return _this.increaseSeconds(stateObj, 1);
        });

        stateObj.timerId = setInterval(function () {
          _this.emitter.emit('timeTick');
        }, 1000);
      }
    }, {
      key: 'stopTimer',
      value: function stopTimer(currentState) {
        var timerId = currentState.timerId;

        if (timerId !== null) {
          clearInterval(timerId);
          currentState.timerId = null;
          // clear event listeners for timeTick event
          this.emitter.events = {};
        } else {
          throw new Error('stopTimer error');
        }
      }
    }]);

    return GameTimer;
  }();

  var GameController = function () {
    function GameController() {
      _classCallCheck(this, GameController);

      this.matchEmitter = new Emitter();
    }

    _createClass(GameController, [{
      key: 'makeDeck',
      value: function makeDeck(deckObj, arrOfIconStrings) {
        return deckObj.makeDeck(arrOfIconStrings);
      }
    }, {
      key: 'toggleGameStarted',
      value: function toggleGameStarted(currentState) {
        var playingGame = currentState.playingGame;


        currentState.playingGame = !playingGame;
      }
    }, {
      key: 'checkIfGameWon',
      value: function checkIfGameWon(_ref2) {
        var numSuccessMatches = _ref2.numSuccessMatches,
            numMatchesToWin = _ref2.numMatchesToWin;

        return numSuccessMatches === numMatchesToWin;
      }
    }, {
      key: 'getModalContainer',
      value: function getModalContainer() {
        return document.getElementsByClassName('modal')[0];
      }
    }, {
      key: 'getModalTimeTag',
      value: function getModalTimeTag() {
        return document.getElementsByClassName('modal-time')[0];
      }
    }, {
      key: 'getModalRatingTag',
      value: function getModalRatingTag() {
        return document.getElementsByClassName('modal-rating')[0];
      }
    }, {
      key: 'setModalTimeValue',
      value: function setModalTimeValue(modalTimeHtmlElement, timeString) {
        return modalTimeHtmlElement.innerText = timeString;
      }
    }, {
      key: 'setModalRatingValue',
      value: function setModalRatingValue(modalRatingHtmlElement, numOfStars) {
        return modalRatingHtmlElement.innerText = numOfStars;
      }

      // TODO, SUCCESSFULLY GETS CALLED AFTER ALL CARDS MATCHED
      // ALSO, LOOK INTO SETTING UP GULP-MINIFY FOR DEV PIPELINE

    }, {
      key: 'endGame',
      value: function endGame(state, timer, view, timerElement) {
        console.log('endGame called');
        // cause modal to display
        // modal should:
        // - ask if they want to play again
        // - display time it took to win game
        // - display their star rating

        // stop timer
        // get timer value and use it to render value on modal
        // reset timer after
        this.toggleGameStarted(state);

        timer.stopTimer(state);
        timer.resetTimer(state);
        var _state$currentState = state.currentState,
            secondsElapsed = _state$currentState.secondsElapsed,
            starRating = _state$currentState.starRating;

        var totalGameTime = timer.getTimeElapsedString(secondsElapsed);

        // TODODODODOD
        this.setModalTimeValue(this.getModalTimeTag(), totalGameTIme);
        this.setModalRatingValue(this.getModalRatingTag(), starRating);

        // implement:
        // view.displayModal();
      }
    }, {
      key: 'resetGame',
      value: function resetGame(_ref3) {
        var timer = _ref3.timer,
            state = _ref3.state,
            view = _ref3.view;

        this.matchEmitter = new Emitter();

        timer.resetTimer(state);

        state.currentState = new GameState();

        this.getScorePanelElement().remove();
        this.getDeckElement().remove();

        view.renderGame({
          container: this.getGameContainer(),
          state: state
        });

        this.getStartButton().addEventListener('click', startButtonListenerFn({
          controller: this,
          timerHtmlEl: this.getTimerElement(),
          state: state,
          timer: timer,
          view: view
        }), false);

        this.getRestartButton().addEventListener('click', restartButtonListenerFn({
          controller: this,
          state: state,
          timer: timer,
          view: view
        }), false);

        this.getDeckElement().addEventListener('click', deckListenerFn(this, state), false);
      }
    }, {
      key: 'handleRestartClick',
      value: function handleRestartClick(_ref4) {
        var timer = _ref4.timer,
            state = _ref4.state,
            view = _ref4.view;

        console.log('handleRestartClick called');

        this.resetGame({
          timer: timer,
          state: state,
          view: view
        });
      }
    }, {
      key: 'getTimerElement',
      value: function getTimerElement() {
        return document.getElementsByClassName('timer')[0];
      }
    }, {
      key: 'handleStartClick',
      value: function handleStartClick(e, state, timerObj, viewObj, timerElement) {
        var _this2 = this;

        console.log('start clicked');
        var currentState = state.currentState;
        var playingGame = currentState.playingGame;

        // if game already started, start button does nothing

        if (playingGame) {
          return;
        }

        this.toggleGameStarted(currentState);

        timerObj.startTimerAndEmitTimeTickEvent(currentState);
        timerObj.emitter.on('timeTick', function () {
          return viewObj.renderTimerValue(timerObj.getTimeElapsedString(currentState.secondsElapsed), timerElement);
        });

        this.matchEmitter.on('successfulMatch', function () {
          console.log('successfulMatch event emitted');
          _this2.setSuccessMatches(currentState, ++currentState.numSuccessMatches);
          var gameWon = _this2.checkIfGameWon(currentState);
          if (gameWon) {
            return _this2.endGame(state, timerObj, viewObj, timerElement);
          }
        });

        // TODO: check if at limit for star degredation
        // if it is change star rating
        // render new stars
        this.matchEmitter.on('failedMatch', function () {
          console.log('failedMatch event emitted');
          _this2.setFailedMatches(currentState, ++currentState.numFailedMatches);
        });

        this.matchEmitter.on('moveMade', function () {
          console.log('moveMade event emitted');
          _this2.setMovesMade(currentState, ++currentState.numMovesMade);
          viewObj.renderNumMovesMade('' + currentState.numMovesMade, _this2.getMovesElement());
        });
      }
    }, {
      key: 'handleDeckClick',
      value: function handleDeckClick(e, stateObj) {
        // UNCOMMENT WHEN FINISHED
        // if(!stateObj.playingGame) {
        //   return;
        // }
        var currentState = stateObj.currentState;

        console.log('top level', e.target);
        var target = e.target;
        var parent = e.target.parentNode;

        var card = isCard(target);
        var matched = isMatched(target);
        // parentNode because 'show' class is toggled on parent
        var showing = isShowing(parent);

        if (!card || matched || showing) {
          return;
        }

        flip(parent);

        var firstCardPickedIcon = currentState.firstCardPickedIcon;


        if (!firstCardPickedIcon) {
          // store reference to <i> tag containing icon className
          var firstCardIcon = target.previousSibling.firstChild;

          return this.setFirstCardPickedIcon(currentState, firstCardIcon);
        }

        // only increment moves if user is on second pick
        this.matchEmitter.emit('moveMade');

        // store reference to <i> tag containing icon className
        var secondCardPickedIcon = target.previousSibling.firstChild;
        var cardsPicked = [firstCardPickedIcon, secondCardPickedIcon];

        var firstCardIconValue = firstCardPickedIcon.className;
        var secondCardIconValue = secondCardPickedIcon.className;

        var cardsAreMatch = firstCardIconValue === secondCardIconValue;
        // card element that contains both back and front faces is
        // grandparent of icon tag that contains card value
        var cards = cardsPicked.map(function (iconTag) {
          return iconTag.parentNode.parentNode;
        });

        if (cardsAreMatch) {
          setCardsAsMatched.apply(undefined, _toConsumableArray(cards));

          this.matchEmitter.emit('successfulMatch');
        } else {
          animateFailedMatch.apply(undefined, _toConsumableArray(cards));

          // flip back the failed matches
          setTimeout(function () {
            return flip.apply(undefined, _toConsumableArray(cards));
          }, 1500);

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

        function animateFailedMatch() {
          for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            elements[_key2] = arguments[_key2];
          }

          elements.forEach(function (element) {
            setTimeout(function () {
              return addFailClassTo(element);
            }, 600);
            setTimeout(function () {
              return removeFailClassFrom(element);
            }, 1500);
          });
        }

        function isCard(element) {
          return element.classList.contains('back') || element.classList.contains('front');
        }

        function isMatched(element) {
          return element.classList.contains('match');
        }

        function isShowing(element) {
          return element.classList.contains('show');
        }

        function flip() {
          for (var _len3 = arguments.length, elements = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            elements[_key3] = arguments[_key3];
          }

          elements.forEach(function (element) {
            element.classList.toggle('open');
            element.classList.toggle('show');
          });
        }

        function removeClasses() {
          for (var _len4 = arguments.length, classesToRemove = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            classesToRemove[_key4] = arguments[_key4];
          }

          return function (card) {
            var _card$classList;

            (_card$classList = card.classList).remove.apply(_card$classList, classesToRemove);

            return card;
          };
        }

        function addClasses() {
          for (var _len5 = arguments.length, classesToAdd = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            classesToAdd[_key5] = arguments[_key5];
          }

          return function (card) {
            var _card$classList2;

            (_card$classList2 = card.classList).add.apply(_card$classList2, classesToAdd);

            return card;
          };
        }

        function compose(fn1, fn2) {
          return function (initVal) {
            return fn1(fn2(initVal));
          };
        }

        function setCardsAsMatched(firstCard, secondCard) {
          var setCardToMatched = compose(addClasses('match'), removeClasses('open', 'show'));

          try {
            setCardToMatched(firstCard);
            setCardToMatched(secondCard);
            return true;
          } catch (e) {
            throw new Error('setCardsAsMatched error: ' + e);
          }
        }
      }
    }, {
      key: 'setFirstCardPickedIcon',
      value: function setFirstCardPickedIcon(stateObj, cardStringOrNull) {
        stateObj.firstCardPickedIcon = cardStringOrNull;
        return stateObj;
      }
    }, {
      key: 'setStarRating',
      value: function setStarRating(stateObj, numberOfStars) {
        stateObj.starRating = numberOfStars;
        return stateObj;
      }
    }, {
      key: 'setMovesMade',
      value: function setMovesMade(stateObj, numberOfMoves) {
        stateObj.numMovesMade = numberOfMoves;
        return stateObj;
      }
    }, {
      key: 'setSuccessMatches',
      value: function setSuccessMatches(stateObj, numberOfSuccessMatches) {
        stateObj.numSuccessMatches = numberOfSuccessMatches;
        return stateObj;
      }
    }, {
      key: 'setFailedMatches',
      value: function setFailedMatches(stateObj, numberOfFailedMatches) {
        stateObj.numFailedMatches = numberOfFailedMatches;
        return stateObj;
      }
    }, {
      key: 'getScorePanelElement',
      value: function getScorePanelElement() {
        return document.getElementsByClassName('score-panel')[0];
      }
    }, {
      key: 'getGameContainer',
      value: function getGameContainer() {
        return document.getElementsByClassName('container')[0];
      }
    }, {
      key: 'getMovesElement',
      value: function getMovesElement() {
        return document.getElementsByClassName('moves')[0];
      }
    }, {
      key: 'getDeckElement',
      value: function getDeckElement() {
        return document.getElementsByClassName('deck')[0];
      }
    }, {
      key: 'getStartButton',
      value: function getStartButton() {
        return document.getElementsByClassName('start')[0];
      }
    }, {
      key: 'getRestartButton',
      value: function getRestartButton() {
        return document.getElementsByClassName('restart')[0];
      }
    }]);

    return GameController;
  }();

  var GameView = function () {
    function GameView() {
      _classCallCheck(this, GameView);
    }

    _createClass(GameView, [{
      key: 'renderGame',
      value: function renderGame(_ref5) {
        var container = _ref5.container,
            _ref5$state$currentSt = _ref5.state.currentState,
            gameOverModal = _ref5$state$currentSt.gameOverModal,
            scorePanel = _ref5$state$currentSt.scorePanel,
            currentDeck = _ref5$state$currentSt.currentDeck;

        var docFrag = document.createDocumentFragment();

        docFrag.appendChild(gameOverModal);
        docFrag.appendChild(scorePanel);
        docFrag.appendChild(currentDeck);

        container.appendChild(docFrag);
      }
    }, {
      key: 'renderNumMovesMade',
      value: function renderNumMovesMade(num, movesElement) {
        movesElement.innerText = num + ' Moves';
      }
    }, {
      key: 'renderTimerValue',
      value: function renderTimerValue(val, timerElement) {
        timerElement.innerText = val;
      }
    }, {
      key: 'displayHtmlElement',
      value: function displayHtmlElement(element, displayValue) {
        element.style.display = displayValue;
      }
    }]);

    return GameView;
  }();

  var GameState = function GameState() {
    var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref6$playingGame = _ref6.playingGame,
        playingGame = _ref6$playingGame === undefined ? false : _ref6$playingGame,
        _ref6$timerId = _ref6.timerId,
        timerId = _ref6$timerId === undefined ? null : _ref6$timerId,
        _ref6$firstCardPicked = _ref6.firstCardPickedIcon,
        firstCardPickedIcon = _ref6$firstCardPicked === undefined ? null : _ref6$firstCardPicked,
        _ref6$numFlippableCar = _ref6.numFlippableCards,
        numFlippableCards = _ref6$numFlippableCar === undefined ? 16 : _ref6$numFlippableCar,
        _ref6$secondsElapsed = _ref6.secondsElapsed,
        secondsElapsed = _ref6$secondsElapsed === undefined ? 0 : _ref6$secondsElapsed,
        _ref6$starRating = _ref6.starRating,
        starRating = _ref6$starRating === undefined ? 3 : _ref6$starRating,
        _ref6$numMovesMade = _ref6.numMovesMade,
        numMovesMade = _ref6$numMovesMade === undefined ? 0 : _ref6$numMovesMade,
        _ref6$numSuccessMatch = _ref6.numSuccessMatches,
        numSuccessMatches = _ref6$numSuccessMatch === undefined ? 0 : _ref6$numSuccessMatch,
        _ref6$numFailedMatche = _ref6.numFailedMatches,
        numFailedMatches = _ref6$numFailedMatche === undefined ? 0 : _ref6$numFailedMatche,
        _ref6$numMatchesToWin = _ref6.numMatchesToWin,
        numMatchesToWin = _ref6$numMatchesToWin === undefined ? SUCCESSFUL_MATCHES_TO_WIN : _ref6$numMatchesToWin,
        _ref6$arrOfIconString = _ref6.arrOfIconStrings,
        arrOfIconStrings = _ref6$arrOfIconString === undefined ? CARD_ICONS : _ref6$arrOfIconString;

    _classCallCheck(this, GameState);

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
    this.scorePanel = new ScorePanel().makePanel(this.starRating, 'score-panel');
    this.gameOverModal = new GameOverModal().makeModal();
    this.deckElement = null;
    this.startButton = null;
    this.restartButton = null;
  };

  var Timer = new GameTimer();
  var Controller = new GameController();
  var State = {
    currentState: new GameState()
  };
  var View = new GameView();

  // initial render, subsequent renders handled by Controller
  View.renderGame({
    container: Controller.getGameContainer(),
    state: State
  });

  function startButtonListenerFn(_ref7) {
    var controller = _ref7.controller,
        state = _ref7.state,
        timer = _ref7.timer,
        view = _ref7.view,
        timerHtmlEl = _ref7.timerHtmlEl,
        fnsObj = _ref7.fnsObj;

    return function (e) {
      return controller.handleStartClick(e, state, timer, view, timerHtmlEl);
    };
  }

  function deckListenerFn(controller, state, fnsObj) {
    return function (e) {
      return controller.handleDeckClick(e, state);
    };
  }
  function restartButtonListenerFn(obj) {
    return function (e) {
      return obj.controller.handleRestartClick(obj);
    };
  }

  // refactored to not cache startButton, deckElement, and restartButton
  // HTML elements in variables so they (along with their listeners)
  // can be garbage collected when removed from DOM
  Controller.getStartButton().addEventListener('click', startButtonListenerFn({
    controller: Controller,
    state: State,
    timer: Timer,
    view: View,
    timerHtmlEl: Controller.getTimerElement()
  }), false);

  Controller.getDeckElement().addEventListener('click', deckListenerFn(Controller, State), false);

  Controller.getRestartButton().addEventListener('click', restartButtonListenerFn({
    timer: Timer,
    controller: Controller,
    state: State,
    view: View
  }), false);
})();