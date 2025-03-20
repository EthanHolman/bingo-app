import { API_BASE_URL } from "./settings";
import { BingoCard, BingoCardSquare, Category } from "./types";

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

export function createNewCategorySquare(
  categoryName: string,
  squareText: string
): Promise<Response> {
  return fetch(`${API_BASE_URL}/category/${categoryName}/square`, {
    method: "POST",
    body: JSON.stringify({ square: squareText }),
  });
}

export function createCard(
  categoryId: string,
  squares: BingoCardSquare[]
): Promise<BingoCard> {
  return fetch(`${API_BASE_URL}/card`, {
    method: "POST",
    body: JSON.stringify({ categoryId, squares }),
  }).then((res) => res.json());
}

export function getCard(cardId: string): Promise<BingoCard> {
  return fetch(`${API_BASE_URL}/card/${cardId}`, { method: "GET" }).then(
    (res) => res.json()
  );
}

export function updateCardSquares(
  cardId: string,
  squares: BingoCardSquare[]
): Promise<Response> {
  return fetch(`${API_BASE_URL}/card/${cardId}/squares`, {
    method: "PUT",
    body: JSON.stringify({ squares }),
  });
}
