def create_response(status_code: int, body):
    return {
        "cookies": [],
        "isBase64Encoded": False,
        "statusCode": status_code,
        "headers": {"content-type": "application/json"},
        "body": body,
    }
