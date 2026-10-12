resource "aws_route53_zone" "frontend" {
  name = "gavronski.dev"

  tags = {
    Name        = "gavronski.dev"
    Project     = "vladlenski"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_route53_record" "frontend_a" {
  for_each = toset(["gavronski.dev", "www.gavronski.dev"])

  zone_id = aws_route53_zone.frontend.zone_id
  name    = each.key
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "frontend_aaaa" {
  for_each = toset(["gavronski.dev", "www.gavronski.dev"])

  zone_id = aws_route53_zone.frontend.zone_id
  name    = each.key
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}
