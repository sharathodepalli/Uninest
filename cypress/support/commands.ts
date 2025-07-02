// cypress/support/commands.ts

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to create a test user
     */
    createTestUser(email: string, password: string, name: string, role: 'host' | 'seeker'): Chainable<Element>
    
    /**
     * Custom command to sign in a user
     */
    signIn(email: string, password: string): Chainable<Element>
    
    /**
     * Custom command to mock OAuth callback
     */
    mockOAuthCallback(): Chainable<Element>
    
    /**
     * Custom command to mock OAuth callback error
     */
    mockOAuthCallbackError(): Chainable<Element>
    
    /**
     * Custom command to mock password reset session
     */
    mockPasswordResetSession(): Chainable<Element>
    
    /**
     * Custom command to mock session expiration
     */
    mockSessionExpiration(): Chainable<Element>
    
    /**
     * Custom command to verify user profile
     */
    verifyUserProfile(email: string, expectedData: any): Chainable<Element>
    
    /**
     * Custom command to mock OAuth signin with profile
     */
    mockOAuthSigninWithProfile(userData: any): Chainable<Element>
  }
}

// Create a test user via Supabase API
Cypress.Commands.add('createTestUser', (email: string, password: string, name: string, role: 'host' | 'seeker') => {
  // Instead of direct API calls, use the UI to create users for more realistic testing
  cy.visit('/auth/signup');
  cy.get('[data-testid="name-input"]').type(name);
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  
  // Select role
  if (role === 'host') {
    cy.get('[data-testid="host-role"]').click();
  } else {
    cy.get('[data-testid="seeker-role"]').click();
  }
  
  cy.get('[data-testid="signup-button"]').click();
  
  // Wait for success or handle the result
  cy.url().should('not.include', '/auth/signup');
});

// Sign in command
Cypress.Commands.add('signIn', (email: string, password: string) => {
  cy.visit('/auth/signin');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="signin-button"]').click();
  
  // Wait for redirect
  cy.url().should('not.include', '/auth/signin');
});

// Mock OAuth callback
Cypress.Commands.add('mockOAuthCallback', () => {
  cy.intercept('GET', '/auth/callback*', {
    statusCode: 200,
    body: {}
  });
  
  // Mock successful session
  cy.window().then((win: any) => {
    win.localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      user: {
        id: 'mock_user_id',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        }
      }
    }));
  });
});

// Mock OAuth callback error
Cypress.Commands.add('mockOAuthCallbackError', () => {
  cy.intercept('GET', '/auth/callback*', {
    statusCode: 400,
    body: { error: 'OAuth callback failed' }
  });
});

// Mock password reset session
Cypress.Commands.add('mockPasswordResetSession', () => {
  cy.window().then((win: any) => {
    win.localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'mock_reset_token',
      refresh_token: 'mock_refresh_token',
      user: {
        id: 'mock_user_id',
        email: 'test@example.com'
      }
    }));
  });
});

// Mock session expiration
Cypress.Commands.add('mockSessionExpiration', () => {
  cy.window().then((win: any) => {
    win.localStorage.removeItem('supabase.auth.token');
    win.sessionStorage.clear();
  });
});

// Verify user profile
Cypress.Commands.add('verifyUserProfile', (email: string, expectedData: any) => {
  // For testing purposes, we'll verify profile data through the UI instead of direct API calls
  cy.visit('/profile');
  cy.get('body').should('contain', expectedData.name);
  if (expectedData.role) {
    cy.get('body').should('contain', expectedData.role === 'host' ? 'Host' : 'Seeker');
  }
});

// Mock OAuth signin with profile
Cypress.Commands.add('mockOAuthSigninWithProfile', (userData: any) => {
  cy.window().then((win: any) => {
    win.localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'mock_oauth_token',
      refresh_token: 'mock_refresh_token',
      user: {
        id: 'mock_oauth_user_id',
        email: userData.email,
        user_metadata: userData
      }
    }));
  });
});
