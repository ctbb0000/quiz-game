/* ============================================================
   C202 Field Notes — quiz logic
   Modes: def2term, term2def, similar, flash, hard, missed, dashboard
   Persistence: localStorage, no backend.
   ============================================================ */

/* ---------------- 1. VOCABULARY DATA ----------------
   Seeded from the "term groups to compare" in the build spec.
   Replace/extend TERMS once the real c202_vocab.txt and
   FINAL_quiz_C202_70questions.txt content is added — see
   README for exactly where to paste it in.
-------------------------------------------------------- */

const TERMS = [
  // Organizational commitment
  { id:"t01", term:"Affective commitment", group:"commitment",
    definition:"An emotional attachment to the organization, where the employee identifies with its values and goals and stays because they genuinely want to." },
  { id:"t02", term:"Continuance commitment", group:"commitment",
    definition:"Staying with an organization because leaving would be too costly — lost pay, benefits, seniority, or a lack of better alternatives." },
  { id:"t03", term:"Normative commitment", group:"commitment",
    definition:"Staying with an organization out of a sense of obligation or duty — the employee feels they ought to stay, regardless of how they feel." },

  // Discrimination
  { id:"t04", term:"Adverse impact", group:"discrimination",
    definition:"Unintentional discrimination: a seemingly neutral employment practice ends up disproportionately disadvantaging members of a protected group." },
  { id:"t05", term:"Disparate treatment", group:"discrimination",
    definition:"Intentional discrimination: an individual is treated differently and less favorably specifically because of their membership in a protected class." },

  // Job analysis family
  { id:"t06", term:"Job analysis", group:"jobanalysis",
    definition:"The systematic process of collecting information about a job's duties, responsibilities, and the conditions under which it is performed." },
  { id:"t07", term:"Job description", group:"jobanalysis",
    definition:"A written summary of what a job actually involves — its duties, responsibilities, and working conditions." },
  { id:"t08", term:"Job specification", group:"jobanalysis",
    definition:"A statement of the minimum qualifications, skills, education, and traits a person needs to perform a given job." },

  // Training vs development
  { id:"t09", term:"Training", group:"traindev",
    definition:"Teaching employees the specific skills and knowledge needed to perform their current job well, with a short-term, immediate focus." },
  { id:"t10", term:"Development", group:"traindev",
    definition:"Longer-term learning intended to build an employee's broader capabilities and prepare them for future roles and responsibilities." },

  // Compensation
  { id:"t11", term:"Base pay", group:"comp",
    definition:"The fixed, guaranteed compensation an employee receives on a regular basis — a salary or hourly wage — regardless of performance." },
  { id:"t12", term:"Variable pay", group:"comp",
    definition:"Compensation that rises or falls with performance, output, or results, such as bonuses, commissions, or incentive pay." },
  { id:"t13", term:"Indirect financial compensation", group:"comp",
    definition:"Non-cash compensation, commonly called benefits — things like health insurance, retirement contributions, and paid leave." },

  // Turnover quality
  { id:"t14", term:"Functional turnover", group:"turnover_quality",
    definition:"The departure of low- or poor-performing employees — turnover that can actually benefit the organization." },
  { id:"t15", term:"Dysfunctional turnover", group:"turnover_quality",
    definition:"The departure of high-performing or hard-to-replace employees — turnover that hurts the organization." },

  // Turnover initiator
  { id:"t16", term:"Voluntary turnover", group:"turnover_initiator",
    definition:"Turnover initiated by the employee, such as resigning to take another job or leave the workforce." },
  { id:"t17", term:"Involuntary turnover", group:"turnover_initiator",
    definition:"Turnover initiated by the employer, such as a termination or layoff." },

  // Recruiting source
  { id:"t18", term:"Internal recruiting", group:"recruiting",
    definition:"Filling an open position with a current employee, through promotion or transfer." },
  { id:"t19", term:"External recruiting", group:"recruiting",
    definition:"Filling an open position with a candidate from outside the organization." },

  // Interview styles
  { id:"t20", term:"Behavioral interviews", group:"interview",
    definition:"Interviews that ask candidates to describe specific things they actually did in the past, on the logic that past behavior predicts future behavior." },
  { id:"t21", term:"Situational interviews", group:"interview",
    definition:"Interviews that pose a hypothetical future scenario and ask candidates how they would handle it." },

  // Rater errors
  { id:"t22", term:"Halo effect", group:"raterror",
    definition:"A rating error in which one positive trait or impression causes a rater to score someone favorably across the board." },
  { id:"t23", term:"Horns effect", group:"raterror",
    definition:"A rating error in which one negative trait or impression causes a rater to score someone unfavorably across the board." },
  { id:"t24", term:"Contrast effect", group:"raterror",
    definition:"A rating error in which a person is judged relative to whoever was just evaluated, rather than against an objective standard." },
  { id:"t25", term:"Central tendency error", group:"raterror",
    definition:"A rating error in which a rater scores nearly everyone as 'average,' avoiding both high and low ratings regardless of actual performance." },

  // Policies / procedures / rules
  { id:"t26", term:"Policies", group:"governance",
    definition:"Broad guidelines that set boundaries for decision-making and behavior, without spelling out exact steps." },
  { id:"t27", term:"Procedures", group:"governance",
    definition:"Specific, step-by-step instructions for how to carry out a task or put a policy into practice." },
  { id:"t28", term:"Rules", group:"governance",
    definition:"An explicit statement of what may or may not be done in a given situation, leaving little room for individual judgment." },

  // Conflict-handling styles (Thomas–Kilmann)
  { id:"t29", term:"Competing", group:"conflict",
    definition:"A conflict-handling style that pursues your own goals at the other party's expense — assertive and uncooperative." },
  { id:"t30", term:"Collaborating", group:"conflict",
    definition:"A conflict-handling style that works with the other party to find a solution that fully satisfies both sides — assertive and cooperative." },
  { id:"t31", term:"Compromising", group:"conflict",
    definition:"A conflict-handling style in which each party gives up something to reach an acceptable middle-ground solution." },
  { id:"t32", term:"Avoiding", group:"conflict",
    definition:"A conflict-handling style that sidesteps or postpones the conflict instead of addressing it — unassertive and uncooperative." },
  { id:"t33", term:"Accommodating", group:"conflict",
    definition:"A conflict-handling style that yields to the other party's wishes at the expense of your own — unassertive but cooperative." },
];

