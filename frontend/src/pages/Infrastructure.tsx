import awsArchitecture from '../assets/aws-infrastructure.svg'
import cicdDeployment from '../assets/cicd-deployment.svg'
import terraformVerification from '../assets/evidence/terraform-no-drift.png'
import productionDeployment from '../assets/evidence/production-deployment.png'
import './Infrastructure.css'

function Infrastructure() {
  return (
    <article className="infrastructure-page">
      <header className="infrastructure-section">
        <h1>Infrastructure</h1>
        <p className="infrastructure-summary">
          <strong>The AWS infrastructure, automation and engineering work behind this website.</strong>
        </p>
        <p>
          I started this project to get more hands-on experience with cloud infrastructure and deployment automation. The website is the first workload, built with React and TypeScript, but most of the engineering work has involved AWS hosting, Terraform and setting up a repeatable deployment process.
        </p>
        <p>
          Since the first version, I've moved the infrastructure into a dedicated AWS account, changed how I authenticate and manage Terraform state, introduced a Dev Container and built a GitHub Actions deployment pipeline.
        </p>
      </header>

      <section className="infrastructure-section" aria-labelledby="aws-architecture-title">
        <h2 id="aws-architecture-title">AWS Architecture</h2>
        <p>
          The frontend is built with Vite and published as static files to Amazon S3, with CloudFront handling public HTTPS requests, caching and delivery through my custom domain.
        </p>
        <p>
          I chose CloudFront with a private S3 origin because I wanted the public entry point to be separate from the storage bucket. CloudFront uses Origin Access Control (OAC) to authenticate requests to S3, while the bucket policy restricts that access to the distribution. This allows the website to be publicly accessible without enabling public access to the bucket itself.
        </p>
        <p>
          DNS is managed through Route 53, with an ACM certificate for <code>gavronski.dev</code>. The main AWS infrastructure is in <code>eu-west-2</code>, while the CloudFront certificate is provisioned in <code>us-east-1</code>, as required by AWS.
        </p>
        <p>
          React Router handles navigation within the application, but opening a route such as <code>/projects</code> directly would otherwise make CloudFront request a file that doesn't exist in S3. I use a CloudFront Function to rewrite known application routes to <code>index.html</code> and redirect <code>www</code> traffic to the apex domain. Unknown paths are left unchanged, so missing files aren't silently returned as HTML.
        </p>
        <figure className="infrastructure-figure">
          <a href={awsArchitecture} target="_blank" rel="noopener noreferrer" aria-label="View full-size AWS infrastructure architecture diagram (opens in a new tab)">
            <img src={awsArchitecture} width={1633.7661129403857} height={930.7857142857142} alt="AWS architecture showing Route 53 DNS, ACM HTTPS, CloudFront with a routing Function and OAC, a private S3 origin and separate Terraform state infrastructure." loading="lazy" />
          </a>
          <figcaption>The AWS resources behind the website, including CloudFront, private S3 hosting, DNS, HTTPS and Terraform state.</figcaption>
        </figure>
      </section>

      <section className="infrastructure-section" aria-labelledby="terraform-title">
        <h2 id="terraform-title">Terraform &amp; Infrastructure Management</h2>
        <p>
          Terraform manages the application infrastructure, deployment identity and remote-state backend through separate main and bootstrap configurations.
        </p>
        <p>
          The project originally used local Terraform state. As I started managing more infrastructure, I moved the main configuration to an S3 remote backend with native state locking. This keeps the state in a consistent location rather than relying on a file on my development machine, while locking helps prevent simultaneous Terraform operations from modifying it.
        </p>
        <p>
          Terraform can't store its state in an S3 bucket that hasn't been created yet. I therefore use a small bootstrap configuration to provision the backend, while the main configuration manages the website infrastructure.
        </p>
        <p>
          The state bucket uses encryption, versioning and public access restrictions. The bootstrap root still has local state, which I back up separately.
        </p>
        <p>
          For infrastructure changes, I check the active AWS identity, review the Terraform plan and use saved plans for approved changes where appropriate. This became particularly important when I began working across separate AWS management and production accounts.
        </p>
        <figure className="infrastructure-figure infrastructure-screenshot">
          <a href={terraformVerification} target="_blank" rel="noopener noreferrer" aria-label="Open original Terraform verification screenshot (opens in a new tab)">
            <img src={terraformVerification} width={550} height={198} alt="Terminal in the infrastructure directory showing a Terraform plan reporting no changes and that the infrastructure matches the configuration." loading="lazy" />
          </a>
          <figcaption>Production Terraform plan, 19 October 2026. No changes detected.</figcaption>
        </figure>
        <p className="infrastructure-sources">
          <strong>Source:</strong>{' '}
          <a href="https://github.com/SmokyMs/vladlenski/tree/main/infrastructure">Production Terraform configuration</a>{' · '}
          <a href="https://github.com/SmokyMs/vladlenski/tree/main/infrastructure/bootstrap">Bootstrap configuration</a>
        </p>
      </section>

      <section className="infrastructure-section" aria-labelledby="deployment-title">
        <h2 id="deployment-title">CI/CD &amp; Deployment</h2>
        <p>I use GitHub Actions for both continuous integration and frontend deployment, but they run separately.</p>
        <p>
          Before introducing the deployment workflow, publishing the site involved building it locally, uploading files to S3 and invalidating CloudFront manually. I moved those steps into GitHub Actions so releases follow the same process each time.
        </p>
        <p>
          CI runs automatically on pushes and pull requests to <code>main</code>. It installs dependencies, runs ESLint, builds the React application and builds a Docker image. The Docker step checks that the image builds successfully; it doesn't run application tests inside the container.
        </p>
        <p>
          Production deployment is manually triggered. I chose this because I wanted to commit and validate changes without publishing every change to the live website. It gives me a separate point at which to decide that a version is ready for production.
        </p>
        <p>
          The deployment workflow supports dry runs, with that option enabled by default. For a real deployment, it builds the selected commit, validates the generated files and authenticates to AWS using GitHub OIDC.
        </p>
        <p>
          I chose OIDC because it allows GitHub Actions to obtain temporary AWS credentials through STS instead of storing long-lived access keys in GitHub Secrets. The workflow assumes a dedicated IAM role with permissions scoped to the frontend S3 bucket and the required CloudFront invalidation operations, keeping deployment access separate from infrastructure administration.
        </p>
        <figure className="infrastructure-figure">
          <a href={cicdDeployment} target="_blank" rel="noopener noreferrer" aria-label="View full-size CI/CD and deployment architecture diagram (opens in a new tab)">
            <img src={cicdDeployment} width={1476.7751970485183} height={943.930852450177} alt="CI/CD architecture showing automatic GitHub Actions checks, manual production deployment, OIDC and STS authentication, ordered S3 publishing and CloudFront verification." loading="lazy" />
          </a>
          <figcaption>Automatic CI checks, the manually triggered production deployment workflow and the AWS authentication and publishing process.</figcaption>
        </figure>
        <p>
          The workflow uploads content-hashed assets first, followed by other static files, and publishes <code>index.html</code> last. This reduces the chance of a new HTML file referencing assets that haven't been uploaded yet.
        </p>
        <p>
          After publishing, it creates targeted CloudFront invalidations, waits for them to complete and retrieves the published files over HTTPS to compare their contents with the build artifacts. It also verifies that the supported application routes return the expected HTML.
        </p>
        <figure className="infrastructure-figure infrastructure-screenshot">
          <a href={productionDeployment} target="_blank" rel="noopener noreferrer" aria-label="Open original successful production deployment screenshot (opens in a new tab)">
            <img src={productionDeployment} width={1136} height={813} alt="GitHub Actions production deployment summary showing a real deployment with successful publishing, completed CloudFront invalidation and successful live verification." loading="lazy" />
          </a>
          <figcaption>GitHub Actions deployment summary showing successful publishing, CloudFront invalidation and live content verification.</figcaption>
        </figure>
        <p className="infrastructure-sources">
          <strong>Source:</strong>{' '}
          <a href="https://github.com/SmokyMs/vladlenski/blob/main/.github/workflows/frontend-ci.yml">Frontend CI workflow</a>{' · '}
          <a href="https://github.com/SmokyMs/vladlenski/blob/main/.github/workflows/frontend-deploy.yml">Production deployment workflow</a>
        </p>
      </section>

      <section className="infrastructure-section" aria-labelledby="challenges-title">
        <h2 id="challenges-title">Engineering Challenges</h2>
        <h3>AWS account separation and authentication</h3>
        <p>
          I initially provisioned the frontend infrastructure in my AWS Organizations management account, using local Terraform state and an IAM user with an access key. This was enough to get the first S3 resources running, but it wasn't the account structure I wanted to keep as the project grew.
        </p>
        <p>
          I later moved the website infrastructure into a dedicated production account, leaving the management account for organisation and identity administration. I also switched to IAM Identity Center (SSO) for temporary credentials and moved the main Terraform state to S3.
        </p>
        <p>
          Separating the accounts provides a clearer boundary between organisation administration and application infrastructure. Using SSO also means I don't need a long-lived IAM access key for normal administrative work.
        </p>
        <p>
          During the migration, I accidentally reused an AWS CLI profile that ended up pointing to the management account instead of production. I corrected the configuration and verified both account identities with <code>aws sts get-caller-identity</code> before continuing with Terraform.
        </p>
        <p>After verifying the new setup, I retired the original IAM user and access key.</p>

        <h3>Moving development into a Dev Container</h3>
        <p>
          I initially worked with development tools installed directly on my Windows machine. I later moved to a Linux-based VS Code Dev Container to keep the project's tooling defined in the repository and reduce differences between development environments.
        </p>
        <p>
          The migration exposed a few problems. Docker initially couldn't start the container because WSL integration wasn't enabled. Once it was running, Git reported unexpected file changes caused by Windows and Linux line-ending differences.
        </p>
        <p>
          I added a <code>.gitattributes</code> policy to standardise line endings. Terraform also needed reinitialising because its existing provider cache contained a Windows binary that couldn't run in Linux.
        </p>
        <p>The Dev Container now provides Node.js, Terraform, AWS CLI and TFLint, with the configuration stored in the repository.</p>
        <p className="infrastructure-sources">
          <strong>Source:</strong>{' '}
          <a href="https://github.com/SmokyMs/vladlenski/commit/80940e3">Dev Container implementation</a>
        </p>

        <h3>DNS propagation and troubleshooting</h3>
        <p>
          After moving DNS management to Route 53, the website initially appeared inaccessible from my development environment, even though Terraform had completed successfully.
        </p>
        <p>Some DNS resolvers were still returning the previous registrar's parking addresses, while others were already resolving to CloudFront.</p>
        <p>I compared DNS responses and used <code>curl --resolve</code> to test CloudFront with the correct hostname and TLS verification.</p>
        <p>
          The tests confirmed that CloudFront, HTTPS and the application routes were working. The issue was stale DNS resolution, so there was no need to recreate the certificate or change the distribution.
        </p>
      </section>

      <section className="infrastructure-section" aria-labelledby="next-steps-title">
        <h2 id="next-steps-title">Next Steps</h2>
        <p>
          I plan to test the workflow's rollback procedure against a failed release. It currently supports deploying an earlier commit, but I haven't exercised a full production recovery scenario.
        </p>
        <p>
          I also plan to introduce basic monitoring and experiment with a small API-based feature, potentially using AWS Lambda and API Gateway. This would give me an opportunity to work with API requests, error handling and serverless infrastructure beyond the current static website.
        </p>
        <p>
          The Terraform configuration, GitHub Actions workflows and development environment are available in the <a href="https://github.com/SmokyMs/vladlenski">GitHub repository</a>.
        </p>
      </section>
    </article>
  )
}

export default Infrastructure
