import { describe, it, expect } from 'vitest';
import PcsMvmt from '../src/utils/pieceMovement';
import { Piece } from '../src/models/types';

describe('PcsMvmt', () => {
  it('deve validar um movimento de peão para frente', () => {
    const pcsMvmt = new PcsMvmt();
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    // Monte um tabuleiro de teste e peça de teste conforme sua lógica
    // Exemplo fictício:
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[6][0] = pawn;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, 5, 0, board);
    expect(isValid).toBe(true);
  });
});