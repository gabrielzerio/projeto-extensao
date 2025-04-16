import FunctionsFront from "./frontUtils.js";
import PcsMvmt from "./pieceMovement.js";
import FunctionsTutorial from "./tutorial.js";

const tutorial = new FunctionsTutorial
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
let enPassantTarget = null;

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



async function handleSquareClick(row, col) {
  const piece = board[row][col];
  if (selectedPiece) {
    if (await movePiece(selectedPiece, selectedPosition, row, col)) {
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
 async function pawnPromotion(piece, toRow, toCol) {
  if (piece.type === "pawn" && (toRow === 0 || toRow === 7)) {
    const promotedPiece = await frontFunctions.showPromotionDialog(piece.color, toRow, toCol, pieceToSymbol);
    
    // Atualiza a peça com o novo tipo
    piece.type = promotedPiece.type;
    
    // Atualiza o visual da peça
    const pieceElement = document.getElementById(`${toRow}-${toCol}`).querySelector(".piece");
    pieceElement.innerHTML = pieceToSymbol(piece);
  }
}

async function movePiece(piece, from, toRow, toCol) {
  if (isValidMove(piece, from, toRow, toCol)) {
    await pawnPromotion(piece, toRow, toCol); // Chama a função de promoção de peão
    const originalPiece = board[toRow][toCol];
    const originalPosition = { ...piece.position };
    
    // Verifica se é um movimento en passant
    const isEnPassantMove = piece.type === "pawn" && enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col;
    
    // Guarda referência ao peão que será capturado por en passant
    let capturedPawn = null;
    if (isEnPassantMove) {
      const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1;
      capturedPawn = board[capturedPawnRow][toCol];
    }

    // Faz o movimento temporário
    board[from.row][from.col] = null;
    board[toRow][toCol] = piece;
    piece.position = { row: toRow, col: toCol };

    // Remove o peão capturado no en passant
    if (isEnPassantMove) {
      const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1;
      board[capturedPawnRow][toCol] = null;
      removePiece(capturedPawn);
      pieces.splice(pieces.indexOf(capturedPawn), 1);
    }

    // Verifica se o rei está em xeque após o movimento
    const kingInCheck = isKingInCheck(piece.color);

    // Reverte o movimento se deixar o rei em xeque
    if (kingInCheck) {
      board[from.row][from.col] = piece;
      board[toRow][toCol] = originalPiece;
      piece.position = originalPosition;
      
      // Restaura o peão capturado por en passant
      if (isEnPassantMove) {
        const capturedPawnRow = piece.color === "white" ? toRow + 1 : toRow - 1;
        board[capturedPawnRow][toCol] = capturedPawn;
      }
      
      document.getElementById('move-info').textContent = 'Movimento inválido: o rei ficaria em xeque.';
      return false;
    }

    // Define o alvo do en passant se for um movimento duplo de peão
    if (piece.type === "pawn" && Math.abs(from.row - toRow) === 2) {
      enPassantTarget = {row: (from.row + toRow) / 2, col: toCol};
    } else {
      enPassantTarget = null;
    }

    // Remove a peça capturada normalmente
    if (originalPiece) {
      removePiece(originalPiece);
      pieces.splice(pieces.indexOf(originalPiece), 1);
    }
    
    // Atualiza o tabuleiro visualmente
    movePieceAnimation(toRow, toCol, from);
    return true;
  }

  document.getElementById('move-info').textContent = 'Movimento inválido. Tente novamente.';
  return false;
}

function movePieceAnimation(toRow, toCol, from) {
  const pieceElement = document.getElementById(`${from.row}-${from.col}`).querySelector(".piece");
  const squareSize = 80; // Ajuste conforme necessário
  const deltaX = (toCol - from.col) * squareSize;
  const deltaY = (toRow - from.row) * squareSize;

  pieceElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  setTimeout(() => {
    pieceElement.style.transform = "";
    pieceElement.parentElement.id = `${toRow}-${toCol}`;
    createBoard();
  }, 300);
  document.getElementById('move-info').textContent = `Peça movida para ${positionToString(toRow, toCol).toUpperCase()}`;
}

function showPossibleMoves(piece, row, col) {
  frontFunctions.removeHighlight(); // Remove highlights de movimentos anteriores

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(piece, { row, col }, r, c)) {
        // Simula o movimento para verificar se o rei ficará em xeque
        const originalPiece = board[r][c];
        const originalPosition = { ...piece.position };

        // Faz o movimento temporário
        board[row][col] = null;
        board[r][c] = piece;
        piece.position = { row: r, col: c };
        
        // Verifica se o rei está em xeque após o movimento
        const kingInCheck = isKingInCheck(piece.color);
         console.log(board.map(row => row.map(p => p ? p.type : null)))
        // Reverte o movimento temporário
        board[row][col] = piece;
        board[r][c] = originalPiece;
        piece.position = originalPosition;

        // Apenas destaca o quadrado se o movimento não expuser o rei ao xeque
        if (!kingInCheck) {
          const square = document.getElementById(`${r}-${c}`);
          square.classList.add(
            frontFunctions.canCaptureEnemyPiece(board, piece, r, c) ? 'capture-highlight' : 'highlight'
          );
        }
      }
    }
  }
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





function isValidMove(piece, from, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) return false;

  switch (piece.type) {
    case "pawn":
      return movimentos.isValidPawnMove(piece, from, toRow, toCol, board, enPassantTarget);
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

function isKingInCheck(color) {
  // Encontra a posição do rei no tabuleiro
  let kingPosition = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }

  if (!kingPosition) return false; // Rei não encontrado (caso extremo)

  // Verifica se alguma peça inimiga pode atacar a posição do rei
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        if (isValidMove(piece, { row, col }, kingPosition.row, kingPosition.col)) {
          return true; // O rei está em xeque
        }
      }
    }
  }

  return false; // O rei não está em xeque
}

function isCheckmate(color) {
  if (!isKingInCheck(color)) {
    return false; // O rei não está em xeque, então não pode ser xeque-mate
  }

  // Para cada peça do jogador em xeque, verifica se há algum movimento válido
  for (const piece of pieces.filter(p => p.color === color)) {
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
        frontFunctions.showEndGame();
      } else {
        alert(`O rei ${color === "white" ? "branco" : "preto"} está em xeque!`);
      }
    }
  });
}

toggleTurn();

window.onload = async () => {
  let teste = await frontFunctions.showPlayersName(player1Name, player2Name);
  tutorial.movePieceTo(teste, [{row: 1, col: 6},], [{row: 6, col: 4}], pieces, board);  
   createBoard();
};
