document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');

    Promise.all([
        fetch('xxxbd.json?t=' + Date.now()).then(res => res.json()).catch(() => []),
        fetch('app_settings.json?t=' + Date.now()).then(res => res.json()).catch(() => ({})),
        fetch('notice.json?t=' + Date.now()).then(res => res.json()).catch(() => ({}))
    ])
    .then(([playlistData, settingsData, oldNoticeData]) => {
        container.innerHTML = ''; 

        const isMaintenance = settingsData.maintenance === "ON";
        
        if (isMaintenance) {
            document.body.innerHTML = `
                <div style="text-align:center; padding:100px 20px; color:white; background:#020617; min-height:100vh; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <h1 style="font-size:32px; margin-bottom:15px; color:#f87171;">🛠️ সিস্টেম আপডেট চলছে...</h1>
                    <p style="font-size:16px; color:#94a3b8; max-width:500px; margin-bottom:25px;">সাময়িকভাবে আমাদের সার্ভার মেইনটেইন্যান্স করা হচ্ছে। খুব দ্রুতই আমরা লাইভে ফিরবো।</p>
                    ${settingsData.telegram ? `<a href="${settingsData.telegram}" target="_blank" style="background:#10b981; color:#020617; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">আমাদের টেলিগ্রাম গ্রুপে জয়েন করুন</a>` : ''}
                </div>
            `;
            return;
        }

        const liveNotice = document.getElementById('noticeBar') || document.getElementById('notice'); 
        const currentNotice = settingsData.notice || oldNoticeData.notice || "";
        
        if (liveNotice && currentNotice) {
            liveNotice.innerText = currentNotice;
        }

        const telegramBtn = document.getElementById('telegramBtn') || document.getElementById('telegramLink');
        if (telegramBtn && settingsData.telegram) {
            telegramBtn.href = settingsData.telegram;
        }

        const channelList = Array.isArray(playlistData) ? playlistData : (playlistData.channels || []);

        if (channelList.length === 0) {
            container.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">কোনো চ্যানেল পাওয়া যায়নি!</p>';
            return;
        }

        channelList.forEach((channel) => {
            const li = document.createElement('li');
            li.setAttribute('tabindex', '0');
            
            li.innerHTML = `
                <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                    <img src="${channel.image}" alt="${channel.name}" loading="lazy" onerror="this.src='https://i.postimg.cc/mD1VCt2C/RS-Live.png';">
                    <div class="channel-info-box">
                        <p class="channel-title">${channel.name}</p>
                    </div>
                </div>
            `;

            li.addEventListener('click', function() {
                // লজিক ১: প্লেয়ার লোড করার সময় অটো-প্লে প্যারামিটার যুক্ত করা
                const playUrl = channel.url.includes('?') ? channel.url + '&autoplay=1' : channel.url + '?autoplay=1';
                
                if (window.frames['player']) {
                    window.frames['player'].location.href = playUrl;
                } else if (window.player) {
                    player.location.href = playUrl;
                }

                // লজিক ২: ক্লিক করলে ফুল স্ক্রিন মোডে যাওয়ার জন্য ব্রাউজারকে রিকোয়েস্ট করা
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(() => {});
                }

                if (searchInput) {
                    searchInput.value = '';
                    const channelItems = container.querySelectorAll('li');
                    channelItems.forEach(item => item.style.display = "");
                }
            });
            
            container.appendChild(li);
        });

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const filterValue = this.value.toLowerCase().trim();
                const channelItems = container.querySelectorAll('li');
                channelItems.forEach(item => {
                    const channelTitle = item.querySelector('.channel-title').textContent.toLowerCase();
                    item.style.display = channelTitle.includes(filterValue) ? "" : "none"; 
                });
            });
        }

        if (typeof initTVFocus === 'function') {
            initTVFocus();
        }
    })
    .catch(error => {
        console.error('Error loading assets:', error);
        if (container) {
            container.innerHTML = '<p style="color:red; text-align:center; padding:20px;">সিস্টেম লোড হতে সমস্যা হয়েছে!</p>';
        }
    });
});
