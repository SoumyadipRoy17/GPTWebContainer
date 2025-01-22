import "dotenv/config.js";

import http from "http";
import app from "./app.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
