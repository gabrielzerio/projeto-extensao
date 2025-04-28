import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PieceFactory } from '../models/PieceFactory';
import { Board } from '../models/types';
import { handleCastling, pawnPromotion } from '../gameActions';

describe('Game Actions Tests', () => {
  let board: Board;

  beforeEach(() => {
    board = Array(8).fill(null).map(() => Array(8).fill(null));
  });

  describe('Castling Tests', () => {
    it('should perform kingside castling correctly', () => {
      const king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 });
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 7 });
      board[7][4] = king;
      board[7][7] = rook;

      handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board);

      expect(board[7][5]).toBe(rook);
      expect(board[7][7]).toBeNull();
      expect(rook.position).toEqual({ row: 7, col: 5 });
      expect(rook.hasMoved).toBe(true);
    });

    it('should perform queenside castling correctly', () => {
      const king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 });
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 0 });
      board[7][4] = king;
      board[7][0] = rook;

      handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 2 }, board);

      expect(board[7][3]).toBe(rook);
      expect(board[7][0]).toBeNull();
      expect(rook.position).toEqual({ row: 7, col: 3 });
      expect(rook.hasMoved).toBe(true);
    });

    it('should not allow castling if king has moved', () => {
      const king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 });
      king.hasMoved = true;
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 7 });
      board[7][4] = king;
      board[7][7] = rook;

      expect(() =>
        handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board)
      ).toThrow('Invalid castling: King has already moved');
    });

    it('should not allow castling if there are pieces between king and rook', () => {
      const king = PieceFactory.createPiece('king', 'white', { row: 7, col: 4 });
      const rook = PieceFactory.createPiece('rook', 'white', { row: 7, col: 7 });
      const blockingPiece = PieceFactory.createPiece('knight', 'white', { row: 7, col: 6 });
      board[7][4] = king;
      board[7][7] = rook;
      board[7][6] = blockingPiece;

      expect(() =>
        handleCastling(king, { row: 7, col: 4 }, { row: 7, col: 6 }, board)
      ).toThrow('Invalid castling: Pieces between king and rook');
    });
  });

  describe('Pawn Promotion Tests', () => {
    it('should promote white pawn when reaching last rank', async () => {
      const pawn = PieceFactory.createPiece('pawn', 'white', { row: 1, col: 0 });

      const mockDialog = vi.fn().mockResolvedValue({ type: 'queen', color: 'white' });
      vi.spyOn(FunctionsFront.prototype, 'showPromotionDialog').mockImplementation(mockDialog);

      document.body.innerHTML = `
        <div id="0-0">
          <span class="piece">♙</span>
        </div>
      `;

      await pawnPromotion(pawn, { row: 0, col: 0 }, pieceToSymbol);

      expect(pawn.type).toBe('queen');
      expect(document.querySelector('.piece')?.textContent).toBe('♕');
    });
  });
});