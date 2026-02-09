import { defineConfig } from "@playwright/test";

export default defineConfig({
    timeout: 30000,
    use: {
        baseURL: process.env.BASE_URL,
        screenshot: "only-on-failure",
        video: "retain-on-failure"
    }
});