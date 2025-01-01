# Common
variable "api_gw_id" {
  type = string
}

variable "lambda_role" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "lambda_layers" {
  type = list(string)
}

variable "lambda_shared_env_vars" {
  type = map(any)
}

# Endpoint-specific
variable "endpoint_name" {
  type = string
}

variable "endpoint_route" {
  type = string
}

variable "endpoint_src_file" {
  type = string
}
