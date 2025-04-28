import { Piece } from './Piece';
import { Position, Board } from '../types';

export class Knight extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('knight', color, position);
  }

  isValidMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
      return this.isMoveValid(from, to, board);
    }
    return false;
  }
}
