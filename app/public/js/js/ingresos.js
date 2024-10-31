globalThis.datosUsuario = datosUsuario = null;

const baseURL = 'http://localhost:3009';


const obtenerTokenre = () => {
    // Hacer una solicitud HTTP al servidor para obtener el token
    const token = localStorage.getItem("token");
    if (!token) {
      // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
      window.location.href = `${baseURL}/login`;
      return; // Detener la ejecución del código
    }
    return token;
  };

// Función para obtener el token del servidor
const obtenerToken = async () => {
    try {
      // Hacer una solicitud HTTP al servidor para obtener el token
      const token = obtenerTokenre();
      const respuesta = await fetch(`${baseURL}/usuario_aut`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include' // Incluir cookies en la solicitud
      });
  
      // Verificar si la respuesta fue exitosa (código de estado 200)
      if (respuesta.ok) {
        globalThis.datosUsuario = await respuesta.json();
        // Mostrar los datos en un formulario
        mostrarDatosEnFormulario(datosUsuario);
      } else {
        console.error('Error al obtener el token:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error al obtener el token:', error.message);
    }
  };
  
  // Función para mostrar los datos en un formulario HTML
  const mostrarDatosEnFormulario = (datosUsuario) => {
  
      const userNavTop = document.getElementById('usernavtop');
      const userNav = document.getElementById('usernav');
      const perfi = document.getElementById('perfi');
  
      // Obtener los datos del usuario
      let { nombres, apellidos, perfil } = datosUsuario;
  
      // Convertir la primera letra de cada palabra a mayúscula y el resto a minúscula
      nombres = nombres.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      apellidos = apellidos.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      perfill = perfil.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  
  
      // Obtener el primer nombre y el primer apellido
      const primerNombre = nombres.split(' ')[0];
      const primerApellido = apellidos.split(' ')[0];
  
  
      // Establecer el valor del span con el nombre del usuario
      userNavTop.textContent = `${primerNombre} ${primerApellido}`;
  
      // Establecer el valor del h6 con el nombre del usuario
      userNav.textContent = `${primerNombre} ${primerApellido}`;
  
      perfi.textContent = `${perfill}`;
  };
  // Llamar a la función para obtener el token
  obtenerToken();
  
  
  
  //*********************************poner en mayuscula**********************************/
  function mayus(e) {
    e.value = e.value.toUpperCase();
  }
  //*********************************poner en mayuscula**********************************/

  // Funciones para obtener datos
