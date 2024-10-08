import React, { Component, Fragment } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
/** CUSTOM HOC TO EMULATE PREVIOUS FUNCTIONALITY */
import { withRouter } from './hoc/with-router'

import Layout from './components/Layout/Layout'
import Backdrop from './components/Backdrop/Backdrop'
import Toolbar from './components/Toolbar/Toolbar'
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation'
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation'
import ErrorHandler from './components/ErrorHandler/ErrorHandler'
import FeedPage from './pages/Feed/Feed'
import SinglePostPage from './pages/Feed/SinglePost/SinglePost'
import LoginPage from './pages/Auth/Login'
import SignupPage from './pages/Auth/Signup'
import './App.css'

class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    const expiryDate = localStorage.getItem('expiryDate')
    if (!token || !expiryDate) {
      return
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler()
      return
    }
    const userId = localStorage.getItem('userId')
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime()
    this.setState({ isAuth: true, token: token, userId: userId })
    this.setAutoLogout(remainingMilliseconds)
  }

  mobileNavHandler = (isOpen) => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen })
  }

  backdropClickHandler = () => {
    this.setState({
      showBackdrop: false,
      showMobileNav: false,
      error: null,
    })
  }

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null })
    localStorage.removeItem('token')
    localStorage.removeItem('expiryDate')
    localStorage.removeItem('userId')
  }

  loginHandler = (event, authData) => {
    event.preventDefault()
    this.setState({ authLoading: true })

    const gqlQuery = {
      query: `{
        login(email: "${authData.email}", password: "${authData.password}") {
          token
          userId
        }
      }`,
    }

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gqlQuery),
    })
      .then((res) => {
        return res.json()
      })
      .then((resData) => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error('Incorrect email/password.')
        }
        if (resData.errors) {
          throw new Error('Incorrect email/password.')
        }

        console.log(resData)
        this.setState({
          isAuth: true,
          token: resData.data.login.token,
          authLoading: false,
          userId: resData.data.login.userId,
        })
        localStorage.setItem('token', resData.data.login.token)
        localStorage.setItem('userId', resData.data.login.userId)
        const remainingMilliseconds = 60 * 60 * 1000
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        )
        localStorage.setItem('expiryDate', expiryDate.toISOString())
        this.setAutoLogout(remainingMilliseconds)
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        })
      })
  }

  signupHandler = (event, authData) => {
    event.preventDefault()
    this.setState({ authLoading: true })

    const gqlQuery = {
      query: `
      mutation {
          signup(userInput: {
              name:"${authData.signupForm.name.value}",
              email: "${authData.signupForm.email.value}",
              password: "${authData.signupForm.password.value}"}
          ){
              name
              email
          }
      }
  `,
    }

    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gqlQuery),
    })
      .then((res) => {
        return res.json()
      })
      .then((resData) => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error('Email is already in use.')
        }
        if (resData.errors) {
          throw new Error('User creation failed.')
        }

        console.log(resData)
        this.setState({ isAuth: false, authLoading: false })
        this.props.navigate('/')
      })
      .catch((err) => {
        console.log(err)
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        })
      })
  }

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler()
    }, milliseconds)
  }

  errorHandler = () => {
    this.setState({ error: null })
  }

  render() {
    let routes = (
      <Routes>
        <Route
          path='/'
          element={
            <LoginPage
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          }
        />
        <Route
          path='/signup'
          element={
            <SignupPage
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          }
        />
        <Route element={<Navigate to='/' />} />
      </Routes>
    )
    if (this.state.isAuth) {
      routes = (
        <Routes>
          <Route
            path='/'
            element={
              <FeedPage userId={this.state.userId} token={this.state.token} />
            }
          />
          <Route
            path='/:postId'
            element={
              <SinglePostPage
                userId={this.state.userId}
                token={this.state.token}
              />
            }
          />
          <Route element={<Navigate to='/' />} />
        </Routes>
      )
    }
    return (
      <Fragment>
        {this.state.showBackdrop && (
          <Backdrop onClick={this.backdropClickHandler} />
        )}
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <Layout
          header={
            <Toolbar>
              <MainNavigation
                onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
              />
            </Toolbar>
          }
          mobileNav={
            <MobileNavigation
              open={this.state.showMobileNav}
              mobile
              onChooseItem={this.mobileNavHandler.bind(this, false)}
              onLogout={this.logoutHandler}
              isAuth={this.state.isAuth}
            />
          }
        />
        {routes}
      </Fragment>
    )
  }
}

export default withRouter(App)
