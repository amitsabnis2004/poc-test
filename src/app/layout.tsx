import type { Metadata } from "next";
import "./globals.css";
import { KeycloakProvider } from "@/context/KeycloakContext";

export const metadata: Metadata = {
  title: "Keycloak POC",
  description: "Next.js with Keycloak Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <KeycloakProvider>
          {children}
        </KeycloakProvider>
      </body>
    </html>
  );
}
