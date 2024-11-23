import { useEffect, useState } from "react";
import { BingoCard, BingoCardSquare } from "../../types";
import { getCategorySquares } from "../../api";
import BingoCardComponent from "../../components/bingo-board/bingo-card";
import SquareSelector from "../../components/bingo-board/square-selector";
import css from "./card.module.css";
import { BsArrowClockwise } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import IconButton from "../../components/icon-button/icon-button";

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

const LS_KEY = "alpha-card-state";

function getExistingCard(): BingoCard | undefined {
  const existingCard = localStorage.getItem(LS_KEY);
  if (existingCard) return JSON.parse(existingCard);
}

function saveCard(card: BingoCard): void {
  localStorage.setItem(LS_KEY, JSON.stringify(card));
}

function initCard(): BingoCard {
  const existingCard = getExistingCard();

  return existingCard ?? createCard();
}

const CardRouteComponent = () => {
  const [allSquares, setAllSquares] = useState<string[]>([]);
  const [card, setCard] = useState<BingoCard>(initCard());
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
        setCard((old) => ({ ...old, bingoSquares: [...card.bingoSquares] }));
        break;
    }

    saveCard(card);
  };

  const editCurrentSquareText = (text: string) => {
    card.bingoSquares[editSquareIndex] = { text, checked: false };
    setCard((old) => ({ ...old, bingoSquares: [...card.bingoSquares] }));
    setEditSquareIndex(-1);

    saveCard(card);
  };

  return (
    <>
      <header className={css.header}>
        <div className={css.buttonContainer}>
          <IconButton>
            <BsArrowClockwise />
          </IconButton>
        </div>
        <div className={css.title}>Bingo: On Patrol Live</div>
        <div className={css.buttonContainer}>
          {mode === BingoBoardMode.Play && (
            <IconButton onClick={() => setMode(BingoBoardMode.Edit)}>
              <BsPencil />
            </IconButton>
          )}
        </div>
      </header>
      <div className={css.cardContainer}>
        <BingoCardComponent
          card={card}
          onSquareClick={onSquareClick}
          editMode={mode === BingoBoardMode.Edit}
        />
      </div>
      {showEditSquare && (
        <SquareSelector
          squares={availableSquares}
          onSelect={(text) => editCurrentSquareText(text)}
        />
      )}
      {mode === BingoBoardMode.Edit && (
        <footer className={css.footer}>
          <button
            className="lgPill orange"
            type="button"
            onClick={() => setMode(BingoBoardMode.Play)}
          >
            Let's BINGO!
          </button>
        </footer>
      )}
    </>
  );
};

export default CardRouteComponent;
