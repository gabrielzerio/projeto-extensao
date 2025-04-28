import { Position, Board, PieceType, PieceColor } from '../types';
import { King } from './King';

export abstract class Piece {
  constructor(
    public readonly type: PieceType,
    public readonly color: PieceColor,
    public position: Position,
    public hasMoved: boolean = false
  ) {}

  abstract isValidMove(from: Position, to: Position, board: Board): boolean;
  
  protected isPathBlocked(from: Position, to: Position, board: Board): boolean {
    const rowStep = Math.sign(to.row - from.row);
    const colStep = Math.sign(to.col - from.col);

    let row = from.row + rowStep;
    let col = from.col + colStep;

    while (row !== to.row || col !== to.col) {
      if (board[row][col] !== null) {
        return true;
      }
      row += rowStep;
      col += colStep;
    }
    return false;
  }

  protected canMoveToPosition(to: Position, board: Board): boolean {
    const targetPiece = board[to.row][to.col];
    return !targetPiece || targetPiece.color !== this.color;
  }

  async move(from: Position, to: Position, board: Board): Promise<boolean> {
    if (!this.isValidMove(from, to, board)) return false;

    const originalPiece = board[to.row][to.col];
    const originalPosition = { ...this.position };

    // Faz o movimento temporariamente
    board[from.row][from.col] = null;
    board[to.row][to.col] = this;
    this.position = { row: to.row, col: to.col };

    // Verifica se o rei da mesma cor está em xeque após o movimento
    const king = this.findKing(this.color, board);
    if (king?.isInCheck(board)) {
      // Desfaz o movimento se deixar o rei em xeque
      board[from.row][from.col] = this;
      board[to.row][to.col] = originalPiece;
      this.position = originalPosition;
      return false;
    }

    this.hasMoved = true;
    return true;
  }

  showPossibleMoves(board: Board): Position[] {
    const possibleMoves: Position[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.isValidMove(this.position, { row: r, col: c }, board)) {
          possibleMoves.push({ row: r, col: c });
        }
      }
    }
    return possibleMoves;
  }

  isInCheck(board: Board): boolean {
    const king = this.findKing(this.color, board);
    return king ? king.isUnderAttack(board) : false;
  }

  protected findKing(color: PieceColor, board: Board): King | null {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece?.type === 'king' && piece.color === color) {
          return piece as King;
        }
      }
    }
    return null;
  }

  protected setType(newType: PieceType): void {
    Object.defineProperty(this, 'type', {
      value: newType,
      writable: false,
      configurable: true
    });
  }
}
