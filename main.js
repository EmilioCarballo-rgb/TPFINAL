/**
 * @file main.js
 * @description Script de ejecución principal con interfaz interactiva de consola.
 * * Implementa:
 * - Programación Estructurada: Control de flujo (loops, switch/case) para el menú.
 * - Modularización: Importa las clases de otros archivos.
 */

import { AdministradorTareas } from './AdministradorTareas.js';
import * as readline from 'node:readline/promises'; // Módulo para entrada/salida interactiva
import { stdin as input, stdout as output } from 'node:process';


const rl = readline.createInterface({ input, output });
const manager = new AdministradorTareas();

/**
 * Muestra las tareas en un formato limpio.
 * @param {Array<Object>} tareas - El array de tareas a mostrar.
 */
function mostrarTareas(tareas) {
    if (tareas.length === 0) {
        console.log("\n[!] No hay tareas para mostrar.");
        return;
    }
    console.log("\n--- LISTA DE TAREAS ---");
    // Programación Estructurada: Uso del forEach para iterar
    tareas.forEach((tarea, index) => {
        const estado = tarea.estado.padEnd(16);
        const fechaVenc = tarea.vencimiento ? tarea.vencimiento.toLocaleDateString() : 'N/A';
        const estadoEmoji = tarea.estado === 'COMPLETADA' ? '✅' : (tarea.estado === 'ELIMINADA_LOGICA' ? '🗑️' : '⏳');
        
        console.log(`| ${String(index + 1).padStart(2)}. | ${estadoEmoji} | ${estado} | P: ${tarea.prioridad.padEnd(5)} | D: ${tarea.dificultad.padEnd(5)} | Vence: ${fechaVenc.padEnd(10)} | ID: ${tarea.id.substring(0, 8)} | ${tarea.titulo}`);
    });
    console.log("-------------------------\n");
}

/**
 * Maneja la lógica de agregar una nueva tarea.
 */
async function manejarAgregarTarea() {
    console.log("\n--- AGREGAR NUEVA TAREA ---");
    const titulo = await rl.question('Título (requerido): ');

    // Validación de entrada (Programación Estructurada)
    if (!titulo || titulo.trim().length < 3) {
        console.log("[!] Error: El título es obligatorio y debe tener al menos 3 caracteres.");
        return;
    }

    const vencimiento = await rl.question('Fecha de Vencimiento (YYYY-MM-DD, opcional): ');
    const dificultad = await rl.question('Dificultad (BAJA/MEDIA/ALTA, por defecto BAJA): ');
    const prioridad = await rl.question('Prioridad (BAJA/MEDIA/ALTA, por defecto BAJA): ');

    try {
        manager.agregarTarea(titulo, vencimiento, dificultad, prioridad);
        console.log(`\n[✅] Tarea '${titulo}' agregada y guardada.`);
    } catch (e) {
        console.log(`[❌] Error al agregar la tarea: ${e.message}`);
    }
}

/**
 * Maneja la lógica de alternar el estado (Completada/Pendiente).
 */
async function manejarAlternarEstado() {
    mostrarTareas(manager.tareas.filter(t => t.estado !== 'ELIMINADA_LOGICA'));
    const id = await rl.question('Ingrese el ID (primeros 8 caracteres) o el número de la tarea a marcar/desmarcar: ');

    const tarea = manager.tareas.find(t => t.id.startsWith(id.trim()) || String(manager.tareas.indexOf(t) + 1) === id.trim());

    if (tarea) {
        manager.alternarEstado(tarea.id); // Llama al método POO
        console.log(`\n[✅] Estado de la tarea '${tarea.titulo}' actualizado a: ${tarea.estado}.`);
    } else {
        console.log("\n[!] Tarea no encontrada o ID/Número no válido.");
    }
}

/**
 * Maneja la lógica de eliminación (Física o Lógica).
 */
async function manejarEliminarTarea() {
    mostrarTareas(manager.tareas);
    const id = await rl.question('Ingrese el ID (primeros 8 caracteres) o el número de la tarea a eliminar: ');
    
    const tarea = manager.tareas.find(t => t.id.startsWith(id.trim()) || String(manager.tareas.indexOf(t) + 1) === id.trim());

    if (!tarea) {
        console.log("\n[!] Tarea no encontrada o ID/Número no válido.");
        return;
    }

    const tipo = await rl.question(`¿Desea eliminarla FÍSICAMENTE (f) o LOGICAMENTE (l)? (Predeterminado: l): `);
    const fisica = tipo.toLowerCase() === 'f';

    if (manager.eliminarTarea(tarea.id, fisica)) {
        const accion = fisica ? 'eliminada físicamente' : 'marcada para eliminación lógica';
        console.log(`\n[✅] Tarea '${tarea.titulo}' ha sido ${accion}.`);
    } else {
        console.log("\n[❌] No se pudo realizar la eliminación.");
    }
}

/**
 * Maneja la lógica de ordenamiento (PF).
 */
