import { Piece } from './Piece';
import { Position, Board } from '../types';

export class Bishop extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('bishop', color, position);
  }

  isValidMove(from: Position, to: Position, board: Board): boolean {
    return this.isValidPattern(from, to, board) && this.isMoveValid(from, to, board);
  }

  protected isValidPattern(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    return rowDiff === colDiff && !this.isPathBlocked(from, to, board);
  }
}
