import express from "express";
import AuthKit from "./src/index"; // 또는 src/index if in dev

const app = express();
app.use(AuthKit());

app.listen(4000, () => {
  console.log("✅ 서버 실행 중: http://localhost:4000");
});
