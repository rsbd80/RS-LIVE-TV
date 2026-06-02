document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ক্যাশ সমস্যা এড়াতে টাইমস্ট্যাম্পসহ প্লেলিস্ট লোড
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // রিমোট ফোকাস ঠিক রাখার জন্য tabindex
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

                // 🎯 এখানে সেই ফিক্সড ক্লিক লজিকটি বসানো হয়েছে
                li.addEventListener('click', function() {
                    const targetUrl = "channel.html?url=" + encodeURIComponent(channel.url);
                    
                    if (window.frames['player']) {
                        window.frames['player'].location.href = targetUrl;
                    } else {
                        // ব্যাকআপ হিসেবে যদি উইন্ডো ফ্রেম ডিরেক্ট না পায়
                        const iframe = document.querySelector('iframe[name="player"]');
                        if (iframe) {
                            iframe.src = targetUrl;
                        }
                    }
                });
                
                container.appendChild(li);
            });

            // প্লেলিস্ট লোড শেষে রিমোট কন্ট্রোল ফোকাস সচল করা
            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});
