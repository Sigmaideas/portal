/* ===========================================================
   SIGMA IDEAS 경영 포탈
   - 인사말 / 오늘 날짜 / 실시간 시계
   - 오늘의 경영 명언 (날짜 기준 결정론적 선택 → 하루에 한 번 바뀜)
   - 현재 위치 날씨 (Open-Meteo, API 키 불필요)
   =========================================================== */

/* ---------- 1. 인사말 · 날짜 · 시계 ---------- */

function greetingFor(hour) {
  if (hour < 5)  return '늦은 밤입니다';
  if (hour < 11) return '좋은 아침입니다';
  if (hour < 14) return '점심 무렵입니다';
  if (hour < 18) return '좋은 오후입니다';
  if (hour < 22) return '좋은 저녁입니다';
  return '오늘도 수고하셨습니다';
}

function renderDateTime() {
  const now = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  document.getElementById('greeting').textContent = greetingFor(now.getHours());
  document.getElementById('today').textContent =
    `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${days[now.getDay()]}요일`;

  const p = (n) => String(n).padStart(2, '0');
  document.getElementById('clock').textContent =
    `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
}

renderDateTime();
setInterval(renderDateTime, 1000);

/* ---------- 2. 오늘의 경영 명언 ---------- */

/**
 * 로컬 타임존 기준 "1970-01-01 이후 경과 일수"로 명언을 고른다.
 * 같은 날에는 몇 번을 새로고침해도 같은 명언이 나오고, 자정이 지나면 다음 명언으로 넘어간다.
 */
function renderQuote() {
  if (!Array.isArray(window.QUOTES) || QUOTES.length === 0) return;

  const now = new Date();
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayIndex = Math.floor(localMidnight.getTime() / 86400000);
  const q = QUOTES[((dayIndex % QUOTES.length) + QUOTES.length) % QUOTES.length];

  document.getElementById('quoteText').textContent = q.t;
  document.getElementById('quoteAuthor').textContent = `— ${q.a}`;
}

renderQuote();

/* ---------- 3. 날씨 (Open-Meteo) ---------- */

const SEOUL = { lat: 37.5665, lon: 126.9780, name: '서울' };

/** WMO weather code → 아이콘 / 한국어 설명 */
const WMO = {
  0:  ['맑음',            '☀️', '🌙'],
  1:  ['대체로 맑음',      '🌤️', '🌙'],
  2:  ['구름 조금',        '⛅',  '☁️'],
  3:  ['흐림',            '☁️', '☁️'],
  45: ['안개',            '🌫️', '🌫️'],
  48: ['짙은 안개',        '🌫️', '🌫️'],
  51: ['가랑비',          '🌦️', '🌧️'],
  53: ['이슬비',          '🌦️', '🌧️'],
  55: ['강한 이슬비',      '🌧️', '🌧️'],
  56: ['어는 가랑비',      '🌧️', '🌧️'],
  57: ['어는 이슬비',      '🌧️', '🌧️'],
  61: ['약한 비',          '🌦️', '🌧️'],
  63: ['비',              '🌧️', '🌧️'],
  65: ['강한 비',          '🌧️', '🌧️'],
  66: ['어는 비',          '🌧️', '🌧️'],
  67: ['강한 어는 비',      '🌧️', '🌧️'],
  71: ['약한 눈',          '🌨️', '🌨️'],
  73: ['눈',              '❄️', '❄️'],
  75: ['많은 눈',          '❄️', '❄️'],
  77: ['싸락눈',          '🌨️', '🌨️'],
  80: ['소나기',          '🌦️', '🌧️'],
  81: ['소나기',          '🌧️', '🌧️'],
  82: ['강한 소나기',      '⛈️', '⛈️'],
  85: ['소낙눈',          '🌨️', '🌨️'],
  86: ['강한 소낙눈',      '❄️', '❄️'],
  95: ['천둥번개',         '⛈️', '⛈️'],
  96: ['천둥번개 · 우박',   '⛈️', '⛈️'],
  99: ['천둥번개 · 우박',   '⛈️', '⛈️'],
};

function describe(code, isDay) {
  const e = WMO[code];
  if (!e) return { text: '—', icon: isDay ? '🌤️' : '🌙' };
  return { text: e[0], icon: isDay ? e[1] : e[2] };
}

/** 브라우저 위치 → 실패하거나 5초 넘게 걸리면 서울로 대체 */
function locate() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 30 * 60 * 1000 }
    );
  });
}

/** 좌표 → 지역명. 실패하면 null 을 돌려주고 호출부에서 무시한다. */
async function placeName(lat, lon) {
  try {
    const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client'
      + `?latitude=${lat}&longitude=${lon}&localityLanguage=ko`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    return d.city || d.locality || d.principalSubdivision || null;
  } catch {
    return null;
  }
}

async function renderWeather() {
  const set = (id, v) => { document.getElementById(id).textContent = v; };

  const coords = await locate();
  const lat = coords ? coords.lat : SEOUL.lat;
  const lon = coords ? coords.lon : SEOUL.lon;

  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + `?latitude=${lat}&longitude=${lon}`
      + '&current=temperature_2m,apparent_temperature,weather_code,is_day'
      + '&daily=temperature_2m_max,temperature_2m_min'
      + '&timezone=auto&forecast_days=1';

    const res = await fetch(url);
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const d = await res.json();

    const cur = d.current;
    const { text, icon } = describe(cur.weather_code, cur.is_day === 1);

    set('wxIcon', icon);
    set('wxTemp', Math.round(cur.temperature_2m));
    set('wxDesc', `${text} · 체감 ${Math.round(cur.apparent_temperature)}°`);
    set('wxRange',
      `최고 ${Math.round(d.daily.temperature_2m_max[0])}° / 최저 ${Math.round(d.daily.temperature_2m_min[0])}°`);

    // 위치 이름은 부가 정보라 실패해도 날씨 표시를 막지 않는다.
    const name = coords ? await placeName(lat, lon) : SEOUL.name;
    set('wxPlace', name || '현재 위치');
  } catch (err) {
    console.warn('weather failed:', err);
    set('wxIcon', '🌐');
    set('wxDesc', '날씨를 불러오지 못했습니다');
    set('wxPlace', '—');
    set('wxRange', '');
  }
}

renderWeather();
// 탭을 계속 열어두는 경우를 위해 30분마다 갱신
setInterval(renderWeather, 30 * 60 * 1000);