const TERM_BY_ID = Object.fromEntries(TERMS.map(t => [t.id, t]));

/* ---------------- 1B. FINAL ASSESSMENT QUESTION BANK ----------------
   "Review for Final Assessment" — Chapter 4 (HR planning, job analysis,
   job design, org structure, policies/procedures/rules) plus extra
   review topics pulled forward from Chapters 7, 8, 12, and 13.
   Each question quizzes one at a time, then explains the answer and
   ties it back to the vocabulary deck above where one exists.
-------------------------------------------------------- */

const QUESTIONS = [
  { id:"fa01", chapter:4, topic:"Job analysis",
    question:"What is the primary purpose of job analysis?",
    options:[
      "To evaluate an employee's yearly performance",
      "To identify and describe important aspects of a job and the worker characteristics needed to perform it well",
      "To determine whether an employee should be promoted",
      "To compare employee salaries across departments"
    ], correctIndex:1,
    explanation:"Job analysis focuses on the job itself and the knowledge, skills, abilities, and other characteristics needed for successful performance.",
    vocabConnection:"This is the deck's Job analysis term — the process behind both job descriptions and job specifications." },

  { id:"fa02", chapter:4, topic:"Job analysis",
    question:"A supervisor receives a report describing the tasks, responsibilities, and requirements of a newly created role. What is this process called?",
    options:["Job rotation","Job enrichment","Job analysis","Succession planning"], correctIndex:2,
    explanation:"Job analysis systematically identifies what a job involves and what a worker needs to perform it effectively.",
    vocabConnection:"Same vocab term as the previous question — Job analysis. Its output becomes a job description or job specification." },

  { id:"fa03", chapter:4, topic:"Job description vs. specification",
    question:"Which document describes the duties and responsibilities of the job itself?",
    options:["Job specification","Job description","Talent inventory","Replacement chart"], correctIndex:1,
    explanation:"A job description focuses on what the jobholder does. A job specification focuses on the characteristics the worker needs.",
    vocabConnection:"Matches Job description in your deck — what the jobholder does, versus Job specification (who can do it)." },

  { id:"fa04", chapter:4, topic:"Talent inventory",
    question:"Which concept refers to a database or record of employees' skills, competencies, experience, and qualifications?",
    options:["Succession chart","Job analysis","Talent inventory","Organizational chart"], correctIndex:2,
    explanation:"A talent inventory helps managers identify internal employees who may be qualified for current or future positions.",
    vocabConnection:"Talent inventory isn't in your flashcard deck yet — it's the internal skills database that succession planning draws on." },

  { id:"fa05", chapter:4, topic:"Succession planning",
    question:"A company identifies future leaders and develops them so they can eventually move into higher-level roles. What is this called?",
    options:["Succession planning","Job enlargement","Workforce discipline","Performance appraisal"], correctIndex:0,
    explanation:"Succession planning prepares employees to assume important roles in the future.",
    vocabConnection:"Succession planning works hand-in-hand with the talent inventory above — one stores the data, the other acts on it." },

  { id:"fa06", chapter:4, topic:"Job design",
    question:"Which job design technique adds more tasks at the same level of responsibility?",
    options:["Job enrichment","Job enlargement","Job rotation","Job sharing"], correctIndex:1,
    explanation:"Job enlargement expands the number of tasks but does not necessarily increase responsibility or authority.",
    vocabConnection:"Job enlargement = more tasks, same responsibility. Compare with job enrichment below, which adds responsibility, not just tasks." },

  { id:"fa07", chapter:4, topic:"Job design",
    question:"Which job design technique increases responsibility, autonomy, and opportunities for achievement?",
    options:["Job enrichment","Job rotation","Job sharing","Job classification"], correctIndex:0,
    explanation:"Job enrichment makes the job more meaningful by increasing complexity, autonomy, and responsibility.",
    vocabConnection:"Job enrichment is the 'deeper' job design move, versus job enlargement's 'wider' one." },

  { id:"fa08", chapter:4, topic:"Job design",
    question:"An employee moves through several jobs to increase motivation and broaden skills. What is this called?",
    options:["Job enrichment","Job enlargement","Job rotation","Job evaluation"], correctIndex:2,
    explanation:"Job rotation moves employees through different jobs to build experience and reduce monotony.",
    vocabConnection:"Job rotation rounds out the enrichment / enlargement / rotation trio — moving across jobs rather than adding to just one." },

  { id:"fa09", chapter:4, topic:"Organizational structure",
    question:"Which item shows the chain of command and reporting relationships in a company?",
    options:["Job analysis","Organizational chart","Talent inventory","Job specification"], correctIndex:1,
    explanation:"An organizational chart visually shows formal reporting relationships.",
    vocabConnection:"Organizational structure topic — the chart is the visual form of how authority and reporting lines are arranged." },

  { id:"fa10", chapter:4, topic:"Policies, procedures, rules",
    question:"Processes that support consistency and quality work are usually supported through proper use of what?",
    options:["Goals, feedback, and rewards","Handbooks, diagrams, and charts","Policies, procedures, and rules","Job enrichment, enlargement, and rotation"], correctIndex:2,
    explanation:"Policies, procedures, and rules guide consistent behavior and help structure work.",
    vocabConnection:"Matches Policies, Procedures, and Rules in your deck — same three terms, same broad-guideline vs. step-by-step vs. explicit-requirement distinctions." },

  { id:"fa11", chapter:8, topic:"Opportunity bias",
    question:"Opportunity bias occurs when a manager does what?",
    options:["Rates everyone as average","Ignores factors beyond the employee's control that affect performance","Rates an employee highly because of one positive trait","Gives recent events too much weight"], correctIndex:1,
    explanation:"Opportunity bias happens when performance ratings fail to account for unequal opportunities, resources, or constraints.",
    vocabConnection:"New term: opportunity bias (Ch. 8) isn't in your vocab deck yet. It's distinct from halo effect (one good trait) and central tendency error (rating everyone average)." },

  { id:"fa12", chapter:8, topic:"Opportunity bias",
    question:"An employee's sales are low because their territory has fewer customers than others, but the manager rates them poorly without considering that fact. Which error is this?",
    options:["Halo effect","Horns effect","Opportunity bias","Leniency error"], correctIndex:2,
    explanation:"The manager is ignoring an external factor beyond the employee's control.",
    vocabConnection:"Tests opportunity bias against the rater-error terms already in your deck — halo effect and horns effect — so keep all three distinct." },

  { id:"fa13", chapter:7, topic:"Kirkpatrick model",
    question:"Kirkpatrick's four training evaluation levels are:",
    options:["Needs, objectives, design, implementation","Reaction, learning, behavior, results","Planning, training, transfer, discipline","Satisfaction, motivation, compensation, retention"], correctIndex:1,
    explanation:"Kirkpatrick evaluates training through reaction, learning, behavior, and organizational results.",
    vocabConnection:"New framework: Kirkpatrick's four training-evaluation levels (Ch. 7) — not yet in your flashcard deck." },

  { id:"fa14", chapter:7, topic:"Kirkpatrick model",
    question:"Which Kirkpatrick level measures whether trainees liked or were satisfied with the training?",
    options:["Reaction","Learning","Behavior","Results"], correctIndex:0,
    explanation:"Reaction measures participants' immediate response to the training experience.",
    vocabConnection:"First of the four Kirkpatrick levels — reaction." },

  { id:"fa15", chapter:7, topic:"Kirkpatrick model",
    question:"Which Kirkpatrick level evaluates whether employees apply what they learned back on the job?",
    options:["Reaction","Learning","Behavior","Results"], correctIndex:2,
    explanation:"Behavior measures training transfer, or whether learning changes workplace behavior.",
    vocabConnection:"Behavior is the third Kirkpatrick level — training transfer." },

  { id:"fa16", chapter:7, topic:"Kirkpatrick model",
    question:"Which Kirkpatrick level would include customer satisfaction, productivity, or business impact?",
    options:["Reaction","Learning","Behavior","Results"], correctIndex:3,
    explanation:"Results measures whether the training improved organizational outcomes.",
    vocabConnection:"Results is the outcome-level, final Kirkpatrick stage." },

  { id:"fa17", chapter:12, topic:"Safety culture",
    question:"A safety culture is best described as:",
    options:["A list of OSHA fines","Shared safety attitudes, beliefs, and practices that shape safety behavior","A company's written disciplinary policy","The number of accidents reported each year"], correctIndex:1,
    explanation:"Safety culture is about shared norms and behaviors around workplace safety.",
    vocabConnection:"New topic: safety culture (Ch. 12) — shared norms, not a document or a number." },

  { id:"fa18", chapter:12, topic:"Safety culture",
    question:"Which factor is most important in building a strong safety culture?",
    options:["High salaries","CEO and management commitment to safety as a core value","Fewer written safety policies","Punishing all employees who report injuries"], correctIndex:1,
    explanation:"Management commitment is critical because safety often competes with production and profitability pressures.",
    vocabConnection:"Reinforces safety culture — leadership commitment is the throughline." },

  { id:"fa19", chapter:12, topic:"Functional vs. dysfunctional stress",
    question:"Functional stress is best described as stress that:",
    options:["Always harms performance","Can lead to positive outcomes if managed well","Results only from boredom","Is unrelated to job satisfaction"], correctIndex:1,
    explanation:"Functional stress can motivate performance and job satisfaction, but it must be managed.",
    vocabConnection:"New pair: functional vs. dysfunctional stress (Ch. 12) — same functional/dysfunctional logic as functional vs. dysfunctional turnover already in your deck, just applied to stress." },

  { id:"fa20", chapter:12, topic:"Functional vs. dysfunctional stress",
    question:"Dysfunctional stress is best described as:",
    options:["A helpful level of pressure","Stress that results from under- or over-arousal continuing too long","A form of job enrichment","A positive training outcome"], correctIndex:1,
    explanation:"Dysfunctional stress is harmful stress that can reduce well-being and performance.",
    vocabConnection:"Pairs with the previous question — same functional/dysfunctional split you already use for turnover, applied here to stress." },

  { id:"fa21", chapter:12, topic:"Functional vs. dysfunctional stress",
    question:"An employee feels overloaded, anxious, isolated, and unable to continue performing well. Which type of stress is most likely?",
    options:["Functional stress","Dysfunctional stress","Optimal stress","No stress"], correctIndex:1,
    explanation:"The key clue is that the stress is impairing the employee rather than motivating productive performance.",
    vocabConnection:"Applies the functional/dysfunctional stress pair to a real scenario." },

  { id:"fa22", chapter:13, topic:"Legitimating tactics",
    question:"Legitimating tactics involve:",
    options:["Using flattery to influence someone","Offering something in exchange for cooperation","Referring to rules, contracts, precedents, or official authority","Appealing to someone's emotions or values"], correctIndex:2,
    explanation:"Legitimating tactics rely on formal authority or official rules to support a request.",
    vocabConnection:"New topic: legitimating tactics (Ch. 13) — an influence tactic based on formal authority, not persuasion or exchange." },

  { id:"fa23", chapter:13, topic:"Legitimating tactics",
    question:"A manager says, \"Company policy requires this form to be completed before reimbursement.\" Which influence tactic is being used?",
    options:["Inspirational appeal","Legitimating tactic","Ingratiation","Personal appeal"], correctIndex:1,
    explanation:"The manager is using company policy as the basis for the request.",
    vocabConnection:"Same legitimating-tactics concept as the previous question, applied to a workplace example." },

  { id:"fa24", chapter:4, topic:"Cross-topic check",
    question:"Which pairing is correct?",
    options:["Job enrichment = adding more same-level tasks","Job enlargement = increasing autonomy and responsibility","Job rotation = moving employees through different jobs","Opportunity bias = rating everyone as average"], correctIndex:2,
    explanation:"Job rotation means moving employees among jobs. Job enlargement adds tasks, job enrichment adds responsibility, and opportunity bias ignores outside constraints.",
    vocabConnection:"A cross-check question — tests job enrichment, enlargement, rotation, and opportunity bias all together." },

  { id:"fa25", chapter:4, topic:"Chapter mapping",
    question:"Which topic is most clearly Chapter 4 specific?",
    options:["Kirkpatrick's model","Safety culture","Job analysis","Legitimating tactics"], correctIndex:2,
    explanation:"Job analysis is a Chapter 4 topic. Kirkpatrick is Chapter 7, safety culture is Chapter 12, and legitimating tactics are Chapter 13.",
    vocabConnection:"A chapter-mapping check — useful for keeping the topic map straight before the final." },
];

