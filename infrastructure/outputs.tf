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

output "route53_hosted_zone_id" {
  description = "Public hosted zone ID for gavronski.dev."
  value       = aws_route53_zone.frontend.zone_id
}

output "route53_nameservers" {
  description = "Authoritative nameservers to configure at Porkbun after deployment."
  value       = aws_route53_zone.frontend.name_servers
}

output "acm_certificate_arn" {
  description = "Frontend ACM certificate ARN in us-east-1."
  value       = aws_acm_certificate.frontend.arn
}

output "canonical_url" {
  description = "Canonical public HTTPS URL for the frontend."
  value       = "https://gavronski.dev"
}

output "github_actions_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions frontend deployments to production."
  value       = aws_iam_role.github_actions_deploy_prod.arn
}
