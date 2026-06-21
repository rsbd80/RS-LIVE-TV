document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');
    const iframe = document.getElementById('tv-iframe');

    // 🌟 এখানে আপনার নিজের ক্লাউডফ্লেয়ার ওয়ার্কার লিংকটি বসাবেন (শেষে /?url= অবশ্যই রাখবেন)
    const workerUrl = "https://bestiptv.bestiptv-pro.workers.dev/?url=";

    // একই সাথে প্লেলিস্ট, সেটিংস এবং পুরনো নোটিশ ডাইনামিক লোড করার ফাস্ট ট্রিক
    Promise.all([
        fetch('playlist.json?t=' + Date.now()).then(res => res.json()).catch(() => []),
        fetch('app_settings.json?t=' + Date.now()).then(res => res.json()).catch(() => ({})),
        fetch('notice.json?t=' + Date.now()).then(res => res.json()).catch(() => ({}))
    ])
    .then(([playlistData, settingsData, oldNoticeData]) => {
        if (!container) return;
        container.innerHTML = ''; 

        // 🛠️ ১. মেইনটেইন্যান্স মোড চেক
        const isMaintenance = settingsData.maintenance === "ON";
        if (isMaintenance) {
            document.body.innerHTML = `
                <div style="text-align:center; padding:100px 20px; color:white; background:#020617; min-height:100vh; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <h1 style="font-size:32px; margin-bottom:15px; color:#f87171;">🛠️ সিস্টেম আপডেট চলছে...</h1>
                    <p style="font-size:16px; color:#94a3b8; max-width:500px; margin-bottom:25px;">সাময়িকভাবে আমাদের সার্ভার মেইনটেইন্যান্স করা হচ্ছে। খুব দ্রুতই আমরা লাইভে ফিরবো।</p>
                    ${settingsData.telegram ? `<a href="${settingsData.telegram}" target="_blank" style="background:#10b981; color:#020617; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:10px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">আমাদের টেলিগ্রাম গ্রুপে জয়েন করুন</a>` : ''}
                </div>
            `;
            return;
        }

        // 📢 ২. লাইভ স্ক্রোল নোটিশ বার আপডেট
        const liveNotice = document.getElementById('noticeBar') || document.getElementById('notice'); 
        const currentNotice = settingsData.notice || oldNoticeData.notice || "";
        if (liveNotice && currentNotice) {
            liveNotice.innerText = currentNotice;
            liveNotice.style.display = "block";
        }

        // 📢 ৩. টেলিগ্রাম বাটনের লিংক আপডেট
        const telegramBtn = document.getElementById('telegramBtn') || document.getElementById('telegramLink');
        if (telegramBtn && settingsData.telegram) {
            telegramBtn.href = settingsData.telegram;
        }

        // 📺 ৪. চ্যানেল লিস্ট প্রসেসিং
        const channelList = Array.isArray(playlistData) ? playlistData : (playlistData.channels || []);

        if (channelList.length === 0) {
            container.innerHTML = '<p style="color:#aaa; text-align:center; padding:20px;">কোনো চ্যানেল পাওয়া যায়নি!</p>';
            return;
        }

        // সাইট লোড হওয়ামাত্রই প্রথম চ্যানেলটি অটোমেটিক আইফ্রেমে ফাস্ট প্লে করার জন্য
        if (iframe && channelList[0] && channelList[0].url) {
            let firstUrl = channelList[0].url;
            if (!firstUrl.startsWith(workerUrl)) {
                firstUrl = workerUrl + encodeURIComponent(firstUrl);
            }
            iframe.src = "channel.html?url=" + encodeURIComponent(firstUrl);
        }

        // চ্যানেলগুলো স্ক্রিনে রেন্ডার করা (আপনার অরিজিনাল কার্ড ও টেক্সট ডিজাইন)
        channelList.forEach((channel, index) => {
            const li = document.createElement('li');
            li.className = 'channel-item' + (index === 0 ? ' active' : '');
            li.setAttribute('tabindex', '0');
            
            // আপনার আগের নিখুঁত ডিজাইন ফিরিয়ে আনা হলো যাতে নাম নিচে শো করে
            li.innerHTML = `
                <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                    <img src="${channel.image}" alt="${channel.name}" loading="lazy" onerror="this.src='https://i.postimg.cc/mD1VCt2C/RS-Live.png';">
                    <div class="channel-info-box">
                        <p class="channel-title">${channel.name}</p>
                    </div>
                </div>
            `;

            // ক্লিক ইভেন্ট ফিক্স (ইনস্ট্যান্ট লোড হওয়ার এবং চ্যানেল রান করার লজিক)
            li.addEventListener('click', function() {
                if (iframe && channel.url) {
                    let finalStreamUrl = channel.url;
                    
                    // অটোমেটিক ক্লাউডফ্লেয়ার প্রক্সি যুক্ত করার লজিক
                    if (!finalStreamUrl.startsWith(workerUrl)) {
                        finalStreamUrl = workerUrl + encodeURIComponent(finalStreamUrl);
                    }

                    // আইফ্রেম রিলোড করার সবচেয়ে ফাস্ট জাভাস্ক্রিপ্ট মেথড
                    iframe.contentWindow.location.replace("channel.html?url=" + encodeURIComponent(finalStreamUrl));
                }

                // একটিভ ক্লাস সিলেক্ট ও টগল করা
                const allItems = container.querySelectorAll('li');
                allItems.forEach(item => item.classList.remove('active'));
                li.classList.add('active');

                // চ্যানেল প্লে হলে সার্চবক্স ক্লিয়ার হবে
                if (searchInput) {
                    searchInput.value = '';
                    const channelItems = container.querySelectorAll('li');
                    channelItems.forEach(item => item.style.display = "");
                }
            });
            
            container.appendChild(li);
        });

        // 🔍 ৫. লাইভ সার্চ ফিল্টার লজিক
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const filterValue = this.value.toLowerCase().trim();
                const channelItems = container.querySelectorAll('li');

                channelItems.forEach(item => {
                    const channelTitle = item.querySelector('.channel-title').textContent.toLowerCase();
                    if (channelTitle.includes(filterValue)) {
                        item.style.display = ""; 
                    } else {
                        item.style.display = "none"; 
                    }
                });
            });
        }

        // অ্যান্ড্রয়েড টিভি রিমোট কন্ট্রোল ফোকাস ইনিশিয়েট করা
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
