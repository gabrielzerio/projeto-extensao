class FunctionsTutorial {
movePieceTo(type, row, col, pieces, selectedPiece, board) {
    // Esconde todas as outras peças brancas (menos a selecionada)
    for (const piece of pieces) {
        if (piece.color === 'white' && piece !== selectedPiece) {
        const { row: oldRow, col: oldCol } = piece.position;
        if (board[oldRow] && board[oldRow][oldCol] === piece) {
            board[oldRow][oldCol] = null;
        }

        // Coloca fora do tabuleiro
        piece.position.col = 12;
        }
    }

    const piece = pieces.find(p => p.type === type && p.color === 'white');
    if (!piece) return;
  
    const { row: oldRow, col: oldCol } = piece.position;
    if (board[oldRow] && board[oldRow][oldCol] === piece) {
      board[oldRow][oldCol] = null;
    }
  
    piece.position.row = row;
    piece.position.col = col;
  
    board[row][col] = piece;

    }
}
export default FunctionsTutorial;   