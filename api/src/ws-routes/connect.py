import boto3


api_client = boto3.client("apigatewaymanagementapi")


def handler(event, context):
    print(event)
    print(context)

    try:
        query_string_params = event.get("queryStringParameters", {})

        if "partyId" not in query_string_params:
            raise ValueError("partyId required in query string")
        if "playerName" not in query_string_params:
            raise ValueError("playerName required in query string")

        dynamo = boto3.resource("dynamodb")
        table = dynamo.Table("bingo-app-default-datastore")

        client_id = event["requestContext"]["connectionId"]
        party_id = query_string_params.get("partyId")
        player_name = query_string_params.get("playerName")

        item = {
            "PK": f"client#{client_id}",
            "SK": "metadata",
            "partyId": party_id,
            "playerName": player_name,
        }

        table.put_item(Item=item)

        # alert others in the party

        return {"statusCode": 200}

    except ValueError as ve:
        print(ve)
        return {"statusCode": 400}

    except Exception as e:
        print(e)
        return {"statusCode": 500}
