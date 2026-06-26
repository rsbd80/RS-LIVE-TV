document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');

    // লোডিং টাইমস্ট্যাম্প (ক্যাশে বাস্ট)
    const ts = Date.now();

    Promise.all([
        fetch('playlist.json?t=' + ts)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('📦 playlist.json রেসপন্স সাইজ:', JSON.stringify(data).length, 'অক্ষর');
                console.log('📦 রেসপন্স টাইপ:', Array.isArray(data) ? 'অ্যারে' : typeof data);
                return data;
            })
            .catch(err => {
                console.error('❌ playlist.json লোড ব্যর্থ:', err);
                return [];
            }),
        fetch('app_settings.json?t=' + ts).then(res => res.ok ? res.json() : {}).catch(() => ({})),
        fetch('notice.json?t=' + ts).then(res => res.ok ? res.json() : {}).catch(() => ({}))
    ])
    .then(([playlistData, settingsData, oldNoticeData]) => {
        container.innerHTML = ''; 

        // মেইনটেইন্যান্স চেক
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

        // নোটিশ ও টেলিগ্রাম আপডেট
        const liveNotice = document.getElementById('noticeBar') || document.getElementById('notice');
        const currentNotice = settingsData.notice || oldNoticeData.notice || "";
        if (liveNotice && currentNotice) liveNotice.innerText = currentNotice;

        const telegramBtn = document.getElementById('telegramBtn') || document.getElementById('telegramLink');
        if (telegramBtn && settingsData.telegram) telegramBtn.href = settingsData.telegram;

        // চ্যানেল লিস্ট কনভার্ট – সব ফরম্যাট হ্যান্ডেল
        let channelList = [];
        if (Array.isArray(playlistData)) {
            channelList = playlistData;
        } else if (playlistData && typeof playlistData === 'object') {
            channelList = Object.values(playlistData);
            if (playlistData.channels && Array.isArray(playlistData.channels)) {
                channelList = playlistData.channels;
            }
        }

        console.log(`📊 মোট চ্যানেল অবজেক্টের সংখ্যা: ${channelList.length}`);

        if (channelList.length === 0) {
            container.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">কোনো চ্যানেল পাওয়া যায়নি!</p>';
            return;
        }

        // =============================================================
        // ⭐ গুরুত্বপূর্ণ: সাজানো বাদ দেওয়া হয়েছে – JSON ফাইলের ক্রমেই থাকবে
        // =============================================================
        // যদি আপনি order ফিল্ড অনুযায়ী সাজাতে চান, তাহলে নিচের লাইনটি আনকমেন্ট করুন:
        // channelList.sort((a, b) => (a.order || 0) - (b.order || 0));

        // এখন রেন্ডার করুন – কোনো সাজানো ছাড়াই
        let renderedCount = 0;
        channelList.forEach((channel, index) => {
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
                    const items = container.querySelectorAll('li');
                    items.forEach(item => item.style.display = "");
                }
            });

            container.appendChild(li);
            renderedCount++;
        });

        console.log(`✅ রেন্ডার সম্পন্ন: ${renderedCount} টি চ্যানেল (JSON ফাইলের ক্রমানুসারে)`);

        // সার্চ ফিল্টার (ডুপ্লিকেট এড়াতে ক্লোন)
        if (searchInput) {
            const newSearch = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearch, searchInput);
            const freshSearch = document.getElementById('channelSearch');
            freshSearch.addEventListener('input', function() {
                const filter = this.value.toLowerCase().trim();
                const items = container.querySelectorAll('li');
                items.forEach(item => {
                    const title = item.querySelector('.channel-title');
                    if (title) {
                        const text = title.textContent.toLowerCase();
                        item.style.display = text.includes(filter) ? "" : "none";
                    }
                });
            });
        }

        if (typeof initTVFocus === 'function') initTVFocus();
    })
    .catch(error => {
        console.error('❌ লোডিং ত্রুটি:', error);
        if (container) {
            container.innerHTML = `<p style="color:#ff6b6b; text-align:center; padding:20px;">⚠️ সিস্টেম লোড হতে সমস্যা হয়েছে!<br><span style="font-size:12px; color:#888;">${error.message}</span></p>`;
        }
    });
});
