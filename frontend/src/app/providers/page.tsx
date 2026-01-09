"use client";

import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import { FaUserMd, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import useSWR from "swr";
import { providersService } from "@/services";
import { LoadingSpinner } from "@/components/common";
import { Provider } from "@/types";

export default function ProvidersPage() {
  const {
    data: providers,
    error,
    isLoading,
  } = useSWR<Provider[]>("/providers", () => providersService.getAll());

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando proveedores..." />;
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">
          Error al cargar los proveedores. Por favor, intenta de nuevo.
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="mb-3">Nuestros Proveedores</h1>
        <p className="text-muted lead">
          Encuentra el profesional perfecto para tus necesidades
        </p>
      </div>

      {providers && providers.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FaUserMd size={80} className="text-muted mb-3" />
            <h3>No hay proveedores disponibles</h3>
            <p className="text-muted">
              Vuelve más tarde para ver los proveedores disponibles
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {providers?.map((provider) => (
            <Col key={provider._id} md={6} lg={4}>
              <Card className="h-100 shadow-sm hover-shadow transition">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex align-items-start mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <FaUserMd size={30} className="text-primary" />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">
                        {provider.user?.name || "Proveedor"}
                      </h5>
                      <Badge bg={provider.available ? "success" : "secondary"}>
                        {provider.available ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong className="text-muted small">Especialidad:</strong>
                    <p className="mb-0">{provider.specialty}</p>
                  </div>

                  {provider.description && (
                    <div className="mb-3">
                      <p className="text-muted small mb-0 text-truncate-2">
                        {provider.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Link
                      href={`/schedules/${provider._id}`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="primary"
                        className="w-100"
                        disabled={!provider.available}
                      >
                        Ver Horarios <FaArrowRight className="ms-2" />
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
