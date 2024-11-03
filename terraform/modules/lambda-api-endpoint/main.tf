data "archive_file" "lambda" {
  type        = "zip"
  source_file = var.endpoint_src_file
  output_path = "./.terraform/build/${local.function_name}.zip"
}

resource "aws_lambda_function" "lambda_fn" {
  filename         = data.archive_file.lambda.output_path
  function_name    = local.function_name
  role             = var.lambda_role
  handler          = "${var.endpoint_name}.handler"
  layers           = var.lambda_layers
  source_code_hash = filebase64sha256(data.archive_file.lambda.output_path)
  runtime          = "python3.10"
}

resource "aws_cloudwatch_log_group" "fn_logs" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14
}

resource "aws_apigatewayv2_integration" "this_integration" {
  api_id           = var.api_gw_id
  integration_type = "AWS_PROXY"

  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.lambda_fn.invoke_arn
  passthrough_behavior   = "WHEN_NO_MATCH"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "this_route" {
  api_id    = var.api_gw_id
  route_key = var.endpoint_route

  target = "integrations/${aws_apigatewayv2_integration.this_integration.id}"
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "allow_apigw_lambda" {
  statement_id  = "AllowApiGwLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_fn.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-west-2:${data.aws_caller_identity.current.account_id}:${var.api_gw_id}/*"
}
