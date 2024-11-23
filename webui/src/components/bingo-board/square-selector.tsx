import { useState } from "react";
import classes from "./square-selector.module.css";
import { createNewCategorySquare } from "../../api";

const SquareSelector = ({
  squares,
  onSelect,
}: {
  squares: string[];
  onSelect: (square: string) => void;
}) => {
  const [selection, setSelection] = useState(squares[0]);
  const [userEntry, setUserEntry] = useState("");
  const [creating, setCreating] = useState(false);

  // const matches = squares.filter((x) => x.includes(userEntry.toLowerCase()));

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
    <div className={classes.selectorContainer}>
      <select value={selection} onChange={(e) => setSelection(e.target.value)}>
        {squares.map((square) => (
          <option key={square} value={square}>
            {square}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => onSelect(selection)}>
        Use This!
      </button>
      <div>--or--</div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Create your own..."
          value={userEntry}
          onChange={(e) => setUserEntry(e.currentTarget.value)}
        />
        <button type="submit" disabled={creating}>
          Create New
        </button>
      </form>
    </div>
  );
};

export default SquareSelector;
