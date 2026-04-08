import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import areaRoutes from "./routes/area.route.js";
import kendaraanRoutes from "./routes/kendaraan.route.js";
import transaksiRoutes from "./routes/transaksi.route.js";
import logRoutes from "./routes/log.route.js";

dotenv.config();

const app = express();

app.use(cors({ origin:'http://localhost:5173', credentials:true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/area', areaRoutes);
app.use('/api/kendaraan', kendaraanRoutes);
app.use('/api/transaksi', transaksiRoutes);
app.use('/api/logs', logRoutes);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
});