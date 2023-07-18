const LoginForm = ({
  handleSubmit,
  username,
  handleUsername,
  password,
  handlePassword,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input value={username} onChange={handleUsername} />
        </div>
        <div>
          password
          <input type="password" value={password} onChange={handlePassword} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
