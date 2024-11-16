variable "service_name" {
  type    = string
  default = "bingo-app"
}

variable "lambda_policy_names" {
  type = string
}

variable "api_src_zip" {
  type    = string
  default = "dist/api-src.zip"
}
