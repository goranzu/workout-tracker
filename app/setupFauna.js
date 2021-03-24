require("dotenv").config();
const faunadb = require("faunadb");

// Setup the db (migrations)

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  domain: "localhost",
  port: 8443,
  scheme: "http",
});

async function setup() {
  // create collections
  await client.query(q.CreateCollection({ name: "users" }));

  // create indexes
  await client.query(
    q.CreateIndex({
      name: "users_by_username",
      source: q.Collection("users"),
      terms: [{ field: ["data", "username"] }],
    }),
  );
}

setup();
