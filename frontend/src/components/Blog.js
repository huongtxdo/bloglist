import { useState } from 'react'

const Blog = ({ user, blog, incrementLikes, deleteThisBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      {visible && (
        <div className="view-info">
          {blog.url} <br />
          likes {blog.likes}
          <button id="like-button" onClick={incrementLikes}>
            like
          </button>
          <br />
          {blog.user.name} <br />
          {blog.user.id === user.id && (
            <button onClick={deleteThisBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

// Blog.propTypes = {
//   user: PropTypes.object.isRequired,
//   blog: PropTypes.object.isRequired,
//   incrementLikes: PropTypes.func.isRequired,
//   deleteThisBlog: PropTypes.func.isRequired,
// }

export default Blog
