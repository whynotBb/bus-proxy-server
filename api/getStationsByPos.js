const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (req, res) => {
	// CORS 헤더 추가
	res.setHeader("Access-Control-Allow-Origin", "https://20250415-bus-app.vercel.app");
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	// OPTIONS 요청 처리 (preflight)
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	const { tmX, tmY, radius } = req.query;

	const serviceKey = encodeURIComponent("n3zbZ++zACobqLxjpnF7be8B75BPXY4NbIggHE3dwiM908CKZKzxt9vBS/gWdeXm2aSlK8pw8thh64wgmu7Tug==");

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
