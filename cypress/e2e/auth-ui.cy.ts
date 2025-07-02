// cypress/e2e/auth-ui.cy.ts
// UI-focused authentication tests

describe('UniNest Authentication UI Tests', () => {
  beforeEach(() => {
    // Clear any existing sessions
    cy.window().then((win: any) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
  });

  describe('1. Sign Up Form UI', () => {
    beforeEach(() => {
      cy.visit('/auth/signup');
    });

    it('should display all required form fields', () => {
      cy.get('[data-testid="name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="role-selection"]').should('be.visible');
      cy.get('[data-testid="seeker-role"]').should('be.visible');
      cy.get('[data-testid="host-role"]').should('be.visible');
      cy.get('[data-testid="signup-button"]').should('be.visible');
      cy.get('[data-testid="google-signup-button"]').should('be.visible');
      cy.get('[data-testid="github-signup-button"]').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('[data-testid="signup-button"]').click();
      
      // HTML5 validation should prevent submission
      cy.get('[data-testid="name-input"]:invalid').should('exist');
      cy.get('[data-testid="email-input"]:invalid').should('exist');
      cy.get('[data-testid="password-input"]:invalid').should('exist');
    });

    it('should validate email format', () => {
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signup-button"]').click();
      
      // Email should be invalid
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

    it('should allow role selection', () => {
      // Test that seeker role is initially selected (default value="seeker")
      cy.get('[data-testid="seeker-role"]').should('have.attr', 'data-state', 'checked');
      
      // Test host role selection
      cy.get('[data-testid="host-role"]').click();
      cy.get('[data-testid="host-role"]').should('have.attr', 'data-state', 'checked');
      cy.get('[data-testid="seeker-role"]').should('have.attr', 'data-state', 'unchecked');
    });
  });

  describe('2. Sign In Form UI', () => {
    beforeEach(() => {
      cy.visit('/auth/signin');
    });

    it('should display all required form fields', () => {
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="signin-button"]').should('be.visible');
      cy.get('[data-testid="google-signin-button"]').should('be.visible');
      cy.get('[data-testid="github-signin-button"]').should('be.visible');
      cy.contains('Forgot password?').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('[data-testid="signin-button"]').click();
      
      // HTML5 validation should prevent submission
      cy.get('[data-testid="email-input"]:invalid').should('exist');
      cy.get('[data-testid="password-input"]:invalid').should('exist');
    });

    it('should validate email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signin-button"]').click();
      
      // Email should be invalid
      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('should navigate to forgot password', () => {
      cy.contains('Forgot password?').click();
      cy.url().should('include', '/auth/forgot-password');
    });

    it('should navigate to sign up', () => {
      cy.contains('Sign up').click();
      cy.url().should('include', '/auth/signup');
    });
  });

  describe('3. Protected Route Access', () => {
    it('should redirect unauthenticated users to signin', () => {
      // Test dashboard redirect
      cy.visit('/dashboard');
      cy.url().should('include', '/auth/signin');
      
      // Test listings/new redirect
      cy.visit('/listings/new');
      cy.url().should('include', '/auth/signin');
      
      // Test messages redirect
      cy.visit('/messages');
      cy.url().should('include', '/auth/signin');
      
      // Test profile redirect
      cy.visit('/profile');
      cy.url().should('include', '/auth/signin');
    });
  });

  describe('4. Forgot Password Form', () => {
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
      
      // Email field should be required
      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('should navigate back to signin', () => {
      cy.contains('Back to sign in').click();
      cy.url().should('include', '/auth/signin');
    });
  });

  describe('5. Reset Password Form', () => {
    it('should redirect to forgot password without valid session', () => {
      cy.visit('/auth/reset-password');
      cy.url().should('include', '/auth/forgot-password');
    });

    it('should display reset password form with valid session', () => {
      // Mock password reset session
      cy.window().then((win: any) => {
        win.localStorage.setItem('supabase.auth.token', JSON.stringify({
          access_token: 'mock_reset_token',
          refresh_token: 'mock_refresh_token',
          user: { id: 'mock_user_id', email: 'test@example.com' }
        }));
      });
      
      cy.visit('/auth/reset-password?token=mock-token&type=recovery');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirm-password-input"]').should('be.visible');
      cy.get('[data-testid="reset-password-button"]').should('be.visible');
    });
  });

  describe('6. Navigation and UI Flow', () => {
    it('should have working navigation links', () => {
      // From signin to signup
      cy.visit('/auth/signin');
      cy.contains('Sign up').click();
      cy.url().should('include', '/auth/signup');
      
      // From signup to signin
      cy.contains('Sign in').click();
      cy.url().should('include', '/auth/signin');
      
      // To forgot password
      cy.contains('Forgot password?').click();
      cy.url().should('include', '/auth/forgot-password');
    });

    it('should display correct page titles and descriptions', () => {
      cy.visit('/auth/signin');
      cy.contains('Welcome back').should('be.visible');
      cy.contains('Sign in to your UniNest account').should('be.visible');
      
      cy.visit('/auth/signup');
      cy.contains('Join UniNest').should('be.visible');
      cy.contains('Create your account to start finding or listing').should('be.visible');
      
      cy.visit('/auth/forgot-password');
      cy.contains('Forgot your password?').should('be.visible');
    });
  });

  describe('7. OAuth Buttons', () => {
    it('should have Google OAuth buttons', () => {
      cy.visit('/auth/signin');
      cy.get('[data-testid="google-signin-button"]').should('contain', 'Google');
      
      cy.visit('/auth/signup');
      cy.get('[data-testid="google-signup-button"]').should('contain', 'Google');
    });

    it('should have GitHub OAuth buttons', () => {
      cy.visit('/auth/signin');
      cy.get('[data-testid="github-signin-button"]').should('contain', 'GitHub');
      
      cy.visit('/auth/signup');
      cy.get('[data-testid="github-signup-button"]').should('contain', 'GitHub');
    });
  });
});
