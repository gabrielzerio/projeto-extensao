import { describe, it, expect, beforeEach } from 'vitest';
import { PieceFactory } from '../models/PieceFactory';
import { Board } from '../models/types';
import PcsMvmt from '../utils/pieceMovement';

describe('Piece Movement Tests', () => {
  let board: Board;
  const pcsMvmt = new PcsMvmt();

  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });

  describe('Pawn Tests', () => {
    it('deve validar um movimento de peão para frente', () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      board[6][0] = pawn;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 0 }, board);
      expect(isValid).toBe(true);
    });

    it('deve validar movimento de peão para frente duas casas', () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      board[6][0] = pawn;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 4, col: 0 }, board);
      expect(isValid).toBe(true);
    });

    it('não deve permitir peão avançar se houver peça na frente', () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      const block = PieceFactory.createPiece('pawn', 'white', { row: 5, col: 0 });
      board[6][0] = pawn;
      board[5][0] = block;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 0 }, board);
      expect(isValid).toBe(false);
    });

    it('deve validar o peão não capturar peça inimiga na reta', () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      const enemy = PieceFactory.createPiece('pawn', 'black', { row: 5, col: 0 });
      board[6][0] = pawn;
      board[5][0] = enemy;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 0 }, board);
      expect(isValid).toBe(false);
    });

    it('deve validar captura diagonal de peão inimigo', () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      const enemy = PieceFactory.createPiece('pawn', 'black', { row: 5, col: 1 });
      board[6][0] = pawn;
      board[5][1] = enemy;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 1 }, board);
      expect(isValid).toBe(true);
    });

    it('não deve permitir peão capturar peça da mesma cor', () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      const friend = PieceFactory.createPiece('pawn', 'white', { row: 5, col: 1 });
      board[6][0] = pawn;
      board[5][1] = friend;
      const isValid = pcsMvmt.isValidMove(pawn, { row: 6, col: 0 }, { row: 5, col: 1 }, board);
      expect(isValid).toBe(false);
    });

    it('valida funcionalidade en passant', () => {
      const enPassantTarget = { row: 5, col: 1 };
      const enemy = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 1 });
      const piece = PieceFactory.createPiece('pawn', 'black', { row: 4, col: 0 });
      board[6][1] = enemy;
      board[4][0] = piece;
      const isValid = pcsMvmt.isValidMove(enemy, enemy.position, { row: 4, col: 1 }, board, enPassantTarget);
      expect(isValid).toBe(true);
    });
  });

  describe('Rook Tests', () => {
    it('não deve permitir torre pular peça', () => {
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 0 });
      const block = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 0 });
      board[7][0] = rook;
      board[6][0] = block;
      const isValid = pcsMvmt.isValidMove(rook, { row: 7, col: 0 }, { row: 4, col: 0 }, board);
      expect(isValid).toBe(false);
    });

    it('deve validar movimento de torre em linha reta', () => {
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 0 });
      board[7][0] = rook;
      const isValid = pcsMvmt.isValidMove(rook, { row: 7, col: 0 }, { row: 4, col: 0 }, board);
      expect(isValid).toBe(true);
    });
  });

  describe('Knight Tests', () => {
    it('deve validar movimento de cavalo pulando peças', () => {
      const knight = PieceFactory.createPiece('knight', 'white', { row: 7, col: 1 });
      const block = PieceFactory.createPiece('pawn', 'white', { row: 6, col: 1 });
      board[7][1] = knight;
      board[6][1] = block;
      const isValid = pcsMvmt.isValidMove(knight, { row: 7, col: 1 }, { row: 5, col: 2 }, board);
      expect(isValid).toBe(true);
    });

    it('não deve permitir cavalo capturar peça da mesma cor', () => {
      const knight = PieceFactory.createPiece('knight', 'white', { row: 7, col: 1 });
      const friend = PieceFactory.createPiece('pawn', 'white', { row: 5, col: 2 });
      board[7][1] = knight;
      board[5][2] = friend;
      const isValid = pcsMvmt.isValidMove(knight, { row: 7, col: 1 }, { row: 5, col: 2 }, board);
      expect(isValid).toBe(false);
    });
  });

  describe('Bishop Tests', () => {
    it('deve validar movimento diagonal do bispo', () => {
      const bishop = PieceFactory.createPiece('bishop', 'white', { row: 7, col: 2 });
      board[7][2] = bishop;
      const isValid = pcsMvmt.isValidMove(bishop, { row: 7, col: 2 }, { row: 5, col: 4 }, board);
      expect(isValid).toBe(true);
    });
  });

  describe('Queen Tests', () => {
    it('deve validar movimento diagonal da rainha', () => {
      const queen = PieceFactory.createPiece('queen', 'white', { row: 7, col: 3 });
      board[7][3] = queen;
      const isValid = pcsMvmt.isValidMove(queen, { row: 7, col: 3 }, { row: 5, col: 5 }, board);
      expect(isValid).toBe(true);
    });
  });

  describe('King Tests', () => {
    it('deve validar movimento básico do rei', () => {
      const king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 });
      board[7][4] = king;
      const isValid = pcsMvmt.isValidMove(king, { row: 7, col: 4 }, { row: 6, col: 4 }, board);
      expect(isValid).toBe(true);
    });

    it('deve validar roque', () => {
      const king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 });
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 7 });
      board[7][4] = king;
      board[7][7] = rook;
      const isValid = pcsMvmt.isValidMove(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board);
      expect(isValid).toBe(true);
    });
  });
});
