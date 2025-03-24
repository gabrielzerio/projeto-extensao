import FunctionsFront from "./frontUtils.js";
import PcsMvmt from "./pieceMovement.js";

const movimentos = new PcsMvmt
const frontFunctions = new FunctionsFront


const board = Array(8).fill(null).map(() => Array(8).fill(null));

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
let currentColorTurn = "black";
const piecesThatCanSaveKing = []; // Array para armazenar as peças e suas posições

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
  } else if (piece && piece.color === currentColorTurn) {
    selectedPiece = piece;
    selectedPosition = { row, col };
    document.getElementById("move-info").textContent = `Peça selecionada: ${pieceToSymbol(piece)} em ${positionToString(row, col).toUpperCase()}`;
    showPossibleMoves(piece, row, col);
    bgPieceColoring(true);
  }
}

function movePiece(piece, from, toRow, toCol) {
  // Verifica se a peça é uma das que pode salvar o rei e se está movendo para uma posição válida
  const canSaveKing = piecesThatCanSaveKing.some(
    (entry) => entry.piece === piece && entry.position.row === toRow && entry.position.col === toCol
  );

  if (isKingInCheck(currentColorTurn) && !canSaveKing) {
    const king = pieces.find((p) => p.type === "king" && p.color === currentColorTurn);
    console.log(king)
    const kingDiv = document.getElementById(`${king.position.row}-${king.position.col}`);
    
    if (kingDiv) {
        // Adiciona a classe de animação para piscar em vermelho
        kingDiv.classList.add("blink");
        
        // Remove a classe depois de alguns segundos para parar o piscar
        setTimeout(() => {
            kingDiv.classList.remove("blink");
        }, 1500); // 1500ms para a animação terminar (3 ciclos de 0.5s)
    }
    
    return false;
}

// resetKingDefenders()
  if (isValidMove(piece, from, toRow, toCol)) {
    const target = board[toRow][toCol];
    const pieceElement = document.getElementById(`${from.row}-${from.col}`).querySelector(".piece");

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
  currentColorTurn = currentColorTurn === "white" ? "black" : "white";
  document.getElementById("turn-info").textContent = `Turno: ${currentColorTurn === "white" ? "Jogador Branco" : "Jogador Preto"}`;
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
  const div = document.getElementById(`${target.color}-pieces`);
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
        square.classList.add(frontFunctions.canCaptureEnemyPiece(board, piece, r, c) ? "capture-highlight" : "highlight");

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
    default: ''
      return false;
  }
}



function positionToString(row, col) {
  const letters = "abcdefgh";
  return `${letters[col]}${8 - row}`;
}

function resetKingDefenders(){
  piecesThatCanSaveKing.length=0;
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

  const piecesThatCanSaveKing = [];

  // Itera sobre as peças do jogador
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

          // Verifica se o rei ainda está em xeque após o movimento
          const stillInCheck = isKingInCheck(color);

          // Reverte a jogada simulada
          board[row][col] = piece;
          board[r][c] = originalPiece;
          piece.position = originalPosition;

          if (!stillInCheck) {
            piecesThatCanSaveKing.push({ piece, position: { row: r, col: c } });
          }
        }
      }
    }
  }

  // Se houver peças que podem salvar o rei, não é xeque-mate
  if (piecesThatCanSaveKing.length > 0) {
    console.log("Peças que podem salvar o rei com as posições:", piecesThatCanSaveKing);
    return false; // Existem peças que podem salvar o rei, logo não é xeque-mate
  }

  return true; // Nenhuma peça pode salvar o rei -> xeque-mate
}



function showAlerts() {
  
    if (isKingInCheck(currentColorTurn)) {
      if (isCheckmate(currentColorTurn)) {
        alert(`Xeque-mate! O jogador ${currentColorTurn === "white" ? "preto" : "branco"} venceu!`);
        frontFunctions.showEndGame(player1Name, player2Name, currentColorTurn);
      } else {
        alert(`O rei ${currentColorTurn === "white" ? "branco" : "preto"} está em xeque!`);
        return
      }
    }

}

initializeBoard();
createBoard();
toggleTurn();

window.onload = () => {
  frontFunctions.showPlayersName(player1Name, player2Name);
};
