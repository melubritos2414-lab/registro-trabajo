// Array para almacenar las jornadas
let trabajos = [];

// Cargar datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarTrabajos();
    mostrarTrabajos();
    actualizarResumen();
    cargarNombreTrabajador();
    
    // Establecer la fecha actual por defecto
    document.getElementById('fecha').valueAsDate = new Date();
    
    // Establecer el mes actual en el filtro
    const hoy = new Date();
    const mesActual = hoy.toISOString().slice(0, 7);
    document.getElementById('filtroMes').value = mesActual;
});

// Manejar el envío del formulario
document.getElementById('trabajoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    agregarTrabajo();
});

// Función para agregar una nueva jornada
function agregarTrabajo() {
    const fecha = document.getElementById('fecha').value;
    const horaEntrada = document.getElementById('horaEntrada').value;
    const horaSalida = document.getElementById('horaSalida').value;
    const lugar = document.getElementById('lugar').value;
    
    // Calcular horas trabajadas
    const [horaE, minE] = horaEntrada.split(':').map(Number);
    const [horaS, minS] = horaSalida.split(':').map(Number);
    const minutosEntrada = horaE * 60 + minE;
    const minutosSalida = horaS * 60 + minS;
    const totalMinutos = minutosSalida - minutosEntrada;
    
    if (totalMinutos <= 0) {
        alert('⚠️ La hora de salida debe ser posterior a la hora de entrada');
        return;
    }
    
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    
    const nuevoTrabajo = {
        id: Date.now(),
        fecha: fecha,
        horaEntrada: horaEntrada,
        horaSalida: horaSalida,
        horas: horas,
        minutos: minutos,
        lugar: lugar
    };
    
    trabajos.push(nuevoTrabajo);
    guardarTrabajos();
    
    // LIMPIAR EL FORMULARIO INMEDIATAMENTE
    document.getElementById('fecha').valueAsDate = new Date();
    document.getElementById('horaEntrada').value = '';
    document.getElementById('horaSalida').value = '';
    document.getElementById('lugar').value = '';
    
    // Actualizar la vista después de limpiar
    mostrarTrabajos();
    actualizarResumen();
    
    // Mostrar mensaje de éxito al final
    alert('✅ Jornada registrada correctamente');
}

// Función para guardar trabajos en localStorage
function guardarTrabajos() {
    localStorage.setItem('trabajos', JSON.stringify(trabajos));
}

// Función para cargar trabajos desde localStorage
function cargarTrabajos() {
    const trabajosGuardados = localStorage.getItem('trabajos');
    if (trabajosGuardados) {
        trabajos = JSON.parse(trabajosGuardados);
    }
}

