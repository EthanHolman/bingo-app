def to_friendly_name(unfriendly_name: str) -> str:
    return " ".join([x[0].upper() + x[1:] for x in unfriendly_name.split("-")])
