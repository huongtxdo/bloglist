import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const user = {
    name: 'ParabolaArc',
    id: 123,
  }
  const blog = {
    title: 'Blog 1',
    author: 'Huong',
    likes: 10,
    url: 'www.testBlog.com',
    user: {
      name: 'ParabolaArc',
      id: 123,
    },
  }

  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Blog 1')
  expect(div).toHaveTextContent('Huong')
  expect(div).not.toHaveTextContent(10)
  expect(div).not.toHaveTextContent('www.testBlog.com')
})

test('clicking "view" shows info about URL and likes', async () => {
  const user = {
    name: 'ParabolaArc',
    id: 123,
  }
  const blog = {
    title: 'Blog 1',
    author: 'Huong',
    likes: 10,
    url: 'www.testBlog.com',
    user: {
      name: 'ParabolaArc',
      id: 123,
    },
  }
  const { container } = render(<Blog blog={blog} user={user} />)
  const viewButton = screen.getByText('view')
  const clicker = userEvent.setup()

  await clicker.click(viewButton)

  const div = container.querySelector('.view-info')

  expect(div).toHaveTextContent('www.testBlog.com')
  expect(div).toHaveTextContent(10)
})

test('clicking like button twice works as normal', async () => {
  const user = {
    name: 'ParabolaArc',
    id: 123,
  }
  const blog = {
    title: 'Blog 1',
    author: 'Huong',
    likes: 10,
    url: 'www.testBlog.com',
    user: {
      name: 'ParabolaArc',
      id: 123,
    },
  }
  const incrementLikes = jest.fn()
  render(<Blog blog={blog} user={user} incrementLikes={incrementLikes} />)
  const viewButton = screen.getByText('view')
  const clicker = userEvent.setup()

  await clicker.click(viewButton)
  const likeButton = screen.getByText('like')

  await clicker.click(likeButton)
  await clicker.click(likeButton)

  expect(incrementLikes.mock.calls).toHaveLength(2)
})
