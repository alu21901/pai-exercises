/** Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas
 * Curso: 3º
 * Práctica 11 PAI - Chess
 * @file board.js
 * @author Rafael Cala
 * Correo: alu0101121901@ull.edu.es
 * @since 01/05/20
 * @version 1.0.0
 * @description Fichero que contiene la clase Board, cuya funcionalidad
 * es dibujar el tablero, y situar objetos sobre él.
 */

"use strict";

/**
 * Inclusión de las clases que se encuentran en otros ficheros
 * comprobando si la ejecución se da en un navegador o en el node.
 */
let ClassPainter;

if (typeof require !== 'undefined') {
  ClassPainter = require('../src/painter.js').Painter;
}
else {
  ClassPainter = Painter;
}

/**
 * Variables globales para el funcionamiento del programa.
 */
const SQUARE_NUMBER = 8;
const COLOR_BOARD_1 = '#F2D8B7';
const COLOR_BOARD_2 = '#B78766';
const SQUARE_COLOR = [COLOR_BOARD_2, COLOR_BOARD_1];

/**
 * Objeto que almacena las imágenes 
 */
  const PIECES_IMAGES = {
    blackQueen: new Image(),
    blackKing: new Image(),
    blackAlfil: new Image(),
    blackTower: new Image(),
    blackPeon: new Image(),
    blackHorse: new Image(),
    whiteQueen: new Image(),
    whiteKing: new Image(),
    whiteAlfil: new Image(),
    whiteTower: new Image(),
    whitePeon: new Image(),
    whiteHorse: new Image(),
  }


/**
 * @class Board
 * @extends Painter
 * @description Clase que se encarga de dibujar un tablero y de situar los
 * objetos convenientes sobre él. 
 */
class Board extends ClassPainter {
  /**
   * @description Pasa el canvas y su contexto a la clase base e inicializa 
   * el tamaño de los cuadrados del tablero a 0. Además carga las direcciones
   * de las imágenes, con el fin de que cuando se vayan a pintar en el tablero
   * ya estén cargadas.
   * @param {Object} CANVAS Canvas
   * @param {Object} CTX Contexto del canvas
   */
  constructor(CANVAS, CTX) {
    super(CANVAS, CTX);
    this.squareLength_ = 0;
    if (CANVAS !== undefined)
      this.loadPieces();
  }

  /* istanbul ignore next */
  /**
   * @description Método que calcula la longitud de un lado del cuadrado y
   * con él, dibuja las celdas del tablero de ajedrez, dibujando
   * alternativamente un color u otro.
   */
  draw() {
    this.calculateSquareLength();
    for (let currentRow = 0; currentRow < SQUARE_NUMBER; currentRow++) {
      let tmp = SQUARE_COLOR[0];
      SQUARE_COLOR[0] = SQUARE_COLOR[1];
      SQUARE_COLOR[1] = tmp;
      for (let currentCol = 0; currentCol < SQUARE_NUMBER; currentCol++) {
        if ((currentCol % 2) === 0) 
          this.ctx_.fillStyle = `${SQUARE_COLOR[0]}`;
        else
          this.ctx_.fillStyle = `${SQUARE_COLOR[1]}`;
        this.ctx_.fillRect(currentCol * this.squareLength_, currentRow * this.squareLength_, this.squareLength_, this.squareLength_);
      }
    }
  }
  
  /* istanbul ignore next */
  /**
   * @description Método que carga las rutas en las imágenes del objeto
   * PIECES_IMAGES.
   */
  loadPieces() {
    PIECES_IMAGES.blackQueen.src = "../img/black_queen.svg";
    PIECES_IMAGES.blackKing.src = "../img/black_king.svg";
    PIECES_IMAGES.blackAlfil.src = "../img/black_alfil.svg";
    PIECES_IMAGES.blackPeon.src = "../img/black_peon.svg";
    PIECES_IMAGES.blackTower.src = "../img/black_tower.svg";
    PIECES_IMAGES.blackHorse.src = "../img/black_horse.svg";
    PIECES_IMAGES.whiteQueen.src = "../img/white_queen.svg";
    PIECES_IMAGES.whiteKing.src = "../img/white_king.svg";
    PIECES_IMAGES.whiteAlfil.src = "../img/white_alfil.svg";
    PIECES_IMAGES.whitePeon.src = "../img/white_peon.svg";
    PIECES_IMAGES.whiteTower.src = "../img/white_tower.svg";
    PIECES_IMAGES.whiteHorse.src = "../img/white_horse.svg";
  }
  
