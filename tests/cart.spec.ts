import { test, expect } from "@playwright/test";

test("Add product to cart and verify contents", async ({ page }) => {
    await page.goto(process.env.BASE_URL + "/products");

    const products = await page.request.get(process.env.BASE_URL + "/products");
    const list = await products.json();

    await page.request.post(process.env.BASE_URL + "/cart/items", {
        data: { ...list[0], quantity: 1 }
    });

    const cart = await page.request.get(process.env.BASE_URL + "/cart");
    const cartItems = await cart.json();

    expect(cartItems[0].name).toBe(list[0].name);
    expect(cartItems[0].price).toBe(list[0].price);
    expect(cartItems[0].quantity).toBe(1);
});