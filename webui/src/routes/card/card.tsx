import { useEffect, useState } from "react";
import { BingoCard, BingoCardSquare, MenuItem } from "../../types";
import {
  createCard,
  getCard,
  getCategorySquares,
  updateCardSquares,
} from "../../api";
import BingoCardComponent from "../../components/bingo-board/bingo-card";
import SquareSelector from "../../components/bingo-board/square-selector";
import css from "./card.module.css";
import { BsPencil } from "react-icons/bs";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { getRandomNumber } from "../../utils";
import { useAtom } from "jotai";
import { CurrentTitleAtom, ExtraMenuItemsAtom } from "../../atoms";

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
  // hooks
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const searchParamsCategory = searchParams.get("category");

  // state
  const [allSquares, setAllSquares] = useState<string[]>([]);
  const [card, setCard] = useState<BingoCard>(initBlankCard());
  const [mode, setMode] = useState(BingoBoardMode.Create);
  const [editSquareIndex, setEditSquareIndex] = useState(-1);

  // loading states
  const [savingCard, setSavingCard] = useState(false);

  // computed
  const showEditSquare = editSquareIndex > -1;
  const takenSquareTexts = card.squares.map((y) => y.text);
  const availableSquares = allSquares.filter(
    (x) => !takenSquareTexts.includes(x)
  );

  const [, setAppTitle] = useAtom(CurrentTitleAtom);
  const [, setExtraMenuItems] = useAtom(ExtraMenuItemsAtom);

  useEffect(() => {
    setAppTitle("Bingo: On Patrol Live");

    return () => {
      setExtraMenuItems([]);
    };
  }, []);

  useEffect(() => {
    const menuItems: MenuItem[] = [];

    if (mode === BingoBoardMode.Play) {
      menuItems.push({
        text: "Edit Current Card",
        onClick: () => setMode(BingoBoardMode.Edit),
        icon: <BsPencil />,
      });
    }

    setExtraMenuItems(menuItems);
  }, [mode]);

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
      setSavingCard(true);
      getCard(params.id).then((card) => {
        setCard(card);
        setSavingCard(false);
      });
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
        updateCardSquares(card.id, card.squares);
        break;
    }
  };

  const editCurrentSquareText = (text: string) => {
    card.squares[editSquareIndex] = { text, checked: false };
    setCard((old) => ({ ...old, squares: [...card.squares] }));
    setEditSquareIndex(-1);
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
      <div className={css.cardContainer}>
        <BingoCardComponent
          card={card}
          onSquareClick={onSquareClick}
          editMode={mode !== BingoBoardMode.Play}
          loading={savingCard}
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
