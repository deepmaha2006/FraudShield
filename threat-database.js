// threatDatabase.js
// Expanded threat intelligence + known spam messages (English, Hindi, Hinglish, mixed)
// NOTE: This file is intentionally large — meant to be copy-pasted as a single file.

const threatIntel = {
  // Keywords are assigned a weight for more nuanced scoring.
  english: {
    // --- EXPANDED CATEGORIES ---
    phishing: {
      weight: 30,
      keywords: [
        'verify your account','account suspended','login attempt','unusual activity','confirm your password','security alert','unauthorized login','account will be terminated','confirm your credentials',
        'validate your information','unauthorized transaction','your sign-in','security code','account has been compromised','your account is at risk','user id is','password is','update your payment method',
        'billing information','account locked','action required','reset your password','click to verify','verify details now','suspicious login detected','we noticed login from','confirm your identity',
        'verify otp','one time password','verify now to avoid suspension','confirm billing address','confirm card details','confirm bank details','verify transaction','please confirm your account','unauthorized access',
        'security verification','immediate verification required','temporary suspension','reactivate account','account reactivation','update security settings','login to continue','we have placed a temporary hold'
      ]
    },
    financialScam: {
      weight: 35,
      keywords: [
        'kyc update','bank account blocked','credit card blocked','debit card disabled','pending payment','upi pin','electricity bill due','fastag recharge',
        'customs duty','demat account','insurance policy lapse','sim card will be blocked','pan card update','bonus prize','cash award',
        'prize reward','your mobile will be charged','unredeemed bonus points','cash-balance is','loan for any purpose','previously refused',
        'bonus caller prize','get your free','crypto','investment opportunity','guaranteed returns','bitcoin','get rich quick','bank alert','payment failure',
        'refund processed','refund pending','tax refund','gst refund','income tax refund','immediate payment required','transfer initiated',
        'authorise payment','verify beneficiary','failed transaction','reverse transaction','chargeback','unauthorised charge'
      ]
    },
    lotteryScam: {
      weight: 25,
      keywords: [
        'you have won','lottery winner','claim your prize','congratulations you won','you are the lucky winner','claim your reward','kbc lottery','you have been selected',
        'prize guaranteed','guaranteed £','won a 1 week free membership','won a guaranteed','prize jackpot','to claim call','claim code','valued network customer',
        'shopping spree','free entry','wkly comp to win','selected to receivea','finalist','grand prize','claim your gift card','cash prize',
        'free vacation','you are winner of','exclusive prize','limited winners','winner announcement'
      ]
    },
    deliveryScam: {
      weight: 25,
      keywords: [
        'delivery failed','package on hold','incorrect address','customs clearance fee','your parcel is arriving','track your shipment','your parcel is stuck','redelivery fee',
        'customer service announcement','delivery waiting for you','tried to make a delivery','fedex','dhl','usps','courier failed','parcel on hold','pay shipping fee',
        'delivery charge payable','verify shipping address','schedule redelivery','claim your delivery','shipment delayed due to customs','click to track parcel'
      ]
    },
    urgency: {
      weight: 15,
      keywords: [
        'urgent action required','act now','limited time offer', "don't miss out",'expires soon','final notice','warning','immediately','valid 12 hours only',
        'final attempt to contact','call now','last chance to claim','urgent!','offer ends today','immediate response needed','respond within 24 hours',
        'respond immediately','within 48 hours','deadline','final reminder','pay now or account closed'
      ]
    },

    // --- NEW CATEGORIES ---
    jobScam: {
      weight: 25,
      keywords: [
        'work from home','guaranteed job','high salary','no experience needed', 'interview fee','job offer','weekly pay','hiring immediately','online recruitment',
        'pay registration fee','transfer fee','process your paperwork for a fee','training fee','get remote job','earn from home','apply now for job',
        'secret shopper','data entry job','advance fee job','no interview required'
      ]
    },
    techSupportScam: {
      weight: 35,
      keywords: [
        'microsoft support','your computer has a virus','malware detected','technician','remote access','security breach on your pc','call immediately for support',
        'windows support','call microsoft now','support technician','urgent system update','install this update','allow remote access',
        'we detected unusual activity on your device','scan your pc now','contact support to restore','contact technician to avoid data loss'
      ]
    },
    fakeInvoice: {
      weight: 30,
      keywords: [
        'your invoice is attached','invoice enclosed','payment overdue','outstanding invoice','click to view invoice','payment confirmation needed',
        'please pay overdue invoice','invoice due','download invoice','view attached invoice','gst invoice attached','company invoice enclosed',
        'bill attached','invoice payment required','account payable'
      ]
    },
    blackmailExtortion: {
      weight: 40,
      keywords: [
        'i have your video',
        'i know your secret','compromised your device','pay bitcoin','your secret will be revealed','i have recorded you','send money or we will expose',
        'your photos will be shared','pay ransom','private link will be published','24 hours to pay','we have compromising material','we have access to your camera',
        'blackmail','extortion','leak your data'
      ]
    },

    // --- EXISTING CATEGORIES (EXPANDED) ---
    subscriptionScam: {
      weight: 20,
      keywords: [
        'free ringtone','your ringtone is waiting','subscription to','charged £','unsubscribe','free tones','polyphonic tones','weekly competition','text stop to',
        'your mobile content order','free music player','ringtone club','weekly new tone','hardcore services text','hardcore services','subscription renewal failed',
        'apple subscription canceled','netflix payment failed','your subscription is suspended','confirm subscription payment'
      ]
    },
    datingScam: {
      weight: 20,
      keywords: [
        'get laid tonight','real dogging locations','secret admirer','sexy singles','wanna chat','horny','live local','dating service','fall in love',
        'chat n date now','text me live','sexy chat','meet exciting adult singles','private line','meet singles near you',
        'hot chat','escort service','online dating','romance scam'
      ]
    },
    genericGreeting: {
      weight: 10,
      keywords: [
        'dear customer','dear user','dear sir/madam','valued customer','hello valued member','hello dear','greeting from','attention customer'
      ]
    },
    misspellings: {
      weight: 10,
      keywords: [
        'cusomer','ruppes','acount','balence','congratulation','imediately','verfy','unusualy','debted','offical','rcv','txt','ur',
        'u r','wkly','congratultions','sucessfully','seccess','recieve','verfication','klik','clickk','otp is'
      ]
    },

    // --- ADDITIONAL CATEGORIES ---
    malware: {
      weight: 35,
      keywords: [
        'open attachment','download attached file','apk download','malicious link','infected attachment','scan required','ransomware','encrypted your files',
        'click to decrypt','payment to decrypt','decrypt key','virus detected','trojan detected','install this apk','run this exe'
      ]
    },
    socialEngineering: {
      weight: 20,
      keywords: [
        'call our helpdesk','support agent','hr verification','employee verification','confirm your account details',
        'confirm your PAN','confirm aadhaar','sms verification','share otp','share pin','share password'
      ]
    },
    cryptoFraud: {
      weight: 40,
      keywords: [
        'send bitcoin','pay in bitcoin','crypto giveaway','double your bitcoin','crypto investment','buy now coin','airdrop claim','wallet transfer','private key','send us crypto'
      ]
    },
    marketplaceScam: {
      weight: 30,
      keywords: [
        'olx buyer','quikr buyer','send advance','pay to reserve','need payment first','escrow service','fake buyer','payment held in escrow','seller verification fee'
      ]
    },
    govFraud: {
      weight: 35,
      keywords: [
        'income tax notice','penalty due','aadhar suspended','uidai','police verification','court notice','tax due','pay gst refund','court summons','fancy refund'
      ]
    }
  },

  // Hinglish / Hindi entries for keyword-based detection (expanded)
  hinglish: {
    financialScam: {
      weight: 35,
      keywords: [
        'kyc update karein','bank account block ho gaya hai','credit card block','bijli bill','pending payment','upi pin chahiye','demat account freeze',
        'policy lapse ho jayegi','sim card block ho jayega','pan card update karein','aapka account suspend hai','aapka account block ho jayega',
        'turant kyc update karein','aapka bank account at risk','paise wapas milenge','tax refund aapke naam','gst refund ke liye click karein'
      ]
    },
    lotteryScam: {
      weight: 25,
      keywords: [
        'aap jeet gaye hain','lottery winner','apna prize claim karein','badhai ho aap jeet gaye','kbc lottery winner','aapko inaam milaa hai','jeet ka notification'
      ]
    },
    urgency: {
      weight: 15,
      keywords: [
        'turant action lein','act now','limited time offer','mauka na chukein','last warning','abhi verify karein','24 ghante ke andar'
      ]
    },
    genericGreeting: {
      weight: 10,
      keywords: [
        'dear customer','dear user','is link par click karein','priy grahak','namaste grahak'
      ]
    },
    techSupport: {
      weight: 35,
      keywords: [
        'microsoft support ko call karein','aapke pc mein virus hai','remote access de','hamara technician contact karega','turant support available hai'
      ]
    },
    blackmail: {
      weight: 40,
      keywords: [
        'tumhara video hai','garbar ho jayegi agar paise nahi diye','video leak kar dunga','bitcoin bhejo','message delete karoge to kuch nahi hoga'
      ]
    }
  }
};

