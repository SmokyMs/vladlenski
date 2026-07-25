import { useEffect, type MouseEvent, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

type HashLinkProps = {
  children: ReactNode
  className?: string
  to: string
}

function scrollToHash(hash: string) {
  const targetId = decodeURIComponent(hash.replace(/^#/, ''))
  const target = document.getElementById(targetId)

  target?.scrollIntoView({ block: 'start' })
}

function HashLink({ children, className, to }: HashLinkProps) {
  const location = useLocation()
  const destination = new URL(to, window.location.origin)

  useEffect(() => {
    if (location.hash) {
      scrollToHash(location.hash)
    }
  }, [location.pathname, location.hash])

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const isStandardClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey

    const isCurrentDestination =
      location.pathname === destination.pathname &&
      location.hash === destination.hash

    if (isStandardClick && isCurrentDestination) {
      event.preventDefault()
      scrollToHash(destination.hash)
    }
  }

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

export default HashLink
