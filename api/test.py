import json


def lambda_handler(event, context):
    """
    AWS Lambda handler function.

    Parameters:
    event (dict): AWS Lambda uses this parameter to pass in event data to the handler.
    context (LambdaContext): AWS Lambda uses this parameter to provide runtime information to the handler.

    Returns:
    dict: A dictionary with a status code and body, typically used to respond to an HTTP request.
    """

    # Log the received event
    print("Received event:", json.dumps(event))

    # Process the event (add your logic here)
    try:
        # Example: Retrieve 'message' from event, or use default if not provided
        message = event.get("message", "Hello from Lambda!")

        # Create a response
        response = {"statusCode": 200, "body": json.dumps({"message": message})}
    except Exception as e:
        # Log any errors
        print("Error:", str(e))

        # Return a 500 error response
        response = {"statusCode": 500, "body": json.dumps({"error": str(e)})}

    # Return the response
    return response