// --- EXPANDED LIST OF KNOWN SPAM MESSAGES FOR EXACT MATCHING ---
// Large multi-lingual sample set collected to increase exact-match coverage.
// Includes: English, Hindi, Hinglish, and mixed English+Hindi messages.
// Grouped by category (comments) to help you scan & maintain.

const knownSpamMessages = [

  // ---------- BANKING / KYC / PAYMENT FRAUDS ----------
  "dear customer your sbi account has been blocked due to kyc. click on http://sbi-verify.xyz to update immediately",
  "alert: icici bank detected unusual activity. verify here http://icici-verify.top or your account will be suspended",
  "axis bank: your account will be suspended in 24 hours. verify your details now at axis-secure-login.online",
  "hdfc alert: debit card blocked. visit hdfc-bank-update.xyz to restore access",
  "sbi alert: we tried to debit a payment of rs 12,000. if not authorised click http://sbi-check.link",
  "bank alert: failed kyc verification. please update at http://bank-kyc-update.info",
  "urgent: pan card mismatch. update your kyc at http://uidai-verify.link",
  "your upi has been frozen due to suspicious activity. verify at http://gpay-support.example/verify",
  "paytm alert: we detected login from new device. confirm your account now",
  "phonepe: your account will be deactivated if you don't confirm your details",
  "gpay: refund processed for rs 5,000 click to claim",
  "alert: unauthorized transaction detected. verify OTP now",
  "verification required: your debit card will be disabled - click to verify",
  "aapka bank account block ho gaya hai. turant kyc update karein http://bank-kyc.fake",
  "प्रिय ग्राहक, आपका अकाउंट अस्थायी रूप से बंद कर दिया गया है। केवाईसी अपडेट करें",
  "dear customer aapka axis account freeze ho gaya hai. verify karein http://axis-verify.in",
  "your icici debit card will be blocked. call 1800-FAKE-NUMBER to reactivate",
  "urgent! we have blocked your card due to suspicious payments. call support to re-activate",
  "immediate action required: verify beneficiary before transfer",
  "tax notice: income tax refund requires bank confirmation. visit http://itr-refund.fake",
  "gst refund pending. verify bank details to process refund",
  "refund alert: rs 12,500 credited, claim now",
  "you received a refund of rs5000 in paytm wallet, click to accept",
  "upi refund successful: click here to view",
  "aapke account me abnormal transaction detect hua hai, turant verify karein",
  "your credit card has suspicious transactions. verify now or card will be blocked",
  "paytm: your wallet has been credited with rs. 1000. click http://paytm.claim.now",
  "phonepe refund: complete verification to receive refund",
  "bank verification required: confirm your account within 24 hrs",
  "your bank has detected multiple failed login attempts. reset password",
  "unauthorised charge of rs 9,999 found. confirm or dispute now",
  "alert from bank: confirm your netbanking credentials to avoid account closure",

  // ---------- UPI / MOBILE PAYMENT SPECIFIC ----------
  "upi: your account will be disabled for security reasons. verify your upi pin now",
  "refund received in gpay: click to accept",
  "paytm: high-value transaction detected. confirm to avoid reversal",
  "phonepe: cash back claim requires otp verification",
  "aapke upi pin ko 3 baar galat dala gaya hai. verify karein to unlock",
  "someone tried to withdraw using your upi. confirm now",
  "you have received rs. 5000 via upi. click to accept funds",
  "fake upi link: http://upi-claim.xyz - do not trust but criminals use these",
  "verify your upi id to accept refund",
  "upi failure: your bank account is not linked properly. click to fix",
  "aapka paise pending hai. upi verification required",
  "received money: verify transaction - enter your upi pin (scam)",
  "you got cashback rs 250 - click to claim",
  "cashback alert: claim within 6 hours",
  "refund alert: we sent you rs 2,000 to your upi. accept now",

  // ---------- DELIVERY / COURIER / ECOMMERCE SCAMS ----------
  "courier alert: delivery failed due to incorrect address. pay redelivery fee at http://delivery-fee.link",
  "your parcel is at customs. pay customs clearance to receive it",
  "fedex: your parcel is on hold. click to pay import charges",
  "dhl: delivery waiting for you. pay redelivery charges",
  "amazon parcel: delivery could not be completed. schedule redelivery",
  "flipkart: your order is held due to pending fees. pay now to release",
  "your parcel with tracking #X123 is awaiting payment of duties",
  "parcel: delivery waiting for you. click to schedule second attempt",
  "dear customer, your dtdc parcel is on hold. verify your address",
  "aapka parcel hold par hai. customs fees jama karein",
  "आपका पार्सल रोका गया है, शिपिंग चार्ज पेमेंट करने के लिये क्लिक करें",
  "your phone order is on hold. pay 99rs verification fee to continue",
  "your parcel could not be delivered - click to confirm address",
  "delivery: please pay 49 INR for redelivery or pick up at depot",
  "we attempted delivery, phone number invalid. click to confirm",
  "your parcel contains international goods, pay customs duty to clear shipment",

  // ---------- LOTTERY / PRIZE / GIVEAWAY SCAMS ----------
  "congratulations! you have won rs 10 lakh in kbc lottery. call 9876543210 now.",
  "you are the lucky winner of a 1 year subscription. call to claim",
  "congrats! as a valued customer you have been selected to receive a prize. reply to claim",
  "you have won an amazon gift card worth rs 5000. click here to claim",
  "winner!! you have been selected to receive a 5000 GBP prize. call now",
  "jeet gaye! aapko rs 2,00,000 jeetna hua hai. apna prize claim karein",
  "aapko international lottery jeeta hai. claim karne ke liye call karein",
  "you have been selected for a lucky draw. provide your account details to receive prize",
  "congratulations you are the winner of our monthly draw. call 0900-FAKE to receive",
  "you have been selected to receive a brand new iphone. claim code: IPH-123. valid 12 hours only",

  // ---------- JOB / RECRUITMENT SCAMS ----------
  "work from home - earn rs 500 per day. apply now. no experience required",
  "urgent hiring! guaranteed job in mnc. pay rs 199 registration fee",
  "job offer waiting. send 500 for background check",
  "online job: pay training fee to start (scam)",
  "we are hiring remote data entry operators. pay rs 300 to register",
  "no interview job - pay to receive joining letter",
  "job offer: you have been selected. pay rs 1000 to process documents",
  "work at home: get weekly payouts. give bank details to enroll",
  "hiring immediately: pay processing fee to secure role",
  "remote job: send scanned ID and pay fee to activate account",
  "aap job ke liye select ho gaye ho. 500 rs verification fee jama karein",
  "ghar baithe kamai karein. registration fee bhejein",
  "interview fee required: deposit to confirm interview",
  "we will sponsor your visa. pay transfer fee now",
  "freelance job: confirm by paying token amount",
  "apply now and start earning, pay advance fee to proceed",
  "payroll scam: submit account details to receive salary (scam)",

  // ---------- TECH SUPPORT SCAMS ----------
  "microsoft support: we detected a virus on your PC. call now to fix",
  "windows support alert: call 1800-FAKE-NUMBER to remove malware",
  "your pc is infected. download our tool to remove virus (scam)",
  "support agent: allow remote access to fix security vulnerability",
  "technical support: urgent update required. click to install",
  "your computer is compromised. contact our technician to restore",
  "apple support: your apple id is locked. click to verify",
  "we are from microsoft; we will help you remove malware for a fee",
  "hamare technician aapke pc ko scan karenge. remote access de",
  "we found a trojan. pay to recover files",
  "your os has critical error; call support to resolve immediately",

  // ---------- INVOICE / BILLING / FAKE GST / TAX NOTICES ----------
  "invoice attached: please find the invoice and pay immediately",
  "outstanding invoice of rs 45,000. click to view and pay",
  "gst refund: click here to claim your refund",
  "income tax notice: pay pending amount or face penalty",
  "official invoice enclosed: payment overdue",
  "company invoice enclosed. call accounts payable to discuss",
  "your subscription invoice is ready. open attachment",
  "fake gst refund: update bank details to receive refund",
  "IT department notice: pending tax for last year. pay now or face action",
  "aapka gst refund pending hai. apna account verify karein",

  // ---------- BLACKMAIL / SEXTORTION / EXTORTION ----------
  "i have your video. pay 200000 rupees in bitcoin or i will release it",
  "we recorded you watching adult content. pay to avoid leak",
  "i have hacked your webcam and recorded you. pay bitcoin or we will send to your contacts",
  "tumhare private videos mere pass hai. paise bhejo nahi to sabko bhej dunga",
  "we have compromising images. pay ransom in btc",
  "blackmail: send money within 24 hours to avoid exposure",
  "we will post your private photos unless you pay",
  "i have access to your device and contacts. pay to delete files",
  "compromised your device. pay to prevent disclosure",

  // ---------- DATING / ROMANCE SCAMS ----------
  "hot singles in your area waiting to chat. click here",
  "sexy singles near you - meet tonight",
  "secret admirer: someone wants to meet you. reply to connect",
  "wanna chat? join our dating service and meet local singles",
  "romance: I love you. send money to book a trip to meet me (scam)",
  "meet singles now. online dating with real people - pay to unlock",
  "sugar daddy promise: pay fees to get meeting details",
  "fall in love with local singles - 1st chat free (trap)",

  // ---------- CRYPTO / INVESTMENT / PUMP-AND-DUMP SCAMS ----------
  "crypto giveaway: send 0.01 bitcoin to receive 0.02 back",
  "double your bitcoin in 24 hours - limited spots",
  "investment opportunity: guaranteed returns 30% monthly",
  "bitcoin transfer required to unlock your prize",
  "airdrop claim: provide wallet private key to receive tokens (scam)",
  "crypto exchange support: verify wallet to avoid suspension",
  "buy our crypto token early and triple your investment",
  "send crypto to claim referral bonus",
  "aapko bitcoin giveaway mila hai. wallet address bhejo to claim",

  // ---------- MARKETPLACE / OLX / QUIKR / SELLER / BUYER SCAMS ----------
  "buyer interested: will pay extra via cash transfer. send advance to hold item",
  "olx buyer: pay rs 200 to reserve the product",
  "quikr: buyer will deposit via escrow. pay 399 to create escrow (fake)",
  "fake buyer: they will ask for verification fee before viewing",
  "seller support: confirm bank details to receive payment",
  "pickup failed: buyer asked to send courier to their address and pay fee",
  "payment held in escrow: to release pay service fee",
  "do not trust buyers asking for advance to hold item",

  // ---------- SUBSCRIPTION / OTT / MEDIA SCAMS ----------
  "netflix: your subscription renewal failed. update payment details",
  "amazon prime: account suspended due to billing issue. verify now",
  "disney+ hotstar: payment failed. verify credit card to continue",
  "spotify: subscription payment unsuccessful. confirm card",
  "apple id: subscription cancelled due to billing. re-activate now",
  "your netflix account will be terminated in 24 hours unless you update payment",
  "aapka hotstar subscription cancel ho raha hai. card details update karein",
  "verify your payment method for amazon prime membership",

  // ---------- MALWARE / ATTACHMENTS / APK / LINK-BASED ----------
  "please open the attached invoice to view details (contains malware)",
  "download this apk to view your reward (malicious)",
  "open the attached exe to complete verification (scam)",
  "click the link to run security patch and avoid data loss",
  "attachment contains your account statement. open to view",
  "scan your device with our tool - download link enclosed",
  "do not open attachments from unknown senders - criminals use these (example set includes them)",

  // ---------- GOV / LEGAL / COURT / POLICE NOTICE SCAMS ----------
  "notice from court: you have a pending summons. call to resolve",
  "police verification required: pay fine to clear case",
  "income tax penalty due. Click to pay or face legal action",
  "company registrar notice: compliance required. pay fine",
  "passport issue: your passport application has a hold. confirm payment",

  // ---------- MISC / SOCIAL ENGINEERING / GENERIC ----------
  "dear customer, we are contacting you regarding your account - reply to confirm",
  "valued customer: confirm your details to receive important notification",
  "your phone will be charged rs 9.99 for subscription. reply NO to stop",
  "free entry to win an iphone - click to enter",
  "win cash now! reply WIN to enter the competition",
  "today only! claim your discount code now",
  "you have been selected for trial - pay shipping to receive sample",
  "urgent: your voicemail box is full. verify to avoid deletion",
  "confirm your SIM details to avoid deactivation",
  "your mobile content order for ringtone will cost £4/week unless you cancel",

  // ---------- HINGLISH / HINDI / MIXED SAMPLES (banking + social + often seen) ----------
  "dear customer aapka account temporarily blocked hai. kyc update karne ke liye click karein http://fake-kyc.link",
  "प्रिय ग्राहक, आपका पैन अपडेट नहीं हुआ है। यहाँ क्लीक करके अपडेट करें",
  "aapka sim card block ho jayega agar aapne abhi verify nahi kiya. click karein",
  "turant kyc complete karein warna account close ho jayega",
  "aapko gst refund hai. apna bank details bhejein",
  "aap jeet gaye ho! apna prize claim karein abhi",
  "hamare taraf se aapko reward mila hai. claim karne ke liye link par click karein",
  "aapka mobile recharge ho gaya hai 5000 ka. agar aapne nahi kiya to click karein to complain",
  "apka phone kisi dusre device se signin hua hai. agar aap nahi to click karein",
  "paytm refund: rs 1500 pending. accept karein",
  "aapko amazon gift card mila hai. claim karne ke liye details dein",
  "contact support 1800-FAKE for immediate help (scam number)",
  "aapka KYC incomplete hai. last warning to update",
  "aapka bank account unauthorized transaction ke karan hold par hai. verify karein",
  "आपके खाते में असामान्य गतिविधि मिली है। कृपया तुरंत सत्यापित करें।",
  "dear user aapka aadhaar link unsuccessful. update immediately",
  "aapka electric bill due hai. pay now to avoid disconnection",
  "aapka demat account freeze ho gaya hai. resolve karne ke liye click karein",
  "job offer: aap select ho gaye ho. registration fees pay karein",

  // ---------- RECENT TACTICS / PHRASES USED BY ATTACKERS ----------
  "confirm your amazon account to receive early access to sale - fake page",
  "ticket booking failed - resume booking by verifying payment",
  "mobile OTP: 123456 is your code (attackers may send fake otp)",
  "we are sms team: reply with otp to confirm your subscription (scam)",
  "special refund: click to verify bank details to get refund",
  "account security: review suspicious login from unknown city. click for details",
  "your paypal account suspended - re-activate now (phishing)",
  "linkedin: your account was flagged - confirm login details",
  "facebook: payment interrupted - update payment to continue ads",
  "gmail: storage exceeded - verify to increase limit",

  // ---------- OLX / MARKETPLACE BUYER SCAMS (Hinglish) ----------
  "olx buyer: interested but will pay via online transfer. please share account details",
  "buyer wants to reserve item. pay rs 200 to hold (scam)",
  "seller verification: please send id and account for verification fee",
  "quikr buyer: pay 399 to verify buyer identity (fake escrow)",
  "pickup arranged, courier will call - send advance to confirm address (scam)",

  // ---------- EXPLICIT MALICIOUS LINK EXAMPLES (attacker phrasings) ----------
  "verify here: http://secure-bank-update.xyz to avoid account closure",
  "click to claim: http://claim-prize.today/winner",
  "track parcel: http://track-parcel.fake/dhl",
  "pay customs: http://pay-customs.fake/clearance",
  "install update: http://windows-support.fake/install",
  "download invoice: http://invoice.fake/123.pdf (malware)",

  // ---------- HIGH-RISK / CRYPTO EXTORTIONS ----------
  "send 0.5 btc to wallet 1ABc... to avoid exposure",
  "pay ransom in bitcoin to decrypt your files",
  "we will publish your personal data unless you send 2000 USD in BTC",

  // ---------- COMMON SCAMMY PHRASES MIXED MULTILINGUAL ----------
  "dear customer click link to verify your account within 24 hours warna account block ho jayega",
  "urgent: verify your account now warna aapka account close kar diya jayega",
  "congrats! aapko jeet mila hai. call 0900-FAKE to claim",
  "urgent action required: update payment method otherwise service will be terminated",

  // ---------- EXTRA ENTRIES (to bulk up dataset; many variations attackers use) ----------
  "you have been charged rs 999 for subscription. reply STOP to cancel (fake)",
  "confirm transaction of rs 20,000 - if unauthorised click here",
  "your domain registration has expired - pay renewal fee to avoid deletion",
  "voucher claim: click to claim 500 off your next purchase",
  "your number has been selected for a free survey reward. click to participate",
  "security alert: someone requested a password reset. if not you click here",
  "we noticed suspicious login from russia - confirm device",
  "apple support: your apple id has been locked due to security reasons. verify at apple-support.fake",
  "bank verification: please upload documents to avoid account freeze",
  "free recharge: claim rs 100 from http://recharge-free.fake",
  "update payment method to continue using your account",
  "gift voucher: you are eligible to claim 1000 rs voucher. verify details",
  "unauthorized activity in your account. click to secure",
  "important: your ticket booking requires payment verification",
  "we tried to call you about your claim. call 0800-FAKE now",
  "confirm identity: provide id and selfie to release funds (scam)",
  "we will pay 10000 monthly for mystery shopping. pay for training (scam)",
  "you are shortlisted for an exclusive job. pay verification fee",
  "urgent: verify your gst returns or face penalty",
  "your loan application needs verification. pay processing fee to proceed",
  "loan approved: deposit security fee to activate loan (scam)",

  // ---------- ADDITIONAL HINDI / HINGLISH VARIANTS (bulk) ----------
  "aapka account block ho gaya hai. turant verify karein http://fake.bank/verify",
  "aap jeet gaye ho! call karein 0800-FAKE to receive prize",
  "koi unknown device se login hua hai. agar aap nahi to click karein",
  "kyc nahi hua hai. last notice. update kara lo warna account band",
  "apni id verify karo aur paise receive karo",
  "refund process pending. apna bank details do",
  "aapko 1,00,000 jeetna hua hai! claim karne ke liye details bhejein",
  "money back guarantee - pay initial fee to claim",
  "private video has been recorded. pay to delete",
  "tumhara facebook account disable ho jayega. verify karein",
  "aapka sim duplicate banaya gaya hai. verify karein",
  "aapke mobile par security breach detect hua hai. contact now",
  "aapko ek special reward mila hai. claim secure link se",
  "paytm: aapke wallet me unusual activity detect hui hai. verify immediately",
  "gpay notification: failed transfer to your account. confirm details",
  "phonepe: your verification failed. complete KYC",
  "bank alert: suspicious login from delhi, if not you click to secure",
  "aapka aadhaar link unsuccessful. update karen",
  "aapka pan mismatch hua hai. correct karein to avoid penalty",
  "kuch paise refund hain. claim to avoid expiry",

  // ---------- COMMON TELECOM / SIM / VERIFICATION SCAMS ----------
  "sim swap alert: new sim activated on your number. if not you contact support",
  "we detected sim change request. confirm now",
  "verify your mobile number for urgent network update",
  "your number has been selected for free upgrade. confirm details",
  "sbi: sim duplication detected. verify to stop",
  "dear customer your sim will be blocked due to pending verifications",

  // ---------- EXTRA BULK VARIATIONS (phrases & small changes) ----------
  "you have won cash prize! to claim send your bank details",
  "urgent: last chance to claim your reward, click here",
  "special offer just for you. limited slots. verify now",
  "free trial: just pay shipping to receive product",
  "verify your identity to get tax refund",
  "call back to claim your prize. number 0800-FAKE",
  "your claim is pending. verify details to complete",
  "we detected malware on your device. call to remove",
  "your subscription has been renewed for rs 299. dispute if you did not authorize",
  "internet banking alert: verify recent transaction",
  "report fraud: click to submit claim (fake form)",
  "bank verification required: submit pan & aadhaar now",
  "email: your invoice is attached - please open",
  "invoice overdue: make immediate payment to avoid interest",
  "payment dispute: respond within 7 days or forfeit refund",
  "service alert: urgent system update required to continue",
  "we tried to debit your card for subscription. confirm to avoid penalty",
  "attention: your phone warranty is about to expire. renew now",
  "job interview scheduled. confirm payment to reserve slot",
  "your application for grant approved. pay admin fee to process",
  "prize won: call to provide delivery details and bank account",
  "special discount: verify identity to unlock coupon code",
  "claim your cashback: activate by entering card details",
  "scan qr to claim reward (scam - leads to phishing site)",
  "we will credit rs 1500 to your wallet - confirm bank details",

  // ---------- FINAL BULK ADDITIONS to increase dataset density ----------
  "urgent: tax refund available. click to claim your refund now",
  "free membership won. call to claim award and provide account",
  "account verification required to avoid full account suspension",
  "dear user: your payment could not be processed. update details",
  "hello valued member: confirm your address to receive prize",
  "verify your card to receive reward points",
  "refund credited to your card - claim by clicking link",
  "you are required to update billing information to receive services",
  "confirm beneficiary before transfer proceeds",
  "we have held your payout due to verification failure. provide details",

  // ---------- Add a few intentionally repeated well-known spam lines (normalized later) ----------
  "free entry in 2 a wkly comp to win fa cup final tkts 21st may 2005. text fa to 87121 to receive entry question(std txt rate)t&c's apply 08452810075over18's",
  "freemsg hey there darling it's been 3 week's now and no word back! i'd like some fun you up for it still? tb ok! xxx std chgs to send, £1.50 to rcv",
  "winner!! as a valued network customer you have been selected to receivea £900 prize reward! to claim call 09061701461. claim code kl341. valid 12 hours only.",
  "free entry in 2 a wkly comp to win fa cup final tkts 21st may 2005. text fa to 87121 to receive entry question(std txt rate)t&c's apply 08452810075over18's",
    "freemsg hey there darling it's been 3 week's now and no word back! i'd like some fun you up for it still? tb ok! xxx std chgs to send, £1.50 to rcv",
    "winner!! as a valued network customer you have been selected to receivea £900 prize reward! to claim call 09061701461. claim code kl341. valid 12 hours only.",
    "had your mobile 11 months or more? u r entitled to update to the latest colour mobiles with camera for free! call the mobile update co free on 08002986030",
    "six chances to win cash! from 100 to 20,000 pounds txt> csh11 and send to 87575. cost 150p/day, 6days, 16+ tsandcs apply reply hl 4 info",
    "urgent! you have won a 1 week free membership in our £100,000 prize jackpot! txt the word: claim to no: 81010 t&c www.dbuk.net lccltd pobox 4403ldnw1a7rw18",
    "xxxmobilemovieclub: to use your credit, click the wap link in the next txt message or click here>> http://wap.xxxmobilemovieclub.com?n=qkgighjjgcbl",
    "england v macedonia - dont miss the goals/team news. txt ur national team to 87077 eg england to 87077 try:wales, scotland 4txt/ú1.20 poboxox36504w45wq 16+",
    "thanks for your subscription to ringtone uk your mobile will be charged £5/month please confirm by replying yes or no. if you reply no you will not be charged",
    "07732584351 - rodger burns - msg = we tried to call you re your reply to our sms for a free nokia mobile + free camcorder. please call now 08000930705 for delivery tomorrow",
    "sms. ac sptv: the new jersey devils and the detroit red wings play ice hockey. correct or incorrect? end? reply end sptv",
    "congrats! 1 year special cinema pass for 2 is yours. call 09061209465 now! c suprman v, matrix3, starwars3, etc all 4 free! bx420-ip4-5we. 150pm. dont miss out!",
    "as a valued customer, i am pleased to advise you that following recent review of your mob no. you are awarded with a £1500 bonus prize, call 09066364589",
    "urgent ur awarded a complimentary trip to eurodisinc trav, aco&entry41 or £1000. to claim txt dis to 87121 18+6*£1.50(morefrmmob. shracomorsglsuplt)10, ls1 3aj",
    "did you hear about the new 'divorce barbie'? it comes with all of ken's stuff!",
    "please call our customer service representative on 0800 169 6031 between 10am-9pm as you have won a guaranteed £1000 cash or £5000 prize!",
    'your free ringtone is waiting to be collected. simply text the password "mix" to 85069 to verify. get usher and britney. fml, po box 5249, mk17 92h. 450ppw 16',
    "gent! we are trying to contact you. last weekends draw shows that you won a £1000 prize guaranteed. call 09064012160. claim code k52. valid 12hrs only. 150ppm",
    "you are a winner u have been specially selected 2 receive £1000 or a 4* holiday (flights inc) speak to a live operator 2 claim 0871277810910p/min (18+)",
    "private! your 2004 account statement for 07742676969 shows 786 unredeemed bonus points. to claim call 08719180248 identifier code: 45239 expires",
    "urgent! your mobile no. was awarded £2000 bonus caller prize on 5/9/03 this is our final try to contact u! call from landline 09064019788 box42wr29c, 150ppm",
    "todays voda numbers ending 7548 are selected to receive a $350 award. if you have a match please call 08712300220 quoting claim code 4041 standard rates app",
    "sunshine quiz wkly q! win a top sony dvd player if u know which country the algarve is in? txt ansr to 82277. £1.50 sp:tyrone",
    "want 2 get laid tonight? want real dogging locations sent direct 2 ur mob? join the uk's largest dogging network bt txting gravel to 69888! nt. ec2a. 31p.msg@150p",
    "you'll not rcv any more msgs from the chat svc. for free hardcore services text go to: 69988 if u get nothing u must age verify with yr network & try again",
    "freemsg why haven't you replied to my text? i'm randy, sexy, female and live local. luv to hear from u. netcollex ltd 08700621170150p per msg reply stop to end",
    "customer service annoncement. you have a new years delivery waiting for you. please call 07046744435 now to arrange delivery",
    "-pls stop bootydelious (32/f) is inviting you to be her friend. reply yes-434 or no-434 see her: www.sms.ac/u/bootydelious stop? send stop frnd to 62468",
    "bangbabes ur order is on the way. u should receive a service msg 2 download ur content. if u do not, goto wap. bangb. tv on ur mobile internet/service menu",
    "urgent! we are trying to contact you. last weekends draw shows that you have won a £900 prize guaranteed. call 09061701939. claim code s89. valid 12hrs only",
    "please call our customer service representative on freephone 0808 145 4742 between 9am-11pm as you have won a guaranteed £1000 cash or £5000 prize!",
    "are you unique enough? find out from 30th august. www.areyouunique.co.uk",
    "500 new mobiles from 2004, must go! txt: nokia to no: 89545 & collect yours today!from only £1 www.4-tc.biz 2optout 087187262701.50gbp/mtmsg18",
    "will u meet ur dream partner soon? is ur career off 2 a flyng start? 2 find out free, txt horo followed by ur star sign, e. g. horo aries",
    "text & meet someone sexy today. u can find a date or even flirt its up to u. join 4 just 10p. reply with name & age eg sam 25. 18 -msg recd@thirtyeight pence",
    "u 447801259231 have a secret admirer who is looking 2 make contact with u-find out who they r*reveal who thinks ur so special-call on 09058094597",
    "congratulations ur awarded 500 of cd vouchers or 125gift guaranteed & free entry 2 100 wkly draw txt music to 87066 tncs www.ldew.com1win150ppmx3age16",
    "we tried to contact you re your reply to our offer of a video handset? 750 anytime networks mins? unlimited text? camcorder? reply or call 08000930705 now",
    "hey i am really horny want to chat or see me naked text hot to 69698 text charged at 150pm to unsubscribe text stop 69698",
    "ur ringtone service has changed! 25 free credits! go to club4mobiles.com to choose content now! stop? txt club stop to 87070. 150p/wk club4 po box1146 mk45 2wt",
    "hmv bonus special 500 pounds of genuine hmv vouchers to be won. just answer 4 easy questions. play now! send hmv to 86688 more info:www.100percent-real.com",
    "free entry into our £250 weekly competition just text the word win to 80086 now. 18 t&c www.txttowin.co.uk",
    "send a logo 2 ur lover - 2 names joined by a heart. txt love name1 name2 mobno eg love adam eve 07123456789 to 87077 yahoo! pobox36504w45wq txtno 4 no ads 150p",
    "someone has contacted our dating service and entered your phone because they fancy you! to find out who it is call from a landline 09111032124 . pobox12n146tf150p",
    "urgent! your mobile number has been awarded with a £2000 prize guaranteed. call 09058094455 from land line. claim 3030. valid 12hrs only",
    "congrats! nokia 3650 video camera phone is your call 09066382422 calls cost 150ppm ave call 3mins vary from mobiles 16+ close 300603 post bcm4284 ldn wc1n3xx",
    "loan for any purpose £500 - £75,000. homeowners + tenants welcome. have you been previously refused? we can still help. call free 0800 1956669 or text back 'help'",
    "upgrdcentre orange customer, you may now claim your free camera phone upgrade for your loyalty. call now on 0207 153 9153. offer ends 26th july. t&c's apply. opt-out available",
    "okmail: dear dave this is your final notice to collect your 4* tenerife holiday or #5000 cash award! call 09061743806 from landline. tcs sae box326 cw25wx 150ppm",
    "want 2 get laid tonight? want real dogging locations sent direct 2 ur mob? join the uk's largest dogging network by txting moan to 69888nyt. ec2a. 31p.msg@150p",
    "free message activate your 500 free text messages by replying to this message with the word free for terms & conditions, visit www.07781482378.com",
    "congrats! 1 year special cinema pass for 2 is yours. call 09061209465 now! c suprman v, matrix3, starwars3, etc all 4 free! bx420-ip4-5we. 150pm. dont miss out!",
    "+123 congratulations - in this week's competition draw u have won the £1450 prize to claim just call 09050002311 b4280703. t&cs/stop sms 08718727868. over 18 only 150ppm",
    "you are guaranteed the latest nokia phone, a 40gb ipod mp3 player or a £500 prize! txt word: collect to no: 83355! ibhltd ldnw15h 150p/mtmsgrcvd18+",
    "boltblue tones for 150p reply poly# or mono# eg poly3 1. cha cha slide 2. yeah 3. slow jamz 6. toxic 8. come with me or stop 4 more tones txt more",
    "your credits have been topped up for http://www.bubbletext.com your renewal pin is tgxxrz",
    "urgent!: your mobile no. was awarded a £2,000 bonus caller prize on 02/09/03! this is our 2nd attempt to contact you! call 0871-872-9755 box95qu",
    "today's offer! claim ur £150 worth of discount vouchers! text yes to 85023 now! savamob, member offers mobile! t cs 08717898035. £3.00 sub. 16 . unsub reply x",
    "you will recieve your tone within the next 24hrs. for terms and conditions please see channel u teletext pg 750",
    "private! your 2003 account statement for 07815296484 shows 800 un-redeemed s.i.m. points. call 08718738001 identifier code 41782 expires 18/11/04",
    "from www.applausestore.com monthlysubscription@50p/msg max6/month t&csc web age16 2stop txt stop",
    "you have won ?1,000 cash or a ?2,000 prize! to claim, call09050000327",
    "our mobile number has won £5000, to claim calls us back or ring the claims hot line on 09050005321.",
    "we tried to contact you re your reply to our offer of 750 mins 150 textand a new video phone call 08002988890 now or reply for free delivery tomorrow",
    "for ur chance to win a £250 wkly shopping spree txt: shop to 80878. t's&c's www.txt-2-shop.com custcare 08715705022, 1x150p/wk",
    "you have been specially selected to receive a 2000 pound award! call 08712402050 before the lines close. cost 10ppm. 16+. t&cs apply. ag promo",
    "private! your 2003 account statement for 07753741225 shows 800 un-redeemed s. i. m. points. call 08715203677 identifier code: 42478 expires 24/10/04",
    "you have an important customer service announcement. call freephone 0800 542 0825 now!",
    "xclusive@clubsaisai 2morow 28/5 soiree speciale zouk with nichols from paris.free roses 2 all ladies !!! info: 07946746291/07880867867",
    "22 days to kick off! for euro2004 u will be kept up to date with the latest news and results daily. to be removed send get txt stop to 83222",
    "free entry into our £250 weekly comp just send the word win to 80086 now. 18 t&c www.txttowin.co.uk",
    "send a logo 2 ur lover - 2 names joined by a heart. txt love name1 name2 mobno eg love adam eve 07123456789 to 87077 yahoo! pobox36504w45wq txtno 4 no ads 150p.",
    "someone has contacted our dating service and entered your phone because they fancy you! to find out who it is call from a landline 09111032124 . pobox12n146tf150p",
    "urgent! your mobile number has been awarded with a £2000 prize guaranteed. call 09058094455 from land line. claim 3030. valid 12hrs only",
    "congrats! nokia 3650 video camera phone is your call 09066382422 calls cost 150ppm ave call 3mins vary from mobiles 16+ close 300603 post bcm4284 ldn wc1n3xx",
    "loan for any purpose £500 - £75,000. homeowners + tenants welcome. have you been previously refused? we can still help. call free 0800 1956669 or text back 'help'",
    "you are guaranteed the latest nokia phone, a 40gb ipod mp3 player or a £500 prize! txt word: collect to no: 83355! ibhltd ldnw15h 150p/mtmsgrcvd18+",
    "your credits have been topped up for http://www.bubbletext.com your renewal pin is tgxxrz",
    "urgent!: your mobile no. was awarded a £2,000 bonus caller prize on 02/09/03! this is our 2nd attempt to contact you! call 0871-872-9755 box95qu",
    "you will recieve your tone within the next 24hrs. for terms and conditions please see channel u teletext pg 750",
    "private! your 2003 account statement for 07815296484 shows 800 un-redeemed s.i.m. points. call 08718738001 identifier code 41782 expires 18/11/04",
    "from www.applausestore.com monthlysubscription@50p/msg max6/month t&csc web age16 2stop txt stop",
    "you have won ?1,000 cash or a ?2,000 prize! to claim, call09050000327",
    "our mobile number has won £5000, to claim calls us back or ring the claims hot line on 09050005321.",
    "we tried to contact you re your reply to our offer of 750 mins 150 textand a new video phone call 08002988890 now or reply for free delivery tomorrow",
    "for ur chance to win a £250 wkly shopping spree txt: shop to 80878. t's&c's www.txt-2-shop.com custcare 08715705022, 1x150p/wk",
    "you have been specially selected to receive a 2000 pound award! call 08712402050 before the lines close. cost 10ppm. 16+. t&cs apply. ag promo",
    "private! your 2003 account statement for 07753741225 shows 800 un-redeemed s. i. m. points. call 08715203677 identifier code: 42478 expires 24/10/04",
    "you have an important customer service announcement. call freephone 0800 542 0825 now!",
    "xclusive@clubsaisai 2morow 28/5 soiree speciale zouk with nichols from paris.free roses 2 all ladies !!! info: 07946746291/07880867867",
    "22 days to kick off! for euro2004 u will be kept up to date with the latest news and results daily. to be removed send get txt stop to 83222",
    "today is accept day..u accept me as? brother sister lover dear1 best1 clos1 lvblefrnd jstfrnd cutefrnd lifpartnr belovd swtheart bstfrnd no rply means enemy",
    "think ur smart ? win £200 this week in our weekly quiz, text play to 85222 now!t&cs winnersclub po box 84, m26 3uz. 16+. gbp1.50/week",
    "december only! had your mobile 11mths+? you are entitled to update to the latest colour camera mobile for free! call the mobile update co free on 08002986906",
    "call germany for only 1 pence per minute! call from a fixed line via access number 0844 861 85 85. no prepayment. direct access!",
    "valentines day special! win over £1000 in our quiz and take your partner on the trip of a lifetime! send go to 83600 now. 150p/msg rcvd. custcare:08718720201.",
    "fancy a shag? i do.interested? sextextuk.com txt xxuk suzy to 69876. txts cost 1.50 per msg. tncs on website. x",
    "congratulations ur awarded 500 of cd vouchers or 125gift guaranteed & free entry 2 100 wkly draw txt music to 87066 tncs www.ldew.com1win150ppmx3age16",
    "ur cash-balance is currently 500 pounds - to maximize ur cash-in now send cash to 86688 only 150p/msg. cc: 08708800282 hg/suite342/2lands row/w1j6hl",
    "update_now - xmas offer! latest motorola, sonyericsson & nokia & free bluetooth! double mins & 1000 txt on orange. call mobileupd8 on 08000839402 or call2optout/f4q=",
    "here is your discount code rp176781. to stop further messages reply stop. www.regalportfolio.co.uk. customer services 08717205546",
    "thanks for your ringtone order, reference t91. you will be charged gbp 4 per week. you can unsubscribe at anytime by calling customer services on 09057039994",
    "double mins and txts 4 6months free bluetooth on orange. available on sony, nokia motorola phones. call mobileupd8 on 08000839402 or call2optout/n9dx",
    "4mths half price orange line rental & latest camera phones 4 free. had your phone 11mths ? call mobilesdirect free on 08000938767 to update now! or2stoptxt",
    "free ringtone text first to 87131 for a poly or text get to 87131 for a true tone! help? 0845 2814032 16 after 1st free, tones are 3x£150pw to e£nd txt stop",
    "want 2 get laid tonight? want real dogging locations sent direct 2 ur mob? join the uk's largest dogging network by txting moan to 69888nyt. ec2a. 31p.msg@150p",
    "free message activate your 500 free text messages by replying to this message with the word free for terms & conditions, visit www.07781482378.com",
    "congrats! 1 year special cinema pass for 2 is yours. call 09061209465 now! c suprman v, matrix3, starwars3, etc all 4 free! bx420-ip4-5we. 150pm. dont miss out!",
    "+123 congratulations - in this week's competition draw u have won the £1450 prize to claim just call 09050002311 b4280703. t&cs/stop sms 08718727868. over 18 only 150ppm",
    "you are guaranteed the latest nokia phone, a 40gb ipod mp3 player or a £500 prize! txt word: collect to no: 83355! ibhltd ldnw15h 150p/mtmsgrcvd18+"

  // (NOTE: dataset intentionally includes repeated/variant forms of typical scam messages that are commonly blocked).
  // You can enlarge further by appending more localized variants, numbers, or campaign-specific phrases as needed.
];

