"use client";

import { useRouter } from "next/navigation";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useForm, useFieldArray } from "react-hook-form";
import { FaClock, FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { ProtectedRoute, LoadingSpinner } from "@/components/common";
import { UserRole } from "@/types";
import { useAuth, useCreateSchedule, useServices } from "@/hooks";
import { mapServerValidationErrors } from "@/utils";
import Link from "next/link";

interface ScheduleItem {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
}

interface ScheduleFormData {
  serviceId: number;
  schedules: ScheduleItem[];
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

function CreateScheduleContent() {
  const router = useRouter();
  const { user } = useAuth();
  const providerId = user?.id as number;

  const { services, isLoading: isLoadingServices } = useServices({
    providerId,
  });
  const { createSchedule, isCreating } = useCreateSchedule();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError: setFormError,
  } = useForm<ScheduleFormData>({
    defaultValues: {
      schedules: [
        {
          dayOfWeek: 1,
          startTime: "",
          endTime: "",
          capacity: 10,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const onSubmit = async (data: ScheduleFormData) => {
    await createSchedule({
      serviceId: data.serviceId,
      data: {
        schedules: data.schedules,
      },
      onSuccess: () => {
        router.push(
          `/dashboard/provider/schedules?serviceId=${data.serviceId}`
        );
      },
      onError: (err) => {
        mapServerValidationErrors(err, setFormError, data);
      },
    });
  };

  if (isLoadingServices) {
    return <LoadingSpinner fullScreen text="Cargando servicios..." />;
  }

  if (!services || services.length === 0) {
    return (
      <Card className="text-center py-5">
        <Card.Body>
          <h4>No tienes servicios creados</h4>
          <p className="text-muted mb-4">
            Necesitas crear al menos un servicio antes de poder crear horarios
          </p>
          <Link
            href="/dashboard/provider/services/create"
            passHref
            legacyBehavior
          >
            <Button variant="primary">Crear Servicio</Button>
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
              Crear Nuevos Horarios
            </h2>
            <p className="text-muted mb-0">
              Define múltiples horarios disponibles para tu servicio
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
              <Form.Label>Servicio *</Form.Label>
              <Form.Select
                {...register("serviceId", {
                  required: "El servicio es requerido",
                  valueAsNumber: true,
                })}
                isInvalid={!!errors.serviceId}
              >
                <option value="">Selecciona un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.serviceId?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Horarios</h5>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() =>
                  append({
                    dayOfWeek: 1,
                    startTime: "",
                    endTime: "",
                    capacity: 10,
                  })
                }
              >
                <FaPlus className="me-2" />
                Agregar Horario
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Horario #{index + 1}</h6>
                    {fields.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Día de la Semana *</Form.Label>
                        <Form.Select
                          {...register(`schedules.${index}.dayOfWeek`, {
                            required: "El día de la semana es requerido",
                            valueAsNumber: true,
                          })}
                          isInvalid={!!errors.schedules?.[index]?.dayOfWeek}
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.schedules?.[index]?.dayOfWeek?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Capacidad *</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="10"
                          {...register(`schedules.${index}.capacity`, {
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
                          isInvalid={!!errors.schedules?.[index]?.capacity}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.schedules?.[index]?.capacity?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hora de Inicio *</Form.Label>
                        <Form.Control
                          type="time"
                          {...register(`schedules.${index}.startTime`, {
                            required: "La hora de inicio es requerida",
                          })}
                          isInvalid={!!errors.schedules?.[index]?.startTime}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.schedules?.[index]?.startTime?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hora de Fin *</Form.Label>
                        <Form.Control
                          type="time"
                          {...register(`schedules.${index}.endTime`, {
                            required: "La hora de fin es requerida",
                          })}
                          isInvalid={!!errors.schedules?.[index]?.endTime}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.schedules?.[index]?.endTime?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isCreating}
                className="px-4"
              >
                {isCreating
                  ? "Creando..."
                  : `Crear ${fields.length} Horario${
                      fields.length > 1 ? "s" : ""
                    }`}
              </Button>
              <Link
                href="/dashboard/provider/schedules"
                passHref
                legacyBehavior
              >
                <Button variant="outline-secondary" disabled={isCreating}>
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

export default function CreateSchedulePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <CreateScheduleContent />
    </ProtectedRoute>
  );
}
