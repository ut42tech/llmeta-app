import { expect, test } from "@playwright/test";

/**
 * Authentication E2E Tests
 *
 * These tests focus on core functionality that:
 * 1. Would break critical user flows if they fail
 * 2. Are difficult to catch with unit tests
 * 3. Involve real browser behavior and navigation
 */

test.describe("Authentication Flow", () => {
  test("login form disables inputs during submission", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");
    const submitButton = page.getByRole("button", { name: "Sign In" });

    // Fill credentials
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    // Submit and verify inputs get disabled (prevents modification during submit)
    await submitButton.click();
    await expect(emailInput).toBeDisabled();
    await expect(passwordInput).toBeDisabled();
  });

  test("login shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Error should be displayed in the error container (not silently fail)
    const errorMessage = page.locator(".bg-destructive\\/10");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test("signup validates password match before API call", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel("Display Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("different");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Client-side validation should catch this before API call
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    // Form should NOT be in loading state (validation prevented submission)
    await expect(
      page.getByRole("button", { name: "Create Account" }),
    ).toBeEnabled();
  });

  test("signup validates password length before API call", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel("Display Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByLabel("Confirm Password").fill("short");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show password length error
    await expect(
      page.getByText("Password must be at least 6 characters"),
    ).toBeVisible();
  });

  test("signup validates display name is not empty", async ({ page }) => {
    await page.goto("/signup");

    // Fill display name with only spaces (bypasses HTML5 required)
    await page.getByLabel("Display Name").fill("   ");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show display name required error (trimmed check)
    await expect(page.getByText("Display name is required")).toBeVisible();
  });
});

test.describe("Navigation & Routing", () => {
  test("login/signup navigation works bidirectionally", async ({ page }) => {
    // Login -> Signup
    await page.goto("/login");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL("/signup");

    // Signup -> Login
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("URL error params are displayed correctly", async ({ page }) => {
    // Test profile_not_found error (from middleware redirect)
    await page.goto("/login?error=profile_not_found");
    await expect(
      page.getByText("There is an issue with your account"),
    ).toBeVisible();
  });

  test("auth_callback_error is displayed", async ({ page }) => {
    await page.goto("/login?error=auth_callback_error");
    await expect(page.getByText("Authentication failed")).toBeVisible();
  });
});

test.describe("Form State Management", () => {
  test("form inputs remain disabled during submission", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Inputs should be disabled during loading
    await expect(emailInput).toBeDisabled();
    await expect(passwordInput).toBeDisabled();
  });

  test("error clears when submitting again", async ({ page }) => {
    await page.goto("/signup");

    // First: trigger validation error
    await page.getByLabel("Display Name").fill("Test");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("pass");
    await page.getByLabel("Confirm Password").fill("different");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();

    // Second: fix and resubmit - error should clear
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Previous error should not be visible
    await expect(page.getByText("Passwords do not match")).not.toBeVisible();
  });
});

test.describe("Accessibility & UX", () => {
  test("form can be submitted with Enter key", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Password").press("Enter");

    // Should trigger submission (loading state)
    await expect(page.getByText("Signing in...")).toBeVisible();
  });

  test("password fields mask input", async ({ page }) => {
    await page.goto("/signup");

    const passwordInput = page.getByLabel("Password", { exact: true });
    const confirmPasswordInput = page.getByLabel("Confirm Password");

    // Both password fields should have type="password" (not text)
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });
});
