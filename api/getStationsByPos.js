"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const SEOUL_BUS_API_KEY = process.env.SEOUL_BUS_API_KEY;
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 로그 추가
    console.log("Query params:", req.query);
    console.log("API KEY:", SEOUL_BUS_API_KEY);
    // GET 요청일 경우
    if (req.method === "GET") {
        try {
            const { tmX, tmY, radius } = req.query;
            // 서울버스 API 호출
            const response = yield axios_1.default.get(`https://ws.bus.go.kr/api/rest/stationinfo/getStationByPos`, {
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
        }
        catch (error) {
            console.error("Proxy error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    else {
        // GET 요청이 아닌 경우 405 Method Not Allowed 반환
        res.status(405).json({ message: "Method Not Allowed" });
    }
});
