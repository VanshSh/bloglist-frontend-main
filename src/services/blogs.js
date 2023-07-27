import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async (jwtToken) => {
  let headersList = {
    Authorization: `Bearer ${jwtToken}`,
  }
  const request = axios.get(baseUrl, {
    method: 'GET',
    headers: headersList,
  })
  return request.then((response) => response.data)
}

const createNewBlog = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const updateBlog = async (newBlog, like) => {
  const newBlogObj = {
    user: newBlog.user.id,
    likes: like,
    author: newBlog.author,
    title: newBlog.title,
    url: newBlog.url,
  }
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(
    `${baseUrl}/${newBlog.id}`,
    newBlogObj,
    config
  )
  return response.data
}

// To delete the blog
const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, createNewBlog, updateBlog, deleteBlog }
