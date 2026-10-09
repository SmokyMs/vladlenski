output "cloudfront_distribution_id" {
  description = "Frontend CloudFront distribution ID."
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "Default CloudFront domain name for the frontend."
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_url" {
  description = "Public HTTPS URL for the frontend."
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
