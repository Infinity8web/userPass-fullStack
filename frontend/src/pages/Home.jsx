import { useState, useEffect } from 'react'
import api from '../api'
import Note from '../components/Note'
import '../styles/Home.css'

function Home() {
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    getNotes()
  }, [])

  const getNotes = async () => {
    try {
      const response = await api.get('/api/notes/')
      console.log(response.data)
      setNotes(response.data)
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }

  const deleteNote = async (id) => {
    try {
      const response = await api.delete(`/api/notes/delete/${id}/`)
      if (response.status === 204) {
        alert('Note deleted')
      } else {
        alert(`Failed to delete note: ${id}`)
      }
      console.log(response.data)
    } catch (error) {
      alert(error)
    }
    getNotes()
  }

  const createNote = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/api/notes/', { title, content })
      if (response.status === 201) {
        alert('Note created')
      } else {
        alert('Failed to create note')
      }
      console.log(response.data)
    } catch (error) {
      alert(error)
    }
    getNotes()
  }

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note key={note.id} note={note} deleteNote={deleteNote} />
        ))}
      </div>
      <h2>Create Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor='title'>Title:</label>
        <br />
        <input
          type='text'
          id='title'
          name='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <label htmlFor='content'>Content:</label>
        <br />
        <textarea
          type='text'
          id='content'
          name='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <br />
        <button type='submit'>Create Note</button>
      </form>
    </div>
  )
}
export default Home
