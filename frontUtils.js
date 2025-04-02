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

  showPlayersName(player1Name, player2Name) {
    const modal = document.getElementById("modal1");
    modal.showModal();
    const btn = document.getElementById("startGame");
    btn.addEventListener("click", () => {
      player1Name = document.getElementById("player1").value;
      player2Name = document.getElementById("player2").value;
      modal.close();
    });
  }

  canCaptureEnemyPiece(board, piece, toRow, toCol) {
    const targetPiece = board[toRow][toCol];
    return targetPiece && targetPiece.color !== piece.color;
  }

  async showPromotionDialog(color, row, col, pieceToSymbol) {
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