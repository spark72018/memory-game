'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  // 16 cards, 8 matches needed to win game
  var SUCCESSFUL_MATCHES_TO_WIN = 8;
  var CARD_ICONS = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];

  // utility functions
  function compose(fn1, fn2) {
    return function (initVal) {
      return fn1(fn2(initVal));
    };
  }

  var appendAll = function appendAll() {
    for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
      children[_key] = arguments[_key];
    }

    return function (parent) {
      return children.forEach(function (child) {
        return parent.appendChild(child);
      });
    };
  };

  var setCssClass = function setCssClass(cssClassString) {
    return function (htmlElement) {
      return htmlElement.setAttribute('class', cssClassString);
    };
  };

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

      setCssClass(classString)(icon);

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
        var modalGameOverTextTag = document.createElement('span');
        var modalTimeTag = document.createElement('span');
        var modalMovesMadeTag = document.createElement('span');
        var modalRatingTag = document.createElement('span');
        var modalButton = document.createElement('button');

        modalGameOverTextTag.innerText = 'Game over! Your final stats are: ';
        modalButton.innerText = 'Play again!';

        setCssClass('modal-game-over-text')(modalGameOverTextTag);
        setCssClass('modal-time')(modalTimeTag);
        setCssClass('modal-moves-made')(modalMovesMadeTag);
        setCssClass('modal-rating')(modalRatingTag);
        setCssClass('modal-button')(modalButton);

        appendAll(modalGameOverTextTag, modalTimeTag, modalMovesMadeTag, modalRatingTag, modalButton)(modalContainer);

        setCssClass('modal')(modalContainer);

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

        setCssClass('move-right start')(startButton);

        return startButton;
      }
    }, {
      key: 'makeRestartButton',
      value: function makeRestartButton() {
        var aDiv = document.createElement('div');
        var repeatIcon = this.makeIcon('fa fa-repeat');

        aDiv.appendChild(repeatIcon);

        setCssClass('restart')(aDiv);

        return aDiv;
      }
    }, {
      key: 'makeMovesTag',
      value: function makeMovesTag(numOfMoves) {
        var spanTag = document.createElement('span');

        spanTag.innerText = numOfMoves;
        setCssClass('move-right moves')(spanTag);

        return spanTag;
      }
    }, {
      key: 'makeTimerTag',
      value: function makeTimerTag(timeString) {
        var spanTag = document.createElement('span');

        spanTag.innerText = timeString;
        setCssClass('move-right timer')(spanTag);

        return spanTag;
      }

      // returns a <li> with all arguments appended to it

    }, {
      key: 'makeAStar',
      value: function makeAStar() {
        var listItem = document.createElement('LI');

        appendAll.apply(undefined, arguments)(listItem);

        return listItem;
      }
    }, {
      key: 'addStars',
      value: function addStars(numOfStars, list) {
        if (numOfStars === 0) return list;

        var iconWithCssClass = this.makeIcon('fa fa-star');
        var listItem = this.makeAStar(iconWithCssClass);

        list.appendChild(listItem);

        return this.addStars(numOfStars - 1, list);
      }

      // returns a <section> tag with:
      // start button, restart button, star rating, moves, and timer

    }, {
      key: 'makePanel',
      value: function makePanel(numberOfStars, classString) {
        var startButton = this.makeStartButton();
        var restartButton = this.makeRestartButton();
        var section = document.createElement('SECTION');
        var movesTag = this.makeMovesTag('0 Moves');
        var timerTag = this.makeTimerTag('0:00');
        var listWithStars = this.addStars(3, document.createElement('ul'));

        // trying out recursive solution with this.addStars instead of
        // for loop

        // for (let i = 0; i < numberOfStars; i++) {
        //   const iconWithCssClass = this.makeIcon('fa fa-star');
        //   const listItem = this.makeAStar(iconWithCssClass);
        //   unorderedList.appendChild(listItem);
        // }

        setCssClass('stars')(listWithStars);

        appendAll(listWithStars, movesTag, timerTag, startButton, restartButton)(section);

        setCssClass(classString)(section);

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
      value: function makeFrontFace(classString) {
        var icon = this.makeIcon(this.iconClass);
        var frontFace = document.createElement('div');

        frontFace.appendChild(icon);
        setCssClass(classString)(frontFace);

        return frontFace;
      }
    }, {
      key: 'makeBackFace',
      value: function makeBackFace(classString) {
        var backFace = document.createElement('div');

        setCssClass(classString)(backFace);

        return backFace;
      }
    }, {
      key: 'makeCard',
      value: function makeCard() {
        var frontFace = this.makeFrontFace('front');
        var backFace = this.makeBackFace('back');
        var card = document.createElement('LI');

        setCssClass('card')(card);

        appendAll(frontFace, backFace)(card);

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

          // inefficient
          // return [...acc, firstCard, secondCard];

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

        setCssClass('deck')(deck);

        return deck;
      }
    }]);

    return Deck;
  }();

  // this class is used to create objects that will
  // emit custom events and run all functions(listeners)
  // associated with that event


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

        this.stopTimer(currentState);

        currentState.secondsElapsed = 0;
        currentState.timerId = null;
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
        }
      }
    }]);

    return GameTimer;
  }();

  var GameController = function () {
    function GameController() {
      _classCallCheck(this, GameController);

      this.eventEmitter = new Emitter();
    }
    // Object, Array -> HtmlElement (ul)


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
      // Object -> Boolean

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
      key: 'getModalMovesMadeTag',
      value: function getModalMovesMadeTag() {
        return document.getElementsByClassName('modal-moves-made')[0];
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
      key: 'setModalMovesMadeValue',
      value: function setModalMovesMadeValue(modalMovesMadeHtmlElement, numMovesMade) {
        return modalMovesMadeHtmlElement.innerText = 'You\'ve made ' + numMovesMade + ' moves in this game';
      }
    }, {
      key: 'setModalRatingValue',
      value: function setModalRatingValue(modalRatingHtmlElement, numOfStars) {
        return modalRatingHtmlElement.innerText = numOfStars;
      }
    }, {
      key: 'endGame',
      value: function endGame(state, timer, view) {
        this.toggleGameStarted(state);

        timer.stopTimer(state);

        var _state$currentState = state.currentState,
            numMovesMade = _state$currentState.numMovesMade,
            secondsElapsed = _state$currentState.secondsElapsed,
            starRating = _state$currentState.starRating;

        var timeString = timer.getTimeElapsedString(secondsElapsed);

        timer.resetTimer(state);

        this.setModalTimeValue(this.getModalTimeTag(), timeString);
        this.setModalMovesMadeValue(this.getModalMovesMadeTag(), 'You\'ve made ' + numMovesMade + ' moves');
        this.setModalRatingValue(this.getModalRatingTag(), 'Star Rating: ' + starRating);

        view.setCssDisplay(this.getModalContainer(), 'flex');
      }
    }, {
      key: 'resetGame',
      value: function resetGame(timer, state, view) {
        var _this2 = this;

        this.eventEmitter = new Emitter();

        timer.resetTimer(state);

        state.currentState = new GameState();

        this.getScorePanelElement().remove();
        this.getDeckElement().remove();

        view.renderGame({
          container: this.getGameContainer(),
          state: state
        });

        this.getStartButton().addEventListener('click', function (e) {
          return Controller.handleStartClick(e, State, Timer, View, _this2.getTimerElement());
        }, false);

        this.getRestartButton().addEventListener('click', function (e) {
          return _this2.handleRestartClick(Timer, State, View);
        }, false);

        this.getDeckElement().addEventListener('click', function (e) {
          return _this2.handleDeckClick(e, State);
        }, false);
      }
    }, {
      key: 'handleRestartClick',
      value: function handleRestartClick(timer, state, view) {
        this.resetGame(timer, state, view);
      }
    }, {
      key: 'handleStartClick',
      value: function handleStartClick(e, state, timerObj, viewObj, timerElement) {
        var _this3 = this;

        // FOR DEV PURPOSES ONLY
        // this.endGame(state, timerObj, viewObj);
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

        this.eventEmitter.on('successfulMatch', function () {
          _this3.setSuccessMatches(currentState, ++currentState.numSuccessMatches);
          var gameWon = _this3.checkIfGameWon(currentState);
          if (gameWon) {
            return _this3.endGame(state, timerObj, viewObj);
          }
        });

        // TODO: check if at limit for star degredation
        // if it is change star rating
        // render new stars
        this.eventEmitter.on('failedMatch', function () {
          _this3.setFailedMatches(currentState, ++currentState.numFailedMatches);
        });

        this.eventEmitter.on('moveMade', function () {
          _this3.setMovesMade(currentState, ++currentState.numMovesMade);
          viewObj.renderNumMovesMade('' + currentState.numMovesMade, _this3.getMovesElement());
        });
      }
    }, {
      key: 'toggleCurrentlyAnimating',
      value: function toggleCurrentlyAnimating(state) {
        state.currentlyAnimating = !state.currentlyAnimating;
      }
    }, {
      key: 'makeDeckUnclickable',
      value: function makeDeckUnclickable(state, seconds) {
        var _this4 = this;

        setTimeout(function () {
          return _this4.toggleCurrentlyAnimating(state);
        }, seconds);
        this.toggleCurrentlyAnimating(state);
      }
    }, {
      key: 'handleDeckClick',
      value: function handleDeckClick(e, stateObj) {
        var currentState = stateObj.currentState;
        var playingGame = currentState.playingGame,
            currentlyAnimating = currentState.currentlyAnimating;


        if (!playingGame || currentlyAnimating) {
          return;
        }

        var target = e.target;
        var parentNode = target.parentNode;


        var card = isCard(target);
        var matched = isMatched(target);
        // parentNode because 'show' class is toggled on parent
        var showing = isShowing(parentNode);

        if (!card || matched || showing) {
          return;
        }

        flip(parentNode);

        // so player can't cheat by flipping too many cards at once
        this.makeDeckUnclickable(currentState, 740);

        var firstCardPickedIcon = currentState.firstCardPickedIcon;


        if (!firstCardPickedIcon) {
          // store reference to <i> tag containing icon className
          var firstCardIcon = target.previousSibling.firstChild;

          return this.setFirstCardPickedIcon(currentState, firstCardIcon);
        }

        // only increment moves if user just picked second card
        this.eventEmitter.emit('moveMade');

        // store reference to <i> tag containing icon className
        var secondCardPickedIcon = target.previousSibling.firstChild;
        var cardsPicked = [firstCardPickedIcon, secondCardPickedIcon];

        var firstCardIconValue = firstCardPickedIcon.className;
        var secondCardIconValue = secondCardPickedIcon.className;

        var cardsAreMatch = firstCardIconValue === secondCardIconValue;

        // Element that contains both back and front card faces is
        // grandparent of icon tag that contains card value
        var cards = cardsPicked.map(function (iconTag) {
          return iconTag.parentNode.parentNode;
        });

        if (cardsAreMatch) {
          setCardsAsMatched.apply(undefined, _toConsumableArray(cards));

          this.eventEmitter.emit('successfulMatch');
        } else {
          animateFailedMatch.apply(undefined, _toConsumableArray(cards));

          // flip back the failed matches
          setTimeout(function () {
            return flip.apply(undefined, _toConsumableArray(cards));
          }, 1500);

          this.eventEmitter.emit('failedMatch');
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

        function setCardsAsMatched(firstCard, secondCard) {
          var setCardToMatched = compose(addClasses('match'), removeClasses('open', 'show'));

          try {
            setCardToMatched(firstCard);
            setCardToMatched(secondCard);
            return true;
          } catch (e) {
            throw new Error('setCardsToMatched error: ' + e);
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
      key: 'getGameContainer',
      value: function getGameContainer() {
        return document.getElementsByClassName('container')[0];
      }
    }, {
      key: 'getScorePanelElement',
      value: function getScorePanelElement() {
        return document.getElementsByClassName('score-panel')[0];
      }
    }, {
      key: 'getTimerElement',
      value: function getTimerElement() {
        return document.getElementsByClassName('timer')[0];
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
    }, {
      key: 'getModalButton',
      value: function getModalButton() {
        return document.getElementsByClassName('modal-button')[0];
      }
    }, {
      key: 'handleModalButtonClick',
      value: function handleModalButtonClick(timer, state, view) {
        this.resetGame(timer, state, view);
        view.setCssDisplay(this.getModalContainer(), 'none');
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
      value: function renderGame(_ref3) {
        var container = _ref3.container,
            _ref3$state$currentSt = _ref3.state.currentState,
            gameOverModal = _ref3$state$currentSt.gameOverModal,
            scorePanel = _ref3$state$currentSt.scorePanel,
            currentDeck = _ref3$state$currentSt.currentDeck;

        var docFrag = document.createDocumentFragment();

        appendAll(gameOverModal, scorePanel, currentDeck)(docFrag);

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
      key: 'setCssDisplay',
      value: function setCssDisplay(element, displayValue) {
        element.style.display = displayValue;
      }
    }]);

    return GameView;
  }();

  var GameState = function GameState() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$playingGame = _ref4.playingGame,
        playingGame = _ref4$playingGame === undefined ? false : _ref4$playingGame,
        _ref4$timerId = _ref4.timerId,
        timerId = _ref4$timerId === undefined ? null : _ref4$timerId,
        _ref4$firstCardPicked = _ref4.firstCardPickedIcon,
        firstCardPickedIcon = _ref4$firstCardPicked === undefined ? null : _ref4$firstCardPicked,
        _ref4$numFlippableCar = _ref4.numFlippableCards,
        numFlippableCards = _ref4$numFlippableCar === undefined ? 16 : _ref4$numFlippableCar,
        _ref4$secondsElapsed = _ref4.secondsElapsed,
        secondsElapsed = _ref4$secondsElapsed === undefined ? 0 : _ref4$secondsElapsed,
        _ref4$starRating = _ref4.starRating,
        starRating = _ref4$starRating === undefined ? 3 : _ref4$starRating,
        _ref4$numMovesMade = _ref4.numMovesMade,
        numMovesMade = _ref4$numMovesMade === undefined ? 0 : _ref4$numMovesMade,
        _ref4$numSuccessMatch = _ref4.numSuccessMatches,
        numSuccessMatches = _ref4$numSuccessMatch === undefined ? 0 : _ref4$numSuccessMatch,
        _ref4$numFailedMatche = _ref4.numFailedMatches,
        numFailedMatches = _ref4$numFailedMatche === undefined ? 0 : _ref4$numFailedMatche,
        _ref4$numMatchesToWin = _ref4.numMatchesToWin,
        numMatchesToWin = _ref4$numMatchesToWin === undefined ? SUCCESSFUL_MATCHES_TO_WIN : _ref4$numMatchesToWin,
        _ref4$arrOfIconString = _ref4.arrOfIconStrings,
        arrOfIconStrings = _ref4$arrOfIconString === undefined ? CARD_ICONS : _ref4$arrOfIconString,
        _ref4$currentlyAnimat = _ref4.currentlyAnimating,
        currentlyAnimating = _ref4$currentlyAnimat === undefined ? false : _ref4$currentlyAnimat;

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
    this.currentlyAnimating = currentlyAnimating;
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

  // refactored to not cache startButton, deckElement, and restartButton
  // HTML elements in variables so they (along with their listeners)
  // can be garbage collected when removed from DOM
  Controller.getStartButton().addEventListener('click', function (e) {
    return Controller.handleStartClick(e, State, Timer, View, Controller.getTimerElement());
  }, false);

  Controller.getDeckElement().addEventListener('click', function (e) {
    return Controller.handleDeckClick(e, State);
  }, false);

  Controller.getRestartButton().addEventListener('click', function () {
    return Controller.handleRestartClick(Timer, State, View);
  }, false);

  Controller.getModalButton().addEventListener('click', function () {
    return Controller.handleModalButtonClick(Timer, State, View);
  }, false);

  // FOR DEV PURPOSES ONLY
  // click the 'Start' button as soon as page loads
  // Controller.getStartButton().click();
})();