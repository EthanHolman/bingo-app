import { ChangeEvent, useState } from "react";
import { Category } from "../../types";
import { createNewCategory } from "../../api";
import { ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { BsX } from "react-icons/bs";

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
        <Button
          variant="filled"
          color="orange"
          onClick={() => setMode(Mode.UserEntry)}
        >
          Create New Category!
        </Button>
      )}
      {[Mode.UserEntry, Mode.Creating].includes(mode) && (
        <form onSubmit={onSubmit}>
          <Group>
            <TextInput
              aria-label="New category name"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={onNewCategoryNameChange}
              disabled={mode === Mode.Creating}
            />
            <Button
              variant="filled"
              color="orange"
              type="submit"
              loading={mode === Mode.Creating}
            >
              Create
            </Button>
            <ActionIcon
              variant="subtle"
              aria-label="Close category name creation"
              onClick={() => setMode(Mode.Default)}
            >
              <BsX />
            </ActionIcon>
          </Group>
        </form>
      )}
    </>
  );
};

export default CreateNewCategory;
