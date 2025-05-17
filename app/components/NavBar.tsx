import { createClient } from '@/utils/supabase/server';
import Link from 'next/link'

// サーバーコンポーネント
export default async function NavBar() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser();
    console.log(user)
    return (
        <nav className="w-full p-4 bg-white text-gray-900 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    tsutsutaku
                </Link>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                                >
                                    ログアウト
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                        >
                            ログイン
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
} 