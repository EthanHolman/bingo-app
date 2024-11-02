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

resource "aws_lambda_function" "test_lambda" {
  filename      = var.src_archive_path
  function_name = "${local.function_name}"
  role          = aws_iam_role.lambda_exec_role.arn
  handler       = "test.lambda_handler"

  # source_code_hash = data.archive_file.lambda.output_base64sha256
  source_code_hash = filebase64sha256(var.src_archive_path)

  runtime = "python3.10"
}

resource "aws_cloudwatch_log_group" "fn_logs" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14
}
