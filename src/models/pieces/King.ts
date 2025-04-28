import { Piece } from './Piece';
import { Position, Board } from '../types';

export class King extends Piece {
  constructor(color: 'white' | 'black', position: Position) {
    super('king', color, position, false);
  }

  isValidMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    // Movimento normal do rei
    if (rowDiff <= 1 && colDiff <= 1) {
      return this.canMoveToPosition(to, board);
    }

    // Roque
    if (!this.hasMoved && rowDiff === 0 && colDiff === 2) {
      const row = from.row;
      const rookCol = to.col > from.col ? 7 : 0;
      const rook = board[row][rookCol];

      if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;

      const step = to.col > from.col ? 1 : -1;
      for (let col = from.col + step; col !== rookCol; col += step) {
        if (board[row][col]) return false;
      }

      return true;
    }

    return false;
  }

  isInCheck(board: Board): boolean {
    return this.isSquareUnderAttack(this.position.row, this.position.col, this.color, board);
  }

  private isSquareUnderAttack(row: number, col: number, kingColor: string, board: Board): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color !== kingColor) {
          if (piece.isValidMove({ row: r, col: c }, { row, col }, board)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static isCheckmate(king: King, pieces: Piece[], board: Board): boolean {
    if (!king.isInCheck(board)) {
      return false;
    }

    return !pieces
      .filter(p => p.color === king.color)
      .some(piece => {
        const { row, col } = piece.position;

        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (piece.isValidMove({ row, col }, { row: r, col: c }, board)) {
              const originalPiece = board[r][c];
              const originalPosition = { ...piece.position };

              board[row][col] = null;
              board[r][c] = piece;
              piece.position = { row: r, col: c };

              const stillInCheck = king.isInCheck(board);

              board[row][col] = piece;
              board[r][c] = originalPiece;
              piece.position = originalPosition;

              if (!stillInCheck) {
                return true;
              }
            }
          }
        }
        return false;
      });
  }

  canCastleKingSide(board: Board): boolean {
    if (this.hasMoved) return false;
    const rook = board[this.position.row][7];
    if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;

    return !board[this.position.row][5] && 
           !board[this.position.row][6] &&
           !this.isPathUnderAttack(board, [5, 6]);
  }

  canCastleQueenSide(board: Board): boolean {
    if (this.hasMoved) return false;
    const rook = board[this.position.row][0];
    if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;

    return !board[this.position.row][1] && 
           !board[this.position.row][2] && 
           !board[this.position.row][3] &&
           !this.isPathUnderAttack(board, [2, 3]);
  }

  private isPathUnderAttack(board: Board, cols: number[]): boolean {
    return cols.some(col => 
      this.isSquareUnderAttack(this.position.row, col, this.color, board));
  }

  isUnderAttack(board: Board): boolean {
    return this.isSquareUnderAttack(this.position.row, this.position.col, this.color, board);
  }

  showPossibleMoves(board: Board): Position[] {
    const moves = super.showPossibleMoves(board);

    if (!this.hasMoved) {
      if (this.canCastleKingSide(board)) {
        moves.push({ row: this.position.row, col: this.position.col + 2 });
      }
      if (this.canCastleQueenSide(board)) {
        moves.push({ row: this.position.row, col: this.position.col - 2 });
      }
    }

    return moves;
  }

  handleCastling(from: Position, to: Position, board: Board): void {
    if (Math.abs(from.col - to.col) !== 2) return;

    if (this.hasMoved) {
      throw new Error('Invalid castling: King has already moved');
    }

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
  }

  async move(from: Position, to: Position, board: Board): Promise<boolean> {
    const success = await super.move(from, to, board);
    if (!success) return false;

    try {
      this.handleCastling(from, to, board);
      
      if (this.isInCheck(board)) {
        throw new Error('Movimento inválido: o rei ficaria em xeque.');
      }
      
      return true;
    } catch (error) {
      // Reverte o movimento em caso de erro
      board[from.row][from.col] = this;
      board[to.row][to.col] = null;
      this.position = from;
      this.hasMoved = false;
      throw error;
    }
  }
}
