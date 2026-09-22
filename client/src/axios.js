import axios from 'axios';

// Same-origin: in production Nginx serves the SPA and proxies /api on one host (ghabsa.com);
// in development the "proxy" in package.json forwards /api to the local API.
const instance = axios.create({
  baseURL: ""
});

export default instance;
