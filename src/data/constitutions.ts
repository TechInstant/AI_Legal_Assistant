// Bundled constitutional content used as offline fallback and as the corpus
// for the local retrieval-based AI assistant. Excerpts only — sourced from
// public-domain official texts. Article numbering preserved where possible.

export type Region =
  | 'africa'
  | 'asia'
  | 'europe'
  | 'americas'
  | 'oceania'
  | 'arctic'
  | 'mideast';

export interface BundledArticle {
  id: string;
  constitution_id: string;
  chapter: string;
  article_number: string;
  title: string;
  content: string;
}

export interface BundledConstitution {
  id: string;
  country: string;
  country_code: string;
  flag: string;
  region: Region;
  title: string;
  adopted: string;
  summary: string;
}

export const constitutions: BundledConstitution[] = [
  {
    id: 'us',
    country: 'United States of America',
    country_code: 'US',
    flag: '🇺🇸',
    region: 'americas',
    title: 'Constitution of the United States',
    adopted: '1788',
    summary:
      'The supreme law of the U.S., establishing the federal government, separation of powers, and protecting fundamental civil liberties through the Bill of Rights.',
  },
  {
    id: 'ng',
    country: 'Nigeria',
    country_code: 'NG',
    flag: '🇳🇬',
    region: 'africa',
    title: 'Constitution of the Federal Republic of Nigeria',
    adopted: '1999',
    summary:
      'Establishes Nigeria as a federal republic with a presidential system, defining fundamental rights, federalism, and the structure of government.',
  },
  {
    id: 'in',
    country: 'India',
    country_code: 'IN',
    flag: '🇮🇳',
    region: 'asia',
    title: 'Constitution of India',
    adopted: '1950',
    summary:
      'The longest written national constitution in force, providing a parliamentary federal democracy and an extensive bill of fundamental rights.',
  },
  {
    id: 'de',
    country: 'Germany',
    country_code: 'DE',
    flag: '🇩🇪',
    region: 'europe',
    title: 'Basic Law for the Federal Republic of Germany',
    adopted: '1949',
    summary:
      'The Grundgesetz — Germany\'s post-war constitution, anchored in the inviolability of human dignity and a federal parliamentary democracy.',
  },
  {
    id: 'za',
    country: 'South Africa',
    country_code: 'ZA',
    flag: '🇿🇦',
    region: 'africa',
    title: 'Constitution of the Republic of South Africa',
    adopted: '1996',
    summary:
      'Hailed as one of the world\'s most progressive constitutions, founded on dignity, equality, and a justiciable Bill of Rights.',
  },
  {
    id: 'br',
    country: 'Brazil',
    country_code: 'BR',
    flag: '🇧🇷',
    region: 'americas',
    title: 'Constitution of the Federative Republic of Brazil',
    adopted: '1988',
    summary:
      'Known as the "Citizen Constitution," it re-established democracy after military rule and enshrines extensive social rights.',
  },
  {
    id: 'jp',
    country: 'Japan',
    country_code: 'JP',
    flag: '🇯🇵',
    region: 'asia',
    title: 'Constitution of Japan',
    adopted: '1947',
    summary:
      'A pacifist post-war constitution that vests sovereignty in the people and renounces war as a sovereign right of the nation.',
  },
  {
    id: 'au',
    country: 'Australia',
    country_code: 'AU',
    flag: '🇦🇺',
    region: 'oceania',
    title: 'Commonwealth of Australia Constitution Act',
    adopted: '1901',
    summary:
      'Federates the Australian colonies into the Commonwealth and establishes a Westminster parliamentary system within a federal structure.',
  },

  // ============ EUROPE ============
  {
    id: 'uk',
    country: 'United Kingdom',
    country_code: 'GB',
    flag: '🇬🇧',
    region: 'europe',
    title: 'Constitutional Documents of the United Kingdom',
    adopted: 'Uncodified',
    summary:
      'The UK has no single written constitution. Its constitutional order draws on Magna Carta (1215), the Bill of Rights (1689), the Acts of Union, parliamentary sovereignty, and the Human Rights Act (1998).',
  },
  {
    id: 'fr',
    country: 'France',
    country_code: 'FR',
    flag: '🇫🇷',
    region: 'europe',
    title: 'Constitution of the Fifth Republic',
    adopted: '1958',
    summary:
      'Establishes a semi-presidential system and incorporates by reference the 1789 Declaration of the Rights of Man and of the Citizen as part of the bloc of constitutionality.',
  },
  {
    id: 'it',
    country: 'Italy',
    country_code: 'IT',
    flag: '🇮🇹',
    region: 'europe',
    title: 'Constitution of the Italian Republic',
    adopted: '1948',
    summary:
      'A post-Fascist republican constitution founded on labour, popular sovereignty, and a robust catalogue of civil and social rights.',
  },
  {
    id: 'es',
    country: 'Spain',
    country_code: 'ES',
    flag: '🇪🇸',
    region: 'europe',
    title: 'Spanish Constitution',
    adopted: '1978',
    summary:
      'Adopted after the death of Franco, it founds a parliamentary monarchy with strong protection for fundamental rights and a system of autonomous communities.',
  },
  {
    id: 'ru',
    country: 'Russia',
    country_code: 'RU',
    flag: '🇷🇺',
    region: 'europe',
    title: 'Constitution of the Russian Federation',
    adopted: '1993',
    summary:
      'Adopted after the dissolution of the USSR, it establishes a semi-presidential federal republic; substantially amended in 2020.',
  },

  // ============ AMERICAS ============
  {
    id: 'ca',
    country: 'Canada',
    country_code: 'CA',
    flag: '🇨🇦',
    region: 'americas',
    title: 'Constitution Acts (1867 and 1982)',
    adopted: '1867 / 1982',
    summary:
      'Combines the British North America Act with the Charter of Rights and Freedoms, in a federal parliamentary monarchy.',
  },
  {
    id: 'mx',
    country: 'Mexico',
    country_code: 'MX',
    flag: '🇲🇽',
    region: 'americas',
    title: 'Political Constitution of the United Mexican States',
    adopted: '1917',
    summary:
      'Born of the Mexican Revolution, this was the first constitution to enshrine social rights — labour, agrarian reform, and free public education.',
  },
  {
    id: 'ar',
    country: 'Argentina',
    country_code: 'AR',
    flag: '🇦🇷',
    region: 'americas',
    title: 'Constitution of the Argentine Nation',
    adopted: '1853',
    summary:
      'Argentina\'s federal republican constitution, substantially amended in 1994 to add new rights and grant constitutional status to human rights treaties.',
  },
  {
    id: 'cl',
    country: 'Chile',
    country_code: 'CL',
    flag: '🇨🇱',
    region: 'americas',
    title: 'Political Constitution of the Republic of Chile',
    adopted: '1980',
    summary:
      'Originally adopted under the Pinochet regime and substantially reformed in 1989 and 2005, it establishes a presidential republic.',
  },

  // ============ ASIA ============
  {
    id: 'cn',
    country: 'China',
    country_code: 'CN',
    flag: '🇨🇳',
    region: 'asia',
    title: 'Constitution of the People\'s Republic of China',
    adopted: '1982',
    summary:
      'Establishes a unitary socialist state under the leadership of the Communist Party of China; amended several times, most recently in 2018.',
  },
  {
    id: 'kr',
    country: 'South Korea',
    country_code: 'KR',
    flag: '🇰🇷',
    region: 'asia',
    title: 'Constitution of the Republic of Korea',
    adopted: '1987',
    summary:
      'The Sixth Republic\'s constitution, adopted after the 1987 democratisation movement, establishing a presidential republic with a strong rights chapter.',
  },
  {
    id: 'id',
    country: 'Indonesia',
    country_code: 'ID',
    flag: '🇮🇩',
    region: 'asia',
    title: 'Constitution of the Republic of Indonesia (UUD 1945)',
    adopted: '1945',
    summary:
      'The founding charter of independent Indonesia, anchored in the five principles of Pancasila, with major amendments between 1999 and 2002 that introduced direct presidential elections.',
  },
  {
    id: 'pk',
    country: 'Pakistan',
    country_code: 'PK',
    flag: '🇵🇰',
    region: 'asia',
    title: 'Constitution of the Islamic Republic of Pakistan',
    adopted: '1973',
    summary:
      'A federal parliamentary constitution declaring Pakistan an Islamic republic, with fundamental rights and the principle that no law may be repugnant to Islamic injunctions.',
  },
  {
    id: 'ph',
    country: 'Philippines',
    country_code: 'PH',
    flag: '🇵🇭',
    region: 'asia',
    title: 'Constitution of the Republic of the Philippines',
    adopted: '1987',
    summary:
      'Adopted after the People Power Revolution, this presidential constitution restored democracy and includes a robust bill of rights.',
  },

  // ============ AFRICA ============
  {
    id: 'ke',
    country: 'Kenya',
    country_code: 'KE',
    flag: '🇰🇪',
    region: 'africa',
    title: 'Constitution of Kenya',
    adopted: '2010',
    summary:
      'A reformist constitution adopted by referendum, devolving power to 47 counties and entrenching a comprehensive Bill of Rights.',
  },
  {
    id: 'gh',
    country: 'Ghana',
    country_code: 'GH',
    flag: '🇬🇭',
    region: 'africa',
    title: 'Constitution of the Republic of Ghana',
    adopted: '1992',
    summary:
      'Establishing the Fourth Republic, this presidential constitution returned Ghana to multi-party democracy and entrenches fundamental human rights.',
  },
  {
    id: 'eg',
    country: 'Egypt',
    country_code: 'EG',
    flag: '🇪🇬',
    region: 'africa',
    title: 'Constitution of the Arab Republic of Egypt',
    adopted: '2014',
    summary:
      'Adopted by referendum after the 2013 transition, declaring Egypt a democratic republic with Islam as the state religion and Sharia as the principal source of legislation.',
  },

  // ============ MIDDLE EAST ============
  {
    id: 'sa',
    country: 'Saudi Arabia',
    country_code: 'SA',
    flag: '🇸🇦',
    region: 'mideast',
    title: 'Basic Law of Governance',
    adopted: '1992',
    summary:
      'Saudi Arabia\'s constitution-equivalent — the Qur\'an and the Sunna are declared the kingdom\'s constitution; the Basic Law sets out the system of monarchy and governance.',
  },
  {
    id: 'tr',
    country: 'Türkiye',
    country_code: 'TR',
    flag: '🇹🇷',
    region: 'mideast',
    title: 'Constitution of the Republic of Türkiye',
    adopted: '1982',
    summary:
      'Adopted under military rule and amended many times since — most extensively in 2017, which transitioned the country to a presidential system.',
  },
  {
    id: 'il',
    country: 'Israel',
    country_code: 'IL',
    flag: '🇮🇱',
    region: 'mideast',
    title: 'Basic Laws of Israel',
    adopted: 'Uncodified (since 1958)',
    summary:
      'Israel has no single written constitution. Its constitutional order is built from fourteen Basic Laws, including Human Dignity and Liberty (1992) and The Knesset (1958).',
  },

  // ============ OCEANIA ============
  {
    id: 'nz',
    country: 'New Zealand',
    country_code: 'NZ',
    flag: '🇳🇿',
    region: 'oceania',
    title: 'Constitutional Documents of New Zealand',
    adopted: 'Uncodified',
    summary:
      'New Zealand has no single written constitution. Its constitutional order combines the Constitution Act 1986, the Bill of Rights Act 1990, the Treaty of Waitangi, and parliamentary convention.',
  },
];

