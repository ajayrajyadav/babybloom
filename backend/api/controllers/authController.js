export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }
    res.status(200).json({ message: 'Login successful', email });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }
    res.status(201).json({ message: 'User registered', email });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
