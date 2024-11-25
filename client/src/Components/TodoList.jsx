import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!taskText) return;
    const res = await axios.post('http://localhost:5000/tasks', { text: taskText });
    setTasks([...tasks, res.data]);
    setTaskText('');
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const editTask = async (id) => {
    if (!editTaskText) return;
    await axios.put(`http://localhost:5000/tasks/${id}`, { text: editTaskText });
    setTasks(tasks.map(task => task._id === id ? { ...task, text: editTaskText } : task));
    setEditingTaskId(null);
    setEditTaskText('');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-blue-600 text-center">To-Do List</h1>
      <div className="flex mt-4">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="Add a new task"
        />
        <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white rounded">Add</button>
      </div>
      <ul className="mt-4">
        {tasks.map(task => (
          <li key={task._id} className="flex justify-between items-center p-2 border-b">
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <div>
                  <button onClick={() => editTask(task._id)} className="mr-2 text-green-500">Save</button>
                  <button onClick={() => {
                    setEditingTaskId(null);
                    setEditTaskText('');
                  }} className="text-red-500">Cancel</button>
                </div>
              </>
            ) : (
              <>
                {task.text}
                <div>
                  <button onClick={() => {
                    setEditingTaskId(task._id);
                    setEditTaskText(task.text); // Set the input to the current task's text
                  }} className="mr-2 text-blue-500">Edit</button>
                  <button onClick={() => deleteTask(task._id)} className="text-red-500">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;