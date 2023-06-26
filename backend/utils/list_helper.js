const lodash = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) =>
  blogs.reduce((sumLikes, blog) => sumLikes + blog.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? {}
    : blogs.reduce(
        (firstBlog, secondBlog) =>
          firstBlog.likes >= secondBlog.likes ? firstBlog : secondBlog,
        blogs[0]
      )

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authorList = lodash.reduce(
    blogs,
    function (result, blog) {
      result[blog.author] || (result[blog.author] = 0)
      result[blog.author] += 1
      return result
    },
    {}
  ) //example authorList = {"Huong": 2, "Huy": 1}

  const result = { author: '', blogs: 0 }
  for (const author in authorList) {
    if (authorList[author] >= result.blogs) {
      result.author = author
      result.blogs = authorList[author]
    }
  }
  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}

  const authorList = lodash.reduce(
    blogs,
    function (result, blog) {
      result[blog.author] || (result[blog.author] = 0)
      result[blog.author] += blog.likes
      return result
    },
    {}
  ) //example authorList = {"Huong": 12, "Huy": 11}

  const result = { author: '', likes: 0 }
  for (const author in authorList) {
    if (authorList[author] >= result.likes) {
      result.author = author
      result.likes = authorList[author]
    }
  }
  return result
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
