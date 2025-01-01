import logging
from helpers.aws import get_apigw_client, get_apigw_endpoint_url, get_dynamo_table
from helpers.websocket_utils import ws_send_party_msg
from helpers.id_utils import generate_id
import settings

logger = logging.getLogger(__name__)


def handler(event, context):
    try:
        query_string_params = event.get("queryStringParameters", {})

        if "userName" not in query_string_params:
            raise ValueError("missing 'userName' in query string")

        if "cardId" not in query_string_params:
            raise ValueError("missing 'cardId' in query string")

        client_id = event["requestContext"]["connectionId"]
        user_name = query_string_params.get("userName")
        card_id = query_string_params.get("cardId")
        party_id = query_string_params.get("partyId", generate_id())

        item = {
            "PK": f"client#{client_id}",
            "SK": "metadata",
            "partyId": party_id,
            "userName": user_name,
            "cardId": card_id,
        }

        table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)
        table.put_item(Item=item)

        apigw_client = get_apigw_client(
            endpoint_url=get_apigw_endpoint_url(event["requestContext"])
        )

        # alert others in the party that someone has joined
        ws_send_party_msg(
            apigw_client=apigw_client,
            party_id=party_id,
            data={
                "action": "join_party",
                "data": {
                    "userName": user_name,
                    "cardId": card_id,
                },
            },
            # cannot send msg to client here within $connect handler
            excluded_recipients=[client_id],
        )

        return {"statusCode": 200}

    except ValueError as ve:
        logger.info(str(ve))
        return {"statusCode": 400}

    except Exception as e:
        logger.error(str(e))
        return {"statusCode": 500}
