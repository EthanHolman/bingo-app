locals {
  function_name = "${var.resource_prefix}ws-${replace(var.route_name, "$", "")}"
}
