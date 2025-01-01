module "api" {
  source = "./modules/lambda-api"

  resource_prefix        = local.resource_prefix
  lambda_policy_names    = var.lambda_policy_names
  api_src_zip            = "${path.module}/../${var.api_src_zip}"
  lambda_shared_env_vars = local.lambda_shared_env_vars

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
    },
    "post_card" = {
      route    = "POST /card",
      filename = "${path.module}/../api/src/endpoints/post_card.py"
    },
    "get_card" = {
      route    = "GET /card/{cardId}",
      filename = "${path.module}/../api/src/endpoints/get_card.py"
    },
    "put_card_squares" = {
      route    = "PUT /card/{cardId}/squares",
      filename = "${path.module}/../api/src/endpoints/put_card_squares.py"
    }
  }

  ws_routes = {
    "$connect" = {
      filename = "${path.module}/../api/src/ws-routes/connect.py"
    }
    "$disconnect" = {
      filename = "${path.module}/../api/src/ws-routes/disconnect.py"
    }
    "$default" = {
      filename = "${path.module}/../api/src/ws-routes/default.py"
    }
    "card_change" = {
      filename = "${path.module}/../api/src/ws-routes/card_change.py"
    }
    "hello" = {
      filename = "${path.module}/../api/src/ws-routes/hello.py"
    }
  }
}