  /* istanbul ignore next */
  /**
   * @description Método que se encarga de escribir en el tablero los detalles
   * en sus extremos sobre la notación algebraica para asemejarso en mayor 
   * medida al ejemplo proporcionado por el enunciado de la práctica.
   * Define un tamaño y tipo de letra. En un primer bucle, pinta en el extremo
   * derecho del tablero los números del 1 al 8, y en un segundo bucle, imprime
   * en el extremo inferior las letras de derecha a izquierda de la 'a' a la
   * 'h'.
   */
  drawNumbers() {
    this.ctx_.font = "bold 9px sans-serif";
    let counterToBottom = 1;
    let counterToLeft = 'hgfedcba';
    let currentX = this.width_ - 10;
    let currentY = 10;
    for (; currentY < this.height_; currentY += this.squareLength_) {
      if ((counterToBottom % 2) === 0) 
        this.ctx_.fillStyle = `${SQUARE_COLOR[0]}`;
      else
       this.ctx_.fillStyle = `${SQUARE_COLOR[1]}`;
      this.ctx_.fillText(`${counterToBottom}`, currentX, currentY);
      counterToBottom++;
    }
    currentX = (this.width_ - this.squareLength_) + 10;
    currentY = this.height_ - 5;
    for (; currentX > 0; currentX -= this.squareLength_) {
      if ((counterToBottom % 2) === 0) 
        this.ctx_.fillStyle = `${SQUARE_COLOR[1]}`;
      else
        this.ctx_.fillStyle = `${SQUARE_COLOR[0]}`;
      this.ctx_.fillText(`${counterToLeft[counterToBottom - 2]}`, currentX, currentY);
      counterToBottom--;
    }
  }
  
  /**
   * @description Método que dado el ancho del canvas, calcula la longitud
   * que tendrán los lados de los cuadrados del tablero.
   */
  calculateSquareLength () {
    this.squareLength_ = this.width_ / 8;
  }

  /* istanbul ignore next */
  /**
   * @description Método que pasados los índices de una celda del tablero y
   * la pieza en cuestión, pinta en dicha celda la imagen en cuestión.
   * @param {Number} row índice de la fila
   * @param {Number} col índice de la columna
   * @param {String} piece label de la pieza
   */
  putOnBoard(row, col, piece) {
    this.ctx_.drawImage(this.getPieceImage(piece), this.squareLength_ * (row), this.squareLength_ * (col), this.squareLength_, this.squareLength_);
  }
  /* istanbul ignore next */
  /**
   * @description 
   * @param {String} pieceLabel label de la pieza 
   */
  getPieceImage(pieceLabel) {
    switch(pieceLabel) {
      case "Black Queen":
        return PIECES_IMAGES.blackQueen;
      case "Black King":
        return PIECES_IMAGES.blackKing;
      case "Black Tower":
        return PIECES_IMAGES.blackTower;
      case "Black Alfil":
        return PIECES_IMAGES.blackAlfil;
      case "Black Peon":
        return PIECES_IMAGES.blackPeon;
      case "Black Horse":
        return PIECES_IMAGES.blackHorse;
      case "White Queen":
        return PIECES_IMAGES.whiteQueen;
      case "White King":
        return PIECES_IMAGES.whiteKing;
      case "White Tower":
       return PIECES_IMAGES.whiteTower;
      case "White Alfil":
        return PIECES_IMAGES.whiteAlfil;
      case "White Peon":
        return PIECES_IMAGES.whitePeon;
      case "White Horse":
        return PIECES_IMAGES.whiteHorse;
    }
  }

  /* istanbul ignore next */
  /**
   * @description Método que limpia el tablero.
   */
  clear() {
    this.ctx_.fillStyle = "white";
    this.ctx_.fillRect(0, 0, this.width_, this.height_);
  }
}

/**
 * Exportación de la clase Painter
 */
if (typeof exports !== 'undefined') {
  exports.Board = Board;
}