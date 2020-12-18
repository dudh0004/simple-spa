const APP = {
  api_key : '819ff85b3d0216f0611f8ae0e97b2227',
  keybase: 'dudh0004-',
  key: '',
  hash: '',
  name: null,
  id : null,
  actor: [],
  init: () => {
    window.addEventListener('hashchange', ACTORS.handleURL);
    document.querySelector('.active').classList.remove('active');
    document.getElementById('instructions').classList.add('active');
    document.getElementById('footer').classList.add('footer');
    document.getElementById('sorting').classList.remove('sorting');

    let btn = document.querySelector('#btnSearch');
    btn.addEventListener('click', ACTORS.actorsDetails);
    document.querySelector('.actorName').addEventListener('click', SORT.sortingbyName);
    document.querySelector('.actorRating').addEventListener('click', SORT.Rating);

  },
};

const ACTORS = {
  actorsDetails: (ev) => {
    ev.preventDefault();
    let details = document.querySelector('#search');
    document.querySelector('.active').classList.remove('active');
    document.getElementById('media').classList.remove('active');
    document.getElementById('footer').classList.remove('footer');
    document.getElementById('instructions').classList.remove('active');
    document.getElementById('actors').classList.add('active');
    document.getElementById('sorting').classList.add('sorting');

    let searchValue = details.value;
    console.log(searchValue);
    let search_url = `https://api.themoviedb.org/3/search/person?api_key=819ff85b3d0216f0611f8ae0e97b2227&language=en-US&query=${searchValue}&page=1&include_adult=false`;
  
  APP.key = APP.keybase + searchValue.toLowerCase();

  if(localStorage.getItem(APP.key)){
    let data = localStorage.getItem(APP.key);
    console.log('From Local Storage',JSON.parse(data));
  }
  if(searchValue.length == 0)
  {
    document.getElementById('actors').classList.remove('active');
    document.getElementById('instructions').classList.remove('active');
    document.getElementById('alert').classList.add('active');
    document.getElementById('footer').classList.add('footer');
    document.getElementById('sorting').classList.remove('sorting');
  }
  else
  {
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
    localStorage.setItem(APP.key, JSON.stringify(data.results));

    ACTORS.card(data);
    ACTORS.media(data);
  })
  .catch((err) => {
    alert(err);
  });
}
  
},
card:(data)=>{
  let details = document.querySelector('#search');

  console.log('Data: ', data);
  APP.actor = data.results;
  APP.name = details.value;
  history.pushState({}, 'APP.name',`./index.html#${APP.name}`);
  let sectionActors = document.querySelector('#actors .content');
  
  sectionActors.innerHTML = '';
  let actorsData = '';

  data.results.forEach((actor, index) => {
    let picture = actor.profile_path;
    if(picture !== null)
    {
      picture = 'https://image.tmdb.org/t/p/w500' + actor.profile_path;
    }
    else
    {
      picture = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbSwahEdRrPXVkum9BxUM9_xfEk1A1YsVmjw&usqp=CAU";
    }
    actorsData = actorsData.concat(`
      <div class="actorData" data-actor = "${actor.id}" data_name = "${actor.name}">
      <img class="image"  src="${picture}" alt="${actor.name}" data_name = "${actor.name}" />
      <div class="actor_details" data_name = "${actor.name}">
      <p class="name" data_name = "${actor.name}">${actor.name}</p>
      <p class="popularity" data_name = "${actor.name}">Popularity ratings: ${actor.popularity}</p>
      </div>
      </div>`);
  });
  sectionActors.innerHTML = actorsData;

},
handleURL: (ev) =>{
  APP.hash = location.hash.replace('#', '');
  let page = 'home';
  if(APP.hash){
    let parts = APP.hash.split('/').filter((part) => part);
    switch(parts.length){
      case 1:
        APP.name = parts[0];
        page = 'actors';
        break;

        case 2:
          APP.name = parts[0];
          APP.id = parts[1];
          page = 'media';
          break;

        default:
          history.replaceState({}, 'Home', `./index.html#`);

    }
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
  document.getElementById('sorting').classList.remove('sorting');

  let headingActor = document.querySelector('#actors h2');
  headingActor.addEventListener('click', ACTORS.actorsDetails);

  let dataArray = data.results;
  let id = parseInt(ev.currentTarget.getAttribute('data-actor'));
  history.pushState({}, 'APP.name',`./index.html#${APP.name}/${id}`);

  let mediaData = document.querySelector('#media .content');
  mediaData.innerHTML = '';

  let details = '';
  APP.actor = dataArray;
  dataArray.find((person) => {
  if (person.id === id)
  {
    let movies = person.known_for;

    movies.forEach((movie) => {
      let title = movie.title || movie.name;
      let date = movie.release_date || movie.first_air_date;
      details = details.concat(`
      <div class="mediaDetails" data-movie = "${movie.id}">
      <img class="mediaImage" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}"/>
      <p class="para">${title}</p>
      <p class="date">${date}</p>
      </div>
      `);
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
  document.getElementById('sorting').classList.add('sorting');

}
},
};
const SORT = {
  rating:[],
  sortingbyName: (ev) =>{
    let actorsName = [];
    let inside = [];
    APP.actor.forEach((actor) => {
      inside.push(actor.name, actor.popularity,actor.profile_path);
      actorsName.push(inside);
      inside = [];
    })

    actorsName.sort();
    sectionActors = document.querySelector('#actors .content');
  
    sectionActors.innerHTML = '';
    actorsData = '';

    actorsName.forEach((actor, index) => {
    let picture1 = actor[2];
    if(picture1 !== null)
    {
      picture1 = 'https://image.tmdb.org/t/p/w500' + actor[2];
    }
    else
    {
      picture1 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbSwahEdRrPXVkum9BxUM9_xfEk1A1YsVmjw&usqp=CAU";
    }
    actorsData = actorsData.concat(`
      <div class="actorData" data-actor = "${actor.id}" data_name = "${actor[0]}">
      <img class="image"  src="${picture1}" alt="${actor[0]}" data_name = "${actor[0]}" />
      <div class="actor_details" data_name = "${actor[0]}">
      <p class="name" data_name = "${actor[0]}">${actor[0]}</p>
      <p class="popularity" data_name = "${actor[0]}">Popularity ratings: ${actor[1]}</p>
      </div>
      </div>`);
  });
  sectionActors.innerHTML = actorsData;
  let actorNameReverse = actorsName.reverse();
  console.log('actorNameReverse',actorNameReverse);

  },
  Rating: (ev) => {
    APP.actor.forEach((actor) => {
      p = actor.popularity;
      n = actor.name;
      r = actor.profile_path;
      SORT.rating.push({popularity: p, name : n, profile_path: r});
    })
    console.log(SORT.rating);

    let sorting = SORT.dosort(SORT.rating, "popularity");
  },
dosort: function(arr,field) {

    arr.sort((a,b)=>{
        if(a[field] > b[field])
        return 1;
        if(b[field] > a[field])
        return -1;
        else
        return 0;
      });
      sectionActors = document.querySelector('#actors .content');
  
    sectionActors.innerHTML = '';
    actorsData = '';

    SORT.rating.forEach((person, index) => {
    let picture2 = person.profile_path;
    if(picture2 !== null)
    {
      picture2 = 'https://image.tmdb.org/t/p/w500' + person.profile_path;
    }
    else
    {
      picture2 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbSwahEdRrPXVkum9BxUM9_xfEk1A1YsVmjw&usqp=CAU";
    }
    actorsData = actorsData.concat(`
      <div class="actorData" data_name = "${person.name}">
      <img class="image"  src="${picture2}" alt="${person.name}" data_name = "${person.name}" />
      <div class="actor_details" data_name = "${person.name}">
      <p class="name" data_name = "${person.name}">${person.name}</p>
      <p class="popularity" data_name = "${person.name}">Popularity ratings: ${person.popularity}</p>
      </div>
      </div>`);
  });
  sectionActors.innerHTML = actorsData;
  }
}

document.addEventListener('DOMContentLoaded', APP.init);
