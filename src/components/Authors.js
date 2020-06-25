import { ALL_AUTHORS, BOOK_ADDED } from '../queries' 
import { useQuery, useSubscription } from '@apollo/client'
import React, { useState } from 'react'
import SetBirthForm from './SetBirthForm'

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  const result = useQuery(ALL_AUTHORS, {
    onCompleted: (data) =>{
      setAuthors(data.allAuthors)
    }
  })

  useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded

      let author = authors.find(a => a.name === addedBook.name)
			if(author){
        const updatedAuthor = {...author, bookCount: author.bookCount +1}
        setAuthors(authors.map(a => a.name === author.name? updatedAuthor : a))
      }else setAuthors(authors.concat(addedBook.author))
		}
	})

  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <SetBirthForm authors ={authors} />
    </div>
  )
}

export default Authors
