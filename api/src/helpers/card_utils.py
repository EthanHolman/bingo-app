def card_from_ddb(d) -> dict:
    return {
        "id": d.get("PK").split("#")[-1],
        "name": d.get("name"),
        "category": d.get("category", ""),
        "squares": d.get("squares", []),
        "dateCreated": d.get("dateCreated", ""),
        "isComplete": d.get("isComplete", False),
    }


def validate_card_squares(squares: list[dict]):
    if len(squares) != 25:
        raise ValueError(f"should have 25 squares, instead has {len(squares)}")
