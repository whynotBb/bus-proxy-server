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

	const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${serviceKey}&returnType=json&dataTerm=DAILY&numOfRows=1&ver=1.4${stationName ? `&stationName=${encodeURIComponent(stationName)}` : ""}`;

	try {
		const response = await axios.get(url, { timeout: 10000 }); // 10초 타임아웃

		res.status(200).json(response.data);
	} catch (error) {
		console.error("near by station API error:", error.response?.data || error.message || error);

		res.status(500).json({ error: error.message });
	}
};
