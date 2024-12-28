import boto3


def handler(event, context):
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table("bingo-app-default-datastore")

    # get clients by partyId

    # send cardChange event to all clients besides thisUser
