import React from 'react';
import '../SignIn/SignIn.css';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
        }
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value});
    }
    
    onEmailChange = (event) => {
        this.setState({email: event.target.value});
    }
    
    onPasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    onSubmitRegister = (e) => {
        e.preventDefault();
        fetch('https://smart-brain-api-8l6r.onrender.com/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.name, 
                email: this.state.email, 
                password: this.state.password
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Registration failed');
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
                alert('Registration failed. Please try again.');
            }
        })
        .catch(err => {
            console.error('Register error:', err);
            let errorMessage = 'Error registering: ';
            
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
                        <form className="signin-form" onSubmit={this.onSubmitRegister}>
                        <h1 className="signin-title">Register</h1>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input 
                                className="pa2 input-reset ba w-100 signin-input" 
                                type="text" 
                                name="name" 
                                id="name"
                                    value={this.state.name}
                                    onChange={this.onNameChange}
                                />
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba w-100 signin-input" 
                                    type="email" 
                                    name="email-address" 
                                    id="email-address"
                                    value={this.state.email}
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
                                    value={this.state.password}
                                    onChange={this.onPasswordChange}
                            />
                        </div>
                        <div className="mt4">
                            <input 
                                className="signin-button" 
                                type="submit" 
                                    value="Register"
                            />
                        </div>
                        <div className="lh-copy mt3">
                                <p onClick={() => onRouteChange('signin')} className="f6 link dim black db register-link pointer">Sign In</p>
                        </div>
                    </form>
                </main>
            </article>
        </div>
    );
    }
}

export default Register;