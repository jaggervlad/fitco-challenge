import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRepository } from './users/infrastructure/repositories/user.repository';
import { ServiceRepository } from './services/infrastructure/persistence/service.repository';
import { ScheduleRepository } from './schedules/infrastructure/persistence/schedule.repository';
import { ReservationRepository } from './reservations/infrastructure/persistence/reservation.repository';
import { AuthService } from './auth/auth.service';
import { USER_REPOSITORY } from './users/domain/repositories/user.repository.interface';
import { SERVICE_REPOSITORY } from './services/domain/repositories/service.repository.interface';
import { SCHEDULE_REPOSITORY } from './schedules/domain/repositories/schedule.repository.interface';
import { RESERVATION_REPOSITORY } from './reservations/domain/repositories/reservation.repository.interface';
import {
  User,
  UserRole,
  UserStatus,
} from './users/domain/entities/user.entity';
import { Service } from './services/domain/entities/service.entity';
import {
  Schedule,
  ScheduleStatus,
} from './schedules/domain/entities/schedule.entity';
import {
  Reservation,
  ReservationStatus,
} from './reservations/domain/entities/reservation.entity';
import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<UserRepository>(USER_REPOSITORY);
  const serviceRepository = app.get<ServiceRepository>(SERVICE_REPOSITORY);
  const scheduleRepository = app.get<ScheduleRepository>(SCHEDULE_REPOSITORY);
  const reservationRepository = app.get<ReservationRepository>(
    RESERVATION_REPOSITORY,
  );
  const authService = app.get<AuthService>(AuthService);

  console.log('🌱 Starting comprehensive database seeding...\n');

  try {
    // Arrays para almacenar los IDs creados
    const providerIds: number[] = [];
    const clientIds: number[] = [];
    const serviceIds: number[] = [];
    let fixedProviderId: number | undefined;
    let fixedClientId: number | undefined;
    const fixedProviderServiceIds: number[] = [];
    let adminUser = await userRepository.findByEmail('admin@fitco.com');
    if (!adminUser) {
      const hashedPassword = await authService.hashPassword('Admin123!');
      const user = new User(
        0,
        'Admin System',
        'admin@fitco.com',
        hashedPassword,
        '+34 600 000 000',
        UserRole.ADMIN,
        UserStatus.ACTIVE,
        new Date(),
        new Date(),
      );
      adminUser = await userRepository.create(user);
      console.log('   ✓ Admin user created');
    } else {
      console.log('   → Admin user already exists');
    }

    // 2. Crear múltiples proveedores
    console.log('\n👨‍💼 Creating provider users...');

    // USUARIOS FIJOS PARA DESARROLLO
    const fixedProviders = [
      {
        name: 'Dr. Juan Pérez',
        email: 'provider@fitco.com',
        specialty: 'Medicina General',
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@fitco.com',
        specialty: 'Instructor de Yoga',
      },
      {
        name: 'Carlos López',
        email: 'carlos.lopez@fitco.com',
        specialty: 'Fisioterapeuta',
      },
    ];

    // Proveedores adicionales (no cambiar emails de los fijos)
    const additionalProviders = [
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@fitco.com',
        specialty: 'Entrenador Personal',
      },
      {
        name: 'Laura Ramírez',
        email: 'laura.ramirez@fitco.com',
        specialty: 'Nutricionista',
      },
      {
        name: 'Sofía Torres',
        email: 'sofia.torres@fitco.com',
        specialty: 'Instructor de Pilates',
      },
      {
        name: 'Diego Fernández',
        email: 'diego.fernandez@fitco.com',
        specialty: 'Quiropráctico',
      },
      {
        name: 'Carmen Ruiz',
        email: 'carmen.ruiz@fitco.com',
        specialty: 'Psicólogo',
      },
    ];

    const providerData = [...fixedProviders, ...additionalProviders];

    // Generar 12 proveedores adicionales usando faker
    for (let i = 0; i < 12; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@fitco.com`;

      providerData.push({
        name,
        email,
        specialty: faker.helpers.arrayElement([
          'Medicina General',
          'Instructor de Yoga',
          'Fisioterapeuta',
          'Entrenador Personal',
          'Nutricionista',
          'Instructor de Pilates',
          'Quiropráctico',
          'Psicólogo',
          'Terapeuta',
          'Coach Deportivo',
        ]),
      });
    }

    for (let index = 0; index < providerData.length; index++) {
      const provider = providerData[index];
      let providerUser = await userRepository.findByEmail(provider.email);
      if (!providerUser) {
        const hashedPassword = await authService.hashPassword('Provider123!');
        const user = new User(
          0,
          provider.name,
          provider.email,
          hashedPassword,
          '+34 ' + faker.string.numeric(9),
          UserRole.PROVIDER,
          UserStatus.ACTIVE,
          new Date(),
          new Date(),
        );
        providerUser = await userRepository.create(user);
        providerIds.push(providerUser.id);
        if (index === 0) fixedProviderId = providerUser.id;
        console.log(`   ✓ Provider created: ${provider.name}`);
      } else {
        providerIds.push(providerUser.id);
        if (index === 0) fixedProviderId = providerUser.id;
        console.log(`   → Provider already exists: ${provider.name}`);
      }
    }

    // 3. Crear múltiples clientes
    console.log('\n👥 Creating client users...');

    // USUARIO CLIENTE FIJO PARA DESARROLLO
    const fixedClients = [
      'Pedro Sánchez', // client@fitco.com
    ];

    // Clientes adicionales predefinidos
    const additionalClients = [
      'Lucía Hernández',
      'Roberto Jiménez',
      'Isabel Castro',
      'Miguel Ángel Ortiz',
      'Elena Moreno',
      'Francisco Romero',
      'Patricia Navarro',
      'Javier Díaz',
      'Cristina Álvarez',
      'Antonio Muñoz',
      'Rosa García',
      'Manuel Torres',
      'Teresa Gil',
      'Sergio Vázquez',
    ];

    const clientNames = [...fixedClients, ...additionalClients];

    // Generar 35 clientes adicionales usando faker (total 51 clientes)
    for (let i = 0; i < 35; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      clientNames.push(`${firstName} ${lastName}`);
    }

    for (let index = 0; index < clientNames.length; index++) {
      const name = clientNames[index];
      // El primer cliente usa email fijo "client@fitco.com"
      const email =
        index === 0
          ? 'client@fitco.com'
          : name
              .toLowerCase()
              .replace(/\s+/g, '.')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') + '@client.com';

      let clientUser = await userRepository.findByEmail(email);
      if (!clientUser) {
        const hashedPassword = await authService.hashPassword('Client123!');
        const user = new User(
          0,
          name,
          email,
          hashedPassword,
          '+34 ' + faker.string.numeric(9),
          UserRole.CLIENT,
          UserStatus.ACTIVE,
          new Date(),
          new Date(),
        );
        clientUser = await userRepository.create(user);
        clientIds.push(clientUser.id);
        if (index === 0) fixedClientId = clientUser.id;
        console.log(`   ✓ Client created: ${name}`);
      } else {
        clientIds.push(clientUser.id);
        if (index === 0) fixedClientId = clientUser.id;
        console.log(`   → Client already exists: ${name}`);
      }
    }

    // 4. Crear servicios para cada proveedor
    console.log('\n🏥 Creating services...');
    const serviceTemplates = [
      // Servicios de salud
      {
        names: [
          'Consulta General',
          'Chequeo Médico',
          'Consulta de Seguimiento',
        ],
        descriptions: [
          'Evaluación médica completa del estado de salud',
          'Revisión médica general y diagnóstico',
          'Seguimiento médico y revisión de tratamientos',
        ],
        durations: [30, 45],
        prices: [40, 50, 60],
      },
      // Servicios de fitness
      {
        names: [
          'Yoga Principiantes',
          'Yoga Intermedio',
          'Yoga Avanzado',
          'Hatha Yoga',
        ],
        descriptions: [
          'Clase de yoga enfocada en posturas básicas y respiración',
          'Yoga para nivel intermedio con posturas más avanzadas',
          'Sesiones avanzadas de yoga con técnicas complejas',
          'Práctica tradicional de Hatha Yoga',
        ],
        durations: [60, 75],
        prices: [20, 25, 30],
      },
      {
        names: [
          'Entrenamiento Personal',
          'Entrenamiento Funcional',
          'Entrenamiento HIIT',
        ],
        descriptions: [
          'Sesión personalizada de entrenamiento físico adaptado',
          'Entrenamiento funcional para mejorar rendimiento',
          'Entrenamiento de alta intensidad por intervalos',
        ],
        durations: [45, 60],
        prices: [30, 35, 40],
      },
      // Servicios de bienestar
      {
        names: ['Masaje Deportivo', 'Masaje Relajante', 'Masaje Terapéutico'],
        descriptions: [
          'Masaje especializado para deportistas y recuperación muscular',
          'Masaje relajante para reducir estrés y tensión',
          'Masaje terapéutico para alivio de dolores',
        ],
        durations: [45, 60],
        prices: [35, 40, 45],
      },
      {
        names: ['Pilates Mat', 'Pilates Reformer', 'Pilates Avanzado'],
        descriptions: [
          'Clase de pilates en suelo con enfoque en core',
          'Pilates con máquinas para mayor resistencia',
          'Pilates nivel avanzado con ejercicios complejos',
        ],
        durations: [50, 60],
        prices: [25, 30, 35],
      },
      {
        names: [
          'Consulta Nutricional',
          'Plan Alimenticio Personalizado',
          'Asesoría Nutricional',
        ],
        descriptions: [
          'Evaluación nutricional completa y recomendaciones',
          'Diseño de plan alimenticio adaptado a objetivos',
          'Asesoría continua sobre hábitos alimenticios',
        ],
        durations: [45, 60],
        prices: [40, 45, 50],
      },
      {
        names: [
          'Ajuste Quiropráctico',
          'Terapia Quiropráctica',
          'Consulta Quiropráctica',
        ],
        descriptions: [
          'Ajuste de columna y articulaciones',
          'Tratamiento quiropráctico completo',
          'Evaluación y diagnóstico quiropráctico',
        ],
        durations: [30, 45],
        prices: [45, 50, 55],
      },
      {
        names: [
          'Consulta Psicológica',
          'Terapia Individual',
          'Sesión de Coaching',
        ],
        descriptions: [
          'Consulta psicológica y evaluación inicial',
          'Sesión de terapia individual personalizada',
          'Coaching personal para alcanzar objetivos',
        ],
        durations: [50, 60],
        prices: [50, 60, 70],
      },
    ];

    let serviceCount = 0;
    for (const providerId of providerIds) {
      const template = serviceTemplates[serviceCount % serviceTemplates.length];
      // El provider fijo tendrá más servicios (8-10), los demás 2-4
      const isFixedProvider = providerId === fixedProviderId;
      const numServices = isFixedProvider
        ? faker.number.int({ min: 8, max: 10 })
        : faker.number.int({ min: 2, max: 4 });

      for (let i = 0; i < numServices; i++) {
        const name = faker.helpers.arrayElement(template.names);
        const description = faker.helpers.arrayElement(template.descriptions);
        const duration = faker.helpers.arrayElement(template.durations);
        const price = faker.helpers.arrayElement(template.prices);

        const service = Service.create({
          providerId,
          name,
          description,
          durationMinutes: duration,
          price,
        });

        const createdService = await serviceRepository.create(service);
        serviceIds.push(createdService.id);
        if (isFixedProvider) {
          fixedProviderServiceIds.push(createdService.id);
        }
        console.log(
          `   ✓ Service created: ${name} (Provider ID: ${providerId})`,
        );
      }
      serviceCount++;
    }

    // 5. Crear horarios para cada servicio
    console.log('\n📅 Creating schedules...');
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 = Domingo, 6 = Sábado
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '12:00', end: '13:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
      { start: '17:00', end: '18:00' },
      { start: '18:00', end: '19:00' },
      { start: '19:00', end: '20:00' },
    ];

    let scheduleCount = 0;
    for (const serviceId of serviceIds) {
      // Cada servicio tendrá horarios en 3-5 días diferentes
      const numDays = faker.number.int({ min: 3, max: 5 });
      const selectedDays = faker.helpers.arrayElements(
        daysOfWeek.filter((d) => d > 0 && d < 6), // Solo días laborables
        numDays,
      );

      const schedules: Partial<Schedule>[] = [];

      for (const day of selectedDays) {
        // Cada día tendrá 2-4 horarios
        const numSlots = faker.number.int({ min: 2, max: 4 });
        const selectedSlots = faker.helpers.arrayElements(timeSlots, numSlots);

        for (const slot of selectedSlots) {
          const capacity = faker.number.int({ min: 5, max: 15 });
          const reservationCounts = faker.number.int({
            min: 0,
            max: Math.floor(capacity * 0.6),
          }); // 0-60% ocupación

          schedules.push({
            serviceId,
            dayOfWeek: day,
            startTime: slot.start,
            endTime: slot.end,
            capacity,
            reservationCounts,
            status: ScheduleStatus.ACTIVE,
          });
        }
      }

      await scheduleRepository.createBulk(schedules);
      scheduleCount += schedules.length;
      console.log(
        `   ✓ Created ${schedules.length} schedules for service ID: ${serviceId}`,
      );
    }

    // 6. Crear reservas del cliente fijo en servicios del proveedor fijo
    console.log('\n📋 Creating reservations for fixed client...');
    let reservationCount = 0;

    // Obtener los horarios de los servicios del proveedor fijo
    const fixedProviderSchedules: Schedule[] = [];
    for (const serviceId of fixedProviderServiceIds) {
      const schedules = await scheduleRepository.findByServiceId(serviceId);
      fixedProviderSchedules.push(...schedules);
    }

    // Crear 15-25 reservas del cliente fijo en diferentes horarios
    const numReservations = faker.number.int({ min: 15, max: 25 });
    const selectedSchedules = faker.helpers.arrayElements(
      fixedProviderSchedules,
      Math.min(numReservations, fixedProviderSchedules.length),
    );

    const reservationStatuses = [
      ReservationStatus.PENDING,
      ReservationStatus.CONFIRMED,
      ReservationStatus.ATTENDED,
      ReservationStatus.CANCELLED,
    ];

    for (const schedule of selectedSchedules) {
      // Distribuir los estados de manera realista
      // 30% pending, 40% confirmed, 20% attended, 10% cancelled
      const rand = Math.random();
      let status: ReservationStatus;
      if (rand < 0.3) status = ReservationStatus.PENDING;
      else if (rand < 0.7) status = ReservationStatus.CONFIRMED;
      else if (rand < 0.9) status = ReservationStatus.ATTENDED;
      else status = ReservationStatus.CANCELLED;

      const reservation = Reservation.create({
        customerId: fixedClientId!,
        serviceId: schedule.serviceId,
        scheduleId: schedule.id,
        status,
        notes: '',
      });

      await reservationRepository.create(reservation);
      reservationCount++;

      // Actualizar el contador de reservas del schedule si no está cancelada
      if (status !== ReservationStatus.CANCELLED) {
        const newCount = schedule.reservationCounts + 1;
        await scheduleRepository.update(schedule.id, {
          reservationCounts: newCount,
        });
      }

      console.log(
        `   ✓ Reservation created: Client -> Service ${schedule.serviceId} (${status})`,
      );
    }

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - Users: ${1 + providerIds.length + clientIds.length}`);
    console.log(`     • Admin: 1`);
    console.log(`     • Providers: ${providerIds.length}`);
    console.log(`     • Clients: ${clientIds.length}`);
    console.log(`   - Services: ${serviceIds.length}`);
    console.log(
      `     • Fixed provider services: ${fixedProviderServiceIds.length}`,
    );
    console.log(`   - Schedules: ${scheduleCount}`);
    console.log(`   - Reservations: ${reservationCount}`);
    console.log('\n🔐 CREDENCIALES DE ACCESO RÁPIDO:');
    console.log('   ========================================');
    console.log('   👤 Admin:    admin@fitco.com / Admin123!');
    console.log('   👨‍💼 Provider: provider@fitco.com / Provider123!');
    console.log('   👥 Client:   client@fitco.com / Client123!');
    console.log('   ========================================');
    console.log(
      '\n💡 Todos los usuarios usan la misma contraseña según su rol',
    );
    console.log('💡 Providers: Provider123! | Clients: Client123!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();
