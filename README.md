# 🚀 CIFRAX - Smart Inventory & Numerical Management

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**CIFRAX** es una plataforma Full-Stack de alto rendimiento diseñada para la gestión inteligente de combinaciones numéricas y organización de inventarios lógicos. Este proyecto nace como una solución técnica de nivel ingeniería, optimizada para la velocidad, la seguridad y la escalabilidad.



---

## 🛠️ Stack Tecnológico

* **Frontend:** React 19 + Next.js 15 (App Router).
* **Backend:** Server Actions de Next.js (Zero API latency).
* **Base de Datos:** PostgreSQL alojado en Supabase.
* **Autenticación:** Supabase Auth con Middleware de protección de rutas.
* **Estilos:** Tailwind CSS con arquitectura de componentes reutilizables.
* **Seguridad:** Row Level Security (RLS) para aislamiento total de datos por usuario.

---

## 🔥 Características Principales (Core Features)

### 🛡️ Seguridad de Nivel Empresarial
* **Aislamiento de Datos:** Cada usuario solo tiene acceso a sus propios datos mediante políticas RLS en PostgreSQL.
* **Validación Robusta:** Sistema anti-duplicados inteligente que ignora mayúsculas y espacios innecesarios al registrar combinaciones o usuarios.
* **Protección de Rutas:** Middleware avanzado que gestiona sesiones de usuario en el servidor.

### 📊 Gestión Inteligente (Full CRUD)
* **Dashboard Dinámico:** Vista global de estadísticas en tiempo real.
* **Grupos Personalizables:** Organización por categorías con códigos de color para identificación rápida.
* **Filtrado Pro:** Buscador instantáneo por nombre, notas o números, junto con ordenamiento por fecha o nombre.

### ⚡ Optimización de Ingeniería
* **Hydration Fix:** Configuración avanzada para evitar errores de renderizado por extensiones de navegador.
* **Parallel Fetching:** Uso de `Promise.all` en el servidor para reducir el tiempo de carga a la mitad.
* **Clean Architecture:** Separación clara entre *Features*, *Hooks* y *Actions*.

---

## 🏗️ Arquitectura del Proyecto



```text
src/
├── app/               # Rutas, Layouts y Callbacks de Auth
├── components/        # Componentes compartidos (Logo, Button, etc.)
├── features/          # Arquitectura basada en dominios
│   ├── auth/          # Lógica de Login, Registro y Sesiones
│   ├── combinations/  # Hooks, Actions y Listas de combinaciones
│   └── groups/        # Gestión de categorías y grupos
├── lib/               # Utilidades y configuración de Supabase
└── proxy.ts      # El guardián de las rutas
```

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio:**
    ```
   
   git clone https://github.com/Dixon282005/Cifrax.git
    ```

  
**Instalar dependencias:**

 ```
npm install
Configurar Variables de Entorno: Crea un archivo .env.local en la raíz del proyecto y añade:
 ```

**Fragmento de código**
  ```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anon_de_supabase
NEXT_PUBLIC_SITE_URL=http://localhost:3000
 ```

**Correr en local:**
 ```
npm run dev
 ```

📈 Roadmap / Futuro del Proyecto
[ ] Análisis de Datos: Implementación de gráficas de tendencia con Chart.js.

[ ] Reportes: Exportación de reportes en PDF y Excel para auditorías.

[ ] Hardware: Integración con ESL (Electronic Shelf Labels) para retail en tiempo real.