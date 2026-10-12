resource "aws_acm_certificate" "frontend" {
  provider = aws.us_east_1

  domain_name               = "gavronski.dev"
  subject_alternative_names = ["www.gavronski.dev"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "gavronski.dev"
    Project     = "vladlenski"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

locals {
  # ACM shares validation records between a wildcard and its base domain.
  # Group by the normalized domain, keeping keys independent of generated CNAMEs.
  certificate_validation_options = {
    for option in aws_acm_certificate.frontend.domain_validation_options :
    trimprefix(option.domain_name, "*.") => option...
  }
}

resource "aws_route53_record" "certificate_validation" {
  for_each = local.certificate_validation_options

  zone_id = aws_route53_zone.frontend.zone_id
  name    = each.value[0].resource_record_name
  type    = each.value[0].resource_record_type
  records = [each.value[0].resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "frontend" {
  provider = aws.us_east_1

  certificate_arn = aws_acm_certificate.frontend.arn
  validation_record_fqdns = [
    for record in aws_route53_record.certificate_validation : record.fqdn
  ]
}
