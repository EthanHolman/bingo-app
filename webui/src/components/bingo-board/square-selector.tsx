import { useState } from "react";
import css from "./square-selector.module.css";
import { createNewCategorySquare } from "../../api";

const SquareSelector = ({
  squares,
  onSelect,
}: {
  squares: string[];
  onSelect: (square: string) => void;
}) => {
  const [userEntry, setUserEntry] = useState("");
  const [creating, setCreating] = useState(false);

  // const matches = squares.filter((x) => x.includes(userEntry.toLowerCase()));

  const hideSubmitButton = userEntry.length === 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    createNewCategorySquare("on-patrol-live", userEntry).then(() => {
      onSelect(userEntry);
      setUserEntry("");
      setCreating(false);
    });
  };

  return (
    <div className={css.clear}>
      <div className={css.content}>
        <h2>Choose one of these:</h2>
        <ul className={css.existingSelect}>
          {squares.map((square) => (
            <li key={square} onClick={() => onSelect(square)}>
              {square}
            </li>
          ))}
        </ul>
        <form onSubmit={onSubmit}>
          <div className={css.createNew}>
            <input
              type="text"
              placeholder="Or, create your own..."
              value={userEntry}
              onChange={(e) => setUserEntry(e.currentTarget.value)}
            />
            <button
              type="submit"
              disabled={creating}
              className={`smPill orange ${hideSubmitButton && css.hidden}`}
            >
              Create!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SquareSelector;
