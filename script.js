document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // JSON ফাইল থেকে চ্যানেল লোড করা
    fetch('playlist.json')
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach(channel => {
                const li = document.createElement('li');
                
                // কিবোর্ড বা রিমোট ফোকাস যেন ডাবল ট্যাপ না খায়, তাই স্বাভাবিক ফোকাস রাখা হলো
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <a href="javascript:void(0);" style="display: block; text-decoration: none;" tabindex="-1">
                        <img src="${channel.image}" alt="${channel.name}">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </a>
                `;

                // ১. মাউস দিয়ে ক্লিক করলে চ্যানেল প্লে হবে
                li.addEventListener('click', function() {
                    player.location.href = channel.url;
                });

                // ২. কিবোর্ড বা টিভি রিমোটের 'Enter' চাপলে চ্যানেল প্লে হবে (ডাবল ট্যাপ ফ্রি)
                li.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault(); 
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

// রাইট ক্লিক বন্ধ রাখার ফাংশন
document.oncontextmenu = function() { return false; };
