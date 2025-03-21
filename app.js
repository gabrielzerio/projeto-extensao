import FunctionsFront from "./frontUtils.js";
import PcsMvmt from "./pieceMovement.js";

const movimentos = new PcsMvmt
const frontFunctions = new FunctionsFront


const board = Array(8)
  .fill(null)
  .map(() => Array(8).fill(null));

const pieces = [
  { type: "rook", color: "black", position: { row: 0, col: 0 } },
  { type: "knight", color: "black", position: { row: 0, col: 1 } },
  { type: "bishop", color: "black", position: { row: 0, col: 2 } },
  { type: "queen", color: "black", position: { row: 0, col: 3 } },
  { type: "king", color: "black", position: { row: 0, col: 4 } },
  { type: "bishop", color: "black", position: { row: 0, col: 5 } },
  { type: "knight", color: "black", position: { row: 0, col: 6 } },
  { type: "rook", color: "black", position: { row: 0, col: 7 } },
  ...Array(8).fill(null).map((_, i) => ({ type: "pawn", color: "black", position: { row: 1, col: i }, })),
  ...Array(8).fill(null).map((_, i) => ({ type: "pawn", color: "white", position: { row: 6, col: i }, })),
  { type: "rook", color: "white", position: { row: 7, col: 0 } },
  { type: "knight", color: "white", position: { row: 7, col: 1 } },
  { type: "bishop", color: "white", position: { row: 7, col: 2 } },
  { type: "queen", color: "white", position: { row: 7, col: 3 } },
  { type: "king", color: "white", position: { row: 7, col: 4 } },
  { type: "bishop", color: "white", position: { row: 7, col: 5 } },
  { type: "knight", color: "white", position: { row: 7, col: 6 } },
  { type: "rook", color: "white", position: { row: 7, col: 7 } },
];

let player1Name = ""; //peças brancas
let player2Name = ""; //peças pretas
let selectedPiece = null;
let selectedPosition = null;
let currentTurn = "black";

function initializeBoard() {
  board.forEach((row) => row.fill(null));
  pieces.forEach((piece) => {
    const { row, col } = piece.position;
    board[row][col] = piece;
  });
}

function createBoard() {
  const chessBoard = document.getElementById("board");
  chessBoard.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      const spanElement = document.createElement("span");
      spanElement.classList.add("piece");
      square.id = `${row}-${col}`;
      square.classList.add(
        (row + col) % 2 === 0 ? "white-square" : "black-square"
      );

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

function handleSquareClick(row, col) {
  const piece = board[row][col];
  if (selectedPiece) {
    if (movePiece(selectedPiece, selectedPosition, row, col)) {
      toggleTurn();//etapa final da movimentacao de peca
      console.log(`${isCheckmate(currentTurn)} e cor atual ${currentTurn}`);
      selectedPiece = null;
      selectedPosition = null;
      showAlerts()
      // Verifica o status de ambos os reis
    } else {
      document.getElementById("move-info").textContent = "Movimento inválido. Tente novamente.";
      bgPieceColoring(false);
      selectedPiece = null;
      selectedPosition = null;
      frontFunctions.removeHighlight();
    }
  } else if (piece && piece.color === currentTurn) {
    selectedPiece = piece;
    selectedPosition = { row, col };
    document.getElementById("move-info").textContent = `Peça selecionada: ${pieceToSymbol(piece)} em ${positionToString(row, col).toUpperCase()}`;
    showPossibleMoves(piece, row, col);
    bgPieceColoring(true);
  }
}

function movePiece(piece, from, toRow, toCol) {
  if (isValidMove(piece, from, toRow, toCol)) {
    const target = board[toRow][toCol];
    const pieceElement = document.getElementById(`${from.row}-${from.col}`).querySelector(".piece");
    console.log(pieceElement);
    if (target) {
      removePiece(target);
      pieces.splice(pieces.indexOf(target), 1);
    }

    board[from.row][from.col] = null;
    board[toRow][toCol] = piece;
    piece.position = { row: toRow, col: toCol };

    const squareSize = 80; // Ajuste conforme necessário
    const deltaX = (toCol - from.col) * squareSize;
    const deltaY = (toRow - from.row) * squareSize;

    pieceElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    setTimeout(() => {
      pieceElement.style.transform = "";
      pieceElement.parentElement.id = `${toRow}-${toCol}`;
      createBoard();
    }, 300);
    document.getElementById("move-info").textContent = `Peça movida para ${positionToString(toRow, toCol).toUpperCase()}`;
    return true;
  }
  return false;
}

function toggleTurn() {
  currentTurn = currentTurn === "white" ? "black" : "white";
  document.getElementById("turn-info").textContent = `Turno: ${currentTurn === "white" ? "Jogador Branco" : "Jogador Preto"}`; 
}

function bgPieceColoring(mov) {
  const pecaSelecionada = document.getElementById(
    `${selectedPiece.position.row}-${selectedPiece.position.col}`
  );
  if (selectedPiece && mov) {
    pecaSelecionada.style.backgroundColor = "lightyellow";
    return;
  }
  if (pecaSelecionada.className == "white-square") {
    pecaSelecionada.style.backgroundColor = "#f0d9b5";
  } else {
    pecaSelecionada.style.backgroundColor = "#b58863";
  }
}

function removePiece(target) {
  const colorDiv = target.color === "black" ? "black" : "white";
  const div = document.getElementById(`${colorDiv}-pieces`);
  const span = document.createElement("span");
  span.innerHTML = pieceToSymbol(target);
  div.appendChild(span);
}


function showPossibleMoves(piece, row, col) {
  frontFunctions.removeHighlight();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(piece, { row, col }, r, c)) {
        const square = document.getElementById(`${r}-${c}`);
        square.classList.add(
          canCaptureEnemyPiece(piece, r, c) ? "capture-highlight" : "highlight"
        );
      }
    }
  }
}

