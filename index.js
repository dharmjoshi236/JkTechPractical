const express = require("express");
const cors = require("cors");
const indexRoutes = require("./routes/index");
const { nodePort } = require("./constants/envConstants");
const connectDb = require("./database");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

const swaggerDocs = yaml.load("./swagger.yaml");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", indexRoutes);

app.listen(nodePort, async () => {
  console.log(`Server is listening on port ${nodePort}`);
  await connectDb();
});
