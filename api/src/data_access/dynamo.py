from helpers.aws import get_dynamo_table
import settings
from boto3.dynamodb.conditions import Key


def get_party_members_by_party_id(party_id):
    table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)
    response = table.query(
        IndexName=settings.DYNAMO_PARTYID_INDEX_NAME,
        KeyConditionExpression=Key("partyId").eq(party_id),
    )

    result = [{"clientId": x.get("clientId")} for x in response.get("Items", [])]

    return result
