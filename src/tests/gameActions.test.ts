import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Piece, Position, Board } from '../models/types';
import { handleCastling, pawnPromotion } from '../gameActions';
import FunctionsFront from '../utils/frontUtils';
import { pieceToSymbol } from '../app';

describe('Chess Game Actions', () => {
  let board: Board;

  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handleCastling', () => {
    it('should perform kingside castling correctly', () => {
      // Setup
      const king: Piece = { 
        type: 'king', 
        color: 'white', 
        position: { row: 7, col: 4 }, 
        hasMoved: false 
      };
      const rook: Piece = { 
        type: 'rook', 
        color: 'white', 
        position: { row: 7, col: 7 }, 
        hasMoved: false 
      };
      
      board[7][4] = king;
      board[7][7] = rook;

      // Execute
      handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board);

      // Assert
      expect(board[7][5]).toBe(rook); // Rook moved to f1
      expect(board[7][7]).toBeNull(); // Original rook position empty
      expect(rook.position).toEqual({ row: 7, col: 5 }); // Rook position updated
      expect(rook.hasMoved).toBe(true); // Rook marked as moved
    });

    it('should perform queenside castling correctly', () => {
      // Setup
      const king: Piece = { 
        type: 'king', 
        color: 'white', 
        position: { row: 7, col: 4 }, 
        hasMoved: false 
      };
      const rook: Piece = { 
        type: 'rook', 
        color: 'white', 
        position: { row: 7, col: 0 }, 
        hasMoved: false 
      };
      
      board[7][4] = king;
      board[7][0] = rook;

      // Execute
      handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 2 }, board);

      // Assert
      expect(board[7][3]).toBe(rook); // Rook moved to d1
      expect(board[7][0]).toBeNull(); // Original rook position empty
      expect(rook.position).toEqual({ row: 7, col: 3 }); // Rook position updated
      expect(rook.hasMoved).toBe(true); // Rook marked as moved
    });

    it('should not allow castling if king has moved', () => {
      const king: Piece = { 
        type: 'king', 
        color: 'white', 
        position: { row: 7, col: 4 }, 
        hasMoved: true 
      };
      const rook: Piece = { 
        type: 'rook', 
        color: 'white', 
        position: { row: 7, col: 7 }, 
        hasMoved: false 
      };
      
      board[7][4] = king;
      board[7][7] = rook;

      expect(() => 
        handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board)
      ).toThrow('Invalid castling: King has already moved');
    });

    it('should not allow castling if there are pieces between king and rook', () => {
      const king: Piece = { 
        type: 'king', 
        color: 'white', 
        position: { row: 7, col: 4 }, 
        hasMoved: false 
      };
      const rook: Piece = { 
        type: 'rook', 
        color: 'white', 
        position: { row: 7, col: 7 }, 
        hasMoved: false 
      };
      const blockingPiece: Piece = {
        type: 'knight',
        color: 'white',
        position: { row: 7, col: 6 }
      };
      
      board[7][4] = king;
      board[7][7] = rook;
      board[7][6] = blockingPiece;

      expect(() => 
        handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board)
      ).toThrow('Invalid castling: Pieces between king and rook');
    });
  });

  describe('pawnPromotion', () => {
    it('should promote white pawn when reaching last rank', async () => {
      // Setup
      const pawn: Piece = {
        type: 'pawn',
        color: 'white',
        position: { row: 1, col: 0 }
      };
      
      const mockDialog = vi.fn().mockResolvedValue({ type: 'queen', color: 'white' });
      vi.spyOn(FunctionsFront.prototype, 'showPromotionDialog').mockImplementation(mockDialog);
      
      // Mock DOM elements
      document.body.innerHTML = `
        <div id="0-0">
          <span class="piece">♙</span>
        </div>
      `;

      // Execute
      await pawnPromotion(pawn, { row: 0, col: 0 }, pieceToSymbol);

      // Assert
      expect(pawn.type).toBe('queen');
      expect(document.querySelector('.piece')?.textContent).toBe('♕');
    });
  });
});