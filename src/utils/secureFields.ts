import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from "crypto";
import { hash, verify } from "@node-rs/argon2";

const encoding = "base64url";

function secretMaterial() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required for encrypted auth fields.");
  }
  return Buffer.from(secret);
}

function deriveKey(info: string) {
  return Buffer.from(hkdfSync("sha256", secretMaterial(), "rg-gt-auth", info, 32));
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function fieldLookup(value: string) {
  return createHmac("sha256", deriveKey("lookup"))
    .update(value)
    .digest(encoding);
}

export function encryptField(value: string | null | undefined) {
  if (!value) return null;

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveKey("field-encryption"), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString(encoding), tag.toString(encoding), ciphertext.toString(encoding)].join(".");
}

export function decryptField(value: string | null | undefined) {
  if (!value) return null;

  const [ivValue, tagValue, ciphertextValue] = value.split(".");
  if (!ivValue || !tagValue || !ciphertextValue) return null;

  const decipher = createDecipheriv(
    "aes-256-gcm",
    deriveKey("field-encryption"),
    Buffer.from(ivValue, encoding)
  );
  decipher.setAuthTag(Buffer.from(tagValue, encoding));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, encoding)),
    decipher.final(),
  ]).toString("utf8");
}

export async function hashPassword(password: string) {
  return hash(password, {
    algorithm: 2,
    memoryCost: 19456,
    timeCost: 3,
    parallelism: 1,
    outputLen: 32,
  });
}

export async function verifyPassword(hashValue: string, password: string) {
  return verify(hashValue, password, { algorithm: 2 });
}
