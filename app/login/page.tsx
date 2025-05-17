import { login, signup } from './actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Metadata } from "next";

// Next.js 15の正しい型定義を使用
export default async function LoginPage({ searchParams }: any) {
    // サーバーコンポーネントからユーザー情報をチェック
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    // すでにログインしている場合はリダイレクト
    if (data?.user) {
        redirect('/')
    }

    const errorMessage = searchParams?.error ? String(searchParams.error) : null;
    const infoMessage = searchParams?.message ? String(searchParams.message) : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                {/* エラーメッセージ表示部分 */}
                {errorMessage && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        <span className="font-medium">エラー:</span> {decodeURIComponent(errorMessage)}
                    </div>
                )}
                {/* 情報メッセージ表示部分 */}
                {infoMessage && (
                    <div className="p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
                        <span className="font-medium">情報:</span> {decodeURIComponent(infoMessage)}
                    </div>
                )}

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">ログイン / 新規登録</h1>
                    <p className="mt-2 text-gray-600">アカウント情報を入力してください</p>
                </div>

                <form className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            パスワード
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        />
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button
                            formAction={login}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            ログイン
                        </button>

                        <button
                            formAction={signup}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            新規登録
                        </button>
                    </div>
                    {/* サインアウトボタンはログインページには通常表示しないため削除しました */}
                </form>
            </div>
        </div>
    )
}

export const metadata: Metadata = {
    title: 'ログイン',
    description: 'アカウントにログイン',
}; 