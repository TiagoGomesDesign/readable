import React, { Component } from 'react';
import { connect } from 'react-redux'
import Post from './components/Post';
import Create from './components/Create';
import Comment from './components/Comment';
import Modal from 'react-modal';
import { addPost, deletePost, addComment, deleteComment, updateVote, selectCategory, getall, getAllComments } from './actions'
import * as readAPI from './utils/api'
import { Route, Link } from 'react-router-dom'
import './App.css';
import { Button, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class App extends Component {

  state = {
    categories: [],
    category: null,
    post: [],
    comment: [],
    showModal: false
  }

  componentDidMount() {
    readAPI.getCategories().then((data) => {
      this.setState({ categories: data.categories });
    })
    this.props.getAllPost()
  }

  selectCategory(e) {
    const category = e
    this.props.getCategoryPost(category);
    this.setState({ post: this.props.post })
  }

  openModal = (id) => {
    this.props.getPostComments(id);
    this.setState(() => ({
      showModal: true,
      comment: this.props.comment
    }));
  }

  closeModal = () => {
    this.setState(() => ({
      showModal: false,
      comment: []
    }))
  }

  render() {

    const { category, showModal } = this.state
    const { getAllPost, post, getPostComments, getCategoryPost, comment } = this.props
    console.log(this)

    return (
      <div className='containter-fluid'>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href='/'>Readable</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem href='/newpost'>Add Post</NavItem>
          </Nav>
          <Nav bsStyle='pills' activeKey={1} pullRight>
            {this.state.categories.map((category) => (
              <NavItem key={category.name} eventKey={2} onClick={(e) => this.selectCategory((category.name))}><Link to="/">
                {(category.name)}</Link>
              </NavItem>
            ))}
            <NavDropdown eventKey={3} title='Order By' id='basic-nav-dropdown'>
              <MenuItem eventKey={3.1}>Vote Score</MenuItem>
              <MenuItem eventKey={3.2}>Time Stamp</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar>
        <Route exact path='/' render={() => (
          <div className='post-container'>
            <Post post={post}
              openModal={(id) => {
                this.openModal(id)
              }}
            />
            <Modal
              className='modal'
              overlayClassName='overlay'
              isOpen={showModal}
              onRequestClose={this.closeModal}
              contentLabel='Modal'
            >{showModal && <Comment comment={comment} />}
            </Modal>
          </div>
        )} />
        <Route path='/newpost' render={() => (
          <Create create={this.state.create} />
        )} />
      </div>
    );
  }
}

function mapStateToProps({ post, comment }) {
  return {
    post: post,
    comment: comment
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllPost: () => dispatch(getall()),
    getCategoryPost: (category) => dispatch(selectCategory(category), console.log(category)),
    getPostComments: (id) => dispatch(getAllComments(id), console.log(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)