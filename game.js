(() => {
  const roster = [
    ['dino','Dino'],['rat','Rat'],['monkey','Monkey'],['lion','Lion'],['roach','Cockroach'],['lizard','Lizard'],['snake','Snake'],['human','Human'],['panda','Panda'],['fox','Fox'],['kohli','Virat Kohli'],['dhoni','MS Dhoni'],['modi','Narendra Modi'],['messi','Lionel Messi'],['swift','Taylor Swift'],['astronaut','Astronaut']
  ];
  const $=id=>document.getElementById(id), canvas=$('gameCanvas'),ctx=canvas.getContext('2d'),track=$('trackArea'),figure=$('runnerFigure');
  let chosen=roster[0],state='ready',score=0,best=Number(localStorage.getItem('offline-dash-best')||0),speed=7.2,raf=0,last=0,frame=0,spawnTimer=0,spawnGap=0,groundShift=0,obstacles=[],soundOn=false;
  const player={y:0,vy:0,duck:false};

  function characterSvg(id){
    const line='stroke="#413a33" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
    const human=(shirt,pants,skin,hair,detail='')=>`
      <path d="M34 48 26 57 18 48M57 48l8 8 5-10" fill="none" stroke="${skin}" stroke-width="8" stroke-linecap="round"/>
      <path d="m41 62-5 16-10 4M54 62l5 14 10 4" fill="none" stroke="${pants}" stroke-width="9" stroke-linecap="round"/>
      <path d="m26 82-6 2M68 81l7 1" fill="none" stroke="#423a35" stroke-width="5" stroke-linecap="round"/>
      <path d="M34 32q11-8 23 0l8 25-8 7H33l-8-8z" fill="${shirt}" ${line}/>
      <path d="M41 32v29m11-29v29" fill="none" stroke="${detail||shirt}" stroke-width="2" opacity=".7"/>
      <path d="M34 37 24 47m31-11 10 10" fill="none" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>
      <rect x="42" y="24" width="9" height="12" rx="4" fill="${skin}" ${line}/>
      <circle cx="47" cy="17" r="13" fill="${skin}" ${line}/>
      <path d="M34 17q0-14 13-14 14 0 14 14-6-7-14-7-8 0-13 7" fill="${hair}" ${line}/>
      <circle cx="53" cy="17" r="1.7" fill="#292622"/><path d="m57 22 4 1" fill="none" stroke="#8c5146" stroke-width="1.5"/>
      ${detail?`<path d="M35 39h19" stroke="${detail}" stroke-width="3"/>`:''}`;
    let art='';
    switch(id){
      case 'dino': art=`
        <path d="M34 53Q19 52 8 39q4 16 0 22 17 4 32-4z" fill="#429453" ${line}/>
        <ellipse cx="43" cy="58" rx="24" ry="16" fill="#61b769" ${line}/>
        <path d="m28 51 7 1m8 2 6 1" stroke="#d9eea5" stroke-width="5" stroke-linecap="round"/>
        <path d="m28 64-2 14 7 4 5-3-1-14m15-2 1 13 8 4 5-4-5-16" fill="#32814b" ${line}/>
        <path d="M31 44q-1-9 8-13l2-12q0-13 13-14l13 2q9 2 10 10l-1 10 8 5-2 9-13 1q-8 8-22 5z" fill="#63bd66" ${line}/>
        <path d="m43 20 4-2m6 0 4-2m7 0 4 1" stroke="#88cf76" stroke-width="3" stroke-linecap="round"/>
        <path d="M62 13q9-6 16 0l-3 5q-7-3-13 0z" fill="#3b8249"/>
        <ellipse cx="69" cy="22" rx="5.6" ry="6.2" fill="#fff8d7"/><circle cx="71" cy="22" r="2.6" fill="#262823"/>
        <path d="M75 34q7 0 12 3-5 6-13 4z" fill="#e9a65d" ${line}/>
        <path d="m78 35 2 4m3-3 1 3" stroke="#fff7dd" stroke-width="2"/>
        <path d="M44 43q5-6 10-2l2 5h-9z" fill="#459951" ${line}/>
        <path d="M21 51 13 44m9 12-8 2" fill="none" stroke="#286b3c" stroke-width="2"/>`;
        break;
      case 'rat': art=`
        <path d="M27 61Q7 73 15 82q4 4 7-1" fill="none" stroke="#d88d91" stroke-width="3"/>
        <ellipse cx="44" cy="60" rx="25" ry="15" fill="#a8a09a" ${line}/><path d="M39 66q13 7 24 1" fill="none" stroke="#e4c5ae" stroke-width="5"/>
        <path d="m33 68-4 11m23-10 5 10" stroke="#847a72" stroke-width="5" stroke-linecap="round"/>
        <circle cx="61" cy="39" r="16" fill="#aaa39d" ${line}/><circle cx="53" cy="26" r="7" fill="#d9969d" ${line}/><circle cx="69" cy="26" r="7" fill="#d9969d" ${line}/>
        <ellipse cx="74" cy="44" rx="11" ry="7" fill="#d7c5b8" ${line}/><circle cx="78" cy="42" r="2.6" fill="#d87683"/><circle cx="65" cy="36" r="2" fill="#292622"/>
        <path d="m79 46 8 1m-8 2 8 3m-11-7 7-4" stroke="#776a62" stroke-width="1.3"/>`;
        break;
      case 'monkey': art=`
        <path d="M31 55q-20-8-20 9 0 11 12 8 7-2 3-7" fill="none" stroke="#8e5738" stroke-width="6" stroke-linecap="round"/><path d="M38 62 32 78m20-16 8 16" stroke="#70432f" stroke-width="8" stroke-linecap="round"/>
        <ellipse cx="46" cy="57" rx="20" ry="17" fill="#9a603d" ${line}/><path d="M32 41 26 52m34-10 6 11" stroke="#ad7045" stroke-width="8" stroke-linecap="round"/>
        <circle cx="47" cy="29" r="19" fill="#9a603d" ${line}/><circle cx="29" cy="30" r="8" fill="#b7774a" ${line}/><circle cx="65" cy="30" r="8" fill="#b7774a" ${line}/>
        <path d="M39 29q8-9 17 0l5 11q-8 12-23 4l-5-7z" fill="#edc89b" ${line}/><circle cx="42" cy="27" r="2" fill="#292622"/><circle cx="54" cy="27" r="2" fill="#292622"/><ellipse cx="49" cy="35" rx="3" ry="2" fill="#614131"/>`;
        break;
      case 'lion': art=`
        <path d="M28 59 12 47q6 18-2 25 13 3 21-4" fill="none" stroke="#c97b2b" stroke-width="6" stroke-linecap="round"/><ellipse cx="43" cy="62" rx="24" ry="14" fill="#e9b34b" ${line}/>
        <path d="m31 68-2 11m24-11 5 11" stroke="#a8662c" stroke-width="7" stroke-linecap="round"/><circle cx="49" cy="34" r="25" fill="#d9802f" ${line}/>
        <path d="M39 19q10-10 22 1l10 12-6 20q-13 15-29 1L27 39z" fill="#f2bd53" ${line}/>
        <ellipse cx="59" cy="39" rx="12" ry="9" fill="#fff0c1"/><circle cx="61" cy="33" r="2.4" fill="#292622"/><path d="m68 42 5 3-5 3m-6 1q5 4 10 0" fill="none" stroke="#6f4930" stroke-width="2"/>`;
        break;
      case 'roach': art=`
        <path d="m37 47-11-17m18 13-3-21m11 24 10-17M37 59 20 73m24-11-3 20m14-21 14 13" fill="none" stroke="#62442d" stroke-width="3" stroke-linecap="round"/>
        <path d="M43 43q-10-14-18-20m24 21q2-17 10-23" fill="none" stroke="#65442b" stroke-width="2"/>
        <ellipse cx="48" cy="55" rx="15" ry="25" transform="rotate(18 48 55)" fill="#8a6034" ${line}/><path d="M39 37q13 4 21 14m-23-4q12 4 22 14m-22-4q8 4 18 10" fill="none" stroke="#c89a53" stroke-width="2"/>
        <circle cx="55" cy="28" r="9" fill="#4e3828" ${line}/><circle cx="58" cy="26" r="2" fill="#f2d278"/>`;
        break;
      case 'lizard': art=`
        <path d="M31 58Q12 57 6 44q7 20 0 29 17 0 31-9" fill="#66b97c" ${line}/><ellipse cx="45" cy="59" rx="24" ry="13" fill="#75c888" ${line}/>
        <path d="m35 64-9 13m20-12 9 13m-23-15-12 4m39-5 11 4" fill="none" stroke="#4ca268" stroke-width="6" stroke-linecap="round"/>
        <path d="M54 47q8-12 20-10l8 8-7 10-19 2z" fill="#72c47e" ${line}/><circle cx="70" cy="42" r="6" fill="#e6dc74" ${line}/><circle cx="72" cy="42" r="2.6" fill="#222a25"/>
        <circle cx="39" cy="54" r="2" fill="#d9ec9c"/><circle cx="48" cy="61" r="1.8" fill="#d9ec9c"/>`;
        break;
      case 'snake': art=`
        <path d="M15 73q2-17 19-17t20-14q1-14 15-17" fill="none" stroke="#347d4b" stroke-width="20" stroke-linecap="round"/><path d="M15 69q2-13 19-13t20-14q1-14 15-17" fill="none" stroke="#83c963" stroke-width="13" stroke-linecap="round"/>
        <ellipse cx="72" cy="24" rx="13" ry="10" transform="rotate(-18 72 24)" fill="#70b951" ${line}/><circle cx="76" cy="21" r="2.4" fill="#25251f"/><path d="M80 27q9 3 7 9" fill="none" stroke="#df6572" stroke-width="2.5" stroke-linecap="round"/><path d="m22 60 4-4m12 4 4-5m11-5 4-5" stroke="#d2df78" stroke-width="2"/>`;
        break;
      case 'human': art=human('#ed9b52','#426eaa','#d69b77','#49342d');break;
      case 'panda': art=`
        <path d="M33 50q-11 3-12 17l9 8 10-12m13-13q13 3 14 16l-9 8-10-13" fill="#fffaf0" ${line}/><ellipse cx="46" cy="63" rx="20" ry="18" fill="#fffaf0" ${line}/>
        <path d="m34 71-3 9 13 1m12-10 4 9-13 2" fill="none" stroke="#252d34" stroke-width="9" stroke-linecap="round"/><circle cx="46" cy="31" r="20" fill="#fffaf0" ${line}/>
        <circle cx="32" cy="16" r="8" fill="#283038"/><circle cx="60" cy="16" r="8" fill="#283038"/><ellipse cx="39" cy="30" rx="6" ry="8" transform="rotate(30 39 30)" fill="#303940"/><ellipse cx="53" cy="30" rx="6" ry="8" transform="rotate(-30 53 30)" fill="#303940"/>
        <circle cx="40" cy="30" r="2" fill="#fff"/><circle cx="53" cy="30" r="2" fill="#fff"/><ellipse cx="47" cy="38" rx="4" ry="3" fill="#262c30"/>`;
        break;
      case 'fox': art=`
        <path d="M34 62Q18 70 8 55q2 19 17 22 10 1 15-8" fill="#e87835" ${line}/><path d="m12 56 12 4-2 11q-8-3-10-15" fill="#fff0d7"/>
        <ellipse cx="47" cy="60" rx="20" ry="15" fill="#e97d38" ${line}/><path d="m39 66-2 12m17-12 5 12" stroke="#bd5a2c" stroke-width="7" stroke-linecap="round"/>
        <path d="m38 22-12-15-1 26m25-10 15-15-2 29" fill="#eb813d" ${line}/><path d="m34 19-5-6-1 14m25-7 7-7-1 15" fill="#fff0d6"/>
        <path d="M29 32q2-17 19-17 19 0 21 18l-5 15-15 8-19-9z" fill="#ed873f" ${line}/><path d="m45 37 14 1 12 9-14 7-13-7z" fill="#fff1d9"/><circle cx="55" cy="31" r="2.2" fill="#282321"/><path d="m68 42 5 3-5 3" fill="#51372f"/>`;
        break;
      case 'kohli': art=human('#2878ce','#24456c','#bd8064','#2b2524','#f3c84b')+`<path d="m26 47 8-5" stroke="#f4d45d" stroke-width="3"/>`;break;
      case 'dhoni': art=human('#3179c2','#263e5b','#c58b6b','#222a30','#f2f0dc')+`<path d="M66 50 75 32l4 2-7 20z" fill="#bd8750" ${line}/><rect x="73" y="29" width="7" height="5" rx="2" fill="#d9bd8a"/>`;break;
      case 'modi': art=`
        <path d="m39 62-4 17-10 4m24-20 5 17 10 3" fill="none" stroke="#e5e0d3" stroke-width="10" stroke-linecap="round"/>
        <path d="m25 82-6 2m55 0-7-1" fill="none" stroke="#403b37" stroke-width="5" stroke-linecap="round"/>
        <path d="M34 36q13-9 26 0l7 28-8 8H31l-7-8z" fill="#f4efe2" ${line}/>
        <path d="M38 39 47 45 43 69 31 68 34 44zm18 0-9 6 4 24h13l-4-25z" fill="#d9d1c0" ${line}/>
        <path d="M39 47h15m-14 8h13m-12 8h11" stroke="#b8ad99" stroke-width="1.4"/>
        <circle cx="43" cy="51" r="1.2" fill="#8d806e"/><circle cx="52" cy="51" r="1.2" fill="#8d806e"/><circle cx="45" cy="59" r="1.2" fill="#8d806e"/>
        <path d="M34 40 25 47l-4 11m34-17 9 5 6 11" fill="none" stroke="#c58c6b" stroke-width="7" stroke-linecap="round"/>
        <path d="m35 38 7 3-5 30-8-5zm21 1 7 3-4 28-8-2z" fill="#e68b32" ${line}/>
        <path d="m37 42 4 2m13-1 4 2" stroke="#ffd18b" stroke-width="2"/>
        <rect x="42" y="24" width="10" height="12" rx="4" fill="#b77c60" ${line}/>
        <path d="M34 16q0-13 13-13 14 0 15 14l-3 12q-3 10-12 11-10-2-13-12z" fill="#c88d6d" ${line}/>
        <path d="M34 17Q31 11 35 6q3-4 9-5 8-1 13 3 6 4 6 12-5-5-10-6-6-2-11 2-4 3-8 5z" fill="#d9d7cf" ${line}/>
        <path d="M34 13q-3 4-1 10l3 2 2-9m23-7q5 4 3 11l-3 2-2-8" fill="#d9d7cf" ${line}/>
        <path d="M35 10q2-5 7-6m1 4q5-6 11-3m1 3q5-1 7 4" fill="none" stroke="#faf8f0" stroke-width="2.1" stroke-linecap="round"/>
        <path d="M37 13q3-3 6-4m11-2 4 3" fill="none" stroke="#aaa89f" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M34 23q-5-3-5 2 0 5 5 5m27-7q5-3 5 2 0 5-5 5" fill="#c88d6d" ${line}/>
        <path d="M34 25q0-4 6-4t7 4q0-4 7-4t7 4l-1 8q-2 10-12 12-10-2-12-12z" fill="#f2eee5" ${line}/>
        <path d="M37 27q4-3 9 0m4 0q5-3 9 0" fill="none" stroke="#6b6257" stroke-width="1.6"/>
        <circle cx="42" cy="25" r="5.5" fill="none" stroke="#564c43" stroke-width="1.5"/><circle cx="54" cy="25" r="5.5" fill="none" stroke="#564c43" stroke-width="1.5"/><path d="M47.5 25h1" stroke="#564c43" stroke-width="1.5"/>
        <circle cx="42" cy="25" r="1.3" fill="#292622"/><circle cx="54" cy="25" r="1.3" fill="#292622"/>
        <path d="M46 10v5" stroke="#bd503b" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M39 34q8-5 17 0-2 5-8 5-6 0-9-5z" fill="#e2ded4"/><path d="M39 31q8 5 17 0" fill="none" stroke="#f7f4eb" stroke-width="3.3" stroke-linecap="round"/>`;
        break;
      case 'messi': art=human('#66b9e4','#315b89','#d69b7d','#704c34','#f4f2e9');break;
      case 'swift': art=human('#bd7bb3','#a84f78','#f1c3a4','#e1bd5b','#f5d5e6')+`<path d="M74 42v14m-4-5 4-3 4 3" fill="none" stroke="#493d42" stroke-width="2.5"/><circle cx="74" cy="39" r="4" fill="#c6a6ad"/>`;break;
      case 'astronaut': art=`
        <path d="M34 42 24 53l8 8 8-9m15-10 10 10-7 8-9-10" fill="#e6e9e7" ${line}/><path d="m40 58-4 18-9 6m25-24 6 18 9 5" fill="none" stroke="#d7dcdb" stroke-width="10" stroke-linecap="round"/>
        <path d="M34 38q12-9 24 0l7 23H28z" fill="#f4f4ec" ${line}/><path d="M43 42v16m8-16v16" stroke="#5bb4d1" stroke-width="3"/><circle cx="47" cy="21" r="20" fill="#f5f5ed" ${line}/><path d="M33 19q3-13 15-13 13 0 15 13l-3 9H36z" fill="#60bfdd" ${line}/><path d="M39 17q7-8 17-2" fill="none" stroke="#b9e8f5" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="54" r="4" fill="#e0715b"/><path d="M32 82h-9m36 0h9" stroke="#344659" stroke-width="5" stroke-linecap="round"/>`;
        break;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" role="img" aria-label="${roster.find(c=>c[0]===id)?.[1]||'Runner'}"><ellipse cx="45" cy="84" rx="30" ry="4" fill="#352e2a" opacity=".12"/>${art}</svg>`;
  }

  $('score').textContent=pad(best);
  function pad(n){return String(Math.floor(n)).padStart(5,'0')}
  $('pickerList').innerHTML=roster.map(([id,name])=>`<button class="pick-option ${id===chosen[0]?'selected':''}" role="option" aria-selected="${id===chosen[0]}" data-id="${id}"><span class="char-figurine">${characterSvg(id)}</span><span>${name}</span></button>`).join('');
  function setCharacter(id){chosen=roster.find(c=>c[0]===id)||roster[0];figure.innerHTML=characterSvg(chosen[0]);$('pickerList').querySelectorAll('.pick-option').forEach(b=>{const active=b.dataset.id===chosen[0];b.classList.toggle('selected',active);b.setAttribute('aria-selected',String(active))});$('nameButton').innerHTML=`${chosen[1].toUpperCase()} <span>▾</span>`;paint()}
  $('nameButton').addEventListener('click',()=>{const open=$('picker').classList.toggle('hidden')===false;$('nameButton').setAttribute('aria-expanded',String(open))});
  $('pickerList').addEventListener('click',e=>{const b=e.target.closest('.pick-option');if(!b)return;setCharacter(b.dataset.id);$('picker').classList.add('hidden');$('nameButton').setAttribute('aria-expanded','false')});
  document.addEventListener('click',e=>{if(!e.target.closest('.picker-wrap')){$('picker').classList.add('hidden');$('nameButton').setAttribute('aria-expanded','false')}});
  $('muteButton').addEventListener('click',()=>{$('muteButton').textContent=soundOn?'mute':'sound';soundOn=!soundOn;if(soundOn)beep(560)});
  function beep(freq=420){if(!soundOn)return;try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.frequency.value=freq;g.gain.value=.025;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.06)}catch{}}
  function size(){const r=track.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(r.width*d);canvas.height=Math.floor(r.height*d);ctx.setTransform(d,0,0,d,0,0);paint()}
  const W=()=>track.clientWidth,H=()=>track.clientHeight,base=()=>H()-16;
  setCharacter(chosen[0]);
  function color(){return document.body.classList.contains('dark')?'#b9b9b9':'#555'}
  function cactus(o){ctx.fillStyle=color();const x=Math.round(o.x),y=base(),w=o.w,h=o.h;ctx.fillRect(x+Math.floor(w*.35),y-h,Math.ceil(w*.32),h);ctx.fillRect(x,y-h+Math.floor(h*.4),Math.ceil(w*.4),4);ctx.fillRect(x,y-h+Math.floor(h*.4),4,Math.floor(h*.34));ctx.fillRect(x+Math.floor(w*.65),y-h+Math.floor(h*.58),Math.ceil(w*.35),4);ctx.fillRect(x+w-4,y-h+Math.floor(h*.58),4,Math.floor(h*.26))}
  function bird(o){
    const x=Math.round(o.x),top=Math.round(base()-o.altitude-o.h),wingUp=Math.floor(frame/8)%2===0;ctx.fillStyle=color();
    ctx.beginPath();ctx.ellipse(x+20,top+12,13,6,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x+31,top+7,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(x+34,top+6);ctx.lineTo(x+42,top+9);ctx.lineTo(x+34,top+11);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(x+10,top+11);ctx.lineTo(x,top+7);ctx.lineTo(x+7,top+15);ctx.closePath();ctx.fill();
    ctx.beginPath();if(wingUp){ctx.moveTo(x+15,top+10);ctx.lineTo(x+10,top-3);ctx.lineTo(x+18,top+2);ctx.lineTo(x+23,top-5);ctx.lineTo(x+25,top+8);ctx.closePath()}else{ctx.moveTo(x+14,top+13);ctx.lineTo(x+8,top+25);ctx.lineTo(x+18,top+20);ctx.lineTo(x+25,top+26);ctx.lineTo(x+25,top+13);ctx.closePath()}ctx.fill();
    ctx.fillStyle=document.body.classList.contains('dark')?'#202124':'#f7f7f7';ctx.fillRect(x+32,top+5,2,2);
  }
  function spawnObstacle(){
    const w=W(),birdChance=score<110?0:Math.min(.38,.16+(score-110)/900);
    if(Math.random()<birdChance){const altitudes=[43,67,91];obstacles.push({type:'bird',x:w+18,w:43,h:19,altitude:altitudes[Math.floor(Math.random()*altitudes.length)]});return}
    const count=score>280&&Math.random()<.18?3:Math.random()<Math.min(.58,.28+score/1300)?2:1;
    for(let i=0;i<count;i++)obstacles.push({type:'cactus',x:w+18+i*(13+Math.random()*8),w:15+Math.floor(Math.random()*8),h:29+Math.random()*23});
  }
  function positionFigure(){const x=Math.max(12,W()*.035);figure.style.left=`${x}px`;figure.style.bottom='12px';figure.style.transform=`translateY(${player.y}px) scaleY(${player.duck?.52:1})`;figure.classList.toggle('ducking',player.duck)}
  function paint(){if(!ctx)return;const w=W(),h=H(),y=base();ctx.clearRect(0,0,w,h);ctx.fillStyle=color();ctx.fillRect(0,y,w,1);for(let i=0;i<24;i++){const x=((i*37-groundShift)%w+w)%w;ctx.fillRect(x,y+4+(i%3),i%4===0?4:2,1)}drawCloud(w*.60,24);drawCloud(w*.78,33);obstacles.forEach(o=>o.type==='bird'?bird(o):cactus(o));positionFigure()}
  function drawCloud(x,y){ctx.fillStyle=document.body.classList.contains('dark')?'#454545':'#e5e5e5';ctx.fillRect(x,y+7,26,1);ctx.fillRect(x+5,y+4,3,4);ctx.fillRect(x+8,y+2,9,2);ctx.fillRect(x+17,y+4,4,4);ctx.fillRect(x+21,y+6,3,2)}
  function begin(){if(state==='running')return;state='running';figure.classList.add('running');score=0;speed=7.2;frame=0;last=0;spawnTimer=0;spawnGap=56+Math.random()*28;player.y=0;player.vy=0;player.duck=false;obstacles=[];$('message').classList.remove('show');beep(600);cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
  function jump(){if(state!=='running'){begin();return}if(player.vy===0){player.duck=false;player.vy=-10.8;beep(460)}}
  function loop(t){if(state!=='running')return;const dt=Math.min((t-(last||t))/16.67,2);last=t;frame+=dt;const w=W(),y=base(),px=Math.max(12,w*.035);player.vy+=.58*dt;player.y=Math.min(0,player.y+player.vy*dt);if(player.y===0)player.vy=0;groundShift=(groundShift+speed*dt)%w;spawnTimer+=dt;if(spawnTimer>=spawnGap){spawnObstacle();spawnTimer=0;spawnGap=Math.max(39,(62+Math.random()*37)*(7.2/speed))}obstacles.forEach(o=>o.x-=speed*dt);obstacles=obstacles.filter(o=>o.x>(o.type==='bird'?-50:-25));
    for(const o of obstacles){const left=px+11,right=px+63,playerTop=y-(player.duck?38:69)+player.y,playerBottom=y+player.y;let hit=false;if(o.type==='bird'){const birdTop=y-o.altitude-o.h,birdBottom=y-o.altitude;hit=left<o.x+o.w&&right>o.x&&playerTop<birdBottom&&playerBottom>birdTop}else{const cactusTop=y-o.h;hit=left<o.x+o.w&&right>o.x&&playerTop<y&&playerBottom>cactusTop}if(hit){end();return}}
    score+=.12*dt;speed=Math.min(13,7.2+score/145);if(Math.floor(score)>best){best=Math.floor(score);localStorage.setItem('offline-dash-best',best)}$('score').textContent=pad(score);paint();raf=requestAnimationFrame(loop)}
  function end(){state='over';player.duck=false;figure.classList.remove('running');positionFigure();$('message').textContent='GAME OVER — PRESS SPACE TO RESTART';$('message').classList.add('show');beep(180)}
  window.addEventListener('keydown',e=>{if(['Space','ArrowUp'].includes(e.code)){e.preventDefault();jump()}else if(e.code==='ArrowDown'&&state==='running'){e.preventDefault();player.duck=true;positionFigure()}});
  window.addEventListener('keyup',e=>{if(e.code==='ArrowDown'){player.duck=false;positionFigure()}});
  const jumpButton=$('jumpButton'),duckButton=$('duckButton');
  jumpButton.addEventListener('pointerdown',e=>{e.preventDefault();jump()});
  duckButton.addEventListener('pointerdown',e=>{e.preventDefault();if(state!=='running')begin();player.duck=true;positionFigure();try{duckButton.setPointerCapture(e.pointerId)}catch{}});
  const releaseDuck=()=>{player.duck=false;positionFigure()};
  duckButton.addEventListener('pointerup',releaseDuck);duckButton.addEventListener('pointercancel',releaseDuck);duckButton.addEventListener('lostpointercapture',releaseDuck);
  window.addEventListener('blur',()=>{if(player.duck)releaseDuck()});
  track.addEventListener('pointerdown',()=>jump());window.addEventListener('resize',size);size();$('message').textContent='PRESS SPACE TO START';$('message').classList.add('show');
})();
