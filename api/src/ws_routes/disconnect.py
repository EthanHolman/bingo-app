import logging
from helpers.aws import (
    get_apigw_client,
    get_apigw_endpoint_url,
    get_dynamo_table,
    get_ws_clientid,
)
from helpers.websocket_utils import ws_send_error
import settings
from boto3.dynamodb.conditions import Key

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

        table.update_item(
            Key={"PK": response["Items"][0]["PK"], "SK": "metadata"},
            UpdateExpression="REMOVE clientId",
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
