"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaClock, FaArrowLeft } from "react-icons/fa";
import { ProtectedRoute, LoadingSpinner } from "@/components/common";
import { UserRole } from "@/types";
import { useAuth, useSchedule, useUpdateSchedule } from "@/hooks";
import { mapServerValidationErrors } from "@/utils";
import Link from "next/link";

interface ScheduleFormData {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  status: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

function EditScheduleContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const scheduleId = parseInt(params.id as string);
  const serviceId = parseInt(searchParams.get("serviceId") || "0");

  const {
    schedule,
    isLoading: isFetching,
    isError,
  } = useSchedule({
    serviceId,
    scheduleId,
  });

  const { updateSchedule, isUpdating } = useUpdateSchedule();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<ScheduleFormData>({
    values: schedule
      ? {
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          capacity: schedule.capacity,
          status: schedule.status,
        }
      : undefined,
  });

  const onSubmit = async (data: ScheduleFormData) => {
    await updateSchedule({
      serviceId,
      scheduleId,
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        capacity: data.capacity,
        status: data.status,
      },
      onSuccess: () => {
        router.push(`/dashboard/provider/schedules?serviceId=${serviceId}`);
      },
      onError: (err) => {
        mapServerValidationErrors(err, setFormError, data);
      },
    });
  };

  if (isFetching) {
    return <LoadingSpinner fullScreen text="Cargando horario..." />;
  }

  if (isError || !schedule) {
    return (
      <Card className="text-center py-5">
        <Card.Body>
          <h4>Horario no encontrado</h4>
          <p className="text-muted mb-4">
            El horario que intentas editar no existe
          </p>
          <Link href="/dashboard/provider/schedules" passHref legacyBehavior>
            <Button variant="primary">Volver a horarios</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/provider/schedules"
        className="btn btn-link ps-0 mb-3"
      >
        <FaArrowLeft className="me-2" />
        Volver a horarios
      </Link>

      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <div className="mb-4">
            <h2 className="mb-2">
              <FaClock className="me-2 text-primary" />
              Editar Horario
            </h2>
            <p className="text-muted mb-0">Modifica los detalles del horario</p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Día de la Semana *</Form.Label>
              <Form.Select
                {...register("dayOfWeek", {
                  required: "El día de la semana es requerido",
                  valueAsNumber: true,
                })}
                isInvalid={!!errors.dayOfWeek}
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.dayOfWeek?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hora de Inicio *</Form.Label>
              <Form.Control
                type="time"
                {...register("startTime", {
                  required: "La hora de inicio es requerida",
                })}
                isInvalid={!!errors.startTime}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startTime?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hora de Fin *</Form.Label>
              <Form.Control
                type="time"
                {...register("endTime", {
                  required: "La hora de fin es requerida",
                })}
                isInvalid={!!errors.endTime}
              />
              <Form.Control.Feedback type="invalid">
                {errors.endTime?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacidad (número de reservas) *</Form.Label>
              <Form.Control
                type="number"
                placeholder="10"
                {...register("capacity", {
                  required: "La capacidad es requerida",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "La capacidad debe ser al menos 1",
                  },
                  max: {
                    value: 100,
                    message: "La capacidad no puede exceder 100",
                  },
                })}
                isInvalid={!!errors.capacity}
              />
              <Form.Control.Feedback type="invalid">
                {errors.capacity?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Número máximo de reservas que pueden hacerse en este horario
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado *</Form.Label>
              <Form.Select
                {...register("status", {
                  required: "El estado es requerido",
                })}
                isInvalid={!!errors.status}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.status?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Los horarios inactivos no estarán disponibles para reservas
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isUpdating}
                className="px-4"
              >
                {isUpdating ? "Actualizando..." : "Actualizar Horario"}
              </Button>
              <Link
                href="/dashboard/provider/schedules"
                passHref
                legacyBehavior
              >
                <Button variant="outline-secondary" disabled={isUpdating}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default function EditSchedulePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <EditScheduleContent />
    </ProtectedRoute>
  );
}
