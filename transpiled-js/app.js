'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
        numFailedMatches = _ref$numFailedMatches === undefined ? 0 : _ref$numFailedMatches;

    _classCallCheck(this, GameState);

    this.gameStarted = gameStarted;
    this.numFlippableCards = numFlippableCards;
    this.secondsElapsed = secondsElapsed;
    this.starRating = starRating;
    this.numMovesMade = numMovesMade;
    this.numSuccessMatches = numSuccessMatches;
    this.numFailedMatches = numFailedMatches;
  };

  // TODO
  // add method to change # of stars


  var ScorePanel = function () {
    function ScorePanel() {
      var numberOfStars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

      _classCallCheck(this, ScorePanel);

      this.numberOfStars = numberOfStars;
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
      value: function makePanel(classString) {
        var restartButton = this.makeRestartButton();
        var section = document.createElement('SECTION');
        var unorderedList = document.createElement('ul');

        for (var i = 0; i < this.numberOfStars; i++) {
          var iconWithCssClass = this.makeIcon('fa fa-star');
          var listItem = this.makeListItem(iconWithCssClass);
          unorderedList.appendChild(listItem);
        }

        section.appendChild(unorderedList);
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
    function Deck(arrOfIconValues) {
      _classCallCheck(this, Deck);

      this.arrOfIconValues = arrOfIconValues;
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
      key: 'makeDeck',
      value: function makeDeck() {
        var deckOfCards = this.arrOfIconValues.reduce(function (acc, iconClass) {
          var firstCard = new Card(iconClass).makeCard();
          var secondCard = new Card(iconClass).makeCard();

          acc.push(firstCard);
          acc.push(secondCard);

          return acc;
        }, []);
        var shuffledDeck = this.shuffleDeck(deckOfCards);
        return shuffledDeck;
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
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new GameState();

      _classCallCheck(this, GameController);

      this.state = state;
      this.handleClick.bind(this);
    }

    _createClass(GameController, [{
      key: 'makeScorePanel',
      value: function makeScorePanel() {
        return new ScorePanel().makePanel('score-panel');
      }
    }, {
      key: 'makeDeck',
      value: function makeDeck() {
        var deck = new Deck(CARD_ICONS).makeDeck();
        var docFrag = deck.reduce(function (acc, card) {
          acc.appendChild(card);
          return acc;
        }, document.createDocumentFragment());

        return docFrag;
      }
    }, {
      key: 'handleClick',
      value: function handleClick(e) {
        e.preventDefault();
        console.log('handleClick called');
      }
    }, {
      key: 'setSecondsElapsed',
      value: function setSecondsElapsed(num) {
        this.state.secondsElapsed = num;
      }
    }, {
      key: 'setStarRating',
      value: function setStarRating(num) {
        this.state.starRating = num;
      }
    }, {
      key: 'setMovesMade',
      value: function setMovesMade(num) {
        this.state.numMovesMade = num;
      }
    }, {
      key: 'setSuccessMatches',
      value: function setSuccessMatches(num) {
        this.state.numSuccessMatches = num;
      }
    }, {
      key: 'setFailedMatches',
      value: function setFailedMatches(num) {
        this.state.numFailedMatches = num;
      }
    }, {
      key: 'getSecondsElapsed',
      value: function getSecondsElapsed() {
        return this.state.secondsElapsed;
      }
    }, {
      key: 'getStarRating',
      value: function getStarRating() {
        return this.state.starRating;
      }
    }, {
      key: 'getNumMovesMade',
      value: function getNumMovesMade() {
        return this.state.numMovesMade;
      }
    }, {
      key: 'getNumSuccessMatches',
      value: function getNumSuccessMatches() {
        return this.state.numSuccessMatches;
      }
    }, {
      key: 'getNumFailedMatches',
      value: function getNumFailedMatches() {
        return this.state.numFailedMatches;
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
  console.log(timer.timerId);
  setTimeout(function () {
    return timer.resetSeconds();
  }, 5000);
  var deckTag = document.getElementsByClassName('deck')[0];
  var gameController = new GameController();
  var gameView = new GameView();
  var deckDocFrag = gameController.makeDeck();
  var scorePanel = gameController.makeScorePanel();
  console.log('scorePanel is', scorePanel);
  // gameView.append(scorePanel).to();
  gameView.append(deckDocFrag).to(deckTag);
  var moves = document.getElementsByClassName('moves')[0];
  moves.innerText = 1000;
})();