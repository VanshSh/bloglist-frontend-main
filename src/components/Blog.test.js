import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, screen } from '@testing-library/react'
import blogService from '../services/blogs'
import Blog from './Blog'
jest.mock('../services/blogs')

describe('Blog view tests', () => {
  let blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'micahelchan028',
      name: 'Michael Chan',
      id: '64bc14e31f8ad3fa0ac7a8c7',
    },
    id: '64bc163dd9dcf8d30229ffb8',
  }

  const mockHandler = jest.fn()

  test('renders title and author', () => {
    const view = render(<Blog blog={blog} />)
    expect(view.container).toHaveTextContent('React patterns - Michael Chan')
  })

  test('clicking the view button displays url and number of likes', () => {
    const view = render(<Blog blog={blog} />)
    const button = screen.getByText('view')
    fireEvent.click(button)
    expect(view.container).toHaveTextContent('https://reactpatterns.com/')
    expect(view.container).toHaveTextContent('7')
  })

  test('clicking the like button twice calls the event handler twice', async () => {
    render(<Blog blog={blog} likeHandler={mockHandler} />)

    // Find the like button
    const likeButton = screen.getByText('like')

    // Simulate two clicks on the like button
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
