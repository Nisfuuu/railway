const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Route root untuk ngecek server
app.get("/", (req, res) => {
  res.send("✅ Backend is up and running!");
});

// Koneksi MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Schema & Model
const InputData = mongoose.model(
  "InputData",
  new mongoose.Schema({
    name: String,
  })
);

// POST /api/create - simpan data
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

// GET /api/data - ambil semua data
app.get("/api/data", async (req, res) => {
  try {
    const data = await InputData.find();
    console.log("📥 Ambil data:", data.length, "item");
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Gagal ambil data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
