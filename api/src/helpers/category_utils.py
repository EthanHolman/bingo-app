import re


def build_category_id(name: str) -> str:
    dashes_added = re.sub(r"[_\ ]", "-", name)
    special_chars_removed = re.sub(r"[^A-Za-z0-9-]", "", dashes_added)
    return special_chars_removed.strip("-").lower()


def category_from_ddb(d) -> dict:
    return {"id": d.get("SK"), "friendlyName": d.get("friendlyName")}
