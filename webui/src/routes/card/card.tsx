import { useEffect, useState } from "react";
import { BingoCard, BingoCardSquare } from "../../types";
import {
  createCard,
  getCard,
  getCategorySquares,
  updateCardSquares,
} from "../../api";
import BingoCardComponent from "../../components/bingo-board/bingo-card";
import SquareSelector from "../../components/bingo-board/square-selector";
import css from "./card.module.css";
import { BsArrowClockwise, BsHouse } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import IconButton from "../../components/icon-button/icon-button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { getRandomNumber } from "../../utils";

enum BingoBoardMode {
  Play,
  Edit,
  Create,
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

function initBlankCard(): BingoCard {
  return {
    id: "",
    name: "",
    category: "",
    squares: buildCardSquares(),
    dateCreated: "",
    isComplete: false,
  };
}

const CardRouteComponent = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const searchParamsCategory = searchParams.get("category");

  const [allSquares, setAllSquares] = useState<string[]>([]);
  const [card, setCard] = useState<BingoCard>(initBlankCard());
  const [mode, setMode] = useState(BingoBoardMode.Create);
  const [editSquareIndex, setEditSquareIndex] = useState(-1);
  const [savingCard, setSavingCard] = useState(false);

  const showEditSquare = editSquareIndex > -1;
  const takenSquareTexts = card.squares.map((y) => y.text);
  const availableSquares = allSquares.filter(
    (x) => !takenSquareTexts.includes(x)
  );

  useEffect(() => {
    if (!params.id || (params.id === "new" && !searchParamsCategory)) {
      navigate("/");
      return;
    }

    if (params.id === "new") {
      setMode(BingoBoardMode.Create);
      setCard({
        ...initBlankCard(),
        category: searchParamsCategory ?? card.category,
      });
    } else {
      setMode(BingoBoardMode.Play);
      getCard(params.id).then((card) => setCard(card));
    }
  }, [params.id]);

  useEffect(() => {
    if (card.category)
      getCategorySquares(card.category).then((res) => setAllSquares(res));
  }, [card.category]);

  const onSquareClick = (index: number) => {
    if (index === 12) return;

    switch (mode) {
      case BingoBoardMode.Edit:
      case BingoBoardMode.Create:
        setEditSquareIndex(index);
        break;
      case BingoBoardMode.Play:
        card.squares[index].checked = !card.squares[index].checked;
        setCard((old) => ({ ...old, squares: [...card.squares] }));
        saveSquareUpdatesToApi();
        break;
    }
  };

  const editCurrentSquareText = (text: string) => {
    card.squares[editSquareIndex] = { text, checked: false };
    setCard((old) => ({ ...old, squares: [...card.squares] }));
    setEditSquareIndex(-1);
  };

  const newBoardClicked = () => {
    if (window.confirm("Sure you want to reset your board?"))
      navigate(`/card/new?category=${card.category}`);
  };

  const createCardClicked = () => {
    setSavingCard(true);
    createCard(searchParamsCategory!, card.squares).then((res) => {
      setCard(res);
      setMode(BingoBoardMode.Play);
      setSavingCard(false);
      navigate(`/card/${res.id}`);
    });
  };

  const doneEditingClicked = () => {
    updateCardSquares(card.id, card.squares).then(() => {
      setMode(BingoBoardMode.Play);
    });
  };

  const saveSquareUpdatesToApi = () => {
    updateCardSquares(card.id, card.squares);
  };

  const randomizeBoardClicked = () => {
    const squares: BingoCardSquare[] = [];
    const tempAllSquares = [...allSquares];

    for (let i = 0; i < 24; i++) {
      if (i === 12) squares.push({ text: "FREE", checked: true });

      const r = getRandomNumber(0, tempAllSquares.length - 1);
      squares.push({ text: tempAllSquares.splice(r, 1)[0], checked: false });
    }

    setCard({ ...card, squares });
  };

  return (
    <>
      <header className={css.header}>
        <div className={css.buttonContainer}>
          <IconButton onClick={newBoardClicked}>
            <BsArrowClockwise />
          </IconButton>
        </div>
        <div className={css.title}>Bingo: On Patrol Live</div>
        <div className={css.buttonContainer}>
          {mode === BingoBoardMode.Play ? (
            <IconButton onClick={() => setMode(BingoBoardMode.Edit)}>
              <BsPencil />
            </IconButton>
          ) : (
            <IconButton onClick={() => navigate("/")}>
              <BsHouse />
            </IconButton>
          )}
        </div>
      </header>
      <div className={css.cardContainer}>
        <BingoCardComponent
          card={card}
          onSquareClick={onSquareClick}
          editMode={mode !== BingoBoardMode.Play}
        />
      </div>
      {showEditSquare && (
        <SquareSelector
          squares={availableSquares}
          onSelect={(text) => editCurrentSquareText(text)}
          categoryId={card.category}
        />
      )}
      {mode !== BingoBoardMode.Play && (
        <footer className={css.footer}>
          {mode === BingoBoardMode.Edit && (
            <button
              className="lgPill orange"
              type="button"
              onClick={doneEditingClicked}
            >
              Done Editing
            </button>
          )}
          {mode === BingoBoardMode.Create && (
            <>
              <button
                className="smPill orange"
                type="button"
                onClick={randomizeBoardClicked}
              >
                Randomize Board
              </button>
              <button
                className="lgPill orange"
                type="button"
                onClick={createCardClicked}
                disabled={savingCard}
              >
                {savingCard ? "Creating..." : "Create Card"}
              </button>
            </>
          )}
        </footer>
      )}
    </>
  );
};

export default CardRouteComponent;
