import { useEffect, useState } from "react";
import { Category } from "../../types";
import { getCategories } from "../../api";
import { Link } from "react-router-dom";
import "./category-picker.css";
import CreateNewCategory from "./create-new-category";

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
      <h1>Choose a Category:</h1>
      {loaded && (
        <ul className="categories">
          {categories.map((category) => (
            <Link key={category.id} to="/card" className="category-link">
              {category.friendlyName}
            </Link>
          ))}
          <div className="category-link">
            <CreateNewCategory onCreateNewCategory={onCreateNewCategory} />
          </div>
        </ul>
      )}
      {!loaded && <div>Loading categories...</div>}
    </>
  );
};

export default CategoryPickerRouteComponent;
