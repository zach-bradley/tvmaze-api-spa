/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let request = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  let showArr = request.data.map(show => {
    let currShow = show.show;
    return {
      id: currShow.id,
      name: currShow.name,
      summary: currShow.summary,
      image: currShow.image ? currShow.image.original : "https://tinyurl.com/tv-missing"
    }
  })
  return showArr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show my-2" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary">Episodes</button>
           </div>     
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // Get episodes from tvmaze
  let request = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  let episodes = request.data.map(episode => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }
  })
  //Return array-of-episode-info
  return episodes;
}

//Populate episodes list: given list of episodes, addes to DOM
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let ep of episodes) {
    let $item = $(`<li>${ep.name} - (Season ${ep.season}, Episode ${ep.number})</li>`);

    $episodesList.append($item);
  }
}

// Event handler for Episodes button: handles getting episode id, 
// populating episodes list to add to DOM, 
// and showing episodes area;
$('#shows-list').on('click', 'button', async function handleEpisodes (evt) {
  evt.preventDefault();
  let $dataId = $(this).parent().parent().data('show-id');
  let episodes = await getEpisodes($dataId);
  populateEpisodes(episodes);
  $("#episodes-area").show();
});

// Write tests for your functions. Practice writing software tests in a great way to get better at this critical developer skill!

// Add other information/features from TVMaze. There are other things you can get from TV Maze—you could list the actors in a show, or the genres of a show, or other things.

// Make the episodes into a Bootstrap modal. If you want to learn more about the components of Bootstrap, you could change you code so that it shows the list of episodes in a pop-up modal, rather than a list at the bottom of the page.

// If you wrote the functions in part 3 well, you should be able to this only by having to change the populateEpisodes function, but not other parts of your JavaScript — a nice reward for breaking your code thoughtfully into good functions!