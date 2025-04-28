import { Piece } from '../models/pieces/Piece';
import { Board, Position } from '../models/types';
import { PieceFactory } from '../models/PieceFactory';

export async function promotePawn(
  pawn: Piece,
  position: Position,
  board: Board,
  showPromotionDialog?: (color: string, position: Position) => Promise<{ type: string }>
): Promise<void> {
  if ((position.row === 0 || position.row === 7) && typeof showPromotionDialog === 'function') {
    const promotedPiece = await showPromotionDialog(pawn.color, position);
    if (!promotedPiece || typeof promotedPiece.type !== 'string') {
      throw new Error('Promoção inválida: tipo de peça não definido.');
    }
    const newPiece = PieceFactory.createPiece(promotedPiece.type, pawn.color, position);
    board[position.row][position.col] = newPiece;
  }
}
