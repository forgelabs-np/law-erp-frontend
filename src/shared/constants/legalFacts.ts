export interface LegalFact {
  id: number;
  category: string;
  categoryIcon: string;
  title: string;
  description: string;
}

export const LEGAL_FACTS: LegalFact[] = [
  // 🌟 English Legal & Corporate Facts
  {
    id: 1,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Napkin Contracts",
    description:
      "A contract written casually on a cocktail napkin can be legally binding if it contains mutual consent.",
  },
  {
    id: 2,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Corporate Personhood",
    description:
      "In corporate law, a company is legally treated as an artificial person separate from its owners.",
  },
  {
    id: 3,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Digital Signatures",
    description:
      "Electronic signatures carry the exact same legal weight as physical ink signatures in modern commerce.",
  },
  {
    id: 4,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Silent Offers",
    description:
      "In contract law, staying silent never legally constitutes an automatic acceptance of an offer.",
  },
  {
    id: 5,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Generic Trademarks",
    description:
      "Brands lose their trademark protection if their name becomes a generic term, like Escalator or Aspirin or Thermos.",
  },
  {
    id: 6,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Copyright Automation",
    description:
      "Copyright protection applies automatically the moment a creative work is fixed in a tangible medium.",
  },
  {
    id: 7,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Force Majeure",
    description:
      "This clause legally protects businesses from breaching contracts due to unpreventable natural disasters.",
  },
  {
    id: 8,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Postal Rule",
    description:
      "In contract law, an acceptance sent by mail is legally active the moment it is posted.",
  },
  {
    id: 9,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Illegal NDAs",
    description:
      "Non-disclosure agreements are legally invalid if they attempt to cover up ongoing criminal activities.",
  },
  {
    id: 10,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "No Return/Refund Policy is not valid",
    description:
      "Consumer protection laws allows consumer to return or refund the product/service within 7 days provided that the products/services are not exhausted.",
  },
  {
    id: 11,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Double Jeopardy",
    description:
      "A person cannot be tried twice for the exact same crime in most legal systems.",
  },
  {
    id: 12,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Act of God",
    description:
      "The law recognizes unpreventable natural events as a legitimate defense against sudden liabilities.",
  },
  {
    id: 13,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Liquidated Damages",
    description:
      "These clauses pre-determine the exact financial penalty for a contract breach before it happens.",
  },
  {
    id: 14,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Patent Monopolies",
    description:
      "A patent gives an inventor an exclusive legal monopoly, but usually for a limited block of 20 years.",
  },
  {
    id: 15,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Power of Attorney",
    description:
      "This document gives someone the legal right to act for you, but automatically expires when you pass away.",
  },
  {
    id: 16,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Public International Law",
    description:
      "Embassies are legally considered the sovereign territory of the country they represent.",
  },
  {
    id: 17,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Ignorance Clause",
    description:
      "Ignorance of the law is never a valid legal defense to avoid punishment for a crime.",
  },
  {
    id: 18,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Hearsay Evidence",
    description:
      "A witness cannot testify about what another person told them because it is classified as inadmissible hearsay.",
  },
  {
    id: 19,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Defamation Limit",
    description:
      "Legally, dead people cannot be defamed, as defamation laws only protect the living.",
  },
  {
    id: 20,
    category: "English Legal & Corporate",
    categoryIcon: "🌟",
    title: "Pro Bono",
    description:
      'The term comes from the Latin phrase pro bono publico, meaning "for the public good."',
  },

  // 🇳🇵 ५० नेपाली कानुनी रोचक तथ्यहरू (Nepali Legal Facts)
  {
    id: 21,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "अनिवार्य वित्तीय विवरण",
    description:
      "नेपालमा कम्पनीले कुनै कारोबार नगरे पनि प्रत्येक वर्ष रजिस्ट्रारको कार्यालयमा वित्तीय विवरण बुझाउनु अनिवार्य हुन्छ।",
  },
  {
    id: 22,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "ट्रेडमार्कको आयु",
    description:
      "नेपालमा कुनै पनि ट्रेडमार्क (ब्रान्ड नाम वा लोगो) दर्ता भएको मितिबाट मात्र ७ वर्षसम्म सुरक्षित रहन्छ।",
  },
  {
    id: 23,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "एमआरपीको बाध्यता",
    description:
      "उपभोक्ता संरक्षण ऐनअनुसार हरेक सामान वा वस्तुमा अधिकतम खुद्रा मूल्य (MRP) स्पष्ट लेखिनु अनिवार्य छ।",
  },
  {
    id: 24,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "डिजिटल हस्ताक्षर",
    description:
      "नेपालको विद्युतीय कारोबार ऐनले डिजिटल हस्ताक्षरलाई साधारण मसीको हस्ताक्षर सरह नै कानुनी वैधता दिएको छ।",
  },
  {
    id: 25,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "वातावरणीय मूल्यांकन",
    description:
      "उद्योग स्थापना गर्नु अगाडि वातावरणमा पर्ने प्रभावको आधारमा IEE वा EIA मूल्यांकन गराउनु अनिवार्य छ।",
  },
  {
    id: 26,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "बिल लिनु अधिकार",
    description:
      "वस्तु वा सेवा खरिद गर्दा बिल लिनु उपभोक्ताको अधिकार र बिक्रेताको कानुनी दायित्व हो।",
  },
  {
    id: 27,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "पब्लिक कम्पनी परिवर्तन",
    description:
      "प्राइभेट कम्पनीले सर्वसाधारणका लागि सेयर (IPO) निष्कासन गर्न पाउँदैनन्, त्यसका लागि पब्लिक हुनुपर्छ।",
  },
  {
    id: 28,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "पेटेन्टको अवधि",
    description:
      "नेपालमा कुनै पनि नयाँ प्रविधि वा आविष्कारलाई पेटेन्ट दर्ता गराएर ७ वर्षसम्म सुरक्षित राख्न सकिन्छ।",
  },
  {
    id: 29,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "एक्सिम कोड अनिवार्य",
    description:
      "एक्सिम कोड (EXIM Code) विना नेपालमा व्यावसायिक रूपमा सामान आयात वा निर्यात गर्न पाइँदैन।",
  },
  {
    id: 30,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "श्रम ऐनको सुरक्षा",
    description:
      "श्रम ऐनअनुसार रोजगारदाताले श्रमिकलाई विना कुनै उचित कानुनी कारण कामबाट निकाल्न पाउँदैन।",
  },
  {
    id: 31,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "अशोज मसान्तको नियम",
    description:
      "आर्थिक वर्ष सकिएको ३ महिनाभित्र (अशोज मसान्तसम्म) आयव्ययको विवरण कर कार्यालयमा बुझाउनुपर्छ।",
  },
  {
    id: 32,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "चेक बाउन्स अपराध",
    description:
      "खातामा पर्याप्त रकम नभई चेक काट्नु (Check Bounce) बैंकिङ कसुर अन्तर्गत कडा अपराध मानिन्छ।",
  },
  {
    id: 33,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "जमानीको दायित्व",
    description:
      "बैंकिङ कारोबारमा जमानी बस्ने व्यक्ति पनि ऋण तिर्ने मामिलामा ऋणी सरह नै जिम्मेवार हुन्छ।",
  },
  {
    id: 34,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "महिला छुट",
    description:
      "घरजग्गा खरिद–बिक्री गर्दा सरकारलाई बुझाउनुपर्ने रजिस्ट्रेशन् दस्तुर महिलाको नाममा पास गर्दा विशेष छुट पाइन्छ।",
  },
  {
    id: 35,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "सामान फिर्ता अधिकार",
    description:
      "अनलाइन सपिङबाट किनेको सामानमा कैफियत देखिएमा सामान फिर्ता गर्न पाउने उपभोक्ता अधिकार कानुनमा छ।",
  },
  {
    id: 36,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "टाट पल्टिने नियम",
    description:
      "कम्पनी टाट पल्टिएमा सबैभन्दा पहिले कर्मचारीको तलब र सरकारी कर चुक्ता गर्नुपर्ने कानुनी प्राथमिकता हुन्छ।",
  },
  {
    id: 37,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "साइबर कानुन",
    description:
      "कसैको मन्जुरी विना उसको तस्बिर खिचेर सामाजिक सञ्जालमा राख्नु साइबर कानुन अन्तर्गत अपराध हो।",
  },
  {
    id: 38,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "गोपनीयताको हक",
    description:
      "नेपालमा मञ्जुरी विना अरूको फोन ट्याप गर्ने वा कुराकानी रेकर्ड गर्ने कार्य दण्डनीय मानिन्छ।",
  },
  {
    id: 39,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "सूचनाको हक",
    description:
      "प्रत्येक नेपाली नागरिकलाई सरकारी निकायमा रहेका सार्वजनिक सरोकारका सूचना माग्ने र पाउने संवैधानिक अधिकार छ।",
  },
  {
    id: 40,
    category: "Nepali Legal Facts",
    categoryIcon: "🇳🇵",
    title: "बहुविवाह प्रतिबन्ध",
    description:
      "नेपालको मुलुकी देवानी संहिताअनुसार बहुविवाह पूर्ण रूपमा प्रतिबन्धित र दण्डनीय अपराध हो।",
  },

  // 📜 Historical Legal Facts
  {
    id: 41,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Code of Hammurabi",
    description:
      'Written around 1750 BCE, this ancient Babylonian text established the rule of "an eye for an eye."',
  },
  {
    id: 42,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Magna Carta",
    description:
      "Signed in 1215, this historical document established the principle that the King is not above the law.",
  },
  {
    id: 43,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Twelve Tables",
    description:
      "Created in 450 BCE, these tables formed the absolute core foundation of ancient Roman law.",
  },
  {
    id: 44,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Nyayabikasini",
    description:
      "Promulgated in 1380 AD by King Jayasthiti Malla, this was Nepal's first comprehensive written social code.",
  },
  {
    id: 45,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Muluki Ain 1910",
    description:
      "Issued by Jung Bahadur Rana, this was the first integrated written civil and criminal code of Nepal.",
  },
  {
    id: 46,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Jury of Peers",
    description:
      "The concept of trial by a jury of citizens dates back to the direct democracy of ancient Athens.",
  },
  {
    id: 47,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Emperor Justinian Code",
    description:
      "This 6th-century Roman legal compilation forms the entire structural basis of civil law systems today.",
  },
  {
    id: 48,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Salic Law",
    description:
      "This ancient medieval European law strictly forbade women from inheriting land or the royal crown.",
  },
  {
    id: 49,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "The Draconian Code",
    description:
      "Written by Draco in ancient Greece, this code prescribed death as the punishment for almost every single crime.",
  },
  {
    id: 50,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Ancient Pro Bono",
    description:
      "In ancient Rome, defense advocates were legally forbidden from charging their clients any financial fees.",
  },
  {
    id: 51,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Napoleonic Code",
    description:
      "Established in 1804, this French code fundamentally standardized laws regarding property, family, and individual rights globally.",
  },
  {
    id: 52,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Trial by Ordeal",
    description:
      "In medieval times, suspects had to hold red-hot iron to let God legally judge their innocence through healing.",
  },
  {
    id: 53,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "First Constitutional Court",
    description:
      "Austria created the world's very first dedicated Constitutional Court in 1920.",
  },
  {
    id: 54,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Oldest Corporation",
    description:
      "The Hudson’s Bay Company, incorporated in 1670, is the oldest continuously operating corporate business in the world.",
  },
  {
    id: 55,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "The Lex Talionis",
    description:
      "This ancient legal doctrine states that a punishment must exactly resemble the crime committed.",
  },
  {
    id: 56,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Pirate Charters",
    description:
      "Historical pirate ships operated under written legal constitutions that guaranteed equal voting rights for crews.",
  },
  {
    id: 57,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Magna Carta Copies",
    description:
      "Only four original copies of the historic 1215 Magna Carta survive to this day.",
  },
  {
    id: 58,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "The US Constitution",
    description:
      "Signed in 1787, it remains the shortest and oldest written federal constitution still in active use.",
  },
  {
    id: 59,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "Declaration of Rights",
    description:
      "The English Bill of Rights of 1689 severely limited royal power and established free speech in Parliament.",
  },
  {
    id: 60,
    category: "Historical Legal Facts",
    categoryIcon: "📜",
    title: "The Great Smog Law",
    description:
      "London’s environmental disaster of 1952 directly led to the passing of the historic Clean Air Act 1956.",
  },

  // 🏛️ Landmark Cases
  {
    id: 61,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Donoghue v. Stevenson",
    description:
      "This famous 1932 English case involving a decomposing snail birthed the modern legal concept of negligence.",
  },
  {
    id: 62,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Carlill v. Carbolic Smoke Ball Co",
    description:
      "This 1893 landmark case established that advertisements can legally constitute binding unilateral contract offers.",
  },
  {
    id: 63,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Salomon v. Salomon & Co",
    description:
      "This legendary 1897 British ruling firmly established the legal doctrine of the corporate veil.",
  },
  {
    id: 64,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Sunil Babu Pant v. Nepal Government",
    description:
      "This 2007 case saw Nepal’s Supreme Court pioneer the historic legal decriminalization of LGBTQ+ rights.",
  },
  {
    id: 65,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Godavari Marble Case",
    description:
      "This 1995 Nepali case established that the right to a clean environment is part of the right to life.",
  },
  {
    id: 66,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Salomon's Corporate Veil",
    description:
      "The case proved that a company's debts belong to the company, not its individual shareholders.",
  },
  {
    id: 67,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Meera Dhungana v. Law Ministry",
    description:
      "This landmark litigation pushed the state to secure equal parental property rights for Nepali daughters.",
  },
  {
    id: 68,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Rylands v. Fletcher",
    description:
      'This historic 1868 case established the absolute doctrine of "strict liability" for hazardous materials escaping land.',
  },
  {
    id: 69,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Hadley v. Baxendale",
    description:
      "This foundational 1854 breach-of-contract case set the absolute rules for claiming consequential financial damages.",
  },
  {
    id: 70,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Marbury v. Madison",
    description:
      "This famous 1803 US case established the universal concept of judicial review over executive laws.",
  },
  {
    id: 71,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Brown v. Board of Education",
    description:
      "This monumental 1954 ruling declared racial segregation in public schools completely unconstitutional.",
  },
  {
    id: 72,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Roe v. Wade",
    description:
      "The 1973 case famously recognized a woman's constitutional right to privacy regarding medical choices.",
  },
  {
    id: 73,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Miranda v. Arizona",
    description:
      'This 1966 verdict created the mandatory "Miranda warning" given by police during criminal arrests.',
  },
  {
    id: 74,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Gideon v. Wainwright",
    description:
      "This 1963 landmark ruling guaranteed that poor criminal defendants must be provided a free defense lawyer.",
  },
  {
    id: 75,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Plessy v. Ferguson",
    description:
      'The 1896 case originally permitted "separate but equal" public facilities before being completely overturned.',
  },
  {
    id: 76,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Mabo v. Queensland",
    description:
      "This historic Australian ruling recognized the land rights of Indigenous peoples, overturning terra nullius.",
  },
  {
    id: 77,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Tinker v. Des Moines",
    description:
      "This 1969 case confirmed that students do not lose their constitutional free speech rights at school gates.",
  },
  {
    id: 78,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "New York Times Co. v. Sullivan",
    description:
      'This 1964 case set the high "actual malice" standard required for public officials to win defamation suits.',
  },
  {
    id: 79,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "Entick v. Carrington",
    description:
      "This 1765 English case established the civil liberty rule that the state cannot trespass without clear statutory authority.",
  },
  {
    id: 80,
    category: "Landmark Cases",
    categoryIcon: "🏛️",
    title: "R v. Dudley and Stephens",
    description:
      "This famous 1884 English case ruled that necessity is never a valid legal defense for murder.",
  },

  // 🤪 Odd Laws & Famous Jurists
  {
    id: 81,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Suspicious Salmon Law",
    description:
      "Under the UK’s Salmon Act 1986, it is illegal to handle a salmon under suspicious circumstances.",
  },
  {
    id: 82,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Lonely Pets Law",
    description:
      "In Switzerland, it is illegal to own only one social pet, like a guinea pig, because they get lonely.",
  },
  {
    id: 83,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Smiling Duty Law",
    description:
      "An old law in Milan, Italy, technically requires citizens to smile at all times except at funerals.",
  },
  {
    id: 84,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Lord Atkin",
    description:
      'This iconic jurist famously defined the universal legal test for the "Neighbour Principle" in civil liability.',
  },
  {
    id: 85,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Justice Sapana Pradhan Malla",
    description:
      "A prominent Nepalese jurist who pioneered litigation that granted equal property rights to women.",
  },
  {
    id: 86,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Samoan Birthday Law",
    description:
      "In Samoa, it is legally classified as an explicit crime to forget your own wife’s birthday.",
  },
  {
    id: 87,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Pocket Ice Cream",
    description:
      "In Georgia, USA, it is illegal to carry an ice cream cone in your back pocket on Sundays.",
  },
  {
    id: 88,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Cattle Fine Law",
    description:
      "Nepal's Penal Code allows courts to fine owners who let their domestic cattle block public paths.",
  },
  {
    id: 89,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Chewing Gum",
    description:
      "Singapore famously banned the import and sale of chewing gum in 1992 to keep public spaces clean.",
  },
  {
    id: 90,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Feeding Pigeons",
    description:
      "Feeding pigeons in Venice, Italy, is strictly illegal to protect historic monuments from damage.",
  },
  {
    id: 91,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No High Heels",
    description:
      "It is illegal to wear high heels at ancient monument sites in Greece to protect the stone floors.",
  },
  {
    id: 92,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Sir William Blackstone",
    description:
      "His 18th-century Commentaries formed the absolute blueprint for English and American common law.",
  },
  {
    id: 93,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Oliver Wendell Holmes Jr.",
    description:
      "The famous US jurist who stated that freedom of speech does not protect falsely shouting fire in a theatre.",
  },
  {
    id: 94,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Justice Ruth Bader Ginsburg",
    description:
      "A pioneer jurist who spent her career dismantling legal gender discrimination in the United States.",
  },
  {
    id: 95,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Lord Denning",
    description:
      "Often called the people's judge, he was famous for rewriting complex laws into beautiful, simple English sentences.",
  },
  {
    id: 96,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Dying in Parliament",
    description:
      "It was historically rumored to be illegal to die inside the Houses of Parliament in the UK.",
  },
  {
    id: 97,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Driving Dirty Cars",
    description:
      "Driving a dirty car that obscures your license plate is a checkable traffic offense in Russia.",
  },
  {
    id: 98,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Self-Bulb Changing",
    description:
      "An old myth stated it was illegal to change a lightbulb in Victoria, Australia, without a license.",
  },
  {
    id: 99,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "No Frowning at Police",
    description:
      "It is technically illegal to make an unprovoked funny or frowning face at a police officer in Germany.",
  },
  {
    id: 100,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Cicero",
    description:
      'The ancient Roman jurist who famously declared that "the safety of the people shall be the highest law."',
  },
  {
    id: 101,
    category: "Odd Laws & Famous Jurists",
    categoryIcon: "🤪",
    title: "Nepali Janti",
    description:
      "It is illegal to have more than 51 person in marriage in Nepal.",
  },
];
