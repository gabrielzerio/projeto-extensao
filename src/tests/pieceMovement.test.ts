import { describe, it, expect, test, beforeEach } from 'vitest';
import PcsMvmt from '../utils/pieceMovement';
import { Piece } from '../models/types';
import { Board, EnPassantTarget } from '../models/types';

// const board = createEmptyBoard();
// placePiece(board, pawn);
// placePiece(board, enemy);

describe('PcsMvmt pawn', () => {
  let board: Board;
  const pcsMvmt = new PcsMvmt();
  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });
  
  it('deve validar um movimento de peão para frente', () => {
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    board[6][0] = pawn;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 0 }, board);
    expect(isValid).toBe(true);
  });

  it('deve validar movimento de peão para frente duas casas', () => {
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    board[6][0] = pawn;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 4, col: 0 }, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir peão avançar se houver peça na frente', () => {
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const block: Piece = { type: 'pawn', color: 'white', position: { row: 5, col: 0 } };
    board[6][0] = pawn;
    board[5][0] = block;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 0 }, board);
    expect(isValid).toBe(false);
  });

  it("deve validar o peão não capturar peça inimiga na reta", () => {
      const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
      const enemy: Piece = { type: 'pawn', color: 'black', position: { row: 5, col: 0 } };
      board[6][0] = pawn;
      board[5][0] = enemy;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 0 }, board);
      expect(isValid).toBe(false);
    }
  )
  it('deve validar captura diagonal de peão inimigo', () => {
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const enemy: Piece = { type: 'pawn', color: 'black', position: { row: 5, col: 1 } };
    board[6][0] = pawn;
    board[5][1] = enemy;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 1 }, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir peão capturar peça da mesma cor', () => {
    const pawn: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    const friend: Piece = { type: 'pawn', color: 'white', position: { row: 5, col: 1 } };
    board[6][0] = pawn;
    board[5][1] = friend;
    const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 1 }, board);
    expect(isValid).toBe(false);
  });
  
  it('valida funcionalidade en passant', () => {    
    const enPassantTarget: EnPassantTarget = { row: 5, col: 1 };
    const enemy: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 1 } };
    const piece: Piece = { type: 'pawn', color: 'black', position: { row: 4, col: 0 } };
    board[6][1] = enemy;
    board[4][0] = piece;    
    const isValid = pcsMvmt.isValidMove(enemy, enemy.position, { row: 4, col: 1 }, board, enPassantTarget);
    expect(isValid).toBe(true);
  });
});

describe('PcsMvmt rook', () => {
  let board: Board;
  const pcsMvmt = new PcsMvmt();
  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });
  it('não deve permitir torre pular peça', () => {
    const rook: Piece = { type: 'rook', color: 'white', position: { row: 7, col: 0 } };
    const block: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 0 } };
    board[7][0] = rook;
    board[6][0] = block;
    const isValid = pcsMvmt.isValidMove(rook, { row: 7, col: 0 }, { row: 4, col: 0 }, board);
    expect(isValid).toBe(false);
  });
  
  it('deve validar movimento de torre em linha reta', () => {
    const rook: Piece = { type: 'rook', color: 'white', position: { row: 7, col: 0 } };
    board[7][0] = rook;
    const isValid = pcsMvmt.isValidMove(rook, { row: 7, col: 0 }, { row: 4, col: 0 }, board);
    expect(isValid).toBe(true);
  });


});

describe('PcsMvmt knight', () => {
  const pcsMvmt = new PcsMvmt();
  let board: Board;
  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });
  it('deve validar movimento de cavalo pulando peças', () => {
    const knight: Piece = { type: 'knight', color: 'white', position: { row: 7, col: 1 } };
    const block: Piece = { type: 'pawn', color: 'white', position: { row: 6, col: 1 } };
    board[7][1] = knight;
    board[6][1] = block;
    const isValid = pcsMvmt.isValidMove(knight, { row: 7, col: 1 }, { row: 5, col: 2 }, board);
    expect(isValid).toBe(true);
  });

  it('não deve permitir cavalo capturar peça da mesma cor', () => {
    const knight: Piece = { type: 'knight', color: 'white', position: { row: 7, col: 1 } };
    const friend: Piece = { type: 'pawn', color: 'white', position: { row: 5, col: 2 } };
    board[7][1] = knight;
    board[5][2] = friend;
    const isValid = pcsMvmt.isValidMove(knight, { row: 7, col: 1 }, { row: 5, col: 2 }, board);
    expect(isValid).toBe(false);
  });
});