export const articles: BundledArticle[] = [
  // ============ UNITED STATES ============
  {
    id: 'us-preamble',
    constitution_id: 'us',
    chapter: 'Preamble',
    article_number: 'Preamble',
    title: 'Preamble',
    content:
      'We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.',
  },
  {
    id: 'us-art1',
    constitution_id: 'us',
    chapter: 'Article I — Legislative Branch',
    article_number: 'Article I, §1',
    title: 'Legislative Powers',
    content:
      'All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.',
  },
  {
    id: 'us-art2',
    constitution_id: 'us',
    chapter: 'Article II — Executive Branch',
    article_number: 'Article II, §1',
    title: 'Executive Power',
    content:
      'The executive Power shall be vested in a President of the United States of America. He shall hold his Office during the Term of four Years, and, together with the Vice President, chosen for the same Term, be elected as follows...',
  },
  {
    id: 'us-art3',
    constitution_id: 'us',
    chapter: 'Article III — Judicial Branch',
    article_number: 'Article III, §1',
    title: 'Judicial Power',
    content:
      'The judicial Power of the United States, shall be vested in one supreme Court, and in such inferior Courts as the Congress may from time to time ordain and establish.',
  },
  {
    id: 'us-amend1',
    constitution_id: 'us',
    chapter: 'Bill of Rights',
    article_number: 'Amendment I',
    title: 'Freedom of Religion, Speech, Press, Assembly, Petition',
    content:
      'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.',
  },
  {
    id: 'us-amend2',
    constitution_id: 'us',
    chapter: 'Bill of Rights',
    article_number: 'Amendment II',
    title: 'Right to Bear Arms',
    content:
      'A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.',
  },
  {
    id: 'us-amend4',
    constitution_id: 'us',
    chapter: 'Bill of Rights',
    article_number: 'Amendment IV',
    title: 'Search and Seizure',
    content:
      'The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.',
  },
  {
    id: 'us-amend5',
    constitution_id: 'us',
    chapter: 'Bill of Rights',
    article_number: 'Amendment V',
    title: 'Due Process and Self-Incrimination',
    content:
      'No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury... nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.',
  },
  {
    id: 'us-amend14',
    constitution_id: 'us',
    chapter: 'Reconstruction Amendments',
    article_number: 'Amendment XIV, §1',
    title: 'Citizenship and Equal Protection',
    content:
      'All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside. No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.',
  },

  // ============ NIGERIA ============
  {
    id: 'ng-preamble',
    constitution_id: 'ng',
    chapter: 'Preamble',
    article_number: 'Preamble',
    title: 'Preamble',
    content:
      'WE THE PEOPLE OF THE FEDERAL REPUBLIC OF NIGERIA, having firmly and solemnly resolved: to live in unity and harmony as one indivisible and indissoluble sovereign nation under God... do hereby make, enact and give to ourselves the following Constitution.',
  },
  {
    id: 'ng-ch1-s1',
    constitution_id: 'ng',
    chapter: 'Chapter I — General Provisions',
    article_number: 'Section 1',
    title: 'Supremacy of the Constitution',
    content:
      '(1) This Constitution is supreme and its provisions shall have binding force on the authorities and persons throughout the Federal Republic of Nigeria. (3) If any other law is inconsistent with the provisions of this Constitution, this Constitution shall prevail, and that other law shall, to the extent of the inconsistency, be void.',
  },
  {
    id: 'ng-ch4-s33',
    constitution_id: 'ng',
    chapter: 'Chapter IV — Fundamental Rights',
    article_number: 'Section 33',
    title: 'Right to Life',
    content:
      '(1) Every person has a right to life, and no one shall be deprived intentionally of his life, save in execution of the sentence of a court in respect of a criminal offence of which he has been found guilty in Nigeria.',
  },
  {
    id: 'ng-ch4-s35',
    constitution_id: 'ng',
    chapter: 'Chapter IV — Fundamental Rights',
    article_number: 'Section 35',
    title: 'Right to Personal Liberty',
    content:
      '(1) Every person shall be entitled to his personal liberty and no person shall be deprived of such liberty save in the following cases and in accordance with a procedure permitted by law...',
  },
  {
    id: 'ng-ch4-s39',
    constitution_id: 'ng',
    chapter: 'Chapter IV — Fundamental Rights',
    article_number: 'Section 39',
    title: 'Freedom of Expression and the Press',
    content:
      '(1) Every person shall be entitled to freedom of expression, including freedom to hold opinions and to receive and impart ideas and information without interference. (2) Without prejudice to the generality of subsection (1) of this section, every person shall be entitled to own, establish and operate any medium for the dissemination of information, ideas and opinions.',
  },
  {
    id: 'ng-ch4-s40',
    constitution_id: 'ng',
    chapter: 'Chapter IV — Fundamental Rights',
    article_number: 'Section 40',
    title: 'Right to Peaceful Assembly and Association',
    content:
      'Every person shall be entitled to assemble freely and associate with other persons, and in particular he may form or belong to any political party, trade union or any other association for the protection of his interests.',
  },
  {
    id: 'ng-ch4-s42',
    constitution_id: 'ng',
    chapter: 'Chapter IV — Fundamental Rights',
    article_number: 'Section 42',
    title: 'Right to Freedom from Discrimination',
    content:
      '(1) A citizen of Nigeria of a particular community, ethnic group, place of origin, sex, religion or political opinion shall not, by reason only that he is such a person... be subjected either expressly by, or in the practical application of, any law in force in Nigeria or any executive or administrative action of the government, to disabilities or restrictions to which citizens of Nigeria of other communities, ethnic groups, places of origin, sex, religions or political opinions are not made subject.',
  },
  {
    id: 'ng-ch6-s130',
    constitution_id: 'ng',
    chapter: 'Chapter VI — Executive',
    article_number: 'Section 130',
    title: 'Establishment of the Office of President',
    content:
      '(1) There shall be for the Federation a President. (2) The President shall be the Head of State, the Chief Executive of the Federation and Commander-in-Chief of the Armed Forces of the Federation.',
  },

  // ============ INDIA ============
  {
    id: 'in-preamble',
    constitution_id: 'in',
    chapter: 'Preamble',
    article_number: 'Preamble',
    title: 'Preamble',
    content:
      'WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity... DO HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.',
  },
  {
    id: 'in-art14',
    constitution_id: 'in',
    chapter: 'Part III — Fundamental Rights',
    article_number: 'Article 14',
    title: 'Equality before Law',
    content:
      'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
  },
  {
    id: 'in-art19',
    constitution_id: 'in',
    chapter: 'Part III — Fundamental Rights',
    article_number: 'Article 19',
    title: 'Protection of Certain Freedoms',
    content:
      '(1) All citizens shall have the right — (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; (g) to practise any profession, or to carry on any occupation, trade or business. (2) Nothing in sub-clause (a) shall affect the operation of any existing law... in the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality...',
  },
  {
    id: 'in-art21',
    constitution_id: 'in',
    chapter: 'Part III — Fundamental Rights',
    article_number: 'Article 21',
    title: 'Protection of Life and Personal Liberty',
    content:
      'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
  },
  {
    id: 'in-art32',
    constitution_id: 'in',
    chapter: 'Part III — Fundamental Rights',
    article_number: 'Article 32',
    title: 'Right to Constitutional Remedies',
    content:
      '(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. (2) The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari...',
  },

  // ============ GERMANY ============
  {
    id: 'de-art1',
    constitution_id: 'de',
    chapter: 'I. Basic Rights',
    article_number: 'Article 1',
    title: 'Human Dignity',
    content:
      '(1) Human dignity shall be inviolable. To respect and protect it shall be the duty of all state authority. (2) The German people therefore acknowledge inviolable and inalienable human rights as the basis of every community, of peace and of justice in the world. (3) The following basic rights shall bind the legislature, the executive and the judiciary as directly applicable law.',
  },
  {
    id: 'de-art2',
    constitution_id: 'de',
    chapter: 'I. Basic Rights',
    article_number: 'Article 2',
    title: 'Personal Freedoms',
    content:
      '(1) Every person shall have the right to free development of his personality insofar as he does not violate the rights of others or offend against the constitutional order or the moral law. (2) Every person shall have the right to life and physical integrity. Freedom of the person shall be inviolable.',
  },
  {
    id: 'de-art5',
    constitution_id: 'de',
    chapter: 'I. Basic Rights',
    article_number: 'Article 5',
    title: 'Freedom of Expression, Arts and Sciences',
    content:
      '(1) Every person shall have the right freely to express and disseminate his opinions in speech, writing and pictures and to inform himself without hindrance from generally accessible sources. Freedom of the press and freedom of reporting by means of broadcasts and films shall be guaranteed. There shall be no censorship.',
  },
  {
    id: 'de-art20',
    constitution_id: 'de',
    chapter: 'II. The Federation and the Länder',
    article_number: 'Article 20',
    title: 'Constitutional Principles',
    content:
      '(1) The Federal Republic of Germany is a democratic and social federal state. (2) All state authority is derived from the people. It shall be exercised by the people through elections and other votes and through specific legislative, executive and judicial bodies. (3) The legislature shall be bound by the constitutional order, the executive and the judiciary by law and justice.',
  },

  // ============ SOUTH AFRICA ============
  {
    id: 'za-s1',
    constitution_id: 'za',
    chapter: 'Chapter 1 — Founding Provisions',
    article_number: 'Section 1',
    title: 'Republic of South Africa',
    content:
      'The Republic of South Africa is one, sovereign, democratic state founded on the following values: (a) Human dignity, the achievement of equality and the advancement of human rights and freedoms. (b) Non-racialism and non-sexism. (c) Supremacy of the constitution and the rule of law. (d) Universal adult suffrage, a national common voters roll, regular elections and a multi-party system of democratic government, to ensure accountability, responsiveness and openness.',
  },
  {
    id: 'za-s9',
    constitution_id: 'za',
    chapter: 'Chapter 2 — Bill of Rights',
    article_number: 'Section 9',
    title: 'Equality',
    content:
      '(1) Everyone is equal before the law and has the right to equal protection and benefit of the law. (3) The state may not unfairly discriminate directly or indirectly against anyone on one or more grounds, including race, gender, sex, pregnancy, marital status, ethnic or social origin, colour, sexual orientation, age, disability, religion, conscience, belief, culture, language and birth.',
  },
  {
    id: 'za-s10',
    constitution_id: 'za',
    chapter: 'Chapter 2 — Bill of Rights',
    article_number: 'Section 10',
    title: 'Human Dignity',
    content:
      'Everyone has inherent dignity and the right to have their dignity respected and protected.',
  },
  {
    id: 'za-s16',
    constitution_id: 'za',
    chapter: 'Chapter 2 — Bill of Rights',
    article_number: 'Section 16',
    title: 'Freedom of Expression',
    content:
      '(1) Everyone has the right to freedom of expression, which includes — (a) freedom of the press and other media; (b) freedom to receive or impart information or ideas; (c) freedom of artistic creativity; and (d) academic freedom and freedom of scientific research. (2) The right in subsection (1) does not extend to — (a) propaganda for war; (b) incitement of imminent violence; or (c) advocacy of hatred...',
  },

  // ============ BRAZIL ============
  {
    id: 'br-art1',
    constitution_id: 'br',
    chapter: 'Title I — Fundamental Principles',
    article_number: 'Article 1',
    title: 'Foundations of the Republic',
    content:
      'The Federative Republic of Brazil, formed by the indissoluble union of the states, municipalities and the Federal District, is a democratic State based on the rule of law and is founded on: I. sovereignty; II. citizenship; III. the dignity of the human person; IV. the social values of labor and free enterprise; V. political pluralism.',
  },
  {
    id: 'br-art5',
    constitution_id: 'br',
    chapter: 'Title II — Fundamental Rights and Guarantees',
    article_number: 'Article 5',
    title: 'Individual and Collective Rights',
    content:
      'All persons are equal before the law, without any distinction whatsoever, Brazilians and foreigners residing in the country being ensured of inviolability of the right to life, liberty, equality, security and property... IV. the manifestation of thought is free, anonymity being forbidden; IX. the expression of intellectual, artistic, scientific and communications activities is free, independent of any censorship or license...',
  },

  // ============ JAPAN ============
  {
    id: 'jp-art9',
    constitution_id: 'jp',
    chapter: 'Chapter II — Renunciation of War',
    article_number: 'Article 9',
    title: 'Renunciation of War',
    content:
      'Aspiring sincerely to an international peace based on justice and order, the Japanese people forever renounce war as a sovereign right of the nation and the threat or use of force as means of settling international disputes. (2) In order to accomplish the aim of the preceding paragraph, land, sea, and air forces, as well as other war potential, will never be maintained. The right of belligerency of the state will not be recognized.',
  },
  {
    id: 'jp-art13',
    constitution_id: 'jp',
    chapter: 'Chapter III — Rights and Duties of the People',
    article_number: 'Article 13',
    title: 'Individual Dignity and Pursuit of Happiness',
    content:
      'All of the people shall be respected as individuals. Their right to life, liberty, and the pursuit of happiness shall, to the extent that it does not interfere with the public welfare, be the supreme consideration in legislation and in other governmental affairs.',
  },
  {
    id: 'jp-art21',
    constitution_id: 'jp',
    chapter: 'Chapter III — Rights and Duties of the People',
    article_number: 'Article 21',
    title: 'Freedom of Assembly, Association and Speech',
    content:
      'Freedom of assembly and association as well as speech, press and all other forms of expression are guaranteed. (2) No censorship shall be maintained, nor shall the secrecy of any means of communication be violated.',
  },

  // ============ AUSTRALIA ============
  {
    id: 'au-s1',
    constitution_id: 'au',
    chapter: 'Chapter I — The Parliament',
    article_number: 'Section 1',
    title: 'Legislative Power',
    content:
      'The legislative power of the Commonwealth shall be vested in a Federal Parliament, which shall consist of the Queen, a Senate, and a House of Representatives, and which is hereinafter called "The Parliament," or "The Parliament of the Commonwealth."',
  },
  {
    id: 'au-s51',
    constitution_id: 'au',
    chapter: 'Chapter I — The Parliament',
    article_number: 'Section 51',
    title: 'Legislative Powers of the Parliament',
    content:
      'The Parliament shall, subject to this Constitution, have power to make laws for the peace, order, and good government of the Commonwealth with respect to: (i) trade and commerce with other countries, and among the States; (ii) taxation; (vi) the naval and military defence of the Commonwealth and of the several States...',
  },
  {
    id: 'au-s116',
    constitution_id: 'au',
    chapter: 'Chapter V — The States',
    article_number: 'Section 116',
    title: 'Commonwealth not to legislate in respect of religion',
    content:
      'The Commonwealth shall not make any law for establishing any religion, or for imposing any religious observance, or for prohibiting the free exercise of any religion, and no religious test shall be required as a qualification for any office or public trust under the Commonwealth.',
  },

  // ============ UNITED KINGDOM ============
  {
    id: 'uk-magna-39',
    constitution_id: 'uk',
    chapter: 'Magna Carta (1215)',
    article_number: 'Clause 39',
    title: 'Due Process',
    content:
      'No free man shall be seized or imprisoned, or stripped of his rights or possessions, or outlawed or exiled, or deprived of his standing in any other way, nor will we proceed with force against him, or send others to do so, except by the lawful judgment of his equals or by the law of the land.',
  },
  {
    id: 'uk-bor-1689',
    constitution_id: 'uk',
    chapter: 'Bill of Rights 1689',
    article_number: 'Article 9',
    title: 'Parliamentary Privilege',
    content:
      'That the freedom of speech and debates or proceedings in Parliament ought not to be impeached or questioned in any court or place out of Parliament.',
  },
  {
    id: 'uk-hra-s6',
    constitution_id: 'uk',
    chapter: 'Human Rights Act 1998',
    article_number: 'Section 6',
    title: 'Acts of Public Authorities',
    content:
      '(1) It is unlawful for a public authority to act in a way which is incompatible with a Convention right. (3) In this section, "public authority" includes a court or tribunal, and any person certain of whose functions are functions of a public nature.',
  },

  // ============ FRANCE ============
  {
    id: 'fr-drhc-1',
    constitution_id: 'fr',
    chapter: 'Declaration of the Rights of Man and of the Citizen (1789)',
    article_number: 'Article 1',
    title: 'Liberty and Equality',
    content:
      'Men are born and remain free and equal in rights. Social distinctions can be founded only on the common good.',
  },
  {
    id: 'fr-drhc-4',
    constitution_id: 'fr',
    chapter: 'Declaration of the Rights of Man and of the Citizen (1789)',
    article_number: 'Article 4',
    title: 'Definition of Liberty',
    content:
      'Liberty consists in the freedom to do everything which injures no one else; hence the exercise of the natural rights of each man has no limits except those which assure to the other members of the society the enjoyment of the same rights. These limits can only be determined by law.',
  },
  {
    id: 'fr-1958-1',
    constitution_id: 'fr',
    chapter: 'Title I — On Sovereignty',
    article_number: 'Article 1',
    title: 'Indivisible, Secular, Democratic and Social Republic',
    content:
      'France shall be an indivisible, secular, democratic and social Republic. It shall ensure the equality of all citizens before the law, without distinction of origin, race or religion. It shall respect all beliefs. It shall be organised on a decentralised basis.',
  },

  // ============ ITALY ============
  {
    id: 'it-art1',
    constitution_id: 'it',
    chapter: 'Fundamental Principles',
    article_number: 'Article 1',
    title: 'Republic Founded on Labour',
    content:
      'Italy is a democratic Republic founded on labour. Sovereignty belongs to the people and is exercised by the people in the forms and within the limits of the Constitution.',
  },
  {
    id: 'it-art3',
    constitution_id: 'it',
    chapter: 'Fundamental Principles',
    article_number: 'Article 3',
    title: 'Equality',
    content:
      'All citizens have equal social dignity and are equal before the law, without distinction of sex, race, language, religion, political opinion, personal and social conditions. It is the duty of the Republic to remove those obstacles of an economic or social nature which constrain the freedom and equality of citizens.',
  },
  {
    id: 'it-art21',
    constitution_id: 'it',
    chapter: 'Part I — Rights and Duties of Citizens',
    article_number: 'Article 21',
    title: 'Freedom of Expression',
    content:
      'Anyone has the right to freely express their thoughts in speech, writing, or any other form of communication. The press may not be subjected to any authorisation or censorship.',
  },

  // ============ SPAIN ============
  {
    id: 'es-s1',
    constitution_id: 'es',
    chapter: 'Preliminary Part',
    article_number: 'Section 1',
    title: 'Social and Democratic State',
    content:
      '(1) Spain is hereby established as a social and democratic State, subject to the rule of law, which advocates as the highest values of its legal order, liberty, justice, equality and political pluralism. (2) National sovereignty belongs to the Spanish people, from whom all State powers emanate. (3) The political form of the Spanish State is the Parliamentary Monarchy.',
  },
  {
    id: 'es-s14',
    constitution_id: 'es',
    chapter: 'Part I — Fundamental Rights and Duties',
    article_number: 'Section 14',
    title: 'Equality before the Law',
    content:
      'Spaniards are equal before the law and may not in any way be discriminated against on account of birth, race, sex, religion, opinion or any other personal or social condition or circumstance.',
  },
  {
    id: 'es-s20',
    constitution_id: 'es',
    chapter: 'Part I — Fundamental Rights and Duties',
    article_number: 'Section 20',
    title: 'Freedom of Expression',
    content:
      '(1) The following rights are recognised and protected: (a) the right to freely express and disseminate thoughts, ideas and opinions through words, in writing or by any other means of communication; (d) the right to freely communicate or receive truthful information by any means of dissemination. (2) The exercise of these rights may not be restricted by any form of prior censorship.',
  },

  // ============ RUSSIA ============
  {
    id: 'ru-art1',
    constitution_id: 'ru',
    chapter: 'Chapter 1 — Fundamentals of the Constitutional System',
    article_number: 'Article 1',
    title: 'Federal Democratic State',
    content:
      '(1) The Russian Federation — Russia is a democratic federal law-governed State with a republican form of government. (2) The names "Russian Federation" and "Russia" shall be equal.',
  },
  {
    id: 'ru-art17',
    constitution_id: 'ru',
    chapter: 'Chapter 2 — Rights and Freedoms of Man and Citizen',
    article_number: 'Article 17',
    title: 'Recognition of Rights and Freedoms',
    content:
      '(1) In the Russian Federation, the rights and freedoms of man and citizen shall be recognised and guaranteed according to the universally recognised principles and norms of international law and according to the present Constitution. (2) The fundamental rights and freedoms of the human being are inalienable and shall belong to everyone from birth.',
  },
  {
    id: 'ru-art29',
    constitution_id: 'ru',
    chapter: 'Chapter 2 — Rights and Freedoms of Man and Citizen',
    article_number: 'Article 29',
    title: 'Freedom of Thought and Speech',
    content:
      '(1) Everyone shall be guaranteed the freedom of thought and speech. (5) The freedom of the mass media shall be guaranteed. Censorship shall be prohibited.',
  },

  // ============ CANADA ============
  {
    id: 'ca-charter-1',
    constitution_id: 'ca',
    chapter: 'Canadian Charter of Rights and Freedoms (1982)',
    article_number: 'Section 1',
    title: 'Reasonable Limits',
    content:
      'The Canadian Charter of Rights and Freedoms guarantees the rights and freedoms set out in it subject only to such reasonable limits prescribed by law as can be demonstrably justified in a free and democratic society.',
  },
  {
    id: 'ca-charter-2',
    constitution_id: 'ca',
    chapter: 'Canadian Charter of Rights and Freedoms (1982)',
    article_number: 'Section 2',
    title: 'Fundamental Freedoms',
    content:
      'Everyone has the following fundamental freedoms: (a) freedom of conscience and religion; (b) freedom of thought, belief, opinion and expression, including freedom of the press and other media of communication; (c) freedom of peaceful assembly; (d) freedom of association.',
  },
  {
    id: 'ca-charter-7',
    constitution_id: 'ca',
    chapter: 'Canadian Charter of Rights and Freedoms (1982)',
    article_number: 'Section 7',
    title: 'Life, Liberty and Security of the Person',
    content:
      'Everyone has the right to life, liberty and security of the person and the right not to be deprived thereof except in accordance with the principles of fundamental justice.',
  },
  {
    id: 'ca-charter-15',
    constitution_id: 'ca',
    chapter: 'Canadian Charter of Rights and Freedoms (1982)',
    article_number: 'Section 15',
    title: 'Equality Rights',
    content:
      '(1) Every individual is equal before and under the law and has the right to the equal protection and equal benefit of the law without discrimination and, in particular, without discrimination based on race, national or ethnic origin, colour, religion, sex, age or mental or physical disability.',
  },

  // ============ MEXICO ============
  {
    id: 'mx-art1',
    constitution_id: 'mx',
    chapter: 'Title I — On Human Rights and Their Guarantees',
    article_number: 'Article 1',
    title: 'Human Rights',
    content:
      'In the United Mexican States, all persons shall enjoy the human rights recognised in this Constitution and in the international treaties to which the Mexican State is a party. The exercise of those rights may not be restricted or suspended save in the cases and under the conditions established by this Constitution. All discrimination motivated by ethnic or national origin, gender, age, disabilities, social conditions, health conditions, religion, opinions, sexual preferences, civil status, or any other that violates human dignity, is prohibited.',
  },
  {
    id: 'mx-art3',
    constitution_id: 'mx',
    chapter: 'Title I — On Human Rights and Their Guarantees',
    article_number: 'Article 3',
    title: 'Right to Education',
    content:
      'Every person has the right to education. The State — Federation, States, Mexico City, and Municipalities — shall provide and guarantee initial, preschool, primary, secondary, upper-secondary, and higher education. Initial, preschool, primary, and secondary education together form basic education; basic education and upper-secondary are compulsory.',
  },
  {
    id: 'mx-art27',
    constitution_id: 'mx',
    chapter: 'Title I — On Human Rights and Their Guarantees',
    article_number: 'Article 27',
    title: 'Lands and Natural Resources',
    content:
      'Ownership of lands and waters within the boundaries of the national territory is vested originally in the Nation, which has had, and has, the right to transmit title thereof to private persons, thereby constituting private property.',
  },

  // ============ ARGENTINA ============
  {
    id: 'ar-art14',
    constitution_id: 'ar',
    chapter: 'First Part — Declarations, Rights and Guarantees',
    article_number: 'Article 14',
    title: 'Civil Rights',
    content:
      'All the inhabitants of the Nation are entitled to the following rights, in accordance with the laws that regulate their exercise: to work and perform any lawful industry; to navigate and trade; to petition the authorities; to enter, remain in, travel through, and leave the Argentine territory; to publish their ideas through the press without previous censorship; to make use of and dispose of their property; to associate for useful purposes; to profess freely their religion; to teach and to learn.',
  },
  {
    id: 'ar-art16',
    constitution_id: 'ar',
    chapter: 'First Part — Declarations, Rights and Guarantees',
    article_number: 'Article 16',
    title: 'Equality before the Law',
    content:
      'The Argentine Nation admits no prerogatives of blood or birth: there are neither personal privileges nor titles of nobility. All its inhabitants are equal before the law, and admissible to employment without any other requirement than their ability. Equality is the basis of taxation and public burdens.',
  },
  {
    id: 'ar-art18',
    constitution_id: 'ar',
    chapter: 'First Part — Declarations, Rights and Guarantees',
    article_number: 'Article 18',
    title: 'Due Process',
    content:
      'No inhabitant of the Nation may be punished without previous trial based on a law enacted before the act that gives rise to the proceedings, nor tried by special commissions, nor removed from the judges designated by law before the act for which he is tried. No one may be compelled to testify against himself, nor be arrested except by virtue of a written order issued by a competent authority.',
  },

  // ============ CHILE ============
  {
    id: 'cl-art1',
    constitution_id: 'cl',
    chapter: 'Chapter I — Bases of Institutional Order',
    article_number: 'Article 1',
    title: 'Dignity and Equality',
    content:
      'People are born free and equal in dignity and rights. The family is the fundamental nucleus of society. The State is at the service of the human person, and its purpose is to promote the common good.',
  },
  {
    id: 'cl-art19-1',
    constitution_id: 'cl',
    chapter: 'Chapter III — Constitutional Rights and Duties',
    article_number: 'Article 19, §1',
    title: 'Right to Life',
    content:
      'The Constitution guarantees to all persons the right to life and to the physical and psychological integrity of the person. The law protects the life of the unborn.',
  },
  {
    id: 'cl-art19-12',
    constitution_id: 'cl',
    chapter: 'Chapter III — Constitutional Rights and Duties',
    article_number: 'Article 19, §12',
    title: 'Freedom of Expression',
    content:
      'The Constitution guarantees the freedom to express opinions and to inform, without prior censorship, in any form and by any medium, without prejudice to liability for the offences and abuses committed in the exercise of these freedoms, in accordance with the law.',
  },

  // ============ CHINA ============
  {
    id: 'cn-art1',
    constitution_id: 'cn',
    chapter: 'Chapter I — General Principles',
    article_number: 'Article 1',
    title: 'Socialist State',
    content:
      'The People\'s Republic of China is a socialist state under the people\'s democratic dictatorship led by the working class and based on the alliance of workers and peasants. The socialist system is the fundamental system of the People\'s Republic of China. Leadership by the Communist Party of China is the defining feature of socialism with Chinese characteristics.',
  },
  {
    id: 'cn-art33',
    constitution_id: 'cn',
    chapter: 'Chapter II — Fundamental Rights and Duties of Citizens',
    article_number: 'Article 33',
    title: 'Equal Rights of Citizens',
    content:
      'All persons holding the nationality of the People\'s Republic of China are citizens of the People\'s Republic of China. All citizens are equal before the law. The State respects and protects human rights.',
  },
  {
    id: 'cn-art35',
    constitution_id: 'cn',
    chapter: 'Chapter II — Fundamental Rights and Duties of Citizens',
    article_number: 'Article 35',
    title: 'Freedoms of Speech and Assembly',
    content:
      'Citizens of the People\'s Republic of China enjoy freedom of speech, of the press, of assembly, of association, of procession and of demonstration.',
  },

  // ============ SOUTH KOREA ============
  {
    id: 'kr-art1',
    constitution_id: 'kr',
    chapter: 'Chapter I — General Provisions',
    article_number: 'Article 1',
    title: 'Democratic Republic',
    content:
      '(1) The Republic of Korea shall be a democratic republic. (2) The sovereignty of the Republic of Korea shall reside in the people, and all state authority shall emanate from the people.',
  },
  {
    id: 'kr-art10',
    constitution_id: 'kr',
    chapter: 'Chapter II — Rights and Duties of Citizens',
    article_number: 'Article 10',
    title: 'Human Dignity and Pursuit of Happiness',
    content:
      'All citizens shall be assured of human worth and dignity and have the right to pursue happiness. It shall be the duty of the State to confirm and guarantee the fundamental and inviolable human rights of individuals.',
  },
  {
    id: 'kr-art21',
    constitution_id: 'kr',
    chapter: 'Chapter II — Rights and Duties of Citizens',
    article_number: 'Article 21',
    title: 'Freedom of Speech and the Press',
    content:
      '(1) All citizens shall enjoy freedom of speech and the press, and freedom of assembly and association. (2) Licensing or censorship of speech and the press, and licensing of assembly and association shall not be permitted.',
  },

  // ============ INDONESIA ============
  {
    id: 'id-pancasila',
    constitution_id: 'id',
    chapter: 'Preamble — Pancasila',
    article_number: 'Preamble',
    title: 'Pancasila — The Five Principles',
    content:
      'The State of Indonesia shall be founded upon: (1) belief in the One and Only God; (2) just and civilised humanity; (3) the unity of Indonesia; (4) democracy guided by the inner wisdom in the unanimity arising out of deliberations amongst representatives; (5) social justice for all the people of Indonesia.',
  },
  {
    id: 'id-art1',
    constitution_id: 'id',
    chapter: 'Chapter I — Form and Sovereignty',
    article_number: 'Article 1',
    title: 'Unitary State and Sovereignty',
    content:
      '(1) The State of Indonesia shall be a unitary state in the form of a republic. (2) Sovereignty is in the hands of the people and shall be exercised in accordance with the Constitution. (3) The State of Indonesia shall be a state based on the rule of law.',
  },
  {
    id: 'id-art28e',
    constitution_id: 'id',
    chapter: 'Chapter X-A — Human Rights',
    article_number: 'Article 28E',
    title: 'Freedom of Religion and Expression',
    content:
      '(1) Every person shall be free to choose and to practise the religion of his/her choice; to choose his/her education and schooling, his/her occupation, his/her nationality, his/her residence within the territory of the country, and to leave the country and to subsequently return. (3) Every person shall have the right to the freedom to associate, to assemble and to express his/her opinions.',
  },

  // ============ PAKISTAN ============
  {
    id: 'pk-art8',
    constitution_id: 'pk',
    chapter: 'Part II, Chapter 1 — Fundamental Rights',
    article_number: 'Article 8',
    title: 'Laws Inconsistent with Fundamental Rights to Be Void',
    content:
      '(1) Any law, or any custom or usage having the force of law, in so far as it is inconsistent with the rights conferred by this Chapter, shall, to the extent of such inconsistency, be void. (2) The State shall not make any law which takes away or abridges the rights so conferred and any law made in contravention of this clause shall, to the extent of such contravention, be void.',
  },
  {
    id: 'pk-art9',
    constitution_id: 'pk',
    chapter: 'Part II, Chapter 1 — Fundamental Rights',
    article_number: 'Article 9',
    title: 'Security of Person',
    content:
      'No person shall be deprived of life or liberty save in accordance with law.',
  },
  {
    id: 'pk-art19',
    constitution_id: 'pk',
    chapter: 'Part II, Chapter 1 — Fundamental Rights',
    article_number: 'Article 19',
    title: 'Freedom of Speech',
    content:
      'Every citizen shall have the right to freedom of speech and expression, and there shall be freedom of the press, subject to any reasonable restrictions imposed by law in the interest of the glory of Islam or the integrity, security or defence of Pakistan or any part thereof, friendly relations with foreign States, public order, decency or morality, or in relation to contempt of court, commission of or incitement to an offence.',
  },

  // ============ PHILIPPINES ============
  {
    id: 'ph-art2-s1',
    constitution_id: 'ph',
    chapter: 'Article II — Declaration of Principles and State Policies',
    article_number: 'Article II, §1',
    title: 'Democratic and Republican State',
    content:
      'The Philippines is a democratic and republican State. Sovereignty resides in the people and all government authority emanates from them.',
  },
  {
    id: 'ph-art3-s1',
    constitution_id: 'ph',
    chapter: 'Article III — Bill of Rights',
    article_number: 'Article III, §1',
    title: 'Due Process and Equal Protection',
    content:
      'No person shall be deprived of life, liberty, or property without due process of law, nor shall any person be denied the equal protection of the laws.',
  },
  {
    id: 'ph-art3-s4',
    constitution_id: 'ph',
    chapter: 'Article III — Bill of Rights',
    article_number: 'Article III, §4',
    title: 'Freedom of Speech',
    content:
      'No law shall be passed abridging the freedom of speech, of expression, or of the press, or the right of the people peaceably to assemble and petition the government for redress of grievances.',
  },

  // ============ KENYA ============
  {
    id: 'ke-art1',
    constitution_id: 'ke',
    chapter: 'Chapter One — Sovereignty of the People and Supremacy of this Constitution',
    article_number: 'Article 1',
    title: 'Sovereignty of the People',
    content:
      '(1) All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution. (2) The people may exercise their sovereign power either directly or through their democratically elected representatives.',
  },
  {
    id: 'ke-art27',
    constitution_id: 'ke',
    chapter: 'Chapter Four — The Bill of Rights',
    article_number: 'Article 27',
    title: 'Equality and Freedom from Discrimination',
    content:
      '(1) Every person is equal before the law and has the right to equal protection and equal benefit of the law. (4) The State shall not discriminate directly or indirectly against any person on any ground, including race, sex, pregnancy, marital status, health status, ethnic or social origin, colour, age, disability, religion, conscience, belief, culture, dress, language or birth.',
  },
  {
    id: 'ke-art33',
    constitution_id: 'ke',
    chapter: 'Chapter Four — The Bill of Rights',
    article_number: 'Article 33',
    title: 'Freedom of Expression',
    content:
      '(1) Every person has the right to freedom of expression, which includes — (a) freedom to seek, receive or impart information or ideas; (b) freedom of artistic creativity; and (c) academic freedom and freedom of scientific research. (2) The right to freedom of expression does not extend to — (a) propaganda for war; (b) incitement to violence; (c) hate speech; or (d) advocacy of hatred.',
  },

  // ============ GHANA ============
  {
    id: 'gh-art1',
    constitution_id: 'gh',
    chapter: 'Chapter 1 — The Constitution',
    article_number: 'Article 1',
    title: 'Sovereignty',
    content:
      '(1) The Sovereignty of Ghana resides in the people of Ghana in whose name and for whose welfare the powers of government are to be exercised in the manner and within the limits laid down in this Constitution. (2) This Constitution shall be the supreme law of Ghana and any other law found to be inconsistent with any provision of this Constitution shall, to the extent of the inconsistency, be void.',
  },
  {
    id: 'gh-art12',
    constitution_id: 'gh',
    chapter: 'Chapter 5 — Fundamental Human Rights and Freedoms',
    article_number: 'Article 12',
    title: 'Protection of Fundamental Human Rights',
    content:
      '(1) The fundamental human rights and freedoms enshrined in this Chapter shall be respected and upheld by the Executive, Legislature and Judiciary and all other organs of government and its agencies and, where applicable to them, by all natural and legal persons in Ghana, and shall be enforceable by the Courts as provided for in this Constitution. (2) Every person in Ghana, whatever his race, place of origin, political opinion, colour, religion, creed or gender shall be entitled to the fundamental human rights and freedoms of the individual.',
  },
  {
    id: 'gh-art21',
    constitution_id: 'gh',
    chapter: 'Chapter 5 — Fundamental Human Rights and Freedoms',
    article_number: 'Article 21',
    title: 'General Fundamental Freedoms',
    content:
      '(1) All persons shall have the right to — (a) freedom of speech and expression, which shall include freedom of the press and other media; (b) freedom of thought, conscience and belief, which shall include academic freedom; (c) freedom to practise any religion and to manifest such practice; (d) freedom of assembly including freedom to take part in processions and demonstrations; (e) freedom of association.',
  },

  // ============ EGYPT ============
  {
    id: 'eg-art1',
    constitution_id: 'eg',
    chapter: 'Chapter One — The State',
    article_number: 'Article 1',
    title: 'The Arab Republic of Egypt',
    content:
      'The Arab Republic of Egypt is a sovereign, united, indivisible state, where no part may be given up, having a democratic republican system that is based on citizenship and the rule of law. Egypt is part of the Arab nation and enhances its integration and unity. It is part of the Muslim world.',
  },
  {
    id: 'eg-art2',
    constitution_id: 'eg',
    chapter: 'Chapter One — The State',
    article_number: 'Article 2',
    title: 'Religion of the State',
    content:
      'Islam is the religion of the state and Arabic is its official language. The principles of Islamic Sharia are the principle source of legislation.',
  },
  {
    id: 'eg-art65',
    constitution_id: 'eg',
    chapter: 'Chapter Three — Public Rights, Freedoms and Duties',
    article_number: 'Article 65',
    title: 'Freedom of Thought and Opinion',
    content:
      'Freedom of thought and opinion is guaranteed. Every person has the right to express their opinion verbally, in writing, through imagery, or by any other means of expression and publication.',
  },

  // ============ SAUDI ARABIA ============
  {
    id: 'sa-art1',
    constitution_id: 'sa',
    chapter: 'Chapter One — General Principles',
    article_number: 'Article 1',
    title: 'The Constitution',
    content:
      'The Kingdom of Saudi Arabia is a fully sovereign Arab Islamic State. Its religion shall be Islam and its constitution shall be the Book of God and the Sunna of His Messenger, may God\'s blessings and peace be upon him. Its language shall be Arabic and its capital shall be the city of Riyadh.',
  },
  {
    id: 'sa-art7',
    constitution_id: 'sa',
    chapter: 'Chapter Two — System of Government',
    article_number: 'Article 7',
    title: 'Source of Authority',
    content:
      'The regime in the Kingdom of Saudi Arabia derives its authority from the Book of God Most High and the Sunna of His Messenger, both of which govern this Law and all the laws of the State.',
  },
  {
    id: 'sa-art26',
    constitution_id: 'sa',
    chapter: 'Chapter Five — Rights and Duties',
    article_number: 'Article 26',
    title: 'Human Rights',
    content:
      'The State shall protect human rights in accordance with the Islamic Sharia.',
  },

  // ============ TÜRKIYE ============
  {
    id: 'tr-art1',
    constitution_id: 'tr',
    chapter: 'Part One — General Principles',
    article_number: 'Article 1',
    title: 'Form of the State',
    content:
      'The State of Türkiye is a Republic.',
  },
  {
    id: 'tr-art2',
    constitution_id: 'tr',
    chapter: 'Part One — General Principles',
    article_number: 'Article 2',
    title: 'Characteristics of the Republic',
    content:
      'The Republic of Türkiye is a democratic, secular and social state governed by rule of law, within the notions of public peace, national solidarity and justice, respecting human rights, loyal to the nationalism of Atatürk, and based on the fundamental tenets set forth in the preamble.',
  },
  {
    id: 'tr-art26',
    constitution_id: 'tr',
    chapter: 'Part Two — Fundamental Rights and Duties',
    article_number: 'Article 26',
    title: 'Freedom of Expression and Dissemination of Thought',
    content:
      'Everyone has the right to express and disseminate his/her thoughts and opinions by speech, in writing or in pictures or through other media, individually or collectively. This freedom includes the liberty of receiving or imparting information or ideas without interference by official authorities.',
  },

  // ============ ISRAEL ============
  {
    id: 'il-hdl-2',
    constitution_id: 'il',
    chapter: 'Basic Law: Human Dignity and Liberty (1992)',
    article_number: 'Section 2',
    title: 'Preservation of Life, Body and Dignity',
    content:
      'There shall be no violation of the life, body or dignity of any person as such.',
  },
  {
    id: 'il-hdl-4',
    constitution_id: 'il',
    chapter: 'Basic Law: Human Dignity and Liberty (1992)',
    article_number: 'Section 4',
    title: 'Protection of Life, Body and Dignity',
    content:
      'All persons are entitled to protection of their life, body and dignity.',
  },
  {
    id: 'il-knesset-1',
    constitution_id: 'il',
    chapter: 'Basic Law: The Knesset (1958)',
    article_number: 'Section 1',
    title: 'Status of the Knesset',
    content:
      'The Knesset is the parliament of the State.',
  },

  // ============ NEW ZEALAND ============
  {
    id: 'nz-ca-1986',
    constitution_id: 'nz',
    chapter: 'Constitution Act 1986',
    article_number: 'Section 1',
    title: 'The Sovereign in Right of New Zealand',
    content:
      'The Sovereign in right of New Zealand is the head of State of New Zealand, and shall be known by the royal style and titles proclaimed from time to time.',
  },
  {
    id: 'nz-bora-13',
    constitution_id: 'nz',
    chapter: 'New Zealand Bill of Rights Act 1990',
    article_number: 'Section 13',
    title: 'Freedom of Thought, Conscience, and Religion',
    content:
      'Everyone has the right to freedom of thought, conscience, religion, and belief, including the right to adopt and to hold opinions without interference.',
  },
  {
    id: 'nz-bora-14',
    constitution_id: 'nz',
    chapter: 'New Zealand Bill of Rights Act 1990',
    article_number: 'Section 14',
    title: 'Freedom of Expression',
    content:
      'Everyone has the right to freedom of expression, including the freedom to seek, receive, and impart information and opinions of any kind in any form.',
  },
];

export const regionLabel: Record<Region, string> = {
  africa: 'Africa',
  asia: 'Asia',
  europe: 'Europe',
  americas: 'Americas',
  oceania: 'Oceania',
  arctic: 'Arctic',
  mideast: 'Middle East',
};

export const regionColorClass: Record<Region, string> = {
  africa: 'text-region-africa bg-region-africa/10 border-region-africa/30',
  asia: 'text-region-asia bg-region-asia/10 border-region-asia/30',
  europe: 'text-region-europe bg-region-europe/10 border-region-europe/30',
  americas: 'text-region-americas bg-region-americas/10 border-region-americas/30',
  oceania: 'text-region-oceania bg-region-oceania/10 border-region-oceania/30',
  arctic: 'text-region-arctic bg-region-arctic/10 border-region-arctic/30',
  mideast: 'text-region-mideast bg-region-mideast/10 border-region-mideast/30',
};
