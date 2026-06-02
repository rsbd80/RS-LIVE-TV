document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ব্রাউজার ক্যাশ সমস্যা এড়াতে টাইমস্ট্যাম্পসহ প্লেলিস্ট ফেচ করা হচ্ছে
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // রিমোট ফোকাস ধরার জন্য স্ট্যান্ডার্ড tabindex ও মাউস কার্সার স্টাইল
                li.setAttribute('tabindex', '0');
                li.style.cursor = 'pointer';
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // 🎯 মাস্টার ফিক্সড ক্লিক ইভেন্ট লজিক
                li.addEventListener('click', function() {
                    // ইউআরএল-এর ভেতরের স্পেশাল ক্যারেক্টার বা টোকেন যেন ব্রাউজার ব্লক না করে, তাই encodeURIComponent ব্যবহার করা হয়েছে
                    const targetUrl = "channel.html?url=" + encodeURIComponent(channel.url);
                    
                    // আপনার ওরিজিনাল ব্যাকআপের আইফ্রেম টার্গেটিং লজিক যা এখন সঠিকভাবে রিডাইরেক্ট করবে
                    if (window.frames['player']) {
                        window.frames['player'].location.href = targetUrl;
                    } else {
                        const iframe = document.getElementById('tv-player-iframe') || document.querySelector('iframe[name="player"]');
                        if (iframe) {
                            iframe.src = targetUrl;
                        }
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
