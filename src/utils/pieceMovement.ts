import { Piece, Position, Board, PieceType } from '../models/types';

class PcsMvmt {
  constructor() {
    // não utilizado por enquanto
  }
  isValidMove(piece: Piece, from: Position, toRow: number, toCol: number, board: Board, enPassantTarget?: Position | null): boolean {
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;

    let isValid = false;
    switch (piece.type) {
      case 'pawn':
        isValid = this.isValidPawnMove(piece, from, toRow, toCol, board, enPassantTarget);
        break;
      case 'rook':
        isValid = this.isValidRookMove(from, toRow, toCol, board);
        break;
      case 'knight':
        isValid = this.isValidKnightMove(from, toRow, toCol, board);
        break;
      case 'bishop':
        isValid = this.isValidBishopMove(from, toRow, toCol, board);
        break;
      case 'queen':
        isValid = this.isValidQueenMove(from, toRow, toCol, board);
        break;
      case 'king':
        isValid = this.isValidKingMove(piece, from, toRow, toCol, board);
        break;
    }

    if (isValid) {
      const originalPiece = board[toRow][toCol];
      const originalPosition = { ...piece.position };
      
      board[from.row][from.col] = null;
      board[toRow][toCol] = piece;
      piece.position = { row: toRow, col: toCol };

      const inCheck = this.isKingInCheck(piece.color, board);

      board[from.row][from.col] = piece;
      board[toRow][toCol] = originalPiece;
      piece.position = originalPosition;

      return !inCheck;
    }

    return false;
  }

  isValidPawnMove(piece: Piece, from: Position, toRow: number, toCol: number, board: Board, enPassantTarget?: Position | null): boolean {
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    if (from.col === toCol && board[toRow][toCol] === null) {
      if (toRow === from.row + direction) return true;

      if (
        from.row === startRow &&
        toRow === from.row + 2 * direction &&
        board[from.row + direction][toCol] === null
      ) {
        return true;
      }
    }

    if (Math.abs(from.col - toCol) === 1 && toRow === from.row + direction) {
      if (board[toRow][toCol] && board[toRow][toCol]!.color !== piece.color) {
        return true;
      }

      if (
        enPassantTarget &&
        toRow === enPassantTarget.row &&
        toCol === enPassantTarget.col
      ) {
        return true;
      }
    }

    return false;
  }

  isValidRookMove(from: Position, toRow: number, toCol: number, board: Board): boolean {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    return (rowDiff === 0 || colDiff === 0) && !this.isPathBlocked(from, toRow, toCol, board);
  }

  isValidBishopMove(from: Position, toRow: number, toCol: number, board: Board): boolean {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    return rowDiff === colDiff && !this.isPathBlocked(from, toRow, toCol, board);
  }

  isValidQueenMove(from: Position, toRow: number, toCol: number, board: Board): boolean {
    return this.isValidRookMove(from, toRow, toCol, board) || 
           this.isValidBishopMove(from, toRow, toCol, board);
  }

  isValidKnightMove(from: Position, toRow: number, toCol: number, board: Board): boolean {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    
    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
      const sourcePiece = board[from.row][from.col];
      if (!sourcePiece) return false;
      
      if (board[toRow][toCol] === null || board[toRow][toCol]?.color !== sourcePiece.color) {
        return true;
      }
    }
    return false;
  }

  isValidKingMove(piece: Piece, from: Position, toRow: number, toCol: number, board: Board): boolean {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);

    if (rowDiff <= 1 && colDiff <= 1) {
      return true;
    }

    if (rowDiff === 0 && Math.abs(colDiff) === 2) {
      if (from.row !== (piece.color === 'white' ? 7 : 0)) return false;
      if (from.col !== 4) return false;
      
      if (piece.hasMoved) return false;

      if (toCol === from.col + 2) {
        const rook = board[from.row][7];
        if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;
        
        if (board[from.row][5] || board[from.row][6]) return false;
        
        if (this.isSquareUnderAttack(from.row, 5, piece.color, board) ||
            this.isSquareUnderAttack(from.row, 6, piece.color, board)) {
          return false;
        }
        
        return true;
      }

      if (toCol === from.col - 2) {
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
              if (this.isValidRookMove({row: r, col: c}, row, col, board)) {
                return true;
              }
              break;
            case 'knight':
              if (this.isValidKnightMove({row: r, col: c}, row, col, board)) {
                return true;
              }
              break;
            case 'bishop':
              if (this.isValidBishopMove({row: r, col: c}, row, col, board)) {
                return true;
              }
              break;
            case 'queen':
              if (this.isValidQueenMove({row: r, col: c}, row, col, board)) {
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

  isPathBlocked(from: Position, toRow: number, toCol: number, board: Board): boolean {
    const rowStep = Math.sign(toRow - from.row);
    const colStep = Math.sign(toCol - from.col);

    let row = from.row + rowStep;
    let col = from.col + colStep;

    while (row !== toRow || col !== toCol) {
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
          if (this.isValidMove(piece, { row, col }, r, c, board)) {
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