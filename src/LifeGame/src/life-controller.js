/** Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas
 * Curso: 3º
 * Práctica 12 PAI - Life
 * @file life-model.js
 * @author Rafael Cala
 * Correo: alu0101121901@ull.edu.es
 * @since 11/05/20
 * @version 1.0.0
 * @description Fichero que contiene la clase LifeModel, que recibe
 * manipulaciones desde LifeController con las que actualiza el 
 * LifeView, acorde al modelo Vista-Computador.
 */

"use strict";

/**
 * Inclusión de las clases que se encuentran en otros ficheros
 * comprobando si la ejecución se da en un navegador o en el node.
 */
let ClassMatrix;

if (typeof require !== 'undefined') {
  ClassMatrix = require('../src/matrix.js').Matrix;
}
else {
  ClassMatrix = Matrix;
}


/**
 * @class LifeController
 * @description Clase cuya funcionalidad es calcular diversas configuraciones
 * de tableros, almacenadas en una matriz.
 */
class LifeController {
  /**
   * @description Constructor de la clase, que crea una matriz de tamaño 
   * rows x columns, que son pasadas como parámetros, y crea la matriz de
   * vecinos correspondiente. Finalmente, inicializa la matriz de células.
   */
  constructor(rows, cols) {
    this.stateMatrix_ = new ClassMatrix (rows, cols);
    this.adjacentCounter_ = new ClassMatrix (rows, cols);
    this.initialize();
  }

  /**
   * @description Método que devuelve la matriz de células.
   */
  get matrix () {
    return this.stateMatrix_;
  }

  /**
   * @description Método que inicializa la matriz de células, poniéndolas todas
   * a 0.
   */
  initialize() {
    for (let currentRow = 0; currentRow < this.stateMatrix_.rows; currentRow++)
      for (let currentCol = 0; currentCol < this.stateMatrix_.cols; currentCol++)
        this.stateMatrix_.setPosition(currentRow, currentCol, 0);
  }

  /**
   * @description Método que crea la configuración del inicio del juego de la 
   * vida, recibiendo un número de celdas inicial en el tablero, que serán 
   * situadas en posiciones aleatorias del mismo.
   */
  playLife(cellsAlive) {
    for (let currentCell = 0; currentCell < cellsAlive; currentCell++) {
      let rowIndex = Math.floor(Math.random() * this.stateMatrix_.rows);
      let colIndex = Math.floor(Math.random() * this.stateMatrix_.cols);
      while (this.stateMatrix_.getData(rowIndex, colIndex) === 1) {
        rowIndex = Math.floor(Math.random() * this.stateMatrix_.rows);
        colIndex = Math.floor(Math.random() * this.stateMatrix_.cols);
      }
      this.stateMatrix_.setPosition(rowIndex, colIndex, 1);
    }
    this.calculateAdjacentMatrix();
  }

  /**
   * @description Método que lleva a cabo un ciclo de vida del juego. Primero
   * se crea una matriz de vecinos, que almacena en i,j el número de vecinos 
   * de la celda i,j de la matriz de estados. Luego, a partir de dicha matriz
   * se aplican las reglas a la matriz de estados.
   */
  cycle() {
    this.calculateAdjacentMatrix();
    for (let currentRow = 0; currentRow < this.stateMatrix_.rows; currentRow++) {
      for (let currentCol = 0; currentCol < this.stateMatrix_.cols; currentCol++) {
        let neighbors = this.adjacentCounter_.getData(currentRow, currentCol);
        let newValue = this.applyRules(currentRow, currentCol, neighbors);
        this.stateMatrix_.setPosition(currentRow, currentCol, newValue);
      }
    }
  }
  
  /**
   * @description Método que obtiene la matriz de vecinos de cada celda i,j de
   * la matriz.
   */
  calculateAdjacentMatrix() {
    for (let currentRow = 0; currentRow < this.stateMatrix_.rows; currentRow++) {
      for (let currentCol = 0; currentCol < this.stateMatrix_.cols; currentCol++) {
        this.adjacentCounter_.setPosition(currentRow, currentCol, this.countAdjacent(currentRow, currentCol));
      }
    }
  }


  /**
   * @description Método que aplica las reglas del juego, devolviendo el estado
   * nuevo de la célula.
   * @param {Number} rowIndex Número de columnas
   * @param {Number} colIndex Número de filas
   * @param {Number} neighbors Número de vecinos 
   */
  applyRules (rowIndex, colIndex, neighbors) {
    if (this.stateMatrix_.getData(rowIndex, colIndex) === 1) {
      if(this.willSurvive(neighbors))
        return 1;
      else return 0;
    }
    else if (this.stateMatrix_.getData(rowIndex, colIndex) === 0) {
      if (this.willBeAlive(neighbors))
        return 1;
      return 0;        
    }

  }


  /**
   * @description Método que cuenta el número de vecinos de una celda i,j
   * de la matriz de estados.
   * @param {Number} rowIndex Número de filas
   * @param {Number} colIndex Número de columnas
   * @returns Número de vecinos de la celda.
   */
  countAdjacent(rowIndex, colIndex) {
    let neighborsAlive = 0;
    for (let currentRow = rowIndex - 1; currentRow <= rowIndex + 1; currentRow++) {
      for (let currentCol = colIndex - 1; currentCol <= colIndex + 1; currentCol++) {
        if (currentCol !== colIndex || currentRow !== rowIndex) {
          if (this.stateMatrix_.getData(currentRow, currentCol) === 1 && this.insideOfGrid(currentRow, currentCol)) {
            neighborsAlive++;
          }
        }
      }
    }   
    
    return neighborsAlive;
  }
  

  /**
   * @description Método que comprueba si los índices se encuentran dentro del
   * rango de la matriz.
   * @param {Número} rowIndex Número de filas
   * @param {Número} colIndex Número de columnas
   * @returns True si está dentro de la matriz, falso en otro caso
   */
  insideOfGrid(rowIndex, colIndex) {
    if ((rowIndex < 0 || rowIndex >= this.stateMatrix_.rows) || (colIndex < 0 || colIndex >= this.stateMatrix_.cols))
      return false;
    return true;
  }

  /**
   * @description Método que aplica la regla de supervivencia de la célula
   * @param {Number} neighbors Número de vecinos.
   * @returns True, si se cumple la regla, falso en otro caso.
   */
  willSurvive(neighbors) {
    if (neighbors === 2 || neighbors === 3)
      return true;
    return false;
  }

  /**
   * @description Método que aplica la regla de resucitar de la célula
   * @param {Number} neighbors Número de columnas
   * @returns True, si se cumple la regla, falso en otro caso.
   */
  willBeAlive(neighbors) {
    if (neighbors === 3)
      return true;
    return false;
  }
  

}

/**
 * Exportación de la clase LifeController
 */
if (typeof exports !== 'undefined') {
  exports.LifeController = LifeController;
}