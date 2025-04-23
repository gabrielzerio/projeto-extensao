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
    }
    tutorialKnight(type, blackPositions, whitePositions, whitePawns, pieces, board) {
        if (Array.isArray(whitePositions)) {
            whitePositions.forEach(pos => {
                const whiteKnight = pieces.find(p => p.type === type && p.color === 'white');
                if (whiteKnight) {
                    board[pos.row][pos.col] = { ...whiteKnight }; // Clona a peça
                }
            });
        }
        // Coloca peões brancos nas posições dadas
        if (Array.isArray(whitePawns)) {
            whitePawns.forEach(pos => {
                const whitePawn = pieces.find(p => p.type === 'pawn' && p.color === 'white');
                if (whitePawn) {
                    board[pos.row][pos.col] = { ...whitePawn }; // Clona a peça
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
    }
}
export default FunctionsTutorial;
//# sourceMappingURL=tutorial.js.map