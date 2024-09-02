document.addEventListener('DOMContentLoaded', function () {
    const channelList = document.getElementById('channel-list');
    const searchBar = document.getElementById('search-bar');

    // Fetch and parse M3U8 data
    fetch('https://raw.githubusercontent.com/Playflix007/JioTv.m3u8/main/index.html')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const channels = [];

            // Parse M3U8 lines for all channels
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('#EXTINF')) {
                    const logoMatch = lines[i].match(/tvg-logo="(.*?)"/);
                    const nameMatch = lines[i].match(/,(.*)$/);
                    const url = lines[i + 1];

                    if (logoMatch && nameMatch && url) {
                        channels.push({
                            logo: logoMatch[1],
                            name: nameMatch[1],
                            url: url.trim()
                        });
                    }
                }
            }

            displayChannels(channels);

            // Search bar functionality
            searchBar.addEventListener('input', () => {
                const query = searchBar.value.toLowerCase();
                const filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(query));
                displayChannels(filteredChannels);
            });
        })
        .catch(error => console.error('Error fetching channels:', error));

    // Function to display channels on the page
    function displayChannels(channels) {
        channelList.innerHTML = '';
        channels.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';
            channelCard.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}">
                <p>${channel.name}</p>
            `;
            channelCard.addEventListener('click', () => {
                // Redirect to player.html with video URL and alias as query parameters
                window.location.href = `player.html?videoUrl=${encodeURIComponent(channel.url)}&alias=${encodeURIComponent(channel.name)}`;
            });
            channelList.appendChild(channelCard);
        });
    }
});