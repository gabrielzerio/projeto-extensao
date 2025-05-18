import { Position, Board } from './models/types';
import { PieceFactory } from './models/PieceFactory';

class FunctionsTutorial {
    tutorialPawn(blackPositions: Position, whitePositions: Position, board: Board): void {
        const pawnW = PieceFactory.createPiece('pawn', 'white', whitePositions);
        board[whitePositions.row][whitePositions.col] = pawnW;

        const pawnB = PieceFactory.createPiece('pawn', 'black', blackPositions);
        board[blackPositions.row][blackPositions.col] = pawnB;
    }

    tutorialKnight(
        blackPositions: Position,
        whitePositions: Position,
        whitePawns: Position,
        board: Board
    ): void {
        const whiteKnight = PieceFactory.createPiece('knight', 'white', whitePositions);
        board[whitePositions.row][whitePositions.col] = whiteKnight;

        const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
        board[whitePawns.row][whitePawns.col] = whitePawn;

        const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
        board[blackPositions.row][blackPositions.col] = blackPawn;
    }

    tutorialBishop(
        blackPositions: Position,
        whitePositions: Position,
        whiteKing: Position,
        p1: Position,
        p2: Position,
        p3: Position,
        p4: Position,
        p5: Position,
        p6: Position,
        p7: Position,
        board: Board
    ): void {
        const whiteBishop = PieceFactory.createPiece('bishop', 'white', whitePositions);
        board[whitePositions.row][whitePositions.col] = whiteBishop;

        const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
        board[blackPositions.row][blackPositions.col] = blackPawn;

        const king = PieceFactory.createPiece('king', 'white', whiteKing);
        board[whiteKing.row][whiteKing.col] = king;

        const pawn1 = PieceFactory.createPiece('rook', 'black', p1);
        board[p1.row][p1.col] = pawn1;

        const pawn2 = PieceFactory.createPiece('pawn', 'black', p2);
        board[p2.row][p2.col] = pawn2;

        const pawn3 = PieceFactory.createPiece('pawn', 'black', p3);
        board[p3.row][p3.col] = pawn3;

        const pawn4 = PieceFactory.createPiece('king', 'black', p4);
        board[p4.row][p4.col] = pawn4;

        const pawn5 = PieceFactory.createPiece('pawn', 'black', p5);
        board[p5.row][p5.col] = pawn5;

        const pawn6 = PieceFactory.createPiece('pawn', 'black', p6);
        board[p6.row][p6.col] = pawn6;

        const pawn7 = PieceFactory.createPiece('pawn', 'black', p7);
        board[p7.row][p7.col] = pawn7;
    }

    tutorialRook(
        blackPositions: Position,
        whitePositions: Position,
        whitePawns: Position,
        board: Board
    ): void {
        const whiteRook = PieceFactory.createPiece('rook', 'white', whitePositions);
        board[whitePositions.row][whitePositions.col] = whiteRook;

        const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
        board[whitePawns.row][whitePawns.col] = whitePawn;

        const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
        board[blackPositions.row][blackPositions.col] = blackPawn;
    }

    tutorialQueen(
        blackPositions: Position,
        whitePositions: Position,
        whitePawns: Position,
        board: Board
    ): void {
        const whiteQueen = PieceFactory.createPiece('queen', 'white', whitePositions);
        board[whitePositions.row][whitePositions.col] = whiteQueen;

        const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
        board[whitePawns.row][whitePawns.col] = whitePawn;

        const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
        board[blackPositions.row][blackPositions.col] = blackPawn;
    }

    tutorialKing(
        blackPositions: Position,
        whitePositions: Position,
        whitePawns: Position,
        board: Board
    ): void {
        const whiteKing = PieceFactory.createPiece('king', 'white', whitePositions);
        board[whitePositions.row][whitePositions.col] = whiteKing;

        const whitePawn = PieceFactory.createPiece('pawn', 'white', whitePawns);
        board[whitePawns.row][whitePawns.col] = whitePawn;

        const blackPawn = PieceFactory.createPiece('pawn', 'black', blackPositions);
        board[blackPositions.row][blackPositions.col] = blackPawn;
    }
}

export default FunctionsTutorial;