const getAllUsuario = async () => {
  try {
      const token = obtenerTokenre();
      const response = await fetch(`${baseURL}/Users`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
      if (!response.ok) {
          throw new Error("Error en la solicitud");
      }
      const result = await response.json();

      if (result.error) {
          console.error("Error:", result.message);
          return [];
      } else {
          return result.data;
      }
  } catch (error) {
      console.error("Error:", error.message);
      return [];
  }
};

const getAllTipoingresos = async () => {
  try {
    const token = obtenerTokenre();
    const response = await fetch(`${baseURL}/tipo_ingreso`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }

    const result = await response.json();

    if (result.error) {
      console.error("Error:", result.message);
      return [];
    } else {
      return result.data;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return [];
  }
};

const getAllmiembro = async () => {
  try {
      const token = obtenerTokenre();
      const response = await fetch(`${baseURL}/miembro`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
      if (!response.ok) {
          throw new Error("Error en la solicitud");
      }
      const result = await response.json();
      //console.log(result);

      if (result.error) {
          console.error("Error:", result.message);
          return [];
      } else {
          return result.data;
      }
  } catch (error) {
      console.error("Error:", error.message);
      return [];
  }
};

// Función para poblar selectores
const populateSelect = (selectElement, options, valueFieldName, textFieldName) => {
  selectElement.innerHTML = '<option value="" >Seleccione una opción</option>';
  options.forEach(option => {
      const optionElement = document.createElement("option");
      optionElement.value = option[valueFieldName];
      optionElement.textContent = option[textFieldName];
      selectElement.appendChild(optionElement);
  });
};


// Función para poblar los selectores del formulario
const populateFormSelects = async () => {
  /* const usuarioSelect = document.getElementById("usuario"); */
  const tipo_ingresoSelect = document.getElementById("tipo_ingreso");
  const miembroSelect = document.getElementById("miembro");
 
  /* const usuario = await getAllUsuario(); */
  const tipo_ingreso = await getAllTipoingresos();
  const miembro = await getAllmiembro();

  /* populateSelect(usuarioSelect, usuario, "id_usuario", "nombres"); */
  populateSelect(tipo_ingresoSelect, tipo_ingreso, "id_tipo_ingresos", "nombre");
  populateSelect(miembroSelect, miembro, "id_miembro", "nombres");

  // Inicializa Select2 en los selectores después de haber poblado las opciones
  $(document).ready(function() {
      /* $('#usuario').select2(); */
      $('#tipo_ingreso').select2();
      $('#miembro').select2();
  });
};

// Llama a la función para poblar los selectores del formulario
populateFormSelects();


 //***********************************crear usuario*************************************/
 const formAgregarUsuario = document.getElementById("form");

 formAgregarUsuario.addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

  // Obtener los valores del formulario
  const fecha_ingreso = document.getElementById("fecha_ingreso").value;
  const { id } = await datosUsuario; // Asegúrate de que globalThis.datosUsuario esté definido
  const id_usuario = id;
  const tipo_ingreso = document.getElementById("tipo_ingreso").value;
  const miembro = document.getElementById("miembro").value;
  const monto = document.getElementById("monto").value;

  // Si id_ingreso es necesario, asegúrate de obtenerlo
  // const id_ingreso = ...;

  try {
    // Verificar si el token está presente en el localStorage
    const token = obtenerTokenre();

    // Enviar los datos al servidor para crear el nuevo ingreso
    const response = await fetch(`${baseURL}/create_ingreso`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
      /*   id_ingreso, */ // Asegúrate de que id_ingreso esté definido
        fecha_ingreso,
        id_usuario,
        tipo_ingreso,
        miembro,
        monto
      }),
    });

    if (response.ok) {
      const create = await response.json();

      // Destruir DataTable antes de eliminar la fila
      if ($.fn.DataTable.isDataTable("#myTable")) {
        $('#myTable').DataTable().destroy();
      }

      // Mostrar notificación de éxito
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: create.message,
      });

      // Actualizar la tabla
      getAll();
    } else {
      const errorData = await response.json();
      // Mostrar notificación de error
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: errorData.error,
      });

      getAll();
    }
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    alert("Error al enviar la solicitud");
  }
});
 
 //***********************************crear usuario*************************************/

 const getAllUsuarios = async () => {
  try {
      const token = obtenerTokenre();
      const response = await fetch(`${baseURL}/Users`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
      if (!response.ok) {
          throw new Error("Error en la solicitud");
      }
      const result = await response.json();

      if (result.error) {
          console.error("Error:", result.message);
          return {};
      }else {
        return result.data.reduce((acc, category) => {
            acc[category.id_usuario] = category.nombres;
            return acc;
        }, {});
      }
  } catch (error) {
      console.error("Error:", error.message);
      return {};
  }
};

const getAllTipoingreso = async () => {
  try {
      const token = obtenerTokenre();
      const response = await fetch(`${baseURL}/tipo_ingreso`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
      if (!response.ok) {
          throw new Error("Error en la solicitud");
      }
      const result = await response.json();
      //console.log(result);

      if (result.error) {
          console.error("Error:", result.message);
          return {};
      } else {
        return result.data.reduce((acc, measure) => {
            acc[measure.id_tipo_ingresos] = measure.nombre;
            return acc;
        }, {});
      }
  } catch (error) {
      console.error("Error:", error.message);
      return {};
  }
};

const getAllmiembros = async () => {
  try {
      const token = obtenerTokenre();
      const response = await fetch(`${baseURL}/miembro`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
      if (!response.ok) {
          throw new Error("Error en la solicitud");
      }
      const result = await response.json();
      //console.log(result);

      if (result.error) {
          console.error("Error:", result.message);
          return {};
      }else {
        return result.data.reduce((acc, miasure) => {
            acc[miasure.id_miembro] = miasure.nombres;
            return acc;
        }, {});
      }
  } catch (error) {
      console.error("Error:", error.message);
      return {};
  }
};

const getAllUsuarioPromise = getAllUsuarios();
const getAllTipoingresosPromise = getAllTipoingreso();
const getAllmiembroPromise = getAllmiembros();

  //*************renderizado de tabla usuarios y mostrar tabla usuario*******************/
  const venta = document;
  
  const paginaVentas = venta.querySelector("#ingreso");
  
  const Ventas = async (ingres) => {
    const {
        id_ingreso,
        fecha_ingreso,
        id_usuario,
        id_tipo_ingresos,
        id_miembro,
        monto, 
        fecha_registro,
        estado
    } = ingres;

    
    const formattedDatee = new Date(fecha_registro).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Usa el formato de 24 horas
   
  });

    const formattedDate = new Date(fecha_ingreso).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
       /*  hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", */
    });

    const buttonColor = estado === true ? "btn btn-outline-success" : "btn btn-outline-danger";
    const buttontxt = estado === true ? "SI" : "NO";
  
    // Esperar a que se resuelvan las promesas de getAllCategories y getAllMeasures
   
    const usuario = await getAllUsuarioPromise;
    const tipo_ingreso = await getAllTipoingresosPromise;
    const miembro  = await getAllmiembroPromise;

    console.log(id_ingreso,id_tipo_ingresos,id_miembro)
 /*    console.log(id_ingreso,id_tipo_ingresos,id_miembro) */
    const usuarioNombre = usuario[id_usuario] || "Desconocida";
    const tipo_ingresoNombre = tipo_ingreso[id_tipo_ingresos] || "Desconocida";
    const miembroNombre = miembro[id_miembro] || "Desconocida";


    return `
        <tr id="lista-row-${id_ingreso}">
            <td>${id_ingreso}</td>
            <td>${formattedDate}</td>
            <td>${usuarioNombre}</td>
            <td>${tipo_ingresoNombre}</td>
            <td>${miembroNombre}</td>
            <td>${monto}</td>
            <td>${formattedDatee}</td>
             <td>
                  <div class="container-btn-state">
                      <button style="cursor: inherit;" class="${buttonColor}">${buttontxt}</button>
                  </div>
              </td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn btn-outline-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Acciones
                    </button>
                    <ul class="dropdown-menu ">
                        <li><a id="actualizar" class="dropdown-item" onclick="toggleEditMode(${id_ingreso})" class="dropdown-item" href="#">Actualizar</a></li>
                        <li class="elim"><a onclick="deleteUser(${id_ingreso})" class="dropdown-item " href="#">Eliminar</a></li>
                        <li><a onclick="changeState(${id_ingreso}, ${estado})" class="dropdown-item" href="#" id="change-state-${id_ingreso}">${estado ? "Inhabilitar" : "Habilitar"}</a></li>
                    </ul>
                  
                </div>
            </td>
        </tr>
    `;
};

