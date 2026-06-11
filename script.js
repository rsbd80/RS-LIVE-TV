document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');

    async function loadChannels() {
        try {
            const snapshot = await firebase.database().ref('playlist').once('value');
            const data = snapshot.val();
            if (data && data.length) return renderChannels(data);
        } catch(e) {}
        fetch('playlist.json?t='+Date.now()).then(r=>r.json()).then(d=>renderChannels(d)).catch(()=>console.log('প্লেলিস্ট লোড হয়নি'));
    }

    function renderChannels(data) {
        if(!container) return;
        container.innerHTML = '';
        data.forEach(ch => {
            const li = document.createElement('li');
            li.setAttribute('tabindex', '0');
            li.innerHTML = `<div style="display:block; pointer-events:none;">
                <img src="${ch.image}" alt="${ch.name}" loading="lazy">
                <div class="channel-info-box"><p class="channel-title">${escapeHtml(ch.name)}</p></div>
            </div>`;
            li.addEventListener('click', () => {
                const iframe = document.getElementById('tv-player-iframe');
                if(iframe) iframe.src = ch.url;
                if(searchInput) { searchInput.value = ''; document.querySelectorAll('#channel-container li').forEach(i=>i.style.display=''); }
            });
            container.appendChild(li);
        });
        if(typeof initTVFocus === 'function') initTVFocus();
    }

    function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

    // বিজ্ঞাপন ও সেটিংস ডায়নামিক লোড
    async function loadWebsiteSettings() {
        const snap = await firebase.database().ref('siteSettings').once('value');
        const s = snap.val() || {};
        if(s.siteTitle) document.title = s.siteTitle;
        if(s.faviconUrl) document.querySelector('link[rel="shortcut icon"]').href = s.faviconUrl;
        if(s.metaDesc) document.querySelector('meta[name="description"]')?.setAttribute('content', s.metaDesc);
        if(s.noticeText) {
            const marquee = document.querySelector('.marquee-container marquee');
            if(marquee) marquee.innerHTML = s.noticeText;
        }
        // গুগল অ্যানালিটিক্স আপডেট
        if(s.gaId && s.gaId !== 'G-DRBZH98TKH') {
            // রিমোট GA স্ক্রিপ্ট আপডেট করা যায় - তবে সহজে না। এখানে শুধু কনফিগ পরিবর্তন দেখানো হলো।
            if(window.gtag) gtag('config', s.gaId);
        }
    }
    async function loadAds() {
        const snap = await firebase.database().ref('adSettings').once('value');
        const ad = snap.val() || {};
        if(ad.scriptUrl && ad.containerId) {
            const oldScript = document.querySelector('script[src*="invoke.js"]');
            if(oldScript) oldScript.remove();
            const script = document.createElement('script');
            script.src = ad.scriptUrl;
            script.async = true;
            document.body.appendChild(script);
        }
    }
    loadChannels();
    loadWebsiteSettings();
    loadAds();
});
