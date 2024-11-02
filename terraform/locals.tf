locals {
  resource_prefix = "${var.service_name}-${terraform.workspace}-"

  shared_tags = {
    AppName     = var.service_name
    Environment = terraform.workspace
  }
}
