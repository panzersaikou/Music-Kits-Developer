const paths = {
  film:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 4v16m10-16v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/>',
  restart:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  stop:'<rect x="5" y="5" width="14" height="14" rx="1" fill="currentColor"/>',
  photo:'<rect x="2.5" y="4" width="19" height="16" rx="1.5"/><circle cx="8" cy="9" r="1.3"/><path d="m4 18 5-5 3 3 4-6 5 8"/>',
  audio:'<path d="M3 10v4m4-8v12m5-15v18m5-15v12m4-8v4"/>',
  layers:'<path d="m12 2 10 5-10 5L2 7l10-5Zm10 10-10 5-10-5m20 5-10 5-10-5"/>',
  headphones:'<path d="M3 14v-3a9 9 0 0 1 18 0v3M3 13h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm18 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5Z"/>',
  menu:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  flag:'<path d="M5 21V4c5-5 9 5 14 0v11c-5 5-9-5-14 0"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  win:'<path d="m3 17 6-6 4 4 8-9m-6 0h6v6"/>',
  loss:'<path d="m3 7 6 6 4-4 8 9m-6 0h6v-6"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 7v4l2 2"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
  eye:'<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2"/>',
  arrow:'<path d="m9 6 6 6-6 6"/>',
  play:'<path d="m8 5 12 7-12 7Z" fill="currentColor"/>',
  pause:'<path d="M9 5v14m6-14v14" stroke-width="3"/>',
  repeat:'<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
  volume:'<path d="M3 9v6h4l5 4V5L7 9H3Zm13 0a4 4 0 0 1 0 6m2-9a8 8 0 0 1 0 12"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5"/>',
};
const icon = (name) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
const scenes = [
  ['menu', '主界面音乐', 'MAIN MENU', '进入检视时播放，场景试听结束后循环播放。', 120],
  ['flag', '回合时间冻结', 'FREEZE TIME', '回合购买阶段的音乐。', 15],
  ['bolt', '开始行动', 'ROUND ACTION', '冻结时间结束，玩家开始移动。', 8],
  ['eye', '阵亡', 'DEATH CAMERA', '角色阵亡后的音乐。', 5],
  ['team', '选择阵营', 'TEAM SELECT', '选择阵营时的背景音乐。', 15],
  ['plant', '下包后音乐', 'BOMB PLANTED', 'CS2 默认下包倒计时为 40 秒。先编排十秒警告时，会从警告结尾向前取最多 40 秒。', 40],
  ['timer', '十秒警告', 'TEN SECOND WARNING', '先编排下包后音乐时，会取它的最后 10 秒作为警告。', 10],
  ['win', '回合胜利', 'ROUND WIN', '队伍获得回合胜利时播放。', 7],
  ['loss', '回合失败', 'ROUND LOSS', '队伍输掉回合时播放。', 7],
  ['star', 'MVP 凯歌', 'MVP ANTHEM', '获得回合 MVP 时播放的个人凯歌。', 8],
  ['star2', 'MVP 凯歌 II', 'MVP ANTHEM II', '第二首可选凯歌。', 8],
  ['star3', 'MVP 凯歌 III', 'MVP ANTHEM III', '第三首可选凯歌。', 8],
];
const emptyKit = () => ({name:'', note:'', stat:false, count:0, variants:1});
const kit = emptyKit();
let boardId = 'current';
const boards = new Map([['current', '未命名工作台']]);
const unsavedBoards = new Map();
const sceneLevels = new Map();
const visibleScenes = () => scenes.slice(0, scenes.length - 3 + kit.variants);
const recommended = () => scenes.find(([id]) => id === scene)[4];
let editorScene = 'menu';
let background, backgroundUrl;
let mapPreset = 'courtyard';
const $ = (id) => document.getElementById(id);
const previewManifest = $('kit-preview');
const studioScript = document.currentScript;
const studioMarkup = previewManifest ? '' : ['header.top', 'main.shell', '#clip-editor']
  .map(selector => document.querySelector(selector).outerHTML).join('\n');
let exporting = false;
if (!studioScript.src && !previewManifest) {
  const offlineDownload = $('offline-download');
  offlineDownload.href = location.href.split('#')[0];
  offlineDownload.download = 'music-kit-studio.html';
  offlineDownload.textContent = '下载离线 HTML';
  offlineDownload.hidden = location.protocol === 'file:';
}
document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
const assets = new Map();
const cuts = new Map();
const opened = [];
const buffers = new Map();
const peaks = new Map();
const scenePositions = new Map();
const fades = new Map();
const defaultFade = new Set(['star', 'star2', 'star3', 'win', 'loss']);
const fadeSetting = (id = scene) => ({enabled: defaultFade.has(id), seconds: 1.5, inEnabled: false, inSeconds: 1, ...fades.get(id)});
const draft = new Map();
let selected;
let scene = scenes[0][0];
let inspecting = false;
let context;
let master;
let active;
let movie;
let frame;
let playbackRequest = 0;
let pendingKind;
let trimPlayback;
let editing;
let cover;
let coverUrl;
const playing = (kind) => active?.kind === kind || pendingKind === kind;
let busy = true;
const rateOf = piece => assets.get(piece.asset)?.rate || 1;
const pieceDuration = piece => (piece.end - piece.start) / rateOf(piece);
const durationOf = clips => clips.reduce((total, clip) => total + pieceDuration(clip), 0);
const pairedScene = {plant: 'timer', timer: 'plant'};
function tailClips(clips, seconds) {
  let skip = Math.max(0, durationOf(clips) - seconds);
  const tail = [];
  for (const clip of clips) {
    const length = pieceDuration(clip);
    if (skip >= length) {
      skip -= length;
    } else {
      tail.push({...clip, start: clip.start + skip * rateOf(clip)});
      skip = 0;
    }
  }
  return tail;
}
function sceneClips(id) {
  if (cuts.has(id)) return cuts.get(id);
  const source = cuts.get(pairedScene[id]);
  if (!source?.length) return [];
  if (id === 'timer') return tailClips(source, 10);
  const clips = tailClips(source, 40);
  const first = clips[0];
  if (first) {
    const missing = Math.max(0, 40 - durationOf(clips));
    first.start = Math.max(0, first.start - missing * rateOf(first));
  }
  return clips;
}
const clipList = () => sceneClips(scene);
const playableDuration = () => durationOf(clipList());
function initialWindow(duration) {
  return {start: 0, end: Math.min(duration, scene === 'menu' ? duration : recommended()), position: 0};
}
const format = (seconds) => {
  const centis = Math.round(Math.max(0, seconds) * 100);
  return Math.floor(centis / 6000) + ':' + String(Math.floor(centis / 100) % 60).padStart(2, '0') + '.' + String(centis % 100).padStart(2, '0');
};
const button = (label, action, className = 'secondary') => {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = className;
  element.textContent = label;
  element.onclick = action;
  return element;
};
function notify(text = '') {
  const region = $(inspecting ? 'inspect-message' : 'message');
  region.textContent = text;
  region.hidden = !text;
}
function sound() {
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = Number($('volume').value);
    master.connect(context.destination);
  }
  return context;
}
function updateMasterVolume(event) {
  const level = event.target.valueAsNumber;
  $('volume').value = $('inspect-volume').value = level;
  $('inspect-volume-value').value = Math.round(level * 100) + '%';
  if (master) master.gain.setTargetAtTime(level, context.currentTime, .008);
}
$('volume').oninput = $('inspect-volume').oninput = updateMasterVolume;

async function decode(blob) {
  return sound().decodeAudioData(await blob.arrayBuffer());
}
async function bufferFor(id) {
  if (!buffers.has(id)) {
    const asset = assets.get(id);
    const pending = asset.previewAudio
      ? sound().decodeAudioData(readEmbeddedBytes(asset.previewAudio).buffer)
      : decode(asset.blob);
    buffers.set(id, pending);
    pending.catch(() => buffers.delete(id));
  }
  return buffers.get(id);
}
function extractPeaks(buffer, start = 0, end = buffer.duration) {
  const values = new Float32Array(360);
  const channels = Array.from({length: buffer.numberOfChannels}, (_, i) => buffer.getChannelData(i));
  const first = Math.floor(start * buffer.sampleRate);
  const length = Math.min(buffer.length, Math.ceil(end * buffer.sampleRate)) - first;
  for (let bucket = 0; bucket < values.length; bucket++) {
    const from = first + Math.floor(bucket * length / values.length);
    const to = first + Math.floor((bucket + 1) * length / values.length);
    for (const samples of channels) {
      for (let i = from; i < to; i += 3) values[bucket] = Math.max(values[bucket], Math.abs(samples[i]));
    }
  }
  return values;
}
function viewport(detail = false) {
  const state = detail ? editing : draft.get(selected);
  const total = detail && editing ? editing.clip.end - editing.clip.start : assets.get(selected)?.duration || 0;
  const scale = state?.scale || 1;
  const span = total / scale;
  const left = Math.max(0, Math.min(state?.left || 0, total - span));
  return {state, scale, total, span, left, right: left + span};
}
function drawWave(detail = false) {
  const {state, scale, total, span, left, right} = viewport(detail);
  const prefix = detail ? 'detail' : 'source';
  const canvas = $(detail ? 'detail-wave' : 'wave');
  if (!detail) {
    paintWave($('overview-wave'), peaks.get(selected));
    $('overview-region').style.left = (total ? left / total * 100 : 0) + '%';
    $('overview-region').style.width = (total ? span / total * 100 : 0) + '%';
    $('overview-nav').disabled = !state;
    $('overview-nav').max = total || 1;
    $('overview-nav').value = state?.position || 0;
    $('hand').disabled = scale === 1;
  }
  $(prefix + '-scale').value = scale + '×';
  $(prefix + '-minus').disabled = !state || scale === 1;
  $(prefix + '-plus').disabled = !state || scale === 64;
  const pan = $(prefix + '-pan');
  pan.max = total - span;
  pan.value = left;
  pan.disabled = !state || scale === 1;
  $(prefix + '-range').textContent = total ? format(left) + ' – ' + format(right) : '';
  if (!state) return paintWave(canvas);
  const id = detail ? editing.clip.asset : selected;
  if (!detail && scale === 1) return paintWave(canvas, peaks.get(id));
  const base = detail ? editing.clip.start : 0;
  bufferFor(id).then(audio => {
    const current = viewport(detail);
    if (state === current.state && left === current.left && scale === current.scale)
      paintWave(canvas, extractPeaks(audio, base + left, base + right));
  }).catch(() => paintWave(canvas));
}
for (const prefix of ['source', 'detail']) {
  const detail = prefix === 'detail';
  function refresh() {
    drawWave(detail);
    if (detail) detailRegion();
    else { syncTrim(); renderTimes(); }
  }
  for (const [key, factor] of [['minus', .5], ['plus', 2]]) {
    $(prefix + '-' + key).onclick = () => {
      const {state, total, span, left, right, scale} = viewport(detail);
      if (!state) return;
      const focus = detail ? $('local-in').valueAsNumber : state.position;
      const anchor = focus >= left && focus <= right ? focus : left + span / 2;
      state.scale = Math.max(1, Math.min(64, scale * factor));
      state.left = Math.max(0, Math.min(total - total / state.scale, anchor - total / state.scale / 2));
      refresh();
    };
  }
  $(prefix + '-pan').oninput = event => {
    viewport(detail).state.left = Number(event.target.value);
    refresh();
  };
}
function paintWave(canvas, values) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  const pen = canvas.getContext('2d');
  pen.scale(ratio, ratio);
  pen.fillStyle = '#3a2e28';
  pen.fillRect(0, rect.height / 2, rect.width, 1);
  if (!values) return;
  const stride = Math.max(1, Math.ceil(values.length / (rect.width / 2.6)));
  const width = rect.width * stride / values.length;
  pen.fillStyle = '#e8945a';
  for (let i = 0; i < values.length; i += stride) {
    const height = Math.max(1, Math.sqrt(values[i]) * rect.height * .86);
    pen.fillRect(i * rect.width / values.length, (rect.height - height) / 2, Math.max(1, width - 1.3), height);
  }
}
new ResizeObserver(() => drawWave()).observe($('source-timeline'));

