import bcrypt from "bcrypt";
import crypto from "crypto";

export async function compPasswords(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

export async function hashPassword(this: any, next: Function) {
  if (!(this as any).isModified("password")) {
    return next();
  }
  this.confirmPassword = undefined;
  this.password = await bcrypt.hash(this.password, 12);
  next();
}

export function createPasswordResetHash() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return { resetToken, resetTokenHash };
}

export function compResetToken(
  candidateRestToken: string,
  restTokenHash: string
) {
  const candidateRestTokenHash = crypto
    .createHash("sha256")
    .update(candidateRestToken)
    .digest("hex");
  return restTokenHash === candidateRestTokenHash;
}
