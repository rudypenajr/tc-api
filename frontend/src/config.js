const config = {
  development: {
    apiUrl: "http://localhost:8080",
  },
  production: {
    apiUrl: "https://api.example.com",
  },
};

const env = process.env.NODE_ENV || "development";
export default config[env];
