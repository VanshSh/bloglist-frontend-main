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
    it('User who created the blog can delete it', function () {
      cy.get('#createnewblog').click()
      cy.get('#newblogtitle').type('Test HTML CSS')
      cy.get('#newblogauthor').type('Test Author Name')
      cy.get('#newblogurl').type('https://testurl.com')
      cy.get('#submitnewblogbtn').click()
      cy.contains('view').click()
      cy.contains('remove').should('exist')
    })
    describe('Blogs ordered by number of likes', function () {
      beforeEach(function () {
        cy.get('#createnewblog').click()
        cy.get('#newblogtitle').type('John Doe')
        cy.get('#newblogauthor').type('test1')
        cy.get('#newblogurl').type('https//example.com/test1')
        cy.get('#submitnewblogbtn').click()
        cy.get('#cancelBtn').click()

        cy.get('#createnewblog').click()
        cy.get('#newblogtitle').type('John Doe2')
        cy.get('#newblogauthor').type('test2')
        cy.get('#newblogurl').type('https//example.com/test2')
        cy.get('#submitnewblogbtn').click()
        cy.get('#cancelBtn').click()

        cy.get('#createnewblog').click()
        cy.get('#newblogtitle').type('John Doe3')
        cy.get('#newblogauthor').type('test3')
        cy.get('#newblogurl').type('https//example.com/test3')
        cy.get('#submitnewblogbtn').click()
        cy.get('#cancelBtn').click()

        cy.contains('test1').parent().parent().as('blog1')
        cy.contains('test2').parent().parent().as('blog2')
        cy.contains('test3').parent().parent().as('blog3')
      })

      it('they are ordered by number of likes', function () {
        cy.get('@blog1').contains('view').click()
        cy.get('@blog2').contains('view').click()
        cy.get('@blog3').contains('view').click()
        cy.get('@blog1').contains('like').as('like1')
        cy.get('@blog2').contains('like').as('like2')
        cy.get('@blog3').contains('like').as('like3')

        cy.get('@like2').click()
        cy.wait(500)
        cy.get('@like1').click()
        cy.wait(500)
        cy.get('@like1').click()
        cy.wait(500)
        cy.get('@like3').click()
        cy.wait(500)
        cy.get('@like3').click()
        cy.wait(500)
        cy.get('@like3').click()
        cy.wait(500)

        cy.get('.blog').then((blogs) => {
          cy.wrap(blogs[0]).contains('3')
          cy.wrap(blogs[1]).contains('2')
          cy.wrap(blogs[2]).contains('1')
        })
      })
    })
  })
})
