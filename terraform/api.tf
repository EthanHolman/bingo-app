data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../api/"
  output_path = "./.terraform/lambda_function_payload.zip"
}

module "api" {
  source = "./modules/lambda-api"

  resource_prefix     = local.resource_prefix
  lambda_policy_names = var.lambda_policy_names
  src_archive_path    = data.archive_file.lambda.output_path

  api_endpoints = {
    "get_category" = "GET /category"
  }
}
