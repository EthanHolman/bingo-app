import json
import boto3
from boto3.dynamodb.conditions import Key

from helpers.create_response import create_response


def handler(event, context):
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    response = table.query(KeyConditionExpression=Key("PK").eq("category"))

    items = [y.get("SK") for y in response.get("Items", [])]

    return create_response(200, body=json.dumps(items))
