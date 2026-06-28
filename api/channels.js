// api/channels.js
const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // ✅ process.cwd() ব্যবহার করুন (Vercel-এর জন্য সঠিক পদ্ধতি)
        const filePath = path.join(process.cwd(), 'api', 'xxxbd.json');
        const data = await fs.readFile(filePath, 'utf8');
        const channels = JSON.parse(data);
        
        res.status(200).json(channels);
    } catch (error) {
        console.error('Error details:', error); // লগে বিস্তারিত দেখতে
        res.status(500).json({ message: 'চ্যানেল লোড করতে সমস্যা, একটু পরে চেষ্টা করুন।' });
    }
}
