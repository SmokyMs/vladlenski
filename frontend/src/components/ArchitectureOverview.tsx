import architectureDiagram from '../assets/architecture-overview.svg'

function ArchitectureOverview() {
  return (
    <div className="architecture-overview">
      <span className="architecture-overview-label">
        Architecture overview
      </span>
      <img
        className="architecture-overview-image"
        src={architectureDiagram}
        width={1348.799615479657}
        height={619.5}
        alt="AWS website architecture with Route 53, CloudFront and private S3."
        aria-describedby="architecture-overview-description"
      />
      <p
        id="architecture-overview-description"
        className="architecture-overview-description"
      >
        Visitors access the website through CloudFront, which securely delivers
        content from a private S3 bucket. Terraform manages the AWS infrastructure.
      </p>
      <a
        className="text-link"
        href={architectureDiagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View full-size diagram (opens in a new tab)"
      >
        View full-size diagram
      </a>
    </div>
  )
}

export default ArchitectureOverview
