import { NextResponse } from 'next/server';

export const config = {
  // আপনার সাইটের সব ফাইল ও রুট পাহারা দেবে এই কোড
  matcher: '/:path*',
};

export function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  // 🚫 সোলো ব্রাউজার, অ্যাপক্রিয়েটর বা যেকোনো বট ডিটেক্ট করা
  if (
    userAgent.match(/(solo|solobrowser|appcreator24)/i)
  ) {
    // তাকে কোনো ফাইল বা কোড না দিয়ে সরাসরি ৪MD Forbidden বা ব্ল্যাঙ্ক পেজে পাঠিয়ে দেওয়া হবে
    return new NextResponse(
      '<h1>Access Denied! This browser is not supported.</h1>',
      {
        status: 403,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      }
    );
  }

  return NextResponse.next();
}
