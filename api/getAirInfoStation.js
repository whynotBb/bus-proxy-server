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

	const { tmX, tmY } = req.query;
	if (!tmX || !tmY) {
		return res.status(400).json({ error: "Missing required query parameter: tmX, tmY" });
	}

	const serviceKey = encodeURIComponent(process.env.BUS_API_KEY);

	// const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getNearbyMsrstnList?serviceKey=${serviceKey}&returnType='json'&tmX=${tmX}&tmY=${tmY}`;
	const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getNearbyMsrstnList?serviceKey=${serviceKey}&tmX=${tmX}&tmY=${tmY}`;

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
