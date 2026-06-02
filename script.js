document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // রিমোট ট্র্যাকিংয়ের জন্য TabIndex সেট করা হলো
                li.setAttribute('tabindex', index + 1);
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // চ্যানেল প্লে করার ইভেন্ট
                li.addEventListener('click', function() {
                    if (window.frames['player']) {
                        window.frames['player'].location.href = channel.url;
                    } else {
                        player.location.href = channel.url;
                    }
                });
                
                container.appendChild(li);
            });

            // 🎯 চ্যানেললিস্ট সম্পূর্ণ লোড হওয়ার পর রিমোট ফোকাস ইঞ্জিন চালু করা হলো
            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center;">Error Loading Playlist!</p>';
        });
});
