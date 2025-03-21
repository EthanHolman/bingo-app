from helpers.aws import (
    get_apigw_client,
    get_apigw_endpoint_url,
    get_dynamo_table,
    get_ws_clientid,
)
from helpers.websocket_utils import ws_send_error, ws_send_msg, ws_send_party_msg
import settings
import logging
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)


def handler(event, context):
    apigw_client = get_apigw_client(endpoint_url=get_apigw_endpoint_url(event))
    client_id = get_ws_clientid(event)

    try:
        table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)

        this_user_response = table.query(
            IndexName=settings.DYNAMO_CLIENTID_INDEX_NAME,
            KeyConditionExpression=Key("clientId").eq(client_id),
        )

        if this_user_response["Count"] != 1:
            raise ValueError(f"unable to find client_id: {client_id}")

        party_id = this_user_response["Items"][0]["partyId"]

        all_party_members_response = table.query(
            IndexName=settings.DYNAMO_PARTYID_INDEX_NAME,
            KeyConditionExpression=Key("partyId").eq(party_id),
        )

        all_party_members = [
            {"userName": x.get("userName"), "cardId": x.get("PK").split("#")[-1]}
            for x in all_party_members_response["Items"]
        ]

        # send current state info to client
        ws_send_msg(
            apigw_client,
            client_id,
            {
                "action": "initial_state",
                "data": {"partyId": party_id, "users": all_party_members},
            },
        )

        # alert others in the party that someone has joined
        ws_send_party_msg(
            apigw_client=apigw_client,
            party_id=party_id,
            data={
                "action": "join_party",
                "data": {
                    "userName": this_user_response["Items"][0]["userName"],
                    "cardId": this_user_response["Items"][0]["PK"].split("#")[-1],
                },
            },
            # no need to tell this client about themselves joining!
            excluded_recipients=[client_id],
        )

        return {"statusCode": 200}

    except ValueError as ve:
        logger.info(str(ve))
        ws_send_error(apigw_client, client_id, str(ve))
        return {"statusCode": 400}

    except Exception as e:
        logger.error(str(e))
        ws_send_error(apigw_client, client_id, str(e))
        return {"statusCode": 500}
