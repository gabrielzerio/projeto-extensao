class TutorialUtils {
    mensagemTutorial(type: string): string {
        switch (type) {
            case "pawn":
                return `Saudações, comandante! Eu sou o Peão, o primeiro a marchar. 
                Avanço com coragem, uma casa por vez, ou duas ao sair da base. 
                Subestime-me e verá o inimigo cair por minhas mãos!`;
            case "knight":
                return `Avante! Eu sou o Cavalo, o salto imprevisível na guerra. 
                Meu movimento em L salta por cima das peças e surpreende o inimigo, 
                nenhuma barreira pode me deter!`;
            case "bishop":
                return `E aí, pronto pra jogar? Eu sou o Bispo! Me movo pelas diagonais e posso chegar rapidinho até o rei inimigo. 
                Joga com estratégia e a gente leva essa partida fácil!`;
            case "rook":
                return `Torre: A torre se move em linhas retas.`;
            case "queen":
                return `Rainha: A rainha se move em qualquer direção.`;
            case "king":
                return `Rei: O rei se move uma casa em qualquer direção.`;
            default:
                return `Tutorial não encontrado.`;
        }
    }
}

export default TutorialUtils;