output "state_bucket_name" {
  description = "S3 bucket name for the production Terraform remote backend."
  value       = aws_s3_bucket.terraform_state.id
}
