(function () {


  const options = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 3,
    keys: [{
      name: 'title',
      weight: 0.5
    }, {
      name: 'author',
      weight: 0.2
    },
    {
      name: 'desc',
      weight: 0.4
    },
    {
      name: 'teaserText',
      weight: 0.6
    },
    {
      name: 'keywords',
      weight: 0.9
    }]
  };

  fetch('/searchIndex.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (searchJSON) {
      const searchIndex = searchJSON.map(function (d) {
        if (d.keywords) d.keywords = cleanCommaDelimited(d.keywords);
        if (d.author) d.author = cleanCommaDelimited(d.author);
        if (d.date) d.date = new Date(d.date); 
    
        return d;
      })
      const fuse = new Fuse(searchIndex, options);

      const defaultResults = 36;

      const searchBoxes = document.querySelectorAll('.search-box');

      const thumbnailBox = document.querySelector('.thumbnails');
      const resultsSorted = searchIndex.sort(function (a, b) { return b.date - a.date }).slice(0, defaultResults);
      if(thumbnailBox.innerHTML == '') thumbnailBox.innerHTML = resultsSorted.map(thumbnailTemplate).join('');

      for (var i = 0; i < searchBoxes.length; i++) {
        searchBoxes[i].addEventListener('keyup', search, false);
      }

      function search(event) {
        const searchResults = event.target.value.length >= options.minMatchCharLength ?
          fuse.search(event.target.value) :
          searchIndex.sort(function (a, b) { return b.date - a.date }).slice(0, defaultResults);

        const searchResultsFormatted = searchResults.map(thumbnailTemplate).join('');

        thumbnailBox.innerHTML = searchResultsFormatted;
      }

      function cleanCommaDelimited(current){
        let split = current.split(",").map(d => d.trim());

        // if(split.length > 1){
        //   split[0] = split[0].slice(1);
        //   split[split.length-1] = split[split.length-1].slice(0,-1);
        // }

        return split;
      }

      function thumbnailTemplate(d) {
        return `<div class="thumb-wrapper thumb-wrapper-small">
                <a aria-label="${d.title}" href=${d.permalink}>
                  <div style="padding-top: 62.5%; background-image: url('${d.teaserThumbnail}'); background-size: cover;"></div>
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