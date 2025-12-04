/**
 * @file AdministradorTareas.js
 * @description Clase principal responsable de gestionar la colección de tareas.
 * * Implementa:
 * - Programación Orientada a Objetos (POO): Patrón de "Administrador/Gestor".
 * - Programación Funcional (PF): Métodos de ordenamiento y estadísticas (map, filter, reduce).
 * - Programación Lógica (PL): Métodos de consulta e inferencia.
 * - Modularización: Separa la lógica de gestión de la entidad Tarea.
 */

import { Tarea } from './Tarea.js';
import { guardarDatosEnArchivo, leerDatosDeArchivo } from './utilidades.js';

/**
 * @class AdministradorTareas
 * @description Centraliza la gestión, manipulación y consulta de todas las tareas.
 */
export class AdministradorTareas {
    constructor() {
        /** @type {Array<Tarea>} */
        // Carga tareas desde la simulación del archivo
        this.tareas = this.cargarTareasIniciales(); 
        console.log(`Administrador inicializado con ${this.tareas.length} tareas cargadas.`);
    }

    /**
     * @returns {Array<Tarea>}
     */
    cargarTareasIniciales() {
        const data = leerDatosDeArchivo('tareas.json');
        // Mapea los objetos planos del JSON a instancias de la clase Tarea (POO)
        return data.map(obj => {
            const tarea = new Tarea(obj.titulo, obj.vencimiento, obj.dificultad, obj.prioridad);
            Object.assign(tarea, obj); // Asigna otros atributos (id, estado)
            return tarea;
        });
    }

    /**
     * @returns {void}
     */
    guardarTareas() {
        // Llama a la utilidad para simular la persistencia
        guardarDatosEnArchivo('tareas.json', this.tareas);
    }

    /**
     * Agrega una nueva tarea a la lista.
     * @param {string} titulo - Título de la tarea.
     * @param {string} [vencimiento=''] - Fecha de vencimiento.
     * @param {string} [dificultad='BAJA'] - Dificultad.
     * @param {string} [prioridad='BAJA'] - Prioridad.
     * @returns {Tarea} La nueva tarea creada.
     */
    agregarTarea(titulo, vencimiento, dificultad, prioridad) {
        // Validá entradas (Estructurada)
        if (!titulo || titulo.length < 3) {
            throw new Error("El título de la tarea debe tener al menos 3 caracteres.");
        }
        const nuevaTarea = new Tarea(titulo, vencimiento, dificultad, prioridad);
        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        return nuevaTarea;
    }

    /**
     * (Estructurada) Elimina una tarea por su ID.
     * @param {string} id - El ID de la tarea a eliminar.
     * @param {boolean} [fisica=false] - True para eliminación física (hard delete), false para lógica (soft delete).
     * @returns {boolean} True si la tarea fue eliminada/marcada.
     */
    eliminarTarea(id, fisica = false) {
        // Eliminación Física 
        if (fisica) {
            const initialLength = this.tareas.length;
            this.tareas = this.tareas.filter(t => t.id !== id);
            this.guardarTareas();
            return this.tareas.length < initialLength;
        }

        // Eliminación Lógica
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.marcarParaEliminacionLogica(); // Llama al método de Tarea
            this.guardarTareas();
            return true;
        }
        return false;
    }

    /**
     * (Estructurada) Alterna el estado de una tarea (PENDIENTE <-> COMPLETADA).
     * @param {string} id - El ID de la tarea a modificar.
     * @returns {boolean} True si el estado fue alternado.
     */
    alternarEstado(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea && tarea.estado !== 'ELIMINADA_LOGICA') {
            tarea.marcarComoCompletada(); // Llama al método de Tarea
            this.guardarTareas();
            return true;
        }
        return false;
    }

    /**
     * @param {('titulo'|'vencimiento'|'creacion'|'dificultad')} atributo - El atributo por el cual ordenar.
     * @returns {Array<Tarea>} Un nuevo array de tareas ordenadas.
     */
    obtenerTareasOrdenadas(atributo) {
        // Copiamos el array para no mutar el original (PF)
        const tareasCopia = [...this.tareas]; 

        // Función de comparación (Curried/Higher-Order Function)
        const comparador = (a, b) => {
            if (atributo === 'titulo') {
                // Estructurada: Comparación de strings
                return a.titulo.localeCompare(b.titulo); 
            }
            if (atributo === 'dificultad') {
                // PF: Mapeo de valores para comparación
                const orden = { 'BAJA': 1, 'MEDIA': 2, 'ALTA': 3 };
                return orden[a.dificultad] - orden[b.dificultad];
            }
            if (atributo === 'vencimiento' || atributo === 'creacion') {
                // PF: Comparación de fechas (uso de getTime para obtener el valor numérico)
                const dateA = a[atributo] ? a[atributo].getTime() : Infinity;
                const dateB = b[atributo] ? b[atributo].getTime() : Infinity;
                return dateA - dateB;
            }
            return 0; // Si el atributo no es válido, no ordena
        };

        return tareasCopia.sort(comparador);
    }

    /**
     * @returns {object} Objeto con las estadísticas.
     */
    obtenerEstadisticas() {
        const total = this.tareas.length;

        // PF: Uso de reduce para contar tareas por estado
        const estadoStats = this.tareas.reduce((acc, tarea) => {
            acc[tarea.estado] = (acc[tarea.estado] || 0) + 1;
            return acc;
        }, {});

        // PF: Uso de reduce para contar tareas por dificultad
        const dificultadStats = this.tareas.reduce((acc, tarea) => {
            acc[tarea.dificultad] = (acc[tarea.dificultad] || 0) + 1;
            return acc;
        }, {});

        // PF: Mapeo para calcular porcentajes 
        const calcularPorcentajes = (stats) => 
            Object.keys(stats).map(key => ({
                tipo: key,
                cantidad: stats[key],
                porcentaje: ((stats[key] / total) * 100).toFixed(2) + '%'
            }));

        return {
            totalTareas: total,
            porEstado: calcularPorcentajes(estadoStats),
            porDificultad: calcularPorcentajes(dificultadStats)
        };
    }

    /**
     * Una tarea es de Alta Prioridad si su atributo 'prioridad' es 'ALTA'.
     * @returns {Array<Tarea>}
     */
    obtenerPrioridadAlta() {
        // PF/PL: Usamos filter para consultar el predicado.
        return this.tareas.filter(tarea => tarea.prioridad === 'ALTA');
    }

    /**
     * Listado de todas las tareas vencidas.
     * @returns {Array<Tarea>}
     */
    obtenerTareasVencidas() {
        return this.tareas.filter(tarea => tarea.estaVencida());
    }

    /**
     * Una tarea B está relacionada a A si el ID de B está en la lista de relacionadas de A.
     * @param {string} idOrigen - ID de la tarea para la cual se buscan relacionadas.
     * @returns {Array<Tarea>}
     */
    obtenerRelacionadas(idOrigen) {
        const tareaOrigen = this.tareas.find(t => t.id === idOrigen);
        if (!tareaOrigen) return [];
        return this.tareas.filter(t => tareaOrigen.relacionadas.includes(t.id));
    }
}

