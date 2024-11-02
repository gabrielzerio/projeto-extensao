
const board = Array(8).fill(null).map(() => Array(8).fill(null));


const pieces = [
  { type: 'rook', color: 'black', position: { row: 0, col: 0 } },
  { type: 'knight', color: 'black', position: { row: 0, col: 1 } },
  { type: 'bishop', color: 'black', position: { row: 0, col: 2 } },
  { type: 'queen', color: 'black', position: { row: 0, col: 3 } },
  { type: 'king', color: 'black', position: { row: 0, col: 4 } },
  { type: 'bishop', color: 'black', position: { row: 0, col: 5 } },
  { type: 'knight', color: 'black', position: { row: 0, col: 6 } },
  { type: 'rook', color: 'black', position: { row: 0, col: 7 } },
  ...Array(8).fill(null).map((_, i) => ({ type: 'pawn', color: 'black', position: { row: 1, col: i } })),
  ...Array(8).fill(null).map((_, i) => ({ type: 'pawn', color: 'white', position: { row: 6, col: i } })),
  { type: 'rook', color: 'white', position: { row: 7, col: 0 } },
  { type: 'knight', color: 'white', position: { row: 7, col: 1 } },
  { type: 'bishop', color: 'white', position: { row: 7, col: 2 } },
  { type: 'queen', color: 'white', position: { row: 7, col: 3 } },
  { type: 'king', color: 'white', position: { row: 7, col: 4 } },
  { type: 'bishop', color: 'white', position: { row: 7, col: 5 } },
  { type: 'knight', color: 'white', position: { row: 7, col: 6 } },
  { type: 'rook', color: 'white', position: { row: 7, col: 7 } },
];


let selectedPiece = null;
let selectedPosition = null;
let currentTurn = 'white';


function initializeBoard() {
  board.forEach(row => row.fill(null)); 
  pieces.forEach(piece => {
    const { row, col } = piece.position;
    board[row][col] = piece; 
  });
}


function createBoard() {
  const chessBoard = document.getElementById('board');
  chessBoard.innerHTML = '';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.id = `${row}-${col}`;
      square.classList.add((row + col) % 2 === 0 ? 'white-square' : 'black-square');
      
      const piece = board[row][col];
      if (piece) {
        square.textContent = pieceToSymbol(piece); 
      }
      square.addEventListener('click', () => handleSquareClick(row, col));
      chessBoard.appendChild(square);
    }
  }
}


function pieceToSymbol(piece) {
  const symbols = {
    rook: { white: '♖', black: '♜' },
    knight: { white: '♘', black: '♞' },
    bishop: { white: '♗', black: '♝' },
    queen: { white: '♕', black: '♛' },
    king: { white: '♔', black: '♚' },
    pawn: { white: '♙', black: '♟' },
  };
  return symbols[piece.type][piece.color];
}


function toggleTurn() {
  currentTurn = currentTurn === 'white' ? 'black' : 'white';
  document.getElementById('turn-info').textContent = `Turno: ${currentTurn === 'white' ? 'Jogador Branco' : 'Jogador Preto'}`;
}


function handleSquareClick(row, col) {
  const piece = board[row][col];

  if (selectedPiece) {
    if (movePiece(selectedPiece, selectedPosition, row, col)) {
      toggleTurn();
      selectedPiece = null;
      selectedPosition = null;
    } else {
      document.getElementById('move-info').textContent = 'Movimento inválido. Tente novamente.';
      selectedPiece = null;
      selectedPosition = null;
    }
  } else if (piece && piece.color === currentTurn) {
    selectedPiece = piece;
    selectedPosition = { row, col };
    document.getElementById('move-info').textContent = `Peça selecionada: ${pieceToSymbol(piece)} em ${positionToString(row, col)}`;
    showPossibleMoves(piece, row, col);
  }
}