function timePlaying() {
  return active ? Math.min(active.end, active.position + Math.max(0, context.currentTime - active.start) * active.clockRate) : 0;
}
function putPosition(kind, position) {
  if (kind === 'source' && selected) draft.get(selected).position = position;
  if (kind === 'clip' && editing) editing.position = position;
  if (kind === 'scene') scenePositions.set(scene, position);
}
function stop() {
  playbackRequest++;
  pendingKind = undefined;
  cancelAnimationFrame(frame);
  if (active) {
    putPosition(active.kind, timePlaying());
    for (const node of active.nodes) {
      node.stop();
      node.disconnect();
    }
    if (active.output !== master) active.output.disconnect();
    active = undefined;
  }
  renderTimes();
}
function enterMusic(id) {
  endMovie(false);
  stop();
  changeScene(id);
  scenePositions.set(id, 0);
  if (sceneClips(id).length) playScene();
  else renderTimes();
}
function finishPlayback() {
  if (movie) return finishMoviePart();
  const resumeMenu = inspecting && active?.kind === 'scene';
  stop();
  if (resumeMenu && (!previewManifest || sceneClips('menu').length)) enterMusic('menu');
}
function tick() {
  if (!active) return;
  if (timePlaying() >= active.end) {
    finishPlayback();
    return;
  }
  putPosition(active.kind, timePlaying());
  renderTimes();
  frame = requestAnimationFrame(tick);
}
async function play(kind, pieces, position, limit = durationOf(pieces)) {
  stop();
  if (limit <= 0) return;
  const request = playbackRequest;
  pendingKind = kind;
  putPosition(kind, position);
  renderTimes();
  try {
    const ctx = sound();
    const [, audio] = await Promise.all([
      ctx.resume(),
      Promise.all(pieces.map((piece) => bufferFor(piece.asset))),
    ]);
    if (request !== playbackRequest) return;
    pieces.forEach((piece, i) => { if (piece.gate) noiseEnvelope(audio[i]); });
    pendingKind = undefined;
    const start = ctx.currentTime + .025;
    const nodes = [];
    let offset = 0;
    const fade = fadeSetting();
    const output = kind === 'scene' && (fade.enabled || fade.inEnabled)
      ? sceneFade(ctx, start, position, durationOf(pieces), fade) : master;
    const clockRate = kind === 'source' ? rateOf(pieces[0]) : 1;
    active = {kind, position, end: limit, start, nodes, output, clockRate};
    for (const [i, piece] of pieces.entries()) {
      const rate = rateOf(piece);
      const end = offset + pieceDuration(piece) * clockRate;
      const from = Math.max(position, offset);
      const to = Math.min(limit, end);
      if (to > from) {
        const when = start + (from - position) / clockRate;
        const span = (to - from) / clockRate;
        const sampleOffset = piece.start + (from - offset) * rate / clockRate;
        const level = (assets.get(piece.asset).level ?? 1) * (piece.level ?? 1) * (kind === 'scene' ? sceneLevels.get(scene) ?? 1 : 1);
        const source = schedulePiece(ctx, output, audio[i], when, sampleOffset, span, rate, level, piece.gate);
        nodes.push(source);
      }
      offset = end;
    }
    const last = nodes.at(-1);
    if (last) last.addEventListener('ended', () => {
      if (active?.nodes === nodes) finishPlayback();
    });
    tick();
  } catch {
    if (request !== playbackRequest) return;
    if (movie) endMovie(true);
    else stop();
    notify('无法播放这段音频，请重新导入或尝试 WAV / MP3。');
  }
}
function schedulePiece(ctx, output, audio, when, offset, span, rate, level, gate) {
  const source = ctx.createBufferSource();
  source.buffer = audio;
  source.playbackRate.value = rate;
  const mix = ctx.createGain();
  mix.gain.value = level;
  mix.connect(output);
  source.addEventListener('ended', () => mix.disconnect(), {once:true});
  if (gate) connectNoiseGate(source, when, offset, span, mix, rate);
  else source.connect(mix);
  source.start(when, offset, span * rate);
  return source;
}
function playSource(trimOnly = false) {
  const asset = assets.get(selected);
  if (!asset) return;
  if (playing('source') && (!trimOnly || trimPlayback)) return stop();
  const entry = draft.get(selected);
  const resumeTrim = trimPlayback?.asset === selected && trimPlayback.start === entry.start &&
    trimPlayback.end === entry.end && entry.position >= entry.start && entry.position < entry.end;
  const position = trimOnly && !resumeTrim ? entry.start : entry.position >= asset.duration ? 0 : entry.position;
  trimPlayback = trimOnly ? {asset: selected, start: entry.start, end: entry.end} : undefined;
  void play('source', [{asset: selected, start: 0, end: asset.duration}], position, trimOnly ? entry.end : asset.duration);
}
function sceneFade(ctx, start, position, duration, fade, destination = master) {
  const output = ctx.createGain();
  const attack = fade.inEnabled ? fade.inSeconds : 0;
  const release = fade.enabled ? fade.seconds : 0;
  const scale = Math.min(1, duration / (attack + release));
  const attackEnd = attack * scale;
  const releaseStart = Math.max(attackEnd, duration - release * scale);
  const remaining = duration - position;
  const initial = Math.min(1, attack ? position / attackEnd : 1, release ? remaining / (release * scale) : 1);
  output.gain.setValueAtTime(initial, start);
  if (position < attackEnd) output.gain.linearRampToValueAtTime(1, start + (attackEnd - position));
  if (release) {
    if (position < releaseStart && releaseStart > attackEnd) {
      output.gain.setValueAtTime(1, start + (releaseStart - position));
    }
    output.gain.linearRampToValueAtTime(0, start + remaining);
  }
  output.connect(destination);
  return output;
}
function updateFade(setting) {
  const resume = playing('scene');
  if (resume) stop();
  fades.set(scene, setting);
  renderFade();
  save();
  if (resume) playScene();
}
function renderFade() {
  const setting = fadeSetting();
  for (const control of fadeControls) {
    const enabled = setting[control.enabled];
    const toggle = $(control.id + '-toggle');
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = control.label + (enabled ? ' · 开' : ' · 关');
    $(control.id + '-duration').value = setting[control.seconds];
    $(control.id + '-duration').disabled = !enabled;
    $(control.id + '-preview').disabled = !playableDuration();
  }
}
const fadeControls = [
  {id:'fade-in', label:'开头淡入', enabled:'inEnabled', seconds:'inSeconds'},
  {id:'fade', label:'结尾淡出', enabled:'enabled', seconds:'seconds'},
];
for (const control of fadeControls) {
  $(control.id + '-toggle').onclick = () => {
    const setting = fadeSetting();
    updateFade({...setting, [control.enabled]: !setting[control.enabled]});
  };
  $(control.id + '-duration').onchange = event =>
    updateFade({...fadeSetting(), [control.seconds]: Number(event.target.value)});
  $(control.id + '-preview').onclick = () => {
    const end = playableDuration();
    const span = Math.min(end, fadeSetting()[control.seconds] + .5);
    const offset = control.id === 'fade-in' ? 0 : end - span;
    void play('scene', clipList(), offset, offset + span);
  };
}
function playScene() {
  if (playing('scene')) return stop();
  const clips = clipList();
  const duration = playableDuration();
  const position = scenePositions.get(scene) || 0;
  void play('scene', clips, position >= duration ? 0 : position, duration);
}
function seek(kind, position) {
  const resume = active?.kind === kind;
  const limit = resume ? active.end : 0;
  stop();
  putPosition(kind, position);
  renderTimes();
  if (!resume) return;
  if (kind === 'scene') {
    if (position < limit) void play('scene', clipList(), position, limit);
  } else {
    const asset = assets.get(selected);
    const end = position < limit ? limit : asset.duration;
    if (position < end) void play('source', [{asset: selected, start: 0, end: asset.duration}], position, end);
  }
}
function setTime(id, position, end) {
  $(id).max = end || 1;
  $(id).value = position;
  $(id).disabled = !end;
}
function renderTimes() {
  const source = assets.get(selected);
  const position = draft.get(selected)?.position || 0;
  const total = playableDuration();
  const sceneTime = scenePositions.get(scene) || 0;
  $('source-time').textContent = format(position);
  $('source-end').textContent = format(source?.duration || 0);
  const view = viewport();
  $('source-cursor').style.left = (view.span ? (position - view.left) / view.span * 100 : 0) + '%';
  const sourcePlaying = playing('source');
  const glyph = sourcePlaying ? 'pause' : 'play';
  if ($('source-play').dataset.glyph !== glyph) {
    $('source-play').dataset.glyph = glyph;
    $('source-play').innerHTML = icon(glyph);
    $('source-play').setAttribute('aria-label', sourcePlaying ? '暂停素材' : '播放素材');
  }
  $('trim-play').textContent = sourcePlaying && trimPlayback ? '暂停选区' : '试听选区';
  $('edit-listen').textContent = playing('clip') ? '暂停试听' : '试听结果';
  $('vinyl').classList.toggle('spinning', inspecting && active?.kind === 'scene');
  $('overview-nav').value = position;
  $('source-seek').min = view.left;
  setTime('source-seek', position, view.right);
  $('scene-cursor').style.left = ((total ? sceneTime / total : 0) * 100) + '%';
  $('scene-time').textContent = format(sceneTime);
  $('scene-length').textContent = format(total);
  const part = movie?.parts[movie.index];
  const start = part?.start ?? 0;
  const end = part?.end ?? total;
  $('inspect-time').textContent = format(Math.max(0, Math.min(end, sceneTime) - start)) + ' / ' + format(end - start);
  setTime('scene-seek', sceneTime, total);
  $('inspect-seek').min = start;
  setTime('inspect-seek', sceneTime, end);
  if (movie?.gap) $('inspect-seek').disabled = true;
  $('scene-play').textContent = playing('scene') ? '暂停' : '试听场景';
  const inspectPlaying = movie ? !movie.paused : active?.kind === 'scene';
  const inspectLabel = inspectPlaying ? '暂停' : '播放';
  const inspectGlyph = inspectPlaying ? 'pause' : 'play';
  if ($('inspect-play').dataset.glyph !== inspectGlyph) {
    $('inspect-play').innerHTML = icon(inspectGlyph);
    $('inspect-play').dataset.glyph = inspectGlyph;
    $('inspect-play').setAttribute('aria-label', inspectLabel);
  }

}
for (const [id, kind] of [['source-seek', 'source'], ['scene-seek', 'scene'], ['inspect-seek', 'scene']]) {
  const slider = $(id);
  let scrubbing = false;
  let resume = false;
  let scrubMovie;
  slider.addEventListener('pointerdown', () => {
    scrubbing = true;
    scrubMovie = id === 'inspect-seek' ? movie : undefined;
    if (scrubMovie) {
      resume = !movie.paused;
      if (resume) toggleMoviePause();
      return;
    }
    resume = active?.kind === kind;
    if (resume) stop();
  });
  slider.addEventListener('input', () => {
    const position = Number(slider.value);
    if (id === 'inspect-seek' && movie) {
      stop();
      putPosition(kind, position);
      if (movie.paused) renderTimes();
      else resumeMoviePart();
    } else seek(kind, position);
  });
  function finish() {
    if (!scrubbing) return;
    scrubbing = false;
    if (scrubMovie) {
      if (scrubMovie === movie && resume && movie.paused) toggleMoviePause();
      scrubMovie = undefined;
      return;
    }
    const end = kind === 'source' ? assets.get(selected)?.duration : playableDuration();
    if (!resume || Number(slider.value) >= end) return;
    if (kind === 'source') playSource();
    else playScene();
  }
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
}
$('source-play').onclick = () => playSource();
$('trim-play').onclick = () => playSource(true);
$('scene-play').onclick = playScene;
$('inspect-play').onclick = () => {
  if (movie) return toggleMoviePause();
  if (pendingKind === 'scene' && context?.state === 'suspended') void context.resume();
  else playScene();
};

