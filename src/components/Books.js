import React, { useState, useEffect } from 'react'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { useLazyQuery, useSubscription } from '@apollo/client'

const Books = (props) => {
  const [filter, setFilter] = useState(null)
  const [genres, setGenres] = useState([])
  const [getSomeBooks, result] = useLazyQuery(ALL_BOOKS)
  const [booksToShow, setBooks] = useState([])
  const [allBooks, setAll] = useState(props.books)

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      props.updateCacheWith(addedBook)

      
      setAll(allBooks.concat(addedBook))
      if(addedBook.genres.includes(filter)){
        setBooks(booksToShow.concat(addedBook))
      }
    }
  })

  useEffect(() => {
    let genres = allBooks.reduce((listGenres, b) => {
      b.genres.map(g => listGenres.includes(g) ? null : listGenres = listGenres.concat(g))
      return listGenres
    }, [])

    setGenres(genres)
  }, [allBooks])

  const showFilteredBooks = (newFilter) => {
    setFilter(newFilter)

    if(newFilter){
      getSomeBooks({
        variables: { genre: newFilter }
      })
    }
  }

  useEffect(() => {
    if(!filter){
      setBooks(allBooks)
      return
    }

    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [filter, result.data, allBooks])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      {filter ?
        <div>
          in genre <b>{filter}</b>
        </div>
        : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map((g, i) =>
          <button key={i} onClick={() => showFilteredBooks(g)}>{g}</button>
        )}
        <button onClick={() => showFilteredBooks(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books