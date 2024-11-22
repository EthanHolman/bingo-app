import boto3
import json

from helpers.category_converter import build_category
from helpers.create_response import create_response


def handler(event, context):
    body = json.loads(event.get("body", "{}"))

    new_category = body.get("category", None)

    if not new_category:
        return create_response(400, body="Missing 'category' in request body")

    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table("bingo-app-default-datastore")

    table.put_item(Item={"PK": "category", "SK": new_category})

    return create_response(201, body=json.dumps(build_category(new_category)))
