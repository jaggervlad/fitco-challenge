"use client";
import Link from "next/link";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaUserMd,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Gestiona tus Reservas de Forma Simple
              </h1>
              <p className="lead mb-4">
                Reserva citas médicas, servicios de peluquería o salas de
                reunión de manera rápida y eficiente. Todo en un solo lugar.
              </p>
              <div className="d-flex gap-3">
                <Link href="/providers" passHref legacyBehavior>
                  <Button variant="light" size="lg">
                    Ver Proveedores
                  </Button>
                </Link>
                <Link href="/auth/register" passHref legacyBehavior>
                  <Button variant="outline-light" size="lg">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <FaCalendarAlt size={200} className="text-white opacity-75" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container className="py-5">
          <h2 className="text-center mb-5">¿Por qué elegirnos?</h2>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <FaCalendarAlt size={50} className="text-primary mb-3" />
                  <Card.Title>Reservas Fáciles</Card.Title>
                  <Card.Text className="text-muted">
                    Reserva en segundos con nuestro sistema intuitivo
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <FaUserMd size={50} className="text-primary mb-3" />
                  <Card.Title>Múltiples Servicios</Card.Title>
                  <Card.Text className="text-muted">
                    Médicos, peluquerías, salas y más en un solo lugar
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <FaClock size={50} className="text-primary mb-3" />
                  <Card.Title>Tiempo Real</Card.Title>
                  <Card.Text className="text-muted">
                    Disponibilidad actualizada al instante
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm text-center p-4">
                <Card.Body>
                  <FaCheckCircle size={50} className="text-primary mb-3" />
                  <Card.Title>Confirmación Rápida</Card.Title>
                  <Card.Text className="text-muted">
                    Confirmación inmediata de tu reserva
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <Container className="py-5 text-center">
          <h2 className="mb-4">¿Listo para comenzar?</h2>
          <p className="lead text-muted mb-4">
            Únete a miles de usuarios que ya confían en nosotros
          </p>
          <Link href="/auth/register" passHref legacyBehavior>
            <Button variant="primary" size="lg">
              Crear Cuenta Gratis
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}
