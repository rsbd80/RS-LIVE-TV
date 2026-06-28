// api/channels.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // ১. CORS হেডার (শুধুমাত্র আপনার ডোমেইন থেকে অনুমতি দিন)
  res.setHeader('Access-Control-Allow-Origin', 'https://your-vercel-app.vercel.app'); // আপনার ইউআরএল দিন
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // ২. রেট লিমিটিং-এর মতো সুরক্ষা যোগ করতে চাইলে এখানে লজিক দিন (Vercel-এর নিজস্ব সীমা আছে)

  try {
    // JSON ফাইলটি পড়ুন (এটি পাবলিক ফোল্ডারের বাইরে)
    const filePath = path.join(process.cwd(), 'data', 'xxxbd.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const channels = JSON.parse(jsonData);

    // ৩. সফলレスポンス
    res.status(200).json(channels);
  } catch (error) {
    // ৪. এরর হ্যান্ডেলিং – ব্যবহারকারীকে সাধারণ বার্তা
    console.error('Error reading channels:', error);
    res.status(500).json({ 
      message: 'চ্যানেল লোড করতে সমস্যা হচ্ছে, একটু পরে চেষ্টা করুন।' 
    });
  }
}
