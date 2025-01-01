import logging
from helpers.aws import get_apigw_client, get_apigw_endpoint_url, get_dynamo_table
from helpers.websocket_utils import ws_send_party_msg
import settings

logger = logging.getLogger(__name__)


def handler(event, context):
    try:
        client_id = event["requestContext"]["connectionId"]

        table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)
        deleted_item = table.delete_item(
            Key={"PK": f"client#{client_id}", "SK": "metadata"}, ReturnValues="ALL_OLD"
        )

        user_data = deleted_item.get("Attributes", None)

        if user_data == None:
            raise Exception(f"Unable to find client_id {client_id}")

        apigw_client = get_apigw_client(
            endpoint_url=get_apigw_endpoint_url(event["requestContext"])
        )

        # alert others in the party
        ws_send_party_msg(
            apigw_client,
            party_id=user_data.get("partyId"),
            data={
                "action": "leave_party",
                "data": {"userName": user_data.get("userName")},
            },
        )

        return {"statusCode": 200}

    except ValueError as ve:
        logger.info(str(ve))
        return {"statusCode": 400}

    except Exception as e:
        logger.error(str(e))
        return {"statusCode": 500}
