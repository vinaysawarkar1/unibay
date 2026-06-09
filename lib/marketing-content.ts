type RichDoc = {
  title: string
  intro?: string
  lastUpdated?: string
  sections?: { heading?: string; paragraphs?: string[]; list?: string[] }[]
  body?: string[]
}

const POLICY_UPDATED = '8 June 2026'

const support: Record<string, RichDoc> = {
  contact: {
    title: 'Contact UNIBAY',
    intro:
      'Our UK-based team is here to help with sales advice, order updates, technical guidance, and aftercare. Choose the channel that suits you best.',
    sections: [
      {
        heading: 'Phone',
        paragraphs: ['Call us on 0333 555 0190 (standard UK rate, included in most call plans).'],
        list: [
          'Monday to Friday: 9:00 AM – 6:00 PM',
          'Saturday: 10:00 AM – 4:00 PM',
          'Closed Sundays and UK bank holidays',
        ],
      },
      {
        heading: 'Email',
        list: [
          'General & sales: support@unibay.com',
          'Technical support: techsupport@unibay.com',
          'Returns & warranty: returns@unibay.com',
          'Business & education: sales@unibay.com',
        ],
      },
      {
        heading: 'What to have ready',
        paragraphs: [
          'To help us assist you quickly, please have your UNIBAY order reference (format UB-XXXXXXXX) and the email address used at checkout to hand. For technical faults, a short description of the issue and any on-screen error messages speeds up diagnosis.',
        ],
      },
      {
        heading: 'Registered address',
        paragraphs: [
          'UNIBAY Custom PC Systems, Integration Centre, United Kingdom. Email response times are typically within one business day; phone is fastest for urgent hardware faults.',
        ],
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    intro: 'Answers to the questions we hear most often. Still stuck? Contact our team and we will help.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: 'Orders & delivery',
        list: [
          'How long does my order take? Build times are shown on each product page. Custom systems are assembled to order and stress-tested before dispatch — typically 5–10 working days for desktops and 3–7 for laptops, plus 1–2 days for delivery.',
          'Where do you ship? We deliver to mainland UK, plus Northern Ireland, Scottish Highlands & Islands (longer lead times may apply). All prices are shown in GBP and include VAT.',
          'How much is delivery? Standard delivery is free on all systems. Tracked courier details are emailed once your order is dispatched.',
          'Can I track my order? Yes — use the Track Order page with your UB- reference, or sign in and open Your Orders for live status.',
        ],
      },
      {
        heading: 'Payment & pricing',
        list: [
          'What payment methods do you accept? All major credit and debit cards via our PCI-DSS compliant payment processor. We never store full card details.',
          'Is VAT included? Yes. All displayed prices include UK VAT at the current rate. A full VAT invoice is provided with every order.',
          'Do you price match? Contact our sales team with a like-for-like quote and we will do our best to be competitive.',
        ],
      },
      {
        heading: 'Products & customisation',
        list: [
          'Can I customise a build? Yes — use the configurator to choose components, then our specialists review every order before parts are picked.',
          'Is the operating system included? Windows 11 is pre-installed and activated on all systems unless you select otherwise.',
          'Will my PC be tested before shipping? Every system undergoes burn-in and QA testing. Desktops receive a stress test; we verify thermals, stability, and that all components are recognised.',
        ],
      },
      {
        heading: 'Warranty & returns',
        list: [
          'What warranty do I get? Every UNIBAY system and product includes a 1-year (12-month) warranty covering parts and labour. See our Warranty page for full details.',
          'Can I return my order? Yes — see our Returns & Exchanges page. You have a 14-day cooling-off period for most items under UK law (custom-built systems excepted).',
          'My PC has developed a fault — what do I do? Contact techsupport@unibay.com. Many issues are resolved remotely; if not, we will arrange repair or replacement under warranty.',
        ],
      },
    ],
  },

  warranty: {
    title: 'Warranty information',
    intro:
      'Every UNIBAY product is covered by a 1-year (12-month) warranty as standard, covering parts and labour for manufacturing defects and hardware failures that arise under normal use.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: 'Your 1-year warranty',
        paragraphs: [
          'All UNIBAY laptops, desktops, and accessories include a 12-month warranty from the date of delivery. This covers the cost of parts and labour to repair or replace components that fail due to a manufacturing defect or fault under normal, intended use.',
          'This warranty is provided in addition to — and does not affect — your statutory rights under the Consumer Rights Act 2015.',
        ],
      },
      {
        heading: 'What is covered',
        list: [
          'Manufacturing defects in components and assembly',
          'Hardware failures (e.g. CPU, GPU, memory, storage, motherboard, PSU) under normal use',
          'Parts and labour for diagnosis and repair during the 12-month period',
          'Laptop battery defects (covered for 12 months against manufacturing fault)',
        ],
      },
      {
        heading: 'What is not covered',
        list: [
          'Accidental damage, liquid damage, drops, or physical abuse (optional accidental-damage cover is available at checkout)',
          'Damage from unauthorised modification, overclocking beyond supplied profiles, or third-party repairs',
          'Software issues, viruses, or data loss — please keep regular backups',
          'Normal cosmetic wear, and consumables such as thermal paste after the first service',
          'Faults caused by use outside the product’s rated specifications or environment',
        ],
      },
      {
        heading: 'How to make a claim',
        paragraphs: [
          'Contact us at techsupport@unibay.com or call 0333 555 0190 with your order reference and a description of the fault. Many issues are resolved remotely. If a hardware repair is needed, we will advise the best route — return-to-base repair or component replacement — and cover carriage for valid in-warranty claims within mainland UK.',
        ],
      },
      {
        heading: 'Component manufacturer warranties',
        paragraphs: [
          'Some individual components (such as graphics cards and CPUs) also carry their own manufacturer warranty, which may run in parallel with or beyond your 1-year UNIBAY cover. We can advise on the best route to resolution in each case.',
        ],
      },
    ],
  },

  returns: {
    title: 'Returns & exchanges',
    intro:
      'We want you to be completely happy with your purchase. This policy explains your right to cancel, how to return an item, and how refunds work — in line with UK consumer law.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: '14-day right to cancel (cooling-off period)',
        paragraphs: [
          'Under the Consumer Contracts Regulations 2013, for most products bought online you have the right to cancel within 14 days of receiving your order, for any reason. To cancel, notify us at returns@unibay.com within that period. You then have a further 14 days to return the goods.',
          'Returned items must be in their original condition with all packaging, cables, and accessories. You are responsible for the cost of return carriage unless the item is faulty.',
        ],
      },
      {
        heading: 'Custom-built and personalised systems',
        paragraphs: [
          'Please note: bespoke, made-to-order, and personalised systems (built to your specific configuration) are exempt from the standard 14-day cooling-off right under the Consumer Contracts Regulations 2013, because they are made to your specification. This does not affect your rights if the item is faulty or not as described.',
        ],
      },
      {
        heading: 'Faulty or not-as-described goods',
        paragraphs: [
          'Under the Consumer Rights Act 2015, if an item is faulty, not as described, or not fit for purpose:',
        ],
        list: [
          'Within 30 days of delivery, you have the short-term right to reject the goods for a full refund.',
          'Within 6 months, if a fault appears we will repair or replace it; if that is not possible, you are entitled to a refund.',
          'These rights apply to custom-built systems too — your statutory protection is never waived.',
        ],
      },
      {
        heading: 'How to return an item',
        list: [
          'Email returns@unibay.com with your order reference (UB-XXXXXXXX) and reason for return.',
          'We will issue a Return Merchandise Authorisation (RMA) number and return instructions.',
          'Pack the item securely in its original packaging and include the RMA number.',
          'For faulty items within warranty, we arrange and pay for collection within mainland UK.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: [
          'Once we receive and inspect your return, refunds are issued to your original payment method within 14 days. For change-of-mind returns, the refund covers the price of the goods and standard outbound delivery; return carriage is at your cost. For faulty items, we refund all carriage costs.',
        ],
      },
      {
        heading: 'Non-returnable items',
        list: [
          'Software licences and digital downloads once activated',
          'Items returned without original packaging or with missing components (may incur a deduction)',
          'Custom-built systems for change-of-mind, except where faulty (see above)',
        ],
      },
    ],
  },

  technical: {
    title: 'Technical support',
    intro:
      'Our technical team supports your UNIBAY system for its lifetime. Most issues can be resolved quickly with the steps below or a short remote session.',
    sections: [
      {
        heading: 'Before you contact us',
        list: [
          'Restart the system and ensure all cables and the power supply are firmly connected.',
          'Update Windows and install the latest GPU drivers from NVIDIA or AMD.',
          'Note any on-screen error messages, beep codes, or LED indicators.',
          'If the fault is intermittent, note when it happens (gaming, boot, idle, etc.).',
        ],
      },
      {
        heading: 'Getting help',
        list: [
          'Email techsupport@unibay.com with your order reference and a description of the issue.',
          'Call 0333 555 0190 during business hours for urgent hardware faults.',
          'Our technicians can run a remote diagnostic session (with your consent) for Windows, BIOS, and driver issues.',
        ],
      },
      {
        heading: 'In-warranty repairs',
        paragraphs: [
          'If a hardware fault is confirmed within your 1-year warranty period, we will repair or replace the affected component at no cost for parts and labour, and cover carriage within mainland UK. We prioritise advanced replacement stock where inventory allows to minimise downtime.',
        ],
      },
      {
        heading: 'Drivers & resources',
        paragraphs: [
          'Keep your system current by installing manufacturer drivers (GPU, chipset, network) from official portals. We recommend creating regular backups; UNIBAY is not responsible for data loss, and data recovery is not covered by warranty.',
        ],
      },
    ],
  },
}

