from helpers.aws import get_apigw_client, get_apigw_endpoint_url, get_dynamo_table
from helpers.websocket_utils import ws_send_msg
import settings
import logging
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)


def handler(event, context):
    try:
        client_id = event["requestContext"]["connectionId"]

        table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)

        response = table.query(
            KeyConditionExpression=Key("PK").eq(f"client#{client_id}")
        )

        if response["Count"] != 1:
            raise ValueError(f"unable to find client_id: {client_id}")

        party_id = response["Items"][0]["partyId"]

        response = table.query(
            IndexName=settings.DYNAMO_PARTY_INDEX_NAME,
            KeyConditionExpression=Key("partyId").eq(party_id),
        )

        all_party_members = [
            {"userName": x.get("userName"), "cardId": x.get("cardId")}
            for x in response["Items"]
        ]

        apigw_client = get_apigw_client(
            endpoint_url=get_apigw_endpoint_url(event["requestContext"])
        )

        ws_send_msg(
            apigw_client,
            client_id,
            {
                "action": "initial_state",
                "data": {"partyId": party_id, "users": all_party_members},
            },
        )

        return {"statusCode": 200}

    except ValueError as ve:
        logger.info(str(ve))
        return {"statusCode": 400}

    except Exception as e:
        logger.error(str(e))
        return {"statusCode": 500}
