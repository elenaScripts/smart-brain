const handleApiCall = (req, res, db) => {
  const { input, imageUrl, id } = req.body;
  const IMAGE_URL = imageUrl || input;

  if (!IMAGE_URL) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  // Your PAT (Personal Access Token) can be found in the Account's Security section
  const PAT = 'b60d0e136f1e4b61b57dd2f12072116b';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'clarifai';
  const APP_ID = 'main';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => {
      // Update user entries if id is provided
      if (id && db) {
        return db('users')
          .where('id', '=', id)
          .increment('entries', 1)
          .returning('entries')
          .then(entries => {
            return res.json({ ...result, entries: entries[0].entries });
          })
          .catch(err => {
            console.error('Error updating entries:', err);
            return res.json(result);
          });
      }
      return res.json(result);
    })
    .catch(error => {
      console.error('Error calling Clarifai API:', error);
      res.status(500).json({ error: 'Failed to call Clarifai API', details: error.message });
    });
};

module.exports = {
  handleApiCall
};
