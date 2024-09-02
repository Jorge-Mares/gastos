var tpresupuesto = 0;
var gastoslocal = JSON.parse(localStorage.getItem("gastos")) || [];
var divPresupuesto = document.getElementById("divpresupuesto");
var presupuesto = document.getElementById("presupuesto");
var btnpresupuesto = document.getElementById("btnPre");
var divGastos = document.getElementById("divgastos");
var totalpresupuesto = document.getElementById("totalpre");
var guardar = document.getElementById("guardar");
var progress = document.getElementById("progress");
var listasgastos = document.getElementById("listasgastos");
var totalGastos = document.getElementById("totalgastos");
var disponible = document.getElementById("totaldisponible");
let progreso;
var filtrar = document.getElementById("filtrarcate");



btnpresupuesto.onclick = () => {
  tpresupuesto = parseFloat(presupuesto.value);
  if (isNaN(tpresupuesto) || tpresupuesto <= 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ingresa un número mayor a 0!",
    });
    return;
  }
  divPresupuesto.classList.remove("d-block");
  divGastos.classList.remove("d-none");
  divPresupuesto.classList.add("d-none");
  divGastos.classList.add("d-block");
  totalpresupuesto.innerHTML = `$ ${tpresupuesto.toFixed(2)}`;

  mostrarGastos();
}


const guardarGastos = () => {
    gastoslocal = JSON.parse(localStorage.getItem("gastos")) || [];
    let desc = document.getElementById("Descripcion").value;
    let costo = parseFloat(document.getElementById("Gastos").value);
    let categoria = document.getElementById("cate2").value;
    
    const gastadototal = calcularGastoTotal();
    const presupuestoDisponible = tpresupuesto - gastadototal;
  
    if (isNaN(costo) || costo <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ingresa un costo válido!",
      });
      return;
    }

    if(categoria==="todos"){
      Swal.fire({
        icon: "error",
        title: "Seleccione una categoria",
        text: "SELECCIONA UNA CATEGORIA!",
      });
      return;
    }
  
    if (costo > presupuestoDisponible) {
      Swal.fire({
        icon: "error",
        title: "Presupuesto insuficiente",
        text: "El gasto supera el presupuesto disponible!",
      });
      return;
    }
   
  
    const gasto1 = { desc, costo, categoria };
    gastoslocal.push(gasto1);
    localStorage.setItem("gastos", JSON.stringify(gastoslocal));
    mostrarGastos();
    document.querySelector("#guardar").reset();
    $('#nuevoGasto').modal('hide');
   
  }

const categoriaImagenes = {
  "comida": "img/comida.jpg",
  "ahorro": "img/ahorro.jpg",
  "varios": "img/varios.jpg",
  "ocio": "img/ocio.jpg",
  "salud": "img/salud.jpg",
  "suscripciones": "img/suscripciones.jpg",
  "casa": "img/casa.jpg",
};

const calcularGastoTotal = () => {
 const jsonString = localStorage.getItem("gastos");
  let total = 0;

  if (jsonString) {
    const arrayData = JSON.parse(jsonString);
    
    if (Array.isArray(arrayData)) {
      total = arrayData.reduce((acc, gasto) => acc + parseFloat(gasto.costo), 0);
    }
  }

  return total;
}

