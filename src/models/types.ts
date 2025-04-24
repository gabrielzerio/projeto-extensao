export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

export interface Position {
    row: number;
    col: number;
  }

export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: Position;
  hasMoved?: boolean;
}

export interface EnPassantTarget {
    row: number;
    col: number;
  }

export type Board = (Piece | null)[][];
