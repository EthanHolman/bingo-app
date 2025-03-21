import logging
from boto3.dynamodb.conditions import Key
from helpers.aws import (
    get_apigw_client,
    get_apigw_endpoint_url,
    get_dynamo_table,
    get_ws_clientid,
)
from helpers.websocket_utils import ws_send_error, ws_send_party_msg
import settings

logger = logging.getLogger(__name__)


def handler(event, context):
    apigw_client = get_apigw_client(endpoint_url=get_apigw_endpoint_url(event))
    client_id = get_ws_clientid(event)

    try:
        table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)

        response = table.query(
            IndexName=settings.DYNAMO_CLIENTID_INDEX_NAME,
            KeyConditionExpression=Key("clientId").eq(client_id),
        )

        if response["Count"] != 1:
            raise ValueError(f"unable to find client_id: {client_id}")

        party_id = response["Items"][0]["partyId"]
        card_id = response["Items"][0]["PK"].split("#")[-1]

        ws_send_party_msg(
            apigw_client,
            party_id,
            {"action": "card_change", "data": {"cardId": card_id}},
            excluded_recipients=[client_id],
        )

        return {"statusCode": 200}

    except ValueError as ve:
        logger.warning(str(ve))
        ws_send_error(apigw_client, client_id, str(ve))
        return {"statusCode": 400}

    except Exception as e:
        logger.error(str(e))
        ws_send_error(apigw_client, client_id, str(e))
        return {"statusCode": 500}
