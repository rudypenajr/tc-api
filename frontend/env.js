const loadEnv = async () => {
  const response = await fetch("/env.js");
  const env = await response.text();
  return new Function(env)().REACT_APP_API_URL;
};

loadEnv().then((apiUrl) => {
  console.log("API URL:", apiUrl);
  // Use apiUrl for API calls
});
