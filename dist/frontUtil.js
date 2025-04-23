class FunctionsFront {
    removeHighlight() {
        const squares = document.querySelectorAll("#board div");
        squares.forEach((square) => {
            square.classList.remove("highlight", "capture-highlight");
        });
    }
    showEndGame(player1Name, player2Name, currentTurn) {
        const modal = document.getElementById("modal2");
        const winnerMessage = document.getElementById("winnerMessage");
        if (!modal || !winnerMessage)
            return;
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
    showPlayersName(player1Name, player2Name) {
        const modal = document.getElementById("modal1");
        const divModal = document.getElementById("divModal");
        if (!modal || !divModal)
            return;
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
            const player1Input = document.getElementById("player1");
            const player2Input = document.getElementById("player2");
            if (player1Input && player2Input) {
                player1Name = player1Input.value;
                player2Name = player2Input.value;
            }
            modal.close();
        });
    }
    async showTutorial() {
        const modal = document.getElementById("modal1");
        const divModal = document.getElementById("divModal");
        if (!modal || !divModal)
            return '';
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
            const handleClick = (event) => {
                const target = event.target;
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
    canCaptureEnemyPiece(board, piece, toRow, toCol) {
        const targetPiece = board[toRow][toCol];
        return Boolean(targetPiece && targetPiece.color !== piece.color);
    }
    showPromotionDialog(color, row, col, pieceToSymbol) {
        const modal = document.getElementById("promotion-modal");
        if (!modal)
            return Promise.reject("Modal not found");
        const square = document.getElementById(`${row}-${col}`);
        if (!square)
            return Promise.reject("Square not found");
        const squareRect = square.getBoundingClientRect();
        modal.style.left = `${squareRect.left}px`;
        modal.style.top = color === 'white' ?
            `${squareRect.top - 60}px` :
            `${squareRect.bottom}px`;
        modal.showModal();
        return new Promise((resolve) => {
            const buttons = modal.querySelectorAll(".piece-btn");
            const handleClick = (event) => {
                const target = event.target;
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
                    const piece = { type: btn.dataset.piece, color, position: { row, col } };
                    btn.textContent = pieceToSymbol(piece);
                }
            });
        });
    }
}
export default FunctionsFront;
//# sourceMappingURL=frontUtil.js.map