function openAsset(id) {
  if (selected !== id) stop();
  if (!opened.includes(id)) opened.push(id);
  selected = id;
  const asset = assets.get(id);
  if (!draft.has(id)) draft.set(id, initialWindow(asset.duration));
  if (!peaks.has(id)) {
    bufferFor(id).then((value) => {
      if (!assets.has(id)) return;
      peaks.set(id, extractPeaks(value));
      if (selected === id) drawWave();
    }).catch(() => {
      if (selected === id) notify('暂时无法显示波形或播放该素材。');
    });
  }
  renderSources();
}
function closeAsset(id) {
  if (selected === id) stop();
  const index = opened.indexOf(id);
  if (index >= 0) opened.splice(index, 1);
  if (selected === id) {
    selected = undefined;
    if (opened.length) openAsset(opened[Math.min(index, opened.length - 1)]);
  }
  renderSources();
}
function deleteAsset(id) {
  const asset = assets.get(id);
  if (!asset || busy) return;
  let affected = 0;
  for (const clips of cuts.values()) affected += clips.filter(clip => clip.asset === id).length;
  if (affected && !window.confirm('删除「' + asset.name + '」也将移除本工作台中引用它的 ' + affected + ' 个片段。继续删除？')) return;
  if (playing('scene') && clipList().some(clip => clip.asset === id)) stop();
  for (const [key, clips] of cuts) {
    const remaining = clips.filter(clip => clip.asset !== id);
    if (remaining.length === clips.length) continue;
    if (!remaining.length && pairedScene[key]) cuts.delete(key);
    else cuts.set(key, remaining);
    scenePositions.delete(key);
    if (pairedScene[key] && !cuts.has(pairedScene[key])) scenePositions.delete(pairedScene[key]);
  }
  if (!cuts.get('plant')?.length && !cuts.get('timer')?.length) {
    cuts.delete('plant');
    cuts.delete('timer');
  }
  closeAsset(id);
  for (const map of [assets, buffers, peaks, draft]) map.delete(id);
  renderSources();
  renderScene();
  save();
  notify('已从当前工作台删除「' + asset.name + '」。');
}
function renderSources() {
  $('source-count').textContent = assets.size + ' 段';
  $('sources').replaceChildren();
  for (const asset of assets.values()) {
    const row = button(asset.name, () => openAsset(asset.id), 'asset');
    row.title = asset.name;
    const time = document.createElement('small');
    time.textContent = format(asset.duration);
    row.append(time);
    row.setAttribute('aria-pressed', String(asset.id === selected));
    const group = document.createElement('div');
    group.className = 'library-item';
    const remove = button('', () => deleteAsset(asset.id), 'asset-delete icon-button');
    remove.innerHTML = icon('trash');
    remove.title = remove.ariaLabel = '删除素材 ' + asset.name;
    group.append(row, remove);
    $('sources').append(group);
  }
  $('opened').replaceChildren();
  for (const id of opened) {
    const group = document.createElement('div');
    group.className = 'asset-tab';
    const tab = button(assets.get(id).name, () => openAsset(id), 'asset-tab-name');
    tab.setAttribute('aria-pressed', String(id === selected));
    tab.title = assets.get(id).name;
    const close = button('×', () => closeAsset(id), 'close');
    close.setAttribute('aria-label', '关闭 ' + assets.get(id).name);
    group.append(tab, close);
    $('opened').append(group);
  }
  const asset = assets.get(selected);
  $('asset-rate').disabled = $('asset-level').disabled = !asset;
  $('asset-rate').value = asset?.rate || 1;
  $('asset-level').value = Math.round((asset?.level ?? 1) * 100);
  $('asset-level-text').textContent = $('asset-level').value + '%';
  $('source-title').textContent = asset?.name || '选择一段素材';
  $('source-length').textContent = asset ? format(asset.duration) : '';
  for (const id of ['source-play', 'trim-play', 'in', 'out', 'mark-in', 'mark-out', 'add']) $(id).disabled = !asset;
  syncTrim();
  renderTimes();
  drawWave();
}
function syncTrim() {
  const entry = draft.get(selected);
  const duration = assets.get(selected)?.duration || 0;
  $('in').max = duration;
  $('out').max = duration;
  $('in').value = entry ? Number(entry.start.toFixed(4)) : '';
  $('out').value = entry ? Number(entry.end.toFixed(4)) : '';
  const shade = $('trim-shade');
  const grip = $('window-grip');
  const length = entry ? entry.end - entry.start : 0;
  $('window-length').disabled = !entry;
  $('window-length').max = duration;
  $('window-length').value = entry ? Number(length.toFixed(4)) : '';
  $('fit-window').hidden = false;
  $('fit-window').disabled = !entry;
  $('add').disabled = !entry;
  grip.hidden = !entry;
  shade.hidden = !entry;
  $('trim-in').hidden = !entry;
  $('trim-out').hidden = !entry;
  if (entry) {
    const view = viewport();
    const x = time => (time - view.left) / view.span * 100;
    grip.hidden = entry.end <= view.left || entry.start >= view.right;
    $('trim-in').hidden = $('trim-out').hidden = grip.hidden;
    const left = Math.max(0, x(entry.start));
    const right = Math.min(100, x(entry.end));
    $('trim-in').style.left = left + '%';
    $('trim-out').style.left = right + '%';
    const pixelWidth = (right - left) * $('source-timeline').clientWidth / 100;
    $('source-timeline').classList.toggle('thin-selection', pixelWidth < 30);
    shade.style.left = Math.max(0, x(entry.start)) + '%';
    shade.style.width = Math.max(0, Math.min(100, x(entry.end)) - Math.max(0, x(entry.start))) + '%';
    grip.style.left = shade.style.left;
    grip.style.width = shade.style.width;
    grip.setAttribute('aria-valuemax', String(duration - length));
    grip.setAttribute('aria-valuenow', String(entry.start));
    grip.setAttribute('aria-valuetext', format(entry.start) + ' 至 ' + format(entry.end));
  }
  $('trim-duration').textContent = entry ? '选区 ' + format(length) : '';
}
function placeWindow(start, length) {
  const entry = draft.get(selected);
  const duration = assets.get(selected).duration;
  length = Math.min(length, duration);
  entry.start = Math.max(0, Math.min(start, duration - length));
  entry.end = Math.min(duration, entry.start + length);
  entry.position = entry.start;
  syncTrim();
  renderTimes();
}
function resizeWindow(length) {
  if (!(length > 0 && Number.isFinite(length))) return syncTrim();
  stop();
  placeWindow(draft.get(selected).start, length);
}
$('window-length').onchange = () => resizeWindow($('window-length').valueAsNumber);
$('fit-window').onclick = () => resizeWindow(recommended());
const grip = $('window-grip');
let dragWindow;
grip.onpointerdown = (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  const entry = draft.get(selected);
  dragWindow = {x: event.clientX, start: entry.start, length: entry.end - entry.start, resume: playing('source') && !!trimPlayback};
  stop();
  grip.setPointerCapture(event.pointerId);
};
grip.onpointermove = (event) => {
  if (!dragWindow || !grip.hasPointerCapture(event.pointerId)) return;
  const width = $('source-timeline').getBoundingClientRect().width;
  const delta = (event.clientX - dragWindow.x) * viewport().span / width;
  placeWindow(dragWindow.start + delta, dragWindow.length);
};
grip.onlostpointercapture = () => {
  if (dragWindow?.resume) playSource(true);
  dragWindow = undefined;
};
grip.onkeydown = (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  stop();
  const entry = draft.get(selected);
  const delta = (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 1 : .1);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? assets.get(selected).duration : entry.start + delta;
  placeWindow(next, entry.end - entry.start);
};
function setTrim(edge, value, dragging = false) {
  const entry = draft.get(selected);
  const asset = assets.get(selected);
  if (!entry || !Number.isFinite(value)) return syncTrim();
  const time = Math.max(0, Math.min(value, asset.duration));
  if ((edge === 'start' && time >= entry.end) || (edge === 'end' && time <= entry.start)) {
    notify('入点必须早于出点。');
  } else {
    entry[edge] = time;
    if (!dragging) notify();
  }
  syncTrim();
}
for (const [id, edge] of [['in', 'start'], ['out', 'end']]) {
  $(id).onchange = () => setTrim(edge, $(id).valueAsNumber);
  $('mark-' + id).onclick = () => setTrim(edge, draft.get(selected).position);
}

