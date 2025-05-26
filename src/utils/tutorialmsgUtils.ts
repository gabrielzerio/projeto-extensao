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
    mensagemFinal(type: string): string {
        switch (type) {
            case "pawn":
                return `Parabéns, comandante! Você dominou o Peão, a base do exército. 
                Continue avançando e conquistando o tabuleiro!`;
            case "knight":
                return `Excelente trabalho! O Cavalo é uma peça poderosa e versátil. 
                Use sua habilidade para surpreender o inimigo!`;
            case "bishop":
                return `Bom trabalho! O Bispo é um aliado valioso. 
                Continue jogando com estratégia e você será imbatível!`;
            case "rook":
                return `Torre: A torre é uma peça forte e confiável. 
                Use-a para controlar as linhas do tabuleiro!`;
            case "queen":
                return `Rainha: A rainha é a peça mais poderosa do jogo. 
                Use-a sabiamente para dominar o campo de batalha!`;
            case "king":
                return `Rei: O rei é a peça mais importante do jogo. 
                Proteja-o a todo custo e conduza seu exército à vitória!`;
            default:
                return `Mensagem final não encontrada.`;
        }
    }
}

export default TutorialUtils;