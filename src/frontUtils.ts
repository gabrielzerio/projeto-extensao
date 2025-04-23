import { Piece, Board, PieceColor } from './app';

class FunctionsFront {
  removeHighlight(): void {
    const squares = document.querySelectorAll("#board div");
    squares.forEach((square) => {
      square.classList.remove("highlight", "capture-highlight");
    });
  }

  showEndGame(player1Name: string, player2Name: string, currentTurn: PieceColor): void {
    const modal = document.getElementById("modal2") as HTMLDialogElement;
    const winnerMessage = document.getElementById("winnerMessage");
    if (!modal || !winnerMessage) return;

    const winner = currentTurn === "white" ? player1Name : player2Name;
    winnerMessage.textContent = `Parabéns, ${winner}! Você venceu!`;
    modal.showModal();

    const btn = document.getElementById("restartGame");
    if (btn) {
      btn.addEventListener("click", () => {
        location.reload();
      });
    }
  }

  showPlayersName(player1Name: string, player2Name: string): void {
    const modal = document.getElementById("modal1") as HTMLDialogElement;
    const divModal = document.getElementById("divModal");
    if (!modal || !divModal) return;

    const btn = document.createElement("button");
    btn.id = 'startGame';
    btn.textContent = "Começar Jogo";
    
    const divDefault = `
      <h2>Digite os nomes dos jogadores</h2>
      <input type="text" id="player1" placeholder="Jogador das peças brancas">
      <input type="text" id="player2" placeholder="Jogador das peças pretas">
    `;
  
    divModal.insertAdjacentHTML("afterbegin", divDefault);
    divModal.insertAdjacentElement("beforeend", btn);
    modal.showModal();

    btn.addEventListener("click", () => {
      const player1Input = document.getElementById("player1") as HTMLInputElement;
      const player2Input = document.getElementById("player2") as HTMLInputElement;
      if (player1Input && player2Input) {
        player1Name = player1Input.value;
        player2Name = player2Input.value;
      }
      modal.close();
    });
  }

  async showTutorial(): Promise<string> {
    const modal = document.getElementById("modal1") as HTMLDialogElement;
    const divModal = document.getElementById("divModal");
    if (!modal || !divModal) return '';

    const btnPawn = document.createElement("button");
    btnPawn.id = 'btn-pawn';
    btnPawn.dataset.piece = 'pawn';
    btnPawn.innerText = "Peão";
    
    const btnRook = document.createElement("button");
    btnRook.id = 'btn-rook';
    btnRook.dataset.piece = 'rook';
    btnRook.innerText = "Torre";
    
    divModal.appendChild(btnPawn);
    divModal.appendChild(btnRook);
    modal.showModal();
 
    return new Promise((resolve) => {
      const buttons = modal.querySelectorAll("button");
      
      const handleClick = (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const selectedPiece = target.dataset.piece || '';
        buttons.forEach(btn => btn.removeEventListener("click", handleClick));
        modal.close();
        
        modal.style.left = '';
        modal.style.top = '';
        
        resolve(selectedPiece);
      };

      buttons.forEach(btn => {
        btn.addEventListener("click", handleClick);
      });
    });
  }

  canCaptureEnemyPiece(board: Board, piece: Piece, toRow: number, toCol: number): boolean {
    const targetPiece = board[toRow][toCol];
    return Boolean(targetPiece && targetPiece.color !== piece.color);
  }

  showPromotionDialog(color: PieceColor, row: number, col: number, pieceToSymbol: (piece: Piece) => string): Promise<{ type: string, color: PieceColor }> {
    const modal = document.getElementById("promotion-modal") as HTMLDialogElement;
    if (!modal) return Promise.reject("Modal not found");

    const square = document.getElementById(`${row}-${col}`);
    if (!square) return Promise.reject("Square not found");

    const squareRect = square.getBoundingClientRect();
    
    modal.style.left = `${squareRect.left}px`;
    modal.style.top = color === 'white' ? 
      `${squareRect.top - 60}px` : 
      `${squareRect.bottom}px`;
    
    modal.showModal();

    return new Promise((resolve) => {
      const buttons = modal.querySelectorAll(".piece-btn");
      
      const handleClick = (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const selectedPiece = target.dataset.piece || '';
        buttons.forEach(btn => btn.removeEventListener("click", handleClick));
        modal.close();
        
        modal.style.left = '';
        modal.style.top = '';
        
        resolve({ type: selectedPiece, color });
      };

      buttons.forEach(btn => {
        btn.addEventListener("click", handleClick);
        if (btn instanceof HTMLElement && btn.dataset.piece) {
          const piece: Piece = { type: btn.dataset.piece as any, color, position: { row, col } };
          btn.textContent = pieceToSymbol(piece);
        }
      });
    });
  }
}

export default FunctionsFront;