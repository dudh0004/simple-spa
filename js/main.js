const APP = {
  api_key : '819ff85b3d0216f0611f8ae0e97b2227',
  init: () => {
    document.querySelector('.active').classList.remove('active');
    document.getElementById('instructions').classList.add('active');
    document.getElementById('footer').classList.add('footer');
    history.pushState({}, instructions, `#${instructions}`);
    let btn = document.querySelector('#btnSearch');
    btn.addEventListener('click', ACTORS.actorsDetails);
  },
};

const ACTORS = {
  actorsDetails: (ev) => {
    ev.preventDefault();
    let details = document.querySelector('#search');
    document.querySelector('.active').classList.remove('active');
    document.getElementById('media').classList.remove('active');
    document.getElementById('footer').classList.remove('footer');
    document.getElementById('actors').classList.add('active');
    history.pushState({}, actors, `#${actors}`);

    let searchValue = details.value;
    console.log(searchValue);
    let search_url = `https://api.themoviedb.org/3/search/person?api_key=819ff85b3d0216f0611f8ae0e97b2227&language=en-US&query=${searchValue}&page=1&include_adult=false`;
  if(searchValue.length == 0){
    alert('Please enter an Actor name');
    window.location.href = 'index.html';
  }
  else{
    fetch(search_url)
  .then((resp) => {
    if (resp.ok) 
    {
      return resp.json();
    } 
    else 
    {
      throw new Error(`ERROR: ${resp.status} ${resp.statusText}`);
    }
  })
  .then((data) => {
    console.log('Data: ', data);
    let sectionActors = document.querySelector('#actors .content');
    sectionActors.innerHTML = '';

    let actorsData = '';

    data.results.forEach((actor, index) => {
      let picture = actor.profile_path;

      // Not displaying actors data if image does not exists. 
      if(picture != null)
      {
      actorsData = actorsData.concat(`
        <div class="actorData" data-actor = "${actor.id}" data_name = "${actor.name}">
        <img class="image"  src="https://image.tmdb.org/t/p/w500${actor.profile_path}" alt="${actor.name}" data_name = "${actor.name}" />
        <div class="actor_details" data_name = "${actor.name}">
        <p class="name" data_name = "${actor.name}">${actor.name}</p>
        <p class="popularity" data_name = "${actor.name}">Popularity ratings: ${actor.popularity}</p>
        </div>
        </div>`);
      }
    });
    sectionActors.innerHTML = actorsData;
    ACTORS.media(data);
  })
  .catch((err) => {
    alert(err);
  });
  details.innerHTML='';
}
  
},

media: (data) => 
{
  let actorDiv = document.querySelectorAll('.actorData');

  actorDiv.forEach((item) => {
    item.addEventListener('click', mediaDetails);
  });

function mediaDetails(ev)
{
  let actorsContent = document.querySelector('#actors');
  document.getElementById('actors').classList.remove('active');

  document.getElementById('media').classList.add('active');
  document.getElementById('footer').classList.remove('footer');
  history.pushState({}, media, `#${media}`);

  let headingActor = document.querySelector('#actors h2');
  headingActor.addEventListener('click', ACTORS.actorsDetails);

  let dataArray = data.results;
  let id = parseInt(ev.currentTarget.getAttribute('data-actor'));
  let mediaData = document.querySelector('#media .content');
  mediaData.innerHTML = '';

  let details = '';

  dataArray.find((person) => {
  if (person.id === id)
  {
    let movies = person.known_for;

    movies.forEach((movie) => {
    // Not displaying movies or tv shows data if image or title does not exists. 
      if(movie.poster_path != null && movie.title != null)
      {
      details = details.concat(`
      <div class="mediaDetails" data-movie = "${movie.id}">
      <img class="mediaImage" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
      <p class="para">${movie.title}</p>
      <p class="date">${movie.release_date || movie.first_air_date}</p>
      </div>
      `);
      }
    });

  }
})

  let name = ev.target.getAttribute('data_name');
  let heading = document.querySelector('#media h3');
  heading.textContent = name +  " is best known for:";

  let button = document.createElement('button');
  button.textContent = 'Actors';
  button.setAttribute('id', 'backtoActors');

  mediaData.innerHTML = details;

  mediaData.append(button);
  document.querySelector('#backtoActors').addEventListener('click', getbacktoActors);
}
function getbacktoActors(ev){
  ev.preventDefault();
  document.getElementById('media').classList.remove('active');
  document.getElementById('actors').classList.add('active');
}
},
}

document.addEventListener('DOMContentLoaded', APP.init);
