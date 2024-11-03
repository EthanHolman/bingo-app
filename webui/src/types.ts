export type BingoSquare = {
  id: number;
  text: string;
  checked: boolean;
};

export type BingoBoard = {
  id: number;
  name: string;
  bingoSquares: BingoSquare[];
};
