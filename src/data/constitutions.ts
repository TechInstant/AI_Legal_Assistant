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
