// ============================================================
// GYMCELS COMMUNITY EXTRAS V3
// One stable REP badge in chat + multi-role admin + profile reputation.
// Replace the ENTIRE contents of community-extras.js with this.
// ============================================================
(() => {
  'use strict';

  if (window.__gymcelsCommunityExtrasV2Loaded) return;
  window.__gymcelsCommunityExtrasV2Loaded = true;

  const ROLE_OPTIONS = [
    ['promoter', 'Promoter 📣'],
    ['founding_member', 'Founding Member ⭐'],
    ['contributor', 'Contributor 🛠️'],
    ['content_creator', 'Content Creator 🎥'],
    ['event_host', 'Event Host 🎙️'],
    ['helper', 'Helper 🤝']
  ];

  const repCache = new Map();
  const decoratingCards = new WeakSet();
  let activeProfileUserId = null;
  let profileRepLoadingFor = null;
  let lastProfileRepLoadAt = 0;
  let adminScanTimer = null;
  let chatObserver = null;
  let observedChatNode = null;

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function dbReady() {
    for (let i = 0; i < 40; i++) {
      if (window.gymcelsLolDb) return window.gymcelsLolDb;
      await sleep(100);
    }
    return null;
  }

  function repLevelClass(level) {
    return String(level || 'Newcomer')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
  }

  // ------------------------------------------------------------
  // STYLES
  // ------------------------------------------------------------
  function installStyles() {
    document.getElementById('gymcelsCommunityExtrasCss')?.remove();

    const style = document.createElement('style');
    style.id = 'gymcelsCommunityExtrasCss';
    style.textContent = `
      #memberReputationPanel{display:none!important}
      .member-rep-badge{display:none!important}

      .gc-extra-role-box{
        margin-top:10px;padding:12px;border:1px solid #29313a;border-radius:11px;
        background:linear-gradient(180deg,rgba(19,24,30,.98),rgba(12,16,20,.98))
      }
      .gc-extra-role-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .gc-extra-role-head strong{display:block;color:#fff;font-size:10px;font-weight:950}
      .gc-extra-role-head small{display:block;margin-top:3px;color:#7e8894;font-size:8px;line-height:1.4}
      .gc-extra-role-count{
        flex:0 0 auto;padding:5px 8px;border:1px solid #313943;border-radius:999px;
        background:#0a0e12;color:#9ba5b1;font-size:8px;font-weight:900
      }
      .gc-extra-role-grid{
        display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:10px
      }
      .gc-extra-role-choice{
        display:flex;align-items:center;gap:8px;min-width:0;padding:9px 10px;
        border:1px solid #29313a;border-radius:9px;background:#10151a;color:#dfe5eb;
        cursor:pointer;transition:.15s ease
      }
      .gc-extra-role-choice:hover{border-color:#3b4551;background:#131920}
      .gc-extra-role-choice:has(input:checked){
        border-color:rgba(239,67,85,.58);background:rgba(239,67,85,.08)
      }
      .gc-extra-role-choice input{margin:0;accent-color:#ef4355;flex:0 0 auto}
      .gc-extra-role-choice span{
        min-width:0;font-size:9px;font-weight:900;white-space:nowrap;
        overflow:hidden;text-overflow:ellipsis
      }
      .gc-extra-role-actions{
        display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px
      }
      .gc-extra-role-actions small{color:#747f8a;font-size:8px}
      .gc-extra-role-save{
        border:0;border-radius:9px;background:#ef4355;color:#fff;padding:9px 13px;
        font-size:9px;font-weight:950;cursor:pointer
      }
      .gc-extra-role-save:disabled{opacity:.55;cursor:not-allowed}
      .gc-extra-role-status{margin-top:7px;min-height:12px;color:#8d98a5;font-size:8px;font-weight:800}
      .gc-extra-role-status.ok{color:#78dfa0}
      .gc-extra-role-status.err{color:#ff8f9d}

      .gc-rep-badge{
        display:inline-flex;align-items:center;justify-content:center;margin-left:5px;
        padding:2px 6px;border:1px solid #343b45;border-radius:999px;background:#11161c;
        color:#aab3be;font-size:7px;font-weight:950;line-height:1.2;
        letter-spacing:.03em;vertical-align:middle;white-space:nowrap
      }
      .gc-rep-badge.rep-known{color:#a7d8ff;border-color:rgba(96,176,238,.38);background:rgba(62,141,202,.09)}
      .gc-rep-badge.rep-respected{color:#9ce8b2;border-color:rgba(89,204,122,.40);background:rgba(59,171,91,.09)}
      .gc-rep-badge.rep-trusted{color:#ffd36f;border-color:rgba(236,181,60,.42);background:rgba(221,158,28,.10)}
      .gc-rep-badge.rep-veteran{color:#d6b5ff;border-color:rgba(173,113,244,.42);background:rgba(138,72,215,.10)}
      .gc-rep-badge.rep-legend{color:#ff9aa8;border-color:rgba(239,67,85,.50);background:rgba(239,67,85,.11)}

      #gcReputationPanel{
        display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;
        margin:12px 0;padding:12px;border:1px solid #2b333d;border-radius:12px;
        background:radial-gradient(circle at 0 0,rgba(239,67,85,.10),transparent 42%),#0e1318
      }
      .gc-rep-score{
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        min-width:58px;min-height:58px;padding:8px;border:1px solid rgba(239,67,85,.32);
        border-radius:12px;background:rgba(239,67,85,.07)
      }
      .gc-rep-score b{color:#fff;font-size:22px;line-height:1;font-weight:1000}
      .gc-rep-score span{margin-top:4px;color:#ef6575;font-size:8px;font-weight:1000;letter-spacing:.08em}
      .gc-rep-copy strong{display:block;color:#fff;font-size:12px;font-weight:1000}
      .gc-rep-copy span{display:block;margin-top:4px;color:#818b96;font-size:9px;line-height:1.45}
      .gc-rep-give{
        min-width:88px;border:0;border-radius:10px;background:#ef4355;color:#fff;
        padding:10px 12px;font-size:9px;font-weight:1000;cursor:pointer
      }
      .gc-rep-give:disabled{opacity:.56;cursor:not-allowed}

      @media(max-width:700px){
        .gc-extra-role-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .gc-extra-role-actions{align-items:stretch;flex-direction:column}
        .gc-extra-role-save{width:100%}
        #gcReputationPanel{grid-template-columns:auto minmax(0,1fr)}
        .gc-rep-give{grid-column:1/-1;width:100%}
      }
      @media(max-width:420px){
        .gc-extra-role-grid{grid-template-columns:1fr}
      }
    `;
    document.head.appendChild(style);
  }

  // ------------------------------------------------------------
  // MULTI ROLES
  // ------------------------------------------------------------
  async function fetchRolesForUser(userId) {
    const db = await dbReady();
    if (!db) throw new Error('Database connection is not ready.');

    const { data, error } = await db.rpc('admin_get_member_community_roles', {
      target_users: [userId]
    });
    if (error) throw error;

    return [...new Set((data || []).map(row => row.role).filter(Boolean))];
  }

  function roleBoxHtml(selected) {
    const set = new Set(selected || []);

    return `
      <div class="gc-extra-role-box">
        <div class="gc-extra-role-head">
          <div>
            <strong>Community roles</strong>
            <small>Select as many as you want. These badges do not give moderation powers.</small>
          </div>
          <span class="gc-extra-role-count">${set.size} selected</span>
        </div>
        <div class="gc-extra-role-grid">
          ${ROLE_OPTIONS.map(([value,label]) => `
            <label class="gc-extra-role-choice">
              <input type="checkbox" data-gc-role="${value}" ${set.has(value) ? 'checked' : ''}>
              <span>${label}</span>
            </label>
          `).join('')}
        </div>
        <div class="gc-extra-role-actions">
          <small>Moderator permissions remain separate.</small>
          <button class="gc-extra-role-save" type="button">Save roles</button>
        </div>
        <div class="gc-extra-role-status"></div>
      </div>
    `;
  }

  function updateRoleCount(box) {
    const count = box.querySelectorAll('[data-gc-role]:checked').length;
    const el = box.querySelector('.gc-extra-role-count');
    if (el) el.textContent = `${count} selected`;
  }

  async function decorateAdminCard(card) {
    if (!card || card.dataset.gcExtrasRoleReady === '1' || decoratingCards.has(card)) return;

    const userId = card.dataset.staffUser;
    if (!userId) return;

    decoratingCards.add(card);

    try {
      card.dataset.communityRoleDecorated = '1';
      card.dataset.communityRolesV2 = '1';

      card.querySelectorAll(
        '.community-role-admin,.community-roles-admin-v2,.gc-extra-role-box'
      ).forEach(el => el.remove());

      const selected = await fetchRolesForUser(userId);
      const actions = card.querySelector('.staff-admin-actions');
      const grid = card.querySelector('.staff-permission-grid');

      if (actions) actions.insertAdjacentHTML('beforebegin', roleBoxHtml(selected));
      else if (grid) grid.insertAdjacentHTML('afterend', roleBoxHtml(selected));
      else card.insertAdjacentHTML('beforeend', roleBoxHtml(selected));

      card.dataset.gcExtrasRoleReady = '1';
    } catch (err) {
      console.error('Gymcels roles load error:', err);
    } finally {
      decoratingCards.delete(card);
    }
  }

  function scanAdminCards() {
    document.querySelectorAll('.staff-admin-card').forEach(decorateAdminCard);

    document.querySelectorAll('.staff-current-head').forEach(head => {
      const label = [...head.children].find(el => el.tagName !== 'BUTTON');
      if (label && /current moderators/i.test(label.textContent || '')) {
        label.textContent = 'Current moderators & roles';
      }
    });
  }

  document.addEventListener('change', event => {
    const input = event.target.closest('[data-gc-role]');
    if (!input) return;
    const box = input.closest('.gc-extra-role-box');
    if (box) updateRoleCount(box);
  });

  document.addEventListener('click', async event => {
    const btn = event.target.closest('.gc-extra-role-save');
    if (!btn) return;

    const card = btn.closest('.staff-admin-card');
    const box = btn.closest('.gc-extra-role-box');
    const status = box?.querySelector('.gc-extra-role-status');
    const userId = card?.dataset.staffUser;
    if (!card || !box || !userId) return;

    const roles = [...box.querySelectorAll('[data-gc-role]:checked')]
      .map(input => input.dataset.gcRole)
      .filter(Boolean);

    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const db = await dbReady();
      if (!db) throw new Error('Database connection is not ready.');

      const { error } = await db.rpc('set_member_community_roles', {
        target_user: userId,
        new_roles: roles
      });
      if (error) throw error;

      if (status) {
        status.className = 'gc-extra-role-status ok';
        status.textContent = `Saved ${roles.length} role${roles.length === 1 ? '' : 's'}.`;
      }
    } catch (err) {
      console.error('Gymcels roles save error:', err);
      if (status) {
        status.className = 'gc-extra-role-status err';
        status.textContent = String(err?.message || err);
      }
    } finally {
      btn.disabled = false;
      btn.textContent = 'Save roles';
    }
  });

  // ------------------------------------------------------------
  // CHAT REP BADGES — V3: exactly one visible badge, no flicker
  // ------------------------------------------------------------
  async function fetchRepBatch(userIds, force = false) {
    const ids = [...new Set((userIds || []).filter(Boolean))];
    const missing = force ? ids : ids.filter(id => !repCache.has(id));
    const db = await dbReady();

    if (db && missing.length) {
      const { data, error } = await db.rpc('public_member_reputations', {
        target_users: missing
      });

      if (!error) {
        (data || []).forEach(row => {
          repCache.set(row.user_id, {
            reputation: Number(row.reputation || 0),
            level: row.level || 'Newcomer'
          });
        });

        missing.forEach(id => {
          if (!repCache.has(id)) {
            repCache.set(id, { reputation:0, level:'Newcomer' });
          }
        });
      } else {
        console.error('Gymcels reputation batch error:', error);
      }
    }

    return Object.fromEntries(
      ids.map(id => [
        id,
        repCache.get(id) || { reputation:0, level:'Newcomer' }
      ])
    );
  }

  function renderOneRepBadge(parent, uid, rep) {
    if (!parent || !uid) return;

    // Keep exactly ONE badge from community-extras.
    const existing = [...parent.querySelectorAll(
      `.gc-rep-badge[data-rep-user="${CSS.escape(uid)}"]`
    )];

    let badge = existing.shift() || null;
    existing.forEach(extra => extra.remove());

    if (!badge) {
      badge = document.createElement('span');
      badge.dataset.repUser = uid;

      const time = parent.querySelector('.chat-time');
      if (time) parent.insertBefore(badge, time);
      else parent.appendChild(badge);
    }

    const value = rep || { reputation:0, level:'Newcomer' };
    const nextClass = `gc-rep-badge rep-${repLevelClass(value.level)}`;
    const nextText = `${Number(value.reputation || 0)} REP`;

    if (badge.className !== nextClass) badge.className = nextClass;
    if (badge.textContent !== nextText) badge.textContent = nextText;
    if (badge.title !== `${value.level} reputation`) {
      badge.title = `${value.level} reputation`;
    }
  }

  // Runs synchronously from already-known values. MutationObserver callbacks
  // happen before paint, so a normal chat redraw does not visibly blink.
  function decorateChatRepFromCache() {
    const buttons = [...document.querySelectorAll('.chat-user-button[data-chat-user]')];

    buttons.forEach(btn => {
      const uid = btn.dataset.chatUser;
      const parent = btn.parentElement;
      if (!uid || !parent) return;

      renderOneRepBadge(
        parent,
        uid,
        repCache.get(uid) || { reputation:0, level:'Newcomer' }
      );
    });
  }

  async function decorateChatRep(force = false) {
    const buttons = [...document.querySelectorAll('.chat-user-button[data-chat-user]')];
    if (!buttons.length) return;

    // Immediately restore badges from cache before doing any network request.
    decorateChatRepFromCache();

    const ids = buttons.map(btn => btn.dataset.chatUser).filter(Boolean);
    await fetchRepBatch(ids, force);

    buttons.forEach(btn => {
      const uid = btn.dataset.chatUser;
      const parent = btn.parentElement;
      if (!uid || !parent) return;
      renderOneRepBadge(parent, uid, repCache.get(uid));
    });
  }

  function isRepOnlyNode(node) {
    if (!(node instanceof Element)) return false;
    return node.matches('.gc-rep-badge,.member-rep-badge') ||
      (
        node.querySelectorAll &&
        node.children.length > 0 &&
        [...node.children].every(child =>
          child.matches?.('.gc-rep-badge,.member-rep-badge')
        )
      );
  }

  function hasRealChatMutation(mutations) {
    for (const mutation of mutations) {
      const changed = [
        ...mutation.addedNodes,
        ...mutation.removedNodes
      ];

      for (const node of changed) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (String(node.textContent || '').trim()) return true;
          continue;
        }

        if (node instanceof Element && !isRepOnlyNode(node)) {
          return true;
        }
      }
    }
    return false;
  }

  function connectChatObserver() {
    const node = document.getElementById('chatMessages');
    if (!node || node === observedChatNode) return;

    if (chatObserver) chatObserver.disconnect();

    observedChatNode = node;
    chatObserver = new MutationObserver(mutations => {
      // Ignore the old/new REP badge systems changing their own badge nodes.
      if (!hasRealChatMutation(mutations)) return;

      // Cache-first pass occurs synchronously, before the next paint.
      decorateChatRepFromCache();

      clearTimeout(window.__gcRepChatTimer);
      window.__gcRepChatTimer = setTimeout(() => decorateChatRep(false), 80);
    });

    chatObserver.observe(node, {
      childList:true,
      subtree:true
    });

    decorateChatRep(false);
  }

  // ------------------------------------------------------------
  // PUBLIC PROFILE REP
  // ------------------------------------------------------------
  function ensureRepPanel() {
    const profile = document.querySelector('.chat-public-profile');
    const stats = profile?.querySelector('.chat-public-stats');
    if (!profile || !stats) return null;

    document.getElementById('memberReputationPanel')?.remove();

    let panel = document.getElementById('gcReputationPanel');
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = 'gcReputationPanel';
    panel.innerHTML = `
      <div class="gc-rep-score">
        <b id="gcRepScore">0</b>
        <span>REP</span>
      </div>
      <div class="gc-rep-copy">
        <strong id="gcRepLevel">Newcomer</strong>
        <span id="gcRepNote">Positive reputation from other Gymcels members.</span>
      </div>
      <button id="gcGiveRepBtn" class="gc-rep-give" type="button">+1 Rep</button>
    `;

    stats.insertAdjacentElement('afterend', panel);

    panel.querySelector('#gcGiveRepBtn').addEventListener('click', async () => {
      const target = panel.dataset.userId;
      if (!target) return;

      const btn = panel.querySelector('#gcGiveRepBtn');
      const note = panel.querySelector('#gcRepNote');

      btn.disabled = true;
      btn.textContent = 'Giving rep...';

      try {
        const db = await dbReady();
        if (!db) throw new Error('Database connection is not ready.');

        const { error } = await db.rpc('give_member_reputation', {
          target_user: target
        });
        if (error) throw error;

        repCache.delete(target);
        await loadProfileRep(target, true);
        await fetchRepBatch([target], true);
        await decorateChatRep();
      } catch (err) {
        console.error('Gymcels give rep error:', err);
        note.textContent = String(err?.message || err);
        btn.disabled = false;
        btn.textContent = '+1 Rep';
      }
    });

    return panel;
  }

  async function getViewerId() {
    try {
      const db = await dbReady();
      if (!db) return null;
      const { data } = await db.auth.getSession();
      return data?.session?.user?.id || null;
    } catch (_) {
      return null;
    }
  }

  function formatDateTime(value) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';

    return d.toLocaleString([], {
      month:'short',
      day:'numeric',
      hour:'numeric',
      minute:'2-digit'
    });
  }

  async function loadProfileRep(userId, force = false) {
    if (!userId) return;

    const now = Date.now();

    // Stop duplicate/open-profile observers from repeatedly redrawing the card.
    if (!force) {
      if (profileRepLoadingFor === userId) return;
      if (activeProfileUserId === userId && now - lastProfileRepLoadAt < 1500) return;
    }

    profileRepLoadingFor = userId;
    activeProfileUserId = userId;
    lastProfileRepLoadAt = now;

    const panel = ensureRepPanel();
    if (!panel) {
      profileRepLoadingFor = null;
      return;
    }

    panel.dataset.userId = userId;

    const score = panel.querySelector('#gcRepScore');
    const level = panel.querySelector('#gcRepLevel');
    const note = panel.querySelector('#gcRepNote');
    const btn = panel.querySelector('#gcGiveRepBtn');

    try {
      const db = await dbReady();
      if (!db) throw new Error('Database connection is not ready.');

      const { data, error } = await db.rpc('get_public_member_reputation', {
        target_user: userId
      });
      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      const rep = Number(row?.reputation || 0);
      const repLevel = row?.level || 'Newcomer';

      repCache.set(userId, { reputation:rep, level:repLevel });

      score.textContent = String(rep);
      level.textContent = repLevel;

      const viewerId = await getViewerId();

      if (!viewerId) {
        note.textContent = 'Log in to give this member +1 reputation.';
        btn.disabled = true;
        btn.textContent = 'Log in to rep';
      } else if (viewerId === userId) {
        note.textContent = 'Reputation other members have given you.';
        btn.disabled = true;
        btn.textContent = 'Your reputation';
      } else if (row?.can_rep) {
        note.textContent = 'Helpful or active member? Give them +1 Rep.';
        btn.disabled = false;
        btn.textContent = '+1 Rep';
      } else {
        const next = formatDateTime(row?.next_rep_at);
        note.textContent = next
          ? `You already gave them rep. Available again after ${next}.`
          : 'You already gave this member reputation recently.';
        btn.disabled = true;
        btn.textContent = 'Rep given ✓';
      }
    } catch (err) {
      console.error('Gymcels profile reputation error:', err);
      score.textContent = '—';
      level.textContent = 'Reputation';
      note.textContent = `Could not load reputation: ${String(err?.message || err)}`;
      btn.disabled = true;
      btn.textContent = '+1 Rep';
    } finally {
      profileRepLoadingFor = null;
    }
  }

  // Capture the member BEFORE the original app opens the modal.
  document.addEventListener('click', event => {
    const chatUser = event.target.closest('.chat-user-button[data-chat-user]');
    if (chatUser?.dataset.chatUser) {
      activeProfileUserId = chatUser.dataset.chatUser;
      setTimeout(() => loadProfileRep(activeProfileUserId, true), 100);
      return;
    }

    const leaderboardUser = event.target.closest('[data-leaderboard-user]');
    if (leaderboardUser?.dataset.leaderboardUser) {
      activeProfileUserId = leaderboardUser.dataset.leaderboardUser;
      setTimeout(() => loadProfileRep(activeProfileUserId, true), 100);
    }
  }, true);

  // Only watch the modal's OPEN/CLOSE attributes — not its entire contents.
  function connectProfileObserver() {
    const overlay = document.getElementById('chatProfileOverlay');
    if (!overlay || overlay.dataset.gcRepObserver === '1') return;

    overlay.dataset.gcRepObserver = '1';

    new MutationObserver(() => {
      if (overlay.classList.contains('show')) {
        let uid = activeProfileUserId;

        try {
          if (!uid && typeof openedChatUserId !== 'undefined') {
            uid = openedChatUserId;
          }
        } catch (_) {}

        if (uid) setTimeout(() => loadProfileRep(uid), 100);
      } else {
        profileRepLoadingFor = null;
      }
    }).observe(overlay, {
      attributes:true,
      attributeFilter:['class','aria-hidden']
    });
  }

  // ------------------------------------------------------------
  // START
  // ------------------------------------------------------------
  installStyles();

  // Admin cards are dynamically replaced by the existing app, so a slow,
  // lightweight scan is safer than observing the entire document.
  adminScanTimer = setInterval(() => {
    scanAdminCards();
    connectChatObserver();
    connectProfileObserver();
    document.getElementById('memberReputationPanel')?.remove();
  }, 1000);

  scanAdminCards();
  connectChatObserver();
  connectProfileObserver();
  ensureRepPanel();

  console.log('[Gymcels] community-extras.js v3 loaded');
})();
