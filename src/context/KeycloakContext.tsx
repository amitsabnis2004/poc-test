'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Keycloak from 'keycloak-js';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  initialized: boolean;
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  authenticated: false,
  initialized: false,
});

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'myrealm',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'nextjs-client',
    });

    kc.init({ onLoad: 'check-sso', checkLoginIframe: false })
      .then((auth: boolean) => {
        setAuthenticated(auth);
        setKeycloak(kc);
        setInitialized(true);
      })
      .catch(console.error);
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};
