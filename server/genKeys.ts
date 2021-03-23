import crypto from "crypto";
import fs from "fs";

function genKeys() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  fs.writeFileSync(process.cwd() + "/id_rsa_pub.pem", keyPair.publicKey);
  fs.writeFileSync(process.cwd() + "/id_rsa_priv.pem", keyPair.privateKey);
}

genKeys();
