import { Piece } from './Piece';
import { Position, Board } from '../types';

export class Rook extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('rook', color, position, false);
  }

  isValidMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if ((rowDiff === 0 || colDiff === 0) && this.canMoveToPosition(to, board)) {
      return !this.isPathBlocked(from, to, board);
    }
    return false;
  }
}
