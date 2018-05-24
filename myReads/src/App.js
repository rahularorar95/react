import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import {Route ,Link} from 'react-router-dom'

class BooksApp extends React.Component {
  
  state = {
    query:'',
    SearchResults:[],
    books:[]
  }

  clear(){
    this.setState({query:'',SearchResults:[]})
  }
  componentDidMount(){
    BooksAPI.getAll().then(books=>{
      this.setState({books:books})
    })
  }

  changeShelf(book,value){
    BooksAPI.update(book,value).then(()=>{
      book.shelf=value
      this.setState(state=>({
        books:state.books.filter(tbook => tbook.id !== book.id).concat([book])
      }))
    })
  }

  searchBooks=(query)=>{
    
    if(query){
      BooksAPI.search(query).then((result)=>{
        if(result.error){
          this.setState({query:'',SearchResults:[]})
          return
        }
        result.map(book => this.state.books.filter(bk => bk.id===book.id).map(bk=> book.shelf = bk.shelf))
        result.map(book => {
          if(book.shelf){
            
          }else{
            book.shelf='None'
          }
          return book
        })
        this.setState({query:query,SearchResults:result})
        
      })
    }else{
      this.setState({query:'',SearchResults:[]})
    }
  }

  render() {

    const bookShelf= ["Currently Reading","Want To Read","Read"]
    return (
      <div className="app">
      <Route exact path='/' render={()=>(
        <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            
            {
            bookShelf.map((shelf,index)=>(
              <div key={index} className="bookshelf">
                  <h2 className="bookshelf-title">{shelf}</h2>
                  <div className="bookshelf-books">
                  <ol className="books-grid">
                  {
                this.state.books.filter(book=> book.shelf.toLowerCase()=== (shelf.split(' ').join('')).toLowerCase()).map(book=>(
                  
                  <li key={book.id}>
                   <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks !== undefined ? book.imageLinks.thumbnail:''})` }}></div>
                        <div className="book-shelf-changer">
                          <select value={book.shelf} onChange={(event)=>this.changeShelf(book,event.target.value)}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="None">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
                    </li>
                ))
              }
                  </ol>
                  </div>
              </div>
            )
            )

          }


          </div>
        </div>
        <div className="open-search">
          <Link to='/search'>Add a book</Link>
        </div>
      </div>
      )

      }/>

      <Route path='/search' render={()=>(
           <div className="search-books">
           <div className="search-books-bar">
             <Link className="close-search" to='/' onClick={this.clear}>Close</Link>
             <div className="search-books-input-wrapper">
               {/*
                 NOTES: The search from BooksAPI is limited to a particular set of search terms.
                 You can find these search terms here:
                 https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                 However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                 you don't find a specific author or title. Every search is limited by search terms.
               */
              }
               <input type="text" placeholder="Search by title or author"
               
               value={this.state.query}
               onChange={(event)=>this.searchBooks(event.target.value)}
               
               />

             </div>
           </div>
           <div className="search-books-results">
             <ol className="books-grid">
              {
                this.state.SearchResults.map(book=>(
                 
                  <li key={book.id}>
                   <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks !== undefined ? book.imageLinks.thumbnail:''})` }}></div>
                        <div className="book-shelf-changer">
                          <select value={book.shelf} onChange={(event)=>this.changeShelf(book,event.target.value)}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="None">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-authors">{book.authors}</div>
                    </div>
                    </li>
                ))
              }
             </ol>
           </div>
         </div>
      )}
      />

      </div>
    )
  }
}

export default BooksApp
