import {Position, Board } from './models/types';
import {PieceFactory} from './models/PieceFactory';
import { mostrarPopup } from './popUp/popupUtils';

class FunctionsTutorial {
    tutorialPawn(type: string, blackPositions: Position, whitePositions: Position, board: Board): void {

  
        
        if (whitePositions) {
            const pawn = PieceFactory.createPiece('pawn', 'white', whitePositions);
            board[whitePositions.row][whitePositions.col] = pawn;
        }

        if (blackPositions) {
            const pawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
            board[blackPositions.row][blackPositions.col] = pawn;
        }

        mostrarPopup();

    }

    tutorialKnight(type: string, blackPositions: Position, whitePositions: Position, whitePawns: Position, board: Board): void {
        if (whitePositions) {
                const whiteKnight = PieceFactory.createPiece('knight', 'white', whitePositions);
                board[whitePositions.row][whitePositions.col] = whiteKnight;               
            }
        

        if (whitePawns) {
                const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
                    board[whitePawns.row][whitePawns.col] = whitePawn; 
            }
        

        if (blackPositions) {
            const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
            board[blackPositions.row][blackPositions.col] = blackPawn; 
        }
    }

    tutorialBishop(type: string, blackPositions: Position, whitePositions: Position, whiteKing: Position,
        p1: Position, p2: Position, p3: Position, p4: Position, p5: Position, p6: Position, p7: Position, 
        board: Board): void {
        if (whitePositions) {
            const whiteBishop = PieceFactory.createPiece('bishop', 'white', whitePositions);
            board[whitePositions.row][whitePositions.col] = whiteBishop;               
        }

        if (blackPositions) {
            const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
            board[blackPositions.row][blackPositions.col] = blackPawn; 
        }

        if (whiteKing) {
            const king = PieceFactory.createPiece('king', 'white', whiteKing);
            board[whiteKing.row][whiteKing.col] = king; 
        }
           if (p1) {
            const pawn1 = PieceFactory.createPiece('rook', 'black', p1);
            board[p1.row][p1.col] = pawn1;
        } 
        if (p2) {
            const pawn2 = PieceFactory.createPiece('pawn', 'black', p2);
            board[p2.row][p2.col] = pawn2;
        }
        if (p3) {
            const pawn3 = PieceFactory.createPiece('pawn', 'black', p3);
            board[p3.row][p3.col] = pawn3;
        }
        if (p4) {
            const pawn4 = PieceFactory.createPiece('king', 'black', p4);
            board[p4.row][p4.col] = pawn4;
        }
        if (p5) {
            const pawn5 = PieceFactory.createPiece('pawn', 'black', p5);
            board[p5.row][p5.col] = pawn5;
        }
        if (p6) {
            const pawn6 = PieceFactory.createPiece('pawn', 'black', p6);
            board[p6.row][p6.col] = pawn6;
        }
        if (p7) {
            const pawn7 = PieceFactory.createPiece('pawn', 'black', p7);
            board[p7.row][p7.col] = pawn7;
        }
    }

    tutorialRook(type: string, blackPositions: Position, whitePositions: Position, whitePawns: Position, board: Board): void {
        if (whitePositions) {
            const whiteRook = PieceFactory.createPiece('rook', 'white', whitePositions);
            board[whitePositions.row][whitePositions.col] = whiteRook;               
        }

        if (whitePawns) {
            const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
            board[whitePawns.row][whitePawns.col] = whitePawn; 
        }

        if (blackPositions) {
            const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
            board[blackPositions.row][blackPositions.col] = blackPawn; 
        }
    }

    tutorialQueen(type: string, blackPositions: Position, whitePositions: Position, whitePawns: Position, board: Board): void {
        if (whitePositions) {
            const whiteQueen = PieceFactory.createPiece('queen', 'white', whitePositions);
            board[whitePositions.row][whitePositions.col] = whiteQueen;               
        }

        if (whitePawns) {
            const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
            board[whitePawns.row][whitePawns.col] = whitePawn; 
        }

        if (blackPositions) {
            const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
            board[blackPositions.row][blackPositions.col] = blackPawn; 
        }
    }

    tutorialKing(type: string, blackPositions: Position, whitePositions: Position, whitePawns: Position, board: Board): void {
        if (whitePositions) {
            const whiteKing = PieceFactory.createPiece('king', 'white', whitePositions);
            board[whitePositions.row][whitePositions.col] = whiteKing;               
        }

        if (whitePawns) {
            const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
            board[whitePawns.row][whitePawns.col] = whitePawn; 
        }

        if (blackPositions) {
            const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
            board[blackPositions.row][blackPositions.col] = blackPawn; 
        }
    }

}
export default FunctionsTutorial;