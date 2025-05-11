const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Model untuk menyimpan data
const InputData = mongoose.model(
  "InputData",
  new mongoose.Schema({
    name: String,
  })
);

// Endpoint untuk menginput data
app.post("/api/create", async (req, res) => {
  try {
    const { name } = req.body;
    const newData = new InputData({ name });
    await newData.save();
    console.log("🟢 Data berhasil disimpan:", newData);
    res.json({ success: true, data: newData });
  } catch (err) {
    console.error("❌ Gagal menyimpan data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Endpoint untuk mendapatkan data
app.get("/api/data", async (req, res) => {
  try {
    const data = await InputData.find();
    console.log("📥 Data diambil dari database:", data.length, "item");
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Gagal mengambil data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
