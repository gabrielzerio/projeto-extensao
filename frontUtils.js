class FunctionsFront{

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

}

export default FunctionsFront;