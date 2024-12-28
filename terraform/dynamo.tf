resource "aws_dynamodb_table" "app-datastore" {
  name         = "${local.resource_prefix}datastore"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "partyId"
    type = "S"
  }

  global_secondary_index {
    hash_key           = "partyId"
    name               = "party_id_client_id"
    projection_type    = "INCLUDE"
    non_key_attributes = ["PK"]
  }
}
