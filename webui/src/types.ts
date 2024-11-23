export type BingoCardSquare = {
  text: string;
  checked: boolean;
};

export type BingoCard = {
  id: number;
  name: string;
  bingoSquares: BingoCardSquare[];
};

export type Category = {
  id: string;
  friendlyName: string;
};
