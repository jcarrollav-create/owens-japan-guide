/* ═══════════════════════════════════════════════════════════
   Owen's Japan Guide 2026 — app.js
   ═══════════════════════════════════════════════════════════ */

// ─── CONFIG ───────────────────────────────────────────────
const SUPABASE_URL  = 'https://fmlolwkndaqpxvfszswx.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtbG9sd2tuZGFxcHh2ZnN6c3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDMzMTksImV4cCI6MjA5MzQ3OTMxOX0.mDg9MlJ83KP2lzsi_7jvPN1tLmRvupBtZcS0Sj8ITXo';
const RAPIDAPI_KEY  = '4219e405a0mshf5c5a8713d8ec5fp1cf306jsnc2b56795ee73';
const GMAPS_KEY     = 'AIzaSyDshtWH_s3eK4uxZrsuSf1qyUIQhAE2oZo';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── PROGRAM EVENTS (calendar + schedule) ─────────────────
// These are hardcoded LBAT program dates shown in purple on calendar
const PROGRAM_EVENTS = [
  // Orientation / arrival
  { date:'2026-05-17', label:'Program Rendezvous – Fukuoka', type:'program' },
  { date:'2026-05-17', label:'Bus to Beppu (depart 7pm)', type:'program' },
  { date:'2026-05-18', label:'Program Begins – APU Beppu', type:'program' },
  // Program runs May 18 – July 18 (mark Mon–Fri as program days)
  ...(() => {
    const days = [];
    const start = new Date('2026-05-18');
    const end   = new Date('2026-07-18');
    for (let d = new Date(start); d <= end; d.setDate(d.getDate()+1)) {
      const dow = d.getDay();
      if (dow >= 1 && dow <= 5) { // Mon–Fri
        days.push({
          date: d.toISOString().split('T')[0],
          label: 'LBAT Program',
          type: 'program'
        });
      }
    }
    return days;
  })(),
  { date:'2026-07-18', label:'Program Ends', type:'program' },
  // Solo travel window
  { date:'2026-07-19', label:'Solo Travel Begins', type:'activity' },
  { date:'2026-07-24', label:'Tenjin Matsuri – Osaka', type:'activity' },
  { date:'2026-07-25', label:'Tenjin Matsuri / Sumida Fireworks', type:'activity' },
];

// ─── LOCKED FLIGHT CALENDAR EVENTS ───────────────────────
// All times stored as UTC ISO strings; displayed in local TZ
const FLIGHT_EVENTS = [
  {
    id: 'flight-ua7103',
    date: '2026-05-15',
    label: '✈ UA7103 ATL→IAD',
    type: 'locked',
    flightNum: 'UA 7103',
    route: 'ATL → IAD',
    depISO: '2026-05-15T09:30:00Z',   // 5:30 AM EDT = 09:30 UTC
    arrISO: '2026-05-15T11:17:00Z',   // 7:17 AM EDT = 11:17 UTC
    depLocal: '5:30 AM EDT',
    arrLocal: '7:17 AM EDT',
    depTZ: 'America/New_York',
    note: 'Hartsfield-Jackson · Terminal N'
  },
  {
    id: 'flight-nh101',
    date: '2026-05-15',
    label: '✈ NH101 IAD→HND',
    type: 'locked',
    flightNum: 'NH 101',
    route: 'IAD → HND (Tokyo)',
    depISO: '2026-05-15T16:15:00Z',   // 12:15 PM EDT = 16:15 UTC
    arrISO: '2026-05-16T06:20:00Z',   // 3:20 PM JST next day
    depLocal: '12:15 PM EDT',
    arrLocal: '3:20 PM JST (May 16)',
    depTZ: 'America/New_York',
    note: 'Trans-Pacific · 14h 5m'
  },
  {
    id: 'flight-nh267',
    date: '2026-05-16',
    label: '✈ NH267 HND→FUK',
    type: 'locked',
    flightNum: 'NH 267',
    route: 'HND → FUK (Fukuoka)',
    depISO: '2026-05-16T09:00:00Z',   // 6:00 PM JST = 09:00 UTC
    arrISO: '2026-05-16T10:55:00Z',   // 7:55 PM JST = 10:55 UTC
    depLocal: '6:00 PM JST',
    arrLocal: '7:55 PM JST',
    depTZ: 'Asia/Tokyo',
    note: 'Haneda T2 → Fukuoka Terminal D'
  },
  {
    id: 'flight-nh248',
    date: '2026-07-26',
    label: '✈ NH248 FUK→HND',
    type: 'locked',
    flightNum: 'NH 248',
    route: 'FUK → HND',
    depISO: '2026-07-26T01:45:00Z',   // 10:45 AM JST = 01:45 UTC
    arrISO: '2026-07-26T03:35:00Z',   // 12:35 PM JST = 03:35 UTC
    depLocal: '10:45 AM JST',
    arrLocal: '12:35 PM JST',
    depTZ: 'Asia/Tokyo',
    note: 'Be at airport by 8:45 AM'
  },
  {
    id: 'flight-ua804',
    date: '2026-07-26',
    label: '✈ UA804 HND→IAD',
    type: 'locked',
    flightNum: 'UA 804',
    route: 'HND → IAD',
    depISO: '2026-07-26T06:45:00Z',   // 3:45 PM JST = 06:45 UTC
    arrISO: '2026-07-26T19:50:00Z',   // 3:50 PM EDT = 19:50 UTC
    depLocal: '3:45 PM JST',
    arrLocal: '3:50 PM EDT',
    depTZ: 'Asia/Tokyo',
    note: 'Trans-Pacific return · 13h 5m'
  },
  {
    id: 'flight-ua2081',
    date: '2026-07-26',
    label: '✈ UA2081 IAD→ATL',
    type: 'locked',
    flightNum: 'UA 2081',
    route: 'IAD → ATL',
    depISO: '2026-07-26T21:17:00Z',   // 5:17 PM EDT = 21:17 UTC
    arrISO: '2026-07-26T23:16:00Z',   // 7:16 PM EDT = 23:16 UTC
    depLocal: '5:17 PM EDT',
    arrLocal: '7:16 PM EDT 🏠',
    depTZ: 'America/New_York',
    note: 'Home! Dulles → Hartsfield'
  },
];

// ─── FLIGHTS for live status ───────────────────────────────
const FLIGHTS = [
  { num:'UA7103', date:'2026-05-15' },
  { num:'NH101',  date:'2026-05-15' },
  { num:'NH267',  date:'2026-05-16' },
  { num:'NH248',  date:'2026-07-26' },
  { num:'UA804',  date:'2026-07-26' },
  { num:'UA2081', date:'2026-07-26' },
];

// ─── TIMEZONE TOGGLE STATE ────────────────────────────────
let schedTZ = 'EDT'; // 'EDT' or 'JST'

// ─── EXCHANGE RATE ────────────────────────────────────────
let exchangeRate = 153;
let convDir = 'usd2jpy';

// ─── CHECKLIST STATE ──────────────────────────────────────
const state = {};

// ─── NAV ──────────────────────────────────────────────────
const TABS = ['dashboard','prep','flights','calendar','events','journal','info','program'];

function showTab(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  const idx = TABS.indexOf(id);
  const btns = document.querySelectorAll('.nav-btn');
  if (btns[idx]) btns[idx].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'calendar') loadCalendar();
  if (id === 'journal')  loadJournal();
  if (id === 'program')  initProgram();
}

