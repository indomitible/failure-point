<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gymcels app.js code</title>
<style>
body{margin:0;background:#0b0d10;color:#e8eaed;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
header{position:sticky;top:0;background:#11151a;border-bottom:1px solid #2a3038;padding:12px 16px;font-family:Arial,sans-serif}
h1{font-size:16px;margin:0 0 4px}
p{font-size:12px;color:#aab2bd;margin:0}
pre{white-space:pre-wrap;word-break:break-word;padding:16px;margin:0;font-size:12px;line-height:1.45}
</style>
</head>
<body>
<header>
<h1>Gymcels app.js code</h1>
<p>Copy the code below into the real <strong>app.js</strong> file in GitHub.</p>
</header>
<pre>window.fpVerificationCallback = (() =&gt; {
  const rawHash = window.location.hash.startsWith(&#x27;#&#x27;) ? window.location.hash.slice(1) : &#x27;&#x27;;
  const params = new URLSearchParams(rawHash);
  return {
    isSignup: params.get(&#x27;type&#x27;) === &#x27;signup&#x27;,
    hasError: !!params.get(&#x27;error&#x27;),
    errorDescription: params.get(&#x27;error_description&#x27;) || &#x27;&#x27;
  };
})();
(() =&gt; {
  const SUPABASE_URL = &#x27;https://endazjmlwqcfvniyxpos.supabase.co&#x27;;
  const SUPABASE_PUBLISHABLE_KEY = &#x27;sb_publishable_CDLjF7ILDgZFvrNqN1LZig_cxJdT9Y7&#x27;;
  const { createClient } = window.supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  window.gymcelsLolDb = db;

  const verificationSuccess = document.getElementById(&#x27;verificationSuccess&#x27;);
  const verificationCallback = window.fpVerificationCallback || {};

  async function handleVerificationCallback() {
    if (!verificationCallback.isSignup || verificationCallback.hasError) return;

    // Give Supabase a moment to finish reading the confirmation tokens from the URL.
    await new Promise(resolve =&gt; setTimeout(resolve, 350));
    const { data: { session } } = await db.auth.getSession();

    if (verificationSuccess) {
      verificationSuccess.classList.add(&#x27;show&#x27;);
      verificationSuccess.scrollIntoView({ behavior: &#x27;smooth&#x27;, block: &#x27;center&#x27; });
    }

    // Only remove the sensitive auth fragment after Supabase has had a chance to consume it.
    if (session) {
      setTimeout(() =&gt; {
        history.replaceState(null, &#x27;&#x27;, window.location.pathname + window.location.search + &#x27;#members&#x27;);
      }, 900);
    }
  }


  const $ = (id) =&gt; document.getElementById(id);
  const authView = $(&#x27;authView&#x27;);
  const dashboardView = $(&#x27;dashboardView&#x27;);
  const memberEmail = $(&#x27;memberEmail&#x27;);
  const logList = $(&#x27;logList&#x27;);
  const navSignup = $(&#x27;navSignup&#x27;);
  const navChat = $(&#x27;navChat&#x27;);
  const navThreads = $(&#x27;navThreads&#x27;);
  const navFriends = $(&#x27;navFriends&#x27;);
  const navDms = $(&#x27;navDms&#x27;);
  const navVoice = $(&#x27;navVoice&#x27;);
  const navVip = $(&#x27;navVip&#x27;);
  const navLogin = $(&#x27;navLogin&#x27;);
  const navEditProfile = $(&#x27;navEditProfile&#x27;);
  const navWorkouts = $(&#x27;navWorkouts&#x27;);
  const navNutrition = $(&#x27;navNutrition&#x27;);
  const navLogout = $(&#x27;navLogout&#x27;);
  const beatLast = $(&#x27;beatLast&#x27;);

  const vipStatusPill = $(&#x27;vipStatusPill&#x27;);
  const vipUnlocked = $(&#x27;vipUnlocked&#x27;);
  const vipLocked = $(&#x27;vipLocked&#x27;);
  const vipRefreshBtn = $(&#x27;vipRefreshBtn&#x27;);
  const vipCheckMessage = $(&#x27;vipCheckMessage&#x27;);
  const profileVipBadge = $(&#x27;profileVipBadge&#x27;);


  function msg(el, text, type=&#x27;&#x27;) {
    el.textContent = text || &#x27;&#x27;;
    el.className = &#x27;member-message&#x27; + (type ? &#x27; &#x27; + type : &#x27;&#x27;);
  }
  function today() { return new Date().toISOString().slice(0,10); }
  $(&#x27;dateInput&#x27;).value = today();


  function setVipUi(isVip, message=&#x27;&#x27;) {
    if (vipStatusPill) {
      vipStatusPill.textContent = isVip ? &#x27;★ VIP ACTIVE&#x27; : &#x27;VIP LOCKED&#x27;;
      vipStatusPill.classList.toggle(&#x27;active&#x27;, !!isVip);
    }
    if (vipUnlocked) vipUnlocked.classList.toggle(&#x27;hidden&#x27;, !isVip);
    if (vipLocked) vipLocked.classList.toggle(&#x27;hidden&#x27;, !!isVip);
    if (profileVipBadge) profileVipBadge.classList.toggle(&#x27;hidden&#x27;, !isVip);
    if (navVip) {
      navVip.textContent = isVip ? &#x27;VIP ✓&#x27; : &#x27;VIP&#x27;;
      navVip.setAttribute(&#x27;href&#x27;, &#x27;#vipSection&#x27;);
      navVip.removeAttribute(&#x27;target&#x27;);
      navVip.removeAttribute(&#x27;rel&#x27;);
    }
    if (vipCheckMessage) vipCheckMessage.textContent = message || &#x27;&#x27;;
  }

  async function refreshVipStatus(showMessage=false) {
    const { data: { session } } = await db.auth.getSession();

    if (!session?.user) {
      setVipUi(false, &#x27;Log in to connect VIP to your Gymcels.lol account.&#x27;);
      if (navVip) {
        navVip.textContent = &#x27;VIP&#x27;;
        navVip.setAttribute(&#x27;href&#x27;, &#x27;#vipSection&#x27;);
        navVip.removeAttribute(&#x27;target&#x27;);
        navVip.removeAttribute(&#x27;rel&#x27;);
      }
      return false;
    }

    if (vipStatusPill) vipStatusPill.textContent = &#x27;Checking VIP status…&#x27;;
    if (vipCheckMessage &amp;&amp; showMessage) vipCheckMessage.textContent = &#x27;Checking your Payhip purchase…&#x27;;

    const { data, error } = await db.rpc(&#x27;my_vip_status&#x27;);

    if (error) {
      setVipUi(false, &#x27;VIP check is not connected yet.&#x27;);
      if (vipCheckMessage) vipCheckMessage.textContent = &#x27;VIP check error: &#x27; + error.message;
      return false;
    }

    const isVip = data === true;

    setVipUi(
      isVip,
      isVip
        ? &#x27;Your $5 Payhip purchase has been verified.&#x27;
        : (showMessage ? &#x27;No verified VIP purchase found for &#x27; + (session.user.email || &#x27;this account&#x27;) + &#x27; yet.&#x27; : &#x27;&#x27;)
    );

    return isVip;
  }

  if (vipRefreshBtn) {
    vipRefreshBtn.addEventListener(&#x27;click&#x27;, async () =&gt; {
      vipRefreshBtn.disabled = true;
      vipRefreshBtn.textContent = &#x27;Checking…&#x27;;
      await refreshVipStatus(true);
      vipRefreshBtn.disabled = false;
      vipRefreshBtn.textContent = &#x27;Refresh VIP Status&#x27;;
    });
  }

  async function refreshSession() {
    const { data: { session } } = await db.auth.getSession();
    if (session?.user) {
      authView.classList.add(&#x27;hidden&#x27;);
      dashboardView.classList.remove(&#x27;hidden&#x27;);
      memberEmail.textContent = session.user.email || &#x27;&#x27;;
      navSignup.classList.add(&#x27;hidden&#x27;);
      navLogin.classList.add(&#x27;hidden&#x27;);
      if (navEditProfile) navEditProfile.classList.remove(&#x27;hidden&#x27;);
      navWorkouts.classList.remove(&#x27;hidden&#x27;);
      if (navNutrition) navNutrition.classList.remove(&#x27;hidden&#x27;);
      navLogout.classList.remove(&#x27;hidden&#x27;);
      if (navChat) navChat.setAttribute(&#x27;href&#x27;, &#x27;#communityChat&#x27;);
      if (navThreads) navThreads.setAttribute(&#x27;href&#x27;, &#x27;#threadsSection&#x27;);
      if (navThreads) navThreads.setAttribute(&#x27;href&#x27;, &#x27;#threadsSection&#x27;);
      if (navFriends) navFriends.setAttribute(&#x27;href&#x27;, &#x27;#friendsSection&#x27;);
      if (navDms) navDms.setAttribute(&#x27;href&#x27;, &#x27;#dmSection&#x27;);
      if (navVoice) navVoice.setAttribute(&#x27;href&#x27;, &#x27;#voiceSection&#x27;);
      await loadLogs();
      await refreshVipStatus();
    } else {
      dashboardView.classList.add(&#x27;hidden&#x27;);
      authView.classList.remove(&#x27;hidden&#x27;);
      navSignup.classList.remove(&#x27;hidden&#x27;);
      navLogin.classList.remove(&#x27;hidden&#x27;);
      if (navEditProfile) navEditProfile.classList.add(&#x27;hidden&#x27;);
      navWorkouts.classList.add(&#x27;hidden&#x27;);
      if (navNutrition) navNutrition.classList.add(&#x27;hidden&#x27;);
      navLogout.classList.add(&#x27;hidden&#x27;);
      if (navChat) navChat.setAttribute(&#x27;href&#x27;, &#x27;#communityChat&#x27;);
      if (navFriends) navFriends.setAttribute(&#x27;href&#x27;, &#x27;#login-card&#x27;);
      if (navDms) navDms.setAttribute(&#x27;href&#x27;, &#x27;#login-card&#x27;);
      if (navVoice) navVoice.setAttribute(&#x27;href&#x27;, &#x27;#voiceSection&#x27;);
      await refreshVipStatus();
    }
  }

  $(&#x27;signupBtn&#x27;).addEventListener(&#x27;click&#x27;, async () =&gt; {
    const email = $(&#x27;signupEmail&#x27;).value.trim();
    const password = $(&#x27;signupPassword&#x27;).value;
    msg($(&#x27;signupMsg&#x27;),&#x27;&#x27;);
    if (!email || password.length &lt; 6) return msg($(&#x27;signupMsg&#x27;),&#x27;Enter a valid email and a password with at least 6 characters.&#x27;,&#x27;error&#x27;);
    const { data, error } = await db.auth.signUp({
      email, password,
      options: { emailRedirectTo: &#x27;https://gymcels.lol/&#x27; }
    });
    if (error) return msg($(&#x27;signupMsg&#x27;), error.message, &#x27;error&#x27;);
    if (data.session) { msg($(&#x27;signupMsg&#x27;),&#x27;Account created. You are signed in.&#x27;,&#x27;success&#x27;); await refreshSession(); }
    else msg($(&#x27;signupMsg&#x27;),&#x27;Verification email sent! Check your inbox (and spam/junk folder), open the email from Gymcels.lol, and click the verification link. After verifying, come back here and log in.&#x27;,&#x27;success&#x27;);
  });

  $(&#x27;loginBtn&#x27;).addEventListener(&#x27;click&#x27;, async () =&gt; {
    const email = $(&#x27;loginEmail&#x27;).value.trim();
    const password = $(&#x27;loginPassword&#x27;).value;
    msg($(&#x27;loginMsg&#x27;),&#x27;&#x27;);
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) return msg($(&#x27;loginMsg&#x27;), error.message, &#x27;error&#x27;);
    msg($(&#x27;loginMsg&#x27;),&#x27;Logged in.&#x27;,&#x27;success&#x27;);
    await refreshSession();
  });

  async function logout() { await db.auth.signOut(); await refreshSession(); }
  $(&#x27;logoutBtn&#x27;).addEventListener(&#x27;click&#x27;, logout);
  navLogout.addEventListener(&#x27;click&#x27;, logout);

  function normalizeExercise(name) { return (name || &#x27;&#x27;).trim().toLowerCase(); }

  async function updateBeatLast() {
    const exercise = $(&#x27;exerciseInput&#x27;).value.trim();
    if (!exercise) {
      beatLast.querySelector(&#x27;.beat-last-main&#x27;).textContent=&#x27;Enter an exercise to see your last performance.&#x27;;
      beatLast.querySelector(&#x27;.beat-last-sub&#x27;).textContent=&#x27;Your previous set will appear here automatically.&#x27;;
      return;
    }
    const { data, error } = await db.from(&#x27;workout_logs&#x27;).select(&#x27;*&#x27;).order(&#x27;workout_date&#x27;,{ascending:false}).order(&#x27;created_at&#x27;,{ascending:false});
    if (error) return;
    const editId = $(&#x27;editId&#x27;).value;
    const previous = (data || []).find(r =&gt; String(r.id) !== String(editId) &amp;&amp; normalizeExercise(r.exercise) === normalizeExercise(exercise));
    if (!previous) {
      beatLast.querySelector(&#x27;.beat-last-main&#x27;).textContent=&#x27;No previous set yet — set the standard.&#x27;;
      beatLast.querySelector(&#x27;.beat-last-sub&#x27;).textContent=&#x27;Save this set and Gymcels.lol will give you a target next time.&#x27;;
      return;
    }
    const performance=[previous.weight != null ? `${previous.weight} lb` : &#x27;&#x27;, previous.reps != null ? `${previous.reps} reps` : &#x27;&#x27;].filter(Boolean).join(&#x27; × &#x27;);
    beatLast.querySelector(&#x27;.beat-last-main&#x27;).textContent=`Last: ${performance || &#x27;logged set&#x27;}`;
    let target=&#x27;Beat it with more weight or more reps while keeping good form.&#x27;;
    if (previous.reps != null &amp;&amp; previous.weight != null) {
      target = previous.reps &gt;= 12 ? `Target: increase the weight and stay in the 8–12 rep range.` : `Target: ${previous.weight} lb × ${previous.reps + 1} reps or better.`;
    } else if (previous.reps != null) target=`Target: ${previous.reps + 1} reps or better.`;
    beatLast.querySelector(&#x27;.beat-last-sub&#x27;).textContent=`${previous.workout_date || &#x27;Previous workout&#x27;} · ${target}`;
  }

  let beatTimer;
  $(&#x27;exerciseInput&#x27;).addEventListener(&#x27;input&#x27;,()=&gt;{ clearTimeout(beatTimer); beatTimer=setTimeout(updateBeatLast,250); });
  $(&#x27;exerciseInput&#x27;).addEventListener(&#x27;change&#x27;,updateBeatLast);

  function clearForm() {
    $(&#x27;editId&#x27;).value=&#x27;&#x27;; $(&#x27;exerciseInput&#x27;).value=&#x27;&#x27;; $(&#x27;weightInput&#x27;).value=&#x27;&#x27;; $(&#x27;repsInput&#x27;).value=&#x27;&#x27;; $(&#x27;setInput&#x27;).value=&#x27;&#x27;; $(&#x27;dateInput&#x27;).value=today(); $(&#x27;notesInput&#x27;).value=&#x27;&#x27;;
    $(&#x27;formTitle&#x27;).textContent=&#x27;Log a set&#x27;; $(&#x27;saveLogBtn&#x27;).textContent=&#x27;Save log →&#x27;; $(&#x27;cancelEditBtn&#x27;).classList.add(&#x27;hidden&#x27;); msg($(&#x27;logMsg&#x27;),&#x27;&#x27;);
    updateBeatLast();
  }
  $(&#x27;cancelEditBtn&#x27;).addEventListener(&#x27;click&#x27;, clearForm);

  $(&#x27;saveLogBtn&#x27;).addEventListener(&#x27;click&#x27;, async () =&gt; {
    msg($(&#x27;logMsg&#x27;),&#x27;&#x27;);
    const { data: { user } } = await db.auth.getUser();
    if (!user) return msg($(&#x27;logMsg&#x27;),&#x27;Please log in first.&#x27;,&#x27;error&#x27;);
    const exercise = $(&#x27;exerciseInput&#x27;).value.trim();
    const workout_date = $(&#x27;dateInput&#x27;).value || today();
    if (!exercise) return msg($(&#x27;logMsg&#x27;),&#x27;Enter an exercise name.&#x27;,&#x27;error&#x27;);
    const payload = {
      user_id: user.id, exercise,
      weight: $(&#x27;weightInput&#x27;).value === &#x27;&#x27; ? null : Number($(&#x27;weightInput&#x27;).value),
      reps: $(&#x27;repsInput&#x27;).value === &#x27;&#x27; ? null : Number($(&#x27;repsInput&#x27;).value),
      set_number: $(&#x27;setInput&#x27;).value === &#x27;&#x27; ? null : Number($(&#x27;setInput&#x27;).value),
      workout_date, notes: $(&#x27;notesInput&#x27;).value.trim() || null
    };
    const editId = $(&#x27;editId&#x27;).value;
    let error;
    if (editId) ({ error } = await db.from(&#x27;workout_logs&#x27;).update(payload).eq(&#x27;id&#x27;, editId));
    else ({ error } = await db.from(&#x27;workout_logs&#x27;).insert(payload));
    if (error) return msg($(&#x27;logMsg&#x27;), error.message, &#x27;error&#x27;);
    msg($(&#x27;logMsg&#x27;), editId ? &#x27;Workout updated.&#x27; : &#x27;Workout saved.&#x27;, &#x27;success&#x27;);
    await loadLogs();
    window.dispatchEvent(new Event(&#x27;gymcelsWorkoutChanged&#x27;));
    setTimeout(clearForm, 600);
  });

  async function loadLogs() {
    const { data, error } = await db.from(&#x27;workout_logs&#x27;).select(&#x27;*&#x27;).order(&#x27;workout_date&#x27;,{ascending:false}).order(&#x27;created_at&#x27;,{ascending:false});
    if (error) { logList.innerHTML=&#x27;&lt;div class=&quot;empty-state&quot;&gt;&lt;/div&gt;&#x27;; logList.firstChild.textContent=error.message; return; }
    if (!data?.length) { logList.innerHTML=&#x27;&lt;div class=&quot;empty-state&quot;&gt;No workout logs yet.&lt;/div&gt;&#x27;; return; }
    logList.innerHTML=&#x27;&#x27;;
    for (const row of data) {
      const item=document.createElement(&#x27;div&#x27;); item.className=&#x27;log-row&#x27;;
      const main=document.createElement(&#x27;div&#x27;); main.className=&#x27;log-main&#x27;;
      const title=document.createElement(&#x27;strong&#x27;); title.textContent=row.exercise || &#x27;Workout&#x27;;
      const meta=document.createElement(&#x27;div&#x27;); meta.className=&#x27;log-meta&#x27;;
      const parts=[row.workout_date || &#x27;&#x27;, row.set_number != null ? `Set ${row.set_number}` : &#x27;&#x27;, row.weight != null ? `${row.weight} lb` : &#x27;&#x27;, row.reps != null ? `${row.reps} reps` : &#x27;&#x27;].filter(Boolean);
      meta.textContent=parts.join(&#x27; · &#x27;) + (row.notes ? ` — ${row.notes}` : &#x27;&#x27;);
      main.append(title,meta);
      const actions=document.createElement(&#x27;div&#x27;); actions.className=&#x27;log-actions&#x27;;
      const edit=document.createElement(&#x27;button&#x27;); edit.className=&#x27;mini-btn&#x27;; edit.textContent=&#x27;Edit&#x27;;
      edit.addEventListener(&#x27;click&#x27;,()=&gt;{
        $(&#x27;editId&#x27;).value=row.id; $(&#x27;exerciseInput&#x27;).value=row.exercise || &#x27;&#x27;; $(&#x27;weightInput&#x27;).value=row.weight ?? &#x27;&#x27;; $(&#x27;repsInput&#x27;).value=row.reps ?? &#x27;&#x27;; $(&#x27;setInput&#x27;).value=row.set_number ?? &#x27;&#x27;; $(&#x27;dateInput&#x27;).value=row.workout_date || today(); $(&#x27;notesInput&#x27;).value=row.notes || &#x27;&#x27;;
        $(&#x27;formTitle&#x27;).textContent=&#x27;Edit log&#x27;; $(&#x27;saveLogBtn&#x27;).textContent=&#x27;Update log →&#x27;; $(&#x27;cancelEditBtn&#x27;).classList.remove(&#x27;hidden&#x27;); updateBeatLast(); document.querySelector(&#x27;#members&#x27;).scrollIntoView({behavior:&#x27;smooth&#x27;});
      });
      const del=document.createElement(&#x27;button&#x27;); del.className=&#x27;mini-btn danger&#x27;; del.textContent=&#x27;Delete&#x27;;
      del.addEventListener(&#x27;click&#x27;,async()=&gt;{
        if(!confirm(&#x27;Delete this workout log?&#x27;)) return;
        const { error }=await db.from(&#x27;workout_logs&#x27;).delete().eq(&#x27;id&#x27;,row.id);
        if(error) return msg($(&#x27;logMsg&#x27;),error.message,&#x27;error&#x27;); await loadLogs(); window.dispatchEvent(new Event(&#x27;gymcelsWorkoutChanged&#x27;));
      });
      actions.append(edit,del); item.append(main,actions); logList.appendChild(item);
    }
  }

  db.auth.onAuthStateChange(() =&gt; refreshSession());
  refreshSession();
  handleVerificationCallback();
})();



// ---- Gymcels Nutrition: private per-account macro tracker ----
const nutritionDb = window.gymcelsLolDb;
const nutritionSection = document.getElementById(&#x27;nutritionSection&#x27;);
const nutritionDate = document.getElementById(&#x27;nutritionDate&#x27;);
const nutritionDateLabel = document.getElementById(&#x27;nutritionDateLabel&#x27;);
const nutritionMealsDateLabel = document.getElementById(&#x27;nutritionMealsDateLabel&#x27;);
const nutritionPrevDay = document.getElementById(&#x27;nutritionPrevDay&#x27;);
const nutritionNextDay = document.getElementById(&#x27;nutritionNextDay&#x27;);
const nutritionTodayBtn = document.getElementById(&#x27;nutritionTodayBtn&#x27;);

const nutritionEditTargetsBtn = document.getElementById(&#x27;nutritionEditTargetsBtn&#x27;);
const nutritionTargetsForm = document.getElementById(&#x27;nutritionTargetsForm&#x27;);
const nutritionTargetCalories = document.getElementById(&#x27;nutritionTargetCalories&#x27;);
const nutritionTargetProtein = document.getElementById(&#x27;nutritionTargetProtein&#x27;);
const nutritionTargetCarbs = document.getElementById(&#x27;nutritionTargetCarbs&#x27;);
const nutritionTargetFat = document.getElementById(&#x27;nutritionTargetFat&#x27;);
const nutritionSaveTargetsBtn = document.getElementById(&#x27;nutritionSaveTargetsBtn&#x27;);
const nutritionCancelTargetsBtn = document.getElementById(&#x27;nutritionCancelTargetsBtn&#x27;);

const nutritionCaloriesTotal = document.getElementById(&#x27;nutritionCaloriesTotal&#x27;);
const nutritionProteinTotal = document.getElementById(&#x27;nutritionProteinTotal&#x27;);
const nutritionCarbsTotal = document.getElementById(&#x27;nutritionCarbsTotal&#x27;);
const nutritionFatTotal = document.getElementById(&#x27;nutritionFatTotal&#x27;);

const nutritionCaloriesTarget = document.getElementById(&#x27;nutritionCaloriesTarget&#x27;);
const nutritionProteinTarget = document.getElementById(&#x27;nutritionProteinTarget&#x27;);
const nutritionCarbsTarget = document.getElementById(&#x27;nutritionCarbsTarget&#x27;);
const nutritionFatTarget = document.getElementById(&#x27;nutritionFatTarget&#x27;);

const nutritionCaloriesProgress = document.getElementById(&#x27;nutritionCaloriesProgress&#x27;);
const nutritionProteinProgress = document.getElementById(&#x27;nutritionProteinProgress&#x27;);
const nutritionCarbsProgress = document.getElementById(&#x27;nutritionCarbsProgress&#x27;);
const nutritionFatProgress = document.getElementById(&#x27;nutritionFatProgress&#x27;);

const nutritionCaloriesRemaining = document.getElementById(&#x27;nutritionCaloriesRemaining&#x27;);
const nutritionProteinRemaining = document.getElementById(&#x27;nutritionProteinRemaining&#x27;);
const nutritionCarbsRemaining = document.getElementById(&#x27;nutritionCarbsRemaining&#x27;);
const nutritionFatRemaining = document.getElementById(&#x27;nutritionFatRemaining&#x27;);

const nutritionMealFormTitle = document.getElementById(&#x27;nutritionMealFormTitle&#x27;);
const nutritionFoodName = document.getElementById(&#x27;nutritionFoodName&#x27;);
const nutritionMealType = document.getElementById(&#x27;nutritionMealType&#x27;);
const nutritionCalories = document.getElementById(&#x27;nutritionCalories&#x27;);
const nutritionProtein = document.getElementById(&#x27;nutritionProtein&#x27;);
const nutritionCarbs = document.getElementById(&#x27;nutritionCarbs&#x27;);
const nutritionFat = document.getElementById(&#x27;nutritionFat&#x27;);
const nutritionNotes = document.getElementById(&#x27;nutritionNotes&#x27;);
const nutritionServingCount = document.getElementById(&#x27;nutritionServingCount&#x27;);
const nutritionServingMinus = document.getElementById(&#x27;nutritionServingMinus&#x27;);
const nutritionServingPlus = document.getElementById(&#x27;nutritionServingPlus&#x27;);
const nutritionServingPreview = document.getElementById(&#x27;nutritionServingPreview&#x27;);
const nutritionSaveMealBtn = document.getElementById(&#x27;nutritionSaveMealBtn&#x27;);
const nutritionCancelEditBtn = document.getElementById(&#x27;nutritionCancelEditBtn&#x27;);
const nutritionFormStatus = document.getElementById(&#x27;nutritionFormStatus&#x27;);
const nutritionMealsList = document.getElementById(&#x27;nutritionMealsList&#x27;);
const nutritionMealCount = document.getElementById(&#x27;nutritionMealCount&#x27;);
const nutritionFavoritesList = document.getElementById(&#x27;nutritionFavoritesList&#x27;);
const nutritionFavoriteCount = document.getElementById(&#x27;nutritionFavoriteCount&#x27;);

const bodyweightDate = document.getElementById(&#x27;bodyweightDate&#x27;);
const bodyweightInput = document.getElementById(&#x27;bodyweightInput&#x27;);
const bodyweightInputLabel = document.getElementById(&#x27;bodyweightInputLabel&#x27;);
const bodyweightUnitLb = document.getElementById(&#x27;bodyweightUnitLb&#x27;);
const bodyweightUnitKg = document.getElementById(&#x27;bodyweightUnitKg&#x27;);
const bodyweightChartUnit = document.getElementById(&#x27;bodyweightChartUnit&#x27;);
const bodyweightSaveBtn = document.getElementById(&#x27;bodyweightSaveBtn&#x27;);
const bodyweightStatus = document.getElementById(&#x27;bodyweightStatus&#x27;);
const bodyweightLatest = document.getElementById(&#x27;bodyweightLatest&#x27;);
const bodyweightAverage = document.getElementById(&#x27;bodyweightAverage&#x27;);
const bodyweightTrend = document.getElementById(&#x27;bodyweightTrend&#x27;);
const bodyweightEntryCount = document.getElementById(&#x27;bodyweightEntryCount&#x27;);
const bodyweightChart = document.getElementById(&#x27;bodyweightChart&#x27;);
const bodyweightHistory = document.getElementById(&#x27;bodyweightHistory&#x27;);

const nutritionMealSearchInput = document.getElementById(&#x27;nutritionMealSearchInput&#x27;);
const nutritionMealSearchBtn = document.getElementById(&#x27;nutritionMealSearchBtn&#x27;);
const nutritionMealSearchResults = document.getElementById(&#x27;nutritionMealSearchResults&#x27;);

const nutritionBarcodeBtn = document.getElementById(&#x27;nutritionBarcodeBtn&#x27;);
const nutritionScannerOverlay = document.getElementById(&#x27;nutritionScannerOverlay&#x27;);
const nutritionScannerClose = document.getElementById(&#x27;nutritionScannerClose&#x27;);
const nutritionBarcodeInput = document.getElementById(&#x27;nutritionBarcodeInput&#x27;);
const nutritionBarcodeLookupBtn = document.getElementById(&#x27;nutritionBarcodeLookupBtn&#x27;);
const nutritionScannerStatus = document.getElementById(&#x27;nutritionScannerStatus&#x27;);
const nutritionCameraLabel = document.getElementById(&#x27;nutritionCameraLabel&#x27;);
const nutritionScanServingCount = document.getElementById(&#x27;nutritionScanServingCount&#x27;);
const nutritionScanServingMinus = document.getElementById(&#x27;nutritionScanServingMinus&#x27;);
const nutritionScanServingPlus = document.getElementById(&#x27;nutritionScanServingPlus&#x27;);

let nutritionSavedSearchRows = [];
let nutritionSearchTimer = null;
let nutritionScanner = null;
let nutritionScanHandled = false;


let nutritionSession = null;
let nutritionTargets = {
  calorie_target:0,
  protein_target:0,
  carbs_target:0,
  fat_target:0
};
let nutritionRows = [];
let nutritionFavorites = [];
let bodyweightRows = [];

let bodyweightUnit = (() =&gt; {
  try{
    return localStorage.getItem(&#x27;gymcels_bodyweight_unit&#x27;) === &#x27;kg&#x27; ? &#x27;kg&#x27; : &#x27;lb&#x27;;
  }catch(_){
    return &#x27;lb&#x27;;
  }
})();

let nutritionMealEditId = null;

function nutritionLocalDateString(date=new Date()){
  const year = date.getFullYear();
  const month = String(date.getMonth()+1).padStart(2,&#x27;0&#x27;);
  const day = String(date.getDate()).padStart(2,&#x27;0&#x27;);
  return `${year}-${month}-${day}`;
}

function nutritionDateFromIso(iso){
  const parts = String(iso || &#x27;&#x27;).split(&#x27;-&#x27;).map(Number);
  if(parts.length !== 3 || parts.some(x =&gt; !Number.isFinite(x))) return new Date();
  return new Date(parts[0],parts[1]-1,parts[2],12,0,0);
}

function nutritionShiftDate(iso,days){
  const d = nutritionDateFromIso(iso);
  d.setDate(d.getDate()+days);
  return nutritionLocalDateString(d);
}

function nutritionNumber(value){
  const n = Number(value);
  return Number.isFinite(n) &amp;&amp; n &gt;= 0 ? n : 0;
}

function nutritionServingValue(input){
  let value = Number(input?.value ?? input ?? 1);
  if(!Number.isFinite(value)) value = 1;
  value = Math.max(0.5,Math.min(20,Math.round(value * 2) / 2));
  return value;
}

function setNutritionServingInput(input,value){
  if(!input) return 1;
  const safe = nutritionServingValue(value);
  input.value = String(safe);
  return safe;
}

function nutritionServingText(value){
  const n = nutritionServingValue(value);
  return `${nutritionFormat(n)} serving${n === 1 ? &#x27;&#x27; : &#x27;s&#x27;}`;
}

function updateNutritionServingPreview(){
  if(!nutritionServingPreview) return;

  const servings = nutritionServingValue(nutritionServingCount);
  const calories = nutritionNumber(nutritionCalories?.value) * servings;
  const protein = nutritionNumber(nutritionProtein?.value) * servings;
  const carbs = nutritionNumber(nutritionCarbs?.value) * servings;
  const fat = nutritionNumber(nutritionFat?.value) * servings;

  const hasMacros = calories || protein || carbs || fat;

  nutritionServingPreview.textContent = hasMacros
    ? `${nutritionServingText(servings)} = ${nutritionFormat(calories,0)} cal · ${nutritionFormat(protein)}g P · ${nutritionFormat(carbs)}g C · ${nutritionFormat(fat)}g F`
    : nutritionServingText(servings);
}

function updateScanServingButtons(){
  const value = nutritionServingValue(nutritionScanServingCount);

  document.querySelectorAll(&#x27;[data-scan-servings]&#x27;).forEach(btn =&gt; {
    btn.classList.toggle(
      &#x27;active&#x27;,
      Number(btn.dataset.scanServings) === value
    );
  });
}

function nutritionFormat(value,maxDecimals=1){
  const n = nutritionNumber(value);
  if(Math.abs(n-Math.round(n)) &lt; 0.00001) return String(Math.round(n));
  return n.toFixed(maxDecimals).replace(/\.0$/,&#x27;&#x27;);
}

function nutritionEscape(value){
  return String(value ?? &#x27;&#x27;)
    .replaceAll(&#x27;&amp;&#x27;,&#x27;&amp;amp;&#x27;)
    .replaceAll(&#x27;&lt;&#x27;,&#x27;&amp;lt;&#x27;)
    .replaceAll(&#x27;&gt;&#x27;,&#x27;&amp;gt;&#x27;)
    .replaceAll(&#x27;&quot;&#x27;,&#x27;&amp;quot;&#x27;)
    .replaceAll(&quot;&#x27;&quot;,&#x27;&amp;#039;&#x27;);
}

function setNutritionStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
  if(!nutritionFormStatus) return;
  nutritionFormStatus.textContent = text;
  nutritionFormStatus.className = `nutrition-status ${type || &#x27;&#x27;}`;
}

function updateNutritionDateLabels(){
  if(!nutritionDate) return;

  const selected = nutritionDate.value;
  const today = nutritionLocalDateString();
  const selectedDate = nutritionDateFromIso(selected);

  const pretty = selectedDate.toLocaleDateString([],{
    weekday:&#x27;short&#x27;,month:&#x27;short&#x27;,day:&#x27;numeric&#x27;,year:selectedDate.getFullYear() !== new Date().getFullYear() ? &#x27;numeric&#x27; : undefined
  });

  if(nutritionDateLabel){
    nutritionDateLabel.textContent = selected === today ? &#x27;Today&#x27; : pretty;
  }
  if(nutritionMealsDateLabel){
    nutritionMealsDateLabel.textContent = selected === today ? &#x27;today&#x27; : pretty;
  }
}

function resetNutritionMealForm(){
  nutritionMealEditId = null;
  if(nutritionMealFormTitle) nutritionMealFormTitle.textContent = &#x27;Add Meal&#x27;;
  if(nutritionFoodName) nutritionFoodName.value = &#x27;&#x27;;
  if(nutritionMealType) nutritionMealType.value = &#x27;breakfast&#x27;;
  if(nutritionCalories) nutritionCalories.value = &#x27;&#x27;;
  if(nutritionProtein) nutritionProtein.value = &#x27;&#x27;;
  if(nutritionCarbs) nutritionCarbs.value = &#x27;&#x27;;
  if(nutritionFat) nutritionFat.value = &#x27;&#x27;;
  if(nutritionNotes) nutritionNotes.value = &#x27;&#x27;;
  setNutritionServingInput(nutritionServingCount,1);
  updateNutritionServingPreview();
  if(nutritionSaveMealBtn) nutritionSaveMealBtn.textContent = &#x27;Add meal&#x27;;
  nutritionCancelEditBtn?.classList.add(&#x27;hidden&#x27;);
  setNutritionStatus(&#x27;&#x27;);
}

function renderNutritionTargets(){
  const calories = nutritionNumber(nutritionTargets.calorie_target);
  const protein = nutritionNumber(nutritionTargets.protein_target);
  const carbs = nutritionNumber(nutritionTargets.carbs_target);
  const fat = nutritionNumber(nutritionTargets.fat_target);

  if(nutritionCaloriesTarget) nutritionCaloriesTarget.textContent = calories ? nutritionFormat(calories,0) : &#x27;—&#x27;;
  if(nutritionProteinTarget) nutritionProteinTarget.textContent = protein ? nutritionFormat(protein) : &#x27;—&#x27;;
  if(nutritionCarbsTarget) nutritionCarbsTarget.textContent = carbs ? nutritionFormat(carbs) : &#x27;—&#x27;;
  if(nutritionFatTarget) nutritionFatTarget.textContent = fat ? nutritionFormat(fat) : &#x27;—&#x27;;

  if(nutritionTargetCalories) nutritionTargetCalories.value = calories || &#x27;&#x27;;
  if(nutritionTargetProtein) nutritionTargetProtein.value = protein || &#x27;&#x27;;
  if(nutritionTargetCarbs) nutritionTargetCarbs.value = carbs || &#x27;&#x27;;
  if(nutritionTargetFat) nutritionTargetFat.value = fat || &#x27;&#x27;;
}

function updateNutritionMacroCard(key,total,target,totalEl,progressEl,remainingEl){
  if(totalEl) totalEl.textContent = nutritionFormat(total,key === &#x27;calories&#x27; ? 0 : 1);

  const card = progressEl?.closest(&#x27;.nutrition-summary-card&#x27;);
  const hasTarget = target &gt; 0;
  const percent = hasTarget ? Math.min(100,(total/target)*100) : 0;
  if(progressEl) progressEl.style.width = `${Math.max(0,percent)}%`;

  card?.classList.toggle(&#x27;over&#x27;,hasTarget &amp;&amp; total &gt; target);

  if(!remainingEl) return;

  if(!hasTarget){
    remainingEl.textContent = &#x27;Set a target&#x27;;
    return;
  }

  const difference = target-total;
  if(difference &gt;= 0){
    remainingEl.textContent =
      `${nutritionFormat(difference,key === &#x27;calories&#x27; ? 0 : 1)}${key === &#x27;calories&#x27; ? &#x27;&#x27; : &#x27;g&#x27;} remaining`;
  }else{
    remainingEl.textContent =
      `${nutritionFormat(Math.abs(difference),key === &#x27;calories&#x27; ? 0 : 1)}${key === &#x27;calories&#x27; ? &#x27;&#x27; : &#x27;g&#x27;} over target`;
  }
}

function renderNutritionSummary(){
  const totals = nutritionRows.reduce((sum,row) =&gt; {
    sum.calories += nutritionNumber(row.calories);
    sum.protein += nutritionNumber(row.protein_g);
    sum.carbs += nutritionNumber(row.carbs_g);
    sum.fat += nutritionNumber(row.fat_g);
    return sum;
  },{calories:0,protein:0,carbs:0,fat:0});

  updateNutritionMacroCard(
    &#x27;calories&#x27;,
    totals.calories,
    nutritionNumber(nutritionTargets.calorie_target),
    nutritionCaloriesTotal,
    nutritionCaloriesProgress,
    nutritionCaloriesRemaining
  );
  updateNutritionMacroCard(
    &#x27;protein&#x27;,
    totals.protein,
    nutritionNumber(nutritionTargets.protein_target),
    nutritionProteinTotal,
    nutritionProteinProgress,
    nutritionProteinRemaining
  );
  updateNutritionMacroCard(
    &#x27;carbs&#x27;,
    totals.carbs,
    nutritionNumber(nutritionTargets.carbs_target),
    nutritionCarbsTotal,
    nutritionCarbsProgress,
    nutritionCarbsRemaining
  );
  updateNutritionMacroCard(
    &#x27;fat&#x27;,
    totals.fat,
    nutritionNumber(nutritionTargets.fat_target),
    nutritionFatTotal,
    nutritionFatProgress,
    nutritionFatRemaining
  );
}

const NUTRITION_MEAL_GROUPS = [
  [&#x27;breakfast&#x27;,&#x27;Breakfast&#x27;],
  [&#x27;lunch&#x27;,&#x27;Lunch&#x27;],
  [&#x27;dinner&#x27;,&#x27;Dinner&#x27;],
  [&#x27;snack&#x27;,&#x27;Snacks&#x27;]
];


function nutritionFavoriteKey(row){
  return [
    String(row?.food_name || row?.product_name || &#x27;&#x27;).trim().toLowerCase(),
    nutritionFormat(row?.calories || 0,1),
    nutritionFormat(row?.protein_g || 0,1),
    nutritionFormat(row?.carbs_g || 0,1),
    nutritionFormat(row?.fat_g || 0,1)
  ].join(&#x27;|&#x27;);
}

function isNutritionFavorite(row){
  const key = nutritionFavoriteKey(row);
  return nutritionFavorites.some(fav =&gt; nutritionFavoriteKey(fav) === key);
}

function renderNutritionFavorites(){
  if(!nutritionFavoritesList) return;

  if(nutritionFavoriteCount){
    nutritionFavoriteCount.textContent =
      `${nutritionFavorites.length} saved`;
  }

  if(!nutritionFavorites.length){
    nutritionFavoritesList.innerHTML =
      &#x27;&lt;div class=&quot;nutrition-empty&quot;&gt;Tap ☆ Favorite on a logged meal to save it here.&lt;/div&gt;&#x27;;
    return;
  }

  nutritionFavoritesList.innerHTML = nutritionFavorites.map(fav =&gt; `
    &lt;div class=&quot;nutrition-favorite-item&quot; data-favorite-id=&quot;${Number(fav.id)}&quot;&gt;
      &lt;div&gt;
        &lt;div class=&quot;nutrition-favorite-name&quot;&gt;${nutritionEscape(fav.food_name || &#x27;Favorite food&#x27;)}&lt;/div&gt;
        &lt;div class=&quot;nutrition-favorite-meta&quot;&gt;
          &lt;span&gt;${nutritionFormat(fav.calories,0)} cal&lt;/span&gt;
          &lt;span&gt;${nutritionFormat(fav.protein_g)}g P&lt;/span&gt;
          &lt;span&gt;${nutritionFormat(fav.carbs_g)}g C&lt;/span&gt;
          &lt;span&gt;${nutritionFormat(fav.fat_g)}g F&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div class=&quot;nutrition-favorite-actions&quot;&gt;
        &lt;button type=&quot;button&quot; data-favorite-log=&quot;${Number(fav.id)}&quot;&gt;Log&lt;/button&gt;
        &lt;button type=&quot;button&quot; data-favorite-use=&quot;${Number(fav.id)}&quot;&gt;Use&lt;/button&gt;
        &lt;button type=&quot;button&quot; data-favorite-delete=&quot;${Number(fav.id)}&quot;&gt;Remove&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `).join(&#x27;&#x27;);
}

async function loadNutritionFavorites(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const {data,error} = await nutritionDb
    .from(&#x27;favorite_foods&#x27;)
    .select(&#x27;id,user_id,food_name,meal_type,calories,protein_g,carbs_g,fat_g,notes,created_at&#x27;)
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id)
    .order(&#x27;created_at&#x27;,{ascending:false});

  if(error){
    console.error(&#x27;Favorite foods load error:&#x27;,error);
    return;
  }

  nutritionFavorites = data || [];
  renderNutritionFavorites();
}

async function saveNutritionFavoriteFromMeal(row){
  if(!nutritionDb || !nutritionSession?.user || !row) return;

  const existing = nutritionFavorites.find(
    fav =&gt; nutritionFavoriteKey(fav) === nutritionFavoriteKey(row)
  );

  if(existing){
    setNutritionStatus(&#x27;That food is already in your favorites.&#x27;,&#x27;success&#x27;);
    return;
  }

  const {error} = await nutritionDb
    .from(&#x27;favorite_foods&#x27;)
    .insert({
      user_id:nutritionSession.user.id,
      food_name:String(row.food_name || &#x27;Favorite food&#x27;).slice(0,120),
      meal_type:row.meal_type || &#x27;snack&#x27;,
      calories:nutritionNumber(row.calories),
      protein_g:nutritionNumber(row.protein_g),
      carbs_g:nutritionNumber(row.carbs_g),
      fat_g:nutritionNumber(row.fat_g),
      notes:String(row.notes || &#x27;&#x27;).slice(0,160) || null,
      updated_at:new Date().toISOString()
    });

  if(error){
    setNutritionStatus(error.message,&#x27;error&#x27;);
    return;
  }

  await loadNutritionFavorites();
  renderNutritionMeals();
  setNutritionStatus(&#x27;★ Added to Favorite Foods.&#x27;,&#x27;success&#x27;);
}

async function deleteNutritionFavorite(id){
  if(!nutritionDb || !nutritionSession?.user || !id) return;

  const {error} = await nutritionDb
    .from(&#x27;favorite_foods&#x27;)
    .delete()
    .eq(&#x27;id&#x27;,Number(id))
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id);

  if(error){
    setNutritionStatus(error.message,&#x27;error&#x27;);
    return;
  }

  await loadNutritionFavorites();
  renderNutritionMeals();
}

async function logNutritionFavorite(fav){
  if(!nutritionDb || !nutritionSession?.user || !fav) return;

  const {error} = await nutritionDb
    .from(&#x27;meal_logs&#x27;)
    .insert({
      user_id:nutritionSession.user.id,
      meal_date:nutritionDate.value || nutritionLocalDateString(),
      meal_type:fav.meal_type || nutritionAutoMealType(),
      food_name:fav.food_name,
      calories:nutritionNumber(fav.calories),
      protein_g:nutritionNumber(fav.protein_g),
      carbs_g:nutritionNumber(fav.carbs_g),
      fat_g:nutritionNumber(fav.fat_g),
      notes:fav.notes || null,
      updated_at:new Date().toISOString()
    });

  if(error){
    setNutritionStatus(error.message,&#x27;error&#x27;);
    return;
  }

  await loadNutritionMeals();
  setNutritionStatus(`✓ Logged ${fav.food_name}.`,&#x27;success&#x27;);
}

function renderNutritionMeals(){
  if(!nutritionMealsList) return;

  if(nutritionMealCount){
    nutritionMealCount.textContent =
      `${nutritionRows.length} meal${nutritionRows.length === 1 ? &#x27;&#x27; : &#x27;s&#x27;} logged`;
  }

  if(!nutritionRows.length){
    nutritionMealsList.innerHTML =
      &#x27;&lt;div class=&quot;nutrition-empty&quot;&gt;No meals logged for this day yet.&lt;/div&gt;&#x27;;
    renderNutritionSummary();
    return;
  }

  nutritionMealsList.innerHTML = NUTRITION_MEAL_GROUPS.map(([key,label]) =&gt; {
    const rows = nutritionRows.filter(row =&gt; row.meal_type === key);
    if(!rows.length) return &#x27;&#x27;;

    const groupCalories = rows.reduce((sum,row) =&gt; sum + nutritionNumber(row.calories),0);

    return `&lt;div class=&quot;nutrition-meal-group&quot;&gt;
      &lt;div class=&quot;nutrition-meal-group-title&quot;&gt;
        &lt;span&gt;${label}&lt;/span&gt;
        &lt;span&gt;${nutritionFormat(groupCalories,0)} cal&lt;/span&gt;
      &lt;/div&gt;

      ${rows.map(row =&gt; `
        &lt;div class=&quot;nutrition-meal-item&quot; data-nutrition-meal-id=&quot;${Number(row.id)}&quot;&gt;
          &lt;div&gt;
            &lt;div class=&quot;nutrition-meal-name&quot;&gt;${nutritionEscape(row.food_name || &#x27;Meal&#x27;)}&lt;/div&gt;
            ${row.notes ? `&lt;div class=&quot;nutrition-meal-note&quot;&gt;${nutritionEscape(row.notes)}&lt;/div&gt;` : &#x27;&#x27;}
            &lt;div class=&quot;nutrition-meal-macros&quot;&gt;
              &lt;span&gt;${nutritionFormat(row.calories,0)} cal&lt;/span&gt;
              &lt;span&gt;${nutritionFormat(row.protein_g)}g protein&lt;/span&gt;
              &lt;span&gt;${nutritionFormat(row.carbs_g)}g carbs&lt;/span&gt;
              &lt;span&gt;${nutritionFormat(row.fat_g)}g fat&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;

          &lt;div class=&quot;nutrition-meal-actions&quot;&gt;
            &lt;button type=&quot;button&quot;
              class=&quot;${isNutritionFavorite(row) ? &#x27;nutrition-favorite-active&#x27; : &#x27;&#x27;}&quot;
              data-nutrition-favorite=&quot;${Number(row.id)}&quot;&gt;
              ${isNutritionFavorite(row) ? &#x27;★ Saved&#x27; : &#x27;☆ Favorite&#x27;}
            &lt;/button&gt;
            &lt;button type=&quot;button&quot; data-nutrition-edit=&quot;${Number(row.id)}&quot;&gt;Edit&lt;/button&gt;
            &lt;button type=&quot;button&quot; data-nutrition-delete=&quot;${Number(row.id)}&quot;&gt;Delete&lt;/button&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      `).join(&#x27;&#x27;)}
    &lt;/div&gt;`;
  }).join(&#x27;&#x27;);

  renderNutritionSummary();
}

async function loadNutritionTargets(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const {data,error} = await nutritionDb
    .from(&#x27;nutrition_targets&#x27;)
    .select(&#x27;calorie_target,protein_target,carbs_target,fat_target&#x27;)
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id)
    .maybeSingle();

  if(error){
    console.error(&#x27;Nutrition targets load error:&#x27;,error);
    return;
  }

  nutritionTargets = {
    calorie_target:nutritionNumber(data?.calorie_target),
    protein_target:nutritionNumber(data?.protein_target),
    carbs_target:nutritionNumber(data?.carbs_target),
    fat_target:nutritionNumber(data?.fat_target)
  };

  renderNutritionTargets();
}

async function loadNutritionMeals(){
  if(!nutritionDb || !nutritionSession?.user || !nutritionDate?.value) return;

  updateNutritionDateLabels();

  const {data,error} = await nutritionDb
    .from(&#x27;meal_logs&#x27;)
    .select(&#x27;id,user_id,meal_date,meal_type,food_name,calories,protein_g,carbs_g,fat_g,notes,created_at&#x27;)
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id)
    .eq(&#x27;meal_date&#x27;,nutritionDate.value)
    .order(&#x27;created_at&#x27;,{ascending:true});

  if(error){
    console.error(&#x27;Meal load error:&#x27;,error);
    if(nutritionMealsList){
      nutritionMealsList.innerHTML = `&lt;div class=&quot;nutrition-empty&quot;&gt;${nutritionEscape(error.message)}&lt;/div&gt;`;
    }
    return;
  }

  nutritionRows = data || [];
  renderNutritionMeals();
}


function setBodyweightStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
  if(!bodyweightStatus) return;
  bodyweightStatus.textContent = text;
  bodyweightStatus.className = `bodyweight-status ${type || &#x27;&#x27;}`;
}

const LB_PER_KG = 2.2046226218;

function bodyweightLbToKg(valueLb){
  return Number(valueLb) / LB_PER_KG;
}

function bodyweightKgToLb(valueKg){
  return Number(valueKg) * LB_PER_KG;
}

function bodyweightDisplayNumber(valueLb){
  const n = Number(valueLb);
  if(!Number.isFinite(n)) return NaN;
  return bodyweightUnit === &#x27;kg&#x27; ? bodyweightLbToKg(n) : n;
}

function bodyweightInputToLb(value){
  const n = Number(value);
  if(!Number.isFinite(n)) return NaN;
  return bodyweightUnit === &#x27;kg&#x27; ? bodyweightKgToLb(n) : n;
}

function bodyweightFormat(valueLb){
  const n = bodyweightDisplayNumber(valueLb);
  if(!Number.isFinite(n)) return &#x27;—&#x27;;

  const unit = bodyweightUnit === &#x27;kg&#x27; ? &#x27;kg&#x27; : &#x27;lb&#x27;;
  return `${n.toFixed(1).replace(/\.0$/,&#x27;&#x27;)} ${unit}`;
}

function bodyweightFormatDelta(deltaLb){
  const displayDelta = bodyweightUnit === &#x27;kg&#x27;
    ? bodyweightLbToKg(deltaLb)
    : Number(deltaLb);

  if(!Number.isFinite(displayDelta)) return &#x27;—&#x27;;

  const unit = bodyweightUnit === &#x27;kg&#x27; ? &#x27;kg&#x27; : &#x27;lb&#x27;;
  const value = displayDelta.toFixed(1).replace(/\.0$/,&#x27;&#x27;);
  return `${displayDelta &gt; 0 ? &#x27;+&#x27; : &#x27;&#x27;}${value} ${unit}`;
}

function updateBodyweightUnitUi(){
  const isKg = bodyweightUnit === &#x27;kg&#x27;;

  bodyweightUnitLb?.classList.toggle(&#x27;active&#x27;,!isKg);
  bodyweightUnitKg?.classList.toggle(&#x27;active&#x27;,isKg);

  if(bodyweightInputLabel){
    bodyweightInputLabel.textContent = `Bodyweight (${isKg ? &#x27;kg&#x27; : &#x27;lb&#x27;})`;
  }

  if(bodyweightInput){
    bodyweightInput.min = isKg ? &#x27;18&#x27; : &#x27;40&#x27;;
    bodyweightInput.max = isKg ? &#x27;680&#x27; : &#x27;1500&#x27;;
    bodyweightInput.step = &#x27;0.1&#x27;;
    bodyweightInput.placeholder = isKg ? &#x27;81.6&#x27; : &#x27;180.0&#x27;;
  }

  if(bodyweightChartUnit){
    bodyweightChartUnit.textContent = `Last 30 entries · ${isKg ? &#x27;kg&#x27; : &#x27;lb&#x27;}`;
  }

  try{
    localStorage.setItem(&#x27;gymcels_bodyweight_unit&#x27;,bodyweightUnit);
  }catch(_){}

  renderBodyweight();
}

function renderBodyweightChart(){
  if(!bodyweightChart) return;

  const rows = [...bodyweightRows]
    .sort((a,b) =&gt; String(a.log_date).localeCompare(String(b.log_date)))
    .slice(-30);

  if(!rows.length){
    bodyweightChart.innerHTML =
      &#x27;&lt;div class=&quot;bodyweight-empty&quot;&gt;Log your first bodyweight to start the chart.&lt;/div&gt;&#x27;;
    return;
  }

  if(rows.length === 1){
    bodyweightChart.innerHTML =
      `&lt;div class=&quot;bodyweight-empty&quot;&gt;First entry: &lt;strong&gt;${bodyweightFormat(rows[0].weight_lb)}&lt;/strong&gt;. Add more weigh-ins to build the trend.&lt;/div&gt;`;
    return;
  }

  const width = 600;
  const height = 170;
  const left = 42;
  const right = 16;
  const top = 14;
  const bottom = 28;
  const chartW = width-left-right;
  const chartH = height-top-bottom;

  const weights = rows
    .map(r =&gt; bodyweightDisplayNumber(r.weight_lb))
    .filter(Number.isFinite);

  let min = Math.min(...weights);
  let max = Math.max(...weights);
  const spread = Math.max(1,max-min);
  min -= spread * .18;
  max += spread * .18;

  const xFor = index =&gt;
    left + (rows.length === 1 ? chartW/2 : (index/(rows.length-1))*chartW);
  const yFor = value =&gt;
    top + ((max-value)/(max-min || 1))*chartH;

  const points = rows.map((row,index) =&gt;
    `${xFor(index).toFixed(1)},${yFor(bodyweightDisplayNumber(row.weight_lb)).toFixed(1)}`
  ).join(&#x27; &#x27;);

  const horizontalLines = [0,.25,.5,.75,1].map(step =&gt; {
    const y = top + chartH*step;
    const labelValue = max-(max-min)*step;

    return `
      &lt;line class=&quot;bodyweight-chart-grid&quot; x1=&quot;${left}&quot; y1=&quot;${y}&quot; x2=&quot;${width-right}&quot; y2=&quot;${y}&quot;&gt;&lt;/line&gt;
      &lt;text class=&quot;bodyweight-chart-label&quot; x=&quot;2&quot; y=&quot;${y+3}&quot;&gt;${nutritionFormat(labelValue,1)}&lt;/text&gt;
    `;
  }).join(&#x27;&#x27;);

  const pointDots = rows.map((row,index) =&gt; `
    &lt;circle class=&quot;bodyweight-chart-point&quot;
      cx=&quot;${xFor(index).toFixed(1)}&quot;
      cy=&quot;${yFor(Number(row.weight_lb)).toFixed(1)}&quot;
      r=&quot;3.2&quot;&gt;
      &lt;title&gt;${row.log_date}: ${bodyweightFormat(row.weight_lb)}&lt;/title&gt;
    &lt;/circle&gt;
  `).join(&#x27;&#x27;);

  const firstDate = nutritionDateFromIso(rows[0].log_date)
    .toLocaleDateString([],{month:&#x27;short&#x27;,day:&#x27;numeric&#x27;});
  const lastDate = nutritionDateFromIso(rows[rows.length-1].log_date)
    .toLocaleDateString([],{month:&#x27;short&#x27;,day:&#x27;numeric&#x27;});

  bodyweightChart.innerHTML = `
    &lt;svg viewBox=&quot;0 0 ${width} ${height}&quot; role=&quot;img&quot; aria-label=&quot;Bodyweight trend&quot;&gt;
      ${horizontalLines}
      &lt;polyline class=&quot;bodyweight-chart-line&quot; points=&quot;${points}&quot;&gt;&lt;/polyline&gt;
      ${pointDots}
      &lt;text class=&quot;bodyweight-chart-label&quot; x=&quot;${left}&quot; y=&quot;${height-5}&quot;&gt;${nutritionEscape(firstDate)}&lt;/text&gt;
      &lt;text class=&quot;bodyweight-chart-label&quot; x=&quot;${width-right-42}&quot; y=&quot;${height-5}&quot;&gt;${nutritionEscape(lastDate)}&lt;/text&gt;
    &lt;/svg&gt;
  `;
}

function renderBodyweight(){
  const rows = [...bodyweightRows]
    .sort((a,b) =&gt; String(b.log_date).localeCompare(String(a.log_date)));

  if(bodyweightEntryCount) bodyweightEntryCount.textContent = String(rows.length);

  const latest = rows[0];
  if(bodyweightLatest){
    bodyweightLatest.textContent = latest ? bodyweightFormat(latest.weight_lb) : &#x27;—&#x27;;
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getFullYear(),now.getMonth(),now.getDate()-6,0,0,0);
  const weekRows = rows.filter(row =&gt; nutritionDateFromIso(row.log_date) &gt;= sevenDaysAgo);
  const weekAvg = weekRows.length
    ? weekRows.reduce((sum,row) =&gt; sum + Number(row.weight_lb),0) / weekRows.length
    : null;

  if(bodyweightAverage){
    bodyweightAverage.textContent = weekAvg !== null ? bodyweightFormat(weekAvg) : &#x27;—&#x27;;
  }

  if(bodyweightTrend){
    bodyweightTrend.classList.remove(&#x27;up&#x27;,&#x27;down&#x27;);

    if(rows.length &gt;= 2){
      const chronological = [...rows].sort(
        (a,b) =&gt; String(a.log_date).localeCompare(String(b.log_date))
      );
      const first = Number(chronological[0].weight_lb);
      const last = Number(chronological[chronological.length-1].weight_lb);
      const delta = last-first;

      bodyweightTrend.textContent = bodyweightFormatDelta(delta);

      if(delta &gt; .05) bodyweightTrend.classList.add(&#x27;up&#x27;);
      if(delta &lt; -.05) bodyweightTrend.classList.add(&#x27;down&#x27;);
    }else{
      bodyweightTrend.textContent = &#x27;—&#x27;;
    }
  }

  if(bodyweightHistory){
    bodyweightHistory.innerHTML = rows.length
      ? rows.slice(0,8).map(row =&gt; `
          &lt;div class=&quot;bodyweight-history-row&quot;&gt;
            &lt;span class=&quot;bodyweight-history-date&quot;&gt;
              ${nutritionEscape(
                nutritionDateFromIso(row.log_date).toLocaleDateString([],{
                  weekday:&#x27;short&#x27;,month:&#x27;short&#x27;,day:&#x27;numeric&#x27;
                })
              )}
            &lt;/span&gt;
            &lt;strong class=&quot;bodyweight-history-weight&quot;&gt;${bodyweightFormat(row.weight_lb)}&lt;/strong&gt;
            &lt;button type=&quot;button&quot; data-bodyweight-delete=&quot;${Number(row.id)}&quot;&gt;Delete&lt;/button&gt;
          &lt;/div&gt;
        `).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;bodyweight-empty&quot;&gt;No bodyweight entries yet.&lt;/div&gt;&#x27;;
  }

  renderBodyweightChart();
}

async function loadBodyweight(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const {data,error} = await nutritionDb
    .from(&#x27;bodyweight_logs&#x27;)
    .select(&#x27;id,user_id,log_date,weight_lb,created_at,updated_at&#x27;)
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id)
    .order(&#x27;log_date&#x27;,{ascending:false})
    .limit(90);

  if(error){
    console.error(&#x27;Bodyweight load error:&#x27;,error);
    setBodyweightStatus(error.message,&#x27;error&#x27;);
    return;
  }

  bodyweightRows = data || [];
  renderBodyweight();
}

async function saveBodyweight(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const date = bodyweightDate?.value || nutritionLocalDateString();
  const enteredWeight = Number(bodyweightInput?.value);
  const weightLb = bodyweightInputToLb(enteredWeight);

  if(!Number.isFinite(weightLb) || weightLb &lt; 40 || weightLb &gt; 1500){
    setBodyweightStatus(
      `Enter a valid bodyweight in ${bodyweightUnit === &#x27;kg&#x27; ? &#x27;kilograms&#x27; : &#x27;pounds&#x27;}.`,
      &#x27;error&#x27;
    );
    bodyweightInput?.focus();
    return;
  }

  bodyweightSaveBtn.disabled = true;
  setBodyweightStatus(&#x27;Saving...&#x27;);

  const {error} = await nutritionDb
    .from(&#x27;bodyweight_logs&#x27;)
    .upsert({
      user_id:nutritionSession.user.id,
      log_date:date,
      // Keep the existing database column in pounds so old entries stay compatible.
      weight_lb:Number(weightLb.toFixed(2)),
      updated_at:new Date().toISOString()
    },{
      onConflict:&#x27;user_id,log_date&#x27;
    });

  bodyweightSaveBtn.disabled = false;

  if(error){
    setBodyweightStatus(error.message,&#x27;error&#x27;);
    return;
  }

  bodyweightInput.value = &#x27;&#x27;;
  setBodyweightStatus(
    `✓ Bodyweight saved in ${bodyweightUnit === &#x27;kg&#x27; ? &#x27;kg&#x27; : &#x27;lb&#x27;}.`,
    &#x27;success&#x27;
  );
  await loadBodyweight();
}

async function deleteBodyweight(id){
  if(!nutritionDb || !nutritionSession?.user || !id) return;
  if(!confirm(&#x27;Delete this bodyweight entry?&#x27;)) return;

  const {error} = await nutritionDb
    .from(&#x27;bodyweight_logs&#x27;)
    .delete()
    .eq(&#x27;id&#x27;,Number(id))
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id);

  if(error){
    setBodyweightStatus(error.message,&#x27;error&#x27;);
    return;
  }

  await loadBodyweight();
}

async function refreshNutritionTracker(){
  if(!nutritionSession?.user) return;
  await Promise.all([
    loadNutritionTargets(),
    loadNutritionMeals(),
    loadNutritionFavorites(),
    loadBodyweight()
  ]);
}

async function setNutritionSession(session){
  nutritionSession = session || null;

  if(!nutritionSection) return;

  if(!nutritionSession?.user){
    nutritionSection.classList.add(&#x27;hidden&#x27;);
    nutritionRows = [];
    nutritionFavorites = [];
    bodyweightRows = [];
    renderNutritionFavorites();
    renderBodyweight();
    resetNutritionMealForm();
    nutritionMealSearchResults?.classList.add(&#x27;hidden&#x27;);
    if(nutritionMealSearchInput) nutritionMealSearchInput.value = &#x27;&#x27;;
    closeNutritionScanner();
    return;
  }

  nutritionSection.classList.remove(&#x27;hidden&#x27;);

  if(!nutritionDate.value){
    nutritionDate.value = nutritionLocalDateString();
  }

  await refreshNutritionTracker();
}

async function saveNutritionTargets(){
  if(!nutritionSession?.user || !nutritionDb) return;

  const values = {
    user_id:nutritionSession.user.id,
    calorie_target:nutritionNumber(nutritionTargetCalories?.value),
    protein_target:nutritionNumber(nutritionTargetProtein?.value),
    carbs_target:nutritionNumber(nutritionTargetCarbs?.value),
    fat_target:nutritionNumber(nutritionTargetFat?.value),
    updated_at:new Date().toISOString()
  };

  nutritionSaveTargetsBtn.disabled = true;

  const {error} = await nutritionDb
    .from(&#x27;nutrition_targets&#x27;)
    .upsert(values,{onConflict:&#x27;user_id&#x27;});

  nutritionSaveTargetsBtn.disabled = false;

  if(error){
    setNutritionStatus(&#x27;Could not save targets: &#x27; + error.message,&#x27;error&#x27;);
    return;
  }

  nutritionTargets = values;
  renderNutritionTargets();
  renderNutritionSummary();
  nutritionTargetsForm?.classList.add(&#x27;hidden&#x27;);
  setNutritionStatus(&#x27;✓ Daily targets saved.&#x27;,&#x27;success&#x27;);
  setTimeout(() =&gt; {
    if(nutritionFormStatus?.textContent === &#x27;✓ Daily targets saved.&#x27;) setNutritionStatus(&#x27;&#x27;);
  },2200);
}

function beginNutritionEdit(row){
  if(!row) return;

  nutritionMealEditId = Number(row.id);
  nutritionMealFormTitle.textContent = &#x27;Edit Meal&#x27;;
  nutritionFoodName.value = row.food_name || &#x27;&#x27;;
  nutritionMealType.value = row.meal_type || &#x27;snack&#x27;;
  nutritionCalories.value = nutritionNumber(row.calories);
  nutritionProtein.value = nutritionNumber(row.protein_g);
  nutritionCarbs.value = nutritionNumber(row.carbs_g);
  nutritionFat.value = nutritionNumber(row.fat_g);
  nutritionNotes.value = row.notes || &#x27;&#x27;;
  // Existing meal rows already store their total macros, so edit them as 1 serving.
  setNutritionServingInput(nutritionServingCount,1);
  updateNutritionServingPreview();
  nutritionSaveMealBtn.textContent = &#x27;Update meal&#x27;;
  nutritionCancelEditBtn.classList.remove(&#x27;hidden&#x27;);
  setNutritionStatus(&#x27;&#x27;);

  document.querySelector(&#x27;.nutrition-add-card&#x27;)?.scrollIntoView({
    behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;
  });
}

async function saveNutritionMeal(){
  if(!nutritionSession?.user || !nutritionDb) return;

  const foodName = String(nutritionFoodName?.value || &#x27;&#x27;).trim();
  if(!foodName){
    setNutritionStatus(&#x27;Add a food or meal name first.&#x27;,&#x27;error&#x27;);
    nutritionFoodName?.focus();
    return;
  }

  const servings = nutritionServingValue(nutritionServingCount);
  const userNotes = String(nutritionNotes?.value || &#x27;&#x27;).trim();

  const row = {
    user_id:nutritionSession.user.id,
    meal_date:nutritionDate.value || nutritionLocalDateString(),
    meal_type:nutritionMealType.value || &#x27;snack&#x27;,
    food_name:foodName,
    calories:nutritionNumber(nutritionCalories.value) * servings,
    protein_g:nutritionNumber(nutritionProtein.value) * servings,
    carbs_g:nutritionNumber(nutritionCarbs.value) * servings,
    fat_g:nutritionNumber(nutritionFat.value) * servings,
    notes:[
      servings !== 1 ? nutritionServingText(servings) : &#x27;&#x27;,
      userNotes
    ].filter(Boolean).join(&#x27; · &#x27;) || null,
    updated_at:new Date().toISOString()
  };

  nutritionSaveMealBtn.disabled = true;
  setNutritionStatus(nutritionMealEditId ? &#x27;Updating meal...&#x27; : &#x27;Adding meal...&#x27;);

  let result;

  if(nutritionMealEditId){
    result = await nutritionDb
      .from(&#x27;meal_logs&#x27;)
      .update(row)
      .eq(&#x27;id&#x27;,nutritionMealEditId)
      .eq(&#x27;user_id&#x27;,nutritionSession.user.id);
  }else{
    result = await nutritionDb
      .from(&#x27;meal_logs&#x27;)
      .insert(row);
  }

  nutritionSaveMealBtn.disabled = false;

  if(result.error){
    setNutritionStatus(result.error.message,&#x27;error&#x27;);
    return;
  }

  const wasEditing = !!nutritionMealEditId;
  resetNutritionMealForm();
  setNutritionStatus(wasEditing ? &#x27;✓ Meal updated.&#x27; : &#x27;✓ Meal added.&#x27;,&#x27;success&#x27;);
  await loadNutritionMeals();

  setTimeout(() =&gt; {
    if(nutritionFormStatus?.classList.contains(&#x27;success&#x27;)) setNutritionStatus(&#x27;&#x27;);
  },1800);
}

async function deleteNutritionMeal(id){
  if(!nutritionSession?.user || !nutritionDb || !id) return;
  if(!confirm(&#x27;Delete this meal from your nutrition log?&#x27;)) return;

  const {error} = await nutritionDb
    .from(&#x27;meal_logs&#x27;)
    .delete()
    .eq(&#x27;id&#x27;,Number(id))
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id);

  if(error){
    setNutritionStatus(error.message,&#x27;error&#x27;);
    return;
  }

  if(Number(nutritionMealEditId) === Number(id)) resetNutritionMealForm();
  await loadNutritionMeals();
}

nutritionEditTargetsBtn?.addEventListener(&#x27;click&#x27;,() =&gt; {
  renderNutritionTargets();
  nutritionTargetsForm?.classList.toggle(&#x27;hidden&#x27;);
});
nutritionCancelTargetsBtn?.addEventListener(&#x27;click&#x27;,() =&gt; {
  nutritionTargetsForm?.classList.add(&#x27;hidden&#x27;);
  renderNutritionTargets();
});
nutritionSaveTargetsBtn?.addEventListener(&#x27;click&#x27;,saveNutritionTargets);

nutritionSaveMealBtn?.addEventListener(&#x27;click&#x27;,saveNutritionMeal);
nutritionCancelEditBtn?.addEventListener(&#x27;click&#x27;,resetNutritionMealForm);

nutritionMealsList?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  const favorite = e.target.closest(&#x27;[data-nutrition-favorite]&#x27;);
  if(favorite){
    const row = nutritionRows.find(
      x =&gt; Number(x.id) === Number(favorite.dataset.nutritionFavorite)
    );
    if(row) saveNutritionFavoriteFromMeal(row);
    return;
  }

  const edit = e.target.closest(&#x27;[data-nutrition-edit]&#x27;);
  if(edit){
    const row = nutritionRows.find(x =&gt; Number(x.id) === Number(edit.dataset.nutritionEdit));
    if(row) beginNutritionEdit(row);
    return;
  }

  const del = e.target.closest(&#x27;[data-nutrition-delete]&#x27;);
  if(del) deleteNutritionMeal(Number(del.dataset.nutritionDelete));
});

nutritionDate?.addEventListener(&#x27;change&#x27;,async () =&gt; {
  resetNutritionMealForm();
  await loadNutritionMeals();
});
nutritionPrevDay?.addEventListener(&#x27;click&#x27;,async () =&gt; {
  nutritionDate.value = nutritionShiftDate(nutritionDate.value || nutritionLocalDateString(),-1);
  resetNutritionMealForm();
  await loadNutritionMeals();
});
nutritionNextDay?.addEventListener(&#x27;click&#x27;,async () =&gt; {
  nutritionDate.value = nutritionShiftDate(nutritionDate.value || nutritionLocalDateString(),1);
  resetNutritionMealForm();
  await loadNutritionMeals();
});
nutritionTodayBtn?.addEventListener(&#x27;click&#x27;,async () =&gt; {
  nutritionDate.value = nutritionLocalDateString();
  resetNutritionMealForm();
  await loadNutritionMeals();
});


function fillNutritionFormFromMeal(row, sourceLabel=&#x27;Saved meal&#x27;){
  if(!row) return;

  nutritionMealEditId = null;
  if(nutritionMealFormTitle) nutritionMealFormTitle.textContent = &#x27;Add Meal&#x27;;
  nutritionFoodName.value = row.food_name || row.product_name || &#x27;&#x27;;
  nutritionMealType.value = row.meal_type || &#x27;snack&#x27;;
  nutritionCalories.value = nutritionNumber(row.calories);
  nutritionProtein.value = nutritionNumber(row.protein_g);
  nutritionCarbs.value = nutritionNumber(row.carbs_g);
  nutritionFat.value = nutritionNumber(row.fat_g);
  nutritionNotes.value = row.notes || &#x27;&#x27;;
  setNutritionServingInput(nutritionServingCount,1);
  updateNutritionServingPreview();
  nutritionSaveMealBtn.textContent = &#x27;Add meal&#x27;;
  nutritionCancelEditBtn.classList.add(&#x27;hidden&#x27;);

  setNutritionStatus(`✓ ${sourceLabel} loaded. Check the serving and macros, then tap Add meal.`,&#x27;success&#x27;);
  document.querySelector(&#x27;.nutrition-meal-form&#x27;)?.scrollIntoView({
    behavior:&#x27;smooth&#x27;,
    block:&#x27;center&#x27;
  });
}

function renderNutritionMealSearchResults(rows){
  if(!nutritionMealSearchResults) return;

  nutritionSavedSearchRows = rows || [];

  if(!nutritionSavedSearchRows.length){
    nutritionMealSearchResults.innerHTML =
      &#x27;&lt;div class=&quot;nutrition-search-empty&quot;&gt;No matching meals found in your history.&lt;/div&gt;&#x27;;
    nutritionMealSearchResults.classList.remove(&#x27;hidden&#x27;);
    return;
  }

  nutritionMealSearchResults.innerHTML = nutritionSavedSearchRows.map((row,index) =&gt; `
    &lt;div class=&quot;nutrition-search-result&quot;&gt;
      &lt;div&gt;
        &lt;div class=&quot;nutrition-search-result-name&quot;&gt;${nutritionEscape(row.food_name || &#x27;Meal&#x27;)}&lt;/div&gt;
        &lt;div class=&quot;nutrition-search-result-meta&quot;&gt;
          &lt;span&gt;${nutritionFormat(row.calories,0)} cal&lt;/span&gt;
          &lt;span&gt;${nutritionFormat(row.protein_g)}g P&lt;/span&gt;
          &lt;span&gt;${nutritionFormat(row.carbs_g)}g C&lt;/span&gt;
          &lt;span&gt;${nutritionFormat(row.fat_g)}g F&lt;/span&gt;
        &lt;/div&gt;
        ${row.notes ? `&lt;div class=&quot;nutrition-search-result-note&quot;&gt;${nutritionEscape(row.notes)}&lt;/div&gt;` : &#x27;&#x27;}
      &lt;/div&gt;
      &lt;button class=&quot;nutrition-search-use&quot; type=&quot;button&quot; data-use-saved-meal=&quot;${index}&quot;&gt;Use&lt;/button&gt;
    &lt;/div&gt;
  `).join(&#x27;&#x27;);

  nutritionMealSearchResults.classList.remove(&#x27;hidden&#x27;);
}

async function searchNutritionMealHistory(){
  if(!nutritionSession?.user || !nutritionDb) return;

  const query = String(nutritionMealSearchInput?.value || &#x27;&#x27;).trim();

  if(!query){
    nutritionMealSearchResults?.classList.add(&#x27;hidden&#x27;);
    if(nutritionMealSearchResults) nutritionMealSearchResults.innerHTML = &#x27;&#x27;;
    return;
  }

  nutritionMealSearchResults.classList.remove(&#x27;hidden&#x27;);
  nutritionMealSearchResults.innerHTML =
    &#x27;&lt;div class=&quot;nutrition-search-empty&quot;&gt;Searching your meal history...&lt;/div&gt;&#x27;;

  const {data,error} = await nutritionDb
    .from(&#x27;meal_logs&#x27;)
    .select(&#x27;id,meal_date,meal_type,food_name,calories,protein_g,carbs_g,fat_g,notes,created_at&#x27;)
    .eq(&#x27;user_id&#x27;,nutritionSession.user.id)
    .ilike(&#x27;food_name&#x27;,`%${query}%`)
    .order(&#x27;created_at&#x27;,{ascending:false})
    .limit(40);

  if(error){
    nutritionMealSearchResults.innerHTML =
      `&lt;div class=&quot;nutrition-search-empty&quot;&gt;${nutritionEscape(error.message)}&lt;/div&gt;`;
    return;
  }

  // Keep only the latest version of matching foods with the same name + macros.
  const seen = new Set();
  const unique = [];

  for(const row of (data || [])){
    const key = [
      String(row.food_name || &#x27;&#x27;).trim().toLowerCase(),
      nutritionNumber(row.calories),
      nutritionNumber(row.protein_g),
      nutritionNumber(row.carbs_g),
      nutritionNumber(row.fat_g)
    ].join(&#x27;|&#x27;);

    if(seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
    if(unique.length &gt;= 12) break;
  }

  renderNutritionMealSearchResults(unique);
}

nutritionMealSearchBtn?.addEventListener(&#x27;click&#x27;,searchNutritionMealHistory);

nutritionMealSearchInput?.addEventListener(&#x27;input&#x27;,() =&gt; {
  clearTimeout(nutritionSearchTimer);
  nutritionSearchTimer = setTimeout(searchNutritionMealHistory,220);
});

nutritionMealSearchInput?.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if(e.key === &#x27;Enter&#x27;){
    e.preventDefault();
    searchNutritionMealHistory();
  }
});

nutritionMealSearchResults?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  const btn = e.target.closest(&#x27;[data-use-saved-meal]&#x27;);
  if(!btn) return;

  const row = nutritionSavedSearchRows[Number(btn.dataset.useSavedMeal)];
  if(!row) return;

  fillNutritionFormFromMeal(row,&#x27;Saved meal&#x27;);
  nutritionMealSearchResults.classList.add(&#x27;hidden&#x27;);
});

function setNutritionScannerStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
  if(!nutritionScannerStatus) return;
  nutritionScannerStatus.textContent = text;
  nutritionScannerStatus.className = `nutrition-scanner-status ${type || &#x27;&#x27;}`;
}


function adjustNutritionServing(input,delta){
  const next = nutritionServingValue(input) + delta;
  setNutritionServingInput(input,next);
}

nutritionServingMinus?.addEventListener(&#x27;click&#x27;,() =&gt; {
  adjustNutritionServing(nutritionServingCount,-0.5);
  updateNutritionServingPreview();
});
nutritionServingPlus?.addEventListener(&#x27;click&#x27;,() =&gt; {
  adjustNutritionServing(nutritionServingCount,0.5);
  updateNutritionServingPreview();
});
nutritionServingCount?.addEventListener(&#x27;input&#x27;,updateNutritionServingPreview);
nutritionServingCount?.addEventListener(&#x27;change&#x27;,() =&gt; {
  setNutritionServingInput(nutritionServingCount,nutritionServingCount.value);
  updateNutritionServingPreview();
});

[nutritionCalories,nutritionProtein,nutritionCarbs,nutritionFat].forEach(input =&gt; {
  input?.addEventListener(&#x27;input&#x27;,updateNutritionServingPreview);
});

nutritionScanServingMinus?.addEventListener(&#x27;click&#x27;,() =&gt; {
  adjustNutritionServing(nutritionScanServingCount,-0.5);
  updateScanServingButtons();
});
nutritionScanServingPlus?.addEventListener(&#x27;click&#x27;,() =&gt; {
  adjustNutritionServing(nutritionScanServingCount,0.5);
  updateScanServingButtons();
});
nutritionScanServingCount?.addEventListener(&#x27;input&#x27;,updateScanServingButtons);
nutritionScanServingCount?.addEventListener(&#x27;change&#x27;,() =&gt; {
  setNutritionServingInput(nutritionScanServingCount,nutritionScanServingCount.value);
  updateScanServingButtons();
});

document.querySelectorAll(&#x27;[data-scan-servings]&#x27;).forEach(btn =&gt; {
  btn.addEventListener(&#x27;click&#x27;,() =&gt; {
    setNutritionServingInput(nutritionScanServingCount,btn.dataset.scanServings);
    updateScanServingButtons();
  });
});

setNutritionServingInput(nutritionServingCount,1);
setNutritionServingInput(nutritionScanServingCount,1);
updateNutritionServingPreview();
updateScanServingButtons();

function nutritionAutoMealType(){
  const hour = new Date().getHours();
  if(hour &gt;= 5 &amp;&amp; hour &lt; 11) return &#x27;breakfast&#x27;;
  if(hour &gt;= 11 &amp;&amp; hour &lt; 16) return &#x27;lunch&#x27;;
  if(hour &gt;= 16 &amp;&amp; hour &lt; 22) return &#x27;dinner&#x27;;
  return &#x27;snack&#x27;;
}

function nutritionMealTypeLabel(type){
  return ({
    breakfast:&#x27;Breakfast&#x27;,
    lunch:&#x27;Lunch&#x27;,
    dinner:&#x27;Dinner&#x27;,
    snack:&#x27;Snacks&#x27;
  })[type] || &#x27;Snacks&#x27;;
}

async function stopNutritionScanner(){
  if(!nutritionScanner) return;

  try{
    await nutritionScanner.stop();
  }catch(_err){
    // Scanner may already be stopped.
  }

  try{
    await nutritionScanner.clear();
  }catch(_err){
    // Safe cleanup if there is nothing left to clear.
  }

  nutritionScanner = null;
  const reader = document.getElementById(&#x27;nutritionBarcodeReader&#x27;);
  if(reader) reader.innerHTML = &#x27;&#x27;;
}

function extractNutritionBarcode(raw){
  const value = String(raw || &#x27;&#x27;).trim();
  if(!value) return null;

  // Normal UPC / EAN / GTIN scan.
  if(/^\d{8,14}$/.test(value)) return value;

  // GS1 element string, e.g. (01)09506000134352.
  const gs1Element = value.match(/\(01\)\s*(\d{14})/);
  if(gs1Element) return gs1Element[1];

  // GS1 digital-link QR, e.g. https://id.gs1.org/01/09506000134352
  const gs1Url = value.match(/\/01\/(\d{14})(?:[/?#]|$)/);
  if(gs1Url) return gs1Url[1];

  // Open Food Facts product QR / URL.
  if(/openfoodfacts\./i.test(value)){
    const offCode = value.match(/\/product\/(\d{8,14})(?:[/?#_-]|$)/i);
    if(offCode) return offCode[1];
  }

  // QR URLs sometimes put the GTIN in a named query parameter.
  try{
    const url = new URL(value);
    const keys = [&#x27;gtin&#x27;,&#x27;ean&#x27;,&#x27;upc&#x27;,&#x27;barcode&#x27;,&#x27;code&#x27;];
    for(const key of keys){
      const candidate = String(url.searchParams.get(key) || &#x27;&#x27;).replace(/\D/g,&#x27;&#x27;);
      if(/^\d{8,14}$/.test(candidate)) return candidate;
    }
  }catch(_err){
    // Not a URL.
  }

  // Plain text QR that explicitly labels the code.
  const labeled = value.match(/(?:gtin|ean|upc|barcode|product\s*code)\D{0,8}(\d{8,14})/i);
  if(labeled) return labeled[1];

  return null;
}

function scannedNutritionMeal(product,barcode){
  const n = product?.nutriments || {};

  const numberOrNull = value =&gt; {
    const num = Number(value);
    return Number.isFinite(num) &amp;&amp; num &gt;= 0 ? num : null;
  };

  const per100 = {
    calories:numberOrNull(n[&#x27;energy-kcal_100g&#x27;]),
    protein:numberOrNull(n.proteins_100g),
    carbs:numberOrNull(n.carbohydrates_100g),
    fat:numberOrNull(n.fat_100g)
  };

  const perServing = {
    calories:numberOrNull(n[&#x27;energy-kcal_serving&#x27;]),
    protein:numberOrNull(n.proteins_serving),
    carbs:numberOrNull(n.carbohydrates_serving),
    fat:numberOrNull(n.fat_serving)
  };

  const hasDirectServing = Object.values(perServing).some(v =&gt; v !== null);
  const servingQty = numberOrNull(product?.serving_quantity);
  const canCalculateServing = !hasDirectServing &amp;&amp; servingQty &amp;&amp; servingQty &gt; 0 &amp;&amp;
    Object.values(per100).some(v =&gt; v !== null);

  let values;
  let servingNote;

  if(hasDirectServing){
    values = {
      calories:perServing.calories ?? 0,
      protein:perServing.protein ?? 0,
      carbs:perServing.carbs ?? 0,
      fat:perServing.fat ?? 0
    };
    servingNote = product?.serving_size
      ? `serving: ${product.serving_size}`
      : &#x27;per serving&#x27;;
  }else if(canCalculateServing){
    const factor = servingQty / 100;
    values = {
      calories:(per100.calories ?? 0) * factor,
      protein:(per100.protein ?? 0) * factor,
      carbs:(per100.carbs ?? 0) * factor,
      fat:(per100.fat ?? 0) * factor
    };
    servingNote = product?.serving_size
      ? `serving: ${product.serving_size}`
      : `serving: ${nutritionFormat(servingQty)}g`;
  }else{
    values = {
      calories:per100.calories ?? 0,
      protein:per100.protein ?? 0,
      carbs:per100.carbs ?? 0,
      fat:per100.fat ?? 0
    };
    servingNote = &#x27;nutrition per 100g&#x27;;
  }

  const hasAnyNutrition = Object.values(values).some(v =&gt; Number(v) &gt; 0);

  return {
    food_name:[
      product?.product_name || product?.generic_name || &#x27;Scanned food&#x27;,
      product?.brands ? `— ${product.brands}` : &#x27;&#x27;
    ].filter(Boolean).join(&#x27; &#x27;),
    calories:values.calories,
    protein_g:values.protein,
    carbs_g:values.carbs,
    fat_g:values.fat,
    notes:`Barcode ${barcode} · ${servingNote}`,
    hasAnyNutrition
  };
}

async function autoLogScannedFood(product,barcode){
  if(!nutritionDb || !nutritionSession?.user){
    throw new Error(&#x27;Log in before scanning food.&#x27;);
  }

  const meal = scannedNutritionMeal(product,barcode);

  if(!meal.hasAnyNutrition){
    // Still populate the form so the user can fill in the label manually.
    fillNutritionFormFromMeal({
      product_name:meal.food_name,
      meal_type:nutritionAutoMealType(),
      calories:0,
      protein_g:0,
      carbs_g:0,
      fat_g:0,
      notes:meal.notes
    },&#x27;Scanned product&#x27;);

    throw new Error(&#x27;Product found, but its nutrition data is missing. I loaded the name into the form so you can enter the label manually.&#x27;);
  }

  const mealType = nutritionAutoMealType();
  const mealDate = nutritionDate?.value || nutritionLocalDateString();
  const servings = nutritionServingValue(nutritionScanServingCount);

  const {error} = await nutritionDb
    .from(&#x27;meal_logs&#x27;)
    .insert({
      user_id:nutritionSession.user.id,
      meal_date:mealDate,
      meal_type:mealType,
      food_name:meal.food_name,
      calories:nutritionNumber(meal.calories) * servings,
      protein_g:nutritionNumber(meal.protein_g) * servings,
      carbs_g:nutritionNumber(meal.carbs_g) * servings,
      fat_g:nutritionNumber(meal.fat_g) * servings,
      notes:[
        nutritionServingText(servings),
        meal.notes
      ].filter(Boolean).join(&#x27; · &#x27;),
      updated_at:new Date().toISOString()
    });

  if(error) throw error;

  await loadNutritionMeals();

  if(navigator.vibrate){
    try{ navigator.vibrate(70); }catch(_err){}
  }

  return {
    name:meal.food_name,
    calories:nutritionNumber(meal.calories) * servings,
    servings,
    mealType,
    mealDate
  };
}

async function lookupAndAutoLogNutritionCode(rawCode){
  const barcode = extractNutritionBarcode(rawCode);

  if(!barcode){
    throw new Error(
      &#x27;QR code detected, but it does not contain a UPC/EAN/GTIN food code. Try the line-style barcode on the package.&#x27;
    );
  }

  if(nutritionBarcodeInput) nutritionBarcodeInput.value = barcode;

  setNutritionScannerStatus(&#x27;Product code found — looking up food…&#x27;);
  if(nutritionCameraLabel) nutritionCameraLabel.textContent = `Code ${barcode}`;

  const fields = [
    &#x27;code&#x27;,&#x27;product_name&#x27;,&#x27;generic_name&#x27;,&#x27;brands&#x27;,&#x27;serving_size&#x27;,&#x27;serving_quantity&#x27;,
    &#x27;categories_tags&#x27;,&#x27;nutriments&#x27;
  ].join(&#x27;,&#x27;);

  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${encodeURIComponent(fields)}`
  );

  if(!response.ok){
    throw new Error(`Food lookup failed (${response.status}).`);
  }

  const payload = await response.json();

  if(payload?.status !== 1 || !payload?.product){
    throw new Error(
      &#x27;Barcode scanned successfully, but that product is not in the food database yet.&#x27;
    );
  }

  setNutritionScannerStatus(&#x27;Food found — logging it automatically…&#x27;);

  return await autoLogScannedFood(payload.product,barcode);
}

async function handleNutritionScan(decodedText){
  if(nutritionScanHandled) return;
  nutritionScanHandled = true;

  try{
    setNutritionScannerStatus(&#x27;Code detected…&#x27;);
    await stopNutritionScanner();

    const logged = await lookupAndAutoLogNutritionCode(decodedText);

    setNutritionScannerStatus(
      `✓ Logged ${nutritionServingText(logged.servings)} of ${logged.name} · ${nutritionFormat(logged.calories,0)} cal · ${nutritionMealTypeLabel(logged.mealType)}`,
      &#x27;success&#x27;
    );

    if(nutritionCameraLabel) nutritionCameraLabel.textContent = &#x27;Food logged ✓&#x27;;

    setNutritionStatus(
      `✓ ${nutritionServingText(logged.servings)} of ${logged.name} was added to ${nutritionMealTypeLabel(logged.mealType)}.`,
      &#x27;success&#x27;
    );

    setTimeout(closeNutritionScanner,950);
  }catch(err){
    console.error(&#x27;Nutrition scan error:&#x27;,err);
    setNutritionScannerStatus(err?.message || String(err),&#x27;error&#x27;);
    if(nutritionCameraLabel) nutritionCameraLabel.textContent = &#x27;Try another code&#x27;;

    // Restart the rear camera so the user can immediately try again.
    nutritionScanHandled = false;
    setTimeout(() =&gt; {
      if(nutritionScannerOverlay?.classList.contains(&#x27;show&#x27;) &amp;&amp; !nutritionScanner){
        startNutritionRearCamera();
      }
    },850);
  }
}

async function startNutritionRearCamera(){
  if(typeof Html5Qrcode === &#x27;undefined&#x27;){
    setNutritionScannerStatus(
      &#x27;Camera scanner could not load. You can still enter the barcode manually.&#x27;,
      &#x27;error&#x27;
    );
    return;
  }

  await stopNutritionScanner();

  const readerId = &#x27;nutritionBarcodeReader&#x27;;
  nutritionScanner = new Html5Qrcode(readerId,false);

  const scanConfig = {
    fps:12,
    qrbox:(viewWidth,viewHeight) =&gt; {
      const width = Math.floor(Math.min(viewWidth * .78,360));
      const height = Math.floor(Math.min(viewHeight * .34,170));
      return {width,height};
    },
    aspectRatio:1.333333
  };

  let cameraChoice = {facingMode:{exact:&#x27;environment&#x27;}};
  let cameraName = &#x27;Back camera&#x27;;

  try{
    const cameras = await Html5Qrcode.getCameras();

    if(cameras?.length){
      const rear =
        cameras.find(cam =&gt; /back|rear|environment|world/i.test(cam.label || &#x27;&#x27;)) ||
        cameras[cameras.length - 1];

      if(rear?.id){
        cameraChoice = rear.id;
        cameraName = rear.label || &#x27;Back camera&#x27;;
      }
    }
  }catch(err){
    console.debug(&#x27;Camera enumeration fallback:&#x27;,err);
  }

  try{
    if(nutritionCameraLabel) nutritionCameraLabel.textContent = cameraName;
    setNutritionScannerStatus(&#x27;Scanning… hold the package steady inside the frame.&#x27;);

    await nutritionScanner.start(
      cameraChoice,
      scanConfig,
      handleNutritionScan,
      () =&gt; {}
    );
  }catch(firstErr){
    console.debug(&#x27;Exact rear camera start failed, trying environment mode:&#x27;,firstErr);

    try{
      await stopNutritionScanner();
      nutritionScanner = new Html5Qrcode(readerId,false);
      if(nutritionCameraLabel) nutritionCameraLabel.textContent = &#x27;Back camera&#x27;;

      await nutritionScanner.start(
        {facingMode:&#x27;environment&#x27;},
        scanConfig,
        handleNutritionScan,
        () =&gt; {}
      );
    }catch(secondErr){
      console.error(&#x27;Rear camera start failed:&#x27;,secondErr);
      await stopNutritionScanner();
      if(nutritionCameraLabel) nutritionCameraLabel.textContent = &#x27;Camera unavailable&#x27;;
      setNutritionScannerStatus(
        &#x27;Could not open the back camera. Check camera permission, or enter the barcode manually.&#x27;,
        &#x27;error&#x27;
      );
    }
  }
}

async function openNutritionScanner(){
  if(!nutritionSession?.user){
    document.getElementById(&#x27;login-card&#x27;)?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
    return;
  }

  nutritionScannerOverlay?.classList.add(&#x27;show&#x27;);
  nutritionScannerOverlay?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
  nutritionScanHandled = false;

  if(nutritionCameraLabel) nutritionCameraLabel.textContent = &#x27;Starting back camera…&#x27;;
  setNutritionScannerStatus(&#x27;Starting back camera…&#x27;);

  await startNutritionRearCamera();
}

async function closeNutritionScanner(){
  await stopNutritionScanner();
  nutritionScannerOverlay?.classList.remove(&#x27;show&#x27;);
  nutritionScannerOverlay?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  nutritionScanHandled = false;
}

nutritionBarcodeBtn?.addEventListener(&#x27;click&#x27;,openNutritionScanner);
nutritionScannerClose?.addEventListener(&#x27;click&#x27;,closeNutritionScanner);

nutritionScannerOverlay?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  if(e.target === nutritionScannerOverlay) closeNutritionScanner();
});

nutritionBarcodeLookupBtn?.addEventListener(&#x27;click&#x27;,async () =&gt; {
  if(nutritionScanHandled) return;
  nutritionScanHandled = true;

  try{
    const logged = await lookupAndAutoLogNutritionCode(nutritionBarcodeInput?.value || &#x27;&#x27;);

    setNutritionScannerStatus(
      `✓ Logged ${nutritionServingText(logged.servings)} of ${logged.name} · ${nutritionFormat(logged.calories,0)} cal · ${nutritionMealTypeLabel(logged.mealType)}`,
      &#x27;success&#x27;
    );
    setNutritionStatus(
      `✓ ${nutritionServingText(logged.servings)} of ${logged.name} was added to ${nutritionMealTypeLabel(logged.mealType)}.`,
      &#x27;success&#x27;
    );
    setTimeout(closeNutritionScanner,850);
  }catch(err){
    setNutritionScannerStatus(err?.message || String(err),&#x27;error&#x27;);
    nutritionScanHandled = false;
  }
});

nutritionBarcodeInput?.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if(e.key === &#x27;Enter&#x27;){
    e.preventDefault();
    nutritionBarcodeLookupBtn?.click();
  }
});

document.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if(e.key === &#x27;Escape&#x27; &amp;&amp; nutritionScannerOverlay?.classList.contains(&#x27;show&#x27;)){
    closeNutritionScanner();
  }
});



nutritionFavoritesList?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  const logBtn = e.target.closest(&#x27;[data-favorite-log]&#x27;);
  if(logBtn){
    const fav = nutritionFavorites.find(
      x =&gt; Number(x.id) === Number(logBtn.dataset.favoriteLog)
    );
    if(fav) logNutritionFavorite(fav);
    return;
  }

  const useBtn = e.target.closest(&#x27;[data-favorite-use]&#x27;);
  if(useBtn){
    const fav = nutritionFavorites.find(
      x =&gt; Number(x.id) === Number(useBtn.dataset.favoriteUse)
    );

    if(fav){
      fillNutritionFormFromMeal(fav,&#x27;Favorite food&#x27;);
      document.querySelector(&#x27;.nutrition-add-card&#x27;)?.scrollIntoView({
        behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;
      });
    }
    return;
  }

  const deleteBtn = e.target.closest(&#x27;[data-favorite-delete]&#x27;);
  if(deleteBtn){
    deleteNutritionFavorite(Number(deleteBtn.dataset.favoriteDelete));
  }
});


function setBodyweightUnit(unit){
  bodyweightUnit = unit === &#x27;kg&#x27; ? &#x27;kg&#x27; : &#x27;lb&#x27;;
  updateBodyweightUnitUi();
}

bodyweightUnitLb?.addEventListener(&#x27;click&#x27;,() =&gt; setBodyweightUnit(&#x27;lb&#x27;));
bodyweightUnitKg?.addEventListener(&#x27;click&#x27;,() =&gt; setBodyweightUnit(&#x27;kg&#x27;));

bodyweightSaveBtn?.addEventListener(&#x27;click&#x27;,saveBodyweight);
bodyweightInput?.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if(e.key === &#x27;Enter&#x27;){
    e.preventDefault();
    saveBodyweight();
  }
});
bodyweightHistory?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  const btn = e.target.closest(&#x27;[data-bodyweight-delete]&#x27;);
  if(btn) deleteBodyweight(Number(btn.dataset.bodyweightDelete));
});

if(bodyweightDate) bodyweightDate.value = nutritionLocalDateString();
updateBodyweightUnitUi();

if(nutritionDate) nutritionDate.value = nutritionLocalDateString();

if(nutritionDb){
  nutritionDb.auth.onAuthStateChange((_event,session) =&gt; {
    setNutritionSession(session);
  });

  setTimeout(async () =&gt; {
    const {data} = await nutritionDb.auth.getSession();
    await setNutritionSession(data?.session || null);
  },300);
}



const fpDb = window.gymcelsLolDb;

// ---- Gymcels.lol member profile (stored in Supabase Auth user metadata) ----
const profileBox = document.getElementById(&#x27;memberProfile&#x27;);
const profileAvatar = document.getElementById(&#x27;profileAvatar&#x27;);
const profileDisplayName = document.getElementById(&#x27;profileDisplayName&#x27;);
const profileEmail = document.getElementById(&#x27;profileEmail&#x27;);
const profileMemberSince = document.getElementById(&#x27;profileMemberSince&#x27;);
const profileProgramWeek = document.getElementById(&#x27;profileProgramWeek&#x27;);
const profileWorkoutCount = document.getElementById(&#x27;profileWorkoutCount&#x27;);
const profileSetCount = document.getElementById(&#x27;profileSetCount&#x27;);

const profileCurrentStreak = document.getElementById(&#x27;profileCurrentStreak&#x27;);
const profileBestStreak = document.getElementById(&#x27;profileBestStreak&#x27;);
const profileBioText = document.getElementById(&#x27;profileBioText&#x27;);
const profileBioInput = document.getElementById(&#x27;profileBioInput&#x27;);
const profilePhotoNote = document.getElementById(&#x27;profilePhotoNote&#x27;);
const profilePhysiqueCard = document.getElementById(&#x27;profilePhysiqueCard&#x27;);
const profilePhysiqueInput = document.getElementById(&#x27;profilePhysiqueInput&#x27;);
const profilePhysiqueNote = document.getElementById(&#x27;profilePhysiqueNote&#x27;);
const removePhysiqueBtn = document.getElementById(&#x27;removePhysiqueBtn&#x27;);
let pendingProfilePreviewUrl = null;
let pendingPhysiquePreviewUrl = null;

const profileForm = document.getElementById(&#x27;profileForm&#x27;);
const profileNameInput = document.getElementById(&#x27;profileNameInput&#x27;);
const profileStartInput = document.getElementById(&#x27;profileStartInput&#x27;);
const profileMessage = document.getElementById(&#x27;profileMessage&#x27;);

const profilePhotoInput = document.getElementById(&#x27;profilePhotoInput&#x27;);
const uploadProfilePhotoBtn = document.getElementById(&#x27;uploadProfilePhotoBtn&#x27;);
const removeProfilePhotoBtn = document.getElementById(&#x27;removeProfilePhotoBtn&#x27;);

const editProfileBtn = document.getElementById(&#x27;editProfileBtn&#x27;);
const saveProfileBtn = document.getElementById(&#x27;saveProfileBtn&#x27;);
const cancelProfileBtn = document.getElementById(&#x27;cancelProfileBtn&#x27;);

function fpInitials(name, email){
  const source = (name || email || &#x27;GL&#x27;).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if(parts.length &gt;= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0,2).toUpperCase();
}


function renderProfileAvatar(name, email, photoUrl){
  if(!profileAvatar) return;
  if(photoUrl){
    profileAvatar.innerHTML = `&lt;img src=&quot;${photoUrl}&quot; alt=&quot;Profile photo&quot;&gt;`;
  } else {
    profileAvatar.textContent = fpInitials(name, email);
  }
}

function renderOwnPhysique(photoUrl){
  if(!profilePhysiqueCard) return;
  if(photoUrl){
    profilePhysiqueCard.innerHTML = `&lt;img src=&quot;${photoUrl}&quot; alt=&quot;Physique photo&quot;&gt;`;
  }else{
    profilePhysiqueCard.innerHTML = &#x27;&lt;div class=&quot;profile-physique-empty&quot;&gt;No physique photo added yet.&lt;/div&gt;&#x27;;
  }
}

function fpProgramWeek(startDate){
  if(!startDate) return &#x27;—&#x27;;
  const start = new Date(startDate + &#x27;T00:00:00&#x27;);
  const now = new Date();
  if(Number.isNaN(start.getTime()) || start &gt; now) return &#x27;—&#x27;;
  const days = Math.floor((now - start) / 86400000);
  return Math.min(12, Math.floor(days / 7) + 1);
}


function localDateKey(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,&#x27;0&#x27;);
  const day = String(d.getDate()).padStart(2,&#x27;0&#x27;);
  return `${y}-${m}-${day}`;
}

function weekStartKeyFromDate(d){
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  const mondayOffset = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - mondayOffset);
  return localDateKey(x);
}

function weekStartKeyFromIso(dateStr){
  if(!dateStr) return null;
  const d = new Date(`${dateStr}T12:00:00`);
  if(Number.isNaN(d.getTime())) return null;
  return weekStartKeyFromDate(d);
}

function shiftWeekKey(key, weeks){
  const d = new Date(`${key}T12:00:00`);
  d.setDate(d.getDate() + weeks * 7);
  return localDateKey(d);
}

function computeWorkoutWeekStreak(logs){
  const weeks = new Set(
    (logs || [])
      .map(row =&gt; weekStartKeyFromIso(row.workout_date))
      .filter(Boolean)
  );

  if(!weeks.size) return { current:0, best:0 };

  const thisWeek = weekStartKeyFromDate(new Date());
  const previousWeek = shiftWeekKey(thisWeek, -1);

  // Rest days do not break the streak. During a new week, last week&#x27;s streak
  // remains alive until the week ends.
  let anchor = null;
  if(weeks.has(thisWeek)) anchor = thisWeek;
  else if(weeks.has(previousWeek)) anchor = previousWeek;

  let current = 0;
  if(anchor){
    let cursor = anchor;
    while(weeks.has(cursor)){
      current++;
      cursor = shiftWeekKey(cursor, -1);
    }
  }

  const sorted = [...weeks]
    .map(key =&gt; new Date(`${key}T12:00:00`).getTime())
    .sort((a,b) =&gt; a-b);

  let best = 0;
  let run = 0;
  let last = null;

  for(const ts of sorted){
    if(last !== null &amp;&amp; ts - last === 7 * 86400000) run += 1;
    else run = 1;
    if(run &gt; best) best = run;
    last = ts;
  }

  return { current, best };
}

async function refreshMemberProfile(){
  if(!profileBox) return;

  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user){
    profileBox.classList.add(&#x27;hidden&#x27;);
    return;
  }

  const user = session.user;
  const meta = user.user_metadata || {};
  const displayName = meta.display_name || &#x27;Gymcels.lol Member&#x27;;
  const startDate = meta.fp_start_date || &#x27;&#x27;;
  const bio = String(meta.bio || &#x27;&#x27;).slice(0,160);

  profileBox.classList.remove(&#x27;hidden&#x27;);
  profileDisplayName.textContent = displayName;
  profileEmail.textContent = user.email || &#x27;&#x27;;
  renderProfileAvatar(displayName, user.email, meta.avatar_url || &#x27;&#x27;);
  renderOwnPhysique(meta.physique_url || &#x27;&#x27;);

  if(profileBioText){
    profileBioText.textContent = bio || &#x27;No bio yet.&#x27;;
    profileBioText.classList.toggle(&#x27;empty&#x27;, !bio);
  }

  profileMemberSince.textContent = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined,{month:&#x27;short&#x27;,year:&#x27;numeric&#x27;})
    : &#x27;—&#x27;;

  profileProgramWeek.textContent = fpProgramWeek(startDate);
  profileNameInput.value = meta.display_name || &#x27;&#x27;;
  profileStartInput.value = startDate;
  if(profileBioInput) profileBioInput.value = bio;

  const { data: logs, error } = await fpDb
    .from(&#x27;workout_logs&#x27;)
    .select(&#x27;workout_date&#x27;);

  if(!error &amp;&amp; Array.isArray(logs)){
    profileSetCount.textContent = logs.length;
    const uniqueDays = new Set(logs.map(x =&gt; x.workout_date).filter(Boolean));
    profileWorkoutCount.textContent = uniqueDays.size;

    const streak = computeWorkoutWeekStreak(logs);
    if(profileCurrentStreak) profileCurrentStreak.innerHTML = `&lt;span class=&quot;streak-flame&quot;&gt;🔥&lt;/span&gt; ${streak.current} wk`;
    if(profileBestStreak) profileBestStreak.textContent = `${streak.best} wk`;
  }
}

if(navEditProfile){
  navEditProfile.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    e.preventDefault();

    if(profileBox){
      profileBox.scrollIntoView({ behavior:&#x27;smooth&#x27;, block:&#x27;center&#x27; });
    }

    if(profileForm){
      profileForm.classList.add(&#x27;show&#x27;);
    }

    if(profileMessage){
      profileMessage.textContent = &#x27;&#x27;;
      profileMessage.style.fontWeight = &#x27;&#x27;;
    }

    setTimeout(() =&gt; {
      if(profileNameInput) profileNameInput.focus();
    }, 400);
  });
}

if(editProfileBtn){
  editProfileBtn.addEventListener(&#x27;click&#x27;, () =&gt; {
    profileForm.classList.add(&#x27;show&#x27;);
    profileMessage.textContent = &#x27;&#x27;;
    profileMessage.style.fontWeight = &#x27;&#x27;;
  });
}
if(cancelProfileBtn){
  cancelProfileBtn.addEventListener(&#x27;click&#x27;, () =&gt; {
    profileForm.classList.remove(&#x27;show&#x27;);
    profileMessage.textContent = &#x27;&#x27;;
  });
}
if(saveProfileBtn){
  saveProfileBtn.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await fpDb.auth.getSession();
    if(!session?.user){
      profileMessage.textContent = &#x27;Log in first.&#x27;;
      profileMessage.style.color = &#x27;#ff5a6b&#x27;;
      return;
    }

    const user = session.user;
    const oldMeta = user.user_metadata || {};
    const display_name = profileNameInput.value.trim() || &#x27;Gymcels.lol Member&#x27;;
    const fp_start_date = profileStartInput.value || null;
    const bio = String(profileBioInput?.value || &#x27;&#x27;).trim().slice(0,160);

    let avatar_url = oldMeta.avatar_url || null;
    let avatar_path = oldMeta.avatar_path || null;
    let physique_url = oldMeta.physique_url || null;
    let physique_path = oldMeta.physique_path || null;
    let newlyUploadedPath = null;
    let newlyUploadedPhysiquePath = null;

    const file = profilePhotoInput?.files?.[0] || null;
    const physiqueFile = profilePhysiqueInput?.files?.[0] || null;

    if(file){
      if(file.size &gt; 5 * 1024 * 1024){
        profileMessage.textContent = &#x27;Photo must be under 5 MB.&#x27;;
        profileMessage.style.color = &#x27;#ff5a6b&#x27;;
        return;
      }

      const allowed = [&#x27;image/jpeg&#x27;,&#x27;image/png&#x27;,&#x27;image/webp&#x27;];
      if(!allowed.includes(file.type)){
        profileMessage.textContent = &#x27;Use a JPG, PNG, or WebP image.&#x27;;
        profileMessage.style.color = &#x27;#ff5a6b&#x27;;
        return;
      }

      profileMessage.textContent = &#x27;Uploading profile photo...&#x27;;
      profileMessage.style.color = &#x27;#9aa1ad&#x27;;

      const ext = (file.name.split(&#x27;.&#x27;).pop() || &#x27;jpg&#x27;).toLowerCase();
      newlyUploadedPath = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await fpDb.storage
        .from(&#x27;avatars&#x27;)
        .upload(newlyUploadedPath, file, { contentType:file.type });

      if(uploadError){
        profileMessage.textContent = uploadError.message;
        profileMessage.style.color = &#x27;#ff5a6b&#x27;;
        return;
      }

      const { data: publicData } = fpDb.storage
        .from(&#x27;avatars&#x27;)
        .getPublicUrl(newlyUploadedPath);

      avatar_url = publicData.publicUrl;
      avatar_path = newlyUploadedPath;
    }

    if(physiqueFile){
      if(physiqueFile.size &gt; 8 * 1024 * 1024){
        if(newlyUploadedPath) await fpDb.storage.from(&#x27;avatars&#x27;).remove([newlyUploadedPath]);
        profileMessage.textContent = &#x27;Physique photo must be under 8 MB.&#x27;;
        profileMessage.style.color = &#x27;#ff5a6b&#x27;;
        return;
      }

      const allowedPhysique = [&#x27;image/jpeg&#x27;,&#x27;image/png&#x27;,&#x27;image/webp&#x27;];
      if(!allowedPhysique.includes(physiqueFile.type)){
        if(newlyUploadedPath) await fpDb.storage.from(&#x27;avatars&#x27;).remove([newlyUploadedPath]);
        profileMessage.textContent = &#x27;Use a JPG, PNG, or WebP physique photo.&#x27;;
        profileMessage.style.color = &#x27;#ff5a6b&#x27;;
        return;
      }

      profileMessage.textContent = &#x27;Uploading physique photo...&#x27;;
      profileMessage.style.color = &#x27;#9aa1ad&#x27;;

      const physiqueExt = (physiqueFile.name.split(&#x27;.&#x27;).pop() || &#x27;jpg&#x27;).toLowerCase();
      newlyUploadedPhysiquePath = `${user.id}/physique-${Date.now()}.${physiqueExt}`;

      const { error: physiqueUploadError } = await fpDb.storage
        .from(&#x27;physiques&#x27;)
        .upload(newlyUploadedPhysiquePath, physiqueFile, { contentType:physiqueFile.type });

      if(physiqueUploadError){
        if(newlyUploadedPath) await fpDb.storage.from(&#x27;avatars&#x27;).remove([newlyUploadedPath]);
        profileMessage.textContent = physiqueUploadError.message;
        profileMessage.style.color = &#x27;#ff5a6b&#x27;;
        return;
      }

      const { data: physiquePublicData } = fpDb.storage
        .from(&#x27;physiques&#x27;)
        .getPublicUrl(newlyUploadedPhysiquePath);

      physique_url = physiquePublicData.publicUrl;
      physique_path = newlyUploadedPhysiquePath;
    }

    profileMessage.textContent = &#x27;Saving profile...&#x27;;
    profileMessage.style.color = &#x27;#9aa1ad&#x27;;

    const { data, error } = await fpDb.auth.updateUser({
      data: {
        display_name,
        fp_start_date,
        bio,
        avatar_url,
        avatar_path,
        physique_url,
        physique_path
      }
    });

    if(error){
      if(newlyUploadedPath){
        await fpDb.storage.from(&#x27;avatars&#x27;).remove([newlyUploadedPath]);
      }
      if(newlyUploadedPhysiquePath){
        await fpDb.storage.from(&#x27;physiques&#x27;).remove([newlyUploadedPhysiquePath]);
      }
      profileMessage.textContent = error.message;
      profileMessage.style.color = &#x27;#ff5a6b&#x27;;
      return;
    }

    // Remove the old avatar only after the new profile data saved successfully.
    if(newlyUploadedPath &amp;&amp; oldMeta.avatar_path &amp;&amp; oldMeta.avatar_path !== newlyUploadedPath){
      await fpDb.storage.from(&#x27;avatars&#x27;).remove([oldMeta.avatar_path]);
    }

    if(newlyUploadedPhysiquePath &amp;&amp; oldMeta.physique_path &amp;&amp; oldMeta.physique_path !== newlyUploadedPhysiquePath){
      await fpDb.storage.from(&#x27;physiques&#x27;).remove([oldMeta.physique_path]);
    }

    await fpDb
      .from(&#x27;member_presence&#x27;)
      .upsert({
        user_id: user.id,
        display_name,
        avatar_url,
        bio,
        physique_url,
        last_seen: new Date().toISOString()
      }, { onConflict:&#x27;user_id&#x27; });

    // Keep existing public chat messages visually synced with the member profile.
    await fpDb
      .from(&#x27;messages&#x27;)
      .update({ display_name, avatar_url })
      .eq(&#x27;user_id&#x27;, user.id);

    if(profilePhotoInput) profilePhotoInput.value = &#x27;&#x27;;
    if(profilePhysiqueInput) profilePhysiqueInput.value = &#x27;&#x27;;
    if(pendingPhysiquePreviewUrl){
      URL.revokeObjectURL(pendingPhysiquePreviewUrl);
      pendingPhysiquePreviewUrl = null;
    }
    if(profilePhysiqueNote){
      profilePhysiqueNote.textContent = &#x27;Optional public physique photo. JPG, PNG, or WebP under 8 MB. Click Save Profile to apply it.&#x27;;
      profilePhysiqueNote.classList.remove(&#x27;ready&#x27;);
    }
    if(pendingProfilePreviewUrl){
      URL.revokeObjectURL(pendingProfilePreviewUrl);
      pendingProfilePreviewUrl = null;
    }
    if(profilePhotoNote){
      profilePhotoNote.textContent = &#x27;Choose a JPG, PNG, or WebP under 5 MB, then click Save Profile.&#x27;;
      profilePhotoNote.classList.remove(&#x27;ready&#x27;);
    }

    profileMessage.textContent = &#x27;✓ PROFILE UPDATED&#x27;;
    profileMessage.style.color = &#x27;#67e8a5&#x27;;
    profileMessage.style.fontWeight = &#x27;900&#x27;;

    await refreshMemberProfile();
    setTimeout(() =&gt; profileForm.classList.remove(&#x27;show&#x27;), 900);
  });
}

if(profilePhotoInput){
  profilePhotoInput.addEventListener(&#x27;change&#x27;, () =&gt; {
    const file = profilePhotoInput.files?.[0];

    if(pendingProfilePreviewUrl){
      URL.revokeObjectURL(pendingProfilePreviewUrl);
      pendingProfilePreviewUrl = null;
    }

    if(!file){
      refreshMemberProfile();
      return;
    }

    pendingProfilePreviewUrl = URL.createObjectURL(file);

    fpDb.auth.getSession().then(({ data }) =&gt; {
      const user = data?.session?.user;
      const meta = user?.user_metadata || {};
      renderProfileAvatar(
        profileNameInput?.value.trim() || meta.display_name || &#x27;Gymcels.lol Member&#x27;,
        user?.email || &#x27;&#x27;,
        pendingProfilePreviewUrl
      );
    });

    if(profilePhotoNote){
      profilePhotoNote.textContent = &#x27;✓ Photo selected — click Save Profile to apply it.&#x27;;
      profilePhotoNote.classList.add(&#x27;ready&#x27;);
    }
  });
}

if(profilePhysiqueInput){
  profilePhysiqueInput.addEventListener(&#x27;change&#x27;, () =&gt; {
    const file = profilePhysiqueInput.files?.[0] || null;

    if(pendingPhysiquePreviewUrl){
      URL.revokeObjectURL(pendingPhysiquePreviewUrl);
      pendingPhysiquePreviewUrl = null;
    }

    if(!file){
      refreshMemberProfile();
      return;
    }

    pendingPhysiquePreviewUrl = URL.createObjectURL(file);
    renderOwnPhysique(pendingPhysiquePreviewUrl);

    if(profilePhysiqueNote){
      profilePhysiqueNote.textContent = &#x27;✓ Physique selected — click Save Profile to publish it.&#x27;;
      profilePhysiqueNote.classList.add(&#x27;ready&#x27;);
    }
  });
}

// Keep profile synced with login/logout and workout log changes.
fpDb.auth.onAuthStateChange(() =&gt; {
  setTimeout(refreshMemberProfile, 0);
window.addEventListener(&#x27;gymcelsWorkoutChanged&#x27;, () =&gt; setTimeout(refreshMemberProfile, 100));
});
setTimeout(refreshMemberProfile, 0);

if(document.getElementById(&#x27;workoutForm&#x27;)){
  document.getElementById(&#x27;workoutForm&#x27;).addEventListener(&#x27;submit&#x27;, () =&gt; {
    setTimeout(refreshMemberProfile, 700);
  });
}




// ---- Gymcels.lol Community Chat ----
const communityChat = document.getElementById(&#x27;communityChat&#x27;);
const communitySection = document.getElementById(&#x27;communitySection&#x27;);

const siteUpdateBoard = document.getElementById(&#x27;siteUpdateBoard&#x27;);
const siteUpdateAdminComposer = document.getElementById(&#x27;siteUpdateAdminComposer&#x27;);
const siteUpdateInput = document.getElementById(&#x27;siteUpdateInput&#x27;);
const siteUpdateFontSize = document.getElementById(&#x27;siteUpdateFontSize&#x27;);
const siteUpdateColor = document.getElementById(&#x27;siteUpdateColor&#x27;);
const siteUpdatePreview = document.getElementById(&#x27;siteUpdatePreview&#x27;);
const siteUpdatePostBtn = document.getElementById(&#x27;siteUpdatePostBtn&#x27;);
const siteUpdateCancelEditBtn = document.getElementById(&#x27;siteUpdateCancelEditBtn&#x27;);
const siteUpdateCharCount = document.getElementById(&#x27;siteUpdateCharCount&#x27;);
const siteUpdateAdminStatus = document.getElementById(&#x27;siteUpdateAdminStatus&#x27;);
const siteUpdatesList = document.getElementById(&#x27;siteUpdatesList&#x27;);
let siteUpdatesPollTimer = null;
let siteUpdatePosting = false;
let siteUpdateEditingId = null;
let siteUpdateRowsById = new Map();
const chatMessages = document.getElementById(&#x27;chatMessages&#x27;);
const chatInput = document.getElementById(&#x27;chatInput&#x27;);
const chatSendBtn = document.getElementById(&#x27;chatSendBtn&#x27;);
const chatStatus = document.getElementById(&#x27;chatStatus&#x27;);
const chatReplyBar = document.getElementById(&#x27;chatReplyBar&#x27;);
const chatReplyName = document.getElementById(&#x27;chatReplyName&#x27;);
const chatReplyPreview = document.getElementById(&#x27;chatReplyPreview&#x27;);
const chatReplyCancel = document.getElementById(&#x27;chatReplyCancel&#x27;);
const mentionSuggestions = document.getElementById(&#x27;mentionSuggestions&#x27;);

const navNotifications = document.getElementById(&#x27;navNotifications&#x27;);
const notificationBadge = document.getElementById(&#x27;notificationBadge&#x27;);
const notificationPanel = document.getElementById(&#x27;notificationPanel&#x27;);
const notificationList = document.getElementById(&#x27;notificationList&#x27;);
const notificationMarkAll = document.getElementById(&#x27;notificationMarkAll&#x27;);
const pushAlertBtn = document.getElementById(&#x27;pushAlertBtn&#x27;);
const pushAlertState = document.getElementById(&#x27;pushAlertState&#x27;);
const pushInstallHelp = document.getElementById(&#x27;pushInstallHelp&#x27;);

const chatLevelBadge = document.getElementById(&#x27;chatLevelBadge&#x27;);
const chatLevelName = document.getElementById(&#x27;chatLevelName&#x27;);
const chatMessageCount = document.getElementById(&#x27;chatMessageCount&#x27;);
const chatNextLevel = document.getElementById(&#x27;chatNextLevel&#x27;);
const chatXpFill = document.getElementById(&#x27;chatXpFill&#x27;);
const chatAchievements = document.getElementById(&#x27;chatAchievements&#x27;);

const chatProfileOverlay = document.getElementById(&#x27;chatProfileOverlay&#x27;);
const chatProfileClose = document.getElementById(&#x27;chatProfileClose&#x27;);
const chatPublicAvatar = document.getElementById(&#x27;chatPublicAvatar&#x27;);
const chatPublicName = document.getElementById(&#x27;chatPublicName&#x27;);
const chatPublicVipBadge = document.getElementById(&#x27;chatPublicVipBadge&#x27;);
const chatPublicSub = document.getElementById(&#x27;chatPublicSub&#x27;);
const chatPublicLevel = document.getElementById(&#x27;chatPublicLevel&#x27;);
const chatPublicMessages = document.getElementById(&#x27;chatPublicMessages&#x27;);

const chatPublicWorkouts = document.getElementById(&#x27;chatPublicWorkouts&#x27;);
const chatPublicSets = document.getElementById(&#x27;chatPublicSets&#x27;);

const chatPublicCurrentStreak = document.getElementById(&#x27;chatPublicCurrentStreak&#x27;);
const chatPublicBestStreak = document.getElementById(&#x27;chatPublicBestStreak&#x27;);
const chatPublicBio = document.getElementById(&#x27;chatPublicBio&#x27;);
const chatPublicPhysique = document.getElementById(&#x27;chatPublicPhysique&#x27;);
const chatDmBtn = document.getElementById(&#x27;chatDmBtn&#x27;);
const chatModerationArea = document.getElementById(&#x27;chatModerationArea&#x27;);
const chatMuteState = document.getElementById(&#x27;chatMuteState&#x27;);
const chatMuteActionStatus = document.getElementById(&#x27;chatMuteActionStatus&#x27;);
const chatUnmuteBtn = document.getElementById(&#x27;chatUnmuteBtn&#x27;);
const chatPublicPostHistory = document.getElementById(&#x27;chatPublicPostHistory&#x27;);
const chatPublicHistoryCount = document.getElementById(&#x27;chatPublicHistoryCount&#x27;);
let chatIsSiteAdmin = false;
let currentStaffPermissions = {
  is_admin:false,
  chat_moderation:false,
  thread_moderation:false,
  voice_moderation:false
};
let chatReplyTarget = null;
let chatRowsById = new Map();
let notificationPollTimer = null;
let mentionSearchTimer = null;
let mentionCandidates = [];
let selectedMentions = new Map();
let chatAdminCheckedUserId = null;
let openedChatDisplayName = &#x27;Member&#x27;;
let openedChatAvatarUrl = &#x27;&#x27;;

const chatPublicStatus = document.getElementById(&#x27;chatPublicStatus&#x27;);
const chatPublicStaffBadge = document.getElementById(&#x27;chatPublicStaffBadge&#x27;);
const chatFriendArea = document.getElementById(&#x27;chatFriendArea&#x27;);
const chatFriendBtn = document.getElementById(&#x27;chatFriendBtn&#x27;);
const chatBlockBtn = document.getElementById(&#x27;chatBlockBtn&#x27;);
const chatFriendNote = document.getElementById(&#x27;chatFriendNote&#x27;);

let openedChatUserId = null;
let openedFriendship = null;
let openedBlockState = {blocked_by_me:false,blocked_me:false};

let blockedUserIdsCache = new Set();
let blockedUserIdsCacheAt = 0;

const friendsSection = document.getElementById(&#x27;friendsSection&#x27;);
const friendsList = document.getElementById(&#x27;friendsList&#x27;);
const incomingFriendsList = document.getElementById(&#x27;incomingFriendsList&#x27;);
const sentFriendsList = document.getElementById(&#x27;sentFriendsList&#x27;);
const friendsCount = document.getElementById(&#x27;friendsCount&#x27;);
const incomingCount = document.getElementById(&#x27;incomingCount&#x27;);
const sentCount = document.getElementById(&#x27;sentCount&#x27;);
const friendsRefreshBtn = document.getElementById(&#x27;friendsRefreshBtn&#x27;);
const friendsStatus = document.getElementById(&#x27;friendsStatus&#x27;);
const friendSearchInput = document.getElementById(&#x27;friendSearchInput&#x27;);
const friendSearchBtn = document.getElementById(&#x27;friendSearchBtn&#x27;);
const friendSearchResults = document.getElementById(&#x27;friendSearchResults&#x27;);
const friendSearchStatus = document.getElementById(&#x27;friendSearchStatus&#x27;);


const chatPublicAchievements = document.getElementById(&#x27;chatPublicAchievements&#x27;);
const staffAdminPanel = document.getElementById(&#x27;staffAdminPanel&#x27;);
const staffSearchInput = document.getElementById(&#x27;staffSearchInput&#x27;);
const staffSearchBtn = document.getElementById(&#x27;staffSearchBtn&#x27;);
const staffSearchResults = document.getElementById(&#x27;staffSearchResults&#x27;);
const staffMembersList = document.getElementById(&#x27;staffMembersList&#x27;);
const staffRefreshBtn = document.getElementById(&#x27;staffRefreshBtn&#x27;);
const staffPanelStatus = document.getElementById(&#x27;staffPanelStatus&#x27;);
let staffPanelLoadedForUser = null;




let chatPollTimer = null;
let chatSending = false;

function escapeChat(text){
  return String(text ?? &#x27;&#x27;)
    .replaceAll(&#x27;&amp;&#x27;,&#x27;&amp;amp;&#x27;)
    .replaceAll(&#x27;&lt;&#x27;,&#x27;&amp;lt;&#x27;)
    .replaceAll(&#x27;&gt;&#x27;,&#x27;&amp;gt;&#x27;)
    .replaceAll(&#x27;&quot;&#x27;,&#x27;&amp;quot;&#x27;)
    .replaceAll(&quot;&#x27;&quot;,&#x27;&amp;#039;&#x27;);
}


const publicVipCache = new Map();

async function getPublicVipStatus(userId, force=false){
  if(!userId) return false;
  if(!force &amp;&amp; publicVipCache.has(userId)) return publicVipCache.get(userId);

  try{
    const client = window.gymcelsLolDb;
    if(!client) return false;

    const { data, error } = await client.rpc(&#x27;public_member_vip_status&#x27;, {
      target_user: userId
    });

    if(error) throw error;

    const isVip = data === true;
    publicVipCache.set(userId, isVip);
    return isVip;
  }catch(err){
    console.error(&#x27;Public VIP status error:&#x27;, err);
    return false;
  }
}

function vipBadgeMarkup(isVip){
  return isVip ? &#x27;&lt;span class=&quot;chat-vip-badge&quot;&gt;Gymcel VIP 🔱&lt;/span&gt;&#x27; : &#x27;&#x27;;
}


function staffBadgeMarkup(role){
  if(role === &#x27;admin&#x27;) return &#x27;&lt;span class=&quot;staff-badge admin&quot;&gt;Admin&lt;/span&gt;&#x27;;
  if(role === &#x27;moderator&#x27;) return &#x27;&lt;span class=&quot;staff-badge moderator&quot;&gt;Moderator&lt;/span&gt;&#x27;;
  return &#x27;&#x27;;
}

async function loadPublicStaffRoles(userIds){
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if(!ids.length) return {};

  try{
    const client = window.gymcelsLolDb;
    if(!client) return {};

    const {data,error} = await client.rpc(&#x27;public_staff_roles&#x27;,{target_users:ids});
    if(error) throw error;

    return Object.fromEntries((data || []).map(row =&gt; [row.user_id,row.role]));
  }catch(err){
    console.error(&#x27;Staff badge load error:&#x27;,err);
    return {};
  }
}

function canModerateChat(){
  return !!(chatIsSiteAdmin || currentStaffPermissions.chat_moderation);
}
function canModerateThreads(){
  return !!(chatIsSiteAdmin || currentStaffPermissions.thread_moderation);
}
function canModerateVoice(){
  return !!(chatIsSiteAdmin || currentStaffPermissions.voice_moderation);
}

function setStaffPanelStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
  if(!staffPanelStatus) return;
  staffPanelStatus.textContent = text;
  staffPanelStatus.className = `staff-panel-status ${type || &#x27;&#x27;}`;
}

function staffEditorCard(row){
  const isAdmin = row.role === &#x27;admin&#x27;;
  const roleText = isAdmin ? &#x27;Administrator · all permissions&#x27;
    : (row.role === &#x27;moderator&#x27; ? &#x27;Moderator&#x27; : &#x27;Member&#x27;);
  const disabled = isAdmin ? &#x27; disabled&#x27; : &#x27;&#x27;;

  return `&lt;div class=&quot;staff-admin-card&quot; data-staff-user=&quot;${escapeChat(row.user_id || &#x27;&#x27;)}&quot;&gt;
    &lt;div class=&quot;staff-admin-name&quot;&gt;
      ${escapeChat(row.display_name || &#x27;Member&#x27;)}${staffBadgeMarkup(row.role)}
    &lt;/div&gt;
    &lt;div class=&quot;staff-admin-role&quot;&gt;${escapeChat(roleText)}&lt;/div&gt;

    &lt;div class=&quot;staff-permission-grid&quot;&gt;
      &lt;label class=&quot;staff-permission-option&quot;&gt;
        &lt;input type=&quot;checkbox&quot; data-staff-permission=&quot;chat_moderation&quot;
          ${row.chat_moderation || isAdmin ? &#x27;checked&#x27; : &#x27;&#x27;}${disabled}&gt;
        &lt;span&gt;&lt;strong&gt;Public Chat&lt;/strong&gt;&lt;span&gt;Delete messages and mute members from public chat.&lt;/span&gt;&lt;/span&gt;
      &lt;/label&gt;

      &lt;label class=&quot;staff-permission-option&quot;&gt;
        &lt;input type=&quot;checkbox&quot; data-staff-permission=&quot;thread_moderation&quot;
          ${row.thread_moderation || isAdmin ? &#x27;checked&#x27; : &#x27;&#x27;}${disabled}&gt;
        &lt;span&gt;&lt;strong&gt;Threads&lt;/strong&gt;&lt;span&gt;Delete threads/replies and lock or unlock threads.&lt;/span&gt;&lt;/span&gt;
      &lt;/label&gt;

      &lt;label class=&quot;staff-permission-option&quot;&gt;
        &lt;input type=&quot;checkbox&quot; data-staff-permission=&quot;voice_moderation&quot;
          ${row.voice_moderation || isAdmin ? &#x27;checked&#x27; : &#x27;&#x27;}${disabled}&gt;
        &lt;span&gt;&lt;strong&gt;Voice&lt;/strong&gt;&lt;span&gt;Kick members from Gymcel Crew voice rooms.&lt;/span&gt;&lt;/span&gt;
      &lt;/label&gt;
    &lt;/div&gt;

    &lt;div class=&quot;staff-admin-actions&quot;&gt;
      &lt;span class=&quot;staff-admin-note&quot;&gt;
        ${isAdmin ? &#x27;Admin permissions cannot be changed here.&#x27; : &#x27;Uncheck everything and save to remove Moderator.&#x27;}
      &lt;/span&gt;
      ${isAdmin ? &#x27;&#x27; : &#x27;&lt;button class=&quot;staff-admin-save&quot; type=&quot;button&quot; data-save-staff-permissions&gt;Save permissions&lt;/button&gt;&#x27;}
    &lt;/div&gt;
  &lt;/div&gt;`;
}

async function loadCurrentStaffMembers(){
  if(!chatIsSiteAdmin || !staffMembersList) return;

  setStaffPanelStatus(&#x27;Loading moderators...&#x27;);

  try{
    const client = window.gymcelsLolDb;
    const {data,error} = await client.rpc(&#x27;admin_list_staff_members&#x27;);
    if(error) throw error;

    const rows = data || [];
    staffMembersList.innerHTML = rows.length
      ? rows.map(staffEditorCard).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;staff-admin-empty&quot;&gt;No moderators yet.&lt;/div&gt;&#x27;;

    setStaffPanelStatus(&#x27;&#x27;);
  }catch(err){
    staffMembersList.innerHTML = &#x27;&lt;div class=&quot;staff-admin-empty&quot;&gt;Could not load moderators.&lt;/div&gt;&#x27;;
    setStaffPanelStatus(err?.message || String(err),&#x27;error&#x27;);
  }
}

async function searchStaffMembers(){
  if(!chatIsSiteAdmin || !staffSearchResults) return;

  const query = String(staffSearchInput?.value || &#x27;&#x27;).trim();
  if(!query){
    staffSearchResults.innerHTML = &#x27;&lt;div class=&quot;staff-admin-empty&quot;&gt;Type a username first.&lt;/div&gt;&#x27;;
    return;
  }

  staffSearchResults.innerHTML = &#x27;&lt;div class=&quot;staff-admin-empty&quot;&gt;Searching...&lt;/div&gt;&#x27;;

  try{
    const client = window.gymcelsLolDb;
    const {data,error} = await client.rpc(&#x27;admin_search_staff_members&#x27;,{search_text:query});
    if(error) throw error;

    const rows = data || [];
    staffSearchResults.innerHTML = rows.length
      ? rows.map(staffEditorCard).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;staff-admin-empty&quot;&gt;No member found with that username.&lt;/div&gt;&#x27;;
  }catch(err){
    staffSearchResults.innerHTML = &#x27;&lt;div class=&quot;staff-admin-empty&quot;&gt;Search failed.&lt;/div&gt;&#x27;;
    setStaffPanelStatus(err?.message || String(err),&#x27;error&#x27;);
  }
}

async function saveStaffPermissions(card){
  if(!chatIsSiteAdmin || !card) return;

  const userId = card.dataset.staffUser;
  const saveBtn = card.querySelector(&#x27;[data-save-staff-permissions]&#x27;);
  if(!userId || !saveBtn) return;

  const checked = name =&gt; !!card.querySelector(`[data-staff-permission=&quot;${name}&quot;]`)?.checked;

  saveBtn.disabled = true;
  saveBtn.textContent = &#x27;Saving...&#x27;;

  try{
    const client = window.gymcelsLolDb;
    const {error} = await client.rpc(&#x27;set_member_moderator_permissions&#x27;,{
      target_user:userId,
      allow_chat:checked(&#x27;chat_moderation&#x27;),
      allow_threads:checked(&#x27;thread_moderation&#x27;),
      allow_voice:checked(&#x27;voice_moderation&#x27;)
    });
    if(error) throw error;

    setStaffPanelStatus(&#x27;✓ Moderator permissions updated.&#x27;,&#x27;success&#x27;);
    await loadCurrentStaffMembers();
    if(staffSearchInput?.value.trim()) await searchStaffMembers();

    await loadCommunityChat(false);
    await loadThreads();
    if(activeThread) await openThread(activeThread.id);
  }catch(err){
    setStaffPanelStatus(err?.message || String(err),&#x27;error&#x27;);
  }finally{
    saveBtn.disabled = false;
    saveBtn.textContent = &#x27;Save permissions&#x27;;
  }
}

async function refreshStaffPanel(){
  if(!staffAdminPanel) return;

  if(!chatIsSiteAdmin){
    staffAdminPanel.classList.add(&#x27;hidden&#x27;);
    return;
  }

  staffAdminPanel.classList.remove(&#x27;hidden&#x27;);

  const session = await getChatSession();
  if(staffPanelLoadedForUser !== session?.user?.id){
    staffPanelLoadedForUser = session?.user?.id || null;
    await loadCurrentStaffMembers();
  }
}

staffSearchBtn?.addEventListener(&#x27;click&#x27;,searchStaffMembers);
staffSearchInput?.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if(e.key === &#x27;Enter&#x27;){
    e.preventDefault();
    searchStaffMembers();
  }
});
staffRefreshBtn?.addEventListener(&#x27;click&#x27;,loadCurrentStaffMembers);

[staffSearchResults,staffMembersList].forEach(container =&gt; {
  container?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
    const btn = e.target.closest(&#x27;[data-save-staff-permissions]&#x27;);
    if(btn) saveStaffPermissions(btn.closest(&#x27;[data-staff-user]&#x27;));
  });
});


function chatDisplayName(user){
  return user?.user_metadata?.display_name ||
    (user?.email ? user.email.split(&#x27;@&#x27;)[0] : &#x27;Member&#x27;);
}


function chatInitials(name){
  const source = String(name || &#x27;GL&#x27;).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if(parts.length &gt;= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0,2).toUpperCase();
}

function chatAvatarMarkup(row){
  const name = row.display_name || &#x27;Member&#x27;;
  const uid = escapeChat(row.user_id || &#x27;&#x27;);
  const safeName = escapeChat(name);
  const safeAvatar = escapeChat(row.avatar_url || &#x27;&#x27;);
  const onlineClass = row.is_online ? &#x27;online&#x27; : &#x27;&#x27;;

  const avatar = row.avatar_url
    ? `&lt;div class=&quot;chat-avatar&quot; data-chat-user=&quot;${uid}&quot; data-chat-name=&quot;${safeName}&quot; data-chat-avatar=&quot;${safeAvatar}&quot;&gt;&lt;img src=&quot;${safeAvatar}&quot; alt=&quot;${safeName} profile photo&quot;&gt;&lt;/div&gt;`
    : `&lt;div class=&quot;chat-avatar&quot; data-chat-user=&quot;${uid}&quot; data-chat-name=&quot;${safeName}&quot; data-chat-avatar=&quot;&quot;&gt;${escapeChat(chatInitials(name))}&lt;/div&gt;`;

  return `&lt;div class=&quot;chat-avatar-wrap&quot;&gt;${avatar}&lt;span class=&quot;chat-presence-dot ${onlineClass}&quot; title=&quot;${row.is_online ? &#x27;Online&#x27; : &#x27;Offline&#x27;}&quot;&gt;&lt;/span&gt;&lt;/div&gt;`;
}

function setChatStatus(message, type=&#x27;normal&#x27;){
  if(!chatStatus) return;
  chatStatus.textContent = message;
  chatStatus.style.fontWeight = type === &#x27;success&#x27; ? &#x27;900&#x27; : &#x27;700&#x27;;
  chatStatus.style.color =
    type === &#x27;error&#x27; ? &#x27;#ff5a6b&#x27; :
    type === &#x27;success&#x27; ? &#x27;#67e8a5&#x27; :
    &#x27;#9aa1ad&#x27;;
}


function setCommunityChatAuthState(session){
  const signedIn = !!session?.user;

  if(communitySection) communitySection.style.display = &#x27;&#x27;;
  if(communityChat) communityChat.style.display = &#x27;&#x27;;

  if(chatInput){
    chatInput.disabled = !signedIn;
    chatInput.placeholder = signedIn
      ? (chatReplyTarget ? `Reply to ${chatReplyTarget.display_name || &#x27;Member&#x27;}...` : &#x27;Say something to the community...&#x27;)
      : &#x27;Log in to join the conversation...&#x27;;
  }

  if(chatSendBtn){
    chatSendBtn.disabled = !signedIn;
    chatSendBtn.textContent = signedIn ? &#x27;Send&#x27; : &#x27;Log in to send&#x27;;
  }

  if(chatLevelCard){
    chatLevelCard.style.display = signedIn ? &#x27;&#x27; : &#x27;none&#x27;;
  }

  if(!signedIn){
    setChatStatus(&#x27;You can read the public chat. Log in to send a message.&#x27;);
    if(chatStatus) chatStatus.classList.add(&#x27;chat-guest-note&#x27;);
  }else{
    if(chatStatus?.classList) chatStatus.classList.remove(&#x27;chat-guest-note&#x27;);
    if(chatStatus?.textContent === &#x27;You can read the public chat. Log in to send a message.&#x27;){
      chatStatus.textContent = &#x27;&#x27;;
    }
  }

  return signedIn;
}

async function getChatSession(){
  const client = window.gymcelsLolDb;
  if(!client) throw new Error(&#x27;Chat database connection is not ready.&#x27;);
  const { data, error } = await client.auth.getSession();
  if(error) throw error;
  return data?.session || null;
}

async function getMemberBlockState(targetUserId){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user || !targetUserId || targetUserId === session.user.id){
    return {blocked_by_me:false,blocked_me:false};
  }

  try{
    const {data,error} = await client.rpc(&#x27;member_block_state&#x27;,{
      target_user:targetUserId
    });
    if(error) throw error;

    return {
      blocked_by_me:data?.blocked_by_me === true,
      blocked_me:data?.blocked_me === true
    };
  }catch(err){
    console.error(&#x27;Block state error:&#x27;,err);
    return {blocked_by_me:false,blocked_me:false};
  }
}

async function getMyBlockedUserIds(force=false){
  const now = Date.now();

  if(!force &amp;&amp; now - blockedUserIdsCacheAt &lt; 12000){
    return blockedUserIdsCache;
  }

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();

    if(!client || !session?.user){
      blockedUserIdsCache = new Set();
      blockedUserIdsCacheAt = now;
      return blockedUserIdsCache;
    }

    const {data,error} = await client.rpc(&#x27;my_blocked_user_ids&#x27;);
    if(error) throw error;

    blockedUserIdsCache = new Set(
      (data || []).map(row =&gt; String(row.blocked_id || &#x27;&#x27;)).filter(Boolean)
    );
    blockedUserIdsCacheAt = now;
  }catch(err){
    console.error(&#x27;Blocked users load error:&#x27;,err);
  }

  return blockedUserIdsCache;
}

function clearBlockedUserCache(){
  blockedUserIdsCache = new Set();
  blockedUserIdsCacheAt = 0;
}


const CHAT_LEVELS = [
  { level:1, min:0,   next:5 },
  { level:2, min:5,   next:15 },
  { level:3, min:15,  next:30 },
  { level:4, min:30,  next:50 },
  { level:5, min:50,  next:75 },
  { level:6, min:75,  next:100 },
  { level:7, min:100, next:150 },
  { level:8, min:150, next:250 },
  { level:9, min:250, next:500 },
  { level:10,min:500, next:null }
];

const CHAT_ACHIEVEMENTS = [
  { name:&#x27;First Message&#x27;, icon:&#x27;💬&#x27;, test:s =&gt; s.messages &gt;= 1, hint:&#x27;Send 1 public message&#x27; },
  { name:&#x27;Regular&#x27;, icon:&#x27;🔥&#x27;, test:s =&gt; s.messages &gt;= 10, hint:&#x27;Send 10 public messages&#x27; },
  { name:&#x27;Century Club&#x27;, icon:&#x27;💯&#x27;, test:s =&gt; s.messages &gt;= 100, hint:&#x27;Send 100 public messages&#x27; },
  { name:&#x27;Chat Veteran&#x27;, icon:&#x27;🏆&#x27;, test:s =&gt; s.messages &gt;= 250, hint:&#x27;Send 250 public messages&#x27; },
  { name:&#x27;Gymcels Legend&#x27;, icon:&#x27;👑&#x27;, test:s =&gt; s.messages &gt;= 500, hint:&#x27;Send 500 public messages&#x27; },

  { name:&#x27;Thread Starter&#x27;, icon:&#x27;🧵&#x27;, test:s =&gt; s.threads &gt;= 1, hint:&#x27;Create your first thread&#x27; },
  { name:&#x27;Discussion Leader&#x27;, icon:&#x27;📌&#x27;, test:s =&gt; s.threads &gt;= 10, hint:&#x27;Create 10 threads&#x27; },
  { name:&#x27;Helpful Gymcel&#x27;, icon:&#x27;🤝&#x27;, test:s =&gt; s.replies &gt;= 10, hint:&#x27;Post 10 thread replies&#x27; },
  { name:&#x27;Reply Machine&#x27;, icon:&#x27;⚡&#x27;, test:s =&gt; s.replies &gt;= 50, hint:&#x27;Post 50 thread replies&#x27; },

  { name:&#x27;First Workout&#x27;, icon:&#x27;🏋️&#x27;, test:s =&gt; s.workouts &gt;= 1, hint:&#x27;Log your first workout&#x27; },
  { name:&#x27;Gym Regular&#x27;, icon:&#x27;💪&#x27;, test:s =&gt; s.workouts &gt;= 10, hint:&#x27;Log 10 workouts&#x27; },
  { name:&#x27;Iron Addict&#x27;, icon:&#x27;🦾&#x27;, test:s =&gt; s.workouts &gt;= 50, hint:&#x27;Log 50 workouts&#x27; },
  { name:&#x27;100 Sets&#x27;, icon:&#x27;📈&#x27;, test:s =&gt; s.sets &gt;= 100, hint:&#x27;Log 100 workout sets&#x27; },
  { name:&#x27;500 Sets&#x27;, icon:&#x27;🚀&#x27;, test:s =&gt; s.sets &gt;= 500, hint:&#x27;Log 500 workout sets&#x27; },

  { name:&#x27;4 Week Streak&#x27;, icon:&#x27;🔥&#x27;, test:s =&gt; s.bestStreak &gt;= 4, hint:&#x27;Reach a 4-week workout streak&#x27; },
  { name:&#x27;12 Week Streak&#x27;, icon:&#x27;🏅&#x27;, test:s =&gt; s.bestStreak &gt;= 12, hint:&#x27;Reach a 12-week workout streak&#x27; }
];

function normalizedAchievementStats(stats={}){
  return {
    messages:Number(stats.messages || 0),
    threads:Number(stats.threads || 0),
    replies:Number(stats.replies || 0),
    workouts:Number(stats.workouts || 0),
    sets:Number(stats.sets || 0),
    bestStreak:Number(stats.bestStreak || 0)
  };
}

function getChatLevelInfo(count){
  let current = CHAT_LEVELS[0];
  for(const level of CHAT_LEVELS){
    if(count &gt;= level.min) current = level;
  }
  return current;
}

function renderChatAchievements(count,extras={}){
  if(!chatAchievements) return;
  const stats = normalizedAchievementStats({...extras,messages:Number(count || 0)});

  chatAchievements.innerHTML = CHAT_ACHIEVEMENTS.map(a =&gt; {
    const unlocked = !!a.test(stats);
    return `&lt;div class=&quot;chat-achievement ${unlocked ? &#x27;unlocked&#x27; : &#x27;&#x27;}&quot;
                 title=&quot;${escapeChat(unlocked ? &#x27;Unlocked&#x27; : a.hint)}&quot;&gt;
      &lt;span class=&quot;lock&quot;&gt;${unlocked ? a.icon : &#x27;🔒&#x27;}&lt;/span&gt;${escapeChat(a.name)}
    &lt;/div&gt;`;
  }).join(&#x27;&#x27;);
}

async function refreshChatLevel(){
  try{
    const client = window.gymcelsLolDb;
    if(!client) return;

    const session = await getChatSession();
    if(!session?.user) return;

    const { data: stat, error } = await client
      .from(&#x27;chat_stats&#x27;)
      .select(&#x27;lifetime_messages&#x27;)
      .eq(&#x27;user_id&#x27;, session.user.id)
      .maybeSingle();

    if(error) throw error;

    const total = Number(stat?.lifetime_messages || 0);
    const info = getChatLevelInfo(total);

    if(chatLevelBadge) chatLevelBadge.textContent = info.level;
    if(chatLevelName) chatLevelName.textContent = `Community Level ${info.level}`;
    if(chatMessageCount) chatMessageCount.textContent = `${total} message${total === 1 ? &#x27;&#x27; : &#x27;s&#x27;} sent`;

    if(info.next === null){
      if(chatNextLevel) chatNextLevel.textContent = &#x27;MAX LEVEL — Gymcels.lol Legend&#x27;;
      if(chatXpFill) chatXpFill.style.width = &#x27;100%&#x27;;
    }else{
      const needed = Math.max(0, info.next - total);
      if(chatNextLevel) chatNextLevel.textContent =
        `Send ${needed} more message${needed === 1 ? &#x27;&#x27; : &#x27;s&#x27;} to reach Level ${info.level + 1}`;

      const span = info.next - info.min;
      const progress = span &gt; 0 ? ((total - info.min) / span) * 100 : 100;
      if(chatXpFill) chatXpFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }

    const [threadCountRes,replyCountRes,workoutRes,streakRes] = await Promise.all([
      client.from(&#x27;forum_threads&#x27;).select(&#x27;id&#x27;,{count:&#x27;exact&#x27;,head:true}).eq(&#x27;author_id&#x27;,session.user.id),
      client.from(&#x27;forum_replies&#x27;).select(&#x27;id&#x27;,{count:&#x27;exact&#x27;,head:true}).eq(&#x27;author_id&#x27;,session.user.id),
      client.rpc(&#x27;get_public_member_stats&#x27;,{target_user:session.user.id}),
      client.rpc(&#x27;get_public_member_streaks&#x27;,{target_user:session.user.id})
    ]);

    const workoutStats = Array.isArray(workoutRes.data) ? workoutRes.data[0] : workoutRes.data;
    const streakStats = Array.isArray(streakRes.data) ? streakRes.data[0] : streakRes.data;

    renderChatAchievements(total,{
      threads:Number(threadCountRes.count || 0),
      replies:Number(replyCountRes.count || 0),
      workouts:Number(workoutStats?.workouts_logged || 0),
      sets:Number(workoutStats?.sets_logged || 0),
      bestStreak:Number(streakStats?.best_streak || 0)
    });
  } catch(err){
    console.error(&#x27;Chat level error:&#x27;, err);
  }
}



const ONLINE_WINDOW_MS = 120000; // online if seen within the last 2 minutes
let presenceTimer = null;

function isPresenceOnline(lastSeen){
  if(!lastSeen) return false;
  return (Date.now() - new Date(lastSeen).getTime()) &lt;= ONLINE_WINDOW_MS;
}

function renderPublicPresence(lastSeen){
  if(!chatPublicStatus) return;
  const online = isPresenceOnline(lastSeen);
  chatPublicStatus.className = `chat-public-status ${online ? &#x27;online&#x27; : &#x27;offline&#x27;}`;
  chatPublicStatus.innerHTML = `&lt;span class=&quot;status-dot&quot;&gt;&lt;/span&gt;&lt;span&gt;${online ? &#x27;Online&#x27; : &#x27;Offline&#x27;}&lt;/span&gt;`;
}

async function updateOwnPresence(){
  try{
    const client = window.gymcelsLolDb;
    if(!client) return;

    const session = await getChatSession();
    if(!session?.user) return;

    const user = session.user;
    const meta = user.user_metadata || {};

    await client
      .from(&#x27;member_presence&#x27;)
      .upsert({
        user_id: user.id,
        display_name: meta.display_name || (user.email ? user.email.split(&#x27;@&#x27;)[0] : &#x27;Member&#x27;),
        avatar_url: meta.avatar_url || null,
        bio: String(meta.bio || &#x27;&#x27;).slice(0,160),
        last_seen: new Date().toISOString()
      }, { onConflict:&#x27;user_id&#x27; });
  }catch(err){
    console.error(&#x27;Presence heartbeat error:&#x27;, err);
  }
}

function startPresenceHeartbeat(){
  clearInterval(presenceTimer);
  updateOwnPresence();
  presenceTimer = setInterval(updateOwnPresence, 30000);
}

document.addEventListener(&#x27;visibilitychange&#x27;, () =&gt; {
  if(document.visibilityState === &#x27;visible&#x27;) updateOwnPresence();
});


function pinnedFriendStorageKey(ownerUserId){
  return `gymcels_pinned_friends:${ownerUserId || &#x27;guest&#x27;}`;
}

function getPinnedFriendIds(ownerUserId){
  try{
    const raw = localStorage.getItem(pinnedFriendStorageKey(ownerUserId));
    const ids = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(ids) ? ids.filter(Boolean).map(String) : []);
  }catch(_){
    return new Set();
  }
}

function savePinnedFriendIds(ownerUserId, ids){
  try{
    localStorage.setItem(
      pinnedFriendStorageKey(ownerUserId),
      JSON.stringify([...ids].map(String))
    );
  }catch(_){}
}

function isFriendPinned(ownerUserId, friendUserId){
  return getPinnedFriendIds(ownerUserId).has(String(friendUserId || &#x27;&#x27;));
}

function togglePinnedFriend(ownerUserId, friendUserId){
  const friendId = String(friendUserId || &#x27;&#x27;);
  if(!ownerUserId || !friendId) return false;

  const ids = getPinnedFriendIds(ownerUserId);

  if(ids.has(friendId)){
    ids.delete(friendId);
    savePinnedFriendIds(ownerUserId, ids);
    return false;
  }

  ids.add(friendId);
  savePinnedFriendIds(ownerUserId, ids);
  return true;
}

function unpinFriend(ownerUserId, friendUserId){
  const ids = getPinnedFriendIds(ownerUserId);
  const removed = ids.delete(String(friendUserId || &#x27;&#x27;));
  if(removed) savePinnedFriendIds(ownerUserId, ids);
}

function friendOtherUserId(row, me){
  if(!row) return &#x27;&#x27;;
  return row.requester_id === me ? row.addressee_id : row.requester_id;
}

function sortPinnedFirst(items, ownerUserId, idGetter){
  const pins = getPinnedFriendIds(ownerUserId);

  return [...items].sort((a,b) =&gt; {
    const aId = String(idGetter(a) || &#x27;&#x27;);
    const bId = String(idGetter(b) || &#x27;&#x27;);
    const aPinned = pins.has(aId) ? 1 : 0;
    const bPinned = pins.has(bId) ? 1 : 0;

    if(aPinned !== bPinned) return bPinned - aPinned;
    return 0;
  });
}


function friendAvatarMarkup(person, online){
  const name = person?.display_name || &#x27;Member&#x27;;
  const avatar = person?.avatar_url || &#x27;&#x27;;
  const avatarInner = avatar
    ? `&lt;div class=&quot;friend-mini-avatar&quot;&gt;&lt;img src=&quot;${escapeChat(avatar)}&quot; alt=&quot;${escapeChat(name)} profile photo&quot;&gt;&lt;/div&gt;`
    : `&lt;div class=&quot;friend-mini-avatar&quot;&gt;${escapeChat(chatInitials(name))}&lt;/div&gt;`;

  return `&lt;div class=&quot;friend-mini-avatar-wrap&quot;&gt;
    ${avatarInner}
    &lt;span class=&quot;friend-mini-dot ${online ? &#x27;online&#x27; : &#x27;&#x27;}&quot;&gt;&lt;/span&gt;
  &lt;/div&gt;`;
}

async function getPresenceMapForUsers(userIds){
  const client = window.gymcelsLolDb;
  if(!client || !userIds.length) return {};

  const { data, error } = await client
    .from(&#x27;member_presence&#x27;)
    .select(&#x27;user_id,display_name,avatar_url,last_seen&#x27;)
    .in(&#x27;user_id&#x27;, userIds);

  if(error) throw error;

  const map = Object.fromEntries((data || []).map(row =&gt; [row.user_id, row]));

  const vipEntries = await Promise.all(
    userIds.map(async uid =&gt; [uid, await getPublicVipStatus(uid)])
  );

  for(const [uid, isVip] of vipEntries){
    if(!map[uid]) map[uid] = { user_id:uid, display_name:&#x27;Member&#x27;, avatar_url:null, last_seen:null };
    map[uid].is_vip = !!isVip;
  }

  return map;
}

function renderFriendPersonRow(person, extraHtml=&#x27;&#x27;){
  const online = isPresenceOnline(person?.last_seen);
  const userId = escapeChat(person?.user_id || &#x27;&#x27;);
  const name = escapeChat(person?.display_name || &#x27;Member&#x27;);
  const avatar = escapeChat(person?.avatar_url || &#x27;&#x27;);

  return `&lt;div class=&quot;friend-row&quot;&gt;
    &lt;div class=&quot;friend-row-click&quot; data-chat-user=&quot;${userId}&quot; data-chat-name=&quot;${name}&quot; data-chat-avatar=&quot;${avatar}&quot; style=&quot;display:flex;align-items:center;gap:9px;flex:1;min-width:0&quot;&gt;
      ${friendAvatarMarkup(person, online)}
      &lt;div class=&quot;friend-main&quot;&gt;
        &lt;div class=&quot;friend-name&quot;&gt;${name}${person?.is_vip ? &#x27;&lt;span class=&quot;friend-vip-badge&quot;&gt;VIP 🔱&lt;/span&gt;&#x27; : &#x27;&#x27;}&lt;/div&gt;
        &lt;div class=&quot;friend-state ${online ? &#x27;online&#x27; : &#x27;&#x27;}&quot;&gt;${online ? &#x27;Online&#x27; : &#x27;Offline&#x27;}&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    ${extraHtml}
  &lt;/div&gt;`;
}


function setFriendSearchStatus(text=&#x27;&#x27;, type=&#x27;normal&#x27;){
  if(!friendSearchStatus) return;
  friendSearchStatus.textContent = text;
  friendSearchStatus.style.color =
    type === &#x27;error&#x27; ? &#x27;#ff7c89&#x27; :
    type === &#x27;success&#x27; ? &#x27;#67e8a5&#x27; :
    &#x27;#8e96a3&#x27;;
  friendSearchStatus.style.fontWeight = type === &#x27;error&#x27; || type === &#x27;success&#x27; ? &#x27;800&#x27; : &#x27;&#x27;;
}

async function searchFriendsByUsername(){
  if(!friendSearchResults) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setFriendSearchStatus(&#x27;Log in to search for friends.&#x27;,&#x27;error&#x27;);
    return;
  }

  const query = String(friendSearchInput?.value || &#x27;&#x27;).trim();
  if(query.length &lt; 1){
    friendSearchResults.innerHTML = &#x27;&lt;div class=&quot;friend-search-empty&quot;&gt;Type a username first.&lt;/div&gt;&#x27;;
    setFriendSearchStatus(&#x27;&#x27;);
    return;
  }

  if(friendSearchBtn) friendSearchBtn.disabled = true;
  setFriendSearchStatus(&#x27;Searching...&#x27;);

  try{
    const { data, error } = await client
      .from(&#x27;member_presence&#x27;)
      .select(&#x27;user_id,display_name,avatar_url,last_seen&#x27;)
      .ilike(&#x27;display_name&#x27;, `%${query}%`)
      .neq(&#x27;user_id&#x27;, session.user.id)
      .order(&#x27;display_name&#x27;, { ascending:true })
      .limit(10);

    if(error) throw error;

    const blockedIds = await getMyBlockedUserIds();
    const people = (data || []).filter(
      person =&gt; !blockedIds.has(String(person.user_id || &#x27;&#x27;))
    );

    if(!people.length){
      friendSearchResults.innerHTML = &#x27;&lt;div class=&quot;friend-search-empty&quot;&gt;No members found with that username.&lt;/div&gt;&#x27;;
      setFriendSearchStatus(&#x27;&#x27;);
      return;
    }

    const enriched = await Promise.all(
      people.map(async person =&gt; {
        let friendship = null;
        let isVip = false;

        try{ friendship = await getFriendshipState(person.user_id); }catch(_){}
        try{ isVip = await getPublicVipStatus(person.user_id); }catch(_){}

        return {...person, friendship, is_vip:isVip};
      })
    );

    friendSearchResults.innerHTML = enriched.map(person =&gt; {
      const online = isPresenceOnline(person.last_seen);
      const safeId = escapeChat(person.user_id);
      const safeName = escapeChat(person.display_name || &#x27;Member&#x27;);
      const safeAvatar = escapeChat(person.avatar_url || &#x27;&#x27;);

      let actionLabel = &#x27;Add Friend&#x27;;
      let actionClass = &#x27;&#x27;;
      let action = &#x27;add&#x27;;
      let disabled = &#x27;&#x27;;

      if(person.friendship?.status === &#x27;accepted&#x27;){
        actionLabel = &#x27;Friends ✓&#x27;;
        actionClass = &#x27; secondary&#x27;;
        action = &#x27;none&#x27;;
        disabled = &#x27; disabled&#x27;;
      }else if(person.friendship?.status === &#x27;pending&#x27; &amp;&amp; person.friendship.requester_id === session.user.id){
        actionLabel = &#x27;Request Sent&#x27;;
        actionClass = &#x27; secondary&#x27;;
        action = &#x27;none&#x27;;
        disabled = &#x27; disabled&#x27;;
      }else if(person.friendship?.status === &#x27;pending&#x27; &amp;&amp; person.friendship.addressee_id === session.user.id){
        actionLabel = &#x27;Accept&#x27;;
        action = &#x27;accept&#x27;;
      }

      return `
        &lt;div class=&quot;friend-search-result&quot;&gt;
          &lt;div class=&quot;friend-search-result-main&quot;
               data-chat-user=&quot;${safeId}&quot;
               data-chat-name=&quot;${safeName}&quot;
               data-chat-avatar=&quot;${safeAvatar}&quot;&gt;
            ${friendAvatarMarkup(person, online)}
            &lt;div style=&quot;min-width:0;flex:1&quot;&gt;
              &lt;div class=&quot;friend-search-result-name&quot;&gt;${safeName}${person.is_vip ? &#x27;&lt;span class=&quot;friend-vip-badge&quot;&gt;VIP 🔱&lt;/span&gt;&#x27; : &#x27;&#x27;}&lt;/div&gt;
              &lt;div class=&quot;friend-search-result-state&quot;&gt;${online ? &#x27;Online&#x27; : &#x27;Offline&#x27;}&lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;button class=&quot;friend-search-action${actionClass}&quot;
                  type=&quot;button&quot;
                  data-search-friend-action=&quot;${action}&quot;
                  data-search-friend-user=&quot;${safeId}&quot;
                  data-search-friendship-id=&quot;${person.friendship?.id || &#x27;&#x27;}&quot;${disabled}&gt;${actionLabel}&lt;/button&gt;
        &lt;/div&gt;`;
    }).join(&#x27;&#x27;);

    setFriendSearchStatus(`${enriched.length} member${enriched.length === 1 ? &#x27;&#x27; : &#x27;s&#x27;} found.`);
  }catch(err){
    friendSearchResults.innerHTML = &#x27;&lt;div class=&quot;friend-search-empty&quot;&gt;Could not search members.&lt;/div&gt;&#x27;;
    setFriendSearchStatus(err?.message || String(err),&#x27;error&#x27;);
  }finally{
    if(friendSearchBtn) friendSearchBtn.disabled = false;
  }
}

async function handleFriendSearchAction(e){
  const btn = e.target.closest(&#x27;[data-search-friend-action]&#x27;);
  if(!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const action = btn.dataset.searchFriendAction;
  const targetUser = btn.dataset.searchFriendUser;
  const friendshipId = Number(btn.dataset.searchFriendshipId);

  if(!targetUser || action === &#x27;none&#x27;) return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  btn.disabled = true;
  setFriendSearchStatus(action === &#x27;accept&#x27; ? &#x27;Accepting request...&#x27; : &#x27;Sending request...&#x27;);

  try{
    if(action === &#x27;accept&#x27;){
      const { error } = await client.rpc(&#x27;accept_friend_request&#x27;, {
        friendship_id: friendshipId
      });
      if(error) throw error;

      setFriendSearchStatus(&#x27;✓ FRIEND REQUEST ACCEPTED&#x27;,&#x27;success&#x27;);
    }else{
      const { error } = await client.rpc(&#x27;send_friend_request&#x27;, {
        target_user: targetUser
      });
      if(error) throw error;

      setFriendSearchStatus(&#x27;✓ FRIEND REQUEST SENT&#x27;,&#x27;success&#x27;);
    }

    await loadFriendsSection();
    await searchFriendsByUsername();
    await loadNotifications();
  }catch(err){
    setFriendSearchStatus(err?.message || String(err),&#x27;error&#x27;);
    btn.disabled = false;
  }
}

if(friendSearchBtn){
  friendSearchBtn.addEventListener(&#x27;click&#x27;, searchFriendsByUsername);
}

if(friendSearchInput){
  friendSearchInput.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
    if(e.key === &#x27;Enter&#x27;){
      e.preventDefault();
      searchFriendsByUsername();
    }
  });
}

if(friendSearchResults){
  friendSearchResults.addEventListener(&#x27;click&#x27;, handleFriendSearchAction);
}


async function loadFriendsSection(){
  if(!friendsSection) return;

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error(&#x27;Friends database connection is not ready.&#x27;);

    const session = await getChatSession();
    if(!session?.user){
      friendsSection.style.display = &#x27;none&#x27;;
      return;
    }

    friendsSection.style.display = &#x27;&#x27;;
    if(friendsStatus) friendsStatus.textContent = &#x27;Loading...&#x27;;

    const me = session.user.id;

    const { data: rows, error } = await client
      .from(&#x27;friendships&#x27;)
      .select(&#x27;id,requester_id,addressee_id,status,created_at&#x27;)
      .or(`requester_id.eq.${me},addressee_id.eq.${me}`)
      .order(&#x27;created_at&#x27;, { ascending:false });

    if(error) throw error;

    const friendships = rows || [];
    const otherIds = [...new Set(friendships.map(row =&gt;
      row.requester_id === me ? row.addressee_id : row.requester_id
    ).filter(Boolean))];

    const presenceMap = await getPresenceMapForUsers(otherIds);

    const accepted = sortPinnedFirst(
      friendships.filter(row =&gt; row.status === &#x27;accepted&#x27;),
      me,
      row =&gt; friendOtherUserId(row,me)
    );
    const incoming = friendships.filter(row =&gt; row.status === &#x27;pending&#x27; &amp;&amp; row.addressee_id === me);
    const sent = friendships.filter(row =&gt; row.status === &#x27;pending&#x27; &amp;&amp; row.requester_id === me);

    friendsCount.textContent = accepted.length;
    incomingCount.textContent = incoming.length;
    sentCount.textContent = sent.length;

    friendsList.innerHTML = accepted.length
      ? accepted.map(row =&gt; {
          const otherId = row.requester_id === me ? row.addressee_id : row.requester_id;
          const person = presenceMap[otherId] || {user_id:otherId,display_name:&#x27;Member&#x27;,avatar_url:null,last_seen:null};
          const pinned = isFriendPinned(me,otherId);

          return renderFriendPersonRow(
            person,
            `&lt;div class=&quot;friend-actions&quot;&gt;
              &lt;button class=&quot;friend-action pin ${pinned ? &#x27;pinned&#x27; : &#x27;&#x27;}&quot; type=&quot;button&quot;
                data-friend-pin-user=&quot;${escapeChat(otherId)}&quot;
                title=&quot;${pinned ? &#x27;Unpin friend&#x27; : &#x27;Pin friend&#x27;}&quot;&gt;${pinned ? &#x27;📌 Pinned&#x27; : &#x27;📌 Pin&#x27;}&lt;/button&gt;
              &lt;button class=&quot;friend-action&quot; type=&quot;button&quot;
                data-dm-user=&quot;${escapeChat(otherId)}&quot;
                data-dm-name=&quot;${escapeChat(person.display_name || &#x27;Member&#x27;)}&quot;
                data-dm-avatar=&quot;${escapeChat(person.avatar_url || &#x27;&#x27;)}&quot;&gt;Message&lt;/button&gt;
              &lt;button class=&quot;friend-action secondary&quot; type=&quot;button&quot;
                data-friend-remove=&quot;${row.id}&quot;
                data-friend-remove-user=&quot;${escapeChat(otherId)}&quot;&gt;Remove&lt;/button&gt;
            &lt;/div&gt;`
          );
        }).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;friend-empty&quot;&gt;No friends yet. Search a username above or click someone in chat.&lt;/div&gt;&#x27;;

    incomingFriendsList.innerHTML = incoming.length
      ? incoming.map(row =&gt; {
          const person = presenceMap[row.requester_id] || {user_id:row.requester_id,display_name:&#x27;Member&#x27;,avatar_url:null,last_seen:null};
          return renderFriendPersonRow(
            person,
            `&lt;div class=&quot;friend-actions&quot;&gt;
              &lt;button class=&quot;friend-action&quot; type=&quot;button&quot; data-friend-accept=&quot;${row.id}&quot;&gt;Accept&lt;/button&gt;
              &lt;button class=&quot;friend-action secondary&quot; type=&quot;button&quot; data-friend-remove=&quot;${row.id}&quot;&gt;Decline&lt;/button&gt;
            &lt;/div&gt;`
          );
        }).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;friend-empty&quot;&gt;No incoming requests.&lt;/div&gt;&#x27;;

    sentFriendsList.innerHTML = sent.length
      ? sent.map(row =&gt; {
          const person = presenceMap[row.addressee_id] || {user_id:row.addressee_id,display_name:&#x27;Member&#x27;,avatar_url:null,last_seen:null};
          return renderFriendPersonRow(
            person,
            `&lt;div class=&quot;friend-actions&quot;&gt;&lt;button class=&quot;friend-action secondary&quot; type=&quot;button&quot; data-friend-remove=&quot;${row.id}&quot;&gt;Cancel&lt;/button&gt;&lt;/div&gt;`
          );
        }).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;friend-empty&quot;&gt;No pending requests.&lt;/div&gt;&#x27;;

    if(friendsStatus) friendsStatus.textContent = &#x27;&#x27;;
  }catch(err){
    if(friendsStatus){
      friendsStatus.textContent = &#x27;Friends error: &#x27; + (err?.message || String(err));
      friendsStatus.style.color = &#x27;#ff5a6b&#x27;;
    }
    console.error(&#x27;Friends section error:&#x27;, err);
  }
}

async function handleFriendsSectionAction(e){
  const pinBtn = e.target.closest(&#x27;[data-friend-pin-user]&#x27;);
  const acceptBtn = e.target.closest(&#x27;[data-friend-accept]&#x27;);
  const removeBtn = e.target.closest(&#x27;[data-friend-remove]&#x27;);
  if(!pinBtn &amp;&amp; !acceptBtn &amp;&amp; !removeBtn) return;

  e.preventDefault();
  e.stopPropagation();

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error(&#x27;Friends database connection is not ready.&#x27;);

    const session = await getChatSession();
    if(!session?.user) throw new Error(&#x27;Log in first.&#x27;);

    if(pinBtn){
      togglePinnedFriend(session.user.id,pinBtn.dataset.friendPinUser);
      await loadFriendsSection();
      await loadDmFriends();
      return;
    }

    if(acceptBtn){
      const friendshipId = Number(acceptBtn.dataset.friendAccept);
      const { error } = await client.rpc(&#x27;accept_friend_request&#x27;, { friendship_id: friendshipId });
      if(error) throw error;
    }

    if(removeBtn){
      const friendshipId = Number(removeBtn.dataset.friendRemove);
      const removedUserId = removeBtn.dataset.friendRemoveUser || &#x27;&#x27;;
      const { error } = await client.rpc(&#x27;remove_friendship&#x27;, { friendship_id: friendshipId });
      if(error) throw error;

      if(removedUserId){
        unpinFriend(session.user.id,removedUserId);
      }
    }

    await loadFriendsSection();
    await loadDmFriends();
  }catch(err){
    if(friendsStatus){
      friendsStatus.textContent = err?.message || String(err);
      friendsStatus.style.color = &#x27;#ff5a6b&#x27;;
    }
  }
}

[friendsList, incomingFriendsList, sentFriendsList].forEach(list =&gt; {
  if(list) list.addEventListener(&#x27;click&#x27;, handleFriendsSectionAction);
});

if(friendsRefreshBtn){
  friendsRefreshBtn.addEventListener(&#x27;click&#x27;, () =&gt; loadFriendsSection());
}

if(navFriends){
  navFriends.addEventListener(&#x27;click&#x27;, () =&gt; {
    setTimeout(loadFriendsSection, 50);
  });
}

async function getFriendshipState(targetUserId){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user || !targetUserId) return null;

  const { data, error } = await client
    .from(&#x27;friendships&#x27;)
    .select(&#x27;id,requester_id,addressee_id,status,created_at&#x27;)
    .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`)
    .limit(10);

  if(error) throw error;

  return (data || []).find(row =&gt;
    (row.requester_id === session.user.id &amp;&amp; row.addressee_id === targetUserId) ||
    (row.requester_id === targetUserId &amp;&amp; row.addressee_id === session.user.id)
  ) || null;
}

async function renderFriendButton(targetUserId){
  if(!chatFriendBtn || !chatFriendArea) return;

  if(chatDmBtn) chatDmBtn.classList.add(&#x27;hidden&#x27;);
  if(chatBlockBtn) chatBlockBtn.classList.add(&#x27;hidden&#x27;);

  const session = await getChatSession();

  if(!session?.user){
    chatFriendArea.style.display = &#x27;none&#x27;;
    return;
  }

  if(targetUserId === session.user.id){
    chatFriendArea.style.display = &#x27;none&#x27;;
    openedFriendship = null;
    openedBlockState = {blocked_by_me:false,blocked_me:false};
    return;
  }

  chatFriendArea.style.display = &#x27;&#x27;;
  chatFriendNote.textContent = &#x27;&#x27;;
  chatFriendNote.style.color = &#x27;&#x27;;

  openedBlockState = await getMemberBlockState(targetUserId);

  if(chatBlockBtn){
    chatBlockBtn.classList.remove(&#x27;hidden&#x27;);
    chatBlockBtn.textContent = openedBlockState.blocked_by_me ? &#x27;Unblock&#x27; : &#x27;Block&#x27;;
    chatBlockBtn.classList.toggle(&#x27;active&#x27;,openedBlockState.blocked_by_me);
  }

  if(openedBlockState.blocked_by_me || openedBlockState.blocked_me){
    chatFriendBtn.classList.add(&#x27;hidden&#x27;);
    if(chatDmBtn) chatDmBtn.classList.add(&#x27;hidden&#x27;);
    openedFriendship = null;

    chatFriendNote.textContent = openedBlockState.blocked_by_me
      ? &#x27;You blocked this member.&#x27;
      : &#x27;Friend and DM actions are unavailable.&#x27;;
    return;
  }

  chatFriendBtn.classList.remove(&#x27;hidden&#x27;);
  openedFriendship = await getFriendshipState(targetUserId);

  chatFriendBtn.disabled = false;
  chatFriendBtn.classList.remove(&#x27;secondary&#x27;);

  if(!openedFriendship){
    chatFriendBtn.textContent = &#x27;Add Friend&#x27;;
    chatFriendNote.textContent = &#x27;Send a friend request.&#x27;;
    return;
  }

  if(openedFriendship.status === &#x27;accepted&#x27;){
    chatFriendBtn.textContent = &#x27;Friends ✓&#x27;;
    chatFriendBtn.classList.add(&#x27;secondary&#x27;);
    chatFriendNote.textContent = &#x27;Click to remove friend.&#x27;;
    if(chatDmBtn) chatDmBtn.classList.remove(&#x27;hidden&#x27;);
    return;
  }

  if(openedFriendship.requester_id === session.user.id){
    chatFriendBtn.textContent = &#x27;Request Sent&#x27;;
    chatFriendBtn.classList.add(&#x27;secondary&#x27;);
    chatFriendNote.textContent = &#x27;Click to cancel request.&#x27;;
  }else{
    chatFriendBtn.textContent = &#x27;Accept Friend&#x27;;
    chatFriendNote.textContent = &#x27;This member sent you a request.&#x27;;
  }
}

async function handleFriendAction(){
  if(!openedChatUserId || !chatFriendBtn) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  chatFriendBtn.disabled = true;
  chatFriendNote.textContent = &#x27;Updating...&#x27;;

  try{
    if(!openedFriendship){
      const { error } = await client.rpc(&#x27;send_friend_request&#x27;, {
        target_user: openedChatUserId
      });
      if(error) throw error;
    }else if(openedFriendship.status === &#x27;accepted&#x27;){
      const { error } = await client.rpc(&#x27;remove_friendship&#x27;, {
        friendship_id: openedFriendship.id
      });
      if(error) throw error;
    }else if(openedFriendship.addressee_id === session.user.id){
      const { error } = await client.rpc(&#x27;accept_friend_request&#x27;, {
        friendship_id: openedFriendship.id
      });
      if(error) throw error;
    }else{
      const { error } = await client.rpc(&#x27;remove_friendship&#x27;, {
        friendship_id: openedFriendship.id
      });
      if(error) throw error;
    }

    await renderFriendButton(openedChatUserId);
    await loadFriendsSection();
  }catch(err){
    chatFriendNote.textContent = err?.message || String(err);
    chatFriendNote.style.color = &#x27;#ff5a6b&#x27;;
    chatFriendBtn.disabled = false;
  }
}

if(chatFriendBtn){
  chatFriendBtn.addEventListener(&#x27;click&#x27;, handleFriendAction);
}

async function handleBlockAction(){
  if(!openedChatUserId || !chatBlockBtn) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user || openedChatUserId === session.user.id) return;

  const blocking = !openedBlockState.blocked_by_me;
  const name = openedChatDisplayName || &#x27;this member&#x27;;

  if(blocking &amp;&amp; !confirm(
    `Block ${name}? This removes any friendship and stops friend requests, DMs, and private calls between you.`
  )){
    return;
  }

  chatBlockBtn.disabled = true;
  chatFriendNote.textContent = blocking ? &#x27;Blocking...&#x27; : &#x27;Unblocking...&#x27;;

  try{
    const {error} = await client.rpc(
      blocking ? &#x27;block_member&#x27; : &#x27;unblock_member&#x27;,
      {target_user:openedChatUserId}
    );
    if(error) throw error;

    if(blocking){
      try{ unpinFriend(session.user.id,openedChatUserId); }catch(_){}

      if(typeof dmActiveUserId !== &#x27;undefined&#x27; &amp;&amp; dmActiveUserId === openedChatUserId){
        clearInterval(dmPollTimer);
        clearInterval(dmTypingPollTimer);
        clearOwnDmTyping(dmActiveUserId);
        dmActiveUserId = null;
        dmLastRenderConversation = &#x27;&#x27;;
        dmLastRenderSignature = &#x27;&#x27;;
        dmRowsById = new Map();
        clearDmReply();
        clearDmEdit();
        hideDmTypingIndicator();
        dmClearPendingFiles();

        if(dmThreadName) dmThreadName.textContent = &#x27;Select a friend&#x27;;
        if(dmThreadState) dmThreadState.textContent = &#x27;Choose someone from your friends list.&#x27;;
        if(dmMessages) dmMessages.innerHTML = &#x27;&lt;div class=&quot;dm-empty&quot;&gt;This conversation is unavailable while the member is blocked.&lt;/div&gt;&#x27;;
        if(dmInput) dmInput.disabled = true;
        if(dmSendBtn) dmSendBtn.disabled = true;
        if(dmPhotoBtn) dmPhotoBtn.disabled = true;
        if(dmAttachBtn) dmAttachBtn.disabled = true;
        if(dmCallBtn) dmCallBtn.classList.add(&#x27;hidden&#x27;);
      }
    }

    clearBlockedUserCache();
    openedFriendship = null;

    await Promise.allSettled([
      renderFriendButton(openedChatUserId),
      loadFriendsSection(),
      loadDmFriends(),
      loadNotifications(),
      loadCommunityChat(false)
    ]);

    chatFriendNote.textContent = blocking ? &#x27;✓ Member blocked.&#x27; : &#x27;✓ Member unblocked.&#x27;;
  }catch(err){
    chatFriendNote.textContent = err?.message || String(err);
    chatFriendNote.style.color = &#x27;#ff7c89&#x27;;
  }finally{
    chatBlockBtn.disabled = false;
  }
}

chatBlockBtn?.addEventListener(&#x27;click&#x27;,handleBlockAction);


function renderPublicAchievements(count,extras={}){
  if(!chatPublicAchievements) return;
  const stats = normalizedAchievementStats({...extras,messages:Number(count || 0)});

  chatPublicAchievements.innerHTML = CHAT_ACHIEVEMENTS.map(a =&gt; {
    const unlocked = !!a.test(stats);
    return `&lt;div class=&quot;chat-achievement ${unlocked ? &#x27;unlocked&#x27; : &#x27;&#x27;}&quot;
                 title=&quot;${escapeChat(unlocked ? &#x27;Unlocked&#x27; : a.hint)}&quot;&gt;
      &lt;span class=&quot;lock&quot;&gt;${unlocked ? a.icon : &#x27;🔒&#x27;}&lt;/span&gt;${escapeChat(a.name)}
    &lt;/div&gt;`;
  }).join(&#x27;&#x27;);
}


function setChatMuteActionStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
  if(!chatMuteActionStatus) return;
  chatMuteActionStatus.textContent = text;
  chatMuteActionStatus.className = `chat-mute-action-status ${type || &#x27;&#x27;}`;
}

function formatMuteUntil(value){
  if(!value) return &#x27;&#x27;;
  return new Date(value).toLocaleString([],{
    month:&#x27;short&#x27;,day:&#x27;numeric&#x27;,hour:&#x27;numeric&#x27;,minute:&#x27;2-digit&#x27;
  });
}

async function loadProfileMuteControls(targetUserId){
  if(!chatModerationArea) return;

  const session = await getChatSession();
  const mayModerate = !!session?.user &amp;&amp;
    targetUserId !== session.user.id &amp;&amp;
    canModerateChat();

  chatModerationArea.classList.toggle(&#x27;hidden&#x27;,!mayModerate);
  if(!mayModerate) return;

  if(chatMuteState){
    chatMuteState.textContent = &#x27;Checking mute status...&#x27;;
    chatMuteState.classList.remove(&#x27;active&#x27;);
  }
  setChatMuteActionStatus(&#x27;&#x27;);

  try{
    const client = window.gymcelsLolDb;
    const {data,error} = await client.rpc(&#x27;get_chat_mute_status&#x27;,{
      target_user:targetUserId
    });
    if(error) throw error;

    const status = Array.isArray(data) ? data[0] : data;
    if(status?.is_muted){
      chatMuteState.textContent =
        `Muted until ${formatMuteUntil(status.muted_until)}${status.reason ? ` · ${status.reason}` : &#x27;&#x27;}`;
      chatMuteState.classList.add(&#x27;active&#x27;);
    }else{
      chatMuteState.textContent = &#x27;Not muted.&#x27;;
      chatMuteState.classList.remove(&#x27;active&#x27;);
    }
  }catch(err){
    chatMuteState.textContent = err?.message || &#x27;Could not load mute status.&#x27;;
  }
}

async function muteOpenedProfile(durationMinutes){
  if(!openedChatUserId || !canModerateChat()) return;

  const labels={10:&#x27;10 minutes&#x27;,60:&#x27;1 hour&#x27;,1440:&#x27;24 hours&#x27;,10080:&#x27;7 days&#x27;};
  const label=labels[Number(durationMinutes)] || `${durationMinutes} minutes`;

  if(!confirm(`Mute ${openedChatDisplayName || &#x27;this member&#x27;} from public chat for ${label}?`)) return;

  try{
    setChatMuteActionStatus(&#x27;Muting...&#x27;);
    const client=window.gymcelsLolDb;
    const {error}=await client.rpc(&#x27;mute_chat_member&#x27;,{
      target_user:openedChatUserId,
      duration_minutes:Number(durationMinutes),
      mute_reason:&#x27;Muted by Gymcels moderation&#x27;
    });
    if(error) throw error;

    setChatMuteActionStatus(`✓ Muted for ${label}.`,&#x27;success&#x27;);
    await loadProfileMuteControls(openedChatUserId);
  }catch(err){
    setChatMuteActionStatus(err?.message || String(err),&#x27;error&#x27;);
  }
}

async function unmuteOpenedProfile(){
  if(!openedChatUserId || !canModerateChat()) return;

  try{
    setChatMuteActionStatus(&#x27;Unmuting...&#x27;);
    const client=window.gymcelsLolDb;
    const {error}=await client.rpc(&#x27;unmute_chat_member&#x27;,{target_user:openedChatUserId});
    if(error) throw error;

    setChatMuteActionStatus(&#x27;✓ Member unmuted.&#x27;,&#x27;success&#x27;);
    await loadProfileMuteControls(openedChatUserId);
  }catch(err){
    setChatMuteActionStatus(err?.message || String(err),&#x27;error&#x27;);
  }
}

async function loadPublicPostHistory(userId){
  if(!chatPublicPostHistory) return {threads:0,replies:0};

  chatPublicPostHistory.innerHTML=&#x27;&lt;div class=&quot;chat-public-history-empty&quot;&gt;Loading activity...&lt;/div&gt;&#x27;;

  try{
    const client=window.gymcelsLolDb;
    const [threadsRes,repliesRes]=await Promise.all([
      client.from(&#x27;forum_threads&#x27;)
        .select(&#x27;id,title,body,created_at,media_url,media_urls&#x27;)
        .eq(&#x27;author_id&#x27;,userId)
        .order(&#x27;created_at&#x27;,{ascending:false})
        .limit(8),
      client.from(&#x27;forum_replies&#x27;)
        .select(&#x27;id,thread_id,body,created_at,media_url,media_urls&#x27;)
        .eq(&#x27;author_id&#x27;,userId)
        .order(&#x27;created_at&#x27;,{ascending:false})
        .limit(8)
    ]);

    if(threadsRes.error) throw threadsRes.error;
    if(repliesRes.error) throw repliesRes.error;

    const threads=threadsRes.data || [];
    const replies=repliesRes.data || [];
    const parentIds=[...new Set(replies.map(x=&gt;Number(x.thread_id)).filter(Boolean))];
    let titleMap={};

    if(parentIds.length){
      const {data,error}=await client.from(&#x27;forum_threads&#x27;).select(&#x27;id,title&#x27;).in(&#x27;id&#x27;,parentIds);
      if(!error) titleMap=Object.fromEntries((data||[]).map(row=&gt;[Number(row.id),row.title || &#x27;Thread&#x27;]));
    }

    const activity=[
      ...threads.map(row=&gt;({
        type:&#x27;thread&#x27;,thread_id:Number(row.id),created_at:row.created_at,
        title:row.title || &#x27;Thread&#x27;,text:String(row.body || &#x27;&#x27;).trim(),
        hasPhoto:threadAllMedia(row).length&gt;0
      })),
      ...replies.map(row=&gt;({
        type:&#x27;reply&#x27;,thread_id:Number(row.thread_id),created_at:row.created_at,
        title:`Reply in ${titleMap[Number(row.thread_id)] || &#x27;thread&#x27;}`,
        text:String(row.body || &#x27;&#x27;).trim(),hasPhoto:threadAllMedia(row).length&gt;0
      }))
    ].sort((a,b)=&gt;new Date(b.created_at)-new Date(a.created_at)).slice(0,10);

    if(!activity.length){
      chatPublicPostHistory.innerHTML=&#x27;&lt;div class=&quot;chat-public-history-empty&quot;&gt;No thread activity yet.&lt;/div&gt;&#x27;;
    }else{
      chatPublicPostHistory.innerHTML=activity.map(item=&gt;{
        const preview=item.text.replace(/\s+/g,&#x27; &#x27;).trim();
        return `&lt;button class=&quot;chat-public-history-item&quot; type=&quot;button&quot;
                        data-profile-thread-open=&quot;${item.thread_id}&quot;&gt;
          &lt;span class=&quot;chat-public-history-icon&quot;&gt;${item.type === &#x27;thread&#x27; ? &#x27;🧵&#x27; : &#x27;↩️&#x27;}&lt;/span&gt;
          &lt;span class=&quot;chat-public-history-copy&quot;&gt;
            &lt;strong&gt;${escapeChat(item.title)}&lt;/strong&gt;
            &lt;span&gt;${escapeChat(preview || (item.hasPhoto ? &#x27;📷 Photo post&#x27; : &#x27;Open thread&#x27;))}&lt;/span&gt;
          &lt;/span&gt;
          &lt;span class=&quot;chat-public-history-time&quot;&gt;${escapeChat(threadTime(item.created_at))}&lt;/span&gt;
        &lt;/button&gt;`;
      }).join(&#x27;&#x27;);
    }

    const [threadCountRes,replyCountRes]=await Promise.all([
      client.from(&#x27;forum_threads&#x27;).select(&#x27;id&#x27;,{count:&#x27;exact&#x27;,head:true}).eq(&#x27;author_id&#x27;,userId),
      client.from(&#x27;forum_replies&#x27;).select(&#x27;id&#x27;,{count:&#x27;exact&#x27;,head:true}).eq(&#x27;author_id&#x27;,userId)
    ]);

    const counts={
      threads:Number(threadCountRes.count || 0),
      replies:Number(replyCountRes.count || 0)
    };

    if(chatPublicHistoryCount){
      chatPublicHistoryCount.textContent=
        `${counts.threads} thread${counts.threads===1?&#x27;&#x27;:&#x27;s&#x27;} · ${counts.replies} repl${counts.replies===1?&#x27;y&#x27;:&#x27;ies&#x27;}`;
    }

    return counts;
  }catch(err){
    console.error(&#x27;Profile post history error:&#x27;,err);
    chatPublicPostHistory.innerHTML=&#x27;&lt;div class=&quot;chat-public-history-empty&quot;&gt;Could not load recent posts.&lt;/div&gt;&#x27;;
    return {threads:0,replies:0};
  }
}

document.querySelectorAll(&#x27;[data-chat-mute-minutes]&#x27;).forEach(btn=&gt;{
  btn.addEventListener(&#x27;click&#x27;,()=&gt;muteOpenedProfile(Number(btn.dataset.chatMuteMinutes)));
});
chatUnmuteBtn?.addEventListener(&#x27;click&#x27;,unmuteOpenedProfile);

chatPublicPostHistory?.addEventListener(&#x27;click&#x27;,(e)=&gt;{
  const item=e.target.closest(&#x27;[data-profile-thread-open]&#x27;);
  if(!item) return;
  const id=Number(item.dataset.profileThreadOpen);
  if(!id) return;

  closeChatPublicProfile();
  threadsSection?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;});
  setTimeout(()=&gt;openThread(id),180);
});

async function openChatPublicProfile(userId, displayName, avatarUrl){
  if(!userId || !chatProfileOverlay) return;

  openedChatUserId = userId;
  openedFriendship = null;
  openedChatDisplayName = displayName || &#x27;Member&#x27;;
  openedChatAvatarUrl = avatarUrl || &#x27;&#x27;;

  const name = displayName || &#x27;Member&#x27;;
  chatPublicName.textContent = name;
  chatPublicSub.textContent = &#x27;Gymcels.lol Community Member&#x27;;
  if(chatPublicStaffBadge) chatPublicStaffBadge.innerHTML = &#x27;&#x27;;
  if(chatPublicVipBadge) chatPublicVipBadge.classList.remove(&#x27;show&#x27;);

  if(avatarUrl){
    chatPublicAvatar.innerHTML = `&lt;img src=&quot;${escapeChat(avatarUrl)}&quot; alt=&quot;${escapeChat(name)} profile photo&quot;&gt;`;
  }else{
    chatPublicAvatar.textContent = chatInitials(name);
  }

  chatPublicLevel.textContent = &#x27;—&#x27;;
  chatPublicMessages.textContent = &#x27;—&#x27;;
  if(chatPublicWorkouts) chatPublicWorkouts.textContent = &#x27;—&#x27;;
  if(chatPublicSets) chatPublicSets.textContent = &#x27;—&#x27;;
  if(chatPublicCurrentStreak) chatPublicCurrentStreak.textContent = &#x27;—&#x27;;
  if(chatPublicBestStreak) chatPublicBestStreak.textContent = &#x27;—&#x27;;
  if(chatPublicBio){
    chatPublicBio.textContent = &#x27;No bio yet.&#x27;;
    chatPublicBio.classList.add(&#x27;empty&#x27;);
  }
  if(chatPublicPhysique){
    chatPublicPhysique.innerHTML = &#x27;&lt;div class=&quot;chat-public-physique-empty&quot;&gt;No physique photo added yet.&lt;/div&gt;&#x27;;
  }
  chatPublicAchievements.innerHTML = &#x27;&#x27;;
  document.getElementById(&#x27;chatReportUserBtn&#x27;)?.classList.add(&#x27;hidden&#x27;);
  chatBlockBtn?.classList.add(&#x27;hidden&#x27;);
  openedBlockState = {blocked_by_me:false,blocked_me:false};
  if(chatPublicPostHistory){
    chatPublicPostHistory.innerHTML = &#x27;&lt;div class=&quot;chat-public-history-empty&quot;&gt;Loading activity...&lt;/div&gt;&#x27;;
  }
  if(chatPublicHistoryCount) chatPublicHistoryCount.textContent = &#x27;Threads &amp; replies&#x27;;
  chatModerationArea?.classList.add(&#x27;hidden&#x27;);
  setChatMuteActionStatus(&#x27;&#x27;);
  renderPublicPresence(null);

  chatProfileOverlay.classList.add(&#x27;show&#x27;);
  chatProfileOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error(&#x27;Database connection is not ready.&#x27;);

    const viewerSession = await getChatSession();
    if(viewerSession?.user) await refreshChatAdminStatus(viewerSession);

    const chatReportUserBtn = document.getElementById(&#x27;chatReportUserBtn&#x27;);
    if(chatReportUserBtn){
      chatReportUserBtn.classList.toggle(
        &#x27;hidden&#x27;,
        !viewerSession?.user || viewerSession.user.id === userId
      );
    }

    const [statRes, workoutRes, streakRes, presenceRes, isVip, staffRoles, historyStats] = await Promise.all([
      client
        .from(&#x27;chat_stats&#x27;)
        .select(&#x27;lifetime_messages&#x27;)
        .eq(&#x27;user_id&#x27;, userId)
        .maybeSingle(),

      client.rpc(&#x27;get_public_member_stats&#x27;, {
        target_user: userId
      }),

      client.rpc(&#x27;get_public_member_streaks&#x27;, {
        target_user: userId
      }),

      client
        .from(&#x27;member_presence&#x27;)
        .select(&#x27;last_seen,display_name,avatar_url,bio,physique_url&#x27;)
        .eq(&#x27;user_id&#x27;, userId)
        .maybeSingle(),

      getPublicVipStatus(userId, true),
      loadPublicStaffRoles([userId]),
      loadPublicPostHistory(userId)
    ]);

    if(statRes.error) throw statRes.error;
    if(workoutRes.error) throw workoutRes.error;
    if(streakRes.error) throw streakRes.error;
    if(presenceRes.error) throw presenceRes.error;

    if(chatPublicVipBadge) chatPublicVipBadge.classList.toggle(&#x27;show&#x27;, !!isVip);
    if(chatPublicStaffBadge){
      chatPublicStaffBadge.innerHTML = staffBadgeMarkup(staffRoles?.[userId] || null);
    }

    const total = Number(statRes.data?.lifetime_messages || 0);
    const info = getChatLevelInfo(total);
    chatPublicLevel.textContent = info.level;
    chatPublicMessages.textContent = total;
    // Render after workout/thread/streak stats are available.

    const workoutStats = Array.isArray(workoutRes.data)
      ? workoutRes.data[0]
      : workoutRes.data;

    if(chatPublicWorkouts) chatPublicWorkouts.textContent = Number(workoutStats?.workouts_logged || 0);
    if(chatPublicSets) chatPublicSets.textContent = Number(workoutStats?.sets_logged || 0);

    const publicStreak = Array.isArray(streakRes.data)
      ? streakRes.data[0]
      : streakRes.data;

    if(chatPublicCurrentStreak) chatPublicCurrentStreak.textContent = `${Number(publicStreak?.current_streak || 0)} wk`;
    if(chatPublicBestStreak) chatPublicBestStreak.textContent = `${Number(publicStreak?.best_streak || 0)} wk`;

    renderPublicAchievements(total,{
      threads:Number(historyStats?.threads || 0),
      replies:Number(historyStats?.replies || 0),
      workouts:Number(workoutStats?.workouts_logged || 0),
      sets:Number(workoutStats?.sets_logged || 0),
      bestStreak:Number(publicStreak?.best_streak || 0)
    });

    await loadProfileMuteControls(userId);

    if(presenceRes.data){
      renderPublicPresence(presenceRes.data.last_seen);

      // Prefer the latest profile name/photo from presence if available.
      if(presenceRes.data.display_name){
        chatPublicName.textContent = presenceRes.data.display_name;
        openedChatDisplayName = presenceRes.data.display_name;
      }
      if(presenceRes.data.avatar_url){
        chatPublicAvatar.innerHTML = `&lt;img src=&quot;${escapeChat(presenceRes.data.avatar_url)}&quot; alt=&quot;${escapeChat(presenceRes.data.display_name || name)} profile photo&quot;&gt;`;
        openedChatAvatarUrl = presenceRes.data.avatar_url;
      }
      if(chatPublicBio){
        const publicBio = String(presenceRes.data.bio || &#x27;&#x27;).trim();
        chatPublicBio.textContent = publicBio || &#x27;No bio yet.&#x27;;
        chatPublicBio.classList.toggle(&#x27;empty&#x27;, !publicBio);
      }
      if(chatPublicPhysique){
        const physiqueUrl = String(presenceRes.data.physique_url || &#x27;&#x27;).trim();
        chatPublicPhysique.innerHTML = physiqueUrl
          ? `&lt;img src=&quot;${escapeChat(physiqueUrl)}&quot; alt=&quot;${escapeChat(presenceRes.data.display_name || name)} physique photo&quot;&gt;`
          : &#x27;&lt;div class=&quot;chat-public-physique-empty&quot;&gt;No physique photo added yet.&lt;/div&gt;&#x27;;
      }
    }

    await renderFriendButton(userId);
  }catch(err){
    console.error(&#x27;Public chat profile error:&#x27;, err);
    if(chatFriendNote) chatFriendNote.textContent = &#x27;Some profile stats could not load.&#x27;;
    try{ await renderFriendButton(userId); }catch(_){}
  }
}

function closeChatPublicProfile(){
  if(!chatProfileOverlay) return;
  chatProfileOverlay.classList.remove(&#x27;show&#x27;);
  chatProfileOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  openedChatUserId = null;
  openedFriendship = null;
  openedBlockState = {blocked_by_me:false,blocked_me:false};
}

if(chatProfileClose){
  chatProfileClose.addEventListener(&#x27;click&#x27;, closeChatPublicProfile);
}
if(chatProfileOverlay){
  chatProfileOverlay.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    if(e.target === chatProfileOverlay) closeChatPublicProfile();
  });
}
document.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
  if(e.key === &#x27;Escape&#x27;) closeChatPublicProfile();
});




function escapeRegex(text){
  return String(text ?? &#x27;&#x27;).replace(/[.*+?^${}()|[\]\\]/g, &#x27;\\$&amp;&#x27;);
}

function chatTextWithMentions(text){
  let safe = escapeChat(text);

  // Style common @mention-looking tokens without changing stored text.
  safe = safe.replace(/(^|[\s(])@([A-Za-z0-9_.-]{1,30})/g,
    &#x27;$1&lt;span class=&quot;mention-token&quot;&gt;@$2&lt;/span&gt;&#x27;);
  return safe;
}

function mentionInitials(name){
  const s = String(name || &#x27;M&#x27;).trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if(parts.length &gt;= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0,2).toUpperCase();
}

function closeMentionSuggestions(){
  if(mentionSuggestions){
    mentionSuggestions.classList.add(&#x27;hidden&#x27;);
    mentionSuggestions.innerHTML = &#x27;&#x27;;
  }
  mentionCandidates = [];
}

function currentMentionQuery(){
  if(!chatInput) return null;

  const pos = chatInput.selectionStart ?? chatInput.value.length;
  const before = chatInput.value.slice(0, pos);

  // Match the @word currently being typed at the cursor.
  const match = before.match(/(?:^|\s)@([A-Za-z0-9_.-]{0,30})$/);
  if(!match) return null;

  const query = match[1] || &#x27;&#x27;;
  const atIndex = before.lastIndexOf(&#x27;@&#x27;);

  return { query, atIndex, cursor:pos };
}

async function loadMentionSuggestions(){
  const info = currentMentionQuery();
  if(!info){
    closeMentionSuggestions();
    return;
  }

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user){
    closeMentionSuggestions();
    return;
  }

  let request = client
    .from(&#x27;member_presence&#x27;)
    .select(&#x27;user_id,display_name,avatar_url&#x27;)
    .neq(&#x27;user_id&#x27;, session.user.id)
    .order(&#x27;display_name&#x27;, { ascending:true })
    .limit(8);

  if(info.query){
    request = request.ilike(&#x27;display_name&#x27;, `%${info.query}%`);
  }

  const { data, error } = await request;

  if(error){
    console.error(&#x27;Mention suggestions error:&#x27;, error);
    closeMentionSuggestions();
    return;
  }

  const blockedIds = await getMyBlockedUserIds();
  mentionCandidates = (data || []).filter(
    x =&gt; x.user_id &amp;&amp; x.display_name &amp;&amp; !blockedIds.has(String(x.user_id))
  );

  if(!mentionCandidates.length){
    closeMentionSuggestions();
    return;
  }

  mentionSuggestions.innerHTML = mentionCandidates.map((person, index) =&gt; {
    const avatar = person.avatar_url
      ? `&lt;span class=&quot;mention-avatar&quot;&gt;&lt;img src=&quot;${escapeChat(person.avatar_url)}&quot; alt=&quot;&quot;&gt;&lt;/span&gt;`
      : `&lt;span class=&quot;mention-avatar&quot;&gt;${escapeChat(mentionInitials(person.display_name))}&lt;/span&gt;`;

    return `&lt;button class=&quot;mention-option ${index === 0 ? &#x27;active&#x27; : &#x27;&#x27;}&quot;
                    type=&quot;button&quot;
                    data-mention-index=&quot;${index}&quot;&gt;
              ${avatar}
              &lt;span&gt;
                &lt;span class=&quot;mention-name&quot;&gt;@${escapeChat(person.display_name)}&lt;/span&gt;
                &lt;span class=&quot;mention-help&quot;&gt;Mention this member&lt;/span&gt;
              &lt;/span&gt;
            &lt;/button&gt;`;
  }).join(&#x27;&#x27;);

  mentionSuggestions.classList.remove(&#x27;hidden&#x27;);
}

function chooseMention(person){
  if(!person || !chatInput) return;

  const info = currentMentionQuery();
  if(!info) return;

  const before = chatInput.value.slice(0, info.atIndex);
  const after = chatInput.value.slice(info.cursor);
  const mentionText = `@${person.display_name}`;

  chatInput.value = before + mentionText + &#x27; &#x27; + after;

  const newCursor = (before + mentionText + &#x27; &#x27;).length;
  chatInput.setSelectionRange(newCursor, newCursor);
  chatInput.focus();

  selectedMentions.set(person.user_id, {
    user_id: person.user_id,
    display_name: person.display_name
  });

  closeMentionSuggestions();
}

function activeMentionUserIds(messageText){
  const text = String(messageText || &#x27;&#x27;);

  return [...selectedMentions.values()]
    .filter(person =&gt; text.toLowerCase().includes(`@${String(person.display_name || &#x27;&#x27;).toLowerCase()}`))
    .map(person =&gt; person.user_id)
    .filter(Boolean)
    .slice(0, 8);
}

function clearChatReply(){
  chatReplyTarget = null;
  if(chatReplyBar) chatReplyBar.classList.add(&#x27;hidden&#x27;);
  if(chatReplyName) chatReplyName.textContent = &#x27;Member&#x27;;
  if(chatReplyPreview) chatReplyPreview.textContent = &#x27;&#x27;;
}

function beginChatReply(row){
  if(!row || !row.id) return;

  chatReplyTarget = row;
  if(chatReplyName) chatReplyName.textContent = row.display_name || &#x27;Member&#x27;;
  if(chatReplyPreview){
    const preview = String(row.message || &#x27;&#x27;).replace(/\s+/g,&#x27; &#x27;).trim();
    chatReplyPreview.textContent = preview.length &gt; 110 ? preview.slice(0,110) + &#x27;…&#x27; : preview;
  }
  if(chatReplyBar) chatReplyBar.classList.remove(&#x27;hidden&#x27;);

  if(chatInput){
    chatInput.focus();
    chatInput.placeholder = `Reply to ${row.display_name || &#x27;Member&#x27;}...`;
  }
}

function jumpToChatMessage(messageId){
  const el = chatMessages?.querySelector(`[data-message-id=&quot;${Number(messageId)}&quot;]`);
  if(!el) return false;

  el.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
  el.classList.remove(&#x27;reply-highlight&#x27;);
  void el.offsetWidth;
  el.classList.add(&#x27;reply-highlight&#x27;);
  return true;
}

function setNotificationBadge(count){
  if(!notificationBadge) return;
  const n = Math.max(0, Number(count) || 0);
  notificationBadge.textContent = n &gt; 99 ? &#x27;99+&#x27; : String(n);
  notificationBadge.classList.toggle(&#x27;hidden&#x27;, n === 0);
}

function notificationTime(value){
  if(!value) return &#x27;&#x27;;
  const d = new Date(value);
  const diff = Date.now() - d.getTime();
  if(diff &lt; 60000) return &#x27;now&#x27;;
  if(diff &lt; 3600000) return `${Math.floor(diff/60000)}m`;
  if(diff &lt; 86400000) return `${Math.floor(diff/3600000)}h`;
  return d.toLocaleDateString(undefined,{month:&#x27;short&#x27;,day:&#x27;numeric&#x27;});
}


// ---- Phone / desktop push notifications ----
const GYMCELS_VAPID_PUBLIC_KEY = &#x27;BD93jX_6gNDvbZrcKXfL6ml4p2mBjG-fccjPu4VEtllqmqCTcpDu3vmkBD8TvcE2crY1zt60YPIuPpgd_bkxorE&#x27;;

function pushUrlBase64ToUint8Array(base64String){
  const padding = &#x27;=&#x27;.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g,&#x27;+&#x27;).replace(/_/g,&#x27;/&#x27;);
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(ch =&gt; ch.charCodeAt(0)));
}

async function getGymcelsServiceWorker(){
  if(!(&#x27;serviceWorker&#x27; in navigator)) throw new Error(&#x27;Service workers are not supported in this browser.&#x27;);

  const registration = await navigator.serviceWorker.register(&#x27;/sw.js&#x27;,{
    scope:&#x27;/&#x27;,
    updateViaCache:&#x27;none&#x27;
  });

  // Force an update check whenever Gymcels opens, including Home Screen installs.
  try{ await registration.update(); }catch(_){}

  await navigator.serviceWorker.ready;
  return registration;
}

async function currentPushSubscription(){
  if(!(&#x27;serviceWorker&#x27; in navigator) || !(&#x27;PushManager&#x27; in window)) return null;
  try{
    const registration = await getGymcelsServiceWorker();
    return await registration.pushManager.getSubscription();
  }catch(_){
    return null;
  }
}

function getGymcelsPushDeviceId(){
  const key = &#x27;gymcels_push_device_id&#x27;;
  let id = &#x27;&#x27;;

  try{
    id = localStorage.getItem(key) || &#x27;&#x27;;
  }catch(_){}

  if(!id){
    id = (crypto?.randomUUID?.() || `device-${Date.now()}-${Math.random().toString(36).slice(2)}`);

    try{
      localStorage.setItem(key,id);
    }catch(_){}
  }

  return id;
}

async function savePushSubscription(subscription){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) throw new Error(&#x27;Log in first.&#x27;);

  const json = subscription.toJSON();
  const endpoint = json.endpoint || subscription.endpoint;
  const p256dh = json.keys?.p256dh || &#x27;&#x27;;
  const auth = json.keys?.auth || &#x27;&#x27;;

  if(!endpoint || !p256dh || !auth) throw new Error(&#x27;Browser push subscription is incomplete.&#x27;);

  const {error} = await client.rpc(&#x27;save_my_push_subscription&#x27;,{
    sub_endpoint:endpoint,
    sub_p256dh:p256dh,
    sub_auth:auth,
    sub_user_agent:navigator.userAgent.slice(0,500),
    sub_device_id:getGymcelsPushDeviceId()
  });

  if(error) throw error;
}

async function removePushSubscription(subscription){
  const client = window.gymcelsLolDb;
  if(!client || !subscription) return;

  try{
    await client.rpc(&#x27;remove_my_push_subscription&#x27;,{sub_endpoint:subscription.endpoint});
  }catch(_){}

  try{ await subscription.unsubscribe(); }catch(_){}
}


function isGymcelsIosDevice(){
  const ua = navigator.userAgent || &#x27;&#x27;;
  const classicIos = /iPhone|iPad|iPod/i.test(ua);
  const ipadDesktopMode = navigator.platform === &#x27;MacIntel&#x27; &amp;&amp; navigator.maxTouchPoints &gt; 1;
  return classicIos || ipadDesktopMode;
}

function isGymcelsStandaloneApp(){
  return window.matchMedia?.(&#x27;(display-mode: standalone)&#x27;).matches === true ||
         navigator.standalone === true;
}

function showGymcelsIosInstallHelp(){
  pushInstallHelp?.classList.remove(&#x27;hidden&#x27;);

  if(pushAlertState){
    pushAlertState.textContent = &#x27;Follow the steps below, then reopen Gymcels from your Home Screen.&#x27;;
    pushAlertState.className = &#x27;blocked&#x27;;
  }

  if(pushAlertBtn){
    pushAlertBtn.disabled = false;
    pushAlertBtn.textContent = &#x27;Add to Home Screen&#x27;;
    pushAlertBtn.classList.remove(&#x27;off&#x27;);
  }
}

async function refreshPushButton(){
  if(!pushAlertBtn || !pushAlertState) return;

  pushInstallHelp?.classList.add(&#x27;hidden&#x27;);

  const session = await getChatSession().catch(() =&gt; null);
  if(!session?.user){
    pushAlertBtn.disabled = true;
    pushAlertBtn.textContent = &#x27;Log in first&#x27;;
    pushAlertBtn.classList.remove(&#x27;off&#x27;);
    pushAlertState.textContent = &#x27;Log in to enable&#x27;;
    pushAlertState.className = &#x27;&#x27;;
    return;
  }

  // iPhone/iPad Safari only allows web push from a Home Screen web app.
  // Give people clear setup instructions instead of a vague unsupported-browser error.
  if(isGymcelsIosDevice() &amp;&amp; !isGymcelsStandaloneApp()){
    pushAlertBtn.disabled = false;
    pushAlertBtn.textContent = &#x27;Enable phone alerts&#x27;;
    pushAlertBtn.classList.remove(&#x27;off&#x27;);
    pushAlertState.textContent = &#x27;Add Gymcels to your Home Screen to enable notifications.&#x27;;
    pushAlertState.className = &#x27;blocked&#x27;;
    return;
  }

  if(!(&#x27;Notification&#x27; in window) || !(&#x27;serviceWorker&#x27; in navigator) || !(&#x27;PushManager&#x27; in window)){
    pushAlertBtn.disabled = true;
    pushAlertBtn.textContent = &#x27;Not available&#x27;;
    pushAlertState.textContent = &#x27;Notifications are not available in this browser.&#x27;;
    pushAlertState.className = &#x27;blocked&#x27;;
    return;
  }

  if(Notification.permission === &#x27;denied&#x27;){
    pushAlertBtn.disabled = true;
    pushAlertBtn.textContent = &#x27;Blocked&#x27;;
    pushAlertState.textContent = &#x27;Allow notifications in browser/site settings&#x27;;
    pushAlertState.className = &#x27;blocked&#x27;;
    return;
  }

  const sub = await currentPushSubscription();
  const hasLocalSubscription = Notification.permission === &#x27;granted&#x27; &amp;&amp; !!sub;

  // Important: Safari/iPhone can already have a local push subscription even if
  // it was created before Supabase push_subscriptions existed. Re-save it here
  // so &quot;enabled&quot; also means the server actually knows about this device.
  if(hasLocalSubscription){
    try{
      await savePushSubscription(sub);

      pushAlertBtn.disabled = false;
      pushAlertBtn.textContent = &#x27;Disable phone alerts&#x27;;
      pushAlertBtn.classList.add(&#x27;off&#x27;);
      pushAlertState.textContent = &#x27;On — device registered for push&#x27;;
      pushAlertState.className = &#x27;on&#x27;;
      return;
    }catch(err){
      console.error(&#x27;Push subscription sync failed:&#x27;,err);
      pushAlertBtn.disabled = false;
      pushAlertBtn.textContent = &#x27;Repair phone alerts&#x27;;
      pushAlertBtn.classList.remove(&#x27;off&#x27;);
      pushAlertState.textContent = &#x27;Needs repair — tap to register this device&#x27;;
      pushAlertState.className = &#x27;blocked&#x27;;
      return;
    }
  }

  pushAlertBtn.disabled = false;
  pushAlertBtn.textContent = &#x27;Enable phone alerts&#x27;;
  pushAlertBtn.classList.remove(&#x27;off&#x27;);
  pushAlertState.textContent = &#x27;Off&#x27;;
  pushAlertState.className = &#x27;&#x27;;
}

async function enableGymcelsPush(){
  const session = await getChatSession();
  if(!session?.user) throw new Error(&#x27;Log in first.&#x27;);

  const permission = await Notification.requestPermission();
  if(permission !== &#x27;granted&#x27;){
    throw new Error(permission === &#x27;denied&#x27;
      ? &#x27;Notifications were blocked. Allow them in your browser/site settings.&#x27;
      : &#x27;Notification permission was not granted.&#x27;);
  }

  const registration = await getGymcelsServiceWorker();

  let subscription = await registration.pushManager.getSubscription();
  if(!subscription){
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:pushUrlBase64ToUint8Array(GYMCELS_VAPID_PUBLIC_KEY)
    });
  }

  await savePushSubscription(subscription);
}

async function toggleGymcelsPush(){
  if(!pushAlertBtn) return;

  if(isGymcelsIosDevice() &amp;&amp; !isGymcelsStandaloneApp()){
    showGymcelsIosInstallHelp();
    return;
  }

  pushAlertBtn.disabled = true;

  try{
    const sub = await currentPushSubscription();
    const repairing = pushAlertBtn.textContent.includes(&#x27;Repair&#x27;);

    if(repairing &amp;&amp; sub){
      await savePushSubscription(sub);
    }else if(Notification.permission === &#x27;granted&#x27; &amp;&amp; sub){
      await removePushSubscription(sub);
    }else{
      await enableGymcelsPush();
    }
  }catch(err){
    console.error(&#x27;Push setup error:&#x27;,err);
    if(pushAlertState){
      pushAlertState.textContent = err?.message || String(err);
      pushAlertState.className = &#x27;blocked&#x27;;
    }
  }finally{
    await refreshPushButton();
  }
}

if(pushAlertBtn){
  pushAlertBtn.addEventListener(&#x27;click&#x27;,toggleGymcelsPush);
}

if(&#x27;serviceWorker&#x27; in navigator){
  window.addEventListener(&#x27;load&#x27;,() =&gt; {
    getGymcelsServiceWorker().catch(err =&gt; console.warn(&#x27;Service worker registration:&#x27;,err));
  });
}

document.addEventListener(&#x27;visibilitychange&#x27;,() =&gt; {
  if(document.visibilityState === &#x27;visible&#x27;) refreshPushButton();
});

async function loadNotifications(){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    if(navNotifications) navNotifications.classList.add(&#x27;hidden&#x27;);
    if(notificationPanel) notificationPanel.classList.add(&#x27;hidden&#x27;);
    setNotificationBadge(0);
    return;
  }

  if(navNotifications) navNotifications.classList.remove(&#x27;hidden&#x27;);

  const { data, error } = await client
    .from(&#x27;notifications&#x27;)
    .select(&#x27;id,actor_id,actor_display_name,type,message_id,reply_to_id,thread_id,preview,is_read,created_at&#x27;)
    .order(&#x27;created_at&#x27;,{ascending:false})
    .limit(30);

  if(error){
    console.error(&#x27;Notification load error:&#x27;, error);
    return;
  }

  let rows = data || [];
  const blockedIds = await getMyBlockedUserIds();
  rows = rows.filter(n =&gt; !blockedIds.has(String(n.actor_id || &#x27;&#x27;)));

  setNotificationBadge(rows.filter(n =&gt; !n.is_read).length);

  if(!notificationList) return;

  if(!rows.length){
    notificationList.innerHTML = &#x27;&lt;div class=&quot;notification-empty&quot;&gt;No notifications yet.&lt;/div&gt;&#x27;;
    return;
  }

  notificationList.innerHTML = rows.map(n =&gt; {
    const preview = String(n.preview || &#x27;&#x27;).replace(/\s+/g,&#x27; &#x27;).trim();
    let icon = &#x27;🔔&#x27;;
    let copy = &#x27;sent you a notification.&#x27;;

    if(n.type === &#x27;reply&#x27;){
      icon = &#x27;↩&#x27;;
      copy = preview
        ? `replied: “${preview.length &gt; 120 ? preview.slice(0,120) + &#x27;…&#x27; : preview}”`
        : &#x27;replied to your message.&#x27;;
    }else if(n.type === &#x27;mention&#x27;){
      icon = &#x27;@&#x27;;
      copy = preview
        ? `mentioned you: “${preview.length &gt; 120 ? preview.slice(0,120) + &#x27;…&#x27; : preview}”`
        : &#x27;mentioned you in chat.&#x27;;
    }else if(n.type === &#x27;friend_request&#x27;){
      icon = &#x27;👤&#x27;;
      copy = &#x27;sent you a friend request.&#x27;;
    }else if(n.type === &#x27;friend_accepted&#x27;){
      icon = &#x27;✓&#x27;;
      copy = &#x27;accepted your friend request.&#x27;;
    }else if(n.type === &#x27;dm&#x27;){
      icon = &#x27;✉&#x27;;
      copy = preview
        ? `sent you a DM: “${preview.length &gt; 120 ? preview.slice(0,120) + &#x27;…&#x27; : preview}”`
        : &#x27;sent you a direct message.&#x27;;
    }else if(n.type === &#x27;thread_reply&#x27;){
      icon = &#x27;💬&#x27;;
      const directThreadReplyPrefix = &#x27;__reply_to_user__&#x27;;
      const directToUser = preview.startsWith(directThreadReplyPrefix);
      const cleanThreadPreview = directToUser
        ? preview.slice(directThreadReplyPrefix.length).trim()
        : preview;

      copy = directToUser
        ? (cleanThreadPreview
            ? `replied to you in a thread: “${cleanThreadPreview.length &gt; 120 ? cleanThreadPreview.slice(0,120) + &#x27;…&#x27; : cleanThreadPreview}”`
            : &#x27;replied to you in a thread.&#x27;)
        : (cleanThreadPreview
            ? `replied to your thread: “${cleanThreadPreview.length &gt; 120 ? cleanThreadPreview.slice(0,120) + &#x27;…&#x27; : cleanThreadPreview}”`
            : &#x27;replied to your thread.&#x27;);
    }else if(n.type === &#x27;incoming_call&#x27;){
      icon = &#x27;📞&#x27;;
      copy = &#x27;is calling you privately.&#x27;;
    }

    return `
      &lt;button class=&quot;notification-item ${n.is_read ? &#x27;&#x27; : &#x27;unread&#x27;}&quot;
              type=&quot;button&quot;
              data-notification-id=&quot;${n.id}&quot;
              data-notification-message=&quot;${n.message_id || &#x27;&#x27;}&quot;
              data-notification-type=&quot;${escapeChat(n.type || &#x27;&#x27;)}&quot;
              data-notification-actor=&quot;${escapeChat(n.actor_id || &#x27;&#x27;)}&quot;
              data-notification-thread=&quot;${n.thread_id || &#x27;&#x27;}&quot;&gt;
        &lt;div class=&quot;notification-item-top&quot;&gt;
          &lt;span class=&quot;notification-item-name&quot;&gt;&lt;span class=&quot;notification-item-icon&quot;&gt;${icon}&lt;/span&gt;${escapeChat(n.actor_display_name || &#x27;Member&#x27;)}&lt;/span&gt;
          &lt;span class=&quot;notification-item-time&quot;&gt;${escapeChat(notificationTime(n.created_at))}&lt;/span&gt;
        &lt;/div&gt;
        &lt;div class=&quot;notification-item-copy&quot;&gt;${escapeChat(copy)}&lt;/div&gt;
      &lt;/button&gt;`;
  }).join(&#x27;&#x27;);
}

async function markNotificationRead(notificationId){
  const client = window.gymcelsLolDb;
  if(!client || !notificationId) return;
  const { error } = await client.rpc(&#x27;mark_notification_read&#x27;, {
    target_notification_id: Number(notificationId)
  });
  if(error) console.error(&#x27;Mark notification read error:&#x27;, error);
}

async function markAllNotificationsRead(){
  const client = window.gymcelsLolDb;
  if(!client) return;
  const { error } = await client.rpc(&#x27;mark_all_notifications_read&#x27;);
  if(error){
    console.error(&#x27;Mark all notifications error:&#x27;, error);
    return;
  }
  await loadNotifications();
}

function startNotifications(session){
  clearInterval(notificationPollTimer);
  setTimeout(refreshPushButton,100);

  if(!session?.user){
    if(navNotifications) navNotifications.classList.add(&#x27;hidden&#x27;);
    if(notificationPanel) notificationPanel.classList.add(&#x27;hidden&#x27;);
    setNotificationBadge(0);
    return;
  }

  if(navNotifications) navNotifications.classList.remove(&#x27;hidden&#x27;);
  loadNotifications();
  notificationPollTimer = setInterval(loadNotifications, 8000);
}

async function refreshChatAdminStatus(session){
  const client = window.gymcelsLolDb;

  if(!client || !session?.user){
    chatIsSiteAdmin = false;
    currentStaffPermissions = {
      is_admin:false,
      chat_moderation:false,
      thread_moderation:false,
      voice_moderation:false
    };
    chatAdminCheckedUserId = null;
    staffPanelLoadedForUser = null;
    staffAdminPanel?.classList.add(&#x27;hidden&#x27;);
    return false;
  }

  if(chatAdminCheckedUserId === session.user.id){
    return chatIsSiteAdmin;
  }

  try{
    const [adminRes,permissionsRes] = await Promise.all([
      client.rpc(&#x27;is_site_admin&#x27;),
      client.rpc(&#x27;my_staff_permissions&#x27;)
    ]);

    if(adminRes.error) throw adminRes.error;
    if(permissionsRes.error) throw permissionsRes.error;

    chatIsSiteAdmin = adminRes.data === true;
    const p = permissionsRes.data || {};

    currentStaffPermissions = {
      is_admin:chatIsSiteAdmin || p.is_admin === true,
      chat_moderation:chatIsSiteAdmin || p.chat_moderation === true,
      thread_moderation:chatIsSiteAdmin || p.thread_moderation === true,
      voice_moderation:chatIsSiteAdmin || p.voice_moderation === true
    };

    chatAdminCheckedUserId = session.user.id;
    await refreshStaffPanel();
  }catch(err){
    chatIsSiteAdmin = false;
    currentStaffPermissions = {
      is_admin:false,
      chat_moderation:false,
      thread_moderation:false,
      voice_moderation:false
    };
    chatAdminCheckedUserId = session.user.id;
    staffAdminPanel?.classList.add(&#x27;hidden&#x27;);
    console.error(&#x27;Staff status check failed:&#x27;, err);
  }

  return chatIsSiteAdmin;
}


// ---- Reactions: chat messages, threads, and thread replies ----
const GYMCELS_REACTIONS = [&#x27;❤️&#x27;,&#x27;🔥&#x27;,&#x27;💪&#x27;,&#x27;⬆️&#x27;,&#x27;👍&#x27;,&#x27;👎&#x27;];

async function loadReactionState(targetType, targetIds, currentUserId=null){
  const ids = [...new Set((targetIds || []).map(Number).filter(Boolean))];
  const state = {};

  ids.forEach(id =&gt; {
    state[id] = {counts:{}, mine:null};
    GYMCELS_REACTIONS.forEach(reaction =&gt; {
      state[id].counts[reaction] = 0;
    });
  });

  if(!ids.length) return state;

  const client = window.gymcelsLolDb;
  if(!client) return state;

  const {data,error} = await client
    .from(&#x27;content_reactions&#x27;)
    .select(&#x27;target_id,user_id,reaction&#x27;)
    .eq(&#x27;target_type&#x27;,targetType)
    .in(&#x27;target_id&#x27;,ids);

  if(error){
    console.error(&#x27;Reaction load error:&#x27;,error);
    return state;
  }

  (data || []).forEach(row =&gt; {
    const id = Number(row.target_id);
    if(!state[id]) return;

    const reaction = String(row.reaction || &#x27;&#x27;);
    if(GYMCELS_REACTIONS.includes(reaction)){
      state[id].counts[reaction] = Number(state[id].counts[reaction] || 0) + 1;
      if(currentUserId &amp;&amp; row.user_id === currentUserId){
        state[id].mine = reaction;
      }
    }
  });

  return state;
}

function reactionBarHtml(targetType,targetId,reactionState={},extraClass=&#x27;&#x27;){
  const counts = reactionState?.counts || {};
  const mine = reactionState?.mine || &#x27;&#x27;;

  const usedReactions = GYMCELS_REACTIONS
    .filter(reaction =&gt; Number(counts[reaction] || 0) &gt; 0)
    .map(reaction =&gt; {
      const count = Number(counts[reaction] || 0);
      const mineClass = mine === reaction ? &#x27; mine&#x27; : &#x27;&#x27;;

      return `&lt;span class=&quot;reaction-summary-chip${mineClass}&quot; title=&quot;${count} reaction${count === 1 ? &#x27;&#x27; : &#x27;s&#x27;}&quot;&gt;
        &lt;span&gt;${reaction}&lt;/span&gt;
        &lt;span&gt;${count}&lt;/span&gt;
      &lt;/span&gt;`;
    }).join(&#x27;&#x27;);

  return `&lt;div class=&quot;reaction-bar ${extraClass}&quot; data-reaction-bar=&quot;${escapeChat(targetType)}:${Number(targetId)}&quot;&gt;
    &lt;div class=&quot;reaction-control&quot;&gt;
      &lt;button
        class=&quot;reaction-toggle ${mine ? &#x27;has-reaction&#x27; : &#x27;&#x27;}&quot;
        type=&quot;button&quot;
        data-reaction-toggle
        aria-expanded=&quot;false&quot;&gt;
        ${mine ? `${mine} Reacted` : &#x27;React&#x27;}
      &lt;/button&gt;

      &lt;div class=&quot;reaction-picker hidden&quot; role=&quot;menu&quot;&gt;
        ${GYMCELS_REACTIONS.map(reaction =&gt; {
          const count = Number(counts[reaction] || 0);
          const active = mine === reaction;

          return `&lt;button
            class=&quot;reaction-btn ${active ? &#x27;active&#x27; : &#x27;&#x27;}&quot;
            type=&quot;button&quot;
            data-react-type=&quot;${escapeChat(targetType)}&quot;
            data-react-id=&quot;${Number(targetId)}&quot;
            data-react-value=&quot;${reaction}&quot;
            aria-pressed=&quot;${active ? &#x27;true&#x27; : &#x27;false&#x27;}&quot;
            title=&quot;${active ? &#x27;Remove your reaction&#x27; : &#x27;React&#x27;}&quot;&gt;
              &lt;span class=&quot;reaction-emoji&quot;&gt;${reaction}&lt;/span&gt;
              ${count ? `&lt;span class=&quot;reaction-count&quot;&gt;${count}&lt;/span&gt;` : &#x27;&#x27;}
          &lt;/button&gt;`;
        }).join(&#x27;&#x27;)}
      &lt;/div&gt;
    &lt;/div&gt;

    ${usedReactions ? `&lt;div class=&quot;reaction-summary&quot;&gt;${usedReactions}&lt;/div&gt;` : &#x27;&#x27;}
  &lt;/div&gt;`;
}

async function toggleGymcelsReaction(targetType,targetId,reaction){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client) return;

  if(!session?.user){
    const login = document.getElementById(&#x27;login-card&#x27;);
    login?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
    return;
  }

  const {error} = await client.rpc(&#x27;toggle_content_reaction&#x27;,{
    reaction_target_type:targetType,
    reaction_target_id:Number(targetId),
    reaction_value:reaction
  });

  if(error){
    console.error(&#x27;Reaction update error:&#x27;,error);

    if(targetType === &#x27;chat&#x27;){
      setChatStatus(&#x27;Reaction failed: &#x27; + error.message,&#x27;error&#x27;);
    }else{
      setThreadStatus(threadReplyStatus || threadsStatus,&#x27;Reaction failed: &#x27; + error.message,&#x27;error&#x27;);
    }
    return;
  }

  if(targetType === &#x27;chat&#x27;){
    await loadCommunityChat(false);
    return;
  }

  if(targetType === &#x27;thread&#x27;){
    await loadThreads();

    if(activeThread &amp;&amp; Number(activeThread.id) === Number(targetId)){
      const reactionMap = await loadReactionState(&#x27;thread&#x27;,[targetId],session.user.id);
      if(threadViewReactions){
        threadViewReactions.innerHTML = reactionBarHtml(
          &#x27;thread&#x27;,
          targetId,
          reactionMap[Number(targetId)] || {},
          &#x27;reaction-bar-thread&#x27;
        );
      }
    }
    return;
  }

  if(targetType === &#x27;thread_reply&#x27; &amp;&amp; activeThread){
    await loadThreadReplies(activeThread.id);
  }
}

function closeAllReactionPickers(exceptControl=null){
  document.querySelectorAll(&#x27;.reaction-control&#x27;).forEach(control =&gt; {
    if(exceptControl &amp;&amp; control === exceptControl) return;

    control.querySelector(&#x27;.reaction-picker&#x27;)?.classList.add(&#x27;hidden&#x27;);
    const toggle = control.querySelector(&#x27;[data-reaction-toggle]&#x27;);
    if(toggle) toggle.setAttribute(&#x27;aria-expanded&#x27;,&#x27;false&#x27;);
  });
}

document.addEventListener(&#x27;click&#x27;,async (e) =&gt; {
  const toggle = e.target.closest(&#x27;[data-reaction-toggle]&#x27;);

  if(toggle){
    e.preventDefault();
    e.stopPropagation();

    const control = toggle.closest(&#x27;.reaction-control&#x27;);
    const picker = control?.querySelector(&#x27;.reaction-picker&#x27;);
    if(!picker) return;

    const opening = picker.classList.contains(&#x27;hidden&#x27;);

    closeAllReactionPickers(control);
    picker.classList.toggle(&#x27;hidden&#x27;,!opening);
    toggle.setAttribute(&#x27;aria-expanded&#x27;,opening ? &#x27;true&#x27; : &#x27;false&#x27;);
    return;
  }

  const btn = e.target.closest(&#x27;[data-react-type][data-react-id][data-react-value]&#x27;);

  if(btn){
    e.preventDefault();
    e.stopPropagation();

    const control = btn.closest(&#x27;.reaction-control&#x27;);
    control?.querySelector(&#x27;.reaction-picker&#x27;)?.classList.add(&#x27;hidden&#x27;);
    control?.querySelector(&#x27;[data-reaction-toggle]&#x27;)?.setAttribute(&#x27;aria-expanded&#x27;,&#x27;false&#x27;);

    btn.disabled = true;

    try{
      await toggleGymcelsReaction(
        btn.dataset.reactType,
        Number(btn.dataset.reactId),
        btn.dataset.reactValue
      );
    }finally{
      btn.disabled = false;
    }
    return;
  }

  if(!e.target.closest(&#x27;.reaction-control&#x27;)){
    closeAllReactionPickers();
  }
});


async function loadCommunityChat(scrollToBottom=false){
  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error(&#x27;Chat database connection is not ready.&#x27;);

    const session = await getChatSession();
    const signedIn = setCommunityChatAuthState(session);

    if(signedIn){
      await refreshChatAdminStatus(session);
    }else{
      chatIsSiteAdmin = false;
      chatAdminCheckedUserId = null;
    }

    if(!signedIn &amp;&amp; friendsSection){
      friendsSection.style.display = &#x27;none&#x27;;
    }

    const { data, error } = await client
      .from(&#x27;messages&#x27;)
      .select(&#x27;id,user_id,display_name,avatar_url,message,created_at,reply_to_id&#x27;)
      .order(&#x27;created_at&#x27;, { ascending: true })
      .limit(100);

    if(error) throw error;


    let rows = data || [];

    if(signedIn){
      const blockedIds = await getMyBlockedUserIds();
      rows = rows.filter(row =&gt; !blockedIds.has(String(row.user_id || &#x27;&#x27;)));
    }

    chatRowsById = new Map(rows.map(row =&gt; [Number(row.id), row]));

    // Load the original messages referenced by replies.
    const replyIds = [...new Set(rows.map(row =&gt; Number(row.reply_to_id)).filter(Boolean))];
    let replyMap = {};

    if(replyIds.length){
      const { data: replyRows, error: replyError } = await client
        .from(&#x27;messages&#x27;)
        .select(&#x27;id,user_id,display_name,message&#x27;)
        .in(&#x27;id&#x27;, replyIds);

      if(!replyError){
        replyMap = Object.fromEntries(
          (replyRows || []).map(row =&gt; [Number(row.id), row])
        );
      }
    }

    // Load online/offline state for everyone visible in the chat.
    const userIds = [...new Set(rows.map(row =&gt; row.user_id).filter(Boolean))];
    let presenceMap = {};

    if(userIds.length &amp;&amp; signedIn){
      const { data: presenceRows, error: presenceError } = await client
        .from(&#x27;member_presence&#x27;)
        .select(&#x27;user_id,last_seen&#x27;)
        .in(&#x27;user_id&#x27;, userIds);

      if(!presenceError){
        presenceMap = Object.fromEntries(
          (presenceRows || []).map(p =&gt; [p.user_id, p.last_seen])
        );
      }
    }

    rows.forEach(row =&gt; {
      row.is_online = isPresenceOnline(presenceMap[row.user_id]);
    });

    let vipMap = {};
    if(signedIn){
      const vipEntries = await Promise.all(
        userIds.map(async uid =&gt; [uid, await getPublicVipStatus(uid)])
      );
      vipMap = Object.fromEntries(vipEntries);
    }

    rows.forEach(row =&gt; {
      row.is_vip = !!vipMap[row.user_id];
    });

    const chatStaffRoleMap = await loadPublicStaffRoles(userIds);
    rows.forEach(row =&gt; {
      row.staff_role = chatStaffRoleMap[row.user_id] || null;
    });

    const chatReactionMap = await loadReactionState(
      &#x27;chat&#x27;,
      rows.map(row =&gt; row.id),
      signedIn ? session.user.id : null
    );

    if(!rows.length){
      chatMessages.innerHTML =
        &#x27;&lt;div class=&quot;chat-empty&quot;&gt;No messages yet — start the conversation.&lt;/div&gt;&#x27;;
      return;
    }

    chatMessages.innerHTML = rows.map(row =&gt; {
      const mine = signedIn &amp;&amp; row.user_id === session.user.id;
      const canDeleteMessage = mine || (signedIn &amp;&amp; canModerateChat());
      const when = row.created_at
        ? new Date(row.created_at).toLocaleTimeString([], {
            hour:&#x27;numeric&#x27;,
            minute:&#x27;2-digit&#x27;
          })
        : &#x27;&#x27;;

      const parent = row.reply_to_id ? replyMap[Number(row.reply_to_id)] : null;
      const quotedReply = parent
        ? `&lt;button class=&quot;chat-quoted-reply&quot; type=&quot;button&quot; data-jump-message=&quot;${parent.id}&quot;&gt;
             &lt;strong&gt;Replying to ${escapeChat(parent.display_name || &#x27;Member&#x27;)}&lt;/strong&gt;
             &lt;span&gt;${escapeChat(String(parent.message || &#x27;&#x27;).replace(/\s+/g,&#x27; &#x27;).slice(0,140))}&lt;/span&gt;
           &lt;/button&gt;`
        : &#x27;&#x27;;

      return `
        &lt;div class=&quot;chat-message&quot; data-message-id=&quot;${row.id}&quot;&gt;
          &lt;div class=&quot;chat-message-row&quot;&gt;
            ${chatAvatarMarkup(row)}
            &lt;div class=&quot;chat-message-body&quot;&gt;
              &lt;div class=&quot;chat-meta&quot;&gt;
                &lt;div&gt;
                  &lt;button class=&quot;chat-user-button&quot; type=&quot;button&quot; data-chat-user=&quot;${escapeChat(row.user_id || &#x27;&#x27;)}&quot; data-chat-name=&quot;${escapeChat(row.display_name || &#x27;Member&#x27;)}&quot; data-chat-avatar=&quot;${escapeChat(row.avatar_url || &#x27;&#x27;)}&quot;&gt;&lt;span class=&quot;chat-user&quot;&gt;${escapeChat(row.display_name || &#x27;Member&#x27;)}&lt;/span&gt;&lt;/button&gt;${staffBadgeMarkup(row.staff_role)}${vipBadgeMarkup(row.is_vip)}
                  &lt;span class=&quot;chat-time&quot;&gt; · ${escapeChat(when)}&lt;/span&gt;
                &lt;/div&gt;
                &lt;div class=&quot;chat-message-actions&quot;&gt;
                  ${signedIn ? `&lt;button class=&quot;chat-reply-btn&quot; type=&quot;button&quot; data-chat-reply=&quot;${row.id}&quot;&gt;Reply&lt;/button&gt;` : &#x27;&#x27;}
                  ${signedIn &amp;&amp; !mine
                    ? `&lt;button class=&quot;content-report-btn&quot;
                               type=&quot;button&quot;
                               data-content-report=&quot;chat&quot;
                               data-report-id=&quot;${row.id}&quot;
                               data-report-user=&quot;${escapeChat(row.user_id || &#x27;&#x27;)}&quot;
                               data-report-label=&quot;Chat message by ${escapeChat(row.display_name || &#x27;Member&#x27;)}&quot;&gt;Report&lt;/button&gt;`
                    : &#x27;&#x27;}
                  ${canDeleteMessage
                    ? `&lt;button class=&quot;chat-delete&quot; type=&quot;button&quot; data-chat-delete=&quot;${row.id}&quot;${!mine &amp;&amp; canModerateChat() ? &#x27; title=&quot;Moderator delete&quot;&#x27; : &#x27;&#x27;}&gt;Delete&lt;/button&gt;`
                    : &#x27;&#x27;}
                &lt;/div&gt;
              &lt;/div&gt;
              ${quotedReply}
              &lt;div class=&quot;chat-text&quot;&gt;${chatTextWithMentions(row.message)}&lt;/div&gt;
              ${reactionBarHtml(
                &#x27;chat&#x27;,
                row.id,
                chatReactionMap[Number(row.id)] || {},
                &#x27;chat-reactions&#x27;
              )}
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;`;
    }).join(&#x27;&#x27;);

    if(scrollToBottom){
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if(signedIn) await refreshChatLevel();
  } catch(err){
    if(chatMessages){
      chatMessages.innerHTML =
        &#x27;&lt;div class=&quot;chat-empty&quot;&gt;Could not load chat.&lt;/div&gt;&#x27;;
    }
    setChatStatus(&#x27;Chat error: &#x27; + (err?.message || String(err)), &#x27;error&#x27;);
    console.error(&#x27;Gymcels.lol chat load error:&#x27;, err);
  }
}

async function sendCommunityMessage(){
  if(chatSending) return;

  const text = chatInput?.value.trim();
  if(!text) return;

  chatSending = true;
  if(chatSendBtn) chatSendBtn.disabled = true;
  setChatStatus(&#x27;Sending...&#x27;);

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error(&#x27;Chat database connection is not ready.&#x27;);

    const session = await getChatSession();
    if(!session?.user) throw new Error(&#x27;You must be logged in to send messages.&#x27;);

    const {data:muteData,error:muteError}=await client.rpc(&#x27;get_chat_mute_status&#x27;,{
      target_user:session.user.id
    });
    if(muteError) throw muteError;

    const muteStatus=Array.isArray(muteData) ? muteData[0] : muteData;
    if(muteStatus?.is_muted){
      throw new Error(`You are muted from public chat until ${formatMuteUntil(muteStatus.muted_until)}.`);
    }

    const mentionUserIds = activeMentionUserIds(text);

    const { data: insertedMessage, error } = await client
      .from(&#x27;messages&#x27;)
      .insert({
        user_id: session.user.id,
        display_name: chatDisplayName(session.user),
        avatar_url: session.user?.user_metadata?.avatar_url || null,
        message: text,
        reply_to_id: chatReplyTarget?.id || null
      })
      .select(&#x27;id&#x27;)
      .single();

    if(error) throw error;

    if(mentionUserIds.length &amp;&amp; insertedMessage?.id){
      const { error: mentionError } = await client.rpc(&#x27;create_mention_notifications&#x27;, {
        target_user_ids: mentionUserIds,
        target_message_id: Number(insertedMessage.id),
        mention_preview: text.slice(0,160)
      });

      if(mentionError){
        console.error(&#x27;Mention notification error:&#x27;, mentionError);
      }
    }

    chatInput.value = &#x27;&#x27;;
    selectedMentions.clear();
    closeMentionSuggestions();
    clearChatReply();
    chatInput.placeholder = &#x27;Say something to the community...&#x27;;
    setChatStatus(&#x27;✓ MESSAGE SENT&#x27;, &#x27;success&#x27;);
    await refreshChatLevel();
    await loadCommunityChat(true);

    setTimeout(() =&gt; {
      if(chatStatus?.textContent === &#x27;✓ MESSAGE SENT&#x27;){
        chatStatus.textContent = &#x27;&#x27;;
      }
    }, 3000);
  } catch(err){
    setChatStatus(&#x27;Send failed: &#x27; + (err?.message || String(err)), &#x27;error&#x27;);
    console.error(&#x27;Gymcels.lol chat send error:&#x27;, err);
  } finally{
    chatSending = false;
    try{
      const latestSession = await getChatSession();
      setCommunityChatAuthState(latestSession);
    }catch(_err){
      if(chatSendBtn) chatSendBtn.disabled = true;
      if(chatInput) chatInput.disabled = true;
    }
  }
}

if(chatSendBtn){
  chatSendBtn.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();
    sendCommunityMessage();
  });
}

if(chatInput){
  chatInput.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
    if(e.key === &#x27;Enter&#x27; &amp;&amp; !e.shiftKey){
      e.preventDefault();
      sendCommunityMessage();
    }
  });
}




if(chatInput){
  chatInput.addEventListener(&#x27;input&#x27;, () =&gt; {
    clearTimeout(mentionSearchTimer);
    mentionSearchTimer = setTimeout(loadMentionSuggestions, 120);
  });

  chatInput.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
    if(!mentionSuggestions || mentionSuggestions.classList.contains(&#x27;hidden&#x27;)) return;

    if(e.key === &#x27;Escape&#x27;){
      closeMentionSuggestions();
      return;
    }

    if(e.key === &#x27;Enter&#x27; &amp;&amp; mentionCandidates.length){
      const active = mentionSuggestions.querySelector(&#x27;.mention-option.active&#x27;);
      const index = Number(active?.dataset.mentionIndex ?? 0);
      const person = mentionCandidates[index];
      if(person){
        e.preventDefault();
        e.stopPropagation();
        chooseMention(person);
      }
    }
  });
}

if(mentionSuggestions){
  mentionSuggestions.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    const btn = e.target.closest(&#x27;[data-mention-index]&#x27;);
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const person = mentionCandidates[Number(btn.dataset.mentionIndex)];
    if(person) chooseMention(person);
  });
}

document.addEventListener(&#x27;click&#x27;, (e) =&gt; {
  if(e.target === chatInput || e.target.closest(&#x27;#mentionSuggestions&#x27;)) return;
  closeMentionSuggestions();
});

if(chatReplyCancel){
  chatReplyCancel.addEventListener(&#x27;click&#x27;, () =&gt; {
    clearChatReply();
    if(chatInput){
      chatInput.placeholder = &#x27;Say something to the community...&#x27;;
      chatInput.focus();
    }
  });
}

if(chatMessages){
  chatMessages.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    const replyBtn = e.target.closest(&#x27;[data-chat-reply]&#x27;);
    if(replyBtn){
      e.preventDefault();
      e.stopPropagation();
      const row = chatRowsById.get(Number(replyBtn.dataset.chatReply));
      if(row) beginChatReply(row);
      return;
    }

    const jumpBtn = e.target.closest(&#x27;[data-jump-message]&#x27;);
    if(jumpBtn){
      e.preventDefault();
      e.stopPropagation();
      jumpToChatMessage(jumpBtn.dataset.jumpMessage);
    }
  });
}

// Delegated chatter-profile click. This works even when chat messages are re-rendered.
document.addEventListener(&#x27;click&#x27;, (e) =&gt; {
  const profileTarget = e.target.closest(&#x27;[data-chat-user]&#x27;);
  if(!profileTarget || e.target.closest(&#x27;[data-chat-delete]&#x27;)) return;

  e.preventDefault();
  e.stopPropagation();

  openChatPublicProfile(
    profileTarget.dataset.chatUser,
    profileTarget.dataset.chatName || &#x27;Member&#x27;,
    profileTarget.dataset.chatAvatar || &#x27;&#x27;
  );
});

if(chatMessages){
  chatMessages.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    const btn = e.target.closest(&#x27;[data-chat-delete]&#x27;);
    if(!btn) return;

    try{
      const client = window.gymcelsLolDb;
      if(!client) throw new Error(&#x27;Chat database connection is not ready.&#x27;);

      const id = Number(btn.dataset.chatDelete);
      if(!id) return;

      const rowEl = btn.closest(&#x27;.chat-message&#x27;);
      const isModeratorDelete = canModerateChat() &amp;&amp; btn.getAttribute(&#x27;title&#x27;) === &#x27;Moderator delete&#x27;;

      if(isModeratorDelete &amp;&amp; !confirm(&quot;Delete this member&#x27;s message?&quot;)){
        return;
      }

      const { error } = await client
        .from(&#x27;messages&#x27;)
        .delete()
        .eq(&#x27;id&#x27;, id);

      if(error) throw error;

      // Deleting a message does NOT subtract from lifetime chat XP.
      await loadCommunityChat(false);
      await refreshChatLevel();
    } catch(err){
      setChatStatus(&#x27;Delete failed: &#x27; + (err?.message || String(err)), &#x27;error&#x27;);
    }
  });
}


if(navNotifications){
  navNotifications.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();
    const opening = notificationPanel?.classList.contains(&#x27;hidden&#x27;);
    if(notificationPanel){
      notificationPanel.classList.toggle(&#x27;hidden&#x27;);
      notificationPanel.setAttribute(&#x27;aria-hidden&#x27;, opening ? &#x27;false&#x27; : &#x27;true&#x27;);
    }
    if(opening) loadNotifications();
  });
}

if(notificationMarkAll){
  notificationMarkAll.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();
    await markAllNotificationsRead();
  });
}

if(notificationList){
  notificationList.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    const item = e.target.closest(&#x27;[data-notification-id]&#x27;);
    if(!item) return;

    const notificationId = Number(item.dataset.notificationId);
    const messageId = Number(item.dataset.notificationMessage);
    const type = item.dataset.notificationType || &#x27;&#x27;;
    const actorId = item.dataset.notificationActor || &#x27;&#x27;;
    const notificationThreadId = Number(item.dataset.notificationThread);

    await markNotificationRead(notificationId);
    await loadNotifications();

    if(notificationPanel){
      notificationPanel.classList.add(&#x27;hidden&#x27;);
      notificationPanel.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
    }

    if(type === &#x27;incoming_call&#x27;){
      dmSection?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;});
      await loadDmFriends();
      return;
    }

    if(type === &#x27;thread_reply&#x27; &amp;&amp; notificationThreadId){
      threadsSection?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;});
      await loadThreads();
      await openThread(notificationThreadId);
      return;
    }

    if(type === &#x27;friend_request&#x27; || type === &#x27;friend_accepted&#x27;){
      await loadFriendsSection();
      friendsSection?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
      return;
    }

    if(type === &#x27;dm&#x27; &amp;&amp; actorId){
      try{
        const client = window.gymcelsLolDb;
        const { data: person } = await client
          .from(&#x27;member_presence&#x27;)
          .select(&#x27;display_name,avatar_url&#x27;)
          .eq(&#x27;user_id&#x27;, actorId)
          .maybeSingle();

        await openDmWith(
          actorId,
          person?.display_name || &#x27;Member&#x27;,
          person?.avatar_url || &#x27;&#x27;
        );
      }catch(err){
        console.error(&#x27;DM notification open error:&#x27;, err);
      }
      return;
    }

    communityChat?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
    await loadCommunityChat(false);

    setTimeout(() =&gt; {
      if(messageId) jumpToChatMessage(messageId);
    }, 250);
  });
}

document.addEventListener(&#x27;click&#x27;, (e) =&gt; {
  if(!notificationPanel || notificationPanel.classList.contains(&#x27;hidden&#x27;)) return;
  if(
    e.target.closest(&#x27;#notificationPanel&#x27;) ||
    e.target.closest(&#x27;#navNotifications&#x27;) ||
    e.target.closest(&#x27;#mobileNotificationBtn&#x27;)
  ) return;

  notificationPanel.classList.add(&#x27;hidden&#x27;);
  notificationPanel.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
});


function setSiteUpdateStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
  if(!siteUpdateAdminStatus) return;
  siteUpdateAdminStatus.textContent = text;
  siteUpdateAdminStatus.className = `site-update-status ${type || &#x27;&#x27;}`;
}

function siteUpdateTime(value){
  if(!value) return &#x27;&#x27;;
  const d = new Date(value);
  const diff = Date.now()-d.getTime();

  if(diff &lt; 60000) return &#x27;just now&#x27;;
  if(diff &lt; 3600000) return `${Math.floor(diff/60000)}m ago`;
  if(diff &lt; 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if(diff &lt; 604800000) return `${Math.floor(diff/86400000)}d ago`;

  return d.toLocaleDateString([],{
    month:&#x27;short&#x27;,
    day:&#x27;numeric&#x27;,
    year:d.getFullYear() !== new Date().getFullYear() ? &#x27;numeric&#x27; : undefined
  });
}

async function refreshSiteUpdateAdminUi(){
  if(!siteUpdateAdminComposer) return false;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    siteUpdateAdminComposer.classList.add(&#x27;hidden&#x27;);
    return false;
  }

  try{
    const {data,error} = await client.rpc(&#x27;is_site_admin&#x27;);
    if(error) throw error;

    const isAdmin = data === true;
    siteUpdateAdminComposer.classList.toggle(&#x27;hidden&#x27;,!isAdmin);
    return isAdmin;
  }catch(err){
    console.error(&#x27;Update board admin check error:&#x27;,err);
    siteUpdateAdminComposer.classList.add(&#x27;hidden&#x27;);
    return false;
  }
}


function safeSiteUpdateFontSize(value){
  const size = Number(value);
  const allowed = [13,16,20,26];
  return allowed.includes(size) ? size : 16;
}

function safeSiteUpdateColor(value){
  const color = String(value || &#x27;&#x27;).trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : &#x27;#d8dde3&#x27;;
}

function updateSiteUpdatePreview(){
  if(!siteUpdatePreview) return;

  const text = String(siteUpdateInput?.value || &#x27;&#x27;).trim() ||
    &#x27;Your update will look like this.&#x27;;
  const size = safeSiteUpdateFontSize(siteUpdateFontSize?.value);
  const color = safeSiteUpdateColor(siteUpdateColor?.value);

  siteUpdatePreview.textContent = text;
  siteUpdatePreview.style.fontSize = `${size}px`;
  siteUpdatePreview.style.color = color;

  document.querySelectorAll(&#x27;[data-update-color]&#x27;).forEach(btn =&gt; {
    btn.classList.toggle(
      &#x27;active&#x27;,
      String(btn.dataset.updateColor || &#x27;&#x27;).toLowerCase() === color.toLowerCase()
    );
  });
}

async function loadSiteUpdates(){
  const client = window.gymcelsLolDb;
  if(!client || !siteUpdatesList) return;

  try{
    const [updatesRes,isAdmin] = await Promise.all([
      client
        .from(&#x27;site_updates&#x27;)
        .select(&#x27;id,message,text_color,font_size,created_at&#x27;)
        .order(&#x27;created_at&#x27;,{ascending:false})
        .limit(20),
      refreshSiteUpdateAdminUi()
    ]);

    if(updatesRes.error) throw updatesRes.error;

    const rows = updatesRes.data || [];
    siteUpdateRowsById = new Map(rows.map(row =&gt; [Number(row.id),row]));

    if(!rows.length){
      siteUpdatesList.innerHTML =
        &#x27;&lt;div class=&quot;site-update-empty&quot;&gt;No official updates yet.&lt;/div&gt;&#x27;;
      return;
    }

    siteUpdatesList.innerHTML = rows.map((row,index) =&gt; `
      &lt;div class=&quot;site-update-item ${index === 0 ? &#x27;latest&#x27; : &#x27;&#x27;}&quot; data-site-update-id=&quot;${Number(row.id)}&quot;&gt;
        &lt;div class=&quot;site-update-item-head&quot;&gt;
          &lt;div class=&quot;site-update-author&quot;&gt;
            Gymcels.lol
            &lt;span class=&quot;site-update-admin-badge&quot;&gt;Admin&lt;/span&gt;
          &lt;/div&gt;
          &lt;div class=&quot;site-update-time&quot;&gt;${escapeChat(siteUpdateTime(row.created_at))}&lt;/div&gt;
        &lt;/div&gt;

        &lt;div class=&quot;site-update-message&quot;
          style=&quot;color:${safeSiteUpdateColor(row.text_color)};font-size:${safeSiteUpdateFontSize(row.font_size)}px&quot;&gt;
          ${escapeChat(row.message || &#x27;&#x27;)}
        &lt;/div&gt;

        ${isAdmin ? `
          &lt;div class=&quot;site-update-admin-actions&quot;&gt;
            &lt;button class=&quot;site-update-edit&quot; type=&quot;button&quot; data-edit-site-update=&quot;${Number(row.id)}&quot;&gt;Edit&lt;/button&gt;
            &lt;button class=&quot;site-update-delete&quot; type=&quot;button&quot; data-delete-site-update=&quot;${Number(row.id)}&quot;&gt;Delete&lt;/button&gt;
          &lt;/div&gt;` : &#x27;&#x27;}
      &lt;/div&gt;
    `).join(&#x27;&#x27;);
  }catch(err){
    console.error(&#x27;Update board load error:&#x27;,err);
    siteUpdatesList.innerHTML =
      `&lt;div class=&quot;site-update-empty&quot;&gt;${escapeChat(err?.message || &#x27;Could not load updates.&#x27;)}&lt;/div&gt;`;
  }
}


function resetSiteUpdateComposer(){
  siteUpdateEditingId = null;

  if(siteUpdateInput) siteUpdateInput.value = &#x27;&#x27;;
  if(siteUpdateFontSize) siteUpdateFontSize.value = &#x27;16&#x27;;
  if(siteUpdateColor) siteUpdateColor.value = &#x27;#d8dde3&#x27;;
  if(siteUpdateCharCount) siteUpdateCharCount.textContent = &#x27;0 / 1000&#x27;;
  if(siteUpdatePostBtn) siteUpdatePostBtn.textContent = &#x27;Post update&#x27;;

  siteUpdateCancelEditBtn?.classList.add(&#x27;hidden&#x27;);

  const label = siteUpdateAdminComposer?.querySelector(&#x27;.site-update-admin-label&gt;span&#x27;);
  if(label) label.textContent = &#x27;Admin announcement&#x27;;

  updateSiteUpdatePreview();
}

function beginSiteUpdateEdit(id){
  const row = siteUpdateRowsById.get(Number(id));
  if(!row || !siteUpdateAdminComposer) return;

  siteUpdateEditingId = Number(row.id);

  if(siteUpdateInput) siteUpdateInput.value = row.message || &#x27;&#x27;;
  if(siteUpdateFontSize) siteUpdateFontSize.value = String(safeSiteUpdateFontSize(row.font_size));
  if(siteUpdateColor) siteUpdateColor.value = safeSiteUpdateColor(row.text_color);
  if(siteUpdateCharCount){
    siteUpdateCharCount.textContent = `${String(row.message || &#x27;&#x27;).length} / 1000`;
  }

  if(siteUpdatePostBtn) siteUpdatePostBtn.textContent = &#x27;Save changes&#x27;;
  siteUpdateCancelEditBtn?.classList.remove(&#x27;hidden&#x27;);

  const label = siteUpdateAdminComposer.querySelector(&#x27;.site-update-admin-label&gt;span&#x27;);
  if(label) label.textContent = &#x27;Editing published update&#x27;;

  updateSiteUpdatePreview();
  siteUpdateAdminComposer.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
  setTimeout(() =&gt; siteUpdateInput?.focus(),250);
}

siteUpdateCancelEditBtn?.addEventListener(&#x27;click&#x27;,() =&gt; {
  resetSiteUpdateComposer();
  setSiteUpdateStatus(&#x27;Edit canceled.&#x27;);
});

async function postSiteUpdate(){
  if(siteUpdatePosting) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  const message = String(siteUpdateInput?.value || &#x27;&#x27;).trim();
  const textColor = safeSiteUpdateColor(siteUpdateColor?.value);
  const fontSize = safeSiteUpdateFontSize(siteUpdateFontSize?.value);

  if(!client || !session?.user){
    setSiteUpdateStatus(&#x27;Log in to post.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(!message){
    setSiteUpdateStatus(&#x27;Write an update first.&#x27;,&#x27;error&#x27;);
    siteUpdateInput?.focus();
    return;
  }

  siteUpdatePosting = true;
  siteUpdatePostBtn.disabled = true;
  if(siteUpdateCancelEditBtn) siteUpdateCancelEditBtn.disabled = true;

  const editing = Number(siteUpdateEditingId) &gt; 0;
  setSiteUpdateStatus(editing ? &#x27;Saving changes...&#x27; : &#x27;Posting update...&#x27;);

  try{
    if(editing){
      const {error} = await client.rpc(&#x27;update_site_update_styled&#x27;,{
        update_id:Number(siteUpdateEditingId),
        update_message:message,
        update_color:textColor,
        update_font_size:fontSize
      });
      if(error) throw error;

      resetSiteUpdateComposer();
      setSiteUpdateStatus(&#x27;✓ Update edited.&#x27;,&#x27;success&#x27;);
    }else{
      const {error} = await client.rpc(&#x27;post_site_update_styled&#x27;,{
        update_message:message,
        update_color:textColor,
        update_font_size:fontSize
      });
      if(error) throw error;

      resetSiteUpdateComposer();
      setSiteUpdateStatus(&#x27;✓ Update posted.&#x27;,&#x27;success&#x27;);
    }

    await loadSiteUpdates();
  }catch(err){
    setSiteUpdateStatus(err?.message || String(err),&#x27;error&#x27;);
  }finally{
    siteUpdatePosting = false;
    siteUpdatePostBtn.disabled = false;
    if(siteUpdateCancelEditBtn) siteUpdateCancelEditBtn.disabled = false;
  }
}

async function deleteSiteUpdate(id){
  if(!id || !confirm(&#x27;Delete this update from the board?&#x27;)) return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  try{
    const {error} = await client.rpc(&#x27;delete_site_update&#x27;,{
      update_id:Number(id)
    });
    if(error) throw error;

    if(Number(siteUpdateEditingId) === Number(id)){
      resetSiteUpdateComposer();
    }

    await loadSiteUpdates();
    setSiteUpdateStatus(&#x27;✓ Update deleted.&#x27;,&#x27;success&#x27;);
  }catch(err){
    setSiteUpdateStatus(err?.message || String(err),&#x27;error&#x27;);
  }
}

siteUpdateInput?.addEventListener(&#x27;input&#x27;,() =&gt; {
  if(siteUpdateCharCount){
    siteUpdateCharCount.textContent =
      `${siteUpdateInput.value.length} / 1000`;
  }
  updateSiteUpdatePreview();
});

siteUpdateFontSize?.addEventListener(&#x27;change&#x27;,updateSiteUpdatePreview);
siteUpdateColor?.addEventListener(&#x27;input&#x27;,updateSiteUpdatePreview);

document.querySelectorAll(&#x27;[data-update-color]&#x27;).forEach(btn =&gt; {
  btn.addEventListener(&#x27;click&#x27;,() =&gt; {
    if(siteUpdateColor){
      siteUpdateColor.value = safeSiteUpdateColor(btn.dataset.updateColor);
      updateSiteUpdatePreview();
    }
  });
});

updateSiteUpdatePreview();

siteUpdateInput?.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if((e.ctrlKey || e.metaKey) &amp;&amp; e.key === &#x27;Enter&#x27;){
    e.preventDefault();
    postSiteUpdate();
  }
});

siteUpdatePostBtn?.addEventListener(&#x27;click&#x27;,postSiteUpdate);

siteUpdatesList?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  const editBtn = e.target.closest(&#x27;[data-edit-site-update]&#x27;);
  if(editBtn){
    beginSiteUpdateEdit(Number(editBtn.dataset.editSiteUpdate));
    return;
  }

  const deleteBtn = e.target.closest(&#x27;[data-delete-site-update]&#x27;);
  if(deleteBtn){
    deleteSiteUpdate(Number(deleteBtn.dataset.deleteSiteUpdate));
  }
});

function startSiteUpdateBoard(){
  clearInterval(siteUpdatesPollTimer);
  loadSiteUpdates();
  siteUpdatesPollTimer = setInterval(loadSiteUpdates,15000);
}


function startCommunityChat(session){
  clearInterval(chatPollTimer);
  setCommunityChatAuthState(session);
  startNotifications(session);
  startThreads(session);
  startVoiceSystem(session);
  startSiteUpdateBoard();

  if(session?.user){
    startPresenceHeartbeat();
    loadFriendsSection();
    refreshChatLevel();
  }

  loadCommunityChat(true);
  chatPollTimer = setInterval(() =&gt; loadCommunityChat(false), 3000);
}

if(window.gymcelsLolDb){
  window.gymcelsLolDb.auth.onAuthStateChange((_event, session) =&gt; {
    chatIsSiteAdmin = false;
    currentStaffPermissions = {
      is_admin:false,
      chat_moderation:false,
      thread_moderation:false,
      voice_moderation:false
    };
    chatAdminCheckedUserId = null;
    staffPanelLoadedForUser = null;
    clearBlockedUserCache();
    staffAdminPanel?.classList.add(&#x27;hidden&#x27;);
    startCommunityChat(session);
  });

  setTimeout(async () =&gt; {
    try{
      const session = await getChatSession();
      startCommunityChat(session);
    } catch(err){
      setChatStatus(&#x27;Chat error: &#x27; + (err?.message || String(err)), &#x27;error&#x27;);
    }
  }, 250);
} else {
  setChatStatus(&#x27;Chat database connection is not ready.&#x27;, &#x27;error&#x27;);
}


// ---- Gymcel Threads ----
const navThreadsOutside = document.getElementById(&#x27;navThreads&#x27;);
const threadsSection = document.getElementById(&#x27;threadsSection&#x27;);
const openThreadComposerBtn = document.getElementById(&#x27;openThreadComposerBtn&#x27;);
const threadGuestNote = document.getElementById(&#x27;threadGuestNote&#x27;);
const threadComposer = document.getElementById(&#x27;threadComposer&#x27;);
const threadCategory = document.getElementById(&#x27;threadCategory&#x27;);
const threadTitle = document.getElementById(&#x27;threadTitle&#x27;);
const threadBody = document.getElementById(&#x27;threadBody&#x27;);
const threadMediaInput = document.getElementById(&#x27;threadMediaInput&#x27;);
const threadMediaPreview = document.getElementById(&#x27;threadMediaPreview&#x27;);
const threadMediaPreviewList = document.getElementById(&#x27;threadMediaPreviewList&#x27;);
const threadMediaRemove = document.getElementById(&#x27;threadMediaRemove&#x27;);
const threadPollToggle = document.getElementById(&#x27;threadPollToggle&#x27;);
const threadPollFields = document.getElementById(&#x27;threadPollFields&#x27;);
const threadPollRemove = document.getElementById(&#x27;threadPollRemove&#x27;);
const threadPollQuestion = document.getElementById(&#x27;threadPollQuestion&#x27;);
const threadPollOptions = document.getElementById(&#x27;threadPollOptions&#x27;);
const threadPollAddOption = document.getElementById(&#x27;threadPollAddOption&#x27;);
const createThreadBtn = document.getElementById(&#x27;createThreadBtn&#x27;);
const cancelThreadBtn = document.getElementById(&#x27;cancelThreadBtn&#x27;);
const threadComposerStatus = document.getElementById(&#x27;threadComposerStatus&#x27;);
const threadSearchInput = document.getElementById(&#x27;threadSearchInput&#x27;);
const threadSearchClear = document.getElementById(&#x27;threadSearchClear&#x27;);
const threadBookmarksFilter = document.getElementById(&#x27;threadBookmarksFilter&#x27;);
const threadFilters = document.getElementById(&#x27;threadFilters&#x27;);
const threadsList = document.getElementById(&#x27;threadsList&#x27;);
const threadsStatus = document.getElementById(&#x27;threadsStatus&#x27;);

const threadOverlay = document.getElementById(&#x27;threadOverlay&#x27;);
const threadCloseBtn = document.getElementById(&#x27;threadCloseBtn&#x27;);
const threadViewCategory = document.getElementById(&#x27;threadViewCategory&#x27;);
const threadViewTitle = document.getElementById(&#x27;threadViewTitle&#x27;);
const threadViewAuthor = document.getElementById(&#x27;threadViewAuthor&#x27;);
const threadViewAuthorStaff = document.getElementById(&#x27;threadViewAuthorStaff&#x27;);
const threadViewTime = document.getElementById(&#x27;threadViewTime&#x27;);
const threadViewBody = document.getElementById(&#x27;threadViewBody&#x27;);
const threadViewMedia = document.getElementById(&#x27;threadViewMedia&#x27;);
const threadViewPoll = document.getElementById(&#x27;threadViewPoll&#x27;);
const threadViewReactions = document.getElementById(&#x27;threadViewReactions&#x27;);
const threadViewBookmarkBtn = document.getElementById(&#x27;threadViewBookmarkBtn&#x27;);
const threadOwnerActions = document.getElementById(&#x27;threadOwnerActions&#x27;);
const threadLockBtn = document.getElementById(&#x27;threadLockBtn&#x27;);
const threadDeleteBtn = document.getElementById(&#x27;threadDeleteBtn&#x27;);
const threadReplyCount = document.getElementById(&#x27;threadReplyCount&#x27;);
const threadReplies = document.getElementById(&#x27;threadReplies&#x27;);
const threadReplyLocked = document.getElementById(&#x27;threadReplyLocked&#x27;);
const threadReplyTargetBar = document.getElementById(&#x27;threadReplyTargetBar&#x27;);
const threadReplyTargetName = document.getElementById(&#x27;threadReplyTargetName&#x27;);
const threadReplyTargetPreview = document.getElementById(&#x27;threadReplyTargetPreview&#x27;);
const threadReplyTargetCancel = document.getElementById(&#x27;threadReplyTargetCancel&#x27;);
const threadReplyComposer = document.getElementById(&#x27;threadReplyComposer&#x27;);
const threadReplyInput = document.getElementById(&#x27;threadReplyInput&#x27;);
const threadReplyMediaInput = document.getElementById(&#x27;threadReplyMediaInput&#x27;);
const threadReplyMediaLabel = document.getElementById(&#x27;threadReplyMediaLabel&#x27;);
const threadReplyMediaPreview = document.getElementById(&#x27;threadReplyMediaPreview&#x27;);
const threadReplyMediaPreviewList = document.getElementById(&#x27;threadReplyMediaPreviewList&#x27;);
const threadReplyMediaRemove = document.getElementById(&#x27;threadReplyMediaRemove&#x27;);
const threadReplyBtn = document.getElementById(&#x27;threadReplyBtn&#x27;);
const threadReplyStatus = document.getElementById(&#x27;threadReplyStatus&#x27;);

const threadPhotoLightbox = document.getElementById(&#x27;threadPhotoLightbox&#x27;);
const threadPhotoLightboxImage = document.getElementById(&#x27;threadPhotoLightboxImage&#x27;);
const threadPhotoLightboxClose = document.getElementById(&#x27;threadPhotoLightboxClose&#x27;);

let threadFilter = &#x27;All&#x27;;
let threadRows = [];
let activeThread = null;
let threadsPollTimer = null;
let threadPosting = false;
let threadReplyPosting = false;
let threadReplyTarget = null;
let threadPollEnabled = false;
let threadSearchTerm = &#x27;&#x27;;
let threadSearchTimer = null;
let threadBookmarksOnly = false;
let threadBookmarkedIds = new Set();
let threadMediaFiles = [];
let threadMediaPreviewUrls = [];
let threadReplyMediaFiles = [];
let threadReplyMediaPreviewUrls = [];

function setThreadStatus(el, text=&#x27;&#x27;, type=&#x27;normal&#x27;){
  if(!el) return;
  el.textContent = text;
  el.style.color =
    type === &#x27;error&#x27; ? &#x27;#ff7c89&#x27; :
    type === &#x27;success&#x27; ? &#x27;#67e8a5&#x27; :
    &#x27;#8c95a1&#x27;;
  el.style.fontWeight = type === &#x27;error&#x27; || type === &#x27;success&#x27; ? &#x27;800&#x27; : &#x27;&#x27;;
}

function threadTime(value){
  if(!value) return &#x27;&#x27;;
  const d = new Date(value);
  const diff = Date.now() - d.getTime();
  if(diff &lt; 60000) return &#x27;now&#x27;;
  if(diff &lt; 3600000) return `${Math.floor(diff/60000)}m ago`;
  if(diff &lt; 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if(diff &lt; 604800000) return `${Math.floor(diff/86400000)}d ago`;
  return d.toLocaleDateString(undefined,{month:&#x27;short&#x27;,day:&#x27;numeric&#x27;,year:&#x27;numeric&#x27;});
}


const THREAD_MEDIA_MAX_BYTES = 8 * 1024 * 1024;
const THREAD_MEDIA_MAX_FILES = 4;
const THREAD_MEDIA_ALLOWED_TYPES = new Set([
  &#x27;image/jpeg&#x27;,
  &#x27;image/png&#x27;,
  &#x27;image/webp&#x27;
]);

function threadMediaExtension(file){
  const byType={&#x27;image/jpeg&#x27;:&#x27;jpg&#x27;,&#x27;image/png&#x27;:&#x27;png&#x27;,&#x27;image/webp&#x27;:&#x27;webp&#x27;};
  return byType[file?.type] || &#x27;jpg&#x27;;
}

function validateThreadMediaFile(file){
  if(!file) return &#x27;Choose a photo first.&#x27;;
  if(!THREAD_MEDIA_ALLOWED_TYPES.has(file.type)) return &#x27;Use JPG, PNG, or WebP photos.&#x27;;
  if(file.size &gt; THREAD_MEDIA_MAX_BYTES) return &#x27;Each photo must be 8 MB or smaller.&#x27;;
  return &#x27;&#x27;;
}

function validateThreadMediaFiles(files){
  const list=[...(files || [])];
  if(!list.length) return &#x27;&#x27;;
  if(list.length &gt; THREAD_MEDIA_MAX_FILES){
    return `You can upload up to ${THREAD_MEDIA_MAX_FILES} photos per post.`;
  }
  for(const file of list){
    const error=validateThreadMediaFile(file);
    if(error) return error;
  }
  return &#x27;&#x27;;
}

function revokeThreadPreviewUrls(urls){
  (urls || []).forEach(url=&gt;{
    try{ URL.revokeObjectURL(url); }catch(_){}
  });
}

function renderThreadMediaPreview(files,isReply=false){
  const list=[...(files || [])];
  const target=isReply ? threadReplyMediaPreviewList : threadMediaPreviewList;
  const wrapper=isReply ? threadReplyMediaPreview : threadMediaPreview;
  if(!target || !wrapper) return;

  const urls=list.map(file=&gt;URL.createObjectURL(file));
  if(isReply){
    revokeThreadPreviewUrls(threadReplyMediaPreviewUrls);
    threadReplyMediaPreviewUrls=urls;
  }else{
    revokeThreadPreviewUrls(threadMediaPreviewUrls);
    threadMediaPreviewUrls=urls;
  }

  target.innerHTML=list.map((file,index)=&gt;`
    &lt;div class=&quot;thread-media-preview-tile&quot;&gt;
      &lt;img src=&quot;${escapeChat(urls[index])}&quot; alt=&quot;Selected photo ${index+1}&quot;&gt;
    &lt;/div&gt;`).join(&#x27;&#x27;);

  wrapper.classList.toggle(&#x27;hidden&#x27;,list.length===0);
}

function clearThreadMediaSelection(){
  threadMediaFiles=[];
  revokeThreadPreviewUrls(threadMediaPreviewUrls);
  threadMediaPreviewUrls=[];
  if(threadMediaInput) threadMediaInput.value=&#x27;&#x27;;
  if(threadMediaPreviewList) threadMediaPreviewList.innerHTML=&#x27;&#x27;;
  threadMediaPreview?.classList.add(&#x27;hidden&#x27;);
}

function clearThreadReplyMediaSelection(){
  threadReplyMediaFiles=[];
  revokeThreadPreviewUrls(threadReplyMediaPreviewUrls);
  threadReplyMediaPreviewUrls=[];
  if(threadReplyMediaInput) threadReplyMediaInput.value=&#x27;&#x27;;
  if(threadReplyMediaPreviewList) threadReplyMediaPreviewList.innerHTML=&#x27;&#x27;;
  threadReplyMediaPreview?.classList.add(&#x27;hidden&#x27;);
}

function previewThreadMedia(files,isReply=false){
  const list=[...(files || [])];
  const error=validateThreadMediaFiles(list);
  if(error){
    setThreadStatus(isReply ? threadReplyStatus : threadComposerStatus,error,&#x27;error&#x27;);
    if(isReply &amp;&amp; threadReplyMediaInput) threadReplyMediaInput.value=&#x27;&#x27;;
    if(!isReply &amp;&amp; threadMediaInput) threadMediaInput.value=&#x27;&#x27;;
    return false;
  }

  if(isReply){
    threadReplyMediaFiles=list;
    renderThreadMediaPreview(list,true);
    setThreadStatus(threadReplyStatus,`${list.length} photo${list.length===1?&#x27;&#x27;:&#x27;s&#x27;} ready to upload.`);
  }else{
    threadMediaFiles=list;
    renderThreadMediaPreview(list,false);
    setThreadStatus(threadComposerStatus,`${list.length} photo${list.length===1?&#x27;&#x27;:&#x27;s&#x27;} ready to upload.`);
  }
  return true;
}

async function uploadThreadMedia(file,userId,kind=&#x27;thread&#x27;){
  const client=window.gymcelsLolDb;
  if(!client || !file || !userId) return null;

  const error=validateThreadMediaFile(file);
  if(error) throw new Error(error);

  const ext=threadMediaExtension(file);
  const unique=(globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  const path=`${userId}/${kind}/${Date.now()}-${unique}.${ext}`;

  const {error:uploadError}=await client.storage
    .from(&#x27;thread-media&#x27;)
    .upload(path,file,{cacheControl:&#x27;3600&#x27;,upsert:false,contentType:file.type});
  if(uploadError) throw uploadError;

  const {data}=client.storage.from(&#x27;thread-media&#x27;).getPublicUrl(path);
  const url=data?.publicUrl;
  if(!url){
    try{ await client.storage.from(&#x27;thread-media&#x27;).remove([path]); }catch(_){}
    throw new Error(&#x27;Could not create the photo URL.&#x27;);
  }
  return {url,path};
}

async function cleanupUploadedThreadMedia(pathOrPaths){
  const paths=Array.isArray(pathOrPaths)
    ? pathOrPaths.filter(Boolean)
    : [pathOrPaths].filter(Boolean);

  if(!paths.length) return;
  try{
    await window.gymcelsLolDb?.storage.from(&#x27;thread-media&#x27;).remove(paths);
  }catch(err){
    console.debug(&#x27;Thread photo cleanup:&#x27;,err);
  }
}

async function uploadThreadMediaFiles(files,userId,kind=&#x27;thread&#x27;){
  const list=[...(files || [])];
  if(!list.length) return {urls:[],paths:[]};

  const error=validateThreadMediaFiles(list);
  if(error) throw new Error(error);

  const uploaded=[];
  try{
    for(const file of list){
      uploaded.push(await uploadThreadMedia(file,userId,kind));
    }
  }catch(err){
    await cleanupUploadedThreadMedia(uploaded.map(x=&gt;x?.path));
    throw err;
  }

  return {
    urls:uploaded.map(x=&gt;x.url),
    paths:uploaded.map(x=&gt;x.path)
  };
}

function threadAllMedia(row){
  const arrayUrls=Array.isArray(row?.media_urls) ? row.media_urls.filter(Boolean) : [];
  return [...new Set([
    ...(row?.media_url ? [row.media_url] : []),
    ...arrayUrls
  ])].slice(0,THREAD_MEDIA_MAX_FILES);
}

function threadAllMediaPaths(row){
  const arrayPaths=Array.isArray(row?.media_paths) ? row.media_paths.filter(Boolean) : [];
  return [...new Set([
    ...(row?.media_path ? [row.media_path] : []),
    ...arrayPaths
  ])].filter(Boolean);
}

function threadMediaGalleryMarkup(urls,extraClass=&#x27;&#x27;){
  const list=[...new Set((urls || []).filter(Boolean))].slice(0,THREAD_MEDIA_MAX_FILES);
  if(!list.length) return &#x27;&#x27;;

  return `&lt;div class=&quot;thread-media-gallery count-${list.length} ${extraClass}&quot;&gt;
    ${list.map((url,index)=&gt;{
      const safe=escapeChat(url);
      return `&lt;div class=&quot;thread-media-gallery-item&quot;&gt;
        &lt;button type=&quot;button&quot; data-thread-photo=&quot;${safe}&quot; aria-label=&quot;Open photo ${index+1}&quot;&gt;
          &lt;img src=&quot;${safe}&quot; alt=&quot;Thread photo ${index+1}&quot; loading=&quot;lazy&quot;&gt;
        &lt;/button&gt;
      &lt;/div&gt;`;
    }).join(&#x27;&#x27;)}
  &lt;/div&gt;`;
}

function openThreadPhoto(url){
  if(!url || !threadPhotoLightbox || !threadPhotoLightboxImage) return;
  threadPhotoLightboxImage.src=url;
  threadPhotoLightbox.classList.add(&#x27;show&#x27;);
  threadPhotoLightbox.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
  document.body.style.overflow=&#x27;hidden&#x27;;
}

function closeThreadPhoto(){
  if(!threadPhotoLightbox || !threadPhotoLightboxImage) return;
  threadPhotoLightbox.classList.remove(&#x27;show&#x27;);
  threadPhotoLightbox.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  threadPhotoLightboxImage.removeAttribute(&#x27;src&#x27;);
  document.body.style.overflow=&#x27;&#x27;;
}

function setThreadsAuthState(session){
  const signedIn = !!session?.user;

  if(openThreadComposerBtn){
    openThreadComposerBtn.disabled = !signedIn;
    openThreadComposerBtn.textContent = signedIn ? &#x27;+ New Thread&#x27; : &#x27;Log in to post&#x27;;
  }

  if(threadGuestNote){
    threadGuestNote.textContent = signedIn
      ? &#x27;Start a topic or jump into an existing discussion.&#x27;
      : &#x27;Anyone can read threads. Log in to create one or reply.&#x27;;
  }

  if(!signedIn &amp;&amp; threadComposer){
    threadComposer.classList.add(&#x27;hidden&#x27;);
  }

  if(activeThread) updateThreadReplyComposer(session);
}



function renumberThreadPollOptions(){
  const rows=[...(threadPollOptions?.querySelectorAll(&#x27;[data-poll-option-row]&#x27;) || [])];

  rows.forEach((row,index)=&gt;{
    const number=row.querySelector(&#x27;:scope &gt; span&#x27;);
    const input=row.querySelector(&#x27;[data-thread-poll-option]&#x27;);
    const remove=row.querySelector(&#x27;[data-remove-poll-option]&#x27;);

    if(number) number.textContent=String(index+1);
    if(input) input.placeholder=`Option ${index+1}`;
    if(remove) remove.disabled=rows.length&lt;=2;
  });

  if(threadPollAddOption) threadPollAddOption.disabled=rows.length&gt;=6;
}

function addThreadPollOption(){
  if(!threadPollOptions) return;

  const current=threadPollOptions.querySelectorAll(&#x27;[data-poll-option-row]&#x27;).length;
  if(current&gt;=6) return;

  const row=document.createElement(&#x27;div&#x27;);
  row.className=&#x27;thread-poll-option-edit&#x27;;
  row.setAttribute(&#x27;data-poll-option-row&#x27;,&#x27;&#x27;);
  row.innerHTML=`
    &lt;span&gt;${current+1}&lt;/span&gt;
    &lt;input type=&quot;text&quot; maxlength=&quot;100&quot; data-thread-poll-option placeholder=&quot;Option ${current+1}&quot;&gt;
    &lt;button type=&quot;button&quot; data-remove-poll-option aria-label=&quot;Remove option&quot;&gt;×&lt;/button&gt;
  `;

  threadPollOptions.appendChild(row);
  renumberThreadPollOptions();
  row.querySelector(&#x27;input&#x27;)?.focus();
}

function setThreadPollEnabled(enabled){
  threadPollEnabled=!!enabled;
  threadPollFields?.classList.toggle(&#x27;hidden&#x27;,!threadPollEnabled);

  if(threadPollToggle){
    threadPollToggle.classList.toggle(&#x27;active&#x27;,threadPollEnabled);
    threadPollToggle.textContent=threadPollEnabled ? &#x27;📊 Poll added&#x27; : &#x27;📊 Add poll&#x27;;
  }

  if(threadPollEnabled) threadPollQuestion?.focus();
}

function resetThreadPollComposer(){
  threadPollEnabled=false;
  threadPollFields?.classList.add(&#x27;hidden&#x27;);

  if(threadPollToggle){
    threadPollToggle.classList.remove(&#x27;active&#x27;);
    threadPollToggle.textContent=&#x27;📊 Add poll&#x27;;
  }

  if(threadPollQuestion) threadPollQuestion.value=&#x27;&#x27;;

  if(threadPollOptions){
    threadPollOptions.innerHTML=`
      &lt;div class=&quot;thread-poll-option-edit&quot; data-poll-option-row&gt;
        &lt;span&gt;1&lt;/span&gt;
        &lt;input type=&quot;text&quot; maxlength=&quot;100&quot; data-thread-poll-option placeholder=&quot;Option 1&quot;&gt;
        &lt;button type=&quot;button&quot; data-remove-poll-option aria-label=&quot;Remove option&quot;&gt;×&lt;/button&gt;
      &lt;/div&gt;
      &lt;div class=&quot;thread-poll-option-edit&quot; data-poll-option-row&gt;
        &lt;span&gt;2&lt;/span&gt;
        &lt;input type=&quot;text&quot; maxlength=&quot;100&quot; data-thread-poll-option placeholder=&quot;Option 2&quot;&gt;
        &lt;button type=&quot;button&quot; data-remove-poll-option aria-label=&quot;Remove option&quot;&gt;×&lt;/button&gt;
      &lt;/div&gt;
    `;
  }

  renumberThreadPollOptions();
}

function collectThreadPollDraft(){
  if(!threadPollEnabled){
    return {enabled:false,question:&#x27;&#x27;,options:[],error:&#x27;&#x27;};
  }

  const question=String(threadPollQuestion?.value || &#x27;&#x27;).trim();
  const options=[...(threadPollOptions?.querySelectorAll(&#x27;[data-thread-poll-option]&#x27;) || [])]
    .map(input=&gt;String(input.value || &#x27;&#x27;).trim())
    .filter(Boolean);

  if(question.length&lt;3){
    return {enabled:true,question,options,error:&#x27;Give your poll a question.&#x27;};
  }

  if(options.length&lt;2){
    return {enabled:true,question,options,error:&#x27;Add at least 2 poll options.&#x27;};
  }

  if(options.length&gt;6){
    return {enabled:true,question,options,error:&#x27;Polls can have up to 6 options.&#x27;};
  }

  const unique=new Set(options.map(x=&gt;x.toLowerCase()));
  if(unique.size!==options.length){
    return {enabled:true,question,options,error:&#x27;Poll options must be different.&#x27;};
  }

  return {enabled:true,question,options,error:&#x27;&#x27;};
}

async function loadThreadPoll(threadId,session=null){
  if(!threadViewPoll) return;

  const client=window.gymcelsLolDb;
  if(!client) return;

  const currentSession=session || await getChatSession();

  try{
    const {data,error}=await client.rpc(&#x27;get_thread_poll&#x27;,{
      target_thread_id:Number(threadId)
    });

    if(error) throw error;

    const rows=data || [];

    if(!rows.length){
      threadViewPoll.innerHTML=&#x27;&#x27;;
      threadViewPoll.classList.add(&#x27;hidden&#x27;);
      return;
    }

    const first=rows[0];
    const totalVotes=Number(first.total_votes || 0);
    const canVote=!!currentSession?.user &amp;&amp; !activeThread?.is_locked;

    threadViewPoll.innerHTML=`
      &lt;div class=&quot;thread-poll-question&quot;&gt;${escapeChat(first.question || &#x27;Poll&#x27;)}&lt;/div&gt;

      &lt;div class=&quot;thread-poll-options-live&quot;&gt;
        ${rows.map(row=&gt;{
          const count=Number(row.vote_count || 0);
          const percent=totalVotes&gt;0 ? Math.round((count/totalVotes)*100) : 0;
          const selected=row.selected===true;

          return `&lt;button class=&quot;thread-poll-option-live ${selected ? &#x27;selected&#x27; : &#x27;&#x27;}&quot;
                          type=&quot;button&quot;
                          data-thread-poll-vote=&quot;${Number(row.option_id)}&quot;
                          data-thread-poll-id=&quot;${Number(row.poll_id)}&quot;
                          ${canVote ? &#x27;&#x27; : &#x27;disabled&#x27;}&gt;
            &lt;span class=&quot;thread-poll-option-fill&quot; style=&quot;width:${percent}%&quot;&gt;&lt;/span&gt;
            &lt;span class=&quot;thread-poll-option-copy&quot;&gt;
              ${escapeChat(row.option_text || &#x27;Option&#x27;)}
              ${selected ? &#x27;&lt;b&gt;✓ Your vote&lt;/b&gt;&#x27; : &#x27;&#x27;}
            &lt;/span&gt;
            &lt;span class=&quot;thread-poll-option-result&quot;&gt;${percent}% · ${count}&lt;/span&gt;
          &lt;/button&gt;`;
        }).join(&#x27;&#x27;)}
      &lt;/div&gt;

      &lt;div class=&quot;thread-poll-footer&quot;&gt;
        &lt;span&gt;${totalVotes} vote${totalVotes===1?&#x27;&#x27;:&#x27;s&#x27;}&lt;/span&gt;
        &lt;span&gt;${
          !currentSession?.user
            ? &#x27;Log in to vote&#x27;
            : (activeThread?.is_locked ? &#x27;Poll closed while thread is locked&#x27; : &#x27;Tap an option to vote · you can change it&#x27;)
        }&lt;/span&gt;
      &lt;/div&gt;
    `;

    threadViewPoll.classList.remove(&#x27;hidden&#x27;);
  }catch(err){
    console.error(&#x27;Poll load error:&#x27;,err);
    threadViewPoll.innerHTML=&#x27;&#x27;;
    threadViewPoll.classList.add(&#x27;hidden&#x27;);
  }
}

async function voteThreadPoll(pollId,optionId){
  const client=window.gymcelsLolDb;
  const session=await getChatSession();

  if(!client || !session?.user){
    document.getElementById(&#x27;login-card&#x27;)?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
    return;
  }

  try{
    const {error}=await client.rpc(&#x27;vote_in_thread_poll&#x27;,{
      target_poll_id:Number(pollId),
      target_option_id:Number(optionId)
    });

    if(error) throw error;

    if(activeThread){
      await loadThreadPoll(activeThread.id,session);
    }
  }catch(err){
    setThreadStatus(threadReplyStatus,err?.message || String(err),&#x27;error&#x27;);
  }
}

threadPollToggle?.addEventListener(&#x27;click&#x27;,()=&gt;{
  setThreadPollEnabled(!threadPollEnabled);
});

threadPollRemove?.addEventListener(&#x27;click&#x27;,resetThreadPollComposer);
threadPollAddOption?.addEventListener(&#x27;click&#x27;,addThreadPollOption);

threadPollOptions?.addEventListener(&#x27;click&#x27;,(e)=&gt;{
  const btn=e.target.closest(&#x27;[data-remove-poll-option]&#x27;);
  if(!btn) return;

  const rows=threadPollOptions.querySelectorAll(&#x27;[data-poll-option-row]&#x27;);
  if(rows.length&lt;=2) return;

  btn.closest(&#x27;[data-poll-option-row]&#x27;)?.remove();
  renumberThreadPollOptions();
});

threadViewPoll?.addEventListener(&#x27;click&#x27;,(e)=&gt;{
  const btn=e.target.closest(&#x27;[data-thread-poll-vote]&#x27;);
  if(!btn || btn.disabled) return;

  voteThreadPoll(
    Number(btn.dataset.threadPollId),
    Number(btn.dataset.threadPollVote)
  );
});

async function loadThreadBookmarks(session=null){
  const client=window.gymcelsLolDb;
  const currentSession=session || await getChatSession();
  threadBookmarkedIds=new Set();

  if(!client || !currentSession?.user){
    threadBookmarksOnly=false;
    threadBookmarksFilter?.classList.remove(&#x27;active&#x27;);
    return threadBookmarkedIds;
  }

  const {data,error}=await client
    .from(&#x27;thread_bookmarks&#x27;)
    .select(&#x27;thread_id&#x27;)
    .eq(&#x27;user_id&#x27;,currentSession.user.id);

  if(error){
    console.error(&#x27;Thread bookmarks load error:&#x27;,error);
    return threadBookmarkedIds;
  }

  threadBookmarkedIds=new Set((data || []).map(row=&gt;Number(row.thread_id)).filter(Boolean));
  return threadBookmarkedIds;
}

function updateThreadViewBookmark(session){
  if(!threadViewBookmarkBtn || !activeThread) return;
  const signedIn=!!session?.user;
  threadViewBookmarkBtn.classList.toggle(&#x27;hidden&#x27;,!signedIn);
  if(!signedIn) return;

  const saved=threadBookmarkedIds.has(Number(activeThread.id));
  threadViewBookmarkBtn.classList.toggle(&#x27;saved&#x27;,saved);
  threadViewBookmarkBtn.textContent=saved ? &#x27;🔖 Saved&#x27; : &#x27;🔖 Save&#x27;;
}

async function toggleThreadBookmark(threadId){
  const id=Number(threadId);
  if(!id) return;

  const client=window.gymcelsLolDb;
  const session=await getChatSession();

  if(!client || !session?.user){
    setThreadStatus(threadsStatus,&#x27;Log in to save bookmarks.&#x27;,&#x27;error&#x27;);
    return;
  }

  const saved=threadBookmarkedIds.has(id);

  try{
    if(saved){
      const {error}=await client.from(&#x27;thread_bookmarks&#x27;)
        .delete().eq(&#x27;user_id&#x27;,session.user.id).eq(&#x27;thread_id&#x27;,id);
      if(error) throw error;
      threadBookmarkedIds.delete(id);
    }else{
      const {error}=await client.from(&#x27;thread_bookmarks&#x27;)
        .insert({user_id:session.user.id,thread_id:id});
      if(error) throw error;
      threadBookmarkedIds.add(id);
    }

    updateThreadViewBookmark(session);
    await loadThreads();
  }catch(err){
    setThreadStatus(threadsStatus,err?.message || String(err),&#x27;error&#x27;);
  }
}

async function loadThreads(){
  const client=window.gymcelsLolDb;
  if(!client || !threadsList) return;

  setThreadStatus(threadsStatus,&#x27;Loading threads...&#x27;);

  const threadSession=await getChatSession();
  await loadThreadBookmarks(threadSession);

  let query=client
    .from(&#x27;forum_threads&#x27;)
    .select(&#x27;id,author_id,author_name,title,body,category,is_locked,media_url,media_path,media_urls,media_paths,created_at&#x27;)
    .order(&#x27;created_at&#x27;,{ascending:false})
    .limit(200);

  if(threadFilter !== &#x27;All&#x27;) query=query.eq(&#x27;category&#x27;,threadFilter);

  const {data,error}=await query;
  if(error){
    threadsList.innerHTML=`&lt;div class=&quot;thread-empty&quot;&gt;${escapeChat(error.message)}&lt;/div&gt;`;
    setThreadStatus(threadsStatus,&#x27;&#x27;,&#x27;normal&#x27;);
    return;
  }

  let rows=data || [];
  const search=String(threadSearchTerm || &#x27;&#x27;).trim().toLowerCase();

  if(search){
    rows=rows.filter(row=&gt;{
      const haystack=[row.title,row.body,row.author_name,row.category]
        .map(x=&gt;String(x || &#x27;&#x27;).toLowerCase()).join(&#x27; &#x27;);
      return haystack.includes(search);
    });
  }

  if(threadBookmarksOnly){
    rows=rows.filter(row=&gt;threadBookmarkedIds.has(Number(row.id)));
  }

  threadRows=rows;

  if(!threadRows.length){
    const message=threadBookmarksOnly
      ? &#x27;No bookmarked threads match this view.&#x27;
      : (search ? &#x27;No threads matched your search.&#x27; : &#x27;No threads here yet. Be the first to start one.&#x27;);
    threadsList.innerHTML=`&lt;div class=&quot;thread-empty&quot;&gt;${message}&lt;/div&gt;`;
    setThreadStatus(threadsStatus,&#x27;&#x27;);
    return;
  }

  const ids=threadRows.map(x=&gt;x.id);
  let counts={};

  if(ids.length){
    const {data:replyRows,error:replyCountError}=await client
      .from(&#x27;forum_replies&#x27;).select(&#x27;thread_id&#x27;).in(&#x27;thread_id&#x27;,ids);

    if(!replyCountError){
      counts=(replyRows || []).reduce((acc,row)=&gt;{
        acc[row.thread_id]=(acc[row.thread_id] || 0)+1;
        return acc;
      },{});
    }
  }

  const threadStaffRoleMap=await loadPublicStaffRoles(threadRows.map(row=&gt;row.author_id));
  const threadReactionMap=await loadReactionState(
    &#x27;thread&#x27;,ids,threadSession?.user?.id || null
  );

  threadsList.innerHTML=threadRows.map(row=&gt;{
    const preview=String(row.body || &#x27;&#x27;).replace(/\s+/g,&#x27; &#x27;).trim();
    const media=threadAllMedia(row);
    const saved=threadBookmarkedIds.has(Number(row.id));

    return `
      &lt;div class=&quot;thread-card&quot; role=&quot;button&quot; tabindex=&quot;0&quot; data-open-thread=&quot;${row.id}&quot;&gt;
        &lt;div class=&quot;thread-card-top&quot;&gt;
          &lt;span class=&quot;thread-category&quot;&gt;${escapeChat(row.category || &#x27;General&#x27;)}&lt;/span&gt;
          &lt;span class=&quot;thread-card-time&quot;&gt;${escapeChat(threadTime(row.created_at))}&lt;/span&gt;
        &lt;/div&gt;

        &lt;div class=&quot;thread-card-title&quot;&gt;${escapeChat(row.title || &#x27;Untitled&#x27;)}&lt;/div&gt;
        ${preview ? `&lt;div class=&quot;thread-card-preview&quot;&gt;${escapeChat(preview)}&lt;/div&gt;` : &#x27;&#x27;}

        ${media.length ? `
          &lt;div class=&quot;thread-card-media&quot;&gt;
            &lt;img src=&quot;${escapeChat(media[0])}&quot; alt=&quot;Thread photo&quot; loading=&quot;lazy&quot;&gt;
            ${media.length&gt;1 ? `&lt;span class=&quot;thread-card-media-count&quot;&gt;📷 ${media.length}&lt;/span&gt;` : &#x27;&#x27;}
          &lt;/div&gt;` : &#x27;&#x27;}

        &lt;div class=&quot;thread-card-meta&quot;&gt;
          &lt;span class=&quot;thread-card-author&quot;&gt;by ${escapeChat(row.author_name || &#x27;Member&#x27;)}${staffBadgeMarkup(threadStaffRoleMap[row.author_id] || null)}&lt;/span&gt;
          &lt;span&gt;${Number(counts[row.id] || 0)} ${Number(counts[row.id] || 0)===1 ? &#x27;reply&#x27; : &#x27;replies&#x27;}&lt;/span&gt;
          ${media.length ? `&lt;span class=&quot;thread-card-has-photo&quot;&gt;📷 ${media.length} photo${media.length===1?&#x27;&#x27;:&#x27;s&#x27;}&lt;/span&gt;` : &#x27;&#x27;}
          ${row.is_locked ? &#x27;&lt;span class=&quot;thread-card-locked&quot;&gt;🔒 Locked&lt;/span&gt;&#x27; : &#x27;&#x27;}
          ${threadSession?.user ? `
            &lt;button class=&quot;thread-card-bookmark ${saved ? &#x27;saved&#x27; : &#x27;&#x27;}&quot; type=&quot;button&quot;
                    data-thread-bookmark=&quot;${Number(row.id)}&quot;&gt;
              ${saved ? &#x27;🔖 Saved&#x27; : &#x27;🔖 Save&#x27;}
            &lt;/button&gt;` : &#x27;&#x27;}
        &lt;/div&gt;

        ${reactionBarHtml(&#x27;thread&#x27;,row.id,threadReactionMap[Number(row.id)] || {},&#x27;thread-card-reactions&#x27;)}
      &lt;/div&gt;`;
  }).join(&#x27;&#x27;);

  setThreadStatus(threadsStatus,&#x27;&#x27;);
}

async function createThread(){
  if(threadPosting) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setThreadStatus(threadComposerStatus,&#x27;Log in to create a thread.&#x27;,&#x27;error&#x27;);
    return;
  }

  const title = String(threadTitle?.value || &#x27;&#x27;).trim();
  const body = String(threadBody?.value || &#x27;&#x27;).trim();
  const category = String(threadCategory?.value || &#x27;General&#x27;);
  const pollDraft=collectThreadPollDraft();

  if(title.length &lt; 3){
    setThreadStatus(threadComposerStatus,&#x27;Give your thread a title.&#x27;,&#x27;error&#x27;);
    return;
  }
  if(body.length &lt; 2 &amp;&amp; !threadMediaFiles.length &amp;&amp; !pollDraft.enabled){
    setThreadStatus(threadComposerStatus,&#x27;Write something, add a photo, or add a poll.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(pollDraft.error){
    setThreadStatus(threadComposerStatus,pollDraft.error,&#x27;error&#x27;);
    return;
  }

  threadPosting = true;
  if(createThreadBtn) createThreadBtn.disabled = true;
  setThreadStatus(threadComposerStatus,&#x27;Posting...&#x27;);

  let uploadedMedia = {urls:[],paths:[]};

  try{
    if(threadMediaFiles.length){
      setThreadStatus(threadComposerStatus,`Uploading ${threadMediaFiles.length} photo${threadMediaFiles.length===1?&#x27;&#x27;:&#x27;s&#x27;}...`);
      uploadedMedia=await uploadThreadMediaFiles(threadMediaFiles,session.user.id,&#x27;threads&#x27;);
      setThreadStatus(threadComposerStatus,&#x27;Posting thread...&#x27;);
    }

    const { data, error } = await client
      .from(&#x27;forum_threads&#x27;)
      .insert({
        author_id:session.user.id,
        author_name:chatDisplayName(session.user),
        title,
        body,
        category,
        media_url:uploadedMedia.urls[0] || null,
        media_path:uploadedMedia.paths[0] || null,
        media_urls:uploadedMedia.urls,
        media_paths:uploadedMedia.paths
      })
      .select(&#x27;id&#x27;)
      .single();

    if(error){
      if(uploadedMedia.paths.length) await cleanupUploadedThreadMedia(uploadedMedia.paths);
      throw error;
    }

    if(pollDraft.enabled){
      const {error:pollError}=await client.rpc(&#x27;create_thread_poll&#x27;,{
        target_thread_id:Number(data.id),
        poll_question:pollDraft.question,
        poll_options:pollDraft.options
      });

      if(pollError){
        // Keep the database clean if the thread was created but its poll failed.
        try{ await client.from(&#x27;forum_threads&#x27;).delete().eq(&#x27;id&#x27;,Number(data.id)); }catch(_){}
        if(uploadedMedia.paths.length){
          await cleanupUploadedThreadMedia(uploadedMedia.paths);
          uploadedMedia={urls:[],paths:[]};
        }
        throw pollError;
      }
    }

    if(threadTitle) threadTitle.value = &#x27;&#x27;;
    if(threadBody) threadBody.value = &#x27;&#x27;;
    clearThreadMediaSelection();
    resetThreadPollComposer();
    if(threadComposer) threadComposer.classList.add(&#x27;hidden&#x27;);
    setThreadStatus(threadComposerStatus,&#x27;✓ THREAD POSTED&#x27;,&#x27;success&#x27;);

    await loadThreads();
    if(data?.id) await openThread(Number(data.id));
  }catch(err){
    setThreadStatus(threadComposerStatus, err?.message || String(err), &#x27;error&#x27;);
  }finally{
    threadPosting = false;
    if(createThreadBtn) createThreadBtn.disabled = false;
  }
}


function clearThreadReplyTarget(){
  threadReplyTarget = null;
  threadReplyTargetBar?.classList.add(&#x27;hidden&#x27;);
  if(threadReplyTargetName) threadReplyTargetName.textContent = &#x27;Member&#x27;;
  if(threadReplyTargetPreview) threadReplyTargetPreview.textContent = &#x27;&#x27;;
}

function startThreadReplyTo(row){
  if(!row) return;

  threadReplyTarget = {
    id:Number(row.id),
    author_id:String(row.author_id || &#x27;&#x27;),
    author_name:String(row.author_name || &#x27;Member&#x27;),
    body:String(row.body || &#x27;&#x27;)
  };

  if(threadReplyTargetName){
    threadReplyTargetName.textContent = threadReplyTarget.author_name;
  }

  if(threadReplyTargetPreview){
    const preview = threadReplyTarget.body.replace(/\s+/g,&#x27; &#x27;).trim();
    threadReplyTargetPreview.textContent =
      preview.length &gt; 120 ? preview.slice(0,120) + &#x27;…&#x27; : preview;
  }

  threadReplyTargetBar?.classList.remove(&#x27;hidden&#x27;);
  threadReplyInput?.focus();
}

function jumpToThreadReply(replyId){
  const target = threadReplies?.querySelector(`[data-thread-reply-id=&quot;${Number(replyId)}&quot;]`);
  if(!target) return;

  target.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
  target.classList.remove(&#x27;reply-highlight&#x27;);
  void target.offsetWidth;
  target.classList.add(&#x27;reply-highlight&#x27;);

  setTimeout(() =&gt; target.classList.remove(&#x27;reply-highlight&#x27;),1500);
}

function updateThreadReplyComposer(session){
  if(!threadReplyInput || !threadReplyBtn || !threadReplyLocked) return;

  const signedIn = !!session?.user;
  const locked = !!activeThread?.is_locked;

  threadReplyLocked.classList.toggle(&#x27;hidden&#x27;, !locked);

  if(locked){
    threadReplyInput.disabled = true;
    threadReplyBtn.disabled = true;
    if(threadReplyMediaInput) threadReplyMediaInput.disabled = true;
    threadReplyMediaLabel?.classList.add(&#x27;disabled&#x27;);
    threadReplyInput.placeholder = &#x27;This thread is locked.&#x27;;
    threadReplyBtn.textContent = &#x27;Locked&#x27;;
  }else if(!signedIn){
    threadReplyInput.disabled = true;
    threadReplyBtn.disabled = true;
    if(threadReplyMediaInput) threadReplyMediaInput.disabled = true;
    threadReplyMediaLabel?.classList.add(&#x27;disabled&#x27;);
    threadReplyInput.placeholder = &#x27;Log in to reply...&#x27;;
    threadReplyBtn.textContent = &#x27;Log in to reply&#x27;;
  }else{
    threadReplyInput.disabled = false;
    threadReplyBtn.disabled = false;
    if(threadReplyMediaInput) threadReplyMediaInput.disabled = false;
    threadReplyMediaLabel?.classList.remove(&#x27;disabled&#x27;);
    threadReplyInput.placeholder = &#x27;Write a reply or add a photo...&#x27;;
    threadReplyBtn.textContent = &#x27;Reply&#x27;;
  }
}

async function loadThreadReplies(threadId){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !threadReplies) return;

  const { data, error } = await client
    .from(&#x27;forum_replies&#x27;)
    .select(&#x27;id,thread_id,author_id,author_name,body,reply_to_id,media_url,media_path,media_urls,media_paths,created_at&#x27;)
    .eq(&#x27;thread_id&#x27;, threadId)
    .order(&#x27;created_at&#x27;,{ascending:true})
    .limit(300);

  if(error){
    threadReplies.innerHTML = `&lt;div class=&quot;thread-empty&quot;&gt;${escapeChat(error.message)}&lt;/div&gt;`;
    return;
  }

  const rows = data || [];
  if(threadReplyCount) threadReplyCount.textContent = String(rows.length);

  if(!rows.length){
    threadReplies.innerHTML = &#x27;&lt;div class=&quot;thread-empty&quot;&gt;No replies yet. Start the conversation.&lt;/div&gt;&#x27;;
    return;
  }

  const me = session?.user?.id || null;
  const rowMap = new Map(rows.map(row =&gt; [Number(row.id),row]));
  const canReply = !!me &amp;&amp; !activeThread?.is_locked;

  const threadReplyStaffRoleMap = await loadPublicStaffRoles(
    rows.map(row =&gt; row.author_id)
  );

  const threadReplyReactionMap = await loadReactionState(
    &#x27;thread_reply&#x27;,
    rows.map(row =&gt; row.id),
    me
  );

  threadReplies.innerHTML = rows.map(row =&gt; {
    const canDelete = !!me &amp;&amp; (row.author_id === me || canModerateThreads());
    const canReport = !!me &amp;&amp; row.author_id !== me;
    const quoted = row.reply_to_id ? rowMap.get(Number(row.reply_to_id)) : null;
    const quotedPreview = quoted
      ? String(quoted.body || &#x27;&#x27;).replace(/\s+/g,&#x27; &#x27;).trim()
      : &#x27;&#x27;;

    return `
      &lt;div class=&quot;thread-reply&quot; data-thread-reply-id=&quot;${row.id}&quot;&gt;
        ${quoted ? `
          &lt;button class=&quot;thread-quoted-reply&quot;
                  type=&quot;button&quot;
                  data-jump-thread-reply=&quot;${quoted.id}&quot;&gt;
            &lt;strong&gt;Replying to ${escapeChat(quoted.author_name || &#x27;Member&#x27;)}&lt;/strong&gt;
            &lt;span&gt;${escapeChat(quotedPreview.length &gt; 150 ? quotedPreview.slice(0,150) + &#x27;…&#x27; : quotedPreview)}&lt;/span&gt;
          &lt;/button&gt;` : &#x27;&#x27;}

        &lt;div class=&quot;thread-reply-head&quot;&gt;
          &lt;span class=&quot;thread-reply-author-wrap&quot;&gt;
            &lt;span class=&quot;thread-reply-author&quot;&gt;${escapeChat(row.author_name || &#x27;Member&#x27;)}&lt;/span&gt;
            ${staffBadgeMarkup(threadReplyStaffRoleMap[row.author_id] || null)}
          &lt;/span&gt;
          &lt;span class=&quot;thread-reply-time&quot;&gt;${escapeChat(threadTime(row.created_at))}&lt;/span&gt;
        &lt;/div&gt;

        ${row.body ? `&lt;div class=&quot;thread-reply-body&quot;&gt;${chatTextWithMentions(row.body || &#x27;&#x27;)}&lt;/div&gt;` : &#x27;&#x27;}

        ${threadAllMedia(row).length
          ? `&lt;div class=&quot;thread-reply-media&quot;&gt;${threadMediaGalleryMarkup(threadAllMedia(row))}&lt;/div&gt;`
          : &#x27;&#x27;}

        ${reactionBarHtml(
          &#x27;thread_reply&#x27;,
          row.id,
          threadReplyReactionMap[Number(row.id)] || {}
        )}

        ${(canReply || canDelete || canReport) ? `
          &lt;div class=&quot;thread-reply-actions&quot;&gt;
            ${canReply ? `
              &lt;button class=&quot;thread-reply-reply&quot;
                      type=&quot;button&quot;
                      data-reply-thread-user=&quot;${row.id}&quot;&gt;Reply&lt;/button&gt;` : &#x27;&#x27;}
            ${canReport ? `
              &lt;button class=&quot;content-report-btn&quot;
                      type=&quot;button&quot;
                      data-content-report=&quot;thread_reply&quot;
                      data-report-id=&quot;${row.id}&quot;
                      data-report-user=&quot;${escapeChat(row.author_id || &#x27;&#x27;)}&quot;
                      data-report-label=&quot;Reply by ${escapeChat(row.author_name || &#x27;Member&#x27;)}&quot;&gt;Report&lt;/button&gt;` : &#x27;&#x27;}
            ${canDelete ? `
              &lt;button class=&quot;thread-reply-delete&quot;
                      type=&quot;button&quot;
                      data-delete-thread-reply=&quot;${row.id}&quot;&gt;Delete&lt;/button&gt;` : &#x27;&#x27;}
          &lt;/div&gt;` : &#x27;&#x27;}
      &lt;/div&gt;`;
  }).join(&#x27;&#x27;);

  // Keep enough row data available for reply buttons without another database request.
  threadReplies._gymcelsRows = rows;
}

async function openThread(threadId){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !threadOverlay) return;

  if(session?.user){
    await refreshChatAdminStatus(session);
  }

  const { data, error } = await client
    .from(&#x27;forum_threads&#x27;)
    .select(&#x27;id,author_id,author_name,title,body,category,is_locked,media_url,media_path,media_urls,media_paths,created_at&#x27;)
    .eq(&#x27;id&#x27;, threadId)
    .maybeSingle();

  if(error || !data){
    setThreadStatus(threadsStatus, error?.message || &#x27;Thread not found.&#x27;, &#x27;error&#x27;);
    return;
  }

  activeThread = data;

  threadViewCategory.textContent = data.category || &#x27;General&#x27;;
  threadViewTitle.textContent = data.title || &#x27;Thread&#x27;;
  threadViewAuthor.textContent = data.author_name || &#x27;Member&#x27;;
  threadViewTime.textContent = threadTime(data.created_at);
  threadViewBody.textContent = data.body || &#x27;&#x27;;
  threadViewBody.classList.toggle(&#x27;hidden&#x27;, !String(data.body || &#x27;&#x27;).trim());

  if(threadViewMedia){
    const media=threadAllMedia(data);
    if(media.length){
      threadViewMedia.innerHTML=threadMediaGalleryMarkup(media);
      threadViewMedia.classList.remove(&#x27;hidden&#x27;);
    }else{
      threadViewMedia.innerHTML=&#x27;&#x27;;
      threadViewMedia.classList.add(&#x27;hidden&#x27;);
    }
  }

  const openedThreadStaffRoles = await loadPublicStaffRoles([data.author_id]);
  if(threadViewAuthorStaff){
    threadViewAuthorStaff.innerHTML = staffBadgeMarkup(openedThreadStaffRoles[data.author_id] || null);
  }

  const threadViewReactionMap = await loadReactionState(
    &#x27;thread&#x27;,
    [data.id],
    session?.user?.id || null
  );

  if(threadViewReactions){
    threadViewReactions.innerHTML = reactionBarHtml(
      &#x27;thread&#x27;,
      data.id,
      threadViewReactionMap[Number(data.id)] || {},
      &#x27;reaction-bar-thread&#x27;
    );
  }

  const canManage = !!session?.user &amp;&amp; (data.author_id === session.user.id || canModerateThreads());
  threadOwnerActions.classList.toggle(&#x27;hidden&#x27;, !canManage);

  const threadReportBtn = document.getElementById(&#x27;threadReportBtn&#x27;);
  if(threadReportBtn){
    threadReportBtn.classList.toggle(
      &#x27;hidden&#x27;,
      !session?.user || data.author_id === session.user.id
    );
  }

  await loadThreadBookmarks(session);
  updateThreadViewBookmark(session);

  if(threadLockBtn){
    threadLockBtn.textContent = data.is_locked ? &#x27;Unlock Thread&#x27; : &#x27;Lock Thread&#x27;;
  }

  setThreadStatus(threadReplyStatus,&#x27;&#x27;);
  updateThreadReplyComposer(session);

  threadOverlay.classList.add(&#x27;show&#x27;);
  threadOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);

  await loadThreadReplies(data.id);
  await loadThreadPoll(data.id,session);
}

function closeThread(){
  if(!threadOverlay) return;
  threadOverlay.classList.remove(&#x27;show&#x27;);
  threadOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  activeThread = null;
  document.getElementById(&#x27;threadReportBtn&#x27;)?.classList.add(&#x27;hidden&#x27;);
  if(threadViewPoll){
    threadViewPoll.innerHTML=&#x27;&#x27;;
    threadViewPoll.classList.add(&#x27;hidden&#x27;);
  }
  if(threadReplyInput) threadReplyInput.value = &#x27;&#x27;;
  clearThreadReplyMediaSelection();
  clearThreadReplyTarget();
  setThreadStatus(threadReplyStatus,&#x27;&#x27;);
}

async function postThreadReply(){
  if(threadReplyPosting || !activeThread) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setThreadStatus(threadReplyStatus,&#x27;Log in to reply.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(activeThread.is_locked){
    setThreadStatus(threadReplyStatus,&#x27;This thread is locked.&#x27;,&#x27;error&#x27;);
    return;
  }

  const body = String(threadReplyInput?.value || &#x27;&#x27;).trim();
  if(!body &amp;&amp; !threadReplyMediaFiles.length){
    setThreadStatus(threadReplyStatus,&#x27;Write a reply or add a photo.&#x27;,&#x27;error&#x27;);
    return;
  }

  threadReplyPosting = true;
  if(threadReplyBtn) threadReplyBtn.disabled = true;
  setThreadStatus(threadReplyStatus,&#x27;Posting reply...&#x27;);

  let uploadedMedia = {urls:[],paths:[]};

  try{
    if(threadReplyMediaFiles.length){
      setThreadStatus(threadReplyStatus,`Uploading ${threadReplyMediaFiles.length} photo${threadReplyMediaFiles.length===1?&#x27;&#x27;:&#x27;s&#x27;}...`);
      uploadedMedia=await uploadThreadMediaFiles(threadReplyMediaFiles,session.user.id,&#x27;replies&#x27;);
      setThreadStatus(threadReplyStatus,&#x27;Posting reply...&#x27;);
    }

    const { error } = await client
      .from(&#x27;forum_replies&#x27;)
      .insert({
        thread_id:activeThread.id,
        author_id:session.user.id,
        author_name:chatDisplayName(session.user),
        body,
        reply_to_id:threadReplyTarget?.id || null,
        media_url:uploadedMedia.urls[0] || null,
        media_path:uploadedMedia.paths[0] || null,
        media_urls:uploadedMedia.urls,
        media_paths:uploadedMedia.paths
      });

    if(error){
      if(uploadedMedia.paths.length) await cleanupUploadedThreadMedia(uploadedMedia.paths);
      throw error;
    }

    threadReplyInput.value = &#x27;&#x27;;
    clearThreadReplyMediaSelection();
    clearThreadReplyTarget();
    setThreadStatus(threadReplyStatus,&#x27;✓ REPLY POSTED&#x27;,&#x27;success&#x27;);

    await loadThreadReplies(activeThread.id);
    await loadThreads();
    setTimeout(() =&gt; setThreadStatus(threadReplyStatus,&#x27;&#x27;), 2000);
  }catch(err){
    setThreadStatus(threadReplyStatus,err?.message || String(err),&#x27;error&#x27;);
  }finally{
    threadReplyPosting = false;
    updateThreadReplyComposer(session);
  }
}

async function deleteThread(threadId){
  const client=window.gymcelsLolDb;
  if(!client || !threadId) return;
  if(!confirm(&#x27;Delete this entire thread and all of its replies?&#x27;)) return;

  let mediaPaths=[];
  try{
    const [threadRes,repliesRes]=await Promise.all([
      client.from(&#x27;forum_threads&#x27;).select(&#x27;media_path,media_paths&#x27;).eq(&#x27;id&#x27;,threadId).maybeSingle(),
      client.from(&#x27;forum_replies&#x27;).select(&#x27;media_path,media_paths&#x27;).eq(&#x27;thread_id&#x27;,threadId)
    ]);
    if(threadRes.data) mediaPaths.push(...threadAllMediaPaths(threadRes.data));
    (repliesRes.data || []).forEach(row=&gt;mediaPaths.push(...threadAllMediaPaths(row)));
  }catch(_){}

  const {error}=await client.from(&#x27;forum_threads&#x27;).delete().eq(&#x27;id&#x27;,threadId);
  if(error){
    setThreadStatus(threadReplyStatus,error.message,&#x27;error&#x27;);
    return;
  }

  await cleanupUploadedThreadMedia([...new Set(mediaPaths)]);
  closeThread();
  await loadThreads();
}

async function toggleThreadLock(){
  if(!activeThread) return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  const nextLocked = !activeThread.is_locked;
  const { error } = await client.rpc(&#x27;set_thread_locked&#x27;, {
    target_thread_id:activeThread.id,
    locked_value:nextLocked
  });

  if(error){
    setThreadStatus(threadReplyStatus,error.message,&#x27;error&#x27;);
    return;
  }

  activeThread.is_locked = nextLocked;
  threadLockBtn.textContent = nextLocked ? &#x27;Unlock Thread&#x27; : &#x27;Lock Thread&#x27;;

  const session = await getChatSession();
  updateThreadReplyComposer(session);
  await loadThreadPoll(activeThread.id,session);
  await loadThreads();
}

async function deleteThreadReply(replyId){
  const client=window.gymcelsLolDb;
  if(!client || !replyId || !activeThread) return;
  if(!confirm(&#x27;Delete this reply?&#x27;)) return;

  let mediaPaths=[];
  try{
    const {data}=await client.from(&#x27;forum_replies&#x27;)
      .select(&#x27;media_path,media_paths&#x27;).eq(&#x27;id&#x27;,replyId).maybeSingle();
    if(data) mediaPaths=threadAllMediaPaths(data);
  }catch(_){}

  const {error}=await client.from(&#x27;forum_replies&#x27;).delete().eq(&#x27;id&#x27;,replyId);
  if(error){
    setThreadStatus(threadReplyStatus,error.message,&#x27;error&#x27;);
    return;
  }

  await cleanupUploadedThreadMedia(mediaPaths);
  await loadThreadReplies(activeThread.id);
  await loadThreads();
}

threadMediaInput?.addEventListener(&#x27;change&#x27;,() =&gt; {
  const files=[...(threadMediaInput.files || [])];
  if(files.length) previewThreadMedia(files,false);
});
threadMediaRemove?.addEventListener(&#x27;click&#x27;,clearThreadMediaSelection);

threadReplyMediaInput?.addEventListener(&#x27;change&#x27;,() =&gt; {
  const files=[...(threadReplyMediaInput.files || [])];
  if(files.length) previewThreadMedia(files,true);
});
threadReplyMediaRemove?.addEventListener(&#x27;click&#x27;,clearThreadReplyMediaSelection);

document.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  const photo = e.target.closest(&#x27;[data-thread-photo]&#x27;);
  if(photo){
    e.preventDefault();
    e.stopPropagation();
    openThreadPhoto(photo.dataset.threadPhoto || &#x27;&#x27;);
  }
});

threadPhotoLightboxClose?.addEventListener(&#x27;click&#x27;,closeThreadPhoto);
threadPhotoLightbox?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  if(e.target === threadPhotoLightbox) closeThreadPhoto();
});


threadSearchInput?.addEventListener(&#x27;input&#x27;,() =&gt; {
  clearTimeout(threadSearchTimer);
  threadSearchTerm=String(threadSearchInput.value || &#x27;&#x27;).trim();
  threadSearchClear?.classList.toggle(&#x27;hidden&#x27;,!threadSearchTerm);
  threadSearchTimer=setTimeout(loadThreads,180);
});

threadSearchInput?.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
  if(e.key===&#x27;Enter&#x27;){
    e.preventDefault();
    threadSearchTerm=String(threadSearchInput.value || &#x27;&#x27;).trim();
    loadThreads();
  }
});

threadSearchClear?.addEventListener(&#x27;click&#x27;,() =&gt; {
  if(threadSearchInput) threadSearchInput.value=&#x27;&#x27;;
  threadSearchTerm=&#x27;&#x27;;
  threadSearchClear.classList.add(&#x27;hidden&#x27;);
  loadThreads();
});

threadBookmarksFilter?.addEventListener(&#x27;click&#x27;,async () =&gt; {
  const session=await getChatSession();
  if(!session?.user){
    setThreadStatus(threadsStatus,&#x27;Log in to view bookmarked threads.&#x27;,&#x27;error&#x27;);
    return;
  }

  threadBookmarksOnly=!threadBookmarksOnly;
  threadBookmarksFilter.classList.toggle(&#x27;active&#x27;,threadBookmarksOnly);
  await loadThreads();
});

threadViewBookmarkBtn?.addEventListener(&#x27;click&#x27;,() =&gt; {
  if(activeThread) toggleThreadBookmark(activeThread.id);
});

if(navThreadsOutside){
  navThreadsOutside.addEventListener(&#x27;click&#x27;, () =&gt; {
    setTimeout(loadThreads, 100);
  });
}

if(openThreadComposerBtn){
  openThreadComposerBtn.addEventListener(&#x27;click&#x27;, async () =&gt; {
    const session = await getChatSession();
    if(!session?.user){
      document.getElementById(&#x27;login-card&#x27;)?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
      return;
    }
    threadComposer.classList.remove(&#x27;hidden&#x27;);
    threadTitle?.focus();
  });
}

if(cancelThreadBtn){
  cancelThreadBtn.addEventListener(&#x27;click&#x27;, () =&gt; {
    threadComposer.classList.add(&#x27;hidden&#x27;);
    clearThreadMediaSelection();
    resetThreadPollComposer();
    setThreadStatus(threadComposerStatus,&#x27;&#x27;);
  });
}

if(createThreadBtn) createThreadBtn.addEventListener(&#x27;click&#x27;, createThread);

if(threadFilters){
  threadFilters.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    const btn = e.target.closest(&#x27;[data-thread-filter]&#x27;);
    if(!btn) return;

    threadFilter = btn.dataset.threadFilter || &#x27;All&#x27;;

    threadFilters.querySelectorAll(&#x27;.thread-filter&#x27;).forEach(x =&gt;
      x.classList.toggle(&#x27;active&#x27;, x === btn)
    );

    loadThreads();
  });
}

if(threadsList){
  threadsList.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    if(e.target.closest(&#x27;.reaction-control&#x27;)) return;

    const bookmark=e.target.closest(&#x27;[data-thread-bookmark]&#x27;);
    if(bookmark){
      e.preventDefault();
      e.stopPropagation();
      toggleThreadBookmark(Number(bookmark.dataset.threadBookmark));
      return;
    }

    const card = e.target.closest(&#x27;[data-open-thread]&#x27;);
    if(card) openThread(Number(card.dataset.openThread));
  });

  threadsList.addEventListener(&#x27;keydown&#x27;,(e) =&gt; {
    if(e.key !== &#x27;Enter&#x27; &amp;&amp; e.key !== &#x27; &#x27;) return;
    if(e.target.closest(&#x27;.reaction-control&#x27;) || e.target.closest(&#x27;[data-thread-bookmark]&#x27;)) return;

    const card = e.target.closest(&#x27;[data-open-thread]&#x27;);
    if(card){
      e.preventDefault();
      openThread(Number(card.dataset.openThread));
    }
  });
}

if(threadCloseBtn) threadCloseBtn.addEventListener(&#x27;click&#x27;, closeThread);
if(threadOverlay){
  threadOverlay.addEventListener(&#x27;click&#x27;, (e) =&gt; {
    if(e.target === threadOverlay) closeThread();
  });
}

if(threadReplyBtn) threadReplyBtn.addEventListener(&#x27;click&#x27;, postThreadReply);
if(threadReplyInput){
  threadReplyInput.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
    if((e.ctrlKey || e.metaKey) &amp;&amp; e.key === &#x27;Enter&#x27;){
      e.preventDefault();
      postThreadReply();
    }
  });
}

if(threadDeleteBtn){
  threadDeleteBtn.addEventListener(&#x27;click&#x27;, () =&gt; {
    if(activeThread) deleteThread(activeThread.id);
  });
}

if(threadLockBtn) threadLockBtn.addEventListener(&#x27;click&#x27;, toggleThreadLock);

if(threadReplies){
  threadReplies.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    const jumpBtn = e.target.closest(&#x27;[data-jump-thread-reply]&#x27;);
    if(jumpBtn){
      jumpToThreadReply(Number(jumpBtn.dataset.jumpThreadReply));
      return;
    }

    const replyBtn = e.target.closest(&#x27;[data-reply-thread-user]&#x27;);
    if(replyBtn){
      const session = await getChatSession();
      if(!session?.user){
        setThreadStatus(threadReplyStatus,&#x27;Log in to reply.&#x27;,&#x27;error&#x27;);
        return;
      }

      if(activeThread?.is_locked){
        setThreadStatus(threadReplyStatus,&#x27;This thread is locked.&#x27;,&#x27;error&#x27;);
        return;
      }

      const replyId = Number(replyBtn.dataset.replyThreadUser);
      const rows = threadReplies._gymcelsRows || [];
      const row = rows.find(x =&gt; Number(x.id) === replyId);
      if(row) startThreadReplyTo(row);
      return;
    }

    const deleteBtn = e.target.closest(&#x27;[data-delete-thread-reply]&#x27;);
    if(deleteBtn){
      deleteThreadReply(Number(deleteBtn.dataset.deleteThreadReply));
    }
  });
}

threadReplyTargetCancel?.addEventListener(&#x27;click&#x27;,clearThreadReplyTarget);

document.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
  if(e.key !== &#x27;Escape&#x27;) return;
  if(threadPhotoLightbox?.classList.contains(&#x27;show&#x27;)){
    closeThreadPhoto();
    return;
  }
  if(threadOverlay?.classList.contains(&#x27;show&#x27;)) closeThread();
});

function startThreads(session){
  clearInterval(threadsPollTimer);
  setThreadsAuthState(session);
  loadThreads();
  threadsPollTimer = setInterval(loadThreads, 15000);
}



// ---- Gymcel Crew: General + Gaming ----
const navVoiceOutside = document.getElementById(&#x27;navVoice&#x27;);
const voiceSection = document.getElementById(&#x27;voiceSection&#x27;);
const voiceGuestNote = document.getElementById(&#x27;voiceGuestNote&#x27;);
const joinVoiceGeneral = document.getElementById(&#x27;joinVoiceGeneral&#x27;);
const joinVoiceGaming = document.getElementById(&#x27;joinVoiceGaming&#x27;);
const voiceCountGeneral = document.getElementById(&#x27;voiceCountGeneral&#x27;);
const voiceCountGaming = document.getElementById(&#x27;voiceCountGaming&#x27;);
const voiceMembersGeneral = document.getElementById(&#x27;voiceMembersGeneral&#x27;);
const voiceMembersGaming = document.getElementById(&#x27;voiceMembersGaming&#x27;);
const voiceControls = document.getElementById(&#x27;voiceControls&#x27;);
const voiceCurrentRoom = document.getElementById(&#x27;voiceCurrentRoom&#x27;);
const voiceConnectionText = document.getElementById(&#x27;voiceConnectionText&#x27;);
const voiceMuteBtn = document.getElementById(&#x27;voiceMuteBtn&#x27;);
const voiceLeaveBtn = document.getElementById(&#x27;voiceLeaveBtn&#x27;);
const voiceStatus = document.getElementById(&#x27;voiceStatus&#x27;);
const voiceMicState = document.getElementById(&#x27;voiceMicState&#x27;);
const voiceAudioMount = document.getElementById(&#x27;voiceAudioMount&#x27;);

const VOICE_ROOMS = {
  general:{ topic:&#x27;voice:general&#x27;, label:&#x27;General&#x27; },
  gaming:{ topic:&#x27;voice:gaming&#x27;, label:&#x27;Gaming&#x27; }
};

let voiceRoomKey = null;
let voiceRealtimeChannel = null;
let voiceLocalStream = null;
let voiceMuted = false;
// These are people YOU chose to silence locally.
// This does not change their microphone or what anyone else hears.
let voiceLocallyMutedUsers = new Set();
let voiceKickPollTimer = null;
let voiceSessionUser = null;
let voicePeers = new Map();
let voicePresence = {};
let voiceRoomPreviewChannels = new Map();
let voicePreviewState = {general:{},gaming:{}};

const voiceIceServers = [
  { urls:&#x27;stun:stun.l.google.com:19302&#x27; },
  { urls:&#x27;stun:stun1.l.google.com:19302&#x27; }
];

function setVoiceStatus(text=&#x27;&#x27;, type=&#x27;normal&#x27;){
  if(!voiceStatus) return;
  voiceStatus.textContent = text;
  voiceStatus.style.color =
    type === &#x27;error&#x27; ? &#x27;#ff7c89&#x27; :
    type === &#x27;success&#x27; ? &#x27;#67e8a5&#x27; :
    &#x27;#858e9a&#x27;;
  voiceStatus.style.fontWeight = type === &#x27;error&#x27; || type === &#x27;success&#x27; ? &#x27;800&#x27; : &#x27;&#x27;;
}

function voiceSafeName(){
  return voiceSessionUser?.user_metadata?.display_name ||
    (voiceSessionUser?.email ? voiceSessionUser.email.split(&#x27;@&#x27;)[0] : &#x27;Member&#x27;);
}

function voiceMemberHtml(entry, myId, allowLocalMute=false){
  const userId = String(entry?.user_id || &#x27;&#x27;);
  const name = escapeChat(entry?.display_name || &#x27;Member&#x27;);
  const micMuted = !!entry?.muted;
  const mine = userId === myId;
  const locallyMuted = !mine &amp;&amp; voiceLocallyMutedUsers.has(userId);

  const localMuteButton = allowLocalMute &amp;&amp; !mine
    ? `&lt;button class=&quot;voice-person-mute ${locallyMuted ? &#x27;active&#x27; : &#x27;&#x27;}&quot;
               type=&quot;button&quot;
               data-local-voice-mute=&quot;${escapeChat(userId)}&quot;
               title=&quot;${locallyMuted ? &#x27;Hear this person again&#x27; : &#x27;Mute only this person for you&#x27;}&quot;&gt;${locallyMuted ? &#x27;Unmute&#x27; : &#x27;Mute&#x27;}&lt;/button&gt;`
    : &#x27;&#x27;;

  const kickButton = allowLocalMute &amp;&amp; !mine &amp;&amp; canModerateVoice()
    ? `&lt;button class=&quot;voice-kick-btn&quot;
               type=&quot;button&quot;
               data-voice-kick=&quot;${escapeChat(userId)}&quot;
               data-voice-kick-name=&quot;${name}&quot;
               title=&quot;Remove this member from the current voice room&quot;&gt;Kick&lt;/button&gt;`
    : &#x27;&#x27;;

  return `&lt;span class=&quot;voice-member ${micMuted ? &#x27;muted&#x27; : &#x27;&#x27;} ${mine ? &#x27;you&#x27; : &#x27;&#x27;} ${locallyMuted ? &#x27;local-muted&#x27; : &#x27;&#x27;}&quot;&gt;
    &lt;span class=&quot;voice-member-dot&quot;&gt;&lt;/span&gt;
    ${name}${mine ? &#x27; (You)&#x27; : &#x27;&#x27;}${micMuted ? &#x27; · mic muted&#x27; : &#x27;&#x27;}${locallyMuted ? &#x27; · muted by you&#x27; : &#x27;&#x27;}
    &lt;span class=&quot;voice-member-actions&quot;&gt;${localMuteButton}${kickButton}&lt;/span&gt;
  &lt;/span&gt;`;
}

function flattenVoicePresence(state){
  const rows = [];
  Object.values(state || {}).forEach(entries =&gt; {
    (entries || []).forEach(entry =&gt; {
      if(entry?.user_id) rows.push(entry);
    });
  });

  const byUser = new Map();
  rows.forEach(row =&gt; byUser.set(row.user_id,row));
  return [...byUser.values()];
}

function renderVoiceRoom(roomKey, state){
  const people = flattenVoicePresence(state);
  const countEl = roomKey === &#x27;general&#x27; ? voiceCountGeneral : voiceCountGaming;
  const membersEl = roomKey === &#x27;general&#x27; ? voiceMembersGeneral : voiceMembersGaming;

  if(countEl) countEl.textContent = String(people.length);
  if(membersEl){
    const activeRoom = roomKey === voiceRoomKey;
    membersEl.innerHTML = people.length
      ? people.map(p =&gt; voiceMemberHtml(p, voiceSessionUser?.id || null, activeRoom)).join(&#x27;&#x27;)
      : &#x27;&lt;div class=&quot;voice-empty&quot;&gt;Nobody is in here yet.&lt;/div&gt;&#x27;;
  }

  const card = document.querySelector(`[data-voice-room-card=&quot;${roomKey}&quot;]`);
  if(card) card.classList.toggle(&#x27;active&#x27;, voiceRoomKey === roomKey);
}

function renderAllVoiceRooms(){
  renderVoiceRoom(&#x27;general&#x27;, voiceRoomKey === &#x27;general&#x27; ? voicePresence : voicePreviewState.general);
  renderVoiceRoom(&#x27;gaming&#x27;, voiceRoomKey === &#x27;gaming&#x27; ? voicePresence : voicePreviewState.gaming);
}

async function voiceSendSignal(to, signal){
  if(!voiceRealtimeChannel || !voiceSessionUser || !to) return;

  await voiceRealtimeChannel.send({
    type:&#x27;broadcast&#x27;,
    event:&#x27;webrtc-signal&#x27;,
    payload:{
      from:voiceSessionUser.id,
      to,
      signal
    }
  });
}

function destroyVoicePeer(userId){
  const peer = voicePeers.get(userId);
  if(!peer) return;

  try{ peer.pc.ontrack = null; }catch(_){}
  try{ peer.pc.onicecandidate = null; }catch(_){}
  try{ peer.pc.close(); }catch(_){}

  if(peer.audio){
    try{ peer.audio.srcObject = null; }catch(_){}
    peer.audio.remove();
  }

  voicePeers.delete(userId);
}

function destroyAllVoicePeers(){
  [...voicePeers.keys()].forEach(destroyVoicePeer);
}

function ensureVoicePeer(userId){
  if(!userId || userId === voiceSessionUser?.id) return null;
  if(voicePeers.has(userId)) return voicePeers.get(userId);

  const pc = new RTCPeerConnection({iceServers:voiceIceServers});
  const audio = document.createElement(&#x27;audio&#x27;);
  audio.autoplay = true;
  audio.playsInline = true;
  // Muting this element silences only this remote person on YOUR device.
  audio.muted = voiceLocallyMutedUsers.has(userId);
  audio.dataset.voicePeer = userId;
  if(voiceAudioMount) voiceAudioMount.appendChild(audio);

  const peer = {pc,audio,pendingCandidates:[]};
  voicePeers.set(userId,peer);

  if(voiceLocalStream){
    voiceLocalStream.getAudioTracks().forEach(track =&gt; {
      pc.addTrack(track,voiceLocalStream);
    });
  }

  pc.ontrack = (event) =&gt; {
    const stream = event.streams?.[0] || new MediaStream([event.track]);
    audio.srcObject = stream;
    audio.muted = voiceLocallyMutedUsers.has(userId);
    audio.play().catch(() =&gt; {});
  };

  pc.onicecandidate = (event) =&gt; {
    if(event.candidate){
      voiceSendSignal(userId,{
        type:&#x27;ice&#x27;,
        candidate:event.candidate.toJSON ? event.candidate.toJSON() : event.candidate
      });
    }
  };

  pc.onconnectionstatechange = () =&gt; {
    const state = pc.connectionState;
    if(state === &#x27;failed&#x27; || state === &#x27;closed&#x27;){
      destroyVoicePeer(userId);
    }
  };

  return peer;
}

async function flushVoiceIce(peer){
  if(!peer?.pc?.remoteDescription) return;

  while(peer.pendingCandidates.length){
    const candidate = peer.pendingCandidates.shift();
    try{ await peer.pc.addIceCandidate(candidate); }catch(_){}
  }
}

async function createVoiceOffer(userId){
  const peer = ensureVoicePeer(userId);
  if(!peer) return;

  try{
    const offer = await peer.pc.createOffer();
    await peer.pc.setLocalDescription(offer);
    await voiceSendSignal(userId,{
      type:&#x27;offer&#x27;,
      sdp:peer.pc.localDescription
    });
  }catch(err){
    console.error(&#x27;Voice offer error:&#x27;,err);
  }
}

async function handleVoiceSignal(payload){
  const from = payload?.from;
  const to = payload?.to;
  const signal = payload?.signal;

  if(!voiceSessionUser || !from || to !== voiceSessionUser.id || !signal) return;
  if(from === voiceSessionUser.id) return;

  const peer = ensureVoicePeer(from);
  if(!peer) return;

  try{
    if(signal.type === &#x27;offer&#x27;){
      await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushVoiceIce(peer);

      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);

      await voiceSendSignal(from,{
        type:&#x27;answer&#x27;,
        sdp:peer.pc.localDescription
      });
      return;
    }

    if(signal.type === &#x27;answer&#x27;){
      await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushVoiceIce(peer);
      return;
    }

    if(signal.type === &#x27;ice&#x27; &amp;&amp; signal.candidate){
      if(peer.pc.remoteDescription){
        await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }else{
        peer.pendingCandidates.push(new RTCIceCandidate(signal.candidate));
      }
    }
  }catch(err){
    console.error(&#x27;Voice signal error:&#x27;,err);
  }
}

async function syncVoicePeers(){
  if(!voiceSessionUser) return;

  const people = flattenVoicePresence(voicePresence);
  const remoteIds = people
    .map(p =&gt; p.user_id)
    .filter(id =&gt; id &amp;&amp; id !== voiceSessionUser.id);

  // Remove connections for members who left.
  [...voicePeers.keys()].forEach(id =&gt; {
    if(!remoteIds.includes(id)) destroyVoicePeer(id);
  });

  // Deterministic initiator prevents both sides from constantly offering.
  for(const remoteId of remoteIds){
    if(!voicePeers.has(remoteId) &amp;&amp; voiceSessionUser.id.localeCompare(remoteId) &lt; 0){
      await createVoiceOffer(remoteId);
    }
  }
}

async function publishVoicePresence(){
  if(!voiceRealtimeChannel || !voiceSessionUser) return;

  await voiceRealtimeChannel.track({
    user_id:voiceSessionUser.id,
    display_name:voiceSafeName(),
    muted:voiceMuted,
    joined_at:new Date().toISOString()
  });
}


async function removeCachedVoiceTopic(roomKey){
  const client = window.gymcelsLolDb;
  const room = VOICE_ROOMS[roomKey];
  if(!client || !room) return;

  const preview = voiceRoomPreviewChannels.get(roomKey);
  if(preview){
    try{ await client.removeChannel(preview); }catch(_){}
    voiceRoomPreviewChannels.delete(roomKey);
  }

  // Supabase can reuse a RealtimeChannel for the same topic.
  // Remove any stale/cached copies before adding presence callbacks again.
  try{
    const expectedTopic = `realtime:${room.topic}`;
    const matches = (client.getChannels?.() || []).filter(ch =&gt;
      ch &amp;&amp;
      ch !== voiceRealtimeChannel &amp;&amp;
      (ch.topic === expectedTopic || ch.topic === room.topic)
    );

    for(const ch of matches){
      try{ await client.removeChannel(ch); }catch(_){}
    }
  }catch(err){
    console.warn(&#x27;Voice channel cleanup warning:&#x27;, err);
  }
}

async function leaveVoiceChannel(showStatus=true, restorePreviews=true){
  const client = window.gymcelsLolDb;

  destroyAllVoicePeers();

  if(voiceRealtimeChannel){
    try{ await voiceRealtimeChannel.untrack(); }catch(_){}
    try{ if(client) await client.removeChannel(voiceRealtimeChannel); }catch(_){}
  }

  if(voiceLocalStream){
    voiceLocalStream.getTracks().forEach(track =&gt; track.stop());
  }

  voiceRealtimeChannel = null;
  voiceLocalStream = null;
  voiceRoomKey = null;
  voicePresence = {};
  voiceMuted = false;

  if(voiceControls) voiceControls.classList.add(&#x27;hidden&#x27;);
  if(voiceMicState){
    voiceMicState.textContent = &#x27;Mic disconnected&#x27;;
    voiceMicState.classList.remove(&#x27;live&#x27;);
  }
  if(voiceMuteBtn) voiceMuteBtn.textContent = &#x27;Mute Mic&#x27;;

  renderAllVoiceRooms();

  if(restorePreviews){
    try{
      const session = await getChatSession();
      if(session?.user) await startVoiceRoomPreviews(session);
    }catch(_){}
  }

  if(showStatus) setVoiceStatus(&#x27;Left voice channel.&#x27;);
}

async function joinVoiceChannel(roomKey){
  const room = VOICE_ROOMS[roomKey];
  if(!room) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setVoiceStatus(&#x27;Log in first to join voice.&#x27;,&#x27;error&#x27;);
    document.getElementById(&#x27;login-card&#x27;)?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
    return;
  }

  if(!window.isSecureContext){
    setVoiceStatus(&#x27;Voice requires HTTPS.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(!navigator.mediaDevices?.getUserMedia){
    setVoiceStatus(&#x27;This browser does not support microphone access.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(voiceRoomKey === roomKey){
    return;
  }

  if(voiceRoomKey){
    await leaveVoiceChannel(false, false);
  }

  setVoiceStatus(`Joining ${room.label}...`);

  try{
    voiceSessionUser = session.user;

    voiceLocalStream = await navigator.mediaDevices.getUserMedia({
      audio:{
        echoCancellation:true,
        noiseSuppression:true,
        autoGainControl:true
      },
      video:false
    });

    voiceMuted = false;

    // Make sure Realtime authorization uses the signed-in JWT.
    try{ client.realtime.setAuth(session.access_token); }catch(_){}

    // The room list already has a presence preview subscription for this topic.
    // Tear it down first so Supabase does not hand us an already-subscribed channel.
    await removeCachedVoiceTopic(roomKey);

    voiceRoomKey = roomKey;

    const channel = client.channel(room.topic,{
      config:{
        private:true,
        broadcast:{self:false,ack:false},
        presence:{key:session.user.id}
      }
    });

    voiceRealtimeChannel = channel;

    channel
      .on(&#x27;broadcast&#x27;,{event:&#x27;webrtc-signal&#x27;},({payload}) =&gt; {
        handleVoiceSignal(payload);
      })
      .on(&#x27;presence&#x27;,{event:&#x27;sync&#x27;},async () =&gt; {
        if(channel !== voiceRealtimeChannel) return;
        voicePresence = channel.presenceState() || {};
        renderAllVoiceRooms();
        await syncVoicePeers();
      })
      .on(&#x27;presence&#x27;,{event:&#x27;leave&#x27;},({key}) =&gt; {
        if(key) destroyVoicePeer(key);
      });

    channel.subscribe(async (status,err) =&gt; {
      if(channel !== voiceRealtimeChannel) return;

      if(status === &#x27;SUBSCRIBED&#x27;){
        await publishVoicePresence();

        if(voiceControls) voiceControls.classList.remove(&#x27;hidden&#x27;);
        if(voiceCurrentRoom) voiceCurrentRoom.textContent = room.label;
        if(voiceConnectionText) voiceConnectionText.textContent = &#x27;Connected&#x27;;
        if(voiceMicState){
          voiceMicState.textContent = &#x27;Mic live&#x27;;
          voiceMicState.classList.add(&#x27;live&#x27;);
        }

        setVoiceStatus(`✓ JOINED ${room.label.toUpperCase()}`,&#x27;success&#x27;);
        renderAllVoiceRooms();
      }else if(status === &#x27;CHANNEL_ERROR&#x27; || status === &#x27;TIMED_OUT&#x27;){
        console.error(&#x27;Voice channel error:&#x27;,err);
        setVoiceStatus(&#x27;Could not connect to voice. Check the Supabase voice setup.&#x27;,&#x27;error&#x27;);
      }
    });

  }catch(err){
    console.error(&#x27;Voice join error:&#x27;,err);
    await leaveVoiceChannel(false, false);
    try{
      const latestSession = await getChatSession();
      if(latestSession?.user) await startVoiceRoomPreviews(latestSession);
    }catch(_){}

    const name = err?.name || &#x27;&#x27;;
    if(name === &#x27;NotAllowedError&#x27;){
      setVoiceStatus(&#x27;Microphone permission was blocked. Allow mic access and try again.&#x27;,&#x27;error&#x27;);
    }else{
      setVoiceStatus(err?.message || String(err),&#x27;error&#x27;);
    }
  }
}



async function kickVoiceMember(userId,displayName=&#x27;Member&#x27;){
  if(!userId || !voiceRoomKey) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  await refreshChatAdminStatus(session);
  if(!chatIsSiteAdmin){
    setVoiceStatus(&#x27;Only the site admin can kick members.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(userId === session.user.id) return;

  if(!confirm(`Kick ${displayName} from ${VOICE_ROOMS[voiceRoomKey]?.label || &#x27;this voice room&#x27;}?`)){
    return;
  }

  try{
    const {error} = await client.rpc(&#x27;kick_voice_member&#x27;,{
      target_user:userId,
      target_room:voiceRoomKey
    });

    if(error) throw error;

    setVoiceStatus(`✓ ${displayName} was removed from ${VOICE_ROOMS[voiceRoomKey]?.label || &#x27;voice&#x27;}.`,&#x27;success&#x27;);
  }catch(err){
    console.error(&#x27;Voice kick error:&#x27;,err);
    setVoiceStatus(err?.message || String(err),&#x27;error&#x27;);
  }
}

async function checkMyVoiceKick(){
  if(!voiceRoomKey) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  try{
    const {data,error} = await client.rpc(&#x27;take_my_voice_kick&#x27;);
    if(error) throw error;

    if(!data) return;

    const kickedRoom = String(data);
    if(kickedRoom === voiceRoomKey){
      const roomName = VOICE_ROOMS[voiceRoomKey]?.label || &#x27;voice&#x27;;
      await leaveVoiceChannel(false,true);
      setVoiceStatus(`You were removed from ${roomName} by a moderator.`,&#x27;error&#x27;);
    }
  }catch(err){
    console.error(&#x27;Voice kick check error:&#x27;,err);
  }
}

function startVoiceKickPolling(session){
  clearInterval(voiceKickPollTimer);
  voiceKickPollTimer = null;

  if(!session?.user) return;

  voiceKickPollTimer = setInterval(() =&gt; {
    if(document.visibilityState === &#x27;visible&#x27; &amp;&amp; voiceRoomKey){
      checkMyVoiceKick();
    }
  },1200);
}

function toggleLocalVoiceMute(userId){
  if(!userId || userId === voiceSessionUser?.id) return;

  if(voiceLocallyMutedUsers.has(userId)){
    voiceLocallyMutedUsers.delete(userId);
  }else{
    voiceLocallyMutedUsers.add(userId);
  }

  const peer = voicePeers.get(userId);
  if(peer?.audio){
    peer.audio.muted = voiceLocallyMutedUsers.has(userId);
  }

  renderAllVoiceRooms();

  setVoiceStatus(
    voiceLocallyMutedUsers.has(userId)
      ? &#x27;That member is muted only for you.&#x27;
      : &#x27;That member is unmuted for you.&#x27;,
    &#x27;normal&#x27;
  );
}

async function toggleVoiceMute(){
  if(!voiceLocalStream || !voiceRoomKey) return;

  voiceMuted = !voiceMuted;
  voiceLocalStream.getAudioTracks().forEach(track =&gt; {
    track.enabled = !voiceMuted;
  });

  if(voiceMuteBtn) voiceMuteBtn.textContent = voiceMuted ? &#x27;Unmute Mic&#x27; : &#x27;Mute Mic&#x27;;
  if(voiceMicState){
    voiceMicState.textContent = voiceMuted ? &#x27;Mic muted&#x27; : &#x27;Mic live&#x27;;
    voiceMicState.classList.toggle(&#x27;live&#x27;,!voiceMuted);
  }

  await publishVoicePresence();
  renderAllVoiceRooms();
}

function setVoiceAuthState(session){
  voiceSessionUser = session?.user || null;
  const signedIn = !!session?.user;

  if(voiceGuestNote){
    voiceGuestNote.textContent = signedIn
      ? &#x27;Choose General or Gaming. Your browser will ask for microphone permission.&#x27;
      : &#x27;Log in to join voice channels.&#x27;;
  }

  [joinVoiceGeneral,joinVoiceGaming].forEach(btn =&gt; {
    if(!btn) return;
    btn.disabled = !signedIn;
    if(!signedIn) btn.textContent = &#x27;Log in&#x27;;
  });

  if(signedIn){
    if(joinVoiceGeneral) joinVoiceGeneral.textContent = voiceRoomKey === &#x27;general&#x27; ? &#x27;Joined&#x27; : &#x27;Join&#x27;;
    if(joinVoiceGaming) joinVoiceGaming.textContent = voiceRoomKey === &#x27;gaming&#x27; ? &#x27;Joined&#x27; : &#x27;Join&#x27;;
  }

  if(!signedIn){
    voiceLocallyMutedUsers.clear();
    if(voiceRoomKey){
      leaveVoiceChannel(false, false);
    }
  }
}

async function startVoiceRoomPreviews(session){
  const client = window.gymcelsLolDb;

  // Clean up old preview subscriptions.
  for(const ch of voiceRoomPreviewChannels.values()){
    try{ await client.removeChannel(ch); }catch(_){}
  }
  voiceRoomPreviewChannels.clear();
  voicePreviewState = {general:{},gaming:{}};

  if(!client || !session?.user){
    renderAllVoiceRooms();
    return;
  }

  try{ client.realtime.setAuth(session.access_token); }catch(_){}

  for(const [roomKey,room] of Object.entries(VOICE_ROOMS)){
    // Don&#x27;t create a preview channel for the room we&#x27;re actively in.
    if(roomKey === voiceRoomKey) continue;

    const preview = client.channel(room.topic,{
      config:{
        private:true,
        presence:{key:`preview-${session.user.id}-${roomKey}`}
      }
    });

    preview
      .on(&#x27;presence&#x27;,{event:&#x27;sync&#x27;},() =&gt; {
        voicePreviewState[roomKey] = preview.presenceState() || {};
        renderVoiceRoom(roomKey,voicePreviewState[roomKey]);
      });

    preview.subscribe();
    voiceRoomPreviewChannels.set(roomKey,preview);
  }
}

async function startVoiceSystem(session){
  if(session?.user){
    await refreshChatAdminStatus(session);
  }
  setVoiceAuthState(session);
  startVoiceKickPolling(session);
  await startVoiceRoomPreviews(session);
  renderAllVoiceRooms();
}


function handleVoiceMemberMuteClick(e){
  const kickBtn = e.target.closest(&#x27;[data-voice-kick]&#x27;);
  if(kickBtn){
    e.preventDefault();
    e.stopPropagation();
    kickVoiceMember(
      kickBtn.dataset.voiceKick,
      kickBtn.dataset.voiceKickName || &#x27;Member&#x27;
    );
    return;
  }

  const btn = e.target.closest(&#x27;[data-local-voice-mute]&#x27;);
  if(!btn) return;

  e.preventDefault();
  e.stopPropagation();

  toggleLocalVoiceMute(btn.dataset.localVoiceMute);
}

if(voiceMembersGeneral){
  voiceMembersGeneral.addEventListener(&#x27;click&#x27;, handleVoiceMemberMuteClick);
}
if(voiceMembersGaming){
  voiceMembersGaming.addEventListener(&#x27;click&#x27;, handleVoiceMemberMuteClick);
}

if(joinVoiceGeneral){
  joinVoiceGeneral.addEventListener(&#x27;click&#x27;,() =&gt; joinVoiceChannel(&#x27;general&#x27;));
}
if(joinVoiceGaming){
  joinVoiceGaming.addEventListener(&#x27;click&#x27;,() =&gt; joinVoiceChannel(&#x27;gaming&#x27;));
}
if(voiceMuteBtn){
  voiceMuteBtn.addEventListener(&#x27;click&#x27;,toggleVoiceMute);
}
if(voiceLeaveBtn){
  voiceLeaveBtn.addEventListener(&#x27;click&#x27;,() =&gt; leaveVoiceChannel(true, true));
}
if(navVoiceOutside){
  navVoiceOutside.addEventListener(&#x27;click&#x27;,() =&gt; {
    setTimeout(() =&gt; voiceSection?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;}),20);
  });
}

window.addEventListener(&#x27;beforeunload&#x27;,() =&gt; {
  try{
    voiceLocalStream?.getTracks().forEach(track =&gt; track.stop());
  }catch(_){}
});


// ---- Private Direct Messages ----
const dmSection = document.getElementById(&#x27;dmSection&#x27;);
const dmFriendList = document.getElementById(&#x27;dmFriendList&#x27;);
const dmThreadName = document.getElementById(&#x27;dmThreadName&#x27;);
const dmThreadState = document.getElementById(&#x27;dmThreadState&#x27;);
const dmMessages = document.getElementById(&#x27;dmMessages&#x27;);
const dmScrollControls = document.getElementById(&#x27;dmScrollControls&#x27;);
const dmJumpTopBtn = document.getElementById(&#x27;dmJumpTopBtn&#x27;);
const dmJumpBottomBtn = document.getElementById(&#x27;dmJumpBottomBtn&#x27;);

const dmTypingIndicator = document.getElementById(&#x27;dmTypingIndicator&#x27;);
const dmReplyBar = document.getElementById(&#x27;dmReplyBar&#x27;);
const dmReplyName = document.getElementById(&#x27;dmReplyName&#x27;);
const dmReplyPreview = document.getElementById(&#x27;dmReplyPreview&#x27;);
const dmReplyCancel = document.getElementById(&#x27;dmReplyCancel&#x27;);

function ensureDmEditBar(){
  if(!dmReplyBar) return {bar:null,preview:null,cancel:null};

  let bar = document.getElementById(&#x27;dmEditBar&#x27;);

  if(!bar){
    bar = document.createElement(&#x27;div&#x27;);
    bar.id = &#x27;dmEditBar&#x27;;
    bar.className = &#x27;dm-edit-bar hidden&#x27;;
    bar.innerHTML = `
      &lt;div class=&quot;dm-edit-bar-copy&quot;&gt;
        &lt;span&gt;Editing message&lt;/span&gt;
        &lt;small id=&quot;dmEditPreview&quot;&gt;&lt;/small&gt;
      &lt;/div&gt;
      &lt;button id=&quot;dmEditCancel&quot; type=&quot;button&quot; aria-label=&quot;Cancel edit&quot;&gt;×&lt;/button&gt;
    `;
    dmReplyBar.insertAdjacentElement(&#x27;afterend&#x27;,bar);
  }

  return {
    bar,
    preview:bar.querySelector(&#x27;#dmEditPreview&#x27;),
    cancel:bar.querySelector(&#x27;#dmEditCancel&#x27;)
  };
}

const dmEditUi = ensureDmEditBar();
const dmEditBar = dmEditUi.bar;
const dmEditPreview = dmEditUi.preview;
const dmEditCancel = dmEditUi.cancel;

const dmInput = document.getElementById(&#x27;dmInput&#x27;);
const dmSendBtn = document.getElementById(&#x27;dmSendBtn&#x27;);
const dmStatus = document.getElementById(&#x27;dmStatus&#x27;);
const dmRefreshBtn = document.getElementById(&#x27;dmRefreshBtn&#x27;);

const dmPhotoBtn = document.getElementById(&#x27;dmPhotoBtn&#x27;);
const dmAttachBtn = document.getElementById(&#x27;dmAttachBtn&#x27;);
const dmPhotoInput = document.getElementById(&#x27;dmPhotoInput&#x27;);
const dmFileInput = document.getElementById(&#x27;dmFileInput&#x27;);
const dmAttachmentPreview = document.getElementById(&#x27;dmAttachmentPreview&#x27;);
const dmCallBtn = document.getElementById(&#x27;dmCallBtn&#x27;);
const navDmsOutside = document.getElementById(&#x27;navDms&#x27;);

const dmIncomingCallOverlay = document.getElementById(&#x27;dmIncomingCallOverlay&#x27;);
const dmIncomingCallAvatar = document.getElementById(&#x27;dmIncomingCallAvatar&#x27;);
const dmIncomingCallName = document.getElementById(&#x27;dmIncomingCallName&#x27;);
const dmAcceptCallBtn = document.getElementById(&#x27;dmAcceptCallBtn&#x27;);
const dmDeclineCallBtn = document.getElementById(&#x27;dmDeclineCallBtn&#x27;);

const dmActiveCallOverlay = document.getElementById(&#x27;dmActiveCallOverlay&#x27;);
const dmActiveCallCard = document.getElementById(&#x27;dmActiveCallCard&#x27;);
const dmCallDragHandle = document.getElementById(&#x27;dmCallDragHandle&#x27;);
const dmActiveCallState = document.getElementById(&#x27;dmActiveCallState&#x27;);
const dmActiveCallAvatar = document.getElementById(&#x27;dmActiveCallAvatar&#x27;);
const dmActiveCallName = document.getElementById(&#x27;dmActiveCallName&#x27;);
const dmActiveCallTimer = document.getElementById(&#x27;dmActiveCallTimer&#x27;);
const dmCallMuteBtn = document.getElementById(&#x27;dmCallMuteBtn&#x27;);
const dmEndCallBtn = document.getElementById(&#x27;dmEndCallBtn&#x27;);
const dmCallStatus = document.getElementById(&#x27;dmCallStatus&#x27;);
const dmPrivateCallAudio = document.getElementById(&#x27;dmPrivateCallAudio&#x27;);

let dmActiveUserId = null;
let dmActiveName = &#x27;&#x27;;
let dmActiveAvatar = &#x27;&#x27;;
let dmPollTimer = null;
let dmTypingPollTimer = null;
let dmTypingWriteTimer = null;
let dmTypingClearTimer = null;
let dmSending = false;
let dmReplyTarget = null;
let dmEditTarget = null;
let dmRowsById = new Map();

const DM_MAX_ATTACHMENTS = 4;
const DM_MAX_FILE_BYTES = 10 * 1024 * 1024;
let dmPendingFiles = [];
let dmPendingPreviewUrls = [];

// Keep already-loaded DM photos stable instead of generating a new signed
// URL and rebuilding the whole conversation every 3-second poll.
const dmSignedUrlCache = new Map();
let dmLastRenderSignature = &#x27;&#x27;;
let dmLastRenderConversation = &#x27;&#x27;;


// ---- Private one-to-one DM calls ----
// Call invitations use the database instead of a recipient Realtime &quot;inbox&quot;.
// This avoids the private-channel subscribe timeout that prevented calls from ringing.
let dmCallChannel = null;
let dmCallPeer = null;
let dmCallLocalStream = null;
let dmCallRemoteUserId = null;
let dmCallRemoteName = &#x27;&#x27;;
let dmCallRemoteAvatar = &#x27;&#x27;;
let dmCallTopic = &#x27;&#x27;;
let dmCallRole = null;
let dmCallMuted = false;
let dmCallOfferSent = false;
let dmCallPendingIce = [];
let dmIncomingInvite = null;
let dmCallInviteId = null;
let dmCallStartedAt = null;
let dmCallTimerInterval = null;
let dmIncomingCallPollTimer = null;
let dmOutgoingCallPollTimer = null;
let dmCallRingTimeout = null;

const DM_CALL_ICE_SERVERS = [
  {urls:&#x27;stun:stun.l.google.com:19302&#x27;},
  {urls:&#x27;stun:stun1.l.google.com:19302&#x27;}
];

function dmCallSetStatus(text=&#x27;&#x27;, type=&#x27;normal&#x27;){
  if(!dmCallStatus) return;
  dmCallStatus.textContent = text;
  dmCallStatus.style.color =
    type === &#x27;error&#x27; ? &#x27;#ff7c89&#x27; :
    type === &#x27;success&#x27; ? &#x27;#67e8a5&#x27; :
    &#x27;#7e8793&#x27;;
}

function dmCallInitials(name){
  const s = String(name || &#x27;GC&#x27;).trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if(parts.length &gt;= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0,2).toUpperCase();
}

function renderDmCallAvatar(el,name,url){
  if(!el) return;
  if(url){
    el.innerHTML = `&lt;img src=&quot;${escapeChat(url)}&quot; alt=&quot;${escapeChat(name || &#x27;Member&#x27;)} profile photo&quot;&gt;`;
  }else{
    el.textContent = dmCallInitials(name);
  }
}

function buildDmCallTopic(a,b){
  return `dmcall:${[String(a),String(b)].sort().join(&#x27;:&#x27;)}`;
}

function resetDmCallTimer(){
  clearInterval(dmCallTimerInterval);
  dmCallTimerInterval = null;
  dmCallStartedAt = null;
  if(dmActiveCallTimer) dmActiveCallTimer.textContent = &#x27;00:00&#x27;;
}

function startDmCallTimer(){
  if(dmCallStartedAt) return;
  dmCallStartedAt = Date.now();

  const tick = () =&gt; {
    if(!dmActiveCallTimer || !dmCallStartedAt) return;
    const seconds = Math.floor((Date.now() - dmCallStartedAt) / 1000);
    const mins = String(Math.floor(seconds / 60)).padStart(2,&#x27;0&#x27;);
    const secs = String(seconds % 60).padStart(2,&#x27;0&#x27;);
    dmActiveCallTimer.textContent = `${mins}:${secs}`;
  };

  tick();
  clearInterval(dmCallTimerInterval);
  dmCallTimerInterval = setInterval(tick,1000);
}

function stopDmCallPolling(){
  clearInterval(dmOutgoingCallPollTimer);
  dmOutgoingCallPollTimer = null;
  clearTimeout(dmCallRingTimeout);
  dmCallRingTimeout = null;
}

async function markDmCallEnded(inviteId){
  if(!inviteId) return;
  try{
    const client = window.gymcelsLolDb;
    if(!client) return;
    await client.rpc(&#x27;end_dm_call&#x27;,{target_invite_id:Number(inviteId)});
  }catch(err){
    console.warn(&#x27;Could not mark call ended:&#x27;,err);
  }
}

async function pollIncomingDmCalls(){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user) return;
  if(dmCallChannel) return;

  // If an invite is already visible, confirm it is still ringing.
  if(dmIncomingInvite?.id){
    const {data:current} = await client
      .from(&#x27;dm_call_invites&#x27;)
      .select(&#x27;id,status&#x27;)
      .eq(&#x27;id&#x27;,dmIncomingInvite.id)
      .maybeSingle();

    if(!current || current.status !== &#x27;ringing&#x27;){
      closeIncomingDmCall();
    }
    return;
  }

  const {data,error} = await client
    .from(&#x27;dm_call_invites&#x27;)
    .select(&#x27;id,caller_id,caller_name,caller_avatar,topic,status,created_at&#x27;)
    .eq(&#x27;callee_id&#x27;,session.user.id)
    .eq(&#x27;status&#x27;,&#x27;ringing&#x27;)
    .order(&#x27;created_at&#x27;,{ascending:false})
    .limit(1)
    .maybeSingle();

  if(error){
    console.error(&#x27;Incoming call poll error:&#x27;,error);
    return;
  }
  if(!data) return;

  const created = new Date(data.created_at).getTime();
  if(Number.isFinite(created) &amp;&amp; Date.now() - created &gt; 90000){
    await markDmCallEnded(data.id);
    return;
  }

  await showIncomingDmInvite({
    id:Number(data.id),
    callerId:data.caller_id,
    callerName:data.caller_name || &#x27;Member&#x27;,
    callerAvatar:data.caller_avatar || &#x27;&#x27;,
    topic:data.topic
  });
}

async function showIncomingDmInvite(invite){
  if(!invite?.callerId || dmCallChannel || dmIncomingInvite) return;

  try{
    const friendship = await getFriendshipState(invite.callerId);
    if(!friendship || friendship.status !== &#x27;accepted&#x27;){
      await markDmCallEnded(invite.id);
      return;
    }
  }catch(_){
    return;
  }

  dmIncomingInvite = invite;

  if(dmIncomingCallName) dmIncomingCallName.textContent = invite.callerName;
  renderDmCallAvatar(dmIncomingCallAvatar,invite.callerName,invite.callerAvatar);

  if(dmIncomingCallOverlay){
    dmIncomingCallOverlay.classList.add(&#x27;show&#x27;);
    dmIncomingCallOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
  }
}

async function pollOutgoingDmCall(){
  if(!dmCallInviteId || dmCallRole !== &#x27;caller&#x27;) return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  const {data,error} = await client
    .from(&#x27;dm_call_invites&#x27;)
    .select(&#x27;id,status&#x27;)
    .eq(&#x27;id&#x27;,dmCallInviteId)
    .maybeSingle();

  if(error){
    console.error(&#x27;Outgoing call poll error:&#x27;,error);
    return;
  }

  if(!data){
    dmCallSetStatus(&#x27;Call ended.&#x27;);
    await cleanupDmPrivateCall(false);
    return;
  }

  if(data.status === &#x27;accepted&#x27;){
    if(dmActiveCallState &amp;&amp; dmActiveCallState.textContent !== &#x27;Private call&#x27;){
      dmActiveCallState.textContent = &#x27;Connecting...&#x27;;
    }
    dmCallSetStatus(&#x27;Connecting...&#x27;);
  }else if(data.status === &#x27;declined&#x27;){
    dmCallSetStatus(&#x27;Call declined.&#x27;);
    if(dmActiveCallState) dmActiveCallState.textContent = &#x27;Call declined&#x27;;
    setTimeout(() =&gt; cleanupDmPrivateCall(false),800);
  }else if(data.status === &#x27;ended&#x27;){
    dmCallSetStatus(&#x27;Call ended.&#x27;);
    if(dmActiveCallState) dmActiveCallState.textContent = &#x27;Call ended&#x27;;
    setTimeout(() =&gt; cleanupDmPrivateCall(false),650);
  }
}

function closeIncomingDmCall(){
  dmIncomingInvite = null;
  if(dmIncomingCallOverlay){
    dmIncomingCallOverlay.classList.remove(&#x27;show&#x27;);
    dmIncomingCallOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  }
}

function createDmCallPeer(){
  if(dmCallPeer || !dmCallRemoteUserId) return dmCallPeer;

  const pc = new RTCPeerConnection({iceServers:DM_CALL_ICE_SERVERS});
  dmCallPeer = pc;

  if(dmCallLocalStream){
    dmCallLocalStream.getAudioTracks().forEach(track =&gt; {
      pc.addTrack(track,dmCallLocalStream);
    });
  }

  pc.ontrack = (event) =&gt; {
    const stream = event.streams?.[0] || new MediaStream([event.track]);
    if(dmPrivateCallAudio){
      dmPrivateCallAudio.srcObject = stream;
      dmPrivateCallAudio.muted = false;
      dmPrivateCallAudio.play().catch(() =&gt; {});
    }
  };

  pc.onicecandidate = (event) =&gt; {
    if(event.candidate){
      sendDmCallSignal({
        type:&#x27;ice&#x27;,
        candidate:event.candidate.toJSON ? event.candidate.toJSON() : event.candidate
      });
    }
  };

  pc.onconnectionstatechange = () =&gt; {
    const state = pc.connectionState;

    if(state === &#x27;connected&#x27;){
      if(dmActiveCallState) dmActiveCallState.textContent = &#x27;Private call&#x27;;
      dmCallSetStatus(&#x27;Connected&#x27;,&#x27;success&#x27;);
      startDmCallTimer();
      stopDmCallPolling();
    }else if(state === &#x27;failed&#x27;){
      dmCallSetStatus(&#x27;Audio connection failed. Try calling again.&#x27;,&#x27;error&#x27;);
    }
  };

  return pc;
}

async function sendDmCallSignal(signal){
  if(!dmCallChannel || !dmCallRemoteUserId) return;

  const session = await getChatSession();
  if(!session?.user) return;

  await dmCallChannel.send({
    type:&#x27;broadcast&#x27;,
    event:&#x27;dm-call-signal&#x27;,
    payload:{
      from:session.user.id,
      to:dmCallRemoteUserId,
      signal
    }
  });
}

async function flushDmCallIce(){
  if(!dmCallPeer?.remoteDescription) return;

  while(dmCallPendingIce.length){
    const candidate = dmCallPendingIce.shift();
    try{ await dmCallPeer.addIceCandidate(candidate); }catch(_){}
  }
}

async function handleDmCallSignal(payload){
  const session = await getChatSession();
  if(!session?.user || !payload?.signal) return;
  if(payload.to !== session.user.id) return;
  if(payload.from !== dmCallRemoteUserId) return;

  const pc = createDmCallPeer();
  const signal = payload.signal;

  try{
    if(signal.type === &#x27;offer&#x27;){
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushDmCallIce();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await sendDmCallSignal({
        type:&#x27;answer&#x27;,
        sdp:pc.localDescription
      });
      return;
    }

    if(signal.type === &#x27;answer&#x27;){
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushDmCallIce();
      return;
    }

    if(signal.type === &#x27;ice&#x27; &amp;&amp; signal.candidate){
      const candidate = new RTCIceCandidate(signal.candidate);
      if(pc.remoteDescription){
        await pc.addIceCandidate(candidate);
      }else{
        dmCallPendingIce.push(candidate);
      }
    }
  }catch(err){
    console.error(&#x27;Private call WebRTC signal error:&#x27;,err);
    dmCallSetStatus(&#x27;Call connection error.&#x27;,&#x27;error&#x27;);
  }
}

async function createDmCallOffer(){
  if(dmCallOfferSent || dmCallRole !== &#x27;caller&#x27;) return;

  const pc = createDmCallPeer();
  if(!pc) return;

  try{
    dmCallOfferSent = true;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await sendDmCallSignal({
      type:&#x27;offer&#x27;,
      sdp:pc.localDescription
    });
  }catch(err){
    dmCallOfferSent = false;
    console.error(&#x27;Private call offer error:&#x27;,err);
    dmCallSetStatus(&#x27;Could not start call audio.&#x27;,&#x27;error&#x27;);
  }
}

async function joinDmCallTopic(topic,remoteUserId,remoteName,remoteAvatar,role){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) throw new Error(&#x27;Log in first.&#x27;);

  try{ client.realtime.setAuth(session.access_token); }catch(_){}

  dmCallRemoteUserId = remoteUserId;
  dmCallRemoteName = remoteName || &#x27;Member&#x27;;
  dmCallRemoteAvatar = remoteAvatar || &#x27;&#x27;;
  dmCallTopic = topic;
  dmCallRole = role;
  dmCallOfferSent = false;
  dmCallPendingIce = [];

  // Remove a stale copy of this private pair topic before registering callbacks.
  try{
    const expected = `realtime:${topic}`;
    const stale = (client.getChannels?.() || []).filter(ch =&gt;
      ch &amp;&amp; ch !== dmCallChannel &amp;&amp; (ch.topic === expected || ch.topic === topic)
    );
    for(const ch of stale){
      try{ await client.removeChannel(ch); }catch(_){}
    }
  }catch(_){}

  const channel = client.channel(topic,{
    config:{
      private:true,
      broadcast:{self:false},
      presence:{key:session.user.id}
    }
  });

  dmCallChannel = channel;

  channel
    .on(&#x27;broadcast&#x27;,{event:&#x27;dm-call-signal&#x27;},({payload}) =&gt; {
      handleDmCallSignal(payload);
    })
    .on(&#x27;broadcast&#x27;,{event:&#x27;dm-call-control&#x27;},({payload}) =&gt; {
      if(payload?.from === dmCallRemoteUserId &amp;&amp; payload?.action === &#x27;hangup&#x27;){
        dmCallSetStatus(&#x27;Call ended.&#x27;);
        if(dmActiveCallState) dmActiveCallState.textContent = &#x27;Call ended&#x27;;
        cleanupDmPrivateCall(false);
      }
    })
    .on(&#x27;presence&#x27;,{event:&#x27;sync&#x27;},async () =&gt; {
      if(channel !== dmCallChannel) return;

      const rows = flattenVoicePresence(channel.presenceState() || {});
      const remotePresent = rows.some(row =&gt; row.user_id === dmCallRemoteUserId);

      if(remotePresent &amp;&amp; dmCallRole === &#x27;caller&#x27;){
        await createDmCallOffer();
      }
    });

  await new Promise((resolve,reject) =&gt; {
    let done = false;
    const timer = setTimeout(() =&gt; {
      if(done) return;
      done = true;
      reject(new Error(&#x27;Private call room timed out.&#x27;));
    },8000);

    channel.subscribe(async (status,err) =&gt; {
      if(done) return;

      if(status === &#x27;SUBSCRIBED&#x27;){
        try{
          await channel.track({
            user_id:session.user.id,
            display_name:chatDisplayName(session.user),
            joined_at:new Date().toISOString()
          });
          done = true;
          clearTimeout(timer);
          resolve();
        }catch(trackErr){
          done = true;
          clearTimeout(timer);
          reject(trackErr);
        }
      }else if(status === &#x27;CHANNEL_ERROR&#x27; || status === &#x27;TIMED_OUT&#x27;){
        done = true;
        clearTimeout(timer);
        reject(err || new Error(&#x27;Private call room failed.&#x27;));
      }
    });
  });
}

async function prepareDmCallMicrophone(){
  if(!window.isSecureContext) throw new Error(&#x27;Private calls require HTTPS.&#x27;);
  if(!navigator.mediaDevices?.getUserMedia) throw new Error(&#x27;This browser does not support microphone calls.&#x27;);

  dmCallLocalStream = await navigator.mediaDevices.getUserMedia({
    audio:{
      echoCancellation:true,
      noiseSuppression:true,
      autoGainControl:true
    },
    video:false
  });

  dmCallMuted = false;
  if(dmCallMuteBtn) dmCallMuteBtn.textContent = &#x27;Mute Mic&#x27;;
}


let dmCallDragState = null;
let dmCallHasCustomPosition = false;

function clampDmCallPosition(left,top){
  if(!dmActiveCallCard) return {left,top};

  const rect = dmActiveCallCard.getBoundingClientRect();
  const width = rect.width || 330;
  const height = rect.height || 260;
  const margin = 8;

  return {
    left: Math.min(
      Math.max(margin,left),
      Math.max(margin,window.innerWidth - width - margin)
    ),
    top: Math.min(
      Math.max(margin,top),
      Math.max(margin,window.innerHeight - height - margin)
    )
  };
}

function setDmCallCardPosition(left,top){
  if(!dmActiveCallCard) return;

  const pos = clampDmCallPosition(left,top);
  dmActiveCallCard.style.left = `${pos.left}px`;
  dmActiveCallCard.style.top = `${pos.top}px`;
  dmActiveCallCard.style.right = &#x27;auto&#x27;;
  dmActiveCallCard.style.bottom = &#x27;auto&#x27;;
  dmCallHasCustomPosition = true;
}

function resetDmCallCardPosition(){
  if(!dmActiveCallCard) return;

  dmActiveCallCard.style.left = &#x27;&#x27;;
  dmActiveCallCard.style.top = &#x27;&#x27;;
  dmActiveCallCard.style.right = &#x27;&#x27;;
  dmActiveCallCard.style.bottom = &#x27;&#x27;;
  dmCallHasCustomPosition = false;
}

if(dmCallDragHandle &amp;&amp; dmActiveCallCard){
  dmCallDragHandle.addEventListener(&#x27;pointerdown&#x27;,(e) =&gt; {
    if(e.button !== undefined &amp;&amp; e.button !== 0) return;
    if(e.target.closest(&#x27;button&#x27;)) return;

    const rect = dmActiveCallCard.getBoundingClientRect();

    dmCallDragState = {
      pointerId:e.pointerId,
      offsetX:e.clientX - rect.left,
      offsetY:e.clientY - rect.top
    };

    dmActiveCallCard.classList.add(&#x27;dragging&#x27;);

    try{
      dmCallDragHandle.setPointerCapture(e.pointerId);
    }catch(_){}

    e.preventDefault();
  });

  dmCallDragHandle.addEventListener(&#x27;pointermove&#x27;,(e) =&gt; {
    if(!dmCallDragState || e.pointerId !== dmCallDragState.pointerId) return;

    setDmCallCardPosition(
      e.clientX - dmCallDragState.offsetX,
      e.clientY - dmCallDragState.offsetY
    );

    e.preventDefault();
  });

  const finishDrag = (e) =&gt; {
    if(!dmCallDragState) return;
    if(e.pointerId !== undefined &amp;&amp; e.pointerId !== dmCallDragState.pointerId) return;

    try{
      dmCallDragHandle.releasePointerCapture(dmCallDragState.pointerId);
    }catch(_){}

    dmCallDragState = null;
    dmActiveCallCard.classList.remove(&#x27;dragging&#x27;);
  };

  dmCallDragHandle.addEventListener(&#x27;pointerup&#x27;,finishDrag);
  dmCallDragHandle.addEventListener(&#x27;pointercancel&#x27;,finishDrag);
}

window.addEventListener(&#x27;resize&#x27;,() =&gt; {
  if(!dmActiveCallCard || !dmCallHasCustomPosition) return;

  const rect = dmActiveCallCard.getBoundingClientRect();
  setDmCallCardPosition(rect.left,rect.top);
});

function showActiveDmCall(name,avatar,state=&#x27;Calling...&#x27;){
  if(!dmCallHasCustomPosition) resetDmCallCardPosition();
  if(dmActiveCallName) dmActiveCallName.textContent = name || &#x27;Member&#x27;;
  renderDmCallAvatar(dmActiveCallAvatar,name,avatar);
  if(dmActiveCallState) dmActiveCallState.textContent = state;
  if(dmActiveCallTimer) dmActiveCallTimer.textContent = &#x27;00:00&#x27;;
  if(dmActiveCallOverlay){
    dmActiveCallOverlay.classList.add(&#x27;show&#x27;);
    dmActiveCallOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
  }
}

async function startPrivateDmCall(){
  if(!dmActiveUserId || dmCallChannel || dmIncomingInvite) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user){
    setDmStatus(&#x27;Log in first.&#x27;,&#x27;error&#x27;);
    return;
  }

  const friendship = await getFriendshipState(dmActiveUserId);
  if(!friendship || friendship.status !== &#x27;accepted&#x27;){
    setDmStatus(&#x27;You need to be friends before calling.&#x27;,&#x27;error&#x27;);
    return;
  }

  if(voiceRoomKey){
    await leaveVoiceChannel(false,true);
  }

  showActiveDmCall(dmActiveName,dmActiveAvatar,&#x27;Calling...&#x27;);
  dmCallSetStatus(&#x27;Requesting microphone...&#x27;);

  try{
    await prepareDmCallMicrophone();

    const topic = buildDmCallTopic(session.user.id,dmActiveUserId);

    const {data:inviteId,error:startError} = await client.rpc(&#x27;start_dm_call&#x27;,{
      target_user:dmActiveUserId,
      target_topic:topic
    });
    if(startError) throw startError;

    dmCallInviteId = Number(inviteId);

    await joinDmCallTopic(
      topic,
      dmActiveUserId,
      dmActiveName,
      dmActiveAvatar,
      &#x27;caller&#x27;
    );

    dmCallSetStatus(&#x27;Ringing...&#x27;);

    clearInterval(dmOutgoingCallPollTimer);
    dmOutgoingCallPollTimer = setInterval(pollOutgoingDmCall,1800);

    clearTimeout(dmCallRingTimeout);
    dmCallRingTimeout = setTimeout(async () =&gt; {
      if(dmCallRole === &#x27;caller&#x27; &amp;&amp; !dmCallStartedAt &amp;&amp; dmCallInviteId){
        await markDmCallEnded(dmCallInviteId);
        dmCallSetStatus(&#x27;No answer.&#x27;);
        if(dmActiveCallState) dmActiveCallState.textContent = &#x27;No answer&#x27;;
        setTimeout(() =&gt; cleanupDmPrivateCall(false),700);
      }
    },45000);

  }catch(err){
    console.error(&#x27;Start private call error:&#x27;,err);
    const message = err?.name === &#x27;NotAllowedError&#x27;
      ? &#x27;Microphone permission was blocked.&#x27;
      : (err?.message || String(err));
    dmCallSetStatus(message,&#x27;error&#x27;);
    setTimeout(() =&gt; cleanupDmPrivateCall(false),1200);
  }
}

async function acceptPrivateDmCall(){
  if(!dmIncomingInvite || dmCallChannel) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  const invite = {...dmIncomingInvite};
  closeIncomingDmCall();

  if(voiceRoomKey){
    await leaveVoiceChannel(false,true);
  }

  showActiveDmCall(invite.callerName,invite.callerAvatar,&#x27;Connecting...&#x27;);
  dmCallSetStatus(&#x27;Requesting microphone...&#x27;);

  try{
    await prepareDmCallMicrophone();

    dmCallInviteId = Number(invite.id);

    await joinDmCallTopic(
      invite.topic || buildDmCallTopic(session.user.id,invite.callerId),
      invite.callerId,
      invite.callerName,
      invite.callerAvatar,
      &#x27;callee&#x27;
    );

    const {error} = await client.rpc(&#x27;respond_to_dm_call&#x27;,{
      target_invite_id:dmCallInviteId,
      call_response:&#x27;accepted&#x27;
    });
    if(error) throw error;

    dmCallSetStatus(&#x27;Connecting...&#x27;);
  }catch(err){
    console.error(&#x27;Accept private call error:&#x27;,err);

    try{
      await client.rpc(&#x27;respond_to_dm_call&#x27;,{
        target_invite_id:Number(invite.id),
        call_response:&#x27;declined&#x27;
      });
    }catch(_){}

    const message = err?.name === &#x27;NotAllowedError&#x27;
      ? &#x27;Microphone permission was blocked.&#x27;
      : (err?.message || String(err));

    dmCallSetStatus(message,&#x27;error&#x27;);
    setTimeout(() =&gt; cleanupDmPrivateCall(false),1200);
  }
}

async function declinePrivateDmCall(){
  if(!dmIncomingInvite) return;

  const client = window.gymcelsLolDb;
  const invite = {...dmIncomingInvite};
  closeIncomingDmCall();

  try{
    const {error} = await client.rpc(&#x27;respond_to_dm_call&#x27;,{
      target_invite_id:Number(invite.id),
      call_response:&#x27;declined&#x27;
    });
    if(error) throw error;
  }catch(err){
    console.error(&#x27;Decline call error:&#x27;,err);
  }
}

async function togglePrivateDmCallMute(){
  if(!dmCallLocalStream) return;

  dmCallMuted = !dmCallMuted;
  dmCallLocalStream.getAudioTracks().forEach(track =&gt; {
    track.enabled = !dmCallMuted;
  });

  if(dmCallMuteBtn) dmCallMuteBtn.textContent = dmCallMuted ? &#x27;Unmute Mic&#x27; : &#x27;Mute Mic&#x27;;
  dmCallSetStatus(dmCallMuted ? &#x27;Your microphone is muted.&#x27; : &#x27;Your microphone is live.&#x27;);
}

async function cleanupDmPrivateCall(sendHangup=true){
  const client = window.gymcelsLolDb;
  const inviteId = dmCallInviteId;

  stopDmCallPolling();

  if(sendHangup &amp;&amp; dmCallChannel &amp;&amp; dmCallRemoteUserId){
    try{
      const session = await getChatSession();
      await dmCallChannel.send({
        type:&#x27;broadcast&#x27;,
        event:&#x27;dm-call-control&#x27;,
        payload:{
          from:session?.user?.id,
          to:dmCallRemoteUserId,
          action:&#x27;hangup&#x27;
        }
      });
    }catch(_){}
  }

  if(sendHangup &amp;&amp; inviteId){
    await markDmCallEnded(inviteId);
  }

  if(dmCallChannel){
    try{ await dmCallChannel.untrack(); }catch(_){}
    try{ if(client) await client.removeChannel(dmCallChannel); }catch(_){}
  }

  if(dmCallPeer){
    try{ dmCallPeer.ontrack = null; }catch(_){}
    try{ dmCallPeer.onicecandidate = null; }catch(_){}
    try{ dmCallPeer.close(); }catch(_){}
  }

  if(dmCallLocalStream){
    dmCallLocalStream.getTracks().forEach(track =&gt; track.stop());
  }

  if(dmPrivateCallAudio){
    try{ dmPrivateCallAudio.srcObject = null; }catch(_){}
  }

  dmCallChannel = null;
  dmCallPeer = null;
  dmCallLocalStream = null;
  dmCallRemoteUserId = null;
  dmCallRemoteName = &#x27;&#x27;;
  dmCallRemoteAvatar = &#x27;&#x27;;
  dmCallTopic = &#x27;&#x27;;
  dmCallRole = null;
  dmCallMuted = false;
  dmCallOfferSent = false;
  dmCallPendingIce = [];
  dmCallInviteId = null;

  resetDmCallTimer();

  if(dmActiveCallOverlay){
    dmActiveCallOverlay.classList.remove(&#x27;show&#x27;);
    dmActiveCallOverlay.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  }

  resetDmCallCardPosition();

  if(dmCallMuteBtn) dmCallMuteBtn.textContent = &#x27;Mute Mic&#x27;;
  dmCallSetStatus(&#x27;&#x27;);
}

async function startPrivateCallSystem(session){
  clearInterval(dmIncomingCallPollTimer);
  dmIncomingCallPollTimer = null;

  if(!session?.user){
    closeIncomingDmCall();
    await cleanupDmPrivateCall(false);
    return;
  }

  await pollIncomingDmCalls();
  dmIncomingCallPollTimer = setInterval(() =&gt; {
    if(document.visibilityState === &#x27;visible&#x27;){
      pollIncomingDmCalls();
    }
  },2200);
}

if(dmCallBtn){
  dmCallBtn.addEventListener(&#x27;click&#x27;,startPrivateDmCall);
}
if(dmAcceptCallBtn){
  dmAcceptCallBtn.addEventListener(&#x27;click&#x27;,acceptPrivateDmCall);
}
if(dmDeclineCallBtn){
  dmDeclineCallBtn.addEventListener(&#x27;click&#x27;,declinePrivateDmCall);
}
if(dmCallMuteBtn){
  dmCallMuteBtn.addEventListener(&#x27;click&#x27;,togglePrivateDmCallMute);
}
if(dmEndCallBtn){
  dmEndCallBtn.addEventListener(&#x27;click&#x27;,() =&gt; cleanupDmPrivateCall(true));
}

window.addEventListener(&#x27;beforeunload&#x27;,() =&gt; {
  try{ dmCallLocalStream?.getTracks().forEach(track =&gt; track.stop()); }catch(_){}
});


function dmFormatFileSize(bytes){
  const n = Number(bytes || 0);
  if(n &lt; 1024) return `${n} B`;
  if(n &lt; 1024 * 1024) return `${(n / 1024).toFixed(n &lt; 10 * 1024 ? 1 : 0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function dmFileExtension(name=&#x27;&#x27;){
  const value = String(name || &#x27;&#x27;).toLowerCase();
  const dot = value.lastIndexOf(&#x27;.&#x27;);
  return dot &gt;= 0 ? value.slice(dot + 1) : &#x27;&#x27;;
}

function dmMimeForFile(file){
  const existing = String(file?.type || &#x27;&#x27;).toLowerCase();
  if(existing) return existing;

  const ext = dmFileExtension(file?.name || &#x27;&#x27;);
  const map = {
    jpg:&#x27;image/jpeg&#x27;,
    jpeg:&#x27;image/jpeg&#x27;,
    png:&#x27;image/png&#x27;,
    webp:&#x27;image/webp&#x27;,
    gif:&#x27;image/gif&#x27;,
    heic:&#x27;image/heic&#x27;,
    heif:&#x27;image/heif&#x27;,
    pdf:&#x27;application/pdf&#x27;,
    txt:&#x27;text/plain&#x27;,
    doc:&#x27;application/msword&#x27;,
    docx:&#x27;application/vnd.openxmlformats-officedocument.wordprocessingml.document&#x27;,
    xls:&#x27;application/vnd.ms-excel&#x27;,
    xlsx:&#x27;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&#x27;,
    ppt:&#x27;application/vnd.ms-powerpoint&#x27;,
    pptx:&#x27;application/vnd.openxmlformats-officedocument.presentationml.presentation&#x27;,
    zip:&#x27;application/zip&#x27;
  };

  return map[ext] || &#x27;&#x27;;
}

function dmAttachmentAllowed(file){
  const mime = dmMimeForFile(file);

  return [
    &#x27;image/jpeg&#x27;,
    &#x27;image/png&#x27;,
    &#x27;image/webp&#x27;,
    &#x27;image/gif&#x27;,
    &#x27;image/heic&#x27;,
    &#x27;image/heif&#x27;,
    &#x27;application/pdf&#x27;,
    &#x27;text/plain&#x27;,
    &#x27;application/msword&#x27;,
    &#x27;application/vnd.openxmlformats-officedocument.wordprocessingml.document&#x27;,
    &#x27;application/vnd.ms-excel&#x27;,
    &#x27;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet&#x27;,
    &#x27;application/vnd.ms-powerpoint&#x27;,
    &#x27;application/vnd.openxmlformats-officedocument.presentationml.presentation&#x27;,
    &#x27;application/zip&#x27;,
    &#x27;application/x-zip-compressed&#x27;
  ].includes(mime);
}

function dmSafeStorageFileName(name=&#x27;file&#x27;){
  const cleaned = String(name || &#x27;file&#x27;)
    .replace(/[^a-zA-Z0-9._-]+/g,&#x27;_&#x27;)
    .replace(/^_+|_+$/g,&#x27;&#x27;)
    .slice(-120);

  return cleaned || &#x27;file&#x27;;
}

function dmAttachmentIcon(mime=&#x27;&#x27;,name=&#x27;&#x27;){
  if(String(mime).startsWith(&#x27;image/&#x27;)) return &#x27;🖼️&#x27;;

  const ext = dmFileExtension(name);
  if(ext === &#x27;pdf&#x27;) return &#x27;📕&#x27;;
  if([&#x27;doc&#x27;,&#x27;docx&#x27;].includes(ext)) return &#x27;📘&#x27;;
  if([&#x27;xls&#x27;,&#x27;xlsx&#x27;].includes(ext)) return &#x27;📗&#x27;;
  if([&#x27;ppt&#x27;,&#x27;pptx&#x27;].includes(ext)) return &#x27;📙&#x27;;
  if(ext === &#x27;zip&#x27;) return &#x27;🗜️&#x27;;
  return &#x27;📄&#x27;;
}

function dmClearPendingPreviewUrls(){
  dmPendingPreviewUrls.forEach(url =&gt; {
    try{ URL.revokeObjectURL(url); }catch(_){}
  });
  dmPendingPreviewUrls = [];
}

function dmClearPendingFiles(){
  dmPendingFiles = [];
  dmClearPendingPreviewUrls();

  if(dmPhotoInput) dmPhotoInput.value = &#x27;&#x27;;
  if(dmFileInput) dmFileInput.value = &#x27;&#x27;;

  renderDmPendingFiles();
}

function renderDmPendingFiles(){
  if(!dmAttachmentPreview) return;

  dmClearPendingPreviewUrls();

  if(!dmPendingFiles.length){
    dmAttachmentPreview.innerHTML = &#x27;&#x27;;
    dmAttachmentPreview.classList.add(&#x27;hidden&#x27;);
    return;
  }

  dmAttachmentPreview.classList.remove(&#x27;hidden&#x27;);

  dmAttachmentPreview.innerHTML = `
    &lt;div class=&quot;dm-attachment-preview-head&quot;&gt;
      &lt;strong&gt;${dmPendingFiles.length} attachment${dmPendingFiles.length === 1 ? &#x27;&#x27; : &#x27;s&#x27;} ready&lt;/strong&gt;
      &lt;span&gt;Max 4 · 10 MB each&lt;/span&gt;
    &lt;/div&gt;

    &lt;div class=&quot;dm-attachment-preview-list&quot;&gt;
      ${dmPendingFiles.map((file,index) =&gt; {
        const mime = dmMimeForFile(file);
        const isImage = mime.startsWith(&#x27;image/&#x27;);
        let preview = `&lt;span class=&quot;dm-pending-file-icon&quot;&gt;${dmAttachmentIcon(mime,file.name)}&lt;/span&gt;`;

        if(isImage){
          const objectUrl = URL.createObjectURL(file);
          dmPendingPreviewUrls.push(objectUrl);
          preview = `&lt;img class=&quot;dm-pending-thumb&quot; src=&quot;${escapeChat(objectUrl)}&quot; alt=&quot;&quot;&gt;`;
        }

        return `&lt;div class=&quot;dm-pending-file&quot;&gt;
          ${preview}
          &lt;div class=&quot;dm-pending-file-copy&quot;&gt;
            &lt;strong&gt;${escapeChat(file.name || &#x27;Attachment&#x27;)}&lt;/strong&gt;
            &lt;span&gt;${escapeChat(dmFormatFileSize(file.size))}&lt;/span&gt;
          &lt;/div&gt;
          &lt;button type=&quot;button&quot; data-dm-remove-pending=&quot;${index}&quot; aria-label=&quot;Remove attachment&quot;&gt;×&lt;/button&gt;
        &lt;/div&gt;`;
      }).join(&#x27;&#x27;)}
    &lt;/div&gt;`;
}

function addDmPendingFiles(fileList){
  const incoming = Array.from(fileList || []);
  if(!incoming.length) return;

  for(const file of incoming){
    if(dmPendingFiles.length &gt;= DM_MAX_ATTACHMENTS){
      setDmStatus(&#x27;You can attach up to 4 files per message.&#x27;,&#x27;error&#x27;);
      break;
    }

    if(!file || !file.size){
      continue;
    }

    if(file.size &gt; DM_MAX_FILE_BYTES){
      setDmStatus(`${file.name || &#x27;That file&#x27;} is over 10 MB.`,&#x27;error&#x27;);
      continue;
    }

    if(!dmAttachmentAllowed(file)){
      setDmStatus(`${file.name || &#x27;That file&#x27;} type is not supported.`,&#x27;error&#x27;);
      continue;
    }

    dmPendingFiles.push(file);
  }

  renderDmPendingFiles();
}

function dmRenderStoredAttachment(attachment){
  const url = attachment?.signed_url || &#x27;&#x27;;
  const name = attachment?.file_name || &#x27;Attachment&#x27;;
  const mime = attachment?.mime_type || &#x27;&#x27;;
  const size = dmFormatFileSize(attachment?.file_size || 0);

  if(!url){
    return `&lt;div class=&quot;dm-file-attachment unavailable&quot;&gt;
      &lt;span&gt;${dmAttachmentIcon(mime,name)}&lt;/span&gt;
      &lt;div&gt;&lt;strong&gt;${escapeChat(name)}&lt;/strong&gt;&lt;small&gt;Attachment unavailable&lt;/small&gt;&lt;/div&gt;
    &lt;/div&gt;`;
  }

  if(String(mime).startsWith(&#x27;image/&#x27;)){
    return `&lt;a class=&quot;dm-image-attachment&quot; href=&quot;${escapeChat(url)}&quot;
              target=&quot;_blank&quot; rel=&quot;noopener&quot; title=&quot;Open full photo&quot;&gt;
      &lt;img src=&quot;${escapeChat(url)}&quot; alt=&quot;${escapeChat(name)}&quot; loading=&quot;lazy&quot;&gt;
    &lt;/a&gt;`;
  }

  return `&lt;a class=&quot;dm-file-attachment&quot; href=&quot;${escapeChat(url)}&quot;
            target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;
    &lt;span&gt;${dmAttachmentIcon(mime,name)}&lt;/span&gt;
    &lt;div&gt;
      &lt;strong&gt;${escapeChat(name)}&lt;/strong&gt;
      &lt;small&gt;${escapeChat(size)} · Tap to open&lt;/small&gt;
    &lt;/div&gt;
    &lt;b&gt;↗&lt;/b&gt;
  &lt;/a&gt;`;
}

async function dmLoadAttachmentMap(client,rows){
  const map = {};
  const ids = (rows || []).map(row =&gt; Number(row.id)).filter(Boolean);
  if(!ids.length) return map;

  try{
    const {data,error} = await client
      .from(&#x27;direct_message_attachments&#x27;)
      .select(&#x27;id,message_id,storage_path,file_name,mime_type,file_size,created_at&#x27;)
      .in(&#x27;message_id&#x27;,ids)
      .order(&#x27;created_at&#x27;,{ascending:true});

    if(error) throw error;

    const attachments = data || [];
    if(!attachments.length) return map;

    const now = Date.now();
    const signedByPath = {};
    const missingPaths = [];

    for(const attachment of attachments){
      const path = attachment.storage_path;
      if(!path) continue;

      const cached = dmSignedUrlCache.get(path);

      // Reuse the same signed URL for almost a full day. This prevents photos
      // from visually reloading every time DMs poll for new messages.
      if(cached?.url &amp;&amp; cached.expiresAt &gt; now + 5 * 60 * 1000){
        signedByPath[path] = cached.url;
      }else{
        missingPaths.push(path);
      }
    }

    const uniqueMissingPaths = [...new Set(missingPaths)];

    if(uniqueMissingPaths.length){
      const {data:signed,error:signedError} = await client
        .storage
        .from(&#x27;dm-media&#x27;)
        .createSignedUrls(uniqueMissingPaths,24 * 60 * 60);

      if(signedError) throw signedError;

      for(const item of signed || []){
        if(item?.path &amp;&amp; item?.signedUrl){
          signedByPath[item.path] = item.signedUrl;
          dmSignedUrlCache.set(item.path,{
            url:item.signedUrl,
            expiresAt:now + (23 * 60 * 60 * 1000)
          });
        }
      }
    }

    for(const attachment of attachments){
      const key = Number(attachment.message_id);
      if(!map[key]) map[key] = [];

      map[key].push({
        ...attachment,
        signed_url:signedByPath[attachment.storage_path] || &#x27;&#x27;
      });
    }
  }catch(err){
    // Keep normal text DMs working even if attachment storage has a problem.
    console.warn(&#x27;DM attachments could not load:&#x27;,err);
  }

  return map;
}

function dmRandomToken(){
  try{
    if(crypto?.randomUUID) return crypto.randomUUID();
  }catch(_){}

  return `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
}


function setDmStatus(text=&#x27;&#x27;, type=&#x27;normal&#x27;){
  if(!dmStatus) return;
  dmStatus.textContent = text;
  dmStatus.style.color = type === &#x27;error&#x27; ? &#x27;#ff5a6b&#x27; : type === &#x27;success&#x27; ? &#x27;#67e8a5&#x27; : &#x27;#8c95a1&#x27;;
  dmStatus.style.fontWeight = type === &#x27;error&#x27; || type === &#x27;success&#x27; ? &#x27;800&#x27; : &#x27;&#x27;;
}

function dmFormatInboxTime(value){
  if(!value) return &#x27;&#x27;;

  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return &#x27;&#x27;;

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &amp;&amp;
    date.getMonth() === now.getMonth() &amp;&amp;
    date.getDate() === now.getDate();

  if(sameDay){
    return date.toLocaleTimeString([], {hour:&#x27;numeric&#x27;,minute:&#x27;2-digit&#x27;});
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &amp;&amp;
    date.getMonth() === yesterday.getMonth() &amp;&amp;
    date.getDate() === yesterday.getDate();

  if(isYesterday) return &#x27;Yesterday&#x27;;

  return date.toLocaleDateString([], {month:&#x27;short&#x27;,day:&#x27;numeric&#x27;});
}

function dmFormatMessageTimestamp(value){
  if(!value) return &#x27;&#x27;;

  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return &#x27;&#x27;;

  const now = new Date();
  const time = date.toLocaleTimeString([], {hour:&#x27;numeric&#x27;,minute:&#x27;2-digit&#x27;});

  const sameDay =
    date.getFullYear() === now.getFullYear() &amp;&amp;
    date.getMonth() === now.getMonth() &amp;&amp;
    date.getDate() === now.getDate();

  if(sameDay) return `Today, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &amp;&amp;
    date.getMonth() === yesterday.getMonth() &amp;&amp;
    date.getDate() === yesterday.getDate();

  if(isYesterday) return `Yesterday, ${time}`;

  const dateText = date.toLocaleDateString([], {
    month:&#x27;short&#x27;,
    day:&#x27;numeric&#x27;,
    ...(date.getFullYear() !== now.getFullYear() ? {year:&#x27;numeric&#x27;} : {})
  });

  return `${dateText}, ${time}`;
}

function dmInboxPreviewText(text){
  const raw = String(text || &#x27;&#x27;).trim();

  if(!raw) return &#x27;No messages yet&#x27;;
  if(raw === &#x27;📎 Attachment&#x27;) return &#x27;📎 Attachment&#x27;;

  const clean = raw.replace(/\s+/g,&#x27; &#x27;);
  return clean.length &gt; 38 ? clean.slice(0,38) + &#x27;…&#x27; : clean;
}

async function loadDmFriends(){
  if(!dmSection || !dmFriendList) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    dmSection.style.display = &#x27;none&#x27;;
    return;
  }

  dmSection.style.display = &#x27;&#x27;;

  const me = session.user.id;
  const { data: rows, error } = await client
    .from(&#x27;friendships&#x27;)
    .select(&#x27;id,requester_id,addressee_id,status&#x27;)
    .eq(&#x27;status&#x27;,&#x27;accepted&#x27;)
    .or(`requester_id.eq.${me},addressee_id.eq.${me}`);

  if(error){
    dmFriendList.innerHTML = `&lt;div class=&quot;dm-empty&quot;&gt;${escapeChat(error.message)}&lt;/div&gt;`;
    return;
  }

  const friendships = rows || [];
  const ids = [...new Set(friendships.map(row =&gt;
    row.requester_id === me ? row.addressee_id : row.requester_id
  ).filter(Boolean))];

  if(!ids.length){
    dmFriendList.innerHTML = &#x27;&lt;div class=&quot;dm-empty&quot;&gt;No accepted friends yet.&lt;/div&gt;&#x27;;
    return;
  }

  const presence = await getPresenceMapForUsers(ids);
  const people = ids.map(id =&gt; presence[id] || {
    user_id:id, display_name:&#x27;Member&#x27;, avatar_url:null, last_seen:null
  });

  const inboxMap = new Map();

  try{
    const {data:inboxRows,error:inboxError} = await client.rpc(&#x27;get_my_dm_inbox&#x27;);
    if(inboxError) throw inboxError;

    (inboxRows || []).forEach(row =&gt; {
      if(!row?.peer_user_id) return;
      inboxMap.set(String(row.peer_user_id),row);
    });
  }catch(err){
    // The friend list still works if the inbox RPC has not been installed yet.
    console.warn(&#x27;DM inbox summary could not load:&#x27;,err);
  }

  const pinnedIds = getPinnedFriendIds(me);

  people.sort((a,b) =&gt; {
    const aId = String(a.user_id || &#x27;&#x27;);
    const bId = String(b.user_id || &#x27;&#x27;);

    const aPinned = pinnedIds.has(aId) ? 1 : 0;
    const bPinned = pinnedIds.has(bId) ? 1 : 0;
    if(aPinned !== bPinned) return bPinned - aPinned;

    const aInbox = inboxMap.get(aId);
    const bInbox = inboxMap.get(bId);
    const aRecent = aInbox?.last_message_at ? new Date(aInbox.last_message_at).getTime() : 0;
    const bRecent = bInbox?.last_message_at ? new Date(bInbox.last_message_at).getTime() : 0;

    if(aRecent !== bRecent) return bRecent - aRecent;

    const aOnline = isPresenceOnline(a.last_seen) ? 1 : 0;
    const bOnline = isPresenceOnline(b.last_seen) ? 1 : 0;
    if(aOnline !== bOnline) return bOnline - aOnline;

    return String(a.display_name || &#x27;&#x27;).localeCompare(String(b.display_name || &#x27;&#x27;));
  });

  dmFriendList.innerHTML = people.map(person =&gt; {
    const online = isPresenceOnline(person.last_seen);
    const rawId = String(person.user_id || &#x27;&#x27;);
    const id = escapeChat(rawId);
    const name = escapeChat(person.display_name || &#x27;Member&#x27;);
    const avatar = escapeChat(person.avatar_url || &#x27;&#x27;);
    const active = person.user_id === dmActiveUserId ? &#x27;active&#x27; : &#x27;&#x27;;
    const pinned = pinnedIds.has(rawId);

    const inbox = inboxMap.get(rawId);
    const previewPrefix = inbox?.last_sender_id === me ? &#x27;You: &#x27; : &#x27;&#x27;;
    const preview = inbox
      ? `${previewPrefix}${dmInboxPreviewText(inbox.last_message)}`
      : &#x27;No messages yet&#x27;;
    const recentTime = inbox?.last_message_at ? dmFormatInboxTime(inbox.last_message_at) : &#x27;&#x27;;
    const unreadCount = Math.max(0,Number(inbox?.unread_count || 0));

    return `&lt;div class=&quot;dm-friend-row ${pinned ? &#x27;pinned&#x27; : &#x27;&#x27;}&quot;&gt;
      &lt;button class=&quot;dm-friend ${active}&quot; type=&quot;button&quot;
        data-dm-user=&quot;${id}&quot; data-dm-name=&quot;${name}&quot; data-dm-avatar=&quot;${avatar}&quot;&gt;
        ${friendAvatarMarkup(person, online)}
        &lt;div class=&quot;dm-friend-info&quot;&gt;
          &lt;div class=&quot;dm-friend-name&quot;&gt;${name}${person?.is_vip ? &#x27;&lt;span class=&quot;friend-vip-badge&quot;&gt;VIP 🔱&lt;/span&gt;&#x27; : &#x27;&#x27;}&lt;/div&gt;
          &lt;div class=&quot;dm-friend-state ${online ? &#x27;online&#x27; : &#x27;&#x27;}&quot;&gt;${online ? &#x27;Online&#x27; : &#x27;Offline&#x27;}&lt;/div&gt;
          &lt;div class=&quot;dm-friend-preview&quot;&gt;${escapeChat(preview)}&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class=&quot;dm-friend-inbox-meta&quot;&gt;
          ${recentTime ? `&lt;span class=&quot;dm-friend-recent-time&quot;&gt;${escapeChat(recentTime)}&lt;/span&gt;` : &#x27;&#x27;}
          ${unreadCount ? `&lt;span class=&quot;dm-unread-badge&quot; aria-label=&quot;${unreadCount} unread message${unreadCount === 1 ? &#x27;&#x27; : &#x27;s&#x27;}&quot;&gt;${unreadCount &gt; 99 ? &#x27;99+&#x27; : unreadCount}&lt;/span&gt;` : &#x27;&#x27;}
        &lt;/div&gt;
      &lt;/button&gt;

      &lt;button class=&quot;dm-pin-btn ${pinned ? &#x27;pinned&#x27; : &#x27;&#x27;}&quot; type=&quot;button&quot;
        data-dm-pin-user=&quot;${id}&quot;
        aria-label=&quot;${pinned ? &#x27;Unpin&#x27; : &#x27;Pin&#x27;} ${name}&quot;
        title=&quot;${pinned ? &#x27;Unpin DM&#x27; : &#x27;Pin DM&#x27;}&quot;&gt;${pinned ? &#x27;📌&#x27; : &#x27;📍&#x27;}&lt;/button&gt;
    &lt;/div&gt;`;
  }).join(&#x27;&#x27;);
}

if(dmFriendList){
  dmFriendList.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    const pinBtn = e.target.closest(&#x27;[data-dm-pin-user]&#x27;);
    if(!pinBtn) return;

    e.preventDefault();
    e.stopPropagation();

    try{
      const session = await getChatSession();
      if(!session?.user) return;

      togglePinnedFriend(session.user.id,pinBtn.dataset.dmPinUser);
      await loadDmFriends();
      await loadFriendsSection();
    }catch(err){
      setDmStatus(&#x27;Could not update pin: &#x27; + (err?.message || String(err)),&#x27;error&#x27;);
    }
  });
}



function dmReplyPreviewText(row){
  if(!row) return &#x27;Original message&#x27;;

  const text = String(row.message || &#x27;&#x27;).trim();
  if(text === &#x27;📎 Attachment&#x27;) return &#x27;Attachment&#x27;;

  const clean = text.replace(/\s+/g,&#x27; &#x27;).trim();
  return clean.length &gt; 110 ? clean.slice(0,110) + &#x27;…&#x27; : (clean || &#x27;Attachment&#x27;);
}

function clearDmReply(){
  dmReplyTarget = null;

  if(dmReplyBar) dmReplyBar.classList.add(&#x27;hidden&#x27;);
  if(dmReplyName) dmReplyName.textContent = &#x27;Member&#x27;;
  if(dmReplyPreview) dmReplyPreview.textContent = &#x27;&#x27;;
}

function syncDmComposerMode(){
  const active = !!dmActiveUserId;
  const editing = !!dmEditTarget;

  if(dmInput){
    dmInput.disabled = !active;
    dmInput.placeholder = editing
      ? &#x27;Edit your message...&#x27;
      : (active ? `Message ${dmActiveName || &#x27;friend&#x27;}...` : &#x27;Message a friend...&#x27;);
  }

  if(dmSendBtn){
    dmSendBtn.textContent = editing ? &#x27;Save&#x27; : &#x27;Send&#x27;;
    dmSendBtn.disabled = !active || dmSending;
  }

  if(dmPhotoBtn) dmPhotoBtn.disabled = !active || dmSending || editing;
  if(dmAttachBtn) dmAttachBtn.disabled = !active || dmSending || editing;
}

function clearDmEdit(options={}){
  const {keepInput=false} = options;
  const wasEditing = !!dmEditTarget;

  dmEditTarget = null;
  dmEditBar?.classList.add(&#x27;hidden&#x27;);
  if(dmEditPreview) dmEditPreview.textContent = &#x27;&#x27;;

  if(wasEditing &amp;&amp; dmInput &amp;&amp; !keepInput){
    dmInput.value = &#x27;&#x27;;
  }

  syncDmComposerMode();
}

async function beginDmEdit(row){
  if(!row?.id || !dmActiveUserId) return;

  const session = await getChatSession();
  if(!session?.user || String(row.sender_id || &#x27;&#x27;) !== String(session.user.id)) return;

  clearDmReply();
  dmClearPendingFiles();
  await clearOwnDmTyping();

  dmEditTarget = row;

  if(dmEditPreview){
    dmEditPreview.textContent = dmReplyPreviewText(row);
  }

  dmEditBar?.classList.remove(&#x27;hidden&#x27;);

  const hasAttachments = Number(row._attachment_count || 0) &gt; 0;
  const currentText = String(row.message || &#x27;&#x27;);

  if(dmInput){
    dmInput.value = (hasAttachments &amp;&amp; currentText === &#x27;📎 Attachment&#x27;) ? &#x27;&#x27; : currentText;
  }

  syncDmComposerMode();

  requestAnimationFrame(() =&gt; {
    dmInput?.focus();
    try{
      const len = dmInput?.value?.length || 0;
      dmInput?.setSelectionRange(len,len);
    }catch(_){}
  });
}

async function saveDmEdit(){
  if(!dmEditTarget?.id || dmSending) return;

  const text = dmInput?.value.trim() || &#x27;&#x27;;
  const hasAttachments = Number(dmEditTarget._attachment_count || 0) &gt; 0;

  if(!text &amp;&amp; !hasAttachments){
    setDmStatus(&#x27;A text message cannot be empty.&#x27;,&#x27;error&#x27;);
    return;
  }

  dmSending = true;
  syncDmComposerMode();
  setDmStatus(&#x27;Saving edit...&#x27;);

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) throw new Error(&#x27;Log in first.&#x27;);

    const {error} = await client.rpc(&#x27;edit_direct_message&#x27;,{
      target_message_id:Number(dmEditTarget.id),
      new_message:text
    });

    if(error) throw error;

    if(dmInput) dmInput.value = &#x27;&#x27;;
    clearDmEdit({keepInput:true});
    setDmStatus(&#x27;✓ Edited&#x27;,&#x27;success&#x27;);

    dmLastRenderSignature = &#x27;&#x27;;
    await loadDmConversation(false);
    await loadDmFriends();

    setTimeout(() =&gt; {
      if(dmStatus?.textContent === &#x27;✓ Edited&#x27;) setDmStatus(&#x27;&#x27;);
    },1400);
  }catch(err){
    console.error(&#x27;DM edit error:&#x27;,err);
    setDmStatus(&#x27;Edit failed: &#x27; + (err?.message || String(err)),&#x27;error&#x27;);
  }finally{
    dmSending = false;
    syncDmComposerMode();
  }
}

async function deleteDmMessage(row){
  if(!row?.id || !dmActiveUserId || dmSending) return;

  const session = await getChatSession();
  if(!session?.user || String(row.sender_id || &#x27;&#x27;) !== String(session.user.id)) return;

  const ok = window.confirm(&#x27;Delete this message? This cannot be undone.&#x27;);
  if(!ok) return;

  dmSending = true;
  syncDmComposerMode();
  setDmStatus(&#x27;Deleting message...&#x27;);

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error(&#x27;Database is unavailable.&#x27;);

    const {data:attachmentRows,error:attachmentLookupError} = await client
      .from(&#x27;direct_message_attachments&#x27;)
      .select(&#x27;storage_path&#x27;)
      .eq(&#x27;message_id&#x27;,Number(row.id));

    if(attachmentLookupError){
      console.warn(&#x27;Could not load DM attachment paths before delete:&#x27;,attachmentLookupError);
    }

    const {error:deleteError} = await client
      .from(&#x27;direct_messages&#x27;)
      .delete()
      .eq(&#x27;id&#x27;,Number(row.id))
      .eq(&#x27;sender_id&#x27;,session.user.id);

    if(deleteError) throw deleteError;

    const paths = (attachmentRows || [])
      .map(item =&gt; item.storage_path)
      .filter(Boolean);

    if(paths.length){
      const {error:storageError} = await client.storage
        .from(&#x27;dm-media&#x27;)
        .remove(paths);

      if(storageError){
        // The DM is already deleted; an orphaned private storage object is harmless
        // and can be cleaned later without breaking the conversation.
        console.warn(&#x27;Deleted DM but could not remove every stored attachment:&#x27;,storageError);
      }
    }

    if(dmReplyTarget?.id === row.id) clearDmReply();
    if(dmEditTarget?.id === row.id) clearDmEdit();

    dmRowsById.delete(Number(row.id));
    dmLastRenderSignature = &#x27;&#x27;;

    setDmStatus(&#x27;✓ Message deleted&#x27;,&#x27;success&#x27;);
    await loadDmConversation(false);
    await loadDmFriends();

    setTimeout(() =&gt; {
      if(dmStatus?.textContent === &#x27;✓ Message deleted&#x27;) setDmStatus(&#x27;&#x27;);
    },1400);
  }catch(err){
    console.error(&#x27;DM delete error:&#x27;,err);
    setDmStatus(&#x27;Delete failed: &#x27; + (err?.message || String(err)),&#x27;error&#x27;);
  }finally{
    dmSending = false;
    syncDmComposerMode();
  }
}

function beginDmReply(row){
  if(!row?.id || !dmActiveUserId) return;

  if(dmEditTarget) clearDmEdit();
  dmReplyTarget = row;

  const sessionUserId = window.gymcelsLolLastSessionUserId || &#x27;&#x27;;
  const mine = String(row.sender_id || &#x27;&#x27;) === String(sessionUserId);

  if(dmReplyName){
    dmReplyName.textContent = mine ? &#x27;You&#x27; : (dmActiveName || &#x27;Member&#x27;);
  }

  if(dmReplyPreview){
    dmReplyPreview.textContent = dmReplyPreviewText(row);
  }

  dmReplyBar?.classList.remove(&#x27;hidden&#x27;);
  dmInput?.focus();
}

function jumpToDmMessage(messageId){
  const el = dmMessages?.querySelector(`[data-dm-message-id=&quot;${Number(messageId)}&quot;]`);
  if(!el) return false;

  try{
    el.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
  }catch(_){
    el.scrollIntoView();
  }

  el.classList.remove(&#x27;reply-highlight&#x27;);
  void el.offsetWidth;
  el.classList.add(&#x27;reply-highlight&#x27;);

  return true;
}

function hideDmTypingIndicator(){
  if(dmTypingIndicator){
    dmTypingIndicator.classList.add(&#x27;hidden&#x27;);
    dmTypingIndicator.removeAttribute(&#x27;data-peer&#x27;);
  }
}

async function clearOwnDmTyping(peerId=dmActiveUserId){
  clearTimeout(dmTypingWriteTimer);
  clearTimeout(dmTypingClearTimer);

  if(!peerId) return;

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) return;

    await client
      .from(&#x27;dm_typing_status&#x27;)
      .delete()
      .eq(&#x27;user_id&#x27;,session.user.id)
      .eq(&#x27;peer_id&#x27;,peerId);
  }catch(_){}
}

async function writeOwnDmTyping(){
  if(!dmActiveUserId || !dmInput || !dmInput.value.trim()) return;

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) return;

    window.gymcelsLolLastSessionUserId = session.user.id;

    const {error} = await client
      .from(&#x27;dm_typing_status&#x27;)
      .upsert({
        user_id:session.user.id,
        peer_id:dmActiveUserId,
        updated_at:new Date().toISOString()
      },{
        onConflict:&#x27;user_id,peer_id&#x27;
      });

    if(error) throw error;
  }catch(err){
    // Typing indicators should never break DMs.
    console.warn(&#x27;DM typing update failed:&#x27;,err);
  }
}

function scheduleOwnDmTyping(){
  if(dmEditTarget){
    clearOwnDmTyping();
    return;
  }

  if(!dmActiveUserId || !dmInput || !dmInput.value.trim()){
    clearOwnDmTyping();
    return;
  }

  clearTimeout(dmTypingWriteTimer);
  dmTypingWriteTimer = setTimeout(writeOwnDmTyping,180);

  clearTimeout(dmTypingClearTimer);
  dmTypingClearTimer = setTimeout(() =&gt; {
    clearOwnDmTyping();
  },2800);
}

async function pollDmTyping(){
  if(!dmActiveUserId || document.visibilityState !== &#x27;visible&#x27;){
    hideDmTypingIndicator();
    return;
  }

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user){
      hideDmTypingIndicator();
      return;
    }

    window.gymcelsLolLastSessionUserId = session.user.id;

    const cutoff = new Date(Date.now() - 3500).toISOString();

    const {data,error} = await client
      .from(&#x27;dm_typing_status&#x27;)
      .select(&#x27;updated_at&#x27;)
      .eq(&#x27;user_id&#x27;,dmActiveUserId)
      .eq(&#x27;peer_id&#x27;,session.user.id)
      .gte(&#x27;updated_at&#x27;,cutoff)
      .maybeSingle();

    if(error) throw error;

    if(data?.updated_at){
      if(dmTypingIndicator){
        const nameEl = dmTypingIndicator.querySelector(&#x27;.dm-typing-name&#x27;);
        if(nameEl) nameEl.textContent = `${dmActiveName || &#x27;Member&#x27;} is typing`;
        dmTypingIndicator.classList.remove(&#x27;hidden&#x27;);
        dmTypingIndicator.dataset.peer = dmActiveUserId;
      }
    }else{
      hideDmTypingIndicator();
    }
  }catch(err){
    hideDmTypingIndicator();
    console.warn(&#x27;DM typing poll failed:&#x27;,err);
  }
}

function startDmTypingPolling(){
  clearInterval(dmTypingPollTimer);
  pollDmTyping();

  dmTypingPollTimer = setInterval(() =&gt; {
    if(dmActiveUserId) pollDmTyping();
  },1200);
}

function dmScrollPosition(){
  if(!dmMessages){
    return {atTop:true,atBottom:true,scrollable:false};
  }

  const maxScroll=Math.max(0,dmMessages.scrollHeight-dmMessages.clientHeight);
  const top=Math.max(0,dmMessages.scrollTop);

  return {
    atTop:top&lt;=4,
    atBottom:maxScroll-top&lt;=8,
    scrollable:maxScroll&gt;8
  };
}

function updateDmScrollControls(){
  if(!dmScrollControls || !dmMessages) return;

  const state=dmScrollPosition();
  dmScrollControls.style.display=state.scrollable ? &#x27;&#x27; : &#x27;none&#x27;;

  if(dmJumpTopBtn) dmJumpTopBtn.disabled=!state.scrollable || state.atTop;
  if(dmJumpBottomBtn) dmJumpBottomBtn.disabled=!state.scrollable || state.atBottom;
}

function jumpDmToTop(){
  if(!dmMessages) return;

  try{
    dmMessages.scrollTo({top:0,behavior:&#x27;smooth&#x27;});
  }catch(_){
    dmMessages.scrollTop=0;
  }

  setTimeout(updateDmScrollControls,260);
}

function jumpDmToBottom(){
  if(!dmMessages) return;

  const bottom=dmMessages.scrollHeight;

  try{
    dmMessages.scrollTo({top:bottom,behavior:&#x27;smooth&#x27;});
  }catch(_){
    dmMessages.scrollTop=bottom;
  }

  setTimeout(updateDmScrollControls,260);
}

dmJumpTopBtn?.addEventListener(&#x27;click&#x27;,jumpDmToTop);
dmJumpBottomBtn?.addEventListener(&#x27;click&#x27;,jumpDmToBottom);

dmMessages?.addEventListener(&#x27;scroll&#x27;,updateDmScrollControls,{passive:true});
window.addEventListener(&#x27;resize&#x27;,updateDmScrollControls);

async function loadDmConversation(scrollBottom=false){
  if(!dmActiveUserId || !dmMessages) return;

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) return;

    const me = session.user.id;

    // Always fetch the NEWEST messages first. The old query sorted oldest-first
    // and then limited to 200, which meant long conversations got stuck showing
    // only the first 200 messages while new DMs still triggered notifications.
    const { data, error } = await client
      .from(&#x27;direct_messages&#x27;)
      .select(&#x27;id,sender_id,recipient_id,message,created_at,reply_to_id,edited_at,read_at&#x27;)
      .or(`and(sender_id.eq.${me},recipient_id.eq.${dmActiveUserId}),and(sender_id.eq.${dmActiveUserId},recipient_id.eq.${me})`)
      .order(&#x27;created_at&#x27;,{ascending:false})
      .order(&#x27;id&#x27;,{ascending:false})
      .limit(200);

    if(error) throw error;

    // Render oldest -&gt; newest inside the fetched recent window.
    const rows = (data || []).slice().reverse();

    let markedRead = false;

    if(document.visibilityState === &#x27;visible&#x27;){
      const unreadIncoming = rows.some(row =&gt;
        String(row.sender_id || &#x27;&#x27;) === String(dmActiveUserId) &amp;&amp;
        String(row.recipient_id || &#x27;&#x27;) === String(me) &amp;&amp;
        !row.read_at
      );

      if(unreadIncoming){
        try{
          const {data:markedCount,error:readError} = await client.rpc(&#x27;mark_dm_conversation_read&#x27;,{
            peer_user:dmActiveUserId
          });

          if(readError) throw readError;

          if(Number(markedCount || 0) &gt; 0){
            const readNow = new Date().toISOString();
            rows.forEach(row =&gt; {
              if(
                String(row.sender_id || &#x27;&#x27;) === String(dmActiveUserId) &amp;&amp;
                String(row.recipient_id || &#x27;&#x27;) === String(me) &amp;&amp;
                !row.read_at
              ){
                row.read_at = readNow;
              }
            });
            markedRead = true;
          }
        }catch(err){
          // Read receipts should never prevent the conversation from loading.
          console.warn(&#x27;Could not mark DM conversation read:&#x27;,err);
        }
      }
    }

    dmRowsById = new Map(rows.map(row =&gt; [Number(row.id),row]));

    const replyIds = [...new Set(
      rows.map(row =&gt; Number(row.reply_to_id)).filter(Boolean)
    )];

    const replyMap = new Map();

    replyIds.forEach(id =&gt; {
      const local = dmRowsById.get(id);
      if(local) replyMap.set(id,local);
    });

    const missingReplyIds = replyIds.filter(id =&gt; !replyMap.has(id));

    if(missingReplyIds.length){
      const {data:parentRows,error:parentError} = await client
        .from(&#x27;direct_messages&#x27;)
        .select(&#x27;id,sender_id,recipient_id,message,created_at&#x27;)
        .in(&#x27;id&#x27;,missingReplyIds);

      if(!parentError){
        (parentRows || []).forEach(row =&gt; replyMap.set(Number(row.id),row));
      }
    }

    const attachmentMap = await dmLoadAttachmentMap(client,rows);

    rows.forEach(row =&gt; {
      row._attachment_count = (attachmentMap[Number(row.id)] || []).length;
    });

    const conversationKey = `${me}:${dmActiveUserId}`;
    const renderSignature = JSON.stringify({
      rows:rows.map(row =&gt; [
        row.id,
        row.sender_id,
        row.recipient_id,
        row.message,
        row.created_at,
        row.reply_to_id,
        row.edited_at,
        row.read_at
      ]),
      attachments:Object.entries(attachmentMap).map(([messageId,items]) =&gt; [
        messageId,
        (items || []).map(item =&gt; [
          item.id,
          item.storage_path,
          item.file_name,
          item.file_size,
          item.created_at
        ])
      ])
    });

    if(!rows.length){
      if(dmEditTarget) clearDmEdit();

      if(dmLastRenderConversation !== conversationKey || dmLastRenderSignature !== &#x27;empty&#x27;){
        dmMessages.innerHTML = &#x27;&lt;div class=&quot;dm-empty&quot;&gt;No messages yet. Say something.&lt;/div&gt;&#x27;;
        dmMessages.scrollTop = 0;
        dmLastRenderConversation = conversationKey;
        dmLastRenderSignature = &#x27;empty&#x27;;
      }

      updateDmScrollControls();
      return;
    }

    const oldScrollTop = dmMessages.scrollTop;
    const oldScrollHeight = dmMessages.scrollHeight;
    const nearBottom = oldScrollHeight - oldScrollTop - dmMessages.clientHeight &lt; 80;

    // The 3-second poll used to replace all DM HTML every time even when
    // nothing changed. That reloaded photos and could jump the scroll.
    if(
      dmLastRenderConversation === conversationKey &amp;&amp;
      dmLastRenderSignature === renderSignature
    ){
      if(scrollBottom){
        dmMessages.scrollTop = dmMessages.scrollHeight;
      }

      requestAnimationFrame(updateDmScrollControls);
      return;
    }

    dmMessages.innerHTML = rows.map(row =&gt; {
      const mine = row.sender_id === me;
      const when = dmFormatMessageTimestamp(row.created_at);

      const attachments = attachmentMap[Number(row.id)] || [];
      const attachmentHtml = attachments.length
        ? `&lt;div class=&quot;dm-message-attachments&quot;&gt;${attachments.map(dmRenderStoredAttachment).join(&#x27;&#x27;)}&lt;/div&gt;`
        : &#x27;&#x27;;

      const parent = row.reply_to_id ? replyMap.get(Number(row.reply_to_id)) : null;
      const parentMine = parent &amp;&amp; String(parent.sender_id || &#x27;&#x27;) === String(me);

      const quotedReply = row.reply_to_id
        ? `&lt;button class=&quot;dm-quoted-reply&quot; type=&quot;button&quot; data-dm-jump-message=&quot;${Number(row.reply_to_id)}&quot;&gt;
             &lt;strong&gt;${parent ? `Replying to ${parentMine ? &#x27;You&#x27; : escapeChat(dmActiveName || &#x27;Member&#x27;)}` : &#x27;Original message unavailable&#x27;}&lt;/strong&gt;
             &lt;span&gt;${parent ? escapeChat(dmReplyPreviewText(parent)) : &#x27;Message unavailable&#x27;}&lt;/span&gt;
           &lt;/button&gt;`
        : &#x27;&#x27;;

      const text = String(row.message || &#x27;&#x27;);
      const showText = text &amp;&amp; !(text === &#x27;📎 Attachment&#x27; &amp;&amp; attachments.length);

      const readLabel = mine
        ? `&lt;span class=&quot;dm-read-state ${row.read_at ? &#x27;seen&#x27; : &#x27;&#x27;}&quot;${row.read_at ? ` title=&quot;Read ${escapeChat(dmFormatMessageTimestamp(row.read_at))}&quot;` : &#x27;&#x27;}&gt;${row.read_at ? &#x27;Seen&#x27; : &#x27;Sent&#x27;}&lt;/span&gt;`
        : &#x27;&#x27;;

      return `&lt;div class=&quot;dm-row ${mine ? &#x27;mine&#x27; : &#x27;&#x27;}&quot; data-dm-message-id=&quot;${Number(row.id)}&quot;&gt;
        ${quotedReply}
        ${showText ? `&lt;div class=&quot;dm-bubble&quot;&gt;${escapeChat(text)}&lt;/div&gt;` : &#x27;&#x27;}
        ${attachmentHtml}
        &lt;div class=&quot;dm-row-footer&quot;&gt;
          &lt;div class=&quot;dm-message-actions&quot;&gt;
            &lt;button class=&quot;dm-reply-action&quot; type=&quot;button&quot; data-dm-reply=&quot;${Number(row.id)}&quot;&gt;Reply&lt;/button&gt;
            ${mine ? `&lt;button class=&quot;dm-edit-action&quot; type=&quot;button&quot; data-dm-edit=&quot;${Number(row.id)}&quot;&gt;Edit&lt;/button&gt;` : &#x27;&#x27;}
            ${mine ? `&lt;button class=&quot;dm-delete-action&quot; type=&quot;button&quot; data-dm-delete=&quot;${Number(row.id)}&quot;&gt;Delete&lt;/button&gt;` : &#x27;&#x27;}
          &lt;/div&gt;
          &lt;div class=&quot;dm-message-meta&quot;&gt;
            ${row.edited_at ? &#x27;&lt;span class=&quot;dm-edited&quot;&gt;Edited&lt;/span&gt;&#x27; : &#x27;&#x27;}
            &lt;span class=&quot;dm-time&quot;&gt;${escapeChat(when)}&lt;/span&gt;
            ${readLabel}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;`;
    }).join(&#x27;&#x27;);

    dmLastRenderConversation = conversationKey;
    dmLastRenderSignature = renderSignature;

    if(scrollBottom || nearBottom){
      dmMessages.scrollTop = dmMessages.scrollHeight;
    }else{
      // Stay exactly where the user was reading instead of jumping upward.
      dmMessages.scrollTop = oldScrollTop;
    }

    // Images can finish decoding a moment after the HTML is inserted.
    // If the user was already at the bottom, keep them at the bottom;
    // otherwise do not move their reading position.
    if(scrollBottom || nearBottom){
      dmMessages.querySelectorAll(&#x27;.dm-image-attachment img&#x27;).forEach(img =&gt; {
        if(img.complete) return;
        img.addEventListener(&#x27;load&#x27;,() =&gt; {
          dmMessages.scrollTop = dmMessages.scrollHeight;
          updateDmScrollControls();
        },{once:true});
      });
    }

    requestAnimationFrame(updateDmScrollControls);

    if(markedRead){
      setTimeout(loadDmFriends,0);
    }
  }catch(err){
    setDmStatus(&#x27;DM error: &#x27; + (err?.message || String(err)), &#x27;error&#x27;);
  }
}

async function openDmWith(userId, displayName=&#x27;Member&#x27;, avatarUrl=&#x27;&#x27;){
  if(!userId || !dmSection) return;

  const session = await getChatSession();
  if(!session?.user) return;
  if(userId === session.user.id) return;

  const blockState = await getMemberBlockState(userId);
  if(blockState.blocked_by_me || blockState.blocked_me){
    setDmStatus(&#x27;This DM is unavailable while a block is active.&#x27;,&#x27;error&#x27;);
    return;
  }

  // DMs are for accepted friends only.
  const friendship = await getFriendshipState(userId);
  if(!friendship || friendship.status !== &#x27;accepted&#x27;){
    setDmStatus(&#x27;You need to be friends before you can DM this member.&#x27;, &#x27;error&#x27;);
    return;
  }

  const previousDmUserId = dmActiveUserId;
  const changingConversation = dmActiveUserId !== userId;

  if(changingConversation &amp;&amp; previousDmUserId){
    clearOwnDmTyping(previousDmUserId);
  }

  dmActiveUserId = userId;
  dmActiveName = displayName || &#x27;Member&#x27;;
  dmActiveAvatar = avatarUrl || &#x27;&#x27;;

  if(changingConversation){
    dmLastRenderConversation = &#x27;&#x27;;
    dmLastRenderSignature = &#x27;&#x27;;
    dmRowsById = new Map();
    clearDmReply();
    clearDmEdit();
    hideDmTypingIndicator();
  }

  dmThreadName.textContent = dmActiveName;
  dmThreadState.textContent = &#x27;Private conversation&#x27;;
  syncDmComposerMode();
  if(dmCallBtn) dmCallBtn.classList.remove(&#x27;hidden&#x27;);
  setDmStatus(&#x27;&#x27;);

  closeChatPublicProfile();
  dmSection.style.display = &#x27;&#x27;;
  location.hash = &#x27;dmSection&#x27;;

  await loadDmFriends();
  await loadDmConversation(true);

  clearInterval(dmPollTimer);
  dmPollTimer = setInterval(() =&gt; {
    if(dmActiveUserId &amp;&amp; document.visibilityState === &#x27;visible&#x27;){
      loadDmConversation(false);
    }
  }, 3000);

  startDmTypingPolling();
  setTimeout(() =&gt; dmInput?.focus(), 150);
}

async function sendDm(){
  if(dmEditTarget){
    return saveDmEdit();
  }

  if(dmSending || !dmActiveUserId) return;

  const text = dmInput?.value.trim() || &#x27;&#x27;;
  const files = [...dmPendingFiles];

  if(!text &amp;&amp; !files.length) return;

  dmSending = true;
  if(dmSendBtn) dmSendBtn.disabled = true;
  if(dmPhotoBtn) dmPhotoBtn.disabled = true;
  if(dmAttachBtn) dmAttachBtn.disabled = true;

  setDmStatus(files.length ? &#x27;Preparing attachments...&#x27; : &#x27;Sending...&#x27;);

  const uploadedPaths = [];
  let insertedMessageId = null;

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) throw new Error(&#x27;Log in first.&#x27;);

    const senderId = session.user.id;
    const recipientId = dmActiveUserId;
    const uploaded = [];

    for(let i=0;i&lt;files.length;i++){
      const file = files[i];
      const mime = dmMimeForFile(file);

      if(!mime || !dmAttachmentAllowed(file)){
        throw new Error(`${file.name || &#x27;Attachment&#x27;} type is not supported.`);
      }

      if(file.size &gt; DM_MAX_FILE_BYTES){
        throw new Error(`${file.name || &#x27;Attachment&#x27;} is over 10 MB.`);
      }

      setDmStatus(`Uploading attachment ${i + 1} of ${files.length}...`);

      const safeName = dmSafeStorageFileName(file.name || `attachment-${i + 1}`);
      const path = `${senderId}/${recipientId}/${Date.now()}-${dmRandomToken()}-${safeName}`;

      const {error:uploadError} = await client
        .storage
        .from(&#x27;dm-media&#x27;)
        .upload(path,file,{
          contentType:mime,
          upsert:false,
          cacheControl:&#x27;3600&#x27;
        });

      if(uploadError) throw uploadError;

      uploadedPaths.push(path);
      uploaded.push({
        storage_path:path,
        file_name:String(file.name || safeName).slice(0,180),
        mime_type:mime,
        file_size:Number(file.size || 0)
      });
    }

    setDmStatus(&#x27;Sending...&#x27;);

    const {data:messageRow,error:messageError} = await client
      .from(&#x27;direct_messages&#x27;)
      .insert({
        sender_id:senderId,
        recipient_id:recipientId,
        message:text || &#x27;📎 Attachment&#x27;,
        reply_to_id:dmReplyTarget?.id || null
      })
      .select(&#x27;id&#x27;)
      .single();

    if(messageError) throw messageError;
    insertedMessageId = Number(messageRow?.id);

    if(!insertedMessageId){
      throw new Error(&#x27;Message was sent but its ID could not be loaded.&#x27;);
    }

    if(uploaded.length){
      const attachmentRows = uploaded.map(item =&gt; ({
        message_id:insertedMessageId,
        uploader_id:senderId,
        storage_path:item.storage_path,
        file_name:item.file_name,
        mime_type:item.mime_type,
        file_size:item.file_size
      }));

      const {error:attachmentError} = await client
        .from(&#x27;direct_message_attachments&#x27;)
        .insert(attachmentRows);

      if(attachmentError) throw attachmentError;
    }

    if(dmInput) dmInput.value = &#x27;&#x27;;
    dmClearPendingFiles();
    clearDmReply();
    await clearOwnDmTyping(recipientId);

    setDmStatus(files.length ? &#x27;✓ Sent with attachment&#x27; : &#x27;✓ Sent&#x27;,&#x27;success&#x27;);
    await loadDmConversation(true);
    await loadDmFriends();

    setTimeout(() =&gt; {
      if(dmStatus?.textContent?.startsWith(&#x27;✓ Sent&#x27;)) setDmStatus(&#x27;&#x27;);
    },1500);

  }catch(err){
    console.error(&#x27;DM send error:&#x27;,err);

    try{
      const client = window.gymcelsLolDb;

      if(insertedMessageId){
        await client
          .from(&#x27;direct_messages&#x27;)
          .delete()
          .eq(&#x27;id&#x27;,insertedMessageId);
      }

      if(uploadedPaths.length){
        await client
          .storage
          .from(&#x27;dm-media&#x27;)
          .remove(uploadedPaths);
      }
    }catch(cleanupErr){
      console.warn(&#x27;Could not fully clean up failed DM attachment:&#x27;,cleanupErr);
    }

    setDmStatus(&#x27;Send failed: &#x27; + (err?.message || String(err)),&#x27;error&#x27;);

  }finally{
    dmSending = false;

    if(dmActiveUserId){
      if(dmSendBtn) dmSendBtn.disabled = false;
      if(dmPhotoBtn) dmPhotoBtn.disabled = false;
      if(dmAttachBtn) dmAttachBtn.disabled = false;
    }
  }
}

document.addEventListener(&#x27;click&#x27;, (e) =&gt; {
  const target = e.target.closest(&#x27;[data-dm-user]&#x27;);
  if(!target) return;

  e.preventDefault();
  e.stopPropagation();

  openDmWith(
    target.dataset.dmUser,
    target.dataset.dmName || &#x27;Member&#x27;,
    target.dataset.dmAvatar || &#x27;&#x27;
  );
});

if(chatDmBtn){
  chatDmBtn.addEventListener(&#x27;click&#x27;, () =&gt; {
    openDmWith(openedChatUserId, openedChatDisplayName, openedChatAvatarUrl);
  });
}

if(dmPhotoBtn){
  dmPhotoBtn.addEventListener(&#x27;click&#x27;,() =&gt; {
    if(!dmPhotoBtn.disabled) dmPhotoInput?.click();
  });
}

if(dmAttachBtn){
  dmAttachBtn.addEventListener(&#x27;click&#x27;,() =&gt; {
    if(!dmAttachBtn.disabled) dmFileInput?.click();
  });
}

if(dmPhotoInput){
  dmPhotoInput.addEventListener(&#x27;change&#x27;,() =&gt; {
    addDmPendingFiles(dmPhotoInput.files);
    dmPhotoInput.value = &#x27;&#x27;;
  });
}

if(dmFileInput){
  dmFileInput.addEventListener(&#x27;change&#x27;,() =&gt; {
    addDmPendingFiles(dmFileInput.files);
    dmFileInput.value = &#x27;&#x27;;
  });
}

if(dmAttachmentPreview){
  dmAttachmentPreview.addEventListener(&#x27;click&#x27;,(e) =&gt; {
    const removeBtn = e.target.closest(&#x27;[data-dm-remove-pending]&#x27;);
    if(!removeBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const index = Number(removeBtn.dataset.dmRemovePending);
    if(!Number.isInteger(index) || index &lt; 0 || index &gt;= dmPendingFiles.length) return;

    dmPendingFiles.splice(index,1);
    renderDmPendingFiles();
  });
}


dmReplyCancel?.addEventListener(&#x27;click&#x27;,() =&gt; {
  clearDmReply();
  dmInput?.focus();
});

dmEditCancel?.addEventListener(&#x27;click&#x27;,() =&gt; {
  clearDmEdit();
  dmInput?.focus();
});

dmMessages?.addEventListener(&#x27;click&#x27;,async (e) =&gt; {
  const editBtn = e.target.closest(&#x27;[data-dm-edit]&#x27;);
  if(editBtn){
    e.preventDefault();
    e.stopPropagation();

    const row = dmRowsById.get(Number(editBtn.dataset.dmEdit));
    if(row) await beginDmEdit(row);
    return;
  }

  const deleteBtn = e.target.closest(&#x27;[data-dm-delete]&#x27;);
  if(deleteBtn){
    e.preventDefault();
    e.stopPropagation();

    const row = dmRowsById.get(Number(deleteBtn.dataset.dmDelete));
    if(row) await deleteDmMessage(row);
    return;
  }

  const replyBtn = e.target.closest(&#x27;[data-dm-reply]&#x27;);
  if(replyBtn){
    e.preventDefault();
    e.stopPropagation();

    const row = dmRowsById.get(Number(replyBtn.dataset.dmReply));
    if(row) beginDmReply(row);
    return;
  }

  const jumpBtn = e.target.closest(&#x27;[data-dm-jump-message]&#x27;);
  if(jumpBtn){
    e.preventDefault();
    e.stopPropagation();
    jumpToDmMessage(jumpBtn.dataset.dmJumpMessage);
  }
});

if(dmSendBtn) dmSendBtn.addEventListener(&#x27;click&#x27;, sendDm);

if(dmInput){
  dmInput.addEventListener(&#x27;input&#x27;,scheduleOwnDmTyping);

  dmInput.addEventListener(&#x27;blur&#x27;,() =&gt; {
    clearOwnDmTyping();
  });

  dmInput.addEventListener(&#x27;keydown&#x27;, (e) =&gt; {
    if(e.key === &#x27;Escape&#x27; &amp;&amp; dmEditTarget){
      e.preventDefault();
      clearDmEdit();
      return;
    }

    if(e.key === &#x27;Escape&#x27; &amp;&amp; dmReplyTarget){
      e.preventDefault();
      clearDmReply();
      return;
    }

    if(e.key === &#x27;Enter&#x27; &amp;&amp; !e.shiftKey){
      e.preventDefault();
      sendDm();
    }
  });
}

if(dmRefreshBtn){
  dmRefreshBtn.addEventListener(&#x27;click&#x27;, async () =&gt; {
    await loadDmFriends();
    if(dmActiveUserId) await loadDmConversation(false);
  });
}

if(navDmsOutside){
  navDmsOutside.addEventListener(&#x27;click&#x27;, () =&gt; {
    setTimeout(loadDmFriends, 50);
  });
}

fpDb.auth.onAuthStateChange((_event, session) =&gt; {
  startPrivateCallSystem(session);
  if(session?.user){
    setTimeout(loadDmFriends, 0);
  }else{
    clearInterval(dmPollTimer);
    clearInterval(dmTypingPollTimer);
    clearTimeout(dmTypingWriteTimer);
    clearTimeout(dmTypingClearTimer);

    clearOwnDmTyping(dmActiveUserId);
    dmActiveUserId = null;
    dmLastRenderConversation = &#x27;&#x27;;
    dmLastRenderSignature = &#x27;&#x27;;
    dmRowsById = new Map();
    clearDmReply();
    clearDmEdit();
    hideDmTypingIndicator();
    dmClearPendingFiles();

    if(dmInput) dmInput.disabled = true;
    if(dmSendBtn) dmSendBtn.disabled = true;
    if(dmPhotoBtn) dmPhotoBtn.disabled = true;
    if(dmAttachBtn) dmAttachBtn.disabled = true;
    if(dmCallBtn) dmCallBtn.classList.add(&#x27;hidden&#x27;);
    if(dmSection) dmSection.style.display = &#x27;none&#x27;;
  }
});

setTimeout(loadDmFriends, 250);
setTimeout(updateDmScrollControls, 300);
setTimeout(async () =&gt; {
  try{
    const session = await getChatSession();
    await startPrivateCallSystem(session);
  }catch(err){
    console.error(&#x27;Private call startup error:&#x27;,err);
  }
},350);

async function uploadProfilePhoto(){
  const file = profilePhotoInput?.files?.[0];
  if(!file){
    profileMessage.textContent = &#x27;Choose a photo first.&#x27;;
    return;
  }
  if(file.size &gt; 5 * 1024 * 1024){
    profileMessage.textContent = &#x27;Photo must be under 5 MB.&#x27;;
    return;
  }

  const allowed = [&#x27;image/jpeg&#x27;,&#x27;image/png&#x27;,&#x27;image/webp&#x27;];
  if(!allowed.includes(file.type)){
    profileMessage.textContent = &#x27;Use a JPG, PNG, or WebP image.&#x27;;
    return;
  }

  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user){
    profileMessage.textContent = &#x27;Log in first.&#x27;;
    return;
  }

  profileMessage.textContent = &#x27;Uploading photo...&#x27;;

  const ext = (file.name.split(&#x27;.&#x27;).pop() || &#x27;jpg&#x27;).toLowerCase();
  const filePath = `${session.user.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await fpDb.storage
    .from(&#x27;avatars&#x27;)
    .upload(filePath, file, { contentType: file.type });

  if(uploadError){
    profileMessage.textContent = uploadError.message;
    profileMessage.style.color = &#x27;#ff5a6b&#x27;;
    profileMessage.style.fontWeight = &#x27;700&#x27;;
    return;
  }

  const { data: publicData } = fpDb.storage.from(&#x27;avatars&#x27;).getPublicUrl(filePath);
  const avatar_url = publicData.publicUrl;

  const { error: updateError } = await fpDb.auth.updateUser({
    data: { avatar_url, avatar_path: filePath }
  });

  if(updateError){
    profileMessage.textContent = updateError.message;
    return;
  }

  profileMessage.textContent = &#x27;✓ PROFILE PHOTO UPDATED&#x27;;
  updateOwnPresence();
  profileMessage.style.fontWeight = &#x27;900&#x27;;
  profileMessage.style.color = &#x27;#67e8a5&#x27;;
  await fpDb
    .from(&#x27;messages&#x27;)
    .update({ avatar_url })
    .eq(&#x27;user_id&#x27;, session.user.id); // Sync avatar into old chat messages
  profilePhotoInput.value = &#x27;&#x27;;
  await refreshMemberProfile();
}


async function removePhysiquePhoto(){
  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user) return;

  const user = session.user;
  const meta = user.user_metadata || {};
  const currentPath = meta.physique_path || &#x27;&#x27;;

  profileMessage.textContent = &#x27;Removing physique photo...&#x27;;
  profileMessage.style.color = &#x27;#9aa1ad&#x27;;

  if(currentPath){
    await fpDb.storage.from(&#x27;physiques&#x27;).remove([currentPath]);
  }

  const { error } = await fpDb.auth.updateUser({
    data: { physique_url:null, physique_path:null }
  });

  if(error){
    profileMessage.textContent = error.message;
    profileMessage.style.color = &#x27;#ff5a6b&#x27;;
    return;
  }

  await fpDb
    .from(&#x27;member_presence&#x27;)
    .update({ physique_url:null })
    .eq(&#x27;user_id&#x27;, user.id);

  if(profilePhysiqueInput) profilePhysiqueInput.value = &#x27;&#x27;;
  if(pendingPhysiquePreviewUrl){
    URL.revokeObjectURL(pendingPhysiquePreviewUrl);
    pendingPhysiquePreviewUrl = null;
  }

  if(profilePhysiqueNote){
    profilePhysiqueNote.textContent = &#x27;Optional public physique photo. JPG, PNG, or WebP under 8 MB. Click Save Profile to apply it.&#x27;;
    profilePhysiqueNote.classList.remove(&#x27;ready&#x27;);
  }

  profileMessage.textContent = &#x27;✓ Physique photo removed.&#x27;;
  profileMessage.style.color = &#x27;#67e8a5&#x27;;
  profileMessage.style.fontWeight = &#x27;900&#x27;;
  renderOwnPhysique(&#x27;&#x27;);
  await refreshMemberProfile();
}

if(removePhysiqueBtn){
  removePhysiqueBtn.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();
    await removePhysiquePhoto();
  });
}

async function removeProfilePhoto(){
  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user) return;

  profileMessage.textContent = &#x27;Removing photo...&#x27;;

  const meta = session.user.user_metadata || {};
  const currentPath = meta.avatar_path || &#x27;&#x27;;

  if(currentPath){
    await fpDb.storage.from(&#x27;avatars&#x27;).remove([currentPath]);
  }

  const { error } = await fpDb.auth.updateUser({
    data: { avatar_url: null, avatar_path: null }
  });

  if(error){
    profileMessage.textContent = error.message;
    return;
  }

  profileMessage.textContent = &#x27;✓ Profile photo removed.&#x27;;
  updateOwnPresence();
  profileMessage.style.color = &#x27;#67e8a5&#x27;;
  await fpDb
    .from(&#x27;messages&#x27;)
    .update({ avatar_url: null })
    .eq(&#x27;user_id&#x27;, session.user.id); // Remove avatar from old chat messages
  await refreshMemberProfile();
}

if(uploadProfilePhotoBtn){
  uploadProfilePhotoBtn.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();
    await uploadProfilePhoto();
  });
}
if(removeProfilePhotoBtn){
  removeProfilePhotoBtn.addEventListener(&#x27;click&#x27;, async (e) =&gt; {
    e.preventDefault();
    e.stopPropagation();
    await removeProfilePhoto();
  });
}


// ---- Clean mobile navigation ----
const mobileBottomNav = document.getElementById(&#x27;mobileBottomNav&#x27;);
const mobileMoreBtn = document.getElementById(&#x27;mobileMoreBtn&#x27;);
const mobileMoreTopBtn = document.getElementById(&#x27;mobileMoreTopBtn&#x27;);
const mobileNavDrawer = document.getElementById(&#x27;mobileNavDrawer&#x27;);
const mobileNavBackdrop = document.getElementById(&#x27;mobileNavBackdrop&#x27;);
const mobileNavClose = document.getElementById(&#x27;mobileNavClose&#x27;);
const mobileNotificationBtn = document.getElementById(&#x27;mobileNotificationBtn&#x27;);
const mobileNotificationBadge = document.getElementById(&#x27;mobileNotificationBadge&#x27;);

function openMobileNavDrawer(){
  mobileNavDrawer?.classList.add(&#x27;open&#x27;);
  mobileNavBackdrop?.classList.add(&#x27;open&#x27;);
  mobileNavDrawer?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
  mobileNavBackdrop?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
  mobileMoreBtn?.classList.add(&#x27;active&#x27;);
}

function closeMobileNavDrawer(){
  mobileNavDrawer?.classList.remove(&#x27;open&#x27;);
  mobileNavBackdrop?.classList.remove(&#x27;open&#x27;);
  mobileNavDrawer?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  mobileNavBackdrop?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
  mobileMoreBtn?.classList.remove(&#x27;active&#x27;);
}

function activateExistingNav(sourceId){
  const source = document.getElementById(sourceId);

  // Auth-only controls are hidden by the existing site logic.
  // If tapped while hidden, send the user to the normal login control.
  if(!source || source.classList.contains(&#x27;hidden&#x27;)){
    const login = document.getElementById(&#x27;navLogin&#x27;);
    if(login &amp;&amp; !login.classList.contains(&#x27;hidden&#x27;)) login.click();
    closeMobileNavDrawer();
    return;
  }

  source.click();
  closeMobileNavDrawer();
}

document.querySelectorAll(&#x27;[data-mobile-proxy]&#x27;).forEach(btn =&gt; {
  btn.addEventListener(&#x27;click&#x27;,e =&gt; {
    e.preventDefault();
    activateExistingNav(btn.dataset.mobileProxy);
  });
});

mobileMoreBtn?.addEventListener(&#x27;click&#x27;,() =&gt; {
  if(mobileNavDrawer?.classList.contains(&#x27;open&#x27;)) closeMobileNavDrawer();
  else openMobileNavDrawer();
});

mobileMoreTopBtn?.addEventListener(&#x27;click&#x27;,() =&gt; {
  if(mobileNavDrawer?.classList.contains(&#x27;open&#x27;)) closeMobileNavDrawer();
  else openMobileNavDrawer();
});

mobileNavClose?.addEventListener(&#x27;click&#x27;,closeMobileNavDrawer);
mobileNavBackdrop?.addEventListener(&#x27;click&#x27;,closeMobileNavDrawer);

document.addEventListener(&#x27;keydown&#x27;,e =&gt; {
  if(e.key === &#x27;Escape&#x27;) closeMobileNavDrawer();
});

mobileNotificationBtn?.addEventListener(&#x27;click&#x27;,(e) =&gt; {
  // Prevent this mobile tap from bubbling to the global outside-click
  // handler, which would otherwise open and instantly close the panel.
  e.preventDefault();
  e.stopPropagation();

  const source = document.getElementById(&#x27;navNotifications&#x27;);
  if(source &amp;&amp; !source.classList.contains(&#x27;hidden&#x27;)){
    source.click();
  }
});

function syncMobileNavState(){
  const notificationSource = document.getElementById(&#x27;navNotifications&#x27;);
  const desktopBadge = document.getElementById(&#x27;notificationBadge&#x27;);

  if(mobileNotificationBtn &amp;&amp; notificationSource){
    mobileNotificationBtn.classList.toggle(&#x27;hidden&#x27;,notificationSource.classList.contains(&#x27;hidden&#x27;));
  }

  if(mobileNotificationBadge &amp;&amp; desktopBadge){
    const count = desktopBadge.textContent || &#x27;0&#x27;;
    mobileNotificationBadge.textContent = count;
    mobileNotificationBadge.classList.toggle(
      &#x27;hidden&#x27;,
      desktopBadge.classList.contains(&#x27;hidden&#x27;) || Number(count) &lt;= 0
    );
  }

  document.querySelectorAll(&#x27;.mobile-drawer-link[data-mobile-proxy]&#x27;).forEach(proxy =&gt; {
    const source = document.getElementById(proxy.dataset.mobileProxy);
    proxy.classList.toggle(&#x27;mobile-source-hidden&#x27;,!!source?.classList.contains(&#x27;hidden&#x27;));
  });
}

const mobileNavWatchTargets = [
  &#x27;navNotifications&#x27;,&#x27;notificationBadge&#x27;,&#x27;navLogin&#x27;,&#x27;navSignup&#x27;,
  &#x27;navEditProfile&#x27;,&#x27;navWorkouts&#x27;,&#x27;navLogout&#x27;
].map(id =&gt; document.getElementById(id)).filter(Boolean);

const mobileNavMutationObserver = new MutationObserver(syncMobileNavState);
mobileNavWatchTargets.forEach(el =&gt; {
  mobileNavMutationObserver.observe(el,{
    attributes:true,
    attributeFilter:[&#x27;class&#x27;],
    childList:true,
    characterData:true,
    subtree:true
  });
});

syncMobileNavState();

const mobileSectionButtons = [...document.querySelectorAll(&#x27;.mobile-bottom-item[data-mobile-section]&#x27;)];

function updateMobileActiveNav(){
  if(window.innerWidth &gt; 800) return;

  let best = null;
  let bestDistance = Infinity;
  const anchorY = 110;

  mobileSectionButtons.forEach(btn =&gt; {
    const section = document.getElementById(btn.dataset.mobileSection);
    if(!section || getComputedStyle(section).display === &#x27;none&#x27;) return;

    const rect = section.getBoundingClientRect();
    const visible = rect.bottom &gt; anchorY &amp;&amp; rect.top &lt; window.innerHeight;

    if(visible){
      const distance = Math.abs(rect.top - anchorY);
      if(distance &lt; bestDistance){
        bestDistance = distance;
        best = btn;
      }
    }
  });

  mobileSectionButtons.forEach(btn =&gt; btn.classList.toggle(&#x27;active&#x27;,btn === best));
}

let mobileNavScrollTick = false;
window.addEventListener(&#x27;scroll&#x27;,() =&gt; {
  if(mobileNavScrollTick) return;
  mobileNavScrollTick = true;
  requestAnimationFrame(() =&gt; {
    updateMobileActiveNav();
    mobileNavScrollTick = false;
  });
},{passive:true});

window.addEventListener(&#x27;resize&#x27;,() =&gt; {
  if(window.innerWidth &gt; 800) closeMobileNavDrawer();
  updateMobileActiveNav();
});

setTimeout(() =&gt; {
  syncMobileNavState();
  updateMobileActiveNav();
},300);



// ---- Gymcels Reporting System (isolated module) ----
// This feature intentionally does not hook into startCommunityChat().
// If the report SQL is unavailable, this module fails closed without
// interrupting the rest of the site.
(function initGymcelsReportingSystem(){
  try{
    const db = window.gymcelsLolDb;
    if(!db?.auth) return;

    const reportOverlay = document.getElementById(&#x27;contentReportOverlay&#x27;);
    const reportClose = document.getElementById(&#x27;contentReportClose&#x27;);
    const reportCancel = document.getElementById(&#x27;contentReportCancel&#x27;);
    const reportTarget = document.getElementById(&#x27;contentReportTarget&#x27;);
    const reportReason = document.getElementById(&#x27;contentReportReason&#x27;);
    const reportDetails = document.getElementById(&#x27;contentReportDetails&#x27;);
    const reportSubmit = document.getElementById(&#x27;contentReportSubmit&#x27;);
    const reportStatus = document.getElementById(&#x27;contentReportStatus&#x27;);

    const reportsPanel = document.getElementById(&#x27;staffReportsPanel&#x27;);
    const reportsCount = document.getElementById(&#x27;staffReportsCount&#x27;);
    const reportsRefresh = document.getElementById(&#x27;staffReportsRefresh&#x27;);
    const reportsList = document.getElementById(&#x27;staffReportsList&#x27;);
    const reportsStatus = document.getElementById(&#x27;staffReportsStatus&#x27;);
    const reportsFab = document.getElementById(&#x27;staffReportsFab&#x27;);
    const reportsFabCount = document.getElementById(&#x27;staffReportsFabCount&#x27;);

    const threadReportBtn = document.getElementById(&#x27;threadReportBtn&#x27;);
    const profileReportBtn = document.getElementById(&#x27;chatReportUserBtn&#x27;);

    let reportDraft = null;
    let reportRowsById = new Map();
    let reportPollTimer = null;
    let staffCanReview = false;

    function reportEscape(value){
      return String(value ?? &#x27;&#x27;)
        .replaceAll(&#x27;&amp;&#x27;,&#x27;&amp;amp;&#x27;)
        .replaceAll(&#x27;&lt;&#x27;,&#x27;&amp;lt;&#x27;)
        .replaceAll(&#x27;&gt;&#x27;,&#x27;&amp;gt;&#x27;)
        .replaceAll(&#x27;&quot;&#x27;,&#x27;&amp;quot;&#x27;)
        .replaceAll(&quot;&#x27;&quot;,&#x27;&amp;#039;&#x27;);
    }

    function reportTime(value){
      if(!value) return &#x27;&#x27;;
      const d = new Date(value);
      const ms = Date.now() - d.getTime();

      if(ms &lt; 60000) return &#x27;now&#x27;;
      if(ms &lt; 3600000) return `${Math.floor(ms/60000)}m ago`;
      if(ms &lt; 86400000) return `${Math.floor(ms/3600000)}h ago`;
      if(ms &lt; 604800000) return `${Math.floor(ms/86400000)}d ago`;

      return d.toLocaleDateString([],{
        month:&#x27;short&#x27;,
        day:&#x27;numeric&#x27;,
        year:&#x27;numeric&#x27;
      });
    }

    function reportTypeLabel(type){
      return ({
        chat:&#x27;Public chat message&#x27;,
        thread:&#x27;Thread&#x27;,
        thread_reply:&#x27;Thread reply&#x27;,
        user:&#x27;Member profile&#x27;
      })[type] || &#x27;Report&#x27;;
    }

    function setReportStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
      if(!reportStatus) return;
      reportStatus.textContent = text;
      reportStatus.className = `content-report-status ${type || &#x27;&#x27;}`;
    }

    function setStaffReportStatus(text=&#x27;&#x27;,type=&#x27;&#x27;){
      if(!reportsStatus) return;
      reportsStatus.textContent = text;
      reportsStatus.className = `staff-reports-status ${type || &#x27;&#x27;}`;
    }

    async function currentReportSession(){
      try{
        const {data,error} = await db.auth.getSession();
        if(error) throw error;
        return data?.session || null;
      }catch(err){
        console.warn(&#x27;Report session check failed:&#x27;,err);
        return null;
      }
    }

    function openReportDialog({type,id=null,userId=null,label=&#x27;Content&#x27;}){
      reportDraft = {
        type:String(type || &#x27;&#x27;),
        id:id ? Number(id) : null,
        userId:userId || null,
        label:String(label || &#x27;Content&#x27;)
      };

      if(reportTarget) reportTarget.textContent = reportDraft.label;
      if(reportReason) reportReason.value = &#x27;Spam&#x27;;
      if(reportDetails) reportDetails.value = &#x27;&#x27;;
      setReportStatus(&#x27;&#x27;);

      reportOverlay?.classList.add(&#x27;show&#x27;);
      reportOverlay?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;false&#x27;);
    }

    function closeReportDialog(){
      reportDraft = null;
      reportOverlay?.classList.remove(&#x27;show&#x27;);
      reportOverlay?.setAttribute(&#x27;aria-hidden&#x27;,&#x27;true&#x27;);
      setReportStatus(&#x27;&#x27;);
    }

    async function submitReport(){
      if(!reportDraft || !reportSubmit) return;

      const session = await currentReportSession();
      if(!session?.user){
        setReportStatus(&#x27;Log in to send a report.&#x27;,&#x27;error&#x27;);
        return;
      }

      reportSubmit.disabled = true;
      setReportStatus(&#x27;Sending report...&#x27;);

      try{
        const {error} = await db.rpc(&#x27;submit_gymcels_report&#x27;,{
          report_target_type:reportDraft.type,
          report_target_id:reportDraft.id,
          report_target_user:reportDraft.userId,
          report_reason:String(reportReason?.value || &#x27;Other&#x27;),
          report_details:String(reportDetails?.value || &#x27;&#x27;).trim() || null
        });

        if(error) throw error;

        setReportStatus(&#x27;✓ Report sent privately to the moderation team.&#x27;,&#x27;success&#x27;);

        // Staff who report something themselves see the inbox update immediately.
        if(staffCanReview){
          loadStaffReports().catch(()=&gt;{});
        }

        setTimeout(closeReportDialog,800);
      }catch(err){
        setReportStatus(err?.message || String(err),&#x27;error&#x27;);
      }finally{
        reportSubmit.disabled = false;
      }
    }

    function updateStaffReportCount(count){
      const n = Number(count || 0);

      if(reportsCount) reportsCount.textContent = String(n);
      if(reportsFabCount) reportsFabCount.textContent = String(n);
      reportsFab?.classList.toggle(&#x27;has-reports&#x27;,n &gt; 0);
    }

    async function loadStaffReports(){
      if(!staffCanReview || !reportsPanel || !reportsList) return;

      try{
        const {data,error} = await db.rpc(&#x27;staff_list_gymcels_reports&#x27;);
        if(error) throw error;

        const rows = Array.isArray(data) ? data : [];
        reportRowsById = new Map(
          rows.map(row =&gt; [Number(row.id),row])
        );

        updateStaffReportCount(rows.length);

        if(!rows.length){
          reportsList.innerHTML =
            &#x27;&lt;div class=&quot;staff-report-empty&quot;&gt;No open reports. Everything is clear.&lt;/div&gt;&#x27;;
          setStaffReportStatus(&#x27;&#x27;);
          return;
        }

        reportsList.innerHTML = rows.map(row =&gt; `
          &lt;div class=&quot;staff-report-card&quot; data-staff-report=&quot;${Number(row.id)}&quot;&gt;
            &lt;div class=&quot;staff-report-top&quot;&gt;
              &lt;div class=&quot;staff-report-type&quot;&gt;${reportEscape(reportTypeLabel(row.target_type))}&lt;/div&gt;
              &lt;div class=&quot;staff-report-time&quot;&gt;${reportEscape(reportTime(row.created_at))}&lt;/div&gt;
            &lt;/div&gt;

            &lt;div class=&quot;staff-report-meta&quot;&gt;
              Reported by &lt;strong&gt;${reportEscape(row.reporter_name || &#x27;Member&#x27;)}&lt;/strong&gt;
              · Reported member: &lt;strong&gt;${reportEscape(row.target_name || &#x27;Member&#x27;)}&lt;/strong&gt;
            &lt;/div&gt;

            &lt;span class=&quot;staff-report-reason&quot;&gt;${reportEscape(row.reason || &#x27;Other&#x27;)}&lt;/span&gt;

            ${row.target_preview
              ? `&lt;div class=&quot;staff-report-preview&quot;&gt;${reportEscape(row.target_preview)}&lt;/div&gt;`
              : &#x27;&#x27;}

            ${row.details
              ? `&lt;div class=&quot;staff-report-details&quot;&gt;Reporter note: ${reportEscape(row.details)}&lt;/div&gt;`
              : &#x27;&#x27;}

            &lt;div class=&quot;staff-report-actions&quot;&gt;
              &lt;button type=&quot;button&quot; data-staff-report-open=&quot;${Number(row.id)}&quot;&gt;Open&lt;/button&gt;
              &lt;button class=&quot;resolve&quot; type=&quot;button&quot; data-staff-report-resolve=&quot;${Number(row.id)}&quot;&gt;✓ Resolved&lt;/button&gt;
              &lt;button class=&quot;dismiss&quot; type=&quot;button&quot; data-staff-report-dismiss=&quot;${Number(row.id)}&quot;&gt;Dismiss&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        `).join(&#x27;&#x27;);

        setStaffReportStatus(&#x27;&#x27;);
      }catch(err){
        console.warn(&#x27;Report inbox load failed:&#x27;,err);
        setStaffReportStatus(
          &#x27;Could not refresh reports. The rest of the site is unaffected.&#x27;,
          &#x27;error&#x27;
        );
      }
    }

    async function reviewStaffReport(reportId,newStatus){
      if(!staffCanReview) return;

      try{
        setStaffReportStatus(&#x27;Updating report...&#x27;);

        const {error} = await db.rpc(&#x27;staff_review_gymcels_report&#x27;,{
          target_report_id:Number(reportId),
          new_status:String(newStatus)
        });

        if(error) throw error;

        setStaffReportStatus(
          newStatus === &#x27;resolved&#x27;
            ? &#x27;✓ Report marked resolved.&#x27;
            : &#x27;Report dismissed.&#x27;,
          &#x27;success&#x27;
        );

        await loadStaffReports();
      }catch(err){
        setStaffReportStatus(err?.message || String(err),&#x27;error&#x27;);
      }
    }

    async function openReportedTarget(row){
      if(!row) return;

      try{
        if(row.target_type === &#x27;chat&#x27;){
          document.getElementById(&#x27;communityChat&#x27;)
            ?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;});

          if(typeof loadCommunityChat === &#x27;function&#x27;){
            await loadCommunityChat(false);
          }

          setTimeout(() =&gt; {
            if(typeof jumpToChatMessage === &#x27;function&#x27;){
              const found = jumpToChatMessage(Number(row.target_id));
              if(found === false){
                setStaffReportStatus(&#x27;The reported chat message may already be deleted.&#x27;,&#x27;error&#x27;);
              }
            }
          },160);
          return;
        }

        if(row.target_type === &#x27;thread&#x27;){
          document.getElementById(&#x27;threadsSection&#x27;)
            ?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;});

          if(typeof openThread === &#x27;function&#x27;){
            await openThread(Number(row.thread_id || row.target_id));
          }
          return;
        }

        if(row.target_type === &#x27;thread_reply&#x27;){
          const threadId = Number(row.thread_id);
          if(!threadId) return;

          document.getElementById(&#x27;threadsSection&#x27;)
            ?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;start&#x27;});

          if(typeof openThread === &#x27;function&#x27;){
            await openThread(threadId);
          }

          setTimeout(() =&gt; {
            if(typeof jumpToThreadReply === &#x27;function&#x27;){
              jumpToThreadReply(Number(row.target_id));
            }
          },180);
          return;
        }

        if(row.target_type === &#x27;user&#x27; &amp;&amp; row.target_user_id){
          if(typeof openChatPublicProfile === &#x27;function&#x27;){
            openChatPublicProfile(
              row.target_user_id,
              row.target_name || &#x27;Member&#x27;,
              &#x27;&#x27;
            );
          }
        }
      }catch(err){
        console.warn(&#x27;Could not open reported target:&#x27;,err);
        setStaffReportStatus(&#x27;Could not open that reported item.&#x27;,&#x27;error&#x27;);
      }
    }

    async function configureStaffReportInbox(session){
      clearInterval(reportPollTimer);
      reportPollTimer = null;
      staffCanReview = false;

      reportsPanel?.classList.add(&#x27;hidden&#x27;);
      reportsFab?.classList.add(&#x27;hidden&#x27;);
      updateStaffReportCount(0);

      if(!session?.user) return;

      try{
        const {data,error} = await db.rpc(&#x27;staff_can_view_reports&#x27;);
        if(error) throw error;

        staffCanReview = data === true;

        if(!staffCanReview) return;

        reportsPanel?.classList.remove(&#x27;hidden&#x27;);
        reportsFab?.classList.remove(&#x27;hidden&#x27;);

        await loadStaffReports();

        // Independent polling. Errors are caught inside loadStaffReports().
        reportPollTimer = setInterval(() =&gt; {
          loadStaffReports().catch(()=&gt;{});
        },12000);
      }catch(err){
        // Fail closed: never let report setup break the rest of Gymcels.
        console.warn(&#x27;Report inbox unavailable:&#x27;,err);
      }
    }

    // Dynamic chat + reply report buttons.
    document.addEventListener(&#x27;click&#x27;,(e)=&gt;{
      const btn = e.target.closest(&#x27;[data-content-report]&#x27;);
      if(!btn) return;

      e.preventDefault();
      e.stopPropagation();

      openReportDialog({
        type:btn.dataset.contentReport,
        id:btn.dataset.reportId || null,
        userId:btn.dataset.reportUser || null,
        label:btn.dataset.reportLabel || &#x27;Reported content&#x27;
      });
    });

    threadReportBtn?.addEventListener(&#x27;click&#x27;,()=&gt;{
      try{
        if(!activeThread) return;

        openReportDialog({
          type:&#x27;thread&#x27;,
          id:Number(activeThread.id),
          userId:activeThread.author_id || null,
          label:`Thread: ${activeThread.title || &#x27;Untitled&#x27;}`
        });
      }catch(err){
        console.warn(&#x27;Thread report button error:&#x27;,err);
      }
    });

    profileReportBtn?.addEventListener(&#x27;click&#x27;,()=&gt;{
      try{
        if(!openedChatUserId) return;

        openReportDialog({
          type:&#x27;user&#x27;,
          userId:openedChatUserId,
          label:`Member: ${openedChatDisplayName || &#x27;Member&#x27;}`
        });
      }catch(err){
        console.warn(&#x27;Profile report button error:&#x27;,err);
      }
    });

    reportClose?.addEventListener(&#x27;click&#x27;,closeReportDialog);
    reportCancel?.addEventListener(&#x27;click&#x27;,closeReportDialog);
    reportSubmit?.addEventListener(&#x27;click&#x27;,submitReport);

    reportOverlay?.addEventListener(&#x27;click&#x27;,(e)=&gt;{
      if(e.target === reportOverlay) closeReportDialog();
    });

    document.addEventListener(&#x27;keydown&#x27;,(e)=&gt;{
      if(
        e.key === &#x27;Escape&#x27; &amp;&amp;
        reportOverlay?.classList.contains(&#x27;show&#x27;)
      ){
        closeReportDialog();
      }
    });

    reportsRefresh?.addEventListener(&#x27;click&#x27;,()=&gt;{
      loadStaffReports().catch(()=&gt;{});
    });

    reportsFab?.addEventListener(&#x27;click&#x27;,()=&gt;{
      reportsPanel?.scrollIntoView({behavior:&#x27;smooth&#x27;,block:&#x27;center&#x27;});
    });

    reportsList?.addEventListener(&#x27;click&#x27;,(e)=&gt;{
      const openBtn = e.target.closest(&#x27;[data-staff-report-open]&#x27;);
      if(openBtn){
        const row = reportRowsById.get(Number(openBtn.dataset.staffReportOpen));
        if(row) openReportedTarget(row);
        return;
      }

      const resolveBtn = e.target.closest(&#x27;[data-staff-report-resolve]&#x27;);
      if(resolveBtn){
        reviewStaffReport(
          Number(resolveBtn.dataset.staffReportResolve),
          &#x27;resolved&#x27;
        );
        return;
      }

      const dismissBtn = e.target.closest(&#x27;[data-staff-report-dismiss]&#x27;);
      if(dismissBtn){
        reviewStaffReport(
          Number(dismissBtn.dataset.staffReportDismiss),
          &#x27;dismissed&#x27;
        );
      }
    });

    // This auth listener exists only for the report inbox and is fully isolated.
    db.auth.onAuthStateChange((_event,session)=&gt;{
      setTimeout(()=&gt;{
        configureStaffReportInbox(session).catch(()=&gt;{});
      },0);
    });

    // Initial report inbox check happens after the page has initialized.
    setTimeout(async ()=&gt;{
      const session = await currentReportSession();
      await configureStaffReportInbox(session);
    },1200);

  }catch(err){
    // Last-resort containment: reporting can fail without freezing Gymcels.
    console.warn(&#x27;Gymcels report module disabled:&#x27;,err);
  }
})();



// ---- Desktop Buy Products dropdown ----
(function initDesktopBuyProductsMenu(){
  try{
    const btn=document.getElementById(&#x27;desktopBuyProductsBtn&#x27;);
    const menu=document.getElementById(&#x27;desktopBuyProductsMenu&#x27;);

    if(!btn || !menu) return;

    function setOpen(open){
      menu.classList.toggle(&#x27;hidden&#x27;,!open);
      btn.classList.toggle(&#x27;open&#x27;,open);
      btn.setAttribute(&#x27;aria-expanded&#x27;,open ? &#x27;true&#x27; : &#x27;false&#x27;);
    }

    btn.addEventListener(&#x27;click&#x27;,(e)=&gt;{
      e.stopPropagation();
      setOpen(menu.classList.contains(&#x27;hidden&#x27;));
    });

    menu.addEventListener(&#x27;click&#x27;,(e)=&gt;e.stopPropagation());

    document.addEventListener(&#x27;click&#x27;,()=&gt;{
      if(!menu.classList.contains(&#x27;hidden&#x27;)) setOpen(false);
    });

    document.addEventListener(&#x27;keydown&#x27;,(e)=&gt;{
      if(e.key===&#x27;Escape&#x27;) setOpen(false);
    });
  }catch(err){
    console.warn(&#x27;Buy Products menu disabled:&#x27;,err);
  }
})();
</pre>
</body>
</html>
