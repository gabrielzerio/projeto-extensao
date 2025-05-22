import { PieceType, PieceColor, Position, Board, EnPassantTarget } from "./models/types";
import { PieceFactory } from './models/PieceFactory';
import { Piece } from "./models/pieces/Piece";
import { King } from "./models/pieces/King";
import { Pawn } from "./models/pieces/Pawn";

// Importações
import FunctionsFront from "./utils/frontUtils.js";
import FunctionsTutorial from "./tutorial.js";
import TutorialUtils from './utils/tutorialmsgUtils';
import { mostrarPopup } from './popUp/popupUtils';


const frontFunctions = new FunctionsFront();

//Constantes para tutorial
const tutorialFunctions = new FunctionsTutorial;
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

// Estado do jogo
const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

const pieces: Piece[] = [
  // Peças pretas
  PieceFactory.createPiece('rook', 'black', { row: 0, col: 0 }),
  PieceFactory.createPiece('knight', 'black', { row: 0, col: 1 }),
  PieceFactory.createPiece('bishop', 'black', { row: 0, col: 2 }),
  PieceFactory.createPiece('queen', 'black', { row: 0, col: 3 }),
  PieceFactory.createPiece('king', 'black', { row: 0, col: 4 }),
  PieceFactory.createPiece('bishop', 'black', { row: 0, col: 5 }),
  PieceFactory.createPiece('knight', 'black', { row: 0, col: 6 }),
  PieceFactory.createPiece('rook', 'black', { row: 0, col: 7 }),
  ...Array(8).fill(null).map((_, i) => PieceFactory.createPiece('pawn', 'black', { row: 1, col: i })),
  ...Array(8).fill(null).map((_, i) => PieceFactory.createPiece('pawn', 'white', { row: 6, col: i })),
  PieceFactory.createPiece('rook', 'white', { row: 7, col: 0 }),
  PieceFactory.createPiece('knight', 'white', { row: 7, col: 1 }),
  PieceFactory.createPiece('bishop', 'white', { row: 7, col: 2 }),
  PieceFactory.createPiece('queen', 'white', { row: 7, col: 3 }),
  PieceFactory.createPiece('king', 'white', { row: 7, col: 4 }),
  PieceFactory.createPiece('bishop', 'white', { row: 7, col: 5 }),
  PieceFactory.createPiece('knight', 'white', { row: 7, col: 6 }),
  PieceFactory.createPiece('rook', 'white', { row: 7, col: 7 }),
];

// Variáveis de estado
let player1Name = ""; // peças brancas
let player2Name = ""; // peças pretas
let selectedPiece: Piece | null = null;
let selectedPosition: Position | null = null;
let currentColorTurn: PieceColor = "black";
let enPassantTarget: EnPassantTarget | null = null;
let posicoesProibidas: Position[] = []; // posições que não podem ser ocupadas por peças em tutorial
let tipoPermitido: PieceType | null = null; // tipo de peça permitido em tutorial
let opcao: string = "";

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
  return symbols[piece.type as PieceType][piece.color as PieceColor];
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
        if (tipoPermitido && piece.type !== tipoPermitido) {
      const moveInfo = document.getElementById("move-info");
      if (moveInfo) moveInfo.textContent = `Só é permitido mover a peça: ${opcao.toUpperCase()}!`;
      return;
    }
    selectedPiece = piece;
    selectedPosition = { row, col };
    const moveInfo = document.getElementById("move-info");
    if (moveInfo) moveInfo.textContent = `Peça selecionada: ${pieceToSymbol(piece)} em ${positionToString(row, col).toUpperCase()}`;
    showPossibleMoves(piece, row, col);
    bgPieceColoring(true);
  }
}

async function movePiece(piece: Piece, from: Position, to: Position): Promise<boolean> {
    if (posicoesProibidas.some(pos => pos.row === to.row && pos.col === to.col)) {
    const moveInfo = document.getElementById('move-info');
    if (moveInfo) moveInfo.textContent = "Movimento proibido para esta casa!";
    return false;
  }
    if (tipoPermitido && piece.type !== tipoPermitido) {
    const moveInfo = document.getElementById('move-info');
    return false;
  }
  try {
    const originalPiece = board[to.row][to.col];
    const context: any = { enPassantTarget };
    if (piece instanceof Pawn) {
      context.showPromotionDialog = async (color: PieceColor, position: Position) => {
        return await frontFunctions.showPromotionDialog(color, position, pieceToSymbol);
      };
    }
    const success = await piece.move(from, to, board, context);

    if (success) {
      if (originalPiece) {
        removePiece(originalPiece);
        const index = pieces.indexOf(originalPiece);
        if (index > -1) pieces.splice(index, 1);
      }
      
      if (piece instanceof Pawn) {
        enPassantTarget = piece.getEnPassantTarget(from, to);
      }
      
      movePieceAnimation(to, from);

  if (mode === 'tutorial') {
    verificarReiCapturado()
  }
      return true;
    }
  } catch (error) {
    const moveInfo = document.getElementById('move-info');
    if (moveInfo) moveInfo.textContent = error instanceof Error ? error.message : "An unknown error occurred.";
  }
  
  return false;
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

  const context: any = { enPassantTarget };
  if (piece instanceof Pawn) {
    context.showPromotionDialog = async (color: PieceColor, position: Position) => {
      return await frontFunctions.showPromotionDialog(color, position, pieceToSymbol);
    };
  }
  const possibleMoves = piece.showPossibleMoves(board, context);
  console.log("Movimentos possíveis:", possibleMoves);

  possibleMoves.forEach(move => {
    const square = document.getElementById(`${move.row}-${move.col}`);
    if (square) {
      const targetPiece = board[move.row][move.col];
      square.classList.add(
        targetPiece && targetPiece.color !== piece.color ? 
        'capture-highlight' : 
        'highlight'
      );
    }
  });
}

