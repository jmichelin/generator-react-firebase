import React, { Component, PropTypes } from 'react'
import Paper from 'material-ui/Paper'<% if (includeRedux) { %>
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { firebaseConnect, pathToJS, isLoaded  } from 'react-redux-firebase'
import { ACCOUNT_FORM_NAME } from 'constants/formNames'
import { UserIsAuthenticated } from 'utils/router'<% } %>
import defaultUserImageUrl from 'static/User.png'
import LoadingSpinner from 'components/LoadingSpinner'
import AccountForm from '../components/AccountForm/AccountForm'
import classes from './AccountContainer.scss'

<% if (includeRedux) { %>@UserIsAuthenticated // redirect to /login if user is not authenticated
@firebaseConnect()
@connect(
  // Map state to props
  ({ firebase }) => ({
    authError: pathToJS(firebase, 'authError'),
    account: pathToJS(firebase, 'profile'),
    initialValues: pathToJS(firebase, 'profile')
  })
)
@reduxForm({
  form: ACCOUNT_FORM_NAME,
  enableReinitialization: true,
  persistentSubmitErrors: true
})<% } %>
export default class Account extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  <% if (includeRedux) { %>static propTypes = {
    account: PropTypes.object,
    firebase: PropTypes.shape({
      logout: PropTypes.func.isRequired,
      uploadAvatar: PropTypes.func,
      updateAccount: PropTypes.func
    })
  }<% } %>

  state = { modalOpen: false }

  handleLogout = () => {
    <% if (includeRedux) { %>this.props.firebase.logout()<% } %><% if (!includeRedux) { %>// TODO: Handle logout without react-redux-firebase <% } %>
  }
<% if (!includeRedux) { %>
  handleSave = () => {
    // TODO: Handle saving image and account data at the same time
    const account = {
      name: this.refs.name.getValue(),
      email: this.refs.email.getValue()
    }
  }
<% } %>
  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  render () {
    const { account, firebase: { saveAccount } } = this.props

    if (!isLoaded(account)) {
      return <LoadingSpinner />
    }

    return (
      <div className={classes.container}>
        <Paper className={classes.pane}>
          <div className={classes.settings}>
            <div className={classes.avatar}>
              <img
                className={classes['avatar-current']}
                src={account && account.avatarUrl || defaultUserImageUrl}
                onClick={this.toggleModal}
              />
            </div>
            <div className={classes.meta}>
              <AccountForm
                onSubmit={saveAccount}
                account={account}
              />
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}
