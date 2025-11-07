const $ = id => document.getElementById(id);
const apiBase = '';

function authHeaders(){ return { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }; }

window.addEventListener('load', ()=>{
  $('a-login').addEventListener('click', async ()=>{
    const correo = $('a-correo').value, password = $('a-password').value;
    const res = await fetch('/api/aprendiz/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ correo, password }) });
    const data = await res.json();
    if(!data.ok){ alert(data.error||'Error'); return; }
    localStorage.setItem('token', data.token);
    showPanel();
  });

  $('a-logout').addEventListener('click', ()=>{ localStorage.removeItem('token'); location.reload(); });

  $('crear-aprendiz').addEventListener('click', async ()=>{
    const nombre = $('nuevo-nombre').value, correo = $('nuevo-correo').value, password = $('nuevo-pass').value;
    if(!nombre||!correo||!password){ alert('Completa campos'); return; }
    const res = await fetch('/api/funcionario/aprendices', { method:'POST', headers: authHeaders(), body: JSON.stringify({ nombre, correo, password }) });
    const data = await res.json();
    if(!data.ok){ alert(data.error||'Error'); return; }
    alert('Aprendiz creado'); loadAprendices();
  });

  $('cargar-aprendices').addEventListener('click', loadAprendices);
  $('crear-horario').addEventListener('click', async ()=>{
    const aprendiz_id = $('h-aprendiz-id').value, dia=$('h-dia').value, hora_inicio=$('h-inicio').value, hora_fin=$('h-fin').value, materia=$('h-materia').value;
    if(!aprendiz_id||!dia||!hora_inicio||!hora_fin){ alert('Completa campos'); return; }
    const res = await fetch('/api/funcionario/horarios', { method:'POST', headers: authHeaders(), body: JSON.stringify({ aprendiz_id, dia, hora_inicio, hora_fin, materia }) });
    const data = await res.json();
    if(!data.ok){ alert(data.error||'Error'); return; }
    alert('Horario creado'); loadHorarios();
  });
  $('cargar-horarios').addEventListener('click', loadHorarios);

  // if token exists, show panel
  if(localStorage.getItem('token')) showPanel();
});

function showPanel(){ $('admin-login').classList.add('hidden'); $('admin-panel').classList.remove('hidden'); loadAprendices(); loadHorarios(); }

async function loadAprendices(){
  const res = await fetch('/api/funcionario/aprendices', { headers: authHeaders() });
  const data = await res.json();
  if(!data.ok){ alert(data.error||'Error'); return; }
  const ul = $('lista-aprendices'); ul.innerHTML='';
  data.aprendices.forEach(a=>{
    const li = document.createElement('li');
    li.textContent = `${a.id} - ${a.nombre} (${a.correo})`;
    const btnDel = document.createElement('button'); btnDel.textContent='Eliminar';
    btnDel.addEventListener('click', async ()=>{
      if(!confirm('Eliminar aprendiz?')) return;
      const res = await fetch('/api/funcionario/aprendices/'+a.id, { method:'DELETE', headers: authHeaders() });
      const r = await res.json();
      if(!r.ok) alert(r.error||'Error'); else loadAprendices();
    });
    li.appendChild(btnDel);
    ul.appendChild(li);
  });
}

async function loadHorarios(){
  const res = await fetch('/api/funcionario/horarios', { headers: authHeaders() });
  const data = await res.json();
  if(!data.ok){ alert(data.error||'Error'); return; }
  const ul = $('lista-horarios-admin'); ul.innerHTML='';
  data.horarios.forEach(h=>{
    const li = document.createElement('li');
    li.textContent = `${h.id} - Aprendiz:${h.aprendiz_id} | ${h.dia} ${h.hora_inicio}-${h.hora_fin} (${h.materia||''})`;
    const btnDel = document.createElement('button'); btnDel.textContent='Eliminar';
    btnDel.addEventListener('click', async ()=>{
      if(!confirm('Eliminar horario?')) return;
      const res = await fetch('/api/funcionario/horarios/'+h.id, { method:'DELETE', headers: authHeaders() });
      const r = await res.json();
      if(!r.ok) alert(r.error||'Error'); else loadHorarios();
    });
    li.appendChild(btnDel);
    ul.appendChild(li);
  });
}
