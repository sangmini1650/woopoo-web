const scenes = Array.from(document.querySelectorAll('.scene'));
const totalScenes = scenes.length;
let sceneIdx = 0;
let subStep = 1;

const dotsWrap = document.getElementById('dots');
const sceneNumEl = document.getElementById('sceneNum');
const replayBtn = document.getElementById('replayBtn');
const tapLeft = document.getElementById('tapLeft');
const tapRight = document.getElementById('tapRight');

scenes.forEach((sc,i)=>{
  const d = document.createElement('button');
  d.className='dot';
  d.addEventListener('click', ()=>{
    sceneIdx = i;
    subStep = totalSteps(i);
    render(true);
  });
  dotsWrap.appendChild(d);
});
const dots = Array.from(dotsWrap.children);

function totalSteps(i){ return parseInt(scenes[i].getAttribute('data-steps')||'1',10); }

function applyReveal(sc, step){
  sc.querySelectorAll('[data-i]').forEach(el=>{
    const i = parseInt(el.getAttribute('data-i'),10);
    el.classList.toggle('show', i<=step);
  });
}

function restartEntrance(sc){
  sc.querySelectorAll('.sticker-wrap img,.bleed-wrap img').forEach(el=>{
    el.style.animation='none'; void el.offsetWidth; el.style.animation='';
  });
}

function render(isNewScene){
  scenes.forEach((sc,i)=>{ sc.classList.toggle('active', i===sceneIdx); });
  const sc = scenes[sceneIdx];
  sceneNumEl.textContent = sceneIdx+1;
  if (isNewScene) restartEntrance(sc);
  applyReveal(sc, subStep);
  updateChromeOnly();
}

function go(dir){
  const ts = totalSteps(sceneIdx);
  if (dir>0){
    if (subStep < ts){ subStep++; applyReveal(scenes[sceneIdx], subStep); updateChromeOnly(); }
    else if (sceneIdx < totalScenes-1){ sceneIdx++; subStep=1; render(true); }
  } else {
    if (subStep > 1){ subStep--; applyReveal(scenes[sceneIdx], subStep); updateChromeOnly(); }
    else if (sceneIdx > 0){ sceneIdx--; subStep = totalSteps(sceneIdx); render(true); }
  }
}

function updateChromeOnly(){
  dots.forEach((d,i)=>{ d.classList.toggle('active', i===sceneIdx); d.classList.toggle('done', i<sceneIdx); });
  const atEnd = (sceneIdx===totalScenes-1 && subStep===totalSteps(sceneIdx));
  tapRight.style.pointerEvents = atEnd? 'none':'auto';
  replayBtn.classList.toggle('show', atEnd);
}

tapLeft.addEventListener('click', ()=>go(-1));
tapRight.addEventListener('click', ()=>go(1));
replayBtn.addEventListener('click', (e)=>{e.stopPropagation();sceneIdx=0;subStep=1;render(true);});
document.addEventListener('keydown', (e)=>{
  if (e.key==='ArrowRight'||e.key===' ') go(1);
  else if (e.key==='ArrowLeft') go(-1);
});
let touchX=null;
document.addEventListener('touchstart', e=>{touchX=e.changedTouches[0].clientX;}, {passive:true});
document.addEventListener('touchend', e=>{
  if(touchX===null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx)>40) go(dx<0?1:-1);
  touchX=null;
}, {passive:true});

render(true);