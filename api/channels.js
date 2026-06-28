// api/channels.js
const fs = require('fs').promises;
const path = require('path');

// ----- রেট লিমিটিং (ইন-মেমরি স্টোর) -----
const rateLimit = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000; // ১ মিনিট
    const maxRequests = 50;     // প্রতি মিনিটে ৫০টি রিকোয়েস্ট (সাধারণ ইউজারের জন্য যথেষ্ট)

    // পুরোনো ডেটা পরিষ্কার
    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, []);
    }

    let timestamps = rateLimit.get(ip);
    // ১ মিনিটের পুরনো রেকর্ড ফিল্টার করুন
    timestamps = timestamps.filter(t => now - t < windowMs);

    if (timestamps.length >= maxRequests) {
        return true; // লিমিট ক্রস করেছে
    }

    timestamps.push(now);
    rateLimit.set(ip, timestamps);
    return false;
}
// -----------------------------------------

export default async function handler(req, res) {
    // ১. ব্যবহারকারীর আইপি ঠিকানা বের করা
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    // ২. রেট লিমিট চেক
    if (isRateLimited(ip)) {
        return res.status(429).json({
            message: 'অতিরিক্ত রিকোয়েস্ট! দয়া করে ১ মিনিট অপেক্ষা করে আবার চেষ্টা করুন।'
        });
    }

    // ৩. CORS হেডার (যাতে অন্য ডোমেইন থেকেও কল করা যায়)
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // ৪. JSON ফাইল পড়া (এখনো api ফোল্ডারের ভিতরেই আছে)
        const filePath = path.join(process.cwd(), 'api', 'xxxbd.json');
        const data = await fs.readFile(filePath, 'utf8');
        const channels = JSON.parse(data);

        // ৫. ক্যাশিং হেডার (৫ মিনিট = ৩০০ সেকেন্ড)
        res.setHeader('Cache-Control', 'public, max-age=300');

        // ৬. সফল রেসপন্স
        res.status(200).json(channels);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ message: 'চ্যানেল লোড করতে সমস্যা, একটু পরে চেষ্টা করুন।' });
    }
            }
