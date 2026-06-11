// আপনার গিটহাব রিপোজিটরির তথ্যের ভিত্তিতে কনফিগারড
const GITHUB_USER = "tv-bd2";
const GITHUB_REPO = "RS-LIVE-TV";

const BASE_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main`;

// settings.json এবং notice.json থেকে লাইভ ডেটা সিঙ্ক করার মেইন ফাংশন
async function syncWebsiteConfigs() {
    try {
        // ১. গ্লোবাল সেটিংস ফাইল রিড করা হচ্ছে
        const settingsRes = await fetch(`${BASE_RAW_URL}/settings.json?t=${new Date().getTime()}`);
        if (settingsRes.ok) {
            const settings = await settingsRes.json();
            
            // মেইনটেইন্যান্স মোড একটিভ থাকলে পুরো সাইট লক স্ক্রিন হয়ে যাবে
            if (settings.maintenanceMode) {
                document.body.innerHTML = `
                    <div style="background:#020617; color:#ef4444; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px; box-sizing:border-box;">
                        <span style="font-size:64px; animation: pulse 2s infinite;">🛠️</span>
                        <h1 style="font-size:32px; font-weight:900; margin-top:20px; text-transform:uppercase; color:#f87171; tracking-wide">Under Maintenance</h1>
                        <p style="color:#94a3b8; max-width:450px; font-size:14px; margin-top:10px; line-height:1.5;">We are currently updating our servers to give you a better experience. Please check back shortly.</p>
                        ${settings.supportLink ? `<a href="${settings.supportLink}" target="_blank" style="margin-top:24px; background:#10b981; color:#020617; padding:12px 24px; border-radius:12px; text-decoration:none; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:1px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">Join Telegram Support</a>` : ''}
                    </div>
                `;
                return; // সাইট লক থাকা অবস্থায় পেজের বাকি জাভাস্ক্রিপ্ট এক্সিকিউশন বন্ধ থাকবে
            }

            // ডাইনামিকালি সাইটের টাইটেল (নাম) পরিবর্তন
            document.title = settings.siteName || "RS LIVE TV";
            
            // সাইটের ব্র্যান্ড লোগো ইমেজ পরিবর্তন
            const logoImg = document.getElementById('siteBrandLogo');
            if (logoImg && settings.siteLogo) {
                logoImg.src = settings.siteLogo;
            }

            // ডাইনামিক প্রাইমারি থিম কালার বাটন বা নির্দিষ্ট এলিমেন্টে পুশ করা
            if (settings.themeColor) {
                document.documentElement.style.setProperty('--theme-primary', settings.themeColor);
                
                // আপনার ক্লাসে ".dynamic-bg" থাকা সব এলিমেন্টের ব্যাকগ্রাউন্ড কালার চেঞ্জ হবে
                const themeElements = document.querySelectorAll('.dynamic-bg');
                themeElements.forEach(el => el.style.backgroundColor = settings.themeColor);
            }
        }

        // ২. নোটিশ বোর্ডের ফাইল রিড করা হচ্ছে
        const noticeRes = await fetch(`${BASE_RAW_URL}/notice.json?t=${new Date().getTime()}`);
        if (noticeRes.ok) {
            const noticeData = await noticeRes.json();

            // রানিং স্ক্রলিং নোটিশ (Marquee Text) আপডেট
            const tickerEl = document.getElementById('scrollingNoticeText');
            if (tickerEl && noticeData.scrollNotice) {
                tickerEl.innerText = noticeData.scrollNotice;
            }

            // যদি অ্যাডমিন প্যানেল থেকে 'Show Notice' টিক দেওয়া থাকে (Pop-up alert)
            if (noticeData.showNotice && noticeData.mainNotice) {
                // এটি পেজ লোড হতেই ব্রাউজারে একটি অ্যালার্ট পপআপ দেখাবে
                alert(`📢 IMPORTANT NOTICE:\n\n${noticeData.mainNotice}`);
            }
        }

    } catch (error) {
        console.error("Error syncing live configs from GitHub repository:", error);
    }
}

// ডোমেস্টিকালি পেজ লোড কমপ্লিট হলেই ফাংশনটি ট্রিগার হবে
window.addEventListener('DOMContentLoaded', syncWebsiteConfigs);
