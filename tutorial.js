class FunctionsTutorial {
    movePieceTo(type, blackPositions, whitePositions, pieces, board) {
        // Coloca as peças brancas do tipo especificado nas posições dadas
        if (Array.isArray(whitePositions)) {
            whitePositions.forEach(pos => {
                const whitePiece = pieces.find(p => p.type === type && p.color === 'white');
                if (whitePiece) {
                    board[pos.row][pos.col] = { ...whitePiece }; // Clona a peça
                }
            });
        }
        // Coloca peões pretos nas posições dadas
        if (Array.isArray(blackPositions)) {
            blackPositions.forEach(pos => {
                const blackPawn = pieces.find(p => p.type === 'pawn' && p.color === 'black');
                if (blackPawn) {
                    board[pos.row][pos.col] = { ...blackPawn }; // Clona a peça
                }
            });
        }
        console.log('Tabuleiro atualizado:', board);
    }
}
export default FunctionsTutorial;
