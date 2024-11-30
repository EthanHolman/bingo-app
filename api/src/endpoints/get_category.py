import json
import boto3
from boto3.dynamodb.conditions import Key

from helpers.category_utils import category_from_ddb
from helpers.create_response import create_response


def handler(event, context):
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    response = table.query(KeyConditionExpression=Key("PK").eq("category"))

    items = [category_from_ddb(y) for y in response.get("Items", [])]

    return create_response(200, body=json.dumps(items))
