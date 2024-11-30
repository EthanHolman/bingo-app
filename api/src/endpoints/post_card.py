import json
import boto3
from datetime import datetime

from helpers.card_utils import card_from_ddb, generate_card_id, validate_card_squares
from helpers.create_response import create_response


def handler(event, context):
    body = json.loads(event.get("body", "{}"))

    timestamp_now = datetime.today().strftime("%Y-%m-%d %H:%M:%S")

    card_name = body.get("name", None)

    category_id = body.get("categoryId")
    if not category_id:
        return create_response(400, "Missing card 'categoryId'")

    squares = body.get("squares", None)
    if not squares:
        return create_response(400, "Missing card 'squares'")

    try:
        validate_card_squares(squares)
    except ValueError as ve:
        return create_response(400, ve)

    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    card_id = generate_card_id()

    if not card_name:
        card_name = f"Card at {timestamp_now}"

    item = {
        "PK": f"card#{card_id}",
        "SK": "metadata",
        "name": card_name,
        "category": category_id,
        "squares": squares,
        "dateCreated": timestamp_now,
        "isComplete": False,
    }

    table.put_item(Item=item)

    return create_response(200, body=json.dumps(card_from_ddb(item)))
