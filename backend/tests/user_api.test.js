const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const blog = require('../models/blog')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

describe('POST', () => {
  test('POST to /api/blogs: Add new blog', async () => {
    const blogsAtStart = await Blog.find({})

    const newBlog = {
      title: 'Blog posted by root',
      author: 'Huong',
      url: 'www.groot.com',
      likes: 100,
    }

    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${result.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toContain('Blog posted by root')
  })

  test('POST without likes will default to likes = 0', async () => {
    const blogsAtStart = await Blog.find({})

    const newBlog = {
      title: 'A blog without likes',
      author: 'Huong',
      url: 'www.groot.com',
    }

    const returnedToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${returnedToken.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(savedBlog.body.likes).toEqual(0)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toContain('A blog without likes')
  })

  test('POST to /api/blogs without title returns 404', async () => {
    const newBlog = {
      author: 'Huong',
      url: 'www.groot.com',
      likes: 100,
    }

    const returnedToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${returnedToken.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('POST to /api/blogs without url returns 404', async () => {
    const newBlog = {
      title: 'Blog posted by root',
      author: 'Huong',
    }

    const returnedToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'secret' })

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${returnedToken.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('POST to /api/blogs without a token returns 401', async () => {
    const newBlog = {
      title: 'Blog posted by root',
      author: 'Huong',
      url: 'www.groot.com',
      likes: 100,
    }

    await api.post('/api/login').send({ username: 'root', password: 'secret' })

    await api.post('/api/blogs').send(newBlog).expect(401)
  })
})

/*
describe('DELETE', () => {
  test('DELETE to /api/blogs/:id returns status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('PUT', () => {
  test('Update to /api/blogs/:id returns status code 200 and the new blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    expect(blogToUpdate.likes).toBe(11)

    const newBlog = {
      likes: 1000,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    expect(updatedBlog.likes).toBe(1000)
  })
})
*/

afterAll(async () => {
  await mongoose.connection.close()
})
