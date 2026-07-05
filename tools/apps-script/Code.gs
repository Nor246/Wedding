/**
 * The Long Way Home — invitation backend
 * ---------------------------------------------------------------
 * Google Apps Script bound to the guest-list spreadsheet.
 * Serves the invite page at  https://nor246.github.io/Wedding/invite/
 *
 * What it does:
 *  - setup():        creates the Guests / Opens / RSVPs tabs (run once).
 *  - "Invitations" sheet menu: generate unique tokens + links for guests.
 *  - doPost():       the web-app endpoint the invite page talks to.
 *      action "open" — logs a link open (timestamp, ip, city, device),
 *                      returns the guest party's info for personalisation.
 *      action "rsvp" — records/updates a per-person RSVP for the party.
 *
 * Per-person RSVP: the "members" column holds the party's first names
 * (comma-separated). The invite page shows each name with a
 * Coming / Can't come toggle, everyone defaulting to Coming. The result
 * is stored readably in "member_rsvp", e.g.:  Anna ✓ · Sergey ✕
 *
 * Full setup instructions: SETUP.md (same folder in the repo).
 */

var SITE_URL = 'https://nor246.github.io/Wedding/invite/?g=';

var GUESTS = 'Guests';
var OPENS = 'Opens';
var RSVPS = 'RSVPs';

// One row in Guests = one invitation (a household / party).
var GUEST_HEADERS = [
  'token', 'party_name', 'lang', 'abroad', 'members', 'link',
  'last_opened_at', 'open_count', 'last_ip', 'last_city',
  'rsvp_status', 'attending_count', 'member_rsvp', 'restrictions',
  'arrival_date', 'message', 'responded_at'
];
var OPEN_HEADERS = ['timestamp', 'token', 'party', 'ip', 'city', 'user_agent', 'page_lang'];
var RSVP_HEADERS = ['timestamp', 'token', 'party', 'coming_count', 'member_rsvp', 'restrictions', 'arrival_date', 'message'];

var SEP = ' · ';   // joins member entries in member_rsvp
var YES = '✓', NO = '✕';

/* ================= Sheet menu ================= */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Invitations')
    .addItem('Generate links for new rows', 'generateLinks')
    .addSeparator()
    .addItem('Initialize sheet (run once)', 'setup')
    .addToUi();
}

/** Run once on a fresh spreadsheet: creates tabs, headers, formatting. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  ensureSheet(ss, GUESTS, GUEST_HEADERS);
  ensureSheet(ss, OPENS, OPEN_HEADERS);
  ensureSheet(ss, RSVPS, RSVP_HEADERS);

  var g = ss.getSheetByName(GUESTS);
  // Checkbox for the "abroad" flag (tick = guest arrives from abroad,
  // so the invite page asks for their arrival date).
  var abroadCol = GUEST_HEADERS.indexOf('abroad') + 1;
  g.getRange(2, abroadCol, Math.max(g.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  // Keep token + arrival_date as plain text (avoids date/number coercion).
  ['token', 'arrival_date'].forEach(function (name) {
    var c = GUEST_HEADERS.indexOf(name) + 1;
    g.getRange(2, c, Math.max(g.getMaxRows() - 1, 1), 1).setNumberFormat('@');
  });

  // A friendly hint row the couple can overwrite with their first guests.
  if (g.getLastRow() === 1) {
    g.getRange(2, 1, 1, 6).setValues([[
      '', 'Anna & Sergey  ← example, replace me', 'ru', true, 'Anna, Sergey', ''
    ]]);
  }
  SpreadsheetApp.getUi().alert(
    'Sheet initialised.\n\nAdd guests to "Guests": party_name, lang (en/ru/hy), tick abroad ' +
    'for guests flying in, and members — comma-separated first names, each of whom gets a ' +
    'Coming / Can\'t come toggle on the page.\n\nThen run Invitations → Generate links for new rows.');
}

function ensureSheet(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    // Reuse the default empty "Sheet1" for the first tab we create.
    var s1 = ss.getSheetByName('Sheet1');
    if (s1 && s1.getLastRow() === 0 && s1.getLastColumn() === 0) { s1.setName(name); sh = s1; }
    else sh = ss.insertSheet(name);
  }
  var head = sh.getRange(1, 1, 1, headers.length);
  head.setValues([headers]).setFontWeight('bold').setBackground('#efe6d4');
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, headers.length);
  return sh;
}

/** Fill token + link for every Guests row that has a party_name but no token yet. */
function generateLinks() {
  var sh = SpreadsheetApp.getActive().getSheetByName(GUESTS);
  var values = sh.getDataRange().getValues();
  var tCol = GUEST_HEADERS.indexOf('token');
  var nCol = GUEST_HEADERS.indexOf('party_name');
  var lCol = GUEST_HEADERS.indexOf('link');
  var existing = {};
  for (var i = 1; i < values.length; i++) existing[String(values[i][tCol]).trim()] = true;

  var made = 0;
  for (var r = 1; r < values.length; r++) {
    var name = String(values[r][nCol] || '').trim();
    var token = String(values[r][tCol] || '').trim();
    if (!name || token) continue;
    do { token = genToken(); } while (existing[token]);
    existing[token] = true;
    sh.getRange(r + 1, tCol + 1).setValue(token);
    sh.getRange(r + 1, lCol + 1).setValue(SITE_URL + token);
    made++;
  }
  SpreadsheetApp.getUi().alert(made
    ? 'Generated ' + made + ' link(s). Copy each guest\'s "link" cell and send it to them.'
    : 'Nothing to do — every named row already has a link.');
}

