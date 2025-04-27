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
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
const SEOUL_BUS_API_KEY = process.env.SEOUL_BUS_API_KEY;
app.use((0, cors_1.default)());
app.use("/api", router);
router.get("/getStationsByPos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tmX, tmY, radius } = req.query;
        const response = yield axios_1.default.get(`https://ws.bus.go.kr/api/rest/stationinfo/getStationByPos`, {
            params: {
                serviceKey: SEOUL_BUS_API_KEY,
                tmX,
                tmY,
                radius,
            },
            responseType: "text",
        });
        res.header("Content-Type", "application/xml");
        res.send(response.data);
    }
    catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
exports.handler = (0, serverless_http_1.default)(app);
