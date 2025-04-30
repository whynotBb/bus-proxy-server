const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (req, res) => {
	const allowedOrigins = ["https://bbsbus-app.netlify.app", "http://localhost:5173"];

	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	// CORS 헤더 추가
	// res.setHeader("Access-Control-Allow-Origin", "https://bbsbus-app.netlify.app");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "");

	// OPTIONS 요청 처리 (preflight)
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	const { arsId } = req.query;
	if (!arsId) {
		return res.status(400).json({ error: "Missing required query parameter: arsId" });
	}

	const serviceKey = encodeURIComponent(process.env.BUS_API_KEY);

	const url = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey=${serviceKey}${arsId ? `&arsId=${encodeURIComponent(arsId)}` : ""}`;

	try {
		const response = await axios.get(url);
		const xml = response.data;

		xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
			if (err) return res.status(500).json({ error: "XML parsing failed" });
			res.status(200).json(result);
		});
	} catch (error) {
		console.error("Bus API error:", error.response?.data || error.message);
		res.status(500).json({ error: error.message });
	}
};
