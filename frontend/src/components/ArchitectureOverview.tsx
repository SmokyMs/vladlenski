import architectureDiagram from '../assets/architecture-overview.svg'

function ArchitectureOverview() {
  return (
    <div className="architecture-overview">
      <span className="architecture-overview-label">
        Architecture overview
      </span>
      <a
        className="architecture-overview-link"
        href={architectureDiagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View full-size architecture diagram (opens in a new tab)"
      >
        <img
          className="architecture-overview-image"
          src={architectureDiagram}
          width={1348.799615479657}
          height={619.5}
          alt="AWS website architecture with Route 53, CloudFront and private S3."
          aria-describedby="architecture-overview-description"
        />
      </a>
      <p
        id="architecture-overview-description"
        className="architecture-overview-description"
      >
        Visitors access the website through CloudFront, which securely delivers
        content from a private S3 bucket. Terraform manages the AWS infrastructure.
      </p>
    </div>
  )
}

export default ArchitectureOverview
