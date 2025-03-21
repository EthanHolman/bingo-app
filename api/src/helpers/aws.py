import boto3


def get_apigw_client(endpoint_url: str):
    return boto3.client(
        "apigatewaymanagementapi",
        endpoint_url=endpoint_url,
    )


def get_apigw_endpoint_url(event) -> str:
    return f"https://{event['requestContext']['domainName']}/{event['requestContext']['stage']}"


def get_ws_clientid(event) -> str:
    return event["requestContext"]["connectionId"]


def get_dynamo_table(table_name: str):
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table(table_name)

    return table
