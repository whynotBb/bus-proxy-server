const express = require("express");
const serverless = require("serverless-http");
const axios = require("axios");
const cors = require("cors");

const app = express();
const router = express.Router();

const SEOUL_BUS_API_KEY = process.env.SEOUL_BUS_API_KEY;

app.use(cors());
app.use("/api", router);

router.get("/getStationsByPos", async (req, res) => {
	try {
		console.log("Query params:", req.query);
		console.log("API KEY:", SEOUL_BUS_API_KEY);

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

// 서버리스 함수로 내보내기
module.exports.handler = serverless(app);
