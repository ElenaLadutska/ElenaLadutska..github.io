import '../styles/index.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js'

const countries = document.getElementById('countries');
const cities = document.getElementById('cities');

const getCountries = fetch('https://namaztimes.kz/ru/api/country')
  .then(response => response.json())
  .then(result => showCountry(result));

const getState = async (chosenCountryId) => {
  const response = await fetch(`https://namaztimes.kz/ru/api/states?id=${chosenCountryId}`);
  const result = await response.json();

  return getCities(result);
};

const getCities = async (state) => {
  const cities = [];

  for (const states of Object.keys(state)) {
    const response = await fetch(`https://namaztimes.kz/ru/api/cities?id=${states}&type=json`);
    const result = await response.json();

    cities.push(result);
  };

  return showCities(cities);
};

const showCountry = (place) => {
  for (const  countryName of Object.values(place)) {
    const elemCountry = document.createElement('option');

    elemCountry.innerHTML = countryName;
    elemCountry.value = countryName;

    countries.appendChild(elemCountry);
  };

  countries.addEventListener('click', event => {
    const chosenCountryId = event.target.selectedIndex;

    getState(chosenCountryId);
    
    while (cities.firstChild) {
      cities.removeChild(cities.firstChild);
    };
  });
};

const showCities = (place) => {
  for (const city of Object.values(place)) {
    for (const cityName of Object.values(city)) {
      const elemCity = document.createElement('option');

      elemCity.innerHTML = cityName;

      cities.appendChild(elemCity);
    };
  };
};

const startDateInFlights = document.getElementById('flightStartDate');
const endDateInFlights = document.getElementById('flightsEndDate');
const startDateInHotels = document.getElementById('hotelStartDate');
const endDateInHotels = document.getElementById('hotelEndDate');
const startDateInCars = document.getElementById('carStartDate');
const endDateInCars = document.getElementById('carEndDate');

const currentDate = new Date().setHours(3, 0, 0 ,0);

const checkDate = (startDate, endDate, checkStartOrEndDate, endDateToAble) => () =>{
  const start = new Date(startDate.value).getTime();
  let result = startDate.value;

  if (checkStartOrEndDate === 'start' && endDate > start) {
    startDate.value = '';
  } else if (checkStartOrEndDate === 'end'){
    const end = new Date(endDate.value).getTime();

    result = start <= end ? endDate.value : endDate.value = '';
  };

  endDateToAble.disabled = !(checkStartOrEndDate === 'start' && startDate.value);

  return result;
};

startDateInFlights.addEventListener('change', checkDate(startDateInFlights, currentDate, 'start', endDateInFlights));
startDateInHotels.addEventListener('change', checkDate(startDateInHotels, currentDate, 'start', endDateInHotels));
startDateInCars.addEventListener('change', checkDate(startDateInCars, currentDate, 'start', endDateInCars));

endDateInFlights.addEventListener('change', checkDate(startDateInFlights, endDateInFlights, 'end'));
endDateInHotels.addEventListener('change', checkDate(startDateInHotels, endDateInHotels, 'end'));
endDateInCars.addEventListener('change', checkDate(startDateInCars, endDateInCars, 'end'));

const isFormFilled = () => {
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('change', () => btn.disabled = !form.checkValidity());

    btn.addEventListener('click', () => {
      getDataFromSubmitForm(form);
    });
  })
}
isFormFilled();

const getDataFromSubmitForm = (form) => {
  const history = JSON.parse(localStorage.getItem('history')) || [];

  const inputFormsData = form.querySelectorAll('input');
  const selectFormsData = form.querySelectorAll('select');
  
  let data = {};

  for (let input of inputFormsData) {
    data[input.dataset.key] = input.value;
  };

  for (let select of selectFormsData) {
    data[select.dataset.key] = select.value;
  };

  let type = 'hotels';
  let className = form.parentElement.className;

  if (className === 'flight' || className === 'cars') {
    type = className === 'flight' ? 'flights' : 'cars'
  };

  data.type = type;

  history.push(data);

  localStorage.setItem('history', JSON.stringify(history));
};
