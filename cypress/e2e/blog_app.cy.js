describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Vansh Sharma',
      username: 'vansh2701',
      password: 'vansh123',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
    cy.get('#loginbtn').should('exist')
  })
})