for (const [id, edge] of [['trim-in', 'start'], ['trim-out', 'end']]) {
  const handle = $(id);
  let dragOrigin;
  function drag(event) {
    const width = $('source-timeline').clientWidth;
    const duration = assets.get(selected).duration;
    const entry = draft.get(selected);
    const gap = Math.min(.001, duration / 4);
    const view = viewport();
    const target = dragOrigin.time + (event.clientX - dragOrigin.x) / width * view.span;
    setTrim(edge, edge === 'start' ? Math.min(target, entry.end - gap) : Math.max(target, entry.start + gap), true);
  }
  handle.onpointerdown = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const view = viewport();
    const audition = playing('source') && !!trimPlayback;
    if (audition) stop();
    dragOrigin = {time: Math.max(view.left, Math.min(view.right, view.state[edge])), x: event.clientX, audition};
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  };
  handle.onpointermove = (event) => {
    if (handle.hasPointerCapture(event.pointerId)) drag(event);
  };
  handle.onlostpointercapture = () => {
    const audition = dragOrigin?.audition;
    dragOrigin = undefined;
    if (audition) { trimPlayback = undefined; playSource(true); }
  };
  handle.onkeydown = (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const delta = (event.key === 'ArrowLeft' ? -1 : 1) * (event.shiftKey ? .1 : .01);
    setTrim(edge, draft.get(selected)[edge] + delta);
  };
}

function changeClips(clips) {
  if (playing('scene')) stop();
  const partner = pairedScene[scene];
  if (clips && (clips.length || cuts.get(partner)?.length)) cuts.set(scene, clips);
  else cuts.delete(scene);
  if (partner && !cuts.get(scene)?.length && !cuts.get(partner)?.length) cuts.delete(partner);
  if (partner && !cuts.has(partner)) scenePositions.delete(partner);
  scenePositions.set(scene, Math.min(scenePositions.get(scene) || 0, playableDuration()));
  renderScene();
  save();
}
$('restore-pair').onclick = () => changeClips(null);
$('add').onclick = () => {
  if (!selected) return;
  const {start, end} = draft.get(selected);
  changeClips([...clipList(), {asset: selected, start, end}]);
};
function moveClip(index, delta) {
  const next = [...clipList()];
  const to = index + delta;
  [next[index], next[to]] = [next[to], next[index]];
  changeClips(next);
}
function changeScene(id) {
  if (id !== scene) stop();
  scene = id;
  notify();
  renderScene();
}
function refreshSceneOptions() {
  $('scene').replaceChildren(...visibleScenes().map(([id, title]) => new Option(title, id)));
  if (!visibleScenes().some(([id]) => id === scene)) changeScene('star');
}
refreshSceneOptions();
$('scene').onchange = () => changeScene($('scene').value);
function renderScene() {
  const [id, title, english, description] = scenes.find(([id]) => id === scene);
  const clips = clipList();
  const ready = visibleScenes().filter(([key]) => sceneClips(key).length).length;
  $('movie-toggle').disabled = !ready;
  $('scene-count').textContent = ready + ' / ' + visibleScenes().length;
  $('scene').value = id;
  $('scene-level').value = Math.round((sceneLevels.get(id) ?? 1) * 100);
  $('scene-level-text').textContent = $('scene-level').value + '%';
  const hasPartner = !!cuts.get(pairedScene[id])?.length;
  $('scene-note').textContent = hasPartner && !cuts.has(id)
    ? (id === 'timer' ? '已自动取下包后音乐的末尾片段。' : '已从十秒警告的结尾向前取段。') + '编辑片段后可独立编排。'
    : description;
  $('restore-pair').hidden = !(hasPartner && cuts.has(id));
  $('scene-budget').textContent = '推荐 ' + recommended() + ' 秒 · 已编排 ' + format(durationOf(clips));
  syncTrim();
  let visibleTime = playableDuration();
  $('clips').replaceChildren();
  $('scene-segments').replaceChildren();
  if (!clips.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = '从素材剪辑区添加片段。';
    $('clips').append(empty);
  }
  for (const [i, clip] of clips.entries()) {
    const row = document.createElement('li');
    row.className = 'clip';
    const text = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = assets.get(clip.asset).name;
    name.title = name.textContent;
    const time = document.createElement('small');
    time.textContent = format(clip.start) + ' – ' + format(clip.end);
    text.append(name, time);
    const actions = document.createElement('div');
    actions.className = 'clip-actions';
    const up = button('↑', () => moveClip(i, -1), 'icon-button');
    const down = button('↓', () => moveClip(i, 1), 'icon-button');
    const remove = button('×', () => changeClips(clips.filter((_, index) => index !== i)), 'icon-button');
    for (const [element, label] of [[up, '上移'], [down, '下移'], [remove, '移除']]) element.setAttribute('aria-label', label + '片段 ' + (i + 1));
    up.disabled = i === 0;
    down.disabled = i === clips.length - 1;
    const edit = button('精剪', () => openClip(i), 'icon-button');
    actions.append(edit, up, down, remove);
    row.append(text, actions);
    $('clips').append(row);
    const segment = document.createElement('span');
    const visible = Math.min(visibleTime, pieceDuration(clip));
    if (visible > 0) {
      segment.style.flexGrow = visible;
      $('scene-segments').append(segment);
      visibleTime -= visible;
    }
  }
  renderFade();
  $('scene-play').disabled = !clips.length;
  $('inspect-play').disabled = !clips.length;
  $('events').replaceChildren(...visibleScenes().map(([key, name]) => {
    const item = button(name, () => {
      enterMusic(key);
      closePicker();
      $('sound-menu').focus({preventScroll:true});
    }, 'listen-item');
    item.disabled = !sceneClips(key).length;
    item.setAttribute('aria-pressed', String(key === scene));
    return item;
  }));
  renderTimes();
}
const albumObject = $('album-object');
const albumModel = $('album-model');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let albumDrag;
let yaw = 0;
let pitch = 0;
let poseFrame = 0;
let lastPoseTime = 0;
function paintPose() {
  albumModel.style.transform = 'rotateX(' + pitch + 'deg) rotateY(' + yaw + 'deg)';
  albumModel.style.setProperty('--gleam', (50 + yaw * 2) + '%');
}
function animatePose(now) {
  poseFrame = 0;
  if (!inspecting || document.hidden) return;
  const phase = now / 1000;
  const targetYaw = albumDrag?.yaw ?? (reducedMotion.matches ? 0 : 2.7 * Math.sin(phase * .83));
  const targetPitch = albumDrag?.pitch ?? (reducedMotion.matches ? 0 : 1.4 * Math.sin(phase * .61 + .6));
  const dt = lastPoseTime ? Math.min(64, now - lastPoseTime) : 16;
  const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / (albumDrag ? 42 : 220));
  lastPoseTime = now;
  yaw += (targetYaw - yaw) * blend;
  pitch += (targetPitch - pitch) * blend;
  paintPose();
  if (!reducedMotion.matches) poseFrame = requestAnimationFrame(animatePose);
}
function requestPose() {
  if (inspecting && !document.hidden && !poseFrame) poseFrame = requestAnimationFrame(animatePose);
}
function releaseAlbum() {
  const id = albumDrag?.id;
  albumDrag = undefined;
  albumObject.classList.remove('grabbing');
  if (id !== undefined && albumObject.hasPointerCapture(id)) albumObject.releasePointerCapture(id);
  requestPose();
}
function setAlbumMotion(enabled) {
  releaseAlbum();
  cancelAnimationFrame(poseFrame);
  poseFrame = lastPoseTime = yaw = pitch = 0;
  paintPose();
  if (enabled) requestPose();
}
albumObject.onpointerdown = event => {
  if (!event.isPrimary || event.button !== 0 || albumDrag) return;
  event.preventDefault();
  albumDrag = {id:event.pointerId, x:event.clientX, y:event.clientY, startYaw:yaw, startPitch:pitch, yaw, pitch};
  albumObject.setPointerCapture(event.pointerId);
  albumObject.classList.add('grabbing');
  requestPose();
};
albumObject.onpointermove = event => {
  if (albumDrag?.id !== event.pointerId) return;
  albumDrag.yaw = Math.max(-18, Math.min(18, albumDrag.startYaw + (event.clientX - albumDrag.x) * 60 / albumObject.clientWidth));
  albumDrag.pitch = Math.max(-12, Math.min(12, albumDrag.startPitch - (event.clientY - albumDrag.y) * 38 / albumObject.clientHeight));
  requestPose();
};
for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  albumObject.addEventListener(eventName, event => { if (albumDrag?.id === event.pointerId) releaseAlbum(); });
}
document.addEventListener('visibilitychange', () => setAlbumMotion(inspecting));
window.addEventListener('blur', releaseAlbum);
reducedMotion.addEventListener('change', requestPose);

