import boto3
import json

from helpers.create_response import create_response


def handler(event, context):
    body = json.loads(event.get("body", "{}"))
    path_params = event.get("pathParameters", {})

    category = path_params.get("category", None)
    square = body.get("square", None)

    if not category:
        return create_response(400, "Missing category")

    if not square:
        return create_response(400, "Missing square value")

    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    # ensure category is added to 'category' collection
    verify = table.get_item(Key={"PK": "category", "SK": category})
    if "Item" not in verify:
        return create_response(400, f"category {category} does not exist yet")

    # add square to category
    table.put_item(Item={"PK": f"category#{category}", "SK": square})

    return create_response(201, None)
