const checkCookie = () => {
  document.cookie = 'testcookie';
  let cookieEnabled = document.cookie.indexOf('testcookie') !== -1;

  return cookieEnabled;
};
export default checkCookie;