function showInner(id, btn) {
  const parent = btn.closest('.section');
  // hide all sibling inner views
  parent.querySelectorAll('.inner-view').forEach(el => el.style.display = 'none');
  const target = document.getElementById(id);
  if (target) target.style.display = '';
  parent.querySelectorAll('.inner-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ─── CLOCKS ───────────────────────────────────────────────
function updateClocks() {
  const now = new Date();
  const fmt = (tz, opts) => now.toLocaleString('en-US', { timeZone: tz, ...opts });

  const gaTime = fmt('America/New_York', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const jpTime = fmt('Asia/Tokyo',       { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const gaDate = fmt('America/New_York', { weekday:'short', month:'short', day:'numeric' });
  const jpDate = fmt('Asia/Tokyo',       { weekday:'short', month:'short', day:'numeric' });

  const el = id => document.getElementById(id);
  if (el('clockGA')) el('clockGA').textContent = gaTime;
  if (el('clockJP')) el('clockJP').textContent = jpTime;
  if (el('dateGA'))  el('dateGA').textContent  = gaDate;
  if (el('dateJP'))  el('dateJP').textContent  = jpDate;

  // countdown
  const dep = new Date('2026-05-15T09:30:00Z');
  const diff = Math.ceil((dep - now) / 86400000);
  const countEl = el('countdown');
  if (countEl) countEl.textContent = diff > 0 ? diff : '✈';
}

// ─── TODAY'S SCHEDULE ─────────────────────────────────────
function toggleSchedTZ() {
  schedTZ = schedTZ === 'EDT' ? 'JST' : 'EDT';
  const btn = document.getElementById('tzToggleBtn');
  if (btn) {
    btn.textContent = schedTZ === 'EDT' ? 'EDT' : 'JST';
    btn.classList.toggle('jst', schedTZ === 'JST');
  }
  renderTodaySchedule();
}

function formatSchedTime(isoStr) {
  const d = new Date(isoStr);
  const tz = schedTZ === 'JST' ? 'Asia/Tokyo' : 'America/New_York';
  return d.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
}

function getLocalDateStr(tz) {
  return new Date().toLocaleDateString('en-CA', { timeZone: tz }); // YYYY-MM-DD
}

async function renderTodaySchedule() {
  const tz = schedTZ === 'JST' ? 'Asia/Tokyo' : 'America/New_York';
  const todayStr    = getLocalDateStr(tz);
  const tomorrowStr = (() => {
    const d = new Date(todayStr + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  // Update date labels
  const fmtDate = s => new Date(s + 'T12:00:00').toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });
  const todayLbl = document.getElementById('schedTodayLbl');
  const tmrwLbl  = document.getElementById('schedTmrwLbl');
  if (todayLbl) todayLbl.textContent = fmtDate(todayStr);
  if (tmrwLbl)  tmrwLbl.textContent  = fmtDate(tomorrowStr);

  // Gather events from all sources
  let itinData = [];
  try {
    const { data } = await sb.from('itinerary').select('*');
    itinData = data || [];
  } catch(e) { /* offline */ }

  function buildDayEvents(dateStr) {
    const items = [];

    // Locked flight events
    FLIGHT_EVENTS.filter(f => f.date === dateStr).forEach(f => {
      items.push({
        timeISO: f.depISO,
        label: `${f.flightNum}: ${f.route}`,
        meta: `Departs ${schedTZ === 'JST'
          ? new Date(f.depISO).toLocaleTimeString('en-US',{timeZone:'Asia/Tokyo',hour:'2-digit',minute:'2-digit'})
          : new Date(f.depISO).toLocaleTimeString('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit'})
        } ${schedTZ} · ${f.note}`,
        type: 'locked'
      });
    });

    // Program events
    PROGRAM_EVENTS.filter(e => e.date === dateStr).forEach(e => {
      items.push({ timeISO: null, label: e.label, meta: 'LBAT Program', type: e.type });
    });

    // Supabase itinerary
    itinData.filter(e => {
      const s = e.start, en = e.end || e.start;
      return dateStr >= s && dateStr <= en;
    }).forEach(e => {
      items.push({ timeISO: null, label: e.title, meta: e.location || '', type: e.type || 'other' });
    });

    // Sort: timed items first by time, then untimed
    items.sort((a, b) => {
      if (a.timeISO && b.timeISO) return new Date(a.timeISO) - new Date(b.timeISO);
      if (a.timeISO) return -1;
      if (b.timeISO) return 1;
      return 0;
    });

    return items;
  }

  function renderItems(items, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!items.length) {
      el.innerHTML = '<div class="sched-empty">Nothing scheduled</div>';
      return;
    }
    el.innerHTML = items.map(item => `
      <div class="sched-item">
        <div class="sched-time">${item.timeISO ? formatSchedTime(item.timeISO) : '—'}</div>
        <div class="sched-dot ${item.type}"></div>
        <div class="sched-body">
          <div class="sched-label">${item.label}</div>
          ${item.meta ? `<div class="sched-meta">${item.meta}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  renderItems(buildDayEvents(todayStr),    'schedTodayList');
  renderItems(buildDayEvents(tomorrowStr), 'schedTmrwList');
}

// ─── QUICK CONVERTER ──────────────────────────────────────
async function loadExchangeRate() {
  try {
    const res  = await fetch('https://api.frankfurter.app/latest?from=USD&to=JPY');
    const data = await res.json();
    exchangeRate = data.rates.JPY || 153;
  } catch(e) {
    try {
      const res2  = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data2 = await res2.json();
      exchangeRate = data2.rates.JPY || 153;
    } catch(e2) { /* use default */ }
  }
  const pill = document.getElementById('convRatePill');
  if (pill) pill.textContent = `1 USD = ¥${exchangeRate.toFixed(2)} · live`;
  convert();
  renderPresets();
}

function setConvDir(dir, btn) {
  convDir = dir;
  document.querySelectorAll('.conv-toggle-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const fromLbl = document.getElementById('convFromLbl');
  const toLbl   = document.getElementById('convToLbl');
  if (fromLbl) fromLbl.textContent = dir === 'usd2jpy' ? 'US DOLLARS' : 'JAPANESE YEN';
  if (toLbl)   toLbl.textContent   = dir === 'usd2jpy' ? 'JAPANESE YEN' : 'US DOLLARS';
  renderPresets();
  convert();
}

function convert() {
  const raw = parseFloat(document.getElementById('convInput')?.value) || 0;
  const res = document.getElementById('convResult');
  if (!res) return;
  if (convDir === 'usd2jpy') {
    res.textContent = '¥' + Math.round(raw * exchangeRate).toLocaleString();
  } else {
    res.textContent = '$' + (raw / exchangeRate).toFixed(2);
  }
}

function setConvAmount(a) {
  const inp = document.getElementById('convInput');
  if (inp) { inp.value = a; convert(); }
}

function renderPresets() {
  const wrap = document.getElementById('convPresets');
  if (!wrap) return;
  const amounts = convDir === 'usd2jpy'
    ? [{ label:'$20',v:20},{ label:'$50',v:50},{ label:'$100',v:100},{ label:'$500',v:500}]
    : [{ label:'¥1,000',v:1000},{ label:'¥3,000',v:3000},{ label:'¥5,000',v:5000},{ label:'¥10,000',v:10000}];
  wrap.innerHTML = amounts.map(a =>
    `<button class="conv-preset-btn" onclick="setConvAmount(${a.v})">${a.label}</button>`
  ).join('');
}

// ─── CHECKLIST / PREP ─────────────────────────────────────
function setSyncStatus(s) {
  const dot = document.getElementById('syncDot');
  const lbl = document.getElementById('syncLabel');
  if (!dot || !lbl) return;
  dot.className = 'sync-dot' + (s==='live'?' live':s==='saving'?' saving':s==='error'?' error':'');
  lbl.textContent = s==='live'?'Live sync':s==='saving'?'Saving…':s==='error'?'Offline':'Loading…';
}

function updateProgress() {
  const all  = document.querySelectorAll('li[data-id]');
  const done = [...all].filter(li => state[li.dataset.id] === true);
  const pct  = all.length ? Math.round(done.length / all.length * 100) : 0;

  const bar    = document.getElementById('progressBar');
  const pctEl  = document.getElementById('progressPct');
  const countEl= document.getElementById('progressCount');

  if (bar)    bar.style.width = pct + '%';
  if (pctEl)  pctEl.textContent = pct + '%';
  if (countEl) countEl.textContent = `${done.length} of ${all.length} complete`;
}

function applyState(id, checked) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (!li) return;
  const box  = li.querySelector('.cb-box');
  const text = li.querySelector('.cb-text');
  if (!box || !text) return;
  if (checked) { box.classList.add('checked'); text.classList.add('checked'); }
  else         { box.classList.remove('checked'); text.classList.remove('checked'); }
}

async function toggleById(id) {
  const newVal = !(state[id] === true);
  state[id] = newVal;
  applyState(id, newVal);
  updateProgress();
  setSyncStatus('saving');
  try {
    const { error } = await sb.from('checklist').upsert(
      { id, checked: newVal, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );
    if (error) throw error;
    setSyncStatus('live');
  } catch(e) {
    console.error('Checklist error:', e?.message || JSON.stringify(e));
    setSyncStatus('error');
  }
}

async function loadChecklist() {
  setSyncStatus('loading');
  try {
    const { data, error } = await sb.from('checklist').select('id,checked');
    if (error) throw error;
    (data || []).forEach(row => { state[row.id] = row.checked; applyState(row.id, row.checked); });
    updateProgress();
    setSyncStatus('live');
  } catch(e) {
    console.error('Checklist load error:', e?.message || JSON.stringify(e));
    setSyncStatus('error');
  }
}

function subscribeRealtime() {
  sb.channel('checklist-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'checklist' }, payload => {
      const { id, checked } = payload.new || {};
      if (!id) return;
      state[id] = checked;
      applyState(id, checked);
      updateProgress();
    })
    .subscribe(s => { if (s === 'SUBSCRIBED') setSyncStatus('live'); });

  sb.channel('tasks-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'tasks' }, () => { loadTasks(); })
    .subscribe();

  sb.channel('itin-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'itinerary' }, () => {
      loadCalendar();
      renderTodaySchedule();
    }).subscribe();

  sb.channel('journal-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'journal' }, () => {
      loadJournal();
      // New journal entry might mean a new map pin should appear
      loadMapState();
    }).subscribe();

  sb.channel('map-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'map_visited' }, payload => {
      // Re-run full loadMapState so journal cross-check is always applied
      loadMapState();
    }).subscribe();
}

// ─── FLIGHTS ──────────────────────────────────────────────
async function fetchFlight(i) {
  const f = FLIGHTS[i];
  const statusEl = document.getElementById('fs-' + i);
  if (!statusEl) return;
  statusEl.className = 'flight-status status-unknown';
  statusEl.textContent = 'Fetching…';
  try {
    const url = `https://aerodatabox.p.rapidapi.com/flights/number/${f.num}/${f.date}`;
    const res = await fetch(url, {
      headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com' }
    });
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    const flight = Array.isArray(data) ? data[0] : data;
    if (!flight) { statusEl.textContent = 'No data available'; return; }
    const st = flight.status || 'Unknown';
    let cls = 'status-unknown', label = st;
    if (st.toLowerCase().includes('scheduled'))                           { cls='status-scheduled'; label='Scheduled'; }
    else if (st.toLowerCase().includes('on time')||st.toLowerCase().includes('active')) { cls='status-on-time';   label='On Time';   }
    else if (st.toLowerCase().includes('delay'))                          { cls='status-delayed';   label='Delayed';   }
    else if (st.toLowerCase().includes('landed')||st.toLowerCase().includes('arrived')) { cls='status-landed';    label='Landed';    }
    statusEl.className = 'flight-status ' + cls;
    statusEl.textContent = label;
  } catch(e) {
    console.error('Flight fetch error:', e?.message || JSON.stringify(e));
    statusEl.className = 'flight-status status-unknown';
    statusEl.textContent = 'Check airline site';
  }
}

// ─── CALENDAR ─────────────────────────────────────────────
let calYear = 2026, calMonth = 4; // May 2026 (0-indexed)

function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  else if (calMonth < 0) { calMonth = 11; calYear--; }
  loadCalendar();
}

async function loadCalendar() {
  try {
    const { data } = await sb.from('itinerary').select('*').order('start', { ascending: true });
    renderCalendar(data || []);
  } catch(e) {
    renderCalendar([]);
  }
}

function getDatesInRange(start, end) {
  const dates = [];
  let cur  = new Date(start + 'T12:00:00');
  const last = new Date((end || start) + 'T12:00:00');
  while (cur <= last) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function renderCalendar(itinData) {
  const titleEl = document.getElementById('calTitle');
  const grid    = document.getElementById('calGrid');
  if (!titleEl || !grid) return;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  titleEl.textContent = months[calMonth] + ' ' + calYear;

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today       = new Date();

  // Build event map
  const evMap = {};
  const addEv = (date, ev) => { if (!evMap[date]) evMap[date] = []; evMap[date].push(ev); };

  PROGRAM_EVENTS.forEach(e => addEv(e.date, { label: e.label, type: e.type }));
  FLIGHT_EVENTS.forEach(f  => addEv(f.date,  { label: f.label, type: 'locked' }));

  itinData.forEach(e => {
    getDatesInRange(e.start, e.end || e.start).forEach(d =>
      addEv(d, { label: e.title, type: e.type || 'other' })
    );
  });

  let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    .map(d => `<div class="cal-day-name">${d}</div>`).join('');

  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day other-month"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr  = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday  = today.getFullYear()===calYear && today.getMonth()===calMonth && today.getDate()===d;
    const events   = evMap[dateStr] || [];
    const hasEv    = events.length > 0;
    html += `
      <div class="cal-day${isToday?' today':''}${hasEv?' has-event':''}">
        ${isToday ? '<div class="cal-today-dot"></div>' : ''}
        <div class="cal-date">${d}</div>
        ${events.slice(0,2).map(e => `<div class="cal-event ${e.type||''}">${e.label}</div>`).join('')}
        ${events.length > 2 ? `<div style="font-size:9px;color:var(--muted);">+${events.length-2} more</div>` : ''}
      </div>`;
  }
  grid.innerHTML = html;
}

// ─── EVENTS TAB ───────────────────────────────────────────
let eventsSection = 'in-program'; // 'in-program' | 'after-program'
let eventsCity    = 'all';

const EVENTS_DATA = {
  'in-program': [
    {
      icon: '🖼️',
      name: 'Kyushu National Museum: "Jakuchu, Rinpa & Kyoto Art"',
      url: 'https://www.kyuhaku.jp/en/',
      dates: 'April 21 – June 14, 2026',
      city: 'Dazaifu',
      desc: 'Masterpieces from the Hosomi Collection including Ito Jakuchu and Hokusai at one of Japan\'s four national museums. Pair it with a visit to adjacent Dazaifu Tenmangu shrine — a stunning 10-minute walk through a forest tunnel.',
      travel: '🚂 <b>Limited Express SONIC</b> Beppu→Hakata (~2 hrs, ~¥5,250 unreserved), then <b>Nishitetsu Rail</b> Hakata→Dazaifu (~30 min, ~¥400). Total: ~¥5,650. JR Pass covers the SONIC leg.'
    },
    {
      icon: '🦕',
      name: 'Grand Dinosaur Exhibition — Fukuoka City Museum',
      url: 'https://museum.city.fukuoka.jp/',
      dates: 'April 24 – June 28, 2026',
      city: 'Fukuoka',
      desc: 'Features a 15-meter life-sized animatronic Spinosaurus robot alongside rare fossil specimens from around the world. One of Japan\'s biggest science exhibitions of 2026, and genuinely jaw-dropping in person.',
      travel: '🚂 <b>SONIC</b> Beppu→Hakata (~2 hrs, ~¥5,250), then Subway Hakozaki Line to Momochihama area (~20 min). Total: ~¥5,500.'
    },
    {
      icon: '🌸',
      name: 'Hydrangea Season — Uminonakamichi Seaside Park',
      url: 'https://uminaka-park.jp/',
      dates: 'June (peak mid-June)',
      city: 'Fukuoka',
      desc: 'Thousands of electric-blue and purple hydrangeas bloom across this 350-hectare seaside park — one of the best hydrangea spots in Kyushu. Perfect half-day trip on a weekday to avoid weekend crowds.',
      travel: '🚂 <b>SONIC</b> Beppu→Hakata (~2 hrs, ~¥5,250), then <b>JR Kagoshima Line</b> to Uminonakamichi Station (~30 min). Total: ~¥5,500.'
    },
    {
      icon: '🎏',
      name: 'Hakata Gion Yamakasa',
      url: 'https://en.hakata-yamakasa.net',
      dates: 'July 1–15, 2026 · Climax race 4:59 AM on July 15',
      city: 'Fukuoka',
      desc: 'A UNESCO Intangible Heritage festival where teams of men race 1-ton decorative floats through the streets of Hakata. The 4:59 AM climax race on July 15 is one of the most electric moments in Japanese summer — arrive the night before and join the pre-race energy.',
      travel: '🚂 <b>Limited Express SONIC</b> Beppu→Hakata (~2 hrs, ~¥5,250 unreserved). JR Pass covers this leg. Stay overnight July 14 to catch the dawn race.'
    },
    {
      icon: '🎆',
      name: 'Kyoto Gion Festival — Yoiyama Evenings',
      url: 'https://www.gion-yamaboko.or.jp/',
      dates: 'July 14–16, 2026 (Yoiyama evenings)',
      city: 'Kyoto',
      desc: 'Street festival nights before the grand Yamaboko Junko float parade — giant floats parked in downtown Kyoto, food stalls, paper lanterns, and thousands of people in yukata. The evenings feel like stepping into Edo-period Japan. Plan an overnight stay to experience both evening ambience and morning parade.',
      travel: '🚂 <b>SONIC</b> Beppu→Hakata (~2 hrs), then <b>Shinkansen Sakura</b> Hakata→Shin-Osaka→Kyoto (~2.5 hrs, ~¥10,000+). Total ~3 hrs. JR Pass covers Shinkansen. Note: this is at the outer 3-hr edge — plan for an overnight.'
    },
  ],
  'after-program': [
    {
      icon: '☮️',
      name: 'Hiroshima Peace Memorial Museum + Miyajima Island',
      url: 'https://hpmmuseum.jp/?lang=eng',
      dates: 'Open daily · Best July 19–20',
      city: 'Hiroshima',
      desc: 'One of the most moving museums in the world, documenting the 1945 atomic bombing with extraordinary personal artifacts. Pair it with a 30-minute ferry to Miyajima Island to see the floating torii gate of Itsukushima Shrine — one of Japan\'s most iconic images.',
      travel: '🚂 From Beppu: <b>SONIC</b> to Hakata, then <b>Shinkansen Kodama/Sakura</b> Hakata→Hiroshima (~50 min, ~¥5,500). Hiroshima tram to Genbaku Dome-mae. JR ferry to Miyajima (~25 min).'
    },
    {
      icon: '🎆',
      name: 'Kyoto Gion Festival — Ato Matsuri Second Parade',
      url: 'https://www.gion-yamaboko.or.jp/',
      dates: 'July 24, 2026',
      city: 'Kyoto',
      desc: 'The second grand float parade of Gion Matsuri features the rear procession floats, often less crowded than the July 17 main parade. Combine it with Fushimi Inari at sunrise and Arashiyama bamboo grove for a full Kyoto day.',
      travel: '🚂 From Hiroshima: <b>Shinkansen Nozomi</b> Hiroshima→Kyoto (~1h 20m, ~¥8,500). JR Pass covers this. Recommend July 21–24 in Kyoto.'
    },
    {
      icon: '🚢',
      name: 'Tenjin Matsuri — Osaka Boat Festival',
      url: 'https://www.osaka-info.jp/en/events/detail/tenjin-matsuri',
      dates: 'July 24–25, 2026',
      city: 'Osaka',
      desc: 'One of Japan\'s three greatest festivals — 3,000 participants in Heian-period costumes, 100 illuminated boats on the Okawa River, and 5,000 fireworks at night. July 25 is the main event with the boat procession starting at 6 PM and fireworks after 7 PM. Dotonbori and Osaka street food before the show.',
      travel: '🚂 From Kyoto: <b>Hankyu Kyoto Line</b> or <b>JR Tokaido</b> to Osaka Umeda (~30 min, ~¥400). Walk to Osaka Tenmangu area. Easy day-trip from Kyoto.'
    },
    {
      icon: '🗼',
      name: 'Tokyo — Shibuya · Shinjuku · Akihabara · Asakusa',
      url: 'https://www.gotokyo.org/en/',
      dates: 'July 22–26, 2026',
      city: 'Tokyo',
      desc: 'Four days in Tokyo: Shibuya Crossing and Harajuku, Shinjuku neon at night, Akihabara electronics and anime, and Senso-ji Temple in Asakusa at dawn before crowds arrive. Tsukiji Outer Market for the best breakfast in Japan.',
      travel: '🚂 From Osaka/Kyoto: <b>Shinkansen Nozomi</b> to Tokyo (~2h 15m from Osaka, ~¥13,500). JR Pass covers this. Book a hotel near Shinjuku or Asakusa for best access.'
    },
    {
      icon: '🎆',
      name: 'Sumida River Fireworks Festival',
      url: 'https://www.sumidagawa-hanabi.com/',
      dates: 'July 25, 2026 · 7:00–8:30 PM',
      city: 'Tokyo',
      desc: 'Tokyo\'s oldest and biggest fireworks festival — ~20,000 fireworks from two launch sites along the Sumida River near Asakusa. Nearly 1 million spectators. Arrive by 3:30 PM to secure a good spot on the closed-off streets. Many people wear yukata — rent one in Asakusa for the full experience.',
      travel: '📍 <b>Asakusa Station</b> (Ginza or Asakusa Lines). Free to attend. Book a hotel in Asakusa months ahead — views from hotel rooftops are spectacular. Pro tip: head toward Tokyo Skytree for thinner crowds and a gorgeous backdrop.'
    },
  ]
};

function showEventsSection(section, btn) {
  eventsSection = section;
  document.querySelectorAll('.ev-sec-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  eventsCity = 'all';
  document.querySelectorAll('.city-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.city === 'all');
  });
  updateCityFilters();
  renderEvents();
}

function filterCity(city, btn) {
  eventsCity = city;
  document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEvents();
}

function updateCityFilters() {
  const events = EVENTS_DATA[eventsSection] || [];
  const cities = [...new Set(events.map(e => e.city))];
  const wrap = document.getElementById('cityFilterWrap');
  if (!wrap) return;
  wrap.innerHTML = `<button class="city-btn active" data-city="all" onclick="filterCity('all',this)">All</button>` +
    cities.map(c => `<button class="city-btn" data-city="${c}" onclick="filterCity('${c}',this)">${c}</button>`).join('');
}

function renderEvents() {
  const events = (EVENTS_DATA[eventsSection] || [])
    .filter(e => eventsCity === 'all' || e.city === eventsCity);
  const wrap = document.getElementById('eventsListWrap');
  if (!wrap) return;
  if (!events.length) {
    wrap.innerHTML = '<div style="text-align:center;color:var(--mist);padding:20px;">No events for this city</div>';
    return;
  }
  wrap.innerHTML = events.map(e => `
    <div class="event-card">
      <div class="event-top">
        <div class="event-icon">${e.icon}</div>
        <div class="event-meta">
          <div class="event-name"><a href="${e.url}" target="_blank" rel="noopener">${e.name}</a></div>
          <div class="event-dates">${e.dates}</div>
        </div>
        <div class="event-city-tag">${e.city}</div>
      </div>
      <div class="event-desc">${e.desc}</div>
      <div class="event-travel">${e.travel}</div>
    </div>
  `).join('');
}

// ─── JOURNAL ──────────────────────────────────────────────

// Known city → MAP_LOCATIONS id mapping for pin drops
const JOURNAL_CITY_MAP = {
  'beppu':     'beppu',     'oita':      'beppu',
  'fukuoka':   'fukuoka',   'hakata':    'fukuoka',
  'hiroshima': 'hiroshima', 'miyajima':  'miyajima',
  'kyoto':     'kyoto',     'nara':      'kyoto',
  'osaka':     'osaka',     'kobe':      'osaka',
  'tokyo':     'tokyo',     'shinjuku':  'tokyo',
  'shibuya':   'tokyo',     'asakusa':   'tokyo',
  'akihabara': 'tokyo',     'haneda':    'tokyo',
  'narita':    'tokyo',     'yokohama':  'tokyo',
};

function resolveJournalPin(locationStr) {
  if (!locationStr) return null;
  const lower = locationStr.toLowerCase();
  for (const [keyword, locId] of Object.entries(JOURNAL_CITY_MAP)) {
    if (lower.includes(keyword)) return locId;
  }
  return null;
}

async function dropJournalPin(locationStr) {
  const locId = resolveJournalPin(locationStr);
  if (!locId) return; // unknown location — don't drop pin
  // Mark as visited in state + map
  mapState[locId] = true;
  if (gmap) refreshMapMarkers();
  renderVisitedList();
  // Persist to Supabase map_visited
  try {
    await sb.from('map_visited').upsert(
      { location: locId, visited: true, updated_at: new Date().toISOString() },
      { onConflict: 'location' }
    );
  } catch(e) { console.error('Pin drop error:', e?.message || JSON.stringify(e)); }
}

async function addJournalEntry() {
  const name     = document.getElementById('jName')?.value.trim();
  const location = document.getElementById('jLocation')?.value.trim();
  const text     = document.getElementById('jText')?.value.trim();
  if (!name || !text) { alert('Please add your name and an entry'); return; }
  const entry = {
    id: Date.now().toString(), name, location, text,
    created_at: new Date().toISOString()
  };
  try {
    const { error } = await sb.from('journal').insert(entry);
    if (error) throw error;
    ['jName','jLocation','jText'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    loadJournal();
    // Drop a map pin for the location if recognizable
    if (location) dropJournalPin(location);
  } catch(e) {
    console.error('Journal error:', e?.message || JSON.stringify(e));
    alert('Error saving: ' + (e?.message || JSON.stringify(e)));
  }
}

async function loadJournal() {
  try {
    const { data } = await sb.from('journal').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('journalList');
    if (!list) return;
    if (!data || !data.length) {
      list.innerHTML = '<div style="text-align:center;color:var(--muted);padding:20px;font-size:14px;">No entries yet — Owen can start writing when he arrives!</div>';
      return;
    }
    list.innerHTML = data.map(e => `
      <div class="journal-entry">
        ${e.location ? `<div class="journal-location">📍 ${e.location}</div>` : ''}
        <div class="journal-date">${e.japan_time || new Date(e.created_at).toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
        <div class="journal-text">${e.text.replace(/\n/g,'<br>')}</div>
        <div class="journal-author">— ${e.name}</div>
      </div>
    `).join('');
  } catch(e) {
    console.error('Journal load error:', e?.message || JSON.stringify(e));
  }
}

// ─── MAP ──────────────────────────────────────────────────
let gmap = null;
let gmapMarkers = {};
const mapState = {};

const MAP_LOCATIONS = [
  { id:'beppu',     name:'Beppu (APU)',    lat:33.2846, lng:131.4910, emoji:'🏫', desc:'Home base — Ritsumeikan Asia Pacific University · AP House 1&2' },
  { id:'fukuoka',   name:'Fukuoka',        lat:33.5902, lng:130.4017, emoji:'✈', desc:'Gateway city · Hakata ramen · Program rendezvous May 17' },
  { id:'hiroshima', name:'Hiroshima',      lat:34.3853, lng:132.4553, emoji:'☮', desc:'Peace Memorial Museum · Miyajima Island' },
  { id:'kyoto',     name:'Kyoto',          lat:35.0116, lng:135.7681, emoji:'⛩', desc:'Fushimi Inari · Arashiyama · Nishiki Market' },
  { id:'osaka',     name:'Osaka',          lat:34.6937, lng:135.5023, emoji:'🏙', desc:'Dotonbori · street food · day trip from Kyoto (~15 min)' },
  { id:'tokyo',     name:'Tokyo',          lat:35.6762, lng:139.6503, emoji:'🗼', desc:'Shibuya · Shinjuku · Akihabara · Senso-ji' },
  { id:'miyajima',  name:'Miyajima Island',lat:34.2955, lng:132.3197, emoji:'⛩', desc:'Floating torii gate · day trip from Hiroshima by JR ferry' },
];

function initGoogleMap() {
  if (typeof google === 'undefined') return;
  gmap = new google.maps.Map(document.getElementById('googleMap'), {
    center: { lat: 34.5, lng: 135.0 }, zoom: 5, mapTypeId: 'roadmap',
    styles: [
      { featureType:'water',       elementType:'geometry',      stylers:[{color:'#a8d4f5'}] },
      { featureType:'landscape',   elementType:'geometry',      stylers:[{color:'#f0f4f0'}] },
      { featureType:'road',        elementType:'geometry',      stylers:[{color:'#ffffff'}] },
      { featureType:'poi',         elementType:'labels',        stylers:[{visibility:'off'}] },
      { featureType:'transit',     elementType:'labels.icon',   stylers:[{visibility:'off'}] },
      { featureType:'administrative.country', elementType:'geometry.stroke', stylers:[{color:'#c84f45'},{weight:1.5}] },
    ],
    disableDefaultUI: false, zoomControl: true, mapTypeControl: false, streetViewControl: false,
  });

  MAP_LOCATIONS.forEach(loc => {
    const isVisited = mapState[loc.id] === true;
    const marker = new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng }, map: gmap, title: loc.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: isVisited ? '#c84f45' : '#ffffff', fillOpacity: 1,
        strokeColor: isVisited ? '#922b21' : '#17182c', strokeWeight: 2.5,
        scale: isVisited ? 14 : 11,
      },
      label: { text: loc.emoji, fontSize: isVisited ? '16px' : '13px' },
      animation: google.maps.Animation.DROP,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family:'DM Sans',sans-serif;padding:6px 4px;min-width:180px;">
          <div style="font-size:15px;font-weight:700;color:#17182c;margin-bottom:4px;">${loc.emoji} ${loc.name}</div>
          <div style="font-size:12px;color:#5a5a72;line-height:1.5;margin-bottom:10px;">${loc.desc}</div>
          <button onclick="toggleMapPin('${loc.id}')"
            style="background:${mapState[loc.id]?'#c84f45':'#1f7a4d'};color:#fff;border:none;border-radius:6px;
                   padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer;width:100%;font-family:inherit;">
            ${mapState[loc.id] ? '✓ Visited — Click to Unmark' : '📍 Mark as Visited'}
          </button>
        </div>`
    });

    marker.addListener('click', () => {
      Object.values(gmapMarkers).forEach(m => { if(m.iw) m.iw.close(); });
      infoWindow.open(gmap, marker);
    });
    gmapMarkers[loc.id] = { marker, iw: infoWindow };
  });
}

function loadGoogleMapsScript() {
  if (document.getElementById('gmaps-script')) return;
  const s = document.createElement('script');
  s.id = 'gmaps-script';
  s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&callback=initGoogleMap`;
  s.async = true; s.defer = true;
  document.head.appendChild(s);
}

async function loadMapState() {
  try {
    // Only show pins that have a matching journal entry location
    // This ensures the map starts empty and pins only appear when Owen writes
    const [mapRes, journalRes] = await Promise.all([
      sb.from('map_visited').select('*'),
      sb.from('journal').select('location')
    ]);
    const visitedRows = mapRes.data || [];
    const journalLocs = (journalRes.data || []).map(e => resolveJournalPin(e.location)).filter(Boolean);
    const journalLocSet = new Set(journalLocs);

    // A pin is active only if map_visited says visited AND there is a journal entry for it
    visitedRows.forEach(r => {
      mapState[r.location] = r.visited && journalLocSet.has(r.location);
    });
    renderVisitedList();
    if (gmap) refreshMapMarkers();
  } catch(e) { console.error('Map state error:', e?.message || JSON.stringify(e)); }
}

function refreshMapMarkers() {
  MAP_LOCATIONS.forEach(loc => {
    const m = gmapMarkers[loc.id];
    if (!m) return;
    const visited = mapState[loc.id] === true;
    m.marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: visited ? '#c84f45' : '#ffffff', fillOpacity: 1,
      strokeColor: visited ? '#922b21' : '#17182c', strokeWeight: 2.5,
      scale: visited ? 14 : 11,
    });
    m.marker.setLabel({ text: MAP_LOCATIONS.find(l=>l.id===loc.id).emoji, fontSize: visited ? '16px' : '13px' });
  });
}

async function toggleMapPin(locId) {
  const newVal = !(mapState[locId] === true);
  mapState[locId] = newVal;
  renderVisitedList();
  if (gmap) refreshMapMarkers();
  Object.values(gmapMarkers).forEach(m => { if(m.iw) m.iw.close(); });
  try {
    await sb.from('map_visited').upsert(
      { location: locId, visited: newVal, updated_at: new Date().toISOString() },
      { onConflict: 'location' }
    );
  } catch(e) { console.error('Map pin error:', e?.message || JSON.stringify(e)); }
}

function markPinVisited(locId)  { mapState[locId] = true;  if(gmap) refreshMapMarkers(); }
function unmarkPin(locId)       { mapState[locId] = false; if(gmap) refreshMapMarkers(); }

function renderVisitedList() {
  const list = document.getElementById('visitedList');
  if (!list) return;
  const visited = MAP_LOCATIONS.filter(l => mapState[l.id] === true);
  if (!visited.length) {
    list.innerHTML = '<span style="font-size:13px;color:var(--muted);">Tap a pin on the map to mark locations as visited</span>';
    return;
  }
  list.innerHTML = visited.map(l =>
    `<span style="background:var(--red-light);color:var(--red);border-radius:16px;padding:5px 12px;font-size:13px;font-weight:600;">${l.emoji} ${l.name}</span>`
  ).join('');
}


// ─── CUSTOM TASKS ─────────────────────────────────────────
async function addTask() {
  const input = document.getElementById('taskInput');
  const who   = document.getElementById('taskWho');
  const btn   = document.getElementById('taskAddBtn');
  const text  = input?.value.trim();
  if (!text) { input?.focus(); return; }

  // Disable button while saving
  if (btn) btn.disabled = true;

  const task = {
    id: Date.now().toString(),
    text,
    who: who?.value || 'other',
    checked: false,
    created_at: new Date().toISOString()
  };

  try {
    const { error } = await sb.from('tasks').insert(task);
    if (error) throw error;
    input.value = '';
    // Only reload AFTER confirmed insert
    await loadTasks();
  } catch(e) {
    console.error('Task add error:', e?.message || JSON.stringify(e));
    const wrap = document.getElementById('taskList');
    if (wrap) {
      const errDiv = document.createElement('div');
      errDiv.style.cssText = 'color:var(--beni);font-size:12px;padding:8px 0;';
      const msg = e?.message || JSON.stringify(e);
      if (msg.includes('does not exist') || msg.includes('42P01')) {
        errDiv.textContent = '⚠ Setup needed: create a "tasks" table in Supabase. See instructions below.';
      } else {
        errDiv.textContent = '⚠ Could not save task: ' + msg;
      }
      wrap.prepend(errDiv);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function toggleTask(id, currentVal) {
  try {
    const { error } = await sb.from('tasks').update({ checked: !currentVal }).eq('id', id);
    if (error) throw error;
    await loadTasks();
  } catch(e) { console.error('Task toggle error:', e?.message || JSON.stringify(e)); }
}

async function deleteTask(id) {
  try {
    const { error } = await sb.from('tasks').delete().eq('id', id);
    if (error) throw error;
    await loadTasks();
  } catch(e) { console.error('Task delete error:', e?.message || JSON.stringify(e)); }
}

function renderTaskItem(task, container) {
  const whoClass = ['owen','mom','dad'].includes(task.who) ? task.who : 'other';
  const whoLabel = task.who.charAt(0).toUpperCase() + task.who.slice(1);
  const div = document.createElement('div');
  div.className = 'task-item';
  div.dataset.id = task.id;
  div.innerHTML = `
    <div class="cb-wrap" style="margin-top:1px;">
      <div class="cb-box${task.checked ? ' checked' : ''}" onclick="toggleTask('${task.id}',${task.checked})"></div>
    </div>
    <div class="cb-text${task.checked ? ' checked' : ''}" style="flex:1;">${task.text}</div>
    <span class="task-by ${whoClass}">${whoLabel}</span>
    <button class="task-del" onclick="deleteTask('${task.id}')" title="Delete">✕</button>
  `;
  container.appendChild(div);
}

async function loadTasks() {
  const wrap = document.getElementById('taskList');
  if (!wrap) return;
  try {
    const { data, error } = await sb.from('tasks').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    wrap.innerHTML = '';
    if (!data || !data.length) {
      wrap.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:13px;padding:10px 0;">No custom tasks yet — add one above!</div>';
      return;
    }
    data.forEach(task => renderTaskItem(task, wrap));
  } catch(e) {
    console.error('Task load error:', e?.message || JSON.stringify(e));
    const msg = e?.message || JSON.stringify(e);
    if (msg.includes('does not exist') || msg.includes('42P01')) {
      wrap.innerHTML = `<div style="color:var(--beni);font-size:12.5px;line-height:1.6;padding:8px 0;">
        ⚠ <strong>One-time setup needed.</strong> Create a <code>tasks</code> table in your Supabase project:<br><br>
        Go to Supabase → Table Editor → New table → name it <strong>tasks</strong> → add columns:<br>
        <code>id</code> (text, primary key) · <code>text</code> (text) · <code>who</code> (text) · <code>checked</code> (bool, default false) · <code>created_at</code> (timestamptz)
      </div>`;
    } else {
      wrap.innerHTML = '<div style="color:var(--beni);font-size:12px;padding:8px 0;">⚠ Could not load tasks — check connection</div>';
    }
  }
}


// ─── ADD CALENDAR EVENT ───────────────────────────────────
async function addCalendarEvent() {
  const title = document.getElementById('calTitle2')?.value.trim();
  const start = document.getElementById('calStart')?.value;
  const end   = document.getElementById('calEnd')?.value || null;
  const type  = document.getElementById('calType')?.value || 'activity';
  const who   = document.getElementById('calWho')?.value || 'Family';
  const notes = document.getElementById('calNotes')?.value.trim() || null;
  const fb    = document.getElementById('calAddFeedback');

  if (!title) { if(fb) fb.textContent = 'Please enter a title'; return; }
  if (!start) { if(fb) fb.textContent = 'Please pick a start date'; return; }
  if (end && end < start) { if(fb) fb.textContent = 'End date must be on or after start date'; return; }

  if (fb) fb.textContent = 'Saving…';
  const entry = {
    id: Date.now().toString(),
    title,
    start,
    end: end || start,
    type,
    name: who,
    notes,
    created_at: new Date().toISOString()
  };
  try {
    const { error } = await sb.from('itinerary').insert(entry);
    if (error) throw error;
    if (fb) fb.textContent = '✓ Added to calendar!';
    setTimeout(() => { if(fb) fb.textContent = ''; }, 3000);
    // clear fields
    ['calTitle2','calStart','calEnd','calNotes'].forEach(id => {
      const el = document.getElementById(id); if(el) el.value = '';
    });
    loadCalendar();
    loadCalendarEntries();
  } catch(e) {
    console.error('Calendar add error:', e?.message || JSON.stringify(e));
    if (fb) fb.textContent = '⚠ Error: ' + (e?.message || JSON.stringify(e));
  }
}

async function loadCalendarEntries() {
  const wrap = document.getElementById('calAddedList');
  if (!wrap) return;
  try {
    const { data } = await sb.from('itinerary').select('*').order('start', { ascending: true });
    if (!data || !data.length) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = `
      <h3 style="margin:16px 0 10px;">Your Added Events</h3>
      ${data.map(e => `
        <div class="task-item" style="align-items:center;">
          <div class="cb-text" style="flex:1;">
            <strong>${e.title}</strong>
            <span style="font-size:11px;color:var(--muted);margin-left:6px;">${e.start}${e.end && e.end!==e.start?' → '+e.end:''}</span>
          </div>
          <span class="task-by ${e.name?.toLowerCase()||'other'}" style="flex-shrink:0;">${e.name||'Family'}</span>
          <button class="task-del" onclick="deleteCalEntry('${e.id}')">✕</button>
        </div>
      `).join('')}
    `;
  } catch(e) { console.error('calEntries error:', e?.message||JSON.stringify(e)); }
}

async function deleteCalEntry(id) {
  if (!confirm('Remove this calendar entry?')) return;
  try {
    await sb.from('itinerary').delete().eq('id', id);
    loadCalendar();
    loadCalendarEntries();
  } catch(e) { console.error('delete cal error:', e?.message||JSON.stringify(e)); }
}

// ─── PROGRAM SCHEDULE ─────────────────────────────────────
const PROG_WEEKS = [
  {
    label: 'Arrival',
    dates: 'May 15–17, 2026',
    days: [
      { date:'Fri May 15', icon:'✈', label:'Depart Atlanta 5:30 AM · Arrive Dulles 7:17 AM · Depart Dulles 12:15 PM (NH101)' },
      { date:'Sat May 16', icon:'🛬', label:'Arrive Tokyo Haneda 3:20 PM JST · Depart 6:00 PM on NH267 · Arrive Fukuoka 7:55 PM · Check into hotel' },
      { date:'Sun May 17', icon:'🗾', label:'Free day — explore Fukuoka. Ramen, shrines, Ohori Park. ⚠ MEET at Fukuoka Airport Domestic Terminal at 7:00 PM SHARP. Bus to APU Beppu.' },
    ]
  },
  {
    label: 'Week 1',
    dates: 'May 18–24, 2026',
    note: 'Orientation week at APU Beppu. Move into AP House. Japanese placement test.',
    days: [
      { date:'Mon May 18', icon:'📝', label:'Pre-LBAT Japanese Language Test · Beppu City Tour orientation' },
      { date:'Tue May 19', icon:'💬', label:'Conversation Practicum 1 · Beppu Orientation' },
      { date:'Wed May 20', icon:'🗺', label:'Orientation / Scavenger Hunt around Beppu · オリエンテーション class' },
      { date:'Thu May 21', icon:'📚', label:'Conversation Practicum 2 · 科学技術日本語 (Sci/Tech Japanese) 1 & 2' },
      { date:'Fri May 22', icon:'📚', label:'Conversation Practicum 3 · 科学技術日本語 3 & 4' },
      { date:'Sat May 23', icon:'🆓', label:'Free day' },
      { date:'Sun May 24', icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 2',
    dates: 'May 25–31, 2026',
    note: 'Kagoshima multi-day trip — the big early-program adventure.',
    days: [
      { date:'Mon May 25', icon:'📚', label:'Conversation Practicum 4 · 科学技術日本語 5 & 6' },
      { date:'Tue May 26', icon:'📚', label:'科学技術日本語 7 & 8' },
      { date:'Wed May 27', icon:'🚌', label:'🗓 KAGOSHIMA TRIP begins — depart Beppu (program-arranged transport)' },
      { date:'Thu May 28', icon:'🌋', label:'Kagoshima — Sakurajima volcano, Sengan-en garden, local culture' },
      { date:'Fri May 29', icon:'🚌', label:'Kagoshima Trip day 3 — return to Beppu' },
      { date:'Sat May 30', icon:'🆓', label:'Free day — recover, explore Beppu onsens' },
      { date:'Sun May 31', icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 3',
    dates: 'Jun 1–7, 2026',
    note: 'Attack on Titan day trip and heavy coursework continues.',
    days: [
      { date:'Mon Jun 1',  icon:'📚', label:'Conversation Practicum 5 · 科学技術日本語 9 & 10' },
      { date:'Tue Jun 2',  icon:'🚌', label:'🗓 日田 / Attack on Titan Day Trip (Hita City — inspiration for AoT)' },
      { date:'Wed Jun 3',  icon:'📚', label:'科学技術日本語 11 & 12' },
      { date:'Thu Jun 4',  icon:'📚', label:'Conversation Practicum 6 · 科学技術日本語 13 & 14' },
      { date:'Fri Jun 5',  icon:'📚', label:'Conversation Practicum 7 · 科学技術日本語 15 & 16' },
      { date:'Sat Jun 6',  icon:'🆓', label:'Free day' },
      { date:'Sun Jun 7',  icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 4',
    dates: 'Jun 8–14, 2026',
    note: 'Cultural activities week — tea ceremony and calligraphy.',
    days: [
      { date:'Mon Jun 8',  icon:'🍵', label:'Conversation Practicum 8 · 科学技術日本語 17 · 茶道 Tea Ceremony' },
      { date:'Tue Jun 9',  icon:'✍', label:'Conversation Practicum 9 · 科学技術日本語 18 & 19 · 書道 Calligraphy' },
      { date:'Wed Jun 10', icon:'📚', label:'科学技術日本語 20 & 21' },
      { date:'Thu Jun 11', icon:'📚', label:'科学技術日本語 22 & 23' },
      { date:'Fri Jun 12', icon:'📚', label:'Conversation Practicum 10 · 科学技術日本語 24' },
      { date:'Sat Jun 13', icon:'🆓', label:'Free day — rainy season begins (tsuyu). Explore Beppu\'s indoor onsens.' },
      { date:'Sun Jun 14', icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 5',
    dates: 'Jun 15–21, 2026',
    note: 'Community engagement week + mandatory farm stay weekend.',
    days: [
      { date:'Mon Jun 15', icon:'🧘', label:'朝日寺 Zen Temple Visit · Elementary School Visit — cultural exchange with local kids' },
      { date:'Tue Jun 16', icon:'💬', label:'Conversation Practicum 11' },
      { date:'Wed Jun 17', icon:'🤝', label:'Conversation Practicum 12 · バディアクティビティ Buddy Activity with APU students' },
      { date:'Thu Jun 18', icon:'📰', label:'Japan Today 1 & 2 (new course begins)' },
      { date:'Fri Jun 19', icon:'🌾', label:'Conversation Practicum 13 · Japan Today 3 · 🗓 FARM STAY begins — depart to countryside host family farm' },
      { date:'Sat Jun 20', icon:'🌾', label:'Farm Stay day 2 — working on the farm with host family. Bring your omiyage gift.' },
      { date:'Sun Jun 21', icon:'🌾', label:'Farm Stay day 3 — return to APU' },
    ]
  },
  {
    label: 'Week 6',
    dates: 'Jun 22–28, 2026',
    note: 'Japan Today course intensifies. Rainy season peak.',
    days: [
      { date:'Mon Jun 22', icon:'📰', label:'Conversation Practicum 14 · Japan Today 4' },
      { date:'Tue Jun 23', icon:'📰', label:'Japan Today 5 & 6' },
      { date:'Wed Jun 24', icon:'📰', label:'Conversation Practicum 15 · Japan Today 7' },
      { date:'Thu Jun 25', icon:'📰', label:'Japan Today 8 & 9' },
      { date:'Fri Jun 26', icon:'📰', label:'Conversation Practicum 16 · Japan Today 10' },
      { date:'Sat Jun 27', icon:'🆓', label:'Free day' },
      { date:'Sun Jun 28', icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 7',
    dates: 'Jun 29 – Jul 5, 2026',
    note: 'Fukuoka overnight company visits. July 4th in Japan.',
    days: [
      { date:'Mon Jun 29', icon:'📰', label:'Conversation Practicum 17 · Japan Today 11' },
      { date:'Tue Jun 30', icon:'📰', label:'Conversation Practicum 18 · Japan Today 12' },
      { date:'Wed Jul 1',  icon:'🏢', label:'🗓 FUKUOKA TRIP — overnight company visits begin. Business casual required.' },
      { date:'Thu Jul 2',  icon:'🏢', label:'Fukuoka company visits day 2 — return to Beppu' },
      { date:'Fri Jul 3',  icon:'📚', label:'Classes resume at APU' },
      { date:'Sat Jul 4',  icon:'🇺🇸', label:'Free day 🇺🇸 Happy 4th of July from Beppu!' },
      { date:'Sun Jul 5',  icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 8',
    dates: 'Jul 6–12, 2026',
    note: 'Rakugo traditional comedy performance — a highlight of the program.',
    days: [
      { date:'Mon Jul 6',  icon:'📰', label:'Conversation Practicum 19 · Japan Today 13' },
      { date:'Tue Jul 7',  icon:'📰', label:'Japan Today 14' },
      { date:'Wed Jul 8',  icon:'📰', label:'Japan Today 15' },
      { date:'Thu Jul 9',  icon:'🎭', label:'Japan Today 16 · 🗓 落語 RAKUGO PERFORMANCE — traditional Japanese comedic storytelling. A truly unique experience.' },
      { date:'Fri Jul 10', icon:'📰', label:'Conversation Practicum 20 · Japan Today 17' },
      { date:'Sat Jul 11', icon:'🆓', label:'Free day' },
      { date:'Sun Jul 12', icon:'🆓', label:'Free day' },
    ]
  },
  {
    label: 'Week 9',
    dates: 'Jul 13–19, 2026',
    note: 'Final week — presentations, post-test, farewell ceremony. Program ends Jul 19.',
    days: [
      { date:'Mon Jul 13', icon:'🎤', label:'Conversation Presentations — Owen presents in Japanese · Japan Today 18' },
      { date:'Tue Jul 14', icon:'📰', label:'Japan Today 19' },
      { date:'Wed Jul 15', icon:'📰', label:'Japan Today 20' },
      { date:'Thu Jul 16', icon:'📝', label:'Post-LBAT Japanese Language Test — shows progress after 9 weeks' },
      { date:'Fri Jul 17', icon:'📰', label:'Japan Today wrap-up sessions' },
      { date:'Sat Jul 18', icon:'🎉', label:'Free day — Program winds down. Pack up AP House.' },
      { date:'Sun Jul 19', icon:'✅', label:'🗓 PROGRAM ENDS — depart APU. Solo travel begins. 9 weeks complete!' },
    ]
  },
];

let currentProgWeek = 0;

function initProgram() {
  showProgWeek(0, document.querySelector('#progWeekTabs .inner-tab'));
}

function showProgWeek(idx, btn) {
  currentProgWeek = idx;
  document.querySelectorAll('#progWeekTabs .inner-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const week = PROG_WEEKS[idx];
  if (!week) return;
  const wrap = document.getElementById('progWeekContent');
  if (!wrap) return;

  const typeIcon = { class:'📚', trip:'🚌', activity:'🎌', free:'🆓' };
  const noteHtml = week.note ? `<div class="tip-block" style="margin-bottom:12px;">${week.note}</div>` : '';

  wrap.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${week.label} &nbsp;<span style="font-weight:400;font-size:12px;color:var(--muted);">${week.dates}</span></div>
      </div>
      ${noteHtml}
      ${week.days.map(d => `
        <div class="sched-item">
          <div class="sched-time" style="min-width:90px;font-size:10px;">${d.date}</div>
          <div style="font-size:15px;flex-shrink:0;line-height:1;">${d.icon}</div>
          <div class="sched-body">
            <div class="sched-label">${d.label}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:10px;margin-top:4px;">
      ${idx > 0 ? `<button class="cal-nav" onclick="showProgWeek(${idx-1}, document.querySelectorAll('#progWeekTabs .inner-tab')[${idx-1}])">← Previous</button>` : '<span></span>'}
      ${idx < PROG_WEEKS.length-1 ? `<button class="cal-nav" style="margin-left:auto;" onclick="showProgWeek(${idx+1}, document.querySelectorAll('#progWeekTabs .inner-tab')[${idx+1}])">Next →</button>` : ''}
    </div>
  `;
}

// ─── INIT ─────────────────────────────────────────────────
async function init() {
  // Nav
  showTab('dashboard');

  // Clocks + countdown (live)
  updateClocks();
  setInterval(updateClocks, 1000);

  // Today's schedule
  renderTodaySchedule();

  // Checklist
  await loadChecklist();

  // Exchange rate + converter
  await loadExchangeRate();
  renderPresets();

  // Calendar (default month = May 2026)
  calYear = 2026; calMonth = 4;
  loadCalendar();

  // Events tab defaults
  updateCityFilters();
  renderEvents();

  // Map (load script when needed)
  loadGoogleMapsScript();
  loadMapState();

  // Realtime subscriptions
  subscribeRealtime();
}

init();

// Suppress DataCloneError from Supabase realtime in some browsers
window.addEventListener('unhandledrejection', e => {
  if (e.reason && e.reason.toString().includes('DataCloneError')) {
    e.preventDefault();
    console.warn('Realtime DataCloneError suppressed — data still syncs on next action.');
  }
});
