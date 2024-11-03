module "api" {
  source = "./modules/lambda-api"

  resource_prefix     = local.resource_prefix
  lambda_policy_names = var.lambda_policy_names
  api_src_path        = "${path.module}/../api/venv"

  api_endpoints = {
    "get_category" = {
      route    = "GET /category",
      filename = "${path.module}/../api/endpoints/get_category.py"
    },
    "post_category" = {
      route    = "POST /category",
      filename = "${path.module}/../api/endpoints/post_category.py"
    }
  }
}
