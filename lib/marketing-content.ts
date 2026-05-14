const support: Record<string, { title: string; body: string[] }> = {
  contact: {
    title: 'Contact UNIBAY',
    body: [
      'Reach our UK-based configuration team for sales, technical guidance, or aftercare.',
      'Use the live chat widget when available, email support@unibay.com, or call 0333 555 0190 Monday–Saturday.',
      'For trade and education programmes, mention your sector in the subject line so we can route you quickly.',
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    body: [
      'Orders ship from our UK integration centre once burn-in and QA complete. Typical mainland lead times match the product page estimate.',
      'You can save multiple configurations to your basket and compare totals in GBP before checkout.',
      'Extended warranty upgrades can be quoted by our team after you place a deposit on a bespoke build.',
    ],
  },
  warranty: {
    title: 'Warranty information',
    body: [
      'Systems include a standard hardware warranty covering parts and labour for defects not caused by misuse.',
      'Custom liquid loops receive an additional leak-check window within the first 30 days of delivery.',
      'International travellers should retain original packaging for any authorised service event.',
    ],
  },
  returns: {
    title: 'Returns & exchanges',
    body: [
      'Changed your mind? Notify us within 14 days of delivery for a return merchandise authorisation (RMA).',
      'Customised engraving, bespoke paint, or opened liquid coolant cannot be refunded once applied.',
      'Refunds are issued to the original payment method in GBP within 10 working days of inspection.',
    ],
  },
  technical: {
    title: 'Technical support',
    body: [
      'Download the latest drivers from the manufacturer portals linked in your welcome pack.',
      'UNIBAY technicians can remote-diagnose Windows imaging issues or BIOS settings during business hours.',
      'For critical failures, we prioritise advanced replacement stock when inventory allows.',
    ],
  },
}

const legal: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy policy',
    body: [
      'UNIBAY processes personal data to fulfil orders, provide support, and improve our configurator experience.',
      'We do not sell your data. Payment details are handled by our PCI-compliant processor and never stored on our demo storefront.',
      'You may request deletion of marketing preferences at any time by emailing privacy@unibay.com.',
    ],
  },
  terms: {
    title: 'Terms of service',
    body: [
      'By using this website you agree to our UK trading terms, including accurate configuration selections and timely payment.',
      'Quoted performance metrics are indicative and depend on software, drivers, and thermals in your environment.',
      'UNIBAY may update these terms; continued use after changes constitutes acceptance.',
    ],
  },
  cookies: {
    title: 'Cookie policy',
    body: [
      'We use essential cookies for basket persistence, admin authentication state, and security.',
      'Analytics cookies are optional and can be disabled via your browser settings.',
      'Configurator preferences may be stored locally to speed up repeat visits.',
    ],
  },
  accessibility: {
    title: 'Accessibility',
    body: [
      'We aim to meet WCAG 2.1 AA guidelines across marketing and transactional flows.',
      'If you encounter a barrier, contact accessibility@unibay.com with the page URL and assistive technology used.',
      'Large-text and high-contrast themes are on our roadmap for a future release.',
    ],
  },
}

const company: Record<string, { title: string; body: string[] }> = {
  about: {
    title: 'About UNIBAY',
    body: [
      'UNIBAY designs, assembles, and supports custom PCs and laptops for gamers, creators, and professionals across the UK.',
      'Our mission is transparent pricing in GBP, rigorous QA, and honest guidance when balancing thermals versus acoustics.',
      'This interactive experience demonstrates how customers explore options before speaking with a specialist.',
    ],
  },
  careers: {
    title: 'Careers',
    body: [
      'We hire system integrators, supply chain analysts, and customer success engineers in our UK hubs.',
      'Send CVs to careers@unibay.com with the role family in the subject line.',
      'Graduate schemes open each September for STEM graduates passionate about hardware.',
    ],
  },
  press: {
    title: 'Press & media',
    body: [
      'Press kits and executive bios are available on request from press@unibay.com.',
      'Review samples are prioritised for publications with demonstrated audiences in PC hardware.',
      'Brand assets must follow our trademark guidelines—contact us before altering the UNIBAY logotype.',
    ],
  },
  partners: {
    title: 'Partner programme',
    body: [
      'Resellers and MSPs can access volume pricing, lead-time dashboards, and co-marketing assets.',
      'Complete the partner intake form (available from your account manager) to begin onboarding.',
      'Minimum commitment tiers unlock demo fleet allocations and priority RMA handling.',
    ],
  },
  sustainability: {
    title: 'Sustainability',
    body: [
      'We consolidate shipments to reduce courier miles and recycle packaging at our integration centres.',
      'Customers can return retired UNIBAY systems for responsible e-waste processing through accredited partners.',
      'Power supply choices in the configurator highlight efficiency ratings to help lower long-term energy use.',
    ],
  },
}

export function getSupportTopic(topic: string) {
  return support[topic]
}

export function getLegalDoc(slug: string) {
  return legal[slug]
}

export function getCompanyPage(slug: string) {
  return company[slug]
}

export const supportTopicList = Object.keys(support)
export const legalSlugList = Object.keys(legal)
export const companySlugList = Object.keys(company)

export const blogPosts = [
  {
    slug: 'ddr5-timing-explained',
    title: 'DDR5 timings explained for gamers',
    excerpt: 'What CAS latency really means when frame pacing matters.',
    date: '2026-04-02',
    body: [
      'Memory latency interacts with CPU cache behaviour more than raw MHz alone.',
      'For gaming workloads we prioritise stable XMP profiles validated on UNIBAY motherboards.',
      'See the configurator memory step for kits tuned to each platform.',
    ],
  },
  {
    slug: 'ai-assist-configuration',
    title: 'How UNIBAY uses AI-assist recommendations',
    excerpt: 'Balancing automation with human experts in the sales loop.',
    date: '2026-04-18',
    body: [
      'Our quick-build flow samples popular component combinations tuned for UK inventory.',
      'Human specialists review every order before parts are picked to catch edge cases.',
      'Feedback from customers improves the ranking signals over time.',
    ],
  },
] as const

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}

export const infoPages: Record<string, { title: string; body: string[] }> = {
  financing: {
    title: '0% financing (UK)',
    body: [
      'Spread the cost of qualifying UNIBAY systems over 12 or 24 months with our retail finance partners subject to status.',
      'Representative examples and APR are confirmed at checkout; deposits may apply for bespoke liquid-cooled rigs.',
      'Business leasing lines are available separately—see the Business Solutions page.',
    ],
  },
  business: {
    title: 'Business solutions',
    body: [
      'Volume pricing, asset tagging, and imaging services are available for creative studios, schools, and esports venues.',
      'Dedicated account managers coordinate lead times across multiple delivery sites in the UK.',
      'Contact sales@unibay.com with approximate seat counts and software stack for a tailored quote.',
    ],
  },
  education: {
    title: 'Education discount',
    body: [
      'Accredited UK institutions receive discounted pricing on laptops and lab workstations.',
      'Provide your .ac.uk procurement contact and expected refresh cycle to unlock the education SKU list.',
      'Students purchasing personally should verify eligibility each academic year.',
    ],
  },
}

export function getInfoPage(slug: string) {
  return infoPages[slug]
}

