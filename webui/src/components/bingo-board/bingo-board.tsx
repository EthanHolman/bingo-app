import { useEffect, useState } from "react";
import "./bingo-board.css";
import { getRandomNumber } from "../../utils";
import { BingoBoard, BingoSquare } from "../../types";

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

const BingoBoardComponent = ({
  onSquareClick,
}: {
  onSquareClick: () => void;
}) => {
  const [bingoBoard, setBingoBoard] = useState<BingoBoard>(createMockBoard);

  useEffect(() => {
    fetch(
      "https://yfow5aon95.execute-api.us-west-2.amazonaws.com/category/on-patrol-live/square"
    ).then((res) => {
      console.log(res.json());
    });
  }, []);

  return (
    <div className="bingo-board">
      {bingoBoard.bingoSquares.map((square) => (
        <div className="bingo-square" key={square.id} onClick={onSquareClick}>
          {square.text}
        </div>
      ))}
    </div>
  );
};

export default BingoBoardComponent;
