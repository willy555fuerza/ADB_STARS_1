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
        const datosUsuario = await respuesta.json();
        console.log(datosUsuario)
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
  



// Función para descargar el PDF Reportes: Usuarios registrados
document.getElementById('reporte_usuarios').addEventListener('submit', async function (event){
  event.preventDefault()

  const fechade = document.getElementById("fechade").value;
  const fechaA = document.getElementById("fechaA").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
  }

  const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

  // Validaciones con SweetAlert2
  if (fechade > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
      });
      return;
  }

  if (fechaA > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha final debe ser mayor o igual a la fecha actual.'
      });
      return;
  }

  try {
      const token = obtenerTokenre(); 

      // Hacer la solicitud POST para descargar el PDF
      const response = await fetch(`${baseURL}/reportes_usuarios/usuarios`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechade, fechaA }),
      });

      // Verificar si la respuesta no es correcta
      if (!response.ok) {
          const errorText = await response.text(); // Captura el texto de error
          //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
          Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: errorText
          });
          
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
      //alert(`Error al generar el PDF: ${error.message}`);
  }
  
})




// Función para descargar el PDF Reportes: Miembros registrados
document.getElementById('reporte_miembros').addEventListener('submit', async function (event){
  event.preventDefault()

  const fechade = document.getElementById("miembro_fechade").value;
  const fechaA = document.getElementById("miembro_fechaA").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
  }

  const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

  // Validaciones con SweetAlert2
  if (fechade > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
      });
      return;
  }

  if (fechaA > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha final debe ser mayor o igual a la fecha actual.'
      });
      return;
  }

  try {
      const token = obtenerTokenre(); 

      // Hacer la solicitud POST para descargar el PDF
      const response = await fetch(`${baseURL}/reportes_miembros/miembros`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechade, fechaA }),
      });

      // Verificar si la respuesta no es correcta
      if (!response.ok) {
          const errorText = await response.text(); // Captura el texto de error
          //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
          Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: errorText
          });
          
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
      //alert(`Error al generar el PDF: ${error.message}`);
  }
  
})




// Función para descargar el PDF Reportes: Ministerios registrados
document.getElementById('reporte_ministerios').addEventListener('submit', async function (event){
  event.preventDefault()

  const fechade = document.getElementById("ministerios_fechade").value;
  const fechaA = document.getElementById("ministerios_fechaA").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
  }

  const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

  // Validaciones con SweetAlert2
  if (fechade > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
      });
      return;
  }

  if (fechaA > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha final debe ser mayor o igual a la fecha actual.'
      });
      return;
  }

  try {
      const token = obtenerTokenre(); 

      // Hacer la solicitud POST para descargar el PDF
      const response = await fetch(`${baseURL}/reportes_ministerios/ministerios`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechade, fechaA }),
      });

      // Verificar si la respuesta no es correcta
      if (!response.ok) {
          const errorText = await response.text(); // Captura el texto de error
          //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
          Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: errorText
          });
          
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
      //alert(`Error al generar el PDF: ${error.message}`);
  }
  
})







// Función para descargar el PDF Reportes: Ingresos registrados por usuarios
document.getElementById('reporte_ingrsoxusuarios').addEventListener('submit', async function (event){
  event.preventDefault()

  const fechade = document.getElementById("ingresoxusuario_fechade").value;
  const fechaA = document.getElementById("ingresoxusuario_fechaA").value;
  const id_usuario = document.getElementById("ingreso_usuario").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
  }

  const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

  // Validaciones con SweetAlert2
  if (fechade > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
      });
      return;
  }

  if (fechaA > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha final debe ser mayor o igual a la fecha actual.'
      });
      return;
  }

  try {
      const token = obtenerTokenre(); 

      // Hacer la solicitud POST para descargar el PDF
      const response = await fetch(`${baseURL}/reportes_ingresos/usuarios`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechade, fechaA, id_usuario }),
      });

      // Verificar si la respuesta no es correcta
      if (!response.ok) {
          const errorText = await response.text(); // Captura el texto de error
          //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
          Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: errorText
          });
          
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
      //alert(`Error al generar el PDF: ${error.message}`);
  }
  
})










