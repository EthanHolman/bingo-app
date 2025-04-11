export type BingoCardSquare = {
  text: string;
  checked: boolean;
};

export type BingoCard = {
  id: string;
  name: string;
  category: string;
  squares: BingoCardSquare[];
  dateCreated: string;
  isComplete: boolean;
};

export type Category = {
  id: string;
  friendlyName: string;
};

export type MenuItem = {
  text: string;
  icon?: JSX.Element;
  onClick: () => void;
};
