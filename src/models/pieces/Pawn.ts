import { Piece } from './Piece';
import { Position, Board, EnPassantTarget } from '../types';
import FunctionsFront from '../../utils/frontUtils';
import { pieceToSymbol } from '../../app';
import { PieceFactory } from '../PieceFactory';

export class Pawn extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('pawn', color, position);
  }

  protected isValidPattern(from: Position, to: Position, board: Board, enPassantTarget?: EnPassantTarget): boolean {
    const direction = this.color === "white" ? -1 : 1;
    const startRow = this.color === "white" ? 6 : 1;

    // Movimento para frente
    if (from.col === to.col && board[to.row][to.col] === null) {
      if (to.row === from.row + direction) return true;

      if (from.row === startRow && 
          to.row === from.row + 2 * direction && 
          board[from.row + direction][to.col] === null) {
        return true;
      }
    }

    // Captura diagonal (incluindo en passant)
    if (Math.abs(from.col - to.col) === 1 && to.row === from.row + direction) {
      const targetPiece = board[to.row][to.col];
      if (targetPiece && targetPiece.color !== this.color) return true;

      if (enPassantTarget &&
          to.row === enPassantTarget.row &&
          to.col === enPassantTarget.col) {
        return true;
      }
    }

    return false;
  }

  isValidMove(from: Position, to: Position, board: Board, enPassantTarget?: EnPassantTarget): boolean {
    return this.isValidPattern(from, to, board, enPassantTarget) && this.isMoveSafe(from, to, board);
  }

  async promote(position: Position, board: Board, pieceToSymbol: (piece: Piece) => string): Promise<void> {
    if (position.row === 0 || position.row === 7) {
      const frontFunctions = new FunctionsFront();
      const promotedPieceType = await frontFunctions.showPromotionDialog(this.color, position, pieceToSymbol);
      
      // Criar uma nova peça do tipo escolhido
      const newPiece = PieceFactory.createPiece(promotedPieceType.type, this.color, position);
      
      // Substituir o peão no tabuleiro pela nova peça
      board[position.row][position.col] = newPiece;
      
      // Atualizar o visual
      const square = document.getElementById(`${position.row}-${position.col}`);
      const pieceElement = square?.querySelector(".piece");
      if (pieceElement) {
        pieceElement.textContent = pieceToSymbol(newPiece);
      }
    }
  }

  handleEnPassant(to: Position, capturedPawn: Piece | null, board: Board): void {
    if (!capturedPawn) return;
    
    const capturedPawnRow = this.color === "white" ? to.row + 1 : to.row - 1;
    board[capturedPawnRow][to.col] = null;
  }

  getEnPassantTarget(from: Position, to: Position): Position | null {
    if (Math.abs(from.row - to.row) === 2) {
      return { row: (from.row + to.row) / 2, col: to.col };
    }
    return null;
  }

  async move(from: Position, to: Position, board: Board, enPassantTarget: Position | null = null): Promise<boolean> {
    const success = await super.move(from, to, board);
    if (!success) return false;

    const isEnPassantMove = enPassantTarget && to.row === enPassantTarget.row && to.col === enPassantTarget.col;
    if (isEnPassantMove) {
      const capturedPawnRow = this.color === "white" ? to.row + 1 : to.row - 1;
      board[capturedPawnRow][to.col] = null;
    }

    await this.promote(to, board, pieceToSymbol);
    return true;
  }
}
