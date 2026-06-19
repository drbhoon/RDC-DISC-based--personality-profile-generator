// ============================================================================
// RDC DISC INSTRUMENT — QUESTION SET v2.1 (balanced two-part format)
// 24 rows. Each option = { dim, word, qualifier (EN), hi (Hindi) }
//
// DESIGN RULE (the fix over v2.0):
//   The four options in every tetrad MUST be matched for social desirability.
//   v2.0 broke this: I options were framed as vain/unreliable and S options as
//   virtuous/dependable, which pushed respondents to mark I as LEAST and S as
//   MOST — inverting true high-I/low-S profiles. v2.1 gives EVERY option a
//   genuine strength + a genuine, comparable cost:
//     - D cost = haste / bluntness / over-control
//     - I cost = detail / over-optimism / planning (NOT vanity)
//     - S cost = passivity / slow to change / won't push back / self-neglect
//     - C cost = speed / rigidity / over-analysis
//   No dimension is the obviously "safe humble" pick or the "showy" pick.
//
// Word->dimension mapping and scoring are unchanged from v2.0 (verified correct).
// Only the qualifier (EN) and hi (Hindi) text were rewritten for balance.
// Scoring: tally Most/Least per dim -> G1/G2/G3.
// ============================================================================

export const QUESTIONS_V2 = [
  // Row 1
  [
    { dim:"D", word:"Results-driven", qualifier:"pushes for outcomes, less tuned to the mood",  hi:"परिणाम-केंद्रित — नतीजों पर ज़ोर, माहौल पर कम ध्यान" },
    { dim:"I", word:"Inspiring",      qualifier:"lifts the team's energy, less focused on detail", hi:"प्रेरणादायक — टीम की ऊर्जा बढ़ाता है, बारीकियों पर कम ध्यान" },
    { dim:"S", word:"Supportive",     qualifier:"a dependable helper, holds back from leading",  hi:"सहायक — भरोसेमंद मददगार, आगे बढ़कर नेतृत्व करने से हिचकता है" },
    { dim:"C", word:"Careful",        qualifier:"checks everything, slow to commit",            hi:"सावधान — हर चीज़ जाँचता है, निर्णय में समय लेता है" },
  ],
  // Row 2
  [
    { dim:"D", word:"Decisive",     qualifier:"decides fast, sometimes ahead of the facts",  hi:"निर्णायक — जल्दी फैसला, कभी तथ्यों से पहले" },
    { dim:"I", word:"Enthusiastic", qualifier:"brings energy, can promise more than is easy to deliver", hi:"उत्साही — ऊर्जा लाता है, कभी ज़्यादा वादा कर देता है" },
    { dim:"S", word:"Patient",      qualifier:"waits calmly, can let a real urgency slide",   hi:"धैर्यवान — शांति से प्रतीक्षा, कभी असली ज़रूरत टाल देता है" },
    { dim:"C", word:"Accurate",     qualifier:"gets the detail right, slow to finish",        hi:"सटीक — विवरण सही रखता है, पूरा करने में धीमा" },
  ],
  // Row 3
  [
    { dim:"D", word:"Competitive", qualifier:"plays to win, can make a contest of small things", hi:"प्रतिस्पर्धी — जीतने पर ज़ोर, छोटी बातों को भी मुक़ाबला बना देता है" },
    { dim:"I", word:"Talkative",   qualifier:"shares freely, can take up a lot of the airtime",  hi:"बातूनी — खुलकर बोलता है, कभी ज़्यादा समय ले लेता है" },
    { dim:"S", word:"Gentle",      qualifier:"soft and considerate, avoids a needed confrontation", hi:"कोमल — नरम और सहृदय, कभी ज़रूरी टकराव टाल देता है" },
    { dim:"C", word:"Systematic",  qualifier:"follows a clear order, resists shortcuts",         hi:"व्यवस्थित — स्पष्ट क्रम से चलता है, शॉर्टकट से बचता है" },
  ],
  // Row 4
  [
    { dim:"D", word:"Bold",       qualifier:"takes a stand, can come on strong",            hi:"साहसी — अपनी बात पर अड़ता है, कभी ज़्यादा प्रबल" },
    { dim:"I", word:"Optimistic", qualifier:"expects the best, can underweight the risks",   hi:"आशावादी — अच्छे की उम्मीद, कभी जोखिम कम आँकता है" },
    { dim:"S", word:"Reliable",   qualifier:"steady and predictable, slow to adapt to change", hi:"विश्वसनीय — स्थिर और अनुमेय, बदलाव अपनाने में धीमा" },
    { dim:"C", word:"Analytical", qualifier:"studies before acting, can over-think",          hi:"विश्लेषणात्मक — पहले अध्ययन, कभी ज़्यादा सोचता है" },
  ],
  // Row 5
  [
    { dim:"D", word:"Demanding", qualifier:"sets a high bar, can push people hard",        hi:"मांग करने वाला — ऊँचे मानक, कभी दूसरों पर दबाव" },
    { dim:"I", word:"Sociable",  qualifier:"makes friends easily, prefers company to solo focus", hi:"मिलनसार — आसानी से दोस्त बनाता है, अकेले काम से ज़्यादा साथ पसंद" },
    { dim:"S", word:"Stable",    qualifier:"even under pressure, slow to shift gears",      hi:"स्थिर — दबाव में भी शांत, गति बदलने में धीमा" },
    { dim:"C", word:"Precise",   qualifier:"exact in the work, fussy about getting it perfect", hi:"परिशुद्ध — काम में सटीक, पूर्णता को लेकर बारीक" },
  ],
  // Row 6
  [
    { dim:"D", word:"Driven",     qualifier:"works hard for goals, can ignore his own limits", hi:"लक्ष्य-प्रेरित — कड़ी मेहनत, कभी अपनी सीमाएँ भूल जाता है" },
    { dim:"I", word:"Persuasive", qualifier:"wins people over, leans more on warmth than data", hi:"प्रभावशाली — लोगों को मना लेता है, तथ्य से ज़्यादा गर्मजोशी पर निर्भर" },
    { dim:"S", word:"Calm",       qualifier:"keeps composure, can look passive when action is needed", hi:"शांत — संयम बनाए रखता है, कभी निष्क्रिय जब कार्रवाई ज़रूरी हो" },
    { dim:"C", word:"Thorough",   qualifier:"leaves nothing out, takes more time",            hi:"पूर्ण — कुछ नहीं छोड़ता, अधिक समय लेता है" },
  ],
  // Row 7
  [
    { dim:"D", word:"Direct",     qualifier:"says it plainly, can land as blunt",  hi:"सीधा — साफ़ कहता है, कभी कठोर लग सकता है" },
    { dim:"I", word:"Lively",     qualifier:"brings cheer, can lose the thread",   hi:"जीवंत — माहौल खुशनुमा करता है, कभी विषय से भटक जाता है" },
    { dim:"S", word:"Steady",     qualifier:"holds an even pace, uneasy when rushed", hi:"स्थिरचित्त — एक समान गति, जल्दबाज़ी में असहज" },
    { dim:"C", word:"Diplomatic", qualifier:"handles things tactfully, can avoid a straight no", hi:"कूटनीतिक — चतुराई से संभालता है, सीधे मना करने से बचता है" },
  ],
  // Row 8
  [
    { dim:"D", word:"Strong-willed", qualifier:"holds his ground, can dig in stubbornly",  hi:"दृढ़निश्चयी — अपनी बात पर टिका, कभी ज़िद्दी हो जाता है" },
    { dim:"I", word:"Expressive",    qualifier:"shows feeling openly, can wear it on his sleeve", hi:"भावप्रवण — भावनाएँ खुलकर दिखाता है, कभी ज़ाहिर कर देता है" },
    { dim:"S", word:"Agreeable",     qualifier:"easy to work with, gives in to keep the peace", hi:"सहमतिशील — साथ काम करना आसान, शांति बनाए रखने को झुक जाता है" },
    { dim:"C", word:"Detail-minded", qualifier:"catches small errors, can miss the big picture", hi:"विवरण-उन्मुख — छोटी ग़लतियाँ पकड़ता है, कभी बड़ी तस्वीर चूक जाता है" },
  ],
  // Row 9
  [
    { dim:"D", word:"Forceful",    qualifier:"drives things through, can steamroll others", hi:"प्रभावी — काम करवा लेता है, कभी दूसरों पर हावी हो जाता है" },
    { dim:"I", word:"Trusting",    qualifier:"believes in people, can miss a warning sign",  hi:"भरोसेमंद — लोगों पर विश्वास, कभी चेतावनी के संकेत चूक जाता है" },
    { dim:"S", word:"Sincere",     qualifier:"genuine and grounded, takes criticism to heart", hi:"निष्कपट — सच्चा और संतुलित, आलोचना दिल पर ले लेता है" },
    { dim:"C", word:"Questioning", qualifier:"probes deeply, can come across as doubting",   hi:"जिज्ञासु — गहराई से परखता है, कभी संशयी लग सकता है" },
  ],
  // Row 10
  [
    { dim:"D", word:"Result-focused",  qualifier:"fixed on the outcome, lighter on the process",  hi:"परिणाम-उन्मुख — नतीजे पर केंद्रित, प्रक्रिया पर कम" },
    { dim:"I", word:"People-focused",  qualifier:"puts relationships first, less on the rules",   hi:"लोग-उन्मुख — रिश्तों को पहले रखता है, नियमों पर कम" },
    { dim:"S", word:"Process-focused", qualifier:"values a steady method, can resist a faster way", hi:"प्रक्रिया-उन्मुख — स्थिर तरीक़ा पसंद, कभी तेज़ रास्ते का विरोध" },
    { dim:"C", word:"Quality-focused", qualifier:"set on getting it right, lighter on the pace",   hi:"गुणवत्ता-उन्मुख — सही करने पर ज़ोर, रफ़्तार पर कम" },
  ],
  // Row 11
  [
    { dim:"D", word:"Assertive",  qualifier:"states his needs clearly, can press too hard",     hi:"दृढ़ — अपनी ज़रूरतें स्पष्ट कहता है, कभी ज़्यादा दबाव डालता है" },
    { dim:"I", word:"Charming",   qualifier:"draws people in, can lean on likeability over substance", hi:"आकर्षक — लोगों को खींचता है, कभी सार से ज़्यादा लोकप्रियता पर निर्भर" },
    { dim:"S", word:"Consistent", qualifier:"the same day to day, slow to try new ways",        hi:"निरंतर — हर दिन एक जैसा, नए तरीक़ों में धीमा" },
    { dim:"C", word:"Methodical", qualifier:"orderly and organised, slow to improvise",         hi:"क्रमबद्ध — व्यवस्थित, तत्काल बदलाव में धीमा" },
  ],
  // Row 12
  [
    { dim:"D", word:"Tough",      qualifier:"handles pressure, can seem hard-edged",      hi:"कठोर — दबाव झेलता है, कभी सख़्त लग सकता है" },
    { dim:"I", word:"Animated",   qualifier:"full of energy, can run hot",                hi:"जोशीला — ऊर्जा से भरा, कभी अति-उत्साहित हो जाता है" },
    { dim:"S", word:"Loyal",      qualifier:"stands by the team, slow to challenge a bad call", hi:"वफादार — टीम के साथ खड़ा, ग़लत फ़ैसले पर भी सवाल उठाने में धीमा" },
    { dim:"C", word:"Structured", qualifier:"likes clear rules, uneasy without them",      hi:"संरचित — स्पष्ट नियम पसंद, उनके बिना असहज" },
  ],
  // Row 13
  [
    { dim:"D", word:"Risk-taking", qualifier:"acts despite doubt, can be reckless",        hi:"जोखिम लेने वाला — संदेह में भी कदम उठाता है, कभी लापरवाह" },
    { dim:"I", word:"Warm",        qualifier:"makes people feel valued, can soften a hard truth", hi:"उष्ण — लोगों को महत्व का एहसास, कभी कड़वी सच्चाई नरम कर देता है" },
    { dim:"S", word:"Dependable",  qualifier:"always there, leans on the familiar routine", hi:"भरोसेमंद — हमेशा मौजूद, जानी-पहचानी दिनचर्या पर निर्भर" },
    { dim:"C", word:"Objective",   qualifier:"judges by the facts, can seem detached",      hi:"वस्तुनिष्ठ — तथ्यों से आँकता है, कभी अलिप्त लग सकता है" },
  ],
  // Row 14
  [
    { dim:"D", word:"Urgent",     qualifier:"drives for speed, can rush the people around him", hi:"तत्पर — गति पर ज़ोर, कभी आसपास के लोगों को जल्दबाज़ी में डालता है" },
    { dim:"I", word:"Outgoing",   qualifier:"energised by people, prefers company to working alone", hi:"बहिर्मुखी — लोगों के साथ ऊर्जावान, अकेले काम से ज़्यादा साथ पसंद" },
    { dim:"S", word:"Deliberate", qualifier:"thinks before acting, can be too slow",          hi:"सोच-समझकर — कार्य से पहले विचार, कभी ज़्यादा धीमा" },
    { dim:"C", word:"Cautious",   qualifier:"weighs the risk, hesitant to leap",             hi:"सतर्क — जोखिम तौलता है, छलांग लगाने में हिचकिचाता है" },
  ],
  // Row 15
  [
    { dim:"D", word:"Challenging", qualifier:"pushes for better, can unsettle people",   hi:"चुनौती देने वाला — बेहतरी के लिए प्रेरित, कभी लोगों को असहज करता है" },
    { dim:"I", word:"Friendly",    qualifier:"easy to approach, can dodge a tough conversation", hi:"मित्रवत — सहज सुलभ, कभी कठिन बातचीत टाल देता है" },
    { dim:"S", word:"Unhurried",   qualifier:"won't be rushed, can hold others up",       hi:"बिना जल्दबाज़ी — ठीक से करता है, कभी दूसरों को रोक देता है" },
    { dim:"C", word:"Exacting",    qualifier:"holds a high standard, hard to satisfy",    hi:"कड़े मानक वाला — ऊँचा मानक रखता है, संतुष्ट करना कठिन" },
  ],
  // Row 16
  [
    { dim:"D", word:"Independent",  qualifier:"decides on his own, dislikes being directed", hi:"स्वतंत्र — अकेले निर्णय लेता है, निर्देश पसंद नहीं" },
    { dim:"I", word:"Spontaneous",  qualifier:"acts in the moment, light on planning",      hi:"स्वतःस्फूर्त — तुरंत कार्य करता है, योजना पर कम ध्यान" },
    { dim:"S", word:"Cooperative",  qualifier:"works well with the group, defers his own view", hi:"सहयोगी — समूह के साथ अच्छा, अपनी राय पीछे रखता है" },
    { dim:"C", word:"Disciplined",  qualifier:"sticks to the routine, resists exceptions",  hi:"अनुशासित — दिनचर्या का पालन, अपवादों से बचता है" },
  ],
  // Row 17
  [
    { dim:"D", word:"Determined",    qualifier:"won't give up, can dig in too hard",       hi:"दृढ़ — हार नहीं मानता, कभी ज़्यादा अड़ जाता है" },
    { dim:"I", word:"Magnetic",      qualifier:"draws attention, enjoys the audience",      hi:"आकर्षक व्यक्तित्व — ध्यान खींचता है, श्रोताओं का आनंद लेता है" },
    { dim:"S", word:"Accommodating", qualifier:"fits in with others, puts his own needs last", hi:"समायोजनशील — दूसरों के साथ ढल जाता है, अपनी ज़रूरतें आख़िर में रखता है" },
    { dim:"C", word:"Logical",       qualifier:"reasons it through, can seem cold",         hi:"तार्किक — तर्क से सोचता है, कभी ठंडा लग सकता है" },
  ],
  // Row 18
  [
    { dim:"D", word:"Pioneering",    qualifier:"tries new ground, can leave others behind", hi:"अग्रणी — नई राह आज़माता है, कभी दूसरों को पीछे छोड़ देता है" },
    { dim:"I", word:"Communicative", qualifier:"keeps everyone informed, can over-explain", hi:"संचारशील — सबको जानकारी देता है, कभी ज़्यादा समझाने लगता है" },
    { dim:"S", word:"Even-tempered", qualifier:"hard to rattle, slow to show urgency",      hi:"संतुलित — आसानी से विचलित नहीं, तत्परता दिखाने में धीमा" },
    { dim:"C", word:"Diligent",      qualifier:"works with care, can be painstaking",       hi:"परिश्रमी — ध्यान से काम करता है, कभी अति-सावधान" },
  ],
  // Row 19
  [
    { dim:"D", word:"Commanding",    qualifier:"takes charge, can fill the whole room",     hi:"नेतृत्वकारी — कमान संभालता है, कभी पूरे माहौल पर छा जाता है" },
    { dim:"I", word:"Generous",      qualifier:"gives freely, can stretch himself thin",    hi:"उदार — खुले दिल से देता है, कभी ख़ुद को थका लेता है" },
    { dim:"S", word:"Modest",        qualifier:"stays low-key, undersells his own worth",   hi:"विनम्र — सादगी से रहता है, अपनी क़ीमत कम आँकता है" },
    { dim:"C", word:"Perfectionist", qualifier:"wants it flawless, never quite satisfied",  hi:"पूर्णतावादी — निर्दोष चाहता है, कभी पूरी तरह संतुष्ट नहीं" },
  ],
  // Row 20
  [
    { dim:"D", word:"Resolute",       qualifier:"firm once decided, slow to change his mind", hi:"अटल — निर्णय में दृढ़, मन बदलने में धीमा" },
    { dim:"I", word:"Cheerful",       qualifier:"lifts the mood, can skirt the serious",     hi:"प्रसन्नचित्त — माहौल हल्का करता है, गंभीर बातों से बचता है" },
    { dim:"S", word:"Predictable",    qualifier:"steady and known, thrown by surprises",     hi:"अनुमेय — स्थिर और जाना-पहचाना, अचानक बदलाव से घबरा जाता है" },
    { dim:"C", word:"Conscientious",  qualifier:"does it right, worries about mistakes",     hi:"कर्तव्यनिष्ठ — सही करता है, ग़लतियों की चिंता करता है" },
  ],
  // Row 21
  [
    { dim:"D", word:"Action-oriented", qualifier:"moves fast, can skip the thinking",       hi:"क्रियाशील — तेज़ी से चलता है, कभी सोच छोड़ देता है" },
    { dim:"I", word:"Engaging",        qualifier:"good with people, can be light on follow-through", hi:"आकर्षक संवादी — लोगों से अच्छा, कभी काम अधूरा छोड़ देता है" },
    { dim:"S", word:"Tolerant",        qualifier:"accepts differences, slow to push back",   hi:"सहिष्णु — मतभेद स्वीकारता है, विरोध जताने में धीमा" },
    { dim:"C", word:"Meticulous",      qualifier:"careful with detail, can lose the big view", hi:"सूक्ष्म — विवरण में सावधान, कभी बड़ी तस्वीर चूक जाता है" },
  ],
  // Row 22
  [
    { dim:"D", word:"Controlling", qualifier:"likes to steer, finds it hard to delegate",  hi:"नियंत्रणकारी — दिशा तय करना पसंद, ज़िम्मेदारी सौंपने में कठिनाई" },
    { dim:"I", word:"Influential", qualifier:"shifts opinion, leans on persuasion over proof", hi:"प्रभावशाली — राय बदलता है, प्रमाण से ज़्यादा समझाने पर निर्भर" },
    { dim:"S", word:"Humble",      qualifier:"stays out of the limelight, can be overlooked", hi:"विनयशील — सुर्ख़ियों से दूर रहता है, कभी अनदेखा रह जाता है" },
    { dim:"C", word:"Orderly",     qualifier:"keeps things neat, uneasy with mess",        hi:"सुव्यवस्थित — चीज़ें साफ़ रखता है, अव्यवस्था से असहज" },
  ],
  // Row 23
  [
    { dim:"D", word:"Adventurous", qualifier:"open to the unknown, can act rashly",      hi:"साहसी — अज्ञात के लिए तैयार, कभी जल्दबाज़ी में काम" },
    { dim:"I", word:"Positive",    qualifier:"sees the upside, can gloss over a problem", hi:"सकारात्मक — अच्छाई देखता है, कभी समस्या को नज़रअंदाज़ कर देता है" },
    { dim:"S", word:"Composed",    qualifier:"stays settled, slow to react when speed matters", hi:"शांतचित्त — स्थिर रहता है, जब गति ज़रूरी हो तब धीमा" },
    { dim:"C", word:"Fact-based",  qualifier:"relies on evidence, distrusts gut feel",    hi:"तथ्य-आधारित — प्रमाण पर निर्भर, अंतर्ज्ञान पर भरोसा नहीं" },
  ],
  // Row 24
  [
    { dim:"D", word:"Confident",  qualifier:"trusts his own ability, can be over-sure",  hi:"आत्मविश्वासी — अपनी क्षमता पर भरोसा, कभी अति-आश्वस्त" },
    { dim:"I", word:"Outspoken",  qualifier:"says what he thinks, can crowd the room",   hi:"मुखर — मन की बात कहता है, कभी पूरे माहौल पर हावी" },
    { dim:"S", word:"Thoughtful", qualifier:"considers others, slow to assert himself",  hi:"विचारशील — दूसरों का ख़याल, ख़ुद को आगे रखने में धीमा" },
    { dim:"C", word:"Vigilant",   qualifier:"watches for errors, can seem wary",         hi:"सतर्क — ग़लतियों पर नज़र, कभी आशंकित लग सकता है" },
  ],
];
