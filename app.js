window.fpVerificationCallback = (() => {
  const rawHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '';
  const params = new URLSearchParams(rawHash);
  return {
    isSignup: params.get('type') === 'signup',
    hasError: !!params.get('error'),
    errorDescription: params.get('error_description') || ''
  };
})();
(() => {
  const SUPABASE_URL = 'https://endazjmlwqcfvniyxpos.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_CDLjF7ILDgZFvrNqN1LZig_cxJdT9Y7';
  const { createClient } = window.supabase;
  const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  window.gymcelsLolDb = db;

  const recoveryRequestedFromUrl = (() => {
    try {
      const hashParams = new URLSearchParams(
        window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
      );
      const queryParams = new URLSearchParams(window.location.search);
      return hashParams.get('type') === 'recovery' || queryParams.get('type') === 'recovery';
    } catch (_) {
      return false;
    }
  })();

  const verificationSuccess = document.getElementById('verificationSuccess');
  const verificationCallback = window.fpVerificationCallback || {};

  async function handleVerificationCallback() {
    if (!verificationCallback.isSignup || verificationCallback.hasError) return;

    // Give Supabase a moment to finish reading the confirmation tokens from the URL.
    await new Promise(resolve => setTimeout(resolve, 350));
    const { data: { session } } = await db.auth.getSession();

    if (verificationSuccess) {
      verificationSuccess.classList.add('show');
      verificationSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Only remove the sensitive auth fragment after Supabase has had a chance to consume it.
    if (session) {
      setTimeout(() => {
        history.replaceState(null, '', window.location.pathname + window.location.search + '#members');
      }, 900);
    }
  }


  const $ = (id) => document.getElementById(id);
  const authView = $('authView');
  const dashboardView = $('dashboardView');
  const memberEmail = $('memberEmail');
  const logList = $('logList');
  const navSignup = $('navSignup');
  const navChat = $('navChat');
  const navThreads = $('navThreads');
  const navFriends = $('navFriends');
  const navDms = $('navDms');
  const navVoice = $('navVoice');
  const navVip = $('navVip');
  const navLogin = $('navLogin');
  const navEditProfile = $('navEditProfile');
  const navWorkouts = $('navWorkouts');
  const navNutrition = $('navNutrition');
  const navLogout = $('navLogout');
  const beatLast = $('beatLast');
  const joinFreeHero = $('joinFreeHero');
  const joinGymcelsFreeBtn = $('joinGymcelsFreeBtn');

  const vipStatusPill = $('vipStatusPill');
  const vipUnlocked = $('vipUnlocked');
  const vipLocked = $('vipLocked');
  const vipRefreshBtn = $('vipRefreshBtn');
  const vipCheckMessage = $('vipCheckMessage');
  const profileVipBadge = $('profileVipBadge');


  function msg(el, text, type='') {
    el.textContent = text || '';
    el.className = 'member-message' + (type ? ' ' + type : '');
  }
  function today() { return new Date().toISOString().slice(0,10); }
  $('dateInput').value = today();


  function setVipUi(isVip, message='') {
    if (vipStatusPill) {
      vipStatusPill.textContent = isVip ? '★ VIP ACTIVE' : 'VIP LOCKED';
      vipStatusPill.classList.toggle('active', !!isVip);
    }
    if (vipUnlocked) vipUnlocked.classList.toggle('hidden', !isVip);
    if (vipLocked) vipLocked.classList.toggle('hidden', !!isVip);
    if (profileVipBadge) profileVipBadge.classList.toggle('hidden', !isVip);
    if (navVip) {
      navVip.textContent = isVip ? 'VIP ✓' : 'VIP';
      navVip.setAttribute('href', '#vipSection');
      navVip.removeAttribute('target');
      navVip.removeAttribute('rel');
    }
    if (vipCheckMessage) vipCheckMessage.textContent = message || '';
  }

  async function refreshVipStatus(showMessage=false) {
    const { data: { session } } = await db.auth.getSession();

    if (!session?.user) {
      setVipUi(false, 'Log in to connect VIP to your Gymcels.lol account.');
      if (navVip) {
        navVip.textContent = 'VIP';
        navVip.setAttribute('href', '#vipSection');
        navVip.removeAttribute('target');
        navVip.removeAttribute('rel');
      }
      return false;
    }

    if (vipStatusPill) vipStatusPill.textContent = 'Checking VIP status…';
    if (vipCheckMessage && showMessage) vipCheckMessage.textContent = 'Checking your Payhip purchase…';

    const { data, error } = await db.rpc('my_vip_status');

    if (error) {
      setVipUi(false, 'VIP check is not connected yet.');
      if (vipCheckMessage) vipCheckMessage.textContent = 'VIP check error: ' + error.message;
      return false;
    }

    const isVip = data === true;

    setVipUi(
      isVip,
      isVip
        ? 'Your $5 Payhip purchase has been verified.'
        : (showMessage ? 'No verified VIP purchase found for ' + (session.user.email || 'this account') + ' yet.' : '')
    );

    return isVip;
  }

  if (vipRefreshBtn) {
    vipRefreshBtn.addEventListener('click', async () => {
      vipRefreshBtn.disabled = true;
      vipRefreshBtn.textContent = 'Checking…';
      await refreshVipStatus(true);
      vipRefreshBtn.disabled = false;
      vipRefreshBtn.textContent = 'Refresh VIP Status';
    });
  }

  joinGymcelsFreeBtn?.addEventListener('click',(event) => {
    event.preventDefault();

    const signupCard = $('signup-card');
    if(!signupCard) return;

    signupCard.scrollIntoView({
      behavior:'smooth',
      block:'center'
    });

    history.replaceState(null,'','#signup-card');

    setTimeout(() => {
      $('signupEmail')?.focus({preventScroll:true});
    },550);
  });

  // Always take "My Workouts" to the actual Log a Lift area,
  // not the Edit Profile section above it.
  navWorkouts?.addEventListener('click',(event) => {
    if(navWorkouts.classList.contains('hidden')) return;

    event.preventDefault();

    const target =
      document.querySelector('.workout-log-card') ||
      document.getElementById('workoutTracker');

    if(!target) return;

    target.scrollIntoView({
      behavior:'smooth',
      block:'start'
    });

    history.replaceState(null,'','#workoutTracker');
  });

  async function refreshSession() {
    const { data: { session } } = await db.auth.getSession();
    if (session?.user) {
      if(joinFreeHero) joinFreeHero.classList.add('hidden');
      authView.classList.add('hidden');
      dashboardView.classList.remove('hidden');
      memberEmail.textContent = session.user.email || '';
      refreshAccountSettingsUi(session);
      navSignup.classList.add('hidden');
      navLogin.classList.add('hidden');
      if (navEditProfile) navEditProfile.classList.remove('hidden');
      navWorkouts.classList.remove('hidden');
      navWorkouts.setAttribute('href', '#workoutTracker');
      if (navNutrition) navNutrition.classList.remove('hidden');
      navLogout.classList.remove('hidden');
      if (navChat) navChat.setAttribute('href', '#communityChat');
      if (navThreads) navThreads.setAttribute('href', '#threadsSection');
      if (navThreads) navThreads.setAttribute('href', '#threadsSection');
      if (navFriends) navFriends.setAttribute('href', '#friendsSection');
      if (navDms) navDms.setAttribute('href', '#dmSection');
      if (navVoice) navVoice.setAttribute('href', '#voiceSection');
      await loadLogs();
      await refreshVipStatus();
    } else {
      if(joinFreeHero) joinFreeHero.classList.remove('hidden');
      dashboardView.classList.add('hidden');
      authView.classList.remove('hidden');
      navSignup.classList.remove('hidden');
      navLogin.classList.remove('hidden');
      if (navEditProfile) navEditProfile.classList.add('hidden');
      navWorkouts.classList.add('hidden');
      if (navNutrition) navNutrition.classList.add('hidden');
      navLogout.classList.add('hidden');
      if (navChat) navChat.setAttribute('href', '#communityChat');
      if (navFriends) navFriends.setAttribute('href', '#login-card');
      if (navDms) navDms.setAttribute('href', '#login-card');
      if (navVoice) navVoice.setAttribute('href', '#voiceSection');
      await refreshVipStatus();
    }
  }

  $('signupBtn').addEventListener('click', async () => {
    const email = $('signupEmail').value.trim();
    const password = $('signupPassword').value;
    msg($('signupMsg'),'');
    if (!email || password.length < 6) return msg($('signupMsg'),'Enter a valid email and a password with at least 6 characters.','error');
    const { data, error } = await db.auth.signUp({
      email, password,
      options: { emailRedirectTo: 'https://gymcels.lol/' }
    });
    if (error) return msg($('signupMsg'), error.message, 'error');
    if (data.session) { msg($('signupMsg'),'Account created. You are signed in.','success'); await refreshSession(); }
    else msg($('signupMsg'),'Verification email sent! Check your inbox (and spam/junk folder), open the email from Gymcels.lol, and click the verification link. After verifying, come back here and log in.','success');
  });

  // ---- Forgot password / account recovery ----
  function installPasswordRecoveryUi() {
    const loginBtn = $('loginBtn');
    const loginCard = $('login-card');
    if (!loginBtn || !loginCard) return;

    if (!document.getElementById('gymcelsRecoveryStyles')) {
      const style = document.createElement('style');
      style.id = 'gymcelsRecoveryStyles';
      style.textContent = `
        .gymcels-forgot-btn{
          margin-top:10px;
          padding:0;
          border:0;
          background:transparent;
          color:#aeb6c2;
          font:inherit;
          font-size:12px;
          font-weight:700;
          cursor:pointer;
          text-decoration:underline;
          text-underline-offset:3px;
        }
        .gymcels-forgot-btn:hover{color:#fff}
        .gymcels-recovery-overlay{
          position:fixed;
          inset:0;
          z-index:100000;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:18px;
          background:rgba(5,7,10,.82);
          backdrop-filter:blur(7px);
        }
        .gymcels-recovery-overlay.hidden{display:none}
        .gymcels-recovery-card{
          width:min(430px,100%);
          border:1px solid #2d333c;
          border-radius:16px;
          background:#101319;
          box-shadow:0 24px 70px rgba(0,0,0,.55);
          padding:22px;
          color:#f4f6f8;
        }
        .gymcels-recovery-card h3{margin:0 0 6px;font-size:22px}
        .gymcels-recovery-card p{margin:0 0 16px;color:#9ea7b3;font-size:13px;line-height:1.45}
        .gymcels-recovery-card label{
          display:block;
          margin:12px 0 6px;
          color:#cfd5dc;
          font-size:12px;
          font-weight:800;
        }
        .gymcels-recovery-card input{
          width:100%;
          box-sizing:border-box;
          min-height:44px;
          border:1px solid #303640;
          border-radius:9px;
          background:#0b0e13;
          color:#fff;
          padding:10px 12px;
          font-size:16px;
          outline:none;
        }
        .gymcels-recovery-card input:focus{border-color:#ef4355}
        .gymcels-recovery-actions{
          display:flex;
          gap:10px;
          margin-top:16px;
        }
        .gymcels-recovery-actions button{
          min-height:42px;
          border-radius:9px;
          padding:0 14px;
          font-weight:900;
          cursor:pointer;
        }
        #gymcelsRecoverySave{
          flex:1;
          border:0;
          background:#ef4355;
          color:#fff;
        }
        #gymcelsRecoveryClose{
          border:1px solid #343b46;
          background:#171b22;
          color:#cfd5dc;
        }
        #gymcelsRecoveryMsg{
          min-height:18px;
          margin-top:12px;
          font-size:12px;
          color:#9ea7b3;
        }
        #gymcelsRecoveryMsg.error{color:#ff7b88}
        #gymcelsRecoveryMsg.success{color:#67e8a5}
      `;
      document.head.appendChild(style);
    }

    if (!document.getElementById('forgotPasswordBtn')) {
      const forgot = document.createElement('button');
      forgot.id = 'forgotPasswordBtn';
      forgot.type = 'button';
      forgot.className = 'gymcels-forgot-btn';
      forgot.textContent = 'Forgot password?';
      loginBtn.insertAdjacentElement('afterend', forgot);

      forgot.addEventListener('click', async () => {
        const email = $('loginEmail')?.value.trim() || '';
        const loginMsg = $('loginMsg');

        if (!email) {
          msg(loginMsg, 'Enter your email above first, then click “Forgot password?”.', 'error');
          $('loginEmail')?.focus();
          return;
        }

        forgot.disabled = true;
        forgot.textContent = 'Sending reset email…';
        msg(loginMsg, '');

        try {
          const { error } = await db.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gymcels.lol/'
          });

          if (error) throw error;

          msg(
            loginMsg,
            'If that email is registered, a password reset link was sent. Check your inbox and spam/junk folder.',
            'success'
          );
        } catch (error) {
          msg(loginMsg, error?.message || 'Could not send reset email. Try again in a moment.', 'error');
        } finally {
          forgot.disabled = false;
          forgot.textContent = 'Forgot password?';
        }
      });
    }

    if (!document.getElementById('gymcelsRecoveryOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'gymcelsRecoveryOverlay';
      overlay.className = 'gymcels-recovery-overlay hidden';
      overlay.innerHTML = `
        <div class="gymcels-recovery-card" role="dialog" aria-modal="true" aria-labelledby="gymcelsRecoveryTitle">
          <h3 id="gymcelsRecoveryTitle">Set a new password</h3>
          <p>Your reset link worked. Enter your new Gymcels.lol password below.</p>

          <label for="gymcelsRecoveryPassword">New password</label>
          <input id="gymcelsRecoveryPassword" type="password" autocomplete="new-password" minlength="6" placeholder="At least 6 characters">

          <label for="gymcelsRecoveryConfirm">Confirm new password</label>
          <input id="gymcelsRecoveryConfirm" type="password" autocomplete="new-password" minlength="6" placeholder="Type it again">

          <div id="gymcelsRecoveryMsg" role="status"></div>

          <div class="gymcels-recovery-actions">
            <button id="gymcelsRecoveryClose" type="button">Cancel</button>
            <button id="gymcelsRecoverySave" type="button">Save new password</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      const passwordInput = document.getElementById('gymcelsRecoveryPassword');
      const confirmInput = document.getElementById('gymcelsRecoveryConfirm');
      const recoveryMsg = document.getElementById('gymcelsRecoveryMsg');
      const saveBtn = document.getElementById('gymcelsRecoverySave');
      const closeBtn = document.getElementById('gymcelsRecoveryClose');

      const setRecoveryMsg = (text, type='') => {
        recoveryMsg.textContent = text || '';
        recoveryMsg.className = type || '';
      };

      closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        setRecoveryMsg('');
        history.replaceState(null, '', window.location.pathname + '#members');
      });

      saveBtn.addEventListener('click', async () => {
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        if (password.length < 6) {
          setRecoveryMsg('Use at least 6 characters.', 'error');
          passwordInput.focus();
          return;
        }

        if (password !== confirm) {
          setRecoveryMsg('Those passwords do not match.', 'error');
          confirmInput.focus();
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
        setRecoveryMsg('');

        try {
          const { error } = await db.auth.updateUser({ password });
          if (error) throw error;

          setRecoveryMsg('Password changed successfully. You are signed in.', 'success');
          passwordInput.value = '';
          confirmInput.value = '';

          history.replaceState(null, '', window.location.pathname + '#members');

          setTimeout(() => {
            overlay.classList.add('hidden');
            setRecoveryMsg('');
          }, 1400);
        } catch (error) {
          setRecoveryMsg(error?.message || 'Could not change password. Please request a new reset link.', 'error');
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save new password';
        }
      });

      const maybeSubmit = (event) => {
        if (event.key === 'Enter') saveBtn.click();
      };
      passwordInput.addEventListener('keydown', maybeSubmit);
      confirmInput.addEventListener('keydown', maybeSubmit);
    }
  }

  function showPasswordRecoveryPanel() {
    installPasswordRecoveryUi();

    const overlay = document.getElementById('gymcelsRecoveryOverlay');
    const passwordInput = document.getElementById('gymcelsRecoveryPassword');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    setTimeout(() => passwordInput?.focus(), 50);
  }

  installPasswordRecoveryUi();

  // ---- Small Account Settings panel: change email + change password ----
  function installAccountSettingsUi() {
    const dashboard = $('dashboardView');
    const profile = document.getElementById('memberProfile');
    if (!dashboard || !profile) return;

    if (!document.getElementById('gymcelsAccountSettingsStyles')) {
      const style = document.createElement('style');
      style.id = 'gymcelsAccountSettingsStyles';
      style.textContent = `
        .gymcels-account-settings{
          margin-top:14px;
          border:1px solid #2a3038;
          border-radius:14px;
          background:rgba(15,18,24,.94);
          overflow:hidden;
        }
        .gymcels-account-settings-head{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:14px 16px;
        }
        .gymcels-account-settings-title{
          font-size:14px;
          font-weight:900;
          color:#f4f6f8;
        }
        .gymcels-account-settings-sub{
          margin-top:3px;
          color:#8f99a6;
          font-size:10px;
          line-height:1.35;
        }
        .gymcels-account-settings-toggle{
          flex:0 0 auto;
          border:1px solid #343b45;
          border-radius:8px;
          background:#181c23;
          color:#e5e9ee;
          padding:8px 11px;
          font:inherit;
          font-size:10px;
          font-weight:900;
          cursor:pointer;
        }
        .gymcels-account-settings-toggle:hover{border-color:#ef4355;color:#fff}
        .gymcels-account-settings-body{
          border-top:1px solid #252b33;
          padding:14px 16px 16px;
        }
        .gymcels-account-settings-body.hidden{display:none}
        .gymcels-account-current{
          margin-bottom:12px;
          padding:9px 10px;
          border-radius:9px;
          background:#0c0f14;
          color:#aab3bf;
          font-size:10px;
        }
        .gymcels-account-current strong{color:#fff}
        .gymcels-account-setting{
          padding:12px 0;
          border-top:1px solid #222831;
        }
        .gymcels-account-setting:first-of-type{border-top:0}
        .gymcels-account-setting h4{
          margin:0 0 5px;
          color:#f1f3f6;
          font-size:12px;
        }
        .gymcels-account-setting p{
          margin:0 0 9px;
          color:#8f99a6;
          font-size:10px;
          line-height:1.45;
        }
        .gymcels-account-row{
          display:flex;
          gap:8px;
          align-items:center;
        }
        .gymcels-account-row + .gymcels-account-row{margin-top:8px}
        .gymcels-account-row input{
          min-width:0;
          flex:1;
          min-height:40px;
          box-sizing:border-box;
          border:1px solid #303640;
          border-radius:8px;
          background:#0b0e13;
          color:#fff;
          padding:9px 11px;
          font-size:16px;
          outline:none;
        }
        .gymcels-account-row input:focus{border-color:#ef4355}
        .gymcels-account-action{
          min-height:40px;
          border:0;
          border-radius:8px;
          background:#ef4355;
          color:#fff;
          padding:0 13px;
          font:inherit;
          font-size:10px;
          font-weight:900;
          cursor:pointer;
          white-space:nowrap;
        }
        .gymcels-account-action:disabled{opacity:.55;cursor:wait}
        .gymcels-account-message{
          min-height:16px;
          margin-top:8px;
          color:#8f99a6;
          font-size:10px;
          line-height:1.4;
        }
        .gymcels-account-message.success{color:#67e8a5}
        .gymcels-account-message.error{color:#ff7b88}
        .gymcels-account-switch-row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          padding:4px 0 2px;
        }
        .gymcels-account-switch-copy{
          min-width:0;
          color:#d7dce3;
          font-size:11px;
          font-weight:800;
        }
        .gymcels-account-switch{
          position:relative;
          width:44px;
          height:24px;
          flex:0 0 auto;
        }
        .gymcels-account-switch input{
          position:absolute;
          opacity:0;
          width:1px;
          height:1px;
          pointer-events:none;
        }
        .gymcels-account-switch-track{
          position:absolute;
          inset:0;
          border-radius:999px;
          background:#303640;
          border:1px solid #414955;
          cursor:pointer;
          transition:.18s ease;
        }
        .gymcels-account-switch-track::after{
          content:'';
          position:absolute;
          width:18px;
          height:18px;
          left:2px;
          top:2px;
          border-radius:50%;
          background:#cfd5dc;
          transition:.18s ease;
        }
        .gymcels-account-switch input:checked + .gymcels-account-switch-track{
          background:#ef4355;
          border-color:#ef4355;
        }
        .gymcels-account-switch input:checked + .gymcels-account-switch-track::after{
          transform:translateX(20px);
          background:#fff;
        }
        @media (max-width:620px){
          .gymcels-account-settings-head{padding:12px}
          .gymcels-account-settings-body{padding:12px}
          .gymcels-account-row{align-items:stretch;flex-direction:column}
          .gymcels-account-action{width:100%}
        }
      `;
      document.head.appendChild(style);
    }

    if (document.getElementById('gymcelsAccountSettings')) return;

    const section = document.createElement('section');
    section.id = 'gymcelsAccountSettings';
    section.className = 'gymcels-account-settings';
    section.innerHTML = `
      <div class="gymcels-account-settings-head">
        <div>
          <div class="gymcels-account-settings-title">Account Settings</div>
          <div class="gymcels-account-settings-sub">Manage your login email and password.</div>
        </div>
        <button id="gymcelsAccountSettingsToggle" class="gymcels-account-settings-toggle" type="button"
          aria-expanded="false">Open settings</button>
      </div>

      <div id="gymcelsAccountSettingsBody" class="gymcels-account-settings-body hidden">
        <div class="gymcels-account-current">
          Signed in as <strong id="gymcelsAccountCurrentEmail">—</strong>
        </div>

        <div class="gymcels-account-setting">
          <h4>DM read receipts</h4>
          <p>When this is on, friends can see “Seen” after you open their DMs. Turn it off if you do not want to send read receipts.</p>
          <div class="gymcels-account-switch-row">
            <div class="gymcels-account-switch-copy">Send read receipts</div>
            <label class="gymcels-account-switch" aria-label="Send DM read receipts">
              <input id="gymcelsDmReadReceiptsToggle" type="checkbox" checked>
              <span class="gymcels-account-switch-track"></span>
            </label>
          </div>
          <div id="gymcelsDmReadReceiptsMsg" class="gymcels-account-message" role="status"></div>
        </div>

        <div class="gymcels-account-setting">
          <h4>Change email</h4>
          <p>We’ll send confirmation email(s) before your login email changes.</p>
          <div class="gymcels-account-row">
            <input id="gymcelsNewEmail" type="email" autocomplete="email" placeholder="New email address">
            <button id="gymcelsChangeEmailBtn" class="gymcels-account-action" type="button">Change email</button>
          </div>
          <div id="gymcelsChangeEmailMsg" class="gymcels-account-message" role="status"></div>
        </div>

        <div class="gymcels-account-setting">
          <h4>Change password</h4>
          <p>Choose a new password with at least 6 characters.</p>
          <div class="gymcels-account-row">
            <input id="gymcelsNewPassword" type="password" autocomplete="new-password" minlength="6" placeholder="New password">
            <input id="gymcelsConfirmPassword" type="password" autocomplete="new-password" minlength="6" placeholder="Confirm new password">
          </div>
          <div class="gymcels-account-row">
            <button id="gymcelsChangePasswordBtn" class="gymcels-account-action" type="button">Change password</button>
          </div>
          <div id="gymcelsChangePasswordMsg" class="gymcels-account-message" role="status"></div>
        </div>
      </div>
    `;

    profile.insertAdjacentElement('afterend', section);

    const toggle = document.getElementById('gymcelsAccountSettingsToggle');
    const body = document.getElementById('gymcelsAccountSettingsBody');
    const currentEmail = document.getElementById('gymcelsAccountCurrentEmail');

    const readReceiptsToggle = document.getElementById('gymcelsDmReadReceiptsToggle');
    const readReceiptsMsg = document.getElementById('gymcelsDmReadReceiptsMsg');

    const newEmail = document.getElementById('gymcelsNewEmail');
    const changeEmailBtn = document.getElementById('gymcelsChangeEmailBtn');
    const emailMsg = document.getElementById('gymcelsChangeEmailMsg');

    const newPassword = document.getElementById('gymcelsNewPassword');
    const confirmPassword = document.getElementById('gymcelsConfirmPassword');
    const changePasswordBtn = document.getElementById('gymcelsChangePasswordBtn');
    const passwordMsg = document.getElementById('gymcelsChangePasswordMsg');

    const setSettingsMessage = (el, text, type='') => {
      if (!el) return;
      el.textContent = text || '';
      el.className = 'gymcels-account-message' + (type ? ` ${type}` : '');
    };

    async function loadDmReadReceiptPreference(){
      try{
        const { data: { session } } = await db.auth.getSession();
        if(!session?.user) return true;

        const {data,error} = await db
          .from('dm_user_settings')
          .select('read_receipts_enabled')
          .eq('user_id',session.user.id)
          .maybeSingle();

        if(error) throw error;

        const enabled = data?.read_receipts_enabled !== false;
        window.gymcelsDmReadReceiptsEnabled = enabled;

        if(readReceiptsToggle) readReceiptsToggle.checked = enabled;
        return enabled;
      }catch(error){
        console.warn('Could not load DM read receipt preference:',error);
        window.gymcelsDmReadReceiptsEnabled = true;
        if(readReceiptsToggle) readReceiptsToggle.checked = true;
        return true;
      }
    }

    window.gymcelsLoadDmReadReceiptPreference = loadDmReadReceiptPreference;

    readReceiptsToggle?.addEventListener('change', async () => {
      const enabled = !!readReceiptsToggle.checked;
      readReceiptsToggle.disabled = true;
      setSettingsMessage(readReceiptsMsg, 'Saving…');

      try{
        const { data: { session } } = await db.auth.getSession();
        if(!session?.user) throw new Error('Log in again first.');

        const {error} = await db
          .from('dm_user_settings')
          .upsert({
            user_id:session.user.id,
            read_receipts_enabled:enabled,
            updated_at:new Date().toISOString()
          },{onConflict:'user_id'});

        if(error) throw error;

        window.gymcelsDmReadReceiptsEnabled = enabled;
        setSettingsMessage(
          readReceiptsMsg,
          enabled ? 'Read receipts are on.' : 'Read receipts are off.',
          'success'
        );

        setTimeout(() => {
          if(readReceiptsMsg?.textContent === 'Read receipts are on.' ||
             readReceiptsMsg?.textContent === 'Read receipts are off.'){
            setSettingsMessage(readReceiptsMsg,'');
          }
        },1600);
      }catch(error){
        readReceiptsToggle.checked = !enabled;
        window.gymcelsDmReadReceiptsEnabled = !enabled;
        setSettingsMessage(
          readReceiptsMsg,
          error?.message || 'Could not save that setting.',
          'error'
        );
      }finally{
        readReceiptsToggle.disabled = false;
      }
    });

    toggle?.addEventListener('click', () => {
      const opening = body.classList.contains('hidden');
      body.classList.toggle('hidden', !opening);
      toggle.textContent = opening ? 'Close settings' : 'Open settings';
      toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });

    changeEmailBtn?.addEventListener('click', async () => {
      const email = (newEmail?.value || '').trim();
      setSettingsMessage(emailMsg, '');

      if (!email || !newEmail.checkValidity()) {
        setSettingsMessage(emailMsg, 'Enter a valid new email address.', 'error');
        newEmail?.focus();
        return;
      }

      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) {
        setSettingsMessage(emailMsg, 'Log in again first.', 'error');
        return;
      }

      if (email.toLowerCase() === String(session.user.email || '').toLowerCase()) {
        setSettingsMessage(emailMsg, 'That is already your current email.', 'error');
        return;
      }

      changeEmailBtn.disabled = true;
      changeEmailBtn.textContent = 'Sending…';

      try {
        const { error } = await db.auth.updateUser(
          { email },
          { emailRedirectTo: 'https://gymcels.lol/#members' }
        );

        if (error) throw error;

        newEmail.value = '';
        setSettingsMessage(
          emailMsg,
          'Confirmation sent. Check your email inbox (and spam/junk). Your login email changes after the required confirmation is completed.',
          'success'
        );
      } catch (error) {
        setSettingsMessage(
          emailMsg,
          error?.message || 'Could not start the email change. Try again.',
          'error'
        );
      } finally {
        changeEmailBtn.disabled = false;
        changeEmailBtn.textContent = 'Change email';
      }
    });

    changePasswordBtn?.addEventListener('click', async () => {
      const password = newPassword?.value || '';
      const confirm = confirmPassword?.value || '';
      setSettingsMessage(passwordMsg, '');

      if (password.length < 6) {
        setSettingsMessage(passwordMsg, 'Use at least 6 characters.', 'error');
        newPassword?.focus();
        return;
      }

      if (password !== confirm) {
        setSettingsMessage(passwordMsg, 'Those passwords do not match.', 'error');
        confirmPassword?.focus();
        return;
      }

      const { data: { session } } = await db.auth.getSession();
      if (!session?.user) {
        setSettingsMessage(passwordMsg, 'Log in again first.', 'error');
        return;
      }

      changePasswordBtn.disabled = true;
      changePasswordBtn.textContent = 'Saving…';

      try {
        const { error } = await db.auth.updateUser({ password });
        if (error) throw error;

        newPassword.value = '';
        confirmPassword.value = '';
        setSettingsMessage(passwordMsg, 'Password changed successfully.', 'success');
      } catch (error) {
        setSettingsMessage(
          passwordMsg,
          error?.message || 'Could not change your password. Try logging in again.',
          'error'
        );
      } finally {
        changePasswordBtn.disabled = false;
        changePasswordBtn.textContent = 'Change password';
      }
    });

    const submitOnEnter = (event, button) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        button?.click();
      }
    };

    newEmail?.addEventListener('keydown', event => submitOnEnter(event, changeEmailBtn));
    newPassword?.addEventListener('keydown', event => submitOnEnter(event, changePasswordBtn));
    confirmPassword?.addEventListener('keydown', event => submitOnEnter(event, changePasswordBtn));

    // Set the current email if a session already exists.
    db.auth.getSession().then(({ data: { session } }) => {
      if (currentEmail && session?.user) currentEmail.textContent = session.user.email || '—';
      if (session?.user) loadDmReadReceiptPreference();
    });
  }

  function refreshAccountSettingsUi(session) {
    installAccountSettingsUi();
    const currentEmail = document.getElementById('gymcelsAccountCurrentEmail');
    if (currentEmail) currentEmail.textContent = session?.user?.email || '—';

    if(session?.user && typeof window.gymcelsLoadDmReadReceiptPreference === 'function'){
      window.gymcelsLoadDmReadReceiptPreference();
    }
  }

  installAccountSettingsUi();

  $('loginBtn').addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    const password = $('loginPassword').value;
    msg($('loginMsg'),'');
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) return msg($('loginMsg'), error.message, 'error');
    msg($('loginMsg'),'Logged in.','success');
    await refreshSession();
  });

  async function logout() { await db.auth.signOut(); await refreshSession(); }
  $('logoutBtn').addEventListener('click', logout);
  navLogout.addEventListener('click', logout);

  function normalizeExercise(name) { return (name || '').trim().toLowerCase(); }

  let workoutLogCache = [];
  let workoutPrRowsById = new Set();
  let workoutHistoryQuery = '';
  let workoutPrQuery = '';

  function installWorkoutRecordsUi(){
    const grid = logList?.closest('.dashboard-grid');
    const formCard = $('exerciseInput')?.closest('.member-card');
    const historyCard = logList?.closest('.member-card');

    if(!grid || !formCard || !historyCard) return;
    if(document.getElementById('workoutTracker')) return;

    if(!document.getElementById('gymcelsWorkoutRecordsStyles')){
      const style = document.createElement('style');
      style.id = 'gymcelsWorkoutRecordsStyles';
      style.textContent = `
        #workoutTracker{
          margin:26px 0 12px;
          padding:18px 20px;
          border:1px solid #292e37;
          border-radius:16px;
          background:
            radial-gradient(circle at top right,rgba(239,67,85,.13),transparent 36%),
            #0e1116;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:18px;
        }
        .workout-hub-kicker{
          color:#ef6574;
          font-size:10px;
          font-weight:950;
          letter-spacing:.13em;
          text-transform:uppercase;
        }
        .workout-hub-title{
          margin:4px 0 4px;
          color:#fff;
          font-size:25px;
          line-height:1.05;
          font-weight:950;
        }
        .workout-hub-sub{
          color:#969fab;
          font-size:12px;
          line-height:1.45;
          max-width:560px;
        }
        .workout-hub-stats{
          display:grid;
          grid-template-columns:repeat(3,minmax(78px,1fr));
          gap:8px;
          flex:0 0 auto;
        }
        .workout-hub-stat{
          min-width:78px;
          padding:10px 11px;
          border:1px solid #2d333c;
          border-radius:11px;
          background:#0a0d11;
          text-align:center;
        }
        .workout-hub-stat b{
          display:block;
          color:#fff;
          font-size:20px;
          line-height:1;
        }
        .workout-hub-stat span{
          display:block;
          margin-top:5px;
          color:#7f8996;
          font-size:8px;
          font-weight:900;
          letter-spacing:.08em;
          text-transform:uppercase;
        }

        .workout-dashboard-grid{
          align-items:start;
        }
        .workout-log-card,
        .workout-pr-card,
        .workout-history-card{
          border-color:#292e37;
          box-shadow:0 12px 28px rgba(0,0,0,.12);
        }
        .workout-log-card h3,
        .workout-pr-card h3,
        .workout-history-card h3{
          margin-bottom:4px;
        }
        .workout-card-sub{
          margin:0 0 15px;
          color:#8f98a5;
          font-size:11px;
          line-height:1.45;
        }
        .workout-history-card{
          grid-column:1 / -1;
        }

        .workout-pr-top{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:10px;
          margin-bottom:12px;
        }
        .workout-pr-count{
          flex:0 0 auto;
          border:1px solid rgba(239,67,85,.34);
          border-radius:999px;
          background:rgba(239,67,85,.09);
          color:#ff8b97;
          padding:5px 8px;
          font-size:9px;
          font-weight:900;
        }
        .workout-pr-search,
        .workout-history-search{
          width:100%;
          box-sizing:border-box;
          min-height:40px;
          border:1px solid #2e353f;
          border-radius:9px;
          background:#0a0d11;
          color:#fff;
          padding:9px 11px;
          outline:none;
          font:inherit;
          font-size:13px;
        }
        .workout-pr-search:focus,
        .workout-history-search:focus{
          border-color:#ef4355;
        }
        .workout-pr-note{
          margin:7px 1px 10px;
          color:#747e8b;
          font-size:9px;
          line-height:1.4;
        }
        .workout-pr-list{
          display:flex;
          flex-direction:column;
          gap:8px;
          max-height:440px;
          overflow:auto;
          padding-right:3px;
        }
        .workout-pr-row{
          padding:11px 12px;
          border:1px solid #272d35;
          border-radius:11px;
          background:#0b0e13;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
        }
        .workout-pr-main{
          min-width:0;
        }
        .workout-pr-exercise{
          display:flex;
          align-items:center;
          gap:6px;
          min-width:0;
          color:#f4f6f8;
          font-size:12px;
          font-weight:900;
        }
        .workout-pr-exercise span:first-child{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .workout-pr-trophy{
          flex:0 0 auto;
          font-size:12px;
        }
        .workout-pr-meta{
          margin-top:4px;
          color:#747f8c;
          font-size:9px;
        }
        .workout-pr-performance{
          flex:0 0 auto;
          text-align:right;
          color:#fff;
          font-size:13px;
          font-weight:950;
          white-space:nowrap;
        }

        .workout-history-head{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:14px;
          margin-bottom:13px;
        }
        .workout-history-head-copy{
          min-width:0;
        }
        .workout-history-tools{
          width:min(310px,100%);
          flex:0 0 auto;
        }
        .workout-history-count{
          margin-top:5px;
          color:#798391;
          font-size:9px;
          text-align:right;
        }
        .workout-log-date-group{
          margin:10px 2px 4px;
          color:#6f7986;
          font-size:9px;
          font-weight:950;
          letter-spacing:.1em;
          text-transform:uppercase;
        }
        .log-row.workout-pr-log{
          border-color:rgba(239,67,85,.34);
          background:
            linear-gradient(90deg,rgba(239,67,85,.06),transparent 34%),
            #0e1014;
        }
        .workout-log-title-line{
          display:flex;
          align-items:center;
          gap:7px;
          min-width:0;
        }
        .workout-log-title-line strong{
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .workout-log-pr-badge{
          flex:0 0 auto;
          border-radius:999px;
          background:#ef4355;
          color:#fff;
          padding:3px 6px;
          font-size:8px;
          font-weight:950;
          letter-spacing:.04em;
        }
        .workout-log-notes{
          margin-top:4px;
          color:#7e8793;
          font-size:10px;
          line-height:1.35;
        }
        .workout-history-card .log-list{
          max-height:560px;
          overflow:auto;
          padding-right:3px;
        }
        .workout-empty{
          padding:18px 4px;
          color:#7d8794;
          font-size:12px;
        }
        .workout-new-pr-flash{
          animation:gymcelsPrPulse .7s ease;
        }
        @keyframes gymcelsPrPulse{
          0%{box-shadow:0 0 0 0 rgba(239,67,85,.5)}
          100%{box-shadow:0 0 0 18px rgba(239,67,85,0)}
        }

        @media(max-width:800px){
          #workoutTracker{
            padding:15px;
            align-items:stretch;
            flex-direction:column;
          }
          .workout-hub-title{font-size:22px}
          .workout-hub-stats{
            width:100%;
            grid-template-columns:repeat(3,1fr);
          }
          .workout-hub-stat{min-width:0}
          .workout-history-card{grid-column:auto}
          .workout-history-head{
            align-items:stretch;
            flex-direction:column;
          }
          .workout-history-tools{width:100%}
          .workout-history-count{text-align:left}
          .workout-pr-list{max-height:360px}
          .workout-history-card .log-list{max-height:none}
          .log-row{
            grid-template-columns:1fr;
            align-items:start;
          }
          .log-actions{
            width:100%;
          }
          .log-actions .mini-btn{
            flex:1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const hub = document.createElement('section');
    hub.id = 'workoutTracker';
    hub.innerHTML = `
      <div>
        <div class="workout-hub-kicker">Private lift tracker</div>
        <div class="workout-hub-title">Log Lifts & Personal Records</div>
        <div class="workout-hub-sub">Log working sets, beat your last performance, and keep your best sets organized automatically.</div>
      </div>
      <div class="workout-hub-stats">
        <div class="workout-hub-stat"><b id="workoutHubPrCount">0</b><span>PRs</span></div>
        <div class="workout-hub-stat"><b id="workoutHubExerciseCount">0</b><span>Exercises</span></div>
        <div class="workout-hub-stat"><b id="workoutHubSetCount">0</b><span>Sets</span></div>
      </div>
    `;
    grid.insertAdjacentElement('beforebegin',hub);

    grid.classList.add('workout-dashboard-grid');
    formCard.classList.add('workout-log-card');
    historyCard.classList.add('workout-history-card');

    const formTitle = $('formTitle');
    if(formTitle && formTitle.textContent.trim() === 'Log a set'){
      formTitle.textContent = 'Log a lift';
    }

    if(!formCard.querySelector('.workout-card-sub')){
      const sub = document.createElement('p');
      sub.className = 'workout-card-sub';
      sub.textContent = 'Track each working set. Your last performance and PRs update automatically.';
      formTitle?.insertAdjacentElement('afterend',sub);
    }

    const prCard = document.createElement('div');
    prCard.className = 'member-card workout-pr-card';
    prCard.innerHTML = `
      <div class="workout-pr-top">
        <div>
          <h3>Personal Records 🏆</h3>
          <p class="workout-card-sub">Your best logged set for every exercise.</p>
        </div>
        <span id="workoutPrCount" class="workout-pr-count">0 PRs</span>
      </div>
      <input id="workoutPrSearch" class="workout-pr-search" type="search"
             maxlength="80" autocomplete="off" placeholder="Search your PRs...">
      <div class="workout-pr-note">Weighted PRs compare weight + reps together. Rep-only lifts use your highest reps.</div>
      <div id="workoutPrList" class="workout-pr-list">
        <div class="workout-empty">Log a lift to start building your PR board.</div>
      </div>
    `;
    grid.insertBefore(prCard,historyCard);

    const oldHistoryTitle = historyCard.querySelector('h3');
    if(oldHistoryTitle) oldHistoryTitle.remove();

    const historyHead = document.createElement('div');
    historyHead.className = 'workout-history-head';
    historyHead.innerHTML = `
      <div class="workout-history-head-copy">
        <h3>Recent Sets</h3>
        <p class="workout-card-sub">Your full lift history. Current PR sets are marked automatically.</p>
      </div>
      <div class="workout-history-tools">
        <input id="workoutHistorySearch" class="workout-history-search" type="search"
               maxlength="80" autocomplete="off" placeholder="Search exercise or notes...">
        <div id="workoutHistoryCount" class="workout-history-count">0 sets</div>
      </div>
    `;
    historyCard.insertBefore(historyHead,logList);

    $('workoutPrSearch')?.addEventListener('input',(event)=>{
      workoutPrQuery = String(event.target.value || '').trim().toLowerCase();
      renderPersonalRecords(workoutLogCache);
    });

    $('workoutHistorySearch')?.addEventListener('input',(event)=>{
      workoutHistoryQuery = String(event.target.value || '').trim().toLowerCase();
      renderWorkoutHistory(workoutLogCache);
    });
  }

  function workoutSetScore(row){
    const weight = Number(row?.weight);
    const reps = Number(row?.reps);

    if(Number.isFinite(weight) && weight > 0){
      if(Number.isFinite(reps) && reps > 0){
        // Epley-style comparison is used only internally to rank logged sets.
        return weight * (1 + reps / 30);
      }
      return weight;
    }

    if(Number.isFinite(reps) && reps > 0){
      return reps;
    }

    return 0;
  }

  function workoutSetRecency(row){
    const date = String(row?.workout_date || '');
    const created = String(row?.created_at || '');
    const stamp = Date.parse(created || (date ? `${date}T12:00:00` : ''));
    return Number.isFinite(stamp) ? stamp : 0;
  }

  function isBetterWorkoutSet(candidate,current){
    if(!current) return true;

    const candidateScore = workoutSetScore(candidate);
    const currentScore = workoutSetScore(current);

    if(candidateScore !== currentScore) return candidateScore > currentScore;

    const candidateWeight = Number(candidate?.weight) || 0;
    const currentWeight = Number(current?.weight) || 0;
    if(candidateWeight !== currentWeight) return candidateWeight > currentWeight;

    const candidateReps = Number(candidate?.reps) || 0;
    const currentReps = Number(current?.reps) || 0;
    if(candidateReps !== currentReps) return candidateReps > currentReps;

    return workoutSetRecency(candidate) > workoutSetRecency(current);
  }

  function getWorkoutPersonalRecords(rows){
    const byExercise = new Map();

    for(const row of rows || []){
      const key = normalizeExercise(row.exercise);
      if(!key) continue;

      const current = byExercise.get(key);
      if(!current || isBetterWorkoutSet(row,current)){
        byExercise.set(key,row);
      }
    }

    return [...byExercise.values()].sort((a,b)=>{
      const recentDiff = workoutSetRecency(b) - workoutSetRecency(a);
      if(recentDiff) return recentDiff;
      return String(a.exercise || '').localeCompare(String(b.exercise || ''));
    });
  }

  function workoutPerformanceText(row){
    const weight = row?.weight != null && row.weight !== '' ? `${Number(row.weight)} lb` : '';
    const reps = row?.reps != null && row.reps !== '' ? `${Number(row.reps)} reps` : '';

    if(weight && reps) return `${weight} × ${Number(row.reps)}`;
    return weight || reps || 'Logged set';
  }

  function workoutDateText(value){
    if(!value) return 'No date';

    try{
      const d = new Date(`${value}T12:00:00`);
      if(Number.isNaN(d.getTime())) return value;

      return d.toLocaleDateString([],{
        month:'short',
        day:'numeric',
        year:d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    }catch(_){
      return value;
    }
  }

  function renderPersonalRecords(rows){
    const prList = $('workoutPrList');
    const prCount = $('workoutPrCount');
    const hubPrCount = $('workoutHubPrCount');
    const hubExerciseCount = $('workoutHubExerciseCount');
    const hubSetCount = $('workoutHubSetCount');

    const records = getWorkoutPersonalRecords(rows);
    workoutPrRowsById = new Set(
      records
        .map(row => row?.id != null ? String(row.id) : '')
        .filter(Boolean)
    );

    if(prCount) prCount.textContent = `${records.length} PR${records.length === 1 ? '' : 's'}`;
    if(hubPrCount) hubPrCount.textContent = String(records.length);
    if(hubExerciseCount) hubExerciseCount.textContent = String(records.length);
    if(hubSetCount) hubSetCount.textContent = String((rows || []).length);

    if(!prList) return;

    const filtered = workoutPrQuery
      ? records.filter(row =>
          String(row.exercise || '').toLowerCase().includes(workoutPrQuery)
        )
      : records;

    if(!filtered.length){
      prList.innerHTML = `<div class="workout-empty">${
        records.length ? 'No PRs match that search.' : 'Log a lift to start building your PR board.'
      }</div>`;
      return;
    }

    prList.innerHTML = '';

    for(const row of filtered){
      const item = document.createElement('div');
      item.className = 'workout-pr-row';

      const main = document.createElement('div');
      main.className = 'workout-pr-main';

      const exercise = document.createElement('div');
      exercise.className = 'workout-pr-exercise';

      const exerciseName = document.createElement('span');
      exerciseName.textContent = row.exercise || 'Exercise';

      const trophy = document.createElement('span');
      trophy.className = 'workout-pr-trophy';
      trophy.textContent = '🏆';

      exercise.append(exerciseName,trophy);

      const meta = document.createElement('div');
      meta.className = 'workout-pr-meta';
      meta.textContent = `${workoutDateText(row.workout_date)}${row.set_number != null ? ` · Set ${row.set_number}` : ''}`;

      main.append(exercise,meta);

      const performance = document.createElement('div');
      performance.className = 'workout-pr-performance';
      performance.textContent = workoutPerformanceText(row);

      item.append(main,performance);
      prList.appendChild(item);
    }
  }

  function renderWorkoutHistory(rows){
    if(!logList) return;

    const query = workoutHistoryQuery;
    const filtered = query
      ? (rows || []).filter(row =>
          String(row.exercise || '').toLowerCase().includes(query) ||
          String(row.notes || '').toLowerCase().includes(query)
        )
      : (rows || []);

    const count = $('workoutHistoryCount');
    if(count){
      count.textContent = `${filtered.length} set${filtered.length === 1 ? '' : 's'}${query ? ` shown · ${(rows || []).length} total` : ''}`;
    }

    logList.innerHTML = '';

    if(!filtered.length){
      logList.innerHTML = `<div class="workout-empty">${
        (rows || []).length ? 'No sets match that search.' : 'No workout logs yet.'
      }</div>`;
      return;
    }

    let lastDate = '';

    for(const row of filtered){
      const dateKey = String(row.workout_date || 'No date');

      if(dateKey !== lastDate){
        lastDate = dateKey;
        const divider = document.createElement('div');
        divider.className = 'workout-log-date-group';
        divider.textContent = workoutDateText(row.workout_date);
        logList.appendChild(divider);
      }

      const item = document.createElement('div');
      const isPr = row.id != null && workoutPrRowsById.has(String(row.id));
      item.className = `log-row${isPr ? ' workout-pr-log' : ''}`;

      const main = document.createElement('div');
      main.className = 'log-main';

      const titleLine = document.createElement('div');
      titleLine.className = 'workout-log-title-line';

      const title = document.createElement('strong');
      title.textContent = row.exercise || 'Workout';
      titleLine.appendChild(title);

      if(isPr){
        const badge = document.createElement('span');
        badge.className = 'workout-log-pr-badge';
        badge.textContent = 'PR';
        titleLine.appendChild(badge);
      }

      const meta = document.createElement('div');
      meta.className = 'log-meta';

      const parts = [
        row.set_number != null ? `Set ${row.set_number}` : '',
        row.weight != null ? `${row.weight} lb` : '',
        row.reps != null ? `${row.reps} reps` : ''
      ].filter(Boolean);

      meta.textContent = parts.join(' · ') || 'Logged set';

      main.append(titleLine,meta);

      if(row.notes){
        const notes = document.createElement('div');
        notes.className = 'workout-log-notes';
        notes.textContent = row.notes;
        main.appendChild(notes);
      }

      const actions = document.createElement('div');
      actions.className = 'log-actions';

      const edit = document.createElement('button');
      edit.className = 'mini-btn';
      edit.textContent = 'Edit';
      edit.addEventListener('click',()=>{
        $('editId').value = row.id;
        $('exerciseInput').value = row.exercise || '';
        $('weightInput').value = row.weight ?? '';
        $('repsInput').value = row.reps ?? '';
        $('setInput').value = row.set_number ?? '';
        $('dateInput').value = row.workout_date || today();
        $('notesInput').value = row.notes || '';

        $('formTitle').textContent = 'Edit lift';
        $('saveLogBtn').textContent = 'Update log →';
        $('cancelEditBtn').classList.remove('hidden');

        updateBeatLast();
        document.querySelector('.workout-log-card')?.scrollIntoView({
          behavior:'smooth',
          block:'start'
        });
      });

      const del = document.createElement('button');
      del.className = 'mini-btn danger';
      del.textContent = 'Delete';
      del.addEventListener('click',async()=>{
        if(!confirm('Delete this workout log?')) return;

        const {error} = await db
          .from('workout_logs')
          .delete()
          .eq('id',row.id);

        if(error){
          return msg($('logMsg'),error.message,'error');
        }

        await loadLogs();
        window.dispatchEvent(new Event('gymcelsWorkoutChanged'));
      });

      actions.append(edit,del);
      item.append(main,actions);
      logList.appendChild(item);
    }
  }

  installWorkoutRecordsUi();

  async function updateBeatLast() {
    const exercise = $('exerciseInput').value.trim();
    if (!exercise) {
      beatLast.querySelector('.beat-last-main').textContent='Enter an exercise to see your last performance.';
      beatLast.querySelector('.beat-last-sub').textContent='Your previous set will appear here automatically.';
      return;
    }
    const { data, error } = await db.from('workout_logs').select('*').order('workout_date',{ascending:false}).order('created_at',{ascending:false});
    if (error) return;
    const editId = $('editId').value;
    const previous = (data || []).find(r => String(r.id) !== String(editId) && normalizeExercise(r.exercise) === normalizeExercise(exercise));
    if (!previous) {
      beatLast.querySelector('.beat-last-main').textContent='No previous set yet — set the standard.';
      beatLast.querySelector('.beat-last-sub').textContent='Save this set and Gymcels.lol will give you a target next time.';
      return;
    }
    const performance=[previous.weight != null ? `${previous.weight} lb` : '', previous.reps != null ? `${previous.reps} reps` : ''].filter(Boolean).join(' × ');
    beatLast.querySelector('.beat-last-main').textContent=`Last: ${performance || 'logged set'}`;
    let target='Beat it with more weight or more reps while keeping good form.';
    if (previous.reps != null && previous.weight != null) {
      target = previous.reps >= 12 ? `Target: increase the weight and stay in the 8–12 rep range.` : `Target: ${previous.weight} lb × ${previous.reps + 1} reps or better.`;
    } else if (previous.reps != null) target=`Target: ${previous.reps + 1} reps or better.`;
    beatLast.querySelector('.beat-last-sub').textContent=`${previous.workout_date || 'Previous workout'} · ${target}`;
  }

  let beatTimer;
  $('exerciseInput').addEventListener('input',()=>{ clearTimeout(beatTimer); beatTimer=setTimeout(updateBeatLast,250); });
  $('exerciseInput').addEventListener('change',updateBeatLast);

  function clearForm() {
    $('editId').value=''; $('exerciseInput').value=''; $('weightInput').value=''; $('repsInput').value=''; $('setInput').value=''; $('dateInput').value=today(); $('notesInput').value='';
    $('formTitle').textContent='Log a lift'; $('saveLogBtn').textContent='Save log →'; $('cancelEditBtn').classList.add('hidden'); msg($('logMsg'),'');
    updateBeatLast();
  }
  $('cancelEditBtn').addEventListener('click', clearForm);

  $('saveLogBtn').addEventListener('click', async () => {
    msg($('logMsg'),'');
    const { data: { user } } = await db.auth.getUser();
    if (!user) return msg($('logMsg'),'Please log in first.','error');
    const exercise = $('exerciseInput').value.trim();
    const workout_date = $('dateInput').value || today();
    if (!exercise) return msg($('logMsg'),'Enter an exercise name.','error');
    const payload = {
      user_id: user.id, exercise,
      weight: $('weightInput').value === '' ? null : Number($('weightInput').value),
      reps: $('repsInput').value === '' ? null : Number($('repsInput').value),
      set_number: $('setInput').value === '' ? null : Number($('setInput').value),
      workout_date, notes: $('notesInput').value.trim() || null
    };
    const editId = $('editId').value;

    const sameExerciseBefore = workoutLogCache.filter(row =>
      normalizeExercise(row.exercise) === normalizeExercise(exercise) &&
      String(row.id) !== String(editId)
    );

    const priorBest = getWorkoutPersonalRecords(sameExerciseBefore)[0] || null;
    const isNewPr = !!priorBest && isBetterWorkoutSet(payload,priorBest);
    const isFirstRecord = !priorBest;

    let error;
    if (editId) ({ error } = await db.from('workout_logs').update(payload).eq('id', editId));
    else ({ error } = await db.from('workout_logs').insert(payload));

    if (error) return msg($('logMsg'), error.message, 'error');

    if(isNewPr){
      msg($('logMsg'), `🏆 NEW PR — ${workoutPerformanceText(payload)} on ${exercise}!`, 'success');
    }else if(isFirstRecord && !editId){
      msg($('logMsg'), `First ${exercise} record saved.`, 'success');
    }else{
      msg($('logMsg'), editId ? 'Lift updated.' : 'Lift saved.', 'success');
    }

    await loadLogs();

    if(isNewPr){
      const prCard = document.querySelector('.workout-pr-card');
      prCard?.classList.remove('workout-new-pr-flash');
      void prCard?.offsetWidth;
      prCard?.classList.add('workout-new-pr-flash');
    }

    window.dispatchEvent(new Event('gymcelsWorkoutChanged'));
    setTimeout(clearForm, isNewPr ? 1300 : 700);
  });

  async function loadLogs() {
    const { data, error } = await db
      .from('workout_logs')
      .select('*')
      .order('workout_date',{ascending:false})
      .order('created_at',{ascending:false});

    if(error){
      workoutLogCache = [];
      workoutPrRowsById = new Set();

      if(logList){
        logList.innerHTML = '<div class="workout-empty"></div>';
        logList.firstChild.textContent = error.message;
      }

      renderPersonalRecords([]);
      return;
    }

    workoutLogCache = data || [];
    renderPersonalRecords(workoutLogCache);
    renderWorkoutHistory(workoutLogCache);
  }

  db.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      setTimeout(showPasswordRecoveryPanel, 0);
    }
    refreshSession();
  });

  refreshSession();
  handleVerificationCallback();

  if (recoveryRequestedFromUrl) {
    setTimeout(async () => {
      const { data: { session } } = await db.auth.getSession();
      if (session?.user) showPasswordRecoveryPanel();
    }, 450);
  }
})();



// ---- Gymcels Nutrition: private per-account macro tracker ----
const nutritionDb = window.gymcelsLolDb;
const nutritionSection = document.getElementById('nutritionSection');
const nutritionDate = document.getElementById('nutritionDate');
const nutritionDateLabel = document.getElementById('nutritionDateLabel');
const nutritionMealsDateLabel = document.getElementById('nutritionMealsDateLabel');
const nutritionPrevDay = document.getElementById('nutritionPrevDay');
const nutritionNextDay = document.getElementById('nutritionNextDay');
const nutritionTodayBtn = document.getElementById('nutritionTodayBtn');

const nutritionEditTargetsBtn = document.getElementById('nutritionEditTargetsBtn');
const nutritionTargetsForm = document.getElementById('nutritionTargetsForm');
const nutritionTargetCalories = document.getElementById('nutritionTargetCalories');
const nutritionTargetProtein = document.getElementById('nutritionTargetProtein');
const nutritionTargetCarbs = document.getElementById('nutritionTargetCarbs');
const nutritionTargetFat = document.getElementById('nutritionTargetFat');
const nutritionSaveTargetsBtn = document.getElementById('nutritionSaveTargetsBtn');
const nutritionCancelTargetsBtn = document.getElementById('nutritionCancelTargetsBtn');

const nutritionCaloriesTotal = document.getElementById('nutritionCaloriesTotal');
const nutritionProteinTotal = document.getElementById('nutritionProteinTotal');
const nutritionCarbsTotal = document.getElementById('nutritionCarbsTotal');
const nutritionFatTotal = document.getElementById('nutritionFatTotal');

const nutritionCaloriesTarget = document.getElementById('nutritionCaloriesTarget');
const nutritionProteinTarget = document.getElementById('nutritionProteinTarget');
const nutritionCarbsTarget = document.getElementById('nutritionCarbsTarget');
const nutritionFatTarget = document.getElementById('nutritionFatTarget');

const nutritionCaloriesProgress = document.getElementById('nutritionCaloriesProgress');
const nutritionProteinProgress = document.getElementById('nutritionProteinProgress');
const nutritionCarbsProgress = document.getElementById('nutritionCarbsProgress');
const nutritionFatProgress = document.getElementById('nutritionFatProgress');

const nutritionCaloriesRemaining = document.getElementById('nutritionCaloriesRemaining');
const nutritionProteinRemaining = document.getElementById('nutritionProteinRemaining');
const nutritionCarbsRemaining = document.getElementById('nutritionCarbsRemaining');
const nutritionFatRemaining = document.getElementById('nutritionFatRemaining');

const nutritionMealFormTitle = document.getElementById('nutritionMealFormTitle');
const nutritionFoodName = document.getElementById('nutritionFoodName');
const nutritionMealType = document.getElementById('nutritionMealType');
const nutritionCalories = document.getElementById('nutritionCalories');
const nutritionProtein = document.getElementById('nutritionProtein');
const nutritionCarbs = document.getElementById('nutritionCarbs');
const nutritionFat = document.getElementById('nutritionFat');
const nutritionNotes = document.getElementById('nutritionNotes');
const nutritionServingCount = document.getElementById('nutritionServingCount');
const nutritionServingMinus = document.getElementById('nutritionServingMinus');
const nutritionServingPlus = document.getElementById('nutritionServingPlus');
const nutritionServingPreview = document.getElementById('nutritionServingPreview');
const nutritionSaveMealBtn = document.getElementById('nutritionSaveMealBtn');
const nutritionCancelEditBtn = document.getElementById('nutritionCancelEditBtn');
const nutritionFormStatus = document.getElementById('nutritionFormStatus');
const nutritionMealsList = document.getElementById('nutritionMealsList');
const nutritionMealCount = document.getElementById('nutritionMealCount');
const nutritionFavoritesList = document.getElementById('nutritionFavoritesList');
const nutritionFavoriteCount = document.getElementById('nutritionFavoriteCount');

const bodyweightDate = document.getElementById('bodyweightDate');
const bodyweightInput = document.getElementById('bodyweightInput');
const bodyweightInputLabel = document.getElementById('bodyweightInputLabel');
const bodyweightUnitLb = document.getElementById('bodyweightUnitLb');
const bodyweightUnitKg = document.getElementById('bodyweightUnitKg');
const bodyweightChartUnit = document.getElementById('bodyweightChartUnit');
const bodyweightSaveBtn = document.getElementById('bodyweightSaveBtn');
const bodyweightStatus = document.getElementById('bodyweightStatus');
const bodyweightLatest = document.getElementById('bodyweightLatest');
const bodyweightAverage = document.getElementById('bodyweightAverage');
const bodyweightTrend = document.getElementById('bodyweightTrend');
const bodyweightEntryCount = document.getElementById('bodyweightEntryCount');
const bodyweightChart = document.getElementById('bodyweightChart');
const bodyweightHistory = document.getElementById('bodyweightHistory');

const nutritionMealSearchInput = document.getElementById('nutritionMealSearchInput');
const nutritionMealSearchBtn = document.getElementById('nutritionMealSearchBtn');
const nutritionMealSearchResults = document.getElementById('nutritionMealSearchResults');

const nutritionBarcodeBtn = document.getElementById('nutritionBarcodeBtn');
const nutritionScannerOverlay = document.getElementById('nutritionScannerOverlay');
const nutritionScannerClose = document.getElementById('nutritionScannerClose');
const nutritionBarcodeInput = document.getElementById('nutritionBarcodeInput');
const nutritionBarcodeLookupBtn = document.getElementById('nutritionBarcodeLookupBtn');
const nutritionScannerStatus = document.getElementById('nutritionScannerStatus');
const nutritionCameraLabel = document.getElementById('nutritionCameraLabel');
const nutritionScanServingCount = document.getElementById('nutritionScanServingCount');
const nutritionScanServingMinus = document.getElementById('nutritionScanServingMinus');
const nutritionScanServingPlus = document.getElementById('nutritionScanServingPlus');

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

let bodyweightUnit = (() => {
  try{
    return localStorage.getItem('gymcels_bodyweight_unit') === 'kg' ? 'kg' : 'lb';
  }catch(_){
    return 'lb';
  }
})();

let nutritionMealEditId = null;

function nutritionLocalDateString(date=new Date()){
  const year = date.getFullYear();
  const month = String(date.getMonth()+1).padStart(2,'0');
  const day = String(date.getDate()).padStart(2,'0');
  return `${year}-${month}-${day}`;
}

function nutritionDateFromIso(iso){
  const parts = String(iso || '').split('-').map(Number);
  if(parts.length !== 3 || parts.some(x => !Number.isFinite(x))) return new Date();
  return new Date(parts[0],parts[1]-1,parts[2],12,0,0);
}

function nutritionShiftDate(iso,days){
  const d = nutritionDateFromIso(iso);
  d.setDate(d.getDate()+days);
  return nutritionLocalDateString(d);
}

function nutritionNumber(value){
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
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
  return `${nutritionFormat(n)} serving${n === 1 ? '' : 's'}`;
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

  document.querySelectorAll('[data-scan-servings]').forEach(btn => {
    btn.classList.toggle(
      'active',
      Number(btn.dataset.scanServings) === value
    );
  });
}

function nutritionFormat(value,maxDecimals=1){
  const n = nutritionNumber(value);
  if(Math.abs(n-Math.round(n)) < 0.00001) return String(Math.round(n));
  return n.toFixed(maxDecimals).replace(/\.0$/,'');
}

function nutritionEscape(value){
  return String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

function setNutritionStatus(text='',type=''){
  if(!nutritionFormStatus) return;
  nutritionFormStatus.textContent = text;
  nutritionFormStatus.className = `nutrition-status ${type || ''}`;
}

function updateNutritionDateLabels(){
  if(!nutritionDate) return;

  const selected = nutritionDate.value;
  const today = nutritionLocalDateString();
  const selectedDate = nutritionDateFromIso(selected);

  const pretty = selectedDate.toLocaleDateString([],{
    weekday:'short',month:'short',day:'numeric',year:selectedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });

  if(nutritionDateLabel){
    nutritionDateLabel.textContent = selected === today ? 'Today' : pretty;
  }
  if(nutritionMealsDateLabel){
    nutritionMealsDateLabel.textContent = selected === today ? 'today' : pretty;
  }
}

function resetNutritionMealForm(){
  nutritionMealEditId = null;
  if(nutritionMealFormTitle) nutritionMealFormTitle.textContent = 'Add Meal';
  if(nutritionFoodName) nutritionFoodName.value = '';
  if(nutritionMealType) nutritionMealType.value = 'breakfast';
  if(nutritionCalories) nutritionCalories.value = '';
  if(nutritionProtein) nutritionProtein.value = '';
  if(nutritionCarbs) nutritionCarbs.value = '';
  if(nutritionFat) nutritionFat.value = '';
  if(nutritionNotes) nutritionNotes.value = '';
  setNutritionServingInput(nutritionServingCount,1);
  updateNutritionServingPreview();
  if(nutritionSaveMealBtn) nutritionSaveMealBtn.textContent = 'Add meal';
  nutritionCancelEditBtn?.classList.add('hidden');
  setNutritionStatus('');
}

function renderNutritionTargets(){
  const calories = nutritionNumber(nutritionTargets.calorie_target);
  const protein = nutritionNumber(nutritionTargets.protein_target);
  const carbs = nutritionNumber(nutritionTargets.carbs_target);
  const fat = nutritionNumber(nutritionTargets.fat_target);

  if(nutritionCaloriesTarget) nutritionCaloriesTarget.textContent = calories ? nutritionFormat(calories,0) : '—';
  if(nutritionProteinTarget) nutritionProteinTarget.textContent = protein ? nutritionFormat(protein) : '—';
  if(nutritionCarbsTarget) nutritionCarbsTarget.textContent = carbs ? nutritionFormat(carbs) : '—';
  if(nutritionFatTarget) nutritionFatTarget.textContent = fat ? nutritionFormat(fat) : '—';

  if(nutritionTargetCalories) nutritionTargetCalories.value = calories || '';
  if(nutritionTargetProtein) nutritionTargetProtein.value = protein || '';
  if(nutritionTargetCarbs) nutritionTargetCarbs.value = carbs || '';
  if(nutritionTargetFat) nutritionTargetFat.value = fat || '';
}

function updateNutritionMacroCard(key,total,target,totalEl,progressEl,remainingEl){
  if(totalEl) totalEl.textContent = nutritionFormat(total,key === 'calories' ? 0 : 1);

  const card = progressEl?.closest('.nutrition-summary-card');
  const hasTarget = target > 0;
  const percent = hasTarget ? Math.min(100,(total/target)*100) : 0;
  if(progressEl) progressEl.style.width = `${Math.max(0,percent)}%`;

  card?.classList.toggle('over',hasTarget && total > target);

  if(!remainingEl) return;

  if(!hasTarget){
    remainingEl.textContent = 'Set a target';
    return;
  }

  const difference = target-total;
  if(difference >= 0){
    remainingEl.textContent =
      `${nutritionFormat(difference,key === 'calories' ? 0 : 1)}${key === 'calories' ? '' : 'g'} remaining`;
  }else{
    remainingEl.textContent =
      `${nutritionFormat(Math.abs(difference),key === 'calories' ? 0 : 1)}${key === 'calories' ? '' : 'g'} over target`;
  }
}

function renderNutritionSummary(){
  const totals = nutritionRows.reduce((sum,row) => {
    sum.calories += nutritionNumber(row.calories);
    sum.protein += nutritionNumber(row.protein_g);
    sum.carbs += nutritionNumber(row.carbs_g);
    sum.fat += nutritionNumber(row.fat_g);
    return sum;
  },{calories:0,protein:0,carbs:0,fat:0});

  updateNutritionMacroCard(
    'calories',
    totals.calories,
    nutritionNumber(nutritionTargets.calorie_target),
    nutritionCaloriesTotal,
    nutritionCaloriesProgress,
    nutritionCaloriesRemaining
  );
  updateNutritionMacroCard(
    'protein',
    totals.protein,
    nutritionNumber(nutritionTargets.protein_target),
    nutritionProteinTotal,
    nutritionProteinProgress,
    nutritionProteinRemaining
  );
  updateNutritionMacroCard(
    'carbs',
    totals.carbs,
    nutritionNumber(nutritionTargets.carbs_target),
    nutritionCarbsTotal,
    nutritionCarbsProgress,
    nutritionCarbsRemaining
  );
  updateNutritionMacroCard(
    'fat',
    totals.fat,
    nutritionNumber(nutritionTargets.fat_target),
    nutritionFatTotal,
    nutritionFatProgress,
    nutritionFatRemaining
  );
}

const NUTRITION_MEAL_GROUPS = [
  ['breakfast','Breakfast'],
  ['lunch','Lunch'],
  ['dinner','Dinner'],
  ['snack','Snacks']
];


function nutritionFavoriteKey(row){
  return [
    String(row?.food_name || row?.product_name || '').trim().toLowerCase(),
    nutritionFormat(row?.calories || 0,1),
    nutritionFormat(row?.protein_g || 0,1),
    nutritionFormat(row?.carbs_g || 0,1),
    nutritionFormat(row?.fat_g || 0,1)
  ].join('|');
}

function isNutritionFavorite(row){
  const key = nutritionFavoriteKey(row);
  return nutritionFavorites.some(fav => nutritionFavoriteKey(fav) === key);
}

function renderNutritionFavorites(){
  if(!nutritionFavoritesList) return;

  if(nutritionFavoriteCount){
    nutritionFavoriteCount.textContent =
      `${nutritionFavorites.length} saved`;
  }

  if(!nutritionFavorites.length){
    nutritionFavoritesList.innerHTML =
      '<div class="nutrition-empty">Tap ☆ Favorite on a logged meal to save it here.</div>';
    return;
  }

  nutritionFavoritesList.innerHTML = nutritionFavorites.map(fav => `
    <div class="nutrition-favorite-item" data-favorite-id="${Number(fav.id)}">
      <div>
        <div class="nutrition-favorite-name">${nutritionEscape(fav.food_name || 'Favorite food')}</div>
        <div class="nutrition-favorite-meta">
          <span>${nutritionFormat(fav.calories,0)} cal</span>
          <span>${nutritionFormat(fav.protein_g)}g P</span>
          <span>${nutritionFormat(fav.carbs_g)}g C</span>
          <span>${nutritionFormat(fav.fat_g)}g F</span>
        </div>
      </div>

      <div class="nutrition-favorite-actions">
        <button type="button" data-favorite-log="${Number(fav.id)}">Log</button>
        <button type="button" data-favorite-use="${Number(fav.id)}">Use</button>
        <button type="button" data-favorite-delete="${Number(fav.id)}">Remove</button>
      </div>
    </div>
  `).join('');
}

async function loadNutritionFavorites(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const {data,error} = await nutritionDb
    .from('favorite_foods')
    .select('id,user_id,food_name,meal_type,calories,protein_g,carbs_g,fat_g,notes,created_at')
    .eq('user_id',nutritionSession.user.id)
    .order('created_at',{ascending:false});

  if(error){
    console.error('Favorite foods load error:',error);
    return;
  }

  nutritionFavorites = data || [];
  renderNutritionFavorites();
}

async function saveNutritionFavoriteFromMeal(row){
  if(!nutritionDb || !nutritionSession?.user || !row) return;

  const existing = nutritionFavorites.find(
    fav => nutritionFavoriteKey(fav) === nutritionFavoriteKey(row)
  );

  if(existing){
    setNutritionStatus('That food is already in your favorites.','success');
    return;
  }

  const {error} = await nutritionDb
    .from('favorite_foods')
    .insert({
      user_id:nutritionSession.user.id,
      food_name:String(row.food_name || 'Favorite food').slice(0,120),
      meal_type:row.meal_type || 'snack',
      calories:nutritionNumber(row.calories),
      protein_g:nutritionNumber(row.protein_g),
      carbs_g:nutritionNumber(row.carbs_g),
      fat_g:nutritionNumber(row.fat_g),
      notes:String(row.notes || '').slice(0,160) || null,
      updated_at:new Date().toISOString()
    });

  if(error){
    setNutritionStatus(error.message,'error');
    return;
  }

  await loadNutritionFavorites();
  renderNutritionMeals();
  setNutritionStatus('★ Added to Favorite Foods.','success');
}

async function deleteNutritionFavorite(id){
  if(!nutritionDb || !nutritionSession?.user || !id) return;

  const {error} = await nutritionDb
    .from('favorite_foods')
    .delete()
    .eq('id',Number(id))
    .eq('user_id',nutritionSession.user.id);

  if(error){
    setNutritionStatus(error.message,'error');
    return;
  }

  await loadNutritionFavorites();
  renderNutritionMeals();
}

async function logNutritionFavorite(fav){
  if(!nutritionDb || !nutritionSession?.user || !fav) return;

  const {error} = await nutritionDb
    .from('meal_logs')
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
    setNutritionStatus(error.message,'error');
    return;
  }

  await loadNutritionMeals();
  setNutritionStatus(`✓ Logged ${fav.food_name}.`,'success');
}

function renderNutritionMeals(){
  if(!nutritionMealsList) return;

  if(nutritionMealCount){
    nutritionMealCount.textContent =
      `${nutritionRows.length} meal${nutritionRows.length === 1 ? '' : 's'} logged`;
  }

  if(!nutritionRows.length){
    nutritionMealsList.innerHTML =
      '<div class="nutrition-empty">No meals logged for this day yet.</div>';
    renderNutritionSummary();
    return;
  }

  nutritionMealsList.innerHTML = NUTRITION_MEAL_GROUPS.map(([key,label]) => {
    const rows = nutritionRows.filter(row => row.meal_type === key);
    if(!rows.length) return '';

    const groupCalories = rows.reduce((sum,row) => sum + nutritionNumber(row.calories),0);

    return `<div class="nutrition-meal-group">
      <div class="nutrition-meal-group-title">
        <span>${label}</span>
        <span>${nutritionFormat(groupCalories,0)} cal</span>
      </div>

      ${rows.map(row => `
        <div class="nutrition-meal-item" data-nutrition-meal-id="${Number(row.id)}">
          <div>
            <div class="nutrition-meal-name">${nutritionEscape(row.food_name || 'Meal')}</div>
            ${row.notes ? `<div class="nutrition-meal-note">${nutritionEscape(row.notes)}</div>` : ''}
            <div class="nutrition-meal-macros">
              <span>${nutritionFormat(row.calories,0)} cal</span>
              <span>${nutritionFormat(row.protein_g)}g protein</span>
              <span>${nutritionFormat(row.carbs_g)}g carbs</span>
              <span>${nutritionFormat(row.fat_g)}g fat</span>
            </div>
          </div>

          <div class="nutrition-meal-actions">
            <button type="button"
              class="${isNutritionFavorite(row) ? 'nutrition-favorite-active' : ''}"
              data-nutrition-favorite="${Number(row.id)}">
              ${isNutritionFavorite(row) ? '★ Saved' : '☆ Favorite'}
            </button>
            <button type="button" data-nutrition-edit="${Number(row.id)}">Edit</button>
            <button type="button" data-nutrition-delete="${Number(row.id)}">Delete</button>
          </div>
        </div>
      `).join('')}
    </div>`;
  }).join('');

  renderNutritionSummary();
}

async function loadNutritionTargets(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const {data,error} = await nutritionDb
    .from('nutrition_targets')
    .select('calorie_target,protein_target,carbs_target,fat_target')
    .eq('user_id',nutritionSession.user.id)
    .maybeSingle();

  if(error){
    console.error('Nutrition targets load error:',error);
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
    .from('meal_logs')
    .select('id,user_id,meal_date,meal_type,food_name,calories,protein_g,carbs_g,fat_g,notes,created_at')
    .eq('user_id',nutritionSession.user.id)
    .eq('meal_date',nutritionDate.value)
    .order('created_at',{ascending:true});

  if(error){
    console.error('Meal load error:',error);
    if(nutritionMealsList){
      nutritionMealsList.innerHTML = `<div class="nutrition-empty">${nutritionEscape(error.message)}</div>`;
    }
    return;
  }

  nutritionRows = data || [];
  renderNutritionMeals();
}


function setBodyweightStatus(text='',type=''){
  if(!bodyweightStatus) return;
  bodyweightStatus.textContent = text;
  bodyweightStatus.className = `bodyweight-status ${type || ''}`;
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
  return bodyweightUnit === 'kg' ? bodyweightLbToKg(n) : n;
}

function bodyweightInputToLb(value){
  const n = Number(value);
  if(!Number.isFinite(n)) return NaN;
  return bodyweightUnit === 'kg' ? bodyweightKgToLb(n) : n;
}

function bodyweightFormat(valueLb){
  const n = bodyweightDisplayNumber(valueLb);
  if(!Number.isFinite(n)) return '—';

  const unit = bodyweightUnit === 'kg' ? 'kg' : 'lb';
  return `${n.toFixed(1).replace(/\.0$/,'')} ${unit}`;
}

function bodyweightFormatDelta(deltaLb){
  const displayDelta = bodyweightUnit === 'kg'
    ? bodyweightLbToKg(deltaLb)
    : Number(deltaLb);

  if(!Number.isFinite(displayDelta)) return '—';

  const unit = bodyweightUnit === 'kg' ? 'kg' : 'lb';
  const value = displayDelta.toFixed(1).replace(/\.0$/,'');
  return `${displayDelta > 0 ? '+' : ''}${value} ${unit}`;
}

function updateBodyweightUnitUi(){
  const isKg = bodyweightUnit === 'kg';

  bodyweightUnitLb?.classList.toggle('active',!isKg);
  bodyweightUnitKg?.classList.toggle('active',isKg);

  if(bodyweightInputLabel){
    bodyweightInputLabel.textContent = `Bodyweight (${isKg ? 'kg' : 'lb'})`;
  }

  if(bodyweightInput){
    bodyweightInput.min = isKg ? '18' : '40';
    bodyweightInput.max = isKg ? '680' : '1500';
    bodyweightInput.step = '0.1';
    bodyweightInput.placeholder = isKg ? '81.6' : '180.0';
  }

  if(bodyweightChartUnit){
    bodyweightChartUnit.textContent = `Last 30 entries · ${isKg ? 'kg' : 'lb'}`;
  }

  try{
    localStorage.setItem('gymcels_bodyweight_unit',bodyweightUnit);
  }catch(_){}

  renderBodyweight();
}

function renderBodyweightChart(){
  if(!bodyweightChart) return;

  const rows = [...bodyweightRows]
    .sort((a,b) => String(a.log_date).localeCompare(String(b.log_date)))
    .slice(-30);

  if(!rows.length){
    bodyweightChart.innerHTML =
      '<div class="bodyweight-empty">Log your first bodyweight to start the chart.</div>';
    return;
  }

  if(rows.length === 1){
    bodyweightChart.innerHTML =
      `<div class="bodyweight-empty">First entry: <strong>${bodyweightFormat(rows[0].weight_lb)}</strong>. Add more weigh-ins to build the trend.</div>`;
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
    .map(r => bodyweightDisplayNumber(r.weight_lb))
    .filter(Number.isFinite);

  let min = Math.min(...weights);
  let max = Math.max(...weights);
  const spread = Math.max(1,max-min);
  min -= spread * .18;
  max += spread * .18;

  const xFor = index =>
    left + (rows.length === 1 ? chartW/2 : (index/(rows.length-1))*chartW);
  const yFor = value =>
    top + ((max-value)/(max-min || 1))*chartH;

  const points = rows.map((row,index) =>
    `${xFor(index).toFixed(1)},${yFor(bodyweightDisplayNumber(row.weight_lb)).toFixed(1)}`
  ).join(' ');

  const horizontalLines = [0,.25,.5,.75,1].map(step => {
    const y = top + chartH*step;
    const labelValue = max-(max-min)*step;

    return `
      <line class="bodyweight-chart-grid" x1="${left}" y1="${y}" x2="${width-right}" y2="${y}"></line>
      <text class="bodyweight-chart-label" x="2" y="${y+3}">${nutritionFormat(labelValue,1)}</text>
    `;
  }).join('');

  const pointDots = rows.map((row,index) => `
    <circle class="bodyweight-chart-point"
      cx="${xFor(index).toFixed(1)}"
      cy="${yFor(Number(row.weight_lb)).toFixed(1)}"
      r="3.2">
      <title>${row.log_date}: ${bodyweightFormat(row.weight_lb)}</title>
    </circle>
  `).join('');

  const firstDate = nutritionDateFromIso(rows[0].log_date)
    .toLocaleDateString([],{month:'short',day:'numeric'});
  const lastDate = nutritionDateFromIso(rows[rows.length-1].log_date)
    .toLocaleDateString([],{month:'short',day:'numeric'});

  bodyweightChart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Bodyweight trend">
      ${horizontalLines}
      <polyline class="bodyweight-chart-line" points="${points}"></polyline>
      ${pointDots}
      <text class="bodyweight-chart-label" x="${left}" y="${height-5}">${nutritionEscape(firstDate)}</text>
      <text class="bodyweight-chart-label" x="${width-right-42}" y="${height-5}">${nutritionEscape(lastDate)}</text>
    </svg>
  `;
}

function renderBodyweight(){
  const rows = [...bodyweightRows]
    .sort((a,b) => String(b.log_date).localeCompare(String(a.log_date)));

  if(bodyweightEntryCount) bodyweightEntryCount.textContent = String(rows.length);

  const latest = rows[0];
  if(bodyweightLatest){
    bodyweightLatest.textContent = latest ? bodyweightFormat(latest.weight_lb) : '—';
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getFullYear(),now.getMonth(),now.getDate()-6,0,0,0);
  const weekRows = rows.filter(row => nutritionDateFromIso(row.log_date) >= sevenDaysAgo);
  const weekAvg = weekRows.length
    ? weekRows.reduce((sum,row) => sum + Number(row.weight_lb),0) / weekRows.length
    : null;

  if(bodyweightAverage){
    bodyweightAverage.textContent = weekAvg !== null ? bodyweightFormat(weekAvg) : '—';
  }

  if(bodyweightTrend){
    bodyweightTrend.classList.remove('up','down');

    if(rows.length >= 2){
      const chronological = [...rows].sort(
        (a,b) => String(a.log_date).localeCompare(String(b.log_date))
      );
      const first = Number(chronological[0].weight_lb);
      const last = Number(chronological[chronological.length-1].weight_lb);
      const delta = last-first;

      bodyweightTrend.textContent = bodyweightFormatDelta(delta);

      if(delta > .05) bodyweightTrend.classList.add('up');
      if(delta < -.05) bodyweightTrend.classList.add('down');
    }else{
      bodyweightTrend.textContent = '—';
    }
  }

  if(bodyweightHistory){
    bodyweightHistory.innerHTML = rows.length
      ? rows.slice(0,8).map(row => `
          <div class="bodyweight-history-row">
            <span class="bodyweight-history-date">
              ${nutritionEscape(
                nutritionDateFromIso(row.log_date).toLocaleDateString([],{
                  weekday:'short',month:'short',day:'numeric'
                })
              )}
            </span>
            <strong class="bodyweight-history-weight">${bodyweightFormat(row.weight_lb)}</strong>
            <button type="button" data-bodyweight-delete="${Number(row.id)}">Delete</button>
          </div>
        `).join('')
      : '<div class="bodyweight-empty">No bodyweight entries yet.</div>';
  }

  renderBodyweightChart();
}

async function loadBodyweight(){
  if(!nutritionDb || !nutritionSession?.user) return;

  const {data,error} = await nutritionDb
    .from('bodyweight_logs')
    .select('id,user_id,log_date,weight_lb,created_at,updated_at')
    .eq('user_id',nutritionSession.user.id)
    .order('log_date',{ascending:false})
    .limit(90);

  if(error){
    console.error('Bodyweight load error:',error);
    setBodyweightStatus(error.message,'error');
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

  if(!Number.isFinite(weightLb) || weightLb < 40 || weightLb > 1500){
    setBodyweightStatus(
      `Enter a valid bodyweight in ${bodyweightUnit === 'kg' ? 'kilograms' : 'pounds'}.`,
      'error'
    );
    bodyweightInput?.focus();
    return;
  }

  bodyweightSaveBtn.disabled = true;
  setBodyweightStatus('Saving...');

  const {error} = await nutritionDb
    .from('bodyweight_logs')
    .upsert({
      user_id:nutritionSession.user.id,
      log_date:date,
      // Keep the existing database column in pounds so old entries stay compatible.
      weight_lb:Number(weightLb.toFixed(2)),
      updated_at:new Date().toISOString()
    },{
      onConflict:'user_id,log_date'
    });

  bodyweightSaveBtn.disabled = false;

  if(error){
    setBodyweightStatus(error.message,'error');
    return;
  }

  bodyweightInput.value = '';
  setBodyweightStatus(
    `✓ Bodyweight saved in ${bodyweightUnit === 'kg' ? 'kg' : 'lb'}.`,
    'success'
  );
  await loadBodyweight();
}

async function deleteBodyweight(id){
  if(!nutritionDb || !nutritionSession?.user || !id) return;
  if(!confirm('Delete this bodyweight entry?')) return;

  const {error} = await nutritionDb
    .from('bodyweight_logs')
    .delete()
    .eq('id',Number(id))
    .eq('user_id',nutritionSession.user.id);

  if(error){
    setBodyweightStatus(error.message,'error');
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
    nutritionSection.classList.add('hidden');
    nutritionRows = [];
    nutritionFavorites = [];
    bodyweightRows = [];
    renderNutritionFavorites();
    renderBodyweight();
    resetNutritionMealForm();
    nutritionMealSearchResults?.classList.add('hidden');
    if(nutritionMealSearchInput) nutritionMealSearchInput.value = '';
    closeNutritionScanner();
    return;
  }

  nutritionSection.classList.remove('hidden');

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
    .from('nutrition_targets')
    .upsert(values,{onConflict:'user_id'});

  nutritionSaveTargetsBtn.disabled = false;

  if(error){
    setNutritionStatus('Could not save targets: ' + error.message,'error');
    return;
  }

  nutritionTargets = values;
  renderNutritionTargets();
  renderNutritionSummary();
  nutritionTargetsForm?.classList.add('hidden');
  setNutritionStatus('✓ Daily targets saved.','success');
  setTimeout(() => {
    if(nutritionFormStatus?.textContent === '✓ Daily targets saved.') setNutritionStatus('');
  },2200);
}

function beginNutritionEdit(row){
  if(!row) return;

  nutritionMealEditId = Number(row.id);
  nutritionMealFormTitle.textContent = 'Edit Meal';
  nutritionFoodName.value = row.food_name || '';
  nutritionMealType.value = row.meal_type || 'snack';
  nutritionCalories.value = nutritionNumber(row.calories);
  nutritionProtein.value = nutritionNumber(row.protein_g);
  nutritionCarbs.value = nutritionNumber(row.carbs_g);
  nutritionFat.value = nutritionNumber(row.fat_g);
  nutritionNotes.value = row.notes || '';
  // Existing meal rows already store their total macros, so edit them as 1 serving.
  setNutritionServingInput(nutritionServingCount,1);
  updateNutritionServingPreview();
  nutritionSaveMealBtn.textContent = 'Update meal';
  nutritionCancelEditBtn.classList.remove('hidden');
  setNutritionStatus('');

  document.querySelector('.nutrition-add-card')?.scrollIntoView({
    behavior:'smooth',block:'center'
  });
}

async function saveNutritionMeal(){
  if(!nutritionSession?.user || !nutritionDb) return;

  const foodName = String(nutritionFoodName?.value || '').trim();
  if(!foodName){
    setNutritionStatus('Add a food or meal name first.','error');
    nutritionFoodName?.focus();
    return;
  }

  const servings = nutritionServingValue(nutritionServingCount);
  const userNotes = String(nutritionNotes?.value || '').trim();

  const row = {
    user_id:nutritionSession.user.id,
    meal_date:nutritionDate.value || nutritionLocalDateString(),
    meal_type:nutritionMealType.value || 'snack',
    food_name:foodName,
    calories:nutritionNumber(nutritionCalories.value) * servings,
    protein_g:nutritionNumber(nutritionProtein.value) * servings,
    carbs_g:nutritionNumber(nutritionCarbs.value) * servings,
    fat_g:nutritionNumber(nutritionFat.value) * servings,
    notes:[
      servings !== 1 ? nutritionServingText(servings) : '',
      userNotes
    ].filter(Boolean).join(' · ') || null,
    updated_at:new Date().toISOString()
  };

  nutritionSaveMealBtn.disabled = true;
  setNutritionStatus(nutritionMealEditId ? 'Updating meal...' : 'Adding meal...');

  let result;

  if(nutritionMealEditId){
    result = await nutritionDb
      .from('meal_logs')
      .update(row)
      .eq('id',nutritionMealEditId)
      .eq('user_id',nutritionSession.user.id);
  }else{
    result = await nutritionDb
      .from('meal_logs')
      .insert(row);
  }

  nutritionSaveMealBtn.disabled = false;

  if(result.error){
    setNutritionStatus(result.error.message,'error');
    return;
  }

  const wasEditing = !!nutritionMealEditId;
  resetNutritionMealForm();
  setNutritionStatus(wasEditing ? '✓ Meal updated.' : '✓ Meal added.','success');
  await loadNutritionMeals();

  setTimeout(() => {
    if(nutritionFormStatus?.classList.contains('success')) setNutritionStatus('');
  },1800);
}

async function deleteNutritionMeal(id){
  if(!nutritionSession?.user || !nutritionDb || !id) return;
  if(!confirm('Delete this meal from your nutrition log?')) return;

  const {error} = await nutritionDb
    .from('meal_logs')
    .delete()
    .eq('id',Number(id))
    .eq('user_id',nutritionSession.user.id);

  if(error){
    setNutritionStatus(error.message,'error');
    return;
  }

  if(Number(nutritionMealEditId) === Number(id)) resetNutritionMealForm();
  await loadNutritionMeals();
}

nutritionEditTargetsBtn?.addEventListener('click',() => {
  renderNutritionTargets();
  nutritionTargetsForm?.classList.toggle('hidden');
});
nutritionCancelTargetsBtn?.addEventListener('click',() => {
  nutritionTargetsForm?.classList.add('hidden');
  renderNutritionTargets();
});
nutritionSaveTargetsBtn?.addEventListener('click',saveNutritionTargets);

nutritionSaveMealBtn?.addEventListener('click',saveNutritionMeal);
nutritionCancelEditBtn?.addEventListener('click',resetNutritionMealForm);

nutritionMealsList?.addEventListener('click',(e) => {
  const favorite = e.target.closest('[data-nutrition-favorite]');
  if(favorite){
    const row = nutritionRows.find(
      x => Number(x.id) === Number(favorite.dataset.nutritionFavorite)
    );
    if(row) saveNutritionFavoriteFromMeal(row);
    return;
  }

  const edit = e.target.closest('[data-nutrition-edit]');
  if(edit){
    const row = nutritionRows.find(x => Number(x.id) === Number(edit.dataset.nutritionEdit));
    if(row) beginNutritionEdit(row);
    return;
  }

  const del = e.target.closest('[data-nutrition-delete]');
  if(del) deleteNutritionMeal(Number(del.dataset.nutritionDelete));
});

nutritionDate?.addEventListener('change',async () => {
  resetNutritionMealForm();
  await loadNutritionMeals();
});
nutritionPrevDay?.addEventListener('click',async () => {
  nutritionDate.value = nutritionShiftDate(nutritionDate.value || nutritionLocalDateString(),-1);
  resetNutritionMealForm();
  await loadNutritionMeals();
});
nutritionNextDay?.addEventListener('click',async () => {
  nutritionDate.value = nutritionShiftDate(nutritionDate.value || nutritionLocalDateString(),1);
  resetNutritionMealForm();
  await loadNutritionMeals();
});
nutritionTodayBtn?.addEventListener('click',async () => {
  nutritionDate.value = nutritionLocalDateString();
  resetNutritionMealForm();
  await loadNutritionMeals();
});


function fillNutritionFormFromMeal(row, sourceLabel='Saved meal'){
  if(!row) return;

  nutritionMealEditId = null;
  if(nutritionMealFormTitle) nutritionMealFormTitle.textContent = 'Add Meal';
  nutritionFoodName.value = row.food_name || row.product_name || '';
  nutritionMealType.value = row.meal_type || 'snack';
  nutritionCalories.value = nutritionNumber(row.calories);
  nutritionProtein.value = nutritionNumber(row.protein_g);
  nutritionCarbs.value = nutritionNumber(row.carbs_g);
  nutritionFat.value = nutritionNumber(row.fat_g);
  nutritionNotes.value = row.notes || '';
  setNutritionServingInput(nutritionServingCount,1);
  updateNutritionServingPreview();
  nutritionSaveMealBtn.textContent = 'Add meal';
  nutritionCancelEditBtn.classList.add('hidden');

  setNutritionStatus(`✓ ${sourceLabel} loaded. Check the serving and macros, then tap Add meal.`,'success');
  document.querySelector('.nutrition-meal-form')?.scrollIntoView({
    behavior:'smooth',
    block:'center'
  });
}

function renderNutritionMealSearchResults(rows){
  if(!nutritionMealSearchResults) return;

  nutritionSavedSearchRows = rows || [];

  if(!nutritionSavedSearchRows.length){
    nutritionMealSearchResults.innerHTML =
      '<div class="nutrition-search-empty">No matching meals found in your history.</div>';
    nutritionMealSearchResults.classList.remove('hidden');
    return;
  }

  nutritionMealSearchResults.innerHTML = nutritionSavedSearchRows.map((row,index) => `
    <div class="nutrition-search-result">
      <div>
        <div class="nutrition-search-result-name">${nutritionEscape(row.food_name || 'Meal')}</div>
        <div class="nutrition-search-result-meta">
          <span>${nutritionFormat(row.calories,0)} cal</span>
          <span>${nutritionFormat(row.protein_g)}g P</span>
          <span>${nutritionFormat(row.carbs_g)}g C</span>
          <span>${nutritionFormat(row.fat_g)}g F</span>
        </div>
        ${row.notes ? `<div class="nutrition-search-result-note">${nutritionEscape(row.notes)}</div>` : ''}
      </div>
      <button class="nutrition-search-use" type="button" data-use-saved-meal="${index}">Use</button>
    </div>
  `).join('');

  nutritionMealSearchResults.classList.remove('hidden');
}

async function searchNutritionMealHistory(){
  if(!nutritionSession?.user || !nutritionDb) return;

  const query = String(nutritionMealSearchInput?.value || '').trim();

  if(!query){
    nutritionMealSearchResults?.classList.add('hidden');
    if(nutritionMealSearchResults) nutritionMealSearchResults.innerHTML = '';
    return;
  }

  nutritionMealSearchResults.classList.remove('hidden');
  nutritionMealSearchResults.innerHTML =
    '<div class="nutrition-search-empty">Searching your meal history...</div>';

  const {data,error} = await nutritionDb
    .from('meal_logs')
    .select('id,meal_date,meal_type,food_name,calories,protein_g,carbs_g,fat_g,notes,created_at')
    .eq('user_id',nutritionSession.user.id)
    .ilike('food_name',`%${query}%`)
    .order('created_at',{ascending:false})
    .limit(40);

  if(error){
    nutritionMealSearchResults.innerHTML =
      `<div class="nutrition-search-empty">${nutritionEscape(error.message)}</div>`;
    return;
  }

  // Keep only the latest version of matching foods with the same name + macros.
  const seen = new Set();
  const unique = [];

  for(const row of (data || [])){
    const key = [
      String(row.food_name || '').trim().toLowerCase(),
      nutritionNumber(row.calories),
      nutritionNumber(row.protein_g),
      nutritionNumber(row.carbs_g),
      nutritionNumber(row.fat_g)
    ].join('|');

    if(seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
    if(unique.length >= 12) break;
  }

  renderNutritionMealSearchResults(unique);
}

nutritionMealSearchBtn?.addEventListener('click',searchNutritionMealHistory);

nutritionMealSearchInput?.addEventListener('input',() => {
  clearTimeout(nutritionSearchTimer);
  nutritionSearchTimer = setTimeout(searchNutritionMealHistory,220);
});

nutritionMealSearchInput?.addEventListener('keydown',(e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    searchNutritionMealHistory();
  }
});

nutritionMealSearchResults?.addEventListener('click',(e) => {
  const btn = e.target.closest('[data-use-saved-meal]');
  if(!btn) return;

  const row = nutritionSavedSearchRows[Number(btn.dataset.useSavedMeal)];
  if(!row) return;

  fillNutritionFormFromMeal(row,'Saved meal');
  nutritionMealSearchResults.classList.add('hidden');
});

function setNutritionScannerStatus(text='',type=''){
  if(!nutritionScannerStatus) return;
  nutritionScannerStatus.textContent = text;
  nutritionScannerStatus.className = `nutrition-scanner-status ${type || ''}`;
}


function adjustNutritionServing(input,delta){
  const next = nutritionServingValue(input) + delta;
  setNutritionServingInput(input,next);
}

nutritionServingMinus?.addEventListener('click',() => {
  adjustNutritionServing(nutritionServingCount,-0.5);
  updateNutritionServingPreview();
});
nutritionServingPlus?.addEventListener('click',() => {
  adjustNutritionServing(nutritionServingCount,0.5);
  updateNutritionServingPreview();
});
nutritionServingCount?.addEventListener('input',updateNutritionServingPreview);
nutritionServingCount?.addEventListener('change',() => {
  setNutritionServingInput(nutritionServingCount,nutritionServingCount.value);
  updateNutritionServingPreview();
});

[nutritionCalories,nutritionProtein,nutritionCarbs,nutritionFat].forEach(input => {
  input?.addEventListener('input',updateNutritionServingPreview);
});

nutritionScanServingMinus?.addEventListener('click',() => {
  adjustNutritionServing(nutritionScanServingCount,-0.5);
  updateScanServingButtons();
});
nutritionScanServingPlus?.addEventListener('click',() => {
  adjustNutritionServing(nutritionScanServingCount,0.5);
  updateScanServingButtons();
});
nutritionScanServingCount?.addEventListener('input',updateScanServingButtons);
nutritionScanServingCount?.addEventListener('change',() => {
  setNutritionServingInput(nutritionScanServingCount,nutritionScanServingCount.value);
  updateScanServingButtons();
});

document.querySelectorAll('[data-scan-servings]').forEach(btn => {
  btn.addEventListener('click',() => {
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
  if(hour >= 5 && hour < 11) return 'breakfast';
  if(hour >= 11 && hour < 16) return 'lunch';
  if(hour >= 16 && hour < 22) return 'dinner';
  return 'snack';
}

function nutritionMealTypeLabel(type){
  return ({
    breakfast:'Breakfast',
    lunch:'Lunch',
    dinner:'Dinner',
    snack:'Snacks'
  })[type] || 'Snacks';
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
  const reader = document.getElementById('nutritionBarcodeReader');
  if(reader) reader.innerHTML = '';
}

function extractNutritionBarcode(raw){
  const value = String(raw || '').trim();
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
    const keys = ['gtin','ean','upc','barcode','code'];
    for(const key of keys){
      const candidate = String(url.searchParams.get(key) || '').replace(/\D/g,'');
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

  const numberOrNull = value => {
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? num : null;
  };

  const per100 = {
    calories:numberOrNull(n['energy-kcal_100g']),
    protein:numberOrNull(n.proteins_100g),
    carbs:numberOrNull(n.carbohydrates_100g),
    fat:numberOrNull(n.fat_100g)
  };

  const perServing = {
    calories:numberOrNull(n['energy-kcal_serving']),
    protein:numberOrNull(n.proteins_serving),
    carbs:numberOrNull(n.carbohydrates_serving),
    fat:numberOrNull(n.fat_serving)
  };

  const hasDirectServing = Object.values(perServing).some(v => v !== null);
  const servingQty = numberOrNull(product?.serving_quantity);
  const canCalculateServing = !hasDirectServing && servingQty && servingQty > 0 &&
    Object.values(per100).some(v => v !== null);

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
      : 'per serving';
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
    servingNote = 'nutrition per 100g';
  }

  const hasAnyNutrition = Object.values(values).some(v => Number(v) > 0);

  return {
    food_name:[
      product?.product_name || product?.generic_name || 'Scanned food',
      product?.brands ? `— ${product.brands}` : ''
    ].filter(Boolean).join(' '),
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
    throw new Error('Log in before scanning food.');
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
    },'Scanned product');

    throw new Error('Product found, but its nutrition data is missing. I loaded the name into the form so you can enter the label manually.');
  }

  const mealType = nutritionAutoMealType();
  const mealDate = nutritionDate?.value || nutritionLocalDateString();
  const servings = nutritionServingValue(nutritionScanServingCount);

  const {error} = await nutritionDb
    .from('meal_logs')
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
      ].filter(Boolean).join(' · '),
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
      'QR code detected, but it does not contain a UPC/EAN/GTIN food code. Try the line-style barcode on the package.'
    );
  }

  if(nutritionBarcodeInput) nutritionBarcodeInput.value = barcode;

  setNutritionScannerStatus('Product code found — looking up food…');
  if(nutritionCameraLabel) nutritionCameraLabel.textContent = `Code ${barcode}`;

  const fields = [
    'code','product_name','generic_name','brands','serving_size','serving_quantity',
    'categories_tags','nutriments'
  ].join(',');

  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${encodeURIComponent(fields)}`
  );

  if(!response.ok){
    throw new Error(`Food lookup failed (${response.status}).`);
  }

  const payload = await response.json();

  if(payload?.status !== 1 || !payload?.product){
    throw new Error(
      'Barcode scanned successfully, but that product is not in the food database yet.'
    );
  }

  setNutritionScannerStatus('Food found — logging it automatically…');

  return await autoLogScannedFood(payload.product,barcode);
}

async function handleNutritionScan(decodedText){
  if(nutritionScanHandled) return;
  nutritionScanHandled = true;

  try{
    setNutritionScannerStatus('Code detected…');
    await stopNutritionScanner();

    const logged = await lookupAndAutoLogNutritionCode(decodedText);

    setNutritionScannerStatus(
      `✓ Logged ${nutritionServingText(logged.servings)} of ${logged.name} · ${nutritionFormat(logged.calories,0)} cal · ${nutritionMealTypeLabel(logged.mealType)}`,
      'success'
    );

    if(nutritionCameraLabel) nutritionCameraLabel.textContent = 'Food logged ✓';

    setNutritionStatus(
      `✓ ${nutritionServingText(logged.servings)} of ${logged.name} was added to ${nutritionMealTypeLabel(logged.mealType)}.`,
      'success'
    );

    setTimeout(closeNutritionScanner,950);
  }catch(err){
    console.error('Nutrition scan error:',err);
    setNutritionScannerStatus(err?.message || String(err),'error');
    if(nutritionCameraLabel) nutritionCameraLabel.textContent = 'Try another code';

    // Restart the rear camera so the user can immediately try again.
    nutritionScanHandled = false;
    setTimeout(() => {
      if(nutritionScannerOverlay?.classList.contains('show') && !nutritionScanner){
        startNutritionRearCamera();
      }
    },850);
  }
}

async function startNutritionRearCamera(){
  if(typeof Html5Qrcode === 'undefined'){
    setNutritionScannerStatus(
      'Camera scanner could not load. You can still enter the barcode manually.',
      'error'
    );
    return;
  }

  await stopNutritionScanner();

  const readerId = 'nutritionBarcodeReader';
  nutritionScanner = new Html5Qrcode(readerId,false);

  const scanConfig = {
    fps:12,
    qrbox:(viewWidth,viewHeight) => {
      const width = Math.floor(Math.min(viewWidth * .78,360));
      const height = Math.floor(Math.min(viewHeight * .34,170));
      return {width,height};
    },
    aspectRatio:1.333333
  };

  let cameraChoice = {facingMode:{exact:'environment'}};
  let cameraName = 'Back camera';

  try{
    const cameras = await Html5Qrcode.getCameras();

    if(cameras?.length){
      const rear =
        cameras.find(cam => /back|rear|environment|world/i.test(cam.label || '')) ||
        cameras[cameras.length - 1];

      if(rear?.id){
        cameraChoice = rear.id;
        cameraName = rear.label || 'Back camera';
      }
    }
  }catch(err){
    console.debug('Camera enumeration fallback:',err);
  }

  try{
    if(nutritionCameraLabel) nutritionCameraLabel.textContent = cameraName;
    setNutritionScannerStatus('Scanning… hold the package steady inside the frame.');

    await nutritionScanner.start(
      cameraChoice,
      scanConfig,
      handleNutritionScan,
      () => {}
    );
  }catch(firstErr){
    console.debug('Exact rear camera start failed, trying environment mode:',firstErr);

    try{
      await stopNutritionScanner();
      nutritionScanner = new Html5Qrcode(readerId,false);
      if(nutritionCameraLabel) nutritionCameraLabel.textContent = 'Back camera';

      await nutritionScanner.start(
        {facingMode:'environment'},
        scanConfig,
        handleNutritionScan,
        () => {}
      );
    }catch(secondErr){
      console.error('Rear camera start failed:',secondErr);
      await stopNutritionScanner();
      if(nutritionCameraLabel) nutritionCameraLabel.textContent = 'Camera unavailable';
      setNutritionScannerStatus(
        'Could not open the back camera. Check camera permission, or enter the barcode manually.',
        'error'
      );
    }
  }
}

async function openNutritionScanner(){
  if(!nutritionSession?.user){
    document.getElementById('login-card')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }

  nutritionScannerOverlay?.classList.add('show');
  nutritionScannerOverlay?.setAttribute('aria-hidden','false');
  nutritionScanHandled = false;

  if(nutritionCameraLabel) nutritionCameraLabel.textContent = 'Starting back camera…';
  setNutritionScannerStatus('Starting back camera…');

  await startNutritionRearCamera();
}

async function closeNutritionScanner(){
  await stopNutritionScanner();
  nutritionScannerOverlay?.classList.remove('show');
  nutritionScannerOverlay?.setAttribute('aria-hidden','true');
  nutritionScanHandled = false;
}

nutritionBarcodeBtn?.addEventListener('click',openNutritionScanner);
nutritionScannerClose?.addEventListener('click',closeNutritionScanner);

nutritionScannerOverlay?.addEventListener('click',(e) => {
  if(e.target === nutritionScannerOverlay) closeNutritionScanner();
});

nutritionBarcodeLookupBtn?.addEventListener('click',async () => {
  if(nutritionScanHandled) return;
  nutritionScanHandled = true;

  try{
    const logged = await lookupAndAutoLogNutritionCode(nutritionBarcodeInput?.value || '');

    setNutritionScannerStatus(
      `✓ Logged ${nutritionServingText(logged.servings)} of ${logged.name} · ${nutritionFormat(logged.calories,0)} cal · ${nutritionMealTypeLabel(logged.mealType)}`,
      'success'
    );
    setNutritionStatus(
      `✓ ${nutritionServingText(logged.servings)} of ${logged.name} was added to ${nutritionMealTypeLabel(logged.mealType)}.`,
      'success'
    );
    setTimeout(closeNutritionScanner,850);
  }catch(err){
    setNutritionScannerStatus(err?.message || String(err),'error');
    nutritionScanHandled = false;
  }
});

nutritionBarcodeInput?.addEventListener('keydown',(e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    nutritionBarcodeLookupBtn?.click();
  }
});

document.addEventListener('keydown',(e) => {
  if(e.key === 'Escape' && nutritionScannerOverlay?.classList.contains('show')){
    closeNutritionScanner();
  }
});



nutritionFavoritesList?.addEventListener('click',(e) => {
  const logBtn = e.target.closest('[data-favorite-log]');
  if(logBtn){
    const fav = nutritionFavorites.find(
      x => Number(x.id) === Number(logBtn.dataset.favoriteLog)
    );
    if(fav) logNutritionFavorite(fav);
    return;
  }

  const useBtn = e.target.closest('[data-favorite-use]');
  if(useBtn){
    const fav = nutritionFavorites.find(
      x => Number(x.id) === Number(useBtn.dataset.favoriteUse)
    );

    if(fav){
      fillNutritionFormFromMeal(fav,'Favorite food');
      document.querySelector('.nutrition-add-card')?.scrollIntoView({
        behavior:'smooth',block:'center'
      });
    }
    return;
  }

  const deleteBtn = e.target.closest('[data-favorite-delete]');
  if(deleteBtn){
    deleteNutritionFavorite(Number(deleteBtn.dataset.favoriteDelete));
  }
});


function setBodyweightUnit(unit){
  bodyweightUnit = unit === 'kg' ? 'kg' : 'lb';
  updateBodyweightUnitUi();
}

bodyweightUnitLb?.addEventListener('click',() => setBodyweightUnit('lb'));
bodyweightUnitKg?.addEventListener('click',() => setBodyweightUnit('kg'));

bodyweightSaveBtn?.addEventListener('click',saveBodyweight);
bodyweightInput?.addEventListener('keydown',(e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    saveBodyweight();
  }
});
bodyweightHistory?.addEventListener('click',(e) => {
  const btn = e.target.closest('[data-bodyweight-delete]');
  if(btn) deleteBodyweight(Number(btn.dataset.bodyweightDelete));
});

if(bodyweightDate) bodyweightDate.value = nutritionLocalDateString();
updateBodyweightUnitUi();

if(nutritionDate) nutritionDate.value = nutritionLocalDateString();

if(nutritionDb){
  nutritionDb.auth.onAuthStateChange((_event,session) => {
    setNutritionSession(session);
  });

  setTimeout(async () => {
    const {data} = await nutritionDb.auth.getSession();
    await setNutritionSession(data?.session || null);
  },300);
}



const fpDb = window.gymcelsLolDb;

// ---- Gymcels.lol member profile (stored in Supabase Auth user metadata) ----
const profileBox = document.getElementById('memberProfile');
const profileAvatar = document.getElementById('profileAvatar');
const profileDisplayName = document.getElementById('profileDisplayName');
const profileEmail = document.getElementById('profileEmail');
const profileMemberSince = document.getElementById('profileMemberSince');
const profileProgramWeek = document.getElementById('profileProgramWeek');
const profileWorkoutCount = document.getElementById('profileWorkoutCount');
const profileSetCount = document.getElementById('profileSetCount');

const profileCurrentStreak = document.getElementById('profileCurrentStreak');
const profileBestStreak = document.getElementById('profileBestStreak');
const profileBioText = document.getElementById('profileBioText');
const profileBioInput = document.getElementById('profileBioInput');
const profilePhotoNote = document.getElementById('profilePhotoNote');
const profilePhysiqueCard = document.getElementById('profilePhysiqueCard');
const profilePhysiqueInput = document.getElementById('profilePhysiqueInput');
const profilePhysiqueNote = document.getElementById('profilePhysiqueNote');
const removePhysiqueBtn = document.getElementById('removePhysiqueBtn');
let pendingProfilePreviewUrl = null;
let pendingPhysiquePreviewUrl = null;

const profileForm = document.getElementById('profileForm');
const profileNameInput = document.getElementById('profileNameInput');
const profileStartInput = document.getElementById('profileStartInput');
const profileMessage = document.getElementById('profileMessage');

const profilePhotoInput = document.getElementById('profilePhotoInput');
const uploadProfilePhotoBtn = document.getElementById('uploadProfilePhotoBtn');
const removeProfilePhotoBtn = document.getElementById('removeProfilePhotoBtn');

const editProfileBtn = document.getElementById('editProfileBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const cancelProfileBtn = document.getElementById('cancelProfileBtn');

function fpInitials(name, email){
  const source = (name || email || 'GL').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0,2).toUpperCase();
}


function renderProfileAvatar(name, email, photoUrl){
  if(!profileAvatar) return;
  if(photoUrl){
    profileAvatar.innerHTML = `<img src="${photoUrl}" alt="Profile photo">`;
  } else {
    profileAvatar.textContent = fpInitials(name, email);
  }
}

function renderOwnPhysique(photoUrl){
  if(!profilePhysiqueCard) return;
  if(photoUrl){
    profilePhysiqueCard.innerHTML = `<img src="${photoUrl}" alt="Physique photo">`;
  }else{
    profilePhysiqueCard.innerHTML = '<div class="profile-physique-empty">No physique photo added yet.</div>';
  }
}

function fpProgramWeek(startDate){
  if(!startDate) return '—';
  const start = new Date(startDate + 'T00:00:00');
  const now = new Date();
  if(Number.isNaN(start.getTime()) || start > now) return '—';
  const days = Math.floor((now - start) / 86400000);
  return Math.min(12, Math.floor(days / 7) + 1);
}


function localDateKey(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
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
      .map(row => weekStartKeyFromIso(row.workout_date))
      .filter(Boolean)
  );

  if(!weeks.size) return { current:0, best:0 };

  const thisWeek = weekStartKeyFromDate(new Date());
  const previousWeek = shiftWeekKey(thisWeek, -1);

  // Rest days do not break the streak. During a new week, last week's streak
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
    .map(key => new Date(`${key}T12:00:00`).getTime())
    .sort((a,b) => a-b);

  let best = 0;
  let run = 0;
  let last = null;

  for(const ts of sorted){
    if(last !== null && ts - last === 7 * 86400000) run += 1;
    else run = 1;
    if(run > best) best = run;
    last = ts;
  }

  return { current, best };
}

async function refreshMemberProfile(){
  if(!profileBox) return;

  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user){
    profileBox.classList.add('hidden');
    return;
  }

  const user = session.user;
  const meta = user.user_metadata || {};
  const displayName = meta.display_name || 'Gymcels.lol Member';
  const startDate = meta.fp_start_date || '';
  const bio = String(meta.bio || '').slice(0,160);

  profileBox.classList.remove('hidden');
  profileDisplayName.textContent = displayName;
  profileEmail.textContent = user.email || '';
  renderProfileAvatar(displayName, user.email, meta.avatar_url || '');
  renderOwnPhysique(meta.physique_url || '');

  if(profileBioText){
    profileBioText.textContent = bio || 'No bio yet.';
    profileBioText.classList.toggle('empty', !bio);
  }

  profileMemberSince.textContent = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined,{month:'short',year:'numeric'})
    : '—';

  profileProgramWeek.textContent = fpProgramWeek(startDate);
  profileNameInput.value = meta.display_name || '';
  profileStartInput.value = startDate;
  if(profileBioInput) profileBioInput.value = bio;

  const { data: logs, error } = await fpDb
    .from('workout_logs')
    .select('workout_date');

  if(!error && Array.isArray(logs)){
    profileSetCount.textContent = logs.length;
    const uniqueDays = new Set(logs.map(x => x.workout_date).filter(Boolean));
    profileWorkoutCount.textContent = uniqueDays.size;

    const streak = computeWorkoutWeekStreak(logs);
    if(profileCurrentStreak) profileCurrentStreak.innerHTML = `<span class="streak-flame">🔥</span> ${streak.current} wk`;
    if(profileBestStreak) profileBestStreak.textContent = `${streak.best} wk`;
  }
}

if(navEditProfile){
  navEditProfile.addEventListener('click', (e) => {
    e.preventDefault();

    if(profileBox){
      profileBox.scrollIntoView({ behavior:'smooth', block:'center' });
    }

    if(profileForm){
      profileForm.classList.add('show');
    }

    if(profileMessage){
      profileMessage.textContent = '';
      profileMessage.style.fontWeight = '';
    }

    setTimeout(() => {
      if(profileNameInput) profileNameInput.focus();
    }, 400);
  });
}

if(editProfileBtn){
  editProfileBtn.addEventListener('click', () => {
    profileForm.classList.add('show');
    profileMessage.textContent = '';
    profileMessage.style.fontWeight = '';
  });
}
if(cancelProfileBtn){
  cancelProfileBtn.addEventListener('click', () => {
    profileForm.classList.remove('show');
    profileMessage.textContent = '';
  });
}
if(saveProfileBtn){
  saveProfileBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { data: { session } } = await fpDb.auth.getSession();
    if(!session?.user){
      profileMessage.textContent = 'Log in first.';
      profileMessage.style.color = '#ff5a6b';
      return;
    }

    const user = session.user;
    const oldMeta = user.user_metadata || {};
    const display_name = profileNameInput.value.trim() || 'Gymcels.lol Member';
    const fp_start_date = profileStartInput.value || null;
    const bio = String(profileBioInput?.value || '').trim().slice(0,160);

    let avatar_url = oldMeta.avatar_url || null;
    let avatar_path = oldMeta.avatar_path || null;
    let physique_url = oldMeta.physique_url || null;
    let physique_path = oldMeta.physique_path || null;
    let newlyUploadedPath = null;
    let newlyUploadedPhysiquePath = null;

    const file = profilePhotoInput?.files?.[0] || null;
    const physiqueFile = profilePhysiqueInput?.files?.[0] || null;

    if(file){
      if(file.size > 5 * 1024 * 1024){
        profileMessage.textContent = 'Photo must be under 5 MB.';
        profileMessage.style.color = '#ff5a6b';
        return;
      }

      const allowed = ['image/jpeg','image/png','image/webp'];
      if(!allowed.includes(file.type)){
        profileMessage.textContent = 'Use a JPG, PNG, or WebP image.';
        profileMessage.style.color = '#ff5a6b';
        return;
      }

      profileMessage.textContent = 'Uploading profile photo...';
      profileMessage.style.color = '#9aa1ad';

      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      newlyUploadedPath = `${user.id}/avatar-${Date.now()}.${ext}`;

      const { error: uploadError } = await fpDb.storage
        .from('avatars')
        .upload(newlyUploadedPath, file, { contentType:file.type });

      if(uploadError){
        profileMessage.textContent = uploadError.message;
        profileMessage.style.color = '#ff5a6b';
        return;
      }

      const { data: publicData } = fpDb.storage
        .from('avatars')
        .getPublicUrl(newlyUploadedPath);

      avatar_url = publicData.publicUrl;
      avatar_path = newlyUploadedPath;
    }

    if(physiqueFile){
      if(physiqueFile.size > 8 * 1024 * 1024){
        if(newlyUploadedPath) await fpDb.storage.from('avatars').remove([newlyUploadedPath]);
        profileMessage.textContent = 'Physique photo must be under 8 MB.';
        profileMessage.style.color = '#ff5a6b';
        return;
      }

      const allowedPhysique = ['image/jpeg','image/png','image/webp'];
      if(!allowedPhysique.includes(physiqueFile.type)){
        if(newlyUploadedPath) await fpDb.storage.from('avatars').remove([newlyUploadedPath]);
        profileMessage.textContent = 'Use a JPG, PNG, or WebP physique photo.';
        profileMessage.style.color = '#ff5a6b';
        return;
      }

      profileMessage.textContent = 'Uploading physique photo...';
      profileMessage.style.color = '#9aa1ad';

      const physiqueExt = (physiqueFile.name.split('.').pop() || 'jpg').toLowerCase();
      newlyUploadedPhysiquePath = `${user.id}/physique-${Date.now()}.${physiqueExt}`;

      const { error: physiqueUploadError } = await fpDb.storage
        .from('physiques')
        .upload(newlyUploadedPhysiquePath, physiqueFile, { contentType:physiqueFile.type });

      if(physiqueUploadError){
        if(newlyUploadedPath) await fpDb.storage.from('avatars').remove([newlyUploadedPath]);
        profileMessage.textContent = physiqueUploadError.message;
        profileMessage.style.color = '#ff5a6b';
        return;
      }

      const { data: physiquePublicData } = fpDb.storage
        .from('physiques')
        .getPublicUrl(newlyUploadedPhysiquePath);

      physique_url = physiquePublicData.publicUrl;
      physique_path = newlyUploadedPhysiquePath;
    }

    profileMessage.textContent = 'Saving profile...';
    profileMessage.style.color = '#9aa1ad';

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
        await fpDb.storage.from('avatars').remove([newlyUploadedPath]);
      }
      if(newlyUploadedPhysiquePath){
        await fpDb.storage.from('physiques').remove([newlyUploadedPhysiquePath]);
      }
      profileMessage.textContent = error.message;
      profileMessage.style.color = '#ff5a6b';
      return;
    }

    // Remove the old avatar only after the new profile data saved successfully.
    if(newlyUploadedPath && oldMeta.avatar_path && oldMeta.avatar_path !== newlyUploadedPath){
      await fpDb.storage.from('avatars').remove([oldMeta.avatar_path]);
    }

    if(newlyUploadedPhysiquePath && oldMeta.physique_path && oldMeta.physique_path !== newlyUploadedPhysiquePath){
      await fpDb.storage.from('physiques').remove([oldMeta.physique_path]);
    }

    await fpDb
      .from('member_presence')
      .upsert({
        user_id: user.id,
        display_name,
        avatar_url,
        bio,
        physique_url,
        last_seen: new Date().toISOString()
      }, { onConflict:'user_id' });

    // Keep existing public chat messages visually synced with the member profile.
    await fpDb
      .from('messages')
      .update({ display_name, avatar_url })
      .eq('user_id', user.id);

    if(profilePhotoInput) profilePhotoInput.value = '';
    if(profilePhysiqueInput) profilePhysiqueInput.value = '';
    if(pendingPhysiquePreviewUrl){
      URL.revokeObjectURL(pendingPhysiquePreviewUrl);
      pendingPhysiquePreviewUrl = null;
    }
    if(profilePhysiqueNote){
      profilePhysiqueNote.textContent = 'Optional public physique photo. JPG, PNG, or WebP under 8 MB. Click Save Profile to apply it.';
      profilePhysiqueNote.classList.remove('ready');
    }
    if(pendingProfilePreviewUrl){
      URL.revokeObjectURL(pendingProfilePreviewUrl);
      pendingProfilePreviewUrl = null;
    }
    if(profilePhotoNote){
      profilePhotoNote.textContent = 'Choose a JPG, PNG, or WebP under 5 MB, then click Save Profile.';
      profilePhotoNote.classList.remove('ready');
    }

    profileMessage.textContent = '✓ PROFILE UPDATED';
    profileMessage.style.color = '#67e8a5';
    profileMessage.style.fontWeight = '900';

    await refreshMemberProfile();
    setTimeout(() => profileForm.classList.remove('show'), 900);
  });
}

if(profilePhotoInput){
  profilePhotoInput.addEventListener('change', () => {
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

    fpDb.auth.getSession().then(({ data }) => {
      const user = data?.session?.user;
      const meta = user?.user_metadata || {};
      renderProfileAvatar(
        profileNameInput?.value.trim() || meta.display_name || 'Gymcels.lol Member',
        user?.email || '',
        pendingProfilePreviewUrl
      );
    });

    if(profilePhotoNote){
      profilePhotoNote.textContent = '✓ Photo selected — click Save Profile to apply it.';
      profilePhotoNote.classList.add('ready');
    }
  });
}

if(profilePhysiqueInput){
  profilePhysiqueInput.addEventListener('change', () => {
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
      profilePhysiqueNote.textContent = '✓ Physique selected — click Save Profile to publish it.';
      profilePhysiqueNote.classList.add('ready');
    }
  });
}

// Keep profile synced with login/logout and workout log changes.
fpDb.auth.onAuthStateChange(() => {
  setTimeout(refreshMemberProfile, 0);
window.addEventListener('gymcelsWorkoutChanged', () => setTimeout(refreshMemberProfile, 100));
});
setTimeout(refreshMemberProfile, 0);

if(document.getElementById('workoutForm')){
  document.getElementById('workoutForm').addEventListener('submit', () => {
    setTimeout(refreshMemberProfile, 700);
  });
}




// ---- Gymcels.lol Community Chat ----
const communityChat = document.getElementById('communityChat');
const communitySection = document.getElementById('communitySection');

const siteUpdateBoard = document.getElementById('siteUpdateBoard');
const siteUpdateAdminComposer = document.getElementById('siteUpdateAdminComposer');
const siteUpdateInput = document.getElementById('siteUpdateInput');
const siteUpdateFontSize = document.getElementById('siteUpdateFontSize');
const siteUpdateColor = document.getElementById('siteUpdateColor');
const siteUpdatePreview = document.getElementById('siteUpdatePreview');
const siteUpdatePostBtn = document.getElementById('siteUpdatePostBtn');
const siteUpdateCancelEditBtn = document.getElementById('siteUpdateCancelEditBtn');
const siteUpdateCharCount = document.getElementById('siteUpdateCharCount');
const siteUpdateAdminStatus = document.getElementById('siteUpdateAdminStatus');
const siteUpdatesList = document.getElementById('siteUpdatesList');
let siteUpdatesPollTimer = null;
let siteUpdatePosting = false;
let siteUpdateEditingId = null;
let siteUpdateRowsById = new Map();
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatStatus = document.getElementById('chatStatus');
const chatReplyBar = document.getElementById('chatReplyBar');
const chatReplyName = document.getElementById('chatReplyName');
const chatReplyPreview = document.getElementById('chatReplyPreview');
const chatReplyCancel = document.getElementById('chatReplyCancel');
const mentionSuggestions = document.getElementById('mentionSuggestions');

const navNotifications = document.getElementById('navNotifications');
const notificationBadge = document.getElementById('notificationBadge');
const notificationPanel = document.getElementById('notificationPanel');
const notificationList = document.getElementById('notificationList');
const notificationMarkAll = document.getElementById('notificationMarkAll');
const pushAlertBtn = document.getElementById('pushAlertBtn');
const pushAlertState = document.getElementById('pushAlertState');
const pushInstallHelp = document.getElementById('pushInstallHelp');

const chatLevelBadge = document.getElementById('chatLevelBadge');
const chatLevelName = document.getElementById('chatLevelName');
const chatMessageCount = document.getElementById('chatMessageCount');
const chatNextLevel = document.getElementById('chatNextLevel');
const chatXpFill = document.getElementById('chatXpFill');
const chatAchievements = document.getElementById('chatAchievements');

const chatProfileOverlay = document.getElementById('chatProfileOverlay');
const chatProfileClose = document.getElementById('chatProfileClose');
const chatPublicAvatar = document.getElementById('chatPublicAvatar');
const chatPublicName = document.getElementById('chatPublicName');
const chatPublicVipBadge = document.getElementById('chatPublicVipBadge');
const chatPublicSub = document.getElementById('chatPublicSub');
const chatPublicLevel = document.getElementById('chatPublicLevel');
const chatPublicMessages = document.getElementById('chatPublicMessages');

const chatPublicWorkouts = document.getElementById('chatPublicWorkouts');
const chatPublicSets = document.getElementById('chatPublicSets');

const chatPublicCurrentStreak = document.getElementById('chatPublicCurrentStreak');
const chatPublicBestStreak = document.getElementById('chatPublicBestStreak');
const chatPublicBio = document.getElementById('chatPublicBio');
const chatPublicPhysique = document.getElementById('chatPublicPhysique');
const chatDmBtn = document.getElementById('chatDmBtn');
const chatModerationArea = document.getElementById('chatModerationArea');
const chatMuteState = document.getElementById('chatMuteState');
const chatMuteActionStatus = document.getElementById('chatMuteActionStatus');
const chatUnmuteBtn = document.getElementById('chatUnmuteBtn');
const chatPublicPostHistory = document.getElementById('chatPublicPostHistory');
const chatPublicHistoryCount = document.getElementById('chatPublicHistoryCount');
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
let openedChatDisplayName = 'Member';
let openedChatAvatarUrl = '';

const chatPublicStatus = document.getElementById('chatPublicStatus');
const chatPublicStaffBadge = document.getElementById('chatPublicStaffBadge');
const chatFriendArea = document.getElementById('chatFriendArea');
const chatFriendBtn = document.getElementById('chatFriendBtn');
const chatBlockBtn = document.getElementById('chatBlockBtn');
const chatFriendNote = document.getElementById('chatFriendNote');

let openedChatUserId = null;
let openedFriendship = null;
let openedBlockState = {blocked_by_me:false,blocked_me:false};

let blockedUserIdsCache = new Set();
let blockedUserIdsCacheAt = 0;

const friendsSection = document.getElementById('friendsSection');
const friendsList = document.getElementById('friendsList');
const incomingFriendsList = document.getElementById('incomingFriendsList');
const sentFriendsList = document.getElementById('sentFriendsList');
const friendsCount = document.getElementById('friendsCount');
const incomingCount = document.getElementById('incomingCount');
const sentCount = document.getElementById('sentCount');
const friendsRefreshBtn = document.getElementById('friendsRefreshBtn');
const friendsStatus = document.getElementById('friendsStatus');
const friendSearchInput = document.getElementById('friendSearchInput');
const friendSearchBtn = document.getElementById('friendSearchBtn');
const friendSearchResults = document.getElementById('friendSearchResults');
const friendSearchStatus = document.getElementById('friendSearchStatus');


const chatPublicAchievements = document.getElementById('chatPublicAchievements');
const staffAdminPanel = document.getElementById('staffAdminPanel');
const staffSearchInput = document.getElementById('staffSearchInput');
const staffSearchBtn = document.getElementById('staffSearchBtn');
const staffSearchResults = document.getElementById('staffSearchResults');
const staffMembersList = document.getElementById('staffMembersList');
const staffRefreshBtn = document.getElementById('staffRefreshBtn');
const staffPanelStatus = document.getElementById('staffPanelStatus');
let staffPanelLoadedForUser = null;




let chatPollTimer = null;
let chatSending = false;

function escapeChat(text){
  return String(text ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}


const publicVipCache = new Map();

async function getPublicVipStatus(userId, force=false){
  if(!userId) return false;
  if(!force && publicVipCache.has(userId)) return publicVipCache.get(userId);

  try{
    const client = window.gymcelsLolDb;
    if(!client) return false;

    const { data, error } = await client.rpc('public_member_vip_status', {
      target_user: userId
    });

    if(error) throw error;

    const isVip = data === true;
    publicVipCache.set(userId, isVip);
    return isVip;
  }catch(err){
    console.error('Public VIP status error:', err);
    return false;
  }
}

function vipBadgeMarkup(isVip){
  return isVip ? '<span class="chat-vip-badge">Gymcel VIP 🔱</span>' : '';
}


function staffBadgeMarkup(role){
  if(role === 'admin') return '<span class="staff-badge admin">Admin</span>';
  if(role === 'moderator') return '<span class="staff-badge moderator">Moderator</span>';
  return '';
}

async function loadPublicStaffRoles(userIds){
  const ids = [...new Set((userIds || []).filter(Boolean))];
  if(!ids.length) return {};

  try{
    const client = window.gymcelsLolDb;
    if(!client) return {};

    const {data,error} = await client.rpc('public_staff_roles',{target_users:ids});
    if(error) throw error;

    return Object.fromEntries((data || []).map(row => [row.user_id,row.role]));
  }catch(err){
    console.error('Staff badge load error:',err);
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

function setStaffPanelStatus(text='',type=''){
  if(!staffPanelStatus) return;
  staffPanelStatus.textContent = text;
  staffPanelStatus.className = `staff-panel-status ${type || ''}`;
}

function staffEditorCard(row){
  const isAdmin = row.role === 'admin';
  const roleText = isAdmin ? 'Administrator · all permissions'
    : (row.role === 'moderator' ? 'Moderator' : 'Member');
  const disabled = isAdmin ? ' disabled' : '';

  return `<div class="staff-admin-card" data-staff-user="${escapeChat(row.user_id || '')}">
    <div class="staff-admin-name">
      ${escapeChat(row.display_name || 'Member')}${staffBadgeMarkup(row.role)}
    </div>
    <div class="staff-admin-role">${escapeChat(roleText)}</div>

    <div class="staff-permission-grid">
      <label class="staff-permission-option">
        <input type="checkbox" data-staff-permission="chat_moderation"
          ${row.chat_moderation || isAdmin ? 'checked' : ''}${disabled}>
        <span><strong>Public Chat</strong><span>Delete messages and mute members from public chat.</span></span>
      </label>

      <label class="staff-permission-option">
        <input type="checkbox" data-staff-permission="thread_moderation"
          ${row.thread_moderation || isAdmin ? 'checked' : ''}${disabled}>
        <span><strong>Threads</strong><span>Delete threads/replies and lock or unlock threads.</span></span>
      </label>

      <label class="staff-permission-option">
        <input type="checkbox" data-staff-permission="voice_moderation"
          ${row.voice_moderation || isAdmin ? 'checked' : ''}${disabled}>
        <span><strong>Voice</strong><span>Kick members from Gymcel Crew voice rooms.</span></span>
      </label>
    </div>

    <div class="staff-admin-actions">
      <span class="staff-admin-note">
        ${isAdmin ? 'Admin permissions cannot be changed here.' : 'Uncheck everything and save to remove Moderator.'}
      </span>
      ${isAdmin ? '' : '<button class="staff-admin-save" type="button" data-save-staff-permissions>Save permissions</button>'}
    </div>
  </div>`;
}

async function loadCurrentStaffMembers(){
  if(!chatIsSiteAdmin || !staffMembersList) return;

  setStaffPanelStatus('Loading moderators...');

  try{
    const client = window.gymcelsLolDb;
    const {data,error} = await client.rpc('admin_list_staff_members');
    if(error) throw error;

    const rows = data || [];
    staffMembersList.innerHTML = rows.length
      ? rows.map(staffEditorCard).join('')
      : '<div class="staff-admin-empty">No moderators yet.</div>';

    setStaffPanelStatus('');
  }catch(err){
    staffMembersList.innerHTML = '<div class="staff-admin-empty">Could not load moderators.</div>';
    setStaffPanelStatus(err?.message || String(err),'error');
  }
}

async function searchStaffMembers(){
  if(!chatIsSiteAdmin || !staffSearchResults) return;

  const query = String(staffSearchInput?.value || '').trim();
  if(!query){
    staffSearchResults.innerHTML = '<div class="staff-admin-empty">Type a username first.</div>';
    return;
  }

  staffSearchResults.innerHTML = '<div class="staff-admin-empty">Searching...</div>';

  try{
    const client = window.gymcelsLolDb;
    const {data,error} = await client.rpc('admin_search_staff_members',{search_text:query});
    if(error) throw error;

    const rows = data || [];
    staffSearchResults.innerHTML = rows.length
      ? rows.map(staffEditorCard).join('')
      : '<div class="staff-admin-empty">No member found with that username.</div>';
  }catch(err){
    staffSearchResults.innerHTML = '<div class="staff-admin-empty">Search failed.</div>';
    setStaffPanelStatus(err?.message || String(err),'error');
  }
}

async function saveStaffPermissions(card){
  if(!chatIsSiteAdmin || !card) return;

  const userId = card.dataset.staffUser;
  const saveBtn = card.querySelector('[data-save-staff-permissions]');
  if(!userId || !saveBtn) return;

  const checked = name => !!card.querySelector(`[data-staff-permission="${name}"]`)?.checked;

  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  try{
    const client = window.gymcelsLolDb;
    const {error} = await client.rpc('set_member_moderator_permissions',{
      target_user:userId,
      allow_chat:checked('chat_moderation'),
      allow_threads:checked('thread_moderation'),
      allow_voice:checked('voice_moderation')
    });
    if(error) throw error;

    setStaffPanelStatus('✓ Moderator permissions updated.','success');
    await loadCurrentStaffMembers();
    if(staffSearchInput?.value.trim()) await searchStaffMembers();

    await loadCommunityChat(false);
    await loadThreads();
    if(activeThread) await openThread(activeThread.id);
  }catch(err){
    setStaffPanelStatus(err?.message || String(err),'error');
  }finally{
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save permissions';
  }
}

async function refreshStaffPanel(){
  if(!staffAdminPanel) return;

  if(!chatIsSiteAdmin){
    staffAdminPanel.classList.add('hidden');
    return;
  }

  staffAdminPanel.classList.remove('hidden');

  const session = await getChatSession();
  if(staffPanelLoadedForUser !== session?.user?.id){
    staffPanelLoadedForUser = session?.user?.id || null;
    await loadCurrentStaffMembers();
  }
}

staffSearchBtn?.addEventListener('click',searchStaffMembers);
staffSearchInput?.addEventListener('keydown',(e) => {
  if(e.key === 'Enter'){
    e.preventDefault();
    searchStaffMembers();
  }
});
staffRefreshBtn?.addEventListener('click',loadCurrentStaffMembers);

[staffSearchResults,staffMembersList].forEach(container => {
  container?.addEventListener('click',(e) => {
    const btn = e.target.closest('[data-save-staff-permissions]');
    if(btn) saveStaffPermissions(btn.closest('[data-staff-user]'));
  });
});


function chatDisplayName(user){
  return user?.user_metadata?.display_name ||
    (user?.email ? user.email.split('@')[0] : 'Member');
}


function chatInitials(name){
  const source = String(name || 'GL').trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0,2).toUpperCase();
}

function chatAvatarMarkup(row){
  const name = row.display_name || 'Member';
  const uid = escapeChat(row.user_id || '');
  const safeName = escapeChat(name);
  const safeAvatar = escapeChat(row.avatar_url || '');
  const onlineClass = row.is_online ? 'online' : '';

  const avatar = row.avatar_url
    ? `<div class="chat-avatar" data-chat-user="${uid}" data-chat-name="${safeName}" data-chat-avatar="${safeAvatar}"><img src="${safeAvatar}" alt="${safeName} profile photo"></div>`
    : `<div class="chat-avatar" data-chat-user="${uid}" data-chat-name="${safeName}" data-chat-avatar="">${escapeChat(chatInitials(name))}</div>`;

  return `<div class="chat-avatar-wrap">${avatar}<span class="chat-presence-dot ${onlineClass}" title="${row.is_online ? 'Online' : 'Offline'}"></span></div>`;
}

function setChatStatus(message, type='normal'){
  if(!chatStatus) return;
  chatStatus.textContent = message;
  chatStatus.style.fontWeight = type === 'success' ? '900' : '700';
  chatStatus.style.color =
    type === 'error' ? '#ff5a6b' :
    type === 'success' ? '#67e8a5' :
    '#9aa1ad';
}


function setCommunityChatAuthState(session){
  const signedIn = !!session?.user;

  if(communitySection) communitySection.style.display = '';
  if(communityChat) communityChat.style.display = '';

  if(chatInput){
    chatInput.disabled = !signedIn;
    chatInput.placeholder = signedIn
      ? (chatReplyTarget ? `Reply to ${chatReplyTarget.display_name || 'Member'}...` : 'Say something to the community...')
      : 'Log in to join the conversation...';
  }

  if(chatSendBtn){
    chatSendBtn.disabled = !signedIn;
    chatSendBtn.textContent = signedIn ? 'Send' : 'Log in to send';
  }

  if(chatLevelCard){
    chatLevelCard.style.display = signedIn ? '' : 'none';
  }

  if(!signedIn){
    setChatStatus('You can read the public chat. Log in to send a message.');
    if(chatStatus) chatStatus.classList.add('chat-guest-note');
  }else{
    if(chatStatus?.classList) chatStatus.classList.remove('chat-guest-note');
    if(chatStatus?.textContent === 'You can read the public chat. Log in to send a message.'){
      chatStatus.textContent = '';
    }
  }

  return signedIn;
}

async function getChatSession(){
  const client = window.gymcelsLolDb;
  if(!client) throw new Error('Chat database connection is not ready.');
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
    const {data,error} = await client.rpc('member_block_state',{
      target_user:targetUserId
    });
    if(error) throw error;

    return {
      blocked_by_me:data?.blocked_by_me === true,
      blocked_me:data?.blocked_me === true
    };
  }catch(err){
    console.error('Block state error:',err);
    return {blocked_by_me:false,blocked_me:false};
  }
}

async function getMyBlockedUserIds(force=false){
  const now = Date.now();

  if(!force && now - blockedUserIdsCacheAt < 12000){
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

    const {data,error} = await client.rpc('my_blocked_user_ids');
    if(error) throw error;

    blockedUserIdsCache = new Set(
      (data || []).map(row => String(row.blocked_id || '')).filter(Boolean)
    );
    blockedUserIdsCacheAt = now;
  }catch(err){
    console.error('Blocked users load error:',err);
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
  { name:'First Message', icon:'💬', test:s => s.messages >= 1, hint:'Send 1 public message' },
  { name:'Regular', icon:'🔥', test:s => s.messages >= 10, hint:'Send 10 public messages' },
  { name:'Century Club', icon:'💯', test:s => s.messages >= 100, hint:'Send 100 public messages' },
  { name:'Chat Veteran', icon:'🏆', test:s => s.messages >= 250, hint:'Send 250 public messages' },
  { name:'Gymcels Legend', icon:'👑', test:s => s.messages >= 500, hint:'Send 500 public messages' },

  { name:'Thread Starter', icon:'🧵', test:s => s.threads >= 1, hint:'Create your first thread' },
  { name:'Discussion Leader', icon:'📌', test:s => s.threads >= 10, hint:'Create 10 threads' },
  { name:'Helpful Gymcel', icon:'🤝', test:s => s.replies >= 10, hint:'Post 10 thread replies' },
  { name:'Reply Machine', icon:'⚡', test:s => s.replies >= 50, hint:'Post 50 thread replies' },

  { name:'First Workout', icon:'🏋️', test:s => s.workouts >= 1, hint:'Log your first workout' },
  { name:'Gym Regular', icon:'💪', test:s => s.workouts >= 10, hint:'Log 10 workouts' },
  { name:'Iron Addict', icon:'🦾', test:s => s.workouts >= 50, hint:'Log 50 workouts' },
  { name:'100 Sets', icon:'📈', test:s => s.sets >= 100, hint:'Log 100 workout sets' },
  { name:'500 Sets', icon:'🚀', test:s => s.sets >= 500, hint:'Log 500 workout sets' },

  { name:'4 Week Streak', icon:'🔥', test:s => s.bestStreak >= 4, hint:'Reach a 4-week workout streak' },
  { name:'12 Week Streak', icon:'🏅', test:s => s.bestStreak >= 12, hint:'Reach a 12-week workout streak' }
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
    if(count >= level.min) current = level;
  }
  return current;
}

function renderChatAchievements(count,extras={}){
  if(!chatAchievements) return;
  const stats = normalizedAchievementStats({...extras,messages:Number(count || 0)});

  chatAchievements.innerHTML = CHAT_ACHIEVEMENTS.map(a => {
    const unlocked = !!a.test(stats);
    return `<div class="chat-achievement ${unlocked ? 'unlocked' : ''}"
                 title="${escapeChat(unlocked ? 'Unlocked' : a.hint)}">
      <span class="lock">${unlocked ? a.icon : '🔒'}</span>${escapeChat(a.name)}
    </div>`;
  }).join('');
}

async function refreshChatLevel(){
  try{
    const client = window.gymcelsLolDb;
    if(!client) return;

    const session = await getChatSession();
    if(!session?.user) return;

    const { data: stat, error } = await client
      .from('chat_stats')
      .select('lifetime_messages')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if(error) throw error;

    const total = Number(stat?.lifetime_messages || 0);
    const info = getChatLevelInfo(total);

    if(chatLevelBadge) chatLevelBadge.textContent = info.level;
    if(chatLevelName) chatLevelName.textContent = `Community Level ${info.level}`;
    if(chatMessageCount) chatMessageCount.textContent = `${total} message${total === 1 ? '' : 's'} sent`;

    if(info.next === null){
      if(chatNextLevel) chatNextLevel.textContent = 'MAX LEVEL — Gymcels.lol Legend';
      if(chatXpFill) chatXpFill.style.width = '100%';
    }else{
      const needed = Math.max(0, info.next - total);
      if(chatNextLevel) chatNextLevel.textContent =
        `Send ${needed} more message${needed === 1 ? '' : 's'} to reach Level ${info.level + 1}`;

      const span = info.next - info.min;
      const progress = span > 0 ? ((total - info.min) / span) * 100 : 100;
      if(chatXpFill) chatXpFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }

    const [threadCountRes,replyCountRes,workoutRes,streakRes] = await Promise.all([
      client.from('forum_threads').select('id',{count:'exact',head:true}).eq('author_id',session.user.id),
      client.from('forum_replies').select('id',{count:'exact',head:true}).eq('author_id',session.user.id),
      client.rpc('get_public_member_stats',{target_user:session.user.id}),
      client.rpc('get_public_member_streaks',{target_user:session.user.id})
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
    console.error('Chat level error:', err);
  }
}



const ONLINE_WINDOW_MS = 120000; // online if seen within the last 2 minutes
let presenceTimer = null;

function isPresenceOnline(lastSeen){
  if(!lastSeen) return false;
  return (Date.now() - new Date(lastSeen).getTime()) <= ONLINE_WINDOW_MS;
}

function renderPublicPresence(lastSeen){
  if(!chatPublicStatus) return;
  const online = isPresenceOnline(lastSeen);
  chatPublicStatus.className = `chat-public-status ${online ? 'online' : 'offline'}`;
  chatPublicStatus.innerHTML = `<span class="status-dot"></span><span>${online ? 'Online' : 'Offline'}</span>`;
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
      .from('member_presence')
      .upsert({
        user_id: user.id,
        display_name: meta.display_name || (user.email ? user.email.split('@')[0] : 'Member'),
        avatar_url: meta.avatar_url || null,
        bio: String(meta.bio || '').slice(0,160),
        last_seen: new Date().toISOString()
      }, { onConflict:'user_id' });
  }catch(err){
    console.error('Presence heartbeat error:', err);
  }
}

function startPresenceHeartbeat(){
  clearInterval(presenceTimer);
  updateOwnPresence();
  presenceTimer = setInterval(updateOwnPresence, 30000);
}

document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'visible') updateOwnPresence();
});


function pinnedFriendStorageKey(ownerUserId){
  return `gymcels_pinned_friends:${ownerUserId || 'guest'}`;
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
  return getPinnedFriendIds(ownerUserId).has(String(friendUserId || ''));
}

function togglePinnedFriend(ownerUserId, friendUserId){
  const friendId = String(friendUserId || '');
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
  const removed = ids.delete(String(friendUserId || ''));
  if(removed) savePinnedFriendIds(ownerUserId, ids);
}

function friendOtherUserId(row, me){
  if(!row) return '';
  return row.requester_id === me ? row.addressee_id : row.requester_id;
}

function sortPinnedFirst(items, ownerUserId, idGetter){
  const pins = getPinnedFriendIds(ownerUserId);

  return [...items].sort((a,b) => {
    const aId = String(idGetter(a) || '');
    const bId = String(idGetter(b) || '');
    const aPinned = pins.has(aId) ? 1 : 0;
    const bPinned = pins.has(bId) ? 1 : 0;

    if(aPinned !== bPinned) return bPinned - aPinned;
    return 0;
  });
}


function friendAvatarMarkup(person, online){
  const name = person?.display_name || 'Member';
  const avatar = person?.avatar_url || '';
  const avatarInner = avatar
    ? `<div class="friend-mini-avatar"><img src="${escapeChat(avatar)}" alt="${escapeChat(name)} profile photo"></div>`
    : `<div class="friend-mini-avatar">${escapeChat(chatInitials(name))}</div>`;

  return `<div class="friend-mini-avatar-wrap">
    ${avatarInner}
    <span class="friend-mini-dot ${online ? 'online' : ''}"></span>
  </div>`;
}

async function getPresenceMapForUsers(userIds){
  const client = window.gymcelsLolDb;
  if(!client || !userIds.length) return {};

  const { data, error } = await client
    .from('member_presence')
    .select('user_id,display_name,avatar_url,last_seen')
    .in('user_id', userIds);

  if(error) throw error;

  const map = Object.fromEntries((data || []).map(row => [row.user_id, row]));

  const vipEntries = await Promise.all(
    userIds.map(async uid => [uid, await getPublicVipStatus(uid)])
  );

  for(const [uid, isVip] of vipEntries){
    if(!map[uid]) map[uid] = { user_id:uid, display_name:'Member', avatar_url:null, last_seen:null };
    map[uid].is_vip = !!isVip;
  }

  return map;
}

function renderFriendPersonRow(person, extraHtml=''){
  const online = isPresenceOnline(person?.last_seen);
  const userId = escapeChat(person?.user_id || '');
  const name = escapeChat(person?.display_name || 'Member');
  const avatar = escapeChat(person?.avatar_url || '');

  return `<div class="friend-row">
    <div class="friend-row-click" data-chat-user="${userId}" data-chat-name="${name}" data-chat-avatar="${avatar}" style="display:flex;align-items:center;gap:9px;flex:1;min-width:0">
      ${friendAvatarMarkup(person, online)}
      <div class="friend-main">
        <div class="friend-name">${name}${person?.is_vip ? '<span class="friend-vip-badge">VIP 🔱</span>' : ''}</div>
        <div class="friend-state ${online ? 'online' : ''}">${online ? 'Online' : 'Offline'}</div>
      </div>
    </div>
    ${extraHtml}
  </div>`;
}


function setFriendSearchStatus(text='', type='normal'){
  if(!friendSearchStatus) return;
  friendSearchStatus.textContent = text;
  friendSearchStatus.style.color =
    type === 'error' ? '#ff7c89' :
    type === 'success' ? '#67e8a5' :
    '#8e96a3';
  friendSearchStatus.style.fontWeight = type === 'error' || type === 'success' ? '800' : '';
}

async function searchFriendsByUsername(){
  if(!friendSearchResults) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setFriendSearchStatus('Log in to search for friends.','error');
    return;
  }

  const query = String(friendSearchInput?.value || '').trim();
  if(query.length < 1){
    friendSearchResults.innerHTML = '<div class="friend-search-empty">Type a username first.</div>';
    setFriendSearchStatus('');
    return;
  }

  if(friendSearchBtn) friendSearchBtn.disabled = true;
  setFriendSearchStatus('Searching...');

  try{
    const { data, error } = await client
      .from('member_presence')
      .select('user_id,display_name,avatar_url,last_seen')
      .ilike('display_name', `%${query}%`)
      .neq('user_id', session.user.id)
      .order('display_name', { ascending:true })
      .limit(10);

    if(error) throw error;

    const blockedIds = await getMyBlockedUserIds();
    const people = (data || []).filter(
      person => !blockedIds.has(String(person.user_id || ''))
    );

    if(!people.length){
      friendSearchResults.innerHTML = '<div class="friend-search-empty">No members found with that username.</div>';
      setFriendSearchStatus('');
      return;
    }

    const enriched = await Promise.all(
      people.map(async person => {
        let friendship = null;
        let isVip = false;

        try{ friendship = await getFriendshipState(person.user_id); }catch(_){}
        try{ isVip = await getPublicVipStatus(person.user_id); }catch(_){}

        return {...person, friendship, is_vip:isVip};
      })
    );

    friendSearchResults.innerHTML = enriched.map(person => {
      const online = isPresenceOnline(person.last_seen);
      const safeId = escapeChat(person.user_id);
      const safeName = escapeChat(person.display_name || 'Member');
      const safeAvatar = escapeChat(person.avatar_url || '');

      let actionLabel = 'Add Friend';
      let actionClass = '';
      let action = 'add';
      let disabled = '';

      if(person.friendship?.status === 'accepted'){
        actionLabel = 'Friends ✓';
        actionClass = ' secondary';
        action = 'none';
        disabled = ' disabled';
      }else if(person.friendship?.status === 'pending' && person.friendship.requester_id === session.user.id){
        actionLabel = 'Request Sent';
        actionClass = ' secondary';
        action = 'none';
        disabled = ' disabled';
      }else if(person.friendship?.status === 'pending' && person.friendship.addressee_id === session.user.id){
        actionLabel = 'Accept';
        action = 'accept';
      }

      return `
        <div class="friend-search-result">
          <div class="friend-search-result-main"
               data-chat-user="${safeId}"
               data-chat-name="${safeName}"
               data-chat-avatar="${safeAvatar}">
            ${friendAvatarMarkup(person, online)}
            <div style="min-width:0;flex:1">
              <div class="friend-search-result-name">${safeName}${person.is_vip ? '<span class="friend-vip-badge">VIP 🔱</span>' : ''}</div>
              <div class="friend-search-result-state">${online ? 'Online' : 'Offline'}</div>
            </div>
          </div>
          <button class="friend-search-action${actionClass}"
                  type="button"
                  data-search-friend-action="${action}"
                  data-search-friend-user="${safeId}"
                  data-search-friendship-id="${person.friendship?.id || ''}"${disabled}>${actionLabel}</button>
        </div>`;
    }).join('');

    setFriendSearchStatus(`${enriched.length} member${enriched.length === 1 ? '' : 's'} found.`);
  }catch(err){
    friendSearchResults.innerHTML = '<div class="friend-search-empty">Could not search members.</div>';
    setFriendSearchStatus(err?.message || String(err),'error');
  }finally{
    if(friendSearchBtn) friendSearchBtn.disabled = false;
  }
}

async function handleFriendSearchAction(e){
  const btn = e.target.closest('[data-search-friend-action]');
  if(!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const action = btn.dataset.searchFriendAction;
  const targetUser = btn.dataset.searchFriendUser;
  const friendshipId = Number(btn.dataset.searchFriendshipId);

  if(!targetUser || action === 'none') return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  btn.disabled = true;
  setFriendSearchStatus(action === 'accept' ? 'Accepting request...' : 'Sending request...');

  try{
    if(action === 'accept'){
      const { error } = await client.rpc('accept_friend_request', {
        friendship_id: friendshipId
      });
      if(error) throw error;

      setFriendSearchStatus('✓ FRIEND REQUEST ACCEPTED','success');
    }else{
      const { error } = await client.rpc('send_friend_request', {
        target_user: targetUser
      });
      if(error) throw error;

      setFriendSearchStatus('✓ FRIEND REQUEST SENT','success');
    }

    await loadFriendsSection();
    await searchFriendsByUsername();
    await loadNotifications();
  }catch(err){
    setFriendSearchStatus(err?.message || String(err),'error');
    btn.disabled = false;
  }
}

if(friendSearchBtn){
  friendSearchBtn.addEventListener('click', searchFriendsByUsername);
}

if(friendSearchInput){
  friendSearchInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
      searchFriendsByUsername();
    }
  });
}

if(friendSearchResults){
  friendSearchResults.addEventListener('click', handleFriendSearchAction);
}


async function loadFriendsSection(){
  if(!friendsSection) return;

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error('Friends database connection is not ready.');

    const session = await getChatSession();
    if(!session?.user){
      friendsSection.style.display = 'none';
      return;
    }

    friendsSection.style.display = '';
    if(friendsStatus) friendsStatus.textContent = 'Loading...';

    const me = session.user.id;

    const { data: rows, error } = await client
      .from('friendships')
      .select('id,requester_id,addressee_id,status,created_at')
      .or(`requester_id.eq.${me},addressee_id.eq.${me}`)
      .order('created_at', { ascending:false });

    if(error) throw error;

    const friendships = rows || [];
    const otherIds = [...new Set(friendships.map(row =>
      row.requester_id === me ? row.addressee_id : row.requester_id
    ).filter(Boolean))];

    const presenceMap = await getPresenceMapForUsers(otherIds);

    const accepted = sortPinnedFirst(
      friendships.filter(row => row.status === 'accepted'),
      me,
      row => friendOtherUserId(row,me)
    );
    const incoming = friendships.filter(row => row.status === 'pending' && row.addressee_id === me);
    const sent = friendships.filter(row => row.status === 'pending' && row.requester_id === me);

    friendsCount.textContent = accepted.length;
    incomingCount.textContent = incoming.length;
    sentCount.textContent = sent.length;

    friendsList.innerHTML = accepted.length
      ? accepted.map(row => {
          const otherId = row.requester_id === me ? row.addressee_id : row.requester_id;
          const person = presenceMap[otherId] || {user_id:otherId,display_name:'Member',avatar_url:null,last_seen:null};
          const pinned = isFriendPinned(me,otherId);

          return renderFriendPersonRow(
            person,
            `<div class="friend-actions">
              <button class="friend-action pin ${pinned ? 'pinned' : ''}" type="button"
                data-friend-pin-user="${escapeChat(otherId)}"
                title="${pinned ? 'Unpin friend' : 'Pin friend'}">${pinned ? '📌 Pinned' : '📌 Pin'}</button>
              <button class="friend-action" type="button"
                data-dm-user="${escapeChat(otherId)}"
                data-dm-name="${escapeChat(person.display_name || 'Member')}"
                data-dm-avatar="${escapeChat(person.avatar_url || '')}">Message</button>
              <button class="friend-action secondary" type="button"
                data-friend-remove="${row.id}"
                data-friend-remove-user="${escapeChat(otherId)}">Remove</button>
            </div>`
          );
        }).join('')
      : '<div class="friend-empty">No friends yet. Search a username above or click someone in chat.</div>';

    incomingFriendsList.innerHTML = incoming.length
      ? incoming.map(row => {
          const person = presenceMap[row.requester_id] || {user_id:row.requester_id,display_name:'Member',avatar_url:null,last_seen:null};
          return renderFriendPersonRow(
            person,
            `<div class="friend-actions">
              <button class="friend-action" type="button" data-friend-accept="${row.id}">Accept</button>
              <button class="friend-action secondary" type="button" data-friend-remove="${row.id}">Decline</button>
            </div>`
          );
        }).join('')
      : '<div class="friend-empty">No incoming requests.</div>';

    sentFriendsList.innerHTML = sent.length
      ? sent.map(row => {
          const person = presenceMap[row.addressee_id] || {user_id:row.addressee_id,display_name:'Member',avatar_url:null,last_seen:null};
          return renderFriendPersonRow(
            person,
            `<div class="friend-actions"><button class="friend-action secondary" type="button" data-friend-remove="${row.id}">Cancel</button></div>`
          );
        }).join('')
      : '<div class="friend-empty">No pending requests.</div>';

    if(friendsStatus) friendsStatus.textContent = '';
  }catch(err){
    if(friendsStatus){
      friendsStatus.textContent = 'Friends error: ' + (err?.message || String(err));
      friendsStatus.style.color = '#ff5a6b';
    }
    console.error('Friends section error:', err);
  }
}

async function handleFriendsSectionAction(e){
  const pinBtn = e.target.closest('[data-friend-pin-user]');
  const acceptBtn = e.target.closest('[data-friend-accept]');
  const removeBtn = e.target.closest('[data-friend-remove]');
  if(!pinBtn && !acceptBtn && !removeBtn) return;

  e.preventDefault();
  e.stopPropagation();

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error('Friends database connection is not ready.');

    const session = await getChatSession();
    if(!session?.user) throw new Error('Log in first.');

    if(pinBtn){
      togglePinnedFriend(session.user.id,pinBtn.dataset.friendPinUser);
      await loadFriendsSection();
      await loadDmFriends();
      return;
    }

    if(acceptBtn){
      const friendshipId = Number(acceptBtn.dataset.friendAccept);
      const { error } = await client.rpc('accept_friend_request', { friendship_id: friendshipId });
      if(error) throw error;
    }

    if(removeBtn){
      const friendshipId = Number(removeBtn.dataset.friendRemove);
      const removedUserId = removeBtn.dataset.friendRemoveUser || '';
      const { error } = await client.rpc('remove_friendship', { friendship_id: friendshipId });
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
      friendsStatus.style.color = '#ff5a6b';
    }
  }
}

[friendsList, incomingFriendsList, sentFriendsList].forEach(list => {
  if(list) list.addEventListener('click', handleFriendsSectionAction);
});

if(friendsRefreshBtn){
  friendsRefreshBtn.addEventListener('click', () => loadFriendsSection());
}

if(navFriends){
  navFriends.addEventListener('click', () => {
    setTimeout(loadFriendsSection, 50);
  });
}

async function getFriendshipState(targetUserId){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user || !targetUserId) return null;

  const { data, error } = await client
    .from('friendships')
    .select('id,requester_id,addressee_id,status,created_at')
    .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`)
    .limit(10);

  if(error) throw error;

  return (data || []).find(row =>
    (row.requester_id === session.user.id && row.addressee_id === targetUserId) ||
    (row.requester_id === targetUserId && row.addressee_id === session.user.id)
  ) || null;
}

async function renderFriendButton(targetUserId){
  if(!chatFriendBtn || !chatFriendArea) return;

  if(chatDmBtn) chatDmBtn.classList.add('hidden');
  if(chatBlockBtn) chatBlockBtn.classList.add('hidden');

  const session = await getChatSession();

  if(!session?.user){
    chatFriendArea.style.display = 'none';
    return;
  }

  if(targetUserId === session.user.id){
    chatFriendArea.style.display = 'none';
    openedFriendship = null;
    openedBlockState = {blocked_by_me:false,blocked_me:false};
    return;
  }

  chatFriendArea.style.display = '';
  chatFriendNote.textContent = '';
  chatFriendNote.style.color = '';

  openedBlockState = await getMemberBlockState(targetUserId);

  if(chatBlockBtn){
    chatBlockBtn.classList.remove('hidden');
    chatBlockBtn.textContent = openedBlockState.blocked_by_me ? 'Unblock' : 'Block';
    chatBlockBtn.classList.toggle('active',openedBlockState.blocked_by_me);
  }

  if(openedBlockState.blocked_by_me || openedBlockState.blocked_me){
    chatFriendBtn.classList.add('hidden');
    if(chatDmBtn) chatDmBtn.classList.add('hidden');
    openedFriendship = null;

    chatFriendNote.textContent = openedBlockState.blocked_by_me
      ? 'You blocked this member.'
      : 'Friend and DM actions are unavailable.';
    return;
  }

  chatFriendBtn.classList.remove('hidden');
  openedFriendship = await getFriendshipState(targetUserId);

  chatFriendBtn.disabled = false;
  chatFriendBtn.classList.remove('secondary');

  if(!openedFriendship){
    chatFriendBtn.textContent = 'Add Friend';
    chatFriendNote.textContent = 'Send a friend request.';
    return;
  }

  if(openedFriendship.status === 'accepted'){
    chatFriendBtn.textContent = 'Friends ✓';
    chatFriendBtn.classList.add('secondary');
    chatFriendNote.textContent = 'Click to remove friend.';
    if(chatDmBtn) chatDmBtn.classList.remove('hidden');
    return;
  }

  if(openedFriendship.requester_id === session.user.id){
    chatFriendBtn.textContent = 'Request Sent';
    chatFriendBtn.classList.add('secondary');
    chatFriendNote.textContent = 'Click to cancel request.';
  }else{
    chatFriendBtn.textContent = 'Accept Friend';
    chatFriendNote.textContent = 'This member sent you a request.';
  }
}

async function handleFriendAction(){
  if(!openedChatUserId || !chatFriendBtn) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  chatFriendBtn.disabled = true;
  chatFriendNote.textContent = 'Updating...';

  try{
    if(!openedFriendship){
      const { error } = await client.rpc('send_friend_request', {
        target_user: openedChatUserId
      });
      if(error) throw error;
    }else if(openedFriendship.status === 'accepted'){
      const { error } = await client.rpc('remove_friendship', {
        friendship_id: openedFriendship.id
      });
      if(error) throw error;
    }else if(openedFriendship.addressee_id === session.user.id){
      const { error } = await client.rpc('accept_friend_request', {
        friendship_id: openedFriendship.id
      });
      if(error) throw error;
    }else{
      const { error } = await client.rpc('remove_friendship', {
        friendship_id: openedFriendship.id
      });
      if(error) throw error;
    }

    await renderFriendButton(openedChatUserId);
    await loadFriendsSection();
  }catch(err){
    chatFriendNote.textContent = err?.message || String(err);
    chatFriendNote.style.color = '#ff5a6b';
    chatFriendBtn.disabled = false;
  }
}

if(chatFriendBtn){
  chatFriendBtn.addEventListener('click', handleFriendAction);
}

async function handleBlockAction(){
  if(!openedChatUserId || !chatBlockBtn) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user || openedChatUserId === session.user.id) return;

  const blocking = !openedBlockState.blocked_by_me;
  const name = openedChatDisplayName || 'this member';

  if(blocking && !confirm(
    `Block ${name}? This removes any friendship and stops friend requests, DMs, and private calls between you.`
  )){
    return;
  }

  chatBlockBtn.disabled = true;
  chatFriendNote.textContent = blocking ? 'Blocking...' : 'Unblocking...';

  try{
    const {error} = await client.rpc(
      blocking ? 'block_member' : 'unblock_member',
      {target_user:openedChatUserId}
    );
    if(error) throw error;

    if(blocking){
      try{ unpinFriend(session.user.id,openedChatUserId); }catch(_){}

      if(typeof dmActiveUserId !== 'undefined' && dmActiveUserId === openedChatUserId){
        clearInterval(dmPollTimer);
        clearInterval(dmTypingPollTimer);
        clearOwnDmTyping(dmActiveUserId);
        dmActiveUserId = null;
        dmLastRenderConversation = '';
        dmLastRenderSignature = '';
        dmRowsById = new Map();
        clearDmReply();
        hideDmTypingIndicator();
        dmClearPendingFiles();

        if(dmThreadName) dmThreadName.textContent = 'Select a friend';
        if(dmThreadState) dmThreadState.textContent = 'Choose someone from your friends list.';
        if(dmMessages) dmMessages.innerHTML = '<div class="dm-empty">This conversation is unavailable while the member is blocked.</div>';
        if(dmInput) dmInput.disabled = true;
        if(dmSendBtn) dmSendBtn.disabled = true;
        if(dmPhotoBtn) dmPhotoBtn.disabled = true;
        if(dmAttachBtn) dmAttachBtn.disabled = true;
        if(dmCallBtn) dmCallBtn.classList.add('hidden');
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

    chatFriendNote.textContent = blocking ? '✓ Member blocked.' : '✓ Member unblocked.';
  }catch(err){
    chatFriendNote.textContent = err?.message || String(err);
    chatFriendNote.style.color = '#ff7c89';
  }finally{
    chatBlockBtn.disabled = false;
  }
}

chatBlockBtn?.addEventListener('click',handleBlockAction);


function renderPublicAchievements(count,extras={}){
  if(!chatPublicAchievements) return;
  const stats = normalizedAchievementStats({...extras,messages:Number(count || 0)});

  chatPublicAchievements.innerHTML = CHAT_ACHIEVEMENTS.map(a => {
    const unlocked = !!a.test(stats);
    return `<div class="chat-achievement ${unlocked ? 'unlocked' : ''}"
                 title="${escapeChat(unlocked ? 'Unlocked' : a.hint)}">
      <span class="lock">${unlocked ? a.icon : '🔒'}</span>${escapeChat(a.name)}
    </div>`;
  }).join('');
}


function setChatMuteActionStatus(text='',type=''){
  if(!chatMuteActionStatus) return;
  chatMuteActionStatus.textContent = text;
  chatMuteActionStatus.className = `chat-mute-action-status ${type || ''}`;
}

function formatMuteUntil(value){
  if(!value) return '';
  return new Date(value).toLocaleString([],{
    month:'short',day:'numeric',hour:'numeric',minute:'2-digit'
  });
}

async function loadProfileMuteControls(targetUserId){
  if(!chatModerationArea) return;

  const session = await getChatSession();
  const mayModerate = !!session?.user &&
    targetUserId !== session.user.id &&
    canModerateChat();

  chatModerationArea.classList.toggle('hidden',!mayModerate);
  if(!mayModerate) return;

  if(chatMuteState){
    chatMuteState.textContent = 'Checking mute status...';
    chatMuteState.classList.remove('active');
  }
  setChatMuteActionStatus('');

  try{
    const client = window.gymcelsLolDb;
    const {data,error} = await client.rpc('get_chat_mute_status',{
      target_user:targetUserId
    });
    if(error) throw error;

    const status = Array.isArray(data) ? data[0] : data;
    if(status?.is_muted){
      chatMuteState.textContent =
        `Muted until ${formatMuteUntil(status.muted_until)}${status.reason ? ` · ${status.reason}` : ''}`;
      chatMuteState.classList.add('active');
    }else{
      chatMuteState.textContent = 'Not muted.';
      chatMuteState.classList.remove('active');
    }
  }catch(err){
    chatMuteState.textContent = err?.message || 'Could not load mute status.';
  }
}

async function muteOpenedProfile(durationMinutes){
  if(!openedChatUserId || !canModerateChat()) return;

  const labels={10:'10 minutes',60:'1 hour',1440:'24 hours',10080:'7 days'};
  const label=labels[Number(durationMinutes)] || `${durationMinutes} minutes`;

  if(!confirm(`Mute ${openedChatDisplayName || 'this member'} from public chat for ${label}?`)) return;

  try{
    setChatMuteActionStatus('Muting...');
    const client=window.gymcelsLolDb;
    const {error}=await client.rpc('mute_chat_member',{
      target_user:openedChatUserId,
      duration_minutes:Number(durationMinutes),
      mute_reason:'Muted by Gymcels moderation'
    });
    if(error) throw error;

    setChatMuteActionStatus(`✓ Muted for ${label}.`,'success');
    await loadProfileMuteControls(openedChatUserId);
  }catch(err){
    setChatMuteActionStatus(err?.message || String(err),'error');
  }
}

async function unmuteOpenedProfile(){
  if(!openedChatUserId || !canModerateChat()) return;

  try{
    setChatMuteActionStatus('Unmuting...');
    const client=window.gymcelsLolDb;
    const {error}=await client.rpc('unmute_chat_member',{target_user:openedChatUserId});
    if(error) throw error;

    setChatMuteActionStatus('✓ Member unmuted.','success');
    await loadProfileMuteControls(openedChatUserId);
  }catch(err){
    setChatMuteActionStatus(err?.message || String(err),'error');
  }
}

async function loadPublicPostHistory(userId){
  if(!chatPublicPostHistory) return {threads:0,replies:0};

  chatPublicPostHistory.innerHTML='<div class="chat-public-history-empty">Loading activity...</div>';

  try{
    const client=window.gymcelsLolDb;
    const [threadsRes,repliesRes]=await Promise.all([
      client.from('forum_threads')
        .select('id,title,body,created_at,media_url,media_urls')
        .eq('author_id',userId)
        .order('created_at',{ascending:false})
        .limit(8),
      client.from('forum_replies')
        .select('id,thread_id,body,created_at,media_url,media_urls')
        .eq('author_id',userId)
        .order('created_at',{ascending:false})
        .limit(8)
    ]);

    if(threadsRes.error) throw threadsRes.error;
    if(repliesRes.error) throw repliesRes.error;

    const threads=threadsRes.data || [];
    const replies=repliesRes.data || [];
    const parentIds=[...new Set(replies.map(x=>Number(x.thread_id)).filter(Boolean))];
    let titleMap={};

    if(parentIds.length){
      const {data,error}=await client.from('forum_threads').select('id,title').in('id',parentIds);
      if(!error) titleMap=Object.fromEntries((data||[]).map(row=>[Number(row.id),row.title || 'Thread']));
    }

    const activity=[
      ...threads.map(row=>({
        type:'thread',thread_id:Number(row.id),created_at:row.created_at,
        title:row.title || 'Thread',text:String(row.body || '').trim(),
        hasPhoto:threadAllMedia(row).length>0
      })),
      ...replies.map(row=>({
        type:'reply',thread_id:Number(row.thread_id),created_at:row.created_at,
        title:`Reply in ${titleMap[Number(row.thread_id)] || 'thread'}`,
        text:String(row.body || '').trim(),hasPhoto:threadAllMedia(row).length>0
      }))
    ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,10);

    if(!activity.length){
      chatPublicPostHistory.innerHTML='<div class="chat-public-history-empty">No thread activity yet.</div>';
    }else{
      chatPublicPostHistory.innerHTML=activity.map(item=>{
        const preview=item.text.replace(/\s+/g,' ').trim();
        return `<button class="chat-public-history-item" type="button"
                        data-profile-thread-open="${item.thread_id}">
          <span class="chat-public-history-icon">${item.type === 'thread' ? '🧵' : '↩️'}</span>
          <span class="chat-public-history-copy">
            <strong>${escapeChat(item.title)}</strong>
            <span>${escapeChat(preview || (item.hasPhoto ? '📷 Photo post' : 'Open thread'))}</span>
          </span>
          <span class="chat-public-history-time">${escapeChat(threadTime(item.created_at))}</span>
        </button>`;
      }).join('');
    }

    const [threadCountRes,replyCountRes]=await Promise.all([
      client.from('forum_threads').select('id',{count:'exact',head:true}).eq('author_id',userId),
      client.from('forum_replies').select('id',{count:'exact',head:true}).eq('author_id',userId)
    ]);

    const counts={
      threads:Number(threadCountRes.count || 0),
      replies:Number(replyCountRes.count || 0)
    };

    if(chatPublicHistoryCount){
      chatPublicHistoryCount.textContent=
        `${counts.threads} thread${counts.threads===1?'':'s'} · ${counts.replies} repl${counts.replies===1?'y':'ies'}`;
    }

    return counts;
  }catch(err){
    console.error('Profile post history error:',err);
    chatPublicPostHistory.innerHTML='<div class="chat-public-history-empty">Could not load recent posts.</div>';
    return {threads:0,replies:0};
  }
}

document.querySelectorAll('[data-chat-mute-minutes]').forEach(btn=>{
  btn.addEventListener('click',()=>muteOpenedProfile(Number(btn.dataset.chatMuteMinutes)));
});
chatUnmuteBtn?.addEventListener('click',unmuteOpenedProfile);

chatPublicPostHistory?.addEventListener('click',(e)=>{
  const item=e.target.closest('[data-profile-thread-open]');
  if(!item) return;
  const id=Number(item.dataset.profileThreadOpen);
  if(!id) return;

  closeChatPublicProfile();
  threadsSection?.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>openThread(id),180);
});

async function openChatPublicProfile(userId, displayName, avatarUrl){
  if(!userId || !chatProfileOverlay) return;

  openedChatUserId = userId;
  openedFriendship = null;
  openedChatDisplayName = displayName || 'Member';
  openedChatAvatarUrl = avatarUrl || '';

  const name = displayName || 'Member';
  chatPublicName.textContent = name;
  chatPublicSub.textContent = 'Gymcels.lol Community Member';
  if(chatPublicStaffBadge) chatPublicStaffBadge.innerHTML = '';
  if(chatPublicVipBadge) chatPublicVipBadge.classList.remove('show');

  if(avatarUrl){
    chatPublicAvatar.innerHTML = `<img src="${escapeChat(avatarUrl)}" alt="${escapeChat(name)} profile photo">`;
  }else{
    chatPublicAvatar.textContent = chatInitials(name);
  }

  chatPublicLevel.textContent = '—';
  chatPublicMessages.textContent = '—';
  if(chatPublicWorkouts) chatPublicWorkouts.textContent = '—';
  if(chatPublicSets) chatPublicSets.textContent = '—';
  if(chatPublicCurrentStreak) chatPublicCurrentStreak.textContent = '—';
  if(chatPublicBestStreak) chatPublicBestStreak.textContent = '—';
  if(chatPublicBio){
    chatPublicBio.textContent = 'No bio yet.';
    chatPublicBio.classList.add('empty');
  }
  if(chatPublicPhysique){
    chatPublicPhysique.innerHTML = '<div class="chat-public-physique-empty">No physique photo added yet.</div>';
  }
  chatPublicAchievements.innerHTML = '';
  document.getElementById('chatReportUserBtn')?.classList.add('hidden');
  chatBlockBtn?.classList.add('hidden');
  openedBlockState = {blocked_by_me:false,blocked_me:false};
  if(chatPublicPostHistory){
    chatPublicPostHistory.innerHTML = '<div class="chat-public-history-empty">Loading activity...</div>';
  }
  if(chatPublicHistoryCount) chatPublicHistoryCount.textContent = 'Threads & replies';
  chatModerationArea?.classList.add('hidden');
  setChatMuteActionStatus('');
  renderPublicPresence(null);

  chatProfileOverlay.classList.add('show');
  chatProfileOverlay.setAttribute('aria-hidden','false');

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error('Database connection is not ready.');

    const viewerSession = await getChatSession();
    if(viewerSession?.user) await refreshChatAdminStatus(viewerSession);

    const chatReportUserBtn = document.getElementById('chatReportUserBtn');
    if(chatReportUserBtn){
      chatReportUserBtn.classList.toggle(
        'hidden',
        !viewerSession?.user || viewerSession.user.id === userId
      );
    }

    const [statRes, workoutRes, streakRes, presenceRes, isVip, staffRoles, historyStats] = await Promise.all([
      client
        .from('chat_stats')
        .select('lifetime_messages')
        .eq('user_id', userId)
        .maybeSingle(),

      client.rpc('get_public_member_stats', {
        target_user: userId
      }),

      client.rpc('get_public_member_streaks', {
        target_user: userId
      }),

      client
        .from('member_presence')
        .select('last_seen,display_name,avatar_url,bio,physique_url')
        .eq('user_id', userId)
        .maybeSingle(),

      getPublicVipStatus(userId, true),
      loadPublicStaffRoles([userId]),
      loadPublicPostHistory(userId)
    ]);

    if(statRes.error) throw statRes.error;
    if(workoutRes.error) throw workoutRes.error;
    if(streakRes.error) throw streakRes.error;
    if(presenceRes.error) throw presenceRes.error;

    if(chatPublicVipBadge) chatPublicVipBadge.classList.toggle('show', !!isVip);
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
        chatPublicAvatar.innerHTML = `<img src="${escapeChat(presenceRes.data.avatar_url)}" alt="${escapeChat(presenceRes.data.display_name || name)} profile photo">`;
        openedChatAvatarUrl = presenceRes.data.avatar_url;
      }
      if(chatPublicBio){
        const publicBio = String(presenceRes.data.bio || '').trim();
        chatPublicBio.textContent = publicBio || 'No bio yet.';
        chatPublicBio.classList.toggle('empty', !publicBio);
      }
      if(chatPublicPhysique){
        const physiqueUrl = String(presenceRes.data.physique_url || '').trim();
        chatPublicPhysique.innerHTML = physiqueUrl
          ? `<img src="${escapeChat(physiqueUrl)}" alt="${escapeChat(presenceRes.data.display_name || name)} physique photo">`
          : '<div class="chat-public-physique-empty">No physique photo added yet.</div>';
      }
    }

    await renderFriendButton(userId);
  }catch(err){
    console.error('Public chat profile error:', err);
    if(chatFriendNote) chatFriendNote.textContent = 'Some profile stats could not load.';
    try{ await renderFriendButton(userId); }catch(_){}
  }
}

function closeChatPublicProfile(){
  if(!chatProfileOverlay) return;
  chatProfileOverlay.classList.remove('show');
  chatProfileOverlay.setAttribute('aria-hidden','true');
  openedChatUserId = null;
  openedFriendship = null;
  openedBlockState = {blocked_by_me:false,blocked_me:false};
}

if(chatProfileClose){
  chatProfileClose.addEventListener('click', closeChatPublicProfile);
}
if(chatProfileOverlay){
  chatProfileOverlay.addEventListener('click', (e) => {
    if(e.target === chatProfileOverlay) closeChatPublicProfile();
  });
}
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeChatPublicProfile();
});




function escapeRegex(text){
  return String(text ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function chatTextWithMentions(text){
  let safe = escapeChat(text);

  // Style common @mention-looking tokens without changing stored text.
  safe = safe.replace(/(^|[\s(])@([A-Za-z0-9_.-]{1,30})/g,
    '$1<span class="mention-token">@$2</span>');
  return safe;
}

function mentionInitials(name){
  const s = String(name || 'M').trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0,2).toUpperCase();
}

function closeMentionSuggestions(){
  if(mentionSuggestions){
    mentionSuggestions.classList.add('hidden');
    mentionSuggestions.innerHTML = '';
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

  const query = match[1] || '';
  const atIndex = before.lastIndexOf('@');

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
    .from('member_presence')
    .select('user_id,display_name,avatar_url')
    .neq('user_id', session.user.id)
    .order('display_name', { ascending:true })
    .limit(8);

  if(info.query){
    request = request.ilike('display_name', `%${info.query}%`);
  }

  const { data, error } = await request;

  if(error){
    console.error('Mention suggestions error:', error);
    closeMentionSuggestions();
    return;
  }

  const blockedIds = await getMyBlockedUserIds();
  mentionCandidates = (data || []).filter(
    x => x.user_id && x.display_name && !blockedIds.has(String(x.user_id))
  );

  if(!mentionCandidates.length){
    closeMentionSuggestions();
    return;
  }

  mentionSuggestions.innerHTML = mentionCandidates.map((person, index) => {
    const avatar = person.avatar_url
      ? `<span class="mention-avatar"><img src="${escapeChat(person.avatar_url)}" alt=""></span>`
      : `<span class="mention-avatar">${escapeChat(mentionInitials(person.display_name))}</span>`;

    return `<button class="mention-option ${index === 0 ? 'active' : ''}"
                    type="button"
                    data-mention-index="${index}">
              ${avatar}
              <span>
                <span class="mention-name">@${escapeChat(person.display_name)}</span>
                <span class="mention-help">Mention this member</span>
              </span>
            </button>`;
  }).join('');

  mentionSuggestions.classList.remove('hidden');
}

function chooseMention(person){
  if(!person || !chatInput) return;

  const info = currentMentionQuery();
  if(!info) return;

  const before = chatInput.value.slice(0, info.atIndex);
  const after = chatInput.value.slice(info.cursor);
  const mentionText = `@${person.display_name}`;

  chatInput.value = before + mentionText + ' ' + after;

  const newCursor = (before + mentionText + ' ').length;
  chatInput.setSelectionRange(newCursor, newCursor);
  chatInput.focus();

  selectedMentions.set(person.user_id, {
    user_id: person.user_id,
    display_name: person.display_name
  });

  closeMentionSuggestions();
}

function activeMentionUserIds(messageText){
  const text = String(messageText || '');

  return [...selectedMentions.values()]
    .filter(person => text.toLowerCase().includes(`@${String(person.display_name || '').toLowerCase()}`))
    .map(person => person.user_id)
    .filter(Boolean)
    .slice(0, 8);
}

function clearChatReply(){
  chatReplyTarget = null;
  if(chatReplyBar) chatReplyBar.classList.add('hidden');
  if(chatReplyName) chatReplyName.textContent = 'Member';
  if(chatReplyPreview) chatReplyPreview.textContent = '';
}

function beginChatReply(row){
  if(!row || !row.id) return;

  chatReplyTarget = row;
  if(chatReplyName) chatReplyName.textContent = row.display_name || 'Member';
  if(chatReplyPreview){
    const preview = String(row.message || '').replace(/\s+/g,' ').trim();
    chatReplyPreview.textContent = preview.length > 110 ? preview.slice(0,110) + '…' : preview;
  }
  if(chatReplyBar) chatReplyBar.classList.remove('hidden');

  if(chatInput){
    chatInput.focus();
    chatInput.placeholder = `Reply to ${row.display_name || 'Member'}...`;
  }
}

function jumpToChatMessage(messageId){
  const el = chatMessages?.querySelector(`[data-message-id="${Number(messageId)}"]`);
  if(!el) return false;

  el.scrollIntoView({behavior:'smooth',block:'center'});
  el.classList.remove('reply-highlight');
  void el.offsetWidth;
  el.classList.add('reply-highlight');
  return true;
}

function setNotificationBadge(count){
  if(!notificationBadge) return;
  const n = Math.max(0, Number(count) || 0);
  notificationBadge.textContent = n > 99 ? '99+' : String(n);
  notificationBadge.classList.toggle('hidden', n === 0);
}

function notificationTime(value){
  if(!value) return '';
  const d = new Date(value);
  const diff = Date.now() - d.getTime();
  if(diff < 60000) return 'now';
  if(diff < 3600000) return `${Math.floor(diff/60000)}m`;
  if(diff < 86400000) return `${Math.floor(diff/3600000)}h`;
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}


// ---- Phone / desktop push notifications ----
const GYMCELS_VAPID_PUBLIC_KEY = 'BD93jX_6gNDvbZrcKXfL6ml4p2mBjG-fccjPu4VEtllqmqCTcpDu3vmkBD8TvcE2crY1zt60YPIuPpgd_bkxorE';

function pushUrlBase64ToUint8Array(base64String){
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g,'+').replace(/_/g,'/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(ch => ch.charCodeAt(0)));
}

async function getGymcelsServiceWorker(){
  if(!('serviceWorker' in navigator)) throw new Error('Service workers are not supported in this browser.');

  const registration = await navigator.serviceWorker.register('/sw.js',{
    scope:'/',
    updateViaCache:'none'
  });

  // Force an update check whenever Gymcels opens, including Home Screen installs.
  try{ await registration.update(); }catch(_){}

  await navigator.serviceWorker.ready;
  return registration;
}

async function currentPushSubscription(){
  if(!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  try{
    const registration = await getGymcelsServiceWorker();
    return await registration.pushManager.getSubscription();
  }catch(_){
    return null;
  }
}

function getGymcelsPushDeviceId(){
  const key = 'gymcels_push_device_id';
  let id = '';

  try{
    id = localStorage.getItem(key) || '';
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
  if(!client || !session?.user) throw new Error('Log in first.');

  const json = subscription.toJSON();
  const endpoint = json.endpoint || subscription.endpoint;
  const p256dh = json.keys?.p256dh || '';
  const auth = json.keys?.auth || '';

  if(!endpoint || !p256dh || !auth) throw new Error('Browser push subscription is incomplete.');

  const {error} = await client.rpc('save_my_push_subscription',{
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
    await client.rpc('remove_my_push_subscription',{sub_endpoint:subscription.endpoint});
  }catch(_){}

  try{ await subscription.unsubscribe(); }catch(_){}
}


function isGymcelsIosDevice(){
  const ua = navigator.userAgent || '';
  const classicIos = /iPhone|iPad|iPod/i.test(ua);
  const ipadDesktopMode = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return classicIos || ipadDesktopMode;
}

function isGymcelsStandaloneApp(){
  return window.matchMedia?.('(display-mode: standalone)').matches === true ||
         navigator.standalone === true;
}

function showGymcelsIosInstallHelp(){
  pushInstallHelp?.classList.remove('hidden');

  if(pushAlertState){
    pushAlertState.textContent = 'Follow the steps below, then reopen Gymcels from your Home Screen.';
    pushAlertState.className = 'blocked';
  }

  if(pushAlertBtn){
    pushAlertBtn.disabled = false;
    pushAlertBtn.textContent = 'Add to Home Screen';
    pushAlertBtn.classList.remove('off');
  }
}

async function refreshPushButton(){
  if(!pushAlertBtn || !pushAlertState) return;

  pushInstallHelp?.classList.add('hidden');

  const session = await getChatSession().catch(() => null);
  if(!session?.user){
    pushAlertBtn.disabled = true;
    pushAlertBtn.textContent = 'Log in first';
    pushAlertBtn.classList.remove('off');
    pushAlertState.textContent = 'Log in to enable';
    pushAlertState.className = '';
    return;
  }

  // iPhone/iPad Safari only allows web push from a Home Screen web app.
  // Give people clear setup instructions instead of a vague unsupported-browser error.
  if(isGymcelsIosDevice() && !isGymcelsStandaloneApp()){
    pushAlertBtn.disabled = false;
    pushAlertBtn.textContent = 'Enable phone alerts';
    pushAlertBtn.classList.remove('off');
    pushAlertState.textContent = 'Add Gymcels to your Home Screen to enable notifications.';
    pushAlertState.className = 'blocked';
    return;
  }

  if(!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)){
    pushAlertBtn.disabled = true;
    pushAlertBtn.textContent = 'Not available';
    pushAlertState.textContent = 'Notifications are not available in this browser.';
    pushAlertState.className = 'blocked';
    return;
  }

  if(Notification.permission === 'denied'){
    pushAlertBtn.disabled = true;
    pushAlertBtn.textContent = 'Blocked';
    pushAlertState.textContent = 'Allow notifications in browser/site settings';
    pushAlertState.className = 'blocked';
    return;
  }

  const sub = await currentPushSubscription();
  const hasLocalSubscription = Notification.permission === 'granted' && !!sub;

  // Important: Safari/iPhone can already have a local push subscription even if
  // it was created before Supabase push_subscriptions existed. Re-save it here
  // so "enabled" also means the server actually knows about this device.
  if(hasLocalSubscription){
    try{
      await savePushSubscription(sub);

      pushAlertBtn.disabled = false;
      pushAlertBtn.textContent = 'Disable phone alerts';
      pushAlertBtn.classList.add('off');
      pushAlertState.textContent = 'On — device registered for push';
      pushAlertState.className = 'on';
      return;
    }catch(err){
      console.error('Push subscription sync failed:',err);
      pushAlertBtn.disabled = false;
      pushAlertBtn.textContent = 'Repair phone alerts';
      pushAlertBtn.classList.remove('off');
      pushAlertState.textContent = 'Needs repair — tap to register this device';
      pushAlertState.className = 'blocked';
      return;
    }
  }

  pushAlertBtn.disabled = false;
  pushAlertBtn.textContent = 'Enable phone alerts';
  pushAlertBtn.classList.remove('off');
  pushAlertState.textContent = 'Off';
  pushAlertState.className = '';
}

async function enableGymcelsPush(){
  const session = await getChatSession();
  if(!session?.user) throw new Error('Log in first.');

  const permission = await Notification.requestPermission();
  if(permission !== 'granted'){
    throw new Error(permission === 'denied'
      ? 'Notifications were blocked. Allow them in your browser/site settings.'
      : 'Notification permission was not granted.');
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

  if(isGymcelsIosDevice() && !isGymcelsStandaloneApp()){
    showGymcelsIosInstallHelp();
    return;
  }

  pushAlertBtn.disabled = true;

  try{
    const sub = await currentPushSubscription();
    const repairing = pushAlertBtn.textContent.includes('Repair');

    if(repairing && sub){
      await savePushSubscription(sub);
    }else if(Notification.permission === 'granted' && sub){
      await removePushSubscription(sub);
    }else{
      await enableGymcelsPush();
    }
  }catch(err){
    console.error('Push setup error:',err);
    if(pushAlertState){
      pushAlertState.textContent = err?.message || String(err);
      pushAlertState.className = 'blocked';
    }
  }finally{
    await refreshPushButton();
  }
}

if(pushAlertBtn){
  pushAlertBtn.addEventListener('click',toggleGymcelsPush);
}

if('serviceWorker' in navigator){
  window.addEventListener('load',() => {
    getGymcelsServiceWorker().catch(err => console.warn('Service worker registration:',err));
  });
}

document.addEventListener('visibilitychange',() => {
  if(document.visibilityState === 'visible') refreshPushButton();
});

async function loadNotifications(){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    if(navNotifications) navNotifications.classList.add('hidden');
    if(notificationPanel) notificationPanel.classList.add('hidden');
    setNotificationBadge(0);
    return;
  }

  if(navNotifications) navNotifications.classList.remove('hidden');

  const { data, error } = await client
    .from('notifications')
    .select('id,actor_id,actor_display_name,type,message_id,reply_to_id,thread_id,preview,is_read,created_at')
    .order('created_at',{ascending:false})
    .limit(30);

  if(error){
    console.error('Notification load error:', error);
    return;
  }

  let rows = data || [];
  const blockedIds = await getMyBlockedUserIds();
  rows = rows.filter(n => !blockedIds.has(String(n.actor_id || '')));

  setNotificationBadge(rows.filter(n => !n.is_read).length);

  if(!notificationList) return;

  if(!rows.length){
    notificationList.innerHTML = '<div class="notification-empty">No notifications yet.</div>';
    return;
  }

  notificationList.innerHTML = rows.map(n => {
    const preview = String(n.preview || '').replace(/\s+/g,' ').trim();
    let icon = '🔔';
    let copy = 'sent you a notification.';

    if(n.type === 'reply'){
      icon = '↩';
      copy = preview
        ? `replied: “${preview.length > 120 ? preview.slice(0,120) + '…' : preview}”`
        : 'replied to your message.';
    }else if(n.type === 'mention'){
      icon = '@';
      copy = preview
        ? `mentioned you: “${preview.length > 120 ? preview.slice(0,120) + '…' : preview}”`
        : 'mentioned you in chat.';
    }else if(n.type === 'friend_request'){
      icon = '👤';
      copy = 'sent you a friend request.';
    }else if(n.type === 'friend_accepted'){
      icon = '✓';
      copy = 'accepted your friend request.';
    }else if(n.type === 'dm'){
      icon = '✉';
      copy = preview
        ? `sent you a DM: “${preview.length > 120 ? preview.slice(0,120) + '…' : preview}”`
        : 'sent you a direct message.';
    }else if(n.type === 'thread_reply'){
      icon = '💬';
      const directThreadReplyPrefix = '__reply_to_user__';
      const directToUser = preview.startsWith(directThreadReplyPrefix);
      const cleanThreadPreview = directToUser
        ? preview.slice(directThreadReplyPrefix.length).trim()
        : preview;

      copy = directToUser
        ? (cleanThreadPreview
            ? `replied to you in a thread: “${cleanThreadPreview.length > 120 ? cleanThreadPreview.slice(0,120) + '…' : cleanThreadPreview}”`
            : 'replied to you in a thread.')
        : (cleanThreadPreview
            ? `replied to your thread: “${cleanThreadPreview.length > 120 ? cleanThreadPreview.slice(0,120) + '…' : cleanThreadPreview}”`
            : 'replied to your thread.');
    }else if(n.type === 'incoming_call'){
      icon = '📞';
      copy = 'is calling you privately.';
    }

    return `
      <button class="notification-item ${n.is_read ? '' : 'unread'}"
              type="button"
              data-notification-id="${n.id}"
              data-notification-message="${n.message_id || ''}"
              data-notification-type="${escapeChat(n.type || '')}"
              data-notification-actor="${escapeChat(n.actor_id || '')}"
              data-notification-thread="${n.thread_id || ''}">
        <div class="notification-item-top">
          <span class="notification-item-name"><span class="notification-item-icon">${icon}</span>${escapeChat(n.actor_display_name || 'Member')}</span>
          <span class="notification-item-time">${escapeChat(notificationTime(n.created_at))}</span>
        </div>
        <div class="notification-item-copy">${escapeChat(copy)}</div>
      </button>`;
  }).join('');
}

async function markNotificationRead(notificationId){
  const client = window.gymcelsLolDb;
  if(!client || !notificationId) return;
  const { error } = await client.rpc('mark_notification_read', {
    target_notification_id: Number(notificationId)
  });
  if(error) console.error('Mark notification read error:', error);
}

async function markAllNotificationsRead(){
  const client = window.gymcelsLolDb;
  if(!client) return;
  const { error } = await client.rpc('mark_all_notifications_read');
  if(error){
    console.error('Mark all notifications error:', error);
    return;
  }
  await loadNotifications();
}

function startNotifications(session){
  clearInterval(notificationPollTimer);
  setTimeout(refreshPushButton,100);

  if(!session?.user){
    if(navNotifications) navNotifications.classList.add('hidden');
    if(notificationPanel) notificationPanel.classList.add('hidden');
    setNotificationBadge(0);
    return;
  }

  if(navNotifications) navNotifications.classList.remove('hidden');
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
    staffAdminPanel?.classList.add('hidden');
    return false;
  }

  if(chatAdminCheckedUserId === session.user.id){
    return chatIsSiteAdmin;
  }

  try{
    const [adminRes,permissionsRes] = await Promise.all([
      client.rpc('is_site_admin'),
      client.rpc('my_staff_permissions')
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
    staffAdminPanel?.classList.add('hidden');
    console.error('Staff status check failed:', err);
  }

  return chatIsSiteAdmin;
}


// ---- Reactions: chat messages, threads, and thread replies ----
const GYMCELS_REACTIONS = ['❤️','🔥','💪','⬆️','👍','👎'];

async function loadReactionState(targetType, targetIds, currentUserId=null){
  const ids = [...new Set((targetIds || []).map(Number).filter(Boolean))];
  const state = {};

  ids.forEach(id => {
    state[id] = {counts:{}, mine:null};
    GYMCELS_REACTIONS.forEach(reaction => {
      state[id].counts[reaction] = 0;
    });
  });

  if(!ids.length) return state;

  const client = window.gymcelsLolDb;
  if(!client) return state;

  const {data,error} = await client
    .from('content_reactions')
    .select('target_id,user_id,reaction')
    .eq('target_type',targetType)
    .in('target_id',ids);

  if(error){
    console.error('Reaction load error:',error);
    return state;
  }

  (data || []).forEach(row => {
    const id = Number(row.target_id);
    if(!state[id]) return;

    const reaction = String(row.reaction || '');
    if(GYMCELS_REACTIONS.includes(reaction)){
      state[id].counts[reaction] = Number(state[id].counts[reaction] || 0) + 1;
      if(currentUserId && row.user_id === currentUserId){
        state[id].mine = reaction;
      }
    }
  });

  return state;
}

function reactionBarHtml(targetType,targetId,reactionState={},extraClass=''){
  const counts = reactionState?.counts || {};
  const mine = reactionState?.mine || '';

  const usedReactions = GYMCELS_REACTIONS
    .filter(reaction => Number(counts[reaction] || 0) > 0)
    .map(reaction => {
      const count = Number(counts[reaction] || 0);
      const mineClass = mine === reaction ? ' mine' : '';

      return `<span class="reaction-summary-chip${mineClass}" title="${count} reaction${count === 1 ? '' : 's'}">
        <span>${reaction}</span>
        <span>${count}</span>
      </span>`;
    }).join('');

  return `<div class="reaction-bar ${extraClass}" data-reaction-bar="${escapeChat(targetType)}:${Number(targetId)}">
    <div class="reaction-control">
      <button
        class="reaction-toggle ${mine ? 'has-reaction' : ''}"
        type="button"
        data-reaction-toggle
        aria-expanded="false">
        ${mine ? `${mine} Reacted` : 'React'}
      </button>

      <div class="reaction-picker hidden" role="menu">
        ${GYMCELS_REACTIONS.map(reaction => {
          const count = Number(counts[reaction] || 0);
          const active = mine === reaction;

          return `<button
            class="reaction-btn ${active ? 'active' : ''}"
            type="button"
            data-react-type="${escapeChat(targetType)}"
            data-react-id="${Number(targetId)}"
            data-react-value="${reaction}"
            aria-pressed="${active ? 'true' : 'false'}"
            title="${active ? 'Remove your reaction' : 'React'}">
              <span class="reaction-emoji">${reaction}</span>
              ${count ? `<span class="reaction-count">${count}</span>` : ''}
          </button>`;
        }).join('')}
      </div>
    </div>

    ${usedReactions ? `<div class="reaction-summary">${usedReactions}</div>` : ''}
  </div>`;
}

async function toggleGymcelsReaction(targetType,targetId,reaction){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client) return;

  if(!session?.user){
    const login = document.getElementById('login-card');
    login?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }

  const {error} = await client.rpc('toggle_content_reaction',{
    reaction_target_type:targetType,
    reaction_target_id:Number(targetId),
    reaction_value:reaction
  });

  if(error){
    console.error('Reaction update error:',error);

    if(targetType === 'chat'){
      setChatStatus('Reaction failed: ' + error.message,'error');
    }else{
      setThreadStatus(threadReplyStatus || threadsStatus,'Reaction failed: ' + error.message,'error');
    }
    return;
  }

  if(targetType === 'chat'){
    await loadCommunityChat(false);
    return;
  }

  if(targetType === 'thread'){
    await loadThreads();

    if(activeThread && Number(activeThread.id) === Number(targetId)){
      const reactionMap = await loadReactionState('thread',[targetId],session.user.id);
      if(threadViewReactions){
        threadViewReactions.innerHTML = reactionBarHtml(
          'thread',
          targetId,
          reactionMap[Number(targetId)] || {},
          'reaction-bar-thread'
        );
      }
    }
    return;
  }

  if(targetType === 'thread_reply' && activeThread){
    await loadThreadReplies(activeThread.id);
  }
}

function closeAllReactionPickers(exceptControl=null){
  document.querySelectorAll('.reaction-control').forEach(control => {
    if(exceptControl && control === exceptControl) return;

    control.querySelector('.reaction-picker')?.classList.add('hidden');
    const toggle = control.querySelector('[data-reaction-toggle]');
    if(toggle) toggle.setAttribute('aria-expanded','false');
  });
}

document.addEventListener('click',async (e) => {
  const toggle = e.target.closest('[data-reaction-toggle]');

  if(toggle){
    e.preventDefault();
    e.stopPropagation();

    const control = toggle.closest('.reaction-control');
    const picker = control?.querySelector('.reaction-picker');
    if(!picker) return;

    const opening = picker.classList.contains('hidden');

    closeAllReactionPickers(control);
    picker.classList.toggle('hidden',!opening);
    toggle.setAttribute('aria-expanded',opening ? 'true' : 'false');
    return;
  }

  const btn = e.target.closest('[data-react-type][data-react-id][data-react-value]');

  if(btn){
    e.preventDefault();
    e.stopPropagation();

    const control = btn.closest('.reaction-control');
    control?.querySelector('.reaction-picker')?.classList.add('hidden');
    control?.querySelector('[data-reaction-toggle]')?.setAttribute('aria-expanded','false');

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

  if(!e.target.closest('.reaction-control')){
    closeAllReactionPickers();
  }
});


async function loadCommunityChat(scrollToBottom=false){
  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error('Chat database connection is not ready.');

    const session = await getChatSession();
    const signedIn = setCommunityChatAuthState(session);

    if(signedIn){
      await refreshChatAdminStatus(session);
    }else{
      chatIsSiteAdmin = false;
      chatAdminCheckedUserId = null;
    }

    if(!signedIn && friendsSection){
      friendsSection.style.display = 'none';
    }

    const { data, error } = await client
      .from('messages')
      .select('id,user_id,display_name,avatar_url,message,created_at,reply_to_id')
      .order('created_at', { ascending: true })
      .limit(100);

    if(error) throw error;


    let rows = data || [];

    if(signedIn){
      const blockedIds = await getMyBlockedUserIds();
      rows = rows.filter(row => !blockedIds.has(String(row.user_id || '')));
    }

    chatRowsById = new Map(rows.map(row => [Number(row.id), row]));

    // Load the original messages referenced by replies.
    const replyIds = [...new Set(rows.map(row => Number(row.reply_to_id)).filter(Boolean))];
    let replyMap = {};

    if(replyIds.length){
      const { data: replyRows, error: replyError } = await client
        .from('messages')
        .select('id,user_id,display_name,message')
        .in('id', replyIds);

      if(!replyError){
        replyMap = Object.fromEntries(
          (replyRows || []).map(row => [Number(row.id), row])
        );
      }
    }

    // Load online/offline state for everyone visible in the chat.
    const userIds = [...new Set(rows.map(row => row.user_id).filter(Boolean))];
    let presenceMap = {};

    if(userIds.length && signedIn){
      const { data: presenceRows, error: presenceError } = await client
        .from('member_presence')
        .select('user_id,last_seen')
        .in('user_id', userIds);

      if(!presenceError){
        presenceMap = Object.fromEntries(
          (presenceRows || []).map(p => [p.user_id, p.last_seen])
        );
      }
    }

    rows.forEach(row => {
      row.is_online = isPresenceOnline(presenceMap[row.user_id]);
    });

    let vipMap = {};
    if(signedIn){
      const vipEntries = await Promise.all(
        userIds.map(async uid => [uid, await getPublicVipStatus(uid)])
      );
      vipMap = Object.fromEntries(vipEntries);
    }

    rows.forEach(row => {
      row.is_vip = !!vipMap[row.user_id];
    });

    const chatStaffRoleMap = await loadPublicStaffRoles(userIds);
    rows.forEach(row => {
      row.staff_role = chatStaffRoleMap[row.user_id] || null;
    });

    const chatReactionMap = await loadReactionState(
      'chat',
      rows.map(row => row.id),
      signedIn ? session.user.id : null
    );

    if(!rows.length){
      chatMessages.innerHTML =
        '<div class="chat-empty">No messages yet — start the conversation.</div>';
      return;
    }

    chatMessages.innerHTML = rows.map(row => {
      const mine = signedIn && row.user_id === session.user.id;
      const canDeleteMessage = mine || (signedIn && canModerateChat());
      const when = row.created_at
        ? new Date(row.created_at).toLocaleTimeString([], {
            hour:'numeric',
            minute:'2-digit'
          })
        : '';

      const parent = row.reply_to_id ? replyMap[Number(row.reply_to_id)] : null;
      const quotedReply = parent
        ? `<button class="chat-quoted-reply" type="button" data-jump-message="${parent.id}">
             <strong>Replying to ${escapeChat(parent.display_name || 'Member')}</strong>
             <span>${escapeChat(String(parent.message || '').replace(/\s+/g,' ').slice(0,140))}</span>
           </button>`
        : '';

      return `
        <div class="chat-message" data-message-id="${row.id}">
          <div class="chat-message-row">
            ${chatAvatarMarkup(row)}
            <div class="chat-message-body">
              <div class="chat-meta">
                <div>
                  <button class="chat-user-button" type="button" data-chat-user="${escapeChat(row.user_id || '')}" data-chat-name="${escapeChat(row.display_name || 'Member')}" data-chat-avatar="${escapeChat(row.avatar_url || '')}"><span class="chat-user">${escapeChat(row.display_name || 'Member')}</span></button>${staffBadgeMarkup(row.staff_role)}${vipBadgeMarkup(row.is_vip)}
                  <span class="chat-time"> · ${escapeChat(when)}</span>
                </div>
                <div class="chat-message-actions">
                  ${signedIn ? `<button class="chat-reply-btn" type="button" data-chat-reply="${row.id}">Reply</button>` : ''}
                  ${signedIn && !mine
                    ? `<button class="content-report-btn"
                               type="button"
                               data-content-report="chat"
                               data-report-id="${row.id}"
                               data-report-user="${escapeChat(row.user_id || '')}"
                               data-report-label="Chat message by ${escapeChat(row.display_name || 'Member')}">Report</button>`
                    : ''}
                  ${canDeleteMessage
                    ? `<button class="chat-delete" type="button" data-chat-delete="${row.id}"${!mine && canModerateChat() ? ' title="Moderator delete"' : ''}>Delete</button>`
                    : ''}
                </div>
              </div>
              ${quotedReply}
              <div class="chat-text">${chatTextWithMentions(row.message)}</div>
              ${reactionBarHtml(
                'chat',
                row.id,
                chatReactionMap[Number(row.id)] || {},
                'chat-reactions'
              )}
            </div>
          </div>
        </div>`;
    }).join('');

    if(scrollToBottom){
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if(signedIn) await refreshChatLevel();
  } catch(err){
    if(chatMessages){
      chatMessages.innerHTML =
        '<div class="chat-empty">Could not load chat.</div>';
    }
    setChatStatus('Chat error: ' + (err?.message || String(err)), 'error');
    console.error('Gymcels.lol chat load error:', err);
  }
}

async function sendCommunityMessage(){
  if(chatSending) return;

  const text = chatInput?.value.trim();
  if(!text) return;

  chatSending = true;
  if(chatSendBtn) chatSendBtn.disabled = true;
  setChatStatus('Sending...');

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error('Chat database connection is not ready.');

    const session = await getChatSession();
    if(!session?.user) throw new Error('You must be logged in to send messages.');

    const {data:muteData,error:muteError}=await client.rpc('get_chat_mute_status',{
      target_user:session.user.id
    });
    if(muteError) throw muteError;

    const muteStatus=Array.isArray(muteData) ? muteData[0] : muteData;
    if(muteStatus?.is_muted){
      throw new Error(`You are muted from public chat until ${formatMuteUntil(muteStatus.muted_until)}.`);
    }

    const mentionUserIds = activeMentionUserIds(text);

    const { data: insertedMessage, error } = await client
      .from('messages')
      .insert({
        user_id: session.user.id,
        display_name: chatDisplayName(session.user),
        avatar_url: session.user?.user_metadata?.avatar_url || null,
        message: text,
        reply_to_id: chatReplyTarget?.id || null
      })
      .select('id')
      .single();

    if(error) throw error;

    if(mentionUserIds.length && insertedMessage?.id){
      const { error: mentionError } = await client.rpc('create_mention_notifications', {
        target_user_ids: mentionUserIds,
        target_message_id: Number(insertedMessage.id),
        mention_preview: text.slice(0,160)
      });

      if(mentionError){
        console.error('Mention notification error:', mentionError);
      }
    }

    chatInput.value = '';
    selectedMentions.clear();
    closeMentionSuggestions();
    clearChatReply();
    chatInput.placeholder = 'Say something to the community...';
    setChatStatus('✓ MESSAGE SENT', 'success');
    await refreshChatLevel();
    await loadCommunityChat(true);

    setTimeout(() => {
      if(chatStatus?.textContent === '✓ MESSAGE SENT'){
        chatStatus.textContent = '';
      }
    }, 3000);
  } catch(err){
    setChatStatus('Send failed: ' + (err?.message || String(err)), 'error');
    console.error('Gymcels.lol chat send error:', err);
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
  chatSendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendCommunityMessage();
  });
}

if(chatInput){
  chatInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendCommunityMessage();
    }
  });
}




if(chatInput){
  chatInput.addEventListener('input', () => {
    clearTimeout(mentionSearchTimer);
    mentionSearchTimer = setTimeout(loadMentionSuggestions, 120);
  });

  chatInput.addEventListener('keydown', (e) => {
    if(!mentionSuggestions || mentionSuggestions.classList.contains('hidden')) return;

    if(e.key === 'Escape'){
      closeMentionSuggestions();
      return;
    }

    if(e.key === 'Enter' && mentionCandidates.length){
      const active = mentionSuggestions.querySelector('.mention-option.active');
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
  mentionSuggestions.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mention-index]');
    if(!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const person = mentionCandidates[Number(btn.dataset.mentionIndex)];
    if(person) chooseMention(person);
  });
}

document.addEventListener('click', (e) => {
  if(e.target === chatInput || e.target.closest('#mentionSuggestions')) return;
  closeMentionSuggestions();
});

if(chatReplyCancel){
  chatReplyCancel.addEventListener('click', () => {
    clearChatReply();
    if(chatInput){
      chatInput.placeholder = 'Say something to the community...';
      chatInput.focus();
    }
  });
}

if(chatMessages){
  chatMessages.addEventListener('click', (e) => {
    const replyBtn = e.target.closest('[data-chat-reply]');
    if(replyBtn){
      e.preventDefault();
      e.stopPropagation();
      const row = chatRowsById.get(Number(replyBtn.dataset.chatReply));
      if(row) beginChatReply(row);
      return;
    }

    const jumpBtn = e.target.closest('[data-jump-message]');
    if(jumpBtn){
      e.preventDefault();
      e.stopPropagation();
      jumpToChatMessage(jumpBtn.dataset.jumpMessage);
    }
  });
}

// Delegated chatter-profile click. This works even when chat messages are re-rendered.
document.addEventListener('click', (e) => {
  const profileTarget = e.target.closest('[data-chat-user]');
  if(!profileTarget || e.target.closest('[data-chat-delete]')) return;

  e.preventDefault();
  e.stopPropagation();

  openChatPublicProfile(
    profileTarget.dataset.chatUser,
    profileTarget.dataset.chatName || 'Member',
    profileTarget.dataset.chatAvatar || ''
  );
});

if(chatMessages){
  chatMessages.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-chat-delete]');
    if(!btn) return;

    try{
      const client = window.gymcelsLolDb;
      if(!client) throw new Error('Chat database connection is not ready.');

      const id = Number(btn.dataset.chatDelete);
      if(!id) return;

      const rowEl = btn.closest('.chat-message');
      const isModeratorDelete = canModerateChat() && btn.getAttribute('title') === 'Moderator delete';

      if(isModeratorDelete && !confirm("Delete this member's message?")){
        return;
      }

      const { error } = await client
        .from('messages')
        .delete()
        .eq('id', id);

      if(error) throw error;

      // Deleting a message does NOT subtract from lifetime chat XP.
      await loadCommunityChat(false);
      await refreshChatLevel();
    } catch(err){
      setChatStatus('Delete failed: ' + (err?.message || String(err)), 'error');
    }
  });
}


if(navNotifications){
  navNotifications.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const opening = notificationPanel?.classList.contains('hidden');
    if(notificationPanel){
      notificationPanel.classList.toggle('hidden');
      notificationPanel.setAttribute('aria-hidden', opening ? 'false' : 'true');
    }
    if(opening) loadNotifications();
  });
}

if(notificationMarkAll){
  notificationMarkAll.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await markAllNotificationsRead();
  });
}

if(notificationList){
  notificationList.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-notification-id]');
    if(!item) return;

    const notificationId = Number(item.dataset.notificationId);
    const messageId = Number(item.dataset.notificationMessage);
    const type = item.dataset.notificationType || '';
    const actorId = item.dataset.notificationActor || '';
    const notificationThreadId = Number(item.dataset.notificationThread);

    await markNotificationRead(notificationId);
    await loadNotifications();

    if(notificationPanel){
      notificationPanel.classList.add('hidden');
      notificationPanel.setAttribute('aria-hidden','true');
    }

    if(type === 'incoming_call'){
      dmSection?.scrollIntoView({behavior:'smooth',block:'start'});
      await loadDmFriends();
      return;
    }

    if(type === 'thread_reply' && notificationThreadId){
      threadsSection?.scrollIntoView({behavior:'smooth',block:'start'});
      await loadThreads();
      await openThread(notificationThreadId);
      return;
    }

    if(type === 'friend_request' || type === 'friend_accepted'){
      await loadFriendsSection();
      friendsSection?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }

    if(type === 'dm' && actorId){
      try{
        const client = window.gymcelsLolDb;
        const { data: person } = await client
          .from('member_presence')
          .select('display_name,avatar_url')
          .eq('user_id', actorId)
          .maybeSingle();

        await openDmWith(
          actorId,
          person?.display_name || 'Member',
          person?.avatar_url || ''
        );
      }catch(err){
        console.error('DM notification open error:', err);
      }
      return;
    }

    communityChat?.scrollIntoView({behavior:'smooth',block:'center'});
    await loadCommunityChat(false);

    setTimeout(() => {
      if(messageId) jumpToChatMessage(messageId);
    }, 250);
  });
}

document.addEventListener('click', (e) => {
  if(!notificationPanel || notificationPanel.classList.contains('hidden')) return;
  if(
    e.target.closest('#notificationPanel') ||
    e.target.closest('#navNotifications') ||
    e.target.closest('#mobileNotificationBtn')
  ) return;

  notificationPanel.classList.add('hidden');
  notificationPanel.setAttribute('aria-hidden','true');
});


function setSiteUpdateStatus(text='',type=''){
  if(!siteUpdateAdminStatus) return;
  siteUpdateAdminStatus.textContent = text;
  siteUpdateAdminStatus.className = `site-update-status ${type || ''}`;
}

function siteUpdateTime(value){
  if(!value) return '';
  const d = new Date(value);
  const diff = Date.now()-d.getTime();

  if(diff < 60000) return 'just now';
  if(diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if(diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if(diff < 604800000) return `${Math.floor(diff/86400000)}d ago`;

  return d.toLocaleDateString([],{
    month:'short',
    day:'numeric',
    year:d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

async function refreshSiteUpdateAdminUi(){
  if(!siteUpdateAdminComposer) return false;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    siteUpdateAdminComposer.classList.add('hidden');
    return false;
  }

  try{
    const {data,error} = await client.rpc('is_site_admin');
    if(error) throw error;

    const isAdmin = data === true;
    siteUpdateAdminComposer.classList.toggle('hidden',!isAdmin);
    return isAdmin;
  }catch(err){
    console.error('Update board admin check error:',err);
    siteUpdateAdminComposer.classList.add('hidden');
    return false;
  }
}


function safeSiteUpdateFontSize(value){
  const size = Number(value);
  const allowed = [13,16,20,26];
  return allowed.includes(size) ? size : 16;
}

function safeSiteUpdateColor(value){
  const color = String(value || '').trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#d8dde3';
}

function updateSiteUpdatePreview(){
  if(!siteUpdatePreview) return;

  const text = String(siteUpdateInput?.value || '').trim() ||
    'Your update will look like this.';
  const size = safeSiteUpdateFontSize(siteUpdateFontSize?.value);
  const color = safeSiteUpdateColor(siteUpdateColor?.value);

  siteUpdatePreview.textContent = text;
  siteUpdatePreview.style.fontSize = `${size}px`;
  siteUpdatePreview.style.color = color;

  document.querySelectorAll('[data-update-color]').forEach(btn => {
    btn.classList.toggle(
      'active',
      String(btn.dataset.updateColor || '').toLowerCase() === color.toLowerCase()
    );
  });
}

async function loadSiteUpdates(){
  const client = window.gymcelsLolDb;
  if(!client || !siteUpdatesList) return;

  try{
    const [updatesRes,isAdmin] = await Promise.all([
      client
        .from('site_updates')
        .select('id,message,text_color,font_size,created_at')
        .order('created_at',{ascending:false})
        .limit(20),
      refreshSiteUpdateAdminUi()
    ]);

    if(updatesRes.error) throw updatesRes.error;

    const rows = updatesRes.data || [];
    siteUpdateRowsById = new Map(rows.map(row => [Number(row.id),row]));

    if(!rows.length){
      siteUpdatesList.innerHTML =
        '<div class="site-update-empty">No official updates yet.</div>';
      return;
    }

    siteUpdatesList.innerHTML = rows.map((row,index) => `
      <div class="site-update-item ${index === 0 ? 'latest' : ''}" data-site-update-id="${Number(row.id)}">
        <div class="site-update-item-head">
          <div class="site-update-author">
            Gymcels.lol
            <span class="site-update-admin-badge">Admin</span>
          </div>
          <div class="site-update-time">${escapeChat(siteUpdateTime(row.created_at))}</div>
        </div>

        <div class="site-update-message"
          style="color:${safeSiteUpdateColor(row.text_color)};font-size:${safeSiteUpdateFontSize(row.font_size)}px">
          ${escapeChat(row.message || '')}
        </div>

        ${isAdmin ? `
          <div class="site-update-admin-actions">
            <button class="site-update-edit" type="button" data-edit-site-update="${Number(row.id)}">Edit</button>
            <button class="site-update-delete" type="button" data-delete-site-update="${Number(row.id)}">Delete</button>
          </div>` : ''}
      </div>
    `).join('');
  }catch(err){
    console.error('Update board load error:',err);
    siteUpdatesList.innerHTML =
      `<div class="site-update-empty">${escapeChat(err?.message || 'Could not load updates.')}</div>`;
  }
}


function resetSiteUpdateComposer(){
  siteUpdateEditingId = null;

  if(siteUpdateInput) siteUpdateInput.value = '';
  if(siteUpdateFontSize) siteUpdateFontSize.value = '16';
  if(siteUpdateColor) siteUpdateColor.value = '#d8dde3';
  if(siteUpdateCharCount) siteUpdateCharCount.textContent = '0 / 1000';
  if(siteUpdatePostBtn) siteUpdatePostBtn.textContent = 'Post update';

  siteUpdateCancelEditBtn?.classList.add('hidden');

  const label = siteUpdateAdminComposer?.querySelector('.site-update-admin-label>span');
  if(label) label.textContent = 'Admin announcement';

  updateSiteUpdatePreview();
}

function beginSiteUpdateEdit(id){
  const row = siteUpdateRowsById.get(Number(id));
  if(!row || !siteUpdateAdminComposer) return;

  siteUpdateEditingId = Number(row.id);

  if(siteUpdateInput) siteUpdateInput.value = row.message || '';
  if(siteUpdateFontSize) siteUpdateFontSize.value = String(safeSiteUpdateFontSize(row.font_size));
  if(siteUpdateColor) siteUpdateColor.value = safeSiteUpdateColor(row.text_color);
  if(siteUpdateCharCount){
    siteUpdateCharCount.textContent = `${String(row.message || '').length} / 1000`;
  }

  if(siteUpdatePostBtn) siteUpdatePostBtn.textContent = 'Save changes';
  siteUpdateCancelEditBtn?.classList.remove('hidden');

  const label = siteUpdateAdminComposer.querySelector('.site-update-admin-label>span');
  if(label) label.textContent = 'Editing published update';

  updateSiteUpdatePreview();
  siteUpdateAdminComposer.scrollIntoView({behavior:'smooth',block:'center'});
  setTimeout(() => siteUpdateInput?.focus(),250);
}

siteUpdateCancelEditBtn?.addEventListener('click',() => {
  resetSiteUpdateComposer();
  setSiteUpdateStatus('Edit canceled.');
});

async function postSiteUpdate(){
  if(siteUpdatePosting) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  const message = String(siteUpdateInput?.value || '').trim();
  const textColor = safeSiteUpdateColor(siteUpdateColor?.value);
  const fontSize = safeSiteUpdateFontSize(siteUpdateFontSize?.value);

  if(!client || !session?.user){
    setSiteUpdateStatus('Log in to post.','error');
    return;
  }

  if(!message){
    setSiteUpdateStatus('Write an update first.','error');
    siteUpdateInput?.focus();
    return;
  }

  siteUpdatePosting = true;
  siteUpdatePostBtn.disabled = true;
  if(siteUpdateCancelEditBtn) siteUpdateCancelEditBtn.disabled = true;

  const editing = Number(siteUpdateEditingId) > 0;
  setSiteUpdateStatus(editing ? 'Saving changes...' : 'Posting update...');

  try{
    if(editing){
      const {error} = await client.rpc('update_site_update_styled',{
        update_id:Number(siteUpdateEditingId),
        update_message:message,
        update_color:textColor,
        update_font_size:fontSize
      });
      if(error) throw error;

      resetSiteUpdateComposer();
      setSiteUpdateStatus('✓ Update edited.','success');
    }else{
      const {error} = await client.rpc('post_site_update_styled',{
        update_message:message,
        update_color:textColor,
        update_font_size:fontSize
      });
      if(error) throw error;

      resetSiteUpdateComposer();
      setSiteUpdateStatus('✓ Update posted.','success');
    }

    await loadSiteUpdates();
  }catch(err){
    setSiteUpdateStatus(err?.message || String(err),'error');
  }finally{
    siteUpdatePosting = false;
    siteUpdatePostBtn.disabled = false;
    if(siteUpdateCancelEditBtn) siteUpdateCancelEditBtn.disabled = false;
  }
}

async function deleteSiteUpdate(id){
  if(!id || !confirm('Delete this update from the board?')) return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  try{
    const {error} = await client.rpc('delete_site_update',{
      update_id:Number(id)
    });
    if(error) throw error;

    if(Number(siteUpdateEditingId) === Number(id)){
      resetSiteUpdateComposer();
    }

    await loadSiteUpdates();
    setSiteUpdateStatus('✓ Update deleted.','success');
  }catch(err){
    setSiteUpdateStatus(err?.message || String(err),'error');
  }
}

siteUpdateInput?.addEventListener('input',() => {
  if(siteUpdateCharCount){
    siteUpdateCharCount.textContent =
      `${siteUpdateInput.value.length} / 1000`;
  }
  updateSiteUpdatePreview();
});

siteUpdateFontSize?.addEventListener('change',updateSiteUpdatePreview);
siteUpdateColor?.addEventListener('input',updateSiteUpdatePreview);

document.querySelectorAll('[data-update-color]').forEach(btn => {
  btn.addEventListener('click',() => {
    if(siteUpdateColor){
      siteUpdateColor.value = safeSiteUpdateColor(btn.dataset.updateColor);
      updateSiteUpdatePreview();
    }
  });
});

updateSiteUpdatePreview();

siteUpdateInput?.addEventListener('keydown',(e) => {
  if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
    e.preventDefault();
    postSiteUpdate();
  }
});

siteUpdatePostBtn?.addEventListener('click',postSiteUpdate);

siteUpdatesList?.addEventListener('click',(e) => {
  const editBtn = e.target.closest('[data-edit-site-update]');
  if(editBtn){
    beginSiteUpdateEdit(Number(editBtn.dataset.editSiteUpdate));
    return;
  }

  const deleteBtn = e.target.closest('[data-delete-site-update]');
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
  chatPollTimer = setInterval(() => loadCommunityChat(false), 3000);
}

if(window.gymcelsLolDb){
  window.gymcelsLolDb.auth.onAuthStateChange((_event, session) => {
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
    staffAdminPanel?.classList.add('hidden');
    startCommunityChat(session);
  });

  setTimeout(async () => {
    try{
      const session = await getChatSession();
      startCommunityChat(session);
    } catch(err){
      setChatStatus('Chat error: ' + (err?.message || String(err)), 'error');
    }
  }, 250);
} else {
  setChatStatus('Chat database connection is not ready.', 'error');
}


// ---- Gymcel Threads ----
const navThreadsOutside = document.getElementById('navThreads');
const threadsSection = document.getElementById('threadsSection');
const openThreadComposerBtn = document.getElementById('openThreadComposerBtn');
const threadGuestNote = document.getElementById('threadGuestNote');
const threadComposer = document.getElementById('threadComposer');
const threadCategory = document.getElementById('threadCategory');
const threadTitle = document.getElementById('threadTitle');
const threadBody = document.getElementById('threadBody');
const threadMediaInput = document.getElementById('threadMediaInput');
const threadMediaPreview = document.getElementById('threadMediaPreview');
const threadMediaPreviewList = document.getElementById('threadMediaPreviewList');
const threadMediaRemove = document.getElementById('threadMediaRemove');
const threadPollToggle = document.getElementById('threadPollToggle');
const threadPollFields = document.getElementById('threadPollFields');
const threadPollRemove = document.getElementById('threadPollRemove');
const threadPollQuestion = document.getElementById('threadPollQuestion');
const threadPollOptions = document.getElementById('threadPollOptions');
const threadPollAddOption = document.getElementById('threadPollAddOption');
const createThreadBtn = document.getElementById('createThreadBtn');
const cancelThreadBtn = document.getElementById('cancelThreadBtn');
const threadComposerStatus = document.getElementById('threadComposerStatus');
const threadSearchInput = document.getElementById('threadSearchInput');
const threadSearchClear = document.getElementById('threadSearchClear');
const threadBookmarksFilter = document.getElementById('threadBookmarksFilter');
const threadFilters = document.getElementById('threadFilters');
const threadsList = document.getElementById('threadsList');
const threadsStatus = document.getElementById('threadsStatus');

const threadOverlay = document.getElementById('threadOverlay');
const threadCloseBtn = document.getElementById('threadCloseBtn');
const threadViewCategory = document.getElementById('threadViewCategory');
const threadViewTitle = document.getElementById('threadViewTitle');
const threadViewAuthor = document.getElementById('threadViewAuthor');
const threadViewAuthorStaff = document.getElementById('threadViewAuthorStaff');
const threadViewTime = document.getElementById('threadViewTime');
const threadViewBody = document.getElementById('threadViewBody');
const threadViewMedia = document.getElementById('threadViewMedia');
const threadViewPoll = document.getElementById('threadViewPoll');
const threadViewReactions = document.getElementById('threadViewReactions');
const threadViewBookmarkBtn = document.getElementById('threadViewBookmarkBtn');
const threadOwnerActions = document.getElementById('threadOwnerActions');
const threadLockBtn = document.getElementById('threadLockBtn');
const threadDeleteBtn = document.getElementById('threadDeleteBtn');
const threadReplyCount = document.getElementById('threadReplyCount');
const threadReplies = document.getElementById('threadReplies');
const threadReplyLocked = document.getElementById('threadReplyLocked');
const threadReplyTargetBar = document.getElementById('threadReplyTargetBar');
const threadReplyTargetName = document.getElementById('threadReplyTargetName');
const threadReplyTargetPreview = document.getElementById('threadReplyTargetPreview');
const threadReplyTargetCancel = document.getElementById('threadReplyTargetCancel');
const threadReplyComposer = document.getElementById('threadReplyComposer');
const threadReplyInput = document.getElementById('threadReplyInput');
const threadReplyMediaInput = document.getElementById('threadReplyMediaInput');
const threadReplyMediaLabel = document.getElementById('threadReplyMediaLabel');
const threadReplyMediaPreview = document.getElementById('threadReplyMediaPreview');
const threadReplyMediaPreviewList = document.getElementById('threadReplyMediaPreviewList');
const threadReplyMediaRemove = document.getElementById('threadReplyMediaRemove');
const threadReplyBtn = document.getElementById('threadReplyBtn');
const threadReplyStatus = document.getElementById('threadReplyStatus');

const threadPhotoLightbox = document.getElementById('threadPhotoLightbox');
const threadPhotoLightboxImage = document.getElementById('threadPhotoLightboxImage');
const threadPhotoLightboxClose = document.getElementById('threadPhotoLightboxClose');

let threadFilter = 'All';
let threadRows = [];
let activeThread = null;
let threadsPollTimer = null;
let threadPosting = false;
let threadReplyPosting = false;
let threadReplyTarget = null;
let threadPollEnabled = false;
let threadSearchTerm = '';
let threadSearchTimer = null;
let threadBookmarksOnly = false;
let threadBookmarkedIds = new Set();
let threadMediaFiles = [];
let threadMediaPreviewUrls = [];
let threadReplyMediaFiles = [];
let threadReplyMediaPreviewUrls = [];

function setThreadStatus(el, text='', type='normal'){
  if(!el) return;
  el.textContent = text;
  el.style.color =
    type === 'error' ? '#ff7c89' :
    type === 'success' ? '#67e8a5' :
    '#8c95a1';
  el.style.fontWeight = type === 'error' || type === 'success' ? '800' : '';
}

function threadTime(value){
  if(!value) return '';
  const d = new Date(value);
  const diff = Date.now() - d.getTime();
  if(diff < 60000) return 'now';
  if(diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if(diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if(diff < 604800000) return `${Math.floor(diff/86400000)}d ago`;
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
}


const THREAD_MEDIA_MAX_BYTES = 8 * 1024 * 1024;
const THREAD_MEDIA_MAX_FILES = 4;
const THREAD_MEDIA_ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
]);

function threadMediaExtension(file){
  const byType={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
  return byType[file?.type] || 'jpg';
}

function validateThreadMediaFile(file){
  if(!file) return 'Choose a photo first.';
  if(!THREAD_MEDIA_ALLOWED_TYPES.has(file.type)) return 'Use JPG, PNG, or WebP photos.';
  if(file.size > THREAD_MEDIA_MAX_BYTES) return 'Each photo must be 8 MB or smaller.';
  return '';
}

function validateThreadMediaFiles(files){
  const list=[...(files || [])];
  if(!list.length) return '';
  if(list.length > THREAD_MEDIA_MAX_FILES){
    return `You can upload up to ${THREAD_MEDIA_MAX_FILES} photos per post.`;
  }
  for(const file of list){
    const error=validateThreadMediaFile(file);
    if(error) return error;
  }
  return '';
}

function revokeThreadPreviewUrls(urls){
  (urls || []).forEach(url=>{
    try{ URL.revokeObjectURL(url); }catch(_){}
  });
}

function renderThreadMediaPreview(files,isReply=false){
  const list=[...(files || [])];
  const target=isReply ? threadReplyMediaPreviewList : threadMediaPreviewList;
  const wrapper=isReply ? threadReplyMediaPreview : threadMediaPreview;
  if(!target || !wrapper) return;

  const urls=list.map(file=>URL.createObjectURL(file));
  if(isReply){
    revokeThreadPreviewUrls(threadReplyMediaPreviewUrls);
    threadReplyMediaPreviewUrls=urls;
  }else{
    revokeThreadPreviewUrls(threadMediaPreviewUrls);
    threadMediaPreviewUrls=urls;
  }

  target.innerHTML=list.map((file,index)=>`
    <div class="thread-media-preview-tile">
      <img src="${escapeChat(urls[index])}" alt="Selected photo ${index+1}">
    </div>`).join('');

  wrapper.classList.toggle('hidden',list.length===0);
}

function clearThreadMediaSelection(){
  threadMediaFiles=[];
  revokeThreadPreviewUrls(threadMediaPreviewUrls);
  threadMediaPreviewUrls=[];
  if(threadMediaInput) threadMediaInput.value='';
  if(threadMediaPreviewList) threadMediaPreviewList.innerHTML='';
  threadMediaPreview?.classList.add('hidden');
}

function clearThreadReplyMediaSelection(){
  threadReplyMediaFiles=[];
  revokeThreadPreviewUrls(threadReplyMediaPreviewUrls);
  threadReplyMediaPreviewUrls=[];
  if(threadReplyMediaInput) threadReplyMediaInput.value='';
  if(threadReplyMediaPreviewList) threadReplyMediaPreviewList.innerHTML='';
  threadReplyMediaPreview?.classList.add('hidden');
}

function previewThreadMedia(files,isReply=false){
  const list=[...(files || [])];
  const error=validateThreadMediaFiles(list);
  if(error){
    setThreadStatus(isReply ? threadReplyStatus : threadComposerStatus,error,'error');
    if(isReply && threadReplyMediaInput) threadReplyMediaInput.value='';
    if(!isReply && threadMediaInput) threadMediaInput.value='';
    return false;
  }

  if(isReply){
    threadReplyMediaFiles=list;
    renderThreadMediaPreview(list,true);
    setThreadStatus(threadReplyStatus,`${list.length} photo${list.length===1?'':'s'} ready to upload.`);
  }else{
    threadMediaFiles=list;
    renderThreadMediaPreview(list,false);
    setThreadStatus(threadComposerStatus,`${list.length} photo${list.length===1?'':'s'} ready to upload.`);
  }
  return true;
}

async function uploadThreadMedia(file,userId,kind='thread'){
  const client=window.gymcelsLolDb;
  if(!client || !file || !userId) return null;

  const error=validateThreadMediaFile(file);
  if(error) throw new Error(error);

  const ext=threadMediaExtension(file);
  const unique=(globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
  const path=`${userId}/${kind}/${Date.now()}-${unique}.${ext}`;

  const {error:uploadError}=await client.storage
    .from('thread-media')
    .upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
  if(uploadError) throw uploadError;

  const {data}=client.storage.from('thread-media').getPublicUrl(path);
  const url=data?.publicUrl;
  if(!url){
    try{ await client.storage.from('thread-media').remove([path]); }catch(_){}
    throw new Error('Could not create the photo URL.');
  }
  return {url,path};
}

async function cleanupUploadedThreadMedia(pathOrPaths){
  const paths=Array.isArray(pathOrPaths)
    ? pathOrPaths.filter(Boolean)
    : [pathOrPaths].filter(Boolean);

  if(!paths.length) return;
  try{
    await window.gymcelsLolDb?.storage.from('thread-media').remove(paths);
  }catch(err){
    console.debug('Thread photo cleanup:',err);
  }
}

async function uploadThreadMediaFiles(files,userId,kind='thread'){
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
    await cleanupUploadedThreadMedia(uploaded.map(x=>x?.path));
    throw err;
  }

  return {
    urls:uploaded.map(x=>x.url),
    paths:uploaded.map(x=>x.path)
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

function threadMediaGalleryMarkup(urls,extraClass=''){
  const list=[...new Set((urls || []).filter(Boolean))].slice(0,THREAD_MEDIA_MAX_FILES);
  if(!list.length) return '';

  return `<div class="thread-media-gallery count-${list.length} ${extraClass}">
    ${list.map((url,index)=>{
      const safe=escapeChat(url);
      return `<div class="thread-media-gallery-item">
        <button type="button" data-thread-photo="${safe}" aria-label="Open photo ${index+1}">
          <img src="${safe}" alt="Thread photo ${index+1}" loading="lazy">
        </button>
      </div>`;
    }).join('')}
  </div>`;
}

function openThreadPhoto(url){
  if(!url || !threadPhotoLightbox || !threadPhotoLightboxImage) return;
  threadPhotoLightboxImage.src=url;
  threadPhotoLightbox.classList.add('show');
  threadPhotoLightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closeThreadPhoto(){
  if(!threadPhotoLightbox || !threadPhotoLightboxImage) return;
  threadPhotoLightbox.classList.remove('show');
  threadPhotoLightbox.setAttribute('aria-hidden','true');
  threadPhotoLightboxImage.removeAttribute('src');
  document.body.style.overflow='';
}

function setThreadsAuthState(session){
  const signedIn = !!session?.user;

  if(openThreadComposerBtn){
    openThreadComposerBtn.disabled = !signedIn;
    openThreadComposerBtn.textContent = signedIn ? '+ New Thread' : 'Log in to post';
  }

  if(threadGuestNote){
    threadGuestNote.textContent = signedIn
      ? 'Start a topic or jump into an existing discussion.'
      : 'Anyone can read threads. Log in to create one or reply.';
  }

  if(!signedIn && threadComposer){
    threadComposer.classList.add('hidden');
  }

  if(activeThread) updateThreadReplyComposer(session);
}



function renumberThreadPollOptions(){
  const rows=[...(threadPollOptions?.querySelectorAll('[data-poll-option-row]') || [])];

  rows.forEach((row,index)=>{
    const number=row.querySelector(':scope > span');
    const input=row.querySelector('[data-thread-poll-option]');
    const remove=row.querySelector('[data-remove-poll-option]');

    if(number) number.textContent=String(index+1);
    if(input) input.placeholder=`Option ${index+1}`;
    if(remove) remove.disabled=rows.length<=2;
  });

  if(threadPollAddOption) threadPollAddOption.disabled=rows.length>=6;
}

function addThreadPollOption(){
  if(!threadPollOptions) return;

  const current=threadPollOptions.querySelectorAll('[data-poll-option-row]').length;
  if(current>=6) return;

  const row=document.createElement('div');
  row.className='thread-poll-option-edit';
  row.setAttribute('data-poll-option-row','');
  row.innerHTML=`
    <span>${current+1}</span>
    <input type="text" maxlength="100" data-thread-poll-option placeholder="Option ${current+1}">
    <button type="button" data-remove-poll-option aria-label="Remove option">×</button>
  `;

  threadPollOptions.appendChild(row);
  renumberThreadPollOptions();
  row.querySelector('input')?.focus();
}

function setThreadPollEnabled(enabled){
  threadPollEnabled=!!enabled;
  threadPollFields?.classList.toggle('hidden',!threadPollEnabled);

  if(threadPollToggle){
    threadPollToggle.classList.toggle('active',threadPollEnabled);
    threadPollToggle.textContent=threadPollEnabled ? '📊 Poll added' : '📊 Add poll';
  }

  if(threadPollEnabled) threadPollQuestion?.focus();
}

function resetThreadPollComposer(){
  threadPollEnabled=false;
  threadPollFields?.classList.add('hidden');

  if(threadPollToggle){
    threadPollToggle.classList.remove('active');
    threadPollToggle.textContent='📊 Add poll';
  }

  if(threadPollQuestion) threadPollQuestion.value='';

  if(threadPollOptions){
    threadPollOptions.innerHTML=`
      <div class="thread-poll-option-edit" data-poll-option-row>
        <span>1</span>
        <input type="text" maxlength="100" data-thread-poll-option placeholder="Option 1">
        <button type="button" data-remove-poll-option aria-label="Remove option">×</button>
      </div>
      <div class="thread-poll-option-edit" data-poll-option-row>
        <span>2</span>
        <input type="text" maxlength="100" data-thread-poll-option placeholder="Option 2">
        <button type="button" data-remove-poll-option aria-label="Remove option">×</button>
      </div>
    `;
  }

  renumberThreadPollOptions();
}

function collectThreadPollDraft(){
  if(!threadPollEnabled){
    return {enabled:false,question:'',options:[],error:''};
  }

  const question=String(threadPollQuestion?.value || '').trim();
  const options=[...(threadPollOptions?.querySelectorAll('[data-thread-poll-option]') || [])]
    .map(input=>String(input.value || '').trim())
    .filter(Boolean);

  if(question.length<3){
    return {enabled:true,question,options,error:'Give your poll a question.'};
  }

  if(options.length<2){
    return {enabled:true,question,options,error:'Add at least 2 poll options.'};
  }

  if(options.length>6){
    return {enabled:true,question,options,error:'Polls can have up to 6 options.'};
  }

  const unique=new Set(options.map(x=>x.toLowerCase()));
  if(unique.size!==options.length){
    return {enabled:true,question,options,error:'Poll options must be different.'};
  }

  return {enabled:true,question,options,error:''};
}

async function loadThreadPoll(threadId,session=null){
  if(!threadViewPoll) return;

  const client=window.gymcelsLolDb;
  if(!client) return;

  const currentSession=session || await getChatSession();

  try{
    const {data,error}=await client.rpc('get_thread_poll',{
      target_thread_id:Number(threadId)
    });

    if(error) throw error;

    const rows=data || [];

    if(!rows.length){
      threadViewPoll.innerHTML='';
      threadViewPoll.classList.add('hidden');
      return;
    }

    const first=rows[0];
    const totalVotes=Number(first.total_votes || 0);
    const canVote=!!currentSession?.user && !activeThread?.is_locked;

    threadViewPoll.innerHTML=`
      <div class="thread-poll-question">${escapeChat(first.question || 'Poll')}</div>

      <div class="thread-poll-options-live">
        ${rows.map(row=>{
          const count=Number(row.vote_count || 0);
          const percent=totalVotes>0 ? Math.round((count/totalVotes)*100) : 0;
          const selected=row.selected===true;

          return `<button class="thread-poll-option-live ${selected ? 'selected' : ''}"
                          type="button"
                          data-thread-poll-vote="${Number(row.option_id)}"
                          data-thread-poll-id="${Number(row.poll_id)}"
                          ${canVote ? '' : 'disabled'}>
            <span class="thread-poll-option-fill" style="width:${percent}%"></span>
            <span class="thread-poll-option-copy">
              ${escapeChat(row.option_text || 'Option')}
              ${selected ? '<b>✓ Your vote</b>' : ''}
            </span>
            <span class="thread-poll-option-result">${percent}% · ${count}</span>
          </button>`;
        }).join('')}
      </div>

      <div class="thread-poll-footer">
        <span>${totalVotes} vote${totalVotes===1?'':'s'}</span>
        <span>${
          !currentSession?.user
            ? 'Log in to vote'
            : (activeThread?.is_locked ? 'Poll closed while thread is locked' : 'Tap an option to vote · you can change it')
        }</span>
      </div>
    `;

    threadViewPoll.classList.remove('hidden');
  }catch(err){
    console.error('Poll load error:',err);
    threadViewPoll.innerHTML='';
    threadViewPoll.classList.add('hidden');
  }
}

async function voteThreadPoll(pollId,optionId){
  const client=window.gymcelsLolDb;
  const session=await getChatSession();

  if(!client || !session?.user){
    document.getElementById('login-card')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }

  try{
    const {error}=await client.rpc('vote_in_thread_poll',{
      target_poll_id:Number(pollId),
      target_option_id:Number(optionId)
    });

    if(error) throw error;

    if(activeThread){
      await loadThreadPoll(activeThread.id,session);
    }
  }catch(err){
    setThreadStatus(threadReplyStatus,err?.message || String(err),'error');
  }
}

threadPollToggle?.addEventListener('click',()=>{
  setThreadPollEnabled(!threadPollEnabled);
});

threadPollRemove?.addEventListener('click',resetThreadPollComposer);
threadPollAddOption?.addEventListener('click',addThreadPollOption);

threadPollOptions?.addEventListener('click',(e)=>{
  const btn=e.target.closest('[data-remove-poll-option]');
  if(!btn) return;

  const rows=threadPollOptions.querySelectorAll('[data-poll-option-row]');
  if(rows.length<=2) return;

  btn.closest('[data-poll-option-row]')?.remove();
  renumberThreadPollOptions();
});

threadViewPoll?.addEventListener('click',(e)=>{
  const btn=e.target.closest('[data-thread-poll-vote]');
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
    threadBookmarksFilter?.classList.remove('active');
    return threadBookmarkedIds;
  }

  const {data,error}=await client
    .from('thread_bookmarks')
    .select('thread_id')
    .eq('user_id',currentSession.user.id);

  if(error){
    console.error('Thread bookmarks load error:',error);
    return threadBookmarkedIds;
  }

  threadBookmarkedIds=new Set((data || []).map(row=>Number(row.thread_id)).filter(Boolean));
  return threadBookmarkedIds;
}

function updateThreadViewBookmark(session){
  if(!threadViewBookmarkBtn || !activeThread) return;
  const signedIn=!!session?.user;
  threadViewBookmarkBtn.classList.toggle('hidden',!signedIn);
  if(!signedIn) return;

  const saved=threadBookmarkedIds.has(Number(activeThread.id));
  threadViewBookmarkBtn.classList.toggle('saved',saved);
  threadViewBookmarkBtn.textContent=saved ? '🔖 Saved' : '🔖 Save';
}

async function toggleThreadBookmark(threadId){
  const id=Number(threadId);
  if(!id) return;

  const client=window.gymcelsLolDb;
  const session=await getChatSession();

  if(!client || !session?.user){
    setThreadStatus(threadsStatus,'Log in to save bookmarks.','error');
    return;
  }

  const saved=threadBookmarkedIds.has(id);

  try{
    if(saved){
      const {error}=await client.from('thread_bookmarks')
        .delete().eq('user_id',session.user.id).eq('thread_id',id);
      if(error) throw error;
      threadBookmarkedIds.delete(id);
    }else{
      const {error}=await client.from('thread_bookmarks')
        .insert({user_id:session.user.id,thread_id:id});
      if(error) throw error;
      threadBookmarkedIds.add(id);
    }

    updateThreadViewBookmark(session);
    await loadThreads();
  }catch(err){
    setThreadStatus(threadsStatus,err?.message || String(err),'error');
  }
}

async function loadThreads(){
  const client=window.gymcelsLolDb;
  if(!client || !threadsList) return;

  setThreadStatus(threadsStatus,'Loading threads...');

  const threadSession=await getChatSession();
  await loadThreadBookmarks(threadSession);

  let query=client
    .from('forum_threads')
    .select('id,author_id,author_name,title,body,category,is_locked,media_url,media_path,media_urls,media_paths,created_at')
    .order('created_at',{ascending:false})
    .limit(200);

  if(threadFilter !== 'All') query=query.eq('category',threadFilter);

  const {data,error}=await query;
  if(error){
    threadsList.innerHTML=`<div class="thread-empty">${escapeChat(error.message)}</div>`;
    setThreadStatus(threadsStatus,'','normal');
    return;
  }

  let rows=data || [];
  const search=String(threadSearchTerm || '').trim().toLowerCase();

  if(search){
    rows=rows.filter(row=>{
      const haystack=[row.title,row.body,row.author_name,row.category]
        .map(x=>String(x || '').toLowerCase()).join(' ');
      return haystack.includes(search);
    });
  }

  if(threadBookmarksOnly){
    rows=rows.filter(row=>threadBookmarkedIds.has(Number(row.id)));
  }

  threadRows=rows;

  if(!threadRows.length){
    const message=threadBookmarksOnly
      ? 'No bookmarked threads match this view.'
      : (search ? 'No threads matched your search.' : 'No threads here yet. Be the first to start one.');
    threadsList.innerHTML=`<div class="thread-empty">${message}</div>`;
    setThreadStatus(threadsStatus,'');
    return;
  }

  const ids=threadRows.map(x=>x.id);
  let counts={};

  if(ids.length){
    const {data:replyRows,error:replyCountError}=await client
      .from('forum_replies').select('thread_id').in('thread_id',ids);

    if(!replyCountError){
      counts=(replyRows || []).reduce((acc,row)=>{
        acc[row.thread_id]=(acc[row.thread_id] || 0)+1;
        return acc;
      },{});
    }
  }

  const threadStaffRoleMap=await loadPublicStaffRoles(threadRows.map(row=>row.author_id));
  const threadReactionMap=await loadReactionState(
    'thread',ids,threadSession?.user?.id || null
  );

  threadsList.innerHTML=threadRows.map(row=>{
    const preview=String(row.body || '').replace(/\s+/g,' ').trim();
    const media=threadAllMedia(row);
    const saved=threadBookmarkedIds.has(Number(row.id));

    return `
      <div class="thread-card" role="button" tabindex="0" data-open-thread="${row.id}">
        <div class="thread-card-top">
          <span class="thread-category">${escapeChat(row.category || 'General')}</span>
          <span class="thread-card-time">${escapeChat(threadTime(row.created_at))}</span>
        </div>

        <div class="thread-card-title">${escapeChat(row.title || 'Untitled')}</div>
        ${preview ? `<div class="thread-card-preview">${escapeChat(preview)}</div>` : ''}

        ${media.length ? `
          <div class="thread-card-media">
            <img src="${escapeChat(media[0])}" alt="Thread photo" loading="lazy">
            ${media.length>1 ? `<span class="thread-card-media-count">📷 ${media.length}</span>` : ''}
          </div>` : ''}

        <div class="thread-card-meta">
          <span class="thread-card-author">by ${escapeChat(row.author_name || 'Member')}${staffBadgeMarkup(threadStaffRoleMap[row.author_id] || null)}</span>
          <span>${Number(counts[row.id] || 0)} ${Number(counts[row.id] || 0)===1 ? 'reply' : 'replies'}</span>
          ${media.length ? `<span class="thread-card-has-photo">📷 ${media.length} photo${media.length===1?'':'s'}</span>` : ''}
          ${row.is_locked ? '<span class="thread-card-locked">🔒 Locked</span>' : ''}
          ${threadSession?.user ? `
            <button class="thread-card-bookmark ${saved ? 'saved' : ''}" type="button"
                    data-thread-bookmark="${Number(row.id)}">
              ${saved ? '🔖 Saved' : '🔖 Save'}
            </button>` : ''}
        </div>

        ${reactionBarHtml('thread',row.id,threadReactionMap[Number(row.id)] || {},'thread-card-reactions')}
      </div>`;
  }).join('');

  setThreadStatus(threadsStatus,'');
}

async function createThread(){
  if(threadPosting) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setThreadStatus(threadComposerStatus,'Log in to create a thread.','error');
    return;
  }

  const title = String(threadTitle?.value || '').trim();
  const body = String(threadBody?.value || '').trim();
  const category = String(threadCategory?.value || 'General');
  const pollDraft=collectThreadPollDraft();

  if(title.length < 3){
    setThreadStatus(threadComposerStatus,'Give your thread a title.','error');
    return;
  }
  if(body.length < 2 && !threadMediaFiles.length && !pollDraft.enabled){
    setThreadStatus(threadComposerStatus,'Write something, add a photo, or add a poll.','error');
    return;
  }

  if(pollDraft.error){
    setThreadStatus(threadComposerStatus,pollDraft.error,'error');
    return;
  }

  threadPosting = true;
  if(createThreadBtn) createThreadBtn.disabled = true;
  setThreadStatus(threadComposerStatus,'Posting...');

  let uploadedMedia = {urls:[],paths:[]};

  try{
    if(threadMediaFiles.length){
      setThreadStatus(threadComposerStatus,`Uploading ${threadMediaFiles.length} photo${threadMediaFiles.length===1?'':'s'}...`);
      uploadedMedia=await uploadThreadMediaFiles(threadMediaFiles,session.user.id,'threads');
      setThreadStatus(threadComposerStatus,'Posting thread...');
    }

    const { data, error } = await client
      .from('forum_threads')
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
      .select('id')
      .single();

    if(error){
      if(uploadedMedia.paths.length) await cleanupUploadedThreadMedia(uploadedMedia.paths);
      throw error;
    }

    if(pollDraft.enabled){
      const {error:pollError}=await client.rpc('create_thread_poll',{
        target_thread_id:Number(data.id),
        poll_question:pollDraft.question,
        poll_options:pollDraft.options
      });

      if(pollError){
        // Keep the database clean if the thread was created but its poll failed.
        try{ await client.from('forum_threads').delete().eq('id',Number(data.id)); }catch(_){}
        if(uploadedMedia.paths.length){
          await cleanupUploadedThreadMedia(uploadedMedia.paths);
          uploadedMedia={urls:[],paths:[]};
        }
        throw pollError;
      }
    }

    if(threadTitle) threadTitle.value = '';
    if(threadBody) threadBody.value = '';
    clearThreadMediaSelection();
    resetThreadPollComposer();
    if(threadComposer) threadComposer.classList.add('hidden');
    setThreadStatus(threadComposerStatus,'✓ THREAD POSTED','success');

    await loadThreads();
    if(data?.id) await openThread(Number(data.id));
  }catch(err){
    setThreadStatus(threadComposerStatus, err?.message || String(err), 'error');
  }finally{
    threadPosting = false;
    if(createThreadBtn) createThreadBtn.disabled = false;
  }
}


function clearThreadReplyTarget(){
  threadReplyTarget = null;
  threadReplyTargetBar?.classList.add('hidden');
  if(threadReplyTargetName) threadReplyTargetName.textContent = 'Member';
  if(threadReplyTargetPreview) threadReplyTargetPreview.textContent = '';
}

function startThreadReplyTo(row){
  if(!row) return;

  threadReplyTarget = {
    id:Number(row.id),
    author_id:String(row.author_id || ''),
    author_name:String(row.author_name || 'Member'),
    body:String(row.body || '')
  };

  if(threadReplyTargetName){
    threadReplyTargetName.textContent = threadReplyTarget.author_name;
  }

  if(threadReplyTargetPreview){
    const preview = threadReplyTarget.body.replace(/\s+/g,' ').trim();
    threadReplyTargetPreview.textContent =
      preview.length > 120 ? preview.slice(0,120) + '…' : preview;
  }

  threadReplyTargetBar?.classList.remove('hidden');
  threadReplyInput?.focus();
}

function jumpToThreadReply(replyId){
  const target = threadReplies?.querySelector(`[data-thread-reply-id="${Number(replyId)}"]`);
  if(!target) return;

  target.scrollIntoView({behavior:'smooth',block:'center'});
  target.classList.remove('reply-highlight');
  void target.offsetWidth;
  target.classList.add('reply-highlight');

  setTimeout(() => target.classList.remove('reply-highlight'),1500);
}

function updateThreadReplyComposer(session){
  if(!threadReplyInput || !threadReplyBtn || !threadReplyLocked) return;

  const signedIn = !!session?.user;
  const locked = !!activeThread?.is_locked;

  threadReplyLocked.classList.toggle('hidden', !locked);

  if(locked){
    threadReplyInput.disabled = true;
    threadReplyBtn.disabled = true;
    if(threadReplyMediaInput) threadReplyMediaInput.disabled = true;
    threadReplyMediaLabel?.classList.add('disabled');
    threadReplyInput.placeholder = 'This thread is locked.';
    threadReplyBtn.textContent = 'Locked';
  }else if(!signedIn){
    threadReplyInput.disabled = true;
    threadReplyBtn.disabled = true;
    if(threadReplyMediaInput) threadReplyMediaInput.disabled = true;
    threadReplyMediaLabel?.classList.add('disabled');
    threadReplyInput.placeholder = 'Log in to reply...';
    threadReplyBtn.textContent = 'Log in to reply';
  }else{
    threadReplyInput.disabled = false;
    threadReplyBtn.disabled = false;
    if(threadReplyMediaInput) threadReplyMediaInput.disabled = false;
    threadReplyMediaLabel?.classList.remove('disabled');
    threadReplyInput.placeholder = 'Write a reply or add a photo...';
    threadReplyBtn.textContent = 'Reply';
  }
}

async function loadThreadReplies(threadId){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !threadReplies) return;

  const { data, error } = await client
    .from('forum_replies')
    .select('id,thread_id,author_id,author_name,body,reply_to_id,media_url,media_path,media_urls,media_paths,created_at')
    .eq('thread_id', threadId)
    .order('created_at',{ascending:true})
    .limit(300);

  if(error){
    threadReplies.innerHTML = `<div class="thread-empty">${escapeChat(error.message)}</div>`;
    return;
  }

  const rows = data || [];
  if(threadReplyCount) threadReplyCount.textContent = String(rows.length);

  if(!rows.length){
    threadReplies.innerHTML = '<div class="thread-empty">No replies yet. Start the conversation.</div>';
    return;
  }

  const me = session?.user?.id || null;
  const rowMap = new Map(rows.map(row => [Number(row.id),row]));
  const canReply = !!me && !activeThread?.is_locked;

  const threadReplyStaffRoleMap = await loadPublicStaffRoles(
    rows.map(row => row.author_id)
  );

  const threadReplyReactionMap = await loadReactionState(
    'thread_reply',
    rows.map(row => row.id),
    me
  );

  threadReplies.innerHTML = rows.map(row => {
    const canDelete = !!me && (row.author_id === me || canModerateThreads());
    const canReport = !!me && row.author_id !== me;
    const quoted = row.reply_to_id ? rowMap.get(Number(row.reply_to_id)) : null;
    const quotedPreview = quoted
      ? String(quoted.body || '').replace(/\s+/g,' ').trim()
      : '';

    return `
      <div class="thread-reply" data-thread-reply-id="${row.id}">
        ${quoted ? `
          <button class="thread-quoted-reply"
                  type="button"
                  data-jump-thread-reply="${quoted.id}">
            <strong>Replying to ${escapeChat(quoted.author_name || 'Member')}</strong>
            <span>${escapeChat(quotedPreview.length > 150 ? quotedPreview.slice(0,150) + '…' : quotedPreview)}</span>
          </button>` : ''}

        <div class="thread-reply-head">
          <span class="thread-reply-author-wrap">
            <span class="thread-reply-author">${escapeChat(row.author_name || 'Member')}</span>
            ${staffBadgeMarkup(threadReplyStaffRoleMap[row.author_id] || null)}
          </span>
          <span class="thread-reply-time">${escapeChat(threadTime(row.created_at))}</span>
        </div>

        ${row.body ? `<div class="thread-reply-body">${chatTextWithMentions(row.body || '')}</div>` : ''}

        ${threadAllMedia(row).length
          ? `<div class="thread-reply-media">${threadMediaGalleryMarkup(threadAllMedia(row))}</div>`
          : ''}

        ${reactionBarHtml(
          'thread_reply',
          row.id,
          threadReplyReactionMap[Number(row.id)] || {}
        )}

        ${(canReply || canDelete || canReport) ? `
          <div class="thread-reply-actions">
            ${canReply ? `
              <button class="thread-reply-reply"
                      type="button"
                      data-reply-thread-user="${row.id}">Reply</button>` : ''}
            ${canReport ? `
              <button class="content-report-btn"
                      type="button"
                      data-content-report="thread_reply"
                      data-report-id="${row.id}"
                      data-report-user="${escapeChat(row.author_id || '')}"
                      data-report-label="Reply by ${escapeChat(row.author_name || 'Member')}">Report</button>` : ''}
            ${canDelete ? `
              <button class="thread-reply-delete"
                      type="button"
                      data-delete-thread-reply="${row.id}">Delete</button>` : ''}
          </div>` : ''}
      </div>`;
  }).join('');

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
    .from('forum_threads')
    .select('id,author_id,author_name,title,body,category,is_locked,media_url,media_path,media_urls,media_paths,created_at')
    .eq('id', threadId)
    .maybeSingle();

  if(error || !data){
    setThreadStatus(threadsStatus, error?.message || 'Thread not found.', 'error');
    return;
  }

  activeThread = data;

  threadViewCategory.textContent = data.category || 'General';
  threadViewTitle.textContent = data.title || 'Thread';
  threadViewAuthor.textContent = data.author_name || 'Member';
  threadViewTime.textContent = threadTime(data.created_at);
  threadViewBody.textContent = data.body || '';
  threadViewBody.classList.toggle('hidden', !String(data.body || '').trim());

  if(threadViewMedia){
    const media=threadAllMedia(data);
    if(media.length){
      threadViewMedia.innerHTML=threadMediaGalleryMarkup(media);
      threadViewMedia.classList.remove('hidden');
    }else{
      threadViewMedia.innerHTML='';
      threadViewMedia.classList.add('hidden');
    }
  }

  const openedThreadStaffRoles = await loadPublicStaffRoles([data.author_id]);
  if(threadViewAuthorStaff){
    threadViewAuthorStaff.innerHTML = staffBadgeMarkup(openedThreadStaffRoles[data.author_id] || null);
  }

  const threadViewReactionMap = await loadReactionState(
    'thread',
    [data.id],
    session?.user?.id || null
  );

  if(threadViewReactions){
    threadViewReactions.innerHTML = reactionBarHtml(
      'thread',
      data.id,
      threadViewReactionMap[Number(data.id)] || {},
      'reaction-bar-thread'
    );
  }

  const canManage = !!session?.user && (data.author_id === session.user.id || canModerateThreads());
  threadOwnerActions.classList.toggle('hidden', !canManage);

  const threadReportBtn = document.getElementById('threadReportBtn');
  if(threadReportBtn){
    threadReportBtn.classList.toggle(
      'hidden',
      !session?.user || data.author_id === session.user.id
    );
  }

  await loadThreadBookmarks(session);
  updateThreadViewBookmark(session);

  if(threadLockBtn){
    threadLockBtn.textContent = data.is_locked ? 'Unlock Thread' : 'Lock Thread';
  }

  setThreadStatus(threadReplyStatus,'');
  updateThreadReplyComposer(session);

  threadOverlay.classList.add('show');
  threadOverlay.setAttribute('aria-hidden','false');

  await loadThreadReplies(data.id);
  await loadThreadPoll(data.id,session);
}

function closeThread(){
  if(!threadOverlay) return;
  threadOverlay.classList.remove('show');
  threadOverlay.setAttribute('aria-hidden','true');
  activeThread = null;
  document.getElementById('threadReportBtn')?.classList.add('hidden');
  if(threadViewPoll){
    threadViewPoll.innerHTML='';
    threadViewPoll.classList.add('hidden');
  }
  if(threadReplyInput) threadReplyInput.value = '';
  clearThreadReplyMediaSelection();
  clearThreadReplyTarget();
  setThreadStatus(threadReplyStatus,'');
}

async function postThreadReply(){
  if(threadReplyPosting || !activeThread) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setThreadStatus(threadReplyStatus,'Log in to reply.','error');
    return;
  }

  if(activeThread.is_locked){
    setThreadStatus(threadReplyStatus,'This thread is locked.','error');
    return;
  }

  const body = String(threadReplyInput?.value || '').trim();
  if(!body && !threadReplyMediaFiles.length){
    setThreadStatus(threadReplyStatus,'Write a reply or add a photo.','error');
    return;
  }

  threadReplyPosting = true;
  if(threadReplyBtn) threadReplyBtn.disabled = true;
  setThreadStatus(threadReplyStatus,'Posting reply...');

  let uploadedMedia = {urls:[],paths:[]};

  try{
    if(threadReplyMediaFiles.length){
      setThreadStatus(threadReplyStatus,`Uploading ${threadReplyMediaFiles.length} photo${threadReplyMediaFiles.length===1?'':'s'}...`);
      uploadedMedia=await uploadThreadMediaFiles(threadReplyMediaFiles,session.user.id,'replies');
      setThreadStatus(threadReplyStatus,'Posting reply...');
    }

    const { error } = await client
      .from('forum_replies')
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

    threadReplyInput.value = '';
    clearThreadReplyMediaSelection();
    clearThreadReplyTarget();
    setThreadStatus(threadReplyStatus,'✓ REPLY POSTED','success');

    await loadThreadReplies(activeThread.id);
    await loadThreads();
    setTimeout(() => setThreadStatus(threadReplyStatus,''), 2000);
  }catch(err){
    setThreadStatus(threadReplyStatus,err?.message || String(err),'error');
  }finally{
    threadReplyPosting = false;
    updateThreadReplyComposer(session);
  }
}

async function deleteThread(threadId){
  const client=window.gymcelsLolDb;
  if(!client || !threadId) return;
  if(!confirm('Delete this entire thread and all of its replies?')) return;

  let mediaPaths=[];
  try{
    const [threadRes,repliesRes]=await Promise.all([
      client.from('forum_threads').select('media_path,media_paths').eq('id',threadId).maybeSingle(),
      client.from('forum_replies').select('media_path,media_paths').eq('thread_id',threadId)
    ]);
    if(threadRes.data) mediaPaths.push(...threadAllMediaPaths(threadRes.data));
    (repliesRes.data || []).forEach(row=>mediaPaths.push(...threadAllMediaPaths(row)));
  }catch(_){}

  const {error}=await client.from('forum_threads').delete().eq('id',threadId);
  if(error){
    setThreadStatus(threadReplyStatus,error.message,'error');
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
  const { error } = await client.rpc('set_thread_locked', {
    target_thread_id:activeThread.id,
    locked_value:nextLocked
  });

  if(error){
    setThreadStatus(threadReplyStatus,error.message,'error');
    return;
  }

  activeThread.is_locked = nextLocked;
  threadLockBtn.textContent = nextLocked ? 'Unlock Thread' : 'Lock Thread';

  const session = await getChatSession();
  updateThreadReplyComposer(session);
  await loadThreadPoll(activeThread.id,session);
  await loadThreads();
}

async function deleteThreadReply(replyId){
  const client=window.gymcelsLolDb;
  if(!client || !replyId || !activeThread) return;
  if(!confirm('Delete this reply?')) return;

  let mediaPaths=[];
  try{
    const {data}=await client.from('forum_replies')
      .select('media_path,media_paths').eq('id',replyId).maybeSingle();
    if(data) mediaPaths=threadAllMediaPaths(data);
  }catch(_){}

  const {error}=await client.from('forum_replies').delete().eq('id',replyId);
  if(error){
    setThreadStatus(threadReplyStatus,error.message,'error');
    return;
  }

  await cleanupUploadedThreadMedia(mediaPaths);
  await loadThreadReplies(activeThread.id);
  await loadThreads();
}

threadMediaInput?.addEventListener('change',() => {
  const files=[...(threadMediaInput.files || [])];
  if(files.length) previewThreadMedia(files,false);
});
threadMediaRemove?.addEventListener('click',clearThreadMediaSelection);

threadReplyMediaInput?.addEventListener('change',() => {
  const files=[...(threadReplyMediaInput.files || [])];
  if(files.length) previewThreadMedia(files,true);
});
threadReplyMediaRemove?.addEventListener('click',clearThreadReplyMediaSelection);

document.addEventListener('click',(e) => {
  const photo = e.target.closest('[data-thread-photo]');
  if(photo){
    e.preventDefault();
    e.stopPropagation();
    openThreadPhoto(photo.dataset.threadPhoto || '');
  }
});

threadPhotoLightboxClose?.addEventListener('click',closeThreadPhoto);
threadPhotoLightbox?.addEventListener('click',(e) => {
  if(e.target === threadPhotoLightbox) closeThreadPhoto();
});


threadSearchInput?.addEventListener('input',() => {
  clearTimeout(threadSearchTimer);
  threadSearchTerm=String(threadSearchInput.value || '').trim();
  threadSearchClear?.classList.toggle('hidden',!threadSearchTerm);
  threadSearchTimer=setTimeout(loadThreads,180);
});

threadSearchInput?.addEventListener('keydown',(e) => {
  if(e.key==='Enter'){
    e.preventDefault();
    threadSearchTerm=String(threadSearchInput.value || '').trim();
    loadThreads();
  }
});

threadSearchClear?.addEventListener('click',() => {
  if(threadSearchInput) threadSearchInput.value='';
  threadSearchTerm='';
  threadSearchClear.classList.add('hidden');
  loadThreads();
});

threadBookmarksFilter?.addEventListener('click',async () => {
  const session=await getChatSession();
  if(!session?.user){
    setThreadStatus(threadsStatus,'Log in to view bookmarked threads.','error');
    return;
  }

  threadBookmarksOnly=!threadBookmarksOnly;
  threadBookmarksFilter.classList.toggle('active',threadBookmarksOnly);
  await loadThreads();
});

threadViewBookmarkBtn?.addEventListener('click',() => {
  if(activeThread) toggleThreadBookmark(activeThread.id);
});

if(navThreadsOutside){
  navThreadsOutside.addEventListener('click', () => {
    setTimeout(loadThreads, 100);
  });
}

if(openThreadComposerBtn){
  openThreadComposerBtn.addEventListener('click', async () => {
    const session = await getChatSession();
    if(!session?.user){
      document.getElementById('login-card')?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    threadComposer.classList.remove('hidden');
    threadTitle?.focus();
  });
}

if(cancelThreadBtn){
  cancelThreadBtn.addEventListener('click', () => {
    threadComposer.classList.add('hidden');
    clearThreadMediaSelection();
    resetThreadPollComposer();
    setThreadStatus(threadComposerStatus,'');
  });
}

if(createThreadBtn) createThreadBtn.addEventListener('click', createThread);

if(threadFilters){
  threadFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-thread-filter]');
    if(!btn) return;

    threadFilter = btn.dataset.threadFilter || 'All';

    threadFilters.querySelectorAll('.thread-filter').forEach(x =>
      x.classList.toggle('active', x === btn)
    );

    loadThreads();
  });
}

if(threadsList){
  threadsList.addEventListener('click', (e) => {
    if(e.target.closest('.reaction-control')) return;

    const bookmark=e.target.closest('[data-thread-bookmark]');
    if(bookmark){
      e.preventDefault();
      e.stopPropagation();
      toggleThreadBookmark(Number(bookmark.dataset.threadBookmark));
      return;
    }

    const card = e.target.closest('[data-open-thread]');
    if(card) openThread(Number(card.dataset.openThread));
  });

  threadsList.addEventListener('keydown',(e) => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    if(e.target.closest('.reaction-control') || e.target.closest('[data-thread-bookmark]')) return;

    const card = e.target.closest('[data-open-thread]');
    if(card){
      e.preventDefault();
      openThread(Number(card.dataset.openThread));
    }
  });
}

if(threadCloseBtn) threadCloseBtn.addEventListener('click', closeThread);
if(threadOverlay){
  threadOverlay.addEventListener('click', (e) => {
    if(e.target === threadOverlay) closeThread();
  });
}

if(threadReplyBtn) threadReplyBtn.addEventListener('click', postThreadReply);
if(threadReplyInput){
  threadReplyInput.addEventListener('keydown', (e) => {
    if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
      e.preventDefault();
      postThreadReply();
    }
  });
}

if(threadDeleteBtn){
  threadDeleteBtn.addEventListener('click', () => {
    if(activeThread) deleteThread(activeThread.id);
  });
}

if(threadLockBtn) threadLockBtn.addEventListener('click', toggleThreadLock);

if(threadReplies){
  threadReplies.addEventListener('click', async (e) => {
    const jumpBtn = e.target.closest('[data-jump-thread-reply]');
    if(jumpBtn){
      jumpToThreadReply(Number(jumpBtn.dataset.jumpThreadReply));
      return;
    }

    const replyBtn = e.target.closest('[data-reply-thread-user]');
    if(replyBtn){
      const session = await getChatSession();
      if(!session?.user){
        setThreadStatus(threadReplyStatus,'Log in to reply.','error');
        return;
      }

      if(activeThread?.is_locked){
        setThreadStatus(threadReplyStatus,'This thread is locked.','error');
        return;
      }

      const replyId = Number(replyBtn.dataset.replyThreadUser);
      const rows = threadReplies._gymcelsRows || [];
      const row = rows.find(x => Number(x.id) === replyId);
      if(row) startThreadReplyTo(row);
      return;
    }

    const deleteBtn = e.target.closest('[data-delete-thread-reply]');
    if(deleteBtn){
      deleteThreadReply(Number(deleteBtn.dataset.deleteThreadReply));
    }
  });
}

threadReplyTargetCancel?.addEventListener('click',clearThreadReplyTarget);

document.addEventListener('keydown', (e) => {
  if(e.key !== 'Escape') return;
  if(threadPhotoLightbox?.classList.contains('show')){
    closeThreadPhoto();
    return;
  }
  if(threadOverlay?.classList.contains('show')) closeThread();
});

function startThreads(session){
  clearInterval(threadsPollTimer);
  setThreadsAuthState(session);
  loadThreads();
  threadsPollTimer = setInterval(loadThreads, 15000);
}



// ---- Gymcel Crew: General + Gaming ----
const navVoiceOutside = document.getElementById('navVoice');
const voiceSection = document.getElementById('voiceSection');
const voiceGuestNote = document.getElementById('voiceGuestNote');
const joinVoiceGeneral = document.getElementById('joinVoiceGeneral');
const joinVoiceGaming = document.getElementById('joinVoiceGaming');
const voiceCountGeneral = document.getElementById('voiceCountGeneral');
const voiceCountGaming = document.getElementById('voiceCountGaming');
const voiceMembersGeneral = document.getElementById('voiceMembersGeneral');
const voiceMembersGaming = document.getElementById('voiceMembersGaming');
const voiceControls = document.getElementById('voiceControls');
const voiceCurrentRoom = document.getElementById('voiceCurrentRoom');
const voiceConnectionText = document.getElementById('voiceConnectionText');
const voiceMuteBtn = document.getElementById('voiceMuteBtn');
const voiceLeaveBtn = document.getElementById('voiceLeaveBtn');
const voiceStatus = document.getElementById('voiceStatus');
const voiceMicState = document.getElementById('voiceMicState');
const voiceAudioMount = document.getElementById('voiceAudioMount');

const VOICE_ROOMS = {
  general:{ topic:'voice:general', label:'General' },
  gaming:{ topic:'voice:gaming', label:'Gaming' }
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
  { urls:'stun:stun.l.google.com:19302' },
  { urls:'stun:stun1.l.google.com:19302' }
];

function setVoiceStatus(text='', type='normal'){
  if(!voiceStatus) return;
  voiceStatus.textContent = text;
  voiceStatus.style.color =
    type === 'error' ? '#ff7c89' :
    type === 'success' ? '#67e8a5' :
    '#858e9a';
  voiceStatus.style.fontWeight = type === 'error' || type === 'success' ? '800' : '';
}

function voiceSafeName(){
  return voiceSessionUser?.user_metadata?.display_name ||
    (voiceSessionUser?.email ? voiceSessionUser.email.split('@')[0] : 'Member');
}

function voiceMemberHtml(entry, myId, allowLocalMute=false){
  const userId = String(entry?.user_id || '');
  const name = escapeChat(entry?.display_name || 'Member');
  const micMuted = !!entry?.muted;
  const mine = userId === myId;
  const locallyMuted = !mine && voiceLocallyMutedUsers.has(userId);

  const localMuteButton = allowLocalMute && !mine
    ? `<button class="voice-person-mute ${locallyMuted ? 'active' : ''}"
               type="button"
               data-local-voice-mute="${escapeChat(userId)}"
               title="${locallyMuted ? 'Hear this person again' : 'Mute only this person for you'}">${locallyMuted ? 'Unmute' : 'Mute'}</button>`
    : '';

  const kickButton = allowLocalMute && !mine && canModerateVoice()
    ? `<button class="voice-kick-btn"
               type="button"
               data-voice-kick="${escapeChat(userId)}"
               data-voice-kick-name="${name}"
               title="Remove this member from the current voice room">Kick</button>`
    : '';

  return `<span class="voice-member ${micMuted ? 'muted' : ''} ${mine ? 'you' : ''} ${locallyMuted ? 'local-muted' : ''}">
    <span class="voice-member-dot"></span>
    ${name}${mine ? ' (You)' : ''}${micMuted ? ' · mic muted' : ''}${locallyMuted ? ' · muted by you' : ''}
    <span class="voice-member-actions">${localMuteButton}${kickButton}</span>
  </span>`;
}

function flattenVoicePresence(state){
  const rows = [];
  Object.values(state || {}).forEach(entries => {
    (entries || []).forEach(entry => {
      if(entry?.user_id) rows.push(entry);
    });
  });

  const byUser = new Map();
  rows.forEach(row => byUser.set(row.user_id,row));
  return [...byUser.values()];
}

function renderVoiceRoom(roomKey, state){
  const people = flattenVoicePresence(state);
  const countEl = roomKey === 'general' ? voiceCountGeneral : voiceCountGaming;
  const membersEl = roomKey === 'general' ? voiceMembersGeneral : voiceMembersGaming;

  if(countEl) countEl.textContent = String(people.length);
  if(membersEl){
    const activeRoom = roomKey === voiceRoomKey;
    membersEl.innerHTML = people.length
      ? people.map(p => voiceMemberHtml(p, voiceSessionUser?.id || null, activeRoom)).join('')
      : '<div class="voice-empty">Nobody is in here yet.</div>';
  }

  const card = document.querySelector(`[data-voice-room-card="${roomKey}"]`);
  if(card) card.classList.toggle('active', voiceRoomKey === roomKey);
}

function renderAllVoiceRooms(){
  renderVoiceRoom('general', voiceRoomKey === 'general' ? voicePresence : voicePreviewState.general);
  renderVoiceRoom('gaming', voiceRoomKey === 'gaming' ? voicePresence : voicePreviewState.gaming);
}

async function voiceSendSignal(to, signal){
  if(!voiceRealtimeChannel || !voiceSessionUser || !to) return;

  await voiceRealtimeChannel.send({
    type:'broadcast',
    event:'webrtc-signal',
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
  const audio = document.createElement('audio');
  audio.autoplay = true;
  audio.playsInline = true;
  // Muting this element silences only this remote person on YOUR device.
  audio.muted = voiceLocallyMutedUsers.has(userId);
  audio.dataset.voicePeer = userId;
  if(voiceAudioMount) voiceAudioMount.appendChild(audio);

  const peer = {pc,audio,pendingCandidates:[]};
  voicePeers.set(userId,peer);

  if(voiceLocalStream){
    voiceLocalStream.getAudioTracks().forEach(track => {
      pc.addTrack(track,voiceLocalStream);
    });
  }

  pc.ontrack = (event) => {
    const stream = event.streams?.[0] || new MediaStream([event.track]);
    audio.srcObject = stream;
    audio.muted = voiceLocallyMutedUsers.has(userId);
    audio.play().catch(() => {});
  };

  pc.onicecandidate = (event) => {
    if(event.candidate){
      voiceSendSignal(userId,{
        type:'ice',
        candidate:event.candidate.toJSON ? event.candidate.toJSON() : event.candidate
      });
    }
  };

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;
    if(state === 'failed' || state === 'closed'){
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
      type:'offer',
      sdp:peer.pc.localDescription
    });
  }catch(err){
    console.error('Voice offer error:',err);
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
    if(signal.type === 'offer'){
      await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushVoiceIce(peer);

      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);

      await voiceSendSignal(from,{
        type:'answer',
        sdp:peer.pc.localDescription
      });
      return;
    }

    if(signal.type === 'answer'){
      await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushVoiceIce(peer);
      return;
    }

    if(signal.type === 'ice' && signal.candidate){
      if(peer.pc.remoteDescription){
        await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }else{
        peer.pendingCandidates.push(new RTCIceCandidate(signal.candidate));
      }
    }
  }catch(err){
    console.error('Voice signal error:',err);
  }
}

async function syncVoicePeers(){
  if(!voiceSessionUser) return;

  const people = flattenVoicePresence(voicePresence);
  const remoteIds = people
    .map(p => p.user_id)
    .filter(id => id && id !== voiceSessionUser.id);

  // Remove connections for members who left.
  [...voicePeers.keys()].forEach(id => {
    if(!remoteIds.includes(id)) destroyVoicePeer(id);
  });

  // Deterministic initiator prevents both sides from constantly offering.
  for(const remoteId of remoteIds){
    if(!voicePeers.has(remoteId) && voiceSessionUser.id.localeCompare(remoteId) < 0){
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
    const matches = (client.getChannels?.() || []).filter(ch =>
      ch &&
      ch !== voiceRealtimeChannel &&
      (ch.topic === expectedTopic || ch.topic === room.topic)
    );

    for(const ch of matches){
      try{ await client.removeChannel(ch); }catch(_){}
    }
  }catch(err){
    console.warn('Voice channel cleanup warning:', err);
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
    voiceLocalStream.getTracks().forEach(track => track.stop());
  }

  voiceRealtimeChannel = null;
  voiceLocalStream = null;
  voiceRoomKey = null;
  voicePresence = {};
  voiceMuted = false;

  if(voiceControls) voiceControls.classList.add('hidden');
  if(voiceMicState){
    voiceMicState.textContent = 'Mic disconnected';
    voiceMicState.classList.remove('live');
  }
  if(voiceMuteBtn) voiceMuteBtn.textContent = 'Mute Mic';

  renderAllVoiceRooms();

  if(restorePreviews){
    try{
      const session = await getChatSession();
      if(session?.user) await startVoiceRoomPreviews(session);
    }catch(_){}
  }

  if(showStatus) setVoiceStatus('Left voice channel.');
}

async function joinVoiceChannel(roomKey){
  const room = VOICE_ROOMS[roomKey];
  if(!room) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    setVoiceStatus('Log in first to join voice.','error');
    document.getElementById('login-card')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }

  if(!window.isSecureContext){
    setVoiceStatus('Voice requires HTTPS.','error');
    return;
  }

  if(!navigator.mediaDevices?.getUserMedia){
    setVoiceStatus('This browser does not support microphone access.','error');
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
      .on('broadcast',{event:'webrtc-signal'},({payload}) => {
        handleVoiceSignal(payload);
      })
      .on('presence',{event:'sync'},async () => {
        if(channel !== voiceRealtimeChannel) return;
        voicePresence = channel.presenceState() || {};
        renderAllVoiceRooms();
        await syncVoicePeers();
      })
      .on('presence',{event:'leave'},({key}) => {
        if(key) destroyVoicePeer(key);
      });

    channel.subscribe(async (status,err) => {
      if(channel !== voiceRealtimeChannel) return;

      if(status === 'SUBSCRIBED'){
        await publishVoicePresence();

        if(voiceControls) voiceControls.classList.remove('hidden');
        if(voiceCurrentRoom) voiceCurrentRoom.textContent = room.label;
        if(voiceConnectionText) voiceConnectionText.textContent = 'Connected';
        if(voiceMicState){
          voiceMicState.textContent = 'Mic live';
          voiceMicState.classList.add('live');
        }

        setVoiceStatus(`✓ JOINED ${room.label.toUpperCase()}`,'success');
        renderAllVoiceRooms();
      }else if(status === 'CHANNEL_ERROR' || status === 'TIMED_OUT'){
        console.error('Voice channel error:',err);
        setVoiceStatus('Could not connect to voice. Check the Supabase voice setup.','error');
      }
    });

  }catch(err){
    console.error('Voice join error:',err);
    await leaveVoiceChannel(false, false);
    try{
      const latestSession = await getChatSession();
      if(latestSession?.user) await startVoiceRoomPreviews(latestSession);
    }catch(_){}

    const name = err?.name || '';
    if(name === 'NotAllowedError'){
      setVoiceStatus('Microphone permission was blocked. Allow mic access and try again.','error');
    }else{
      setVoiceStatus(err?.message || String(err),'error');
    }
  }
}



async function kickVoiceMember(userId,displayName='Member'){
  if(!userId || !voiceRoomKey) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  await refreshChatAdminStatus(session);
  if(!chatIsSiteAdmin){
    setVoiceStatus('Only the site admin can kick members.','error');
    return;
  }

  if(userId === session.user.id) return;

  if(!confirm(`Kick ${displayName} from ${VOICE_ROOMS[voiceRoomKey]?.label || 'this voice room'}?`)){
    return;
  }

  try{
    const {error} = await client.rpc('kick_voice_member',{
      target_user:userId,
      target_room:voiceRoomKey
    });

    if(error) throw error;

    setVoiceStatus(`✓ ${displayName} was removed from ${VOICE_ROOMS[voiceRoomKey]?.label || 'voice'}.`,'success');
  }catch(err){
    console.error('Voice kick error:',err);
    setVoiceStatus(err?.message || String(err),'error');
  }
}

async function checkMyVoiceKick(){
  if(!voiceRoomKey) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) return;

  try{
    const {data,error} = await client.rpc('take_my_voice_kick');
    if(error) throw error;

    if(!data) return;

    const kickedRoom = String(data);
    if(kickedRoom === voiceRoomKey){
      const roomName = VOICE_ROOMS[voiceRoomKey]?.label || 'voice';
      await leaveVoiceChannel(false,true);
      setVoiceStatus(`You were removed from ${roomName} by a moderator.`,'error');
    }
  }catch(err){
    console.error('Voice kick check error:',err);
  }
}

function startVoiceKickPolling(session){
  clearInterval(voiceKickPollTimer);
  voiceKickPollTimer = null;

  if(!session?.user) return;

  voiceKickPollTimer = setInterval(() => {
    if(document.visibilityState === 'visible' && voiceRoomKey){
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
      ? 'That member is muted only for you.'
      : 'That member is unmuted for you.',
    'normal'
  );
}

async function toggleVoiceMute(){
  if(!voiceLocalStream || !voiceRoomKey) return;

  voiceMuted = !voiceMuted;
  voiceLocalStream.getAudioTracks().forEach(track => {
    track.enabled = !voiceMuted;
  });

  if(voiceMuteBtn) voiceMuteBtn.textContent = voiceMuted ? 'Unmute Mic' : 'Mute Mic';
  if(voiceMicState){
    voiceMicState.textContent = voiceMuted ? 'Mic muted' : 'Mic live';
    voiceMicState.classList.toggle('live',!voiceMuted);
  }

  await publishVoicePresence();
  renderAllVoiceRooms();
}

function setVoiceAuthState(session){
  voiceSessionUser = session?.user || null;
  const signedIn = !!session?.user;

  if(voiceGuestNote){
    voiceGuestNote.textContent = signedIn
      ? 'Choose General or Gaming. Your browser will ask for microphone permission.'
      : 'Log in to join voice channels.';
  }

  [joinVoiceGeneral,joinVoiceGaming].forEach(btn => {
    if(!btn) return;
    btn.disabled = !signedIn;
    if(!signedIn) btn.textContent = 'Log in';
  });

  if(signedIn){
    if(joinVoiceGeneral) joinVoiceGeneral.textContent = voiceRoomKey === 'general' ? 'Joined' : 'Join';
    if(joinVoiceGaming) joinVoiceGaming.textContent = voiceRoomKey === 'gaming' ? 'Joined' : 'Join';
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
    // Don't create a preview channel for the room we're actively in.
    if(roomKey === voiceRoomKey) continue;

    const preview = client.channel(room.topic,{
      config:{
        private:true,
        presence:{key:`preview-${session.user.id}-${roomKey}`}
      }
    });

    preview
      .on('presence',{event:'sync'},() => {
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
  const kickBtn = e.target.closest('[data-voice-kick]');
  if(kickBtn){
    e.preventDefault();
    e.stopPropagation();
    kickVoiceMember(
      kickBtn.dataset.voiceKick,
      kickBtn.dataset.voiceKickName || 'Member'
    );
    return;
  }

  const btn = e.target.closest('[data-local-voice-mute]');
  if(!btn) return;

  e.preventDefault();
  e.stopPropagation();

  toggleLocalVoiceMute(btn.dataset.localVoiceMute);
}

if(voiceMembersGeneral){
  voiceMembersGeneral.addEventListener('click', handleVoiceMemberMuteClick);
}
if(voiceMembersGaming){
  voiceMembersGaming.addEventListener('click', handleVoiceMemberMuteClick);
}

if(joinVoiceGeneral){
  joinVoiceGeneral.addEventListener('click',() => joinVoiceChannel('general'));
}
if(joinVoiceGaming){
  joinVoiceGaming.addEventListener('click',() => joinVoiceChannel('gaming'));
}
if(voiceMuteBtn){
  voiceMuteBtn.addEventListener('click',toggleVoiceMute);
}
if(voiceLeaveBtn){
  voiceLeaveBtn.addEventListener('click',() => leaveVoiceChannel(true, true));
}
if(navVoiceOutside){
  navVoiceOutside.addEventListener('click',() => {
    setTimeout(() => voiceSection?.scrollIntoView({behavior:'smooth',block:'start'}),20);
  });
}

window.addEventListener('beforeunload',() => {
  try{
    voiceLocalStream?.getTracks().forEach(track => track.stop());
  }catch(_){}
});


// ---- Private Direct Messages ----
const dmSection = document.getElementById('dmSection');
const dmFriendList = document.getElementById('dmFriendList');
const dmThreadName = document.getElementById('dmThreadName');
const dmThreadState = document.getElementById('dmThreadState');
const dmMessages = document.getElementById('dmMessages');
const dmScrollControls = document.getElementById('dmScrollControls');
const dmJumpTopBtn = document.getElementById('dmJumpTopBtn');
const dmJumpBottomBtn = document.getElementById('dmJumpBottomBtn');

const dmTypingIndicator = document.getElementById('dmTypingIndicator');
const dmReplyBar = document.getElementById('dmReplyBar');
const dmReplyName = document.getElementById('dmReplyName');
const dmReplyPreview = document.getElementById('dmReplyPreview');
const dmReplyCancel = document.getElementById('dmReplyCancel');

const dmInput = document.getElementById('dmInput');
const dmSendBtn = document.getElementById('dmSendBtn');
const dmStatus = document.getElementById('dmStatus');
const dmRefreshBtn = document.getElementById('dmRefreshBtn');

const dmPhotoBtn = document.getElementById('dmPhotoBtn');
const dmAttachBtn = document.getElementById('dmAttachBtn');
const dmPhotoInput = document.getElementById('dmPhotoInput');
const dmFileInput = document.getElementById('dmFileInput');
const dmAttachmentPreview = document.getElementById('dmAttachmentPreview');
const dmCallBtn = document.getElementById('dmCallBtn');
const navDmsOutside = document.getElementById('navDms');

const dmIncomingCallOverlay = document.getElementById('dmIncomingCallOverlay');
const dmIncomingCallAvatar = document.getElementById('dmIncomingCallAvatar');
const dmIncomingCallName = document.getElementById('dmIncomingCallName');
const dmAcceptCallBtn = document.getElementById('dmAcceptCallBtn');
const dmDeclineCallBtn = document.getElementById('dmDeclineCallBtn');

const dmActiveCallOverlay = document.getElementById('dmActiveCallOverlay');
const dmActiveCallCard = document.getElementById('dmActiveCallCard');
const dmCallDragHandle = document.getElementById('dmCallDragHandle');
const dmActiveCallState = document.getElementById('dmActiveCallState');
const dmActiveCallAvatar = document.getElementById('dmActiveCallAvatar');
const dmActiveCallName = document.getElementById('dmActiveCallName');
const dmActiveCallTimer = document.getElementById('dmActiveCallTimer');
const dmCallMuteBtn = document.getElementById('dmCallMuteBtn');
const dmEndCallBtn = document.getElementById('dmEndCallBtn');
const dmCallStatus = document.getElementById('dmCallStatus');
const dmPrivateCallAudio = document.getElementById('dmPrivateCallAudio');

let dmActiveUserId = null;
let dmActiveName = '';
let dmActiveAvatar = '';
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
let dmLastRenderSignature = '';
let dmLastRenderConversation = '';


// ---- Private one-to-one DM calls ----
// Call invitations use the database instead of a recipient Realtime "inbox".
// This avoids the private-channel subscribe timeout that prevented calls from ringing.
let dmCallChannel = null;
let dmCallPeer = null;
let dmCallLocalStream = null;
let dmCallRemoteUserId = null;
let dmCallRemoteName = '';
let dmCallRemoteAvatar = '';
let dmCallTopic = '';
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
  {urls:'stun:stun.l.google.com:19302'},
  {urls:'stun:stun1.l.google.com:19302'}
];

function dmCallSetStatus(text='', type='normal'){
  if(!dmCallStatus) return;
  dmCallStatus.textContent = text;
  dmCallStatus.style.color =
    type === 'error' ? '#ff7c89' :
    type === 'success' ? '#67e8a5' :
    '#7e8793';
}

function dmCallInitials(name){
  const s = String(name || 'GC').trim();
  const parts = s.split(/\s+/).filter(Boolean);
  if(parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0,2).toUpperCase();
}

function renderDmCallAvatar(el,name,url){
  if(!el) return;
  if(url){
    el.innerHTML = `<img src="${escapeChat(url)}" alt="${escapeChat(name || 'Member')} profile photo">`;
  }else{
    el.textContent = dmCallInitials(name);
  }
}

function buildDmCallTopic(a,b){
  return `dmcall:${[String(a),String(b)].sort().join(':')}`;
}

function resetDmCallTimer(){
  clearInterval(dmCallTimerInterval);
  dmCallTimerInterval = null;
  dmCallStartedAt = null;
  if(dmActiveCallTimer) dmActiveCallTimer.textContent = '00:00';
}

function startDmCallTimer(){
  if(dmCallStartedAt) return;
  dmCallStartedAt = Date.now();

  const tick = () => {
    if(!dmActiveCallTimer || !dmCallStartedAt) return;
    const seconds = Math.floor((Date.now() - dmCallStartedAt) / 1000);
    const mins = String(Math.floor(seconds / 60)).padStart(2,'0');
    const secs = String(seconds % 60).padStart(2,'0');
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
    await client.rpc('end_dm_call',{target_invite_id:Number(inviteId)});
  }catch(err){
    console.warn('Could not mark call ended:',err);
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
      .from('dm_call_invites')
      .select('id,status')
      .eq('id',dmIncomingInvite.id)
      .maybeSingle();

    if(!current || current.status !== 'ringing'){
      closeIncomingDmCall();
    }
    return;
  }

  const {data,error} = await client
    .from('dm_call_invites')
    .select('id,caller_id,caller_name,caller_avatar,topic,status,created_at')
    .eq('callee_id',session.user.id)
    .eq('status','ringing')
    .order('created_at',{ascending:false})
    .limit(1)
    .maybeSingle();

  if(error){
    console.error('Incoming call poll error:',error);
    return;
  }
  if(!data) return;

  const created = new Date(data.created_at).getTime();
  if(Number.isFinite(created) && Date.now() - created > 90000){
    await markDmCallEnded(data.id);
    return;
  }

  await showIncomingDmInvite({
    id:Number(data.id),
    callerId:data.caller_id,
    callerName:data.caller_name || 'Member',
    callerAvatar:data.caller_avatar || '',
    topic:data.topic
  });
}

async function showIncomingDmInvite(invite){
  if(!invite?.callerId || dmCallChannel || dmIncomingInvite) return;

  try{
    const friendship = await getFriendshipState(invite.callerId);
    if(!friendship || friendship.status !== 'accepted'){
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
    dmIncomingCallOverlay.classList.add('show');
    dmIncomingCallOverlay.setAttribute('aria-hidden','false');
  }
}

async function pollOutgoingDmCall(){
  if(!dmCallInviteId || dmCallRole !== 'caller') return;

  const client = window.gymcelsLolDb;
  if(!client) return;

  const {data,error} = await client
    .from('dm_call_invites')
    .select('id,status')
    .eq('id',dmCallInviteId)
    .maybeSingle();

  if(error){
    console.error('Outgoing call poll error:',error);
    return;
  }

  if(!data){
    dmCallSetStatus('Call ended.');
    await cleanupDmPrivateCall(false);
    return;
  }

  if(data.status === 'accepted'){
    if(dmActiveCallState && dmActiveCallState.textContent !== 'Private call'){
      dmActiveCallState.textContent = 'Connecting...';
    }
    dmCallSetStatus('Connecting...');
  }else if(data.status === 'declined'){
    dmCallSetStatus('Call declined.');
    if(dmActiveCallState) dmActiveCallState.textContent = 'Call declined';
    setTimeout(() => cleanupDmPrivateCall(false),800);
  }else if(data.status === 'ended'){
    dmCallSetStatus('Call ended.');
    if(dmActiveCallState) dmActiveCallState.textContent = 'Call ended';
    setTimeout(() => cleanupDmPrivateCall(false),650);
  }
}

function closeIncomingDmCall(){
  dmIncomingInvite = null;
  if(dmIncomingCallOverlay){
    dmIncomingCallOverlay.classList.remove('show');
    dmIncomingCallOverlay.setAttribute('aria-hidden','true');
  }
}

function createDmCallPeer(){
  if(dmCallPeer || !dmCallRemoteUserId) return dmCallPeer;

  const pc = new RTCPeerConnection({iceServers:DM_CALL_ICE_SERVERS});
  dmCallPeer = pc;

  if(dmCallLocalStream){
    dmCallLocalStream.getAudioTracks().forEach(track => {
      pc.addTrack(track,dmCallLocalStream);
    });
  }

  pc.ontrack = (event) => {
    const stream = event.streams?.[0] || new MediaStream([event.track]);
    if(dmPrivateCallAudio){
      dmPrivateCallAudio.srcObject = stream;
      dmPrivateCallAudio.muted = false;
      dmPrivateCallAudio.play().catch(() => {});
    }
  };

  pc.onicecandidate = (event) => {
    if(event.candidate){
      sendDmCallSignal({
        type:'ice',
        candidate:event.candidate.toJSON ? event.candidate.toJSON() : event.candidate
      });
    }
  };

  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;

    if(state === 'connected'){
      if(dmActiveCallState) dmActiveCallState.textContent = 'Private call';
      dmCallSetStatus('Connected','success');
      startDmCallTimer();
      stopDmCallPolling();
    }else if(state === 'failed'){
      dmCallSetStatus('Audio connection failed. Try calling again.','error');
    }
  };

  return pc;
}

async function sendDmCallSignal(signal){
  if(!dmCallChannel || !dmCallRemoteUserId) return;

  const session = await getChatSession();
  if(!session?.user) return;

  await dmCallChannel.send({
    type:'broadcast',
    event:'dm-call-signal',
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
    if(signal.type === 'offer'){
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushDmCallIce();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await sendDmCallSignal({
        type:'answer',
        sdp:pc.localDescription
      });
      return;
    }

    if(signal.type === 'answer'){
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushDmCallIce();
      return;
    }

    if(signal.type === 'ice' && signal.candidate){
      const candidate = new RTCIceCandidate(signal.candidate);
      if(pc.remoteDescription){
        await pc.addIceCandidate(candidate);
      }else{
        dmCallPendingIce.push(candidate);
      }
    }
  }catch(err){
    console.error('Private call WebRTC signal error:',err);
    dmCallSetStatus('Call connection error.','error');
  }
}

async function createDmCallOffer(){
  if(dmCallOfferSent || dmCallRole !== 'caller') return;

  const pc = createDmCallPeer();
  if(!pc) return;

  try{
    dmCallOfferSent = true;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await sendDmCallSignal({
      type:'offer',
      sdp:pc.localDescription
    });
  }catch(err){
    dmCallOfferSent = false;
    console.error('Private call offer error:',err);
    dmCallSetStatus('Could not start call audio.','error');
  }
}

async function joinDmCallTopic(topic,remoteUserId,remoteName,remoteAvatar,role){
  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user) throw new Error('Log in first.');

  try{ client.realtime.setAuth(session.access_token); }catch(_){}

  dmCallRemoteUserId = remoteUserId;
  dmCallRemoteName = remoteName || 'Member';
  dmCallRemoteAvatar = remoteAvatar || '';
  dmCallTopic = topic;
  dmCallRole = role;
  dmCallOfferSent = false;
  dmCallPendingIce = [];

  // Remove a stale copy of this private pair topic before registering callbacks.
  try{
    const expected = `realtime:${topic}`;
    const stale = (client.getChannels?.() || []).filter(ch =>
      ch && ch !== dmCallChannel && (ch.topic === expected || ch.topic === topic)
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
    .on('broadcast',{event:'dm-call-signal'},({payload}) => {
      handleDmCallSignal(payload);
    })
    .on('broadcast',{event:'dm-call-control'},({payload}) => {
      if(payload?.from === dmCallRemoteUserId && payload?.action === 'hangup'){
        dmCallSetStatus('Call ended.');
        if(dmActiveCallState) dmActiveCallState.textContent = 'Call ended';
        cleanupDmPrivateCall(false);
      }
    })
    .on('presence',{event:'sync'},async () => {
      if(channel !== dmCallChannel) return;

      const rows = flattenVoicePresence(channel.presenceState() || {});
      const remotePresent = rows.some(row => row.user_id === dmCallRemoteUserId);

      if(remotePresent && dmCallRole === 'caller'){
        await createDmCallOffer();
      }
    });

  await new Promise((resolve,reject) => {
    let done = false;
    const timer = setTimeout(() => {
      if(done) return;
      done = true;
      reject(new Error('Private call room timed out.'));
    },8000);

    channel.subscribe(async (status,err) => {
      if(done) return;

      if(status === 'SUBSCRIBED'){
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
      }else if(status === 'CHANNEL_ERROR' || status === 'TIMED_OUT'){
        done = true;
        clearTimeout(timer);
        reject(err || new Error('Private call room failed.'));
      }
    });
  });
}

async function prepareDmCallMicrophone(){
  if(!window.isSecureContext) throw new Error('Private calls require HTTPS.');
  if(!navigator.mediaDevices?.getUserMedia) throw new Error('This browser does not support microphone calls.');

  dmCallLocalStream = await navigator.mediaDevices.getUserMedia({
    audio:{
      echoCancellation:true,
      noiseSuppression:true,
      autoGainControl:true
    },
    video:false
  });

  dmCallMuted = false;
  if(dmCallMuteBtn) dmCallMuteBtn.textContent = 'Mute Mic';
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
  dmActiveCallCard.style.right = 'auto';
  dmActiveCallCard.style.bottom = 'auto';
  dmCallHasCustomPosition = true;
}

function resetDmCallCardPosition(){
  if(!dmActiveCallCard) return;

  dmActiveCallCard.style.left = '';
  dmActiveCallCard.style.top = '';
  dmActiveCallCard.style.right = '';
  dmActiveCallCard.style.bottom = '';
  dmCallHasCustomPosition = false;
}

if(dmCallDragHandle && dmActiveCallCard){
  dmCallDragHandle.addEventListener('pointerdown',(e) => {
    if(e.button !== undefined && e.button !== 0) return;
    if(e.target.closest('button')) return;

    const rect = dmActiveCallCard.getBoundingClientRect();

    dmCallDragState = {
      pointerId:e.pointerId,
      offsetX:e.clientX - rect.left,
      offsetY:e.clientY - rect.top
    };

    dmActiveCallCard.classList.add('dragging');

    try{
      dmCallDragHandle.setPointerCapture(e.pointerId);
    }catch(_){}

    e.preventDefault();
  });

  dmCallDragHandle.addEventListener('pointermove',(e) => {
    if(!dmCallDragState || e.pointerId !== dmCallDragState.pointerId) return;

    setDmCallCardPosition(
      e.clientX - dmCallDragState.offsetX,
      e.clientY - dmCallDragState.offsetY
    );

    e.preventDefault();
  });

  const finishDrag = (e) => {
    if(!dmCallDragState) return;
    if(e.pointerId !== undefined && e.pointerId !== dmCallDragState.pointerId) return;

    try{
      dmCallDragHandle.releasePointerCapture(dmCallDragState.pointerId);
    }catch(_){}

    dmCallDragState = null;
    dmActiveCallCard.classList.remove('dragging');
  };

  dmCallDragHandle.addEventListener('pointerup',finishDrag);
  dmCallDragHandle.addEventListener('pointercancel',finishDrag);
}

window.addEventListener('resize',() => {
  if(!dmActiveCallCard || !dmCallHasCustomPosition) return;

  const rect = dmActiveCallCard.getBoundingClientRect();
  setDmCallCardPosition(rect.left,rect.top);
});

function showActiveDmCall(name,avatar,state='Calling...'){
  if(!dmCallHasCustomPosition) resetDmCallCardPosition();
  if(dmActiveCallName) dmActiveCallName.textContent = name || 'Member';
  renderDmCallAvatar(dmActiveCallAvatar,name,avatar);
  if(dmActiveCallState) dmActiveCallState.textContent = state;
  if(dmActiveCallTimer) dmActiveCallTimer.textContent = '00:00';
  if(dmActiveCallOverlay){
    dmActiveCallOverlay.classList.add('show');
    dmActiveCallOverlay.setAttribute('aria-hidden','false');
  }
}

async function startPrivateDmCall(){
  if(!dmActiveUserId || dmCallChannel || dmIncomingInvite) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();
  if(!client || !session?.user){
    setDmStatus('Log in first.','error');
    return;
  }

  const friendship = await getFriendshipState(dmActiveUserId);
  if(!friendship || friendship.status !== 'accepted'){
    setDmStatus('You need to be friends before calling.','error');
    return;
  }

  if(voiceRoomKey){
    await leaveVoiceChannel(false,true);
  }

  showActiveDmCall(dmActiveName,dmActiveAvatar,'Calling...');
  dmCallSetStatus('Requesting microphone...');

  try{
    await prepareDmCallMicrophone();

    const topic = buildDmCallTopic(session.user.id,dmActiveUserId);

    const {data:inviteId,error:startError} = await client.rpc('start_dm_call',{
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
      'caller'
    );

    dmCallSetStatus('Ringing...');

    clearInterval(dmOutgoingCallPollTimer);
    dmOutgoingCallPollTimer = setInterval(pollOutgoingDmCall,1800);

    clearTimeout(dmCallRingTimeout);
    dmCallRingTimeout = setTimeout(async () => {
      if(dmCallRole === 'caller' && !dmCallStartedAt && dmCallInviteId){
        await markDmCallEnded(dmCallInviteId);
        dmCallSetStatus('No answer.');
        if(dmActiveCallState) dmActiveCallState.textContent = 'No answer';
        setTimeout(() => cleanupDmPrivateCall(false),700);
      }
    },45000);

  }catch(err){
    console.error('Start private call error:',err);
    const message = err?.name === 'NotAllowedError'
      ? 'Microphone permission was blocked.'
      : (err?.message || String(err));
    dmCallSetStatus(message,'error');
    setTimeout(() => cleanupDmPrivateCall(false),1200);
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

  showActiveDmCall(invite.callerName,invite.callerAvatar,'Connecting...');
  dmCallSetStatus('Requesting microphone...');

  try{
    await prepareDmCallMicrophone();

    dmCallInviteId = Number(invite.id);

    await joinDmCallTopic(
      invite.topic || buildDmCallTopic(session.user.id,invite.callerId),
      invite.callerId,
      invite.callerName,
      invite.callerAvatar,
      'callee'
    );

    const {error} = await client.rpc('respond_to_dm_call',{
      target_invite_id:dmCallInviteId,
      call_response:'accepted'
    });
    if(error) throw error;

    dmCallSetStatus('Connecting...');
  }catch(err){
    console.error('Accept private call error:',err);

    try{
      await client.rpc('respond_to_dm_call',{
        target_invite_id:Number(invite.id),
        call_response:'declined'
      });
    }catch(_){}

    const message = err?.name === 'NotAllowedError'
      ? 'Microphone permission was blocked.'
      : (err?.message || String(err));

    dmCallSetStatus(message,'error');
    setTimeout(() => cleanupDmPrivateCall(false),1200);
  }
}

async function declinePrivateDmCall(){
  if(!dmIncomingInvite) return;

  const client = window.gymcelsLolDb;
  const invite = {...dmIncomingInvite};
  closeIncomingDmCall();

  try{
    const {error} = await client.rpc('respond_to_dm_call',{
      target_invite_id:Number(invite.id),
      call_response:'declined'
    });
    if(error) throw error;
  }catch(err){
    console.error('Decline call error:',err);
  }
}

async function togglePrivateDmCallMute(){
  if(!dmCallLocalStream) return;

  dmCallMuted = !dmCallMuted;
  dmCallLocalStream.getAudioTracks().forEach(track => {
    track.enabled = !dmCallMuted;
  });

  if(dmCallMuteBtn) dmCallMuteBtn.textContent = dmCallMuted ? 'Unmute Mic' : 'Mute Mic';
  dmCallSetStatus(dmCallMuted ? 'Your microphone is muted.' : 'Your microphone is live.');
}

async function cleanupDmPrivateCall(sendHangup=true){
  const client = window.gymcelsLolDb;
  const inviteId = dmCallInviteId;

  stopDmCallPolling();

  if(sendHangup && dmCallChannel && dmCallRemoteUserId){
    try{
      const session = await getChatSession();
      await dmCallChannel.send({
        type:'broadcast',
        event:'dm-call-control',
        payload:{
          from:session?.user?.id,
          to:dmCallRemoteUserId,
          action:'hangup'
        }
      });
    }catch(_){}
  }

  if(sendHangup && inviteId){
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
    dmCallLocalStream.getTracks().forEach(track => track.stop());
  }

  if(dmPrivateCallAudio){
    try{ dmPrivateCallAudio.srcObject = null; }catch(_){}
  }

  dmCallChannel = null;
  dmCallPeer = null;
  dmCallLocalStream = null;
  dmCallRemoteUserId = null;
  dmCallRemoteName = '';
  dmCallRemoteAvatar = '';
  dmCallTopic = '';
  dmCallRole = null;
  dmCallMuted = false;
  dmCallOfferSent = false;
  dmCallPendingIce = [];
  dmCallInviteId = null;

  resetDmCallTimer();

  if(dmActiveCallOverlay){
    dmActiveCallOverlay.classList.remove('show');
    dmActiveCallOverlay.setAttribute('aria-hidden','true');
  }

  resetDmCallCardPosition();

  if(dmCallMuteBtn) dmCallMuteBtn.textContent = 'Mute Mic';
  dmCallSetStatus('');
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
  dmIncomingCallPollTimer = setInterval(() => {
    if(document.visibilityState === 'visible'){
      pollIncomingDmCalls();
    }
  },2200);
}

if(dmCallBtn){
  dmCallBtn.addEventListener('click',startPrivateDmCall);
}
if(dmAcceptCallBtn){
  dmAcceptCallBtn.addEventListener('click',acceptPrivateDmCall);
}
if(dmDeclineCallBtn){
  dmDeclineCallBtn.addEventListener('click',declinePrivateDmCall);
}
if(dmCallMuteBtn){
  dmCallMuteBtn.addEventListener('click',togglePrivateDmCallMute);
}
if(dmEndCallBtn){
  dmEndCallBtn.addEventListener('click',() => cleanupDmPrivateCall(true));
}

window.addEventListener('beforeunload',() => {
  try{ dmCallLocalStream?.getTracks().forEach(track => track.stop()); }catch(_){}
});


function dmFormatFileSize(bytes){
  const n = Number(bytes || 0);
  if(n < 1024) return `${n} B`;
  if(n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10 * 1024 ? 1 : 0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function dmFileExtension(name=''){
  const value = String(name || '').toLowerCase();
  const dot = value.lastIndexOf('.');
  return dot >= 0 ? value.slice(dot + 1) : '';
}

function dmMimeForFile(file){
  const existing = String(file?.type || '').toLowerCase();
  if(existing) return existing;

  const ext = dmFileExtension(file?.name || '');
  const map = {
    jpg:'image/jpeg',
    jpeg:'image/jpeg',
    png:'image/png',
    webp:'image/webp',
    gif:'image/gif',
    heic:'image/heic',
    heif:'image/heif',
    pdf:'application/pdf',
    txt:'text/plain',
    doc:'application/msword',
    docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls:'application/vnd.ms-excel',
    xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt:'application/vnd.ms-powerpoint',
    pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip:'application/zip'
  };

  return map[ext] || '';
}

function dmAttachmentAllowed(file){
  const mime = dmMimeForFile(file);

  return [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed'
  ].includes(mime);
}

function dmSafeStorageFileName(name='file'){
  const cleaned = String(name || 'file')
    .replace(/[^a-zA-Z0-9._-]+/g,'_')
    .replace(/^_+|_+$/g,'')
    .slice(-120);

  return cleaned || 'file';
}

function dmAttachmentIcon(mime='',name=''){
  if(String(mime).startsWith('image/')) return '🖼️';

  const ext = dmFileExtension(name);
  if(ext === 'pdf') return '📕';
  if(['doc','docx'].includes(ext)) return '📘';
  if(['xls','xlsx'].includes(ext)) return '📗';
  if(['ppt','pptx'].includes(ext)) return '📙';
  if(ext === 'zip') return '🗜️';
  return '📄';
}

function dmClearPendingPreviewUrls(){
  dmPendingPreviewUrls.forEach(url => {
    try{ URL.revokeObjectURL(url); }catch(_){}
  });
  dmPendingPreviewUrls = [];
}

function dmClearPendingFiles(){
  dmPendingFiles = [];
  dmClearPendingPreviewUrls();

  if(dmPhotoInput) dmPhotoInput.value = '';
  if(dmFileInput) dmFileInput.value = '';

  renderDmPendingFiles();
}

function renderDmPendingFiles(){
  if(!dmAttachmentPreview) return;

  dmClearPendingPreviewUrls();

  if(!dmPendingFiles.length){
    dmAttachmentPreview.innerHTML = '';
    dmAttachmentPreview.classList.add('hidden');
    return;
  }

  dmAttachmentPreview.classList.remove('hidden');

  dmAttachmentPreview.innerHTML = `
    <div class="dm-attachment-preview-head">
      <strong>${dmPendingFiles.length} attachment${dmPendingFiles.length === 1 ? '' : 's'} ready</strong>
      <span>Max 4 · 10 MB each</span>
    </div>

    <div class="dm-attachment-preview-list">
      ${dmPendingFiles.map((file,index) => {
        const mime = dmMimeForFile(file);
        const isImage = mime.startsWith('image/');
        let preview = `<span class="dm-pending-file-icon">${dmAttachmentIcon(mime,file.name)}</span>`;

        if(isImage){
          const objectUrl = URL.createObjectURL(file);
          dmPendingPreviewUrls.push(objectUrl);
          preview = `<img class="dm-pending-thumb" src="${escapeChat(objectUrl)}" alt="">`;
        }

        return `<div class="dm-pending-file">
          ${preview}
          <div class="dm-pending-file-copy">
            <strong>${escapeChat(file.name || 'Attachment')}</strong>
            <span>${escapeChat(dmFormatFileSize(file.size))}</span>
          </div>
          <button type="button" data-dm-remove-pending="${index}" aria-label="Remove attachment">×</button>
        </div>`;
      }).join('')}
    </div>`;
}

function addDmPendingFiles(fileList){
  const incoming = Array.from(fileList || []);
  if(!incoming.length) return;

  for(const file of incoming){
    if(dmPendingFiles.length >= DM_MAX_ATTACHMENTS){
      setDmStatus('You can attach up to 4 files per message.','error');
      break;
    }

    if(!file || !file.size){
      continue;
    }

    if(file.size > DM_MAX_FILE_BYTES){
      setDmStatus(`${file.name || 'That file'} is over 10 MB.`,'error');
      continue;
    }

    if(!dmAttachmentAllowed(file)){
      setDmStatus(`${file.name || 'That file'} type is not supported.`,'error');
      continue;
    }

    dmPendingFiles.push(file);
  }

  renderDmPendingFiles();
}

function dmRenderStoredAttachment(attachment){
  const url = attachment?.signed_url || '';
  const name = attachment?.file_name || 'Attachment';
  const mime = attachment?.mime_type || '';
  const size = dmFormatFileSize(attachment?.file_size || 0);

  if(!url){
    return `<div class="dm-file-attachment unavailable">
      <span>${dmAttachmentIcon(mime,name)}</span>
      <div><strong>${escapeChat(name)}</strong><small>Attachment unavailable</small></div>
    </div>`;
  }

  if(String(mime).startsWith('image/')){
    return `<a class="dm-image-attachment" href="${escapeChat(url)}"
              target="_blank" rel="noopener" title="Open full photo">
      <img src="${escapeChat(url)}" alt="${escapeChat(name)}" loading="lazy">
    </a>`;
  }

  return `<a class="dm-file-attachment" href="${escapeChat(url)}"
            target="_blank" rel="noopener">
    <span>${dmAttachmentIcon(mime,name)}</span>
    <div>
      <strong>${escapeChat(name)}</strong>
      <small>${escapeChat(size)} · Tap to open</small>
    </div>
    <b>↗</b>
  </a>`;
}

async function dmLoadAttachmentMap(client,rows){
  const map = {};
  const ids = (rows || []).map(row => Number(row.id)).filter(Boolean);
  if(!ids.length) return map;

  try{
    const {data,error} = await client
      .from('direct_message_attachments')
      .select('id,message_id,storage_path,file_name,mime_type,file_size,created_at')
      .in('message_id',ids)
      .order('created_at',{ascending:true});

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
      if(cached?.url && cached.expiresAt > now + 5 * 60 * 1000){
        signedByPath[path] = cached.url;
      }else{
        missingPaths.push(path);
      }
    }

    const uniqueMissingPaths = [...new Set(missingPaths)];

    if(uniqueMissingPaths.length){
      const {data:signed,error:signedError} = await client
        .storage
        .from('dm-media')
        .createSignedUrls(uniqueMissingPaths,24 * 60 * 60);

      if(signedError) throw signedError;

      for(const item of signed || []){
        if(item?.path && item?.signedUrl){
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
        signed_url:signedByPath[attachment.storage_path] || ''
      });
    }
  }catch(err){
    // Keep normal text DMs working even if attachment storage has a problem.
    console.warn('DM attachments could not load:',err);
  }

  return map;
}

function dmRandomToken(){
  try{
    if(crypto?.randomUUID) return crypto.randomUUID();
  }catch(_){}

  return `${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
}


function setDmStatus(text='', type='normal'){
  if(!dmStatus) return;
  dmStatus.textContent = text;
  dmStatus.style.color = type === 'error' ? '#ff5a6b' : type === 'success' ? '#67e8a5' : '#8c95a1';
  dmStatus.style.fontWeight = type === 'error' || type === 'success' ? '800' : '';
}

async function loadDmFriends(){
  if(!dmSection || !dmFriendList) return;

  const client = window.gymcelsLolDb;
  const session = await getChatSession();

  if(!client || !session?.user){
    dmSection.style.display = 'none';
    return;
  }

  dmSection.style.display = '';

  const me = session.user.id;
  const { data: rows, error } = await client
    .from('friendships')
    .select('id,requester_id,addressee_id,status')
    .eq('status','accepted')
    .or(`requester_id.eq.${me},addressee_id.eq.${me}`);

  if(error){
    dmFriendList.innerHTML = `<div class="dm-empty">${escapeChat(error.message)}</div>`;
    return;
  }

  const friendships = rows || [];
  const ids = [...new Set(friendships.map(row =>
    row.requester_id === me ? row.addressee_id : row.requester_id
  ).filter(Boolean))];

  if(!ids.length){
    dmFriendList.innerHTML = '<div class="dm-empty">No accepted friends yet.</div>';
    return;
  }

  const presence = await getPresenceMapForUsers(ids);
  const people = ids.map(id => presence[id] || {
    user_id:id, display_name:'Member', avatar_url:null, last_seen:null
  });

  const pinnedIds = getPinnedFriendIds(me);
  const recentDmMap = new Map();

  try{
    const {data:inboxRows,error:inboxError} = await client.rpc('get_my_dm_inbox');
    if(inboxError) throw inboxError;

    (inboxRows || []).forEach(row => {
      if(row?.peer_user_id){
        recentDmMap.set(String(row.peer_user_id),row);
      }
    });
  }catch(err){
    console.warn('Could not load recent DM order:',err);
  }

  people.sort((a,b) => {
    const aId = String(a.user_id || '');
    const bId = String(b.user_id || '');

    const aPinned = pinnedIds.has(aId) ? 1 : 0;
    const bPinned = pinnedIds.has(bId) ? 1 : 0;
    if(aPinned !== bPinned) return bPinned - aPinned;

    const aRecent = recentDmMap.get(aId)?.last_message_at
      ? new Date(recentDmMap.get(aId).last_message_at).getTime()
      : 0;
    const bRecent = recentDmMap.get(bId)?.last_message_at
      ? new Date(recentDmMap.get(bId).last_message_at).getTime()
      : 0;

    if(aRecent !== bRecent) return bRecent - aRecent;

    const aOnline = isPresenceOnline(a.last_seen) ? 1 : 0;
    const bOnline = isPresenceOnline(b.last_seen) ? 1 : 0;
    if(aOnline !== bOnline) return bOnline - aOnline;

    return String(a.display_name || '').localeCompare(String(b.display_name || ''));
  });

  dmFriendList.innerHTML = people.map(person => {
    const online = isPresenceOnline(person.last_seen);
    const rawId = String(person.user_id || '');
    const id = escapeChat(rawId);
    const name = escapeChat(person.display_name || 'Member');
    const avatar = escapeChat(person.avatar_url || '');
    const active = person.user_id === dmActiveUserId ? 'active' : '';
    const pinned = pinnedIds.has(rawId);

    return `<div class="dm-friend-row ${pinned ? 'pinned' : ''}">
      <button class="dm-friend ${active}" type="button"
        data-dm-user="${id}" data-dm-name="${name}" data-dm-avatar="${avatar}">
        ${friendAvatarMarkup(person, online)}
        <div class="dm-friend-info">
          <div class="dm-friend-name">${name}${person?.is_vip ? '<span class="friend-vip-badge">VIP 🔱</span>' : ''}</div>
          <div class="dm-friend-state ${online ? 'online' : ''}">${online ? 'Online' : 'Offline'}</div>
        </div>
      </button>

      <button class="dm-pin-btn ${pinned ? 'pinned' : ''}" type="button"
        data-dm-pin-user="${id}"
        aria-label="${pinned ? 'Unpin' : 'Pin'} ${name}"
        title="${pinned ? 'Unpin DM' : 'Pin DM'}">${pinned ? '📌' : '📍'}</button>
    </div>`;
  }).join('');
}

if(dmFriendList){
  dmFriendList.addEventListener('click', async (e) => {
    const pinBtn = e.target.closest('[data-dm-pin-user]');
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
      setDmStatus('Could not update pin: ' + (err?.message || String(err)),'error');
    }
  });
}



function dmReplyPreviewText(row){
  if(!row) return 'Original message';

  const text = String(row.message || '').trim();
  if(text === '📎 Attachment') return 'Attachment';

  const clean = text.replace(/\s+/g,' ').trim();
  return clean.length > 110 ? clean.slice(0,110) + '…' : (clean || 'Attachment');
}

function ensureDmEditUi(){
  if(!document.getElementById('gymcelsDmEditDeleteStyles')){
    const style = document.createElement('style');
    style.id = 'gymcelsDmEditDeleteStyles';
    style.textContent = `
      .dm-edit-bar{
        margin:0 10px 8px;
        padding:8px 10px;
        border:1px solid rgba(239,67,85,.32);
        border-left:3px solid #ef4355;
        border-radius:9px;
        background:#111319;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
      }
      .dm-edit-bar.hidden{display:none}
      .dm-edit-bar-copy{min-width:0;display:flex;flex-direction:column;gap:2px}
      .dm-edit-bar-copy span{
        color:#ef9ba4;
        font-size:9px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.05em;
      }
      .dm-edit-bar-copy small{
        max-width:520px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        color:#aab1bb;
        font-size:9px;
      }
      #dmEditCancel{
        width:28px;
        height:28px;
        border:1px solid #30343c;
        border-radius:7px;
        background:#191c22;
        color:#c8ced6;
        cursor:pointer;
        font-size:18px;
        line-height:1;
      }
      .dm-edit-action,.dm-delete-action{
        appearance:none;
        border:0;
        padding:0;
        background:transparent;
        color:#727b87;
        font:inherit;
        font-size:8px;
        font-weight:800;
        cursor:pointer;
      }
      .dm-edit-action:hover{color:#d7dce3}
      .dm-delete-action:hover{color:#ff6b79}
      .dm-row-footer{gap:8px;flex-wrap:wrap}
      .dm-message-actions{display:flex;align-items:center;gap:7px}
      .dm-row.mine .dm-message-actions{justify-content:flex-end}
      @media (max-width:700px){
        .dm-edit-bar{margin-left:8px;margin-right:8px}
        .dm-message-actions{gap:6px}
      }
    `;
    document.head.appendChild(style);
  }

  if(!dmReplyBar) return null;

  let bar = document.getElementById('dmEditBar');
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'dmEditBar';
    bar.className = 'dm-edit-bar hidden';
    bar.innerHTML = `
      <div class="dm-edit-bar-copy">
        <span>Editing message</span>
        <small id="dmEditPreview"></small>
      </div>
      <button id="dmEditCancel" type="button" aria-label="Cancel edit">×</button>
    `;
    dmReplyBar.insertAdjacentElement('afterend',bar);
  }

  return bar;
}

const dmEditBar = ensureDmEditUi();
const dmEditPreview = document.getElementById('dmEditPreview');
const dmEditCancel = document.getElementById('dmEditCancel');

function clearDmReply(){
  dmReplyTarget = null;

  if(dmReplyBar) dmReplyBar.classList.add('hidden');
  if(dmReplyName) dmReplyName.textContent = 'Member';
  if(dmReplyPreview) dmReplyPreview.textContent = '';
}

function syncDmEditComposer(){
  const editing = !!dmEditTarget;

  if(dmSendBtn){
    dmSendBtn.textContent = editing ? 'Save' : 'Send';
  }

  if(dmPhotoBtn) dmPhotoBtn.disabled = editing || !dmActiveUserId || dmSending;
  if(dmAttachBtn) dmAttachBtn.disabled = editing || !dmActiveUserId || dmSending;

  if(dmInput && dmActiveUserId){
    dmInput.placeholder = editing
      ? 'Edit your message...'
      : `Message ${dmActiveName || 'friend'}...`;
  }
}

function clearDmEdit(options={}){
  const keepInput = !!options.keepInput;
  const wasEditing = !!dmEditTarget;

  dmEditTarget = null;
  dmEditBar?.classList.add('hidden');
  if(dmEditPreview) dmEditPreview.textContent = '';

  if(wasEditing && dmInput && !keepInput){
    dmInput.value = '';
  }

  syncDmEditComposer();
}

async function beginDmEdit(row){
  if(!row?.id || !dmActiveUserId) return;

  const session = await getChatSession();
  if(!session?.user) return;
  if(String(row.sender_id || '') !== String(session.user.id)) return;

  const text = String(row.message || '').trim();

  // Attachment-only placeholder messages do not have useful text to edit.
  if(!text || text === '📎 Attachment'){
    setDmStatus('Attachment-only messages can be deleted, but there is no text to edit.','error');
    return;
  }

  clearDmReply();
  dmEditTarget = row;

  if(dmEditPreview) dmEditPreview.textContent = dmReplyPreviewText(row);
  dmEditBar?.classList.remove('hidden');

  if(dmInput){
    dmInput.value = text;
  }

  await clearOwnDmTyping();
  syncDmEditComposer();

  requestAnimationFrame(() => {
    dmInput?.focus();
    try{
      const len = dmInput?.value?.length || 0;
      dmInput?.setSelectionRange(len,len);
    }catch(_){}
  });
}

async function saveDmEdit(){
  if(!dmEditTarget?.id || dmSending) return;

  const text = dmInput?.value.trim() || '';
  if(!text){
    setDmStatus('A message cannot be empty.','error');
    return;
  }

  dmSending = true;
  if(dmSendBtn) dmSendBtn.disabled = true;
  setDmStatus('Saving edit...');

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) throw new Error('Log in first.');

    const {error} = await client.rpc('edit_direct_message',{
      target_message_id:Number(dmEditTarget.id),
      new_message:text
    });

    if(error) throw error;

    if(dmInput) dmInput.value = '';
    clearDmEdit({keepInput:true});

    dmLastRenderSignature = '';
    setDmStatus('✓ Edited','success');
    await loadDmConversation(false);

    setTimeout(() => {
      if(dmStatus?.textContent === '✓ Edited') setDmStatus('');
    },1400);
  }catch(err){
    console.error('DM edit error:',err);
    setDmStatus('Edit failed: ' + (err?.message || String(err)),'error');
  }finally{
    dmSending = false;
    if(dmSendBtn) dmSendBtn.disabled = !dmActiveUserId;
    syncDmEditComposer();
  }
}

async function deleteDmMessage(row){
  if(!row?.id || !dmActiveUserId || dmSending) return;

  const session = await getChatSession();
  if(!session?.user) return;
  if(String(row.sender_id || '') !== String(session.user.id)) return;

  const confirmed = window.confirm('Delete this message? This cannot be undone.');
  if(!confirmed) return;

  dmSending = true;
  if(dmSendBtn) dmSendBtn.disabled = true;
  setDmStatus('Deleting message...');

  try{
    const client = window.gymcelsLolDb;
    if(!client) throw new Error('Database is unavailable.');

    const {data:attachmentRows} = await client
      .from('direct_message_attachments')
      .select('storage_path')
      .eq('message_id',Number(row.id));

    const {error:deleteError} = await client
      .from('direct_messages')
      .delete()
      .eq('id',Number(row.id))
      .eq('sender_id',session.user.id);

    if(deleteError) throw deleteError;

    const storagePaths = (attachmentRows || [])
      .map(item => item.storage_path)
      .filter(Boolean);

    if(storagePaths.length){
      const {error:storageError} = await client.storage
        .from('dm-media')
        .remove(storagePaths);

      if(storageError){
        console.warn('Message deleted, but some stored attachment files could not be removed:',storageError);
      }
    }

    if(dmReplyTarget?.id === row.id) clearDmReply();
    if(dmEditTarget?.id === row.id) clearDmEdit();

    dmRowsById.delete(Number(row.id));
    dmLastRenderSignature = '';

    setDmStatus('✓ Message deleted','success');
    await loadDmConversation(false);
    await loadDmFriends();

    setTimeout(() => {
      if(dmStatus?.textContent === '✓ Message deleted') setDmStatus('');
    },1400);
  }catch(err){
    console.error('DM delete error:',err);
    setDmStatus('Delete failed: ' + (err?.message || String(err)),'error');
  }finally{
    dmSending = false;
    if(dmSendBtn) dmSendBtn.disabled = !dmActiveUserId;
    syncDmEditComposer();
  }
}

function beginDmReply(row){
  if(!row?.id || !dmActiveUserId) return;

  if(dmEditTarget) clearDmEdit();
  dmReplyTarget = row;

  const sessionUserId = window.gymcelsLolLastSessionUserId || '';
  const mine = String(row.sender_id || '') === String(sessionUserId);

  if(dmReplyName){
    dmReplyName.textContent = mine ? 'You' : (dmActiveName || 'Member');
  }

  if(dmReplyPreview){
    dmReplyPreview.textContent = dmReplyPreviewText(row);
  }

  dmReplyBar?.classList.remove('hidden');
  dmInput?.focus();
}

function jumpToDmMessage(messageId){
  const el = dmMessages?.querySelector(`[data-dm-message-id="${Number(messageId)}"]`);
  if(!el) return false;

  try{
    el.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(_){
    el.scrollIntoView();
  }

  el.classList.remove('reply-highlight');
  void el.offsetWidth;
  el.classList.add('reply-highlight');

  return true;
}

function hideDmTypingIndicator(){
  if(dmTypingIndicator){
    dmTypingIndicator.classList.add('hidden');
    dmTypingIndicator.removeAttribute('data-peer');
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
      .from('dm_typing_status')
      .delete()
      .eq('user_id',session.user.id)
      .eq('peer_id',peerId);
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
      .from('dm_typing_status')
      .upsert({
        user_id:session.user.id,
        peer_id:dmActiveUserId,
        updated_at:new Date().toISOString()
      },{
        onConflict:'user_id,peer_id'
      });

    if(error) throw error;
  }catch(err){
    // Typing indicators should never break DMs.
    console.warn('DM typing update failed:',err);
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
  dmTypingClearTimer = setTimeout(() => {
    clearOwnDmTyping();
  },2800);
}

async function pollDmTyping(){
  if(!dmActiveUserId || document.visibilityState !== 'visible'){
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
      .from('dm_typing_status')
      .select('updated_at')
      .eq('user_id',dmActiveUserId)
      .eq('peer_id',session.user.id)
      .gte('updated_at',cutoff)
      .maybeSingle();

    if(error) throw error;

    if(data?.updated_at){
      if(dmTypingIndicator){
        const nameEl = dmTypingIndicator.querySelector('.dm-typing-name');
        if(nameEl) nameEl.textContent = `${dmActiveName || 'Member'} is typing`;
        dmTypingIndicator.classList.remove('hidden');
        dmTypingIndicator.dataset.peer = dmActiveUserId;
      }
    }else{
      hideDmTypingIndicator();
    }
  }catch(err){
    hideDmTypingIndicator();
    console.warn('DM typing poll failed:',err);
  }
}

function startDmTypingPolling(){
  clearInterval(dmTypingPollTimer);
  pollDmTyping();

  dmTypingPollTimer = setInterval(() => {
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
    atTop:top<=4,
    atBottom:maxScroll-top<=8,
    scrollable:maxScroll>8
  };
}

function updateDmScrollControls(){
  if(!dmScrollControls || !dmMessages) return;

  const state=dmScrollPosition();
  dmScrollControls.style.display=state.scrollable ? '' : 'none';

  if(dmJumpTopBtn) dmJumpTopBtn.disabled=!state.scrollable || state.atTop;
  if(dmJumpBottomBtn) dmJumpBottomBtn.disabled=!state.scrollable || state.atBottom;
}

function jumpDmToTop(){
  if(!dmMessages) return;

  try{
    dmMessages.scrollTo({top:0,behavior:'smooth'});
  }catch(_){
    dmMessages.scrollTop=0;
  }

  setTimeout(updateDmScrollControls,260);
}

function jumpDmToBottom(){
  if(!dmMessages) return;

  const bottom=dmMessages.scrollHeight;

  try{
    dmMessages.scrollTo({top:bottom,behavior:'smooth'});
  }catch(_){
    dmMessages.scrollTop=bottom;
  }

  setTimeout(updateDmScrollControls,260);
}

dmJumpTopBtn?.addEventListener('click',jumpDmToTop);
dmJumpBottomBtn?.addEventListener('click',jumpDmToBottom);

dmMessages?.addEventListener('scroll',updateDmScrollControls,{passive:true});
window.addEventListener('resize',updateDmScrollControls);

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
      .from('direct_messages')
      .select('id,sender_id,recipient_id,message,created_at,reply_to_id,read_at')
      .or(`and(sender_id.eq.${me},recipient_id.eq.${dmActiveUserId}),and(sender_id.eq.${dmActiveUserId},recipient_id.eq.${me})`)
      .order('created_at',{ascending:false})
      .order('id',{ascending:false})
      .limit(200);

    if(error) throw error;

    // Render oldest -> newest inside the fetched recent window.
    const rows = (data || []).slice().reverse();

    const readReceiptsEnabled = window.gymcelsDmReadReceiptsEnabled !== false;

    if(readReceiptsEnabled && document.visibilityState === 'visible'){
      const hasUnreadIncoming = rows.some(row =>
        String(row.sender_id || '') === String(dmActiveUserId) &&
        String(row.recipient_id || '') === String(me) &&
        !row.read_at
      );

      if(hasUnreadIncoming){
        try{
          const {data:markedCount,error:readError} = await client.rpc(
            'mark_dm_conversation_read',
            {peer_user:dmActiveUserId}
          );

          if(readError) throw readError;

          if(Number(markedCount || 0) > 0){
            const readNow = new Date().toISOString();
            rows.forEach(row => {
              if(
                String(row.sender_id || '') === String(dmActiveUserId) &&
                String(row.recipient_id || '') === String(me) &&
                !row.read_at
              ){
                row.read_at = readNow;
              }
            });
          }
        }catch(err){
          console.warn('Could not mark DMs read:',err);
        }
      }
    }

    dmRowsById = new Map(rows.map(row => [Number(row.id),row]));

    const replyIds = [...new Set(
      rows.map(row => Number(row.reply_to_id)).filter(Boolean)
    )];

    const replyMap = new Map();

    replyIds.forEach(id => {
      const local = dmRowsById.get(id);
      if(local) replyMap.set(id,local);
    });

    const missingReplyIds = replyIds.filter(id => !replyMap.has(id));

    if(missingReplyIds.length){
      const {data:parentRows,error:parentError} = await client
        .from('direct_messages')
        .select('id,sender_id,recipient_id,message,created_at')
        .in('id',missingReplyIds);

      if(!parentError){
        (parentRows || []).forEach(row => replyMap.set(Number(row.id),row));
      }
    }

    const attachmentMap = await dmLoadAttachmentMap(client,rows);

    const conversationKey = `${me}:${dmActiveUserId}`;
    const renderSignature = JSON.stringify({
      rows:rows.map(row => [
        row.id,
        row.sender_id,
        row.recipient_id,
        row.message,
        row.created_at,
        row.reply_to_id,
        row.read_at
      ]),
      attachments:Object.entries(attachmentMap).map(([messageId,items]) => [
        messageId,
        (items || []).map(item => [
          item.id,
          item.storage_path,
          item.file_name,
          item.file_size,
          item.created_at
        ])
      ])
    });

    if(!rows.length){
      if(dmLastRenderConversation !== conversationKey || dmLastRenderSignature !== 'empty'){
        dmMessages.innerHTML = '<div class="dm-empty">No messages yet. Say something.</div>';
        dmMessages.scrollTop = 0;
        dmLastRenderConversation = conversationKey;
        dmLastRenderSignature = 'empty';
      }

      updateDmScrollControls();
      return;
    }

    const oldScrollTop = dmMessages.scrollTop;
    const oldScrollHeight = dmMessages.scrollHeight;
    const nearBottom = oldScrollHeight - oldScrollTop - dmMessages.clientHeight < 80;

    // The 3-second poll used to replace all DM HTML every time even when
    // nothing changed. That reloaded photos and could jump the scroll.
    if(
      dmLastRenderConversation === conversationKey &&
      dmLastRenderSignature === renderSignature
    ){
      if(scrollBottom){
        dmMessages.scrollTop = dmMessages.scrollHeight;
      }

      requestAnimationFrame(updateDmScrollControls);
      return;
    }

    dmMessages.innerHTML = rows.map(row => {
      const mine = row.sender_id === me;
      const when = row.created_at
        ? new Date(row.created_at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})
        : '';

      const attachments = attachmentMap[Number(row.id)] || [];
      const attachmentHtml = attachments.length
        ? `<div class="dm-message-attachments">${attachments.map(dmRenderStoredAttachment).join('')}</div>`
        : '';

      const parent = row.reply_to_id ? replyMap.get(Number(row.reply_to_id)) : null;
      const parentMine = parent && String(parent.sender_id || '') === String(me);

      const quotedReply = row.reply_to_id
        ? `<button class="dm-quoted-reply" type="button" data-dm-jump-message="${Number(row.reply_to_id)}">
             <strong>${parent ? `Replying to ${parentMine ? 'You' : escapeChat(dmActiveName || 'Member')}` : 'Original message unavailable'}</strong>
             <span>${parent ? escapeChat(dmReplyPreviewText(parent)) : 'Message unavailable'}</span>
           </button>`
        : '';

      const text = String(row.message || '');
      const showText = text && !(text === '📎 Attachment' && attachments.length);

      return `<div class="dm-row ${mine ? 'mine' : ''}" data-dm-message-id="${Number(row.id)}">
        ${quotedReply}
        ${showText ? `<div class="dm-bubble">${escapeChat(text)}</div>` : ''}
        ${attachmentHtml}
        <div class="dm-row-footer">
          <div class="dm-message-actions">
            <button class="dm-reply-action" type="button" data-dm-reply="${Number(row.id)}">Reply</button>
            ${mine ? `<button class="dm-edit-action" type="button" data-dm-edit="${Number(row.id)}">Edit</button>` : ''}
            ${mine ? `<button class="dm-delete-action" type="button" data-dm-delete="${Number(row.id)}">Delete</button>` : ''}
          </div>
          <div class="dm-time">${escapeChat(when)}${mine ? ` · ${row.read_at ? 'Seen' : 'Sent'}` : ''}</div>
        </div>
      </div>`;
    }).join('');

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
      dmMessages.querySelectorAll('.dm-image-attachment img').forEach(img => {
        if(img.complete) return;
        img.addEventListener('load',() => {
          dmMessages.scrollTop = dmMessages.scrollHeight;
          updateDmScrollControls();
        },{once:true});
      });
    }

    requestAnimationFrame(updateDmScrollControls);
  }catch(err){
    setDmStatus('DM error: ' + (err?.message || String(err)), 'error');
  }
}

async function openDmWith(userId, displayName='Member', avatarUrl=''){
  if(!userId || !dmSection) return;

  const session = await getChatSession();
  if(!session?.user) return;
  if(userId === session.user.id) return;

  const blockState = await getMemberBlockState(userId);
  if(blockState.blocked_by_me || blockState.blocked_me){
    setDmStatus('This DM is unavailable while a block is active.','error');
    return;
  }

  // DMs are for accepted friends only.
  const friendship = await getFriendshipState(userId);
  if(!friendship || friendship.status !== 'accepted'){
    setDmStatus('You need to be friends before you can DM this member.', 'error');
    return;
  }

  const previousDmUserId = dmActiveUserId;
  const changingConversation = dmActiveUserId !== userId;

  if(changingConversation && previousDmUserId){
    clearOwnDmTyping(previousDmUserId);
  }

  dmActiveUserId = userId;
  dmActiveName = displayName || 'Member';
  dmActiveAvatar = avatarUrl || '';

  if(changingConversation){
    dmLastRenderConversation = '';
    dmLastRenderSignature = '';
    dmRowsById = new Map();
    clearDmReply();
    clearDmEdit();
    hideDmTypingIndicator();
  }

  dmThreadName.textContent = dmActiveName;
  dmThreadState.textContent = 'Private conversation';
  dmInput.disabled = false;
  dmSendBtn.disabled = false;
  if(dmPhotoBtn) dmPhotoBtn.disabled = false;
  if(dmAttachBtn) dmAttachBtn.disabled = false;
  if(dmCallBtn) dmCallBtn.classList.remove('hidden');
  dmInput.placeholder = `Message ${dmActiveName}...`;
  setDmStatus('');

  closeChatPublicProfile();
  dmSection.style.display = '';
  location.hash = 'dmSection';

  await loadDmFriends();
  await loadDmConversation(true);

  clearInterval(dmPollTimer);
  dmPollTimer = setInterval(() => {
    if(dmActiveUserId && document.visibilityState === 'visible'){
      loadDmConversation(false);
    }
  }, 3000);

  startDmTypingPolling();
  setTimeout(() => dmInput?.focus(), 150);
}

async function sendDm(){
  if(dmEditTarget){
    return saveDmEdit();
  }

  if(dmSending || !dmActiveUserId) return;

  const text = dmInput?.value.trim() || '';
  const files = [...dmPendingFiles];

  if(!text && !files.length) return;

  dmSending = true;
  if(dmSendBtn) dmSendBtn.disabled = true;
  if(dmPhotoBtn) dmPhotoBtn.disabled = true;
  if(dmAttachBtn) dmAttachBtn.disabled = true;

  setDmStatus(files.length ? 'Preparing attachments...' : 'Sending...');

  const uploadedPaths = [];
  let insertedMessageId = null;

  try{
    const client = window.gymcelsLolDb;
    const session = await getChatSession();
    if(!client || !session?.user) throw new Error('Log in first.');

    const senderId = session.user.id;
    const recipientId = dmActiveUserId;
    const uploaded = [];

    for(let i=0;i<files.length;i++){
      const file = files[i];
      const mime = dmMimeForFile(file);

      if(!mime || !dmAttachmentAllowed(file)){
        throw new Error(`${file.name || 'Attachment'} type is not supported.`);
      }

      if(file.size > DM_MAX_FILE_BYTES){
        throw new Error(`${file.name || 'Attachment'} is over 10 MB.`);
      }

      setDmStatus(`Uploading attachment ${i + 1} of ${files.length}...`);

      const safeName = dmSafeStorageFileName(file.name || `attachment-${i + 1}`);
      const path = `${senderId}/${recipientId}/${Date.now()}-${dmRandomToken()}-${safeName}`;

      const {error:uploadError} = await client
        .storage
        .from('dm-media')
        .upload(path,file,{
          contentType:mime,
          upsert:false,
          cacheControl:'3600'
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

    setDmStatus('Sending...');

    const {data:messageRow,error:messageError} = await client
      .from('direct_messages')
      .insert({
        sender_id:senderId,
        recipient_id:recipientId,
        message:text || '📎 Attachment',
        reply_to_id:dmReplyTarget?.id || null
      })
      .select('id')
      .single();

    if(messageError) throw messageError;
    insertedMessageId = Number(messageRow?.id);

    if(!insertedMessageId){
      throw new Error('Message was sent but its ID could not be loaded.');
    }

    if(uploaded.length){
      const attachmentRows = uploaded.map(item => ({
        message_id:insertedMessageId,
        uploader_id:senderId,
        storage_path:item.storage_path,
        file_name:item.file_name,
        mime_type:item.mime_type,
        file_size:item.file_size
      }));

      const {error:attachmentError} = await client
        .from('direct_message_attachments')
        .insert(attachmentRows);

      if(attachmentError) throw attachmentError;
    }

    if(dmInput) dmInput.value = '';
    dmClearPendingFiles();
    clearDmReply();
    await clearOwnDmTyping(recipientId);

    setDmStatus(files.length ? '✓ Sent with attachment' : '✓ Sent','success');
    await loadDmConversation(true);
    await loadDmFriends();

    setTimeout(() => {
      if(dmStatus?.textContent?.startsWith('✓ Sent')) setDmStatus('');
    },1500);

  }catch(err){
    console.error('DM send error:',err);

    try{
      const client = window.gymcelsLolDb;

      if(insertedMessageId){
        await client
          .from('direct_messages')
          .delete()
          .eq('id',insertedMessageId);
      }

      if(uploadedPaths.length){
        await client
          .storage
          .from('dm-media')
          .remove(uploadedPaths);
      }
    }catch(cleanupErr){
      console.warn('Could not fully clean up failed DM attachment:',cleanupErr);
    }

    setDmStatus('Send failed: ' + (err?.message || String(err)),'error');

  }finally{
    dmSending = false;

    if(dmActiveUserId){
      if(dmSendBtn) dmSendBtn.disabled = false;
      if(dmPhotoBtn) dmPhotoBtn.disabled = false;
      if(dmAttachBtn) dmAttachBtn.disabled = false;
      syncDmEditComposer();
    }
  }
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-dm-user]');
  if(!target) return;

  e.preventDefault();
  e.stopPropagation();

  openDmWith(
    target.dataset.dmUser,
    target.dataset.dmName || 'Member',
    target.dataset.dmAvatar || ''
  );
});

if(chatDmBtn){
  chatDmBtn.addEventListener('click', () => {
    openDmWith(openedChatUserId, openedChatDisplayName, openedChatAvatarUrl);
  });
}

if(dmPhotoBtn){
  dmPhotoBtn.addEventListener('click',() => {
    if(!dmPhotoBtn.disabled) dmPhotoInput?.click();
  });
}

if(dmAttachBtn){
  dmAttachBtn.addEventListener('click',() => {
    if(!dmAttachBtn.disabled) dmFileInput?.click();
  });
}

if(dmPhotoInput){
  dmPhotoInput.addEventListener('change',() => {
    addDmPendingFiles(dmPhotoInput.files);
    dmPhotoInput.value = '';
  });
}

if(dmFileInput){
  dmFileInput.addEventListener('change',() => {
    addDmPendingFiles(dmFileInput.files);
    dmFileInput.value = '';
  });
}

if(dmAttachmentPreview){
  dmAttachmentPreview.addEventListener('click',(e) => {
    const removeBtn = e.target.closest('[data-dm-remove-pending]');
    if(!removeBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const index = Number(removeBtn.dataset.dmRemovePending);
    if(!Number.isInteger(index) || index < 0 || index >= dmPendingFiles.length) return;

    dmPendingFiles.splice(index,1);
    renderDmPendingFiles();
  });
}


dmReplyCancel?.addEventListener('click',() => {
  clearDmReply();
  dmInput?.focus();
});

dmEditCancel?.addEventListener('click',() => {
  clearDmEdit();
  dmInput?.focus();
});

dmMessages?.addEventListener('click',async (e) => {
  const editBtn = e.target.closest('[data-dm-edit]');
  if(editBtn){
    e.preventDefault();
    e.stopPropagation();

    const row = dmRowsById.get(Number(editBtn.dataset.dmEdit));
    if(row) await beginDmEdit(row);
    return;
  }

  const deleteBtn = e.target.closest('[data-dm-delete]');
  if(deleteBtn){
    e.preventDefault();
    e.stopPropagation();

    const row = dmRowsById.get(Number(deleteBtn.dataset.dmDelete));
    if(row) await deleteDmMessage(row);
    return;
  }

  const replyBtn = e.target.closest('[data-dm-reply]');
  if(replyBtn){
    e.preventDefault();
    e.stopPropagation();

    const row = dmRowsById.get(Number(replyBtn.dataset.dmReply));
    if(row) beginDmReply(row);
    return;
  }

  const jumpBtn = e.target.closest('[data-dm-jump-message]');
  if(jumpBtn){
    e.preventDefault();
    e.stopPropagation();
    jumpToDmMessage(jumpBtn.dataset.dmJumpMessage);
  }
});

if(dmSendBtn) dmSendBtn.addEventListener('click', sendDm);

if(dmInput){
  dmInput.addEventListener('input',scheduleOwnDmTyping);

  dmInput.addEventListener('blur',() => {
    clearOwnDmTyping();
  });

  dmInput.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && dmEditTarget){
      e.preventDefault();
      clearDmEdit();
      return;
    }

    if(e.key === 'Escape' && dmReplyTarget){
      e.preventDefault();
      clearDmReply();
      return;
    }

    if(e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      sendDm();
    }
  });
}

if(dmRefreshBtn){
  dmRefreshBtn.addEventListener('click', async () => {
    await loadDmFriends();
    if(dmActiveUserId) await loadDmConversation(false);
  });
}

if(navDmsOutside){
  navDmsOutside.addEventListener('click', () => {
    setTimeout(loadDmFriends, 50);
  });
}

fpDb.auth.onAuthStateChange((_event, session) => {
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
    dmLastRenderConversation = '';
    dmLastRenderSignature = '';
    dmRowsById = new Map();
    clearDmReply();
    clearDmEdit();
    hideDmTypingIndicator();
    dmClearPendingFiles();

    if(dmInput) dmInput.disabled = true;
    if(dmSendBtn) dmSendBtn.disabled = true;
    if(dmPhotoBtn) dmPhotoBtn.disabled = true;
    if(dmAttachBtn) dmAttachBtn.disabled = true;
    if(dmCallBtn) dmCallBtn.classList.add('hidden');
    if(dmSection) dmSection.style.display = 'none';
  }
});

setTimeout(loadDmFriends, 250);
setTimeout(updateDmScrollControls, 300);
setTimeout(async () => {
  try{
    const session = await getChatSession();
    await startPrivateCallSystem(session);
  }catch(err){
    console.error('Private call startup error:',err);
  }
},350);

async function uploadProfilePhoto(){
  const file = profilePhotoInput?.files?.[0];
  if(!file){
    profileMessage.textContent = 'Choose a photo first.';
    return;
  }
  if(file.size > 5 * 1024 * 1024){
    profileMessage.textContent = 'Photo must be under 5 MB.';
    return;
  }

  const allowed = ['image/jpeg','image/png','image/webp'];
  if(!allowed.includes(file.type)){
    profileMessage.textContent = 'Use a JPG, PNG, or WebP image.';
    return;
  }

  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user){
    profileMessage.textContent = 'Log in first.';
    return;
  }

  profileMessage.textContent = 'Uploading photo...';

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filePath = `${session.user.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await fpDb.storage
    .from('avatars')
    .upload(filePath, file, { contentType: file.type });

  if(uploadError){
    profileMessage.textContent = uploadError.message;
    profileMessage.style.color = '#ff5a6b';
    profileMessage.style.fontWeight = '700';
    return;
  }

  const { data: publicData } = fpDb.storage.from('avatars').getPublicUrl(filePath);
  const avatar_url = publicData.publicUrl;

  const { error: updateError } = await fpDb.auth.updateUser({
    data: { avatar_url, avatar_path: filePath }
  });

  if(updateError){
    profileMessage.textContent = updateError.message;
    return;
  }

  profileMessage.textContent = '✓ PROFILE PHOTO UPDATED';
  updateOwnPresence();
  profileMessage.style.fontWeight = '900';
  profileMessage.style.color = '#67e8a5';
  await fpDb
    .from('messages')
    .update({ avatar_url })
    .eq('user_id', session.user.id); // Sync avatar into old chat messages
  profilePhotoInput.value = '';
  await refreshMemberProfile();
}


async function removePhysiquePhoto(){
  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user) return;

  const user = session.user;
  const meta = user.user_metadata || {};
  const currentPath = meta.physique_path || '';

  profileMessage.textContent = 'Removing physique photo...';
  profileMessage.style.color = '#9aa1ad';

  if(currentPath){
    await fpDb.storage.from('physiques').remove([currentPath]);
  }

  const { error } = await fpDb.auth.updateUser({
    data: { physique_url:null, physique_path:null }
  });

  if(error){
    profileMessage.textContent = error.message;
    profileMessage.style.color = '#ff5a6b';
    return;
  }

  await fpDb
    .from('member_presence')
    .update({ physique_url:null })
    .eq('user_id', user.id);

  if(profilePhysiqueInput) profilePhysiqueInput.value = '';
  if(pendingPhysiquePreviewUrl){
    URL.revokeObjectURL(pendingPhysiquePreviewUrl);
    pendingPhysiquePreviewUrl = null;
  }

  if(profilePhysiqueNote){
    profilePhysiqueNote.textContent = 'Optional public physique photo. JPG, PNG, or WebP under 8 MB. Click Save Profile to apply it.';
    profilePhysiqueNote.classList.remove('ready');
  }

  profileMessage.textContent = '✓ Physique photo removed.';
  profileMessage.style.color = '#67e8a5';
  profileMessage.style.fontWeight = '900';
  renderOwnPhysique('');
  await refreshMemberProfile();
}

if(removePhysiqueBtn){
  removePhysiqueBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await removePhysiquePhoto();
  });
}

async function removeProfilePhoto(){
  const { data: { session } } = await fpDb.auth.getSession();
  if(!session?.user) return;

  profileMessage.textContent = 'Removing photo...';

  const meta = session.user.user_metadata || {};
  const currentPath = meta.avatar_path || '';

  if(currentPath){
    await fpDb.storage.from('avatars').remove([currentPath]);
  }

  const { error } = await fpDb.auth.updateUser({
    data: { avatar_url: null, avatar_path: null }
  });

  if(error){
    profileMessage.textContent = error.message;
    return;
  }

  profileMessage.textContent = '✓ Profile photo removed.';
  updateOwnPresence();
  profileMessage.style.color = '#67e8a5';
  await fpDb
    .from('messages')
    .update({ avatar_url: null })
    .eq('user_id', session.user.id); // Remove avatar from old chat messages
  await refreshMemberProfile();
}

if(uploadProfilePhotoBtn){
  uploadProfilePhotoBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await uploadProfilePhoto();
  });
}
if(removeProfilePhotoBtn){
  removeProfilePhotoBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await removeProfilePhoto();
  });
}


// ---- Clean mobile navigation ----
const mobileBottomNav = document.getElementById('mobileBottomNav');
const mobileMoreBtn = document.getElementById('mobileMoreBtn');
const mobileMoreTopBtn = document.getElementById('mobileMoreTopBtn');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNotificationBtn = document.getElementById('mobileNotificationBtn');
const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');

function openMobileNavDrawer(){
  mobileNavDrawer?.classList.add('open');
  mobileNavBackdrop?.classList.add('open');
  mobileNavDrawer?.setAttribute('aria-hidden','false');
  mobileNavBackdrop?.setAttribute('aria-hidden','false');
  mobileMoreBtn?.classList.add('active');
}

function closeMobileNavDrawer(){
  mobileNavDrawer?.classList.remove('open');
  mobileNavBackdrop?.classList.remove('open');
  mobileNavDrawer?.setAttribute('aria-hidden','true');
  mobileNavBackdrop?.setAttribute('aria-hidden','true');
  mobileMoreBtn?.classList.remove('active');
}

function activateExistingNav(sourceId){
  const source = document.getElementById(sourceId);

  // Auth-only controls are hidden by the existing site logic.
  // If tapped while hidden, send the user to the normal login control.
  if(!source || source.classList.contains('hidden')){
    const login = document.getElementById('navLogin');
    if(login && !login.classList.contains('hidden')) login.click();
    closeMobileNavDrawer();
    return;
  }

  source.click();
  closeMobileNavDrawer();
}

document.querySelectorAll('[data-mobile-proxy]').forEach(btn => {
  btn.addEventListener('click',e => {
    e.preventDefault();
    activateExistingNav(btn.dataset.mobileProxy);
  });
});

mobileMoreBtn?.addEventListener('click',() => {
  if(mobileNavDrawer?.classList.contains('open')) closeMobileNavDrawer();
  else openMobileNavDrawer();
});

mobileMoreTopBtn?.addEventListener('click',() => {
  if(mobileNavDrawer?.classList.contains('open')) closeMobileNavDrawer();
  else openMobileNavDrawer();
});

mobileNavClose?.addEventListener('click',closeMobileNavDrawer);
mobileNavBackdrop?.addEventListener('click',closeMobileNavDrawer);

document.addEventListener('keydown',e => {
  if(e.key === 'Escape') closeMobileNavDrawer();
});

mobileNotificationBtn?.addEventListener('click',(e) => {
  // Prevent this mobile tap from bubbling to the global outside-click
  // handler, which would otherwise open and instantly close the panel.
  e.preventDefault();
  e.stopPropagation();

  const source = document.getElementById('navNotifications');
  if(source && !source.classList.contains('hidden')){
    source.click();
  }
});

function syncMobileNavState(){
  const notificationSource = document.getElementById('navNotifications');
  const desktopBadge = document.getElementById('notificationBadge');

  if(mobileNotificationBtn && notificationSource){
    mobileNotificationBtn.classList.toggle('hidden',notificationSource.classList.contains('hidden'));
  }

  if(mobileNotificationBadge && desktopBadge){
    const count = desktopBadge.textContent || '0';
    mobileNotificationBadge.textContent = count;
    mobileNotificationBadge.classList.toggle(
      'hidden',
      desktopBadge.classList.contains('hidden') || Number(count) <= 0
    );
  }

  document.querySelectorAll('.mobile-drawer-link[data-mobile-proxy]').forEach(proxy => {
    const source = document.getElementById(proxy.dataset.mobileProxy);
    proxy.classList.toggle('mobile-source-hidden',!!source?.classList.contains('hidden'));
  });
}

const mobileNavWatchTargets = [
  'navNotifications','notificationBadge','navLogin','navSignup',
  'navEditProfile','navWorkouts','navLogout'
].map(id => document.getElementById(id)).filter(Boolean);

const mobileNavMutationObserver = new MutationObserver(syncMobileNavState);
mobileNavWatchTargets.forEach(el => {
  mobileNavMutationObserver.observe(el,{
    attributes:true,
    attributeFilter:['class'],
    childList:true,
    characterData:true,
    subtree:true
  });
});

syncMobileNavState();

const mobileSectionButtons = [...document.querySelectorAll('.mobile-bottom-item[data-mobile-section]')];

function updateMobileActiveNav(){
  if(window.innerWidth > 800) return;

  let best = null;
  let bestDistance = Infinity;
  const anchorY = 110;

  mobileSectionButtons.forEach(btn => {
    const section = document.getElementById(btn.dataset.mobileSection);
    if(!section || getComputedStyle(section).display === 'none') return;

    const rect = section.getBoundingClientRect();
    const visible = rect.bottom > anchorY && rect.top < window.innerHeight;

    if(visible){
      const distance = Math.abs(rect.top - anchorY);
      if(distance < bestDistance){
        bestDistance = distance;
        best = btn;
      }
    }
  });

  mobileSectionButtons.forEach(btn => btn.classList.toggle('active',btn === best));
}

let mobileNavScrollTick = false;
window.addEventListener('scroll',() => {
  if(mobileNavScrollTick) return;
  mobileNavScrollTick = true;
  requestAnimationFrame(() => {
    updateMobileActiveNav();
    mobileNavScrollTick = false;
  });
},{passive:true});

window.addEventListener('resize',() => {
  if(window.innerWidth > 800) closeMobileNavDrawer();
  updateMobileActiveNav();
});

setTimeout(() => {
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

    const reportOverlay = document.getElementById('contentReportOverlay');
    const reportClose = document.getElementById('contentReportClose');
    const reportCancel = document.getElementById('contentReportCancel');
    const reportTarget = document.getElementById('contentReportTarget');
    const reportReason = document.getElementById('contentReportReason');
    const reportDetails = document.getElementById('contentReportDetails');
    const reportSubmit = document.getElementById('contentReportSubmit');
    const reportStatus = document.getElementById('contentReportStatus');

    const reportsPanel = document.getElementById('staffReportsPanel');
    const reportsCount = document.getElementById('staffReportsCount');
    const reportsRefresh = document.getElementById('staffReportsRefresh');
    const reportsList = document.getElementById('staffReportsList');
    const reportsStatus = document.getElementById('staffReportsStatus');
    const reportsFab = document.getElementById('staffReportsFab');
    const reportsFabCount = document.getElementById('staffReportsFabCount');

    const threadReportBtn = document.getElementById('threadReportBtn');
    const profileReportBtn = document.getElementById('chatReportUserBtn');

    let reportDraft = null;
    let reportRowsById = new Map();
    let reportPollTimer = null;
    let staffCanReview = false;

    function reportEscape(value){
      return String(value ?? '')
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
    }

    function reportTime(value){
      if(!value) return '';
      const d = new Date(value);
      const ms = Date.now() - d.getTime();

      if(ms < 60000) return 'now';
      if(ms < 3600000) return `${Math.floor(ms/60000)}m ago`;
      if(ms < 86400000) return `${Math.floor(ms/3600000)}h ago`;
      if(ms < 604800000) return `${Math.floor(ms/86400000)}d ago`;

      return d.toLocaleDateString([],{
        month:'short',
        day:'numeric',
        year:'numeric'
      });
    }

    function reportTypeLabel(type){
      return ({
        chat:'Public chat message',
        thread:'Thread',
        thread_reply:'Thread reply',
        user:'Member profile'
      })[type] || 'Report';
    }

    function setReportStatus(text='',type=''){
      if(!reportStatus) return;
      reportStatus.textContent = text;
      reportStatus.className = `content-report-status ${type || ''}`;
    }

    function setStaffReportStatus(text='',type=''){
      if(!reportsStatus) return;
      reportsStatus.textContent = text;
      reportsStatus.className = `staff-reports-status ${type || ''}`;
    }

    async function currentReportSession(){
      try{
        const {data,error} = await db.auth.getSession();
        if(error) throw error;
        return data?.session || null;
      }catch(err){
        console.warn('Report session check failed:',err);
        return null;
      }
    }

    function openReportDialog({type,id=null,userId=null,label='Content'}){
      reportDraft = {
        type:String(type || ''),
        id:id ? Number(id) : null,
        userId:userId || null,
        label:String(label || 'Content')
      };

      if(reportTarget) reportTarget.textContent = reportDraft.label;
      if(reportReason) reportReason.value = 'Spam';
      if(reportDetails) reportDetails.value = '';
      setReportStatus('');

      reportOverlay?.classList.add('show');
      reportOverlay?.setAttribute('aria-hidden','false');
    }

    function closeReportDialog(){
      reportDraft = null;
      reportOverlay?.classList.remove('show');
      reportOverlay?.setAttribute('aria-hidden','true');
      setReportStatus('');
    }

    async function submitReport(){
      if(!reportDraft || !reportSubmit) return;

      const session = await currentReportSession();
      if(!session?.user){
        setReportStatus('Log in to send a report.','error');
        return;
      }

      reportSubmit.disabled = true;
      setReportStatus('Sending report...');

      try{
        const {error} = await db.rpc('submit_gymcels_report',{
          report_target_type:reportDraft.type,
          report_target_id:reportDraft.id,
          report_target_user:reportDraft.userId,
          report_reason:String(reportReason?.value || 'Other'),
          report_details:String(reportDetails?.value || '').trim() || null
        });

        if(error) throw error;

        setReportStatus('✓ Report sent privately to the moderation team.','success');

        // Staff who report something themselves see the inbox update immediately.
        if(staffCanReview){
          loadStaffReports().catch(()=>{});
        }

        setTimeout(closeReportDialog,800);
      }catch(err){
        setReportStatus(err?.message || String(err),'error');
      }finally{
        reportSubmit.disabled = false;
      }
    }

    function updateStaffReportCount(count){
      const n = Number(count || 0);

      if(reportsCount) reportsCount.textContent = String(n);
      if(reportsFabCount) reportsFabCount.textContent = String(n);
      reportsFab?.classList.toggle('has-reports',n > 0);
    }

    async function loadStaffReports(){
      if(!staffCanReview || !reportsPanel || !reportsList) return;

      try{
        const {data,error} = await db.rpc('staff_list_gymcels_reports');
        if(error) throw error;

        const rows = Array.isArray(data) ? data : [];
        reportRowsById = new Map(
          rows.map(row => [Number(row.id),row])
        );

        updateStaffReportCount(rows.length);

        if(!rows.length){
          reportsList.innerHTML =
            '<div class="staff-report-empty">No open reports. Everything is clear.</div>';
          setStaffReportStatus('');
          return;
        }

        reportsList.innerHTML = rows.map(row => `
          <div class="staff-report-card" data-staff-report="${Number(row.id)}">
            <div class="staff-report-top">
              <div class="staff-report-type">${reportEscape(reportTypeLabel(row.target_type))}</div>
              <div class="staff-report-time">${reportEscape(reportTime(row.created_at))}</div>
            </div>

            <div class="staff-report-meta">
              Reported by <strong>${reportEscape(row.reporter_name || 'Member')}</strong>
              · Reported member: <strong>${reportEscape(row.target_name || 'Member')}</strong>
            </div>

            <span class="staff-report-reason">${reportEscape(row.reason || 'Other')}</span>

            ${row.target_preview
              ? `<div class="staff-report-preview">${reportEscape(row.target_preview)}</div>`
              : ''}

            ${row.details
              ? `<div class="staff-report-details">Reporter note: ${reportEscape(row.details)}</div>`
              : ''}

            <div class="staff-report-actions">
              <button type="button" data-staff-report-open="${Number(row.id)}">Open</button>
              <button class="resolve" type="button" data-staff-report-resolve="${Number(row.id)}">✓ Resolved</button>
              <button class="dismiss" type="button" data-staff-report-dismiss="${Number(row.id)}">Dismiss</button>
            </div>
          </div>
        `).join('');

        setStaffReportStatus('');
      }catch(err){
        console.warn('Report inbox load failed:',err);
        setStaffReportStatus(
          'Could not refresh reports. The rest of the site is unaffected.',
          'error'
        );
      }
    }

    async function reviewStaffReport(reportId,newStatus){
      if(!staffCanReview) return;

      try{
        setStaffReportStatus('Updating report...');

        const {error} = await db.rpc('staff_review_gymcels_report',{
          target_report_id:Number(reportId),
          new_status:String(newStatus)
        });

        if(error) throw error;

        setStaffReportStatus(
          newStatus === 'resolved'
            ? '✓ Report marked resolved.'
            : 'Report dismissed.',
          'success'
        );

        await loadStaffReports();
      }catch(err){
        setStaffReportStatus(err?.message || String(err),'error');
      }
    }

    async function openReportedTarget(row){
      if(!row) return;

      try{
        if(row.target_type === 'chat'){
          document.getElementById('communityChat')
            ?.scrollIntoView({behavior:'smooth',block:'start'});

          if(typeof loadCommunityChat === 'function'){
            await loadCommunityChat(false);
          }

          setTimeout(() => {
            if(typeof jumpToChatMessage === 'function'){
              const found = jumpToChatMessage(Number(row.target_id));
              if(found === false){
                setStaffReportStatus('The reported chat message may already be deleted.','error');
              }
            }
          },160);
          return;
        }

        if(row.target_type === 'thread'){
          document.getElementById('threadsSection')
            ?.scrollIntoView({behavior:'smooth',block:'start'});

          if(typeof openThread === 'function'){
            await openThread(Number(row.thread_id || row.target_id));
          }
          return;
        }

        if(row.target_type === 'thread_reply'){
          const threadId = Number(row.thread_id);
          if(!threadId) return;

          document.getElementById('threadsSection')
            ?.scrollIntoView({behavior:'smooth',block:'start'});

          if(typeof openThread === 'function'){
            await openThread(threadId);
          }

          setTimeout(() => {
            if(typeof jumpToThreadReply === 'function'){
              jumpToThreadReply(Number(row.target_id));
            }
          },180);
          return;
        }

        if(row.target_type === 'user' && row.target_user_id){
          if(typeof openChatPublicProfile === 'function'){
            openChatPublicProfile(
              row.target_user_id,
              row.target_name || 'Member',
              ''
            );
          }
        }
      }catch(err){
        console.warn('Could not open reported target:',err);
        setStaffReportStatus('Could not open that reported item.','error');
      }
    }

    async function configureStaffReportInbox(session){
      clearInterval(reportPollTimer);
      reportPollTimer = null;
      staffCanReview = false;

      reportsPanel?.classList.add('hidden');
      reportsFab?.classList.add('hidden');
      updateStaffReportCount(0);

      if(!session?.user) return;

      try{
        const {data,error} = await db.rpc('staff_can_view_reports');
        if(error) throw error;

        staffCanReview = data === true;

        if(!staffCanReview) return;

        reportsPanel?.classList.remove('hidden');
        reportsFab?.classList.remove('hidden');

        await loadStaffReports();

        // Independent polling. Errors are caught inside loadStaffReports().
        reportPollTimer = setInterval(() => {
          loadStaffReports().catch(()=>{});
        },12000);
      }catch(err){
        // Fail closed: never let report setup break the rest of Gymcels.
        console.warn('Report inbox unavailable:',err);
      }
    }

    // Dynamic chat + reply report buttons.
    document.addEventListener('click',(e)=>{
      const btn = e.target.closest('[data-content-report]');
      if(!btn) return;

      e.preventDefault();
      e.stopPropagation();

      openReportDialog({
        type:btn.dataset.contentReport,
        id:btn.dataset.reportId || null,
        userId:btn.dataset.reportUser || null,
        label:btn.dataset.reportLabel || 'Reported content'
      });
    });

    threadReportBtn?.addEventListener('click',()=>{
      try{
        if(!activeThread) return;

        openReportDialog({
          type:'thread',
          id:Number(activeThread.id),
          userId:activeThread.author_id || null,
          label:`Thread: ${activeThread.title || 'Untitled'}`
        });
      }catch(err){
        console.warn('Thread report button error:',err);
      }
    });

    profileReportBtn?.addEventListener('click',()=>{
      try{
        if(!openedChatUserId) return;

        openReportDialog({
          type:'user',
          userId:openedChatUserId,
          label:`Member: ${openedChatDisplayName || 'Member'}`
        });
      }catch(err){
        console.warn('Profile report button error:',err);
      }
    });

    reportClose?.addEventListener('click',closeReportDialog);
    reportCancel?.addEventListener('click',closeReportDialog);
    reportSubmit?.addEventListener('click',submitReport);

    reportOverlay?.addEventListener('click',(e)=>{
      if(e.target === reportOverlay) closeReportDialog();
    });

    document.addEventListener('keydown',(e)=>{
      if(
        e.key === 'Escape' &&
        reportOverlay?.classList.contains('show')
      ){
        closeReportDialog();
      }
    });

    reportsRefresh?.addEventListener('click',()=>{
      loadStaffReports().catch(()=>{});
    });

    reportsFab?.addEventListener('click',()=>{
      reportsPanel?.scrollIntoView({behavior:'smooth',block:'center'});
    });

    reportsList?.addEventListener('click',(e)=>{
      const openBtn = e.target.closest('[data-staff-report-open]');
      if(openBtn){
        const row = reportRowsById.get(Number(openBtn.dataset.staffReportOpen));
        if(row) openReportedTarget(row);
        return;
      }

      const resolveBtn = e.target.closest('[data-staff-report-resolve]');
      if(resolveBtn){
        reviewStaffReport(
          Number(resolveBtn.dataset.staffReportResolve),
          'resolved'
        );
        return;
      }

      const dismissBtn = e.target.closest('[data-staff-report-dismiss]');
      if(dismissBtn){
        reviewStaffReport(
          Number(dismissBtn.dataset.staffReportDismiss),
          'dismissed'
        );
      }
    });

    // This auth listener exists only for the report inbox and is fully isolated.
    db.auth.onAuthStateChange((_event,session)=>{
      setTimeout(()=>{
        configureStaffReportInbox(session).catch(()=>{});
      },0);
    });

    // Initial report inbox check happens after the page has initialized.
    setTimeout(async ()=>{
      const session = await currentReportSession();
      await configureStaffReportInbox(session);
    },1200);

  }catch(err){
    // Last-resort containment: reporting can fail without freezing Gymcels.
    console.warn('Gymcels report module disabled:',err);
  }
})();



// ---- Desktop Buy Products dropdown ----
(function initDesktopBuyProductsMenu(){
  try{
    const btn=document.getElementById('desktopBuyProductsBtn');
    const menu=document.getElementById('desktopBuyProductsMenu');

    if(!btn || !menu) return;

    function setOpen(open){
      menu.classList.toggle('hidden',!open);
      btn.classList.toggle('open',open);
      btn.setAttribute('aria-expanded',open ? 'true' : 'false');
    }

    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      setOpen(menu.classList.contains('hidden'));
    });

    menu.addEventListener('click',(e)=>e.stopPropagation());

    document.addEventListener('click',()=>{
      if(!menu.classList.contains('hidden')) setOpen(false);
    });

    document.addEventListener('keydown',(e)=>{
      if(e.key==='Escape') setOpen(false);
    });
  }catch(err){
    console.warn('Buy Products menu disabled:',err);
  }
})();


// ============================================================
// GYMCELS COMMUNITY LEADERBOARD + TOP CHATTER
// ============================================================
(function initGymcelsCommunityLeaderboard(){
  try{
    const shell = document.getElementById('communityLeaderboard');
    const list = document.getElementById('communityLeaderboardList');
    if(!shell || !list) return;

    const refreshBtn = document.getElementById('leaderboardRefreshBtn');
    const metricLabel = document.getElementById('leaderboardMetricLabel');
    const status = document.getElementById('communityLeaderboardStatus');
    const topCard = document.getElementById('topChatterCard');
    const topAvatar = document.getElementById('topChatterAvatar');
    const topName = document.getElementById('topChatterName');
    const topStat = document.getElementById('topChatterStat');
    const topCount = document.getElementById('topChatterCount');
    const navLeaderboard = document.getElementById('navLeaderboard');
    const tabs = [...shell.querySelectorAll('[data-leaderboard-mode]')];

    let rows = [];
    let mode = 'chat';
    let loading = false;
    let topChatterUser = null;

    const safe = (value) => {
      const div=document.createElement('div');
      div.textContent=String(value ?? '');
      return div.innerHTML;
    };

    const initials = (name) => String(name || 'GC')
      .trim()
      .split(/\s+/)
      .slice(0,2)
      .map(part=>part[0] || '')
      .join('')
      .toUpperCase() || 'GC';

    const avatarMarkup = (row, cls='leaderboard-avatar') => {
      const name = row?.display_name || 'Member';
      if(row?.avatar_url){
        return `<div class="${cls}"><img src="${safe(row.avatar_url)}" alt="${safe(name)} profile photo"></div>`;
      }
      return `<div class="${cls}">${safe(initials(name))}</div>`;
    };

    function chatLevel(total){
      const n=Number(total || 0);
      if(n>=500) return 10;
      if(n>=250) return 9;
      if(n>=150) return 8;
      if(n>=100) return 7;
      if(n>=75) return 6;
      if(n>=50) return 5;
      if(n>=30) return 4;
      if(n>=15) return 3;
      if(n>=5) return 2;
      return 1;
    }

    function normalizedRows(data){
      return (Array.isArray(data) ? data : []).map(row=>({
        user_id:String(row.user_id || ''),
        display_name:String(row.display_name || 'Member'),
        avatar_url:String(row.avatar_url || ''),
        lifetime_messages:Number(row.lifetime_messages || 0),
        workouts_logged:Number(row.workouts_logged || 0),
        sets_logged:Number(row.sets_logged || 0),
        current_streak:Number(row.current_streak || 0),
        best_streak:Number(row.best_streak || 0)
      })).filter(row=>row.user_id);
    }

    function sortedRows(){
      const copy=[...rows];
      if(mode==='workouts'){
        copy.sort((a,b)=>
          (b.workouts_logged-a.workouts_logged) ||
          (b.sets_logged-a.sets_logged) ||
          a.display_name.localeCompare(b.display_name)
        );
      }else if(mode==='streak'){
        copy.sort((a,b)=>
          (b.best_streak-a.best_streak) ||
          (b.current_streak-a.current_streak) ||
          a.display_name.localeCompare(b.display_name)
        );
      }else{
        copy.sort((a,b)=>
          (b.lifetime_messages-a.lifetime_messages) ||
          a.display_name.localeCompare(b.display_name)
        );
      }
      return copy.slice(0,10);
    }

    function rowCopy(row){
      if(mode==='workouts'){
        return {
          sub:`${row.sets_logged.toLocaleString()} set${row.sets_logged===1?'':'s'} logged`,
          value:row.workouts_logged.toLocaleString(),
          unit:'workouts'
        };
      }
      if(mode==='streak'){
        return {
          sub:`Current: ${row.current_streak} wk`,
          value:`${row.best_streak} wk`,
          unit:'best streak'
        };
      }
      return {
        sub:`Community Level ${chatLevel(row.lifetime_messages)}`,
        value:row.lifetime_messages.toLocaleString(),
        unit:'messages'
      };
    }

    function renderTopChatter(){
      const chatter=[...rows].sort((a,b)=>(b.lifetime_messages-a.lifetime_messages) || a.display_name.localeCompare(b.display_name))[0];
      topChatterUser=chatter || null;

      if(!chatter){
        if(topAvatar){ topAvatar.innerHTML='GC'; }
        if(topName) topName.textContent='No chatter yet';
        if(topStat) topStat.textContent='Be the first to climb the leaderboard.';
        if(topCount) topCount.textContent='0';
        topCard?.classList.remove('is-clickable');
        return;
      }

      if(topAvatar){
        if(chatter.avatar_url){
          topAvatar.innerHTML=`<img src="${safe(chatter.avatar_url)}" alt="${safe(chatter.display_name)} profile photo">`;
        }else{
          topAvatar.textContent=initials(chatter.display_name);
        }
      }
      if(topName) topName.textContent=chatter.display_name;
      if(topStat) topStat.textContent=`Community Level ${chatLevel(chatter.lifetime_messages)} · Most lifetime messages`;
      if(topCount) topCount.textContent=chatter.lifetime_messages.toLocaleString();
      topCard?.classList.add('is-clickable');
    }

    function render(){
      tabs.forEach(tab=>{
        const active=tab.dataset.leaderboardMode===mode;
        tab.classList.toggle('active',active);
        tab.setAttribute('aria-selected',active ? 'true' : 'false');
      });

      if(metricLabel){
        metricLabel.textContent = mode==='workouts'
          ? 'Workouts logged'
          : mode==='streak'
            ? 'Best weekly streak'
            : 'Lifetime messages';
      }

      const ranked=sortedRows();
      if(!ranked.length){
        list.innerHTML='<div class="leaderboard-empty">No leaderboard activity yet.</div>';
        return;
      }

      list.innerHTML=ranked.map((row,index)=>{
        const rank=index+1;
        const medal=rank===1?'👑':rank===2?'2':rank===3?'3':rank;
        const copy=rowCopy(row);
        return `<div class="leaderboard-row rank-${rank} is-clickable"
                     data-leaderboard-user="${safe(row.user_id)}"
                     data-leaderboard-name="${safe(row.display_name)}"
                     data-leaderboard-avatar="${safe(row.avatar_url)}"
                     role="button" tabindex="0" aria-label="Open ${safe(row.display_name)} profile">
          <div class="leaderboard-rank">${medal}</div>
          ${avatarMarkup(row)}
          <div class="leaderboard-member">
            <strong>${safe(row.display_name)}</strong>
            <small>${safe(copy.sub)}</small>
          </div>
          <div class="leaderboard-value">
            <b>${safe(copy.value)}</b>
            <span>${safe(copy.unit)}</span>
          </div>
        </div>`;
      }).join('');
    }

    async function openMember(userId,name,avatar){
      const client=window.gymcelsLolDb;
      if(!client || !userId) return;
      const {data:{session}}=await client.auth.getSession();
      if(!session?.user){
        const login=document.getElementById('login-card');
        if(status) status.textContent='Log in to open full member profiles.';
        login?.scrollIntoView({behavior:'smooth',block:'center'});
        return;
      }
      if(typeof openChatPublicProfile==='function'){
        openChatPublicProfile(userId,name || 'Member',avatar || '');
      }
    }

    async function loadLeaderboard(showStatus=false){
      if(loading) return;
      loading=true;
      refreshBtn && (refreshBtn.disabled=true);
      if(showStatus && status) status.textContent='Refreshing leaderboard...';

      try{
        const client=window.gymcelsLolDb;
        if(!client) throw new Error('Database connection is not ready.');

        const {data,error}=await client.rpc('get_community_leaderboard');
        if(error) throw error;

        rows=normalizedRows(data);
        renderTopChatter();
        render();
        if(status) status.textContent=`Updated · ${rows.length} ranked member${rows.length===1?'':'s'}`;
      }catch(err){
        console.error('Leaderboard load error:',err);
        list.innerHTML='<div class="leaderboard-empty">Leaderboard setup is not active yet. Run the leaderboard SQL once in Supabase, then refresh.</div>';
        if(topName) topName.textContent='Leaderboard setup needed';
        if(topStat) topStat.textContent='Run the supplied Supabase SQL once.';
        if(topCount) topCount.textContent='—';
        if(status) status.textContent=err?.message || 'Could not load leaderboard.';
      }finally{
        loading=false;
        refreshBtn && (refreshBtn.disabled=false);
      }
    }

    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      mode=tab.dataset.leaderboardMode || 'chat';
      render();
    }));

    refreshBtn?.addEventListener('click',()=>loadLeaderboard(true));

    navLeaderboard?.addEventListener('click',(event)=>{
      event.preventDefault();
      shell.scrollIntoView({behavior:'smooth',block:'start'});
      history.replaceState(null,'','#communityLeaderboard');
    });

    list.addEventListener('click',(event)=>{
      const row=event.target.closest('[data-leaderboard-user]');
      if(!row) return;
      openMember(row.dataset.leaderboardUser,row.dataset.leaderboardName,row.dataset.leaderboardAvatar);
    });

    list.addEventListener('keydown',(event)=>{
      if(event.key!=='Enter' && event.key!==' ') return;
      const row=event.target.closest('[data-leaderboard-user]');
      if(!row) return;
      event.preventDefault();
      openMember(row.dataset.leaderboardUser,row.dataset.leaderboardName,row.dataset.leaderboardAvatar);
    });

    topCard?.addEventListener('click',()=>{
      if(topChatterUser){
        openMember(topChatterUser.user_id,topChatterUser.display_name,topChatterUser.avatar_url);
      }
    });

    // Refresh after public chat changes so Top Chatter stays current.
    const leaderboardChannel=window.gymcelsLolDb
      ?.channel('gymcels-community-leaderboard')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},()=>{
        clearTimeout(window.__gymcelsLeaderboardRefreshTimer);
        window.__gymcelsLeaderboardRefreshTimer=setTimeout(()=>loadLeaderboard(false),1200);
      })
      .subscribe();

    window.addEventListener('beforeunload',()=>{
      try{
        if(leaderboardChannel) window.gymcelsLolDb?.removeChannel(leaderboardChannel);
      }catch(_){ }
    },{once:true});

    loadLeaderboard(false);
  }catch(err){
    console.warn('Community leaderboard disabled:',err);
  }
})();


// ============================================================
// GYMCELS APP-STYLE SCREEN NAVIGATION
// Keeps the existing feature code/data intact and changes only
// which major section is visible at one time.
// ============================================================
(() => {
  const ROUTES = new Set([
    'home','training','nutrition','community','threads','friends',
    'dms','voice','profile','vip','settings'
  ]);

  const alias = {
    'communitySection':'community',
    'communityChat':'community',
    'communityLeaderboard':'community',
    'threadsSection':'threads',
    'friendsSection':'friends',
    'dmSection':'dms',
    'voiceSection':'voice',
    'members':'profile',
    'signup-card':'profile',
    'login-card':'profile',
    'workoutTracker':'training',
    'nutritionSection':'nutrition',
    'productsSection':'vip',
    'vipSection':'vip',
    'personal-buy':'settings'
  };

  const navIdRoute = {
    navChat:'community',
    navThreads:'threads',
    navLeaderboard:'community',
    navFriends:'friends',
    navDms:'dms',
    navVoice:'voice',
    navVip:'vip',
    navEditProfile:'profile',
    navWorkouts:'training',
    navNutrition:'nutrition',
    navSignup:'profile',
    navLogin:'profile',
    joinGymcelsFreeBtn:'profile'
  };

  const routeTitles = {
    home:'Home', training:'Training', nutrition:'Nutrition', community:'Community',
    threads:'Threads', friends:'Friends', dms:'DMs', voice:'Voice', profile:'Profile',
    vip:'VIP / Protocol', settings:'Settings'
  };

  function closeMobileDrawer(){
    const drawer=document.getElementById('mobileNavDrawer');
    const backdrop=document.getElementById('mobileNavBackdrop');
    drawer?.classList.remove('open','show');
    backdrop?.classList.remove('open','show');
    drawer?.setAttribute('aria-hidden','true');
    backdrop?.setAttribute('aria-hidden','true');
    document.body.classList.remove('mobile-nav-open');
  }

  function normalizeHash(){
    const raw=(location.hash || '').replace(/^#/,'');
    if(!raw) return 'home';

    // Never interfere with Supabase confirmation/recovery fragments.
    if(raw.includes('access_token=') || raw.includes('refresh_token=') || raw.includes('type=signup')) return 'profile';
    if(raw.includes('type=recovery')) return 'settings';

    if(ROUTES.has(raw)) return raw;
    return alias[raw] || 'home';
  }

  function setActiveButtons(route){
    document.querySelectorAll('[data-app-route]').forEach(btn => {
      const on=btn.dataset.appRoute===route;
      btn.classList.toggle('active',on);
      if(btn.matches('.desktop-app-nav-item')) btn.setAttribute('aria-current',on?'page':'false');
    });

    const bottomMap={community:'navChat',threads:'navThreads',dms:'navDms',voice:'navVoice'};
    document.querySelectorAll('.mobile-bottom-item').forEach(btn => {
      btn.classList.toggle('active', bottomMap[route] && btn.dataset.mobileProxy===bottomMap[route]);
    });
  }

  function refreshRouteData(route){
    // Reuse the site's existing nav hooks so existing loaders continue to run.
    const idByRoute={
      community:'navChat',threads:'navThreads',friends:'navFriends',dms:'navDms',
      voice:'navVoice',training:'navWorkouts',nutrition:'navNutrition',vip:'navVip'
    };
    const id=idByRoute[route];
    if(!id) return;
    const target=document.getElementById(id);
    if(!target || target.dataset.appRouteRefresh==='1') return;
    target.dataset.appRouteRefresh='1';
    try{ target.click(); }catch(_){ }
    setTimeout(()=>delete target.dataset.appRouteRefresh,180);
  }

  function navigate(route,{replace=false,scroll=true}={}){
    if(!ROUTES.has(route)) route='home';
    document.body.classList.add('gym-app-mode');
    document.body.dataset.appScreen=route;
    document.title=`${routeTitles[route] || 'Gymcels'} · Gymcels.lol`;
    setActiveButtons(route);
    closeMobileDrawer();

    if(scroll){
      window.scrollTo({top:0,behavior:'smooth'});
    }

    const next='#'+route;
    if(location.hash!==next){
      if(replace) history.replaceState(null,'',next);
      else history.pushState(null,'',next);
    }
    refreshRouteData(route);
    syncHomeDashboard();
  }

  function syncHomeDashboard(){
    const text=(id,fallback='0') => (document.getElementById(id)?.textContent || fallback).trim();
    const workouts=document.getElementById('appHomeWorkouts');
    const streak=document.getElementById('appHomeStreak');
    const calories=document.getElementById('appHomeCalories');
    const messages=document.getElementById('appHomeMessages');
    const greeting=document.getElementById('appHomeGreeting');

    if(workouts) workouts.textContent=text('profileWorkoutCount','0');
    if(streak) streak.textContent=text('profileCurrentStreak','🔥 0 wk');
    if(calories){
      const total=text('nutritionCaloriesTotal','0');
      const target=text('nutritionCaloriesTarget','—');
      calories.textContent=`${total} / ${target}`;
    }
    if(messages){
      const raw=text('chatMessageCount','0');
      const count=(raw.match(/[\\d,]+/) || ['0'])[0];
      messages.textContent=count;
    }
    if(greeting){
      const name=text('profileDisplayName','Gymcels.lol Member');
      greeting.textContent=(name && name!=='Gymcels.lol Member') ? `${name}'s Dashboard` : 'Dashboard';
    }
  }

  // New sidebar/home buttons.
  document.addEventListener('click',event => {
    const btn=event.target.closest('[data-app-route]');
    if(!btn) return;
    event.preventDefault();
    navigate(btn.dataset.appRoute || 'home');
  });

  // Existing navigation still drives the same features, but now switches screens first.
  document.addEventListener('click',event => {
    const el=event.target.closest('[id]');
    if(!el) return;
    const route=navIdRoute[el.id];
    if(!route) return;
    document.body.dataset.appScreen=route;
    setActiveButtons(route);
    // Let the site's original click handler run (load DMs, threads, profile form, etc.),
    // then replace its old section hash with the clean app route.
    setTimeout(() => {
      if(!ROUTES.has(route)) return;
      history.replaceState(null,'','#'+route);
      syncHomeDashboard();
    },0);
  },true);

  // Mobile bottom nav proxies point at existing nav buttons. Make the route visible
  // before those existing handlers attempt to scroll/load anything.
  document.addEventListener('pointerdown',event => {
    const btn=event.target.closest('[data-mobile-proxy]');
    if(!btn) return;
    const route=navIdRoute[btn.dataset.mobileProxy];
    if(route){
      document.body.dataset.appScreen=route;
      setActiveButtons(route);
    }
  },true);

  window.addEventListener('popstate',()=>navigate(normalizeHash(),{replace:true,scroll:false}));
  window.addEventListener('hashchange',()=>navigate(normalizeHash(),{replace:true,scroll:false}));

  // Keep dashboard summaries live as the existing app updates its stats.
  ['profileWorkoutCount','profileCurrentStreak','nutritionCaloriesTotal','nutritionCaloriesTarget','chatMessageCount','profileDisplayName']
    .forEach(id => {
      const node=document.getElementById(id);
      if(node) new MutationObserver(syncHomeDashboard).observe(node,{childList:true,subtree:true,characterData:true});
    });

  // Account Settings is injected by the existing app.js. Observe dashboard so the
  // Settings screen picks it up immediately without moving/deleting anything.
  const dashboard=document.getElementById('dashboardView');
  if(dashboard){
    new MutationObserver(() => {
      if(document.body.dataset.appScreen==='settings') setActiveButtons('settings');
    }).observe(dashboard,{childList:true});
  }

  // Start on a clean app route while respecting old deep links and auth callbacks.
  const initial=normalizeHash();
  document.body.dataset.appScreen=initial;
  setActiveButtons(initial);
  syncHomeDashboard();

  // If this was a normal old-style anchor, convert it to the new route URL.
  const raw=(location.hash || '').replace(/^#/,'');
  if(!raw.includes('access_token=') && !raw.includes('refresh_token=') && !raw.includes('type=')){
    history.replaceState(null,'','#'+initial);
  }

  window.gymcelsNavigate=navigate;
})();
// ============================================================
// GYMCELS APP-STYLE SCREEN NAVIGATION
// Keeps the existing feature code/data intact and changes only
// which major section is visible at one time.
// ============================================================
(() => {
  const ROUTES = new Set([
    'home','training','nutrition','community','threads','friends',
    'dms','voice','profile','vip','settings'
  ]);

  const alias = {
    'communitySection':'community',
    'communityChat':'community',
    'communityLeaderboard':'community',
    'threadsSection':'threads',
    'friendsSection':'friends',
    'dmSection':'dms',
    'voiceSection':'voice',
    'members':'profile',
    'signup-card':'profile',
    'login-card':'profile',
    'workoutTracker':'training',
    'nutritionSection':'nutrition',
    'productsSection':'vip',
    'vipSection':'vip',
    'personal-buy':'settings'
  };

  const navIdRoute = {
    navChat:'community',
    navThreads:'threads',
    navLeaderboard:'community',
    navFriends:'friends',
    navDms:'dms',
    navVoice:'voice',
    navVip:'vip',
    navEditProfile:'profile',
    navWorkouts:'training',
    navNutrition:'nutrition',
    navSignup:'profile',
    navLogin:'profile',
    joinGymcelsFreeBtn:'profile'
  };

  const routeTitles = {
    home:'Home', training:'Training', nutrition:'Nutrition', community:'Community',
    threads:'Threads', friends:'Friends', dms:'DMs', voice:'Voice', profile:'Profile',
    vip:'VIP / Protocol', settings:'Settings'
  };

  function closeMobileDrawer(){
    const drawer=document.getElementById('mobileNavDrawer');
    const backdrop=document.getElementById('mobileNavBackdrop');
    drawer?.classList.remove('open','show');
    backdrop?.classList.remove('open','show');
    drawer?.setAttribute('aria-hidden','true');
    backdrop?.setAttribute('aria-hidden','true');
    document.body.classList.remove('mobile-nav-open');
  }

  function normalizeHash(){
    const raw=(location.hash || '').replace(/^#/,'');
    if(!raw) return 'home';

    // Never interfere with Supabase confirmation/recovery fragments.
    if(raw.includes('access_token=') || raw.includes('refresh_token=') || raw.includes('type=signup')) return 'profile';
    if(raw.includes('type=recovery')) return 'settings';

    if(ROUTES.has(raw)) return raw;
    return alias[raw] || 'home';
  }

  function setActiveButtons(route){
    document.querySelectorAll('[data-app-route]').forEach(btn => {
      const on=btn.dataset.appRoute===route;
      btn.classList.toggle('active',on);
      if(btn.matches('.desktop-app-nav-item')) btn.setAttribute('aria-current',on?'page':'false');
    });

    const bottomMap={community:'navChat',threads:'navThreads',dms:'navDms',voice:'navVoice'};
    document.querySelectorAll('.mobile-bottom-item').forEach(btn => {
      btn.classList.toggle('active', bottomMap[route] && btn.dataset.mobileProxy===bottomMap[route]);
    });
  }

  function refreshRouteData(route){
    // Reuse the site's existing nav hooks so existing loaders continue to run.
    const idByRoute={
      community:'navChat',threads:'navThreads',friends:'navFriends',dms:'navDms',
      voice:'navVoice',training:'navWorkouts',nutrition:'navNutrition',vip:'navVip'
    };
    const id=idByRoute[route];
    if(!id) return;
    const target=document.getElementById(id);
    if(!target || target.dataset.appRouteRefresh==='1') return;
    target.dataset.appRouteRefresh='1';
    try{ target.click(); }catch(_){ }
    setTimeout(()=>delete target.dataset.appRouteRefresh,180);
  }

  function navigate(route,{replace=false,scroll=true}={}){
    if(!ROUTES.has(route)) route='home';
    document.body.classList.add('gym-app-mode');
    document.body.dataset.appScreen=route;
    document.title=`${routeTitles[route] || 'Gymcels'} · Gymcels.lol`;
    setActiveButtons(route);
    closeMobileDrawer();

    if(scroll){
      window.scrollTo({top:0,behavior:'smooth'});
    }

    const next='#'+route;
    if(location.hash!==next){
      if(replace) history.replaceState(null,'',next);
      else history.pushState(null,'',next);
    }
    refreshRouteData(route);
    syncHomeDashboard();
  }

  function syncHomeDashboard(){
    const text=(id,fallback='0') => (document.getElementById(id)?.textContent || fallback).trim();
    const workouts=document.getElementById('appHomeWorkouts');
    const streak=document.getElementById('appHomeStreak');
    const calories=document.getElementById('appHomeCalories');
    const messages=document.getElementById('appHomeMessages');
    const greeting=document.getElementById('appHomeGreeting');

    if(workouts) workouts.textContent=text('profileWorkoutCount','0');
    if(streak) streak.textContent=text('profileCurrentStreak','🔥 0 wk');
    if(calories){
      const total=text('nutritionCaloriesTotal','0');
      const target=text('nutritionCaloriesTarget','—');
      calories.textContent=`${total} / ${target}`;
    }
    if(messages){
      const raw=text('chatMessageCount','0');
      const count=(raw.match(/[\\d,]+/) || ['0'])[0];
      messages.textContent=count;
    }
    if(greeting){
      const name=text('profileDisplayName','Gymcels.lol Member');
      greeting.textContent=(name && name!=='Gymcels.lol Member') ? `${name}'s Dashboard` : 'Dashboard';
    }
  }

  // New sidebar/home buttons.
  document.addEventListener('click',event => {
    const btn=event.target.closest('[data-app-route]');
    if(!btn) return;
    event.preventDefault();
    navigate(btn.dataset.appRoute || 'home');
  });

  // Existing navigation still drives the same features, but now switches screens first.
  document.addEventListener('click',event => {
    const el=event.target.closest('[id]');
    if(!el) return;
    const route=navIdRoute[el.id];
    if(!route) return;
    document.body.dataset.appScreen=route;
    setActiveButtons(route);
    // Let the site's original click handler run (load DMs, threads, profile form, etc.),
    // then replace its old section hash with the clean app route.
    setTimeout(() => {
      if(!ROUTES.has(route)) return;
      history.replaceState(null,'','#'+route);
      syncHomeDashboard();
    },0);
  },true);

  // Mobile bottom nav proxies point at existing nav buttons. Make the route visible
  // before those existing handlers attempt to scroll/load anything.
  document.addEventListener('pointerdown',event => {
    const btn=event.target.closest('[data-mobile-proxy]');
    if(!btn) return;
    const route=navIdRoute[btn.dataset.mobileProxy];
    if(route){
      document.body.dataset.appScreen=route;
      setActiveButtons(route);
    }
  },true);

  window.addEventListener('popstate',()=>navigate(normalizeHash(),{replace:true,scroll:false}));
  window.addEventListener('hashchange',()=>navigate(normalizeHash(),{replace:true,scroll:false}));

  // Keep dashboard summaries live as the existing app updates its stats.
  ['profileWorkoutCount','profileCurrentStreak','nutritionCaloriesTotal','nutritionCaloriesTarget','chatMessageCount','profileDisplayName']
    .forEach(id => {
      const node=document.getElementById(id);
      if(node) new MutationObserver(syncHomeDashboard).observe(node,{childList:true,subtree:true,characterData:true});
    });

  // Account Settings is injected by the existing app.js. Observe dashboard so the
  // Settings screen picks it up immediately without moving/deleting anything.
  const dashboard=document.getElementById('dashboardView');
  if(dashboard){
    new MutationObserver(() => {
      if(document.body.dataset.appScreen==='settings') setActiveButtons('settings');
    }).observe(dashboard,{childList:true});
  }

  // Start on a clean app route while respecting old deep links and auth callbacks.
  const initial=normalizeHash();
  document.body.dataset.appScreen=initial;
  setActiveButtons(initial);
  syncHomeDashboard();

  // If this was a normal old-style anchor, convert it to the new route URL.
  const raw=(location.hash || '').replace(/^#/,'');
  if(!raw.includes('access_token=') && !raw.includes('refresh_token=') && !raw.includes('type=')){
    history.replaceState(null,'','#'+initial);
  }

  window.gymcelsNavigate=navigate;
})();
// ============================================================
// GYMCELS MOBILE UX V2
// - Public chat is the first mobile screen in a fresh tab/session
// - Home/Dashboard is always reachable from the bottom nav
// - Gymcel VIP is promoted in the mobile header + More menu
// - Calorie Tracking naming is consistent on mobile
// Desktop behavior is untouched.
// ============================================================
(() => {
  const MOBILE_MAX = 800;
  const isMobile = () => window.matchMedia(`(max-width:${MOBILE_MAX}px)`).matches;

  function routeTo(route){
    if(typeof window.gymcelsNavigate === 'function'){
      window.gymcelsNavigate(route,{scroll:true});
      return;
    }

    const fallback = {
      home:null,
      community:'navChat',
      threads:'navThreads',
      dms:'navDms',
      voice:'navVoice',
      vip:'navVip'
    }[route];

    if(fallback) document.getElementById(fallback)?.click();
    else if(route === 'home') location.hash = '#home';
  }

  function closeDrawer(){
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    drawer?.classList.remove('open','show');
    backdrop?.classList.remove('open','show');
    drawer?.setAttribute('aria-hidden','true');
    backdrop?.setAttribute('aria-hidden','true');
    document.body.classList.remove('mobile-nav-open');
  }

  function makeBottomButton({icon,label,route,id}){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mobile-bottom-item';
    if(id) btn.id = id;
    if(route) btn.dataset.appRoute = route;
    btn.innerHTML = `<span class="mobile-bottom-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
    return btn;
  }

  function setupBottomNav(){
    const nav = document.getElementById('mobileBottomNav');
    if(!nav || nav.dataset.mobileUxV2 === '1') return;
    nav.dataset.mobileUxV2 = '1';

    const chatBtn = nav.querySelector('[data-mobile-proxy="navChat"]');
    const oldThreadsBtn = nav.querySelector('[data-mobile-proxy="navThreads"]');
    const dmBtn = nav.querySelector('[data-mobile-proxy="navDms"]');
    const voiceBtn = nav.querySelector('[data-mobile-proxy="navVoice"]');

    // The old Threads node already has a click listener bound by the original app,
    // so replace the node rather than repurposing it as Home.
    const homeBtn = makeBottomButton({icon:'⌂',label:'Home',route:'home',id:'mobileHomeBtn'});
    if(oldThreadsBtn){
      oldThreadsBtn.replaceWith(homeBtn);
    }else if(chatBtn){
      chatBtn.insertAdjacentElement('afterend',homeBtn);
    }

    // Reuse the existing Voice node/listener as Threads so existing loaders still run.
    if(voiceBtn){
      voiceBtn.dataset.mobileProxy = 'navThreads';
      voiceBtn.dataset.mobileSection = 'threadsSection';
      const icon = voiceBtn.querySelector('.mobile-bottom-icon');
      const label = voiceBtn.querySelector('.mobile-bottom-icon + span');
      if(icon) icon.textContent = '▤';
      if(label) label.textContent = 'Threads';

      // Order: Chat · Home · Threads · DMs · More
      if(dmBtn) nav.insertBefore(voiceBtn,dmBtn);
    }
  }

  function setupDrawer(){
    const drawer = document.getElementById('mobileNavDrawer');
    const grid = drawer?.querySelector('.mobile-drawer-grid');
    if(!drawer || !grid || drawer.dataset.mobileUxV2 === '1') return;
    drawer.dataset.mobileUxV2 = '1';

    // Rename and visually emphasize the existing VIP route.
    const oldVip = grid.querySelector('[data-mobile-proxy="navVip"]');
    if(oldVip){
      oldVip.classList.add('mobile-vip-drawer-link');
      const text = oldVip.querySelector('b');
      if(text) text.textContent = 'Gymcel VIP';
    }

    // Voice moves into More because Home now owns a permanent bottom-nav slot.
    if(!grid.querySelector('[data-mobile-voice-v2]')){
      const voice = document.createElement('button');
      voice.type = 'button';
      voice.className = 'mobile-drawer-link';
      voice.dataset.mobileVoiceV2 = '1';
      voice.innerHTML = '<span>◉</span><b>Voice</b>';
      voice.addEventListener('click',() => {
        document.getElementById('navVoice')?.click();
        closeDrawer();
      });

      const friends = grid.querySelector('[data-mobile-proxy="navFriends"]');
      if(friends) friends.insertAdjacentElement('afterend',voice);
      else grid.prepend(voice);
    }

    // Prominent VIP card at the very top of the More menu.
    if(!drawer.querySelector('#mobileVipPromo')){
      const promo = document.createElement('button');
      promo.type = 'button';
      promo.id = 'mobileVipPromo';
      promo.className = 'mobile-vip-promo';
      promo.innerHTML = `
        <span class="mobile-vip-promo-icon">🔱</span>
        <span class="mobile-vip-promo-copy">
          <strong>Gymcel VIP</strong>
          <small>Unlock VIP — $5 one-time</small>
        </span>
        <span class="mobile-vip-promo-arrow">›</span>`;
      promo.addEventListener('click',() => {
        routeTo('vip');
        closeDrawer();
      });
      grid.insertAdjacentElement('beforebegin',promo);
    }
  }

  function setupHeaderVip(){
    const actions = document.querySelector('.mobile-header-actions');
    if(!actions || document.getElementById('mobileVipTopBtn')) return;

    const vip = document.createElement('button');
    vip.type = 'button';
    vip.id = 'mobileVipTopBtn';
    vip.className = 'mobile-vip-top-btn';
    vip.setAttribute('aria-label','Open Gymcel VIP');
    vip.innerHTML = '<span aria-hidden="true">🔱</span><b>VIP</b>';
    vip.addEventListener('click',() => routeTo('vip'));

    actions.prepend(vip);
  }

  function syncMobileActive(){
    if(!isMobile()) return;
    const route = document.body.dataset.appScreen || '';
    const nav = document.getElementById('mobileBottomNav');
    if(!nav) return;

    const wanted = {
      community: nav.querySelector('[data-mobile-proxy="navChat"]'),
      home: document.getElementById('mobileHomeBtn'),
      threads: nav.querySelector('[data-mobile-proxy="navThreads"]'),
      dms: nav.querySelector('[data-mobile-proxy="navDms"]')
    }[route] || null;

    nav.querySelectorAll('.mobile-bottom-item').forEach(btn => {
      if(btn.id !== 'mobileMoreBtn') btn.classList.toggle('active',btn === wanted);
    });
  }

  function renameNutrition(){
    // Dashboard quick action.
    const quick = document.querySelector('.app-home-actions [data-app-route="nutrition"]');
    if(quick){
      const strong = quick.querySelector('strong');
      if(strong) strong.textContent = 'Calorie Tracking';
    }

    const calorieStat = document.querySelector('.app-home-stat[data-app-route="nutrition"] small');
    if(calorieStat) calorieStat.textContent = 'Open calorie tracking';

    // More-menu label.
    document.querySelectorAll('.mobile-drawer-link[data-mobile-proxy="navNutrition"] b')
      .forEach(el => el.textContent = 'Calorie Tracking');
  }

  function boot(){
    setupBottomNav();
    setupDrawer();
    setupHeaderVip();
    renameNutrition();
    syncMobileActive();

    // New mobile visit/session starts in public Chat instead of Dashboard.
    // sessionStorage prevents a later Dashboard refresh in the same tab from being hijacked.
    if(isMobile()){
      const raw = location.hash || '';
      const authFragment = raw.includes('access_token=') || raw.includes('refresh_token=') || raw.includes('type=');
      const booted = sessionStorage.getItem('gymcels_mobile_chat_boot_v2') === '1';

      if(!authFragment && !booted){
        sessionStorage.setItem('gymcels_mobile_chat_boot_v2','1');
        setTimeout(() => {
          routeTo('community');
          // Chat is visually first in Community via the mobile CSS patch below.
          setTimeout(() => window.scrollTo({top:0,behavior:'auto'}),80);
        },60);
      }
    }
  }

  const bodyRouteObserver = new MutationObserver(syncMobileActive);
  bodyRouteObserver.observe(document.body,{attributes:true,attributeFilter:['data-app-screen']});

  window.addEventListener('resize',syncMobileActive,{passive:true});

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
// ============================================================
// GYMCELS MOBILE AUTH HEADER CTA
// Adds a Sign Up / Log In button beside the mobile VIP button.
// It automatically disappears when the member is signed in.
// ============================================================
(() => {
  const MOBILE_MAX = 800;
  const isMobile = () => window.matchMedia(`(max-width:${MOBILE_MAX}px)`).matches;

  function authLinksVisible(){
    const signup = document.getElementById('navSignup');
    const login = document.getElementById('navLogin');
    const visible = el => !!el && !el.hidden && !el.classList.contains('hidden');
    return visible(signup) || visible(login);
  }

  function openMobileAuth(){
    if(typeof window.gymcelsNavigate === 'function'){
      window.gymcelsNavigate('profile',{scroll:true});
    }else{
      document.getElementById('navLogin')?.click();
    }

    setTimeout(() => {
      const auth = document.getElementById('authView') || document.getElementById('signup-card');
      auth?.scrollIntoView({behavior:'smooth',block:'start'});
    },120);
  }

  function syncMobileAuthButton(){
    const btn = document.getElementById('mobileAuthTopBtn');
    if(!btn) return;
    btn.classList.toggle('hidden', !isMobile() || !authLinksVisible());
  }

  function setupMobileAuthButton(){
    const actions = document.querySelector('.mobile-header-actions');
    if(!actions) return;

    let btn = document.getElementById('mobileAuthTopBtn');
    if(!btn){
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'mobileAuthTopBtn';
      btn.className = 'mobile-auth-top-btn';
      btn.setAttribute('aria-label','Sign up or log in');
      btn.innerHTML = '<span class="mobile-auth-top-icon" aria-hidden="true">●</span><span>Sign Up / Log In</span>';
      btn.addEventListener('click',openMobileAuth);

      const vip = document.getElementById('mobileVipTopBtn');
      if(vip) vip.insertAdjacentElement('afterend',btn);
      else actions.prepend(btn);
    }

    syncMobileAuthButton();
  }

  function boot(){
    setupMobileAuthButton();

    const signup = document.getElementById('navSignup');
    const login = document.getElementById('navLogin');
    const observer = new MutationObserver(syncMobileAuthButton);
    [signup,login].filter(Boolean).forEach(el => {
      observer.observe(el,{attributes:true,attributeFilter:['class','hidden','style']});
    });

    window.addEventListener('resize',syncMobileAuthButton,{passive:true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
// ============================================================
// GYMCELS CUSTOM WORKOUT SPLITS + CLEAN SESSION UI
// Paste at the VERY BOTTOM of the current app.js.
// Requires gymcels-workout-splits-setup.sql to be run first.
// ============================================================
(() => {
  const db = window.gymcelsLolDb;
  if(!db) return;

  let splitUser = null;
  let splitRows = [];
  let activeSplitId = null;
  let activeSplitDay = '';
  let splitEditorId = null;
  let splitUiInstalled = false;

  const esc = value => String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');

  const cleanDays = raw => {
    const seen = new Set();
    return String(raw || '')
      .split(/[\n,]+/)
      .map(v => v.trim())
      .filter(Boolean)
      .filter(v => {
        const key = v.toLowerCase();
        if(seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0,12);
  };

  const presets = {
    ppl:['Push','Pull','Legs'],
    upperlower:['Upper','Lower'],
    arnold:['Chest & Back','Shoulders & Arms','Legs'],
    fullbody:['Full Body A','Full Body B','Full Body C']
  };

  function currentSplit(){
    return splitRows.find(row => String(row.id) === String(activeSplitId)) || null;
  }

  function workoutGrid(){
    return document.querySelector('.workout-dashboard-grid');
  }

  function installSplitUi(){
    if(splitUiInstalled || document.getElementById('workoutSplitManager')) return;

    const hub = document.getElementById('workoutTracker');
    const grid = workoutGrid();
    const formCard = document.querySelector('.workout-log-card');
    const historyCard = document.querySelector('.workout-history-card');
    if(!hub || !grid || !formCard || !historyCard) return;

    splitUiInstalled = true;

    const card = document.createElement('section');
    card.id = 'workoutSplitManager';
    card.className = 'workout-split-manager';
    card.innerHTML = `
      <div class="workout-split-head">
        <div>
          <div class="workout-split-kicker">Your training setup</div>
          <h3>My Training Split</h3>
          <p>Build your own split and every new set will be organized under the day you choose.</p>
        </div>
        <button id="workoutNewSplitBtn" class="workout-split-new" type="button">+ New split</button>
      </div>

      <div id="workoutSplitLoggedOut" class="workout-split-empty">Log in to create and save your personal training split.</div>

      <div id="workoutSplitEmpty" class="workout-split-empty hidden">
        <b>No split yet.</b>
        <span>Create your own or start from a common template.</span>
        <div class="workout-split-empty-actions">
          <button type="button" data-quick-split="ppl">Push / Pull / Legs</button>
          <button type="button" data-quick-split="upperlower">Upper / Lower</button>
          <button type="button" data-quick-split="arnold">Arnold</button>
          <button type="button" data-quick-split="fullbody">Full Body</button>
        </div>
      </div>

      <div id="workoutSplitActive" class="workout-split-active hidden">
        <div class="workout-split-select-row">
          <label class="workout-split-select-wrap">
            <span>Active split</span>
            <select id="workoutSplitSelect"></select>
          </label>
          <div class="workout-split-tools">
            <button id="workoutEditSplitBtn" type="button">Edit</button>
            <button id="workoutDeleteSplitBtn" class="danger" type="button">Delete</button>
          </div>
        </div>
        <div class="workout-split-days-block">
          <span class="workout-split-days-label">What are you training today?</span>
          <div id="workoutSplitDayPills" class="workout-split-day-pills"></div>
        </div>
        <div id="workoutSplitContextText" class="workout-split-context"></div>
      </div>

      <div id="workoutSplitEditor" class="workout-split-editor hidden">
        <div class="workout-split-editor-top">
          <strong id="workoutSplitEditorTitle">Create a split</strong>
          <button id="workoutSplitEditorClose" type="button" aria-label="Close">×</button>
        </div>
        <div class="workout-split-editor-grid">
          <label><span>Split name</span><input id="workoutSplitName" maxlength="60" placeholder="Example: PPL, Upper/Lower, My Split"></label>
          <label><span>Training days</span><textarea id="workoutSplitDays" maxlength="300" placeholder="Push, Pull, Legs"></textarea></label>
        </div>
        <div class="workout-split-presets">
          <span>Quick fill:</span>
          <button type="button" data-fill-preset="ppl">PPL</button>
          <button type="button" data-fill-preset="upperlower">Upper / Lower</button>
          <button type="button" data-fill-preset="arnold">Arnold</button>
          <button type="button" data-fill-preset="fullbody">Full Body</button>
        </div>
        <div class="workout-split-editor-actions">
          <span id="workoutSplitEditorStatus"></span>
          <button id="workoutSplitSaveBtn" class="btn primary" type="button">Save split</button>
        </div>
      </div>
    `;
    hub.insertAdjacentElement('afterend',card);

    const contextBar = document.createElement('div');
    contextBar.id = 'workoutLogContextBar';
    contextBar.className = 'workout-log-context-bar';
    contextBar.innerHTML = `
      <div><span>Logging under</span><b id="workoutLogContextValue">No split selected</b></div>
      <button id="workoutLogChangeSplitBtn" type="button">Change</button>
    `;
    const formSub = formCard.querySelector('.workout-card-sub');
    if(formSub) formSub.insertAdjacentElement('afterend',contextBar);
    else formCard.insertBefore(contextBar,formCard.firstChild);

    const sessionCard = document.createElement('div');
    sessionCard.className = 'member-card workout-session-card';
    sessionCard.innerHTML = `
      <div class="workout-session-head">
        <div>
          <h3>Recent Sessions</h3>
          <p class="workout-card-sub">Your sets grouped by split and training day instead of one long list.</p>
        </div>
        <span id="workoutSessionCount" class="workout-session-count">0 sessions</span>
      </div>
      <div id="workoutSessionList" class="workout-session-list">
        <div class="workout-empty">Your logged sessions will appear here.</div>
      </div>
    `;
    grid.insertBefore(sessionCard,historyCard);

    const historyTitle = historyCard.querySelector('.workout-history-head-copy h3');
    const historySub = historyCard.querySelector('.workout-history-head-copy .workout-card-sub');
    if(historyTitle) historyTitle.textContent = 'All Sets';
    if(historySub) historySub.textContent = 'Detailed set-by-set history for editing, notes, and PR tracking.';

    document.getElementById('workoutNewSplitBtn')?.addEventListener('click',() => openEditor());
    document.getElementById('workoutSplitEditorClose')?.addEventListener('click',closeEditor);
    document.getElementById('workoutSplitSaveBtn')?.addEventListener('click',saveSplit);
    document.getElementById('workoutEditSplitBtn')?.addEventListener('click',() => {
      const split = currentSplit();
      if(split) openEditor(split);
    });
    document.getElementById('workoutDeleteSplitBtn')?.addEventListener('click',deleteCurrentSplit);
    document.getElementById('workoutSplitSelect')?.addEventListener('change',async event => {
      const split = splitRows.find(row => String(row.id) === String(event.target.value));
      if(!split) return;
      activeSplitId = split.id;
      activeSplitDay = Array.isArray(split.days) && split.days.length ? split.days[0] : '';
      await saveContext();
      renderActiveSplit();
    });
    document.getElementById('workoutLogChangeSplitBtn')?.addEventListener('click',() => {
      card.scrollIntoView({behavior:'smooth',block:'center'});
    });

    card.addEventListener('click',event => {
      const quick = event.target.closest('[data-quick-split]');
      if(quick){
        const key = quick.dataset.quickSplit;
        openEditor(null,key);
        return;
      }

      const fill = event.target.closest('[data-fill-preset]');
      if(fill){
        fillPreset(fill.dataset.fillPreset);
        return;
      }

      const day = event.target.closest('[data-split-day]');
      if(day){
        activeSplitDay = day.dataset.splitDay || '';
        saveContext().then(renderActiveSplit);
      }
    });

    window.addEventListener('gymcelsWorkoutChanged',loadSplitSessions);
  }

  function showEditorStatus(text,type=''){
    const el = document.getElementById('workoutSplitEditorStatus');
    if(!el) return;
    el.textContent = text || '';
    el.dataset.type = type;
  }

  function fillPreset(key){
    const days = presets[key] || [];
    const daysInput = document.getElementById('workoutSplitDays');
    if(daysInput) daysInput.value = days.join(', ');

    const name = document.getElementById('workoutSplitName');
    if(name && !name.value.trim()){
      const names = {ppl:'Push / Pull / Legs',upperlower:'Upper / Lower',arnold:'Arnold Split',fullbody:'Full Body'};
      name.value = names[key] || '';
    }
  }

  function openEditor(split=null,presetKey=''){
    splitEditorId = split?.id || null;
    const editor = document.getElementById('workoutSplitEditor');
    if(!editor) return;

    document.getElementById('workoutSplitEditorTitle').textContent = split ? 'Edit split' : 'Create a split';
    document.getElementById('workoutSplitName').value = split?.name || '';
    document.getElementById('workoutSplitDays').value = Array.isArray(split?.days) ? split.days.join(', ') : '';
    document.getElementById('workoutSplitSaveBtn').textContent = split ? 'Update split' : 'Save split';
    showEditorStatus('');
    editor.classList.remove('hidden');
    if(presetKey) fillPreset(presetKey);
    setTimeout(() => document.getElementById('workoutSplitName')?.focus(),60);
  }

  function closeEditor(){
    splitEditorId = null;
    document.getElementById('workoutSplitEditor')?.classList.add('hidden');
    showEditorStatus('');
  }

  async function saveSplit(){
    if(!splitUser) return showEditorStatus('Log in first.','error');

    const name = document.getElementById('workoutSplitName')?.value.trim() || '';
    const days = cleanDays(document.getElementById('workoutSplitDays')?.value || '');

    if(!name) return showEditorStatus('Give your split a name.','error');
    if(!days.length) return showEditorStatus('Add at least one training day.','error');

    const btn = document.getElementById('workoutSplitSaveBtn');
    if(btn) btn.disabled = true;
    showEditorStatus('Saving...');

    let result;
    if(splitEditorId){
      result = await db
        .from('workout_splits')
        .update({name,days,updated_at:new Date().toISOString()})
        .eq('id',splitEditorId)
        .eq('user_id',splitUser.id)
        .select('id,name,days,created_at,updated_at')
        .single();
    }else{
      result = await db
        .from('workout_splits')
        .insert({user_id:splitUser.id,name,days})
        .select('id,name,days,created_at,updated_at')
        .single();
    }

    if(btn) btn.disabled = false;
    if(result.error){
      const duplicate = /duplicate|unique/i.test(result.error.message || '');
      return showEditorStatus(duplicate ? 'You already have a split with that name.' : result.error.message,'error');
    }

    activeSplitId = result.data.id;
    activeSplitDay = days[0] || '';
    await saveContext();
    closeEditor();
    await loadSplitData();
  }

  async function deleteCurrentSplit(){
    const split = currentSplit();
    if(!split || !splitUser) return;
    if(!confirm(`Delete the split “${split.name}”? Your old workout logs will keep their saved split labels.`)) return;

    const {error} = await db
      .from('workout_splits')
      .delete()
      .eq('id',split.id)
      .eq('user_id',splitUser.id);

    if(error) return alert(error.message);

    activeSplitId = null;
    activeSplitDay = '';
    await loadSplitData();
  }

  async function saveContext(){
    if(!splitUser || !activeSplitId) return;
    await db
      .from('workout_active_context')
      .upsert({
        user_id:splitUser.id,
        split_id:Number(activeSplitId),
        split_day:activeSplitDay || null,
        updated_at:new Date().toISOString()
      },{onConflict:'user_id'});
  }

  function renderActiveSplit(){
    const loggedOut = document.getElementById('workoutSplitLoggedOut');
    const empty = document.getElementById('workoutSplitEmpty');
    const active = document.getElementById('workoutSplitActive');
    const newBtn = document.getElementById('workoutNewSplitBtn');

    if(!splitUser){
      loggedOut?.classList.remove('hidden');
      empty?.classList.add('hidden');
      active?.classList.add('hidden');
      if(newBtn) newBtn.disabled = true;
      updateContextBar();
      return;
    }

    loggedOut?.classList.add('hidden');
    if(newBtn) newBtn.disabled = false;

    if(!splitRows.length){
      empty?.classList.remove('hidden');
      active?.classList.add('hidden');
      updateContextBar();
      return;
    }

    empty?.classList.add('hidden');
    active?.classList.remove('hidden');

    let split = currentSplit();
    if(!split){
      split = splitRows[0];
      activeSplitId = split.id;
      activeSplitDay = Array.isArray(split.days) ? split.days[0] || '' : '';
      saveContext();
    }

    const select = document.getElementById('workoutSplitSelect');
    if(select){
      select.innerHTML = splitRows.map(row => `<option value="${row.id}">${esc(row.name)}</option>`).join('');
      select.value = String(split.id);
    }

    const days = Array.isArray(split.days) ? split.days : [];
    if(!days.some(day => day === activeSplitDay)) activeSplitDay = days[0] || '';

    const pills = document.getElementById('workoutSplitDayPills');
    if(pills){
      pills.innerHTML = days.map(day => `
        <button type="button" class="workout-split-day${day === activeSplitDay ? ' active' : ''}" data-split-day="${esc(day)}">${esc(day)}</button>
      `).join('');
    }

    const context = document.getElementById('workoutSplitContextText');
    if(context){
      context.innerHTML = `<span>New sets will log under</span><b>${esc(split.name)}</b><i>→</i><strong>${esc(activeSplitDay || 'Choose a day')}</strong>`;
    }

    updateContextBar();
  }

  function updateContextBar(){
    const value = document.getElementById('workoutLogContextValue');
    if(!value) return;
    const split = currentSplit();
    if(!splitUser){
      value.textContent = 'Log in to use a split';
    }else if(!split){
      value.textContent = 'No split selected';
    }else{
      value.textContent = `${split.name} · ${activeSplitDay || 'Choose day'}`;
    }
  }

  async function loadSplitData(){
    installSplitUi();

    const {data:{session}} = await db.auth.getSession();
    splitUser = session?.user || null;

    if(!splitUser){
      splitRows = [];
      activeSplitId = null;
      activeSplitDay = '';
      renderActiveSplit();
      await loadSplitSessions();
      return;
    }

    const [splitsRes,contextRes] = await Promise.all([
      db.from('workout_splits')
        .select('id,name,days,created_at,updated_at')
        .eq('user_id',splitUser.id)
        .order('created_at',{ascending:true}),
      db.from('workout_active_context')
        .select('split_id,split_day')
        .eq('user_id',splitUser.id)
        .maybeSingle()
    ]);

    if(splitsRes.error){
      console.warn('Workout split setup not ready:',splitsRes.error);
      splitRows = [];
      renderActiveSplit();
      return;
    }

    splitRows = splitsRes.data || [];
    activeSplitId = contextRes.data?.split_id || activeSplitId;
    activeSplitDay = contextRes.data?.split_day || activeSplitDay;

    if(splitRows.length && !currentSplit()){
      activeSplitId = splitRows[0].id;
      activeSplitDay = splitRows[0].days?.[0] || '';
      await saveContext();
    }

    renderActiveSplit();
    await loadSplitSessions();
  }

  function sessionDateLabel(value){
    if(!value) return 'No date';
    try{
      const d = new Date(`${value}T12:00:00`);
      return d.toLocaleDateString([],{month:'short',day:'numeric',year:d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined});
    }catch(_){ return value; }
  }

  async function loadSplitSessions(){
    const list = document.getElementById('workoutSessionList');
    const count = document.getElementById('workoutSessionCount');
    if(!list) return;

    if(!splitUser){
      list.innerHTML = '<div class="workout-empty">Log in to see your saved sessions.</div>';
      if(count) count.textContent = '0 sessions';
      return;
    }

    const {data,error} = await db
      .from('workout_logs')
      .select('id,exercise,weight,reps,set_number,workout_date,created_at,split_name,split_day')
      .eq('user_id',splitUser.id)
      .order('workout_date',{ascending:false})
      .order('created_at',{ascending:false})
      .limit(500);

    if(error){
      list.innerHTML = `<div class="workout-empty">${esc(error.message)}</div>`;
      return;
    }

    const groups = new Map();
    for(const row of data || []){
      const splitName = row.split_name || 'Unassigned';
      const splitDay = row.split_day || (row.split_name ? 'Workout' : 'Legacy logs');
      const key = `${row.workout_date || ''}|${splitName}|${splitDay}`;
      if(!groups.has(key)) groups.set(key,{date:row.workout_date,splitName,splitDay,rows:[]});
      groups.get(key).rows.push(row);
    }

    const sessions = [...groups.values()].slice(0,10);
    if(count) count.textContent = `${groups.size} session${groups.size === 1 ? '' : 's'}`;

    if(!sessions.length){
      list.innerHTML = '<div class="workout-empty">Log your first set to start building session history.</div>';
      return;
    }

    list.innerHTML = sessions.map(session => {
      const exerciseNames = [...new Set(session.rows.map(row => row.exercise).filter(Boolean))];
      const preview = exerciseNames.slice(0,4).join(' · ') + (exerciseNames.length > 4 ? ` · +${exerciseNames.length - 4} more` : '');
      const unassigned = session.splitName === 'Unassigned';
      return `
        <article class="workout-session-row${unassigned ? ' unassigned' : ''}">
          <div class="workout-session-date">${esc(sessionDateLabel(session.date))}</div>
          <div class="workout-session-main">
            <div class="workout-session-title">
              <strong>${esc(session.splitName)}</strong>
              <span>·</span>
              <b>${esc(session.splitDay)}</b>
            </div>
            <div class="workout-session-exercises">${esc(preview || 'Logged workout')}</div>
          </div>
          <div class="workout-session-meta">
            <b>${session.rows.length}</b><span>set${session.rows.length === 1 ? '' : 's'}</span>
            <b>${exerciseNames.length}</b><span>exercise${exerciseNames.length === 1 ? '' : 's'}</span>
          </div>
        </article>
      `;
    }).join('');
  }

  // Wait for the existing workout UI to finish installing, then enhance it.
  const boot = () => {
    installSplitUi();
    if(splitUiInstalled) loadSplitData();
  };

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else setTimeout(boot,0);

  const observer = new MutationObserver(() => {
    if(!splitUiInstalled && document.getElementById('workoutTracker')) boot();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  db.auth.onAuthStateChange(() => setTimeout(loadSplitData,80));
})();
// ============================================================
// GYMCELS COMMUNITY ROLES / BADGES
// Paste at the VERY BOTTOM of your current app.js.
// Do not remove the code already there.
// ============================================================
(() => {
  const ROLE_OPTIONS = [
    ['', 'No community role'],
    ['promoter', 'Promoter 📣'],
    ['founding_member', 'Founding Member ⭐'],
    ['contributor', 'Contributor 🛠️'],
    ['content_creator', 'Content Creator 🎥'],
    ['event_host', 'Event Host 🎙️'],
    ['helper', 'Helper 🤝']
  ];

  const ROLE_META = {
    admin: { label:'Admin', cls:'admin' },
    moderator: { label:'Moderator', cls:'moderator' },
    promoter: { label:'Promoter 📣', cls:'promoter' },
    founding_member: { label:'Founding Member ⭐', cls:'founding-member' },
    contributor: { label:'Contributor 🛠️', cls:'contributor' },
    content_creator: { label:'Content Creator 🎥', cls:'content-creator' },
    event_host: { label:'Event Host 🎙️', cls:'event-host' },
    helper: { label:'Helper 🤝', cls:'helper' }
  };

  const roleLabel = role => ROLE_META[role]?.label || 'Member';

  // Upgrade the site's existing Admin/Moderator badge renderer so it can
  // render a staff badge AND a community badge beside the same name.
  if(typeof staffBadgeMarkup === 'function'){
    staffBadgeMarkup = function(roleValue){
      const roles = [...new Set(
        String(roleValue || '')
          .split('|')
          .map(v => v.trim())
          .filter(Boolean)
      )];

      return roles.map(role => {
        const meta = ROLE_META[role];
        if(!meta) return '';
        return `<span class="staff-badge ${meta.cls}">${meta.label}</span>`;
      }).join('');
    };
  }

  async function getCommunityRoleMap(userIds){
    const ids = [...new Set((userIds || []).filter(Boolean))];
    if(!ids.length || !window.gymcelsLolDb) return {};

    try{
      const {data,error} = await window.gymcelsLolDb.rpc(
        'admin_get_member_community_roles',
        {target_users:ids}
      );
      if(error) throw error;

      return Object.fromEntries(
        (data || []).map(row => [row.user_id, row.role || ''])
      );
    }catch(err){
      console.error('Community role admin lookup error:',err);
      return {};
    }
  }

  function roleControlMarkup(currentRole=''){
    const options = ROLE_OPTIONS.map(([value,label]) =>
      `<option value="${value}"${value === currentRole ? ' selected' : ''}>${label}</option>`
    ).join('');

    return `
      <div class="community-role-admin">
        <div class="community-role-admin-copy">
          <strong>Community role</strong>
          <span>Visible badge beside this member's name. Does not give moderation powers.</span>
        </div>
        <div class="community-role-admin-controls">
          <select data-community-role-select>${options}</select>
          <button type="button" data-save-community-role>Save role</button>
        </div>
      </div>
    `;
  }

  function syncCardCommunityRole(card, currentRole=''){
    if(!card) return;

    card.dataset.communityRole = currentRole || '';

    let control = card.querySelector('.community-role-admin');
    if(!control){
      const actions = card.querySelector('.staff-admin-actions');
      const grid = card.querySelector('.staff-permission-grid');

      if(actions){
        actions.insertAdjacentHTML('beforebegin',roleControlMarkup(currentRole));
      }else if(grid){
        grid.insertAdjacentHTML('afterend',roleControlMarkup(currentRole));
      }else{
        card.insertAdjacentHTML('beforeend',roleControlMarkup(currentRole));
      }
      control = card.querySelector('.community-role-admin');
    }

    const select = control?.querySelector('[data-community-role-select]');
    if(select) select.value = currentRole || '';

    // Show the community badge immediately in the Admin card too.
    card.querySelectorAll('.community-role-preview').forEach(node => node.remove());

    if(currentRole){
      const name = card.querySelector('.staff-admin-name');
      const meta = ROLE_META[currentRole];
      if(name && meta){
        name.insertAdjacentHTML(
          'beforeend',
          `<span class="staff-badge ${meta.cls} community-role-preview">${meta.label}</span>`
        );
      }
    }

    const roleLine = card.querySelector('.staff-admin-role');
    if(roleLine){
      const baseText = roleLine.textContent || '';
      const isAdmin = /administrator/i.test(baseText);
      const isModerator = /moderator/i.test(baseText);

      if(currentRole){
        const prefix = isAdmin
          ? 'Administrator · all permissions'
          : (isModerator ? 'Moderator' : 'Community role');

        roleLine.textContent = `${prefix} · ${roleLabel(currentRole)}`;
      }else if(!isAdmin && !isModerator){
        roleLine.textContent = 'Member';
      }
    }

    // A role-only member has no moderation permissions; make that obvious.
    const hasModPermission = [...card.querySelectorAll('[data-staff-permission]')]
      .some(input => input.checked);

    const note = card.querySelector('.staff-admin-note');
    if(note && currentRole && !hasModPermission){
      note.textContent = 'Community badge only — no moderation permissions.';
    }
  }

  let decorating = false;

  async function decorateRoleCards(container){
    if(decorating || !container) return;

    const cards = [...container.querySelectorAll('.staff-admin-card')]
      .filter(card => !card.dataset.communityRoleDecorated);

    if(!cards.length) return;

    decorating = true;
    cards.forEach(card => card.dataset.communityRoleDecorated = 'loading');

    try{
      const ids = cards.map(card => card.dataset.staffUser).filter(Boolean);
      const roleMap = await getCommunityRoleMap(ids);

      cards.forEach(card => {
        syncCardCommunityRole(
          card,
          roleMap[card.dataset.staffUser] || ''
        );
        card.dataset.communityRoleDecorated = '1';
      });
    }finally{
      decorating = false;
    }
  }

  function updateStaffPanelWords(){
    if(typeof staffAdminPanel === 'undefined' || !staffAdminPanel) return;

    const head = staffAdminPanel.querySelector('.staff-current-head');
    if(head){
      const label = [...head.children].find(el => el.tagName !== 'BUTTON');
      if(label && /moderator/i.test(label.textContent || '')){
        label.textContent = 'Current moderators & roles';
      }
    }

    staffAdminPanel.querySelectorAll('.staff-admin-empty').forEach(el => {
      if((el.textContent || '').trim() === 'No moderators yet.'){
        el.textContent = 'No moderators or community roles yet.';
      }
    });
  }

  async function decorateAllRoleCards(){
    updateStaffPanelWords();

    if(typeof staffSearchResults !== 'undefined' && staffSearchResults){
      await decorateRoleCards(staffSearchResults);
    }

    if(typeof staffMembersList !== 'undefined' && staffMembersList){
      await decorateRoleCards(staffMembersList);
    }
  }

  document.addEventListener('click',async event => {
    const btn = event.target.closest('[data-save-community-role]');
    if(!btn) return;

    const card = btn.closest('.staff-admin-card');
    if(!card) return;

    if(typeof chatIsSiteAdmin !== 'undefined' && !chatIsSiteAdmin) return;

    const userId = card.dataset.staffUser;
    const select = card.querySelector('[data-community-role-select]');
    const newRole = String(select?.value || '');

    if(!userId || !window.gymcelsLolDb) return;

    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Saving...';

    try{
      const {error} = await window.gymcelsLolDb.rpc(
        'set_member_community_role',
        {
          target_user:userId,
          new_role:newRole || null
        }
      );
      if(error) throw error;

      if(typeof setStaffPanelStatus === 'function'){
        setStaffPanelStatus(
          newRole
            ? `✓ ${roleLabel(newRole)} role assigned.`
            : '✓ Community role removed.',
          'success'
        );
      }

      syncCardCommunityRole(card,newRole);

      // Refresh the current-role list and public areas so badges update now.
      if(typeof loadCurrentStaffMembers === 'function'){
        await loadCurrentStaffMembers();
      }

      if(
        typeof staffSearchInput !== 'undefined'
        && staffSearchInput?.value?.trim()
        && typeof searchStaffMembers === 'function'
      ){
        await searchStaffMembers();
      }

      if(typeof loadCommunityChat === 'function'){
        await loadCommunityChat(false);
      }

      if(typeof loadThreads === 'function'){
        await loadThreads();
      }

      if(typeof activeThread !== 'undefined' && activeThread && typeof openThread === 'function'){
        await openThread(activeThread.id);
      }
    }catch(err){
      console.error('Community role save error:',err);

      if(typeof setStaffPanelStatus === 'function'){
        setStaffPanelStatus(err?.message || String(err),'error');
      }
    }finally{
      btn.disabled = false;
      btn.textContent = oldText || 'Save role';
      setTimeout(decorateAllRoleCards,0);
    }
  });

  const watch = container => {
    if(!container) return;

    new MutationObserver(() => {
      setTimeout(decorateAllRoleCards,0);
    }).observe(container,{childList:true,subtree:true});
  };

  if(typeof staffSearchResults !== 'undefined') watch(staffSearchResults);
  if(typeof staffMembersList !== 'undefined') watch(staffMembersList);

  // Initial pass.
  setTimeout(decorateAllRoleCards,0);
})();
// ============================================================
// GYMCELS MULTI-ROLE + REPUTATION PATCH
// Paste at the VERY BOTTOM of your current app.js.
// Keep the previous code above it.
// ============================================================
(() => {
  const ROLE_OPTIONS_V2 = [
    ['promoter', 'Promoter 📣'],
    ['founding_member', 'Founding Member ⭐'],
    ['contributor', 'Contributor 🛠️'],
    ['content_creator', 'Content Creator 🎥'],
    ['event_host', 'Event Host 🎙️'],
    ['helper', 'Helper 🤝']
  ];

  const ROLE_META_V2 = {
    admin: { label:'Admin', cls:'admin' },
    moderator: { label:'Moderator', cls:'moderator' },
    promoter: { label:'Promoter 📣', cls:'promoter' },
    founding_member: { label:'Founding Member ⭐', cls:'founding-member' },
    contributor: { label:'Contributor 🛠️', cls:'contributor' },
    content_creator: { label:'Content Creator 🎥', cls:'content-creator' },
    event_host: { label:'Event Host 🎙️', cls:'event-host' },
    helper: { label:'Helper 🤝', cls:'helper' }
  };

  // Make sure pipe-separated multiple badges always render correctly.
  if(typeof staffBadgeMarkup === 'function'){
    staffBadgeMarkup = function(roleValue){
      const roles = [...new Set(
        String(roleValue || '')
          .split('|')
          .map(v => v.trim())
          .filter(Boolean)
      )];

      return roles.map(role => {
        const meta = ROLE_META_V2[role];
        if(!meta) return '';
        return `<span class="staff-badge ${meta.cls}">${meta.label}</span>`;
      }).join('');
    };
  }

  // ------------------------------------------------------------
  // MULTI-ROLE ADMIN UI
  // ------------------------------------------------------------

  let multiRoleDecorating = false;

  async function loadRoleSets(userIds){
    const ids = [...new Set((userIds || []).filter(Boolean))];
    if(!ids.length || !window.gymcelsLolDb) return {};

    const {data,error} = await window.gymcelsLolDb.rpc(
      'admin_get_member_community_roles',
      {target_users:ids}
    );
    if(error) throw error;

    const map = {};
    (data || []).forEach(row => {
      if(!map[row.user_id]) map[row.user_id] = [];
      if(row.role && !map[row.user_id].includes(row.role)){
        map[row.user_id].push(row.role);
      }
    });
    return map;
  }

  function multiRoleMarkup(selected=[]){
    const selectedSet = new Set(selected || []);

    return `
      <div class="community-roles-admin-v2">
        <div class="community-roles-v2-head">
          <div>
            <strong>Community roles</strong>
            <span>Select as many as you want. These are badges only and do not give moderation powers.</span>
          </div>
          <span class="community-roles-v2-count">${selectedSet.size} selected</span>
        </div>

        <div class="community-roles-v2-grid">
          ${ROLE_OPTIONS_V2.map(([value,label]) => `
            <label class="community-role-v2-option">
              <input type="checkbox"
                     data-community-role-v2="${value}"
                     ${selectedSet.has(value) ? 'checked' : ''}>
              <span>${label}</span>
            </label>
          `).join('')}
        </div>

        <div class="community-roles-v2-actions">
          <span>Moderator permissions above stay separate from these badges.</span>
          <button type="button" data-save-community-roles-v2>Save roles</button>
        </div>
      </div>
    `;
  }

  function refreshSelectedCount(card){
    const count = card.querySelectorAll('[data-community-role-v2]:checked').length;
    const el = card.querySelector('.community-roles-v2-count');
    if(el) el.textContent = `${count} selected`;
  }

  function installMultiRoleCard(card,selected=[]){
    if(!card) return;

    // Remove the old one-role dropdown from the first version.
    card.querySelectorAll('.community-role-admin').forEach(el => el.remove());
    card.querySelectorAll('.community-roles-admin-v2').forEach(el => el.remove());

    const actions = card.querySelector('.staff-admin-actions');
    const grid = card.querySelector('.staff-permission-grid');

    if(actions){
      actions.insertAdjacentHTML('beforebegin',multiRoleMarkup(selected));
    }else if(grid){
      grid.insertAdjacentHTML('afterend',multiRoleMarkup(selected));
    }else{
      card.insertAdjacentHTML('beforeend',multiRoleMarkup(selected));
    }

    card.dataset.communityRolesV2 = '1';
    refreshSelectedCount(card);
  }

  async function decorateMultiRoleCards(container){
    if(multiRoleDecorating || !container) return;

    const cards = [...container.querySelectorAll('.staff-admin-card')]
      .filter(card => card.dataset.communityRolesV2 !== '1');

    if(!cards.length) return;

    multiRoleDecorating = true;

    try{
      const ids = cards.map(card => card.dataset.staffUser).filter(Boolean);
      const roleMap = await loadRoleSets(ids);

      cards.forEach(card => {
        installMultiRoleCard(card,roleMap[card.dataset.staffUser] || []);
      });
    }catch(err){
      console.error('Multi-role UI error:',err);
    }finally{
      multiRoleDecorating = false;
    }
  }

  async function decorateAllMultiRoleCards(){
    if(typeof staffAdminPanel !== 'undefined' && staffAdminPanel){
      const head = staffAdminPanel.querySelector('.staff-current-head');
      if(head){
        const label = [...head.children].find(el => el.tagName !== 'BUTTON');
        if(label && /moderator/i.test(label.textContent || '')){
          label.textContent = 'Current moderators & roles';
        }
      }
    }

    if(typeof staffSearchResults !== 'undefined' && staffSearchResults){
      await decorateMultiRoleCards(staffSearchResults);
    }

    if(typeof staffMembersList !== 'undefined' && staffMembersList){
      await decorateMultiRoleCards(staffMembersList);
    }
  }

  document.addEventListener('change',event => {
    const checkbox = event.target.closest('[data-community-role-v2]');
    if(!checkbox) return;
    const card = checkbox.closest('.staff-admin-card');
    if(card) refreshSelectedCount(card);
  });

  document.addEventListener('click',async event => {
    const btn = event.target.closest('[data-save-community-roles-v2]');
    if(!btn) return;

    const card = btn.closest('.staff-admin-card');
    const userId = card?.dataset.staffUser;
    if(!card || !userId || !window.gymcelsLolDb) return;

    const roles = [...card.querySelectorAll('[data-community-role-v2]:checked')]
      .map(input => input.dataset.communityRoleV2)
      .filter(Boolean);

    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Saving...';

    try{
      const {error} = await window.gymcelsLolDb.rpc(
        'set_member_community_roles',
        {
          target_user:userId,
          new_roles:roles
        }
      );
      if(error) throw error;

      if(typeof setStaffPanelStatus === 'function'){
        setStaffPanelStatus(
          roles.length
            ? `✓ ${roles.length} community role${roles.length===1?'':'s'} saved.`
            : '✓ Community roles removed.',
          'success'
        );
      }

      if(typeof loadCurrentStaffMembers === 'function'){
        await loadCurrentStaffMembers();
      }

      if(
        typeof staffSearchInput !== 'undefined'
        && staffSearchInput?.value?.trim()
        && typeof searchStaffMembers === 'function'
      ){
        await searchStaffMembers();
      }

      if(typeof loadCommunityChat === 'function'){
        await loadCommunityChat(false);
      }

      if(typeof loadThreads === 'function'){
        await loadThreads();
      }

      if(typeof activeThread !== 'undefined' && activeThread && typeof openThread === 'function'){
        await openThread(activeThread.id);
      }
    }catch(err){
      console.error('Save multi roles error:',err);
      if(typeof setStaffPanelStatus === 'function'){
        setStaffPanelStatus(err?.message || String(err),'error');
      }
    }finally{
      btn.disabled = false;
      btn.textContent = oldText || 'Save roles';
      setTimeout(decorateAllMultiRoleCards,0);
    }
  });

  const watchRoleContainer = container => {
    if(!container) return;
    new MutationObserver(() => {
      setTimeout(decorateAllMultiRoleCards,0);
    }).observe(container,{childList:true,subtree:true});
  };

  if(typeof staffSearchResults !== 'undefined') watchRoleContainer(staffSearchResults);
  if(typeof staffMembersList !== 'undefined') watchRoleContainer(staffMembersList);

  setTimeout(decorateAllMultiRoleCards,0);


  // ------------------------------------------------------------
  // REPUTATION
  // ------------------------------------------------------------

  const repCache = new Map();

  function repLevelClass(level){
    return String(level || 'Newcomer').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  }

  async function getRepBatch(userIds,force=false){
    const ids = [...new Set((userIds || []).filter(Boolean))];
    const missing = force ? ids : ids.filter(id => !repCache.has(id));

    if(missing.length && window.gymcelsLolDb){
      try{
        const {data,error} = await window.gymcelsLolDb.rpc(
          'public_member_reputations',
          {target_users:missing}
        );
        if(error) throw error;

        (data || []).forEach(row => {
          repCache.set(row.user_id,{
            reputation:Number(row.reputation || 0),
            level:row.level || 'Newcomer'
          });
        });

        missing.forEach(id => {
          if(!repCache.has(id)){
            repCache.set(id,{reputation:0,level:'Newcomer'});
          }
        });
      }catch(err){
        console.error('Reputation badge load error:',err);
      }
    }

    return Object.fromEntries(
      ids.map(id => [id,repCache.get(id) || {reputation:0,level:'Newcomer'}])
    );
  }

  function repBadgeMarkup(rep){
    const score = Number(rep?.reputation || 0);
    const level = rep?.level || 'Newcomer';
    return `<span class="member-rep-badge rep-${repLevelClass(level)}" title="${level} reputation">${score} REP</span>`;
  }

  async function decorateChatReputation(){
    const buttons = [...document.querySelectorAll('.chat-user-button[data-chat-user]')]
      .filter(btn => btn.dataset.repDecorated !== '1');

    if(!buttons.length) return;

    const ids = buttons.map(btn => btn.dataset.chatUser).filter(Boolean);
    const map = await getRepBatch(ids);

    buttons.forEach(btn => {
      const uid = btn.dataset.chatUser;
      const parent = btn.parentElement;
      if(!uid || !parent) return;

      parent.querySelectorAll(`.member-rep-badge[data-rep-user="${CSS.escape(uid)}"]`).forEach(el => el.remove());

      const holder = document.createElement('span');
      holder.innerHTML = repBadgeMarkup(map[uid]);
      const badge = holder.firstElementChild;
      if(badge){
        badge.dataset.repUser = uid;
        const time = parent.querySelector('.chat-time');
        if(time) parent.insertBefore(badge,time);
        else parent.appendChild(badge);
      }

      btn.dataset.repDecorated = '1';
    });
  }

  // Existing chat reloads itself often, so decorate after each load.
  if(typeof loadCommunityChat === 'function'){
    const originalLoadCommunityChat = loadCommunityChat;
    loadCommunityChat = async function(...args){
      const result = await originalLoadCommunityChat.apply(this,args);
      setTimeout(decorateChatReputation,0);
      return result;
    };
  }

  const chatMessagesEl = document.getElementById('chatMessages');
  if(chatMessagesEl){
    new MutationObserver(() => {
      setTimeout(decorateChatReputation,0);
    }).observe(chatMessagesEl,{childList:true,subtree:true});
  }

  function ensureReputationPanel(){
    const profile = document.querySelector('.chat-public-profile');
    const stats = profile?.querySelector('.chat-public-stats');
    if(!profile || !stats) return null;

    let panel = profile.querySelector('#memberReputationPanel');
    if(panel) return panel;

    panel = document.createElement('div');
    panel.id = 'memberReputationPanel';
    panel.className = 'member-reputation-panel';
    panel.innerHTML = `
      <div class="member-reputation-score">
        <b id="memberReputationScore">0</b>
        <span>REP</span>
      </div>

      <div class="member-reputation-copy">
        <strong id="memberReputationLevel">Newcomer</strong>
        <span id="memberReputationNote">Positive reputation from other Gymcels members.</span>
      </div>

      <button id="giveMemberRepBtn" class="give-member-rep-btn" type="button">+1 Rep</button>
    `;

    stats.insertAdjacentElement('afterend',panel);

    panel.querySelector('#giveMemberRepBtn')?.addEventListener('click',async () => {
      const target = panel.dataset.repUser;
      if(!target || !window.gymcelsLolDb) return;

      const btn = panel.querySelector('#giveMemberRepBtn');
      btn.disabled = true;
      btn.textContent = 'Giving rep...';

      try{
        const {data,error} = await window.gymcelsLolDb.rpc(
          'give_member_reputation',
          {target_user:target}
        );
        if(error) throw error;

        repCache.delete(target);
        await renderProfileReputation(target,true);

        document.querySelectorAll(`.chat-user-button[data-chat-user="${CSS.escape(target)}"]`)
          .forEach(el => delete el.dataset.repDecorated);

        await getRepBatch([target],true);
        await decorateChatReputation();
      }catch(err){
        console.error('Give reputation error:',err);
        const note = panel.querySelector('#memberReputationNote');
        if(note) note.textContent = err?.message || String(err);
        btn.disabled = false;
        btn.textContent = '+1 Rep';
      }
    });

    return panel;
  }

  function formatRepTime(value){
    if(!value) return '';
    const d = new Date(value);
    if(Number.isNaN(d.getTime())) return '';
    return d.toLocaleString([],{
      month:'short',
      day:'numeric',
      hour:'numeric',
      minute:'2-digit'
    });
  }

  async function renderProfileReputation(userId,force=false){
    if(!userId || !window.gymcelsLolDb) return;

    const panel = ensureReputationPanel();
    if(!panel) return;

    panel.dataset.repUser = userId;

    const scoreEl = panel.querySelector('#memberReputationScore');
    const levelEl = panel.querySelector('#memberReputationLevel');
    const noteEl = panel.querySelector('#memberReputationNote');
    const btn = panel.querySelector('#giveMemberRepBtn');

    if(scoreEl) scoreEl.textContent = '—';
    if(levelEl) levelEl.textContent = 'Loading...';
    if(noteEl) noteEl.textContent = 'Checking community reputation...';
    if(btn){
      btn.disabled = true;
      btn.textContent = '+1 Rep';
    }

    try{
      const {data,error} = await window.gymcelsLolDb.rpc(
        'get_public_member_reputation',
        {target_user:userId}
      );
      if(error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      const score = Number(row?.reputation || 0);
      const level = row?.level || 'Newcomer';

      repCache.set(userId,{reputation:score,level});

      if(scoreEl) scoreEl.textContent = String(score);
      if(levelEl) levelEl.textContent = level;

      let session = null;
      try{
        if(typeof getChatSession === 'function') session = await getChatSession();
        else session = (await window.gymcelsLolDb.auth.getSession())?.data?.session || null;
      }catch(_){ }

      const viewerId = session?.user?.id || null;
      const isSelf = viewerId === userId;

      if(!viewerId){
        if(noteEl) noteEl.textContent = 'Log in to give this member +1 reputation.';
        if(btn){
          btn.disabled = true;
          btn.textContent = 'Log in to rep';
        }
      }else if(isSelf){
        if(noteEl) noteEl.textContent = 'Reputation given to you by other community members.';
        if(btn){
          btn.disabled = true;
          btn.textContent = 'Your reputation';
        }
      }else if(row?.can_rep){
        if(noteEl) noteEl.textContent = 'Think they helped or contributed? Give them +1 Rep.';
        if(btn){
          btn.disabled = false;
          btn.textContent = '+1 Rep';
        }
      }else{
        const next = formatRepTime(row?.next_rep_at);
        if(noteEl){
          noteEl.textContent = next
            ? `You already gave them rep. You can rep them again after ${next}.`
            : 'You already gave this member reputation recently.';
        }
        if(btn){
          btn.disabled = true;
          btn.textContent = 'Rep given ✓';
        }
      }

      panel.dataset.repLevel = repLevelClass(level);
    }catch(err){
      console.error('Profile reputation load error:',err);
      if(scoreEl) scoreEl.textContent = '—';
      if(levelEl) levelEl.textContent = 'Reputation';
      if(noteEl) noteEl.textContent = 'Could not load reputation right now.';
      if(btn){
        btn.disabled = true;
        btn.textContent = '+1 Rep';
      }
    }
  }

  // Wrap the existing public-profile opener so reputation loads every time.
  if(typeof openChatPublicProfile === 'function'){
    const originalOpenChatPublicProfile = openChatPublicProfile;
    openChatPublicProfile = async function(userId,...rest){
      const result = await originalOpenChatPublicProfile.call(this,userId,...rest);
      setTimeout(() => renderProfileReputation(userId),0);
      return result;
    };
  }

  // Backup hook in case a cached click listener opened the profile before the wrapper.
  const profileOverlay = document.getElementById('chatProfileOverlay');
  if(profileOverlay){
    new MutationObserver(() => {
      if(
        profileOverlay.classList.contains('show')
        && typeof openedChatUserId !== 'undefined'
        && openedChatUserId
      ){
        renderProfileReputation(openedChatUserId);
      }
    }).observe(profileOverlay,{attributes:true,attributeFilter:['class','aria-hidden']});
  }

  setTimeout(() => {
    decorateChatReputation();
    ensureReputationPanel();
  },100);
})();
