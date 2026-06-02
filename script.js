document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ক্যাশ সমস্যা এড়াতে টাইমস্ট্যাম্পসহ প্লেলিস্ট লোড করা হচ্ছে
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // আপনার আগের সেই আসল ক্লিক লজিক
                li.addEventListener('click', function() {
                    const targetUrl = "channel.html?url=" + channel.url;
                    
                    if (window.frames['player']) {
                        window.frames['player'].location.href = targetUrl;
                    } else {
                        player.location.href = targetUrl;
                    }
                });
                
                container.appendChild(li);
            });

            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});
