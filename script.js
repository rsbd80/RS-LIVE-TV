// 🚫 Solo Browser বা ক্ষতিকারক অ্যাপ ডিটেক্ট করে ব্লক করার লজিক (সবার আগে রান হবে)
(function() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (ua.includes("Solo") || ua.includes("Solo Browser") || ua.includes("AppCreator24")) {
        document.documentElement.innerHTML = "<h1 style='color:white; text-align:center; margin-top:20%; font-family:sans-serif; background:#000;'>This browser or application is not supported! Please use Google Chrome or Microsoft Edge.</h1>";
        window.location.href = "about:blank";
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // রিমোট ফোকাস ধরার জন্য স্ট্যান্ডার্ড tabindex
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // 🔒 চ্যানেল প্লে করার মাউস, টাচ ও রিমোট ক্লিক ইভেন্ট (Base64 দিয়ে এনক্রিপ্ট করা হলো)
                li.addEventListener('click', function() {
                    // btoa() এর মাধ্যমে আসল URL টিকে হিজিবিজি টেক্সটে রূপান্তর করা হচ্ছে
                    const encryptedUrl = "channel.html?url=" + btoa(channel.url);
                    
                    if (window.frames['player']) {
                        window.frames['player'].location.href = encryptedUrl;
                    } else {
                        player.location.href = encryptedUrl;
                    }
                });
                
                container.appendChild(li);
            });

            // প্লেলিস্ট লোড সম্পন্ন হলে টিভি ফোকাস সচল হবে
            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});
