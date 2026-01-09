# FitCo - Plataforma de Gestión de Servicios y Reservas

## 📋 Descripción General

FitCo es una plataforma web integral que conecta proveedores de servicios con clientes, permitiendo la gestión completa de servicios, horarios y reservas. El sistema está diseñado para facilitar la administración de citas y la interacción entre profesionales de la salud, fitness, bienestar y sus clientes.

## ✨ Características Principales

### Para Proveedores de Servicios

- **Gestión de Servicios**: Crear y administrar múltiples servicios con descripciones, duración y precios
- **Control de Horarios**: Configurar disponibilidad por días y franjas horarias
- **Estado de Horarios**: Activar, desactivar o cancelar horarios según necesidad
- **Gestión de Reservas**: Visualizar todas las reservas de sus servicios
- **Flujo de Estados**: Confirmar reservas pendientes y marcar como atendidas
- **Capacidad**: Definir cupos disponibles para cada horario

### Para Clientes

- **Exploración de Servicios**: Navegar por servicios disponibles con filtros y búsqueda
- **Reserva Fácil**: Seleccionar horarios disponibles y realizar reservas
- **Seguimiento**: Ver el estado de todas sus reservas
- **Información del Proveedor**: Acceder a detalles y especialidades de cada proveedor

### Para Administradores

- **Vista General**: Acceso completo a toda la información del sistema
- **Gestión de Usuarios**: Administrar proveedores y clientes
- **Supervisión**: Monitorear actividad de servicios y reservas

## 👥 Tipos de Usuario

### 🔐 Administrador

- Control total del sistema
- Gestión de usuarios y servicios
- Acceso a reportes y estadísticas

### 👨‍💼 Proveedor

- Gestión de sus propios servicios
- Control de horarios y disponibilidad
- Administración de reservas de clientes

### 👥 Cliente

- Búsqueda y reserva de servicios
- Seguimiento de sus citas
- Acceso a información de proveedores

## 🚀 Estados del Sistema

### Estados de Reserva

- **Pendiente**: Reserva creada, esperando confirmación
- **Confirmada**: Proveedor confirmó la reserva
- **Atendida**: Servicio completado
- **Cancelada**: Reserva cancelada por alguna de las partes
- **No Show**: Cliente no se presentó a la cita

### Estados de Horario

- **Activo**: Disponible para nuevas reservas
- **Inactivo**: Temporalmente no disponible
- **Cancelado**: Cancelado permanentemente

## 🔑 Credenciales de Desarrollo

Para acceder al sistema con datos de prueba:

```
Administrador:
📧 Email: admin@fitco.com
🔒 Password: Admin123!

Proveedor:
📧 Email: provider@fitco.com
🔒 Password: Provider123!

Cliente:
📧 Email: client@fitco.com
🔒 Password: Client123!
```

## 📊 Datos de Prueba

El sistema incluye datos de ejemplo:

- **71 usuarios** (1 admin, 20 proveedores, 50 clientes)
- **62 servicios** variados
- **740 horarios** distribuidos
- **25 reservas** de ejemplo entre cliente y proveedor fijos

## 🏗️ Estructura del Proyecto

```
fitco-challenge/
├── backend/          # API y lógica del servidor
├── frontend/         # Interfaz de usuario
└── docker-compose.yml # Configuración de base de datos
```

## 🎯 Funcionalidades Destacadas

### Validaciones Inteligentes

- Prevención de horarios duplicados
- Verificación de capacidad disponible
- Restricciones de cambio de estado según reservas activas
- Control de conflictos de horarios

### Gestión de Disponibilidad

- Horarios configurables por día de la semana
- Control de capacidad por horario
- Sistema de cupos y ocupación
- Estados de horario flexibles

### Flujo de Reservas

```
Cliente reserva → PENDIENTE
         ↓
Proveedor confirma → CONFIRMADA
         ↓
Servicio prestado → ATENDIDA
```

### Protecciones del Sistema

- No se pueden desactivar horarios con reservas activas
- Validación de duplicados al crear horarios
- Control de capacidad máxima por horario
- Prevención de modificaciones a reservas completadas

## 🔄 Flujos de Trabajo

### Proveedor Crea un Servicio

1. Ingresa como proveedor
2. Navega a "Mis Servicios"
3. Crea nuevo servicio con detalles
4. Configura horarios disponibles
5. Define capacidad para cada horario

### Cliente Realiza una Reserva

1. Ingresa como cliente
2. Explora servicios disponibles
3. Selecciona servicio de interés
4. Elige horario disponible
5. Confirma reserva

### Proveedor Gestiona Reservas

1. Ingresa como proveedor
2. Ve todas sus reservas
3. Confirma reservas pendientes
4. Marca como atendidas al completar servicio

## 📱 Áreas del Sistema

### Dashboard del Proveedor

- Vista de servicios propios
- Gestión de horarios
- Lista de reservas con acciones
- Filtros y búsqueda

### Dashboard del Cliente

- Catálogo de servicios
- Mis reservas
- Historial de citas

### Dashboard del Admin

- Vista general del sistema
- Gestión de usuarios
- Estadísticas globales

## 🛡️ Seguridad

- Autenticación JWT
- Control de acceso basado en roles
- Validación de permisos por endpoint
- Protección de datos sensibles

## 💡 Casos de Uso Principales

1. **Proveedor gestiona su agenda**: Crea servicios, define horarios y administra reservas
2. **Cliente busca y reserva**: Explora servicios, reserva citas y hace seguimiento
3. **Sistema previene conflictos**: Valida duplicados, capacidad y estados
4. **Flujo de confirmación**: Proveedor confirma y completa servicios reservados

## 📈 Escalabilidad

El sistema está diseñado para:

- Múltiples proveedores con diversos servicios
- Alto volumen de clientes y reservas
- Gestión eficiente de horarios complejos
- Datos históricos y reportes

## 🎓 Tipos de Servicios Soportados

- Servicios de salud (consultas médicas)
- Fitness y entrenamiento personal
- Yoga y pilates
- Nutrición y coaching
- Fisioterapia y quiropráctica
- Terapia y psicología
- Masajes y bienestar

---

**Nota**: Este es un sistema de gestión completo que permite la operación de un negocio de servicios con múltiples proveedores, ofreciendo control total sobre disponibilidad, capacidad y estado de reservas.
