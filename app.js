/* Junior Security Analyst PWA
   Offline-first learning + optional online answering.

   Online answering:
   - This app calls POST /api/ask { question, context }
   - For safety + privacy, do NOT put API keys in the browser.
   - Create your own small server as a proxy if you want AI online answers.
*/

const DATA = window.APP_DATA;
const LS = {
  progress: "jsa_progress_v1",
  quiz: "jsa_quiz_v1",
  streak: "jsa_streak_v1"
};

const state = {
  view: "dashboard",
  selectedSkillId: null,
  selectedLessonIndex: 0,
  cardIndex: 0,
  cardFlipped: false,
  quizOn: false,
  quizIndex: 0,
  quizCorrect: 0,
  quizAnswered: false
};

function loadProgress(){
  try{
    return JSON.parse(localStorage.getItem(LS.progress)) || { lessonsDone:{}, labsDone:{}, skillsDone:{} };
  }catch{
    return { lessonsDone:{}, labsDone:{}, skillsDone:{} };
  }
}
function saveProgress(p){ localStorage.setItem(LS.progress, JSON.stringify(p)); }

function loadQuiz(){
  try{
    return JSON.parse(localStorage.getItem(LS.quiz)) || { attempts:0, correct:0 };
  }catch{
    return { attempts:0, correct:0 };
  }
}
function saveQuiz(q){ localStorage.setItem(LS.quiz, JSON.stringify(q)); }

function setNetPill(){
  const pill = document.getElementById("netPill");
  const online = navigator.onLine;
  pill.textContent = online ? "Online" : "Offline";
  pill.style.borderColor = online ? "rgba(53,208,127,.45)" : "rgba(255,204,102,.45)";
  pill.style.color = online ? "rgba(53,208,127,.95)" : "rgba(255,204,102,.95)";
}

function $(id){ return document.getElementById(id); }
function escapeHtml(s){
  return s.replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));
}

function showView(view){
  state.view = view;
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  document.querySelector(`#view-${view}`).classList.remove("hidden");
  document.querySelectorAll(".navBtn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
}

function computeSkillCompletion(progress){
  // Skill complete if all lessons are done AND at least one lab for that skill (if labs exist) is done.
  // If no labs exist for a skill, lessons completion alone marks it.
  const skills = DATA.checklist;
  const done = {};
  for(const sk of skills){
    const allLessonsDone = sk.lessons.every(lsn => !!progress.lessonsDone[`${sk.id}:${lsn.id}`]);
    const labsForSkill = DATA.labs.filter(l => l.skillId === sk.id);
    const labDone = labsForSkill.length === 0 ? true : labsForSkill.some(l => !!progress.labsDone[l.id]);
    done[sk.id] = allLessonsDone && labDone;
  }
  return done;
}

function updateDashboard(){
  const progress = loadProgress();
  progress.skillsDone = computeSkillCompletion(progress);
  saveProgress(progress);

  const doneCount = Object.values(progress.skillsDone).filter(Boolean).length;
  const lessonsDoneCount = Object.values(progress.lessonsDone).filter(Boolean).length;

  const quiz = loadQuiz();
  const accuracy = quiz.attempts ? Math.round((quiz.correct/quiz.attempts)*100) : 0;

  $("statDone").textContent = `${doneCount}/7`;
  $("statLessons").textContent = `${lessonsDoneCount}`;
  $("statAccuracy").textContent = `${accuracy}%`;

  // Checklist list
  const wrap = $("checklist");
  wrap.innerHTML = "";
  for(const sk of DATA.checklist){
    const isDone = !!progress.skillsDone[sk.id];
    const badgeClass = isDone ? "ok" : "warn";
    const badgeText = isDone ? "Completed" : sk.level;
    const item = document.createElement("div");
    item.className = "checklistItem";
    item.innerHTML = `
      <div>
        <div style="font-weight:800">${escapeHtml(sk.title)}</div>
        <div class="muted" style="margin-top:4px">${escapeHtml(sk.why)}</div>
      </div>
      <div class="row">
        <span class="badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        <button class="primary" data-open-skill="${escapeHtml(sk.id)}">Open</button>
      </div>
    `;
    wrap.appendChild(item);
  }

  // Learning path
  const path = $("path");
  path.innerHTML = "";
  for(const step of DATA.learningPath){
    const li = document.createElement("li");
    li.textContent = step;
    path.appendChild(li);
  }

  // Role bullets
  const role = $("roleBullets");
  role.innerHTML = "";
  for(const b of DATA.roleBullets){
    const li = document.createElement("li");
    li.textContent = b;
    role.appendChild(li);
  }

  // Bind open buttons
  wrap.querySelectorAll("[data-open-skill]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      openSkill(btn.getAttribute("data-open-skill"));
      showView("modules");
    });
  });
}

