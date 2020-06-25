import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
      author{
        name
        born
        bookCount
      }
    published
    genres
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query getBooks($author: String, $genre: String){
    allBooks(
      author: $author,
      genre: $genre
    ){
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
    addBook(
			title: $title,
			author: $author,
			published: $published,
			genres: $genres
		){
      title
      author{
        name
      }
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation setBirthYear($author: String!, $year: Int!){
    editAuthor(
			name: $author
			setBornTo: $year,
		){
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const GET_USER = gql`
  query{
    me{
      username
      favoriteGenre
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...bookDetails
    }
  }

  ${BOOK_DETAILS}
`
export const USER_LOGGED = gql`
  subscription {
    userLoggedIn{
      username
      favoriteGenre
    }
  }
`