async function manejarOrdenamiento() {
    console.log("\n--- ORDENAR TAREAS ---");
    const atributo = await rl.question('Ordenar por: (T)ítulo, (V)encimiento, (C)reación, (D)ificultad: ');

    let attrMap = {};
    // Programación Estructurada: Mapeo de entrada
    switch (atributo.toLowerCase()) {
        case 't': attrMap = 'titulo'; break;
        case 'v': attrMap = 'vencimiento'; break;
        case 'c': attrMap = 'creacion'; break;
        case 'd': attrMap = 'dificultad'; break;
        default: 
            console.log("[!] Opción de ordenamiento no válida. Mostrando sin ordenar.");
            mostrarTareas(manager.tareas);
            return;
    }

    // Llama al método Funcional
    const tareasOrdenadas = manager.obtenerTareasOrdenadas(attrMap);
    console.log(`\n[✅] Tareas ordenadas por ${attrMap.toUpperCase()}:`);
    mostrarTareas(tareasOrdenadas);
}

/**
 * Maneja la lógica de consultas e inferencias (PL).
 */
async function manejarConsultas() {
    console.log("\n--- CONSULTAS LÓGICAS ---");
    const opcion = await rl.question('Consultar: (A)lta Prioridad, (V)encidas, (R)elacionadas: ');
    
    let resultados = [];
    let titulo = '';

    // Programación Estructurada: Selección de consulta
    switch (opcion.toLowerCase()) {
        case 'a':
            resultados = manager.obtenerPrioridadAlta(); // Lógica
            titulo = 'ALTA PRIORIDAD';
            break;
        case 'v':
            resultados = manager.obtenerTareasVencidas(); // Lógica
            titulo = 'VENCIDAS';
            break;
        case 'r':
            const id = await rl.question('Ingrese el ID (primeros 8 caracteres) de la tarea de origen: ');
            const tareaOrigen = manager.tareas.find(t => t.id.startsWith(id.trim()));
            
            if (tareaOrigen) {
                resultados = manager.obtenerRelacionadas(tareaOrigen.id); // Lógica
                titulo = `RELACIONADAS a '${tareaOrigen.titulo}'`;
            } else {
                console.log("[!] Tarea de origen no encontrada.");
                return;
            }
            break;
        default:
            console.log("[!] Opción no válida.");
            return;
    }

    console.log(`\n--- RESULTADOS: ${titulo} ---`);
    mostrarTareas(resultados);
}

/**
 * Muestra las estadísticas (PF).
 */
function manejarEstadisticas() {
    console.log("\n--- ESTADÍSTICAS (Programación Funcional) ---");
    const stats = manager.obtenerEstadisticas(); // Llama al método Funcional

    console.log(`Total de Tareas (incluyendo eliminadas): ${stats.totalTareas}`);
    
    console.log("\n--- Por Estado ---");
    stats.porEstado.forEach(s => {
        console.log(`- ${s.tipo.padEnd(16)}: ${s.cantidad} tareas (${s.porcentaje})`);
    });

    console.log("\n--- Por Dificultad ---");
    stats.porDificultad.forEach(s => {
        console.log(`- ${s.tipo.padEnd(16)}: ${s.cantidad} tareas (${s.porcentaje})`);
    });
}


/**
 * Función principal que muestra el menú y maneja las opciones.
 */
async function menuPrincipal() {
    console.log("=================================================");
    console.log("  TP FINAL - Administrador de Tareas (4 Paradigmas)");
    console.log(`  Tareas cargadas desde simulación: ${manager.tareas.length}`);
    console.log("=================================================");
    
    let running = true;
    while (running) {
        console.log("\n-- MENÚ --");
        console.log("1. Mostrar Tareas (Todas)");
        console.log("2. Agregar Nueva Tarea");
        console.log("3. Marcar/Desmarcar Tarea (Completada)");
        console.log("4. Eliminar Tarea (Física/Lógica)");
        console.log("5. Ordenar Tareas");
        console.log("6. Consultas Lógicas (Vencidas, Prioridad Alta, Relacionadas)");
        console.log("7. Mostrar Estadísticas (Funcional)");
        console.log("8. Salir y Guardar");

        const opcion = await rl.question('Ingrese su opción: ');

        // Programación Estructurada: Lógica de selección anidada (switch)
        switch (opcion.trim()) {
            case '1': mostrarTareas(manager.tareas); break;
            case '2': await manejarAgregarTarea(); break;
            case '3': await manejarAlternarEstado(); break;
            case '4': await manejarEliminarTarea(); break;
            case '5': await manejarOrdenamiento(); break;
            case '6': await manejarConsultas(); break;
            case '7': manejarEstadisticas(); break;
            case '8': 
                manager.guardarTareas(); // Guarda el estado final
                running = false; 
                break;
            default:
                console.log("[!] Opción no válida. Intente de nuevo.");
                break;
        }
    }
    rl.close();
    console.log("\n¡Aplicación finalizada! Estado final guardado (simulado).");
}

// Iniciar el menú
menuPrincipal();