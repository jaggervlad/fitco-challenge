import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import "nprogress/nprogress.css";

export const metadata: Metadata = {
  title: "Sistema de Reservas",
  description: "Plataforma de gestión de citas y reservas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
