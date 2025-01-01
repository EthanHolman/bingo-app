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
variable "route_name" {
  type = string
}

variable "route_src_file" {
  type = string
}
