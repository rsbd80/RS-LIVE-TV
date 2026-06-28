// api/channels.js
const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // ফাইলটি এখন 'data' ফোল্ডারে
        const filePath = path.join(process.cwd(), 'data', 'xxxbd.json');
        const data = await fs.readFile(filePath, 'utf8');
        const channels = JSON.parse(data);
        
        res.status(200).json(channels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'চ্যানেল লোড করতে সমস্যা, একটু পরে চেষ্টা করুন।' });
    }
}
