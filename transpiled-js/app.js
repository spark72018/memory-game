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

  /*
    <section class="score-panel">
        <ul class="stars">
            <li>
                <i class="fa fa-star"></i>
            </li>
            <li>
                <i class="fa fa-star"></i>
            </li>
            <li>
                <i class="fa fa-star"></i>
            </li>
        </ul>
         <span class="moves">3</span> Moves
         <div class="restart">
            <i class="fa fa-repeat"></i>
        </div>
    </section>
  */

  // class ScorePanel {
  //   constructor(numberOfStars = 3) {
  //     this.numberOfStars = numberOfStars;
  //   }

  //   makeListItem(...children) {
  //     const listItem = document.createElement('LI');
  //     const listItemWithChildren = children.reduce((acc, child) => {
  //       acc.push(child);
  //       return acc;
  //     }, listItem);

  //     return listItemWithChildren;
  //   }

  //   makePanel() {
  //     const container = document.createElement('ul');
  //     for (let i = 0; i < this.numberOfStars; i++) {
  //       const iconWithCssClass = this.makeIcon('fa fa-star');
  //     }
  //   }
  // }

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

    // makeIcon(classString) {
    //   const icon = document.createElement('I');
    //   icon.setAttribute('class', classString);

    //   return icon;
    // }

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
        var deck = this.arrOfIconValues.reduce(function (acc, iconClass) {
          var firstCard = new Card(iconClass).makeCard();
          var secondCard = new Card(iconClass).makeCard();

          acc.push(firstCard);
          acc.push(secondCard);

          return acc;
        }, []);
        var shuffledDeck = this.shuffleDeck(deck);
        return shuffledDeck;
      }
    }]);

    return Deck;
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
      key: 'makeDeckDocFrag',
      value: function makeDeckDocFrag() {
        var deck = new Deck(CARD_ICONS).makeDeck();
        var docFrag = deck.reduce(function (acc, card) {
          acc.appendChild(card);
          return acc;
        }, document.createDocumentFragment());

        return docFrag;
      }
    }, {
      key: 'appendDeckTo',
      value: function appendDeckTo(domElement) {
        try {
          var docFrag = this.makeDeckDocFrag();
          domElement.appendChild(docFrag);
          return true;
        } catch (e) {
          throw new Error('error with appendDeckTo method', e);
        }
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

    return Game;
  }();

  var deckTag = document.getElementsByClassName('deck')[0];
  var game = new Game();
  game.appendDeckTo(deckTag);
  var moves = document.getElementsByClassName('moves')[0];
  moves.innerText = 1000;
  console.log('moves.innerTest is', moves.innerText);
})();