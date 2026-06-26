document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');

    // একসাথে প্লেলিস্ট ও সেটিংস লোড (ক্যাশে বাস্ট সহ)
    Promise.all([
        fetch('playlist.json?t=' + Date.now()).then(res => res.ok ? res.json() : Promise.reject('playlist.json লোড হয়নি')),
        fetch('app_settings.json?t=' + Date.now()).then(res => res.ok ? res.json() : Promise.resolve({})),
        fetch('notice.json?t=' + Date.now()).then(res => res.ok ? res.json() : Promise.resolve({}))
    ])
    .then(([playlistData, settingsData, oldNoticeData]) => {
        console.log('📦 playlistData:', playlistData);
        console.log('📦 settingsData:', settingsData);
        console.log('📦 oldNoticeData:', oldNoticeData);

        container.innerHTML = ''; 

        // ১. মেইনটেইন্যান্স মোড চেক
        if (settingsData.maintenance === "ON") {
            document.body.innerHTML = `
                <div style="text-align:center; padding:100px 20px; color:white; background:#020617; min-height:100vh; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <h1 style="font-size:32px; margin-bottom:15px; color:#f87171;">🛠️ সিস্টেম আপডেট চলছে...</h1>
                    <p style="font-size:16px; color:#94a3b8; max-width:500px; margin-bottom:25px;">সাময়িকভাবে আমাদের সার্ভার মেইনটেইন্যান্স করা হচ্ছে। খুব দ্রুতই আমরা লাইভে ফিরবো।</p>
                    ${settingsData.telegram ? `<a href="${settingsData.telegram}" target="_blank" style="background:#10b981; color:#020617; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">আমাদের টেলিগ্রাম গ্রুপে জয়েন করুন</a>` : ''}
                </div>
            `;
            return;
        }

        // ২. নোটিশ বার আপডেট
        const liveNotice = document.getElementById('noticeBar') || document.getElementById('notice');
        const currentNotice = settingsData.notice || oldNoticeData.notice || "";
        if (liveNotice && currentNotice) {
            liveNotice.innerText = currentNotice;
        }

        // ৩. টেলিগ্রাম বাটন আপডেট
        const telegramBtn = document.getElementById('telegramBtn') || document.getElementById('telegramLink');
        if (telegramBtn && settingsData.telegram) {
            telegramBtn.href = settingsData.telegram;
        }

        // ৪. চ্যানেল লিস্ট প্রসেসিং – সব ফরম্যাট হ্যান্ডেল
        let channelList = [];
        if (Array.isArray(playlistData)) {
            channelList = playlistData;
        } else if (playlistData && typeof playlistData === 'object') {
            // যদি অবজেক্ট হয় (যেমন {"1":{...}}), তাহলে অ্যারেতে রূপান্তর
            channelList = Object.values(playlistData);
            // অথবা যদি playlistData.channels থাকে
            if (playlistData.channels && Array.isArray(playlistData.channels)) {
                channelList = playlistData.channels;
            }
        }

        console.log(`✅ মোট চ্যানেল পাওয়া গেছে: ${channelList.length}`);

        if (channelList.length === 0) {
            container.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">কোনো চ্যানেল পাওয়া যায়নি!</p>';
            return;
        }

        // ৫. চ্যানেল রেন্ডার – কোনো স্কিপিং নেই
        let renderedCount = 0;
        channelList.forEach((channel, index) => {
            // নিরাপদ ডিফল্ট মান
            const name = channel.name || `চ্যানেল ${index+1}`;
            const url = channel.url || '#';
            const image = channel.image || 'https://i.postimg.cc/mD1VCt2C/RS-Live.png';

            const li = document.createElement('li');
            li.setAttribute('tabindex', '0');

            li.innerHTML = `
                <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                    <img src="${image}" alt="${name}" loading="lazy" onerror="this.src='https://i.postimg.cc/mD1VCt2C/RS-Live.png';">
                    <div class="channel-info-box">
                        <p class="channel-title">${name}</p>
                    </div>
                </div>
            `;

            li.addEventListener('click', function() {
                if (window.frames['player']) {
                    window.frames['player'].location.href = url;
                } else if (window.player) {
                    player.location.href = url;
                }

                if (searchInput) {
                    searchInput.value = '';
                    const channelItems = container.querySelectorAll('li');
                    channelItems.forEach(item => item.style.display = "");
                }
            });

            container.appendChild(li);
            renderedCount++;
        });

        console.log(`✅ রেন্ডার সম্পন্ন: ${renderedCount} টি চ্যানেল`);

        // ৬. সার্চ ফিল্টার
        if (searchInput) {
            // আগের লিসেনার রিমুভ করে নতুন যোগ (ডুপ্লিকেট এড়াতে)
            const newSearch = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearch, searchInput);
            const freshSearch = document.getElementById('channelSearch');

            freshSearch.addEventListener('input', function() {
                const filterValue = this.value.toLowerCase().trim();
                const channelItems = container.querySelectorAll('li');

                channelItems.forEach(item => {
                    const title = item.querySelector('.channel-title');
                    if (title) {
                        const text = title.textContent.toLowerCase();
                        item.style.display = text.includes(filterValue) ? "" : "none";
                    }
                });
            });
        }

        // ৭. টিভি রিমোট ফোকাস (ঐচ্ছিক)
        if (typeof initTVFocus === 'function') {
            initTVFocus();
        }
    })
    .catch(error => {
        console.error('❌ লোডিং ত্রুটি:', error);
        if (container) {
            container.innerHTML = `
                <p style="color:#ff6b6b; text-align:center; padding:20px;">
                    ⚠️ সিস্টেম লোড হতে সমস্যা হয়েছে!<br>
                    <span style="font-size:12px; color:#888;">${error.message}</span>
                </p>
            `;
        }
    });
});
