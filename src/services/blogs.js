import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = (jwtToken) => {
  let headersList = {
    Authorization: `Bearer ${jwtToken}`,
  }
  const request = axios.get(baseUrl, {
    method: 'GET',
    headers: headersList,
  })
  return request.then((response) => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken }
