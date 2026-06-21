document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');
    const iframe = document.getElementById('tv-iframe');

    // ক্যাশ এড়াতে টাইমস্ট্যাম্প ট্রিক
    const cacheBuster = '?t=' + Date.now();

    Promise.all([
        fetch('playlist.json' + cacheBuster).then(res => res.json()).catch(() => []),
        fetch('app_settings.json' + cacheBuster).then(res => res.json()).catch(() => ({}))
    ])
    .then(([playlistData, settingsData]) => {
        if (!container) return;
        container.innerHTML = ''; 

        // ১. মেইন্টেইন্যান্স মোড চেক
        if (settingsData.maintenance === "ON") {
            document.body.innerHTML = `
                <div style="text-align:center; padding:100px 20px; color:white; background:#020617; min-height:100vh; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <h1 style="font-size:32px; margin-bottom:15px; color:#ef4444;">🛠️ সিস্টেম আপডেট চলছে...</h1>
                    <p style="font-size:18px; color:#94a3b8;">সাময়িকভাবে চ্যানেল দেখা বন্ধ আছে। খুব দ্রুতই আমরা ফিরছি।</p>
                </div>`;
            return;
        }

        // ২. প্লেলিস্ট রেন্ডারিং ও ক্লিক লজিক ফিক্স
        if (playlistData.length === 0) {
            container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px;">কোনো চ্যানেল পাওয়া যায়নি!</p>';
            return;
        }

        // সাইট লোড হওয়ামাত্রই প্রথম চ্যানেলটি অটোমেটিক আইফ্রেমে প্লে করার জন্য
        if (iframe && playlistData[0] && playlistData[0].url) {
            iframe.src = "channel.html?url=" + encodeURIComponent(playlistData[0].url);
        }

        playlistData.forEach((channel, index) => {
            const li = document.createElement('li');
            li.className = 'channel-item' + (index === 0 ? ' active' : '');
            li.setAttribute('tabindex', '0');
            li.style.cursor = "pointer"; // মাউস কার্সার পয়েন্টার নিশ্চিত করা হলো

            li.innerHTML = `
                <div class="channel-card" style="pointer-events: none;">
                    <img src="${channel.image}" alt="${channel.name}" loading="lazy" onerror="this.src='https://i.postimg.cc/mD1VCt2C/RS-Live.png'">
                    <span class="channel-title">${channel.name}</span>
                </div>
            `;

            // সরাসরি LI এলিমেন্টে ক্লিক লজিক (১০০% কাজ করবে)
            li.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (iframe && channel.url) {
                    // channel.html পেজে প্লেয়ারের কাছে নিরাপদভাবে URL পাঠানো হচ্ছে
                    iframe.src = "channel.html?url=" + encodeURIComponent(channel.url);
                }
                
                // একটিভ ক্লাস পরিবর্তন
                const allItems = container.querySelectorAll('li');
                allItems.forEach(item => item.classList.remove('active'));
                li.classList.add('active');
            });
            
            container.appendChild(li);
        });

        // ৩. লাইভ সার্চ ফিল্টার
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const filterValue = this.value.toLowerCase().trim();
                const channelItems = container.querySelectorAll('li');

                channelItems.forEach(item => {
                    const title = item.querySelector('.channel-title').textContent.toLowerCase();
                    item.style.display = title.includes(filterValue) ? "" : "none";
                });
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