// Función para mostrar las jornadas en la tabla
function mostrarTrabajos(trabajosFiltrados = null) {
    const tbody = document.getElementById('trabajosBody');
    const mensajeVacio = document.getElementById('mensajeVacio');
    const trabajosAMostrar = trabajosFiltrados !== null ? trabajosFiltrados : trabajos;
    
    tbody.innerHTML = '';
    
    if (trabajosAMostrar.length === 0) {
        mensajeVacio.style.display = 'block';
        return;
    }
    
    mensajeVacio.style.display = 'none';
    
    // Ordenar por fecha (más recientes primero)
    trabajosAMostrar.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    trabajosAMostrar.forEach(trabajo => {
        const tr = document.createElement('tr');
        
        // Formatear la fecha
        const fechaFormateada = new Date(trabajo.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        tr.innerHTML = `
            <td>${fechaFormateada}</td>
            <td><strong>${trabajo.horaEntrada}</strong></td>
            <td><strong>${trabajo.horaSalida}</strong></td>
            <td><strong>${trabajo.horas}h ${trabajo.minutos}m</strong></td>
            <td>${trabajo.lugar}</td>
            <td class="no-print">
                <button onclick="eliminarTrabajo(${trabajo.id})" class="btn btn-delete">🗑️</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Función para actualizar el resumen
function actualizarResumen(trabajosFiltrados = null) {
    const trabajosACalcular = trabajosFiltrados !== null ? trabajosFiltrados : trabajos;
    
    const totalTrabajos = trabajosACalcular.length;
    
    // Calcular total de horas y minutos
    let totalMinutos = 0;
    trabajosACalcular.forEach(t => {
        totalMinutos += (t.horas * 60) + t.minutos;
    });
    
    const totalHoras = Math.floor(totalMinutos / 60);
    const totalMins = totalMinutos % 60;
    
    document.getElementById('totalTrabajos').textContent = totalTrabajos;
    document.getElementById('totalHoras').textContent = `${totalHoras}h ${totalMins}m`;
}

// Función para filtrar trabajos por mes
function filtrarPorMes() {
    const filtroMes = document.getElementById('filtroMes').value;
    
    if (!filtroMes) {
        alert('⚠️ Por favor selecciona un mes');
        return;
    }
    
    const [año, mes] = filtroMes.split('-');
    
    const trabajosFiltrados = trabajos.filter(trabajo => {
        const fechaTrabajo = new Date(trabajo.fecha + 'T00:00:00');
        return fechaTrabajo.getFullYear() == año && (fechaTrabajo.getMonth() + 1) == mes;
    });
    
    mostrarTrabajos(trabajosFiltrados);
    actualizarResumen(trabajosFiltrados);
    
    // Cambiar el título para indicar que está filtrado
    const nombreMes = new Date(año, mes - 1).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    document.querySelector('.tabla-section h2').textContent = `Jornadas de ${nombreMes}`;
}

// Función para mostrar todas las jornadas
function mostrarTodos() {
    document.getElementById('filtroMes').value = '';
    mostrarTrabajos();
    actualizarResumen();
    document.querySelector('.tabla-section h2').textContent = 'Jornadas Registradas';
}

// Función para imprimir el mes actual o filtrado
function imprimirMes() {
    const filtroMes = document.getElementById('filtroMes').value;
    
    if (!filtroMes) {
        if (confirm('No hay un mes seleccionado. ¿Deseas imprimir todas las jornadas?')) {
            window.print();
        }
        return;
    }
    
    // Filtrar primero
    filtrarPorMes();
    
    // Esperar un momento para que se actualice la vista
    setTimeout(() => {
        window.print();
    }, 100);
}

// Función para eliminar una jornada
function eliminarTrabajo(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta jornada?')) {
        trabajos = trabajos.filter(t => t.id !== id);
        guardarTrabajos();
        
        // Si hay un filtro activo, volver a aplicarlo
        const filtroMes = document.getElementById('filtroMes').value;
        if (filtroMes) {
            filtrarPorMes();
        } else {
            mostrarTrabajos();
            actualizarResumen();
        }
        
        alert('🗑️ Jornada eliminada correctamente');
    }
}

// Función para limpiar todos los datos
function limpiarDatos() {
    if (confirm('⚠️ ¿Estás seguro de que deseas eliminar TODAS las jornadas? Esta acción no se puede deshacer.')) {
        if (confirm('⚠️⚠️ ÚLTIMA ADVERTENCIA: Se eliminarán todos los datos permanentemente.')) {
            trabajos = [];
            guardarTrabajos();
            mostrarTrabajos();
            actualizarResumen();
            alert('🗑️ Todos los datos han sido eliminados');
        }
    }
}

// Guardar nombre del trabajador
function guardarTrabajador() {
    const nombre = document.getElementById('nombreTrabajador').value;
    
    if (!nombre) {
        alert('⚠️ Por favor escribe tu nombre');
        return;
    }
    
    localStorage.setItem('nombreTrabajador', nombre);
    cargarNombreTrabajador();
    alert('✅ Nombre guardado. Aparecerá al imprimir');
}

// Cargar nombre del trabajador
function cargarNombreTrabajador() {
    const nombre = localStorage.getItem('nombreTrabajador');
    
    if (nombre) {
        document.getElementById('nombreTrabajador').value = nombre;
        document.getElementById('nombreImpresion').textContent = nombre;
    }
}
