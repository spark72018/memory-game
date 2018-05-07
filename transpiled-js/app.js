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
  var CARD_ICONS = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];

  var deck = document.getElementsByClassName('deck')[0];
  var documentBody = document.body;

  var handler = function handler(e) {
    console.log(e.target);
    var isCard = e.target.classList.contains('back') || e.target.classList.contains('front');
    var matched = e.target.parentNode.classList.contains('match');
    if (isCard && !isMatched) {
      console.log('card!');
      var parent = e.target.parentNode;
      parent.classList.toggle('open');
      parent.classList.toggle('show');
      console.log(e.target);
    } else {
      console.log('something else');
    }
  };

  documentBody.addEventListener('click', handler, true);

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

  /*
    <li class="card">
        <div class="front">
            <i class="fa fa-diamond"></i>
        </div>
        <div class="back"></div>
    </li>
  */

  var Card = function () {
    function Card(iconClass) {
      _classCallCheck(this, Card);

      this.iconClass = iconClass;
      this.icon = document.createElement('I');
      this.frontFace = document.createElement('div');
      this.backFace = document.createElement('div');
      this.card = document.createElement('LI');
    }

    _createClass(Card, [{
      key: 'completeIcon',
      value: function completeIcon() {
        this.icon.setAttribute('class', this.iconClass);
      }
    }, {
      key: 'completeFrontFace',
      value: function completeFrontFace(str) {
        this.completeIcon();
        this.frontFace.appendChild(this.icon);
        this.frontFace.setAttribute('class', str);
      }
    }, {
      key: 'completeBackFace',
      value: function completeBackFace(str) {
        this.backFace.setAttribute('class', 'back');
      }
    }, {
      key: 'makeCard',
      value: function makeCard() {
        this.completeFrontFace('front');
        this.completeBackFace('back');

        this.card.appendChild(this.frontFace);
        this.card.appendChild(this.backFace);

        this.card.setAttribute('class', 'card');

        return this.card;
      }
    }]);

    return Card;
  }();

  var GameState = function GameState() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
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
})();