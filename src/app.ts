import { Piece, PieceType, PieceColor, Position, Board, EnPassantTarget } from "./models/types";
import { handleCastling, pawnPromotion, handleEnPassant, updateEnPassantTarget, revertMove } from "./gameActions";

// Importações
import FunctionsFront from "./utils/frontUtils.js";
import PcsMvmt from "./utils/pieceMovement.js";
import FunctionsTutorial from "./tutorial.js";

const movimentos = new PcsMvmt();
const frontFunctions = new FunctionsFront();
const tutorialFunctions = new FunctionsTutorial;
// Estado do jogo
const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

const pieces: Piece[] = [
  { type: "rook", color: "black", position: { row: 0, col: 0 }, hasMoved: false },
  { type: "knight", color: "black", position: { row: 0, col: 1 } },
  { type: "bishop", color: "black", position: { row: 0, col: 2 } },
  { type: "queen", color: "black", position: { row: 0, col: 3 } },
  { type: "king", color: "black", position: { row: 0, col: 4 }, hasMoved: false },
  { type: "bishop", color: "black", position: { row: 0, col: 5 } },
  { type: "knight", color: "black", position: { row: 0, col: 6 } },
  { type: "rook", color: "black", position: { row: 0, col: 7 }, hasMoved: false },
  ...Array(8).fill(null).map((_, i) => ({ type: "pawn" as const, color: "black" as const, position: { row: 1, col: i } })),
  ...Array(8).fill(null).map((_, i) => ({ type: "pawn" as const, color: "white" as const, position: { row: 6, col: i } })),
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
let selectedPiece: Piece | null = null;
let selectedPosition: Position | null = null;
let currentColorTurn: PieceColor = "black";
let enPassantTarget: EnPassantTarget | null = null;

// Funções do jogo
function initializeBoard(): void {
  board.forEach((row) => row.fill(null));
  pieces.forEach((piece) => {
    const { row, col } = piece.position;
    board[row][col] = piece;
  });
}

function createBoard(): void {
  const chessBoard = document.getElementById("board");
  if (!chessBoard) return;
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

export function pieceToSymbol(piece: Piece): string {
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

async function handleSquareClick(row: number, col: number): Promise<void> {
  const piece = board[row][col];
  const to: Position = { row, col };
  if (selectedPiece) {
    if (selectedPosition && await movePiece(selectedPiece, selectedPosition, to)) {
      toggleTurn();
      selectedPiece = null;
      selectedPosition = null;
      showAlerts();
    } else {
      const moveInfo = document.getElementById("move-info");
      if (moveInfo) moveInfo.textContent = "Movimento inválido. Tente novamente.";
      bgPieceColoring(false);
      selectedPiece = null;
      selectedPosition = null;
      frontFunctions.removeHighlight();
    }
  } else if (piece && piece.color === currentColorTurn) {
    selectedPiece = piece;
    selectedPosition = { row, col };
    const moveInfo = document.getElementById("move-info");
    if (moveInfo) moveInfo.textContent = `Peça selecionada: ${pieceToSymbol(piece)} em ${positionToString(row, col).toUpperCase()}`;
    showPossibleMoves(piece, row, col);
    bgPieceColoring(true);
  }
}

async function movePiece(piece: Piece, from: Position, to: Position): Promise<boolean> {
  if (!movimentos.isValidMove(piece, from, to, board, enPassantTarget)) {
    const moveInfo = document.getElementById('move-info');
    if (moveInfo) moveInfo.textContent = 'Movimento inválido. Tente novamente.';
    return false;
  }

  await pawnPromotion(piece, to, pieceToSymbol);
  const originalPiece = board[to.row][to.col];
  const originalPosition = { ...piece.position };
  
  const isEnPassantMove = piece.type === "pawn" && enPassantTarget && to.row === enPassantTarget.row && to.col === enPassantTarget.col;
  
  let capturedPawn: Piece | null = null;
  if (isEnPassantMove) {
    const capturedPawnRow = piece.color === "white" ? to.row + 1 : to.row - 1;
    capturedPawn = board[capturedPawnRow][to.col];
  }

  board[from.row][from.col] = null;
  board[to.row][to.col] = piece;
  piece.position = { row: to.row, col: to.col };

  try {
    if (isEnPassantMove) {
      handleEnPassant(piece, to, capturedPawn, board, pieces, removePiece);
    }

    handleCastling(piece, from, to, board);
    piece.hasMoved = true;

    if (movimentos.isKingInCheck(piece.color, board)) {
      revertMove(piece, from, to, originalPiece, originalPosition, capturedPawn, board);
      const moveInfo = document.getElementById('move-info');
      if (moveInfo) moveInfo.textContent = 'Movimento inválido: o rei ficaria em xeque.';
      return false;
    }

    enPassantTarget = updateEnPassantTarget(piece, from, to);
  } catch (error) {
    revertMove(piece, from, to, originalPiece, originalPosition, capturedPawn, board);
    const moveInfo = document.getElementById('move-info');
    if (moveInfo) moveInfo.textContent = error instanceof Error ? error.message : "An unknown error occurred.";
    return false;
  }

  if (originalPiece) {
    removePiece(originalPiece);
    const index = pieces.indexOf(originalPiece);
    if (index > -1) pieces.splice(index, 1);
  }
  
  movePieceAnimation(to, from);
  return true;
}

function movePieceAnimation(to: Position, from: Position): void {
  const pieceElement = document.getElementById(`${from.row}-${from.col}`)?.querySelector(".piece") as HTMLElement;
  if (!pieceElement) return;

  const squareSize = 80;
  const deltaX = (to.col - from.col) * squareSize;
  const deltaY = (to.row - from.row) * squareSize;

  pieceElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  setTimeout(() => {
    pieceElement.style.transform = "";
    pieceElement.parentElement!.id = `${to.row}-${to.col}`;
    createBoard();
  }, 300);

  const moveInfo = document.getElementById('move-info');
  if (moveInfo) moveInfo.textContent = `Peça movida para ${positionToString(to.row, to.col).toUpperCase()}`;
}

function showPossibleMoves(piece: Piece, row: number, col: number): void {
  frontFunctions.removeHighlight();

  if (piece.type === 'king' && !piece.hasMoved) {
    const rookKingSide = board[row][7];
    const rookQueenSide = board[row][0];
    const position = { row, col };

    if (rookKingSide && !rookKingSide.hasMoved && 
        !board[row][5] && !board[row][6] && movimentos.isValidKingMove(piece, position, { row, col: col + 2 }, board)) {
      const square = document.getElementById(`${row}-${col + 2}`);
      if (square) square.classList.add('highlight');
    }

    if (rookQueenSide && !rookQueenSide.hasMoved && 
        !board[row][1] && !board[row][2] && !board[row][3] && 
        movimentos.isValidMove(piece, position, {row, col:col - 2}, board, enPassantTarget)) {
      const square = document.getElementById(`${row}-${col - 2}`);
      if (square) square.classList.add('highlight');
    }
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const to: Position = { row: r, col: c };
      if (movimentos.isValidMove(piece, { row, col }, to, board, enPassantTarget)) {
        const originalPiece = board[r][c];
        const originalPosition = { ...piece.position };

        board[row][col] = null;
        board[r][c] = piece;
        piece.position = to;
        
        const kingInCheck = movimentos.isKingInCheck(piece.color, board);

        board[row][col] = piece;
        board[r][c] = originalPiece;
        piece.position = originalPosition;

        if (!kingInCheck) {
          const square = document.getElementById(`${r}-${c}`);
          if (square) {
            const to:Position = { row: r, col: c };
            square.classList.add(
              frontFunctions.canCaptureEnemyPiece(board, piece, to) ? 'capture-highlight' : 'highlight'
            );
          }
        }
      }
    }
  }
}

function toggleTurn(): void {
  currentColorTurn = currentColorTurn === "white" ? "black" : "white";
  const turnInfo = document.getElementById("turn-info");
  if (turnInfo) {
    turnInfo.textContent = `Turno: ${currentColorTurn === "white" ? "Jogador Branco" : "Jogador Preto"}`;
  }
}

function bgPieceColoring(mov: boolean): void {
  if (!selectedPiece) return;
  
  const pecaSelecionada = document.getElementById(
    `${selectedPiece.position.row}-${selectedPiece.position.col}`
  );
  if (!pecaSelecionada) return;

  if (mov) {
    pecaSelecionada.style.backgroundColor = "lightyellow";
    return;
  }
  
  if (pecaSelecionada.className === "white-square") {
    pecaSelecionada.style.backgroundColor = "#f0d9b5";
  } else {
    pecaSelecionada.style.backgroundColor = "#b58863";
  }
}

function removePiece(target: Piece): void {
  const div = document.getElementById(`${target.color}-pieces`);
  if (!div) return;
  
  const span = document.createElement("span");
  span.innerHTML = pieceToSymbol(target);
  div.appendChild(span);
}

function positionToString(row: number, col: number): string {
  const letters = "abcdefgh";
  return `${letters[col]}${8 - row}`;
}

function showAlerts(): void {
  if (movimentos.isKingInCheck(currentColorTurn, board)) {
    if (movimentos.isCheckmate(currentColorTurn, board, pieces)) {
      frontFunctions.showEndGame(player1Name, player2Name, currentColorTurn);
    } else {
      alert(`${currentColorTurn === "white" ? "Rei branco" : "Rei preto"} está em xeque!`);
    }
  }
}

toggleTurn();

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  let opcao;
    if(mode==='default'){
      frontFunctions.showPlayersName(player1Name, player2Name);
      initializeBoard();
      createBoard();
    }
    else if(mode === 'tutorial'){
       opcao = await frontFunctions.showTutorial(); 
       if(opcao === 'knight'){
          const whitePawnPositions = Array.from({ length: 8 }, (_, col) => ({ row: 6, col}));
          tutorialFunctions.tutorialKnight(opcao, [{row: 1, col: 6},], [{row: 7, col: 1},], whitePawnPositions, pieces, board);
       }
       if(opcao === 'pawn'){
          tutorialFunctions.movePieceTo(opcao, [{row: 1, col: 6},], [{row: 6, col: 4},], pieces, board);           
       }
 
       createBoard();
    }
};