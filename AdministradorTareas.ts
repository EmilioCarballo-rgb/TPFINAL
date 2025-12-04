import { Tarea } from './Tarea.ts';
import { guardarDatosEnArchivo, leerDatosDeArchivo } from './utilidades.ts';

interface Estadistica {
    tipo: string;
    cantidad: number;
    porcentaje: string;
}

export class AdministradorTareas {
    // Tipado estricto para el array de tareas
    private tareas: Tarea[];

    constructor() {
        this.tareas = this.cargarTareasIniciales();
        console.log(`Administrador inicializado con ${this.tareas.length} tareas cargadas.`);
    }

    private cargarTareasIniciales(): Tarea[] {
        const data: any[] = leerDatosDeArchivo('tareas.json');
        // Usamos map para transformar los objetos planos a instancias de Tarea
        return data.map((obj: any) => {
            const tarea = new Tarea(obj.titulo, obj.vencimiento, obj.dificultad, obj.prioridad);
            Object.assign(tarea, obj);
            return tarea;
        });
    }

    public guardarTareas(): void {
        guardarDatosEnArchivo('tareas.json', this.tareas);
    }

    public agregarTarea(
        titulo: string,
        vencimiento?: string,
        dificultad?: 'BAJA' | 'MEDIA' | 'ALTA',
        prioridad?: 'BAJA' | 'MEDIA' | 'ALTA'
    ): Tarea {
        // Validá entradas (Estructurada)
        if (!titulo || titulo.length < 3) {
            throw new Error("El título de la tarea debe tener al menos 3 caracteres.");
        }
        const nuevaTarea: Tarea = new Tarea(titulo, vencimiento, dificultad, prioridad);
        this.tareas.push(nuevaTarea);
        this.guardarTareas();
        return nuevaTarea;
    }

    public eliminarTarea(id: string, fisica: boolean = false): boolean {
        // Eliminación Física (hard delete)
        if (fisica) {
            const initialLength: number = this.tareas.length;
            this.tareas = this.tareas.filter((t: Tarea) => t.id !== id); // Funcional (inmutabilidad)
            this.guardarTareas();
            return this.tareas.length < initialLength;
        }

        // Eliminación Lógica (soft delete)
        const tarea: Tarea | undefined = this.tareas.find((t: Tarea) => t.id === id);
        if (tarea) {
            tarea.marcarParaEliminacionLogica();
            this.guardarTareas();
            return true;
        }
        return false;
    }

    public alternarEstado(id: string): boolean {
        const tarea: Tarea | undefined = this.tareas.find((t: Tarea) => t.id === id);
        if (tarea && tarea.estado !== 'ELIMINADA_LOGICA') {
            tarea.marcarComoCompletada();
            this.guardarTareas();
            return true;
        }
        return false;
    }

    public obtenerTareasOrdenadas(atributo: 'titulo' | 'vencimiento' | 'creacion' | 'dificultad'): Tarea[] {
        const tareasCopia: Tarea[] = [...this.tareas]; // Copia inmutable (PF)

        const comparador = (a: Tarea, b: Tarea): number => {
            if (atributo === 'titulo') {
                return a.titulo.localeCompare(b.titulo);
            }

            if (atributo === 'dificultad') {
                const orden: { [key: string]: number } = { 'BAJA': 1, 'MEDIA': 2, 'ALTA': 3 };
                const obtenerValor = (d: string): number => {
                    const valor = orden[d];
                    return (valor !== undefined) ? valor : 1;
                };


                return obtenerValor(a.dificultad) - obtenerValor(b.dificultad);
            }

            if (atributo === 'vencimiento' || atributo === 'creacion') {
                const dateA: number = a[atributo] ? a[atributo]!.getTime() : Infinity; // Uso del operador de aserción !
                const dateB: number = b[atributo] ? b[atributo]!.getTime() : Infinity;
                return dateA - dateB;
            }
            return 0;
        };

        return tareasCopia.sort(comparador);
    }

    public obtenerEstadisticas(): { totalTareas: number; porEstado: Estadistica[]; porDificultad: Estadistica[] } {
        const total: number = this.tareas.length;

        // PF: Uso de reduce para contar tareas por estado
        const estadoStats: { [key: string]: number } = this.tareas.reduce((acc: { [key: string]: number }, tarea: Tarea) => {
            acc[tarea.estado] = (acc[tarea.estado] || 0) + 1;
            return acc;
        }, {});

        // PF: Uso de reduce para contar tareas por dificultad
        const dificultadStats: { [key: string]: number } = this.tareas.reduce((acc: { [key: string]: number }, tarea: Tarea) => {
            acc[tarea.dificultad] = (acc[tarea.dificultad] || 0) + 1;
            return acc;
        }, {});

        // PF: Mapeo para calcular porcentajes (Composición de Funciones)
        const calcularPorcentajes = (stats: { [key: string]: number }): Estadistica[] =>
            Object.keys(stats).map((key: string) => {
                const cantidad = stats[key] ?? 0;
                return {
                    tipo: key,
                    cantidad: cantidad,
                    porcentaje: ((cantidad / total) * 100).toFixed(2) + '%'
                };
            });

        return {
            totalTareas: total,
            porEstado: calcularPorcentajes(estadoStats),
            porDificultad: calcularPorcentajes(dificultadStats)
        };
    }

    public obtenerPrioridadAlta(): Tarea[] {
        return this.tareas.filter((tarea: Tarea) => tarea.prioridad === 'ALTA');
    }

    public obtenerTareasVencidas(): Tarea[] {
        return this.tareas.filter((tarea: Tarea) => tarea.estaVencida());
    }

    public obtenerRelacionadas(idOrigen: string): Tarea[] {
        const tareaOrigen: Tarea | undefined = this.tareas.find((t: Tarea) => t.id === idOrigen);

        if (!tareaOrigen) return [];

        return this.tareas.filter((t: Tarea) => tareaOrigen.relacionadas.includes(t.id));
    }
    public get Tareas(): Tarea[] {
        return this.tareas;
    }

// ...
}