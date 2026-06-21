"use client";

import { FormEvent, useRef, useState } from "react";
import { Button } from "@rgds/react";
import { signIn } from "next-auth/react";
import { signIn as passkeySignIn } from "next-auth/webauthn";

interface LoginPanelProps {
  callbackUrl: string;
}

export default function LoginPanel({ callbackUrl }: LoginPanelProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Création du compte impossible.");
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      window.location.href = result?.url || callbackUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <img
        src="https://s3.romain-guillemot.dev/assets/logos/logo.svg"
        alt="RG GT"
        className="auth-logo"
      />
      <div className="auth-heading">
        <h1>RG GT</h1>
        <p>Romain GUILLEMOT - Game tracker</p>
      </div>

      <div className="auth-actions">
        <Button
          content="Continuer avec Google"
          type="primary"
          size="md"
          onClick={() => signIn("google", { callbackUrl })}
        />
        <Button
          content="Connexion avec passkey"
          type="secondary"
          size="md"
          onClick={() => passkeySignIn("passkey", { callbackUrl })}
        />
      </div>

      <div className="auth-divider">ou</div>

      <form ref={formRef} className="auth-form" onSubmit={handleCredentials}>
        {mode === "signup" && (
          <label>
            Nom
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="Romain"
            />
          </label>
        )}
        <label>
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
            placeholder="toi@example.com"
          />
        </label>
        <label>
          Mot de passe
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <Button
          content={mode === "signup" ? "Créer le compte" : "Se connecter"}
          type="success"
          size="md"
          isLoading={isLoading}
          onClick={() => formRef.current?.requestSubmit()}
          className="w-full"
        />
      </form>

      <button
        type="button"
        className="auth-mode-switch"
        onClick={() => {
          setError("");
          setMode(mode === "signin" ? "signup" : "signin");
        }}
      >
        {mode === "signup" ? "J'ai déjà un compte" : "Créer un compte email"}
      </button>
    </div>
  );
}
