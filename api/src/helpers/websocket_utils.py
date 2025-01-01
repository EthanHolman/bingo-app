import json
import logging
from helpers.aws import get_dynamo_table
import settings
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)


def ws_send_msg(apigw_client, recipient_id, data):
    apigw_client.post_to_connection(Data=json.dumps(data), ConnectionId=recipient_id)


def ws_send_party_msg(apigw_client, party_id, data, excluded_recipients=[]):
    table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)
    response = table.query(
        IndexName=settings.DYNAMO_PARTY_INDEX_NAME,
        KeyConditionExpression=Key("partyId").eq(party_id),
    )

    if response["Count"] > 0:
        players = filter(
            lambda a: a not in excluded_recipients,
            [x.get("PK", "").split("#")[-1] for x in response.get("Items", [])],
        )

        for player in players:
            try:
                ws_send_msg(apigw_client, recipient_id=player, data=data)
            except Exception as e:
                logger.error(str(e))
