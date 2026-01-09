"use client";

import { useRouter, useParams } from "next/navigation";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { ProtectedRoute, LoadingSpinner } from "@/components/common";
import { UserRole } from "@/types";
import { useAuth, useService, useUpdateService } from "@/hooks";
import { mapServerValidationErrors } from "@/utils";
import Link from "next/link";

interface ServiceFormData {
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

function EditServiceContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const serviceId = parseInt(params.id as string);
  const providerId = user?.id as number;

  const {
    service,
    isLoading: isFetching,
    isError,
  } = useService({
    providerId,
    serviceId,
  });

  const { updateService, isUpdating } = useUpdateService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<ServiceFormData>({
    values: service
      ? {
          name: service.name,
          description: service.description,
          durationMinutes: service.durationMinutes,
          price: service.price,
        }
      : undefined,
  });

  const onSubmit = async (data: ServiceFormData) => {
    await updateService({
      providerId,
      serviceId,
      data: {
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes,
        price: data.price,
      },
      onSuccess: () => {
        router.push("/dashboard/provider/services");
      },
      onError: (err) => {
        mapServerValidationErrors(err, setFormError, data);
      },
    });
  };

  if (isFetching) {
    return <LoadingSpinner fullScreen text="Cargando servicio..." />;
  }

  if (isError) {
    return (
      <Alert variant="danger">
        Error al cargar el servicio. Por favor, intenta de nuevo.
      </Alert>
    );
  }

  if (!service) {
    return <Alert variant="warning">Servicio no encontrado.</Alert>;
  }

  return (
    <div>
      <Link
        href="/dashboard/provider/services"
        className="btn btn-link ps-0 mb-3"
      >
        <FaArrowLeft className="me-2" />
        Volver a servicios
      </Link>

      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <div className="mb-4">
            <h2 className="mb-2">
              <FaBriefcase className="me-2 text-primary" />
              Editar Servicio
            </h2>
            <p className="text-muted mb-0">
              Actualiza los detalles de tu servicio
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Servicio *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Consulta General, Corte de Cabello, Sala de Reuniones"
                {...register("name", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres",
                  },
                })}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe tu servicio..."
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Máximo 500 caracteres",
                  },
                })}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Ayuda a los clientes a entender qué ofreces
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duración (minutos) *</Form.Label>
              <Form.Control
                type="number"
                placeholder="30"
                {...register("durationMinutes", {
                  required: "La duración es requerida",
                  valueAsNumber: true,
                  min: {
                    value: 15,
                    message: "Mínimo 15 minutos",
                  },
                  max: {
                    value: 480,
                    message: "Máximo 8 horas (480 minutos)",
                  },
                })}
                isInvalid={!!errors.durationMinutes}
              />
              <Form.Control.Feedback type="invalid">
                {errors.durationMinutes?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio (USD) *</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="50.00"
                {...register("price", {
                  required: "El precio es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El precio debe ser mayor o igual a 0",
                  },
                })}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={isUpdating}
                className="px-4"
              >
                {isUpdating ? "Actualizando..." : "Actualizar Servicio"}
              </Button>
              <Link href="/dashboard/provider/services" passHref legacyBehavior>
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

export default function EditServicePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <EditServiceContent />
    </ProtectedRoute>
  );
}
