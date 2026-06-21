document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');

    // ক্যাশ এড়াতে এবং দ্রুত ডেটা লোড করতে টাইমস্ট্যাম্প ট্রিক
    const cacheBuster = '?t=' + Date.now();

    Promise.all([
        fetch('playlist.json' + cacheBuster).then(res => res.json()).catch(() => []),
        fetch('app_settings.json' + cacheBuster).then(res => res.json()).catch(() => ({}))
    ])
    .then(([playlistData, settingsData]) => {
        if (!container) return;
        container.innerHTML = ''; 

        // ১. মেইনটেইন্যান্স মোড চেক
        if (settingsData.maintenance === "ON") {
            document.body.innerHTML = `
                <div style="text-align:center; padding:100px 20px; color:white; background:#020617; min-height:100vh; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <h1 style="font-size:32px; margin-bottom:15px; color:#f87171;">🛠️ সিস্টেম আপডেট চলছে...</h1>
                    <p style="font-size:18px; color:#94a3b8; max-width:500px; line-height:1.6;">রক্ষণাবেক্ষণের কাজের জন্য সাময়িকভাবে চ্যানেল বন্ধ আছে। খুব দ্রুতই আমরা ফিরে আসছি।</p>
                </div>`;
            return;
        }

        // ২. নোটিশ আপডেট লজিক
        const noticeEl = document.getElementById('notice-text');
        if (noticeEl && settingsData.notice) {
            noticeEl.textContent = settingsData.notice;
        }

        // ৩. টেলিগ্রাম লিংক আপডেট
        const telegramBtn = document.getElementById('telegram-btn');
        if (telegramBtn && settingsData.telegram) {
            telegramBtn.href = settingsData.telegram;
        }

        // ৪. প্লেলিস্ট রেন্ডারিং (ডম অপ্টিমাইজড)
        if (playlistData.length === 0) {
            container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:20px;">কোনো চ্যানেল পাওয়া যায়নি!</p>';
            return;
        }

        const fragment = document.createDocumentFragment();

        playlistData.forEach((channel, index) => {
            const li = document.createElement('li');
            li.setAttribute('tabindex', '0'); 
            li.className = 'channel-item';

            li.innerHTML = `
                <div class="channel-card">
                    <img src="${channel.image}" alt="${channel.name}" loading="lazy" onerror="this.src='https://i.postimg.cc/mD1VCt2C/RS-Live.png'">
                    <span class="channel-title">${channel.name}</span>
                </div>
            `;

            // চ্যানেল ক্লিক ইভেন্ট (আইফ্রেম লোড)
            li.addEventListener('click', () => {
                const iframe = document.getElementById('tv-iframe');
                if (iframe) {
                    iframe.src = channel.url;
                }
                
                // একটিভ ক্লাস টগল
                document.querySelectorAll('#channel-container li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');

                // সার্চ ইনপুট ক্লিয়ার
                if (searchInput) {
                    searchInput.value = '';
                    document.querySelectorAll('#channel-container li').forEach(item => item.style.display = "");
                }
            });
            
            fragment.appendChild(li);
        });

        container.appendChild(fragment);

        // ৫. লাইভ সার্চ ফিল্টার
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

        // টিভি রিমোট ফোকাস ইনিশিয়েট করা
        if (typeof initTVFocus === 'function') {
            initTVFocus();
        }
    })
    .catch(error => {
        console.error('Error loading assets:', error);
        if (container) {
            container.innerHTML = '<p style="color:#ef4444; text-align:center; padding:20px;">সিস্টেম লোড হতে সমস্যা হয়েছে!</p>';
        }
    });
});
