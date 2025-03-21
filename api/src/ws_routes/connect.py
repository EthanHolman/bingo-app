import logging
from helpers.aws import get_dynamo_table, get_ws_clientid
from helpers.id_utils import generate_id
import settings
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


def handler(event, context):
    try:
        query_string_params = event.get("queryStringParameters", {})

        if "userName" not in query_string_params:
            raise ValueError("missing 'userName' in query string")

        if "cardId" not in query_string_params:
            raise ValueError("missing 'cardId' in query string")

        client_id = get_ws_clientid(event)
        user_name = query_string_params.get("userName")
        card_id = query_string_params.get("cardId")
        party_id = query_string_params.get("partyId", generate_id())

        table = get_dynamo_table(settings.DYNAMO_TABLE_NAME)
        table.update_item(
            Key={"PK": f"card#{card_id}", "SK": "metadata"},
            UpdateExpression="SET partyId = :partyId, clientId = :clientId, userName = :userName",
            ExpressionAttributeValues={
                ":partyId": party_id,
                ":clientId": client_id,
                ":userName": user_name,
            },
            ConditionExpression="attribute_exists(PK)",
        )

        return {"statusCode": 200}

    except ValueError as ve:
        logger.info(str(ve))
        return {"statusCode": 400}

    except ClientError as sad_day:
        logger.warning(str(sad_day))
        return {"statusCode": 400}

    except Exception as e:
        logger.error(str(e))
        return {"statusCode": 500}
