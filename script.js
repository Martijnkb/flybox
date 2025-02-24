document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const episodesContainer = document.getElementById('episodes');
    let episodes = [];

    // Load episode data from JSON
    fetch('episodes.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load episode data');
            return response.json();
        })
        .then(data => {
            episodes = data;
            displayEpisodes(episodes, '');
        })
        .catch(error => {
            episodesContainer.innerHTML = '<p>Error loading episodes. Please try again later.</p>';
            console.error(error);
        });

    // Function to display episodes
    function displayEpisodes(episodesToShow, searchTerm) {
        episodesContainer.innerHTML = '';
        if (episodesToShow.length === 0 && searchTerm) {
            episodesContainer.innerHTML = '<p>No matching questions found.</p>';
            return;
        }

        episodesToShow.forEach(episode => {
            const episodeDiv = document.createElement('div');
            episodeDiv.classList.add('episode');

            let content = `
                <h2><a href="${episode.url}" target="_blank">${episode.title}</a></h2>
                <p><strong>Date:</strong> ${episode.date}</p>
            `;

            if (searchTerm) {
                const matchingQuestions = episode.questions.filter(q =>
                    q.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (matchingQuestions.length > 0) {
                    content += '<ul>' + matchingQuestions.map(q => `<li>${q}</li>`).join('') + '</ul>';
                }
            } else {
                content += '<p><strong>Questions:</strong> ' + (episode.questions.length > 0 ? episode.questions.join(', ') : 'None listed') + '</p>';
            }

            episodeDiv.innerHTML = content;
            episodesContainer.appendChild(episodeDiv);
        });
    }

    // Filter episodes based on search input
    searchInput.addEventListener('input', () => {
        const term = searchInput.value.trim();
        if (term) {
            const filtered = episodes.filter(episode =>
                episode.questions.some(q => q.toLowerCase().includes(term.toLowerCase()))
            );
            displayEpisodes(filtered, term);
        } else {
            displayEpisodes(episodes, '');
        }
    });
});