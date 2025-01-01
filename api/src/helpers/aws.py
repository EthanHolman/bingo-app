import boto3


def get_apigw_client(endpoint_url: str):
    return boto3.client(
        "apigatewaymanagementapi",
        endpoint_url=endpoint_url,
    )


def get_apigw_endpoint_url(request_context) -> str:
    return f"https://{request_context['domainName']}/{request_context['stage']}"


def get_dynamo_table(table_name: str):
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table(table_name)

    return table