const movieOrder = ['menu','flag','bolt','eye','team','win','loss','plant','timer','star','star2','star3'];
function movieProgram() {
  const available = new Map(visibleScenes().map(def => [def[0], def]));
  const parts = [];
  for (const id of movieOrder) {
    if (!available.has(id)) continue;
    const duration = durationOf(sceneClips(id));
    if (!duration) continue;
    const [, title, english] = available.get(id);
    parts.push({id, title:id === 'menu' ? '大厅音乐' : title, english,
      start:id === 'timer' ? Math.max(0, duration - 10) : 0,
      end:id === 'plant' ? Math.min(duration, 30) : duration});
  }
  return parts;
}
function updateMovieControls() {
  const label = movie ? (movie.paused ? '继续播放 Movie' : '暂停 Movie') : '一键检视 Movie';
  $('movie-toggle').title = label;
  $('movie-toggle').setAttribute('aria-label', label);
  $('movie-glyph').innerHTML = icon(movie ? (movie.paused ? 'play' : 'pause') : 'film');
  $('movie-actions').hidden = $('movie-caption').hidden = !movie;
  $('inspect').classList.toggle('movie-running', !!movie);
}
function startMoviePart(index) {
  clearTimeout(movie.timer);
  movie.index = index;
  movie.gap = false;
  movie.paused = false;
  const part = movie.parts[index];
  changeScene(part.id);
  $('movie-title').textContent = part.title;
  $('movie-english').textContent = part.english;
  updateMovieControls();
  if (!reducedMotion.matches) {
    $('movie-caption').animate([{opacity:0, transform:'translateX(-9px)'}, {opacity:1, transform:'none'}], {duration:240});
  }
  void play('scene', clipList(), part.start, part.end);
}
function startMovie() {
  if (!movie) {
    const parts = movieProgram();
    if (!inspecting || !parts.length) return;
    const wasPlaying = playing('scene');
    stop();
    movie = {parts, previous:scene, positions:new Map(scenePositions), wasPlaying};
  }
  startMoviePart(0);
}
function endMovie(restore) {
  if (!movie) return;
  const {previous, positions, wasPlaying, timer} = movie;
  clearTimeout(timer);
  stop();
  movie = undefined;
  scenePositions.clear();
  for (const [id, time] of positions) scenePositions.set(id, time);
  updateMovieControls();
  if (restore) {
    changeScene(previous);
    if (wasPlaying) playScene();
  }
}
function finishMoviePart() {
  stop();
  const next = movie.index + 1;
  if (next === movie.parts.length) return endMovie(true);
  if (scene === 'plant' && movie.parts[next].id === 'timer') return startMoviePart(next);
  movie.gap = true;
  renderTimes();
  movie.timer = setTimeout(() => startMoviePart(next), 450);
}
function resumeMoviePart() {
  const part = movie.parts[movie.index];
  const position = Math.max(part.start, scenePositions.get(scene) ?? part.start);
  if (movie.gap || position >= part.end) {
    if (movie.gap) startMoviePart(movie.index + 1);
    else finishMoviePart();
  } else {
    void play('scene', clipList(), position, part.end);
  }
}
function toggleMoviePause() {
  movie.paused = !movie.paused;
  updateMovieControls();
  if (movie.paused) {
    clearTimeout(movie.timer);
    stop();
  } else resumeMoviePart();
}
$('movie-toggle').onclick = () => movie ? toggleMoviePause() : startMovie();
$('movie-restart').onclick = startMovie;
$('movie-stop').onclick = () => endMovie(true);

function showView(next) {
  endMovie(false);
  if ($('clip-editor').open) $('clip-editor').close();
  stop();
  if (next) editorScene = scene;
  inspecting = next;
  setAlbumMotion(next);
  toggleBackgroundMenu(false);
  document.body.classList.toggle('inspecting', next);
  closePicker();
  showVolume(false);
  $('editor').hidden = next;
  $('inspect').hidden = !next;
  $('edit-tab').toggleAttribute('aria-current', !next);
  $('inspect-tab').toggleAttribute('aria-current', next);
  $(next ? 'inspect-tab' : 'edit-tab').setAttribute('aria-current', 'page');
  if (next) {
    renderKit();
    const first = previewManifest && !sceneClips('menu').length
      ? visibleScenes().find(([id]) => sceneClips(id).length)?.[0] : 'menu';
    enterMusic(first || 'menu');
  }
  else { changeScene(editorScene); drawWave(); }
  window.scrollTo(0, 0);
}
$('edit-tab').onclick = () => { location.hash = 'edit'; };
$('inspect-tab').onclick = () => { location.hash = 'inspect'; };
$('back').onclick = $('edit-tab').onclick;
function route() {
  const next = !!previewManifest || location.hash === '#inspect';
  if (next !== inspecting) showView(next);
}
window.addEventListener('hashchange', route);
function setPicker(open) {
  if (open) { toggleBackgroundMenu(false); showVolume(false); }
  $('sound-picker').classList.toggle('open',open);
  $('sound-menu').setAttribute('aria-expanded', String(open));
  $('sound-drawer').inert = !open;
}
function closePicker() { setPicker(false); }
$('sound-picker').onpointerenter = event => { if (event.pointerType === 'mouse') setPicker(true); };
$('sound-picker').onpointerleave = event => { if (event.pointerType === 'mouse') closePicker(); };
$('sound-menu').onclick = event => setPicker(event.pointerType === 'mouse' || $('sound-drawer').inert);
$('sound-picker').onfocusout = event => { if (!$('sound-picker').contains(event.relatedTarget)) closePicker(); };
document.addEventListener('pointerdown', event => { if (!$('sound-picker').contains(event.target)) closePicker(); });
$('sound-picker').onkeydown = event => {
  if (event.key === 'Escape') { closePicker(); $('sound-menu').focus(); }
  if (event.key === 'ArrowDown') { setPicker(true); $('events').querySelector('button:enabled')?.focus(); event.preventDefault(); }
};
function showVolume(open) {
  $('volume-picker').classList.toggle('open', open);
  $('volume-button').setAttribute('aria-expanded', String(open));
  $('volume-panel').inert = !open;
  if (open) { closePicker(); toggleBackgroundMenu(false); }
}
const volumePicker = $('volume-picker');
let adjustingVolume = false;
volumePicker.onpointerenter = event => { if (event.pointerType === 'mouse') showVolume(true); };
volumePicker.onpointerleave = event => {
  if (event.pointerType === 'mouse' && !adjustingVolume) showVolume(false);
};
$('inspect-volume').onpointerdown = () => { adjustingVolume = true; };
function finishVolumeDrag() {
  if (!adjustingVolume) return;
  adjustingVolume = false;
  if (!volumePicker.matches(':hover')) showVolume(false);
}
window.addEventListener('pointerup', finishVolumeDrag);
window.addEventListener('pointercancel', finishVolumeDrag);
$('volume-button').onclick = event => showVolume(event.pointerType === 'mouse' || $('volume-panel').inert);
volumePicker.onfocusout = event => { if (!volumePicker.contains(event.relatedTarget)) showVolume(false); };
volumePicker.onkeydown = event => {
  if (event.key === 'Escape') { showVolume(false); $('volume-button').focus(); }
};
document.addEventListener('pointerdown', event => {
  if (!volumePicker.contains(event.target)) showVolume(false);
});
function renderKit() {
  $('kit-title-text').textContent = '音乐盒' + (kit.stat ? '（StatTrak™）' : '') + ' | ' + (kit.name || '未命名');
  $('stat-lines').hidden = !kit.stat;
  $('counter-label').hidden = !kit.stat;
  $('stat-value').textContent = kit.count;
  $('sleeve-title').textContent = !cover ? kit.name : '';
  $('art').parentElement.classList.toggle('named', !cover && !!kit.name);
  $('artist-note').textContent = kit.note;
}
function fillKit() {
  $('kit-name').value = kit.name;
  $('kit-note').value = kit.note;
  $('kit-stat').checked = kit.stat;
  $('kit-counter').value = kit.count;
  $('mvp-count').value = kit.variants;
  refreshSceneOptions();
  renderKit();
}
for (const id of ['kit-name','kit-note','kit-stat','kit-counter','mvp-count']) {
  $(id).onchange = () => {
    kit.name = $('kit-name').value.trim();
    kit.note = $('kit-note').value.trim();
    kit.stat = $('kit-stat').checked;
    kit.count = Math.min(999999999, Math.max(0, Math.floor(Number($('kit-counter').value) || 0)));
    kit.variants = Number($('mvp-count').value);
    fillKit();
    renderScene();
    save();
  };
}
function toggleBackgroundMenu(open) {
  $('bg-menu').hidden = !open;
  $('bg-button').setAttribute('aria-expanded', String(open));
  if (open) { closePicker(); showVolume(false); }
}
function selectBackground(preset) {
  const options = $('bg-options').querySelectorAll('[data-preset]');
  mapPreset = Array.from(options).some(option => option.dataset.preset === preset) ? preset : 'courtyard';
  if (mapPreset === 'custom' && !backgroundUrl) mapPreset = 'courtyard';
  $('inspect').dataset.map = mapPreset;
  if (mapPreset === 'custom') $('inspect').style.setProperty('--backdrop', 'url("' + backgroundUrl + '")');
  else $('inspect').style.removeProperty('--backdrop');
  for (const option of options) {
    option.hidden = option.dataset.preset === 'custom' && !background;
    option.setAttribute('aria-pressed', String(option.dataset.preset === mapPreset));
  }
}
function setBackground(blob, preset = blob ? 'custom' : 'courtyard') {
  background = blob;
  if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
  backgroundUrl = blob ? URL.createObjectURL(blob) : undefined;
  selectBackground(preset);
}
selectBackground('courtyard');
$('bg-button').onclick = () => toggleBackgroundMenu($('bg-menu').hidden);
$('bg-options').onclick = event => {
  const option = event.target.closest('[data-preset]');
  if (!option) return;
  selectBackground(option.dataset.preset);
  toggleBackgroundMenu(false);
  $('bg-button').focus();
  save();
};
$('bg-upload').onclick = () => {
  toggleBackgroundMenu(false);
  $('bg-button').focus();
  $('bg-file').click();
};
document.addEventListener('pointerdown', event => {
  if (!$('bg-picker').contains(event.target)) toggleBackgroundMenu(false);
});
$('bg-picker').onfocusout = event => {
  if (!$('bg-picker').contains(event.relatedTarget)) toggleBackgroundMenu(false);
};
$('bg-picker').onkeydown = event => {
  if (event.key === 'Escape') {
    toggleBackgroundMenu(false);
    $('bg-button').focus();
  }
};
$('bg-file').onchange = async () => {
  const destination = boardId;
  const file = $('bg-file').files[0];
  $('bg-file').value = '';
  if (!file) return;
  try {
    const bitmap = await createImageBitmap(file);
    bitmap.close();
    if (boardId !== destination) return;
    setBackground(file);
    save();
  } catch { notify('无法读取背景图片，请选择 JPG、PNG 或 WebP。'); }
};

