document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // গিটহাবের র (Raw) লাইভ M3U প্লেলিস্ট লিঙ্ক
    const m3uUrl = 'https://raw.githubusercontent.com/tv-bd1/LiveSteermRS/refs/heads/main/Royarzone.m3u';

    // সরাসরি লাইভ M3U ফাইল থেকে ডেটা ফেচ করা
    fetch(m3uUrl, { cache: "no-store" }) // যাতে প্রতিবার একদম নতুন টোকেন আসে, ব্রাউজারে ক্যাশ না হয়
        .then(response => response.text())
        .then(m3uText => {
            const lines = m3uText.split('\n');
            const channels = [];
            let currentChannel = null;

            // M3U টেক্সটকে প্রসেস করে অবজেক্টে রূপান্তর করার লজিক
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                if (line.startsWith('#EXTINF:')) {
                    // রেগুলার এক্সপ্রেশন দিয়ে নাম এবং লোগো ইমেজ আলাদা করা
                    const nameMatch = line.match(/,(.+)$/);
                    const logoMatch = line.match(/tvg-logo="([^"]+)"/);

                    currentChannel = {
                        name: nameMatch ? nameMatch[1].trim() : "Live Channel",
                        image: logoMatch ? logoMatch[1] : "default-logo.png" // লোগো না থাকলে ডিফল্ট ইমেজ
                    };
                } else if (line.startsWith('http') && currentChannel) {
                    // লাইভ টোকেনসহ আসল m3u8 ইউআরএলটি নেওয়া
                    currentChannel.url = line;
                    channels.push(currentChannel);
                    currentChannel = null; // পরবর্তী চ্যানেলের জন্য রিসেট
                }
            }

            // এখন আপনার ডিজাইন অনুযায়ী স্ক্রিনে চ্যানেলগুলো রেন্ডার করা
            channels.forEach(channel => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'">
                        <img src="${channel.image}" alt="${channel.name}">
                    </a>
                `;
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading live playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px;">Error!</p>';
        });
});

// রাইট ক্লিক বন্ধ করার ফাংশন
function disableClick() {
    document.oncontextmenu = function() { return false; };
}
