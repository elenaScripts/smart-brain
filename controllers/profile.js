const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => {
      console.error('Profile error:', err);
      res.status(400).json('Error getting user');
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => {
      console.error('Image error:', err);
      res.status(400).json('Unable to get entries');
    });
};

module.exports = {
  handleProfileGet,
  handleImage
};
