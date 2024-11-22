export type BingoSquare = {
  text: string;
  checked: boolean;
};

export type BingoBoard = {
  id: number;
  name: string;
  bingoSquares: BingoSquare[];
};

export type Category = {
  id: string;
  friendlyName: string;
};
