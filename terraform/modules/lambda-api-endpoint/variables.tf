# Common
variable "api_gw_id" {
  type = string
}

variable "lambda_role" {
  type = string
}

variable "src_archive_path" {
  type = string
}

variable "resource_prefix" {
  type = string
}

# Endpoint-specific
variable "endpoint_name" {
  type = string
}

variable "endpoint_route" {
  type = string
}
