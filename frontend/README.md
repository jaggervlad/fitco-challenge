# Sistema de Reservas - Frontend

Frontend de la plataforma de gestión de reservas desarrollado con Next.js 14, TypeScript y React Bootstrap.

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **UI/UX**: Bootstrap 5, React Bootstrap
- **Gestión de Estado**: React Context API (Auth)
- **Data Fetching**: SWR + Axios
- **Formularios**: React Hook Form
- **Fechas**: Moment.js
- **Notificaciones**: React Hot Toast
- **Íconos**: React Icons
- **Testing**: Jest, React Testing Library

## 📁 Estructura del Proyecto

```
src/
├── app/                          # App Router de Next.js
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Landing page
│   ├── template.tsx              # Template con providers
│   ├── auth/                     # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── providers/                # Listado de proveedores
│   ├── schedules/                # Horarios por proveedor
│   │   └── [providerId]/
│   └── dashboard/                # Dashboards protegidos
│       ├── client/               # Dashboard de cliente
│       └── provider/             # Dashboard de proveedor
├── modules/                      # Módulos de dominio
│   ├── auth/                     # Login, Register forms
│   ├── providers/
│   ├── schedules/
│   └── reservations/
├── components/                   # Componentes reutilizables
│   ├── common/                   # LoadingSpinner, ProtectedRoute
│   └── layout/                   # Navbar, Footer
├── services/                     # Servicios API
│   ├── api.ts                    # Instancia Axios + interceptors
│   ├── auth.service.ts
│   ├── providers.service.ts
│   ├── schedules.service.ts
│   └── reservations.service.ts
├── hooks/                        # Custom hooks
│   ├── useAuth.tsx               # Context de autenticación
│   └── useRole.ts                # Verificación de roles
├── types/                        # TypeScript interfaces
│   ├── auth.types.ts
│   ├── provider.types.ts
│   ├── schedule.types.ts
│   ├── reservation.types.ts
│   └── common.types.ts
├── utils/                        # Utilidades
│   ├── date.utils.ts             # Formateo de fechas
│   ├── role.utils.ts             # Helpers de roles
│   └── storage.utils.ts          # LocalStorage helpers
├── styles/                       # Estilos globales
│   └── globals.css
└── middleware.ts                 # Middleware de Next.js
```

## 🔧 Configuración Inicial

### 1. Instalar Dependencias

```bash
cd frontend
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm test` - Ejecuta los tests

## 🎨 Características Principales

### Autenticación

- Login y registro de usuarios
- Manejo de tokens JWT en localStorage
- Axios interceptor para Authorization header
- Context API para estado de autenticación
- Guards de rutas por rol

### Roles de Usuario

- **Admin**: Gestión completa del sistema
- **Provider**: Creación de horarios, vista de reservas
- **Client**: Creación de reservas, gestión de citas

### Vistas Públicas

- Landing page con información del sistema
- Listado de proveedores disponibles
- Vista de horarios con calendario
- Horarios completos mostrados pero deshabilitados

### Cliente

- Dashboard con mis reservas
- Crear nueva reserva
- Cancelar reserva existente
- Ver detalles de cada cita

### Proveedor

- Dashboard con estadísticas
- Crear horarios de disponibilidad
- Ver reservas por horario
- Gestión de capacidad

### Calendario y Horarios

- Horarios organizados por fecha y hora
- Indicador de capacidad restante
- Horarios sin cupo visibles pero sombreados
- Confirmación de reserva con modal

## 🔐 Autenticación y Autorización

### Token Storage

Los tokens se almacenan en localStorage y se agregan automáticamente a todas las peticiones mediante interceptors de Axios.

### Guards de Rutas

```tsx
// Proteger una ruta
<ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
  <ClientDashboard />
</ProtectedRoute>
```

### Middleware de Next.js

El archivo `middleware.ts` protege rutas a nivel de servidor antes de que se rendericen.

## 🌐 API Integration

### Configuración Base

```typescript
// services/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});
```

### Servicios Disponibles

- `authService` - Login, registro, perfil
- `providersService` - CRUD de proveedores
- `schedulesService` - Gestión de horarios
- `reservationsService` - Gestión de reservas

### Data Fetching con SWR

```typescript
const { data, error, isLoading, mutate } = useSWR("/providers", () =>
  providersService.getAll()
);
```

## 🎨 UI/UX

### Bootstrap Customization

Los estilos personalizados se encuentran en `src/styles/globals.css` con variables CSS para temas.

### Loading States

- Loader global con NProgress en cambios de ruta
- Skeleton loaders para vistas principales
- LoadingSpinner component reutilizable

### Notificaciones

React Hot Toast se usa para mostrar feedback al usuario:

```typescript
toast.success("Operación exitosa");
toast.error("Ha ocurrido un error");
```

### Manejo de Errores

Centralizado en el interceptor de Axios con mensajes específicos según código HTTP.

## 🧪 Testing

```bash
npm test
```

Testing con Jest y React Testing Library configurado para componentes React y hooks.

## 📦 Build para Producción

```bash
npm run build
npm start
```

El build optimizado estará listo en la carpeta `.next/`

## 🚀 Deployment

### Vercel (Recomendado)

```bash
vercel deploy
```

### Variables de Entorno en Producción

Asegúrate de configurar `NEXT_PUBLIC_API_URL` con la URL de tu API en producción.

## 📚 Buenas Prácticas Implementadas

- ✅ Separación clara por capas (app, modules, components, services)
- ✅ TypeScript strict mode
- ✅ Componentes reutilizables y modulares
- ✅ Custom hooks para lógica compartida
- ✅ Error boundaries y manejo de errores
- ✅ Responsive design con Bootstrap
- ✅ SEO-friendly con metadata de Next.js
- ✅ Code splitting automático con App Router
- ✅ Optimización de imágenes con next/image
- ✅ API routes para funcionalidades serverless

## 🔄 Flujo de Trabajo

### Cliente

1. Navegar a `/providers`
2. Seleccionar un proveedor
3. Ver horarios disponibles en `/schedules/[providerId]`
4. Crear reserva (requiere autenticación)
5. Ver mis reservas en `/dashboard/client`
6. Cancelar reserva si es necesario

### Proveedor

1. Login con cuenta de proveedor
2. Ir a `/dashboard/provider`
3. Crear nuevos horarios
4. Ver reservas por horario
5. Gestionar disponibilidad

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

Para preguntas o soporte, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ usando Next.js y TypeScript
