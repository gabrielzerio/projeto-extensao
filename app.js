import FunctionsFront from "./frontUtils.js";
import PcsMvmt from "./pieceMovement.js";

const movimentos = new PcsMvmt
const frontFunctions = new FunctionsFront


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
  ...Array(8).fill(null).map((_, i) => ({ type: "pawn", color: "black", position: { row: 1, col: i }, })),
  ...Array(8).fill(null).map((_, i) => ({ type: "pawn", color: "white", position: { row: 6, col: i }, })),
  { type: "rook", color: "white", position: { row: 7, col: 0 }, hasMoved: false },
  { type: "knight", color: "white", position: { row: 7, col: 1 } },
  { type: "bishop", color: "white", position: { row: 7, col: 2 } },
  { type: "queen", color: "white", position: { row: 7, col: 3 } },
  { type: "king", color: "white", position: { row: 7, col: 4 }, hasMoved: false },
  { type: "bishop", color: "white", position: { row: 7, col: 5 } },
  { type: "knight", color: "white", position: { row: 7, col: 6 } },
  { type: "rook", color: "white", position: { row: 7, col: 7 }, hasMoved: false },
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
  if (movimentos.isValidMove(piece, from, toRow, toCol, board)) {
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

    // Verifica se é um movimento de roque
    if (piece.type === 'king' && Math.abs(from.col - toCol) === 2) {
      const isKingSide = toCol > from.col;
      const rookCol = isKingSide ? 7 : 0;
      const newRookCol = isKingSide ? 5 : 3;
      
      // Move a torre
      const rook = board[from.row][rookCol];
      board[from.row][rookCol] = null;
      board[from.row][newRookCol] = rook;
      rook.position = { row: from.row, col: newRookCol };
      rook.hasMoved = true;
    }

    // Marca a peça como movida
    piece.hasMoved = true;

    // Verifica se o rei está em xeque após o movimento
    const kingInCheck = movimentos.isKingInCheck(piece.color, board);

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

  // Se for o rei, adiciona possíveis movimentos de roque
  if (piece.type === 'king' && !piece.hasMoved) {
    // Roque curto
    const rookKingSide = board[row][7];
    if (rookKingSide && !rookKingSide.hasMoved && 
        !board[row][5] && !board[row][6] && 
        movimentos.isValidKingMove(piece, {row, col}, row, col + 2, board)) {
      const square = document.getElementById(`${row}-${col + 2}`);
      square.classList.add('highlight');
    }

    // Roque longo
    const rookQueenSide = board[row][0];
    if (rookQueenSide && !rookQueenSide.hasMoved && 
        !board[row][1] && !board[row][2] && !board[row][3] && 
        movimentos.isValidMove(piece, {row, col}, row, col - 2, board)) {
      const square = document.getElementById(`${row}-${col - 2}`);
      square.classList.add('highlight');
    }
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (movimentos.isValidMove(piece, { row, col }, r, c, board)) {
        // Simula o movimento para verificar se o rei ficará em xeque
        const originalPiece = board[r][c];
        const originalPosition = { ...piece.position };

        // Faz o movimento temporário
        board[row][col] = null;
        board[r][c] = piece;
        piece.position = { row: r, col: c };
        
        // Verifica se o rei está em xeque após o movimento
        const kingInCheck = movimentos.isKingInCheck(piece.color, board);
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


function positionToString(row, col) {
  const letters = "abcdefgh";
  return `${letters[col]}${8 - row}`;
}

function showAlerts() {
  if (movimentos.isKingInCheck(currentColorTurn, board)) {
    if (movimentos.isCheckmate(currentColorTurn, board, pieces)) {
      // Opcional: Desabilitar o tabuleiro após o xeque-mate
      frontFunctions.showEndGame();
    } else {
      alert(`${currentColorTurn === "white" ? "Rei branco" : "Rei preto"} está em xeque!`);
    }
  }
}

initializeBoard();
createBoard();
toggleTurn();

window.onload = () => {
  frontFunctions.showPlayersName(player1Name, player2Name);
};