/* ---------------- 2. STATE / PERSISTENCE ---------------- */

const STORAGE_KEY = "c202_quiz_progress_v1";

function defaultState(){
  const progress = {};
  TERMS.forEach(t => {
    progress[t.id] = { attempts:0, correct:0, incorrect:0, streak:0, mastered:false, lastSeen:null, missed:false, missedStreak:0 };
  });
  const examProgress = {};
  QUESTIONS.forEach(q => {
    examProgress[q.id] = { attempts:0, correct:0, incorrect:0, streak:0, mastered:false, lastSeen:null, missed:false, missedStreak:0 };
  });
  return { progress, examProgress, sessionAttempts:0, sessionCorrect:0, examSessionAttempts:0, examSessionCorrect:0 };
}

let STATE = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // backfill any new terms/questions not present in a saved older state
    const fresh = defaultState();
    parsed.progress = parsed.progress || {};
    TERMS.forEach(t => { if(!parsed.progress[t.id]) parsed.progress[t.id] = fresh.progress[t.id]; });
    parsed.examProgress = parsed.examProgress || {};
    QUESTIONS.forEach(q => { if(!parsed.examProgress[q.id]) parsed.examProgress[q.id] = fresh.examProgress[q.id]; });
    parsed.sessionAttempts = 0;
    parsed.sessionCorrect = 0;
    parsed.examSessionAttempts = 0;
    parsed.examSessionCorrect = 0;
    return parsed;
  }catch(e){
    console.error("Could not load saved progress, starting fresh.", e);
    return defaultState();
  }
}

