import { Category } from "./types";

const API_BASE_URL = "https://yfow5aon95.execute-api.us-west-2.amazonaws.com";

export function getCategories(): Promise<Category[]> {
  return fetch(`${API_BASE_URL}/category`, { method: "GET" }).then((res) =>
    res.json()
  );
}

export function getCategorySquares(categoryId: string): Promise<string[]> {
  return fetch(`${API_BASE_URL}/category/${categoryId}/square`, {
    method: "GET",
  }).then((res) => res.json());
}

export function createNewCategory(categoryName: string): Promise<Category> {
  return fetch(`${API_BASE_URL}/category`, {
    method: "POST",
    body: JSON.stringify({ category: categoryName }),
  }).then((res) => res.json());
}
