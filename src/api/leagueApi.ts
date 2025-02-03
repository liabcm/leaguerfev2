import axios from 'axios';
// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

// Optionally the request above could also be done as
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });  

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
  try {
    axios.defaults.baseURL = 'https://leaguerapi-e3ekc8h6crcsd8ea.canadacentral-01.azurewebsites.net'
    const response = await axios.get('WeatherForecast');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

export default getUser