/// <reference types="cypress" />

describe('UniNest Authentication Flows', () => {
  // Test data
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  };

  const invalidUser = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  };

  beforeEach(() => {
    // Reset database state and clear cookies
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visit home page to start fresh
    cy.visit('/');
  });

  describe('1. Sign Up Flow', () => {
    beforeEach(() => {
      cy.visit('/auth/signup');
    });

    it('should display signup form with all required fields', () => {
      cy.get('[data-testid="name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="role-selection"]').should('be.visible');
      cy.get('[data-testid="seeker-role"]').should('be.visible');
      cy.get('[data-testid="host-role"]').should('be.visible');
      cy.get('[data-testid="signup-button"]').should('be.visible');
      cy.get('[data-testid="google-signup-button"]').should('be.visible');
    });

    it('should validate required fields', () => {
      // Try to submit empty form
      cy.get('[data-testid="signup-button"]').click();
      
      // Check HTML5 validation
      cy.get('[data-testid="name-input"]:invalid').should('exist');
      cy.get('[data-testid="email-input"]:invalid').should('exist');
      cy.get('[data-testid="password-input"]:invalid').should('exist');
    });

    it('should validate email format', () => {
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signup-button"]').click();
      
      // Check HTML5 email validation
      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('should validate password minimum length', () => {
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('123'); // Too short
      cy.get('[data-testid="signup-button"]').click();
      
      // Check for password length error message in toast
      cy.contains('Password must be at least 6 characters long').should('be.visible');
    });

    it('should successfully create account with valid data', () => {
      // Fill out the form
      cy.get('[data-testid="name-input"]').type(testUser.name);
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="seeker-role"]').click();
      
      // Submit form
      cy.get('[data-testid="signup-button"]').click();
      
      // Should redirect to signin page and show success message
      cy.url().should('include', '/auth/signin');
      cy.contains('Account created successfully').should('be.visible');
    });

    it('should select host role and create host account', () => {
      cy.get('[data-testid="name-input"]').type('Host User');
      cy.get('[data-testid="email-input"]').type('host@example.com');
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="host-role"]').click();
      
      cy.get('[data-testid="signup-button"]').click();
      
      cy.url().should('include', '/auth/signin');
      cy.contains('Account created successfully').should('be.visible');
    });

    it('should handle signup errors gracefully', () => {
      // Try to sign up with existing email
      cy.get('[data-testid="name-input"]').type(testUser.name);
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      
      cy.get('[data-testid="signup-button"]').click();
      
      // Should show error message for duplicate email
      cy.contains('User already registered').should('be.visible');
    });

    it('should provide Google OAuth signup option', () => {
      cy.get('[data-testid="google-signup-button"]').should('be.visible');
      cy.get('[data-testid="google-signup-button"]').contains('Google');
    });
  });

  describe('2. Sign In Flow', () => {
    beforeEach(() => {
      cy.visit('/auth/signin');
    });

    it('should display signin form with all required fields', () => {
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="signin-button"]').should('be.visible');
      cy.get('[data-testid="google-signin-button"]').should('be.visible');
      cy.contains('Forgot password?').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('[data-testid="signin-button"]').click();
      
      cy.get('[data-testid="email-input"]:invalid').should('exist');
      cy.get('[data-testid="password-input"]:invalid').should('exist');
    });

    it('should validate email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signin-button"]').click();
      
      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('should handle invalid credentials', () => {
      cy.get('[data-testid="email-input"]').type(invalidUser.email);
      cy.get('[data-testid="password-input"]').type(invalidUser.password);
      cy.get('[data-testid="signin-button"]').click();
      
      cy.contains('Invalid login credentials').should('be.visible');
    });

    it('should successfully sign in with valid credentials', () => {
      // First create a verified user account
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="signin-button"]').click();
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Signed in successfully').should('be.visible');
    });

    it('should redirect to intended route after signin', () => {
      // Try to access protected route first
      cy.visit('/listings/new');
      
      // Should redirect to signin with redirectTo parameter
      cy.url().should('include', '/auth/signin');
      cy.url().should('include', 'redirectTo=%2Flistings%2Fnew');
      
      // Sign in
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'host');
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="signin-button"]').click();
      
      // Should redirect to originally requested route
      cy.url().should('include', '/listings/new');
    });

    it('should persist session across page reloads', () => {
      // Sign in first
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      cy.signIn(testUser.email, testUser.password);
      
      // Reload page
      cy.reload();
      
      // Should still be signed in
      cy.url().should('include', '/dashboard');
    });

    it('should provide forgot password link', () => {
      cy.contains('Forgot password?').click();
      cy.url().should('include', '/auth/forgot-password');
    });
  });

  describe('3. Protected Route Access', () => {
    it('should redirect unauthenticated users to signin', () => {
      const protectedRoutes = ['/dashboard', '/listings/new', '/profile', '/messages'];
      
      protectedRoutes.forEach(route => {
        cy.visit(route);
        cy.url().should('include', '/auth/signin');
        cy.url().should('include', `redirectTo=${encodeURIComponent(route)}`);
      });
    });

    it('should allow authenticated users to access protected routes', () => {
      // Create and sign in user
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'host');
      cy.signIn(testUser.email, testUser.password);
      
      // Visit protected routes
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
      
      cy.visit('/listings/new');
      cy.url().should('include', '/listings/new');
      
      cy.visit('/profile');
      cy.url().should('include', '/profile');
      
      cy.visit('/messages');
      cy.url().should('include', '/messages');
    });

    it('should redirect authenticated users away from auth pages', () => {
      // Sign in first
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      cy.signIn(testUser.email, testUser.password);
      
      // Try to visit auth pages
      cy.visit('/auth/signin');
      cy.url().should('include', '/dashboard');
      
      cy.visit('/auth/signup');
      cy.url().should('include', '/dashboard');
    });

    it('should enforce role-based access for host features', () => {
      // Create seeker account
      cy.createTestUser('seeker@example.com', testUser.password, 'Seeker User', 'seeker');
      cy.signIn('seeker@example.com', testUser.password);
      
      // Seeker should not access host-only dashboard
      cy.visit('/dashboard');
      cy.url().should('not.include', '/dashboard');
      cy.url().should('include', '/'); // Redirect to home
    });
  });

  describe('4. Forgot Password & Reset Flow', () => {
    beforeEach(() => {
      cy.visit('/auth/forgot-password');
    });

    it('should display forgot password form', () => {
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="send-reset-email-button"]').should('be.visible');
      cy.contains('Back to sign in').should('be.visible');
    });

    it('should validate email field', () => {
      cy.get('[data-testid="send-reset-email-button"]').click();
      cy.get('[data-testid="email-input"]:invalid').should('exist');
      
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="send-reset-email-button"]').click();
      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('should handle invalid email gracefully', () => {
      cy.get('[data-testid="email-input"]').type('nonexistent@example.com');
      cy.get('[data-testid="send-reset-email-button"]').click();
      
      // Should show success message even for invalid email (security)
      cy.contains('Password reset email sent').should('be.visible');
    });

    it('should send reset email for valid email', () => {
      // Create user first
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="send-reset-email-button"]').click();
      
      cy.contains('Password reset email sent').should('be.visible');
      cy.contains('Check your email').should('be.visible');
    });

    it('should allow user to try again', () => {
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="send-reset-email-button"]').click();
      
      cy.contains('Try again').click();
      cy.get('[data-testid="email-input"]').should('be.visible');
    });

    it('should navigate back to signin', () => {
      cy.contains('Back to sign in').click();
      cy.url().should('include', '/auth/signin');
    });
  });

  describe('5. Password Reset Flow', () => {
    it('should display reset password form with valid session', () => {
      // Simulate coming from reset email link
      cy.mockPasswordResetSession();
      cy.visit('/auth/reset-password');
      
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirm-password-input"]').should('be.visible');
      cy.get('[data-testid="reset-password-button"]').should('be.visible');
    });

    it('should redirect to forgot password without valid session', () => {
      cy.visit('/auth/reset-password');
      
      // Should redirect to forgot password page
      cy.url().should('include', '/auth/forgot-password');
      cy.contains('Invalid or expired reset link').should('be.visible');
    });

    it('should validate password requirements', () => {
      cy.mockPasswordResetSession();
      cy.visit('/auth/reset-password');
      
      // Test minimum length
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="confirm-password-input"]').type('123');
      cy.get('[data-testid="reset-password-button"]').click();
      
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });

    it('should validate password confirmation match', () => {
      cy.mockPasswordResetSession();
      cy.visit('/auth/reset-password');
      
      cy.get('[data-testid="password-input"]').type('newpassword123');
      cy.get('[data-testid="confirm-password-input"]').type('differentpassword');
      cy.get('[data-testid="reset-password-button"]').click();
      
      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should successfully reset password', () => {
      cy.mockPasswordResetSession();
      cy.visit('/auth/reset-password');
      
      const newPassword = 'newpassword123';
      cy.get('[data-testid="password-input"]').type(newPassword);
      cy.get('[data-testid="confirm-password-input"]').type(newPassword);
      cy.get('[data-testid="reset-password-button"]').click();
      
      cy.contains('Password updated successfully').should('be.visible');
      cy.url().should('include', '/auth/signin');
    });
  });

  describe('6. Sign Out Flow', () => {
    beforeEach(() => {
      // Sign in first
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      cy.signIn(testUser.email, testUser.password);
    });

    it('should sign out from header navigation', () => {
      cy.visit('/dashboard');
      
      // Find and click sign out button
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="signout-button"]').click();
      
      // Should redirect to signin page
      cy.url().should('include', '/auth/signin');
    });

    it('should clear session after signout', () => {
      cy.visit('/dashboard');
      
      // Sign out
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="signout-button"]').click();
      
      // Try to access protected route
      cy.visit('/dashboard');
      cy.url().should('include', '/auth/signin');
    });

    it('should clear session data from storage', () => {
      cy.visit('/dashboard');
      
      // Check that session exists
      cy.window().its('localStorage').should('exist');
      
      // Sign out
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="signout-button"]').click();
      
      // Check that auth data is cleared
      cy.getAllLocalStorage().should('be.empty');
    });
  });

  describe('7. OAuth Flow (Google)', () => {
    it('should provide Google OAuth signin option', () => {
      cy.visit('/auth/signin');
      cy.get('[data-testid="google-signin-button"]').should('be.visible');
      cy.get('[data-testid="google-signin-button"]').should('contain', 'Google');
    });

    it('should provide Google OAuth signup option', () => {
      cy.visit('/auth/signup');
      cy.get('[data-testid="google-signup-button"]').should('be.visible');
      cy.get('[data-testid="google-signup-button"]').should('contain', 'Google');
    });

    it('should handle OAuth callback', () => {
      // Mock successful OAuth callback
      cy.mockOAuthCallback();
      cy.visit('/auth/callback');
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Signed in successfully').should('be.visible');
    });

    it('should handle OAuth callback errors', () => {
      // Mock failed OAuth callback
      cy.mockOAuthCallbackError();
      cy.visit('/auth/callback');
      
      // Should redirect to signin with error
      cy.url().should('include', '/auth/signin');
      cy.contains('Authentication failed').should('be.visible');
    });
  });

  describe('8. Profile Creation & Verification', () => {
    it('should create profile record on successful signup', () => {
      cy.visit('/auth/signup');
      
      cy.get('[data-testid="name-input"]').type('New User');
      cy.get('[data-testid="email-input"]').type('newuser@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="seeker-role"]').click();
      cy.get('[data-testid="signup-button"]').click();
      
      // After email verification, profile should exist
      cy.verifyUserProfile('newuser@example.com', {
        name: 'New User',
        role: 'seeker',
        email: 'newuser@example.com'
      });
    });

    it('should handle profile creation for OAuth users', () => {
      // Mock OAuth signin that creates profile
      cy.mockOAuthSigninWithProfile({
        email: 'oauth@example.com',
        name: 'OAuth User'
      });
      
      cy.visit('/auth/callback');
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      
      // Profile should be created
      cy.verifyUserProfile('oauth@example.com', {
        name: 'OAuth User',
        email: 'oauth@example.com'
      });
    });
  });

  describe('9. Session Management', () => {
    it('should maintain session across browser tabs', () => {
      // Sign in
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      cy.signIn(testUser.email, testUser.password);
      
      // Open new tab and check session
      cy.window().then((win) => {
        win.open('/dashboard');
      });
      
      // Should still be authenticated
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('should handle session expiration gracefully', () => {
      // Sign in
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      cy.signIn(testUser.email, testUser.password);
      
      // Mock session expiration
      cy.mockSessionExpiration();
      
      // Try to access protected route
      cy.visit('/dashboard');
      
      // Should redirect to signin
      cy.url().should('include', '/auth/signin');
    });

    it('should refresh session automatically', () => {
      // Sign in
      cy.createTestUser(testUser.email, testUser.password, testUser.name, 'seeker');
      cy.signIn(testUser.email, testUser.password);
      
      // Wait for session refresh
      cy.wait(1000);
      
      // Session should still be valid
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });
  });
});
