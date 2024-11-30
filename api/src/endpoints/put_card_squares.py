import json
import boto3

from helpers.card_utils import validate_card_squares
from helpers.create_response import create_response


def handler(event, context):
    body = json.loads(event.get("body", "{}"))
    path_params = event.get("pathParameters", {})

    card_id = path_params.get("cardId", None)
    if not card_id:
        return create_response(400, "missing cardId in path parameters")

    squares = body.get("squares")
    if not squares:
        return create_response(400, "Missing 'squares' in request body")

    try:
        validate_card_squares(squares)
    except ValueError as ve:
        return create_response(400, ve)

    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    table.update_item(
        Key={"PK": f"card#{card_id}", "SK": "metadata"},
        UpdateExpression="SET squares = :squares",
        ExpressionAttributeValues={":squares": squares},
    )

    return create_response(204, None)
