import { describe, it, expect, beforeEach } from 'vitest';
import { PieceFactory } from '../models/PieceFactory';
import { Board } from '../models/types';
import { King } from '../models/pieces/King';

describe('Check situation', () => {
  let board: Board;
  let king: King;

  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });

  it('should detect check when king is attacked', () => {
    king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 }) as King;
    const rook = PieceFactory.createPiece('rook', 'black', { row: 0, col: 4 });
    board[7][4] = king;
    board[0][4] = rook;

    expect(king.isInCheck(board)).toBe(true);
  });
});