function saveState(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  }catch(e){
    console.error("Could not save progress.", e);
  }
}

/* ---------------- 3. HELPERS ---------------- */

function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(target, count){
  const sameGroup = TERMS.filter(t => t.id !== target.id && t.group === target.group);
  const others = TERMS.filter(t => t.id !== target.id && t.group !== target.group);
  const pool = shuffle(sameGroup).concat(shuffle(others));
  return pool.slice(0, count);
}

function weightedTermPool(){
  // Spaced-repetition priority: missed > unseen > seen <3 correct in a row > mastered (rare)
  const missed = [], unseen = [], inProgress = [], mastered = [];
  TERMS.forEach(t => {
    const p = STATE.progress[t.id];
    if(p.missed) missed.push(t);
    else if(p.attempts === 0) unseen.push(t);
    else if(!p.mastered) inProgress.push(t);
    else mastered.push(t);
  });
  let pool = [];
  pool = pool.concat(missed, missed, unseen, unseen, inProgress);
  if(Math.random() < 0.12 && mastered.length) pool = pool.concat(mastered);
  if(pool.length === 0) pool = TERMS.slice();
  return pool;
}

function recordAnswer(termId, isCorrect){
  const p = STATE.progress[termId];
  p.attempts++; p.lastSeen = Date.now();
  STATE.sessionAttempts++;
  if(isCorrect){
    p.correct++; p.streak++;
    STATE.sessionCorrect++;
    if(p.streak >= 3) p.mastered = true;
    if(p.missed){
      p.missedStreak++;
      if(p.missedStreak >= 2){ p.missed = false; p.missedStreak = 0; }
    }
  }else{
    p.incorrect++; p.streak = 0; p.mastered = false;
    p.missed = true; p.missedStreak = 0;
  }
  saveState();
}

