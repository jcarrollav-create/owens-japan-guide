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
const TABS = ['dashboard','prep','flights','calendar','events','journal','info'];

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

  sb.channel('itin-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'itinerary' }, () => {
      loadCalendar();
      renderTodaySchedule();
    }).subscribe();

  sb.channel('journal-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'journal' }, () => {
      loadJournal();
    }).subscribe();

  sb.channel('map-live')
    .on('postgres_changes', { event:'*', schema:'public', table:'map_visited' }, payload => {
      const { location, visited } = payload.new || {};
      if (!location) return;
      mapState[location] = visited;
      if (visited) markPinVisited(location); else unmarkPin(location);
      renderVisitedList();
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
    const { data } = await sb.from('map_visited').select('*');
    (data || []).forEach(r => { mapState[r.location] = r.visited; });
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
