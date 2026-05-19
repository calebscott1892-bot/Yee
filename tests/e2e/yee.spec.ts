import { expect, test } from "@playwright/test";

test("supports core discovery and profile interactions", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Discover consented talent" }),
  ).toBeVisible();

  await page.getByLabel("Search candidates").fill("security");
  await expect(page.getByText("Jason Li")).toBeVisible();
  await expect(page.getByText("Aisha Patel")).toBeHidden();
  await expect(page.getByText("Cloud Security Engineer")).toBeVisible();

  await page.getByRole("button", { name: "Save search" }).click();
  await expect(page.getByText("Saved talent searches")).toBeVisible();
  await expect(page.getByText("Search saved for Security talent.")).toBeVisible();
  await expect(page.getByText("Security talent", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Create alert" }).click();
  await expect(page.getByText("Alert created for Security talent.")).toBeVisible();
  await expect(page.getByText("Alert on", { exact: true })).toBeVisible();
  await expect(page.getByText("Search alerts")).toBeVisible();

  await page.getByRole("button", { name: "Send intro request" }).click();
  await expect(
    page.getByText("Pending candidate", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Update intro request" }),
  ).toBeVisible();
  await expect(page.getByText("Request pipeline")).toBeVisible();

  await page.getByRole("button", { name: "Mark accepted" }).click();
  await expect(page.getByText("Accepted", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Relay channel opened")).toBeVisible();

  await page.getByRole("button", { name: "Pause verification" }).click();
  await expect(page.getByText("Verification paused")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Verify employer first" }),
  ).toBeDisabled();

  await page.getByRole("button", { name: "Resume verification" }).click();
  await expect(
    page.getByRole("button", { name: "Update intro request" }),
  ).toBeEnabled();

  await page.getByRole("button", { name: "Candidate" }).click();
  await expect(page.getByText("Candidate workspace")).toBeVisible();

  await page.getByLabel("Profile title").fill("Marketplace Operations Lead");
  await expect(page.getByText("Local draft saved in this browser.")).toBeVisible();

  await page
    .locator(".profile-builder-actions")
    .getByRole("button", { name: "Boost profile" })
    .click();
  await expect(
    page.getByRole("button", { name: "Boost active" }).first(),
  ).toBeVisible();

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Tune your discoverable profile" }),
  ).toBeVisible();
  await expect(page.getByLabel("Profile title")).toHaveValue(
    "Marketplace Operations Lead",
  );
});
