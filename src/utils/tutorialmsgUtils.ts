class TutorialUtils {
    mensagemTutorial(type: string): string {
        switch (type) {
            case "pawn":
                return "Peão: O peão se move para frente uma casa, mas captura na diagonal.";
            case "knight":
                return "Cavalo: O cavalo se move em L.";
            case "bishop":
                return "Bispo: O bispo se move em diagonais.";
            case "rook":
                return "Torre: A torre se move em linhas retas.";
            case "queen":
                return "Rainha: A rainha se move em qualquer direção.";
            case "king":
                return "Rei: O rei se move uma casa em qualquer direção.";
            default:
                return "Tutorial não encontrado.";
        }
    }
}

export default TutorialUtils;