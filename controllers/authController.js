const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Datastore = require('nedb-promises');
const { nanoid } = require('nanoid');

const SECRET = process.env.JWT_SECRET || "replace_this_secret";

const usersDB = Datastore.create({
  filename: './db/users.db',
  autoload: true
});

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "username & password required" });

  const exists = await usersDB.findOne({ username });
  if (exists)
    return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), username, password: hashed };

  await usersDB.insert(user);

  return res.status(201).json({ id: user.id, username: user.username });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await usersDB.findOne({ username });
  if (!user)
    return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "6h" }
  );

  return res.json({ token });
};