function fmtPct(n, d){ return d ? Math.round((n / d) * 100) : 0; }

function weightedQuestionPool(){
  // Same spaced-repetition priority as weightedTermPool, applied to the question bank.
  const missed = [], unseen = [], inProgress = [], mastered = [];
  QUESTIONS.forEach(q => {
    const p = STATE.examProgress[q.id];
    if(p.missed) missed.push(q);
    else if(p.attempts === 0) unseen.push(q);
    else if(!p.mastered) inProgress.push(q);
    else mastered.push(q);
  });
  let pool = [];
  pool = pool.concat(missed, missed, unseen, unseen, inProgress);
  if(Math.random() < 0.12 && mastered.length) pool = pool.concat(mastered);
  if(pool.length === 0) pool = QUESTIONS.slice();
  return pool;
}

function recordExamAnswer(qId, isCorrect){
  const p = STATE.examProgress[qId];
  p.attempts++; p.lastSeen = Date.now();
  STATE.examSessionAttempts++;
  if(isCorrect){
    p.correct++; p.streak++;
    STATE.examSessionCorrect++;
    if(p.streak >= 2) p.mastered = true;
    if(p.missed){
      p.missedStreak++;
      if(p.missedStreak >= 2){ p.missed = false; p.missedStreak = 0; }
    }
  }else{
    p.incorrect++; p.streak = 0; p.mastered = false;
    p.missed = true; p.missedStreak = 0;
  }
  saveState();
}

/* ---------------- 4. APP STATE ---------------- */

let currentMode = "def2term";
let currentQuestion = null;   // {term, type, prompt, options, correctIndex}
let answered = false;
let flashKnown = false;
let currentExamQuestion = null;  // current question object from QUESTIONS, for Final Review mode
let examAnswered = false;

const root = document.getElementById("app");

/* ---------------- 5. RENDER: SHELL ---------------- */

const MODE_LABELS = {
  def2term: "Define→Term",
  term2def: "Term→Define",
  similar:  "Similar Terms",
  flash:    "Flashcards",
  hard:     "Hard Mode",
  missed:   "Missed",
  final:    "Final Review",
  search:   "Search",
  dashboard:"Dashboard",
};

function renderShell(){
  root.innerHTML = `
    <div class="binder">
      <div class="binder-holes"><span></span><span></span><span></span><span></span><span></span></div>
      <header class="masthead">
        <span class="stamp">FIELD NOTES · C202</span>
        <h1>Managing Human Capital</h1>
        <p>Practice deck for vocabulary, definitions, and the terms everyone mixes up.</p>
      </header>
      <nav class="tabs" id="tabs"></nav>
      <main class="card"><div class="card-inner" id="cardInner"></div></main>
      <div class="footer-row">
        <span class="credit">progress saved on this device</span>
        <button class="reset-btn" id="resetBtn" type="button">Reset progress</button>
      </div>
    </div>
  `;
  const tabs = document.getElementById("tabs");
  Object.entries(MODE_LABELS).forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.className = "tab" + (key === currentMode ? " active" : "");
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => setMode(key));
    tabs.appendChild(btn);
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if(confirm("Reset all saved progress on this device? This can't be undone.")){
      STATE = defaultState();
      saveState();
      currentQuestion = null; answered = false; flashKnown = false;
      currentExamQuestion = null; examAnswered = false;
      renderShell();
      renderMode();
    }
  });
}

function setMode(key){
  currentMode = key;
  answered = false;
  flashKnown = false;
  currentQuestion = null;
  examAnswered = false;
  currentExamQuestion = null;
  renderShell();
  renderMode();
}

