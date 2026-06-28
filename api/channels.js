const fs = require('fs').promises;
const path = require('path');

const rateLimit = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 100; // ১০০ পর্যন্ত বাড়ানো হলো

    if (!rateLimit.has(ip)) rateLimit.set(ip, []);
    let timestamps = rateLimit.get(ip).filter(t => now - t < windowMs);
    
    if (timestamps.length >= maxRequests) return true;
    timestamps.push(now);
    rateLimit.set(ip, timestamps);
    return false;
}

export default async function handler(req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    if (isRateLimited(ip)) {
        return res.status(429).json({ message: 'অতিরিক্ত রিকোয়েস্ট! ১ মিনিট অপেক্ষা করুন।' });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');

    try {
        const filePath = path.join(process.cwd(), 'api', 'xxxbd.json');
        const data = await fs.readFile(filePath, 'utf8');
        const channels = JSON.parse(data);
        
        // নিশ্চিত করুন যে ডেটা অ্যারে
        if (!Array.isArray(channels)) {
            throw new Error('JSON অ্যারে নয়');
        }
        
        res.status(200).json(channels);
    } catch (error) {
        console.error('API Error:', error);
        // খালি অ্যারে রিটার্ন করুন, যাতে ফ্রন্টএন্ড ক্র্যাশ না হয়
        res.status(200).json([]);
    }
}
