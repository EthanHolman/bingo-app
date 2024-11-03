import boto3
from boto3.dynamodb.conditions import Key
import json


def handler(event, context):
    dynamo = boto3.resource("dynamodb")

    table = dynamo.Table("bingo-app-default-datastore")

    response = table.query(KeyConditionExpression=Key("PK").eq("category"))

    if "Count" in response and response.get("Count", 0) > 0:
        items = [y.get("SK") for y in response["Items"]]

        return json.dumps(items)
    
    return json.dumps([])