function movePiece(piece, from, toRow, toCol) {
  if (isValidMove(piece, from, toRow, toCol)) {
    const target = board[toRow][toCol];
    if (target) {
      pieces.splice(pieces.indexOf(target), 1); 
    }

    board[from.row][from.col] = null; 
    board[toRow][toCol] = piece; 
    piece.position = { row: toRow, col: toCol }; 

    createBoard(); 
    document.getElementById('move-info').textContent = `Peça movida para ${positionToString(toRow, toCol)}`;
    return true;
  }
  return false;
}


function showPossibleMoves(piece, row, col) {
  removeHighlight();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isValidMove(piece, { row, col }, r, c)) {
        const square = document.getElementById(`${r}-${c}`);
        square.classList.add(canCaptureEnemyPiece(piece, r, c) ? 'capture-highlight' : 'highlight');
      }
    }
  }
}


function isValidMove(piece, from, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  if (targetPiece && targetPiece.color === piece.color) return false;

  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(piece, from, toRow, toCol);
    case 'rook':
      return isValidRookMove(from, toRow, toCol);
    case 'knight':
      return isValidKnightMove(from, toRow, toCol);
    case 'bishop':
      return isValidBishopMove(from, toRow, toCol);
    case 'queen':
      return isValidQueenMove(from, toRow, toCol);
    case 'king':
      return isValidKingMove(from, toRow, toCol);
    default:
      return false;
  }
}


function isValidPawnMove(piece, from, toRow, toCol) {
  const direction = piece.color === 'white' ? -1 : 1; 
  const startRow = piece.color === 'white' ? 6 : 1;
  
  
  if (from.col === toCol && board[toRow][toCol] === null) {
    
    if (toRow === from.row + direction) return true;
    
    if (from.row === startRow && toRow === from.row + 2 * direction) return true;
  }

  
  if (Math.abs(from.col - toCol) === 1 && toRow === from.row + direction) {
    if (board[toRow][toCol] && board[toRow][toCol].color !== piece.color) {
      return true; 
    }
  }

  return false; 
}


function isValidRookMove(from, toRow, toCol) {
  const rowDiff = Math.abs(from.row - toRow);
  const colDiff = Math.abs(from.col - toCol);
  if (rowDiff === 0 || colDiff === 0) {
    return !isPathBlocked(from, toRow, toCol); 
  }
  return false; 
}


function isValidBishopMove(from, toRow, toCol) {
  const rowDiff = Math.abs(from.row - toRow);
  const colDiff = Math.abs(from.col - toCol);
  if (rowDiff === colDiff) {
    return !isPathBlocked(from, toRow, toCol); 
  }
  return false; 
}


function isValidQueenMove(from, toRow, toCol) {
  return isValidRookMove(from, toRow, toCol) || isValidBishopMove(from, toRow, toCol);
}


function isValidKingMove(from, toRow, toCol) {
  const rowDiff = Math.abs(from.row - toRow);
  const colDiff = Math.abs(from.col - toCol);
  return (rowDiff <= 1 && colDiff <= 1); 
}


function isPathBlocked(from, toRow, toCol) {
  const rowStep = Math.sign(toRow - from.row);
  const colStep = Math.sign(toCol - from.col);

  let row = from.row + rowStep;
  let col = from.col + colStep;

  while (row !== toRow || col !== toCol) {
    if (board[row][col] !== null) {
      return true; 
    }
    row += rowStep;
    col += colStep;
  }
  return false; 
}


function canCaptureEnemyPiece(piece, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  return targetPiece && targetPiece.color !== piece.color;
}


function positionToString(row, col) {
  const letters = 'abcdefgh';
  return `${letters[col]}${8 - row}`; 
}


function removeHighlight() {
  const squares = document.querySelectorAll('#board div');
  squares.forEach(square => {
    square.classList.remove('highlight', 'capture-highlight');
  });
}


initializeBoard();
createBoard();
toggleTurn();
