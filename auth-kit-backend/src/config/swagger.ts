// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AuthKit API",
      version: "1.0.0",
      description: "Authentication Kit API documentation",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"], // 라우터 파일 주석을 대상으로 문서 생성
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
