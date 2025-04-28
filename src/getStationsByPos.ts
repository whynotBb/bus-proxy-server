import axios from "axios";
import { NowRequest, NowResponse } from "@vercel/node"; // Vercel의 기본 타입 가져오기

const SEOUL_BUS_API_KEY = process.env.SEOUL_BUS_API_KEY!;

export default async (req: NowRequest, res: NowResponse) => {
	// 로그 추가
	console.log("Query params:", req.query);
	console.log("API KEY:", SEOUL_BUS_API_KEY);

	// GET 요청일 경우
	if (req.method === "GET") {
		try {
			const { tmX, tmY, radius } = req.query;

			// 서울버스 API 호출
			const response = await axios.get(`https://ws.bus.go.kr/api/rest/stationinfo/getStationByPos`, {
				params: {
					serviceKey: SEOUL_BUS_API_KEY,
					tmX,
					tmY,
					radius,
				},
				responseType: "text",
			});

			// 응답 헤더 및 데이터 전송
			res.setHeader("Content-Type", "application/xml");
			res.send(response.data);
		} catch (error) {
			console.error("Proxy error:", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	} else {
		// GET 요청이 아닌 경우 405 Method Not Allowed 반환
		res.status(405).json({ message: "Method Not Allowed" });
	}
};
