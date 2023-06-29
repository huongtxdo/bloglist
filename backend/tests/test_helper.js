const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Huong',
    url: 'www.meomeo.com',
    likes: 11,
  },
  {
    title: 'Second blog',
    author: 'Huy',
    url: 'www.gaugau.com',
    likes: 1,
  },
  {
    title: 'Third blog',
    author: 'Rocky',
    url: 'www.mlemmlem.com',
    likes: 100,
  },
]

module.exports = { initialBlogs }
