import css from "./bingo-card.module.css";
import { BingoCard } from "../../types";
import Spinner from "../spinner/spinner";

const BingoCardComponent = ({
  card,
  onSquareClick,
  editMode,
  loading = false,
}: {
  card: BingoCard;
  onSquareClick: (index: number) => void;
  editMode: boolean;
  loading?: boolean;
}) => {
  return (
    <div className={css.bingoCard}>
      {card.squares.map((square, index) => (
        <div
          className={`${css.bingoSquare} ${square.checked && css.checked} ${
            editMode && css.edit
          } ${loading && css.loading}`}
          key={index}
          onClick={() => onSquareClick(index)}
        >
          <div className={css.text}>{square.text}</div>
        </div>
      ))}
      {loading && (
        <div className={css.cardLoading}>
          <Spinner scale={3} />
        </div>
      )}
    </div>
  );
};

export default BingoCardComponent;
