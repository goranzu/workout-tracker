// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dotenv from "dotenv";
dotenv.config();
import faunadb from "faunadb";

const q = faunadb.query;
// For local dev
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  domain: "localhost",
  port: 8443,
  scheme: "http",
});

export default async (req, res) => {
  const user = await client.query(
    q.Create(q.Collection("users"), {
      data: {
        username: "liam2",
        password: "liamliam",
      },
    }),
  );

  console.log(user);
  res.status(200).json({ user });
};