const render = async (data) => {
  try {
      const usuario = await getAllUsuario();
      const tipo_ingreso = await getAllTipoingresos();
      const miembro = await getAllmiembro();

      if (usuario && tipo_ingreso && miembro) {
          const sortedVentas = data.sort((a, b) => {
              if (a.estado && !b.estado) {
                  return -1;
              }
              if (!a.estado && b.estado) {
                  return 1;
              }
              return a.id_ingreso - b.id_ingreso;
          });

          if (Array.isArray(sortedVentas) && sortedVentas.length > 0) {
              const cardsHTML = await Promise.all(
                  sortedVentas.map((item) => Ventas({ ...item, usuario, tipo_ingreso, miembro }))
              );
              paginaVentas.innerHTML = cardsHTML.join("");

              if (!$.fn.DataTable.isDataTable("#myTable")) {
                  $("#myTable").DataTable({
                      language: {
                          decimal: "",
                          emptyTable: "No hay información",
                          info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                          infoEmpty: "Mostrando 0 a 0 de 0 Entradas",
                          infoFiltered: "(Filtrado de _MAX_ total entradas)",
                          infoPostFix: "",
                          thousands: ",",
                          lengthMenu: "Mostrar _MENU_ Entradas",
                          loadingRecords: "Cargando...",
                          processing: "Procesando...",
                          search: "Buscar:",
                          zeroRecords: "Sin resultados encontrados",
                          paginate: {
                              first: "Primero",
                              last: "Último",
                              next: ">",
                              previous: "<",
                          },
                      },
                      lengthMenu: [
                          [5, 10, 25, 50, -1],
                          [5, 10, 25, 50, "Todos"],
                      ],
                      pageLength: 5,
                      autoWidth: true,
                      // order: [], // No ordenar ninguna columna al inicio
                      order: [[6, 'desc']], // Ordenar la primera columna (columna del ID) de forma descendente al inicio
                      columnDefs: [
                        {
                            targets: '_all',
                            className: 'dt-head-center' // Centra los títulos de todas las columnas
                        }
                    ],
                    headerCallback: function(thead, data, start, end, display) {
                        $(thead).find('th').css('background-color', '#031d35'); // Color gris
                        $(thead).find('th').css('color', '#FFFFFF'); // Color del texto (opcional)
                    }
                  });
                  await obtenerToken()
                  if (datosUsuario) {
                    if (datosUsuario.perfil !== 'ADMINISTRADOR') {
                      const elii = document.querySelectorAll('.elim')
                      elii.forEach((li) =>{
                        li.classList.add('d-none')
                      })
                      //elii.classList.add('d-none')
                    }
                  }
                  // if (datosUsuario) {
                  //   if (datosUsuario.perfil !== 'ADMINISTRADOR') {
                  //     const elii = document.querySelectorAll('.elim'); // Cambia querySelector a querySelectorAll para seleccionar todos los elementos
                  //     elii.forEach((li) => {
                  //       li.classList.add('d-none'); // Agrega la clase 'd-none' a cada elemento
                  //     });
                  //   }
                  // }
              } else {
                  // Destruir y volver a inicializar DataTable si ya existe
                  const table = $("#myTable").DataTable();
                  table.clear();
                  table.rows.add($(cardsHTML.join("")));
                  table.draw();
              }
          } else {
              paginaVentas.innerHTML = '<tr><td colspan="8">NO SE ENCONTRARON INGRESOS.</td></tr>';
          }
      } else {
          console.error("Error: No se resolvieron correctamente las promesas de usuario, tipo de ingresos y miembro.");
      }
  } catch (error) {
      console.error("Error:", error.message);
  }
};

  
  const getAll = async () => {
      try {
        const token = obtenerTokenre();
          const response = await fetch(`${baseURL}/ingreso`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          if (!response.ok) {
              throw new Error("Error en la solicitud");
          }
          const result = await response.json();
          if (result.error) {
              console.error("Error:", result.message);
              alert(result.message);
          } else {
              render(result.data);
          }
      } catch (error) {
          console.error("Error:", error.message);
          const errorMessage = document.createElement("div");
          errorMessage.innerHTML = `
              <div class="row vh-100 bg-secondary rounded align-items-center justify-content-center mx-0">
                  <div class="col-md-6 text-center p-4">
                      <i class="bi bi-exclamation-triangle display-1 text-primary"></i>
                      <h1 class="display-1 fw-bold">Error 403</h1>
                      <h1 class="mb-4">Page Not Found</h1>
                      <p class="mb-4">${error.message}</p>
                      <a class="btn btn-primary rounded-pill py-3 px-5" href="">Go Back To Home</a>
                  </div>
              </div>
          `;
          document.getElementById("chart").innerHTML = errorMessage.innerHTML;
      }
  };
 
  //*************renderizado de tabla usuarios y mostrar tabla usuario*******************/

   let isEditMode = false;
  
   const toggleEditMode = (id_ingreso) => {
     const row = document.getElementById(`lista-row-${id_ingreso}`);
     const editButton = row.querySelector("#actualizar");
     const cells = row.getElementsByTagName("td");
   
     // Guardar los valores originales de todas las celdas
     const valoresOriginales = [];
     for (let i = 0; i < cells.length; i++) {
       const cell = cells[i];
       valoresOriginales.push(cell.innerHTML);
     }
   
     if (!isEditMode) {
       // Modo de edición
       editlista(id_ingreso);
       editButton.innerHTML = "Guardar";
       editButton.setAttribute(
         "onclick",
         `toggleEditMode(${id_ingreso}, ${JSON.stringify(valoresOriginales)})`
       );
       isEditMode = true;
     } else {
       // Modo de guardar cambios
       saveChanges(id_ingreso, valoresOriginales);
       editButton.innerHTML = "Actualizar";
       editButton.setAttribute("onclick", `toggleEditMode(${id_ingreso})`);
       isEditMode = false;
     }
   };
   
   //*****************************editar usuario y guardar********************************/
   const editlista = (id_ingreso) => {
     const row = document.getElementById(`lista-row-${id_ingreso}`);
     const cells = row.getElementsByTagName("td");
   
     // Guardar los valores originales de todas las celdas
     const valoresOriginales = [];
     for (let i = 0; i < cells.length; i++) {
       const cell = cells[i];
       valoresOriginales.push(cell.innerHTML);
     }
     
       // Hacer editable solo la quinta celda (índice 4)
    const editableIndex = 5;
    if (cells.length > editableIndex) {
      const cell = cells[editableIndex];
      const oldValue = cell.innerText.trim();
      cell.innerHTML = `<input class="tab" type="text" value="${oldValue}" style="width: 100%;">`;
    }
  
    const editButton = cells[cells.length - 1].querySelector("#actualizar");
    editButton.setAttribute(
      "onclick",
      `saveChanges(${id_ingreso}, ${JSON.stringify(valoresOriginales)}, this)`
    );
  };
   
   // Función para guardar los cambios realizados en la fila
   const saveChanges = async (id_ingreso, valoresOriginales) => {
     const row = document.getElementById(`lista-row-${id_ingreso}`);
     const cells = row.getElementsByTagName("td");
     const newValues = [];
   
     const editableIndex = 5;
     if (cells.length > editableIndex) {
       const cell = cells[editableIndex];
       const newValue = cell.getElementsByTagName("input")[0].value;
       newValues.push(newValue);
     }
     // Restaurar los valores de la primera celda (id_lista) y las últimas tres celdas
     for (let i = 0; i < 1; i++) {
       const cell = cells[i];
       cell.innerHTML = valoresOriginales[i];
     }
     for (let i = cells.length - 6; i < cells.length; i++) {
       const cell = cells[i];
       cell.innerHTML = valoresOriginales[i];
     }
   
     try {
       // Mostrar el SweetAlert2 antes de guardar los cambios
       const { isConfirmed } = await Swal.fire({
         title: "¿Estás seguro?",
         text: "¿Quieres guardar los cambios realizados?",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Sí, guardar",
       });
       if (isConfirmed) {
         // Verificar si el token está presente en el localStorage
         const token = obtenerTokenre();
         const response = await fetch(
           `${baseURL}/ingreso/${id_ingreso}`,
           {
             method: "PUT",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
             body: JSON.stringify({
               monto: newValues[0],
             }),
           }
         );
   
         if (response.ok) {
           const update = await response.json();
           // Destruir DataTable antes de eliminar la fila
           if ($.fn.DataTable.isDataTable("#myTable")) {
             $('#myTable').DataTable().destroy();
           }
           // Actualizar la tabla después de cambiar el estado
           const Toast = Swal.mixin({
             toast: true,
             position: "bottom-end",
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
           });
           Toast.fire({
             icon: "success",
             title: update.message,
           });
           getAll();
         } else {
           const updat = await response.json();
           // Actualizar la tabla después de cambiar el estado
           const Toast = Swal.mixin({
             toast: true,
             position: "bottom-end",
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
           });
           Toast.fire({
             icon: "error",
             title: "Error al actualizar el usuario",
           });
           getAll();
         }
       } else {
         // Si el usuario cancela, ejecutar la función getAll()
         getAll();
       }
     } catch (error) {
       console.error("Error al enviar la solicitud:", error);
       // Eliminar la clase 'active' del botón
       getAll();
     }
   };
   //*****************************editar usuario y guardar********************************/
   
   //*******************************inavilitar, habilitar*********************************/
   const changeState = async (userId, currentState) => {
     try {
       let newState = true;
       let buttonText = "Habilitar";
       if (currentState == true) {
         newState = false;
         buttonText = "Inhabilitar";
       }
       // Mostrar el SweetAlert2 antes de cambiar el estado
       const { isConfirmed } = await Swal.fire({
         title: "¿Estás seguro?",
         text: `¿Deseas ${buttonText.toLowerCase()} la lista ${userId}?`,
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: `Sí, ${buttonText.toLowerCase()}`,
         background: "rgba(255, 255, 255,)",
       });
   
       if (isConfirmed) {
         // Verificar si el token está presente en el localStorage
         const token = obtenerTokenre();
         const response = await fetch(
           `${baseURL}/ingreso/${userId}/state`,
           {
             method: "PUT",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
             body: JSON.stringify({ state: newState }), // Cambiar el estado a 0
           }
         );
   
         if (response.ok) {
           const messageData = await response.json();
           // Destruir DataTable antes de eliminar la fila
           if ($.fn.DataTable.isDataTable("#myTable")) {
             $('#myTable').DataTable().destroy();
           }
           // Actualizar la tabla después de cambiar el estado
           const Toast = Swal.mixin({
             toast: true,
             position: "bottom-end",
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
           });
           Toast.fire({
             icon: "success",
             title: messageData.message,
           });
           getAll();
         } else {
           // Actualizar la tabla después de cambiar el estado
           const Toast = Swal.mixin({
             toast: true,
             position: "bottom-end",
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
           });
           Toast.fire({
             icon: "error",
             title: "Error al cambiar el estado de la lista",
           });
           getAll();
         }
       }
     } catch (error) {
       alert("Error " + error);
       getAll();
     }
   };
   
   //*******************************inavilitar, habilitar*********************************/
   
   //*************************************eliminar**************************************/
   const deleteUser = async (userId) => {
     try {
       // Mostrar el SweetAlert2 antes de eliminar el usuario
       const { isConfirmed } = await Swal.fire({
         title: "¿Estás seguro?",
         text: `¿Deseas eliminar la lista ${userId}?`,
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: "Sí, eliminar",
         background: "rgba(255, 255, 255,)",
       });
   
       if (isConfirmed) {
         // Verificar si el token está presente en el localStorage
         const token = obtenerTokenre();
         const response = await fetch(
           `${baseURL}/ingreso_delete/${userId}`,
           {
             method: "DELETE",
             headers:{
               Authorization: `Bearer ${token}`,
             }
           }
         );
   
         if (response.ok) {
           const eliminado = await response.json();
           // Destruir DataTable antes de eliminar la fila
           if ($.fn.DataTable.isDataTable("#myTable")) {
             $('#myTable').DataTable().destroy();
           }
           // Actualizar la tabla después de eliminar el usuario
           const Toast = Swal.mixin({
             toast: true,
             position: "bottom-end",
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
           });
   
           Toast.fire({
             icon: "success",
             title: eliminado.message,
           });
   
           getAll(); // Función para actualizar la tabla
         } else {
           // Actualizar la tabla después de un error
           const Toast = Swal.mixin({
             toast: true,
             position: "bottom-end",
             showConfirmButton: false,
             timer: 3000,
             timerProgressBar: true,
           });
   
           Toast.fire({
             icon: "error",
             title: "Error al eliminar la lista",
           });
   
           getAll(); // Función para actualizar la tabla
         }
       }
     } catch (error) {
       alert("Error " + error);
       getAll(); // Función para actualizar la tabla
     }
   };
   //*************************************eliminar**************************************/
   
   getAll();

  
/*   getAll(); */
  

  









  //*************************************notificaciones**************************************/
  
/*   const getAllProducto = async () => {
    try {
        // Verificar si el token está presente en el localStorage
        const token = obtenerTokenre();
        const response = await fetch(`${baseURL}/productos_stock`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const result = await response.json();
        //console.log(result.data)
        if (result.error) {
            console.error("Error:", result.message);
            return [];
        } else {
            return result.data;
        }
    } catch (error) {
        console.error("Error:", error.message);
        return [];
    }
}; */
  
/* document.addEventListener('DOMContentLoaded', async (event) => {
    const notificationBadge = document.getElementById('notification-badge');
    const notificationLink = document.getElementById('notification-link');
    const notificationBell = document.getElementById('notification-bell');
    const notificationContent = document.getElementById('notification-content');
  
    function showNotificationBadge() {
      notificationBadge.style.display = 'block';
    }
  
    function hideNotificationBadge() {
      notificationBadge.style.display = 'none';
    }
  
    const productos = await getAllProducto();
    const productosBajoStock = productos.filter(producto => producto.stock < 5);
  
    if (productosBajoStock.length > 0) {
      showNotificationBadge();
      notificationBell.classList.add('shake');
      notificationContent.innerHTML = ''; // Limpiar el contenido de notificaciones
  
      const notificationTimes = JSON.parse(localStorage.getItem('notificationTimes')) || {};
  
      productosBajoStock.forEach(producto => {
        if (!notificationTimes[producto.id_producto]) {
          notificationTimes[producto.id_producto] = new Date().toISOString();
        }
      });
  
      localStorage.setItem('notificationTimes', JSON.stringify(notificationTimes));
  
      const calculateTimeElapsed = (startTime) => {
        const currentTime = new Date();
        const startTimeDate = new Date(startTime);
        const diffTime = Math.abs(currentTime - startTimeDate);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
        if (diffDays > 0) {
          return `Hace ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
          return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        } else {
          return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
        }
      };
  
      productosBajoStock.forEach(producto => {
        const notificationItem = document.createElement('a');
        notificationItem.href = "/productos";
        notificationItem.className = "dropdown-item";
        const timeElapsed = document.createElement('small');
  
        timeElapsed.textContent = calculateTimeElapsed(notificationTimes[producto.id_producto]);
        setInterval(() => {
          timeElapsed.textContent = calculateTimeElapsed(notificationTimes[producto.id_producto]);
        }, 60000); // Actualizar cada minuto
  
        notificationItem.innerHTML = `
          <h6 class="fw-normal mb-0">${producto.nombre_producto}: <br> ${producto.stock} en stock</h6>
        `;
        notificationItem.appendChild(timeElapsed);
        notificationContent.appendChild(notificationItem);
  
        const divider = document.createElement('hr');
        divider.className = "dropdown-divider";
        notificationContent.appendChild(divider);
      });
  
      /* const seeAllItem = document.createElement('a');
      seeAllItem.href = "#";
      seeAllItem.className = "dropdown-item text-center";
      seeAllItem.textContent = "See all notifications";
      notificationContent.appendChild(seeAllItem); */
  /*   } else {
      localStorage.removeItem('notificationTime');
      hideNotificationBadge();
      notificationBell.classList.remove('shake');
    }
  
    notificationLink.addEventListener('click', () => {
      notificationBell.classList.remove('shake');
      hideNotificationBadge();
    }); */
/*   }); */ 

  //*************************************notificaciones**************************************/





  // Función para descargar el PDF
  async function descargarPDF(id_ingreso) {
    console.log(id_ingreso)
    // Obtener el token de forma correcta
    const token = obtenerTokenre(); 

    try {
        // Hacer la solicitud POST para descargar el PDF
        const response = await fetch(`${baseURL}/downloadpdf`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_ingreso }),
        });

        // Verificar si la respuesta no es correcta
        if (!response.ok) {
            const errorText = await response.text(); // Captura el texto de error
            throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
        }

        // Convertir la respuesta en un Blob
        const blob = await response.blob();

        // Crear un enlace temporal y disparar la descarga
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = 'Recibo.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error:', error.message);
        alert(`Error al generar el PDF: ${error.message}`);
    }
    
}


