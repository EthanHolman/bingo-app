variable "lambda_policy_names" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "api_src_path" {
  type = string
}

variable "api_endpoints" {
  type = map(any)
}