const legal: Record<string, RichDoc> = {
  privacy: {
    title: 'Privacy policy',
    intro:
      'UNIBAY is committed to protecting your privacy. This policy explains what personal data we collect, how we use it, and your rights under the UK GDPR and the Data Protection Act 2018.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [
          'UNIBAY Custom PC Systems ("we", "us") is the data controller responsible for your personal data. For any privacy query, contact our data protection team at privacy@unibay.com.',
        ],
      },
      {
        heading: 'What data we collect',
        list: [
          'Account details: name, email address, and password (stored securely as a one-way hash).',
          'Contact & delivery details: phone number and shipping/billing addresses.',
          'Order information: products purchased, order history, and configuration choices.',
          'Technical data: IP address, browser type, and cookies (see our Cookie Policy).',
          'We do not store full payment card numbers — these are handled by our PCI-DSS compliant payment processor.',
        ],
      },
      {
        heading: 'How and why we use it (lawful bases)',
        list: [
          'To fulfil your order and provide support — performance of a contract.',
          'To manage your account and verify your email — performance of a contract.',
          'To send service messages (order updates) — legitimate interests.',
          'To send marketing, only where you have opted in — consent (withdraw any time).',
          'To meet legal and tax obligations — legal obligation.',
        ],
      },
      {
        heading: 'Data retention',
        paragraphs: [
          'We keep order and invoice records for as long as required by UK tax law (currently six years). Account data is retained while your account is active. You can request deletion at any time, subject to legal retention requirements.',
        ],
      },
      {
        heading: 'Your rights',
        list: [
          'Access a copy of the personal data we hold about you.',
          'Rectify inaccurate or incomplete data.',
          'Request erasure of your data ("right to be forgotten").',
          'Restrict or object to processing, and request data portability.',
          'Withdraw consent for marketing at any time.',
        ],
      },
      {
        heading: 'Contact & complaints',
        paragraphs: [
          'To exercise any right, email privacy@unibay.com. If you are unhappy with our response, you have the right to complain to the Information Commissioner’s Office (ICO) at ico.org.uk.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of service',
    intro:
      'These terms govern your use of the UNIBAY website and your purchase of our products. By placing an order you agree to these terms. They do not affect your statutory rights.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: 'Ordering & contract',
        paragraphs: [
          'When you place an order, you will receive an acknowledgement email. A binding contract is formed when we confirm dispatch of your order. We reserve the right to decline or cancel an order (for example, if an item is mispriced or out of stock), in which case any payment taken is refunded in full.',
        ],
      },
      {
        heading: 'Pricing & payment',
        paragraphs: [
          'All prices are in GBP and include VAT at the applicable rate. Payment is taken at checkout via our secure payment processor. We make every effort to ensure prices are accurate; in the rare event of an obvious error, we will contact you before proceeding.',
        ],
      },
      {
        heading: 'Delivery',
        paragraphs: [
          'Estimated build and delivery times are shown on each product page and are indicative. Risk passes to you on delivery. If no one is available to receive a system, the courier will leave a card with redelivery instructions.',
        ],
      },
      {
        heading: 'Performance & specifications',
        paragraphs: [
          'Quoted performance figures (e.g. frame rates) are indicative and depend on software, drivers, settings, and your environment. Component specifications are provided by manufacturers and may be subject to revision.',
        ],
      },
      {
        heading: 'Liability',
        paragraphs: [
          'We do not exclude or limit liability where it would be unlawful to do so, including for death or personal injury caused by negligence, or for fraud. Subject to that, our liability for any order is limited to the price paid for that order. We are not liable for data loss — please maintain regular backups.',
        ],
      },
      {
        heading: 'Changes & governing law',
        paragraphs: [
          'We may update these terms from time to time; the version in force at the time of your order applies. These terms are governed by the laws of England and Wales, and disputes are subject to the courts of England and Wales.',
        ],
      },
    ],
  },

  cookies: {
    title: 'Cookie policy',
    intro:
      'This policy explains how UNIBAY uses cookies and similar technologies, and how you can control them.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: 'What are cookies?',
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a website. They help the site work properly, remember your preferences, and understand how the site is used.',
        ],
      },
      {
        heading: 'Cookies we use',
        list: [
          'Essential cookies: required for sign-in, basket persistence, and security. These cannot be switched off.',
          'Preference cookies: remember your configurator choices and settings to speed up repeat visits.',
          'Analytics cookies: help us understand site usage so we can improve. These are optional.',
        ],
      },
      {
        heading: 'Managing cookies',
        paragraphs: [
          'You can control or delete cookies through your browser settings. Disabling essential cookies may affect site functionality such as staying signed in or keeping items in your basket.',
        ],
      },
    ],
  },

  accessibility: {
    title: 'Accessibility statement',
    intro:
      'UNIBAY is committed to making our website usable for as many people as possible, regardless of ability or technology.',
    lastUpdated: POLICY_UPDATED,
    sections: [
      {
        heading: 'Our commitment',
        paragraphs: [
          'We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA across our marketing and transactional pages. We test with keyboard navigation, screen readers, and colour-contrast tools as part of our development process.',
        ],
      },
      {
        heading: 'Features',
        list: [
          'Keyboard-navigable menus, forms, and checkout flow.',
          'Descriptive labels and alt text for interactive elements and imagery.',
          'A responsive layout that works across devices and supports browser zoom.',
          'Sufficient colour contrast for text and key controls.',
        ],
      },
      {
        heading: 'Reporting a problem',
        paragraphs: [
          'If you encounter an accessibility barrier, please email accessibility@unibay.com with the page URL, a description of the issue, and the assistive technology you were using. We aim to respond within five working days and will work to resolve issues promptly.',
        ],
      },
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