/** 10 chars, no ambiguous characters (0/O, 1/l), ~49 bits — unguessable. */
function genToken() {
  var a = 'abcdefghjkmnpqrstuvwxyz23456789', t = '';
  for (var i = 0; i < 10; i++) t += a.charAt(Math.floor(Math.random() * a.length));
  return t;
}

/* ================= Web app ================= */

function doGet() {
  return ContentService.createTextOutput(
    'The Long Way Home — RSVP service is running. Nothing to see here — ' +
    'open the invitation link you received instead.');
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === 'open') return handleOpen(body);
    if (body.action === 'rsvp') return handleRsvp(body);
    return json({ ok: false, error: 'unknown action' });
  } catch (err) {
    return json({ ok: false, error: 'bad request' });
  }
}

function handleOpen(b) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var found = findGuest(b.token);
    if (!found) return json({ ok: false, error: 'unknown token' });
    var sh = found.sheet, row = found.row, g = found.data;

    // Log + update tracking columns.
    SpreadsheetApp.getActive().getSheetByName(OPENS).appendRow([
      new Date(), found.token, g.party_name,
      str(b.ip, 64), str(b.city, 96), str(b.ua, 220), str(b.lang, 8)
    ]);
    setCell(sh, row, 'last_opened_at', new Date());
    setCell(sh, row, 'open_count', (Number(g.open_count) || 0) + 1);
    if (b.ip) setCell(sh, row, 'last_ip', str(b.ip, 64));
    if (b.city) setCell(sh, row, 'last_city', str(b.city, 96));

    var members = parseMembers(g.members, g.party_name);
    var rsvp = null;
    if (g.responded_at) {
      rsvp = {
        members: parseMemberRsvp(g.member_rsvp),
        restrictions: String(g.restrictions || ''),
        arrival: String(g.arrival_date || ''),
        message: String(g.message || '')
      };
    }
    return json({
      ok: true,
      guest: {
        party_name: String(g.party_name),
        lang: String(g.lang || '').toLowerCase() || 'en',
        abroad: g.abroad === true,
        members: members,
        rsvp: rsvp
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function handleRsvp(b) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var found = findGuest(b.token);
    if (!found) return json({ ok: false, error: 'unknown token' });
    var sh = found.sheet, row = found.row, g = found.data;

    // Per-person answers. Names are capped + cleaned; max 20 people.
    var members = [];
    if (b.members && b.members.length) {
      for (var i = 0; i < Math.min(b.members.length, 20); i++) {
        var m = b.members[i] || {};
        var nm = str(m.name, 80);
        if (nm) members.push({ name: nm, coming: m.coming === true });
      }
    }
    var comingCount = members.filter(function (m) { return m.coming; }).length;
    var memberRsvp = members.map(function (m) { return m.name + ' ' + (m.coming ? YES : NO); }).join(SEP);
    var restrictions = str(b.restrictions, 500);
    var arrival = str(b.arrival, 40);
    var message = str(b.message, 1000);

    SpreadsheetApp.getActive().getSheetByName(RSVPS).appendRow([
      new Date(), found.token, g.party_name, comingCount, memberRsvp, restrictions, arrival, message
    ]);
    setCell(sh, row, 'rsvp_status', comingCount > 0 ? 'coming' : 'declined');
    setCell(sh, row, 'attending_count', comingCount);
    setCell(sh, row, 'member_rsvp', memberRsvp);
    setCell(sh, row, 'restrictions', restrictions);
    setCell(sh, row, 'arrival_date', arrival);
    setCell(sh, row, 'message', message);
    setCell(sh, row, 'responded_at', new Date());
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

/* ================= Helpers ================= */

/** "Anna, Sergey" → ['Anna','Sergey']; falls back to the party name. */
function parseMembers(cell, partyName) {
  var list = String(cell || '').split(',')
    .map(function (s) { return s.replace(/\s+/g, ' ').trim(); })
    .filter(Boolean)
    .slice(0, 20);
  if (!list.length) list = [String(partyName || 'Guest').trim()];
  return list;
}

/** "Anna ✓ · Sergey ✕" → [{name:'Anna',coming:true},{name:'Sergey',coming:false}] */
function parseMemberRsvp(cell) {
  var s = String(cell || '').trim();
  if (!s) return [];
  return s.split(SEP).map(function (part) {
    part = part.trim();
    var coming = part.slice(-1) === YES;
    var name = part.replace(/\s*[✓✕]$/, '').trim();
    return { name: name, coming: coming };
  }).filter(function (m) { return m.name; });
}

function findGuest(token) {
  token = String(token || '').trim().toLowerCase();
  if (!token) return null;
  var sh = SpreadsheetApp.getActive().getSheetByName(GUESTS);
  var values = sh.getDataRange().getValues();
  var tCol = GUEST_HEADERS.indexOf('token');
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][tCol]).trim().toLowerCase() === token) {
      var data = {};
      GUEST_HEADERS.forEach(function (h, i) { data[h] = values[r][i]; });
      return { sheet: sh, row: r + 1, token: token, data: data };
    }
  }
  return null;
}

function setCell(sheet, row, header, value) {
  sheet.getRange(row, GUEST_HEADERS.indexOf(header) + 1).setValue(value);
}

function str(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
