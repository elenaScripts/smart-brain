import React from 'react';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
       <div className='ma4 mt0'>
        <div 
          className="Tilt br2 shadow-2" 
          style={{ 
            height: 150, 
            width: 150,
            background: 'linear-gradient(89deg, #FF5EDF 0%, #04C8DE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <img 
            alt='logo' 
            src={brain} 
            className="brain-logo"
            onError={(e) => {
              console.error('Image failed to load. Brain path:', brain);
              e.target.style.border = '2px solid red';
            }}
            onLoad={() => console.log('Image loaded successfully:', brain)}
          />
        </div>
       </div>
    );
}

export default Logo;
