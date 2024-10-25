// Configuração inicial do tabuleiro
const board = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let selectedPiece = null;
let selectedPosition = null;
let currentTurn = 'white'; // O jogador branco começa

// Função para renderizar o tabuleiro
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
        square.innerHTML = piece;
      }

      square.addEventListener('click', () => handleSquareClick(row, col));
      chessBoard.appendChild(square);
    }
  }
}

// Função para alternar turnos após cada jogada válida
function toggleTurn() {
  currentTurn = currentTurn === 'white' ? 'black' : 'white';
  document.getElementById('turn-info').textContent = `Turno: ${currentTurn === 'white' ? 'Jogador Branco' : 'Jogador Preto'}`;
}

// Função de clique na célula do tabuleiro
function handleSquareClick(row, col) {
  const piece = board[row][col];
  const pieceColor = piece && piece === piece.toUpperCase() ? 'white' : 'black';

  if (selectedPiece) {
    movePiece(selectedPiece, selectedPosition, row, col);
    removeHighlight();
  } else {
    if (!piece || pieceColor !== currentTurn) {
      document.getElementById('move-info').textContent = "Não é sua vez ou a célula está vazia!";
      return;
    }
    selectedPiece = piece;
    selectedPosition = { row, col };
    document.getElementById('move-info').textContent = `Peça selecionada: ${piece} em ${positionToString(row, col)}`;
    showPossibleMoves(piece, row, col);
  }
}

function movePiece(piece, from, toRow, toCol) {
  const valid = isValidMove(piece, from, toRow, toCol);
  
  if (valid) {
    // Move a peça no tabuleiro
    board[from.row][from.col] = '';
    board[toRow][toCol] = piece;

    // Limpa a seleção
    selectedPiece = null;
    selectedPosition = null;
    
    // Atualiza o tabuleiro visual
    createBoard();

    // Alterna o turno para o próximo jogador
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    document.getElementById('turn-info').textContent = `Turno: ${currentTurn === 'white' ? 'Jogador Branco' : 'Jogador Preto'}`;
    
    // Atualiza a mensagem de movimento
    document.getElementById('move-info').textContent = `Peça movida para ${positionToString(toRow, toCol)}`;
  } else {
    // Caso movimento inválido, exibe mensagem e limpa a seleção para escolher outra peça
    document.getElementById('move-info').textContent = 'Movimento inválido. Tente novamente.';
    selectedPiece = null;
    selectedPosition = null;
    removeHighlight();  // Remove o destaque anterior
  }
}


// Função para verificar se o movimento é válido
function isValidMove(piece, from, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  
  // Impede que o jogador capture suas próprias peças
  if (targetPiece && ((piece === piece.toUpperCase() && targetPiece === targetPiece.toUpperCase()) || 
                      (piece === piece.toLowerCase() && targetPiece === targetPiece.toLowerCase()))) {
    return false;
  }

  switch (piece.toLowerCase()) {
    case 'p': return isValidPawnMove(piece, from, toRow, toCol);
    case 'r': return isValidRookMove(from, toRow, toCol);
    case 'n': return isValidKnightMove(from, toRow, toCol);
    case 'b': return isValidBishopMove(from, toRow, toCol);
    case 'q': return isValidQueenMove(from, toRow, toCol);
    case 'k': return isValidKingMove(from, toRow, toCol);
    default: return false;
  }
}


// Funções para destacar as posições válidas para movimentos e capturas
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

// Função para limpar o destaque após o movimento
function removeHighlight() {
  const highlightedSquares = document.querySelectorAll('.highlight, .capture-highlight');
  highlightedSquares.forEach(square => {
    square.classList.remove('highlight', 'capture-highlight');
  });
}

// Função para capturar peças inimigas
function canCaptureEnemyPiece(piece, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  return targetPiece && targetPiece !== '' && ((piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase()) ||
          (piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase()));
}

// Função para converter coordenadas para A1, B2, etc.
function positionToString(row, col) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return `${letters[col]}${8 - row}`;
}

// Funções de verificação para cada tipo de peça
function isValidPawnMove(piece, from, toRow, toCol) {
  const direction = piece === 'P' ? -1 : 1;
  const startRow = piece === 'P' ? 6 : 1;

  if (from.col === toCol && board[toRow][toCol] === '') {
    return (toRow === from.row + direction) || (from.row === startRow && toRow === from.row + 2 * direction);
  }

  if (Math.abs(from.col - toCol) === 1 && toRow === from.row + direction) {
    return canCaptureEnemyPiece(piece, toRow, toCol);
  }
  return false;
}

function isValidRookMove(from, toRow, toCol) {
  return (from.row === toRow || from.col === toCol) && !hasObstaclesInPath(from, toRow, toCol);
}

function isValidKnightMove(from, toRow, toCol) {
  const rowDiff = Math.abs(from.row - toRow);
  const colDiff = Math.abs(from.col - toCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(from, toRow, toCol) {
  return Math.abs(from.row - toRow) === Math.abs(from.col - toCol) && !hasObstaclesInPath(from, toRow, toCol);
}

function isValidQueenMove(from, toRow, toCol) {
  return isValidRookMove(from, toRow, toCol) || isValidBishopMove(from, toRow, toCol);
}

function isValidKingMove(from, toRow, toCol) {
  return Math.abs(from.row - toRow) <= 1 && Math.abs(from.col - toCol) <= 1;
}

// Verificação de obstáculos no caminho
function hasObstaclesInPath(from, toRow, toCol) {
  const rowStep = toRow > from.row ? 1 : toRow < from.row ? -1 : 0;
  const colStep = toCol > from.col ? 1 : toCol < from.col ? -1 : 0;
  let row = from.row + rowStep;
  let col = from.col + colStep;
  while (row !== toRow || col !== toCol) {
    if (board[row][col] !== '') return true;
    row += rowStep;
    col += colStep;
  }
  return false;
}

// Verifica se pode capturar uma peça inimiga
function canCaptureEnemyPiece(piece, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  return targetPiece && ((piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase()) ||
                         (piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase()));
}

// Mostra os movimentos possíveis
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

// Remove os destaques
function removeHighlight() {
  document.querySelectorAll('.highlight, .capture-highlight').forEach(square => {
    square.classList.remove('highlight', 'capture-highlight');
  });
}

function positionToString(row, col) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return `${letters[col]}${8 - row}`;
}

// Inicializa o tabuleiro
createBoard();
document.getElementById('turn-info').textContent = `Turno: Jogador Branco`;