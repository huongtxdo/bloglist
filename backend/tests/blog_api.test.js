const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('GET', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 10000)

  test('GET to /api/blogs URL', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('The unique identifier property is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog).toBeDefined()
  })
})

describe('POST', () => {
  test('POST to /api/blogs URL', async () => {
    const newBlog = {
      title: 'A blog created for the purpose of testing HTTP POST',
      author: 'Huong',
      url: 'www.growl.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    expect(titles).toContain(
      'A blog created for the purpose of testing HTTP POST'
    )
  })

  test('POST without likes will default to likes = 0', async () => {
    const newBlog = {
      title: "Rocky's diary",
      author: 'Rocky',
      url: 'www.meomeo.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find((blog) => blog.title === `Rocky's diary`)

    expect(addedBlog.likes).toBe(0)
  })

  test('POST to /api/blogs without title returns 404', async () => {
    const newBlog = {
      author: 'Rocky',
      url: 'www.meomeo.com',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('POST to /api/blogs without url returns 404', async () => {
    const newBlog = {
      title: "Rocky's diary",
      author: 'Rocky',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

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

afterAll(async () => {
  await mongoose.connection.close()
})
