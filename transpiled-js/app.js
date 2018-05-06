'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // 16 cards, 8 matches needed to win game
  var SUCCESSFUL_MATCHES_TO_WIN = 8;

  var domElementCheck = function domElementCheck(o) {
    return o instanceof Element;
  };

  var addAttributes = function addAttributes(domElement, attributeObj) {
    if (!domElementCheck(domElement)) throw new Error('First argument must be a DOM element!');

    var attributes = Object.getOwnPropertyNames(attributeObj);
    var domElWithAttributes = attributes.reduce(function (acc, attribute) {
      acc.setAttribute(attribute, attributeObj[attribute]);
      return acc;
    }, domElement);

    return domElWithAttributes;
  };

  var GameState = function GameState() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$numFlippableCard = _ref.numFlippableCards,
        numFlippableCards = _ref$numFlippableCard === undefined ? 0 : _ref$numFlippableCard,
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

    this.numFlippableCards = numFlippableCards;
    this.secondsElapsed = secondsElapsed;
    this.starRating = starRating;
    this.numMovesMade = numMovesMade;
    this.numSuccessMatches = numSuccessMatches;
    this.numFailedMatches = numFailedMatches;
  };

  var Game = function () {
    function Game() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new GameState();

      _classCallCheck(this, Game);

      this.state = state;
      this.handleClick.bind(this);
    }

    _createClass(Game, [{
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

    return Game;
  }();

  var Card = function Card() {
    _classCallCheck(this, Card);
  };

  var FlippableCard = function (_Card) {
    _inherits(FlippableCard, _Card);

    function FlippableCard() {
      _classCallCheck(this, FlippableCard);

      return _possibleConstructorReturn(this, (FlippableCard.__proto__ || Object.getPrototypeOf(FlippableCard)).call(this));
    }

    return FlippableCard;
  }(Card);
})();