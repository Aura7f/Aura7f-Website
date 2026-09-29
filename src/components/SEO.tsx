import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
}

const DEFAULT_TITLE = 'Aura-7F | BashClan 1 of Byte Bash Blitz'
const DEFAULT_DESCRIPTION = 'Aura-7F (Aura 7f / Aura) is BashClan 1 of 4 BashClans in Byte Bash Blitz (ByteBashBlitz). Home of the Bashers. Join us for tech events, hackathons, open-source projects, and coding challenges.'
const DEFAULT_KEYWORDS = 'aura7f, aura 7f, aura, aura7f bashclan, aura 7f bashclan 1, bashclan 1, bashclan, byte bash blitz, bytebashblitz, bashers, aura7f.in, tech community, developer community, coding hub'
const DEFAULT_SITE_URL = 'https://aura7f.in'
const DEFAULT_OG_IMAGE = 'https://aura7f.in/logonew.png'

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website'
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title ? `${title} | Aura-7F` : DEFAULT_TITLE
    document.title = fullTitle

    // Helper to update meta tag content
    const updateMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attrName, attrValue)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // 2. Update Description & Keywords
    updateMetaTag('meta[name="description"]', 'name', 'description', description)
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords)

    // 3. Update Canonical URL
    const currentUrl = canonicalUrl || `${DEFAULT_SITE_URL}${window.location.pathname}`
    let canonicalElement = document.querySelector('link[rel="canonical"]')
    if (!canonicalElement) {
      canonicalElement = document.createElement('link')
      canonicalElement.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalElement)
    }
    canonicalElement.setAttribute('href', currentUrl)

    // 4. Update Open Graph Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl)
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage)
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType)

    // 5. Update Twitter Card Tags
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

  }, [title, description, keywords, canonicalUrl, ogImage, ogType])

  return null
}

export default SEO
