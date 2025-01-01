locals {
  resource_prefix = "${var.service_name}-${terraform.workspace}-"

  shared_tags = {
    AppName     = var.service_name
    Environment = terraform.workspace
  }

  lambda_shared_env_vars = {
    "ENVIRONMENT" : terraform.workspace,
    "DYNAMO_TABLE_NAME" : aws_dynamodb_table.app-datastore.name
  }
}
