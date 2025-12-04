import { generarUUID } from './utilidades.js'; 

/**
 * @class Tarea
 * @description Representa una tarea individual con sus atributos y comportamientos.
 */
export class Tarea {
    constructor(titulo, fechaVencimiento = '', dificultad = 'BAJA', prioridad = 'BAJA') {
        this.id = generarUUID(); 
        this.titulo = titulo;
        this.creacion = new Date();
        this.vencimiento = fechaVencimiento ? new Date(fechaVencimiento) : null;
        this.dificultad = dificultad.toUpperCase();
        this.prioridad = prioridad.toUpperCase();
        this.estado = 'PENDIENTE';
        this.relacionadas = []; 
    }

    /**
     * Cambia el estado de la tarea de PENDIENTE a COMPLETADA, o viceversa.
     * @returns {void}
     */
    marcarComoCompletada() {
        if (this.estado === 'PENDIENTE') {
            this.estado = 'COMPLETADA';
        } else if (this.estado === 'COMPLETADA') {
            this.estado = 'PENDIENTE';
        }
    }

    /**
     * Marca la tarea para su eliminación lógica (soft delete).
     * @returns {void}
     */
    marcarParaEliminacionLogica() {
        this.estado = 'ELIMINADA_LOGICA';
    }

    /**
     * Agrega el ID de una tarea relacionada.
     * @param {string} idRelacionada - El ID de la tarea a relacionar.
     * @returns {void}
     */
    agregarRelacion(idRelacionada) {
        if (!this.relacionadas.includes(idRelacionada)) {
            this.relacionadas.push(idRelacionada);
        }
    }

    /**
     * Comprueba si la tarea está vencida.
     * @returns {boolean} - True si está vencida, false en caso contrario.
     */
    estaVencida() {
        // Programación Lógica/Estructurada: Inferencia basada en la fecha actual
        return this.vencimiento && this.vencimiento < new Date() && this.estado !== 'COMPLETADA';
    }

    /**
     * Muestra la representación de la tarea.
     * @returns {string}
     */
    toString() {
        return `[${this.estado.padEnd(16)}] | ID: ${this.id.substring(0, 8)} | Prioridad: ${this.prioridad.padEnd(5)} | Título: ${this.titulo}`;
    }
}