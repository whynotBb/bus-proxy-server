// 단기예보 조회
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

	const { lat, lon } = req.query;
	if (!lat || !lon) {
		return res.status(400).json({ error: "Missing required query parameter: req" });
	}

	const serviceKey = encodeURIComponent(process.env.OPENWEATHER_API_KEY);

	const url = `https://api.openweathermap.org/data/2.5/forecast?appid=${serviceKey}&units=metric&lang=kr${lat ? `&lat=${encodeURIComponent(lat)}` : ""}${lon ? `&lon=${encodeURIComponent(lon)}` : ""}`;

	try {
		const response = await axios.get(url);

		res.status(200).json(response.data);
	} catch (error) {
		console.error("near by station API error:", error.response?.data || error.message || error);

		res.status(500).json({ error: error.message });
	}
};
