import json
import logging
from data_access.dynamo import get_party_members_by_party_id

logger = logging.getLogger(__name__)


def ws_send_msg(apigw_client, recipient_id, data):
    apigw_client.post_to_connection(Data=json.dumps(data), ConnectionId=recipient_id)


def ws_send_error(apigw_client, recipient_id, error: str):
    apigw_client.post_to_connection(
        Data=json.dumps({"error": error}), ConnectionId=recipient_id
    )


def ws_send_party_msg(apigw_client, party_id, data, excluded_recipients=[]):
    party_members = get_party_members_by_party_id(party_id)
    if len(party_members) > 0:
        players = filter(
            lambda a: len(a.get("clientId")) > 0
            and a.get("clientId") not in excluded_recipients,
            party_members,
        )

        for player in players:
            try:
                ws_send_msg(
                    apigw_client, recipient_id=player.get("clientId"), data=data
                )
            except Exception as e:
                logger.error(str(e))
