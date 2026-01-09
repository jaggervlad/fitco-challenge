"use client";

import { Container, Row, Col } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container fluid>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Sistema de Reservas</h5>
            <p className="text-muted">
              Plataforma de gestión de citas y reservas para profesionales.
            </p>
          </Col>

          <Col md={4} className="mb-3 mb-md-0">
            <h5>Enlaces</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-muted text-decoration-none">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted text-decoration-none">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted text-decoration-none">
                  Privacidad
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5>Síguenos</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-light">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-light">
                <FaTwitter size={24} />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-4 bg-secondary" />

        <Row>
          <Col className="text-center text-muted">
            <small>
              &copy; {currentYear} Sistema de Reservas. Todos los derechos
              reservados.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
