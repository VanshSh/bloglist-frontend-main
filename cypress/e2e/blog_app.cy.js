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

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('vansh2701')
      cy.get('#password').type('vansh123')
      cy.get('#loginbtn').click()

      cy.get('#notificationdiv')
        .should('exist')
        .should('contain', 'Successfully logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('vansh2701')
      cy.get('#password').type('wrongpassword')
      cy.get('#loginbtn').click()

      cy.get('#notificationdiv')
        .should('exist')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('vansh2701')
      cy.get('#password').type('vansh123')
      cy.get('#loginbtn').click()
    })

    it('A blog can be created', function () {
      cy.get('#createnewblog').click()
      cy.get('#newblogtitle').type('Test Blog')
      cy.get('#newblogauthor').type('Test Author')
      cy.get('#newblogurl').type('https://testurl.com')
      cy.get('#submitnewblogbtn').click()

      cy.get('#notificationdiv').should('exist')
    })

    it('A blog can be liked', function () {
      cy.get('#createnewblog').click()
      cy.get('#newblogtitle').type('Test Blog')
      cy.get('#newblogauthor').type('Test Author')
      cy.get('#newblogurl').type('https://testurl.com')
      cy.get('#submitnewblogbtn').click()
      cy.contains('view').click()
      cy.get('#like-button').click()
      cy.contains('1')
    })
    it.only('User who created the blog can delete it', function () {
      cy.get('#createnewblog').click()
      cy.get('#newblogtitle').type('Test HTML CSS')
      cy.get('#newblogauthor').type('Test Author Name')
      cy.get('#newblogurl').type('https://testurl.com')
      cy.get('#submitnewblogbtn').click()
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })
  })
})
