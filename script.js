// ============================================
// 1. VARIABLE PARA GUARDAR LOS REGISTROS
// ============================================
// Array vacío donde se guardarán todos los registros de trabajo
let registros = [];
let nombreUsuario = '';


// ============================================
// 2. CARGAR DATOS AL INICIAR LA PÁGINA
// ============================================
// Cuando la página termine de cargar, busca si hay registros guardados
window.addEventListener('load', () => {
    // Cargar nombre guardado
    nombreUsuario = localStorage.getItem('nombreUsuario') || '';
    if (nombreUsuario) {
        document.getElementById('nombreMostrar').textContent = nombreUsuario;
        document.getElementById('nombreImpresion').textContent = 'Empleado: ' + nombreUsuario;
        document.getElementById('configNombre').style.display = 'none';
        document.getElementById('formularioRegistro').style.display = 'block';
    }
    
    const guardados = localStorage.getItem('registrosTrabajo');
    if (guardados) {
        // Si hay datos guardados, los convierte de texto a array
        registros = JSON.parse(guardados);
        // Ordena por fecha antes de mostrar
        registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        // Muestra los registros en la página
        mostrarRegistros();
    }
});

// Función para guardar el nombre
function guardarNombre() {
    const nombre = document.getElementById('nombreCompleto').value.trim();
    if (nombre) {
        nombreUsuario = nombre;
        localStorage.setItem('nombreUsuario', nombre);
        document.getElementById('nombreMostrar').textContent = nombre;
        document.getElementById('nombreImpresion').textContent = 'Empleado: ' + nombre;
        document.getElementById('configNombre').style.display = 'none';
        document.getElementById('formularioRegistro').style.display = 'block';
    } else {
        alert('Por favor ingresa tu nombre');
    }
}

// Función para cambiar el nombre
function cambiarNombre() {
    document.getElementById('nombreCompleto').value = nombreUsuario;
    document.getElementById('configNombre').style.display = 'block';
    document.getElementById('formularioRegistro').style.display = 'none';
}


// ============================================
// 3. AGREGAR NUEVO REGISTRO
// ============================================
// Escucha cuando el usuario envía el formulario
document.getElementById('registroForm').addEventListener('submit', function(e) {
    // Evita que la página se recargue
    e.preventDefault();
    
    // Crea un objeto con todos los datos del formulario
    const nuevoRegistro = {
        id: Date.now(),  // ID único basado en la fecha actual
        nombreCompleto: nombreUsuario,  // Usa el nombre guardado
        lugarTrabajo: document.getElementById('lugarTrabajo').value,
        fecha: document.getElementById('fecha').value,
        horaEntrada: document.getElementById('horaEntrada').value,
        horaSalida: document.getElementById('horaSalida').value
    };
    
    // Agrega el registro al array
    registros.push(nuevoRegistro);
    
    // Ordena los registros por fecha (de más antigua a más reciente)
    registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    // Guarda en localStorage (memoria del navegador)
    localStorage.setItem('registrosTrabajo', JSON.stringify(registros));
    
    // Actualiza la visualización de los registros
    mostrarRegistros();
    
    // Limpia el formulario para poder ingresar otro registro
    this.reset();
});


// ============================================
// 4. MOSTRAR REGISTROS EN TABLA
// ============================================
function mostrarRegistros() {
    const contenedor = document.getElementById('contenedorRegistros');
    const mensajeVacio = document.getElementById('mensajeVacio');
    const tabla = document.getElementById('tablaRegistros');
    
    // Si no hay registros, muestra mensaje
    if (registros.length === 0) {
        contenedor.innerHTML = '';
        mensajeVacio.style.display = 'block';
        tabla.style.display = 'none';
        return;
    }
    
    // Oculta el mensaje y muestra la tabla
    mensajeVacio.style.display = 'none';
    tabla.style.display = 'table';
    contenedor.innerHTML = '';
    
    // Recorre cada registro y crea una fila para cada uno
    registros.forEach(registro => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${formatearFecha(registro.fecha)}</td>
            <td>${registro.lugarTrabajo}</td>
            <td>${registro.horaEntrada}</td>
            <td>${registro.horaSalida}</td>
            <td><button onclick="eliminarRegistro(${registro.id})" class="btn-eliminar-tabla">X</button></td>
        `;
        
        contenedor.appendChild(fila);
    });
}


// ============================================
// 5. FORMATEAR FECHA (de 2025-12-23 a 23/12/2025)
// ============================================
function formatearFecha(fecha) {
    // Separa la fecha por guiones
    const [year, month, day] = fecha.split('-');
    // La devuelve en formato DD/MM/YYYY
    return `${day}/${month}/${year}`;
}


// ============================================
// 6. ELIMINAR UN REGISTRO
// ============================================
function eliminarRegistro(id) {
    // Pregunta si está seguro
    if (confirm('¿Estás seguro de eliminar este registro?')) {
        // Filtra el array eliminando el registro con ese ID
        // filter() crea un nuevo array sin el elemento que tenga ese ID
        registros = registros.filter(r => r.id !== id);
        
        // Guarda los cambios en localStorage
        localStorage.setItem('registrosTrabajo', JSON.stringify(registros));
        
        // Actualiza la visualización
        mostrarRegistros();
    }
}


// ============================================
// 7. IMPRIMIR REGISTROS
// ============================================
function imprimirRegistros() {
    // Abre el diálogo de impresión del navegador
    window.print();
}
