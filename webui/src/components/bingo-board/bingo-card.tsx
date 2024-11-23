import css from "./bingo-card.module.css";
import { BingoCard } from "../../types";

const BingoCardComponent = ({
  card,
  onSquareClick,
  editMode,
}: {
  card: BingoCard;
  onSquareClick: (index: number) => void;
  editMode: boolean;
}) => {
  return (
    <div className={css.bingoCard}>
      {card.bingoSquares.map((square, index) => (
        <div
          className={`${css.bingoSquare} ${square.checked && css.checked} ${
            editMode && css.edit
          }`}
          key={index}
          onClick={() => onSquareClick(index)}
        >
          <div className={css.text}>{square.text}</div>
        </div>
      ))}
    </div>
  );
};

export default BingoCardComponent;
