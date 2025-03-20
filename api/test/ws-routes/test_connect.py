from unittest import mock

import pytest
from ws_routes.connect import handler


@mock.patch("ws_routes.connect.get_dynamo_table")
def test_all_params_provided_returns_200(mock_get_dynamo_table):
    mock_table = mock.Mock()
    mock_table.update_item.return_value = None
    mock_get_dynamo_table.return_value = mock_table

    event = {
        "queryStringParameters": {
            "userName": "tommy-tester",
            "cardId": "abc123",
            "partyId": "fiesta1",
        },
        "requestContext": {"connectionId": "12"},
    }

    result = handler(event, {})

    assert result["statusCode"] == 200
    mock_table.update_item.assert_called_once_with(
        Key={"PK": "card#abc123", "SK": "metadata"},
        UpdateExpression=mock.ANY,
        ExpressionAttributeValues={
            ":partyId": "fiesta1",
            ":clientId": "12",
            ":username": "tommy-tester",
        },
    )


@mock.patch("ws_routes.connect.generate_id")
@mock.patch("ws_routes.connect.get_dynamo_table")
def test_missing_party_id_is_populated(mock_get_dynamo_table, mock_generate_id):
    mock_table = mock.Mock()
    mock_table.update_item.return_value = None
    mock_get_dynamo_table.return_value = mock_table
    mock_generate_id.return_value = "fiesta5"

    event = {
        "queryStringParameters": {
            "userName": "tommy-tester",
            "cardId": "abc123",
        },
        "requestContext": {"connectionId": "12"},
    }

    result = handler(event, {})

    assert result["statusCode"] == 200
    mock_table.update_item.assert_called_once_with(
        Key={"PK": "card#abc123", "SK": "metadata"},
        UpdateExpression=mock.ANY,
        ExpressionAttributeValues={
            ":partyId": "fiesta5",
            ":clientId": "12",
            ":username": "tommy-tester",
        },
    )


@pytest.mark.parametrize(
    "input",
    [
        {
            "queryStringParameters": {
                "cardId": "abc123",
            },
            "requestContext": {"connectionId": "12"},
        },
        {
            "queryStringParameters": {
                "userName": "tommy-tester",
            },
            "requestContext": {"connectionId": "12"},
        },
    ],
)
@mock.patch("ws_routes.connect.get_dynamo_table")
def test_missing_reqd_params_returns_400(mock_get_dynamo_table, input):
    mock_get_dynamo_table.return_value.update_item.return_value = None
    result = handler(input, {})
    assert result["statusCode"] == 400