// Normalize knownSpamMessages: lowercase & trim for consistent matching
const normalizedKnownSpamMessages = knownSpamMessages.map(msg => (msg || '').toLowerCase().trim());

// --- SAFE DOMAINS (unchanged, but you can expand) ---
const safeDomains = [
  'google.com','youtube.com','facebook.com','instagram.com','whatsapp.com','twitter.com','linkedin.com', 'microsoft.com',  'apple.com','sbi.co.in', 'icicibank.com',
  'hdfcbank.com','axisbank.com', 'rbi.org.in','uidai.gov.in','incometax.gov.in','amazon.in','flipkart.com','paytm.com','phonepe.com'
];

// --- EXPANDED LIST ---
const suspiciousTlds = [
  '.xyz','.top','.club','.site','.online','.info','.biz','.zip','icu', '.work', 'click', '.link','.live',
  '.loan', '.pw','.ga','.cf','.gq','.buzz','.monster','.quest','.one'
];

// --- EXPANDED LIST ---
const suspiciousKeywordsInDomain = [
  'login','secure','account','update','verify','password','support','bank','service','recover','confirm','-sale','-offer',
  'rewards','signin','admin','user-','portal-','client-','auth-','helpdesk-','billing-','payment-','transfer-','gift-',
  'promo-','verify-','verifyaccount','secure-login'
];

const entities = {
  bankNames: [
    'sbi','hdfc','icici','axis','kotak','pnb','state bank of india','bank of baroda','bank of india','idbi'
  ],
  paymentServices: [
    'paytm','phonepe','gpay','google pay','bhim','upi','cred','razorpay','fastag','paypal','venmo'
  ],
  government: [
    'uidai','aadhaar','pan card','incometax','passport','mygov','digilocker','gst'
  ],
  socialMedia: [
    'facebook','instagram','whatsapp','twitter','linkedin','snapchat','tiktok'
  ]
};

module.exports = {
  threatIntel,
  knownSpamMessages: normalizedKnownSpamMessages,
  safeDomains,
  suspiciousTlds,
  suspiciousKeywordsInDomain,
  entities
};
