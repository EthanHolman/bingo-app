import { useEffect, useState } from "react";
import { getCategorySquares } from "../api";
import { BingoCard, BingoCardSquare } from "../types";
import SquareSelector from "./bingo-board/square-selector";
import BingoCardComponent from "./bingo-board/bingo-card";

enum BingoBoardMode {
  Play,
  Edit,
}

function buildCardSquares(): BingoCardSquare[] {
  const toReturn: BingoCardSquare[] = [];
  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      // middle square
      toReturn.push({ text: "FREE", checked: true });
    } else {
      toReturn.push({ text: "", checked: false });
    }
  }
  return toReturn;
}

function createCard(): BingoCard {
  return {
    id: 1,
    name: "EthansBoard",
    bingoSquares: buildCardSquares(),
  };
}

const GameManagerComponent = () => {
  const [allSquares, setAllSquares] = useState<string[]>([]);
  const [card, setCard] = useState<BingoCard>(createCard);
  const [mode, setMode] = useState(BingoBoardMode.Edit);
  const [editSquareIndex, setEditSquareIndex] = useState(-1);

  const showEditSquare = editSquareIndex > -1;
  const takenSquareTexts = card.bingoSquares.map((y) => y.text);
  const availableSquares = allSquares.filter(
    (x) => !takenSquareTexts.includes(x)
  );

  useEffect(() => {
    getCategorySquares("on-patrol-live").then((res) => setAllSquares(res));
  }, []);

  const onSquareClick = (index: number) => {
    switch (mode) {
      case BingoBoardMode.Edit:
        setEditSquareIndex(index);
        break;
      case BingoBoardMode.Play:
        card.bingoSquares[index].checked = !card.bingoSquares[index].checked;
        break;
    }
  };

  const editCurrentSquareText = (text: string) => {
    card.bingoSquares[editSquareIndex] = { text, checked: false };
    setCard((old) => ({ ...old, bingoSquares: [...card.bingoSquares] }));
    setEditSquareIndex(-1);
  };

  const debugMe = () => {
    console.log(card);
  };

  return (
    <>
      <BingoCardComponent card={card} onSquareClick={onSquareClick} />
      {showEditSquare && (
        <SquareSelector
          squares={availableSquares}
          onSelect={(text) => editCurrentSquareText(text)}
        />
      )}
      <button type="button" onClick={debugMe}>
        DebugMe
      </button>
    </>
  );
};

export default GameManagerComponent;
