data "archive_file" "lambda" {
  type        = "zip"
  source_file = var.route_src_file
  output_path = "./.terraform/build/${local.function_name}.zip"
}

resource "aws_lambda_function" "lambda_fn" {
  filename         = data.archive_file.lambda.output_path
  function_name    = local.function_name
  role             = var.lambda_role
  handler          = "${replace(var.route_name, "$", "")}.handler"
  layers           = var.lambda_layers
  source_code_hash = filebase64sha256(data.archive_file.lambda.output_path)
  runtime          = "python3.10"
  timeout          = 15
}

resource "aws_cloudwatch_log_group" "fn_logs" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14
}

resource "aws_apigatewayv2_integration" "integration" {
  api_id                    = var.api_gw_id
  integration_type          = "AWS_PROXY"
  integration_method        = "POST"
  content_handling_strategy = "CONVERT_TO_TEXT"
  passthrough_behavior      = "WHEN_NO_MATCH"
  integration_uri           = aws_lambda_function.lambda_fn.invoke_arn
}

resource "aws_apigatewayv2_route" "integration" {
  api_id    = var.api_gw_id
  route_key = var.route_name
  target    = "integrations/${aws_apigatewayv2_integration.integration.id}"
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_permission" "ws_messenger_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_fn.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-west-2:${data.aws_caller_identity.current.account_id}:${var.api_gw_id}/*"
}
