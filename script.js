// =====================================================================
// 🔒 ১. Solo Browser & AppCreator24 ব্লকিং প্রোটেকশন (সার্ভার লোডের সাথে সাথেই ব্লক করবে)
// =====================================================================
(function() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    // সোলো ব্রাউজার বা অ্যাপক্রিয়েটর দিয়ে ঢুকলে পেজ ফাঁকা করে দেবে
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

    // প্লেলিস্ট লোড করা হচ্ছে
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

                // চ্যানেল ক্লিক ইভেন্ট
                li.addEventListener('click', function() {
                    // সরাসরি সঠিক ফরম্যাটে আইফ্রেমে লিঙ্ক পাঠানো হচ্ছে যাতে প্লেয়ার চালু হয়
                    const targetUrl = "channel.html?url=" + encodeURIComponent(channel.url);
                    
                    if (window.frames['player']) {
                        window.frames['player'].location.href = targetUrl;
                    } else {
                        const iframe = document.querySelector('iframe[name="player"]');
                        if (iframe) {
                            iframe.src = targetUrl;
                        }
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
