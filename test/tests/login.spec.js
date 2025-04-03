import { test, expect } from '@playwright/test';

// Test data
const newUser = {
  email: 'testuser@example.com',  
  password: '*securePassword123',
  isFirstLogin: true
};

const existingUser = {
  email: 'existinguser@example.com',
  password: '*existingPassword456',
  isFirstLogin: false
};

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  test('should display login form with all elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByText('Welcome back! Please enter your details.')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in with Google/i })).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot Password' })).toBeVisible();
    await expect(page.getByText('Don\'t have an account?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('should redirect first-time user to preference page', async ({ page }) => {
    // Mock API response for first-time user
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          success: true, 
          token: 'mock-token',
          isFirstLogin: true
        })
      });
    });

    // Login with new user
    await page.getByLabel('Email').fill(newUser.email);
    await page.getByLabel('Password').fill(newUser.password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Verify redirect to preference page
    await expect(page).toHaveURL('http://localhost:3000/preference');
  });

  test('should redirect returning user to dashboard', async ({ page }) => {
    // Mock API response for returning user
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          success: true, 
          token: 'mock-token',
          isFirstLogin: false
        })
      });
    });

    // Login with existing user
    await page.getByLabel('Email').fill(existingUser.email);
    await page.getByLabel('Password').fill(existingUser.password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000');
  });

  test('should handle first-time Google sign in', async ({ page }) => {
    // Mock the Google OAuth flow response before clicking the button
    await page.route('**/api/auth/google', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          success: true, 
          token: 'mock-google-token',
          isFirstLogin: true
        })
      });
    });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForNavigation();

    // Click the Google sign in button
    await page.getByRole('button', { name: /Sign in with Google/i }).click();

    // Wait for navigation with a timeout
    try {
      await navigationPromise;
      // Verify redirect to preference page
      await expect(page).toHaveURL('/preference');
    } catch (error) {
      throw new Error('Navigation after Google sign in failed: ' + error.message);
    }
  });

  test('should handle returning Google user', async ({ page }) => {
    // Mock the Google OAuth flow response before clicking the button
    await page.route('**/api/auth/google', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          success: true, 
          token: 'mock-google-token',
          isFirstLogin: false
        })
      });
    });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForNavigation();

    // Click the Google sign in button
    await page.getByRole('button', { name: /Sign in with Google/i }).click();

    // Wait for navigation with a timeout
    try {
      await navigationPromise;
      // Verify redirect to dashboard
      await expect(page).toHaveURL('/dashboard');
    } catch (error) {
      throw new Error('Navigation after Google sign in failed: ' + error.message);
    }
  });

  test('should handle Google sign in failure', async ({ page }) => {
    // Mock failed Google OAuth response
    await page.route('**/api/auth/google', async (route) => {
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ 
          success: false,
          error: 'Google authentication failed'
        })
      });
    });

    // Click the Google sign in button
    await page.getByRole('button', { name: /Sign in with Google/i }).click();
    
    // Verify error message is shown
    await expect(page.getByText('Google authentication failed')).toBeVisible();
    // Verify we stay on the login page
    await expect(page).toHaveURL('/login');
  });

  // Helper function to intercept Google OAuth requests
  async function setupGoogleOAuthMock(page, isFirstLogin) {
    await page.route('**/api/auth/google', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ 
          success: true, 
          token: 'mock-google-token',
          isFirstLogin
        })
      });
    });
  }
});

  test('should show error for empty email', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should handle remember me checkbox', async ({ page }) => {
    await page.getByLabel('Remember me').check();
    await expect(page.getByLabel('Remember me')).toBeChecked();
    
    await page.getByLabel('Remember me').uncheck();
    await expect(page.getByLabel('Remember me')).not.toBeChecked();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: 'Forgot Password' }).click();
    await expect(page).toHaveURL('http://localhost:3000/forgot-password');
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('http://localhost:3000/register');
  });