function renderMode(){
  const el = document.getElementById("cardInner");
  if(["def2term","term2def","similar","hard"].includes(currentMode)){
    renderQuizMode(el);
  }else if(currentMode === "missed"){
    renderMissedMode(el);
  }else if(currentMode === "flash"){
    renderFlashMode(el);
  }else if(currentMode === "final"){
    renderFinalMode(el);
  }else if(currentMode === "search"){
    renderSearchMode(el);
  }else if(currentMode === "dashboard"){
    renderDashboard(el);
  }
}

/* ---------------- 6. QUIZ MODES (def2term / term2def / similar / hard) ---------------- */

function buildQuestion(mode, sourcePool){
  const pool = sourcePool || weightedTermPool();
  const target = pool[Math.floor(Math.random() * pool.length)];

  if(mode === "hard"){
    return { term: target, type:"hard", promptLabel:"Type the term", prompt: target.definition };
  }

  const askTerm = (mode === "def2term") || (mode === "similar" && Math.random() < 0.5);
  let distractorCount = 3;
  const distractors = pickDistractors(target, distractorCount);

  if(askTerm){
    const options = shuffle([target, ...distractors]);
    return {
      term: target, type:"mcq-term",
      promptLabel: "Which term matches this definition?",
      prompt: target.definition,
      options: options.map(o => o.term),
      correctIndex: options.findIndex(o => o.id === target.id),
      optionTerms: options,
    };
  }else{
    const options = shuffle([target, ...distractors]);
    return {
      term: target, type:"mcq-def",
      promptLabel: `What is the definition of "${target.term}"?`,
      prompt: null,
      options: options.map(o => o.definition),
      correctIndex: options.findIndex(o => o.id === target.id),
      optionTerms: options,
    };
  }
}

function renderQuizMode(el, poolOverride){
  if(!currentQuestion){
    currentQuestion = buildQuestion(currentMode, poolOverride);
    answered = false;
  }
  const q = currentQuestion;
  const p = STATE.progress;
  const masteredCount = TERMS.filter(t => p[t.id].mastered).length;

  el.innerHTML = `
    <div class="scorebar">
      <span><span class="qnum">${STATE.sessionCorrect}/${STATE.sessionAttempts}</span> this session</span>
      <span class="acc">${masteredCount}/${TERMS.length} mastered</span>
    </div>
    <div class="progresswrap"><div class="progressfill" style="width:${fmtPct(masteredCount, TERMS.length)}%"></div></div>
    <p class="prompt-label">${q.promptLabel}</p>
    ${ q.prompt && q.type !== "hard" ? `<p class="prompt-text">${escapeHtml(q.prompt)}</p>` : "" }
    ${ q.type === "hard" ? `<p class="prompt-text">${escapeHtml(q.prompt)}</p>` : "" }
    <div id="answerZone"></div>
    <div class="feedback" id="feedback"></div>
    <button class="next-btn" id="nextBtn" style="display:none">Next question →</button>
  `;

  const answerZone = document.getElementById("answerZone");

  if(q.type === "hard"){
    answerZone.innerHTML = `
      <div class="hardmode-input">
        <input id="hardInput" type="text" placeholder="Type the term…" autocomplete="off" />
        <button id="hardSubmit" type="button">Check</button>
      </div>
    `;
    const input = document.getElementById("hardInput");
    const submit = document.getElementById("hardSubmit");
    const go = () => submitHard(input.value);
    submit.addEventListener("click", go);
    input.addEventListener("keydown", e => { if(e.key === "Enter") go(); });
    input.focus();
  }else{
    const letters = ["A","B","C","D"];
    answerZone.innerHTML = `<div class="options">${
      q.options.map((opt,i) => `
        <button class="option" data-i="${i}" type="button">
          <span class="letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>
        </button>`).join("")
    }</div>`;
    answerZone.querySelectorAll(".option").forEach(btn => {
      btn.addEventListener("click", () => submitMcq(Number(btn.dataset.i)));
    });
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    currentQuestion = null;
    renderQuizMode(el, poolOverride);
  });
}

function normalize(s){ return s.trim().toLowerCase().replace(/\s+/g," "); }

function submitHard(value){
  if(answered) return;
  answered = true;
  const q = currentQuestion;
  const isCorrect = normalize(value) === normalize(q.term.term);
  recordAnswer(q.term.id, isCorrect);
  document.getElementById("hardSubmit").disabled = true;
  document.getElementById("hardInput").disabled = true;
  showFeedback(isCorrect, q.term, null);
}

function submitMcq(selectedIndex){
  if(answered) return;
  answered = true;
  const q = currentQuestion;
  const isCorrect = selectedIndex === q.correctIndex;
  recordAnswer(q.term.id, isCorrect);

  const buttons = document.querySelectorAll(".option");
  buttons.forEach((btn,i) => {
    btn.disabled = true;
    if(i === q.correctIndex) btn.classList.add("correct");
    else if(i === selectedIndex) btn.classList.add("incorrect");
    else btn.classList.add("faded");
  });

  const selectedTerm = q.optionTerms ? q.optionTerms[selectedIndex] : null;
  showFeedback(isCorrect, q.term, selectedTerm);
}

