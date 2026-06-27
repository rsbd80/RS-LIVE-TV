// pages/api/playlist.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // মূল ফোল্ডার থেকে JSON ফাইল পড়ুন
    const filePath = path.join(process.cwd(), 'playlist.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'ডাটা লোড করতে সমস্যা হয়েছে' });
  }
}