// Función para descargar el PDF Reportes: Ingresos por miembro
document.getElementById('reporte_ingrsoxmiembro').addEventListener('submit', async function (event){
  event.preventDefault()

  const fechade = document.getElementById("ingresoxmiembro_fechade").value;
  const fechaA = document.getElementById("ingresoxmiembro_fechaA").value;
  const id_miembro = document.getElementById("ingreso_miembro").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
  }

  const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

  // Validaciones con SweetAlert2
  if (fechade > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
      });
      return;
  }

  if (fechaA > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha final debe ser mayor o igual a la fecha actual.'
      });
      return;
  }

  try {
      const token = obtenerTokenre(); 

      // Hacer la solicitud POST para descargar el PDF
      const response = await fetch(`${baseURL}/reportes_ingresos/miembros`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechade, fechaA, id_miembro }),
      });

      // Verificar si la respuesta no es correcta
      if (!response.ok) {
          const errorText = await response.text(); // Captura el texto de error
          //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
          Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: errorText
          });
          
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
      //alert(`Error al generar el PDF: ${error.message}`);
  }
  
})






// Función para descargar el PDF Reportes: Ingresos por Tipo de ingreso
document.getElementById('reporte_ingrsoxtipoingreso').addEventListener('submit', async function (event){
  event.preventDefault()

  const fechade = document.getElementById("ingresoxtipoingreso_fechade").value;
  const fechaA = document.getElementById("ingresoxtipoingreso_fechaA").value;
  const id_tipo_ingreso = document.getElementById("ingreso_tipo_ingreso").value;
  const currentDate = new Date();
  // Crear una nueva fecha con el valor de startDat
  function formatToTwoDigits(value) {
    return value < 10 ? '0' + value : value;
  }

  const formattedCurrentDate = currentDate.getFullYear() + '-' +
                             formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                             formatToTwoDigits(currentDate.getDate());

  // Validaciones con SweetAlert2
  if (fechade > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
      });
      return;
  }

  if (fechaA > formattedCurrentDate) {
      Swal.fire({
          icon: 'warning',
          title: 'Fecha Inválida',
          text: 'La fecha final debe ser mayor o igual a la fecha actual.'
      });
      return;
  }

  try {
      const token = obtenerTokenre(); 

      // Hacer la solicitud POST para descargar el PDF
      const response = await fetch(`${baseURL}/reportes_ingresos/tipo_ingreso`, {
          method: 'POST',
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ fechade, fechaA, id_tipo_ingreso }),
      });

      // Verificar si la respuesta no es correcta
      if (!response.ok) {
          const errorText = await response.text(); // Captura el texto de error
          //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
          Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: errorText
          });
          
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
      //alert(`Error al generar el PDF: ${error.message}`);
  }
  
})



// Función para descargar el PDF Reportes: Egresos por Tipo de egreso
document.getElementById('reporte_egrsoxtipoegreso').addEventListener('submit', async function (event){
    event.preventDefault()
  
    const fechade = document.getElementById("egresoxtipoegreso_fechade").value;
    const fechaA = document.getElementById("egresoxtipoegreso_fechaA").value;
    const id_tipo_egreso = document.getElementById("egreso_tipo_egreso").value;
    const currentDate = new Date();
    // Crear una nueva fecha con el valor de startDat
    function formatToTwoDigits(value) {
      return value < 10 ? '0' + value : value;
    }
  
    const formattedCurrentDate = currentDate.getFullYear() + '-' +
                               formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                               formatToTwoDigits(currentDate.getDate());
  
    // Validaciones con SweetAlert2
    if (fechade > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
        });
        return;
    }
  
    if (fechaA > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha final debe ser mayor o igual a la fecha actual.'
        });
        return;
    }
  
    try {
        const token = obtenerTokenre(); 
  
        // Hacer la solicitud POST para descargar el PDF
        const response = await fetch(`${baseURL}/reportes_egresos/tipo_egreso`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fechade, fechaA, id_tipo_egreso }),
        });
  
        // Verificar si la respuesta no es correcta
        if (!response.ok) {
            const errorText = await response.text(); // Captura el texto de error
            //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
            Swal.fire({
              icon: 'warning',
              title: 'Fecha Inválida',
              text: errorText
            });
            
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
        //alert(`Error al generar el PDF: ${error.message}`);
    }
    
  })







  // Función para descargar el PDF Reportes: Egresos por Tipo de egreso