const mostrarGastos = (categoriaFiltro = null) => {
  const jsonString = localStorage.getItem("gastos");
  
  if (jsonString) {
    const arrayData = JSON.parse(jsonString);
    
    if (Array.isArray(arrayData)) {
      
      let gastosFiltrados = arrayData;
      
      if (categoriaFiltro && categoriaFiltro !== "todos") {
        gastosFiltrados = arrayData.filter(gasto => gasto.categoria === categoriaFiltro);
      }
      
      listasgastos.innerHTML = '';
      
      gastosFiltrados.forEach((gasto, index) => {
        const imagenCategoria = categoriaImagenes[gasto.categoria] || 'img/default.jpg'; 
        
        listasgastos.innerHTML += `
        <div class="card text-center w-50 m-auto mt-3 shadow p-2">
          <div class="row">
            <div class="col"> 
              <img src="${imagenCategoria}" alt="${gasto.categoria}" class="img-fluid" style="width: 70px; height: 70px;">
            </div>
            <div class="col">
              <span>Descripción:</span><b>${gasto.desc}</b><br>
              <span>Costo:</span><b>$${parseFloat(gasto.costo).toFixed(2)}</b>
            </div>
            <div class="col"> 
              <button class="btn btn-success w-75 m-auto my-2" data-bs-toggle="modal" data-bs-target="#Editar" onclick="cargarDatos(${index})">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"/>
                </svg>
              </button>
              <button class="btn btn-success w-75 m-auto my-2" onclick="eliminar(${index})">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="white" fill-rule="evenodd" d="m18.412 6.5l-.801 13.617A2 2 0 0 1 15.614 22H8.386a2 2 0 0 1-1.997-1.883L5.59 6.5H3.5v-1A.5.5 0 0 1 4 5h16a.5.5 0 0 1 .5.5v1zM10 2.5h4a.5.5 0 0 1 .5.5v1h-5V3a.5.5 0 0 1 .5-.5M9 9l.5 9H11l-.4-9zm4.5 0l-.5 9h1.5l.5-9z"/></svg>
              </button>
            </div>
          </div>
        </div>
        `;
      });

      
      const gastadototal = gastosFiltrados.reduce((acc, gasto) => acc + parseFloat(gasto.costo), 0);
      totalGastos.innerHTML = `: $${gastadototal.toFixed(2)}`;
      
  
      const presupuestoDisponible = tpresupuesto - gastadototal;
      disponible.innerHTML = `: $${presupuestoDisponible.toFixed(2)}`;

      if (progress) {
        const porcentajeDisponible = (presupuestoDisponible / tpresupuesto) * 100;
      
        progress.innerHTML = `<circle-progress value='${porcentajeDisponible}' min="0" max="100" class="m-auto" text-format="percent"></circle-progress>`;
      }
    } else {
      console.log('ERROR');
    }
  } else {
    console.log('El dato no existe ');
  }
}


 
const cargarDatos= (index) => {
  const gasto = gastoslocal[index];
  document.getElementById("gastoIndex").value = index;
  document.getElementById("Descripcionedit").value = gasto.desc;
  document.getElementById("Gastosedit").value = gasto.costo;
  document.getElementById("cate2edit").value = gasto.categoria;
}


const editar = () => {
    const index = parseInt(document.getElementById("gastoIndex").value);
    const desc = document.getElementById("Descripcionedit").value;
    const costo = parseFloat(document.getElementById("Gastosedit").value);
    const categoria = document.getElementById("cate2edit").value;
    
    const gastadototal = calcularGastoTotal();
    const presupuestoDisponible = tpresupuesto - gastadototal + (parseFloat(gastoslocal[index].costo) || 0);
  
    if (isNaN(costo) || costo <= 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ingresa un costo válido!",
      });
      return;
    }

    if(categoria==="todos"){
      Swal.fire({
        icon: "error",
        title: "Seleccione una categoria",
        text: "SELECCIONA UNA CATEGORIA!",
      });
      return;
    } 
  
    if (costo > presupuestoDisponible) {
      Swal.fire({
        icon: "error",
        title: "Presupuesto insuficiente",
        text: "El gasto actualizado supera el presupuesto disponible!",
      });
      return;
    }
  
    gastoslocal[index] = { desc, costo, categoria };
    localStorage.setItem("gastos", JSON.stringify(gastoslocal));
    mostrarGastos();
    $('#Editar').modal('hide'); 
  }
  const eliminar = (index) => {
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar este gasto después de ser  eliminado!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a0db8e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
      
        gastoslocal.splice(index, 1);
        
        localStorage.setItem("gastos", JSON.stringify(gastoslocal));
        
        
        mostrarGastos();
     
        Swal.fire(
          'Eliminado!',
          'El gasto ha sido eliminado.',
          'success'
        );
      }
    });
  }

  const reset = () => {
    
    localStorage.removeItem("gastos");
    gastoslocal = [];
    tpresupuesto = 0;
  
    
    totalpresupuesto.innerHTML = `$ 0.00`;
    totalGastos.innerHTML = `: $0.00`;
    disponible.innerHTML = `: $0.00`;
    listasgastos.innerHTML = '';
  

    presupuesto.value = '0';
  
   
    divPresupuesto.classList.remove("d-none");
    divGastos.classList.remove("d-block");
    divPresupuesto.classList.add("d-block");
    divGastos.classList.add("d-none");
  
   
    $('#Editar').modal('hide');
    $('#nuevoGasto').modal('hide');
  
   
    /*toastr.success('¡Sigue siendo lo más fácil del mundo!', '¡Reiniciado!', {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-center',
      timeOut: 3000
    });*/
  
    
    Swal.fire({
      icon: 'success',
      title: '¡Reiniciado!',
      text: 'Los datos han sido eliminados y puedes ingresar un nuevo presupuesto.',
    });
  }
  

  
  filtrar.addEventListener('change', (event) => {
    const categoriaSeleccionada = event.target.value;
    mostrarGastos(categoriaSeleccionada);
  });
  

  