function setBusy(value) {
  busy = value;
  $('export-preview').disabled = value || exporting;
  $('drop').disabled = value;
  $('board-new').disabled = $('board-list').disabled = value;
}
async function importFiles(files) {
  if (!files.length || busy) return;
  setBusy(true);
  notify('正在读取 ' + files.length + ' 段音频…');
  let count = 0;
  const rejected = [];
  for (const file of files) {
    try {
      if (file.size > 100 * 1024 * 1024) {
        rejected.push(file.name + '（超过 100 MB）');
        continue;
      }
      if (!file.size) throw new Error('Empty file');
      const audio = await decode(file);
      if (!(audio.duration > 0)) throw new Error('Empty audio');
      const id = crypto.randomUUID?.() || Date.now() + '-' + Math.random();
      if (assets.size === 0) {
        if (!kit.name) kit.name = file.name.replace(/\.[^.]+$/, '') || file.name;
        if (!cover) {
          try {
            const art = await EmbeddedCover.fromFile(file);
            if (art) { const bitmap = await createImageBitmap(art); bitmap.close(); setCover(art); }
          } catch { /* Audio without a readable picture uses a typographic sleeve. */ }
        }
        fillKit();
      }
      assets.set(id, {id, name: file.name, duration: audio.duration, blob: file});
      buffers.set(id, Promise.resolve(audio));
      peaks.set(id, extractPeaks(audio));
      opened.push(id);
      draft.set(id, initialWindow(audio.duration));
      count++;
    } catch {
      rejected.push(file.name);
    }
  }
  if (!selected && opened.length) openAsset(opened[0]);
  renderSources();
  setBusy(false);
  if (count) save();
  notify(rejected.length ? '已导入 ' + count + ' 段。无法读取：' + rejected.join('、') : '已导入 ' + count + ' 段音频。');
}
$('drop').onclick = () => $('files').click();
$('files').onchange = () => {
  const files = [...$('files').files];
  $('files').value = '';
  void importFiles(files);
};
$('drop').ondragover = (event) => {
  event.preventDefault();
  $('drop').classList.toggle('drag', !busy);
};
$('drop').ondragleave = () => $('drop').classList.remove('drag');
$('drop').ondrop = (event) => {
  event.preventDefault();
  $('drop').classList.remove('drag');
  void importFiles([...event.dataTransfer.files]);
};
const db = previewManifest ? null : new Promise((resolve, reject) => {
  const request = indexedDB.open('music-kit-studio', 2);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains('tracks')) database.createObjectStore('tracks', {keyPath: 'id'});
    database.createObjectStore('project');
  };
  request.onsuccess = () => {
    request.result.onversionchange = () => request.result.close();
    resolve(request.result);
  };
  request.onerror = () => reject(request.error);
  request.onblocked = () => reject(new Error('Storage unavailable'));
});
async function access(store, mode, action) {
  const database = await db;
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(store, mode);
    const request = action(transaction.objectStore(store));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}
function storageStatus(text) {
  $('save-status').textContent = text;
}
function save() {
  if (previewManifest) return Promise.resolve();
  const id = boardId;
  boardOptions();
  const snapshot = {assets:[...assets.values()], cuts:[...cuts], pairedDefaultsVersion:1, fades:[...fades], sceneLevels:[...sceneLevels], kit:{...kit}, cover, background, mapPreset};
  unsavedBoards.set(id,snapshot);
  return access('project', 'readwrite', store => {
    store.put(snapshot.kit.name || '未命名工作台', 'label:' + id);
    return store.put(snapshot, id);
  }).then(() => {
    if (unsavedBoards.get(id) === snapshot) unsavedBoards.delete(id);
    if (boardId === id) storageStatus('素材和编排已保存在当前浏览器');
  }).catch(() => {
    storageStatus('本地存储不可用或空间不足，工作台保留在本次会话中');
  });
}
function mergeLegacyObjective() {
  const oldClips = cuts.get('target') || [];
  const plantClips = cuts.get('plant') || [];
  if (oldClips.length) cuts.set('plant', [...oldClips, ...plantClips]);
  cuts.delete('target');
  for (const settings of [sceneLevels, fades]) {
    if (!plantClips.length && !settings.has('plant') && settings.has('target')) {
      settings.set('plant', settings.get('target'));
    }
    settings.delete('target');
  }
}
function populateBoard(project = {}) {
  setCover(project.cover);
  setBackground(project.background, project.mapPreset);
  Object.assign(kit, emptyKit(), project.kit);
  for (const [key, value] of project.sceneLevels || []) sceneLevels.set(key,value);
  for (const [key, value] of project.fades || []) fades.set(key, value);
  for (const asset of project.assets || []) assets.set(asset.id, asset);
  for (const [id, clips] of project.cuts || []) {
    // Older boards stored empty arrays even for paired scenes awaiting a default.
    if (clips.length || !pairedScene[id] || project.pairedDefaultsVersion) cuts.set(id, clips);
  }
  mergeLegacyObjective();
}
function boardOptions() {
  boards.set(boardId, kit.name || '未命名工作台');
  $('board-list').replaceChildren(...Array.from(boards, ([id,name]) => new Option(name,id)));
  $('board-list').value = boardId;
}
async function switchBoard(id, create = false) {
  if (busy || id === boardId) return;
  setBusy(true);
  $('editor').inert = true;
  try {
    await save();
    const project = create ? {} : unsavedBoards.get(id) ?? await access('project','readonly',store => store.get(id));
    if (!project) throw new Error('Missing board');
    stop();
    for (const map of [assets,cuts,sceneLevels,fades,buffers,peaks,scenePositions,draft]) map.clear();
    opened.length = 0;
    selected = trimPlayback = undefined;
    scene = editorScene = 'menu';
    clearPreviewDownload();
    boardId = id;
    populateBoard(project);
    fillKit();
    renderSources();
    renderScene();
    boardOptions();
    notify();
    if (create) await save();
    try { localStorage.setItem('music-kit-active-board', id); } catch {}
  } catch { notify('暂时无法打开工作台，请重试。'); }
  finally { boardOptions(); $('editor').inert = false; setBusy(false); }
}
$('board-new').onclick = () => switchBoard('board-' + (crypto.randomUUID?.() || Date.now() + '-' + Math.random()), true);
$('board-list').onchange = () => switchBoard($('board-list').value);
async function restore() {
  try {
    const keys = await access('project','readonly',store => store.getAllKeys(IDBKeyRange.bound('label:', 'label:\uffff')));
    for (const key of keys) boards.set(key.slice(6), await access('project','readonly',store => store.get(key)));
    let last;
    try { last = localStorage.getItem('music-kit-active-board'); } catch {}
    if (boards.has(last)) boardId = last;
    const project = await access('project','readonly',store => store.get(boardId));
    if (project) {
      populateBoard(project);
    } else {
      const legacy = await access('tracks', 'readonly', (store) => store.getAll());
      for (const track of legacy) {
        try {
          const audio = await decode(track.blob);
          const id = 'legacy-' + track.id;
          assets.set(id, {id, name: track.name, blob: track.blob, duration: audio.duration});
          cuts.set(track.id, [{asset: id, start: 0, end: audio.duration}]);
          buffers.set(id, Promise.resolve(audio));
        } catch {
          notify('有旧版音轨无法解码，可从原文件重新导入。');
        }
      }
      mergeLegacyObjective();
      if (assets.size === legacy.length && legacy.length) save();
    }
  } catch {
    storageStatus('本地存储不可用，本次会话仍可编辑与播放');
  } finally {
    boardOptions();
    fillKit();
    renderSources();
    renderScene();
    setBusy(false);
    $('cover-button').disabled = false;
    if (inspecting) enterMusic('menu');
    else route();
  }
}
renderSources();
renderScene();
setBusy(true);


