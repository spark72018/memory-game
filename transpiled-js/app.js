'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  // 16 cards, 8 matches needed to win game
  var SUCCESSFUL_MATCHES_TO_WIN = 8;
  var CARD_ICONS = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];
  // utility functions

  // used to mixin behavior into classes rather than
  // "extend"ing since multiple inheritance isn't supported
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

  var GameState = function GameState() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$gameStarted = _ref.gameStarted,
        gameStarted = _ref$gameStarted === undefined ? false : _ref$gameStarted,
        _ref$numFlippableCard = _ref.numFlippableCards,
        numFlippableCards = _ref$numFlippableCard === undefined ? 16 : _ref$numFlippableCard,
        _ref$secondsElapsed = _ref.secondsElapsed,
        secondsElapsed = _ref$secondsElapsed === undefined ? 0 : _ref$secondsElapsed,
        _ref$starRating = _ref.starRating,
        starRating = _ref$starRating === undefined ? 3 : _ref$starRating,
        _ref$numMovesMade = _ref.numMovesMade,
        numMovesMade = _ref$numMovesMade === undefined ? 0 : _ref$numMovesMade,
        _ref$numSuccessMatche = _ref.numSuccessMatches,
        numSuccessMatches = _ref$numSuccessMatche === undefined ? 0 : _ref$numSuccessMatche,
        _ref$numFailedMatches = _ref.numFailedMatches,
        numFailedMatches = _ref$numFailedMatches === undefined ? 0 : _ref$numFailedMatches,
        _ref$arrOfIconStrings = _ref.arrOfIconStrings,
        arrOfIconStrings = _ref$arrOfIconStrings === undefined ? CARD_ICONS : _ref$arrOfIconStrings;

    _classCallCheck(this, GameState);

    this.gameStarted = gameStarted;
    this.numFlippableCards = numFlippableCards;
    this.secondsElapsed = secondsElapsed;
    this.starRating = starRating;
    this.numMovesMade = numMovesMade;
    this.numSuccessMatches = numSuccessMatches;
    this.numFailedMatches = numFailedMatches;
    this.arrOfIconStrings = arrOfIconStrings;
  };

  // TODO
  // add method to change # of stars


  var ScorePanel = function () {
    function ScorePanel() {
      _classCallCheck(this, ScorePanel);
    }

    _createClass(ScorePanel, [{
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
        spanTag.setAttribute('class', 'moves');

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
        var restartButton = this.makeRestartButton();
        var section = document.createElement('SECTION');
        var unorderedList = document.createElement('ul');
        var movesTag = this.makeMovesTag();

        for (var i = 0; i < numberOfStars; i++) {
          var iconWithCssClass = this.makeIcon('fa fa-star');
          var listItem = this.makeListItem(iconWithCssClass);
          unorderedList.appendChild(listItem);
        }

        unorderedList.setAttribute('class', 'stars');

        section.appendChild(unorderedList);
        section.appendChild(movesTag);
        section.appendChild(restartButton);

        section.setAttribute('class', classString);

        return section;
      }
    }]);

    return ScorePanel;
  }();

  canMakeIcons(ScorePanel.prototype);

  // TODO
  var handler = function handler(e) {
    console.log('top level', e.target);
    var cssClasses = e.target.classList;
    var isCard = cssClasses.contains('back') || cssClasses.contains('front');
    var matched = e.target.parentNode.classList.contains('match');
    if (isCard && !matched) {
      console.log('isCard and !matched e.target', e.target);
      var parent = e.target.parentNode;
      parent.classList.toggle('open');
      parent.classList.toggle('show');
    } else {
      console.log('not isCard or is matched');
    }
  };

  var documentBody = document.body;
  documentBody.addEventListener('click', handler, true);

  var domElementCheck = function domElementCheck(o) {
    return o instanceof Element;
  };

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
      key: 'makeDeckOfCards',
      value: function makeDeckOfCards(arrOfIconStrings) {
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
        var shuffledCards = this.makeDeckOfCards(arrOfIconStrings);

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

  var Timer = function () {
    function Timer() {
      var startingSeconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      _classCallCheck(this, Timer);

      this.startingSeconds = startingSeconds;
      this.timerId = null;

      // this.increaseSeconds = this.increaseSeconds.bind(this);
    }

    _createClass(Timer, [{
      key: 'increaseSeconds',
      value: function increaseSeconds(amount) {
        this.startingSeconds += amount;
        console.log('new time', this.startingSeconds);
      }
    }, {
      key: 'resetSeconds',
      value: function resetSeconds() {
        this.pauseTimer();
        this.startingSeconds = 0;
        this.timerId = null;
        console.log(this.startingSeconds, this.timerId);
      }
    }, {
      key: 'startTimer',
      value: function startTimer() {
        var _this = this;

        this.timerId = setInterval(function () {
          return _this.increaseSeconds(1);
        }, 1000);
      }
    }, {
      key: 'pauseTimer',
      value: function pauseTimer() {
        if (this.timerId !== null) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }
    }]);

    return Timer;
  }();

  var GameController = function () {
    function GameController() {
      _classCallCheck(this, GameController);
    }

    _createClass(GameController, [{
      key: 'handleClick',
      value: function handleClick(e) {
        e.preventDefault();
        console.log('handleClick called');
      }

      /*
      class GameState {
      constructor({
        gameStarted = false,
        numFlippableCards = 16,
        secondsElapsed = 0,
        starRating = 3,
        numMovesMade = 0,
        numSuccessMatches = 0,
        numFailedMatches = 0,
        arrOfIconStrings = CARD_ICONS
      } = {}) {
        this.gameStarted = gameStarted;
        this.numFlippableCards = numFlippableCards;
        this.secondsElapsed = secondsElapsed;
        this.starRating = starRating;
        this.numMovesMade = numMovesMade;
        this.numSuccessMatches = numSuccessMatches;
        this.numFailedMatches = numFailedMatches;
        this.arrOfIconStrings = arrOfIconStrings;
      }
      }
      */

    }, {
      key: 'setSecondsElapsed',
      value: function setSecondsElapsed(stateObj, secondsElapsed) {
        stateObj.secondsElapsed = secondsElapsed;
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
      key: 'getSecondsElapsed',
      value: function getSecondsElapsed(_ref2) {
        var secondsElapsed = _ref2.secondsElapsed;

        return secondsElapsed;
      }
    }, {
      key: 'getStarRating',
      value: function getStarRating(_ref3) {
        var starRating = _ref3.starRating;

        return starRating;
      }
    }, {
      key: 'getNumMovesMade',
      value: function getNumMovesMade(_ref4) {
        var numMovesMade = _ref4.numMovesMade;

        return numMovesMade;
      }
    }, {
      key: 'getNumSuccessMatches',
      value: function getNumSuccessMatches(_ref5) {
        var numSuccessMatches = _ref5.numSuccessMatches;

        return numSuccessMatches;
      }
    }, {
      key: 'getNumFailedMatches',
      value: function getNumFailedMatches(_ref6) {
        var numFailedMatches = _ref6.numFailedMatches;

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
      key: 'append',
      value: function append(child) {
        return {
          to: function to(parent) {
            if (parent instanceof Node) {
              parent.appendChild(child);
              return true;
            } else {
              throw new Error('argument for "to" method of GameView class must be an instance of Node!');
            }
          }
        };
      }
    }]);

    return GameView;
  }();

  var timer = new Timer();
  timer.startTimer();

  setTimeout(function () {
    return timer.resetSeconds();
  }, 5000);
  var gameContainer = document.getElementsByClassName('container')[0];

  var gameState = new GameState();
  var gameController = new GameController();
  var gameView = new GameView();

  var deck = new Deck().makeDeck(gameState.arrOfIconStrings);
  var scorePanel = new ScorePanel().makePanel(0, 'score-panel');

  gameView.append(scorePanel).to(gameContainer);
  gameView.append(deck).to(gameContainer);
  var moves = document.getElementsByClassName('moves')[0];
  moves.innerText = 1000;
})();