function renderModules(){
  const progress = loadProgress();
  const q = $("search").value.trim().toLowerCase();

  const grid = $("moduleGrid");
  grid.innerHTML = "";

  for(const sk of DATA.checklist){
    const match =
      !q ||
      sk.title.toLowerCase().includes(q) ||
      sk.lessons.some(l => l.title.toLowerCase().includes(q));

    if(!match) continue;

    const lessonsDone = sk.lessons.filter(l => progress.lessonsDone[`${sk.id}:${l.id}`]).length;
    const skillDone = !!computeSkillCompletion(progress)[sk.id];

    const el = document.createElement("div");
    el.className = "module";
    el.innerHTML = `
      <div class="row wrap">
        <div class="grow">
          <h3>${escapeHtml(sk.title)}</h3>
          <div class="muted">${escapeHtml(sk.why)}</div>
        </div>
        <span class="badge ${skillDone ? "ok":"warn"}">${skillDone ? "Completed" : sk.level}</span>
      </div>
      <div class="row wrap">
        <span class="muted">${lessonsDone}/${sk.lessons.length} lessons done</span>
        <button class="primary" data-skill="${escapeHtml(sk.id)}">Open lessons</button>
      </div>
    `;
    grid.appendChild(el);
  }

  grid.querySelectorAll("[data-skill]").forEach(b=>{
    b.addEventListener("click", ()=> openSkill(b.getAttribute("data-skill")));
  });
}

function openSkill(skillId){
  state.selectedSkillId = skillId;
  state.selectedLessonIndex = 0;
  $("lessonCard").classList.remove("hidden");
  renderLesson();
}

function renderLesson(){
  const sk = DATA.checklist.find(s => s.id === state.selectedSkillId) || DATA.checklist[0];
  const idx = Math.max(0, Math.min(state.selectedLessonIndex, sk.lessons.length - 1));
  state.selectedLessonIndex = idx;

  const lsn = sk.lessons[idx];
  $("lessonTitle").textContent = `${sk.title} — ${lsn.title}`;
  $("lessonMeta").textContent = `Difficulty: ${sk.level} • Lesson ${idx+1}/${sk.lessons.length} • ~${lsn.minutes} min`;

  $("lessonBody").innerHTML = lsn.content;

  const progress = loadProgress();
  const key = `${sk.id}:${lsn.id}`;
  $("lessonDone").checked = !!progress.lessonsDone[key];

  $("prevLesson").disabled = idx === 0;
  $("nextLesson").disabled = idx === sk.lessons.length - 1;
}

function bindLessonControls(){
  $("prevLesson").addEventListener("click", ()=>{ state.selectedLessonIndex--; renderLesson(); });
  $("nextLesson").addEventListener("click", ()=>{ state.selectedLessonIndex++; renderLesson(); });

  $("lessonDone").addEventListener("change", ()=>{
    const sk = DATA.checklist.find(s => s.id === state.selectedSkillId);
    const lsn = sk.lessons[state.selectedLessonIndex];
    const key = `${sk.id}:${lsn.id}`;
    const progress = loadProgress();
    progress.lessonsDone[key] = $("lessonDone").checked;
    saveProgress(progress);
    updateDashboard();
    renderModules();
  });

  $("copyBtn").addEventListener("click", async ()=>{
    const sk = DATA.checklist.find(s => s.id === state.selectedSkillId);
    const lsn = sk.lessons[state.selectedLessonIndex];
    const text = `${sk.title}\n${lsn.title}\n\n` +
      $("lessonBody").innerText.trim();
    try{
      await navigator.clipboard.writeText(text);
      $("copyBtn").textContent = "Copied!";
      setTimeout(()=> $("copyBtn").textContent = "Copy notes", 900);
    }catch{
      alert("Copy failed. (Browser may block clipboard.)");
    }
  });
}

