import React, { useState, useEffect } from 'react'
import { LOGIN, GET_USER, ALL_BOOKS } from '../queries'
import { useMutation } from '@apollo/client'

const Login = (props) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const [login, result] = useMutation(LOGIN, {
		refetchQueries: [ {query: GET_USER}, {query: ALL_BOOKS}],
		onError: (error) => {
			console.log(error)
		}
	})

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value
			props.setToken(token)
			localStorage.setItem('libraryUserToken', token)
		}
	}, [result.data]) // eslint-disable-line

	if (!props.show) {
		return null
	}

	const doLogin = async (event) => {
		event.preventDefault()

		login({ variables: { username, password } })
		setUsername('')
		setPassword('')
	}

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={doLogin}>
				<div>
					username
				<input value={username} onChange={({ target }) => setUsername(target.value)} />
				</div>
				<div>
					password
					<input value={password} onChange={({ target }) => setPassword(target.value)}
						type="password" />
				</div>
				<button type='submit'>login</button>
			</form>
		</div>
	)
}

export default Login