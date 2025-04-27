import { Piece, Position, Board, PieceType } from '../models/types';

class PcsMvmt {
  constructor() {
    // não utilizado por enquanto
  }
  isValidMove(piece: Piece, from: Position, to: Position, board: Board, enPassantTarget?: Position | null): boolean {
    const targetPiece = board[to.row][to.col];
    if (targetPiece && targetPiece.color === piece.color) return false;

    let isValid = false;
    switch (piece.type) {
      case 'pawn':
        isValid = this.isValidPawnMove(piece, from, to, board, enPassantTarget);
        break;
      case 'rook':
        isValid = this.isValidRookMove(from, to, board);
        break;
      case 'knight':
        isValid = this.isValidKnightMove(from, to, board);
        break;
      case 'bishop':
        isValid = this.isValidBishopMove(from, to, board);
        break;
      case 'queen':
        isValid = this.isValidQueenMove(from, to, board);
        break;
      case 'king':
        isValid = this.isValidKingMove(piece, from, to, board);
        break;
    }

    if (isValid) {
      const originalPiece = board[to.row][to.col];
      const originalPosition = { ...piece.position };
      
      board[from.row][from.col] = null;
      board[to.row][to.col] = piece;
      piece.position = { row: to.row, col: to.col };

      const inCheck = this.isKingInCheck(piece.color, board);

      board[from.row][from.col] = piece;
      board[to.row][to.col] = originalPiece;
      piece.position = originalPosition;

      return !inCheck;
    }

    return false;
  }

  private isValidPawnMove(piece: Piece, from: Position, to: Position, board: Board, enPassantTarget?: Position | null): boolean {
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    if (from.col === to.col && board[to.row][to.col] === null) {
      if (to.row === from.row + direction) return true;

      if (
        from.row === startRow &&
        to.row === from.row + 2 * direction &&
        board[from.row + direction][to.col] === null
      ) {
        return true;
      }
    }

    if (Math.abs(from.col - to.col) === 1 && to.row === from.row + direction) {
      if (board[to.row][to.col] && board[to.row][to.col]!.color !== piece.color) {
        return true;
      }

      if (
        enPassantTarget &&
        to.row === enPassantTarget.row &&
        to.col === enPassantTarget.col
      ) {
        return true;
      }
    }

    return false;
  }

  isValidRookMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 0 || colDiff === 0) && !this.isPathBlocked(from, to, board);
  }

  isValidBishopMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff === colDiff && !this.isPathBlocked(from, to, board);
  }

  isValidQueenMove(from: Position, to: Position, board: Board): boolean {
    return this.isValidRookMove(from, to, board) || 
           this.isValidBishopMove(from, to, board);
  }

  isValidKnightMove(from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    
    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
      const sourcePiece = board[from.row][from.col];
      if (!sourcePiece) return false;
      
      if (board[to.row][to.col] === null || board[to.row][to.col]?.color !== sourcePiece.color) {
        return true;
      }
    }
    return false;
  }

  isValidKingMove(piece: Piece, from: Position, to: Position, board: Board): boolean {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if (rowDiff <= 1 && colDiff <= 1) {
      return true;
    }

    if (rowDiff === 0 && Math.abs(colDiff) === 2) {
      if (from.row !== (piece.color === 'white' ? 7 : 0)) return false;
      if (from.col !== 4) return false;
      
      if (piece.hasMoved) return false;

      if (to.col === from.col + 2) {
        const rook = board[from.row][7];
        if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
        
        if (board[from.row][5] || board[from.row][6]) return false;
        
        if (this.isSquareUnderAttack(from.row, 5, piece.color, board) ||
            this.isSquareUnderAttack(from.row, 6, piece.color, board)) {
          return false;
        }
        
        return true;
      }

      if (to.col === from.col - 2) {
        const rook = board[from.row][0];
        if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
        
        if (board[from.row][1] || board[from.row][2] || board[from.row][3]) return false;
        
        if (this.isSquareUnderAttack(from.row, 2, piece.color, board) ||
            this.isSquareUnderAttack(from.row, 3, piece.color, board)) {
          return false;
        }
        
        return true;
      }
    }

    return false;
  }

  isSquareUnderAttack(row: number, col: number, kingColor: string, board: Board): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.color !== kingColor) {
          switch (piece.type) {
            case 'pawn': {
              const direction = piece.color === "white" ? -1 : 1;
              if (r + direction === row && (c + 1 === col || c - 1 === col)) {
                return true;
              }
              break;
            }
            case 'rook':
              if (this.isValidRookMove({row: r, col: c}, {row, col}, board)) {
                return true;
              }
              break;
            case 'knight':
              if (this.isValidKnightMove({row: r, col: c}, {row, col}, board)) {
                return true;
              }
              break;
            case 'bishop':
              if (this.isValidBishopMove({row: r, col: c}, {row, col}, board)) {
                return true;
              }
              break;
            case 'queen':
              if (this.isValidQueenMove({row: r, col: c}, {row, col}, board)) {
                return true;
              }
              break;
            case 'king': {
              const rowDiff = Math.abs(r - row);
              const colDiff = Math.abs(c - col);
              if (rowDiff <= 1 && colDiff <= 1) {
                return true;
              }
              break;
            }
          }
        }
      }
    }
    return false;
  }

  isPathBlocked(from: Position, to: Position, board: Board): boolean {
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

  isKingInCheck(color: string, board: Board): boolean {
    let kingRow: number | undefined, kingCol: number | undefined;
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'king' && piece.color === color) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
      if (kingRow !== undefined) break;
    }

    if (kingRow === undefined || kingCol === undefined) return false;
    return this.isSquareUnderAttack(kingRow, kingCol, color, board);
  }

  isCheckmate(color: string, board: Board, pieces: Piece[]): boolean {
    if (!this.isKingInCheck(color, board)) {
      return false;
    }

    for (const piece of pieces.filter(p => p.color === color)) {
      const { row, col } = piece.position;

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (this.isValidMove(piece, { row, col }, { row: r, col: c }, board)) {
            const originalPiece = board[r][c];
            const originalPosition = { ...piece.position };

            board[row][col] = null;
            board[r][c] = piece;
            piece.position = { row: r, col: c };

            const stillInCheck = this.isKingInCheck(color, board);

            board[row][col] = piece;
            board[r][c] = originalPiece;
            piece.position = originalPosition;

            if (!stillInCheck) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}

export default PcsMvmt;