function isValidMove(piece, from, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) return false;

  switch (piece.type) {
    case "pawn":
      return movimentos.isValidPawnMove(piece, from, toRow, toCol, board);
    case "rook":
      return movimentos.isValidRookMove(from, toRow, toCol, board);
    case "knight":
      return movimentos.isValidKnightMove(from, toRow, toCol, board);
    case "bishop":
      return movimentos.isValidBishopMove(from, toRow, toCol, board);
    case "queen":
      return movimentos.isValidQueenMove(from, toRow, toCol, board);
    case "king":
      return movimentos.isValidKingMove(from, toRow, toCol, board);
    default:''
      return false;
  }
}

function canCaptureEnemyPiece(piece, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  return targetPiece && targetPiece.color !== piece.color;
}

function positionToString(row, col) {
  const letters = "abcdefgh";
  return `${letters[col]}${8 - row}`;
}



function isKingInCheck(color) {
  const king = pieces.find((p) => p.type === "king" && p.color === color);
  if (!king) return false;

  return pieces.some((p) => p.color !== color && isValidMove(p, p.position, king.position.row, king.position.col));
}

function isCheckmate(color) {
  if (!isKingInCheck(color)) {
    return false; // O rei não está em xeque, então não pode ser xeque-mate
  }

  for (const piece of pieces.filter((p) => p.color === color)) {
    const { row, col } = piece.position;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isValidMove(piece, { row, col }, r, c)) {
 
          const originalPiece = board[r][c];
          const originalPosition = { ...piece.position };

          // Simula o movimento
          board[row][col] = null;
          board[r][c] = piece;
          piece.position = { row: r, col: c };

          const stillInCheck = isKingInCheck(color);

          // Reverte a jogada simulada
          board[row][col] = piece;
          board[r][c] = originalPiece;
          piece.position = originalPosition;

          if (!stillInCheck) {
            return false; // Existe pelo menos um movimento que tira o rei do xeque
          }
        }
      }
    }
  }

  return true; // Nenhuma peça pode sair do xeque -> xeque-mate
}

function showAlerts(){
  ["white", "black"].forEach((color) => {
    if (isKingInCheck(color)) {
      if (isCheckmate(color)) {
        alert(`Xeque-mate! O jogador ${color === "white" ? "preto" : "branco"} venceu!`);
        showEndGame();
      } else {
        alert(`O rei ${color === "white" ? "branco" : "preto"} está em xeque!`);
      }
    }
  });
}

initializeBoard();
createBoard();
toggleTurn();

window.onload = () => {
  frontFunctions.showPlayersName(player1Name, player2Name);
};
