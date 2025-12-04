export function generarUUID() {
    // Generación de UUID simple para cumplir con el requerimiento de ID único
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function guardarDatosEnArchivo(nombreArchivo, datos) {
    const datosJSON = JSON.stringify(datos, null, 2);
    console.log(`\n--- SIMULACIÓN DE ESCRITURA EN ${nombreArchivo} ---`);
    console.log(datosJSON);
    console.log(`--- FIN DE ESCRITURA ---`);
}

/**
 * @function leerDatosDeArchivo
 * @description Simula la lectura de datos desde un archivo.
 * @param {string} nombreArchivo - El nombre del archivo (e.g., 'tareas.json').
 * @returns {Array} Un array de objetos simulando los datos cargados.
 */
export function leerDatosDeArchivo(nombreArchivo) {
    // Simulación: Aquí se cargarían datos reales.
    console.log(`\n--- SIMULACIÓN DE LECTURA DE ${nombreArchivo} ---`);
    // Retorna datos quemados
    return [
        { 
            id: generarUUID(), 
            titulo: "Terminar la clase AdministradorTareas", 
            creacion: new Date(2025, 11, 1), 
            vencimiento: new Date(2025, 12, 10),
            dificultad: 'ALTA', 
            prioridad: 'ALTA', 
            estado: 'PENDIENTE',
            relacionadas: [] 
        },
        // Al retornar el array simulado, la función es determinista para el test.
    ];
}