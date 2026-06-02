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
// 📺 ২. JSON প্লেলিস্ট লোড ও চ্যানেল প্লে করার লজিক
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // চ্যানেল ক্লিক করলে সরাসরি আইফ্রেমের src চেঞ্জ হবে
                li.addEventListener('click', function() {
                    const iframe = document.getElementById('tv-player-iframe');
                    if (iframe) {
                        // সরাসরি channel.html ফাইলে প্যারামিটার পাঠানো হচ্ছে
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
