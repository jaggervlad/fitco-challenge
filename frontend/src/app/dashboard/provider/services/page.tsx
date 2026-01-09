"use client";

import { Card, Row, Col, Button, Badge, Alert } from "react-bootstrap";
import {
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";
import { ProtectedRoute, LoadingSpinner } from "@/components/common";
import { UserRole } from "@/types";
import { useAuth, useServices } from "@/hooks";
import Link from "next/link";

function ServicesPageContent() {
  const { user } = useAuth();
  const providerId = user?.id;

  const { services, isLoading, isError, deleteService } = useServices({
    providerId,
  });

  const handleDelete = async (serviceId: number) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      try {
        await deleteService(serviceId);
      } catch (error) {
        // El error ya fue manejado en el hook
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando servicios..." />;
  }

  if (isError) {
    return (
      <Alert variant="danger">
        Error al cargar los servicios. Por favor, intenta de nuevo.
      </Alert>
    );
  }

  if (!providerId) {
    return (
      <Alert variant="warning">No se pudo obtener el ID del proveedor.</Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">Mis Servicios</h2>
          <p className="text-muted mb-0">Gestiona los servicios que ofreces</p>
        </div>
        <Link
          href="/dashboard/provider/services/create"
          passHref
          legacyBehavior
        >
          <Button variant="primary">
            <FaPlus className="me-2" />
            Crear Servicio
          </Button>
        </Link>
      </div>

      {!services || services.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FaBriefcase size={80} className="text-muted mb-3" />
            <h4>No tienes servicios creados</h4>
            <p className="text-muted mb-4">
              Comienza creando tu primer servicio para que los clientes puedan
              reservar
            </p>
            <Link
              href="/dashboard/provider/services/create"
              passHref
              legacyBehavior
            >
              <Button variant="primary">
                <FaPlus className="me-2" />
                Crear Primer Servicio
              </Button>
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {services.map((service) => (
            <Col key={service.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="bg-primary bg-opacity-10 rounded p-2">
                      <FaBriefcase size={24} className="text-primary" />
                    </div>
                    <Badge bg="success">Activo</Badge>
                  </div>

                  <h5 className="mb-2">{service.name}</h5>
                  <p className="text-muted small mb-3">{service.description}</p>

                  <div className="mb-2">
                    <strong className="text-muted small">Duración:</strong>
                    <span className="ms-2">{service.durationMinutes} min</span>
                  </div>

                  <div className="mb-3">
                    <strong className="text-muted small">Precio:</strong>
                    <span className="ms-2 text-success fw-bold">
                      ${service.price}
                    </span>
                  </div>

                  <div className="mb-3 pb-3 border-bottom">
                    <small className="text-muted">
                      Creado el{" "}
                      {new Date(service.createdAt).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      href={`/dashboard/provider/services/${service.id}/schedules`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="flex-grow-1"
                      >
                        <FaCalendarAlt className="me-1" />
                        Horarios
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/provider/services/${service.id}/edit`}
                      passHref
                      legacyBehavior
                    >
                      <Button variant="outline-secondary" size="sm">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.PROVIDER]}>
      <ServicesPageContent />
    </ProtectedRoute>
  );
}
