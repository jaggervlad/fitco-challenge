"use client";

import { Container, Row, Col, Card, Badge, Table } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaChartLine,
  FaArrowUp,
  FaCalendarCheck,
} from "react-icons/fa";
import { ProtectedRoute } from "@/components/common";
import { UserRole } from "@/types";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Link from "next/link";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Importar componentes de gráficos dinámicamente
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

function ClientDashboardContent() {
  // Mock data para gráficos y métricas
  const mockStats = {
    totalReservations: 23,
    upcomingReservations: 4,
    completedReservations: 18,
    cancelledReservations: 1,
    favoriteServices: ["Yoga", "Pilates", "Masajes"],
  };

  // Datos para el gráfico de líneas (Reservas por mes)
  const reservationsChartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Reservas",
        data: [2, 4, 3, 5, 4, 5],
        fill: true,
        backgroundColor: "rgba(13, 110, 253, 0.1)",
        borderColor: "rgb(13, 110, 253)",
        tension: 0.4,
      },
    ],
  };

  // Datos para el gráfico de dona (Estados de reservas)
  const statusChartData = {
    labels: ["Completadas", "Próximas", "Canceladas"],
    datasets: [
      {
        data: [
          mockStats.completedReservations,
          mockStats.upcomingReservations,
          mockStats.cancelledReservations,
        ],
        backgroundColor: [
          "rgba(25, 135, 84, 0.8)",
          "rgba(13, 110, 253, 0.8)",
          "rgba(220, 53, 69, 0.8)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Mock data para próximas reservas
  const mockUpcomingReservations = [
    {
      id: 1,
      providerName: "Dr. Juan Pérez",
      service: "Consulta General",
      date: "15 Ene 2026",
      time: "10:00 AM",
      status: "Confirmada",
    },
    {
      id: 2,
      providerName: "María González",
      service: "Yoga Principiantes",
      date: "16 Ene 2026",
      time: "2:00 PM",
      status: "Confirmada",
    },
    {
      id: 3,
      providerName: "Carlos López",
      service: "Masaje Deportivo",
      date: "18 Ene 2026",
      time: "9:00 AM",
      status: "Pendiente",
    },
  ];

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="mb-2">
          <FaChartBar className="me-2" />
          Mi Dashboard
        </h1>
        <p className="text-muted">Resumen de tus reservas y actividad</p>
      </div>

      {/* Métricas Principales */}
      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <Card className="bg-primary text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Total Reservas</h6>
                  <h2 className="mb-0">{mockStats.totalReservations}</h2>
                  <small>
                    <FaArrowUp className="me-1" />
                    +15% este mes
                  </small>
                </div>
                <FaCalendarAlt size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="bg-success text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Completadas</h6>
                  <h2 className="mb-0">{mockStats.completedReservations}</h2>
                  <small>Reservas completadas</small>
                </div>
                <FaCheckCircle size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="bg-info text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Próximas</h6>
                  <h2 className="mb-0">{mockStats.upcomingReservations}</h2>
                  <small>Reservas pendientes</small>
                </div>
                <FaCalendarCheck size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="bg-warning text-white h-100 shadow">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Canceladas</h6>
                  <h2 className="mb-0">{mockStats.cancelledReservations}</h2>
                  <small>Total canceladas</small>
                </div>
                <FaTimesCircle size={40} className="opacity-75" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaChartLine className="me-2 text-primary" />
                Historial de Reservas
              </h5>
            </Card.Header>
            <Card.Body>
              <Line data={reservationsChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2 text-primary" />
                Estado de Reservas
              </h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={statusChartData} options={chartOptions} />
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <Badge bg="success" className="me-2"></Badge>
                    Completadas
                  </span>
                  <strong>{mockStats.completedReservations}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>
                    <Badge bg="primary" className="me-2"></Badge>
                    Próximas
                  </span>
                  <strong>{mockStats.upcomingReservations}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>
                    <Badge bg="danger" className="me-2"></Badge>
                    Canceladas
                  </span>
                  <strong>{mockStats.cancelledReservations}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Próximas Reservas */}
      <Row className="g-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaClock className="me-2 text-primary" />
                Próximas Reservas
              </h5>
              <Link
                href="/dashboard/client/reservations"
                className="btn btn-sm btn-outline-primary"
              >
                Ver Todas
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Proveedor</th>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUpcomingReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary text-white me-2 d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                          >
                            {reservation.providerName.charAt(0)}
                          </div>
                          {reservation.providerName}
                        </div>
                      </td>
                      <td>{reservation.service}</td>
                      <td>{reservation.date}</td>
                      <td>{reservation.time}</td>
                      <td>
                        <Badge
                          bg={
                            reservation.status === "Confirmada"
                              ? "success"
                              : "warning"
                          }
                        >
                          {reservation.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
      <ClientDashboardContent />
    </ProtectedRoute>
  );
}
