# MASTER PROMPT: Proyecto Eko-Finanzas

## Contexto del Desarrollador
- **Usuario:** Ingeniero de Sistemas.
- **Enfoque:** Clean Architecture, SOLID, y código autodocumentado.
- **Objetivo:** Aplicación web funcional, visualmente atractiva y 100% gratuita.

## Stack Tecnológico
- **Frontend:** Next.js + TypeScript + Tailwind CSS.
- **Estado/Backend:** Supabase (Auth simplificado vía ID de hogar y DB PostgreSQL).
- **Despliegue:** Vercel.

## Definición de Producto
Eko-Finanzas ayuda a distribuir gastos del hogar de forma equitativa basados en el ingreso mensual de cada miembro.

### Funcionalidades Core (MVP)
1. **Gestión de Hogar:** Creación de un "Hogar" con una clave única compartida.
2. **Miembros:** Registro de ingresos y nombres.
3. **Gastos:** Categorías (Fijas/Porcentuales) y (Compartidas/Individuales).
4. **Cálculo de Aporte:** Fórmula proporcional: `(Ingreso Persona / Ingreso Total Hogar) * Gasto Total`.
5. **Ahorros Temporales:** Metas con barra de progreso visual.

### Funcionalidades Extendidas (Ingeniería)
- **Snapshot Mensual:** Capacidad de archivar el mes actual.
- **Dashboard Visual:** Uso de gráficos (Recharts) para ver la distribución del dinero.
- **Modo Offline-First:** Uso de LocalStorage para persistencia inmediata y sincronización con Supabase.

## Workflow de Desarrollo con Agentes
1. **Paso 1: Setup del Proyecto.** Configurar Next.js y el cliente de Supabase.
2. **Paso 2: Modelado de Datos.** Crear los tipos de TS y las migraciones de DB.
3. **Paso 3: Lógica de Negocio (Hooks).** Desarrollar el `useFinances` hook que haga todos los cálculos de prorrateo.
4. **Paso 4: UI Interactiva.** Crear las pantallas basadas en componentes visuales (lucide-react).
5. **Paso 5: GitHub Sync.** Realizar commits por cada funcionalidad validada.

## Restricciones
- Interfaz en Español.
- Código, logs y documentación en Inglés.
- Máxima prioridad a la UI visual (iconos > texto).