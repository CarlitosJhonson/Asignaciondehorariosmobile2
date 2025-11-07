const apiBase = '';

const $ = id => document.getElementById(id);

const show = (sel) => { document.querySelectorAll('section').forEach(s=>s.classList.add('hidden')); document.querySelector(sel).classList.remove('hidden'); };

window.addEventListener('load', ()=>{
  show('#login-section');

  $('btn-login').addEventListener('click', async ()=>{
    const correo = $('correo').value;
    const password = $('password').value;
    try {
      const res = await fetch(apiBase + '/api/aprendiz/login', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ correo, password })
      });
      const data = await res.json();
      if(!data.ok){ alert(data.error || 'Error'); return; }
      localStorage.setItem('token', data.token);
      loadHorarios();
    } catch (err) { console.error(err); alert('Error de conexión'); }
  });

  $('btn-logout').addEventListener('click', ()=>{ localStorage.removeItem('token'); show('#login-section'); });
});

async function loadHorarios(){
  const token = localStorage.getItem('token');
  if(!token) return show('#login-section');
  try{
    const res = await fetch('/api/aprendiz/mis-horarios', { headers: { 'Authorization': 'Bearer ' + token } });
    const data = await res.json();
    if(!data.ok){ alert(data.error || 'No autorizado'); localStorage.removeItem('token'); return show('#login-section'); }
    const ul = $('lista-horarios'); ul.innerHTML='';
    data.horarios.forEach(h=>{
      const li = document.createElement('li');
      li.textContent = `${h.dia} - ${h.hora_inicio} a ${h.hora_fin} (${h.materia || 'Materia'})`;
      ul.appendChild(li);
    });
    show('#horarios-section');
  }catch(e){ console.error(e); alert('Error al cargar horarios'); }
}
