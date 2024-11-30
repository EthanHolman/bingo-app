import { ChangeEvent, useState } from "react";
import { Category } from "../../types";
import { createNewCategory } from "../../api";

enum Mode {
  Default,
  UserEntry,
  Creating,
}

const CreateNewCategory = ({
  onCreateNewCategory,
}: {
  onCreateNewCategory: (newCategory: Category) => void;
}) => {
  const [mode, setMode] = useState(Mode.Default);
  const [newCategoryName, setNewCategoryName] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode(Mode.Creating);
    createNewCategory(newCategoryName).then((newlyCreatedCategory) => {
      onCreateNewCategory(newlyCreatedCategory);
      setMode(Mode.Default);
    });
  };

  const onNewCategoryNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(event.currentTarget.value);
  };

  return (
    <>
      {mode === Mode.Default && (
        <button
          className="smPill orange"
          onClick={() => setMode(Mode.UserEntry)}
        >
          Create New Category!
        </button>
      )}
      {[Mode.UserEntry, Mode.Creating].includes(mode) && (
        <div>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={onNewCategoryNameChange}
            />
            <button
              className="smPill orange"
              type="submit"
              disabled={mode === Mode.Creating}
            >
              {mode === Mode.UserEntry && "Create"}
              {mode === Mode.Creating && "Creating"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateNewCategory;
