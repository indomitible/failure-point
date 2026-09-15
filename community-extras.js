// ============================================================
// GYMCELS COMMUNITY EXTRAS V4
// Stable REP + multi-role admin + profile reputation + public chat stability.
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
  // PUBLIC CHAT STABILITY V4
  // Show sent messages immediately and stop the 3-second full redraw loop.
  // ------------------------------------------------------------

  let gcChatRealtimeChannel = null;
  let gcChatRefreshTimer = null;
  let gcChatRefreshRunning = false;

  function gcEscape(text) {
    return String(text ?? '')
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function gcDisplayName(user) {
    try {
      if (typeof chatDisplayName === 'function') return chatDisplayName(user);
    } catch (_) {}
    return user?.user_metadata?.display_name ||
      (user?.email ? user.email.split('@')[0] : 'Member');
  }

  function gcInitials(name) {
    const source = String(name || 'GC').trim();
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return source.slice(0,2).toUpperCase();
  }

  function gcSetChatStatus(text, type='normal') {
    try {
      if (typeof setChatStatus === 'function') {
        setChatStatus(text, type);
        return;
      }
    } catch (_) {}
    const el = document.getElementById('chatStatus');
    if (el) el.textContent = text;
  }

  function gcAppendOptimisticMessage(row) {
    const list = document.getElementById('chatMessages');
    if (!list || !row?.id) return;

    if (list.querySelector(`[data-message-id="${CSS.escape(String(row.id))}"]`)) {
      list.scrollTop = list.scrollHeight;
      return;
    }

    if (
      list.children.length === 1 &&
      list.firstElementChild?.classList.contains('chat-empty')
    ) {
      list.innerHTML = '';
    }

    const name = row.display_name || 'Member';
    const safeName = gcEscape(name);
    const safeUser = gcEscape(row.user_id || '');
    const safeAvatar = gcEscape(row.avatar_url || '');
    const safeMessage = gcEscape(row.message || '').replace(/\n/g,'<br>');
    const when = row.created_at
      ? new Date(row.created_at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})
      : '';

    const avatar = row.avatar_url
      ? `<div class="chat-avatar" data-chat-user="${safeUser}" data-chat-name="${safeName}" data-chat-avatar="${safeAvatar}">
           <img src="${safeAvatar}" alt="${safeName} profile photo">
         </div>`
      : `<div class="chat-avatar" data-chat-user="${safeUser}" data-chat-name="${safeName}" data-chat-avatar="">
           ${gcEscape(gcInitials(name))}
         </div>`;

    const shell = document.createElement('div');
    shell.innerHTML = `
      <div class="chat-message gc-optimistic-chat-message" data-message-id="${gcEscape(row.id)}">
        <div class="chat-message-row">
          <div class="chat-avatar-wrap">
            ${avatar}
            <span class="chat-presence-dot online" title="Online"></span>
          </div>
          <div class="chat-message-body">
            <div class="chat-meta">
              <div>
                <button class="chat-user-button" type="button"
                        data-chat-user="${safeUser}"
                        data-chat-name="${safeName}"
                        data-chat-avatar="${safeAvatar}">
                  <span class="chat-user">${safeName}</span>
                </button>
                <span class="chat-time"> · ${gcEscape(when)}</span>
              </div>
              <div class="chat-message-actions">
                <button class="chat-reply-btn" type="button" data-chat-reply="${gcEscape(row.id)}">Reply</button>
                <button class="chat-delete" type="button" data-chat-delete="${gcEscape(row.id)}">Delete</button>
              </div>
            </div>
            <div class="chat-text">${safeMessage}</div>
          </div>
        </div>
      </div>
    `;

    const message = shell.firstElementChild;
    if (message) list.appendChild(message);

    list.scrollTop = list.scrollHeight;

    try { decorateChatRepFromCache(); } catch (_) {}
  }

  async function gcBackgroundCanonicalRefresh(scrollToBottom=false) {
    if (gcChatRefreshRunning) return;
    gcChatRefreshRunning = true;
    try {
      if (typeof loadCommunityChat === 'function') {
        await loadCommunityChat(scrollToBottom);
      }
    } catch (err) {
      console.error('Gymcels background chat refresh error:', err);
    } finally {
      gcChatRefreshRunning = false;
    }
  }

  function gcScheduleCanonicalRefresh(delay=500, scroll=false) {
    clearTimeout(gcChatRefreshTimer);
    gcChatRefreshTimer = setTimeout(
      () => gcBackgroundCanonicalRefresh(scroll),
      delay
    );
  }

  async function gcSafeSendCommunityMessage() {
    if (window.__gcChatSending) return;

    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const text = input?.value?.trim();
    if (!text) return;

    window.__gcChatSending = true;
    if (sendBtn) sendBtn.disabled = true;
    gcSetChatStatus('Sending...');

    try {
      const db = await dbReady();
      if (!db) throw new Error('Chat database connection is not ready.');

      let session = null;
      try {
        if (typeof getChatSession === 'function') session = await getChatSession();
      } catch (_) {}
      if (!session?.user) {
        const res = await db.auth.getSession();
        session = res?.data?.session || null;
      }
      if (!session?.user) throw new Error('You must be logged in to send messages.');

      const { data: muteData, error: muteError } = await db.rpc(
        'get_chat_mute_status',
        { target_user: session.user.id }
      );
      if (muteError) throw muteError;
      const muteStatus = Array.isArray(muteData) ? muteData[0] : muteData;
      if (muteStatus?.is_muted) throw new Error('You are currently muted from public chat.');

      let replyId = null;
      try {
        if (typeof chatReplyTarget !== 'undefined' && chatReplyTarget?.id) {
          replyId = chatReplyTarget.id;
        }
      } catch (_) {}

      const payload = {
        user_id: session.user.id,
        display_name: gcDisplayName(session.user),
        avatar_url: session.user?.user_metadata?.avatar_url || null,
        message: text,
        reply_to_id: replyId || null
      };

      const { data: inserted, error } = await db
        .from('messages')
        .insert(payload)
        .select('id,user_id,display_name,avatar_url,message,created_at,reply_to_id')
        .single();

      if (error) throw error;

      gcAppendOptimisticMessage(inserted);
      input.value = '';

      try {
        if (typeof selectedMentions !== 'undefined') selectedMentions.clear();
      } catch (_) {}
      try {
        if (typeof closeMentionSuggestions === 'function') closeMentionSuggestions();
      } catch (_) {}
      try {
        if (typeof clearChatReply === 'function') clearChatReply();
      } catch (_) {}

      input.placeholder = 'Say something to the community...';
      gcSetChatStatus('✓ MESSAGE SENT', 'success');

      // These no longer block the message appearing.
      try {
        if (typeof refreshChatLevel === 'function') {
          Promise.resolve(refreshChatLevel()).catch(err =>
            console.error('Background chat XP refresh error:', err)
          );
        }
      } catch (_) {}

      try {
        if (
          typeof activeMentionUserIds === 'function' &&
          inserted?.id
        ) {
          const ids = activeMentionUserIds(text);
          if (ids?.length) {
            db.rpc('create_mention_notifications', {
              target_user_ids: ids,
              target_message_id: Number(inserted.id),
              mention_preview: text.slice(0,160)
            }).then(({error}) => {
              if (error) console.error('Mention notification error:', error);
            });
          }
        }
      } catch (_) {}

      gcScheduleCanonicalRefresh(700, true);

      setTimeout(() => {
        const status = document.getElementById('chatStatus');
        if (status?.textContent === '✓ MESSAGE SENT') status.textContent = '';
      }, 3000);

    } catch (err) {
      gcSetChatStatus('Send failed: ' + (err?.message || String(err)), 'error');
      console.error('Gymcels stable chat send error:', err);
    } finally {
      window.__gcChatSending = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function installStableChatSend() {
    try {
      if (typeof sendCommunityMessage === 'function') {
        sendCommunityMessage = gcSafeSendCommunityMessage;
      }
    } catch (err) {
      console.error('Could not install stable Gymcels chat sender:', err);
    }
  }

  function installStableChatStart() {
    try {
      if (typeof startCommunityChat !== 'function') return;

      startCommunityChat = function() {
        try {
          if (typeof startPresenceHeartbeat === 'function') startPresenceHeartbeat();
        } catch (_) {}

        try {
          if (typeof loadFriendsSection === 'function') {
            Promise.resolve(loadFriendsSection()).catch(() => {});
          }
        } catch (_) {}

        try {
          if (typeof chatPollTimer !== 'undefined') {
            clearInterval(chatPollTimer);
            chatPollTimer = null;
          }
        } catch (_) {}

        try {
          if (typeof refreshChatLevel === 'function') {
            Promise.resolve(refreshChatLevel()).catch(() => {});
          }
        } catch (_) {}

        gcBackgroundCanonicalRefresh(true);

        try {
          if (typeof chatPollTimer !== 'undefined') {
            chatPollTimer = setInterval(() => {
              if (document.visibilityState === 'visible') {
                gcBackgroundCanonicalRefresh(false);
              }
            }, 15000);
          }
        } catch (_) {}
      };
    } catch (err) {
      console.error('Could not install stable Gymcels chat startup:', err);
    }
  }

  async function installChatRealtime() {
    try {
      const db = await dbReady();
      if (!db || gcChatRealtimeChannel) return;

      gcChatRealtimeChannel = db
        .channel('gymcels-public-chat-ui-v4')
        .on(
          'postgres_changes',
          { event:'*', schema:'public', table:'messages' },
          () => gcScheduleCanonicalRefresh(250, false)
        )
        .subscribe();
    } catch (err) {
      console.error('Gymcels chat realtime setup error:', err);
    }
  }

  function forceSlowFallbackPollNow() {
    try {
      if (typeof chatPollTimer === 'undefined') return;
      clearInterval(chatPollTimer);
      chatPollTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
          gcBackgroundCanonicalRefresh(false);
        }
      }, 15000);
    } catch (_) {}
  }

  installStableChatSend();
  installStableChatStart();
  installChatRealtime();
  setTimeout(forceSlowFallbackPollNow, 1500);

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

  console.log('[Gymcels] community-extras.js v4 loaded');
})();
// ============================================================
// GYMCELS THREADS MOBILE REFRESH FIX V1
// Paste this at the VERY BOTTOM of community-extras.js.
// ============================================================
(() => {
  'use strict';

  if (window.__gymcelsThreadsMobileRefreshV1) return;
  window.__gymcelsThreadsMobileRefreshV1 = true;

  let refreshTimer = null;
  let refreshRunning = false;
  let realtimeChannel = null;

  function threadsVisible() {
    return (
      document.body?.dataset?.appScreen === 'threads' ||
      location.hash === '#threads'
    );
  }

  async function refreshThreadsNow({refreshOpenThread = true} = {}) {
    if (refreshRunning) return;
    if (typeof loadThreads !== 'function') return;

    refreshRunning = true;

    try {
      await loadThreads();

      if (
        refreshOpenThread &&
        typeof activeThread !== 'undefined' &&
        activeThread?.id &&
        typeof loadThreadReplies === 'function'
      ) {
        await loadThreadReplies(activeThread.id);
      }
    } catch (err) {
      console.error('[Gymcels] Threads refresh error:', err);
    } finally {
      refreshRunning = false;
    }
  }

  function scheduleThreadsRefresh(delay = 80, options = {}) {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(
      () => refreshThreadsNow(options),
      delay
    );
  }

  document.addEventListener('click', event => {
    const target = event.target.closest(
      '#navThreads,' +
      '[data-app-route="threads"],' +
      '[data-mobile-proxy="navThreads"],' +
      '#mobileThreadsBtn'
    );

    if (!target) return;

    scheduleThreadsRefresh(120);
  }, true);

  window.addEventListener('hashchange', () => {
    if (threadsVisible()) scheduleThreadsRefresh(80);
  });

  window.addEventListener('popstate', () => {
    if (threadsVisible()) scheduleThreadsRefresh(80);
  });

  document.addEventListener('visibilitychange', () => {
    if (
      document.visibilityState === 'visible' &&
      threadsVisible()
    ) {
      scheduleThreadsRefresh(40);
    }
  });

  window.addEventListener('pageshow', () => {
    if (threadsVisible()) scheduleThreadsRefresh(60);
  });

  window.addEventListener('focus', () => {
    if (threadsVisible()) scheduleThreadsRefresh(80);
  });

  async function installThreadsRealtime() {
    if (realtimeChannel || !window.gymcelsLolDb) return;

    try {
      realtimeChannel = window.gymcelsLolDb
        .channel('gymcels-threads-ui-refresh-v1')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'forum_threads' },
          () => {
            if (threadsVisible()) {
              scheduleThreadsRefresh(120, {refreshOpenThread:false});
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'forum_replies' },
          () => {
            if (threadsVisible()) {
              scheduleThreadsRefresh(120, {refreshOpenThread:true});
            }
          }
        )
        .subscribe(status => {
          if (status === 'CHANNEL_ERROR') {
            console.warn('[Gymcels] Threads realtime unavailable; click/visibility refresh remains active.');
          }
        });
    } catch (err) {
      console.warn('[Gymcels] Threads realtime setup skipped:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      installThreadsRealtime();
      if (threadsVisible()) scheduleThreadsRefresh(100);
    }, { once:true });
  } else {
    installThreadsRealtime();
    if (threadsVisible()) scheduleThreadsRefresh(100);
  }

  console.log('[Gymcels] Threads mobile refresh fix loaded');
})();
// ============================================================
// GYMCELS ADMIN UI CLEANUP V1
// Separates Moderator Permissions from Community Roles and
// collapses long lists into dropdown sections.
// Paste at the VERY BOTTOM of community-extras.js.
// ============================================================
(() => {
  'use strict';

  if (window.__gymcelsAdminUiCleanupV1) return;
  window.__gymcelsAdminUiCleanupV1 = true;

  const ROLE_OPTIONS = [
    ['promoter', 'Promoter 📣'],
    ['founding_member', 'Founding Member ⭐'],
    ['contributor', 'Contributor 🛠️'],
    ['content_creator', 'Content Creator 🎥'],
    ['event_host', 'Event Host 🎙️'],
    ['helper', 'Helper 🤝']
  ];

  let built = false;
  let roleEditorUser = null;
  let roleHolderRows = [];
  let syncTimer = null;

  function esc(value='') {
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function installAdminStyles(){
    if(document.getElementById('gcAdminCleanupStyles')) return;

    const style=document.createElement('style');
    style.id='gcAdminCleanupStyles';
    style.textContent=`
      #staffAdminPanel.gc-admin-cleanup-ready > .staff-admin-head{
        margin-bottom:12px;
      }

      .gc-admin-accordion{
        margin-top:10px;
        border:1px solid #2a3139;
        border-radius:13px;
        background:#0d1116;
        overflow:hidden;
      }

      .gc-admin-accordion > summary{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        min-height:54px;
        padding:13px 15px;
        cursor:pointer;
        list-style:none;
        user-select:none;
        background:#10151b;
      }

      .gc-admin-accordion > summary::-webkit-details-marker{display:none}

      .gc-admin-summary-main{
        display:flex;
        align-items:center;
        gap:10px;
        min-width:0;
      }

      .gc-admin-summary-icon{
        width:29px;
        height:29px;
        flex:0 0 29px;
        display:grid;
        place-items:center;
        border:1px solid #303844;
        border-radius:9px;
        background:#0a0e12;
        font-size:13px;
      }

      .gc-admin-summary-copy strong{
        display:block;
        color:#fff;
        font-size:12px;
        font-weight:950;
      }

      .gc-admin-summary-copy small{
        display:block;
        margin-top:2px;
        color:#7f8995;
        font-size:8px;
        line-height:1.35;
      }

      .gc-admin-summary-right{
        display:flex;
        align-items:center;
        gap:8px;
        flex:0 0 auto;
      }

      .gc-admin-count{
        min-width:24px;
        padding:4px 8px;
        border:1px solid #343d48;
        border-radius:999px;
        background:#090d11;
        color:#aab3bf;
        text-align:center;
        font-size:8px;
        font-weight:950;
      }

      .gc-admin-chevron{
        color:#818b97;
        font-size:13px;
        transition:transform .16s ease;
      }

      .gc-admin-accordion[open] > summary .gc-admin-chevron{transform:rotate(180deg)}

      .gc-admin-accordion-body{
        padding:13px;
        border-top:1px solid #242b33;
      }

      /* Community-role controls no longer appear inside moderator cards. */
      #gcModeratorManager .gc-extra-role-box,
      #gcModeratorManager .community-role-admin,
      #gcModeratorManager .community-roles-admin-v2{
        display:none!important;
      }

      /* Old Current Moderators label is replaced by our compact dropdown title. */
      #gcCurrentModeratorsBox .staff-current-head strong{display:none!important}
      #gcCurrentModeratorsBox .staff-current-head{
        justify-content:flex-end;
        margin:0 0 8px;
        padding:0;
        border:0;
      }

      .gc-admin-subdetails{
        margin-top:12px;
        border:1px solid #252d36;
        border-radius:10px;
        background:#0a0e12;
        overflow:hidden;
      }

      .gc-admin-subdetails > summary{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        list-style:none;
        cursor:pointer;
        padding:11px 12px;
        color:#dce2e9;
        font-size:9px;
        font-weight:950;
      }

      .gc-admin-subdetails > summary::-webkit-details-marker{display:none}
      .gc-admin-subdetails-body{padding:0 10px 10px}

      #gcCurrentModeratorsListWrap #staffMembersList,
      #gcRoleHoldersList{
        max-height:330px;
        overflow:auto;
        padding-right:3px;
      }

      .gc-role-search{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:8px;
      }

      .gc-role-search input{
        min-width:0;
        width:100%;
        box-sizing:border-box;
        border:1px solid #303844;
        border-radius:10px;
        background:#0a0e12;
        color:#fff;
        padding:11px 12px;
        outline:none;
        font:inherit;
        font-size:10px;
      }

      .gc-role-search input:focus{border-color:#ef4355}

      .gc-role-search button,
      .gc-role-save-btn,
      .gc-role-manage-btn{
        border:0;
        border-radius:9px;
        background:#ef4355;
        color:#fff;
        padding:10px 13px;
        font-size:9px;
        font-weight:950;
        cursor:pointer;
      }

      .gc-role-search button:disabled,
      .gc-role-save-btn:disabled{opacity:.55;cursor:not-allowed}

      #gcRoleSearchResults{
        margin-top:8px;
      }

      .gc-role-search-row,
      .gc-role-holder-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        padding:9px 10px;
        border:1px solid #252d36;
        border-radius:9px;
        background:#10151a;
        margin-top:6px;
      }

      .gc-role-person{
        min-width:0;
      }

      .gc-role-person strong{
        display:block;
        color:#fff;
        font-size:10px;
        font-weight:950;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .gc-role-person small{
        display:block;
        margin-top:2px;
        color:#7f8995;
        font-size:8px;
      }

      .gc-role-manage-btn{
        flex:0 0 auto;
        background:#1c232b;
        border:1px solid #323b46;
        padding:7px 10px;
      }

      .gc-role-editor{
        margin-top:10px;
        padding:12px;
        border:1px solid #2b343e;
        border-radius:11px;
        background:#0a0e12;
      }

      .gc-role-editor-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        margin-bottom:10px;
      }

      .gc-role-editor-head strong{
        display:block;
        color:#fff;
        font-size:11px;
        font-weight:950;
      }

      .gc-role-editor-head small{
        display:block;
        margin-top:2px;
        color:#7e8894;
        font-size:8px;
      }

      .gc-role-grid{
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:7px;
      }

      .gc-role-option{
        display:flex;
        align-items:center;
        gap:8px;
        min-width:0;
        padding:9px 10px;
        border:1px solid #29313a;
        border-radius:9px;
        background:#10151a;
        color:#dfe5eb;
        cursor:pointer;
      }

      .gc-role-option:has(input:checked){
        border-color:rgba(239,67,85,.58);
        background:rgba(239,67,85,.08);
      }

      .gc-role-option input{margin:0;accent-color:#ef4355}
      .gc-role-option span{
        min-width:0;
        font-size:9px;
        font-weight:900;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .gc-role-editor-actions{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        margin-top:10px;
      }

      #gcRoleStatus{
        min-height:12px;
        color:#7f8995;
        font-size:8px;
        font-weight:800;
      }
      #gcRoleStatus.ok{color:#70dea0}
      #gcRoleStatus.err{color:#ff8998}

      .gc-role-badges{
        display:flex;
        flex-wrap:wrap;
        gap:4px;
        margin-top:4px;
      }

      .gc-role-mini-badge{
        display:inline-flex;
        align-items:center;
        padding:2px 5px;
        border:1px solid #343d47;
        border-radius:999px;
        color:#b7c0ca;
        background:#0a0e12;
        font-size:7px;
        font-weight:900;
      }

      @media(max-width:700px){
        .gc-role-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .gc-admin-accordion > summary{padding:12px}
        .gc-admin-accordion-body{padding:10px}
      }

      @media(max-width:430px){
        .gc-role-grid{grid-template-columns:1fr}
        .gc-role-search{grid-template-columns:1fr}
        .gc-role-search button{width:100%}
        .gc-admin-summary-copy small{display:none}
      }
    `;
    document.head.appendChild(style);
  }

  function accordionSummary(icon,title,sub,countId){
    return `
      <span class="gc-admin-summary-main">
        <span class="gc-admin-summary-icon">${icon}</span>
        <span class="gc-admin-summary-copy">
          <strong>${title}</strong>
          <small>${sub}</small>
        </span>
      </span>
      <span class="gc-admin-summary-right">
        <span class="gc-admin-count" id="${countId}">0</span>
        <span class="gc-admin-chevron">⌄</span>
      </span>`;
  }

  function buildAdminLayout(){
    if(built) return true;

    const panel=document.getElementById('staffAdminPanel');
    const search=document.querySelector('#staffAdminPanel > .staff-admin-search');
    const searchResults=document.getElementById('staffSearchResults');
    const divider=document.querySelector('#staffAdminPanel > .staff-admin-divider');
    const currentHead=document.querySelector('#staffAdminPanel > .staff-current-head');
    const currentList=document.getElementById('staffMembersList');
    const status=document.getElementById('staffPanelStatus');

    if(!panel || !search || !searchResults || !currentHead || !currentList || !status) return false;

    installAdminStyles();
    panel.classList.add('gc-admin-cleanup-ready');

    const mod=document.createElement('details');
    mod.id='gcModeratorManager';
    mod.className='gc-admin-accordion';
    mod.open=true;
    mod.innerHTML=`
      <summary>${accordionSummary('🛡️','Moderator Permissions','Only people with real moderation powers appear here.','gcModeratorCount')}</summary>
      <div class="gc-admin-accordion-body" id="gcModeratorBody"></div>`;

    const modBody=mod.querySelector('#gcModeratorBody');

    const currentDetails=document.createElement('details');
    currentDetails.id='gcCurrentModeratorsBox';
    currentDetails.className='gc-admin-subdetails';
    currentDetails.innerHTML=`
      <summary>
        <span>Current Moderators</span>
        <span class="gc-admin-chevron">⌄</span>
      </summary>
      <div class="gc-admin-subdetails-body" id="gcCurrentModeratorsListWrap"></div>`;

    const currentWrap=currentDetails.querySelector('#gcCurrentModeratorsListWrap');

    modBody.appendChild(search);
    modBody.appendChild(searchResults);
    if(divider) divider.remove();
    currentWrap.appendChild(currentHead);
    currentWrap.appendChild(currentList);
    modBody.appendChild(currentDetails);
    modBody.appendChild(status);

    const roles=document.createElement('details');
    roles.id='gcCommunityRolesManager';
    roles.className='gc-admin-accordion';
    roles.innerHTML=`
      <summary>${accordionSummary('🏷️','Community Roles','Promoter, Helper, Contributor and other profile/chat badges.','gcRoleHolderCount')}</summary>
      <div class="gc-admin-accordion-body">
        <div class="gc-role-search">
          <input id="gcRoleSearchInput" type="search" maxlength="40" autocomplete="off" placeholder="Search username to manage roles...">
          <button id="gcRoleSearchBtn" type="button">Search</button>
        </div>
        <div id="gcRoleSearchResults"></div>
        <div id="gcRoleEditorMount"></div>

        <details class="gc-admin-subdetails" id="gcRoleHoldersDetails">
          <summary>
            <span>Role Holders</span>
            <span class="gc-admin-chevron">⌄</span>
          </summary>
          <div class="gc-admin-subdetails-body">
            <div id="gcRoleHoldersList"><div class="staff-admin-empty">Loading role holders...</div></div>
          </div>
        </details>
      </div>`;

    // Keep the original owner header at top, then the two compact dropdown managers.
    const head=panel.querySelector(':scope > .staff-admin-head');
    if(head){
      head.insertAdjacentElement('afterend',roles);
      head.insertAdjacentElement('afterend',mod);
    }else{
      panel.prepend(roles);
      panel.prepend(mod);
    }

    built=true;
    bindRoleManager();
    watchModeratorList();
    loadRoleHolders();
    syncModeratorList();
    return true;
  }

  function isModeratorCard(card){
    if(!card) return false;

    if(card.querySelector('.staff-badge.admin,.staff-badge.moderator')) return true;

    const checks=[...card.querySelectorAll('[data-staff-permission]')];
    return checks.some(input => input.checked);
  }

  function syncModeratorList(){
    if(!built) return;

    const list=document.getElementById('staffMembersList');
    if(!list) return;

    let count=0;
    list.querySelectorAll('.staff-admin-card').forEach(card => {
      const moderator=isModeratorCard(card);
      card.style.display=moderator ? '' : 'none';
      if(moderator) count++;
    });

    const countEl=document.getElementById('gcModeratorCount');
    if(countEl) countEl.textContent=String(count);

    const empty=list.querySelector('.staff-admin-empty');
    if(empty && list.querySelectorAll('.staff-admin-card').length){
      empty.style.display=count ? 'none' : '';
      if(!count) empty.textContent='No moderators yet.';
    }
  }

  function watchModeratorList(){
    const list=document.getElementById('staffMembersList');
    const search=document.getElementById('staffSearchResults');

    if(list && !list.dataset.gcAdminCleanupWatch){
      list.dataset.gcAdminCleanupWatch='1';
      new MutationObserver(() => {
        clearTimeout(syncTimer);
        syncTimer=setTimeout(syncModeratorList,30);
      }).observe(list,{childList:true,subtree:true});
    }

    if(search && !search.dataset.gcAdminCleanupWatch){
      search.dataset.gcAdminCleanupWatch='1';
      new MutationObserver(() => {
        // Existing community-extras may re-inject old role controls; CSS keeps them hidden.
        clearTimeout(syncTimer);
        syncTimer=setTimeout(syncModeratorList,30);
      }).observe(search,{childList:true,subtree:true});
    }
  }

  async function getRolesForUsers(ids){
    const unique=[...new Set((ids || []).filter(Boolean))];
    if(!unique.length || !window.gymcelsLolDb) return {};

    const {data,error}=await window.gymcelsLolDb.rpc(
      'admin_get_member_community_roles',
      {target_users:unique}
    );
    if(error) throw error;

    const map={};
    unique.forEach(id => map[id]=[]);
    (data || []).forEach(row => {
      if(!map[row.user_id]) map[row.user_id]=[];
      if(row.role && !map[row.user_id].includes(row.role)) map[row.user_id].push(row.role);
    });
    return map;
  }

  function roleLabel(role){
    return ROLE_OPTIONS.find(([value]) => value===role)?.[1] || role;
  }

  function roleBadgesHtml(roles){
    return `<div class="gc-role-badges">${(roles || []).map(role =>
      `<span class="gc-role-mini-badge">${esc(roleLabel(role))}</span>`
    ).join('')}</div>`;
  }

  async function searchRoleMembers(){
    const input=document.getElementById('gcRoleSearchInput');
    const results=document.getElementById('gcRoleSearchResults');
    const btn=document.getElementById('gcRoleSearchBtn');
    const query=String(input?.value || '').trim();

    if(!query){
      if(results) results.innerHTML='<div class="staff-admin-empty">Type a username first.</div>';
      return;
    }

    btn.disabled=true;
    if(results) results.innerHTML='<div class="staff-admin-empty">Searching...</div>';

    try{
      const {data,error}=await window.gymcelsLolDb.rpc(
        'admin_search_staff_members',
        {search_text:query}
      );
      if(error) throw error;

      const rows=data || [];
      const roleMap=await getRolesForUsers(rows.map(row => row.user_id));

      if(!rows.length){
        results.innerHTML='<div class="staff-admin-empty">No member found with that username.</div>';
        return;
      }

      results.innerHTML=rows.map(row => `
        <div class="gc-role-search-row" data-gc-role-search-user="${esc(row.user_id || '')}">
          <div class="gc-role-person">
            <strong>${esc(row.display_name || 'Member')}</strong>
            <small>${(roleMap[row.user_id] || []).length ? 'Current community roles' : 'No community roles yet'}</small>
            ${roleBadgesHtml(roleMap[row.user_id] || [])}
          </div>
          <button class="gc-role-manage-btn" type="button" data-gc-manage-role-user="${esc(row.user_id || '')}" data-gc-manage-role-name="${esc(row.display_name || 'Member')}">Manage</button>
        </div>`).join('');
    }catch(err){
      console.error('[Gymcels] role search error:',err);
      if(results) results.innerHTML=`<div class="staff-admin-empty">Search failed: ${esc(err?.message || String(err))}</div>`;
    }finally{
      btn.disabled=false;
    }
  }

  async function openRoleEditor(userId,name){
    const mount=document.getElementById('gcRoleEditorMount');
    if(!mount || !userId) return;

    mount.innerHTML='<div class="staff-admin-empty">Loading roles...</div>';

    try{
      const roleMap=await getRolesForUsers([userId]);
      const selected=new Set(roleMap[userId] || []);
      roleEditorUser={userId,name:name || 'Member'};

      mount.innerHTML=`
        <div class="gc-role-editor">
          <div class="gc-role-editor-head">
            <div>
              <strong>${esc(roleEditorUser.name)}</strong>
              <small>Choose any combination of community badges.</small>
            </div>
            <span class="gc-admin-count" id="gcRoleEditorCount">${selected.size}</span>
          </div>

          <div class="gc-role-grid">
            ${ROLE_OPTIONS.map(([value,label]) => `
              <label class="gc-role-option">
                <input type="checkbox" data-gc-clean-role="${value}" ${selected.has(value) ? 'checked' : ''}>
                <span>${esc(label)}</span>
              </label>`).join('')}
          </div>

          <div class="gc-role-editor-actions">
            <span id="gcRoleStatus"></span>
            <button id="gcRoleSaveBtn" class="gc-role-save-btn" type="button">Save roles</button>
          </div>
        </div>`;

      mount.scrollIntoView({behavior:'smooth',block:'nearest'});
    }catch(err){
      console.error('[Gymcels] role editor error:',err);
      mount.innerHTML=`<div class="staff-admin-empty">Could not load roles: ${esc(err?.message || String(err))}</div>`;
    }
  }

  async function saveRoleEditor(){
    if(!roleEditorUser || !window.gymcelsLolDb) return;

    const btn=document.getElementById('gcRoleSaveBtn');
    const status=document.getElementById('gcRoleStatus');
    const roles=[...document.querySelectorAll('[data-gc-clean-role]:checked')]
      .map(input => input.dataset.gcCleanRole)
      .filter(Boolean);

    btn.disabled=true;
    btn.textContent='Saving...';
    if(status){status.className='';status.textContent='Saving roles...';}

    try{
      const {error}=await window.gymcelsLolDb.rpc(
        'set_member_community_roles',
        {target_user:roleEditorUser.userId,new_roles:roles}
      );
      if(error) throw error;

      if(status){
        status.className='ok';
        status.textContent=roles.length
          ? `Saved ${roles.length} role${roles.length===1?'':'s'}.`
          : 'All community roles removed.';
      }

      await loadRoleHolders();

      // Refresh public badge surfaces without changing moderation permissions.
      try{ if(typeof loadCommunityChat==='function') await loadCommunityChat(false); }catch(_){}
      try{ if(typeof loadThreads==='function') await loadThreads(); }catch(_){}

      // Refresh the role search row too if a query is still present.
      if(document.getElementById('gcRoleSearchInput')?.value.trim()){
        await searchRoleMembers();
      }
    }catch(err){
      console.error('[Gymcels] save community roles error:',err);
      if(status){status.className='err';status.textContent=err?.message || String(err);}
    }finally{
      btn.disabled=false;
      btn.textContent='Save roles';
    }
  }

  async function loadRoleHolders(){
    const list=document.getElementById('gcRoleHoldersList');
    const count=document.getElementById('gcRoleHolderCount');
    if(!list || !window.gymcelsLolDb) return;

    list.innerHTML='<div class="staff-admin-empty">Loading role holders...</div>';

    try{
      const {data,error}=await window.gymcelsLolDb.rpc('admin_list_staff_members');
      if(error) throw error;

      const rows=data || [];
      const roleMap=await getRolesForUsers(rows.map(row => row.user_id));

      roleHolderRows=rows
        .map(row => ({...row,community_roles:roleMap[row.user_id] || []}))
        .filter(row => row.community_roles.length > 0)
        .sort((a,b) => String(a.display_name || '').localeCompare(String(b.display_name || '')));

      if(count) count.textContent=String(roleHolderRows.length);

      if(!roleHolderRows.length){
        list.innerHTML='<div class="staff-admin-empty">No community role holders yet.</div>';
        return;
      }

      list.innerHTML=roleHolderRows.map(row => `
        <div class="gc-role-holder-row">
          <div class="gc-role-person">
            <strong>${esc(row.display_name || 'Member')}</strong>
            ${roleBadgesHtml(row.community_roles)}
          </div>
          <button class="gc-role-manage-btn" type="button" data-gc-manage-role-user="${esc(row.user_id || '')}" data-gc-manage-role-name="${esc(row.display_name || 'Member')}">Manage</button>
        </div>`).join('');
    }catch(err){
      console.error('[Gymcels] load role holders error:',err);
      list.innerHTML=`<div class="staff-admin-empty">Could not load role holders: ${esc(err?.message || String(err))}</div>`;
    }
  }

  function updateRoleEditorCount(){
    const count=document.getElementById('gcRoleEditorCount');
    if(count){
      count.textContent=String(document.querySelectorAll('[data-gc-clean-role]:checked').length);
    }
  }

  function bindRoleManager(){
    const searchBtn=document.getElementById('gcRoleSearchBtn');
    const searchInput=document.getElementById('gcRoleSearchInput');

    searchBtn?.addEventListener('click',searchRoleMembers);
    searchInput?.addEventListener('keydown',event => {
      if(event.key==='Enter'){
        event.preventDefault();
        searchRoleMembers();
      }
    });

    document.addEventListener('click',event => {
      const manage=event.target.closest('[data-gc-manage-role-user]');
      if(manage){
        const rolesBox=document.getElementById('gcCommunityRolesManager');
        if(rolesBox) rolesBox.open=true;
        openRoleEditor(manage.dataset.gcManageRoleUser,manage.dataset.gcManageRoleName || 'Member');
        return;
      }

      if(event.target.closest('#gcRoleSaveBtn')) saveRoleEditor();
    });

    document.addEventListener('change',event => {
      if(event.target.matches('[data-gc-clean-role]')) updateRoleEditorCount();
    });

    document.getElementById('staffRefreshBtn')?.addEventListener('click',() => {
      setTimeout(() => {
        syncModeratorList();
        loadRoleHolders();
      },250);
    });
  }

  function boot(){
    if(buildAdminLayout()) return;

    // The admin panel is injected/initialized after auth; retry without touching other UI.
    let tries=0;
    const timer=setInterval(() => {
      tries++;
      if(buildAdminLayout() || tries>40) clearInterval(timer);
    },250);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }

  console.log('[Gymcels] compact moderator/community-role manager loaded');
})();
// ============================================================
// GYMCELS STORE + CREDITS + DAILY STREAK UI V2
// MANUAL CLAIM VERSION
//
// IMPORTANT:
// Replace the old V1 Store block with this V2 block.
// Do NOT keep V1 and V2 together.
//
// Changes:
//   • Daily reward is NOT auto-claimed anymore.
//   • If today's reward is unclaimed, Store becomes the first screen shown.
//   • Big "Claim today's reward" button.
//   • After claiming, balance/streak/reward track updates immediately.
//   • Store URL changes to #store.
//   • Already-claimed users are not forced into Store again that day.
//   • Daily workout streak UI remains enabled.
// ============================================================
(() => {
  'use strict';

  if (window.__gymcelsStoreCreditsV2) return;
  window.__gymcelsStoreCreditsV2 = true;

  const REWARDS = [
    {day:1, credits:100,  icon:'🪙', label:'100 Credits'},
    {day:2, credits:250,  icon:'🪙', label:'250 Credits'},
    {day:3, credits:400,  icon:'🪙', label:'400 Credits'},
    {day:4, credits:500,  icon:'🪙', label:'500 Credits'},
    {day:5, credits:700,  icon:'🪙', label:'700 Credits'},
    {day:6, credits:1000, icon:'🪙', label:'1,000 Credits'},
    {day:7, credits:0,    icon:'🎡', label:'Wheel Spin'}
  ];

  let creditState = null;
  let currentSession = null;
  let claimRunning = false;
  let authBooted = false;
  let forcedRewardScreenForSession = false;

  const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));

  async function getDb(){
    for(let i=0;i<40;i++){
      if(window.gymcelsLolDb) return window.gymcelsLolDb;
      await sleep(100);
    }
    return null;
  }

  function esc(value=''){
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function fmt(number){
    return Number(number || 0).toLocaleString();
  }

  // ============================================================
  // STORE UI
  // ============================================================

  function installStoreStyles(){
    if(document.getElementById('gcStoreStylesV2')) return;

    // Remove V1 styles if they somehow remained after editing.
    document.getElementById('gcStoreStyles')?.remove();

    const style=document.createElement('style');
    style.id='gcStoreStylesV2';
    style.textContent=`
      #gymcelStoreSection{display:none}
      body.gym-app-mode[data-app-screen="store"] #gymcelStoreSection{display:block!important}
      body.gym-app-mode[data-app-screen="store"] main > *:not(#gymcelStoreSection){display:none!important}

      .gc-store-shell{
        min-height:calc(100vh - 67px);
        padding:30px 0 80px;
      }

      .gc-store-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:16px;
        margin-bottom:16px;
      }

      .gc-store-kicker{
        color:#ef4355;
        font-size:9px;
        font-weight:1000;
        letter-spacing:.16em;
        text-transform:uppercase;
      }

      .gc-store-head h1{
        margin:5px 0 5px;
        color:#fff;
        font-size:34px;
        line-height:1;
        letter-spacing:-.04em;
      }

      .gc-store-head p{
        margin:0;
        color:#858f9b;
        font-size:11px;
      }

      .gc-credit-balance-card{
        flex:0 0 auto;
        min-width:190px;
        padding:13px 15px;
        border:1px solid rgba(245,190,56,.34);
        border-radius:13px;
        background:
          radial-gradient(circle at 100% 0,rgba(245,190,56,.12),transparent 48%),
          #0d1116;
      }

      .gc-credit-balance-card span{
        display:block;
        color:#9a8653;
        font-size:8px;
        font-weight:950;
        letter-spacing:.09em;
        text-transform:uppercase;
      }

      .gc-credit-balance-card strong{
        display:flex;
        align-items:center;
        gap:7px;
        margin-top:4px;
        color:#fff1b8;
        font-size:24px;
        font-weight:1000;
      }

      .gc-store-grid{
        display:grid;
        grid-template-columns:minmax(0,1.5fr) minmax(260px,.65fr);
        gap:14px;
      }

      .gc-store-card{
        border:1px solid #29313a;
        border-radius:14px;
        background:linear-gradient(180deg,#10151a,#0b0f13);
        padding:16px;
      }

      .gc-store-card-title{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
      }

      .gc-store-card-title strong{
        display:block;
        color:#fff;
        font-size:15px;
        font-weight:1000;
      }

      .gc-store-card-title p{
        margin:4px 0 0;
        color:#7f8995;
        font-size:9px;
        line-height:1.45;
      }

      .gc-login-streak-pill{
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        gap:5px;
        padding:6px 9px;
        border:1px solid rgba(239,67,85,.35);
        border-radius:999px;
        background:rgba(239,67,85,.07);
        color:#ff8794;
        font-size:9px;
        font-weight:1000;
      }

      .gc-reward-track{
        display:grid;
        grid-template-columns:repeat(7,minmax(0,1fr));
        gap:7px;
        margin-top:14px;
      }

      .gc-reward-day{
        position:relative;
        min-width:0;
        min-height:104px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        padding:9px 5px;
        border:1px solid #29313a;
        border-radius:10px;
        background:#0b1015;
      }

      .gc-reward-day small{
        color:#727d89;
        font-size:7px;
        font-weight:950;
        text-transform:uppercase;
        letter-spacing:.05em;
      }

      .gc-reward-icon{
        display:block;
        margin:8px 0 5px;
        font-size:19px;
      }

      .gc-reward-day b{
        color:#dce2e8;
        font-size:8px;
        line-height:1.25;
      }

      .gc-reward-day.done{
        border-color:rgba(93,199,123,.35);
        background:rgba(62,161,91,.08);
      }

      .gc-reward-day.current{
        border-color:#ef4355;
        box-shadow:inset 0 0 0 1px rgba(239,67,85,.13);
        background:rgba(239,67,85,.08);
      }

      .gc-reward-day.wheel{
        border-color:rgba(174,118,255,.28);
        background:rgba(139,78,225,.06);
      }

      .gc-reward-check{
        position:absolute;
        top:6px;
        right:7px;
        color:#72dc97;
        font-size:9px;
        font-weight:1000;
      }

      .gc-claim-zone{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-top:13px;
        padding:12px;
        border:1px solid #2b343e;
        border-radius:11px;
        background:#090d11;
      }

      .gc-claim-copy strong{
        display:block;
        color:#fff;
        font-size:10px;
        font-weight:1000;
      }

      .gc-claim-copy span{
        display:block;
        margin-top:3px;
        color:#7c8793;
        font-size:8px;
      }

      #gcClaimDailyRewardBtn{
        flex:0 0 auto;
        min-width:170px;
        border:0;
        border-radius:10px;
        background:linear-gradient(180deg,#f34b5d,#df3549);
        color:#fff;
        padding:12px 15px;
        font:inherit;
        font-size:10px;
        font-weight:1000;
        cursor:pointer;
        box-shadow:0 8px 24px rgba(239,67,85,.16);
      }

      #gcClaimDailyRewardBtn:hover{filter:brightness(1.06)}
      #gcClaimDailyRewardBtn:disabled{
        cursor:not-allowed;
        background:#1a2129;
        color:#707b87;
        box-shadow:none;
      }

      #gcDailyRewardStatus{
        min-height:16px;
        margin-top:10px;
        color:#87919d;
        font-size:9px;
        font-weight:850;
      }

      #gcDailyRewardStatus.success{color:#72dc97}
      #gcDailyRewardStatus.reward{color:#ffd36b}
      #gcDailyRewardStatus.error{color:#ff8998}

      .gc-store-note{
        margin-top:10px;
        color:#626d79;
        font-size:8px;
        line-height:1.45;
      }

      .gc-coming-icon{
        width:46px;
        height:46px;
        display:grid;
        place-items:center;
        border:1px solid #303945;
        border-radius:12px;
        background:#0a0e12;
        font-size:22px;
        margin-bottom:12px;
      }

      .gc-coming-list{
        display:grid;
        gap:8px;
        margin-top:14px;
      }

      .gc-coming-row{
        padding:10px;
        border:1px solid #262e37;
        border-radius:9px;
        background:#0b1015;
      }

      .gc-coming-row strong{
        display:block;
        color:#dce2e8;
        font-size:9px;
      }

      .gc-coming-row span{
        display:block;
        margin-top:3px;
        color:#6f7985;
        font-size:8px;
      }

      .gc-wheel-count{
        margin-top:12px;
        padding:10px;
        border:1px solid rgba(172,117,255,.25);
        border-radius:9px;
        color:#cbb0ff;
        background:rgba(135,76,218,.06);
        font-size:9px;
        font-weight:900;
      }

      .gc-store-nav-balance{
        margin-left:auto;
        color:#e7c45f;
        font-size:8px;
        font-weight:1000;
      }

      .gc-store-home-action{
        border-color:rgba(245,190,56,.25)!important;
      }

      .gc-store-home-action .gc-store-home-credit{
        color:#e6c257!important;
      }

      @media(max-width:900px){
        .gc-store-grid{grid-template-columns:1fr}
        .gc-reward-track{
          display:flex;
          overflow-x:auto;
          padding-bottom:5px;
          scrollbar-width:thin;
        }
        .gc-reward-day{flex:0 0 92px}
      }

      @media(max-width:800px){
        .gc-store-shell{padding:22px 0 92px}
        .gc-store-head{flex-direction:column}
        .gc-credit-balance-card{width:100%;box-sizing:border-box}
        .gc-claim-zone{flex-direction:column;align-items:stretch}
        #gcClaimDailyRewardBtn{width:100%}
      }
    `;

    document.head.appendChild(style);
  }

  function storeMarkup(){
    return `
      <div class="gc-store-shell">
        <div class="wrap">
          <div class="gc-store-head">
            <div>
              <div class="gc-store-kicker">GYMCEL ECONOMY</div>
              <h1>Store</h1>
              <p>Log in daily, build your streak, earn Gymcel Credits, and spend them here.</p>
            </div>

            <div class="gc-credit-balance-card">
              <span>Gymcel Credits</span>
              <strong>🪙 <b id="gcCreditBalance">0</b></strong>
            </div>
          </div>

          <div class="gc-store-grid">
            <section class="gc-store-card">
              <div class="gc-store-card-title">
                <div>
                  <strong>Daily Login Rewards</strong>
                  <p>Open Gymcels every day and claim your reward to keep the streak alive.</p>
                </div>
                <span class="gc-login-streak-pill">🔥 <b id="gcLoginStreak">0</b> day streak</span>
              </div>

              <div id="gcRewardTrack" class="gc-reward-track"></div>

              <div class="gc-claim-zone">
                <div class="gc-claim-copy">
                  <strong id="gcClaimTitle">Today's reward is waiting</strong>
                  <span id="gcClaimSub">Claim it before the day ends.</span>
                </div>
                <button id="gcClaimDailyRewardBtn" type="button">Claim today's reward</button>
              </div>

              <div id="gcDailyRewardStatus"></div>

              <div class="gc-store-note">
                Miss a day and your daily-login reward streak resets to Day 1. Rewards must be claimed once per day while signed in.
              </div>
            </section>

            <aside class="gc-store-card">
              <div class="gc-coming-icon">🛒</div>
              <div class="gc-store-card-title">
                <div>
                  <strong>Gymcel Store</strong>
                  <p>Your credit balance is ready. We’ll add the things you can buy next.</p>
                </div>
              </div>

              <div class="gc-coming-list">
                <div class="gc-coming-row">
                  <strong>Store Items</strong>
                  <span>Coming in the next step.</span>
                </div>
                <div class="gc-coming-row">
                  <strong>Day 7 Reward Wheel</strong>
                  <span>The wheel itself comes next; Day 7 spins are already saved to your account.</span>
                </div>
              </div>

              <div class="gc-wheel-count">
                🎡 Saved wheel spins: <b id="gcWheelSpins">0</b>
              </div>
            </aside>
          </div>
        </div>
      </div>`;
  }

  function buildStore(){
    document.getElementById('gymcelStoreSection')?.remove();
    installStoreStyles();

    const main=document.querySelector('main');
    if(!main) return;

    const section=document.createElement('section');
    section.id='gymcelStoreSection';
    section.innerHTML=storeMarkup();
    main.appendChild(section);

    document.getElementById('gcClaimDailyRewardBtn')?.addEventListener('click',claimDailyReward);

    installStoreNavigation();
    renderStore();
  }

  function makeDesktopStoreNav(){
    const nav=document.querySelector('.desktop-app-nav');
    if(!nav || nav.querySelector('[data-gc-store-open]')) return;

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='desktop-app-nav-item';
    btn.dataset.gcStoreOpen='1';
    btn.innerHTML='<span>🪙</span><b>Store</b><em class="gc-store-nav-balance" id="gcDesktopCreditMini"></em>';

    const nutrition=nav.querySelector('[data-app-route="nutrition"]');
    if(nutrition) nutrition.insertAdjacentElement('afterend',btn);
    else nav.appendChild(btn);
  }

  function makeMobileStoreNav(){
    const grid=document.querySelector('#mobileNavDrawer .mobile-drawer-grid');
    if(!grid || grid.querySelector('[data-gc-store-open]')) return;

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='mobile-drawer-link';
    btn.dataset.gcStoreOpen='1';
    btn.innerHTML='<span>🪙</span><b>Store</b>';

    const nutrition=grid.querySelector('[data-mobile-proxy="navNutrition"]');
    if(nutrition) nutrition.insertAdjacentElement('afterend',btn);
    else grid.prepend(btn);
  }

  function makeHomeStoreShortcut(){
    const actions=document.querySelector('.app-home-actions');
    if(!actions || actions.querySelector('[data-gc-store-open]')) return;

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='gc-store-home-action';
    btn.dataset.gcStoreOpen='1';
    btn.innerHTML='<span>🪙</span><strong>Store</strong><small class="gc-store-home-credit">Gymcel Credits + daily rewards</small>';
    actions.appendChild(btn);
  }

  function installStoreNavigation(){
    makeDesktopStoreNav();
    makeMobileStoreNav();
    makeHomeStoreShortcut();
  }

  function closeMobileDrawer(){
    const drawer=document.getElementById('mobileNavDrawer');
    const backdrop=document.getElementById('mobileNavBackdrop');
    drawer?.classList.remove('open','show');
    backdrop?.classList.remove('open','show');
    drawer?.setAttribute('aria-hidden','true');
    backdrop?.setAttribute('aria-hidden','true');
    document.body.classList.remove('mobile-nav-open');
  }

  function openStore({updateUrl=true,scroll=true}={}){
    document.body.classList.add('gym-app-mode');
    document.body.dataset.appScreen='store';
    document.title='Store · Gymcels.lol';

    document.querySelectorAll('.desktop-app-nav-item').forEach(btn => {
      btn.classList.toggle('active',!!btn.dataset.gcStoreOpen);
    });

    document.querySelectorAll('.mobile-bottom-item').forEach(btn => {
      btn.classList.remove('active');
    });

    closeMobileDrawer();

    if(updateUrl && location.hash!=='#store'){
      history.replaceState(null,'','#store');
    }

    if(scroll){
      window.scrollTo({top:0,behavior:'smooth'});
    }

    refreshCreditStatus();
  }

  document.addEventListener('click',event => {
    const storeBtn=event.target.closest('[data-gc-store-open]');
    if(!storeBtn) return;

    event.preventDefault();
    event.stopPropagation();
    openStore();
  },true);

  new MutationObserver(() => {
    const storeOpen=document.body.dataset.appScreen==='store';
    document.querySelectorAll('[data-gc-store-open].desktop-app-nav-item').forEach(btn => {
      btn.classList.toggle('active',storeOpen);
    });
  }).observe(document.body,{attributes:true,attributeFilter:['data-app-screen']});

  // If someone reloads while #store is in the URL, restore Store after the site's router boots.
  setTimeout(() => {
    if(location.hash==='#store') openStore({updateUrl:false,scroll:false});
  },450);


  // ============================================================
  // CREDITS + MANUAL DAILY LOGIN CLAIM
  // ============================================================

  function normalizedState(row={}){
    return {
      balance:Number(row.balance || 0),
      total_earned:Number(row.total_earned || 0),
      login_streak:Number(row.login_streak || 0),
      best_login_streak:Number(row.best_login_streak || 0),
      reward_day:Number(row.reward_day || 1),
      credits_awarded:Number(row.credits_awarded || 0),
      wheel_spins:Number(row.wheel_spins || 0),
      wheel_awarded:!!row.wheel_awarded,
      new_claim:!!row.new_claim,
      claimed_today:!!row.claimed_today
    };
  }

  function rewardTrackHtml(){
    if(!currentSession?.user){
      return REWARDS.map(item => `
        <div class="gc-reward-day ${item.day===7?'wheel':''}">
          <small>Day ${item.day}</small>
          <span class="gc-reward-icon">${item.icon}</span>
          <b>${esc(item.label)}</b>
        </div>`).join('');
    }

    const current=Math.max(1,Math.min(7,Number(creditState?.reward_day || 1)));
    const claimed=!!creditState?.claimed_today;

    return REWARDS.map(item => {
      const done=item.day < current || (item.day===current && claimed);
      const now=item.day===current;
      return `
        <div class="gc-reward-day ${item.day===7?'wheel':''} ${done?'done':''} ${now?'current':''}">
          ${done?'<span class="gc-reward-check">✓</span>':''}
          <small>Day ${item.day}</small>
          <span class="gc-reward-icon">${item.icon}</span>
          <b>${esc(item.label)}</b>
        </div>`;
    }).join('');
  }

  function currentReward(){
    const day=Math.max(1,Math.min(7,Number(creditState?.reward_day || 1)));
    return REWARDS.find(item => item.day===day) || REWARDS[0];
  }

  function renderStore(){
    const balance=document.getElementById('gcCreditBalance');
    const streak=document.getElementById('gcLoginStreak');
    const wheel=document.getElementById('gcWheelSpins');
    const track=document.getElementById('gcRewardTrack');
    const status=document.getElementById('gcDailyRewardStatus');
    const mini=document.getElementById('gcDesktopCreditMini');
    const claimBtn=document.getElementById('gcClaimDailyRewardBtn');
    const claimTitle=document.getElementById('gcClaimTitle');
    const claimSub=document.getElementById('gcClaimSub');

    if(balance) balance.textContent=fmt(creditState?.balance || 0);
    if(streak) streak.textContent=fmt(creditState?.login_streak || 0);
    if(wheel) wheel.textContent=fmt(creditState?.wheel_spins || 0);
    if(track) track.innerHTML=rewardTrackHtml();
    if(mini) mini.textContent=currentSession?.user ? fmt(creditState?.balance || 0) : '';

    if(!status || !claimBtn || !claimTitle || !claimSub) return;

    status.className='';

    if(!currentSession?.user){
      claimTitle.textContent='Log in to claim rewards';
      claimSub.textContent='Daily Gymcel Credits are available to signed-in members.';
      claimBtn.textContent='Log in to claim';
      claimBtn.disabled=true;
      status.textContent='';
      return;
    }

    if(!creditState){
      claimTitle.textContent='Loading your daily reward...';
      claimSub.textContent='Checking your Gymcel account.';
      claimBtn.textContent='Loading...';
      claimBtn.disabled=true;
      status.textContent='';
      return;
    }

    const reward=currentReward();

    if(creditState.claimed_today){
      claimTitle.textContent=`Day ${creditState.reward_day} claimed`;
      claimSub.textContent='Come back tomorrow for the next daily reward.';
      claimBtn.textContent='Claimed ✓';
      claimBtn.disabled=true;
      status.className='success';
      status.textContent='✓ Today’s reward has already been claimed.';
      return;
    }

    claimTitle.textContent=`Day ${reward.day} reward is ready`;
    claimSub.textContent=reward.day===7
      ? 'Claim today to receive your saved wheel spin.'
      : `Claim today to receive ${fmt(reward.credits)} Gymcel Credits.`;

    claimBtn.textContent=reward.day===7
      ? 'Claim wheel spin'
      : `Claim ${fmt(reward.credits)} credits`;

    claimBtn.disabled=claimRunning;
    status.textContent='Your reward will only be added after you press Claim.';
  }

  async function claimDailyReward(){
    if(claimRunning || !currentSession?.user || creditState?.claimed_today) return;

    claimRunning=true;
    renderStore();

    const status=document.getElementById('gcDailyRewardStatus');
    if(status){
      status.className='';
      status.textContent='Claiming reward...';
    }

    try{
      const db=await getDb();
      if(!db) throw new Error('Database connection is not ready.');

      const {data,error}=await db.rpc('claim_gymcel_daily_login_reward');
      if(error) throw error;

      const row=Array.isArray(data) ? data[0] : data;
      creditState=normalizedState({
        ...row,
        claimed_today:true
      });

      renderStore();

      if(status){
        if(creditState.wheel_awarded){
          status.className='reward';
          status.textContent='🎡 Day 7 complete — 1 wheel spin was saved to your account.';
        }else{
          status.className='success';
          status.textContent=`✓ +${fmt(creditState.credits_awarded)} Gymcel Credits added to your balance.`;
        }
      }
    }catch(err){
      console.error('[Gymcels] manual daily credit claim error:',err);

      if(status){
        status.className='error';
        status.textContent=err?.message || 'Could not claim today’s reward.';
      }
    }finally{
      claimRunning=false;
      renderStore();
    }
  }

  async function refreshCreditStatus(){
    if(!currentSession?.user){
      creditState=null;
      renderStore();
      return;
    }

    try{
      const db=await getDb();
      if(!db) throw new Error('Database connection is not ready.');

      const {data,error}=await db.rpc('get_my_gymcel_credit_status');
      if(error) throw error;

      const row=Array.isArray(data) ? data[0] : data;
      creditState=normalizedState(row || {});
      renderStore();

      // First screen after login:
      // Only force Store when today's reward has NOT been claimed yet.
      if(
        !creditState.claimed_today &&
        !forcedRewardScreenForSession
      ){
        forcedRewardScreenForSession=true;
        setTimeout(() => openStore({updateUrl:true,scroll:false}),120);
      }
    }catch(err){
      console.error('[Gymcels] credit status error:',err);

      const status=document.getElementById('gcDailyRewardStatus');
      if(status){
        status.className='error';
        status.textContent='Could not load Gymcel Credits.';
      }
    }
  }

  async function installCreditAuth(){
    if(authBooted) return;
    authBooted=true;

    const db=await getDb();
    if(!db) return;

    db.auth.onAuthStateChange((_event,session) => {
      const oldId=currentSession?.user?.id || null;
      const newId=session?.user?.id || null;

      currentSession=session || null;

      if(oldId!==newId){
        forcedRewardScreenForSession=false;
        creditState=null;
      }

      setTimeout(() => refreshCreditStatus(),0);
    });

    const {data}=await db.auth.getSession();
    currentSession=data?.session || null;
    await refreshCreditStatus();
  }


  // ============================================================
  // DAILY WORKOUT STREAKS — replace weekly display/calculation
  // ============================================================

  function dateKey(value){
    if(!value) return null;
    const match=String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
  }

  function shiftDay(key,offset){
    const match=String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(!match) return null;

    const d=new Date(Date.UTC(
      Number(match[1]),
      Number(match[2])-1,
      Number(match[3])
    ));

    d.setUTCDate(d.getUTCDate()+offset);
    return d.toISOString().slice(0,10);
  }

  function localTodayKey(){
    const now=new Date();
    const y=now.getFullYear();
    const m=String(now.getMonth()+1).padStart(2,'0');
    const d=String(now.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }

  function computeDailyWorkoutStreak(logs){
    const days=new Set(
      (logs || [])
        .map(row => dateKey(row.workout_date))
        .filter(Boolean)
    );

    if(!days.size) return {current:0,best:0};

    const today=localTodayKey();
    const yesterday=shiftDay(today,-1);

    let anchor=null;
    if(days.has(today)) anchor=today;
    else if(days.has(yesterday)) anchor=yesterday;

    let current=0;

    if(anchor){
      let cursor=anchor;

      while(days.has(cursor)){
        current++;
        cursor=shiftDay(cursor,-1);
      }
    }

    const sorted=[...days].sort();
    let best=0;
    let run=0;
    let last=null;

    for(const day of sorted){
      if(last && shiftDay(last,1)===day) run++;
      else run=1;

      if(run>best) best=run;
      last=day;
    }

    return {current,best};
  }

  function installDailyWorkoutCalculator(){
    try{
      if(typeof computeWorkoutWeekStreak==='function'){
        computeWorkoutWeekStreak=computeDailyWorkoutStreak;
      }
    }catch(err){
      console.warn('[Gymcels] could not replace local workout streak calculator:',err);
    }

    try{
      if(typeof refreshMemberProfile==='function' && !refreshMemberProfile.__gcDailyWrapped){
        const original=refreshMemberProfile;

        const wrapped=async function(...args){
          const result=await original.apply(this,args);
          patchDailyStreakUi();
          return result;
        };

        wrapped.__gcDailyWrapped=true;
        refreshMemberProfile=wrapped;
      }
    }catch(err){
      console.warn('[Gymcels] could not wrap member profile streak refresh:',err);
    }

    try{
      if(typeof CHAT_ACHIEVEMENTS!=='undefined' && Array.isArray(CHAT_ACHIEVEMENTS)){
        CHAT_ACHIEVEMENTS.forEach(item => {
          item.name=String(item.name || '')
            .replace('4 Week Streak','4 Day Streak')
            .replace('12 Week Streak','12 Day Streak');

          item.hint=String(item.hint || '')
            .replace('4-week workout streak','4-day workout streak')
            .replace('12-week workout streak','12-day workout streak');
        });
      }
    }catch(_){}
  }

  function replaceWeekUnit(el){
    if(!el) return;

    const text=String(el.textContent || '');

    const next=text
      .replace(/\bweeks?\b/gi,match => /^week$/i.test(match)?'day':'days')
      .replace(/\bwk\b/gi,'d');

    if(next!==text) el.textContent=next;
  }

  function patchDailyStreakUi(){
    replaceWeekUnit(document.getElementById('profileCurrentStreak'));
    replaceWeekUnit(document.getElementById('profileBestStreak'));
    replaceWeekUnit(document.getElementById('chatPublicCurrentStreak'));
    replaceWeekUnit(document.getElementById('chatPublicBestStreak'));
    replaceWeekUnit(document.getElementById('appHomeStreak'));

    const profileCurrent=document.getElementById('profileCurrentStreak')?.closest('.profile-stat');
    const profileBest=document.getElementById('profileBestStreak')?.closest('.profile-stat');

    if(profileCurrent){
      profileCurrent.title='Consecutive days with at least one logged workout';
    }

    if(profileBest){
      profileBest.title='Best consecutive daily workout streak';
    }

    const metric=document.getElementById('leaderboardMetricLabel');

    if(metric && /weekly/i.test(metric.textContent || '')){
      metric.textContent='Best daily streak';
    }

    const activeStreak=document.querySelector('[data-leaderboard-mode="streak"].active');

    if(activeStreak){
      document.querySelectorAll('#communityLeaderboard .leaderboard-row').forEach(row => {
        replaceWeekUnit(row.querySelector('.leaderboard-member small'));
        replaceWeekUnit(row.querySelector('.leaderboard-value b'));
      });
    }

    document.querySelectorAll('.chat-achievement').forEach(el => {
      [...el.childNodes].forEach(node => {
        if(
          node.nodeType===Node.TEXT_NODE &&
          /Week Streak/.test(node.textContent || '')
        ){
          node.textContent=node.textContent.replace(/Week Streak/g,'Day Streak');
        }
      });

      if(el.title){
        el.title=el.title
          .replace(/week workout streak/gi,'day workout streak')
          .replace(/weekly workout streak/gi,'daily workout streak');
      }
    });
  }

  function watchStreakUi(){
    const targets=[
      document.getElementById('memberProfile'),
      document.getElementById('chatProfileOverlay'),
      document.getElementById('communityLeaderboard'),
      document.getElementById('appHomeDashboard'),
      document.getElementById('chatAchievements'),
      document.getElementById('chatPublicAchievements')
    ].filter(Boolean);

    targets.forEach(target => {
      if(target.dataset.gcDailyStreakWatch==='1') return;

      target.dataset.gcDailyStreakWatch='1';

      new MutationObserver(() => {
        setTimeout(patchDailyStreakUi,0);
      }).observe(target,{
        childList:true,
        subtree:true,
        characterData:true
      });
    });
  }


  // ============================================================
  // BOOT
  // ============================================================

  function boot(){
    buildStore();
    installStoreNavigation();
    installDailyWorkoutCalculator();
    watchStreakUi();
    patchDailyStreakUi();
    installCreditAuth();

    setInterval(() => {
      installStoreNavigation();
      patchDailyStreakUi();
    },1500);

    setTimeout(() => {
      try{
        if(typeof refreshMemberProfile==='function'){
          refreshMemberProfile();
        }
      }catch(_){}
    },500);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }

  console.log('[Gymcels] Store + manual daily claim + daily streaks V2 loaded');
})();
