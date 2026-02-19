function showPage(id) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }
  var navBtns = document.querySelectorAll('.nl');
  for (var j = 0; j < navBtns.length; j++) {
    navBtns[j].classList.remove('active');
  }
  var target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  var navMap = { home: 0, community: 1, quiz: 2, resources: 3, tools: 4, flowchart: 5 };
  if (navMap[id] !== undefined) navBtns[navMap[id]].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'resources') buildResources();
}

var adjectives = ['Teal','Azure','Calm','Sage','Misty','Silver','Dawn','Ember','Lunar','Cedar'];
var nouns      = ['Moon','Star','River','Forest','Cloud','Spark','Haven','Wave','Bloom','Stone'];
var avatarBg   = ['#e0f5f7','#ffe0f4','#f0fdf4','#fff7ed','#f5f3ff','#eff6ff'];
var avatarInit = ['TM','SC','EF','DW','LH','AW','CR','BS','MF','KR'];

function randomName() {
  var a = adjectives[Math.floor(Math.random() * adjectives.length)];
  var n = nouns[Math.floor(Math.random() * nouns.length)];
  return a + n + Math.floor(Math.random() * 90 + 10);
}

function getInitials(name) {
  var parts = name.replace(/\d+/, '').match(/[A-Z][a-z]+/g);
  if (!parts || parts.length < 2) return name.slice(0, 2).toUpperCase();
  return parts[0][0] + parts[1][0];
}

var currentTag = 'general';
var currentFilter = 'all';

var posts = [
  {
    id: 1, u: 'TealMoon42', t: '2h ago', tag: 'anxiety',
    ti: "I can't stop worrying about college applications",
    bo: 'Every time I try to work on them my chest tightens and I spiral. Has anyone dealt with this?',
    v: 24,
    c: [
      { u: 'CalmRiver18', t: 'Breaking it into tiny tasks really helped me — just one paragraph at a time.' },
      { u: 'Dr. Maria Chen', t: 'This is called anticipatory anxiety. Happy to talk through some strategies.', vr: true }
    ]
  },
  {
    id: 2, u: 'SageCloud77', t: '5h ago', tag: 'depression',
    ti: "I haven't left my room in 3 days",
    bo: "I don't know what's wrong with me. I skip class, I ignore texts. I feel like I'm disappearing.",
    v: 41,
    c: [
      { u: 'MistyBloom33', t: "You noticed, and that matters. You reached out here — that's a step. We see you." },
      { u: 'LunarHaven09', t: 'Please consider texting 741741 if you want to talk to someone. You deserve support.' }
    ]
  },
  {
    id: 3, u: 'EmberStar55', t: '1d ago', tag: 'academic',
    ti: "My parents expect straight A's and I'm burning out",
    bo: "I have a 4.2 GPA but I cry myself to sleep most nights. No one gets why I'm struggling.",
    v: 67,
    c: [
      { u: 'Dr. Tom Reyes', t: 'Academic pressure with no outward signs is one of the most overlooked stressors I see. Your feelings are valid.', vr: true }
    ]
  },
  {
    id: 4, u: 'DawnWave29', t: '2d ago', tag: 'general',
    ti: 'Does anyone actually use the school counselor?',
    bo: "I've always assumed they're too busy. Is it worth trying?",
    v: 15,
    c: [
      { u: 'CedarSpark41', t: "I was scared to go but my counselor was genuinely helpful. Worst case it's one conversation." },
      { u: 'Ms. Priya Sharma', t: 'Please come! We want to see you. Even 15 minutes can make a difference.', vr: true }
    ]
  }
];

var tagClassMap = {
  anxiety: 'ta', depression: 'td', stress: 'ts',
  crisis: 'tc', general: 'tg', relationships: 'tr', academic: 'tac'
};

