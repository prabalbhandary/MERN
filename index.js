const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define the Todo schema and model before routes
const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
}, {timestamps: true});

const Todo = mongoose.model("Todo", todoSchema);

// Connect to MongoDB
mongoose.connect("mongodb+srv://prabal:prabal@prabal.fbo3j.mongodb.net/mern-stack-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing todo
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndRemove(req.params.id);
    if (!result) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
