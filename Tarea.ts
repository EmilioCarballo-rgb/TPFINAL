import { generarUUID } from './utilidades.ts';

export class Tarea {
    // Definición de Tipos y Acceso (Atributos)
    public id: string;
    public titulo: string;
    public creacion: Date;
    public vencimiento: Date | null;
    public dificultad: 'BAJA' | 'MEDIA' | 'ALTA';
    public prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
    public estado: 'PENDIENTE' | 'COMPLETADA' | 'ELIMINADA_LOGICA';
    public relacionadas: string[];

    /**
     * Constructor de la clase Tarea.
     * @param {string} titulo - Descripción o título de la tarea.
     * @param {string} [fechaVencimiento=''] - Fecha límite para completar la tarea. Formato YYYY-MM-DD.
     * @param {Dificultad} [dificultad='BAJA'] - Nivel de dificultad.
     * @param {Prioridad} [prioridad='BAJA'] - Nivel de prioridad.
     */
    constructor(
        titulo: string, 
        fechaVencimiento: string = '', 
        dificultad: 'BAJA' | 'MEDIA' | 'ALTA' = 'BAJA', 
        prioridad: 'BAJA' | 'MEDIA' | 'ALTA' = 'BAJA'
    ) {
        // Asignación de valores
        this.id = generarUUID();
        this.titulo = titulo;
        this.creacion = new Date();
        // Validación de tipo (Estructurada)
        this.vencimiento = fechaVencimiento ? new Date(fechaVencimiento) : null;
        this.dificultad = dificultad.toUpperCase() as 'BAJA' | 'MEDIA' | 'ALTA';
        this.prioridad = prioridad.toUpperCase() as 'BAJA' | 'MEDIA' | 'ALTA';
        this.estado = 'PENDIENTE';
        this.relacionadas = [];
    }

    public marcarComoCompletada(): void {
        if (this.estado === 'PENDIENTE') {
            this.estado = 'COMPLETADA';
        } else if (this.estado === 'COMPLETADA') {
            this.estado = 'PENDIENTE';
        }
    }

    public marcarParaEliminacionLogica(): void {
        this.estado = 'ELIMINADA_LOGICA';
    }

    public agregarRelacion(idRelacionada: string): void {
        if (!this.relacionadas.includes(idRelacionada)) {
            this.relacionadas.push(idRelacionada);
        }
    }

    public estaVencida(): boolean {
        // Uso de type-guard: verifica que this.vencimiento no sea null
        return !!this.vencimiento && this.vencimiento < new Date() && this.estado !== 'COMPLETADA';
    }

    public toString(): string {
        const estadoDisplay = this.estado.padEnd(16);
        const idDisplay = this.id.substring(0, 8);
        const prioridadDisplay = this.prioridad.padEnd(5);
        
        return `[${estadoDisplay}] | ID: ${idDisplay} | Prioridad: ${prioridadDisplay} | Título: ${this.titulo}`;
    }
}