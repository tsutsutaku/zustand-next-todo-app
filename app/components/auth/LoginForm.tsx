'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient()

interface LoginFormProps {
    redirectUrl?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectUrl = '/' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const router = useRouter();

    // 初期ロード時のセッションチェックはlogin/page.tsxで行い、ここでは行わない

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            console.log(`[LoginForm] ログイン試行: ${email}`);

            // ログイン処理
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            console.log('[LoginForm] ログイン成功 🎉 セッション:', data.session?.user.id);
            setSuccessMsg('ログイン成功！リダイレクト中...');
            router.push(redirectUrl);

        } catch (error: any) {
            console.error('[LoginForm] ログインエラー:', error);
            setError(error.message || 'ログイン中にエラーが発生しました');
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            console.log(`[LoginForm] 新規登録試行: ${email}`);

            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectUrl}`,
                },
            });

            if (error) throw error;

            setSuccessMsg('確認メールを送信しました。メールを確認してアカウントを有効化してください。');
        } catch (error: any) {
            console.error('[LoginForm] 新規登録エラー:', error);
            setError(error.message || 'アカウント作成中にエラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 rounded-xl shadow-md bg-white text-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Todoアプリにログイン
                    </h2>
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-red-100 text-red-700">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="p-3 rounded-md bg-green-100 text-green-700">
                        {successMsg}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                メールアドレス
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="メールアドレス"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                パスワード
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full mr-2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? 'ログイン中...' : 'ログイン'}
                        </button>

                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="group relative w-full ml-2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            {loading ? '処理中...' : '新規登録'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm; 