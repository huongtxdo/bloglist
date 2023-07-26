describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Huong Do',
      username: 'justkidney',
      password: 'secretpass',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correction credentials', function () {
      cy.get('#username').type('justkidney')
      cy.get('#password').type('secretpass')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'Login successful!')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('contain', 'Huong Do logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('justkidney')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('when first user logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'justkidney', password: 'secretpass' })
    })

    it('A blog can be created', function () {
      cy.get('.toggleCreate').contains('create new blog').click()
      cy.get('#title').type('first blog')
      cy.get('#author').type('Yksi')
      cy.get('#url').type('www.one.com')
      cy.contains('create').click()

      cy.contains('first blog Yksi')
    })

    describe('and created some blogs', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          author: 'Yksi',
          url: 'www.one.com',
        })
        cy.createBlog({
          title: 'second blog',
          author: 'Kaksi',
          url: 'www.two.com',
        })
        cy.createBlog({
          title: 'third blog',
          author: 'Kolme',
          url: 'www.three.com',
        })
      })

      it('Users can like a blog', function () {
        // 'third blog' has 3 likes
        cy.get('.blog').contains('third blog').contains('view').click()
        cy.get('.blog')
          .contains('third blog')
          .contains('like')
          .click()
          .click()
          .click()
        // 'first blog' has 1 like and 'second blog' has 0 like
        cy.get('.blog').contains('first blog').contains('view').click()
        cy.get('.blog').contains('first blog').contains('like').click()

        // cy.get('.blog').first().should('contain', 'third blog')
        // cy.get('.blog').last().should('contain', 'second blog')
        cy.get('.blog').eq(0).should('contain', 'third blog')
        cy.get('.blog').eq(1).should('contain', 'first blog')
        cy.get('.blog').eq(2).should('contain', 'second blog')
      })

      it('Creator can delete their blog', function () {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.on('window:confirm', () => true)

        cy.get('html').should('not.contain', 'first blog')
      })

      it('second user cannot see the delete button', function () {
        // first user logged out
        cy.contains('logout').click()
        // create second user
        const user = {
          name: 'Rocky',
          username: 'parabolaarc',
          password: 'matkhau',
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.visit('')
        // second user logged in
        cy.login({ username: 'parabolaarc', password: 'matkhau' })

        cy.contains('view').click()
        cy.get('.view-info').should('not.contain', 'delete')
      })

      it('blogs are ordered by number of likes', function () {})
    })
  })
})