function renderFlashcards(){
  const decks = Array.from(new Set(DATA.flashcards.map(c=>c.deck))).sort();
  const sel = $("deckSelect");
  sel.innerHTML = `<option value="all">All decks</option>` + decks.map(d=>`<option>${escapeHtml(d)}</option>`).join("");

  function pickNew(){
    const deck = sel.value;
    const pool = deck === "all" ? DATA.flashcards : DATA.flashcards.filter(c=>c.deck===deck);
    if(pool.length === 0) return;
    state.cardIndex = Math.floor(Math.random()*pool.length);
    state.cardFlipped = false;
    const card = pool[state.cardIndex];
    $("cardFront").textContent = card.front;
    $("cardBack").textContent = card.back;
  }

  $("newCard").onclick = pickNew;
  sel.onchange = pickNew;

  const box = $("cardBox");
  const flip = ()=>{
    state.cardFlipped = !state.cardFlipped;
    $("cardBack").style.display = state.cardFlipped ? "block" : "none";
  };
  box.onclick = flip;
  box.onkeydown = (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); flip(); } };

  // init
  $("cardBack").style.display = "none";
  pickNew();
}

function renderLabs(){
  const progress = loadProgress();
  const list = $("labList");
  list.innerHTML = "";

  for(const lab of DATA.labs){
    const done = !!progress.labsDone[lab.id];
    const sk = DATA.checklist.find(s=>s.id===lab.skillId);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="row wrap">
        <div class="grow">
          <h2 style="margin:0">${escapeHtml(lab.title)}</h2>
          <div class="muted">Skill: ${escapeHtml(sk ? sk.title : lab.skillId)}</div>
        </div>
        <span class="badge ${done ? "ok":"warn"}">${done ? "Completed":"Not done"}</span>
      </div>
      <div class="divider"></div>
      <ol class="path">
        ${lab.steps.map(s=>`<li>${escapeHtml(s)}</li>`).join("")}
      </ol>
      <div class="divider"></div>
      <label class="check">
        <input type="checkbox" data-lab="${escapeHtml(lab.id)}" ${done ? "checked":""} />
        Mark lab completed
      </label>
    `;
    list.appendChild(card);
  }

  list.querySelectorAll("input[data-lab]").forEach(chk=>{
    chk.addEventListener("change", ()=>{
      const progress = loadProgress();
      progress.labsDone[chk.getAttribute("data-lab")] = chk.checked;
      saveProgress(progress);
      updateDashboard();
      renderModules();
    });
  });
}

function quizResetUI(){
  $("quizBox").classList.add("hidden");
  $("qExplain").textContent = "";
  $("qChoices").innerHTML = "";
}
function startQuiz(){
  state.quizOn = true;
  state.quizIndex = 0;
  state.quizCorrect = 0;
  state.quizAnswered = false;
  $("quizBox").classList.remove("hidden");
  renderQuestion();
}
function renderQuestion(){
  const q = DATA.quiz[state.quizIndex];
  $("quizMeta").textContent = `Question ${state.quizIndex+1}/${DATA.quiz.length}`;
  $("qText").textContent = q.q;
  $("qExplain").textContent = "";

  const box = $("qChoices");
  box.innerHTML = "";
  state.quizAnswered = false;

  q.choices.forEach((c, i)=>{
    const b = document.createElement("button");
    b.className = "choiceBtn";
    b.textContent = c;
    b.onclick = ()=>{
      if(state.quizAnswered) return;
      state.quizAnswered = true;

      const correct = i === q.answerIndex;
      if(correct){
        b.classList.add("correct");
        state.quizCorrect++;
      }else{
        b.classList.add("wrong");
        // highlight correct one
        box.querySelectorAll(".choiceBtn")[q.answerIndex].classList.add("correct");
      }

      $("qExplain").textContent = q.explain;

      const quizStore = loadQuiz();
      quizStore.attempts++;
      if(correct) quizStore.correct++;
      saveQuiz(quizStore);

      updateDashboard();
    };
    box.appendChild(b);
  });
}
function nextQuestion(){
  if(!state.quizOn) return;
  if(state.quizIndex < DATA.quiz.length - 1){
    state.quizIndex++;
    renderQuestion();
  }else{
    // end
    $("qText").textContent = `Done! You got ${state.quizCorrect}/${DATA.quiz.length}.`;
    $("qChoices").innerHTML = "";
    $("qExplain").textContent = "Review modules where you missed questions, then try again.";
    state.quizOn = false;
  }
}

function buildOfflineKnowledgeText(){
  // For offline answering: combine lessons into searchable text
  let text = "";
  for(const sk of DATA.checklist){
    text += `\n# ${sk.title}\n${sk.why}\n`;
    for(const l of sk.lessons){
      // lessonBody is HTML; strip rough tags by using temp element
      const tmp = document.createElement("div");
      tmp.innerHTML = l.content;
      text += `\n## ${l.title}\n${tmp.innerText}\n`;
    }
  }
  return text;
}

