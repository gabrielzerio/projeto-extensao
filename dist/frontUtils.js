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
        const winnerMessage = document.getElementById("winnerMessage");
        if (modal && winnerMessage) {
            winnerMessage.textContent = `Parabéns, ${winner}! Você venceu!`;
            modal.showModal();
            const btn = document.getElementById("restartGame");
            btn?.addEventListener("click", () => {
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
        const preventEscClose = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
            }
        };
        document.addEventListener("keydown", preventEscClose);
        modal.showModal();
        btn.addEventListener("click", () => {
            const player1Input = document.getElementById("player1");
            const player2Input = document.getElementById("player2");
            if (player1Input && player2Input) {
                player1Name = player1Input.value;
                player2Name = player2Input.value;
                modal.close();
            }
        });
    }
    showTutorial() {
        const modal = document.getElementById("modal1");
        const divModal = document.getElementById("divModal");
        if (!modal || !divModal)
            return Promise.reject("Modal elements not found");
        const createButton = (id, piece, text) => {
            const btn = document.createElement("button");
            btn.id = id;
            btn.dataset.piece = piece;
            btn.innerText = text;
            return btn;
        };
        const buttons = [
            createButton('btn-pawn', 'pawn', 'Peão'),
            createButton('btn-rook', 'rook', 'Torre'),
            createButton('btn-queen', 'queen', 'Dama'),
            createButton('btn-bishop', 'bishop', 'Bispo'),
            createButton('btn-knight', 'knight', 'Cavalo')
        ];
        buttons.forEach(btn => divModal.appendChild(btn));
        const preventEscClose = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
            }
        };
        document.addEventListener("keydown", preventEscClose);
        modal.showModal();
        return new Promise((resolve) => {
            const modalButtons = divModal.querySelectorAll("button");
            const handleClick = (event) => {
                const target = event.target;
                const selectedPiece = target.dataset.piece;
                modalButtons.forEach(btn => btn.removeEventListener("click", handleClick));
                modal.close();
                modal.style.left = '';
                modal.style.top = '';
                if (selectedPiece) {
                    resolve(selectedPiece);
                }
            };
            modalButtons.forEach(btn => {
                btn.addEventListener("click", handleClick);
            });
        });
    }
    canCaptureEnemyPiece(board, piece, toRow, toCol) {
        const targetPiece = board[toRow][toCol];
        return targetPiece !== null && targetPiece.color !== piece.color;
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
                const selectedPiece = target.dataset.piece;
                buttons.forEach(btn => btn.removeEventListener("click", handleClick));
                modal.close();
                modal.style.left = '';
                modal.style.top = '';
                if (selectedPiece) {
                    resolve({
                        type: selectedPiece,
                        color,
                        position: { row, col }
                    });
                }
            };
            buttons.forEach(btn => {
                btn.addEventListener("click", handleClick);
                const piece = {
                    type: (btn.dataset.piece || ''),
                    color,
                    position: { row, col }
                };
                btn.textContent = pieceToSymbol(piece);
            });
        });
    }
}
export default FunctionsFront;
//# sourceMappingURL=frontUtils.js.map