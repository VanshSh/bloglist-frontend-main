import axios from 'axios'
const baseURL = '/api/login'

const login = async (credential) => {
  const response = await axios.post(baseURL, credential)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }
