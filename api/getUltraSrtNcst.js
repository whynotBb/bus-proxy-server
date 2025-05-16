const axios = require("axios");

module.exports = async (req, res) => {
	const allowedOrigins = ["https://bbsbus-app.netlify.app", "http://localhost:5173"];

	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	// CORS 헤더 추가
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With");

	// OPTIONS 요청 처리 (preflight)
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	const { stationName } = req.query;
	if (!stationName) {
		return res.status(400).json({ error: "Missing required query parameter: stationName" });
	}

	const serviceKey = encodeURIComponent(process.env.BUS_API_KEY);

	const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${serviceKey}&returnType=json&pageNo=1&numOfRows=10${nx ? `&nx=${encodeURIComponent(nx)}` : ""}${ny ? `&ny=${encodeURIComponent(ny)}` : ""}${base_date ? `&base_date=${encodeURIComponent(base_date)}` : ""}${base_time ? `&base_time=${encodeURIComponent(base_time)}` : ""}`;

	try {
		const response = await axios.get(url, { timeout: 10000 }); // 10초 타임아웃

		res.status(200).json(response.data);
	} catch (error) {
		console.error("near by station API error:", error.response?.data || error.message || error);

		res.status(500).json({ error: error.message });
	}
};
