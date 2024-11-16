module "api" {
  source = "./modules/lambda-api"

  resource_prefix     = local.resource_prefix
  lambda_policy_names = var.lambda_policy_names
  api_src_zip         = "${path.module}/../${var.api_src_zip}"

  api_endpoints = {
    "get_category" = {
      route    = "GET /category",
      filename = "${path.module}/../api/src/endpoints/get_category.py"
    },
    "post_category" = {
      route    = "POST /category",
      filename = "${path.module}/../api/src/endpoints/post_category.py"
    },
    "post_category_square" = {
      route    = "POST /category/{category}/square",
      filename = "${path.module}/../api/src/endpoints/post_category_square.py"
    },
    "get_category_square" = {
      route    = "GET /category/{category}/square",
      filename = "${path.module}/../api/src/endpoints/get_category_square.py"
    }
  }
}
