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

resource "aws_apigatewayv2_api" "api" {
  name          = "${var.resource_prefix}api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}


module "endpoints" {
  source = "../lambda-api-endpoint"

  for_each = var.api_endpoints

  api_gw_id        = aws_apigatewayv2_api.api.id
  lambda_role      = aws_iam_role.lambda_exec_role.arn
  src_archive_path = var.src_archive_path
  resource_prefix  = var.resource_prefix

  endpoint_name  = each.key
  endpoint_route = each.value
}