const Datastore = require('nedb-promises');
const { randomUUID } = require('crypto');

const studentsDB = Datastore.create({
  filename: './db/students.db',
  autoload: true
});

exports.getAll = async (req, res) => {
  const students = await studentsDB.find({});
  res.json(students);
};

exports.getById = async (req, res) => {
  const s = await studentsDB.findOne({ id: req.params.id });
  if (!s) return res.status(404).json({ error: "not found" });
  res.json(s);
};

exports.create = async (req, res) => {
  const { name, age, course, email } = req.body;

  if (!name)
    return res.status(400).json({ error: "name required" });

  const student = {
    id: randomUUID(),
    name,
    age,
    course,
    email
  };

  await studentsDB.insert(student);
  res.status(201).json(student);
};

exports.update = async (req, res) => {
  const updated = await studentsDB.update(
    { id: req.params.id },
    { $set: req.body },
    { returnUpdatedDocs: true }
  );

  if (!updated)
    return res.status(404).json({ error: "not found" });

  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await studentsDB.remove({ id: req.params.id });

  if (deleted === 0)
    return res.status(404).json({ error: "not found" });

  res.status(204).end();
};
