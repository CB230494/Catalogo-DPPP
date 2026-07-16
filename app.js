const programs = [
  {id:'dare', title:'D.A.R.E.', short:'Educación para decisiones seguras y responsables.', description:'Programa educativo orientado a fortalecer habilidades para la toma de decisiones, la prevención y la construcción de estilos de vida saludables.'},
  {id:'great', title:'G.R.E.A.T.', short:'Educación y entrenamiento para resistir las pandillas.', description:'Programa preventivo que promueve habilidades sociales, resolución de conflictos, convivencia y resistencia ante factores de riesgo asociados con pandillas.'},
  {id:'mpas', title:'Primera Aventura en Seguridad', short:'Aprendizaje preventivo desde las primeras etapas.', description:'Espacio educativo para acercar a niñas y niños a conocimientos básicos de seguridad, autocuidado, prevención de riesgos y convivencia.'},
  {id:'pscc', title:'Seguridad Comunitaria', short:'Comunidades organizadas para una convivencia más segura.', description:'Programa que impulsa la organización vecinal, la participación ciudadana y el trabajo conjunto con la policía para fortalecer la prevención comunitaria.'},
  {id:'vifa', title:'VIFA', short:'Prevención de la violencia intrafamiliar.', description:'Programa de información, sensibilización y orientación para prevenir la violencia intrafamiliar y promover relaciones basadas en el respeto y la protección.'}
];
let current=2, timer;
const slider=document.querySelector('#slider'),dots=document.querySelector('#dots');
function circularDistance(i,c,n){let d=i-c;if(d>n/2)d-=n;if(d<-n/2)d+=n;return d}
function render(){
 slider.innerHTML=''; dots.innerHTML='';
 programs.forEach((p,i)=>{
   const d=circularDistance(i,current,programs.length);
   const card=document.createElement('article'); card.className='program-card'+(d===0?' active':'');
   const x=d*255, scale=d===0?1.08:Math.max(.72,1-Math.abs(d)*.1), rot=d*-4;
   card.style.transform=`translate(calc(-50% + ${x}px),-50%) scale(${scale}) rotateY(${rot}deg)`;
   card.style.zIndex=10-Math.abs(d); card.style.opacity=Math.abs(d)>2?.2:1; card.style.filter=d===0?'none':`brightness(${.78-Math.abs(d)*.05})`;
   card.innerHTML=`<img class="cover" src="assets/cards/${p.id}.jpg" alt="${p.title}"><div class="card-copy"><span class="number">0${i+1} · PROGRAMA</span><h3>${p.title}</h3><p>${p.short}</p><button>Conocer el programa →</button></div>`;
   card.addEventListener('click',()=>{if(i!==current){current=i;render();resetTimer()}else openProgram(p)}); slider.appendChild(card);
   const dot=document.createElement('button'); dot.className=i===current?'active':''; dot.ariaLabel=`Mostrar ${p.title}`; dot.onclick=()=>{current=i;render();resetTimer()}; dots.appendChild(dot);
 });
}
function move(step){current=(current+step+programs.length)%programs.length;render();resetTimer()}
document.querySelector('.prev').onclick=()=>move(-1); document.querySelector('.next').onclick=()=>move(1);
function resetTimer(){clearInterval(timer);timer=setInterval(()=>{current=(current+1)%programs.length;render()},5200)}
const modal=document.querySelector('#programModal');
function openProgram(p){document.querySelector('#modalBg').src=`assets/backgrounds/${p.id}.jpg`;document.querySelector('#modalLogo').src=`assets/logos/${p.id}.jpg`;document.querySelector('#modalTitle').textContent=p.title;document.querySelector('#modalDescription').textContent=p.description;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
render();resetTimer();