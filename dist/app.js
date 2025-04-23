// Importações
import FunctionsFront from "./frontUtils.js";
import PcsMvmt from "./pieceMovement.js";
const movimentos = new PcsMvmt();
const frontFunctions = new FunctionsFront();
// Estado do jogo
const board = Array(8).fill(null).map(() => Array(8).fill(null));
const pieces = [
    { type: "rook", color: "black", position: { row: 0, col: 0 }, hasMoved: false },
    { type: "knight", color: "black", position: { row: 0, col: 1 } },
    { type: "bishop", color: "black", position: { row: 0, col: 2 } },
    { type: "queen", color: "black", position: { row: 0, col: 3 } },
    { type: "king", color: "black", position: { row: 0, col: 4 }, hasMoved: false },
    { type: "bishop", color: "black", position: { row: 0, col: 5 } },
    { type: "knight", color: "black", position: { row: 0, col: 6 } },
    { type: "rook", color: "black", position: { row: 0, col: 7 }, hasMoved: false },
    ...Array(8).fill(null).map((_, i) => ({ type: "pawn", color: "black", position: { row: 1, col: i } })),
    ...Array(8).fill(null).map((_, i) => ({ type: "pawn", color: "white", position: { row: 6, col: i } })),
    { type: "rook", color: "white", position: { row: 7, col: 0 }, hasMoved: false },
    { type: "knight", color: "white", position: { row: 7, col: 1 } },
    { type: "bishop", color: "white", position: { row: 7, col: 2 } },
    { type: "queen", color: "white", position: { row: 7, col: 3 } },
    { type: "king", color: "white", position: { row: 7, col: 4 }, hasMoved: false },
    { type: "bishop", color: "white", position: { row: 7, col: 5 } },
    { type: "knight", color: "white", position: { row: 7, col: 6 } },
    { type: "rook", color: "white", position: { row: 7, col: 7 }, hasMoved: false },
];
// Variáveis de estado
let player1Name = ""; // peças brancas
let player2Name = ""; // peças pretas
let selectedPiece = null;
let selectedPosition = null;
let currentColorTurn = "black";
let enPassantTarget = null;
// Funções do jogo
function initializeBoard() {
    board.forEach((row) => row.fill(null));
    pieces.forEach((piece) => {
        const { row, col } = piece.position;
        board[row][col] = piece;
    });
}
function createBoard() {
    const chessBoard = document.getElementById("board");
    if (!chessBoard)
        return;
    chessBoard.innerHTML = "";
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            const spanElement = document.createElement("span");
            spanElement.classList.add("piece");
            square.id = `${row}-${col}`;
            square.classList.add((row + col) % 2 === 0 ? "white-square" : "black-square");
            const piece = board[row][col];
            if (piece) {
                spanElement.textContent = pieceToSymbol(piece);
            }
            square.addEventListener("click", () => handleSquareClick(row, col));
            square.appendChild(spanElement);
            chessBoard.appendChild(square);
        }
    }
}
function pieceToSymbol(piece) {
    const symbols = {
        rook: { white: "♖", black: "♜" },
        knight: { white: "♘", black: "♞" },
        bishop: { white: "♗", black: "♝" },
        queen: { white: "♕", black: "♛" },
        king: { white: "♔", black: "♚" },
        pawn: { white: "♙", black: "♟" },
    };
    return symbols[piece.type][piece.color];
}
async function handleSquareClick(row, col) {
    const piece = board[row][col];
    if (selectedPiece) {
        if (selectedPosition && await movePiece(selectedPiece, selectedPosition, row, col)) {
            toggleTurn();
            selectedPiece = null;
            selectedPosition = null;
            showAlerts();
        }
        else {
            const moveInfo = document.getElementById("move-info");
            if (moveInfo)
                moveInfo.textContent = "Movimento inválido. Tente novamente.";
            bgPieceColoring(false);
            selectedPiece = null;
            selectedPosition = null;
            frontFunctions.removeHighlight();
        }
    }
    else if (piece && piece.color === currentColorTurn) {
        selectedPiece = piece;
        selectedPosition = { row, col };
        const moveInfo = document.getElementById("move-info");
        if (moveInfo)
            moveInfo.textContent = `Peça selecionada: ${pieceToSymbol(piece)} em ${positionToString(row, col).toUpperCase()}`;
        showPossibleMoves(piece, row, col);
        bgPieceColoring(true);
    }
}
async function pawnPromotion(piece, toRow, toCol) {
    if (piece.type === "pawn" && (toRow === 0 || toRow === 7)) {
        const promotedPiece = await frontFunctions.showPromotionDialog(piece.color, toRow, toCol, pieceToSymbol);
        piece.type = promotedPiece.type;
        const square = document.getElementById(`${toRow}-${toCol}`);
        const pieceElement = square?.querySelector(".piece");
        if (pieceElement) {
            pieceElement.textContent = pieceToSymbol(piece);
        }
    }
}
async function movePiece(piece, from, toRow, toCol) {
    if (movimentos.isValidMove(piece, from, toRow, toCol, board)) {
        await pawnPromotion(piece, toRow, toCol);
        const originalPiece = board[toRow][toCol];
        const originalPosition = { ...piece.position };
        const isEnPassantMove = piece.type === "pawn" && enPassantTarget &&
            toRow === enPassantTarget.row && toCol === enPassantTarget.col;
        let capturedPawn = null;
        if (isEnPassantMove) {
            const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1;
            capturedPawn = board[capturedPawnRow][toCol];
        }
        board[from.row][from.col] = null;
        board[toRow][toCol] = piece;
        piece.position = { row: toRow, col: toCol };
        if (isEnPassantMove && capturedPawn) {
            const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1;
            board[capturedPawnRow][toCol] = null;
            removePiece(capturedPawn);
            const index = pieces.indexOf(capturedPawn);
            if (index > -1)
                pieces.splice(index, 1);
        }
        if (piece.type === 'king' && Math.abs(from.col - toCol) === 2) {
            const isKingSide = toCol > from.col;
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
        piece.hasMoved = true;
        if (movimentos.isKingInCheck(piece.color, board)) {
            board[from.row][from.col] = piece;
            board[toRow][toCol] = originalPiece;
            piece.position = originalPosition;
            if (isEnPassantMove && capturedPawn) {
                const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1;
                board[capturedPawnRow][toCol] = capturedPawn;
            }
            const moveInfo = document.getElementById('move-info');
            if (moveInfo)
                moveInfo.textContent = 'Movimento inválido: o rei ficaria em xeque.';
            return false;
        }
        if (piece.type === "pawn" && Math.abs(from.row - toRow) === 2) {
            enPassantTarget = { row: (from.row + toRow) / 2, col: toCol };
        }
        else {
            enPassantTarget = null;
        }
        if (originalPiece) {
            removePiece(originalPiece);
            const index = pieces.indexOf(originalPiece);
            if (index > -1)
                pieces.splice(index, 1);
        }
        movePieceAnimation(toRow, toCol, from);
        return true;
    }
    const moveInfo = document.getElementById('move-info');
    if (moveInfo)
        moveInfo.textContent = 'Movimento inválido. Tente novamente.';
    return false;
}
function movePieceAnimation(toRow, toCol, from) {
    const pieceElement = document.getElementById(`${from.row}-${from.col}`)?.querySelector(".piece");
    if (!pieceElement)
        return;
    const squareSize = 80;
    const deltaX = (toCol - from.col) * squareSize;
    const deltaY = (toRow - from.row) * squareSize;
    pieceElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    setTimeout(() => {
        pieceElement.style.transform = "";
        pieceElement.parentElement.id = `${toRow}-${toCol}`;
        createBoard();
    }, 300);
    const moveInfo = document.getElementById('move-info');
    if (moveInfo)
        moveInfo.textContent = `Peça movida para ${positionToString(toRow, toCol).toUpperCase()}`;
}
function showPossibleMoves(piece, row, col) {
    frontFunctions.removeHighlight();
    if (piece.type === 'king' && !piece.hasMoved) {
        const rookKingSide = board[row][7];
        const rookQueenSide = board[row][0];
        if (rookKingSide && !rookKingSide.hasMoved &&
            !board[row][5] && !board[row][6] &&
            movimentos.isValidKingMove(piece, { row, col }, row, col + 2, board)) {
            const square = document.getElementById(`${row}-${col + 2}`);
            if (square)
                square.classList.add('highlight');
        }
        if (rookQueenSide && !rookQueenSide.hasMoved &&
            !board[row][1] && !board[row][2] && !board[row][3] &&
            movimentos.isValidMove(piece, { row, col }, row, col - 2, board)) {
            const square = document.getElementById(`${row}-${col - 2}`);
            if (square)
                square.classList.add('highlight');
        }
    }
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (movimentos.isValidMove(piece, { row, col }, r, c, board)) {
                const originalPiece = board[r][c];
                const originalPosition = { ...piece.position };
                board[row][col] = null;
                board[r][c] = piece;
                piece.position = { row: r, col: c };
                const kingInCheck = movimentos.isKingInCheck(piece.color, board);
                board[row][col] = piece;
                board[r][c] = originalPiece;
                piece.position = originalPosition;
                if (!kingInCheck) {
                    const square = document.getElementById(`${r}-${c}`);
                    if (square) {
                        square.classList.add(frontFunctions.canCaptureEnemyPiece(board, piece, r, c) ? 'capture-highlight' : 'highlight');
                    }
                }
            }
        }
    }
}
function toggleTurn() {
    currentColorTurn = currentColorTurn === "white" ? "black" : "white";
    const turnInfo = document.getElementById("turn-info");
    if (turnInfo) {
        turnInfo.textContent = `Turno: ${currentColorTurn === "white" ? "Jogador Branco" : "Jogador Preto"}`;
    }
}
function bgPieceColoring(mov) {
    if (!selectedPiece)
        return;
    const pecaSelecionada = document.getElementById(`${selectedPiece.position.row}-${selectedPiece.position.col}`);
    if (!pecaSelecionada)
        return;
    if (mov) {
        pecaSelecionada.style.backgroundColor = "lightyellow";
        return;
    }
    if (pecaSelecionada.className === "white-square") {
        pecaSelecionada.style.backgroundColor = "#f0d9b5";
    }
    else {
        pecaSelecionada.style.backgroundColor = "#b58863";
    }
}
function removePiece(target) {
    const div = document.getElementById(`${target.color}-pieces`);
    if (!div)
        return;
    const span = document.createElement("span");
    span.innerHTML = pieceToSymbol(target);
    div.appendChild(span);
}
function positionToString(row, col) {
    const letters = "abcdefgh";
    return `${letters[col]}${8 - row}`;
}
function showAlerts() {
    if (movimentos.isKingInCheck(currentColorTurn, board)) {
        if (movimentos.isCheckmate(currentColorTurn, board, pieces)) {
            frontFunctions.showEndGame(player1Name, player2Name, currentColorTurn);
        }
        else {
            alert(`${currentColorTurn === "white" ? "Rei branco" : "Rei preto"} está em xeque!`);
        }
    }
}
// Inicialização do jogo
initializeBoard();
createBoard();
toggleTurn();
// Event listeners
window.onload = async () => {
    console.log("Full URL:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL Search Params:", window.location.search);
    const mode = urlParams.get('mode');
    console.log("Mode parameter:", mode);
    if (mode === 'default') {
        frontFunctions.showPlayersName(player1Name, player2Name);
    }
    else if (mode === 'tutorial') {
        const opcao = await frontFunctions.showTutorial();
        console.log(opcao);
    }
    else {
        console.log("No valid mode parameter found");
    }
};
//# sourceMappingURL=app.js.map