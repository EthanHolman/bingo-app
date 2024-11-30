import { useEffect, useState } from "react";
import { Category } from "../../types";
import { getCategories } from "../../api";
import css from "./category-picker.module.css";
import CreateNewCategory from "./create-new-category";
import { Link } from "react-router";

const CategoryPickerRouteComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  const onCreateNewCategory = (newCategory: Category) => {
    setCategories((old) => [...old, newCategory]);
  };

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <h1>Choose a Bingo Category</h1>
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

export default CategoryPickerRouteComponent;
