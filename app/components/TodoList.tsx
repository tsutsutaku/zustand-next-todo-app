'use client';

import React, { useEffect } from 'react';
import TodoItem from './TodoItem';
import { useTodoStore } from '../stores/todoStore';

const TodoList: React.FC = () => {
    const {
        todos,
        inputText,
        loading,
        error,
        setInputText,
        addTodo,
        toggleTodo,
        deleteTodo,
        fetchTodos,
    } = useTodoStore();

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="relative max-w-md p-6 mx-auto rounded-md shadow-md bg-white text-gray-700">
                <h1 className="mb-6 text-2xl font-bold text-center">Todoリスト</h1>

                {/* エラーメッセージ表示 */}
                {error && (
                    <div className="p-3 mb-4 rounded-md bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex mb-4">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="新しいタスクを入力..."
                        className="flex-1 px-4 py-2 border rounded-l focus:outline-none focus:ring-2 bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500"
                    />
                    <button
                        onClick={addTodo}
                        className="px-4 py-2 text-white bg-blue-500 rounded-r hover:bg-blue-600 focus:outline-none"
                    >
                        追加
                    </button>
                </div>

                {/* ローディングインジケーターと内容表示 */}
                <div className="border rounded-md border-gray-200">
                    {loading && todos.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            読み込み中...
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            タスクがありません
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                id={todo.id}
                                title={todo.title}
                                completed={todo.completed}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                            />
                        ))
                    )}
                </div>

                {todos.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500">
                        {todos.filter((todo) => todo.completed).length}／{todos.length}のタスクが完了
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList; 