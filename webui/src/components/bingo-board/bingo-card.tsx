import css from "./bingo-card.module.css";
import { BingoCard } from "../../types";
import Spinner from "../spinner/spinner";
import { Text } from "@mantine/core";

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
          <Text size="xs" className={css.text}>
            {square.text}
          </Text>
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
