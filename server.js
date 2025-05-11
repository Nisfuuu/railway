const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json()); // Untuk membaca JSON body
app.use(cors());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Model untuk menyimpan data
const InputData = mongoose.model(
  "InputData",
  new mongoose.Schema({
    name: String,
  })
);

// Endpoint untuk menginput data
app.post("/api/create", async (req, res) => {
  const { name } = req.body;
  const newData = new InputData({ name });
  await newData.save();
  res.json(newData);
});

// Endpoint untuk mendapatkan data
app.get("/api/data", async (req, res) => {
  const data = await InputData.find();
  res.json(data);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
