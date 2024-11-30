import boto3
import json

from helpers.category_utils import build_category_id, category_from_ddb
from helpers.create_response import create_response


def handler(event, context):
    body = json.loads(event.get("body", "{}"))

    new_category = body.get("category", None)
    if not new_category:
        return create_response(400, body="Missing 'category' in request body")

    category_id = build_category_id(new_category)
    if not category_id:
        return create_response(400, body=f"Invalid category: {new_category}")

    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    ddb_item = {"PK": "category", "SK": category_id, "friendlyName": new_category}

    table.put_item(Item=ddb_item)

    return create_response(201, body=json.dumps(category_from_ddb(ddb_item)))
