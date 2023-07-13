const Notification = ({ message, isErrorMessage }) =>
  message && (
    <div className={isErrorMessage ? 'error' : 'notification'}>{message}</div>
  )

export default Notification
