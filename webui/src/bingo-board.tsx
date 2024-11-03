import { useState } from "react";
import { BingoBoard, BingoSquare } from "./types";
import { getRandomNumber } from "./utils";
import "./bingo-board.css"

function getText(): string {
  switch (getRandomNumber(0, 3)) {
    case 0:
      return "Dan makes bad joke";
    case 1:
      return "DUI";
    case 2:
      return "High speed chase";
    default:
      return "whoa..";
  }
}

function buildBingoSquares(): BingoSquare[] {
  const toReturn: BingoSquare[] = [];
  for (let id = 0; id < 25; id++) {
    toReturn.push({ id, text: getText(), checked: false });
  }
  return toReturn;
}

function createMockBoard(): BingoBoard {
  return {
    id: 1,
    name: "EthansBoard",
    bingoSquares: buildBingoSquares(),
  };
}

export default () => {
  const [bingoBoard, setBingoBoard] = useState<BingoBoard>(createMockBoard);
  return (
    <div className="bingo-board">
      {bingoBoard.bingoSquares.map((square) => (
        <div className="bingo-square" key={square.id}>
          {square.text}
        </div>
      ))}
    </div>
  );
};
