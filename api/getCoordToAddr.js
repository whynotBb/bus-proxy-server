//좌표를 주소로 변환하여 반환하는 api
const axios = require("axios");

module.exports = async (req, res) => {
	const allowedOrigins = ["https://bbsbus-app.netlify.app", "http://localhost:5173"];

	const origin = req.headers.origin;
	console.log("요청 Origin:", origin);
	// if (allowedOrigins.includes(origin)) {
	// 	res.setHeader("Access-Control-Allow-Origin", origin);
	// }

	// CORS 헤더 추가
	// 무조건 헤더 세팅 (운영 시에는 조건 검사를 넣을 것)
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	} else {
		res.setHeader("Access-Control-Allow-Origin", "*"); // 개발용 (운영에선 제거!)
	}
	res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With");
	res.setHeader("Vary", "Origin"); // CDN 캐시 문제 방지

	// OPTIONS 요청 처리 (preflight)
	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	const { x, y } = req.query;
	if (!x || !y) {
		return res.status(400).json({ error: "Missing required query parameter: req" });
	}
	const serviceKey = encodeURIComponent(process.env.KAKAO_REST_API_KEY);
	const url = `https://dapi.kakao.com/v2/local/geo/coord2address`;

	try {
		const response = await axios.get(url, {
			params: { x, y },
			headers: {
				Authorization: `KakaoAK ${serviceKey}`,
			},
		});

		res.status(200).json(response.data);
	} catch (error) {
		console.error("near by station API error:", error.response?.data || error.message || error);

		res.status(500).json({ error: error.message });
	}
};
