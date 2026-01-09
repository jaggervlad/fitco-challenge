"use client";

import { Card, Row, Col, Button, Form, Badge } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaBriefcase,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";
import { ProtectedRoute, LoadingSpinner } from "@/components/common";
import { useAuth, useRole } from "@/hooks";
import { UserRole } from "@/types";

function ProfilePageContent() {
  const { user, isLoading } = useAuth();
  const { isProvider, isClient } = useRole();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando perfil..." />;
  }

  if (!user) {
    return null;
  }

  // Mock data para el perfil
  const mockProviderProfile = {
    description:
      "Entrenador personal certificado con más de 10 años de experiencia. Especializado en entrenamiento funcional y nutrición deportiva.",
    phone: "+34 612 345 678",
    address: "Calle Mayor 123, Madrid",
    specialties: [
      "Entrenamiento Funcional",
      "Nutrición Deportiva",
      "Rehabilitación",
    ],
    rating: 4.8,
    totalReservations: 156,
    memberSince: "Enero 2024",
  };

  const mockClientProfile = {
    phone: "+34 687 654 321",
    address: "Avenida Principal 456, Barcelona",
    preferences: ["Yoga", "Pilates", "Meditación"],
    totalReservations: 23,
    memberSince: "Marzo 2024",
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">Mi Perfil</h2>
          <p className="text-muted mb-0">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        <Button variant="primary">
          <FaEdit className="me-2" />
          Editar Perfil
        </Button>
      </div>

      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div
                className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "120px", height: "120px" }}
              >
                <FaUser size={60} className="text-white" />
              </div>
              <h4 className="mb-1">{user.name}</h4>
              <p className="text-muted mb-3">{user.email}</p>
              <Badge bg="info" className="mb-3">
                {user.role === UserRole.PROVIDER
                  ? "Proveedor"
                  : user.role === UserRole.CLIENT
                  ? "Cliente"
                  : "Administrador"}
              </Badge>
              {isProvider && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-around">
                    <div>
                      <h5 className="mb-0">
                        {mockProviderProfile.totalReservations}
                      </h5>
                      <small className="text-muted">Reservas</small>
                    </div>
                    <div>
                      <h5 className="mb-0 d-flex align-items-center">
                        <FaStar className="text-warning me-1" />
                        {mockProviderProfile.rating}
                      </h5>
                      <small className="text-muted">Valoración</small>
                    </div>
                  </div>
                </div>
              )}
              {isClient && (
                <div className="mt-3 pt-3 border-top">
                  <h5 className="mb-0">
                    {mockClientProfile.totalReservations}
                  </h5>
                  <small className="text-muted">Reservas Realizadas</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {isProvider && (
            <>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3">
                    <FaBriefcase className="me-2 text-primary" />
                    Información Profesional
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Descripción</Form.Label>
                    <p className="text-muted">
                      {mockProviderProfile.description}
                    </p>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Especialidades</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {mockProviderProfile.specialties.map((specialty) => (
                        <Badge key={specialty} bg="secondary" pill>
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">
                    <FaUser className="me-2 text-primary" />
                    Información de Contacto
                  </h5>
                  <div className="mb-3">
                    <FaEnvelope className="me-2 text-primary" />
                    <strong>Email:</strong>
                    <span className="ms-2">{user.email}</span>
                  </div>
                  <div className="mb-3">
                    <FaPhone className="me-2 text-primary" />
                    <strong>Teléfono:</strong>
                    <span className="ms-2">{mockProviderProfile.phone}</span>
                  </div>
                  <div className="mb-3">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    <strong>Dirección:</strong>
                    <span className="ms-2">{mockProviderProfile.address}</span>
                  </div>
                  <div>
                    <FaCalendarAlt className="me-2 text-primary" />
                    <strong>Miembro desde:</strong>
                    <span className="ms-2">
                      {mockProviderProfile.memberSince}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}

          {isClient && (
            <>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3">
                    <FaUser className="me-2 text-primary" />
                    Información Personal
                  </h5>
                  <div className="mb-3">
                    <FaEnvelope className="me-2 text-primary" />
                    <strong>Email:</strong>
                    <span className="ms-2">{user.email}</span>
                  </div>
                  <div className="mb-3">
                    <FaPhone className="me-2 text-primary" />
                    <strong>Teléfono:</strong>
                    <span className="ms-2">{mockClientProfile.phone}</span>
                  </div>
                  <div className="mb-3">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    <strong>Dirección:</strong>
                    <span className="ms-2">{mockClientProfile.address}</span>
                  </div>
                  <div>
                    <FaCalendarAlt className="me-2 text-primary" />
                    <strong>Miembro desde:</strong>
                    <span className="ms-2">
                      {mockClientProfile.memberSince}
                    </span>
                  </div>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">
                    <FaBriefcase className="me-2 text-primary" />
                    Preferencias
                  </h5>
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      Servicios de Interés
                    </Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {mockClientProfile.preferences.map((preference) => (
                        <Badge key={preference} bg="secondary" pill>
                          {preference}
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT, UserRole.PROVIDER]}>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
