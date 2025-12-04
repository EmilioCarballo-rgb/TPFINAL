
import { AdministradorTareas } from './AdministradorTareas.ts';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { Tarea } from './Tarea.ts'; // Importa Tarea para tipado


const rl = readline.createInterface({ input, output });
const manager: AdministradorTareas = new AdministradorTareas();

function mostrarTareas(tareas: Tarea[]): void {
    if (tareas.length === 0) {
        console.log("\n[!] No hay tareas para mostrar.");
        return;
    }
    console.log("\n--- LISTA DE TAREAS ---");
    tareas.forEach((tarea: Tarea, index: number) => {
        const estadoDisplay: string = tarea.estado.padEnd(16);
        const fechaVenc: string = tarea.vencimiento ? tarea.vencimiento.toLocaleDateString() : 'N/A';
        const estadoEmoji: string = tarea.estado === 'COMPLETADA' ? '✅' : (tarea.estado === 'ELIMINADA_LOGICA' ? '🗑️' : '⏳');
        
        console.log(`| ${String(index + 1).padStart(2)}. | ${estadoEmoji} | ${estadoDisplay} | P: ${tarea.prioridad.padEnd(5)} | D: ${tarea.dificultad.padEnd(5)} | Vence: ${fechaVenc.padEnd(10)} | ID: ${tarea.id.substring(0, 8)} | ${tarea.titulo}`);
    });
    console.log("-------------------------\n");
}

/**
 * Maneja la lógica de agregar una nueva tarea.
 * @returns {Promise<void>}
 */
async function manejarAgregarTarea(): Promise<void> {
    console.log("\n--- AGREGAR NUEVA TAREA ---");
    const titulo: string = await rl.question('Título (requerido): ');

    if (!titulo || titulo.trim().length < 3) {
        console.log("[!] Error: El título es obligatorio y debe tener al menos 3 caracteres.");
        return;
    }

    const vencimiento: string = await rl.question('Fecha de Vencimiento (YYYY-MM-DD, opcional): ');
    const dificultad: string = await rl.question('Dificultad (BAJA/MEDIA/ALTA, por defecto BAJA): ');
    const prioridad: string = await rl.question('Prioridad (BAJA/MEDIA/ALTA, por defecto BAJA): ');

    try {
        // La validación de tipos la maneja el constructor de AdministradorTareas
        manager.agregarTarea(titulo, vencimiento, dificultad as any, prioridad as any); 
        console.log(`\n[✅] Tarea '${titulo}' agregada y guardada.`);
    } catch (e: any) {
        console.log(`[❌] Error al agregar la tarea: ${e.message}`);
    }
}

async function menuPrincipal(): Promise<void> {
    console.log("=================================================");
    console.log("  TP FINAL - Administrador de Tareas (4 Paradigmas - TS)");
    console.log("Tareas cargadas desde simulación:", manager.Tareas.length);
    console.log("=================================================");
    
    let running: boolean = true;
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

        const opcion: string = await rl.question('Ingrese su opción: ');

        switch (opcion.trim()) {
            case '1': mostrarTareas(manager.Tareas); break;
            case '2': await manejarAgregarTarea(); break;
            // Faltarían por pegar aquí los casos 3 al 7 con la lógica de manejo
            case '8': 
                manager.guardarTareas(); 
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

menuPrincipal();