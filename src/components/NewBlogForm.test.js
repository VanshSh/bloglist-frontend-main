import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import blogService from '../services/blogs'
jest.mock('../services/blogs')

describe('NewBlogForm component', () => {
  test('form calls the event handler with the right details when a new blog is created', async () => {
    const setNotificationHandler = jest.fn()
    const setAllBlogs = jest.fn()

    // Render the NewBlogForm component with mocked event handlers
    render(
      <NewBlogForm
        setNotificationHandler={setNotificationHandler}
        setAllBlogs={setAllBlogs}
        allBlogs={[]}
      />
    )

    // Find the input fields and the submit button
    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('create')

    // Enter values into the input fields
    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    fireEvent.change(urlInput, { target: { value: 'https://test-url.com' } })

    // Simulate form submission by clicking the submit button
    fireEvent.click(submitButton)

    // Check that the event handler is called once with the correct blog details
    expect(blogService.createNewBlog).toHaveBeenCalledTimes(1)
    expect(blogService.createNewBlog).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'https://test-url.com',
    })
  })
})
