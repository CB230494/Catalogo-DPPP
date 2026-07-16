const programs = [
  {id:'dare', modalPosition:'58% center', title:'D.A.R.E.', short:'Educación para decisiones seguras y responsables.', description:'Programa educativo orientado a fortalecer habilidades para la toma de decisiones, la prevención y la construcción de estilos de vida saludables.', position:'center'},
  {id:'great', modalPosition:'62% center', title:'G.R.E.A.T.', short:'Educación y entrenamiento para resistir las pandillas.', description:'Programa preventivo que promueve habilidades sociales, resolución de conflictos, convivencia y resistencia ante factores de riesgo asociados con pandillas.', position:'center'},
  {id:'mpas', modalPosition:'68% center', title:'Primera Aventura en Seguridad', short:'Aprendizaje preventivo desde las primeras etapas.', description:'Espacio educativo para acercar a niñas y niños a conocimientos básicos de seguridad, autocuidado, prevención de riesgos y convivencia.', position:'center'},
  {id:'pscc', modalPosition:'72% center', title:'Seguridad Comunitaria', short:'Comunidades organizadas para una convivencia más segura.', description:'Programa que impulsa la organización vecinal, la participación ciudadana y el trabajo conjunto con la policía para fortalecer la prevención comunitaria.', position:'center'},
  {id:'vifa', modalPosition:'68% center', title:'VIFA', short:'Prevención de la violencia intrafamiliar.', description:'Programa de información, sensibilización y orientación para prevenir la violencia intrafamiliar y promover relaciones basadas en el respeto y la protección.', position:'center'}
];

let current = 2;
let timer;
const slider = document.querySelector('#slider');
const dots = document.querySelector('#dots');
const modal = document.querySelector('#programModal');

function circularDistance(i, c, n) {
  let d = i - c;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

function render() {
  slider.innerHTML = '';
  dots.innerHTML = '';

  programs.forEach((p, i) => {
    const d = circularDistance(i, current, programs.length);
    const card = document.createElement('article');
    card.className = `program-card${d === 0 ? ' active' : ''}`;

    const x = d * 275;
    const scale = d === 0 ? 1.06 : Math.max(.76, 1 - Math.abs(d) * .09);
    const rot = d * -3.5;

    card.style.transform = `translate(calc(-50% + ${x}px), -50%) scale(${scale}) rotateY(${rot}deg)`;
    card.style.zIndex = 10 - Math.abs(d);
    card.style.opacity = Math.abs(d) > 2 ? .25 : 1;
    card.style.filter = d === 0 ? 'none' : `brightness(${Math.max(.58, .82 - Math.abs(d) * .06)})`;

    card.innerHTML = `
      <img class="cover" src="assets/cards/${p.id}.jpg" alt="${p.title}" loading="eager" decoding="async" style="object-position:${p.position}">
      <div class="card-copy">
        <span class="number">0${i + 1} · PROGRAMA</span>
        <h3>${p.title}</h3>
        <p>${p.short}</p>
        <button type="button">Conocer el programa →</button>
      </div>`;

    card.addEventListener('click', () => {
      if (i !== current) {
        current = i;
        render();
        resetTimer();
      } else {
        openProgram(p);
      }
    });

    slider.appendChild(card);

    const dot = document.createElement('button');
    dot.className = i === current ? 'active' : '';
    dot.setAttribute('aria-label', `Mostrar ${p.title}`);
    dot.addEventListener('click', () => {
      current = i;
      render();
      resetTimer();
    });
    dots.appendChild(dot);
  });
}

function move(step) {
  current = (current + step + programs.length) % programs.length;
  render();
  resetTimer();
}

document.querySelector('.prev').addEventListener('click', () => move(-1));
document.querySelector('.next').addEventListener('click', () => move(1));

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    current = (current + 1) % programs.length;
    render();
  }, 5200);
}

function openProgram(p) {
  const modalBg = document.querySelector('#modalBg');
  modalBg.src = `assets/backgrounds/${p.id}.jpg?v=final3`;
  modalBg.alt = `Imagen del programa ${p.title}`;
  modalBg.style.objectPosition = p.modalPosition || 'center';
  modalBg.dataset.program = p.id;
  document.querySelector('#modalLogo').src = `assets/logos/${p.id}.jpg`;
  document.querySelector('#modalLogo').alt = `Logo del programa ${p.title}`;
  document.querySelector('#modalTitle').textContent = p.title;
  document.querySelector('#modalDescription').textContent = p.description;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (!modal.classList.contains('open') && e.key === 'ArrowLeft') move(-1);
  if (!modal.classList.contains('open') && e.key === 'ArrowRight') move(1);
});

// Precarga de imágenes para evitar cambios bruscos o parpadeos.
['principal', ...programs.map(p => p.id)].forEach(name => {
  const image = new Image();
  image.src = `assets/backgrounds/${name}.jpg`;
});
programs.forEach(p => {
  const image = new Image();
  image.src = `assets/cards/${p.id}.jpg`;
});

render();
resetTimer();
