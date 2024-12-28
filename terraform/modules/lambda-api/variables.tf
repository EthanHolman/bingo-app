variable "lambda_policy_names" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "api_src_zip" {
  type = string
}

variable "api_endpoints" {
  type = map(any)
}

variable "ws_routes" {
  type = map(any)
}
