import React, { useState, useEffect, useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import TokenContext from '../../context/TokenContext';
import axios from "../../Axios/axios.js";
import "./createTask.css";

function CreateTask({ editTaskData = null, onClose }) {
    const { dispatch } = useContext(TaskContext);
    const { userToken } = useContext(TokenContext);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Low");
    const [dueDate, setDueDate] = useState("");
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (editTaskData) {
            setTitle(editTaskData.title || "");
            setDescription(editTaskData.description || "");
            setPriority(editTaskData.priority || "Low");
            setDueDate(editTaskData.dueDate ? editTaskData.dueDate.split("T")[0] : "");
            setCompleted(editTaskData.completed || false);
        }
    }, [editTaskData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const taskData = { 
            id: editTaskData?.id,
            title, 
            description, 
            priority, 
            dueDate, 
            completed 
        };

        try {
            if (editTaskData) {
                await axios.put("/task/editTask", taskData, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                dispatch({
                    type: "UPDATE_TASK",
                    id: editTaskData.index,
                    title,
                    description,
                    priority,
                    dueDate,
                    completed
                });
            } else {
                const res = await axios.post("/task/addTask", taskData, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                dispatch({
                    type: "ADD_TASK",
                    _id: res.data._id,
                    title,
                    description,
                    priority,
                    dueDate,
                    completed
                });
                setTitle("");
                setDescription("");
                setPriority("Low");
                setDueDate("");
                setCompleted(false);
            }
            if (onClose) onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md border">
                <form 
                    onSubmit={handleSubmit} 
                    className="flex flex-col gap-2"
                >
                    <div>
                        <label className="block mb-1 text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border rounded-md w-full p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Description</label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="border rounded-md w-full p-2 text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Select Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="border rounded-md w-full p-2 text-sm"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="border rounded-md w-full p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Task Completed</label>
                        <select
                            value={completed ? "Yes" : "No"}
                            onChange={(e) => setCompleted(e.target.value === "Yes")}
                            className="border rounded-md w-full p-2 text-sm"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    {/* ✅ Button section with margin-top to push it down */}
                    <div className="flex flex-col gap-2 mt-4">
                        <button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm"
                        >
                            {editTaskData ? "Update Task" : "Add Task"}
                        </button>

                        {editTaskData && (
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTask;
