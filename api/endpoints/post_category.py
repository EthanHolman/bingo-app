import boto3
import json


def handler(event, context):
    print(event)
    body = json.loads(event.get("body", "{}"))
    print(body)

    new_category = body.get("category", None)

    if new_category:
        dynamo = boto3.resource("dynamodb")

        table = dynamo.Table("bingo-app-default-datastore")

        table.put_item(Item={"PK": "category", "SK": new_category})
