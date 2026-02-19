if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

let data = JSON.parse(localStorage.getItem("matrizData")) || {};

const select = document.getElementById("propositoSelect");

function guardar(){
  localStorage.setItem("matrizData", JSON.stringify(data));
}

function cargarPropositos(){
  select.innerHTML="";
  Object.keys(data).forEach(p=>{
    const opt=document.createElement("option");
    opt.textContent=p;
    select.appendChild(opt);
  });
}

function agregarProposito(){
  const nombre=document.getElementById("nuevoProposito").value.trim();
  if(!nombre) return;

  if(!data[nombre]) data[nombre]=[];
  guardar();
  cargarPropositos();
  select.value=nombre;
  render();
}

function eliminarProposito(){
  const p=select.value;
  delete data[p];
  guardar();
  cargarPropositos();
  render();
}

function render(){
  ["hacer","programar","delegar","eliminar"].forEach(id=>{
    document.getElementById(id).innerHTML="";
  });

  const tareas=data[select.value]||[];

  tareas.forEach((t,i)=>{
    let lista="eliminar";

    if(t.importancia==="Importante" && t.urgencia==="Urgente") lista="hacer";
    else if(t.importancia==="Importante") lista="programar";
    else if(t.urgencia==="Urgente") lista="delegar";

    const li=document.createElement("li");
    li.textContent=t.nombre;

    const btn=document.createElement("button");
    btn.textContent="❌";
    btn.onclick=()=>eliminarTarea(i);

    li.appendChild(btn);
    document.getElementById(lista).appendChild(li);
  });
}

function agregarTarea(){
  const nombre=document.getElementById("nuevaTarea").value;
  const importancia=document.getElementById("importancia").value;
  const urgencia=document.getElementById("urgencia").value;

  if(!data[select.value]) return;

  data[select.value].push({nombre,importancia,urgencia});
  guardar();
  render();
}

function eliminarTarea(index){
  data[select.value].splice(index,1);
  guardar();
  render();
}

select.addEventListener("change",render);

cargarPropositos();
render();
