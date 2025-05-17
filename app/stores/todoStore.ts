'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient()

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    user_id?: string;
}

interface TodoState {
    todos: Todo[];
    inputText: string;
    loading: boolean;
    error: string | null;
    setInputText: (text: string) => void;
    fetchTodos: () => Promise<void>;
    addTodo: () => Promise<void>;
    toggleTodo: (id: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
}


export const useTodoStore = create<TodoState>((set, get) => ({
    todos: [],
    inputText: '',
    loading: false,
    error: null,

    setInputText: (text: string) => set({ inputText: text }),

    fetchTodos: async () => {
        set({ loading: true, error: null });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                set({ todos: [], loading: false });
                return;
            }

            const { data: todos, error } = await supabase
                .from('todos')
                .select('*')
                .eq('user_id', user.id)

            if (error) throw error;
            set({ todos: todos || [], loading: false });
        } catch (error: any) {
            console.error('Error fetching todos:', error);
            set({ error: error.message || 'データの取得中にエラーが発生しました', loading: false });
        }
    },

    addTodo: async () => {
        const { inputText } = get();
        if (inputText.trim() === '') return;

        let tempId = '';

        try {
            const { data: { user } } = await supabase.auth.getUser();
            console.log(user);
            if (!user) {
                set({ error: 'ログインが必要です' });
                return;
            }

            tempId = uuidv4();
            const newTodo: Todo = {
                id: tempId,
                title: inputText,
                completed: false,
                user_id: user.id
            };

            set(state => ({
                todos: [newTodo, ...state.todos],
                inputText: '',
                error: null
            }));

            const { data, error } = await supabase
                .from('todos')
                .insert([{
                    title: inputText,
                    completed: false,
                    user_id: user.id
                }])
                .select();

            if (error) throw error;

            set(state => ({
                todos: state.todos.map(todo =>
                    todo.id === tempId ? data[0] : todo
                )
            }));
        } catch (error: any) {
            console.error('Error adding todo:', error);
            set(state => ({
                todos: state.todos.filter(todo => todo.id !== tempId),
                error: error.message || 'Todoの追加中にエラーが発生しました'
            }));
        }
    },

    toggleTodo: async (id: string) => {
        const todo = get().todos.find(t => t.id === id);
        if (!todo) return;

        set(state => ({
            todos: state.todos.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        }));

        try {
            const { error } = await supabase
                .from('todos')
                .update({ completed: !todo.completed })
                .eq('id', id);

            if (error) throw error;
        } catch (error: any) {
            console.error('Error toggling todo:', error);
            set(state => ({
                todos: state.todos.map(t =>
                    t.id === id ? todo : t
                ),
                error: error.message || 'Todoの更新中にエラーが発生しました'
            }));
        }
    },

    deleteTodo: async (id: string) => {
        const previousTodos = get().todos;

        set(state => ({
            todos: state.todos.filter(todo => todo.id !== id)
        }));

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error: any) {
            console.error('Error deleting todo:', error);
            set({
                todos: previousTodos,
                error: error.message || 'Todoの削除中にエラーが発生しました'
            });
        }
    }
})); 