import React from 'react';

interface TodoItemProps {
    id: string;
    title: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, onToggle, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggle(id)}
                    className="w-4 h-4 mr-2 rounded focus:ring-blue-500 border-gray-300 text-blue-600 bg-white"
                />
                <span className={`${completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-900'
                    }`}>
                    {title}
                </span>
            </div>
            <button
                onClick={() => onDelete(id)}
                className="px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded focus:outline-none"
            >
                削除
            </button>
        </div>
    );
};

export default TodoItem; 