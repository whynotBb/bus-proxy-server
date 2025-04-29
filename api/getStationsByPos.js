// Vercel에서 자동 인식되는 함수형 구조
const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (req, res) => {
	const { tmX, tmY, radius } = req.query;

	const serviceKey = encodeURIComponent("n3zbZ++zACobqLxjpnF7be8B75BPXY4NbIggHE3dwiM908CKZKzxt9vBS/gWdeXm2aSlK8pw8thh64wgmu7Tug=="); // URL 인코딩된 키

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
