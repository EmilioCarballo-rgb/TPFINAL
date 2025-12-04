/**
 * @file utilidades.ts
 * @description Contiene funciones puras y reutilizables con tipado TypeScript.
 */

import { Tarea } from './Tarea.ts'; // Importa la clase Tarea para tipado

/**
 * @function generarUUID
 * @description Genera un ID único universal (UUID) simple.
 * @returns {string} Un identificador único.
 */
export function generarUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * @function guardarDatosEnArchivo
 * @description Simula la persistencia de datos en un archivo.
 * @param {string} nombreArchivo - El nombre del archivo (e.g., 'tareas.json').
 * @param {Array<Tarea>} datos - Los datos a guardar.
 * @returns {void}
 */
export function guardarDatosEnArchivo(nombreArchivo: string, datos: Tarea[]): void {
    const datosJSON: string = JSON.stringify(datos, null, 2);
    console.log(`\n--- SIMULACIÓN DE ESCRITURA EN ${nombreArchivo} ---`);
    console.log(datosJSON);
    console.log(`--- FIN DE ESCRITURA ---`);
}

/**
 * @function leerDatosDeArchivo
 * @description Simula la lectura de datos desde un archivo.
 * @param {string} nombreArchivo - El nombre del archivo (e.g., 'tareas.json').
 * @returns {any[]} Un array de objetos simulando los datos cargados.
 */
export function leerDatosDeArchivo(nombreArchivo: string): any[] {
    console.log(`\n--- SIMULACIÓN DE LECTURA DE ${nombreArchivo} ---`);
    // Retorna datos quemados (mock) para probar la carga inicial
    return [
        { 
            id: generarUUID(), 
            titulo: "Terminar la clase AdministradorTareas (TS)", 
            creacion: new Date(2025, 11, 1), 
            vencimiento: new Date(2025, 12, 10),
            dificultad: 'ALTA', 
            prioridad: 'ALTA', 
            estado: 'PENDIENTE',
            relacionadas: [] 
        }
    ];
}