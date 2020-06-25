import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const SetBirthForm = ({authors}) => {
	const [author, setAuthor] = useState(authors.length>0 ? authors[0].name : null)

	const [setBirthYear] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: (error) => {
			console.log(error)
			//setError(error.graphQLErrors[0].message)
		}
	})

	const submit = (event) => {
		event.preventDefault()

		setBirthYear({
			variables: {
				author: author,
				year: parseInt(event.target.year.value)
			}
		})

		event.target.year.value = ""
	}

	return (
		<div>
			<h3>Set birthyear</h3>
			<form onSubmit={submit}>
				<select onChange ={(event) => setAuthor(event.target.value)}>
					{authors.map((a,i) => 
						<option key ={i} value = {a.name}>{a.name}</option>)}
				</select>
				<div>
					born
					<input id="year" type="number">
					</input>
				</div>
				<button>update author</button>
			</form>
		</div>
	)
}

export default SetBirthForm