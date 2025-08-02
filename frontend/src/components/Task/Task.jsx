import React, { useState, useContext } from 'react';
import moment from 'moment';
import "./task.css";
import TaskContext from '../../context/TaskContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CreateTask from '../createTask/CreateTask';

function Task({ task, id }) {
    const { dispatch } = useContext(TaskContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleRemove = (e) => {
        e.preventDefault();
        dispatch({ type: "REMOVE_TASK", id });
    };

    const handleMarkDone = () => {
        dispatch({ type: "MARK_DONE", id });
    };

    const handleEditClick = () => setIsEditing(true);
    const handleCloseEdit = () => setIsEditing(false);

    return (
        <>
            <div className='bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3'>
                <div className="mark-done">
                    <input type="checkbox" className="checkbox" onChange={handleMarkDone} checked={task.completed} />
                </div>
                <div className="task-info text-slate-900 text-sm w-10/12">
                    <h4 className="task-title text-lg capitalize">{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className='italic opacity-60'>
                        {task?.createdAt ? (
                            <p>{moment(task.createdAt).fromNow()}</p>
                        ) : (
                            <p>just now</p>
                        )}
                    </div>
                </div>
                <div className="task-actions flex gap-2">
                    <EditIcon
                        style={{ fontSize: 30, cursor: "pointer" }}
                        onClick={handleEditClick}
                        className="edit-task-btn bg-green-700 rounded-full border-2 shadow-2xl border-white p-1"
                    />
                    <DeleteIcon
                        style={{ fontSize: 30, cursor: "pointer" }}
                        onClick={handleRemove}
                        className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
                    />
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <CreateTask
                            editTaskData={{ id: task._id || task.id, title: task.title, description: task.description, index: id }}
                            onClose={handleCloseEdit}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Task;
