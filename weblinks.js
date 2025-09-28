const threatDatabase = {
  /**
   * A curated list of official, legitimate domains.
   * This is crucial for the analysis engine to:
   * 1. Whitelist known-good sites.
   * 2. Detect typosquatting (e.g., "microsft" vs "microsoft.com").
   * 3. Identify subdomain abuse (e.g., "google.com.hacker.net" is not "google.com").
   */
  officialDomains: [
    // -- Global Tech & Social Media --
    'google.com',
    'youtube.com',
    'facebook.com',
    'instagram.com',
    'linkedin.com',
    'twitter.com',
    'whatsapp.com',
    'microsoft.com',
    'apple.com',
    'amazon.com',
    'netflix.com',
    'spotify.com',
    'paypal.com',
    'ebay.com',
    'wikipedia.org',
    'wordpress.org',
    'adobe.com',
    'salesforce.com',
    'oracle.com',
    'ibm.com',
    'intel.com',
    'cisco.com',
    'zoom.us',
    'slack.com',
    'github.com',
    'dropbox.com',
    'docusign.com',
    'stackoverflow.com',
    'quora.com',
    'reddit.com',
    'pinterest.com',
    'tumblr.com',
    'telegram.org',

    // -- Indian E-commerce & Services --
    'amazon.in',
    'flipkart.com',
    'myntra.com',
    'ajio.com',
    'nykaa.com',
    'snapdeal.com',
    'bookmyshow.com',
    'makemytrip.com',
    'goibibo.com',
    'zomato.com',
    'swiggy.in',
    'paytm.com',
    'phonepe.com',
    'cred.club',
    'hotstar.com',
    'jiocinema.com',
    'shaadi.com',
    'naukri.com',
    'olx.in',
    'justdial.com',

    // -- Indian Banks (Public & Private) --
    'sbi.co.in',
    'onlinesbi.sbi',
    'pnbindia.in',
    'bankofbaroda.in',
    'canarabank.com',
    'unionbankofindia.co.in',
    'bankofindia.co.in',
    'indianbank.in',
    'centralbankofindia.co.in',
    'hdfcbank.com',
    'icicibank.com',
    'axisbank.com',
    'kotak.com',
    'indusind.com',
    'yesbank.in',
    'rblbank.com',
    'federalbank.co.in',

    // -- Financial Services & Regulators --
    'rbi.org.in',
    'sebi.gov.in',
    'npci.org.in',
    'bseindia.com',
    'nseindia.com',
    'zerodha.com',
    'upstox.com',
    'groww.in',

    // -- Indian Government & Citizen Services --
    'india.gov.in',
    'mygov.in',
    'incometax.gov.in',
    'uidai.gov.in',
    'passportindia.gov.in',
    'parivahan.gov.in',
    'irctc.co.in',
    'cbse.gov.in',
    'ugc.ac.in',
    'nic.in',
    'digitalindia.gov.in',
    'pmindia.gov.in',
    'indiapost.gov.in',
    'epfindia.gov.in',
    'esic.nic.in',

    // -- Indian Telecom Companies --
    'jio.com',
    'airtel.in',
    'vodafoneidea.com',
    'bsnl.co.in',

    // -- Indian News & Media --
    'timesofindia.indiatimes.com',
    'thehindu.com',
    'hindustantimes.com',
    'indianexpress.com',
    'ndtv.com',
    'indiatoday.in',
    'zeenews.india.com',

    // -- Indian Airlines & Travel --
    'airindia.in',
    'goindigo.in',
    'spicejet.com',
    'vistara.com',

    // -- Global News & Media --
    'bbc.com',
    'cnn.com',
    'nytimes.com',
    'reuters.com',
    'theguardian.com',
    'forbes.com',
    'wsj.com',

    // -- Global E-commerce & Retail --
    'alibaba.com',
    'walmart.com',
    'target.com',
    'bestbuy.com',
    'ikea.com',

    // -- Search Engines & Browsers --
    'bing.com',
    'duckduckgo.com',
    'yahoo.com',
    'mozilla.org',

    // -- Cloud & Hosting --
    'aws.amazon.com',
    'azure.microsoft.com',
    'cloud.google.com',
    'godaddy.com',
    'cloudflare.com',

    // -- International Organizations --
    'who.int',
    'un.org',
    'worldbank.org',

    // -- More popular sites --
    'espn.com',
    'imdb.com',
    'craigslist.org',
    'etsy.com',
    'mit.edu',
    'harvard.edu',
    'coursera.org',
    'udemy.com',
    'canva.com',
    'figma.com',
    'notion.so',
    'trello.com',
    'asana.com',
    'evernote.com'
  ],

  /**
   * A list of base domains known to be used in phishing and scams.
   * This list is populated with real-world examples and realistic, generated patterns
   * that impersonate the official domains listed above.
   */
  knownMaliciousDomains: [
    // -- Impersonating Indian Banks --
    'hdfcbank.security-access.net',
    'icici-rewards.claim-now.xyz',
    'sbi-online-services.info',
    'pnb-kyc-verification.live',
    'axisbank-netsecure.online',
    'kotak-811-update.club',
    'bankofbaroda-support.in-net.org',
    'unionbank-auth.co-in.site',

    // -- Impersonating Global Tech --
    'apple-id-support.com',
    'microsoft-alert-login.net',
    'google-security-update.org',
    'facebook-login-assistance.info',
    'instagram.login-help.com',
    'whatsapp-web.link-device.top',
    'netflix-payment-update.biz',
    'amazon-prime-rewards.xyz',
    'paypal-transaction-issue.live',

    // -- Impersonating Indian E-commerce --
    'flipkart.order-details.info',
    'myntra.sale-events.org',
    'amazon-in-bigbillion.co-in.buzz',
    'paytm-cashback-offer.club',
    'phonepe-rewards.site',
    'zomato-gold-promo.online',
    'swiggy-one.free-delivery.top',
    'ajio.clearance-sale.info',

    // -- Impersonating Indian Government --
    'incometax.gov.refund-portal.net',
    'parivahan.gov.challan-payment.online',
    'uidai-aadhaar-update.in-co.org',
    'passport-seva-portal.com',
    'indiapost.track-shipment.info',
    'irctc.ticket-refund.co.in.net',

    // -- Generic but Highly Suspicious Patterns --
    'your-pc-defender.xyz',
    'document-share.biz',
    'shop-deals.today',
    'customs-payment.info',
    'global-careers.org',
    'malicious-site.net',
    'private-viewer.xyz',
    'tessla-event.com',
    'binance-gifts.org',
    'earthquake-relief-fund.org',
    'netfiix-billing.com',
    'premium-offer.net',
    'pay-bills.in',
    'your-package-status.link',
    'secure-login-portal.net',
    'online-banking-access.org',
    'customer-support-desk.info',
    'verify-your-identity.online',
    'critical-security-alert.xyz',
    'get-rich-quick-scheme.buzz',
    'free-crypto-giveaway.top',
    'unclaimed-inheritance.club',
    'lottery-winners-circle.site',
    'fast-cash-loans-online.biz',

    // -- More Impersonation Examples (Generated based on patterns) --
    'apple.com-verify.live',
    'microsoft.com-support.online',
    'google-drive.share-docs.info',
    'sbi.co.in-netbanking.org',
    'hdfc-bank.customer-care.net',
    'icici.creditcard-services.xyz',
    'amazon.in.deals-today.biz',
    'flipkart.big-billion.sale.top',
    'myntra-fashion-upgrade.live',
    'paytm.kyc-validation.site',
    'airtel.in.recharge-offers.club',
    'jio-5g-upgrade.online',
    'passport-india.gov-in.net',
    'incometax-efiling.org',
    'your-netflix-account.update-now.com',
    'facebookmail.com', // Real domain used by FB, but often used in phishing to look official
    'fb-security-team.net',
    'linkedin-jobs.career-portal.info',
    'docusign.review-document.online',
    'dropbox-shared-file.xyz',
    'get-your-refund-now.com',
    'package-tracking-update.info',
    'your-computer-is-infected.net',
    'bank-account-locked.org',
    'tax-refund-online.gov-us.top',
    'verify-identity-apple.com',
    'user-support-microsoft.com',
    'claim-your-prize-now.net',
    'exclusive-offer-amazon.com',
    'your-package-fedex.com',
    'dhl-delivery-update.com',
    'walmart-giftcard-winner.com',
    'bestbuy-special-deal.com'
  ],

  /**
   * Keywords that are highly suspicious when found within a domain or subdomain.
   * This helps catch new, unlisted malicious domains that follow common scam patterns.
   */
  suspiciousDomainKeywords: [
    'access', 'account', 'admin', 'alert', 'auth', 'authorize', 'bank', 'billing',
    'careers', 'center', 'claim', 'claims', 'client', 'confirm', 'connect',
    'credit', 'critical', 'customs', 'deals', 'delivery', 'details', 'docs',
    'events', 'e-verify', 'fast-cash', 'files', 'finance', 'gift', 'global',
    'help', 'helpdesk', 'identity', 'info', 'invoice', 'issue', 'kyc',
    'live', 'login', 'manage', 'now', 'offer', 'online', 'order', 'pay',
    'payment', 'portal', 'post', 'prize', 'process', 'promo', 'recover',
    'refund', 're-login', 'renewal', 'rewards', 'sale', 'secure', 'security',
    'service', 'settlement', 'share', 'signin', 'support', 'survey',
    'track', 'tracking', 'transaction', 'transfer', 'update', 'urgent',
    'validate', 'verification', 'verify', 'view', 'winner', 'winning'
  ]
};

module.exports = threatDatabase;