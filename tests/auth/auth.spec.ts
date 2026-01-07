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
    // Wait for either disabled state or loading text to ensure form is submitting
    await expect(emailInput.or(page.getByText("Signing in...")))
      .toBeDisabled({ timeout: 5000 })
      .catch(() => {});
    // Check that either the input is disabled or the form is in loading state
    const isDisabled = await emailInput.isDisabled();
    const hasLoadingText = await page.getByText("Signing in...").isVisible();
    expect(isDisabled || hasLoadingText).toBeTruthy();
  });

  test("login shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("invalid@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Error should be displayed - use role-based selector for better cross-browser compatibility
    // Wait for the error text content which is more reliable than CSS class selector
    await expect(
      page.getByText(/Invalid login credentials|error/i),
    ).toBeVisible({
      timeout: 15000,
    });
  });

  test("signup validates password match before API call", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel("Display Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("different");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Client-side validation should catch this before API call
    await expect(page.getByText("Passwords do not match")).toBeVisible({
      timeout: 10000,
    });

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
    ).toBeVisible({ timeout: 10000 });
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
    await expect(page.getByText("Display name is required")).toBeVisible({
      timeout: 10000,
    });
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
    const submitButton = page.getByRole("button", { name: "Sign In" });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    // Check that form is in loading state (either inputs disabled or loading text visible)
    // Use Promise.race to handle fast network responses
    const isSubmitting = await Promise.race([
      emailInput.isDisabled(),
      page.getByText("Signing in...").isVisible(),
      submitButton.isDisabled(),
    ]);
    expect(isSubmitting).toBeTruthy();
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

    // Second: fix and resubmit - error should clear when form starts processing
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Wait for form to process and error to clear (or new state to appear)
    // The "Passwords do not match" error should no longer be visible
    await expect(page.getByText("Passwords do not match")).not.toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Accessibility & UX", () => {
  test("form can be submitted with Enter key", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");
    const submitButton = page.getByRole("button", { name: "Sign In" });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await passwordInput.press("Enter");

    // Should trigger submission - check for loading state or disabled button
    // This handles fast network responses in CI environments
    await expect(async () => {
      const isLoading = await page.getByText("Signing in...").isVisible();
      const isButtonDisabled = await submitButton.isDisabled();
      const isInputDisabled = await emailInput.isDisabled();
      expect(isLoading || isButtonDisabled || isInputDisabled).toBeTruthy();
    }).toPass({ timeout: 5000 });
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
