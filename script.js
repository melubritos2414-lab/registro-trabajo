// ============================================
// 1. VARIABLE PARA GUARDAR LOS REGISTROS
// ============================================
// Array vacío donde se guardarán todos los registros de trabajo
let registros = [];


// ============================================
// 2. CARGAR DATOS AL INICIAR LA PÁGINA
// ============================================
// Cuando la página termine de cargar, busca si hay registros guardados
window.addEventListener('load', () => {
    const guardados = localStorage.getItem('registrosTrabajo');
    if (guardados) {
        // Si hay datos guardados, los convierte de texto a array
        registros = JSON.parse(guardados);
        // Muestra los registros en la página
        mostrarRegistros();
    }
});


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
        nombreCompleto: document.getElementById('nombreCompleto').value,
        lugarTrabajo: document.getElementById('lugarTrabajo').value,
        fecha: document.getElementById('fecha').value,
        horaEntrada: document.getElementById('horaEntrada').value,
        horaSalida: document.getElementById('horaSalida').value
    };
    
    // Agrega el registro al PRINCIPIO del array (más recientes primero)
    registros.unshift(nuevoRegistro);
    
    // Guarda en localStorage (memoria del navegador)
    localStorage.setItem('registrosTrabajo', JSON.stringify(registros));
    
    // Actualiza la visualización de los registros
    mostrarRegistros();
    
    // Limpia el formulario para poder ingresar otro registro
    this.reset();
});


// ============================================
// 4. MOSTRAR REGISTROS EN CUADRADOS
// ============================================
function mostrarRegistros() {
    // Obtiene el contenedor donde van los cuadrados
    const contenedor = document.getElementById('contenedorRegistros');
    const mensajeVacio = document.getElementById('mensajeVacio');
    
    // Si no hay registros, muestra mensaje
    if (registros.length === 0) {
        contenedor.innerHTML = '';
        mensajeVacio.style.display = 'block';
        return;
    }
    
    // Oculta el mensaje y limpia el contenedor
    mensajeVacio.style.display = 'none';
    contenedor.innerHTML = '';
    
    // Recorre cada registro y crea un cuadrado para cada uno
    registros.forEach(registro => {
        // Crea un div (cuadrado)
        const cuadrado = document.createElement('div');
        cuadrado.className = 'cuadrado-registro';
        
        // Le pone el contenido HTML con los datos del registro
        cuadrado.innerHTML = `
            <div class="cuadrado-header">
                <strong>${registro.nombreCompleto}</strong>
                <button onclick="eliminarRegistro(${registro.id})" class="btn-eliminar">X</button>
            </div>
            <div class="cuadrado-info">
                <div><strong>Lugar:</strong> ${registro.lugarTrabajo}</div>
                <div><strong>Fecha:</strong> ${formatearFecha(registro.fecha)}</div>
                <div><strong>Entrada:</strong> ${registro.horaEntrada}</div>
                <div><strong>Salida:</strong> ${registro.horaSalida}</div>
            </div>
        `;
        
        // Agrega el cuadrado al contenedor
        contenedor.appendChild(cuadrado);
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
