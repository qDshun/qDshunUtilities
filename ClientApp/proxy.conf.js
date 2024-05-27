const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/api/identity"
   ],
    target: "https://localhost:7297",
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
