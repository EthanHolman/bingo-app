import boto3


api_client = boto3.client("apigatewaymanagementapi")


def handler(event, context):
    print(event)
    print(context)

    try:
        dynamo = boto3.resource("dynamodb")
        table = dynamo.Table("bingo-app-default-datastore")

        client_id = event["requestContext"]["connectionId"]

        table.delete_item(Key={"PK": f"client#{client_id}", "SK": "metadata"})

        # alert others in the party

        return {"statusCode": 200}

    except ValueError as ve:
        print(ve)
        return {"statusCode": 400}

    except Exception as e:
        print(e)
        return {"statusCode": 500}
