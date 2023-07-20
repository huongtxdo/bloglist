import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addNewBlog}>
      <div>
        title:
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="add title"
        />
      </div>
      <div>
        author:
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="add author"
        />
      </div>
      <div>
        url:
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="add url"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default NewBlogForm
