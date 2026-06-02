document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // ডেক্সটপের স্লো লোডিং ফিক্স করতে এবং প্রতিবার নতুন করে ফাইল রিড করতে এই ট্রিকটি ব্যবহার করা হয়েছে
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // ১ ক্লিকে ১টি চ্যানেল লোড হওয়ার জন্য ক্লিন এঙ্কর ট্যাগ লজিক
                li.innerHTML = `
                    <a href="javascript:void(0);" onclick="player.location.href='${channel.url}'">
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
