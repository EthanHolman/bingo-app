import "./bingo-card.css";
import { BingoCard } from "../../types";

const BingoCardComponent = ({
  card,
  onSquareClick,
}: {
  card: BingoCard;
  onSquareClick: (index: number) => void;
}) => {
  return (
    <div className="bingo-card">
      {card.bingoSquares.map((square, index) => (
        <div
          className={`bingo-square ${square.checked && "checked"}`}
          key={index}
          onClick={() => onSquareClick(index)}
        >
          {square.text}
        </div>
      ))}
    </div>
  );
};

export default BingoCardComponent;
