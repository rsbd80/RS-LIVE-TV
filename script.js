document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');
    const searchInput = document.getElementById('channelSearch');

    // Firebase থেকে চ্যানেল লোড
    async function loadChannels() {
        // দেখি Firebase রেডি কিনা
        if (typeof firebase === 'undefined') {
            console.log('Firebase লোড হয়নি, লোকাল ফাইল ব্যবহার হবে');
            loadLocalPlaylist();
            return;
        }
        
        try {
            const snapshot = await firebase.database().ref('playlist').once('value');
            const data = snapshot.val();
            if (data && data.length > 0) {
                renderChannels(data);
                return;
            }
        } catch(e) {
            console.log('Firebase থেকে লোড করতে পারেনি:', e);
        }
        
        // ব্যাকআপ: লোকাল playlist.json
        loadLocalPlaylist();
    }
    
    function loadLocalPlaylist() {
        fetch('playlist.json?t=' + Date.now())
            .then(response => response.json())
            .then(data => renderChannels(data))
            .catch(error => {
                console.error('প্লেলিস্ট লোড করতে পারেনি:', error);
                if (container) {
                    container.innerHTML = '<li style="color:red; text-align:center; padding:20px;">প্লেলিস্ট লোড করতে পারেনি</li>';
                }
            });
    }

    function renderChannels(data) {
        if (!container) return;
        container.innerHTML = '';
        
        if (!data || data.length === 0) {
            container.innerHTML = '<li style="color:#888; text-align:center; padding:20px;">কোনো চ্যানেল নেই</li>';
            return;
        }
        
        data.forEach((channel, index) => {
            const li = document.createElement('li');
            li.setAttribute('tabindex', '0');
            li.setAttribute('data-channel-id', index);
            
            li.innerHTML = `
                <div style="display: block; pointer-events: none; width: 100%;">
                    <img src="${channel.image}" alt="${channel.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/100x85?text=No+Logo'">
                    <div class="channel-info-box">
                        <p class="channel-title">${escapeHtml(channel.name)}</p>
                    </div>
                </div>
            `;
            
            li.addEventListener('click', function() {
                // আইফ্রেমে ইউআরএল লোড
                const iframe = document.getElementById('tv-player-iframe');
                if (iframe) {
                    iframe.src = channel.url;
                } else if (window.frames['player']) {
                    window.frames['player'].location.href = channel.url;
                }
                
                // সার্চ বক্স ক্লিয়ার
                if (searchInput) {
                    searchInput.value = '';
                    // সব চ্যানেল দেখানো
                    document.querySelectorAll('#channel-container li').forEach(item => {
                        item.style.display = '';
                    });
                }
            });
            
            container.appendChild(li);
        });
        
        // TV রিমোট ফোকাস
        if (typeof initTVFocus === 'function') {
            initTVFocus();
        } else {
            // ডিফল্ট ফোকাস প্রথম চ্যানেলে
            setTimeout(() => {
                const firstChannel = document.querySelector('#channel-container li');
                if (firstChannel && document.activeElement !== searchInput) {
                    firstChannel.focus();
                }
            }, 500);
        }
    }
    
    // XSS প্রোটেকশনের জন্য
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // সার্চ ফাংশন
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filter = this.value.toLowerCase().trim();
            const items = document.querySelectorAll('#channel-container li');
            
            items.forEach(item => {
                const title = item.querySelector('.channel-title');
                if (title) {
                    const text = title.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // চ্যানেল লোড শুরু করুন
    loadChannels();
});
