import express, { Request, Response } from "express";
import serverless from "serverless-http";
import axios from "axios";
import cors from "cors";

const app = express();
const router = express.Router();

const SEOUL_BUS_API_KEY = process.env.SEOUL_BUS_API_KEY!;

app.use(cors());
app.use("/api", router);

router.get("/getStationsByPos", async (req: Request, res: Response) => {
  try {
    const { tmX, tmY, radius } = req.query;

    const response = await axios.get(`https://ws.bus.go.kr/api/rest/stationinfo/getStationByPos`, {
      params: {
        serviceKey: SEOUL_BUS_API_KEY,
        tmX,
        tmY,
        radius,
      },
      responseType: "text",
    });

    res.header("Content-Type", "application/xml");
    res.send(response.data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const handler = serverless(app);
