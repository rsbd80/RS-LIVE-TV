document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // JSON ফাইল থেকে চ্যানেল লোড করা
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // এখানে আপনার অরিজিনাল ১ ক্লিকের এঙ্কর (a) ট্যাগ লজিক রাখা হয়েছে
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
