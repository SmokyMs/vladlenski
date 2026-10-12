resource "aws_iam_openid_connect_provider" "github_actions" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  tags = {
    Name        = "vladlenski-github-actions-oidc"
    Project     = "vladlenski"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role" "github_actions_deploy_prod" {
  name = "vladlenski-github-actions-deploy-prod"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github_actions.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub" = "repo:SmokyMs/vladlenski:environment:production"
        }
      }
    }]
  })

  tags = {
    Name        = "vladlenski-github-actions-deploy-prod"
    Project     = "vladlenski"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_policy" "github_actions_deploy_prod" {
  name = "vladlenski-github-actions-deploy-prod"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = aws_s3_bucket.frontend.arn
      },
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject"]
        Resource = "${aws_s3_bucket.frontend.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"]
        Resource = aws_cloudfront_distribution.frontend.arn
      }
    ]
  })

  tags = {
    Name        = "vladlenski-github-actions-deploy-prod"
    Project     = "vladlenski"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_iam_role_policy_attachment" "github_actions_deploy_prod" {
  role       = aws_iam_role.github_actions_deploy_prod.name
  policy_arn = aws_iam_policy.github_actions_deploy_prod.arn
}
