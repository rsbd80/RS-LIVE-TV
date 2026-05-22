document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // গিটহাবের র (Raw) লাইভ M3U প্লেলিস্ট লিঙ্ক
    const m3uUrl = 'https://raw.githubusercontent.com/abusaeeidx/BDxTV/refs/heads/main/roar-zone-playlist.m3u';

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

            // এখন ডিজাইন অনুযায়ী স্ক্রিনে চ্যানেলগুলো রেন্ডার করা
            channels.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // আপনার ভিডিও প্লেয়ার ফাইলের নাম যদি 'player.html' হয়, তবে নিচের অংশটি পরিবর্তন করবেন।
                // এখানে ধরা হয়েছে প্লেয়ার ফাইলটির নাম 'player.html' বা আপনার সেই কোড ওয়ালা পেজ।
                // আপনি যদি চান প্রথম চ্যানেলটি স্বয়ংক্রিয়ভাবে লোড হোক, তবে তাও সম্ভব।
                
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="changeChannel('${channel.url}')">
                        <img src="${channel.image}" alt="${channel.name}">
                    </a>
                `;
                container.appendChild(li);

                // প্রথম চ্যানেলটি স্বয়ংক্রিয়ভাবে ডিফল্ট প্লেয়ারে চালু করার জন্য (ঐচ্ছিক)
                if (index === 0) {
                    changeChannel(channel.url);
                }
            });
        })
        .catch(error => {
            console.error('Error loading live playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px;">Error!</p>';
        });
});

// চ্যানেল পরিবর্তন করার মূল ফাংশন
function changeChannel(streamUrl) {
    // আপনার ভিডিও প্লেয়ার ফাইলটির নাম (যেমন: video-player.html বা jw-player.html) অনুযায়ী নিচের নামটি বদলে দিন।
    // এখানে ধরে নেওয়া হয়েছে আপনার ওই প্লেয়ার ফাইলের নাম 'player.html'
    const playerFileName = 'Player.html'; 
    
    // আইফ্রেমের 'window' বা 'src' পরিবর্তন করা
    const iframe = document.getElementsByName('player')[0];
    if (iframe) {
        // প্লেয়ার ফাইলের সাথে কুয়েরি প্যারামিটার হিসেবে m3u8 লিঙ্কটি পাস করা হচ্ছে
        iframe.src = `${playerFileName}?url=${encodeURIComponent(streamUrl)}`;
    }
}

// রাইট ক্লিক বন্ধ করার ফাংশন
function disableClick() {
    document.oncontextmenu = function() { return false; };
        }