document.getElementById('imprimirtabla').addEventListener('click', async function (event){
  event.preventDefault()

  const startdate = document.getElementById("startdate").value;
  const enddate = document.getElementById("enddate").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
}

// Crear la fecha actual formateada (YYYY-MM-DD)

const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

// Validaciones con SweetAlert2
if (startdate > formattedCurrentDate) {
    Swal.fire({
        icon: 'warning',
        title: 'Fecha Inválida',
        text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
    });
    return;
}

if (enddate > formattedCurrentDate) {
    Swal.fire({
        icon: 'warning',
        title: 'Fecha Inválida',
        text: 'La fecha final debe ser mayor o igual a la fecha actual.'
    });
    return;
}

if (startdate > enddate) {
    Swal.fire({
        icon: 'warning',
        title: 'Fecha Inválida',
        text: 'La fecha de inicio no debe ser mayor que la fecha final.'
    });
    return;
}

// Si pasa todas las validaciones
Swal.fire({
    icon: 'success',
    title: 'Fechas Válidas',
    text: 'Las fechas son válidas.'
});

  
  const token = obtenerTokenre(); 

  if (startdate && enddate) {
      try {
        // Hacer la solicitud POST para descargar el PDF
        const response = await fetch(`${baseURL}/download/fecha`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ enddate, startdate }),
        });

        // Verificar si la respuesta no es correcta
        if (!response.ok) {
            const errorText = await response.text(); // Captura el texto de error
            throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
        }

        // Convertir la respuesta en un Blob
        const blob = await response.blob();

        // Crear un enlace temporal y disparar la descarga
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = 'Recibo.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
       
    } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error:', error.message);
        alert(`Error al generar el PDF: ${error.message}`);
    }
    return;
  }

  const table = $('#myTable').DataTable();
  const datosTabla = table.data().toArray();
  console.log(datosTabla)

  try {
    const response = await fetch(`${baseURL}/imprimirtablas`,{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({datosTabla})
    })

    if (!response.ok) {
      throw new Error('error en la solicitud')
    }

    // Convertir la respuesta en un Blob
    const blob = await response.blob();

    // Crear un enlace temporal y disparar la descarga
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'Recibo.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error', error.message)
    alert('eror al generar pdf')
  }
})



