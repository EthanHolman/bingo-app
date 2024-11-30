import pytest

from helpers.category_utils import build_category_id


@pytest.mark.parametrize(
    "test_input,expected",
    [
        ("This is a string", "this-is-a-string"),
        ("", ""),
        ("test-str", "test-str"),
        ("-something else", "something-else"),
        ("LOTS OF_CAPS", "lots-of-caps"),
        ("numero 9", "numero-9"),
        ("test 9 num", "test-9-num"),
        ("That's mine", "thats-mine"),
    ],
)
def test_build_category_id(test_input, expected):
    assert build_category_id(test_input) == expected
