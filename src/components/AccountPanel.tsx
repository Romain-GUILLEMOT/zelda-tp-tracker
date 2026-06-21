"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@rgds/react";
import { signIn as passkeySignIn } from "next-auth/webauthn";

interface AccountData {
  name: string | null;
  email: string | null;
  hasPassword: boolean;
}

export default function AccountPanel() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const loadAccount = async () => {
      const response = await fetch("/api/account");
      if (!response.ok) return;
      const data = await response.json() as AccountData;
      setAccount(data);
      setName(data.name || "");
      setEmail(data.email || "");
    };
    loadAccount();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Modification impossible.");
      }
      setCurrentPassword("");
      setNewPassword("");
      setStatus("Compte mis à jour.");
      setAccount({ name, email, hasPassword: account?.hasPassword || Boolean(newPassword) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Modification impossible.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File | undefined) => {
    if (!file) return;

    setError("");
    setStatus("");
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/avatar", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Upload impossible.");
      return;
    }

    setAvatarVersion(Date.now());
    setStatus("Avatar mis à jour.");
  };

  return (
    <main className="account-page">
      <section className="account-shell">
        <div className="account-header">
          <img src={`/api/avatar?v=${avatarVersion}`} alt="" className="account-avatar" />
          <div>
            <h1>Compte</h1>
            <p>Gère ton accès RG GT.</p>
          </div>
        </div>

        <form ref={formRef} className="account-form" onSubmit={handleSubmit}>
          <label>
            Avatar
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
            />
          </label>
          <label>
            Username
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          {account?.hasPassword && (
            <label>
              Mot de passe actuel
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
          )}
          <label>
            Nouveau mot de passe
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              autoComplete="new-password"
              placeholder={account?.hasPassword ? "Laisser vide pour ne pas changer" : "Ajouter un mot de passe"}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {status && <p className="account-status">{status}</p>}

          <div className="account-actions">
            <Button
              content="Enregistrer"
              type="success"
              size="md"
              isLoading={isLoading}
              onClick={() => formRef.current?.requestSubmit()}
            />
            <Button
              content="Ajouter une passkey"
              type="secondary"
              size="md"
              onClick={() => passkeySignIn("passkey", { action: "register" })}
            />
            <Link href="/" className="account-link">Retour</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
