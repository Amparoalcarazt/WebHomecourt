/*describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
        cy.visit('https://example.cypress.io')

        cy.contains('type').click() // Lets click on an elem w specified type

        cy.url().should('include', '/commands/actions')
    })
})*/

describe('Login Page', () => {
    // Goes to correct project url 
    beforeEach(() => {
        cy.visit('/login')
    })

    // Checks that the page loads the visible elements 
    it('loads the login page', () => {
        cy.contains('Hi, Lakers fan!').should('be.visible')
        cy.contains("So glad you're back.").should('be.visible')
        cy.contains('Sign-in').should('be.visible') // Button 
        cy.contains("Don't have an account yet?").should('be.visible') // Basic setup for create account
    })

    // Checks that it does show errors without email and pwd 
    it('shows error if email and password are empty', () => {
        cy.contains('Sign-in').click() // Clicks sign in button
        cy.contains('Please provide your email and password').should('be.visible')
    })

    // Checks no email given 
    it('shows error email empty', () => {
        cy.get('input[type="password"]').type('fakeLakerPassword123') // Simulates password
        cy.contains('Sign-in').click()

        // Error 
        cy.contains('Please provide your email').should('be.visible')
    })

    // Checks no password given
    it('shows an error when password is missing', () => {
        cy.get('input[type="email"]').type('fakeTest@lakerscourt.com')
        cy.contains('Sign-in').click()

        cy.contains('Please provide your password').should('be.visible')
    })

    // Redirect to register 
    it('links to register new account', () => {
        cy.contains('Sign Up Now').should('have.attr', 'href', '/register')
    })
})