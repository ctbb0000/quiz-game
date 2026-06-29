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

/* ---------------- 2. STATE / PERSISTENCE ---------------- */

const STORAGE_KEY = "c202_quiz_progress_v1";

function defaultState(){
  const progress = {};
  TERMS.forEach(t => {
    progress[t.id] = { attempts:0, correct:0, incorrect:0, streak:0, mastered:false, lastSeen:null, missed:false, missedStreak:0 };
  });
  return { progress, sessionAttempts:0, sessionCorrect:0 };
}

let STATE = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // backfill any new terms not present in a saved older state
    const fresh = defaultState();
    parsed.progress = parsed.progress || {};
    TERMS.forEach(t => { if(!parsed.progress[t.id]) parsed.progress[t.id] = fresh.progress[t.id]; });
    parsed.sessionAttempts = 0;
    parsed.sessionCorrect = 0;
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

/* ---------------- 4. APP STATE ---------------- */

let currentMode = "def2term";
let currentQuestion = null;   // {term, type, prompt, options, correctIndex}
let answered = false;
let flashKnown = false;

const root = document.getElementById("app");

/* ---------------- 5. RENDER: SHELL ---------------- */

const MODE_LABELS = {
  def2term: "Define→Term",
  term2def: "Term→Define",
  similar:  "Similar Terms",
  flash:    "Flashcards",
  hard:     "Hard Mode",
  missed:   "Missed",
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
