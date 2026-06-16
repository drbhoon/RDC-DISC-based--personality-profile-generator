// ============================================================================
// RDC DISC INSTRUMENT — QUESTION SET v2 (Thomas-style two-part format)
// 24 rows. Each option = { dim, word, qualifier (EN shadow phrase), hi (Hindi) }
// Format inspired by Thomas PPA structure (two-part descriptor) — wording is
// ORIGINAL to RDC. The qualifier phrase shows the shadow side of each trait so
// candidates choose honestly, not by social desirability.
// Scoring is unchanged: tally Most/Least per dim -> G1/G2/G3.
// ============================================================================

export const QUESTIONS_V2 = [
  // Row 1
  [
    { dim:"D", word:"Results-driven", qualifier:"pushes for outcomes, can overlook people", hi:"परिणाम-केंद्रित — नतीजों पर ज़ोर देता है, कभी-कभी लोगों की अनदेखी कर सकता है" },
    { dim:"I", word:"Inspiring",      qualifier:"lifts others up, seeks recognition",       hi:"प्रेरणादायक — दूसरों का हौसला बढ़ाता है, सराहना चाहता है" },
    { dim:"S", word:"Supportive",     qualifier:"dependable helper, avoids the spotlight",  hi:"सहायक — भरोसेमंद मददगार, दिखावे से बचता है" },
    { dim:"C", word:"Careful",        qualifier:"checks everything, slow to commit",        hi:"सावधान — हर चीज़ जाँचता है, निर्णय में समय लेता है" },
  ],
  // Row 2
  [
    { dim:"D", word:"Decisive",     qualifier:"commits fast, may act before full facts", hi:"निर्णायक — जल्दी फैसला करता है, कभी पूरी जानकारी से पहले" },
    { dim:"I", word:"Enthusiastic", qualifier:"brings energy, can overpromise",           hi:"उत्साही — ऊर्जा लाता है, कभी ज़्यादा वादे कर देता है" },
    { dim:"S", word:"Patient",      qualifier:"waits calmly, can seem unhurried",         hi:"धैर्यवान — शांति से प्रतीक्षा करता है, कभी सुस्त लग सकता है" },
    { dim:"C", word:"Accurate",     qualifier:"gets details right, can over-focus on small things", hi:"सटीक — विवरण सही रखता है, कभी छोटी बातों में उलझ जाता है" },
  ],
  // Row 3
  [
    { dim:"D", word:"Competitive", qualifier:"driven to win, dislikes losing",      hi:"प्रतिस्पर्धी — जीतने की लगन, हार पसंद नहीं" },
    { dim:"I", word:"Talkative",   qualifier:"communicates freely, can dominate discussion", hi:"बातूनी — खुलकर बात करता है, कभी चर्चा पर हावी हो जाता है" },
    { dim:"S", word:"Gentle",      qualifier:"soft in approach, avoids confrontation", hi:"कोमल — नरम स्वभाव, टकराव से बचता है" },
    { dim:"C", word:"Systematic",  qualifier:"follows clear steps, resists shortcuts", hi:"व्यवस्थित — स्पष्ट क्रम से चलता है, शॉर्टकट से बचता है" },
  ],
  // Row 4
  [
    { dim:"D", word:"Bold",       qualifier:"takes a stand, can seem forceful",   hi:"साहसी — अपनी बात पर अड़ता है, कभी दबंग लग सकता है" },
    { dim:"I", word:"Optimistic", qualifier:"expects the best, may overlook risks", hi:"आशावादी — अच्छे की उम्मीद, कभी जोखिम अनदेखा कर देता है" },
    { dim:"S", word:"Reliable",   qualifier:"keeps promises, sticks to the known way", hi:"विश्वसनीय — वादे निभाता है, जाने-पहचाने तरीके पर टिका रहता है" },
    { dim:"C", word:"Analytical", qualifier:"studies before acting, can over-think", hi:"विश्लेषणात्मक — कार्य से पहले अध्ययन, कभी ज़्यादा सोचता है" },
  ],
  // Row 5
  [
    { dim:"D", word:"Demanding", qualifier:"sets a high bar, can pressure others", hi:"मांग करने वाला — ऊँचे मानक, कभी दूसरों पर दबाव डालता है" },
    { dim:"I", word:"Sociable",  qualifier:"makes friends easily, dislikes being alone", hi:"मिलनसार — आसानी से दोस्त बनाता है, अकेलापन पसंद नहीं" },
    { dim:"S", word:"Stable",    qualifier:"steady under change, slow to shift gears", hi:"स्थिर — बदलाव में भी शांत, गति बदलने में धीमा" },
    { dim:"C", word:"Precise",   qualifier:"exact in work, fussy about correctness", hi:"परिशुद्ध — काम में सटीक, शुद्धता को लेकर बारीक" },
  ],
  // Row 6
  [
    { dim:"D", word:"Driven",     qualifier:"works hard for goals, can ignore limits", hi:"लक्ष्य-प्रेरित — लक्ष्य के लिए कड़ी मेहनत, कभी सीमाएँ भूल जाता है" },
    { dim:"I", word:"Persuasive", qualifier:"wins people over, leans on charm",        hi:"प्रभावशाली — लोगों को मना लेता है, आकर्षण पर निर्भर" },
    { dim:"S", word:"Calm",       qualifier:"keeps composure, may seem passive",       hi:"शांत — संयम बनाए रखता है, कभी निष्क्रिय लग सकता है" },
    { dim:"C", word:"Thorough",   qualifier:"leaves nothing out, takes more time",     hi:"पूर्ण — कुछ नहीं छोड़ता, अधिक समय लेता है" },
  ],
  // Row 7
  [
    { dim:"D", word:"Direct",     qualifier:"says it plainly, can seem blunt",   hi:"सीधा — साफ़ कहता है, कभी कठोर लग सकता है" },
    { dim:"I", word:"Lively",     qualifier:"brings cheer, can lose focus",      hi:"जीवंत — माहौल खुशनुमा करता है, कभी ध्यान भटक जाता है" },
    { dim:"S", word:"Steady",     qualifier:"keeps an even pace, dislikes rush", hi:"स्थिरचित्त — एक समान गति, जल्दबाज़ी पसंद नहीं" },
    { dim:"C", word:"Diplomatic", qualifier:"handles things tactfully, avoids saying no", hi:"कूटनीतिक — चतुराई से संभालता है, मना करने से बचता है" },
  ],
  // Row 8
  [
    { dim:"D", word:"Strong-willed", qualifier:"holds the line, can seem stubborn",    hi:"दृढ़निश्चयी — अपनी बात पर टिका, कभी ज़िद्दी लग सकता है" },
    { dim:"I", word:"Expressive",    qualifier:"shows feelings openly, can over-share", hi:"भावप्रवण — भावनाएँ खुलकर दिखाता है, कभी ज़्यादा साझा कर देता है" },
    { dim:"S", word:"Agreeable",     qualifier:"easy to work with, avoids conflict",   hi:"सहमतिशील — साथ काम करना आसान, टकराव से बचता है" },
    { dim:"C", word:"Detail-minded", qualifier:"spots small errors, can miss the big picture", hi:"विवरण-उन्मुख — छोटी गलतियाँ पकड़ता है, कभी बड़ी तस्वीर चूक जाता है" },
  ],
  // Row 9
  [
    { dim:"D", word:"Forceful",    qualifier:"drives things through, can overpower others", hi:"प्रभावी — काम करवा लेता है, कभी दूसरों पर हावी हो जाता है" },
    { dim:"I", word:"Trusting",    qualifier:"believes in people, can be let down",         hi:"भरोसेमंद — लोगों पर विश्वास, कभी धोखा खा सकता है" },
    { dim:"S", word:"Sincere",     qualifier:"honest and genuine, takes things to heart",   hi:"निष्कपट — ईमानदार और सच्चा, बातें दिल पर लेता है" },
    { dim:"C", word:"Questioning", qualifier:"probes deeply, can seem doubtful",            hi:"जिज्ञासु — गहराई से परखता है, कभी संशयी लग सकता है" },
  ],
  // Row 10
  [
    { dim:"D", word:"Result-focused",  qualifier:"cares about the outcome, less about the process", hi:"परिणाम-उन्मुख — नतीजे की परवाह, प्रक्रिया कम" },
    { dim:"I", word:"People-focused",  qualifier:"cares about relationships, less about rules",      hi:"लोग-उन्मुख — रिश्तों की परवाह, नियम कम" },
    { dim:"S", word:"Process-focused", qualifier:"cares about steady method, less about speed",      hi:"प्रक्रिया-उन्मुख — स्थिर तरीके की परवाह, गति कम" },
    { dim:"C", word:"Quality-focused", qualifier:"cares about getting it right, less about pace",    hi:"गुणवत्ता-उन्मुख — सही करने की परवाह, रफ़्तार कम" },
  ],
  // Row 11
  [
    { dim:"D", word:"Assertive",  qualifier:"states needs clearly, can seem pushy",  hi:"दृढ़ — अपनी ज़रूरतें स्पष्ट कहता है, कभी दबाव डालने वाला लग सकता है" },
    { dim:"I", word:"Charming",   qualifier:"draws people in, relies on likeability", hi:"आकर्षक — लोगों को खींचता है, लोकप्रियता पर निर्भर" },
    { dim:"S", word:"Consistent", qualifier:"same every day, resists new ways",       hi:"निरंतर — हर दिन एक जैसा, नए तरीकों से बचता है" },
    { dim:"C", word:"Methodical", qualifier:"organised and orderly, slow to improvise", hi:"क्रमबद्ध — व्यवस्थित, तत्काल बदलाव में धीमा" },
  ],
  // Row 12
  [
    { dim:"D", word:"Tough",      qualifier:"handles pressure, can seem hard",     hi:"कठोर — दबाव झेलता है, कभी सख़्त लग सकता है" },
    { dim:"I", word:"Animated",   qualifier:"full of energy, can be excitable",    hi:"जोशीला — ऊर्जा से भरा, कभी अति-उत्साहित" },
    { dim:"S", word:"Loyal",      qualifier:"stands by the team, slow to challenge", hi:"वफादार — टीम के साथ खड़ा, सवाल उठाने में धीमा" },
    { dim:"C", word:"Structured", qualifier:"likes clear rules, uneasy without them", hi:"संरचित — स्पष्ट नियम पसंद, उनके बिना असहज" },
  ],
  // Row 13
  [
    { dim:"D", word:"Risk-taking", qualifier:"acts despite uncertainty, can be reckless", hi:"जोखिम लेने वाला — अनिश्चितता में भी कदम उठाता है, कभी लापरवाह" },
    { dim:"I", word:"Warm",        qualifier:"makes people feel valued, avoids hard truths", hi:"उष्ण — लोगों को महत्व का एहसास, कड़वी सच्चाई से बचता है" },
    { dim:"S", word:"Dependable",  qualifier:"always delivers, sticks to routine",          hi:"भरोसेमंद — हमेशा काम पूरा करता है, दिनचर्या पर टिका" },
    { dim:"C", word:"Objective",   qualifier:"judges by facts, can seem detached",          hi:"वस्तुनिष्ठ — तथ्यों से आँकता है, कभी अलिप्त लग सकता है" },
  ],
  // Row 14
  [
    { dim:"D", word:"Urgent",     qualifier:"drives for speed, can rush others", hi:"तत्पर — गति पर ज़ोर, कभी दूसरों को जल्दबाज़ी में डालता है" },
    { dim:"I", word:"Outgoing",   qualifier:"enjoys people, dislikes working solo", hi:"बहिर्मुखी — लोगों के साथ खुश, अकेले काम पसंद नहीं" },
    { dim:"S", word:"Deliberate", qualifier:"acts with thought, can be slow",      hi:"सोच-समझकर — विचार से काम करता है, कभी धीमा" },
    { dim:"C", word:"Cautious",   qualifier:"weighs the risk, hesitant to leap",   hi:"सतर्क — जोखिम तौलता है, छलांग लगाने में हिचकिचाता है" },
  ],
  // Row 15
  [
    { dim:"D", word:"Challenging", qualifier:"pushes for better, can unsettle people", hi:"चुनौती देने वाला — बेहतरी के लिए प्रेरित, कभी लोगों को असहज करता है" },
    { dim:"I", word:"Friendly",    qualifier:"easy to approach, avoids tough talk",    hi:"मित्रवत — सहज सुलभ, कठिन बातचीत से बचता है" },
    { dim:"S", word:"Unhurried",   qualifier:"does it properly, can hold things up",   hi:"बिना जल्दबाज़ी — ठीक से करता है, कभी काम रोक देता है" },
    { dim:"C", word:"Exacting",    qualifier:"demands high standard, hard to satisfy", hi:"कड़े मानक वाला — उच्च मानक माँगता है, संतुष्ट करना कठिन" },
  ],
  // Row 16
  [
    { dim:"D", word:"Independent",  qualifier:"decides alone, dislikes being directed", hi:"स्वतंत्र — अकेले निर्णय लेता है, निर्देश पसंद नहीं" },
    { dim:"I", word:"Spontaneous",  qualifier:"acts in the moment, skips planning",     hi:"स्वतःस्फूर्त — तुरंत कार्य करता है, योजना छोड़ देता है" },
    { dim:"S", word:"Cooperative",  qualifier:"works well with others, defers to the group", hi:"सहयोगी — दूसरों के साथ अच्छा, समूह की राय मानता है" },
    { dim:"C", word:"Disciplined",  qualifier:"follows the routine, resists exceptions", hi:"अनुशासित — दिनचर्या का पालन, अपवादों से बचता है" },
  ],
  // Row 17
  [
    { dim:"D", word:"Determined",    qualifier:"never gives up, can dig in too hard",   hi:"दृढ़ — हार नहीं मानता, कभी ज़्यादा अड़ जाता है" },
    { dim:"I", word:"Magnetic",      qualifier:"draws attention, needs an audience",    hi:"आकर्षक व्यक्तित्व — ध्यान खींचता है, श्रोता चाहता है" },
    { dim:"S", word:"Accommodating", qualifier:"fits in with others, sets own needs aside", hi:"समायोजनशील — दूसरों के साथ ढल जाता है, अपनी ज़रूरतें पीछे रखता है" },
    { dim:"C", word:"Logical",       qualifier:"reasons it out, can seem cold",         hi:"तार्किक — तर्क से सोचता है, कभी ठंडा लग सकता है" },
  ],
  // Row 18
  [
    { dim:"D", word:"Pioneering",    qualifier:"tries new paths, can leave others behind", hi:"अग्रणी — नई राह आज़माता है, कभी दूसरों को पीछे छोड़ देता है" },
    { dim:"I", word:"Communicative", qualifier:"keeps people informed, can talk too much",  hi:"संचारशील — लोगों को जानकारी देता है, कभी ज़्यादा बोलता है" },
    { dim:"S", word:"Even-tempered", qualifier:"stays balanced, slow to show urgency",      hi:"संतुलित — संयमित रहता है, तत्परता दिखाने में धीमा" },
    { dim:"C", word:"Diligent",      qualifier:"works with care, can be painstaking",       hi:"परिश्रमी — ध्यान से काम करता है, कभी अति-सावधान" },
  ],
  // Row 19
  [
    { dim:"D", word:"Commanding",    qualifier:"takes charge, can overpower a room",   hi:"नेतृत्वकारी — कमान संभालता है, कभी पूरे माहौल पर हावी" },
    { dim:"I", word:"Generous",      qualifier:"gives freely, can be taken advantage of", hi:"उदार — खुले दिल से देता है, कभी फ़ायदा उठाया जा सकता है" },
    { dim:"S", word:"Modest",        qualifier:"stays humble, undersells own worth",   hi:"विनम्र — विनयशील रहता है, अपनी क़ीमत कम आँकता है" },
    { dim:"C", word:"Perfectionist", qualifier:"wants it flawless, never fully satisfied", hi:"पूर्णतावादी — निर्दोष चाहता है, कभी पूरी तरह संतुष्ट नहीं" },
  ],
  // Row 20
  [
    { dim:"D", word:"Resolute",       qualifier:"firm in decisions, slow to change mind", hi:"अटल — निर्णय में दृढ़, मन बदलने में धीमा" },
    { dim:"I", word:"Cheerful",       qualifier:"lifts the mood, can avoid the serious",  hi:"प्रसन्नचित्त — माहौल हल्का करता है, गंभीर बातों से बचता है" },
    { dim:"S", word:"Predictable",    qualifier:"steady and known, resists surprises",    hi:"अनुमेय — स्थिर और जाना-पहचाना, अचानक बदलाव से बचता है" },
    { dim:"C", word:"Conscientious",  qualifier:"does it right, worries about mistakes",   hi:"कर्तव्यनिष्ठ — सही करता है, गलतियों की चिंता करता है" },
  ],
  // Row 21
  [
    { dim:"D", word:"Action-oriented", qualifier:"moves fast, can skip the thinking",  hi:"क्रियाशील — तेज़ी से चलता है, कभी सोच छोड़ देता है" },
    { dim:"I", word:"Engaging",        qualifier:"good with people, can lack follow-through", hi:"आकर्षक संवादी — लोगों से अच्छा, कभी काम अधूरा छोड़ देता है" },
    { dim:"S", word:"Tolerant",        qualifier:"accepts differences, slow to push back", hi:"सहिष्णु — मतभेद स्वीकारता है, विरोध में धीमा" },
    { dim:"C", word:"Meticulous",      qualifier:"careful with detail, can lose the big view", hi:"सूक्ष्म — विवरण में सावधान, कभी बड़ी तस्वीर चूक जाता है" },
  ],
  // Row 22
  [
    { dim:"D", word:"Controlling", qualifier:"likes to steer, struggles to delegate", hi:"नियंत्रणकारी — दिशा तय करना पसंद, ज़िम्मेदारी सौंपने में कठिनाई" },
    { dim:"I", word:"Influential", qualifier:"shifts opinions, leans on persuasion",  hi:"प्रभावशाली — राय बदलता है, समझाने पर निर्भर" },
    { dim:"S", word:"Humble",      qualifier:"stays low-key, avoids the limelight",   hi:"विनयशील — सादगी से रहता है, सुर्ख़ियों से बचता है" },
    { dim:"C", word:"Orderly",     qualifier:"keeps things neat, uneasy with mess",   hi:"सुव्यवस्थित — चीज़ें साफ़ रखता है, अव्यवस्था से असहज" },
  ],
  // Row 23
  [
    { dim:"D", word:"Adventurous", qualifier:"open to the unknown, can act rashly",  hi:"साहसी — अज्ञात के लिए तैयार, कभी जल्दबाज़ी में काम" },
    { dim:"I", word:"Positive",    qualifier:"sees the bright side, can overlook problems", hi:"सकारात्मक — अच्छाई देखता है, कभी समस्याएँ अनदेखी कर देता है" },
    { dim:"S", word:"Composed",    qualifier:"stays settled, slow to react",         hi:"शांतचित्त — स्थिर रहता है, प्रतिक्रिया में धीमा" },
    { dim:"C", word:"Fact-based",  qualifier:"relies on evidence, distrusts gut feel", hi:"तथ्य-आधारित — प्रमाण पर निर्भर, अंतर्ज्ञान पर भरोसा नहीं" },
  ],
  // Row 24
  [
    { dim:"D", word:"Confident",  qualifier:"believes in own ability, can seem self-assured", hi:"आत्मविश्वासी — अपनी क्षमता पर भरोसा, कभी अति-आश्वस्त लग सकता है" },
    { dim:"I", word:"Outspoken",  qualifier:"shares openly, can dominate the mood",          hi:"मुखर — खुलकर बोलता है, कभी माहौल पर हावी हो जाता है" },
    { dim:"S", word:"Thoughtful", qualifier:"considers others, slow to assert self",         hi:"विचारशील — दूसरों का ख़याल, ख़ुद को आगे रखने में धीमा" },
    { dim:"C", word:"Vigilant",   qualifier:"watches for errors, can seem wary",             hi:"सतर्क — गलतियों पर नज़र, कभी आशंकित लग सकता है" },
  ],
];
