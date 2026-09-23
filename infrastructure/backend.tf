terraform {
  backend "s3" {
    bucket       = "vladlenski-tfstate-prod-5afd068074e677398c8b8dff97"
    key          = "production/frontend/terraform.tfstate"
    region       = "eu-west-2"
    use_lockfile = true
    encrypt      = true
  }
}
