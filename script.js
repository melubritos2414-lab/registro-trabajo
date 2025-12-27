// ============================================
// 1. VARIABLE PARA GUARDAR LOS REGISTROS
// ============================================
let registros = [];
let nombreUsuario = '';

// Referencia a la colección de Firestore
let registrosRef = null;


// ============================================
// 2. CARGAR DATOS AL INICIAR LA PÁGINA
// ============================================
window.addEventListener('load', async () => {
    nombreUsuario = localStorage.getItem('nombreUsuario') || '';
    if (nombreUsuario) {
        document.getElementById('nombreMostrar').textContent = nombreUsuario;
        document.getElementById('nombreImpresion').textContent = 'Empleado: ' + nombreUsuario;
        document.getElementById('configNombre').style.display = 'none';
        document.getElementById('formularioRegistro').style.display = 'block';
        // Referencia a la colección de Firestore para este usuario
        registrosRef = db.collection('registros').where('nombreCompleto', '==', nombreUsuario);
        await cargarRegistrosFirestore();
    }
});

async function cargarRegistrosFirestore() {
    try {
        const snapshot = await db.collection('registros').where('nombreCompleto', '==', nombreUsuario).get();
        registros = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            registros.push({ ...data, id: doc.id });
        });
        registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        mostrarRegistros();
    } catch (error) {
        alert('Error al cargar registros de la nube');
    }
}

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
        // Referencia a la colección de Firestore para este usuario
        registrosRef = db.collection('registros').where('nombreCompleto', '==', nombreUsuario);
        cargarRegistrosFirestore();
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
document.getElementById('registroForm').addEventListener('submit', async function(e) {
    // Evita que la página se recargue
    e.preventDefault();
    
    // Crea un objeto con todos los datos del formulario
    const nuevoRegistro = {
        nombreCompleto: nombreUsuario,
        lugarTrabajo: document.getElementById('lugarTrabajo').value,
        fecha: document.getElementById('fecha').value,
        horaEntrada: document.getElementById('horaEntrada').value,
        horaSalida: document.getElementById('horaSalida').value
    };
    
    try {
        await db.collection('registros').add(nuevoRegistro);
        await cargarRegistrosFirestore();
        this.reset();
    } catch (error) {
        alert('Error al guardar en la nube');
    }
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
            <td><button onclick="eliminarRegistro('${registro.id}')" class="btn-eliminar-tabla">X</button></td>
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
async function eliminarRegistro(id) {
    // Pregunta si está seguro
    if (confirm('¿Estás seguro de eliminar este registro?')) {
        try {
            await db.collection('registros').doc(id).delete();
            await cargarRegistrosFirestore();
        } catch (error) {
            alert('Error al eliminar en la nube');
        }
    }
}


// ============================================
// 7. IMPRIMIR REGISTROS
// ============================================
function imprimirRegistros() {
    // Abre el diálogo de impresión del navegador
    window.print();
}
