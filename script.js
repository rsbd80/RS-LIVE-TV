// =====================================================================
// 🔒 ১. Solo Browser & AppCreator24 ব্লকিং প্রোটেকশন
// =====================================================================
(function() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (ua.includes("Solo") || ua.includes("Solo Browser") || ua.includes("AppCreator24")) {
        document.documentElement.innerHTML = "<h1 style='color:white; text-align:center; margin-top:20%; font-family:sans-serif; background:#000;'>This browser or application is not supported! Please use Google Chrome or Microsoft Edge.</h1>";
        window.location.href = "about:blank";
    }
})();

// =====================================================================
// 📺 ২. JSON প্লেলিস্ট লোড ও চ্যানেল প্লে করার নিখুঁত লজিক
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ক্যাশ সমস্যা এড়াতে টাইমস্ট্যাম্পসহ প্লেলিস্ট কল
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                li.setAttribute('tabindex', '0');
                li.style.cursor = 'pointer'; // মাউস নিলে হাতের চিহ্ন আসবে
                
                // ভেতরের pointer-events তুলে দেওয়া হয়েছে যেন ক্লিক মিস না হয়
                li.innerHTML = `
                    <div class="channel-card-inside" style="width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // সরাসরি ও নিখুঁত ক্লিক লজিক
                li.addEventListener('click', function(e) {
                    e.preventDefault();
                    const iframe = document.getElementById('tv-player-iframe');
                    if (iframe) {
                        // URL প্যারামিটার হিসেবে আসল .m3u8 পাস করা হচ্ছে
                        iframe.src = "channel.html?url=" + encodeURIComponent(channel.url);
                    }
                });
                
                container.appendChild(li);
            });

            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});
