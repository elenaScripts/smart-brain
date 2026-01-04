import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const particlesOptions = {
  fpsLimit: 300,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: false,
      speed: 6,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    init: false,
    user: {
      email: '',
      id: '',
      name: '',
      entries: 0,
      joined: '',
    }
  }

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      email: data.email,
      id: data.id,
      name: data.name,
      entries: data.entries,
      joined: data.joined,
    }})
  }
  componentDidMount() {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      this.setState({init: true});
    });
  }

  calculateFaceLocation = (data) => {
    if (!data.outputs || !data.outputs[0] || !data.outputs[0].data || !data.outputs[0].data.regions || data.outputs[0].data.regions.length === 0) {
      console.error('No face regions found in response');
      return null;
    }
    
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    
    if (!image) {
      console.error('Image element not found');
      return null;
    }
    
    const width = Number(image.width);
    const height = Number(image.height);
    
    if (!width || !height) {
      console.error('Image dimensions not available yet');
      return null;
    }
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
  
    fetch('https://smart-brain-api-8l6r.onrender.com/imageurl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        input: this.state.input,
        id: this.state.user.id
      })
    })
      .then(response => {
        if (!response.ok) {
          // Try to get error message from response
          return response.text().then(text => {
            console.error('Error response body:', text);
            let errorData;
            try {
              errorData = JSON.parse(text);
            } catch (e) {
              errorData = { status: { description: text } };
            }
            throw new Error(`HTTP error! status: ${response.status} - ${errorData.status?.description || response.statusText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        // Use the face detection result (could be nested in data or be data itself)
        const result = data.result || data;
        console.log('Full API Response:', JSON.stringify(result, null, 2));
        console.log('Entries from backend:', data.entries);
        
        // Update entries count from backend (backend should update database and return new count)
        if (data.entries !== undefined && data.entries !== null) {
          // Backend has updated the database and returned the new count
          this.setState(prevState => ({
            user: {
              ...prevState.user,
              entries: data.entries
            }
          }));
          console.log('Updated entries count from database:', data.entries);
        } else {
          // Fallback: increment locally if backend didn't return entries
          // This should not happen if backend is working correctly
          console.warn('Backend did not return entries count. Incrementing locally as fallback.');
          this.setState(prevState => ({
            user: {
              ...prevState.user,
              entries: (prevState.user.entries || 0) + 1
            }
          }));
        }
        
        // Check for API errors
        if (result.status && result.status.code !== 10000) {
          console.error('API Error:', result.status);
          const errorMsg = result.status.description || result.status.details || 'Unknown error';
          alert('API Error: ' + errorMsg + '\n\nStatus Code: ' + result.status.code);
          
          // Special handling for account limits
          if (result.status.code === 11006) {
            alert('Your Clarifai account has insufficient credits. Please add credits to your account at https://clarifai.com/account/billing');
          }
          return;
        }
        
        if (result.outputs && result.outputs[0] && result.outputs[0].data && result.outputs[0].data.regions) {
          const regions = result.outputs[0].data.regions;
          console.log('Found', regions.length, 'face(s)');
          
          // Wait for image to load before calculating position
          const image = document.getElementById('inputimage');
          if (image && image.complete) {
            const box = this.calculateFaceLocation(result);
            if (box) {
              this.displayFaceBox(box);
            }
          } else if (image) {
            // Wait for image to load
            image.onload = () => {
              const box = this.calculateFaceLocation(result);
              if (box) {
                this.displayFaceBox(box);
              }
            };
          } else {
            // Image not in DOM yet, try after a short delay
            setTimeout(() => {
              const box = this.calculateFaceLocation(result);
              if (box) {
                this.displayFaceBox(box);
              }
            }, 500);
          }
        } else {
          console.log('No faces detected. Response structure:', result);
          alert('No faces detected in the image. Please try another image.');
        }
      })
      .catch(err => {
        console.error('Fetch Error Details:', {
          message: err.message,
          name: err.name,
          stack: err.stack,
          error: err
        });
        
        let errorMessage = 'Error detecting face: ';
        
        if (err.message.includes('Failed to fetch')) {
          errorMessage += 'Cannot connect to backend server.\n\n';
          errorMessage += 'Please make sure the backend server is running:\n';
          errorMessage += '1. Open a new terminal\n';
          errorMessage += '2. Run: npm run server\n';
          errorMessage += '3. Or run both together: npm run dev\n\n';
          errorMessage += 'The server should be running on https://smart-brain-api-8l6r.onrender.com:3001';
        } else {
          errorMessage += err.message;
        }
        
        alert(errorMessage);
      });
  }

  particlesLoaded = (container) => {
    console.log(container);
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true, route: 'home'});
    } else {
      this.setState({route: route});
    }
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        {this.state.init && (
          <Particles
            id="tsparticles"
            particlesLoaded={this.particlesLoaded}
            options={particlesOptions}
            className="particles"
          />
        )}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'signin' 
          ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
          : route === 'register'
          ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          : <div>
              <Logo />
              <Rank user={this.state.user} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
        }
      </div>
    );
  }
}

export default App;
