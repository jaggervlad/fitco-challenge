"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import {
  FaSearch,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
} from "react-icons/fa";
import { ProtectedRoute } from "@/components/common";
import { UserRole } from "@/types";
import Link from "next/link";
import { useAllServices } from "@/hooks";

function ServicesPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { services, isLoading } = useAllServices();

  const categories = ["Todos"];

  const filteredServices = (services || []).filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2 className="mb-2">
          <FaSearch className="me-2" />
          Servicios Disponibles
        </h2>
        <p className="text-muted mb-0">
          Explora y reserva los servicios de nuestros proveedores
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por servicio o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Servicios */}
      <Row className="g-4">
        {isLoading ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando servicios...</p>
              </Card.Body>
            </Card>
          </Col>
        ) : filteredServices.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <FaSearch size={80} className="text-muted mb-3" />
                <h4>No se encontraron servicios</h4>
                <p className="text-muted">
                  Intenta con otros términos de búsqueda
                </p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          filteredServices.map((service) => (
            <Col key={service.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm hover-shadow">
                <div
                  className="bg-gradient position-relative"
                  style={{
                    height: "150px",
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                    backgroundImage: `url(https://placehold.co/600x300/667eea/ffffff?text=${encodeURIComponent(
                      service.name
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className="position-absolute w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)",
                    }}
                  />
                </div>
                <Card.Body>
                  <h5 className="mb-3">{service.name}</h5>

                  <p className="text-muted small mb-3">{service.description}</p>

                  <div className="mb-2">
                    <FaClock className="text-primary me-2" />
                    <small>Duración: {service.durationMinutes} minutos</small>
                  </div>

                  <div className="mb-3">
                    <FaDollarSign className="text-success me-2" />
                    <strong className="text-success">${service.price}</strong>
                    <small className="text-muted"> / sesión</small>
                  </div>

                  <div className="d-grid">
                    <Link
                      href={`/dashboard/client/services/${service.id}`}
                      passHref
                      legacyBehavior
                    >
                      <Button variant="primary">
                        <FaCalendarAlt className="me-2" />
                        Ver Horarios
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default function ServicesPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
      <ServicesPageContent />
    </ProtectedRoute>
  );
}
