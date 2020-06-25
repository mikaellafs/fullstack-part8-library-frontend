import React, { useState, useEffect } from 'react'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { useLazyQuery, useSubscription } from '@apollo/client'

const Recommend = (props) => {
	const [books, setBooks] = useState([])
	const [getBooks, { data }] = useLazyQuery(ALL_BOOKS, {
		onCompleted: () => setBooks(data.allBooks)
	})

	useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
			const addedBook = subscriptionData.data.bookAdded
			if(addedBook.genres.includes(props.user.favoriteGenre))
				setBooks(books.concat(addedBook))
		}
	})

	let favorite = props.user ? props.user.favoriteGenre : null

	useEffect(() => {
		getBooks({
			variables: { genre: favorite }
		})
	}, [favorite, getBooks])

	if (!props.show) {
		return null
	}
	return (
		<div>
			<h2>books</h2>
			books in your favorite genre <b>{favorite}</b>
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
					{books.map(a =>
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default Recommend