document.getElementById('reporte_miembrosxministerio').addEventListener('submit', async function (event){
    event.preventDefault()
  
    const fechade = document.getElementById("miembrosxministerio_fechade").value;
    const hasta = document.getElementById("miembrosxministerio_fechaA").value;
    let fechaobj = new Date(hasta)
    fechaobj.setDate(fechaobj.getDate() + 1)
    let nuevafecha = fechaobj.toISOString().split('T')[0]
    let fechaA = nuevafecha
    const id_ministerio = document.getElementById("miembrosxministerio").value;
    const currentDate = new Date();
    // Crear una nueva fecha con el valor de startDat
    function formatToTwoDigits(value) {
      return value < 10 ? '0' + value : value;
    }
  
    const formattedCurrentDate = currentDate.getFullYear() + '-' +
                               formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                               formatToTwoDigits(currentDate.getDate());
  
    // Validaciones con SweetAlert2
    if (fechade > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
        });
        return;
    }
  
    if (fechaA > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha final debe ser mayor o igual a la fecha actual.'
        });
        return;
    }
  
    try {
        const token = obtenerTokenre(); 
  
        // Hacer la solicitud POST para descargar el PDF
        const response = await fetch(`${baseURL}/reportes_miembros/ministerios`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fechade, fechaA, id_ministerio }),
        });
  
        // Verificar si la respuesta no es correcta
        if (!response.ok) {
            const errorText = await response.text(); // Captura el texto de error
            //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
            Swal.fire({
              icon: 'warning',
              title: 'Fecha Inválida',
              text: errorText
            });
            
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
        //alert(`Error al generar el PDF: ${error.message}`);
    }
    
  })






// Función para descargar el PDF Reportes: Egresos por Tipo de egreso
document.getElementById('reporte_egreso').addEventListener('submit', async function (event){
    event.preventDefault()
  
    const fechade = document.getElementById("egreso_fechade").value;
    const hasta = document.getElementById("egreso_fechaA").value;
    let fechaobj = new Date(hasta)
    fechaobj.setDate(fechaobj.getDate() + 1)
    let nuevafecha = fechaobj.toISOString().split('T')[0]
    let fechaA = nuevafecha

    const currentDate = new Date();
    // Crear una nueva fecha con el valor de startDat
    function formatToTwoDigits(value) {
      return value < 10 ? '0' + value : value;
    }
  
    const formattedCurrentDate = currentDate.getFullYear() + '-' +
                               formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                               formatToTwoDigits(currentDate.getDate());
  
    // Validaciones con SweetAlert2
    if (fechade > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
        });
        return;
    }
  
    if (fechaA > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha final debe ser mayor o igual a la fecha actual.'
        });
        return;
    }
  
    try {
        const token = obtenerTokenre(); 
  
        // Hacer la solicitud POST para descargar el PDF
        const response = await fetch(`${baseURL}/reportes_egreso`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fechade, fechaA}),
        });
  
        // Verificar si la respuesta no es correcta
        if (!response.ok) {
            const errorText = await response.text(); // Captura el texto de error
            //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
            Swal.fire({
              icon: 'warning',
              title: 'Fecha Inválida',
              text: errorText
            });
            
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
        //alert(`Error al generar el PDF: ${error.message}`);
    }
    
  })










  // Función para descargar el PDF Reportes: Egresos por Tipo de egreso
document.getElementById('reporte_ingreso').addEventListener('submit', async function (event){
    event.preventDefault()
  
    const fechade = document.getElementById("ingreso_fechade").value;
    const hasta = document.getElementById("ingreso_fechaA").value;
    let fechaobj = new Date(hasta)
    fechaobj.setDate(fechaobj.getDate() + 1)
    let nuevafecha = fechaobj.toISOString().split('T')[0]
    let fechaA = nuevafecha

    const currentDate = new Date();
    // Crear una nueva fecha con el valor de startDat
    function formatToTwoDigits(value) {
      return value < 10 ? '0' + value : value;
    }
  
    const formattedCurrentDate = currentDate.getFullYear() + '-' +
                               formatToTwoDigits(currentDate.getMonth() + 1) + '-' +
                               formatToTwoDigits(currentDate.getDate());
  
    // Validaciones con SweetAlert2
    if (fechade > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha de inicio debe ser menor o igual a la fecha actual.'
        });
        return;
    }
  
    if (fechaA > formattedCurrentDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha Inválida',
            text: 'La fecha final debe ser mayor o igual a la fecha actual.'
        });
        return;
    }
  
    try {
        const token = obtenerTokenre(); 
  
        // Hacer la solicitud POST para descargar el PDF
        const response = await fetch(`${baseURL}/reportes_ingreso`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fechade, fechaA}),
        });
  
        // Verificar si la respuesta no es correcta
        if (!response.ok) {
            const errorText = await response.text(); // Captura el texto de error
            //throw new Error(`Error en la solicitud: ${response.status} - ${errorText}`);
            Swal.fire({
              icon: 'warning',
              title: 'Fecha Inválida',
              text: errorText
            });
            
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
        //alert(`Error al generar el PDF: ${error.message}`);
    }
    
  })