function toggleTurn(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  if(mode === 'default'){
    currentColorTurn = currentColorTurn === "white" ? "black" : "white";
    const turnInfo = document.getElementById("turn-info");
    if (turnInfo) {
      turnInfo.textContent = `Turno: ${currentColorTurn === "white" ? "Jogador Branco" : "Jogador Preto"}`;
    }
  }else if(mode === 'tutorial'){
    currentColorTurn = "white";
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
  const currentKing = pieces.find(p => p.type === 'king' && p.color === currentColorTurn) as King;
  if (currentKing?.isInCheck(board)) {
    if (King.isCheckmate(currentKing, pieces, board)) {
      frontFunctions.showEndGame(player1Name, player2Name, currentColorTurn);
    } else {
      alert(`${currentColorTurn === "white" ? "Rei branco" : "Rei preto"} está em xeque!`);
    }
  }
}
//apenas para tutorial
function verificarReiCapturado(): void {
  // Procura o rei preto em todas as casas do tabuleiro
  let reiPreto: King | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece instanceof King && piece.color === "black") {
        reiPreto = piece;
        break;
      }
    }
    if (reiPreto) break;
  }
  if (!reiPreto) {
    alert("Rei preto capturado! Você venceu!");
  }
  console.log(board);
}
toggleTurn();

window.onload = async () => {
  createBoard();

    if(mode==='default'){
      frontFunctions.showPlayersName(player1Name, player2Name);
      initializeBoard();
      createBoard();
    }
    else if(mode === 'tutorial'){
      
      opcao = await frontFunctions.showTutorial();
      const tutorialUtils = new TutorialUtils();
      const mensagem = tutorialUtils.mensagemTutorial(opcao); 
      tipoPermitido = opcao as PieceType;
      mostrarPopup(mensagem);
       if(opcao === 'pawn'){  
        posicoesProibidas = [
              {row: 1, col: 4},
            ];
          tutorialFunctions.tutorialPawn({row: 1, col: 4}, {row: 6, col: 3}, {row: 1, col: 2},{row: 7, col: 3}, board);
          console.log(board);          
       }
       if(opcao === 'bishop'){
          tutorialFunctions.tutorialBishop({row: 1, col: 6}, {row: 6, col: 4}, {row: 7, col: 4},
            {row: 0, col: 5}, //p1
            {row: 1, col: 4}, //p2
            {row: 2, col: 3}, //p3
            {row: 0, col: 6}, //p4
            {row: 1, col: 7}, //p5
            {row: 1, col: 6}, //p6  
            {row: 2, col: 5}, //p7
             board); 
       }
        if(opcao === 'rook'){
            tutorialFunctions.tutorialRook({row: 0, col: 4}, {row: 4, col: 4}, {row: 7, col: 4}, 
              {row: 4, col: 0}, //p1
              {row: 4, col: 7}, //p2
              board); 
        }
        if(opcao === 'knight'){
            tutorialFunctions.tutorialKnight({row: 5, col: 2}, {row: 3, col: 3},{row: 0, col: 4},
            {row: 1, col: 5}, //p1
            {row: 5, col: 3}, //p2
            {row: 1, col: 3}, //p3
            {row: 4, col: 3}, //p4
            {row: 1, col: 4}, //p5
            {row: 4, col: 4}, //p6
              board); 

        }
        if(opcao === 'queen'){
            tutorialFunctions.tutorialQueen({row: 1, col: 6}, {row: 6, col: 4}, {row: 7, col: 4}, 
              
              board); 
        }
        if(opcao === 'king'){
            tutorialFunctions.tutorialKing({row: 1, col: 6}, {row: 6, col: 4}, {row: 7, col: 4}, board); 
        }
       createBoard();
    }
};