function showFeedback(isCorrect, correctTerm, selectedTerm){
  const fb = document.getElementById("feedback");
  fb.classList.add("show", isCorrect ? "correct" : "incorrect");
  let explain = `<b>${escapeHtml(correctTerm.term)}</b> — ${escapeHtml(correctTerm.definition)}`;
  if(!isCorrect && selectedTerm && selectedTerm.id !== correctTerm.id){
    explain += `<br><br>Don't confuse it with <b>${escapeHtml(selectedTerm.term)}</b>, which means: ${escapeHtml(selectedTerm.definition)}`;
  }
  fb.innerHTML = `<span class="verdict">${isCorrect ? "CORRECT" : "INCORRECT"}</span><div class="explain">${explain}</div>`;
  document.getElementById("nextBtn").style.display = "block";
}

/* ---------------- 7. MISSED REVIEW MODE ---------------- */

function renderMissedMode(el){
  const missedTerms = TERMS.filter(t => STATE.progress[t.id].missed);
  if(missedTerms.length === 0){
    el.innerHTML = `
      <p class="prompt-label">Missed questions review</p>
      <p class="empty-note">Nothing in review right now — anything you miss in other modes will land here until you get it right twice in a row.</p>
    `;
    return;
  }
  if(!currentQuestion){
    currentQuestion = buildQuestion(Math.random() < 0.5 ? "def2term" : "term2def", missedTerms);
  }
  renderQuizMode(el, missedTerms);
  const label = document.querySelector(".prompt-label");
  if(label) label.textContent = `Missed review (${missedTerms.length} term${missedTerms.length === 1 ? "" : "s"} left) · ${label.textContent}`;
}

/* ---------------- 8. FLASHCARD MODE ---------------- */

function renderFlashMode(el){
  if(!currentQuestion){
    const pool = weightedTermPool();
    currentQuestion = { term: pool[Math.floor(Math.random()*pool.length)] };
    flashKnown = false;
  }
  const t = currentQuestion.term;
  el.innerHTML = `
    <p class="prompt-label">Flashcard · tap to flip</p>
    <div class="flashcard-zone">
      <div class="flashcard" id="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-face front"><span class="term-word">${escapeHtml(t.term)}</span></div>
          <div class="flashcard-face back">${escapeHtml(t.definition)}</div>
        </div>
      </div>
      <p class="flashcard-hint">Mastered: ${TERMS.filter(x=>STATE.progress[x.id].mastered).length}/${TERMS.length}</p>
      <div class="flash-controls">
        <button class="miss" type="button" id="flashMiss">Still learning</button>
        <button class="know" type="button" id="flashKnow">I know this</button>
      </div>
    </div>
  `;
  document.getElementById("flashcard").addEventListener("click", function(){
    this.classList.toggle("flipped");
  });
  document.getElementById("flashKnow").addEventListener("click", () => {
    recordAnswer(t.id, true);
    currentQuestion = null;
    renderFlashMode(el);
  });
  document.getElementById("flashMiss").addEventListener("click", () => {
    recordAnswer(t.id, false);
    currentQuestion = null;
    renderFlashMode(el);
  });
}

/* ---------------- 8B. FINAL REVIEW MODE ---------------- */

function renderFinalMode(el){
  if(!currentExamQuestion){
    const pool = weightedQuestionPool();
    currentExamQuestion = pool[Math.floor(Math.random() * pool.length)];
    examAnswered = false;
  }
  const q = currentExamQuestion;
  const masteredCount = QUESTIONS.filter(x => STATE.examProgress[x.id].mastered).length;
  const letters = ["A","B","C","D"];

  el.innerHTML = `
    <div class="scorebar">
      <span><span class="qnum">${STATE.examSessionCorrect}/${STATE.examSessionAttempts}</span> this session</span>
      <span class="acc">${masteredCount}/${QUESTIONS.length} mastered</span>
    </div>
    <div class="progresswrap"><div class="progressfill" style="width:${fmtPct(masteredCount, QUESTIONS.length)}%"></div></div>
    <p class="prompt-label">Review for final assessment · Ch. 4 + extra topics (${q.topic}, Ch. ${q.chapter})</p>
    <p class="prompt-text">${escapeHtml(q.question)}</p>
    <div class="options">${
      q.options.map((opt,i) => `
        <button class="option" data-i="${i}" type="button">
          <span class="letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>
        </button>`).join("")
    }</div>
    <div class="feedback" id="examFeedback"></div>
    <button class="next-btn" id="examNextBtn" style="display:none">Next question →</button>
  `;

  el.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", () => submitExamAnswer(Number(btn.dataset.i)));
  });
  document.getElementById("examNextBtn").addEventListener("click", () => {
    currentExamQuestion = null;
    renderFinalMode(el);
  });
}

function submitExamAnswer(selectedIndex){
  if(examAnswered) return;
  examAnswered = true;
  const q = currentExamQuestion;
  const isCorrect = selectedIndex === q.correctIndex;
  recordExamAnswer(q.id, isCorrect);

  document.querySelectorAll("#cardInner .option").forEach((btn,i) => {
    btn.disabled = true;
    if(i === q.correctIndex) btn.classList.add("correct");
    else if(i === selectedIndex) btn.classList.add("incorrect");
    else btn.classList.add("faded");
  });

  const fb = document.getElementById("examFeedback");
  fb.classList.add("show", isCorrect ? "correct" : "incorrect");
  fb.innerHTML = `
    <span class="verdict">${isCorrect ? "CORRECT" : "INCORRECT"}</span>
    <div class="explain">${escapeHtml(q.explanation)}<br><br><b>Vocab connection:</b> ${escapeHtml(q.vocabConnection)}</div>
  `;
  document.getElementById("examNextBtn").style.display = "block";
}

