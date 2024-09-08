import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import Slider from 'react-slick'
import './index.css'

class CityDetails extends Component {
  state = {
    apiKey: '3c0e40a57e9865ca372e867fe6992672',
    lat: null,
    lon: null,
    cityWeather: {},
    weather: {},
    sys: {},
    main: {},
    wind: {},
    forecast: [],
  }

  componentDidMount() {
    this.fetchCityDetails()
  }

  fetchCityDetails = async () => {
    const {match} = this.props
    const {geonameId} = match.params
    try {
      const url =
        'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100'
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        const citiesData = data.results
        const cityData = citiesData.filter(
          each => each.geoname_id === `${geonameId}`,
        )
        const cityArray = cityData[0]
        this.setState({
          lat: cityArray.coordinates.lat,
          lon: cityArray.coordinates.lon,
        })
        this.getWeather()
        this.getDaysWeather()
      } else {
        console.error('Failed to fetch city details:', response.statusText)
      }
    } catch (error) {
      console.error('Failed to fetch city details:', error)
    }
  }

  getWeather = async () => {
    const {apiKey, lat, lon} = this.state

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
      const response = await fetch(url)
      const data = await response.json()
      const weather = data.weather[0]
      const sys = data.sys
      const wind = data.wind
      const main = data.main

      this.setState({cityWeather: data, weather, wind, main, sys})
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
    }
  }

  getDaysWeather = async () => {
    const {apiKey, lat, lon} = this.state
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
      const response = await fetch(url)
      const data = await response.json()
      this.setState({forecast: data.list})
      console.log(data)
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
    }
  }

  getClassName = weatherCondition => {
    switch (weatherCondition) {
      case 'Clear':
        return 'clear-weather'
      case 'Clouds':
        return 'cloudy-weather'
      case 'Rain':
        return 'rainy-weather'
      default:
        return 'default-weather'
    }
  }

  render() {
    const {cityWeather, weather, main, wind, sys, forecast} = this.state
    const {name} = cityWeather

    const weatherClass = this.getClassName(weather.main)

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }

    return (
      <div className={`${weatherClass} weDiv1`}>
        <div className="weDiv2">
          <div className="weDiv3">
            <div className="title">
              <h1>
                {name}, {sys.country}
              </h1>
              <h2>{weather.description}</h2>
            </div>
            <div className="map">
              <a
                href="https://www.msn.com/en-in/weather/maps/radar/in-Putbus,Mecklenburg-West-Pomerania?ocid=ansmsnweather&loc=eyJsIjoiUHV0YnVzIiwiciI6Ik1lY2tsZW5idXJnLVdlc3QgUG9tZXJhbmlhIiwicjIiOiJSw7xnZW4iLCJjIjoiR2VybWFueSIsImkiOiJERSIsInQiOjEwMiwiZyI6ImVuLWluIiwieCI6IjEzLjQ3MzIiLCJ5IjoiNTQuMzUzNCJ9&zoom=3"
                target="_blank"
                rel="noopener noreferrer"
                className="a"
              >
                Launch MSN Weather map
              </a>
            </div>
            <div className="temp">
              <h3>
                temp: <span className="tempSpan">{main.temp}</span>
              </h3>
              <div>
                <p>{main.temp_max}</p>
                <p>{main.temp_min}</p>
              </div>
            </div>
          </div>
          <div className="humidity">
            <h3>Humidity: {main.humidity}</h3>
            <h3>Sea Level: {main.sea_level}</h3>
            <h3>Ground Level: {main.grnd_level}</h3>
          </div>
          <div className="wind">
            <h1>Wind</h1>
            <h2>Speed: {wind.speed}</h2>
            <h2>deg: {wind.deg}</h2>
            <h2>Gust: {wind.gust}</h2>
          </div>
          <div className="forecast">
            <h2>Weather Forecast</h2>
            {forecast.length > 0 ? (
              <Slider {...settings}>
                {forecast.map(item => (
                  <div
                    key={item.dt}
                    className={`carousel-item ${this.getClassName(
                      item.weather[0].main,
                    )}`}
                  >
                    <h3>{item.dt_txt}</h3>
                    <p>Temp: {item.main.temp}</p>
                    <p>Weather: {item.weather[0].description}</p>
                  </div>
                ))}
              </Slider>
            ) : (
              <p>Loading forecast...</p>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CityDetails)
