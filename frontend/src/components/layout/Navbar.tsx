"use client";

import Link from "next/link";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { useAuth, useRole } from "@/hooks";
import { FaUser, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin, isProvider, isClient } = useRole();

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Link href="/" passHref legacyBehavior>
          <BootstrapNavbar.Brand>
            <FaCalendarAlt className="me-2" />
            Sistema de Reservas
          </BootstrapNavbar.Brand>
        </Link>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && isClient && (
              <>
                <Link href="/dashboard/client" passHref legacyBehavior>
                  <Nav.Link>Dashboard</Nav.Link>
                </Link>
                <Link href="/dashboard/client/services" passHref legacyBehavior>
                  <Nav.Link>Servicios</Nav.Link>
                </Link>
                <Link
                  href="/dashboard/client/reservations"
                  passHref
                  legacyBehavior
                >
                  <Nav.Link>Mis Reservas</Nav.Link>
                </Link>
              </>
            )}

            {isAuthenticated && isProvider && (
              <>
                <Link href="/dashboard/provider" passHref legacyBehavior>
                  <Nav.Link>Dashboard</Nav.Link>
                </Link>
                <Link
                  href="/dashboard/provider/schedules"
                  passHref
                  legacyBehavior
                >
                  <Nav.Link>Mis Horarios</Nav.Link>
                </Link>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <Link href="/dashboard/admin" passHref legacyBehavior>
                <Nav.Link>Admin</Nav.Link>
              </Link>
            )}
          </Nav>

          <Nav>
            {isAuthenticated && user ? (
              <NavDropdown
                title={
                  <>
                    <FaUser className="me-1" />
                    {user.name}
                  </>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item disabled>
                  <small className="text-muted">{user.email}</small>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <Link href="/profile" passHref legacyBehavior>
                  <NavDropdown.Item>
                    <FaUser className="me-2" />
                    Mi Perfil
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Link href="/auth/login" passHref legacyBehavior>
                  <Nav.Link>Iniciar Sesión</Nav.Link>
                </Link>
                <Link href="/auth/register" passHref legacyBehavior>
                  <Nav.Link>Registrarse</Nav.Link>
                </Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};
