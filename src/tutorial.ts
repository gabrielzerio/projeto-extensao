import {Position, Board } from './models/types';
import { Piece } from './models/pieces/Piece';
import {PieceFactory} from './models/PieceFactory';


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

    tutorialBishop(type: string, blackPositions: Position, whitePositions: Position, whiteKing: Position, board: Board): void {
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