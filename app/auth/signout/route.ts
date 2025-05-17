import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    // 環境変数を読み込む。なければデフォルトのlocalhost:3000を使う。
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (error) {
        console.error('Error signing out:', error)
        // エラー発生時のリダイレクト先やメッセージは適宜変更してください
        return NextResponse.redirect(new URL('/login?error=ログアウトに失敗しました', siteUrl), {
            status: 302,
        })
    }

    // サインアウト成功時はログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', siteUrl), {
        status: 302,
    })
} 