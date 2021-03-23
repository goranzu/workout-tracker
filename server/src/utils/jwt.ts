import jwt, { SignOptions } from "jsonwebtoken";
import path from "path";
import fs from "fs";

const pathToPubKey = path.join(process.cwd(), "id_rsa_pub.pem");
const pathToPrivateKey = path.join(process.cwd(), "id_rsa_priv.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf-8");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf-8");

const jwtOptions: SignOptions = {
  algorithm: "RS256",
  issuer: "api.track",
  audience: "api.track",
};

interface Payload {
  id: string;
  username: string;
  iat: number;
  aud: string;
  iss: string;
}

function signToken({ id, username }: Pick<Payload, "id" | "username">): string {
  return jwt.sign({ id, username }, PRIV_KEY, jwtOptions);
}

function verifyToken(token: string): Promise<Payload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, PUB_KEY, jwtOptions, (err, payload) => {
      if (err) {
        reject(err);
      }
      resolve(payload as Payload);
    });
  });
}

export { signToken, verifyToken };
