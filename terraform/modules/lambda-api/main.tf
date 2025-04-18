data "aws_caller_identity" "current" {}

data "aws_iam_policy" "lambda_policies" {
  for_each = toset([
    for policy_name in local.lambda_policy_names :
    "arn:aws:iam::${data.aws_caller_identity.current.account_id}:policy/${policy_name}"
  ])

  arn = each.value
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name               = "${var.resource_prefix}lambda-exec-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  for_each   = toset([for policy in data.aws_iam_policy.lambda_policies : policy.arn])
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = each.value
}

#############
## HTTP API #
#############

resource "aws_apigatewayv2_api" "api" {
  name          = "${var.resource_prefix}api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_layer_version" "project_dependencies" {
  layer_name       = "${var.resource_prefix}project-dependencies"
  filename         = var.api_src_zip
  source_code_hash = filebase64sha256(var.api_src_zip)
}


module "endpoints" {
  source = "../lambda-api-endpoint"

  for_each = var.api_endpoints

  api_gw_id              = aws_apigatewayv2_api.api.id
  lambda_role            = aws_iam_role.lambda_exec_role.arn
  resource_prefix        = var.resource_prefix
  lambda_layers          = [aws_lambda_layer_version.project_dependencies.arn]
  lambda_shared_env_vars = var.lambda_shared_env_vars

  endpoint_name     = each.key
  endpoint_route    = each.value.route
  endpoint_src_file = each.value.filename
}

##########
# WS API #
##########

resource "aws_apigatewayv2_api" "ws_api" {
  name                       = "${var.resource_prefix}ws-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "ws_default" {
  api_id      = aws_apigatewayv2_api.ws_api.id
  name        = "$default"
  auto_deploy = true
}

module "ws_routes" {
  source = "../lambda-ws-api-route"

  for_each = var.ws_routes

  api_gw_id              = aws_apigatewayv2_api.ws_api.id
  lambda_role            = aws_iam_role.lambda_exec_role.arn
  resource_prefix        = var.resource_prefix
  lambda_layers          = [aws_lambda_layer_version.project_dependencies.arn]
  lambda_shared_env_vars = var.lambda_shared_env_vars

  route_name     = each.key
  route_src_file = each.value.filename
}
