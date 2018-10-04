(function () {


    const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 2,
        keys: [
            "title",
            "author",
            "desc",
            "teaserText"
        ]
    };

    fetch('searchIndex.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (searchIndex) {
            const fuse = new Fuse(searchIndex, options);
            
            const defaultResults = 6;
            
            const searchBoxes = document.querySelectorAll('.search-box');
            
            const thumbnailBox = document.querySelector('.thumbnails');
            thumbnailBox.innerHTML = searchIndex.slice(0,defaultResults+1).map(thumbnailTemplate).join('');

            for (var i = 0; i < searchBoxes.length; i++) {
                searchBoxes[i].addEventListener('keyup', search, false);
            }

            function search(event) {
                const searchResults = event.target.value.length ? fuse.search(event.target.value) : searchIndex.slice(0,defaultResults+1);
                
                const searchResultsFormatted = searchResults.map(thumbnailTemplate).join('');

                thumbnailBox.innerHTML = searchResultsFormatted;
            }

            function thumbnailTemplate(d){
                return `<div class="thumb-wrapper thumb-wrapper-small">
                <a aria-label="${d.title}" href=${d.permalink}>
                  <div style="padding-top: 62.5%; background-image: url('${d.teaserImage}'); background-size: cover;"></div>
                </a>
                <div class="thumb-title-wrapper">
                  <a class="thumb-title-link" href="${d.permalink}">
                    <div title="${d.title}" class="thumb-title">${d.teaserText}</div>
                  </a>
                </div>
              </div>`
            }

        });

}());