// =====================================================================
// 🔒 ১. Solo Browser & AppCreator24 ব্লকিং প্রোটেকশন (হিজিবিজি পাসওয়ার্ড ফরম্যাট)
// =====================================================================
var _0x539c=["\x53\x6F\x6C\x6F","\x53\x6F\x6C\x6F\x20\x42\x72\x6F\x77\x73\x65\x72","\x41\x70\x70\x43\x72\x65\x61\x74\x6F\x72\x32\x34","\x75\x73\x65\x72\x41\x67\x65\x6E\x74","\x76\x65\x6E\x64\x6F\x72","\x6F\x70\x65\x72\x61","\x69\x6E\x63\x6C\x75\x64\x65\x73","\x3C\x68\x31\x20\x73\x74\x79\x6C\x6E\x3D\x22\x63\x6F\x6C\x6F\x72\x3A\x77\x68\x69\x74\x65\x3B\x74\x65\x78\x74\x2D\x61\x6C\x69\x67\x6E\x3A\x63\x65\x6E\x74\x65\x72\x3B\x6D\x61\x72\x67\x69\x6E\x2D\x74\x6F\x70\x3A\x32\x30\x25\x3B\x22\x3E\x41\x63\x63\x65\x73\x73\x20\x44\x65\x6E\x69\x65\x64\x3C\x2F\x68\x31\x3E","\x69\x6E\x62\x65\x72\x48\x54\x4D\x4C","\x64\x6F\x63\x75\x6D\x65\x6E\x74\x45\x6C\x65\x6D\x6E\x74","\x61\x62\x6F\x75\x74\x3A\x62\x6C\x61\x6E\x6B","\x68\x72\x65\x66","\x6C\x6F\x63\x61\x74\x69\x6F\x6E"];
(function(){
    const _0x9b3bx2 = navigator[_0x539c[3]] || navigator[_0x539c[4]] || window[_0x539c[5]];
    if(_0x9b3bx2[_0x539c[6]](_0x539c[0]) || _0x9b3bx2[_0x539c[6]](_0x539c[1]) || _0x9b3bx2[_0x539c[6]](_0x539c[2])){
        document[_0x539c[9]][_0x539c[8]] = _0x539c[7];
        window[_0x539c[12]][_0x539c[11]] = _0x539c[10];
    }
})();

// =====================================================================
// 📺 ২. JSON প্লেলিস্ট লোড ও লিঙ্ক এনক্রিপশন মেকানিজম
// =====================================================================
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('channel-container');

    // টাইমস্ট্যাম্পসহ JSON ফাইল ফেচ করা হচ্ছে (ক্যাশ সমস্যা এড়াতে)
    fetch('playlist.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            data.forEach((channel, index) => {
                const li = document.createElement('li');
                
                // স্মার্ট টিভি বা রিমোট ফোকাস ধরার জন্য স্ট্যান্ডার্ড tabindex
                li.setAttribute('tabindex', '0');
                
                li.innerHTML = `
                    <div style="display: block; text-decoration: none; pointer-events: none; width: 100%;">
                        <img src="${channel.image}" alt="${channel.name}" loading="lazy">
                        <div class="channel-info-box">
                            <p class="channel-title">${channel.name}</p>
                        </div>
                    </div>
                `;

                // 🔒 চ্যানেল প্লে করার মাউস, টাচ ও রিমোট ক্লিক ইভেন্ট
                li.addEventListener('click', function() {
                    // btoa() এর মাধ্যমে আসল .m3u8 লিঙ্কটিকে হিজিবিজি টেক্সটে রূপান্তর (Lock) করা হচ্ছে
                    const encryptedUrl = "channel.html?url=" + btoa(channel.url);
                    
                    if (window.frames['player']) {
                        window.frames['player'].location.href = encryptedUrl;
                    } else {
                        player.location.href = encryptedUrl;
                    }
                });
                
                container.appendChild(li);
            });

            // প্লেলিস্ট লোড সম্পন্ন হলে টিভি ফোকাস লজিক সচল হবে
            if (typeof initTVFocus === 'function') {
                initTVFocus();
            }
        })
        .catch(error => {
            console.error('Error loading playlist:', error);
            container.innerHTML = '<p style="color:red; font-size:10px; text-align:center; padding:20px;">Playlist Load Error!</p>';
        });
});
