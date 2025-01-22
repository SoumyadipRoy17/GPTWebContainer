import mongoose from "mongoose";

function connect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database connected MongoDB");
    })
    .catch((err) => {
      console.log("Not connected MongoDB");
    });
}

export default connect;
