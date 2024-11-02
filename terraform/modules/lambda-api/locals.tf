locals {
  lambda_policy_names = split(",", var.lambda_policy_names)

  function_name = "${var.resource_prefix}test-lambda-fn"
}
