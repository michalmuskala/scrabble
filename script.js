(function(ns) {
  "use strict";

  var CONST = {
    letters: {
      '_': {count: 2, points: 0},
      'A': {count: 9, points: 1},
      'E': {count: 7, points: 1},
      'I': {count: 8, points: 1},
      'N': {count: 5, points: 1},
      'O': {count: 6, points: 1},
      'R': {count: 4, points: 1},
      'S': {count: 4, points: 1},
      'W': {count: 4, points: 1},
      'Z': {count: 5, points: 1},
      'C': {count: 3, points: 2},
      'D': {count: 3, points: 2},
      'K': {count: 3, points: 2},
      'L': {count: 3, points: 2},
      'M': {count: 3, points: 2},
      'P': {count: 3, points: 2},
      'T': {count: 3, points: 2},
      'Y': {count: 4, points: 2},
      'B': {count: 2, points: 3},
      'G': {count: 2, points: 3},
      'H': {count: 2, points: 3},
      'J': {count: 2, points: 3},
      'Ł': {count: 2, points: 3},
      'U': {count: 2, points: 3},
      'Ą': {count: 1, points: 5},
      'Ę': {count: 1, points: 5},
      'F': {count: 1, points: 5},
      'Ó': {count: 1, points: 5},
      'Ś': {count: 1, points: 5},
      'Ż': {count: 1, points: 5},
      'Ć': {count: 1, points: 6},
      'Ń': {count: 1, points: 7},
      'Ź': {count: 1, points: 9}
    },
    boardWidth: 15,
    boardHeight: 15,
    standWidth: 7
  }

  // MIXIN.droppable definiuje wspólne metody dla wszystkich elementów,
  // do których można upuścić literkę.
  // Użyć poprzez `Object.assign(Target.prototype, MIXIN.droppable)`
  // Wymaga zdefiniowania metod `addLetter` i `removeLetter` oraz `disabled`,
  // jak również pola `is_disabled`.
  var MIXIN = {
    droppable: {
      drop: function(event) {
        event.preventDefault();
        this.elem.classList.remove('over');

        var id = +event.dataTransfer.getData("text");
        var letter = this.game.allLetters[id];
        this.placeLetter(letter);

        this.game.refreshBoard();
      },

      dragover: function(event) {
        if (!this.is_disabled) {
          event.preventDefault();
          this.elem.classList.add('over');
        }
      },

      dragleave: function(event) {
        this.elem.classList.remove('over');
      },

      placeLetter: function(letter) {
        var oldCell = letter.cell;
        var oldLetter = this.letter;

        if (oldLetter && oldCell) {
          oldCell.removeLetter(letter);
          this.removeLetter(oldLetter);

          oldCell.addLetter(oldLetter);
          this.addLetter(letter);
        } else if (oldCell) {
          oldCell.removeLetter(letter);

          this.addLetter(letter);
        } else {
          this.addLetter(letter);
        }
      }
    }
  };

  function shuffle(array) {
    var counter = array.length;

    while (counter > 0) {
      var index = Math.floor(Math.random() * counter);

      counter--;
      var tmp = array[counter];
      array[counter] = array[index];
      array[index] = tmp;
    }

    return array;
  }

  function addToSet(set, newElem) {
    if (set.indexOf(newElem) === -1) {
      return set.concat(newElem);
    } else {
      return set;
    }
  };

  function removeFromSet(set, elem) {
    var n = set.indexOf(elem);

    if (n === -1) {
      return set;
    } else {
      var newSet = set.slice();
      newSet.splice(n, 1);
      return newSet;
    }
  }

  function BoardManager(game, boardElem) {
    this.game = game;
    this.board = this.generateBoard(boardElem);
  }

  BoardManager.prototype.generateBoard = function(table) {
    var rows = [];

    for (var i = 0; i < CONST.boardHeight; i++) {
      var row = new BoardRow(i, this.game, CONST.boardWidth);
      table.appendChild(row.elem);
      rows.push(row);
    }

    return rows;
  };

  BoardManager.prototype.refresh = function(state, letters) {
    this.forEachCell(function (cell) { cell.disabled(true); });
    console.log(state);

    if (state === "startup") {
      this.allowCenter();
    } else if (state === "firstLetter") {
      this.allowTraverse(letters[0].cell, -1, 0);
      this.allowTraverse(letters[0].cell,  1, 0);
      this.allowTraverse(letters[0].cell, 0, -1);
      this.allowTraverse(letters[0].cell, 0,  1);
    } else if (state === "newTurn") {
      this.forEachCell(function (cell) {
        if (!cell.isEmpty()) {
          this.allowAround(cell);
        }
      }, this);
    } else if (state === "vertical") {
      this.allowTraverse(letters[0].cell, -1, 0);
      this.allowTraverse(letters[0].cell,  1, 0);
    } else if (state === "horizontal") {
      this.allowTraverse(letters[0].cell, 0, -1);
      this.allowTraverse(letters[0].cell, 0,  1);
    } else {
      console.log("Unexpected state: " + state);
    }
  };

  BoardManager.prototype.allowTraverse = function(cell, dy, dx) {
    while (!cell.isEmpty()) {
      cell.disabled(false);
      cell = this.getCell(cell.y + dy, cell.x + dx);
    }
    // one past the set - it's the new cell
    cell.disabled(false);
  };

  BoardManager.prototype.allowCenter = function() {
    this.getCell(Math.floor(CONST.boardHeight / 2),
                 Math.floor(CONST.boardWidth / 2))
      .disabled(false);
  };

  BoardManager.prototype.allowAround = function(cell) {
    cell.disabled(false);
    this.getCell(cell.y - 1, cell.x).disabled(false);
    this.getCell(cell.y + 1, cell.x).disabled(false);
    this.getCell(cell.y, cell.x - 1).disabled(false);
    this.getCell(cell.y, cell.x + 1).disabled(false);
  };

  BoardManager.prototype.getCell = function(y, x) {
    if (y >= 0 && y < CONST.boardHeight
        && x >= 0 && x < CONST.boardWidth) {
      return this.board[y].cells[x];
    }

    // NullObject pattern
    return {disabled: function(){}, isEmpty: function(){return true;}};
  };

  BoardManager.prototype.forEachCell = function(callback, thisArg) {
    this.board.forEach(function(row) {
      row.cells.forEach(function (cell) {
        callback.apply(thisArg, [cell]);
      });
    });
  };

  BoardManager.prototype.filledCells = function() {
    var count = 0;

    this.forEachCell(function (cell) {
      count += !cell.isEmpty();
    })

    return count;
  };

  // Klasa reprezentująca grę i zawierająca większość logiki gry
  function Game(elems) {
    this.elems = elems;
    this.allLetters = this.generateLetters(CONST.letters);
    this.letters = shuffle(this.allLetters.slice());
    this.playedLetters = [];
    this.activePlayer = -1;
    this.turn = 0;
    // Odpowiednio pobrać imiona graczy i ich ilość
    this.players = [new Player('player1', this), new Player('player2', this)];
    this.boardManager = new BoardManager(this, elems.board);
    this.stand = elems.stand;
    this.exchange = new Exchange(elems.exchange, this);

    this.wireUp();

    this.nextTurn();
    this.refreshBoard();
  }

  ns.Game = Game;

  Game.prototype.wireUp = function() {
    this.elems.nextTurn.addEventListener('click', this.nextTurn.bind(this));
  };

  Game.prototype.currentPlayer = function() {
    return this.players[this.activePlayer];
  };

  Game.prototype.disableTurn = function() {
    this.elems.nextTurn.disabled = true;
  };

  Game.prototype.enableTurn = function() {
    this.elems.nextTurn.disabled = false;
  };

  Game.prototype.refreshBoard = function() {
    this.boardManager.refresh(this.state(), this.playedLetters);
  };

  Game.prototype.state = function() {
    if (this.boardManager.filledCells() === 0) {
      return "startup";
    } else if (this.playedLetters.length === 0) {
      return "newTurn";
    } else if (this.playedLetters.length === 1) {
      return "firstLetter";
    } else if (this.playedLetters[0].cell.x === this.playedLetters[1].cell.x) {
      return "vertical";
    } else {
      return "horizontal";
    }
  };

  Game.prototype.nextTurn = function() {
    this.turn += 1 / this.players.length;
    this.elems.turn.textContent = Math.ceil(this.turn);
    this.addPoints(this.currentPlayer());
    this.nextPlayer();
    this.exchange.disabled(false);
    this.playedLetters = [];
    this.refreshBoard();

    if (this.isEndOfGame()) {
      this.endOfGame();
    }
  };

  Game.prototype.addPoints = function(player) {
    // Dodać odpowiednią ilość punktów obecnemu graczowi
  };

  Game.prototype.endOfGame = function() {
    // handle end of game
  };

  Game.prototype.isEndOfGame = function() {
    var no_letters = this.letters.length === 0,
        players_empty = this.players.every(function(p) { return p.hasEmptyStand(); });

    return no_letters && players_empty;
  };

  Game.prototype.nextPlayer = function() {
    var current = this.currentPlayer();

    this.activePlayer++;
    this.activePlayer %= this.players.length;

    var next = this.currentPlayer();
    if (current) {
      this.stand.replaceChild(next.stand.elem, current.stand.elem);
    } else {
      this.stand.appendChild(next.stand.elem);
    }

    // Jakaś tabelka na wyniki? Może lista. Lepiej niż tylko wynik obecnego
    this.elems.points.textContent = next.points;
    this.elems.name.textContent = next.name;
    next.fillStand(this.letters);
  };

  Game.prototype.generateLetters = function(letters) {
    var array = [];
    var counter = 0;

    for (var letter in letters) {
      for (var i = 0; i < letters[letter].count; i++) {
        array.push(new Letter(letter, letters[letter].points, counter++));
      }
    }

    return array;
  };

  // Wiersz tabeli w polu gry, lub na stojaku dla gracza
  function BoardRow(y, game, width) {
    this.y = y;
    this.game = game;
    this.elem = document.createElement('tr');
    this.cells = this.generateCells(y, game, width);
  }

  ns.BoardRow = BoardRow;

  BoardRow.prototype.generateCells = function(y, game, width) {
    var cells = [];

    for (var i = 0; i < width; i++) {
      var cell = new BoardCell(i, y, this, game);
      this.elem.appendChild(cell.elem);

      cells.push(cell);
    }

    return cells;
  };

  // Pojedyncze pole gry, pole na stojaku.
  // Odpowiedzialne za przenoszenie płytek.
  // Implementuje MIXIN.droppable
  function BoardCell(x, y, row, game) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.game = game;
    this.elem = document.createElement('td');
    this.letter = null;
    this.is_disabled = false;
    this.disabled(this.is_disabled);

    this.wireUp();
  }

  ns.BoardCell = BoardCell;

  Object.assign(BoardCell.prototype, MIXIN.droppable);

  BoardCell.prototype.disabled = function(value) {
    this.is_disabled = value;

    if (value) {
      this.elem.classList.add('disabled');
    } else {
      this.elem.classList.remove('disabled');
    }
  }

  BoardCell.prototype.isEmpty = function() {
    return this.elem.children.length === 0;
  };

  BoardCell.prototype.addLetter = function(letter) {
    this.elem.appendChild(letter.elem);
    this.letter = letter;
    this.letter.cell = this;

    // Stand has y === -1
    if (this.y > 0) {
      this.game.playedLetters = addToSet(this.game.playedLetters, letter);
    }
  };

  BoardCell.prototype.removeLetter = function(letter) {
    this.elem.removeChild(letter.elem);
    letter.cell = null;
    this.letter = null;

    if (this.y > 0) {
      this.game.playedLetters = removeFromSet(this.game.playedLetters, letter);
    }
  };

  BoardCell.prototype.wireUp = function() {
    this.elem.addEventListener('drop', this.drop.bind(this));
    this.elem.addEventListener('dragover', this.dragover.bind(this));
    this.elem.addEventListener('dragleave', this.dragleave.bind(this));
  };

  // Literka
  // Odpowiedzialna za przenoszenie siebie samej
  function Letter(value, points, id) {
    this.value = value;
    this.points = points;
    this.id = id;
    this.elem = this.createElem(value);
    this.cell = null;

    this.wireUp();
  }

  ns.Letter = Letter;

  Letter.prototype.createElem = function(value) {
    var img = document.createElement('img');
    img.src = 'letter_images/letter_' + value.toLowerCase() + '.png';
    img.alt = value;
    img.draggable = true;

    return img;
  };

  Letter.prototype.wireUp = function() {
    this.elem.addEventListener('dragstart', this.dragstart.bind(this));
  };

  Letter.prototype.dragstart = function(event) {
    event.dataTransfer.setData("text", this.id);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
  };

  // Gracz
  // Zarządza również stojakiem i jego uzupełnianiem.
  function Player(name, game) {
    this.name = name;
    this.game = game;
    this.points = 0;
    this.stand = this.generateStand(game, CONST.standWidth);
  }

  ns.Player = Player;

  Player.prototype.generateStand = function(game, width) {
    var row = new BoardRow(-1, game, width);

    [].forEach.call(row.cells, function(cell) {
      cell.disabled(false);
    });

    return row;
  };

  Player.prototype.fillStand = function(letters) {
    for (var i in this.stand.cells) {
      var cell = this.stand.cells[i];

      if (cell.isEmpty() && !(letters.length === 0)) {
        cell.placeLetter(letters.pop());
      }
    }
  };

  Player.prototype.hasEmptyStand = function() {
    return this.stand.cells.every(function(cell) { return cell.isEmpty(); })
  }

  // Obiekt służący jako wymiana płytek.
  // Implementuje MIXIN.droppable
  function Exchange(elem, game) {
    this.elem = elem.querySelector('div');
    this.button = elem.querySelector('button');
    this.game = game;
    this.letters = [];
    this.is_disabled = true;
    this.disabled(this.is_disabled);

    this.wireUp();
  }

  ns.Exchange = Exchange;

  Object.assign(Exchange.prototype, MIXIN.droppable);

  Exchange.prototype.wireUp = function() {
    this.elem.addEventListener('drop', this.drop.bind(this));
    this.elem.addEventListener('dragover', this.dragover.bind(this));
    this.elem.addEventListener('dragleave', this.dragleave.bind(this));
    this.button.addEventListener('click', this.perform.bind(this));
  };

  Exchange.prototype.addLetter = function(letter) {
    this.game.disableTurn(); // Nie można przejść do kolejnej tury z literkami w wymianie
    this.letters.push(letter);
    letter.cell = this;
    this.elem.appendChild(letter.elem);
  };

  Exchange.prototype.removeLetter = function(letter) {
    var index = this.letters.indexOf(letter);
    this.letters.splice(index, 1);
    this.elem.removeChild(letter.elem);
    if (this.letters.length === 0) {
      this.game.enableTurn();
    }
    letter.cell = null;
  };

  Exchange.prototype.perform = function(event) {
    while (this.letters.length > 0) {
      var letter = this.letters[0];
      this.removeLetter(letter);
      this.game.letters.shift(letter);
    }

    this.game.currentPlayer().fillStand(this.game.letters);
    this.disabled(true);
  };

  Exchange.prototype.disabled = function(value) {
    this.is_disabled = value;
    this.button.disabled = value;

    if (value) {
      this.elem.classList.add('disabled');
    } else {
      this.elem.classList.remove('disabled');
    }
  };

})(this)