function renderPosts(filterTag) {
  var container = document.getElementById('posts');
  if (!container) return;
  container.innerHTML = '';

  var filtered = filterTag === 'all' ? posts : posts.filter(function(p) { return p.tag === filterTag; });

  if (!filtered.length) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:15px">No posts here yet. Be the first!</div>';
    return;
  }

  filtered.forEach(function(p) {
    var bg = avatarBg[p.id % avatarBg.length];
    var cls = tagClassMap[p.tag] || 'tg';
    var inits = getInitials(p.u);
    var counselorTag = p.tag === 'crisis' ? ' <span class="ptg tv">Counselor</span>' : '';

    var commentsHtml = p.c.map(function(x) {
      return '<div class="cm">' +
        '<div class="cav2">' + (x.vr ? 'C' : getInitials(x.u)) + '</div>' +
        '<div>' +
          '<div class="cn">' + x.u + (x.vr ? ' <span class="ptg tv">Counselor</span>' : '') + '</div>' +
          '<div class="ct">' + x.t + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var card = document.createElement('div');
    card.className = 'pc';
    card.setAttribute('data-tag', p.tag);
    card.innerHTML =
      '<div class="ph">' +
        '<div class="pav" style="background:' + bg + '">' + inits + '</div>' +
        '<div class="pm"><div class="pu">' + p.u + '</div><div class="pti">' + p.t + '</div></div>' +
        '<div class="ptt"><span class="ptg ' + cls + '">' + p.tag + '</span></div>' +
      '</div>' +
      '<div class="ptit">' + p.ti + '</div>' +
      '<div class="pbo">' + p.bo + '</div>' +
      '<div class="pac">' +
        '<button class="pb" id="vbtn-' + p.id + '" onclick="upvote(' + p.id + ',this)">&#9650; <span class="vc">' + p.v + '</span></button>' +
        '<button class="pb" onclick="toggleComments(' + p.id + ')">' + p.c.length + ' ' + (p.c.length === 1 ? 'reply' : 'replies') + '</button>' +
        '<button class="pb" onclick="showPage(\'quiz\')">Take Self-Check</button>' +
      '</div>' +
      '<div class="cms" id="cms-' + p.id + '">' +
        commentsHtml +
        '<div class="cr2">' +
          '<input class="ci" placeholder="Reply anonymously..." id="ci-' + p.id + '">' +
          '<button class="cs" onclick="addComment(' + p.id + ')">Send</button>' +
        '</div>' +
      '</div>';

    container.appendChild(card);
  });

  var badge = document.getElementById('pcnt');
  if (badge) badge.textContent = posts.length;
}

function upvote(id, btn) {
  var post = posts.find(function(x) { return x.id === id; });
  if (!post) return;
  if (btn.classList.contains('voted')) {
    post.v--;
    btn.classList.remove('voted');
  } else {
    post.v++;
    btn.classList.add('voted');
  }
  btn.querySelector('.vc').textContent = post.v;
}

function toggleComments(id) {
  var el = document.getElementById('cms-' + id);
  if (el) el.classList.toggle('open');
}

function addComment(id) {
  var input = document.getElementById('ci-' + id);
  var text = input.value.trim();
  if (!text) return;
  var post = posts.find(function(x) { return x.id === id; });
  if (post) {
    post.c.push({ u: randomName(), t: text });
    input.value = '';
    renderPosts(currentFilter);
    var el = document.getElementById('cms-' + id);
    if (el) el.classList.add('open');
  }
}

function filterPosts(tag, btn) {
  currentFilter = tag;
  var btns = document.querySelectorAll('.fp');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
  btn.classList.add('active');
  renderPosts(tag);
}

function openModal() {
  document.getElementById('pmodal').classList.add('open');
}

function closeModal() {
  document.getElementById('pmodal').classList.remove('open');
}

function selectTag(btn, tag) {
  var btns = document.querySelectorAll('.to');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('sel');
  btn.classList.add('sel');
  currentTag = tag;
}

function submitPost() {
  var titleEl = document.getElementById('nt');
  var bodyEl = document.getElementById('nb');
  var title = titleEl.value.trim();
  if (!title) { alert('Please add a title.'); return; }
  var body = bodyEl.value.trim();
  posts.unshift({ id: Date.now(), u: randomName(), t: 'just now', tag: currentTag, ti: title, bo: body, v: 1, c: [] });
  closeModal();
  renderPosts(currentFilter);
  titleEl.value = '';
  bodyEl.value = '';
}

var quizAnswers = {};
var currentQuestion = 1;
var totalQuestions = 8;

function selectAnswer(btn, val) {
  var parent = btn.closest('.qos');
  if (!parent) return;
  var siblings = parent.querySelectorAll('.qo');
  for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('sel');
  btn.classList.add('sel');
  quizAnswers['q' + currentQuestion] = val;
}

function nextQuestion(from) {
  if (quizAnswers['q' + from] === undefined || quizAnswers['q' + from] === null) {
    alert('Please select an answer to continue.');
    return;
  }
  currentQuestion = from + 1;
  var cards = document.querySelectorAll('.qc');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('active');
  var next = document.getElementById('q' + currentQuestion);
  if (next) next.classList.add('active');
  updateProgress();
}

function prevQuestion(from) {
  currentQuestion = from - 1;
  var cards = document.querySelectorAll('.qc');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('active');
  var prev = document.getElementById('q' + currentQuestion);
  if (prev) prev.classList.add('active');
  updateProgress();
}

function updateProgress() {
  var pct = Math.round((currentQuestion / totalQuestions) * 100);
  var bar = document.getElementById('prf');
  var lbl = document.getElementById('qlbl');
  var pctEl = document.getElementById('qpct');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = 'Question ' + currentQuestion + ' of ' + totalQuestions;
  if (pctEl) pctEl.textContent = pct + '%';
}

function showResults() {
  if (quizAnswers['q' + totalQuestions] === undefined) {
    alert('Please select an answer to continue.');
    return;
  }

  // Scoring
  var score = 0;
  var a = quizAnswers;

  // Q1 depression mood (0-3)
  var depressionScore = (a.q1 || 0) + (a.q2 || 0);
  // Q3 anxiety (0-3)
  var anxietyScore = (a.q3 || 0) + (a.q4 || 0);
  // Functional
  var funcScore = (a.q5 || 0) + (a.q6 || 0) + (a.q7 || 0);

  score = depressionScore + anxietyScore + funcScore;

  var q8 = a.q8 || 'none';
  if (q8 === 'active') score += 6;
  else if (q8 === 'passive') score += 2;

  var primaryConcern = 'general';
  if (depressionScore > anxietyScore && depressionScore >= 3) primaryConcern = 'depression';
  else if (anxietyScore > depressionScore && anxietyScore >= 3) primaryConcern = 'anxiety';
  else if (depressionScore >= 3 && anxietyScore >= 3) primaryConcern = 'both';
  else if (funcScore >= 4) primaryConcern = 'stress';

  var level, badgeClass, title, desc, svClass, svWidth;

  if (q8 === 'active' || score >= 14) {
    level = 'High — Please seek support now';
    badgeClass = 'badge-high';
    title = 'Please reach out to someone today';
    desc = "Based on your responses, it sounds like you are going through something serious. You deserve real support — reaching out is the bravest thing you can do.";
    svClass = 'sv3';
    svWidth = '90%';
  } else if (score >= 7) {
    level = 'Moderate — Professional support recommended';
    badgeClass = 'badge-mod';
    title = 'Talking to someone could make a real difference';
    desc = "What you are experiencing is real and worth addressing. You do not need to be in crisis to ask for help. A counselor or therapist can help you build strategies that work.";
    svClass = 'sv2';
    svWidth = '55%';
  } else {
    level = 'Mild — Self-care and monitoring';
    badgeClass = 'badge-low';
    title = 'You are managing — keep checking in with yourself';
    desc = "Things seem relatively manageable right now. Building good habits and staying connected can go a long way. If things change, support is always here.";
    svClass = 'sv1';
    svWidth = '25%';
  }

  var therapyRecs = getTherapyRecommendations(primaryConcern, score, q8);
  var copingSuggestions = getCopingSuggestions(primaryConcern, score);
  var finderLinks = getFinderLinks(score, q8);

  var el = function(id) { return document.getElementById(id); };
  if (el('res-badge')) { el('res-badge').textContent = level; el('res-badge').className = 'results-level-badge ' + badgeClass; }
  if (el('res-title')) el('res-title').textContent = title;
  if (el('res-desc')) el('res-desc').textContent = desc;
  if (el('svtxt')) { el('svtxt').textContent = level; el('svtxt').style.color = svClass === 'sv3' ? 'var(--danger)' : svClass === 'sv2' ? '#b45309' : 'var(--ok)'; }
  if (el('svfill')) { el('svfill').style.width = svWidth; el('svfill').className = 'svf ' + svClass; }
  if (el('therapy-list')) el('therapy-list').innerHTML = therapyRecs;
  if (el('coping-list')) el('coping-list').innerHTML = copingSuggestions;
  if (el('finder-list')) el('finder-list').innerHTML = finderLinks;

  var cards = document.querySelectorAll('.qc');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('active');
  var resultCard = document.getElementById('qr');
  if (resultCard) resultCard.classList.add('active');
  if (el('prf')) el('prf').style.width = '100%';
  if (el('qlbl')) el('qlbl').textContent = 'Your Results';
  if (el('qpct')) el('qpct').textContent = '100%';
}

function getTherapyRecommendations(concern, score, q8) {
  var recs = [];

  if (q8 === 'active') {
    recs.push({
      tag: 'Crisis First',
      name: 'Immediate Crisis Support',
      desc: 'Before exploring therapy options, please reach out to the 988 Suicide and Crisis Lifeline (call or text 988) or text HOME to 741741. These services are free, confidential, and available 24/7.'
    });
  }

  if (concern === 'anxiety' || concern === 'both') {
    recs.push({
      tag: 'Recommended for Anxiety',
      name: 'Cognitive Behavioral Therapy (CBT)',
      desc: 'The most evidence-based treatment for anxiety disorders. CBT helps identify and change unhelpful thought patterns and teaches practical coping strategies. Most people see improvement within 12-20 sessions.'
    });
    recs.push({
      tag: 'Recommended for Anxiety',
      name: 'Acceptance and Commitment Therapy (ACT)',
      desc: 'Helps you accept difficult thoughts and feelings rather than fighting them, while committing to actions that align with your values. Especially effective for generalized anxiety.'
    });
  }

  if (concern === 'depression' || concern === 'both') {
    recs.push({
      tag: 'Recommended for Depression',
      name: 'Cognitive Behavioral Therapy (CBT)',
      desc: 'Highly effective for depression. CBT targets negative thought patterns that maintain low mood and helps you build behavioral strategies to re-engage with meaningful activities.'
    });
    recs.push({
      tag: 'Recommended for Depression',
      name: 'Behavioral Activation Therapy',
      desc: 'A structured approach to overcoming depression by gradually increasing engagement with positive activities. Particularly helpful when motivation is very low.'
    });
  }

  if (concern === 'stress') {
    recs.push({
      tag: 'Recommended for Stress',
      name: 'Stress Inoculation Training (SIT)',
      desc: 'A CBT-based approach that builds resilience to stress by teaching relaxation, problem-solving, and cognitive restructuring skills. Widely used for academic and performance stress.'
    });
  }

  if (concern === 'general' || recs.length < 2) {
    recs.push({
      tag: 'General Recommendation',
      name: 'Person-Centered Therapy',
      desc: 'A supportive, non-directive approach where a trained therapist provides a safe space to explore your thoughts and feelings at your own pace. Good starting point if you are unsure where to begin.'
    });
  }

  if (score >= 7) {
    recs.push({
      tag: 'Consider If Needed',
      name: 'Dialectical Behavior Therapy (DBT)',
      desc: 'Combines CBT with mindfulness and emotion regulation skills. Particularly helpful for intense emotions, relationship difficulties, and impulsive behaviors.'
    });
  }

  return recs.map(function(r) {
    return '<div class="therapy-card">' +
      '<div class="therapy-tag">' + r.tag + '</div>' +
      '<div class="therapy-name">' + r.name + '</div>' +
      '<div class="therapy-desc">' + r.desc + '</div>' +
    '</div>';
  }).join('');
}

function getCopingSuggestions(concern, score) {
  var suggestions = [];

  if (score >= 14) {
    suggestions = [
      'Call or text 988 — free, confidential crisis support',
      'Text HOME to 741741 to reach a trained crisis counselor',
      'Tell one trusted person how you are feeling today',
      'Remove yourself from any situation that feels unsafe'
    ];
  } else if (score >= 7) {
    suggestions = [
      'Schedule an appointment with a therapist or counselor this week',
      'Try the box breathing exercise on the Self-Help page',
      'Establish a consistent sleep schedule — 7 to 9 hours per night',
      'Reach out to one person you trust today',
      'Limit news and social media to reduce overwhelm',
      'Write in a journal for 10 minutes each evening'
    ];
  } else {
    suggestions = [
      'Daily physical activity — even a 20-minute walk helps',
      'Use the journaling prompts on the Self-Help page',
      'Practice the 5-4-3-2-1 grounding technique when stressed',
      'Maintain regular mealtimes and sleep hours',
      'Stay connected with friends and family',
      'Notice and name your emotions throughout the day'
    ];
  }

  if (concern === 'anxiety') {
    suggestions.push('Practice progressive muscle relaxation before bed');
    suggestions.push('Challenge "what if" worry thoughts — ask: how likely is this really?');
  }
  if (concern === 'depression') {
    suggestions.push('Schedule one small enjoyable activity each day, even if motivation is low');
    suggestions.push('Spend at least 20 minutes outside in natural light daily');
  }

  return '<div class="coping-grid">' +
    suggestions.slice(0, 6).map(function(s) {
      return '<div class="coping-item">' + s + '</div>';
    }).join('') +
  '</div>';
}

function getFinderLinks(score, q8) {
  var links = [];

  if (q8 === 'active') {
    links.push({ label: '988', title: '988 Suicide & Crisis Lifeline', desc: 'Free, confidential. Call or text 988 — available 24/7.', href: 'tel:988' });
    links.push({ label: 'TXT', title: 'Crisis Text Line', desc: 'Text HOME to 741741. Free, 24/7 text-based crisis support.', href: 'sms:741741?body=HOME' });
  }

  links.push({ label: 'PT', title: 'Psychology Today Therapist Finder', desc: 'Search by location, insurance, specialty, and more.', href: 'https://www.psychologytoday.com/us/therapists' });
  links.push({ label: 'OP', title: 'Open Path Collective', desc: 'Affordable therapy at $30-$80 per session for those in financial need.', href: 'https://openpathcollective.org' });
  links.push({ label: 'BH', title: 'BetterHelp Online Therapy', desc: 'Licensed therapists via text, phone, or video. Financial aid available.', href: 'https://betterhelp.com' });
  links.push({ label: 'SC', title: 'Your School Counselor', desc: 'Free, confidential, and familiar with local resources. Visit the counseling office.', href: '#', onclick: "showPage('counselor')" });

  return links.map(function(l) {
    var click = l.onclick ? ' onclick="' + l.onclick + '"' : '';
    return '<div class="ri2" onclick="' + (l.href.startsWith('#') ? "showPage('counselor')" : "window.open('" + l.href + "','_blank')") + '">' +
      '<div class="ric" style="background:var(--teal-l)">' + l.label + '</div>' +
      '<div><h4>' + l.title + '</h4><p>' + l.desc + '</p></div>' +
      '<div class="riarr">&#8250;</div>' +
    '</div>';
  }).join('');
}

function retakeQuiz() {
  quizAnswers = {};
  currentQuestion = 1;
  var cards = document.querySelectorAll('.qc');
  for (var i = 0; i < cards.length; i++) cards[i].classList.remove('active');
  var opts = document.querySelectorAll('.qo');
  for (var j = 0; j < opts.length; j++) opts[j].classList.remove('sel');
  var q1 = document.getElementById('q1');
  if (q1) q1.classList.add('active');
  var bar = document.getElementById('prf');
  if (bar) bar.style.width = Math.round(1 / totalQuestions * 100) + '%';
  var lbl = document.getElementById('qlbl');
  if (lbl) lbl.textContent = 'Question 1 of ' + totalQuestions;
  var pct = document.getElementById('qpct');
  if (pct) pct.textContent = Math.round(1 / totalQuestions * 100) + '%';
}

// ─── RESOURCES ────────────────────────────────────────────────────────────────
function showResourceTab(id, btn) {
  var panels = document.querySelectorAll('.rpn');
  for (var i = 0; i < panels.length; i++) panels[i].classList.remove('active');
  var btns = document.querySelectorAll('.rtb');
  for (var j = 0; j < btns.length; j++) btns[j].classList.remove('active');
  var panel = document.getElementById('rpn-' + id);
  if (panel) panel.classList.add('active');
  btn.classList.add('active');
}

function searchResources(val) {
  var cards = document.querySelectorAll('.rcd');
  cards.forEach(function(c) {
    c.style.display = (!val || c.textContent.toLowerCase().includes(val.toLowerCase())) ? '' : 'none';
  });
}

var resourcesBuilt = false;
function buildResources() {
  if (resourcesBuilt) return;
  resourcesBuilt = true;

  var data = {
    hotlines: [
      { lbl:'988', bg:'#fee2e2', n:'988 Suicide & Crisis Lifeline', cat:'Crisis Hotline', d:'Free, confidential support for people in distress. Call or text 988 anytime, 24/7.', c:'Call or Text: 988', av:'24/7', href:'tel:988' },
      { lbl:'CTL', bg:'#eff6ff', n:'Crisis Text Line', cat:'Text Crisis Support', d:'Text with a trained crisis counselor. Free, confidential, available 24/7.', c:'Text HOME to 741741', av:'24/7', href:'sms:741741?body=HOME' },
      { lbl:'TRP', bg:'#f5f3ff', n:'Trevor Project', cat:'LGBTQ+ Crisis Support', d:'Crisis support specifically for LGBTQ young people. Confidential, 24/7.', c:'1-866-488-7386', av:'24/7', href:'tel:18664887386' },
      { lbl:'NAM', bg:'#d1fae5', n:'NAMI Helpline', cat:'Mental Health Info', d:'Mental health information, referrals, and support. Not a crisis line.', c:'1-800-950-6264', av:'M-F 10am-10pm ET', lim:true, href:'tel:18009506264' },
      { lbl:'RNN', bg:'#fff7ed', n:'RAINN Sexual Assault Hotline', cat:'Trauma Support', d:'Confidential support for survivors of sexual assault, 24/7.', c:'1-800-656-4673', av:'24/7', href:'tel:18006564673' }
    ],
    apps: [
      { lbl:'HS', bg:'#fff7ed', n:'Headspace', cat:'Meditation & Mindfulness', d:'Guided meditations, sleep sounds, and focus tools. Free student trial available.', c:'headspace.com', av:'Free trial', href:'https://headspace.com' },
      { lbl:'CM', bg:'#eff6ff', n:'Calm', cat:'Sleep & Anxiety', d:'Sleep stories, breathing programs, and anxiety relief. Popular with students.', c:'calm.com', av:'Free + Premium', href:'https://calm.com' },
      { lbl:'WB', bg:'#f0fdf4', n:'Woebot', cat:'CBT Self-Help', d:'A CBT-based chatbot that helps you work through negative thoughts. Completely free.', c:'woebot.io', av:'Free', href:'https://woebot.io' },
      { lbl:'DL', bg:'#f5f3ff', n:'Daylio', cat:'Mood Tracking', d:'Track your mood and activities. Spot patterns that affect your mental health.', c:'iOS & Android', av:'Free', href:'#' },
      { lbl:'SV', bg:'#d1fae5', n:'Sanvello', cat:'Anxiety & Depression', d:'CBT-based tools for stress, anxiety, and depression. Many schools offer it free.', c:'sanvello.com', av:'Check with school', href:'https://sanvello.com' }
    ],
    therapy: [
      { lbl:'PT', bg:'#e0f5f7', n:'Psychology Today Finder', cat:'Therapist Directory', d:'Search by insurance, location, specialty, and more. Largest therapist directory in the US.', c:'psychologytoday.com/us/therapists', av:'Search by zip', href:'https://www.psychologytoday.com/us/therapists' },
      { lbl:'BH', bg:'#eff6ff', n:'BetterHelp', cat:'Online Therapy', d:'Connect with a licensed therapist via text, phone, or video. Financial aid available.', c:'betterhelp.com', av:'~$60/week', lim:true, href:'https://betterhelp.com' },
      { lbl:'OP', bg:'#f5f3ff', n:'Open Path Collective', cat:'Affordable Therapy', d:'Reduced-cost therapy ($30-$80) for those who cannot afford standard rates.', c:'openpathcollective.org', av:'$30-$80/session', lim:true, href:'https://openpathcollective.org' },
      { lbl:'CM', bg:'#f0fdf4', n:'Community Mental Health Centers', cat:'Local Support', d:'Government-funded mental health services available in most counties, often free or low-cost.', c:'Search "community mental health" + your city', av:'Varies', lim:true, href:'#' }
    ],
    school: [
      { lbl:'SC', bg:'#fff7ed', n:'Your School Counselor', cat:'School Resource', d:'Your school counselor is free, confidential, and familiar with local resources. They want to hear from you.', c:'Visit the counseling office', av:'School hours', lim:true, href:'#' },
      { lbl:'SAP', bg:'#e0f5f7', n:'Student Assistance Program (SAP)', cat:'School Support', d:'Many schools have SAP teams that connect struggling students with the right help quickly.', c:'Ask your counselor or principal', av:'School hours', lim:true, href:'#' },
      { lbl:'SW', bg:'#f5f3ff', n:'School Social Worker', cat:'School Support', d:'Social workers help with family stress, mental health referrals, and more. Confidential.', c:'Ask your school office', av:'School hours', lim:true, href:'#' }
    ],
    lgbtq: [
      { lbl:'TRP', bg:'#f5f3ff', n:'Trevor Project', cat:'Crisis Support', d:'24/7 crisis support specifically for LGBTQ+ young people. Call, text, or chat.', c:'1-866-488-7386', av:'24/7', href:'tel:18664887386' },
      { lbl:'TLL', bg:'#ffe0f4', n:'Trans Lifeline', cat:'Trans Support', d:'Peer support hotline run by and for trans people. Focuses on crisis prevention and community.', c:'877-565-8860', av:'Check site for hours', lim:true, href:'tel:8775658860' },
      { lbl:'IGB', bg:'#e0f5f7', n:'It Gets Better Project', cat:'Online Community', d:'Stories, resources, and community for LGBTQ+ youth. Not a crisis line, but full of support.', c:'itgetsbetter.org', av:'Always available', href:'https://itgetsbetter.org' }
    ]
  };

  function card(r) {
    var avail = r.lim ? '<div class="av lim">Limited hours: ' + r.av + '</div>' : (r.av ? '<div class="av">Available: ' + r.av + '</div>' : '');
    return '<div class="rcd">' +
      '<div class="rct">' +
        '<div class="rci" style="background:' + r.bg + '">' + r.lbl + '</div>' +
        '<div><h3>' + r.n + '</h3><div class="rcat">' + r.cat + '</div></div>' +
      '</div>' +
      '<p>' + r.d + '</p>' +
      '<div class="rcc"><a href="' + (r.href || '#') + '" target="_blank">' + r.c + '</a></div>' +
      avail +
    '</div>';
  }

  var mapping = { hotlines: 'rg-hotlines', apps: 'rg-apps', therapy: 'rg-therapy', school: 'rg-school', lgbtq: 'rg-lgbtq' };
  for (var key in mapping) {
    var el = document.getElementById(mapping[key]);
    if (el) el.innerHTML = data[key].map(card).join('');
  }
}

function toggleTool(id) {
  var el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

var breathRunning = false;
var breathPhase = 0;
var breathCycles = [
  { phase: 'Inhale', dur: 4, scale: 1.45 },
  { phase: 'Hold', dur: 4, scale: 1.45 },
  { phase: 'Exhale', dur: 4, scale: 1.0 },
  { phase: 'Hold', dur: 4, scale: 1.0 }
];

function startBreath() {
  if (breathRunning) {
    breathRunning = false;
    document.getElementById('bbs').textContent = 'Begin';
    document.getElementById('bph').textContent = 'Ready?';
    document.getElementById('bct').textContent = '—';
    document.getElementById('bring').style.transform = 'scale(1)';
    return;
  }
  breathRunning = true;
  breathPhase = 0;
  document.getElementById('bbs').textContent = 'Stop';
  runBreathPhase();
}

function runBreathPhase() {
  if (!breathRunning) return;
  var c = breathCycles[breathPhase % 4];
  document.getElementById('bph').textContent = c.phase;
  document.getElementById('bring').style.transition = 'transform ' + c.dur + 's ease-in-out';
  document.getElementById('bring').style.transform = 'scale(' + c.scale + ')';
  var n = c.dur;
  document.getElementById('bct').textContent = n;
  var timer = setInterval(function() {
    n--;
    document.getElementById('bct').textContent = n;
    if (n <= 0) {
      clearInterval(timer);
      breathPhase++;
      if (breathRunning) runBreathPhase();
    }
  }, 1000);
}

var journalPrompts = [
  'What is one thing you are grateful for today, even if it is small?',
  'What has been taking up the most space in your mind lately?',
  'Describe a time you got through something hard. What helped you?',
  'What does a good day look like for you? How could you create more of those?',
  'If your best friend told you they were feeling the way you do, what would you say to them?',
  'What is one small step you could take tomorrow to feel a little better?',
  'What is something you have been holding onto that you might need to let go of?',
  'Who in your life makes you feel supported? How could you reach out this week?',
  'What are three things you appreciate about yourself right now?',
  'If you could change one thing about your daily routine, what would it be and why?'
];

function newPrompt() {
  var el = document.getElementById('jprompt');
  if (el) el.textContent = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
}

var moodMessages = {
  'Happy':   'Hold onto what is making you feel good today. Notice what contributed to it.',
  'Calm':    'Calm is a strength. Try to carry this energy with you into the rest of your day.',
  'Anxious': 'It is okay to feel anxious. Try the box breathing exercise — it really does help. You are safe.',
  'Sad':     'Sadness is valid. Be gentle with yourself today. Reaching out to someone can help.',
  'Angry':   'Anger usually signals something important. It is okay to feel it — express it in a safe way.',
  'Numb':    'Feeling numb can be exhausting. Try a small sensory experience: hold something warm or step outside.'
};

function selectMood(btn, mood) {
  var btns = document.querySelectorAll('.mood-btn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('sel');
  btn.classList.add('sel');
  var msg = document.getElementById('mmsg');
  if (msg) msg.innerHTML = '<strong>' + mood + '</strong><br>' + (moodMessages[mood] || '');
}

var flowHistory = [];

function goFlow(id, label) {
  flowHistory.push(label);
  var nodes = document.querySelectorAll('.fn');
  for (var i = 0; i < nodes.length; i++) nodes[i].classList.remove('active');
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  var crumb = document.getElementById('fcr');
  if (crumb) crumb.innerHTML = flowHistory.map(function(h) { return '<span class="fcr2 done">' + h + '</span>'; }).join('');
}

function resetFlow() {
  flowHistory = [];
  var nodes = document.querySelectorAll('.fn');
  for (var i = 0; i < nodes.length; i++) nodes[i].classList.remove('active');
  var start = document.getElementById('fn1');
  if (start) start.classList.add('active');
  var crumb = document.getElementById('fcr');
  if (crumb) crumb.innerHTML = '';
}

function submitCounselor() {
  document.getElementById('cfw').style.display = 'none';
  document.getElementById('cosc').classList.add('show');
}

document.addEventListener('DOMContentLoaded', function() {
  renderPosts('all');
  buildResources();
  newPrompt();
});