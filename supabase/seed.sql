
-- =========================================================================
-- CONSTITUTIONS
-- =========================================================================

insert into public.constitutions (id, country, country_code, flag, region, title, adopted, summary) values
  ('us','United States of America','US','🇺🇸','americas','Constitution of the United States','1788',
   'The supreme law of the U.S., establishing the federal government, separation of powers, and protecting fundamental civil liberties through the Bill of Rights.'),
  ('ng','Nigeria','NG','🇳🇬','africa','Constitution of the Federal Republic of Nigeria','1999',
   'Establishes Nigeria as a federal republic with a presidential system, defining fundamental rights, federalism, and the structure of government.'),
  ('in','India','IN','🇮🇳','asia','Constitution of India','1950',
   'The longest written national constitution in force, providing a parliamentary federal democracy and an extensive bill of fundamental rights.'),
  ('de','Germany','DE','🇩🇪','europe','Basic Law for the Federal Republic of Germany','1949',
   'The Grundgesetz — Germany''s post-war constitution, anchored in the inviolability of human dignity and a federal parliamentary democracy.'),
  ('za','South Africa','ZA','🇿🇦','africa','Constitution of the Republic of South Africa','1996',
   'Hailed as one of the world''s most progressive constitutions, founded on dignity, equality, and a justiciable Bill of Rights.'),
  ('br','Brazil','BR','🇧🇷','americas','Constitution of the Federative Republic of Brazil','1988',
   'Known as the "Citizen Constitution," it re-established democracy after military rule and enshrines extensive social rights.'),
  ('jp','Japan','JP','🇯🇵','asia','Constitution of Japan','1947',
   'A pacifist post-war constitution that vests sovereignty in the people and renounces war as a sovereign right of the nation.'),
  ('au','Australia','AU','🇦🇺','oceania','Commonwealth of Australia Constitution Act','1901',
   'Federates the Australian colonies into the Commonwealth and establishes a Westminster parliamentary system within a federal structure.')
on conflict (id) do update set
  country = excluded.country,
  country_code = excluded.country_code,
  flag = excluded.flag,
  region = excluded.region,
  title = excluded.title,
  adopted = excluded.adopted,
  summary = excluded.summary;

-- =========================================================================
-- ARTICLES
-- =========================================================================

