"use client";

import { ReactNode } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBriefcase,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";
import classNames from "classnames";

interface ProviderLayoutProps {
  children: ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard/provider",
      icon: <FaHome className="me-2" />,
      label: "Dashboard",
      exact: true,
    },
    {
      href: "/dashboard/provider/services",
      icon: <FaBriefcase className="me-2" />,
      label: "Mis Servicios",
    },
    {
      href: "/dashboard/provider/schedules",
      icon: <FaCalendarAlt className="me-2" />,
      label: "Horarios",
    },
    {
      href: "/dashboard/provider/reservations",
      icon: <FaUsers className="me-2" />,
      label: "Reservas",
    },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={2} className="mb-4 mb-lg-0">
          <div
            className="bg-white rounded shadow-sm p-3 sticky-top"
            style={{ top: "80px" }}
          >
            <h5 className="mb-3 text-muted small text-uppercase">
              <FaChartLine className="me-2" />
              Panel de Control
            </h5>
            <Nav className="flex-column">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} passHref legacyBehavior>
                  <Nav.Link
                    className={classNames(
                      "rounded mb-2 d-flex align-items-center",
                      {
                        "bg-primary text-white": isActive(
                          item.href,
                          item.exact
                        ),
                        "text-dark": !isActive(item.href, item.exact),
                      }
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Nav.Link>
                </Link>
              ))}
            </Nav>
          </div>
        </Col>
        <Col lg={10}>
          <div className="bg-white rounded shadow-sm p-4">{children}</div>
        </Col>
      </Row>
    </Container>
  );
}
