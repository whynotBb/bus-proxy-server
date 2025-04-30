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
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	// OPTIONS 요청 처리 (preflight)
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	const { tmX, tmY, radius } = req.query;

	const serviceKey = encodeURIComponent(process.env.BUS_API_KEY);

	const url = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?serviceKey=${serviceKey}${tmX ? `&tmX=${encodeURIComponent(tmX)}` : ""}${tmY ? `&tmY=${encodeURIComponent(tmY)}` : ""}${radius ? `&radius=${encodeURIComponent(radius)}` : ""}`;

	try {
		const response = await axios.get(url);
		const xml = response.data;

		xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
			if (err) return res.status(500).json({ error: "XML parsing failed" });
			res.status(200).json(result);
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
