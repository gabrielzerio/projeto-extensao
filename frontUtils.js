class FunctionsFront {

  removeHighlight() {
    const squares = document.querySelectorAll("#board div");
    squares.forEach((square) => {
      square.classList.remove("highlight", "capture-highlight");
    });
  }

  showEndGame(player1Name, player2Name, currentTurn) {
    const modal = document.getElementById("modal2");
    const winner = currentTurn === "white" ? player1Name : player2Name;
    winnerMessage.textContent = `Parabéns, ${winner} ! Você venceu!`;
    modal.showModal();
    const btn = document.getElementById("restartGame");
    btn.addEventListener("click", () => {
      location.reload();
    });
  }

  // <h2>Digite os nomes dos jogadores</h2>
  //   <input type="text" id="player1" placeholder="Jogador das peças brancas">
  //   <input type="text" id="player2" placeholder="Jogador das peças pretas">
  //   <button id="startGame">Começar Jogo</button>

  showPlayersName(player1Name, player2Name) {
    const modal = document.getElementById("modal1");
    const divModal = document.getElementById("divModal");
    const btn = document.createElement("button");
    btn.id = 'startGame'; btn.textContent = "Começar Jogo";
    
    const divDefault = `
    <h2>Digite os nomes dos jogadores</h2>
    <input type="text" id="player1" placeholder="Jogador das peças brancas">
    <input type="text" id="player2" placeholder="Jogador das peças pretas">
    `;
  
    divModal.insertAdjacentHTML("afterbegin", divDefault);
    divModal.insertAdjacentElement("beforeend", btn);

    // Adiciona um listener para impedir que o modal feche ao pressionar Esc
    const preventEscClose = (event) => {
      if (event.key === "Escape") {
        event.preventDefault(); // Impede o comportamento padrão
      }
    };
    document.addEventListener("keydown", preventEscClose);

    modal.showModal();

    document.getElementById("startGame");
    btn.addEventListener("click", () => {
      player1Name = document.getElementById("player1").value;
      player2Name = document.getElementById("player2").value;
      modal.close();
    });
  }
  showTutorial() { 
    const modal = document.getElementById("modal1");
    const divModal = document.getElementById("divModal");
  
    const btnPawn = document.createElement("button");
    btnPawn.id = 'btn-pawn';
    btnPawn.dataset.piece = 'pawn'; // Adiciona o atributo data-piece
    btnPawn.innerText = "Peão"; 
    
    const btnRook = document.createElement("button");
    btnRook.id = 'btn-rook';
    btnRook.dataset.piece = 'rook'; // Adiciona o atributo data-piece
    btnRook.innerText = "Torre"; 

    const btnQueen = document.createElement("button");
    btnQueen.id = 'btn-queen';
    btnQueen.dataset.piece = 'queen'; // Adiciona o atributo data-piece
    btnQueen.innerText = "Dama";

    const btnBishop = document.createElement("button");
    btnBishop.id = 'btn-bishop';
    btnBishop.dataset.piece = 'bishop'; // Adiciona o atributo data-piece
    btnBishop.innerText = "Bispo";

    const btnKnight = document.createElement("button");
    btnKnight.id = 'btn-knight';
    btnKnight.dataset.piece = 'knight'; // Adiciona o atributo data-piece
    btnKnight.innerText = "Cavalo";

    divModal.appendChild(btnPawn);
    divModal.appendChild(btnRook);
    divModal.appendChild(btnQueen);
    divModal.appendChild(btnBishop);
    divModal.appendChild(btnKnight);

  // Adiciona um listener para impedir que o modal feche ao pressionar Esc
    const preventEscClose = (event) => {
      if (event.key === "Escape") {
        event.preventDefault(); // Impede o comportamento padrão
      }
    };
    document.addEventListener("keydown", preventEscClose);
    modal.showModal();
 
    return new Promise((resolve) => {
      const buttons = modal.querySelectorAll("button"); // Corrige o seletor
      
      const handleClick = (event) => {
        const selectedPiece = event.target.dataset.piece;
        buttons.forEach(btn => btn.removeEventListener("click", handleClick));
        modal.close();
        
        // Reseta a posição do modal para próximo uso
        modal.style.left = '';
        modal.style.top = '';
        
        resolve(selectedPiece); // Retorna apenas o tipo da peça selecionada
      };

      buttons.forEach(btn => {
        btn.addEventListener("click", handleClick);
      });
    });
  }

  canCaptureEnemyPiece(board, piece, toRow, toCol) {
    const targetPiece = board[toRow][toCol];
    return targetPiece && targetPiece.color !== piece.color;
  }

  showPromotionDialog(color, row, col, pieceToSymbol) {
    const modal = document.getElementById("promotion-modal");

    // Calcula a posição do modal
    const square = document.getElementById(`${row}-${col}`);
    const squareRect = square.getBoundingClientRect();
    
    // Posiciona o modal próximo ao quadrado do peão
    modal.style.left = `${squareRect.left}px`;
    modal.style.top = color === 'white' ? 
      `${squareRect.top - 60}px` : 
      `${squareRect.bottom}px`;
    
    modal.showModal();

    return new Promise((resolve) => {
      const buttons = modal.querySelectorAll(".piece-btn");
      
      const handleClick = (event) => {
        const selectedPiece = event.target.dataset.piece;
        buttons.forEach(btn => btn.removeEventListener("click", handleClick));
        modal.close();
        
        // Reseta a posição do modal para próximo uso
        modal.style.left = '';
        modal.style.top = '';
        
        resolve({ type: selectedPiece, color: color });
      };

      buttons.forEach(btn => {
        btn.addEventListener("click", handleClick);
        // Atualiza o símbolo da peça no botão para a cor correta
        const piece = { type: btn.dataset.piece, color: color };
        btn.textContent = pieceToSymbol(piece);
      });
    });
  }
}

export default FunctionsFront;