/* ---------------- 9. SEARCH MODE ---------------- */

function renderSearchMode(el){
  el.innerHTML = `
    <p class="prompt-label">Vocabulary search</p>
    <div class="search-wrap"><input id="searchInput" type="text" placeholder="Search a term or a word in a definition…" /></div>
    <div class="search-results" id="searchResults"></div>
  `;
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  function draw(q){
    const query = normalize(q);
    const list = query
      ? TERMS.filter(t => normalize(t.term).includes(query) || normalize(t.definition).includes(query))
      : TERMS;
    results.innerHTML = list.map(t => {
      const mastered = STATE.progress[t.id].mastered;
      return `<div class="term-row">
        <div class="t">${escapeHtml(t.term)}${mastered ? '<span class="badge-mastered">MASTERED</span>' : ""}</div>
        <div class="d">${escapeHtml(t.definition)}</div>
      </div>`;
    }).join("") || `<p class="empty-note">No terms match that search.</p>`;
  }
  input.addEventListener("input", () => draw(input.value));
  draw("");
}

/* ---------------- 10. DASHBOARD ---------------- */

function renderDashboard(el){
  const ids = TERMS.map(t => t.id);
  const totals = ids.reduce((acc, id) => {
    const p = STATE.progress[id];
    acc.attempts += p.attempts;
    acc.correct += p.correct;
    return acc;
  }, { attempts:0, correct:0 });

  const mastered = TERMS.filter(t => STATE.progress[t.id].mastered);
  const needsReview = TERMS.filter(t => STATE.progress[t.id].missed);
  const mostMissed = TERMS
    .filter(t => STATE.progress[t.id].incorrect > 0)
    .sort((a,b) => STATE.progress[b.id].incorrect - STATE.progress[a.id].incorrect)
    .slice(0,5);

  const examIds = QUESTIONS.map(q => q.id);
  const examTotals = examIds.reduce((acc, id) => {
    const p = STATE.examProgress[id];
    acc.attempts += p.attempts;
    acc.correct += p.correct;
    return acc;
  }, { attempts:0, correct:0 });
  const examMastered = QUESTIONS.filter(q => STATE.examProgress[q.id].mastered);
  const examNeedsReview = QUESTIONS.filter(q => STATE.examProgress[q.id].missed);
  const examMostMissed = QUESTIONS
    .filter(q => STATE.examProgress[q.id].incorrect > 0)
    .sort((a,b) => STATE.examProgress[b.id].incorrect - STATE.examProgress[a.id].incorrect)
    .slice(0,5);

  el.innerHTML = `
    <p class="prompt-label">Mastery dashboard</p>
    <div class="dash-grid">
      <div class="dash-stat"><div class="num">${totals.attempts}</div><div class="label">Total attempts</div></div>
      <div class="dash-stat"><div class="num">${fmtPct(totals.correct, totals.attempts)}%</div><div class="label">Accuracy</div></div>
      <div class="dash-stat"><div class="num">${mastered.length}/${TERMS.length}</div><div class="label">Terms mastered</div></div>
      <div class="dash-stat"><div class="num">${needsReview.length}</div><div class="label">Needs review</div></div>
    </div>
    <div class="weak-list">
      <h3>Most missed terms</h3>
      ${ mostMissed.length
          ? mostMissed.map(t => `<div class="weak-row"><span>${escapeHtml(t.term)}</span><span class="miss-count">missed ${STATE.progress[t.id].incorrect}×</span></div>`).join("")
          : `<p class="empty-note">No misses logged yet — once you start quizzing, your weak terms will show up here.</p>`
      }
    </div>
    <div class="weak-list" style="margin-top:20px">
      <h3>Final assessment review</h3>
      <div class="dash-grid">
        <div class="dash-stat"><div class="num">${fmtPct(examTotals.correct, examTotals.attempts)}%</div><div class="label">Exam accuracy</div></div>
        <div class="dash-stat"><div class="num">${examMastered.length}/${QUESTIONS.length}</div><div class="label">Questions mastered</div></div>
      </div>
      ${ examNeedsReview.length ? `<p class="empty-note">${examNeedsReview.length} question${examNeedsReview.length===1?"":"s"} still in review on the Final Review tab.</p>` : "" }
      ${ examMostMissed.length
          ? examMostMissed.map(q => `<div class="weak-row"><span>${escapeHtml(q.topic)}</span><span class="miss-count">missed ${STATE.examProgress[q.id].incorrect}×</span></div>`).join("")
          : `<p class="empty-note">No misses logged yet on the final-assessment questions.</p>`
      }
    </div>
  `;
}

/* ---------------- 11. UTIL ---------------- */

function escapeHtml(str){
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

/* ---------------- 12. BOOT ---------------- */

renderShell();
renderMode();
