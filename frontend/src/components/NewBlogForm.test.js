import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

/*Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.*/

test('Adding a new blog works', async () => {
  //   const user = {
  //     name: 'ParabolaArc',
  //     id: 123,
  //   }
  //   const blog = {
  //     title: 'Blog 1',
  //     author: 'Huong',
  //     likes: 10,
  //     url: 'www.testBlog.com',
  //     user: {
  //       name: 'ParabolaArc',
  //       id: 123,
  //     },
  //   }
  const createBlog = jest.fn()
  render(<NewBlogForm createBlog={createBlog} />)
  const clicker = userEvent.setup()

  const title = screen.getByPlaceholderText('add title')
  const author = screen.getByPlaceholderText('add author')
  const url = screen.getByPlaceholderText('add url')
  const createButton = screen.getByText('create')

  await clicker.type(title, 'Test create new blog')
  await clicker.type(author, 'Huong')
  await clicker.type(url, 'www.meomeo.com')
  await clicker.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test create new blog')
  expect(createBlog.mock.calls[0][0].author).toBe('Huong')
  expect(createBlog.mock.calls[0][0].url).toBe('www.meomeo.com')
})
