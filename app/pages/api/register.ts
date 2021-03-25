// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import dotenv from "dotenv";
dotenv.config();
import { NextApiRequest, NextApiResponse } from "next";

const FAUNA_SECRET = process.env.FAUNA_SECRET;
const AUTH_HEADER = `Bearer ${FAUNA_SECRET}`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: Only run on post request
  // TODO: Validate incoming data
  const inputs = JSON.parse(req.body);

  const response = await fetch("http://localhost:8084/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: AUTH_HEADER,
    },
    body: JSON.stringify({
      query: `
        mutation REGISTER_USER($username: String!, $password: String!) {
          createUser(data: {
            username: $username
            password: $password
          }) {
            _id
            username
          }
        }
      `,
      variables: {
        username: inputs.username,
        password: inputs.password,
      },
    }),
  });
  const data = await response.json();

  if (data.errors) {
    res.status(400).json({
      error: {
        message: "Invalid input",
        path: req.url,
      },
    });
    return;
  }

  const user = data.data.createUser;

  res.status(200).json({ data: user });
};
