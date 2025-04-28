import { Piece } from './Piece';
import { Position, Board } from '../types';

export class Bishop extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('bishop', color, position);
  }

  isValidMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if (rowDiff === colDiff && this.canMoveToPosition(to, board)) {
      return !this.isPathBlocked(from, to, board);
    }
    return false;
  }
}
