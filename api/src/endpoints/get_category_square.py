import boto3
from boto3.dynamodb.conditions import Key
import json

from helpers.create_response import create_response


def handler(event, context):
    path_params = event.get("pathParameters", {})

    category = path_params.get("category", None)

    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    response = table.query(KeyConditionExpression=Key("PK").eq(f"category#{category}"))

    items = [x.get("SK") for x in response.get("Items", [])]

    return create_response(200, body=json.dumps(items))
