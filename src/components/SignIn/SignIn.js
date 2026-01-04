import React from 'react';
import './SignIn.css';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: '',
        }
    }
    
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }
    
    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    onSubmitSignIn = (e) => {
        e.preventDefault();
        fetch('https://smart-brain-api-8l6r.onrender.com/signin', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.signInEmail, 
                password: this.state.signInPassword
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Sign in failed');
                });
            }
            return response.json();
        })
        .then(user => {
            if (user.id) {
                if (this.props.loadUser) {
                    this.props.loadUser(user);
                }
                this.props.onRouteChange('home');
            } else {
                alert('Invalid credentials. Please try again.');
            }
        })
        .catch(err => {
            console.error('Sign in error:', err);
            let errorMessage = 'Error signing in: ';
            
            if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
                errorMessage += 'Cannot connect to backend server.\n\n';
                errorMessage += 'Please make sure the backend server is running:\n';
                errorMessage += '1. Open a terminal\n';
                errorMessage += '2. Run: npm run server\n';
                errorMessage += '3. Or run both together: npm run dev\n\n';
                errorMessage += 'The server should be running on https://smart-brain-api-8l6r.onrender.com';
            } else {
                errorMessage += err.message || 'Please check your connection and try again.';
            }
            
            alert(errorMessage);
        });
    }

    render() {
        const { onRouteChange } = this.props;
    return (
            <div className="signin-container">
                <article className="signin-panel">
                    <main className="pa4">
                        <form className="signin-form" onSubmit={this.onSubmitSignIn}>
                            <h1 className="signin-title">Sign In</h1>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba w-100 signin-input" 
                                    type="email" 
                                    name="email-address" 
                                    id="email-address"
                                    value={this.state.signInEmail}
                                    onChange={this.onEmailChange}
                                />
            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                <input 
                                    className="pa2 input-reset ba w-100 signin-input" 
                                    type="password" 
                                    name="password" 
                                    id="password"
                                    value={this.state.signInPassword}
                                    onChange={this.onPasswordChange}
                                />
            </div>
                            <div className="mt4">
                                <input 
                                    className="signin-button" 
                                    type="submit" 
                                    value="Sign In"
                                />
          </div>
                            <div className="lh-copy mt3">
                                <p onClick={() => onRouteChange('register')} className="f6 link dim black db register-link pointer">Register</p>
          </div>
        </form>
      </main>
                </article>
            </div>
    );
    }
}

export default SignIn;