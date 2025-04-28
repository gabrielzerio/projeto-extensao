import { Piece } from './Piece';
import { Position, Board } from '../types';

export class Queen extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('queen', color, position);
  }

  protected isValidPattern(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && 
           !this.isPathBlocked(from, to, board);
  }
}
