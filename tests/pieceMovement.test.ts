import { describe, it, expect, test } from 'vitest';
import PcsMvmt from '../src/utils/pieceMovement';
import { Piece } from '../src/models/types';

function createEmptyBoard(): (Piece | null)[][] {
  return Array(8).fill(null).map(() => Array(8).fill(null));
}

function placePiece(board: (Piece | null)[][], piece: Piece) {
  board[piece.position.row][piece.position.col] = piece;
}

// const board = createEmptyBoard();
// placePiece(board, pawn);
// placePiece(board, enemy);


describe('PcsMvmt', () => {
  it('deve validar um movimento de peão para frente', () => {
    const pcsMvmt = new PcsMvmt();
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[6][0] = pawn;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, 5, 0, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir peão avançar se houver peça na frente', () => {
    const pcsMvmt = new PcsMvmt();
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const block: Piece = { type: 'pawn', color: 'white', position: { row: 5, col: 0 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[6][0] = pawn;
    board[5][0] = block;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, 5, 0, board);
    expect(isValid).toBe(false);
  });

  it('deve validar captura diagonal de peão', () => {
    const pcsMvmt = new PcsMvmt();
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const enemy: Piece = { type: 'pawn', color: 'black', position: { row: 5, col: 1 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[6][0] = pawn;
    board[5][1] = enemy;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, 5, 1, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir peão capturar peça da mesma cor', () => {
    const pcsMvmt = new PcsMvmt();
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const friend: Piece = { type: 'pawn', color: 'white', position: { row: 5, col: 1 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[6][0] = pawn;
    board[5][1] = friend;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, 5, 1, board);
    expect(isValid).toBe(false);
  });

  it('deve validar movimento de torre em linha reta', () => {
    const pcsMvmt = new PcsMvmt();
    const rook: Piece = { type: 'rook', color: 'white', position: { row: 7, col: 0 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[7][0] = rook;
    const isValid = pcsMvmt.isValidMove(rook, { row: 7, col: 0 }, 4, 0, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir torre pular peça', () => {
    const pcsMvmt = new PcsMvmt();
    const rook: Piece = { type: 'rook', color: 'white', position: { row: 7, col: 0 } };
    const block: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[7][0] = rook;
    board[6][0] = block;
    const isValid = pcsMvmt.isValidMove(rook, { row: 7, col: 0 }, 4, 0, board);
    expect(isValid).toBe(false);
  });

  it('deve validar movimento de cavalo pulando peças', () => {
    const pcsMvmt = new PcsMvmt();
    const knight: Piece = { type: 'knight', color: 'white', position: { row: 7, col: 1 } };
    const block: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 1 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[7][1] = knight;
    board[6][1] = block;
    const isValid = pcsMvmt.isValidMove(knight, { row: 7, col: 1 }, 5, 2, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir cavalo capturar peça da mesma cor', () => {
    const pcsMvmt = new PcsMvmt();
    const knight: Piece = { type: 'knight', color: 'white', position: { row: 7, col: 1 } };
    const friend: Piece = { type: 'pawn', color: 'white', position: { row: 5, col: 2 } };
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[7][1] = knight;
    board[5][2] = friend;
    const isValid = pcsMvmt.isValidMove(knight, { row: 7, col: 1 }, 5, 2, board);
    expect(isValid).toBe(false);
  });
});

test('deve validar um movimento de peão para frente duas casas', () => {
  const pcsMvmt = new PcsMvmt();
  const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  board[6][0] = pawn;
  const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, 4, 0, board);
  expect(isValid).toBe(true);
});
