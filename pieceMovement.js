class PcsMvmt {
  constructor() {
    // nao utilizado por enquanto
  }

  isValidPawnMove(piece, from, toRow, toCol, board, enPassantTarget) {
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    // Movimento normal para frente
    if (from.col === toCol && board[toRow][toCol] === null) {
      // Movimento simples
      if (toRow === from.row + direction) return true;

      // Movimento duplo da posição inicial
      if (
        from.row === startRow &&
        toRow === from.row + 2 * direction &&
        board[from.row + direction][toCol] === null
      ) {
        return true;
      }
    }

    // Captura diagonal (incluindo en passant)
    if (Math.abs(from.col - toCol) === 1 && toRow === from.row + direction) {
      // Captura normal
      if (board[toRow][toCol] && board[toRow][toCol].color !== piece.color) {
        return true;
      }

      // En passant
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

  isValidRookMove(from, toRow, toCol, board) {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    return (rowDiff === 0 || colDiff === 0) && !this.isPathBlocked(from, toRow, toCol, board);
  }

  isValidBishopMove(from, toRow, toCol, board) {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    return rowDiff === colDiff && !this.isPathBlocked(from, toRow, toCol, board);
  }

  isValidQueenMove(from, toRow, toCol, board) {
    return this.isValidRookMove(from, toRow, toCol, board) || this.isValidBishopMove(from, toRow, toCol, board);
  }

  isValidKnightMove(from, toRow, toCol, board) {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    
    if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
      // Verifica se a casa de destino não está ocupada por uma peça da mesma cor
      if (board[toRow][toCol] === null || board[toRow][toCol].color !== board[from.row][from.col].color) {
        return true;
      }
    }
  
    return false;
  }
  

  isValidKingMove(from, toRow, toCol) {
    const rowDiff = Math.abs(from.row - toRow);
    const colDiff = Math.abs(from.col - toCol);
    return rowDiff <= 1 && colDiff <= 1;
  }

  isPathBlocked(from, toRow, toCol, board) {
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
}

// Exportando a classe
export default PcsMvmt;