function offlineAnswer(question){
  const q = question.trim().toLowerCase();
  if(!q) return "Type a question first.";

  const knowledge = buildOfflineKnowledgeText();
  // Simple keyword scoring: pick best matching skill section
  let best = { score: 0, chunk: "" };

  for(const sk of DATA.checklist){
    const tmp = document.createElement("div");
    tmp.innerHTML = sk.lessons.map(l=>l.content).join("\n");
    const skText = (sk.title + "\n" + sk.why + "\n" + tmp.innerText).toLowerCase();

    const words = q.split(/\s+/).filter(w=>w.length>=4);
    let score = 0;
    for(const w of words){
      if(skText.includes(w)) score += 1;
    }
    if(score > best.score){
      best = { score, chunk: skText };
    }
  }

  // Provide a helpful template-based response
  const tips = [
    "If you share the exact alert/email snippet/log lines, I can help you structure the analysis.",
    "Use this structure: Summary → Evidence → Likely cause → Next steps.",
    "Capture IOCs early (domains, IPs, hashes, sender) and keep a short timeline."
  ];

  const hint =
    best.score >= 2
      ? "I found relevant notes in your modules. Here’s a focused answer:"
      : "I couldn’t find a strong match offline, but here’s a safe general answer:";

  // Short “answer” assembled from matched topic
  const answer = [
    hint,
    "",
    `Question: ${question.trim()}`,
    "",
    "Suggested approach:",
    "• Write a 1-line summary (what happened).",
    "• List 3 evidence points (logs/headers/network).",
    "• Decide next step (contain / escalate / close) and why.",
    "",
    "Extra tips:",
    ...tips.map(t=>"• "+t)
  ].join("\n");

  return answer;
}

async function onlineAnswer(question){
  // Your server endpoint should accept {question, context} and return {answer}
  const context = buildOfflineKnowledgeText().slice(0, 8000); // keep small
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ question, context })
  });
  if(!res.ok) throw new Error("Online endpoint error");
  const data = await res.json();
  return data.answer || "No answer returned.";
}

function bindAsk(){
  $("askBtn").addEventListener("click", async ()=>{
    const q = $("askInput").value;
    const wantOnline = $("useOnline").checked && navigator.onLine;

    $("answerBox").textContent = "Thinking…";

    try{
      if(wantOnline){
        const ans = await onlineAnswer(q);
        $("answerBox").textContent = ans;
      }else{
        $("answerBox").textContent = offlineAnswer(q);
      }
    }catch(e){
      $("answerBox").textContent =
        offlineAnswer(q) + "\n\n(Online mode failed — using offline answer.)";
    }
  });
}

function bindNav(){
  document.querySelectorAll(".navBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      showView(btn.dataset.view);
      if(btn.dataset.view === "modules") renderModules();
      if(btn.dataset.view === "flashcards") renderFlashcards();
      if(btn.dataset.view === "labs") renderLabs();
      if(btn.dataset.view === "dashboard") updateDashboard();
    });
  });
}

function bindInstall(){
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    $("installBtn").hidden = false;
  });

  $("installBtn").addEventListener("click", async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $("installBtn").hidden = true;
  });
}

function bindReset(){
  $("resetBtn").addEventListener("click", ()=>{
    if(!confirm("Reset progress (lessons, labs, quiz stats)?")) return;
    localStorage.removeItem(LS.progress);
    localStorage.removeItem(LS.quiz);
    updateDashboard();
    renderModules();
    quizResetUI();
    alert("Progress reset.");
  });
}

function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
}

function main(){
  // Network pill
  setNetPill();
  window.addEventListener("online", setNetPill);
  window.addEventListener("offline", setNetPill);

  // Bind
  bindNav();
  bindLessonControls();
  bindAsk();
  bindInstall();
  bindReset();

  // Search
  $("search").addEventListener("input", renderModules);

  // Quiz buttons
  $("startQuiz").addEventListener("click", startQuiz);
  $("nextQ").addEventListener("click", nextQuestion);
  $("quitQuiz").addEventListener("click", ()=>{
    state.quizOn = false;
    quizResetUI();
  });

  // Dashboard open
  updateDashboard();

  // Default module
  renderModules();

  // SW
  registerSW();
}

main();