// A linked-channel noise gate attenuates quiet passages while leaving louder music at unity.
const envelopes = new WeakMap();
function noiseEnvelope(audio) {
  const block = Math.max(1, Math.round(audio.sampleRate * .01));
  let levels = envelopes.get(audio);
  if (!levels) {
    const channels = Array.from({length:audio.numberOfChannels}, (_, i) => audio.getChannelData(i));
    levels = new Float32Array(Math.ceil(audio.length / block));
    let gain = 1;
    for (let i = 0; i < levels.length; i++) {
      const end = Math.min(audio.length, (i + 1) * block);
      let peak = 0;
      for (const channel of channels) {
        for (let j = i * block; j < end; j++) peak = Math.max(peak, Math.abs(channel[j]));
      }
      const target = Math.min(1, Math.max(.12, (peak - .004) / .012));
      gain += (target - gain) * (target > gain ? 1 : .15);
      levels[i] = gain;
    }
    envelopes.set(audio, levels);
  }
  return levels;
}
function connectNoiseGate(source, when, offset, length, output = master, rate = 1) {
  const audio = source.buffer;
  const block = Math.max(1, Math.round(audio.sampleRate * .01));
  const levels = noiseEnvelope(audio);
  const gain = source.context.createGain();
  const count = Math.max(2, Math.ceil(length * audio.sampleRate / block) + 1);
  const curve = Float32Array.from({length:count}, (_, i) => {
    const time = offset + length * rate * i / (count - 1);
    return levels[Math.min(levels.length - 1, Math.floor(time * audio.sampleRate / block))];
  });
  gain.gain.setValueCurveAtTime(curve, when, length);
  source.connect(gain).connect(output);
  source.onended = () => gain.disconnect();
}

function openClip(index) {
  stop();
  const clip = clipList()[index];
  const length = clip.end - clip.start;
  editing = {clip, index, position:0};
  $('clip-name').textContent = assets.get(clip.asset).name + ' · ' + format(length);
  $('cut-mode').value = 'keep';
  $('gate').checked = !!clip.gate;
  $('piece-level').value = Math.round((clip.level ?? 1) * 100);
  for (const id of ['local-in', 'local-out', 'local-in-slider', 'local-out-slider']) {
    $(id).max = length;
    $(id).value = id.startsWith('local-in') ? 0 : length;
  }
  updateEdit();
  $('clip-editor').showModal();
  drawWave(true);
}
function editedPieces() {
  const {clip} = editing;
  const duration = clip.end - clip.start;
  const from = $('local-in').valueAsNumber;
  const to = $('local-out').valueAsNumber;
  if (!(from >= 0 && from < to && to <= duration)) return [];
  const ranges = $('cut-mode').value === 'keep' ? [[from,to]] : [[0,from],[to,duration]];
  return ranges.filter(([a,b]) => b > a).map(([a,b]) => ({
    ...clip, start:clip.start + a, end:b === duration ? clip.end : clip.start + b, gate:$('gate').checked, level:Number($('piece-level').value)/100,
  }));
}
function detailRegion() {
  const {span, left, right} = viewport(true);
  const from = Number($('local-in').value);
  const to = Number($('local-out').value);
  const region = $('detail-region');
  region.style.left = Math.max(0, (from - left) / span * 100) + '%';
  region.style.width = Math.max(0, Math.min(to, right) - Math.max(from, left)) / span * 100 + '%';
  region.classList.toggle('removed', $('cut-mode').value === 'remove');
  for (const id of ['local-in', 'local-out']) {
    const slider = $(id + '-slider');
    slider.min = left;
    slider.max = right;
    slider.value = $(id).value;
  }
}
const detailTimeline = $('detail-wave').parentElement;
let detailAnchor;
function detailTime(event) {
  const rect = detailTimeline.getBoundingClientRect();
  const view = viewport(true);
  return view.left + Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * view.span;
}
detailTimeline.onpointerdown = event => {
  if (!event.isPrimary || event.button !== 0) return;
  detailAnchor = detailTime(event);
  detailTimeline.setPointerCapture(event.pointerId);
};
detailTimeline.onpointermove = event => {
  if (!detailTimeline.hasPointerCapture(event.pointerId)) return;
  const time = detailTime(event);
  if (time === detailAnchor) return;
  $('local-in').value = Number(Math.min(time, detailAnchor).toFixed(6));
  $('local-out').value = Math.min(editing.clip.end - editing.clip.start, Number(Math.max(time, detailAnchor).toFixed(6)));
  updateEdit();
};
function updateEdit() {
  $('piece-level-text').textContent = $('piece-level').value + '%';
  stop();
  editing.position = 0;
  const pieces = editedPieces();
  detailRegion();
  $('edit-apply').disabled = $('edit-listen').disabled = !pieces.length;
  $('edit-status').textContent = pieces.length ? '结果时长 ' + format(durationOf(pieces)) : '请调整选区，保留一段可播放的音频。';
}
for (const id of ['local-in', 'local-out']) {
  const slider = $(id + '-slider');
  $(id).oninput = () => {slider.value = $(id).value; updateEdit();};
  slider.oninput = () => {
    $(id).value = Math.min(Number(slider.max), Number(Number(slider.value).toFixed(3)));
    updateEdit();
  };
}
$('piece-level').oninput = updateEdit;
$('cut-mode').onchange = $('gate').onchange = updateEdit;
$('edit-listen').onclick = () => {
  if (playing('clip')) return stop();
  const pieces = editedPieces();
  void play('clip', pieces, editing.position >= durationOf(pieces) ? 0 : editing.position);
};
$('edit-apply').onclick = () => {
  const pieces = editedPieces();
  if (!pieces.length) return;
  const clips = [...clipList()];
  clips.splice(editing.index, 1, ...pieces);
  stop();
  changeClips(clips);
  $('clip-editor').close();
};
$('clip-close').onclick = () => $('clip-editor').close();
$('clip-editor').onclose = () => {stop(); editing = undefined;};

function setCover(blob) {
  cover = blob;
  if (coverUrl) URL.revokeObjectURL(coverUrl);
  coverUrl = blob ? URL.createObjectURL(blob) : undefined;
  const art = $('art');
  art.hidden = !blob;
  if (blob) art.src = coverUrl;
  else art.removeAttribute('src');
  $('cover-button').textContent = blob ? '更换唱片封面' : '上传唱片封面';
}
$('cover-button').onclick = () => $('cover-file').click();
$('cover-file').onchange = async () => {
  const destination = boardId;
  const file = $('cover-file').files[0];
  $('cover-file').value = '';
  if (!file) return;
  $('cover-button').disabled = true;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = Math.min(960, side);
    canvas.getContext('2d').drawImage(bitmap, (bitmap.width-side)/2, (bitmap.height-side)/2, side, side, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', .9));
    if (!blob) throw new Error('Invalid cover');
    if (boardId !== destination) return;
    setCover(blob);
    save();
    notify();
  } catch {
    notify('图片读取失败，请选择可打开的 JPG、PNG 或 WebP 图片。');
  } finally {
    bitmap?.close();
    $('cover-button').disabled = false;
  }
};

$('library-toggle').onclick = () => {
  const collapsed = !$('library').hidden;
  $('library').hidden = collapsed;
  document.querySelector('.desk').classList.toggle('folded',collapsed);
  $('library-toggle').textContent = collapsed ? '展开素材库' : '收起素材库';
  $('library-toggle').setAttribute('aria-expanded',String(!collapsed));
};
function refreshSourceView() {
  drawWave();
  syncTrim();
  renderTimes();
}
$('overview-nav').oninput = event => {
  const view = viewport();
  if (!view.state) return;
  const position = Number(event.target.value);
  view.state.left = Math.max(0, Math.min(view.total - view.span, position - view.span / 2));
  seek('source',position);
  refreshSourceView();
};
const surface = $('source-timeline');
let handDrag;
$('hand').onclick = () => {
  const enabled = $('hand').getAttribute('aria-pressed') !== 'true';
  $('hand').setAttribute('aria-pressed',String(enabled));
  surface.classList.toggle('pannable',enabled);
};
surface.addEventListener('pointerdown',event => {
  const view = viewport();
  if (view.scale === 1 || !event.isPrimary || (!event.shiftKey && $('hand').getAttribute('aria-pressed') !== 'true') || event.target.closest('button')) return;
  event.preventDefault();
  event.stopPropagation();
  handDrag = {x:event.clientX,left:view.left};
  surface.setPointerCapture(event.pointerId);
},true);
surface.onpointermove = event => {
  if (!handDrag || !surface.hasPointerCapture(event.pointerId)) return;
  const view = viewport();
  view.state.left = Math.max(0, Math.min(view.total-view.span, handDrag.left + (handDrag.x-event.clientX)*view.span/surface.clientWidth));
  refreshSourceView();
};
surface.onlostpointercapture = () => { handDrag = undefined; };
function changeMix(id) {
  const asset = assets.get(selected);
  const kind = active?.kind || pendingKind;
  const trim = kind === 'source' && !!trimPlayback;
  const relevant = id === 'scene-level' ? kind === 'scene' : !!kind;
  if (relevant) stop();
  if (id === 'scene-level') sceneLevels.set(scene, Number($(id).value)/100);
  else if (asset && id === 'asset-rate') asset.rate = Number($(id).value);
  else if (asset) asset.level = Number($(id).value)/100;
  scenePositions.set(scene, Math.min(scenePositions.get(scene) || 0, playableDuration()));
  renderSources();
  renderScene();
  if (relevant && kind === 'scene') playScene();
  else if (relevant && kind === 'source') playSource(trim);
  save();
}
for (const id of ['asset-rate','asset-level','scene-level']) {
  $(id).onchange = () => changeMix(id);
  if (id.endsWith('level')) $(id).oninput = () => {$(id+'-text').textContent = $(id).value + '%';};
}

function asDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
async function exportResource(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('无法读取预览页面资源');
  return response;
}
async function previewResources() {
  const link = document.querySelector('link[rel="stylesheet"]');
  if (!link) {
    const notices = Array.from(document.head.childNodes)
      .filter(node => node.nodeType === Node.COMMENT_NODE).map(node => node.data).join('\n');
    return {style:document.querySelector('style').textContent, script:studioScript.textContent, notices};
  }
  let style = await (await exportResource(link.href)).text();
  const paths = new Set(Array.from(style.matchAll(/url\((assets\/[\w.-]+)\)/g), match => match[1]));
  await Promise.all(Array.from(paths, async path => {
    const response = await exportResource(new URL(path, link.href));
    const data = await asDataURL(await response.blob());
    style = style.replaceAll('url(' + path + ')', 'url(' + data + ')');
  }));
  const [script, ...licenses] = await Promise.all([studioScript.src, 'assets/barlow-license.txt', 'assets/ui-zh-license.txt']
    .map(async url => (await exportResource(url)).text()));
  return {style, script, notices:licenses.join('\n')};
}

// Store only the audible arrangement, including its effects, in a portable PCM WAV.
function wavBlob(audio) {
  const channels = Array.from({length:audio.numberOfChannels}, (_, i) => audio.getChannelData(i));
  // Preserve headroom for boosted clips before the listener's master volume is applied.
  let gain = 1;
  for (const channel of channels) {
    for (let i = 0; i < channel.length; i++) gain = Math.max(gain, Math.abs(channel[i]));
  }
  const frameBytes = channels.length * 2;
  const dataLength = audio.length * frameBytes;
  const header = new DataView(new ArrayBuffer(44));
  const fourCC = (offset, text) => [...text].forEach((char, i) => header.setUint8(offset + i, char.charCodeAt(0)));
  fourCC(0, 'RIFF');
  header.setUint32(4, 36 + dataLength, true);
  fourCC(8, 'WAVE');
  fourCC(12, 'fmt ');
  header.setUint32(16, 16, true);
  header.setUint16(20, 1, true);
  header.setUint16(22, channels.length, true);
  header.setUint32(24, audio.sampleRate, true);
  header.setUint32(28, audio.sampleRate * frameBytes, true);
  header.setUint16(32, frameBytes, true);
  header.setUint16(34, 16, true);
  fourCC(36, 'data');
  header.setUint32(40, dataLength, true);
  const parts = [header];
  for (let start = 0; start < audio.length; start += 65536) {
    const frames = Math.min(65536, audio.length - start);
    const chunk = new DataView(new ArrayBuffer(frames * frameBytes));
    for (let i = 0; i < frames; i++) {
      for (let ch = 0; ch < channels.length; ch++) {
        const value = channels[ch][start + i] / gain;
        chunk.setInt16(i * frameBytes + ch * 2, Math.round(value * (value < 0 ? 32768 : 32767)), true);
      }
    }
    parts.push(chunk);
  }
  return {blob:new Blob(parts, {type:'audio/wav'}), gain};
}
async function renderExportTrack(track) {
  const sampleRate = 44100;
  const sources = await Promise.all(track.pieces.map(piece => piece.buffer()));
  const channels = sources.every(audio => audio.numberOfChannels === 1) ? 1 : 2;
  const ctx = new OfflineAudioContext(channels, Math.max(1, Math.ceil(track.duration * sampleRate)), sampleRate);
  const output = sceneFade(ctx, 0, 0, track.duration, track.fade, ctx.destination);
  let offset = 0;
  track.pieces.forEach((piece, i) => {
    schedulePiece(ctx, output, sources[i], offset, piece.start, piece.duration, piece.rate, piece.level, piece.gate);
    offset += piece.duration;
  });
  return wavBlob(await ctx.startRendering());
}
function snapshotTracks() {
  const tracks = [];
  const loaders = new Map();
  for (const [id, title] of visibleScenes()) {
    const clips = sceneClips(id);
    if (!clips.length) continue;
    const pieces = clips.map(clip => {
      const asset = assets.get(clip.asset);
      if (!loaders.has(asset)) {
        let pending;
        loaders.set(asset, () => pending ??= (assets.get(asset.id) === asset ? bufferFor(asset.id) : decode(asset.blob)));
      }
      return {start:clip.start, duration:pieceDuration(clip), rate:rateOf(clip), gate:clip.gate,
        level:(asset.level ?? 1) * (clip.level ?? 1) * (sceneLevels.get(id) ?? 1), buffer:loaders.get(asset)};
    });
    tracks.push({id, title, duration:durationOf(clips), fade:fadeSetting(id), pieces});
  }
  return tracks;
}
function clearPreviewDownload() {
  const link = $('preview-download');
  if (link.hasAttribute('href')) URL.revokeObjectURL(link.href);
  link.removeAttribute('href');
  link.hidden = true;
}
async function exportPreview() {
  if (busy || exporting) return;
  const tracks = snapshotTracks();
  if (!tracks.length) { notify('先给任一场景添加片段，再导出预览。'); return; }
  const button = $('export-preview');
  exporting = button.disabled = true;
  const sourceBoard = boardId;
  clearPreviewDownload();
  const exportedKit = {...kit};
  const manifest = {kit:exportedKit, mapPreset, volume:Number($('volume').value),
    tracks:tracks.map(({id,title,duration}) => ({id,title,duration}))};
  const chosenBackground = mapPreset === 'custom' ? background : null;
  try {
    notify('正在准备预览文件…');
    const [resources, art, backdrop] = await Promise.all([previewResources(),
      cover ? asDataURL(cover) : null, chosenBackground ? asDataURL(chosenBackground) : null]);
    Object.assign(manifest, {cover:art, background:backdrop});
    const parts = ['<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>音乐盒检视</title><!--',
      resources.notices, '--><style>', resources.style,
      '\nheader.top,main>footer,#editor,#back,#bg-upload{display:none!important}</style></head><body>',
      studioMarkup];
    for (const [i, track] of tracks.entries()) {
      button.textContent = '正在导出 ' + (i + 1) + ' / ' + tracks.length;
      notify('正在生成「' + track.title + '」…');
      const {blob, gain} = await renderExportTrack(track);
      manifest.tracks[i].gain = gain;
      const url = await asDataURL(blob);
      parts.push('<script type="application/octet-stream" id="audio-' + track.id + '">', new Blob([url.slice(url.indexOf(',') + 1)]), '<\/script>');
    }
    const metadata = JSON.stringify(manifest).replace(/</g, '\\u003c');
    parts.push('<script type="application/json" id="kit-preview">', metadata, '<\/script>');
    parts.push('<script>', resources.script.replace(/<\/script/gi, '<\\/script'), '<\/script></body></html>');
    if (boardId !== sourceBoard) return;
    const download = $('preview-download');
    download.href = URL.createObjectURL(new Blob(parts, {type:'text/html;charset=utf-8'}));
    download.download = (exportedKit.name || '音乐盒').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_') + ' - 检视.html';
    download.hidden = false;
    download.click();
    notify('预览已生成。如果下载没有开始，点击「保存刚导出的预览」。');
  } catch (error) {
    console.error('Preview export failed', error);
    notify('预览导出失败。请检查页面资源是否完整，或缩短较长的场景后重试。');
  } finally {
    exporting = false;
    button.disabled = busy;
    button.textContent = '导出预览 HTML';
  }
}
$('export-preview').onclick = exportPreview;

function readEmbeddedBytes(id) {
  const data = $(id).textContent;
  if (Uint8Array.fromBase64) return Uint8Array.fromBase64(data);
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function openExportedPreview() {
  const project = JSON.parse(previewManifest.textContent);
  Object.assign(kit, project.kit);
  for (const {id, title, duration, gain} of project.tracks) {
    sceneLevels.set(id, gain);
    assets.set(id, {id, name:title, duration, previewAudio:'audio-' + id});
    cuts.set(id, [{asset:id, start:0, end:duration}]);
    fades.set(id, {enabled:false, inEnabled:false});
  }
  // The export includes the final scene choices, including intentionally empty paired scenes.
  for (const id of ['plant','timer']) if (!cuts.has(id)) cuts.set(id, []);
  const imageBlob = async data => data ? (await fetch(data)).blob() : undefined;
  setCover(await imageBlob(project.cover));
  setBackground(await imageBlob(project.background), project.mapPreset);
  $('inspect-volume').value = project.volume;
  updateMasterVolume({target:$('inspect-volume')});
  document.title = (kit.name || '音乐盒') + ' · 成品检视';
  fillKit();
  setBusy(false);
  showView(true);
}

if (previewManifest) void openExportedPreview();
else void restore();
