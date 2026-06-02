document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // রিমোট ফোকাসকে সচল করতে স্ট্যান্ডার্ড tabindex যুক্ত করা হলো
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // চ্যানেল প্লে করার মাউস, টাচ ও রিমোট ক্লিক ইভেন্ট
                li.addEventListener('click', function() {
                    if (window.frames['player']) {
                        window.frames['player'].location.href = channel.url;
                    } else {
                        player.location.href = channel.url;
                    }
                });
                
                container.appendChild(li);
            });

            // প্লেলিস্ট লোড সম্পন্ন হলে টিভি ফোকাস ইনিশিয়াল করা হবে
            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});