insert into public.articles (id, constitution_id, chapter, article_number, title, content, ord) values
  -- United States
  ('us-preamble','us','Preamble','Preamble','Preamble',
   'We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.', 1),
  ('us-art1','us','Article I — Legislative Branch','Article I, §1','Legislative Powers',
   'All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.', 2),
  ('us-art2','us','Article II — Executive Branch','Article II, §1','Executive Power',
   'The executive Power shall be vested in a President of the United States of America. He shall hold his Office during the Term of four Years, and, together with the Vice President, chosen for the same Term, be elected as follows...', 3),
  ('us-art3','us','Article III — Judicial Branch','Article III, §1','Judicial Power',
   'The judicial Power of the United States, shall be vested in one supreme Court, and in such inferior Courts as the Congress may from time to time ordain and establish.', 4),
  ('us-amend1','us','Bill of Rights','Amendment I','Freedom of Religion, Speech, Press, Assembly, Petition',
   'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.', 5),
  ('us-amend2','us','Bill of Rights','Amendment II','Right to Bear Arms',
   'A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.', 6),
  ('us-amend4','us','Bill of Rights','Amendment IV','Search and Seizure',
   'The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.', 7),
  ('us-amend5','us','Bill of Rights','Amendment V','Due Process and Self-Incrimination',
   'No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury... nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.', 8),
  ('us-amend14','us','Reconstruction Amendments','Amendment XIV, §1','Citizenship and Equal Protection',
   'All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside. No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.', 9),

  -- Nigeria
  ('ng-preamble','ng','Preamble','Preamble','Preamble',
   'WE THE PEOPLE OF THE FEDERAL REPUBLIC OF NIGERIA, having firmly and solemnly resolved: to live in unity and harmony as one indivisible and indissoluble sovereign nation under God... do hereby make, enact and give to ourselves the following Constitution.', 1),
  ('ng-ch1-s1','ng','Chapter I — General Provisions','Section 1','Supremacy of the Constitution',
   '(1) This Constitution is supreme and its provisions shall have binding force on the authorities and persons throughout the Federal Republic of Nigeria. (3) If any other law is inconsistent with the provisions of this Constitution, this Constitution shall prevail, and that other law shall, to the extent of the inconsistency, be void.', 2),
  ('ng-ch4-s33','ng','Chapter IV — Fundamental Rights','Section 33','Right to Life',
   '(1) Every person has a right to life, and no one shall be deprived intentionally of his life, save in execution of the sentence of a court in respect of a criminal offence of which he has been found guilty in Nigeria.', 3),
  ('ng-ch4-s35','ng','Chapter IV — Fundamental Rights','Section 35','Right to Personal Liberty',
   '(1) Every person shall be entitled to his personal liberty and no person shall be deprived of such liberty save in the following cases and in accordance with a procedure permitted by law...', 4),
  ('ng-ch4-s39','ng','Chapter IV — Fundamental Rights','Section 39','Freedom of Expression and the Press',
   '(1) Every person shall be entitled to freedom of expression, including freedom to hold opinions and to receive and impart ideas and information without interference. (2) Without prejudice to the generality of subsection (1) of this section, every person shall be entitled to own, establish and operate any medium for the dissemination of information, ideas and opinions.', 5),
  ('ng-ch4-s40','ng','Chapter IV — Fundamental Rights','Section 40','Right to Peaceful Assembly and Association',
   'Every person shall be entitled to assemble freely and associate with other persons, and in particular he may form or belong to any political party, trade union or any other association for the protection of his interests.', 6),
  ('ng-ch4-s42','ng','Chapter IV — Fundamental Rights','Section 42','Right to Freedom from Discrimination',
   '(1) A citizen of Nigeria of a particular community, ethnic group, place of origin, sex, religion or political opinion shall not, by reason only that he is such a person... be subjected either expressly by, or in the practical application of, any law in force in Nigeria or any executive or administrative action of the government, to disabilities or restrictions to which citizens of Nigeria of other communities, ethnic groups, places of origin, sex, religions or political opinions are not made subject.', 7),
  ('ng-ch6-s130','ng','Chapter VI — Executive','Section 130','Establishment of the Office of President',
   '(1) There shall be for the Federation a President. (2) The President shall be the Head of State, the Chief Executive of the Federation and Commander-in-Chief of the Armed Forces of the Federation.', 8),

  -- India
  ('in-preamble','in','Preamble','Preamble','Preamble',
   'WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity... DO HEREBY ADOPT, ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.', 1),
  ('in-art14','in','Part III — Fundamental Rights','Article 14','Equality before Law',
   'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.', 2),
  ('in-art19','in','Part III — Fundamental Rights','Article 19','Protection of Certain Freedoms',
   '(1) All citizens shall have the right — (a) to freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout the territory of India; (e) to reside and settle in any part of the territory of India; (g) to practise any profession, or to carry on any occupation, trade or business. (2) Nothing in sub-clause (a) shall affect the operation of any existing law... in the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality...', 3),
  ('in-art21','in','Part III — Fundamental Rights','Article 21','Protection of Life and Personal Liberty',
   'No person shall be deprived of his life or personal liberty except according to procedure established by law.', 4),
  ('in-art32','in','Part III — Fundamental Rights','Article 32','Right to Constitutional Remedies',
   '(1) The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by this Part is guaranteed. (2) The Supreme Court shall have power to issue directions or orders or writs, including writs in the nature of habeas corpus, mandamus, prohibition, quo warranto and certiorari...', 5),

  -- Germany
  ('de-art1','de','I. Basic Rights','Article 1','Human Dignity',
   '(1) Human dignity shall be inviolable. To respect and protect it shall be the duty of all state authority. (2) The German people therefore acknowledge inviolable and inalienable human rights as the basis of every community, of peace and of justice in the world. (3) The following basic rights shall bind the legislature, the executive and the judiciary as directly applicable law.', 1),
  ('de-art2','de','I. Basic Rights','Article 2','Personal Freedoms',
   '(1) Every person shall have the right to free development of his personality insofar as he does not violate the rights of others or offend against the constitutional order or the moral law. (2) Every person shall have the right to life and physical integrity. Freedom of the person shall be inviolable.', 2),
  ('de-art5','de','I. Basic Rights','Article 5','Freedom of Expression, Arts and Sciences',
   '(1) Every person shall have the right freely to express and disseminate his opinions in speech, writing and pictures and to inform himself without hindrance from generally accessible sources. Freedom of the press and freedom of reporting by means of broadcasts and films shall be guaranteed. There shall be no censorship.', 3),
  ('de-art20','de','II. The Federation and the Länder','Article 20','Constitutional Principles',
   '(1) The Federal Republic of Germany is a democratic and social federal state. (2) All state authority is derived from the people. It shall be exercised by the people through elections and other votes and through specific legislative, executive and judicial bodies. (3) The legislature shall be bound by the constitutional order, the executive and the judiciary by law and justice.', 4),

  -- South Africa
  ('za-s1','za','Chapter 1 — Founding Provisions','Section 1','Republic of South Africa',
   'The Republic of South Africa is one, sovereign, democratic state founded on the following values: (a) Human dignity, the achievement of equality and the advancement of human rights and freedoms. (b) Non-racialism and non-sexism. (c) Supremacy of the constitution and the rule of law. (d) Universal adult suffrage, a national common voters roll, regular elections and a multi-party system of democratic government, to ensure accountability, responsiveness and openness.', 1),
  ('za-s9','za','Chapter 2 — Bill of Rights','Section 9','Equality',
   '(1) Everyone is equal before the law and has the right to equal protection and benefit of the law. (3) The state may not unfairly discriminate directly or indirectly against anyone on one or more grounds, including race, gender, sex, pregnancy, marital status, ethnic or social origin, colour, sexual orientation, age, disability, religion, conscience, belief, culture, language and birth.', 2),
  ('za-s10','za','Chapter 2 — Bill of Rights','Section 10','Human Dignity',
   'Everyone has inherent dignity and the right to have their dignity respected and protected.', 3),
  ('za-s16','za','Chapter 2 — Bill of Rights','Section 16','Freedom of Expression',
   '(1) Everyone has the right to freedom of expression, which includes — (a) freedom of the press and other media; (b) freedom to receive or impart information or ideas; (c) freedom of artistic creativity; and (d) academic freedom and freedom of scientific research. (2) The right in subsection (1) does not extend to — (a) propaganda for war; (b) incitement of imminent violence; or (c) advocacy of hatred...', 4),

  -- Brazil
  ('br-art1','br','Title I — Fundamental Principles','Article 1','Foundations of the Republic',
   'The Federative Republic of Brazil, formed by the indissoluble union of the states, municipalities and the Federal District, is a democratic State based on the rule of law and is founded on: I. sovereignty; II. citizenship; III. the dignity of the human person; IV. the social values of labor and free enterprise; V. political pluralism.', 1),
  ('br-art5','br','Title II — Fundamental Rights and Guarantees','Article 5','Individual and Collective Rights',
   'All persons are equal before the law, without any distinction whatsoever, Brazilians and foreigners residing in the country being ensured of inviolability of the right to life, liberty, equality, security and property... IV. the manifestation of thought is free, anonymity being forbidden; IX. the expression of intellectual, artistic, scientific and communications activities is free, independent of any censorship or license...', 2),

  -- Japan
  ('jp-art9','jp','Chapter II — Renunciation of War','Article 9','Renunciation of War',
   'Aspiring sincerely to an international peace based on justice and order, the Japanese people forever renounce war as a sovereign right of the nation and the threat or use of force as means of settling international disputes. (2) In order to accomplish the aim of the preceding paragraph, land, sea, and air forces, as well as other war potential, will never be maintained. The right of belligerency of the state will not be recognized.', 1),
  ('jp-art13','jp','Chapter III — Rights and Duties of the People','Article 13','Individual Dignity and Pursuit of Happiness',
   'All of the people shall be respected as individuals. Their right to life, liberty, and the pursuit of happiness shall, to the extent that it does not interfere with the public welfare, be the supreme consideration in legislation and in other governmental affairs.', 2),
  ('jp-art21','jp','Chapter III — Rights and Duties of the People','Article 21','Freedom of Assembly, Association and Speech',
   'Freedom of assembly and association as well as speech, press and all other forms of expression are guaranteed. (2) No censorship shall be maintained, nor shall the secrecy of any means of communication be violated.', 3),

  -- Australia
  ('au-s1','au','Chapter I — The Parliament','Section 1','Legislative Power',
   'The legislative power of the Commonwealth shall be vested in a Federal Parliament, which shall consist of the Queen, a Senate, and a House of Representatives, and which is hereinafter called "The Parliament," or "The Parliament of the Commonwealth."', 1),
  ('au-s51','au','Chapter I — The Parliament','Section 51','Legislative Powers of the Parliament',
   'The Parliament shall, subject to this Constitution, have power to make laws for the peace, order, and good government of the Commonwealth with respect to: (i) trade and commerce with other countries, and among the States; (ii) taxation; (vi) the naval and military defence of the Commonwealth and of the several States...', 2),
  ('au-s116','au','Chapter V — The States','Section 116','Commonwealth not to legislate in respect of religion',
   'The Commonwealth shall not make any law for establishing any religion, or for imposing any religious observance, or for prohibiting the free exercise of any religion, and no religious test shall be required as a qualification for any office or public trust under the Commonwealth.', 3)
on conflict (id) do update set
  constitution_id = excluded.constitution_id,
  chapter = excluded.chapter,
  article_number = excluded.article_number,
  title = excluded.title,
  content = excluded.content,
  ord = excluded.ord;
