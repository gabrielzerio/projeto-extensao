import { Piece, Position, Board, EnPassantTarget, PieceType } from './models/types';
import  FunctionsFront  from './utils/frontUtils';

const frontFunctions = new FunctionsFront();

export async function pawnPromotion(piece: Piece, position: Position, pieceToSymbol: (piece: Piece) => string): Promise<void> {
  if (piece.type === "pawn" && (position.row === 0 || position.row === 7)) {
    const promotedPiece = await frontFunctions.showPromotionDialog(piece.color, position, pieceToSymbol);
    piece.type = promotedPiece.type as PieceType;
    const square = document.getElementById(`${position.row}-${position.col}`);
    const pieceElement = square?.querySelector(".piece");
    if (pieceElement) {
      pieceElement.textContent = pieceToSymbol(piece);
    }
  }
}

export function handleEnPassant(
  piece: Piece, 
  to: Position, 
  capturedPawn: Piece | null, 
  board: Board,
  pieces: Piece[],
  removePiece: (piece: Piece) => void
): void {
  if (!capturedPawn) return;
  
  const capturedPawnRow = piece.color === "white" ? to.row + 1 : to.row - 1;
  board[capturedPawnRow][to.col] = null;
  removePiece(capturedPawn);
  const index = pieces.indexOf(capturedPawn);
  if (index > -1) pieces.splice(index, 1);
}

export function handleCastling(piece: Piece, from: Position, to: Position, board: Board): boolean {
  if (piece.type !== 'king' || Math.abs(from.col - to.col) !== 2) return false;

  const isKingSide = to.col > from.col;
  const rookCol = isKingSide ? 7 : 0;
  const newRookCol = isKingSide ? 5 : 3;
  
  const rook = board[from.row][rookCol];
  if (rook) {
    board[from.row][rookCol] = null;
    board[from.row][newRookCol] = rook;
    rook.position = { row: from.row, col: newRookCol };
    rook.hasMoved = true;
  }
  return true;
}

export function updateEnPassantTarget(piece: Piece, from: Position, to: Position): EnPassantTarget | null {
  if (piece.type === "pawn" && Math.abs(from.row - to.row) === 2) {
    return { row: (from.row + to.row) / 2, col: to.col };
  }
  return null;
}

export function revertMove(
  piece: Piece, 
  from: Position, 
  to: Position, 
  originalPiece: Piece | null, 
  originalPosition: Position,
  capturedPawn: Piece | null,
  board: Board
): void {
  board[from.row][from.col] = piece;
  board[to.row][to.col] = originalPiece;
  piece.position = originalPosition;
  
  if (capturedPawn) {
    const capturedPawnRow = piece.color === "white" ? to.row + 1 : to.row - 1;
    board[capturedPawnRow][to.col] = capturedPawn;
  }
}
