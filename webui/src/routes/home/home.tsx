import { useEffect, useState } from "react";
import { Category } from "../../types";
import { getCategories } from "../../api";
import css from "./home.module.css";
import CreateNewCategory from "./create-new-category";
import { Link } from "react-router";
import { useAtom } from "jotai";
import { CurrentTitleAtom } from "../../atoms";

const HomeRouteComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [_, setAppTitle] = useAtom(CurrentTitleAtom);

  const onCreateNewCategory = (newCategory: Category) => {
    setCategories((old) => [...old, newCategory]);
  };

  useEffect(() => {
    setAppTitle("Choose a Bingo Category");
    getCategories().then((categories) => {
      setCategories(categories);
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <ul className={css.categories}>
        {loaded && (
          <>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/card/new?category=${category.id}`}
                className={css.categoryLink}
              >
                {category.friendlyName}
              </Link>
            ))}
            <div className={css.categoryLink}>
              <CreateNewCategory onCreateNewCategory={onCreateNewCategory} />
            </div>
          </>
        )}
        {!loaded && (
          <div className={css.categoryLink}>Loading categories...</div>
        )}
      </ul>
    </>
  );
};

export default HomeRouteComponent;
