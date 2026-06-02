document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // JSON ফাইল থেকে চ্যানেল লোড করা
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            // আগের তালিকা পরিষ্কার করা
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // লোগো এবং তার নিচে চ্যানেলের নিজস্ব নাম (Rs Live Tv বাদ দেওয়া হয়েছে)
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'">
                        <img src="${channel.image}" alt="${channel.name}">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </a>
                `;
                
                container.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px;">Error!</p>';
        });
});

// রাইট ক্লিক বন্ধ রাখার ফাংশন
document.oncontextmenu = function() { return false; };
