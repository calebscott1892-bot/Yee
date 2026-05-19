import { expect, test } from "@playwright/test";

test("supports core discovery and profile interactions", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Discover consented talent" }),
  ).toBeVisible();

  await page.getByLabel("Search candidates").fill("security");
  await expect(page.getByText("Jason Li")).toBeVisible();
  await expect(page.getByText("Aisha Patel")).toBeHidden();

  await page.getByRole("button", { name: "Candidate" }).click();
  await expect(page.getByText("Candidate workspace")).toBeVisible();

  await page.getByRole("button", { name: "Boost profile" }).click();
  await expect(page.getByRole("button", { name: "Boost active" })).toBeVisible();
});
