document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ডেক্সটপ/টিভিতে ফাস্ট লোড করার জন্য এবং ক্যাশ সমস্যা এড়াতে Date.now() ট্রিক ব্যবহার করা হয়েছে
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // রিমোট কন্ট্রোল যেন ডাবল ফোকাস না করে, সেজন্য এঙ্কর ট্যাগের ভেতরে সরাসরি ক্লিক লজিক রাখা হয়েছে
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'" style="display: block; text-decoration: none;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
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
