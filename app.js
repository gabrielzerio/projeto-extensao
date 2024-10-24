// Definindo a configuração inicial do tabuleiro (simplificada para exemplo)
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

// Variáveis globais para controlar o jogo
let selectedPiece = null;
let selectedPosition = null;

// Função para criar o tabuleiro no HTML
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
        square.innerHTML = piece;  // Adiciona a peça no quadrado (peão, torre, etc.)
      }

      square.addEventListener('click', () => handleSquareClick(row, col));  // Clique no quadrado
      chessBoard.appendChild(square);
    }
  }
}

// Função que lida com o clique em um quadrado
function handleSquareClick(row, col) {
  const piece = board[row][col];

  // Se já existe uma peça selecionada, tentamos mover para o novo local
  if (selectedPiece) {
    movePiece(selectedPiece, selectedPosition, row, col);
    removeHighlight();  // Remove o destaque dos movimentos
  } else if (piece) {
    // Se clicamos em uma peça, seleciona essa peça
    selectedPiece = piece;
    selectedPosition = { row, col };
    document.getElementById('move-info').textContent = `Peça selecionada: ${piece} em ${positionToString(row, col)}`;
    showPossibleMoves(piece, row, col);  // Exibe as dicas de captura e movimento
  }
}

// Função para mover a peça selecionada para uma nova posição
function movePiece(piece, from, toRow, toCol) {
  const valid = isValidMove(piece, from, toRow, toCol);  // Verifica se o movimento é válido
  const capture = canCaptureEnemyPiece(piece, from, toRow, toCol);  // Verifica se pode capturar

  if (valid) {
    board[from.row][from.col] = '';  // Limpa a posição original
    board[toRow][toCol] = piece;  // Move a peça
    selectedPiece = null;
    selectedPosition = null;
    document.getElementById('move-info').textContent = `Peça movida para ${positionToString(toRow, toCol)}`;

    // Se foi captura, mostra uma mensagem
    if (capture) {
      document.getElementById('hint').textContent = `Captura realizada em ${positionToString(toRow, toCol)}!`;
    } else {
      document.getElementById('hint').textContent = '';
    }

    createBoard();  // Atualiza o tabuleiro
  } else {
    document.getElementById('move-info').textContent = 'Movimento inválido. Tente novamente.';
  }
}

// Função para verificar se o movimento é válido (exemplo simplificado)
function isValidMove(piece, from, toRow, toCol) {
  // Apenas verifica se o destino está vazio por enquanto
  return board[toRow][toCol] === '' || canCaptureEnemyPiece(piece, from, toRow, toCol);
}

// Função para verificar se o movimento pode capturar uma peça inimiga
function canCaptureEnemyPiece(piece, from, toRow, toCol) {
  const targetPiece = board[toRow][toCol];
  // Verifica se a peça no destino é inimiga (maiúscula vs minúscula)
  return targetPiece && targetPiece !== '' && piece !== targetPiece && 
         ((piece === piece.toLowerCase() && targetPiece === targetPiece.toUpperCase()) ||
          (piece === piece.toUpperCase() && targetPiece === targetPiece.toLowerCase()));
}

// Função para mostrar possíveis movimentos e capturas
function showPossibleMoves(piece, row, col) {
  removeHighlight();  // Remove qualquer destaque anterior

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && (i !== 0 || j !== 0)) {
        const square = document.getElementById(`${newRow}-${newCol}`);
        if (isValidMove(piece, { row, col }, newRow, newCol)) {
          square.classList.add('highlight');
          if (canCaptureEnemyPiece(piece, { row, col }, newRow, newCol)) {
            square.classList.add('capture-highlight');  // Destaca uma captura
          }
        }
      }
    }
  }
}

// Função para remover destaques
function removeHighlight() {
  const highlightedSquares = document.querySelectorAll('.highlight, .capture-highlight');
  highlightedSquares.forEach(square => {
    square.classList.remove('highlight', 'capture-highlight');
  });
}

// Função utilitária para converter posição numérica em coordenadas do tabuleiro (ex: 0,0 -> A1)
function positionToString(row, col) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return `${letters[col]}${8 - row}`;
}

// Inicializa o tabuleiro
createBoard();
