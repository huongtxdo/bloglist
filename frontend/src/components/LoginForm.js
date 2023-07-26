const LoginForm = ({
  handleSubmit,
  username,
  handleUsername,
  password,
  handlePassword,
}) => (
  <div>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input id="username" value={username} onChange={handleUsername} />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePassword}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  </div>
)

export default LoginForm
