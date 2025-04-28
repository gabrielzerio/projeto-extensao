import { Piece } from './Piece';
import { Position, Board } from '../types';

export class Queen extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('queen', color, position);
  }

  isValidMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if ((rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && 
        !this.isPathBlocked(from, to, board)) {
      return this.isMoveValid(from, to, board);
    }
    return false;
  }
}
