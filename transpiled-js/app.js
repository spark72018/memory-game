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
      value: function makeTimerTag(initialTime) {
        var spanTag = document.createElement('span');

        spanTag.innerText = initialTime;
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
      value: function stopTimer(stateObj) {
        var timerId = stateObj.timerId;

        if (timerId !== null) {
          clearInterval(timerId);
          stateObj.timerId = null;
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
      value: function toggleGameStarted(stateObj) {
        var currentState = stateObj.playingGame;

        stateObj.playingGame = !currentState;
      }
    }, {
      key: 'checkIfGameWon',
      value: function checkIfGameWon(stateObj) {
        var state = stateObj.currentState;
        return state.numSuccessMatches === state.numMatchesToWin;
      }
    }, {
      key: 'endGame',
      value: function endGame(state, timer, view, timerElement) {
        console.log('endGame called');

        // pause timer
        // cause modal to display
        // modal should:
        // - ask if they want to play again
        // - display time it took to win game
        // - display their star rating
        timer.stopTimer(state.currentState);
      }
    }, {
      key: 'handleRestartClick',
      value: function handleRestartClick(_ref2) {
        var timer = _ref2.timer,
            state = _ref2.state,
            view = _ref2.view,
            gameContainer = _ref2.gameContainer,
            startButton = _ref2.startButton,
            deckHtmlEl = _ref2.deckHtmlEl;

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
    }, {
      key: 'handleStartClick',
      value: function handleStartClick(e, stateObj, timerObj, viewObj, timerElement) {
        var _this2 = this;

        console.log('start clicked');
        var currentlyPlaying = stateObj.currentState.playingGame;

        // if game already started, start button does nothing
        if (currentlyPlaying) {
          return;
        }

        this.toggleGameStarted(stateObj.currentState);

        timerObj.startTimerAndEmitTimeTickEvent(stateObj.currentState);
        timerObj.emitter.on('timeTick', function () {
          return viewObj.renderTimerValue(timerObj.getTimeElapsedString(stateObj.currentState.secondsElapsed), timerElement);
        });

        this.matchEmitter.on('successfulMatch', function () {
          console.log('successfulMatch event emitted');
          _this2.setSuccessMatches(stateObj.currentState, ++stateObj.currentState.numSuccessMatches);
          var gameWon = _this2.checkIfGameWon(stateObj);
          if (gameWon) {
            return _this2.endGame(stateObj, timerObj, viewObj, timerElement);
          }
        });

        // TODO: check if at limit for star degredation
        // if it is change star rating
        // render new stars
        this.matchEmitter.on('failedMatch', function () {
          console.log('failedMatch event emitted');
          _this2.setFailedMatches(stateObj.currentState, ++stateObj.currentState.numFailedMatches);
        });

        this.matchEmitter.on('moveMade', function () {
          console.log('moveMade event emitted');
          _this2.setMovesMade(stateObj.currentState, ++stateObj.currentState.numMovesMade);

          var movesTag = document.getElementsByClassName('moves')[0];
          viewObj.renderNumMovesMade(stateObj.currentState.numMovesMade + ' Moves', movesTag);
        });
      }
    }, {
      key: 'handleDeckClick',
      value: function handleDeckClick(e, stateObj) {
        // UNCOMMENT WHEN FINISHED
        // if(!stateObj.playingGame) {
        //   return;
        // }
        var state = stateObj.currentState;
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

        var firstCardPicked = state.firstCardPicked;

        if (!firstCardPicked) {
          // store reference to <i> tag containing icon className
          var firstCard = target.previousSibling.firstChild;

          return this.setFirstCardPicked(state, firstCard);
        }

        // only increment moves if user is on second pick
        this.matchEmitter.emit('moveMade');

        // store reference to <i> tag containing icon className
        var secondCardPicked = target.previousSibling.firstChild;
        var cardsPicked = [firstCardPicked, secondCardPicked];

        var secondCardValue = secondCardPicked.className;
        var firstCardValue = firstCardPicked.className;

        var cardsAreMatch = firstCardValue === secondCardValue;
        var cardContainers = cardsPicked.map(function (iconTag) {
          return iconTag.parentNode.parentNode;
        });

        if (cardsAreMatch) {
          setCardsAsMatched.apply(undefined, _toConsumableArray(cardContainers));

          this.matchEmitter.emit('successfulMatch');
        } else {
          animateFailedMatch.apply(undefined, _toConsumableArray(cardContainers));

          // flip back the failed matches
          setTimeout(function () {
            return flip.apply(undefined, _toConsumableArray(cardContainers));
          }, 1500);

          this.matchEmitter.emit('failedMatch');
        }

        this.setFirstCardPicked(state, null);

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
      key: 'setSecondsElapsed',
      value: function setSecondsElapsed(stateObj, secondsElapsed) {
        stateObj.secondsElapsed = secondsElapsed;
        return stateObj;
      }
    }, {
      key: 'setFirstCardPicked',
      value: function setFirstCardPicked(stateObj, cardStringOrNull) {
        stateObj.firstCardPicked = cardStringOrNull;
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
    }, {
      key: 'getSecondsElapsed',
      value: function getSecondsElapsed(_ref3) {
        var secondsElapsed = _ref3.secondsElapsed;

        return secondsElapsed;
      }
    }, {
      key: 'getStarRating',
      value: function getStarRating(_ref4) {
        var starRating = _ref4.starRating;

        return starRating;
      }
    }, {
      key: 'getNumMovesMade',
      value: function getNumMovesMade(_ref5) {
        var numMovesMade = _ref5.numMovesMade;

        return numMovesMade;
      }
    }, {
      key: 'getNumSuccessMatches',
      value: function getNumSuccessMatches(_ref6) {
        var numSuccessMatches = _ref6.numSuccessMatches;

        return numSuccessMatches;
      }
    }, {
      key: 'getNumFailedMatches',
      value: function getNumFailedMatches(_ref7) {
        var numFailedMatches = _ref7.numFailedMatches;

        return numFailedMatches;
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
      value: function renderGame(_ref8) {
        var container = _ref8.container,
            _ref8$state$currentSt = _ref8.state.currentState,
            scorePanel = _ref8$state$currentSt.scorePanel,
            currentDeck = _ref8$state$currentSt.currentDeck;

        var docFrag = document.createDocumentFragment();

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
    }]);

    return GameView;
  }();

  var GameState = function GameState() {
    var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref9$playingGame = _ref9.playingGame,
        playingGame = _ref9$playingGame === undefined ? false : _ref9$playingGame,
        _ref9$timerId = _ref9.timerId,
        timerId = _ref9$timerId === undefined ? null : _ref9$timerId,
        _ref9$firstCardPicked = _ref9.firstCardPicked,
        firstCardPicked = _ref9$firstCardPicked === undefined ? null : _ref9$firstCardPicked,
        _ref9$numFlippableCar = _ref9.numFlippableCards,
        numFlippableCards = _ref9$numFlippableCar === undefined ? 16 : _ref9$numFlippableCar,
        _ref9$secondsElapsed = _ref9.secondsElapsed,
        secondsElapsed = _ref9$secondsElapsed === undefined ? 0 : _ref9$secondsElapsed,
        _ref9$starRating = _ref9.starRating,
        starRating = _ref9$starRating === undefined ? 3 : _ref9$starRating,
        _ref9$numMovesMade = _ref9.numMovesMade,
        numMovesMade = _ref9$numMovesMade === undefined ? 0 : _ref9$numMovesMade,
        _ref9$numSuccessMatch = _ref9.numSuccessMatches,
        numSuccessMatches = _ref9$numSuccessMatch === undefined ? 0 : _ref9$numSuccessMatch,
        _ref9$numFailedMatche = _ref9.numFailedMatches,
        numFailedMatches = _ref9$numFailedMatche === undefined ? 0 : _ref9$numFailedMatche,
        _ref9$numMatchesToWin = _ref9.numMatchesToWin,
        numMatchesToWin = _ref9$numMatchesToWin === undefined ? SUCCESSFUL_MATCHES_TO_WIN : _ref9$numMatchesToWin,
        _ref9$arrOfIconString = _ref9.arrOfIconStrings,
        arrOfIconStrings = _ref9$arrOfIconString === undefined ? CARD_ICONS : _ref9$arrOfIconString;

    _classCallCheck(this, GameState);

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
    this.deckElement = null;
    this.startButton = null;
    this.restartButton = null;
  };

  var Timer = new GameTimer();
  var Controller = new GameController();
  var State = { currentState: new GameState() };
  var View = new GameView();

  ///////////////////////////////////////////////////////////////////////
  // consider if these are Controller's responsibility
  var gameContainer = document.getElementsByClassName('container')[0];
  // maybe store deckOfCards in another property within State?
  // so I can just set it to a new Deck().makeDeck(State.currentState.arrOfIconStrings)
  // when resetting game.

  // initial render, subsequent renders handled by Controller
  View.renderGame({
    container: gameContainer,
    state: State
  });
  //////////////////////////////////////////////////////////////////////////
  var timerElement = document.getElementsByClassName('timer')[0];

  function startButtonListenerFn(_ref10) {
    var controller = _ref10.controller,
        state = _ref10.state,
        timer = _ref10.timer,
        view = _ref10.view,
        timerHtmlEl = _ref10.timerHtmlEl;

    return function (e) {
      return controller.handleStartClick(e, state, timer, view, timerHtmlEl);
    };
  }

  function deckListenerFn(controller, state) {
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
  // HTML elements so they (along with their listeners)
  // can be garbage collected when removed from DOM
  Controller.getStartButton().addEventListener('click', startButtonListenerFn({
    controller: Controller,
    state: State,
    timer: Timer,
    view: View,
    timerHtmlEl: timerElement
  }), false);

  Controller.getDeckElement().addEventListener('click', deckListenerFn(Controller, State), false);

  Controller.getRestartButton().addEventListener('click', restartButtonListenerFn({
    timer: Timer,
    controller: Controller,
    state: State,
    view: View,
    gameContainer: gameContainer,
    startButton: Controller.getStartButton(),
    deckHtmlEl: Controller.getDeckElement()
  }), false);
})();