document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // JSON ফাইল থেকে চ্যানেল লোড করা
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(channel => {
                const li = document.createElement('li');
                
                // রিমোট ফোকাস যেন কাজ করে সেজন্য tabindex="0" যোগ করা হয়েছে
                li.setAttribute('tabindex', '0');
                
                // ১২৮০×৭২০ রেশিওর লোগো এবং নিচে চ্যানেলের নাম ও Rs Live Tv লেখা
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'" style="text-decoration: none; display: block;">
                        <img src="${channel.image}" alt="${channel.name}">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                            <p class="brand-watermark">Rs Live Tv</p>
                        </div>
                    </a>
                `;
                
                // রিমোট বা কিবোর্ডের এন্টার বাটনে যেন চ্যানেল প্লে হয় তার লজিক
                li.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        player.location.href = channel.url;
                    }
                });

                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px;">Error!</p>';
        });
});

// রাইট ক্লিক বন্ধ রাখার স্ক্রিপ্ট
document.oncontextmenu = function() { return false; };
