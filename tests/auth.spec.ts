import { test, expect, request } from "@playwright/test";

test("Login via API returns token", async ({ }) => {
    const api = await request.newContext({ baseURL: process.env.BASE_URL });
    const res = await api.post("/auth/login", {
        data: { email: "test@test.com", password: "1234" }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toBeTruthy();
});