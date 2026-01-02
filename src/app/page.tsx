'use client';

import { useKeycloak } from '@/context/KeycloakContext';
import { useEffect, useState } from 'react';

interface TokenData {
  preferred_username?: string;
  email?: string;
  name?: string;
  sub?: string;
  [key: string]: unknown;
}

export default function Home() {
  const { keycloak, authenticated, initialized } = useKeycloak();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [serverMessage, setServerMessage] = useState('');
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    if (authenticated && keycloak?.token) {
      try {
        const payload = JSON.parse(atob(keycloak.token.split('.')[1]));
        setTokenData(payload);
      } catch (error) {
        console.error('Failed to parse token:', error);
      }
    }
  }, [authenticated, keycloak]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const handleLogin = () => {
    keycloak?.login();
  };

  const handleRegister = () => {
    keycloak?.register();
  };

  const handleLogout = () => {
    keycloak?.logout();
  };

  const handleCheck = async () => {
    if (!keycloak) return;

    setChecking(true);
    setCheckError(null);
    setServerMessage('');

    try {
      await keycloak.updateToken(30); // refresh token if close to expiring
      const token = keycloak.token;

      if (!token) {
        throw new Error('Missing access token');
      }

      const response = await fetch(`${apiBase}/api/hello`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const message = await response.text();
      setServerMessage(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setCheckError(message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Keycloak The GOAT 🐐</h1>
        
        {!authenticated ? (
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Welcome</h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLogin}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">You are logged in!</h2>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleCheck}
                disabled={checking}
                className={`px-6 py-3 rounded-lg text-white transition ${checking ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {checking ? 'Checking...' : 'Check'}
              </button>
              {serverMessage && (
                <span className="text-green-700 font-semibold">{serverMessage}</span>
              )}
              {checkError && (
                <span className="text-red-700">{checkError}</span>
              )}
            </div>
            
            {tokenData && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Token Data:</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm text-gray-900">
                    {JSON.stringify(tokenData, null, 2)}
                  </pre>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Username:</p>
                    <p className="text-lg text-gray-900">{tokenData.preferred_username || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Email:</p>
                    <p className="text-lg text-gray-900">{tokenData.email || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Name:</p>
                    <p className="text-lg text-gray-900">{tokenData.name || 'N/A'}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">Subject (ID):</p>
                    <p className="text-lg break-all text-gray-900">{tokenData.sub || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
