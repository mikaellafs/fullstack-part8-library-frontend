
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription, useQuery } from '@apollo/client'
import { ALL_BOOKS, USER_LOGGED, GET_USER } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  useQuery(GET_USER, {
    onCompleted: (data) =>{
      setUser(data.me)
    }
  })
  const client = useApolloClient()
  const result = useQuery(ALL_BOOKS)

  useEffect(() => {
    const token = localStorage.getItem('libraryUserToken')
    if ( token ) {
      setToken(token)
    }
  }, [])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS, genre: null })
    if (!includedIn(dataInStore.allBooks, addedBook)){
      client.writeQuery({
        query: ALL_BOOKS,
        variables: { genre: null },
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })

      for(let i  = 0; i< addedBook.genres.length; i++){
        let data = client.readQuery({ query: ALL_BOOKS, genre: addedBook.genres[i] })
        client.writeQuery({
          query: ALL_BOOKS,
          variables: { genre: addedBook.genres[i] },
          data: { allBooks : data.allBooks.concat(addedBook) }
        })
      }
    }  
  }

  useSubscription(USER_LOGGED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const loggedUser = subscriptionData.data.userLoggedIn
      
      client.writeQuery({
        query: GET_USER,
        data: { me: loggedUser }
      })

      setUser(loggedUser)
      
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token? <button onClick={() => setPage('add')}>add book</button> : null}
        {token? <button onClick={() => setPage('recommend')}>recommend</button> : null}
        {<button onClick={token? logout : () => setPage('login')}>
          {token ? 'logout' : 'login'}</button>}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
        updateCacheWith ={updateCacheWith}
        books ={result.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
        updateCacheWith = {updateCacheWith}
      />

      <Login
        show={page === 'login'}
        setToken = {setToken}
      />

      <Recommend
        show={page === 'recommend'}
        user ={user}
        client = {client}
      />

    </div>
  )
}

export default App