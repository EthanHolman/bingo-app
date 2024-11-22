from helpers.kebab_case_converters import to_friendly_name


def build_category(category_name):
    return {"id": category_name, "friendlyName": to_friendly_name(category_name)}
