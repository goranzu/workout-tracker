import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import config from "./config";

const app = express();

app.use(morgan("dev"));
app.use(helmet());

app.get("/", (req, res): void => {
  res.status(200).json({ message: "hello world" });
  return;
});

function start(): void {
  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:$${config.port}`);
  });
}

export { start };
