import json
import boto3
from helpers.card_utils import card_from_ddb
from helpers.create_response import create_response
from boto3.dynamodb.conditions import Key


def handler(event, context):
    path_params = event.get("pathParameters", {})

    card_id = path_params.get("cardId", None)
    if not card_id:
        return create_response(400, "missing cardId in path parameters")

    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    response = table.query(KeyConditionExpression=Key("PK").eq(f"card#{card_id}"))

    if response.get("Count", 0) == 0:
        return create_response(404, f"cardId {card_id} not found")

    item = card_from_ddb(response.get("Items")[0])

    return create_response(200, body=json.dumps(item))
