import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    list: [],
    apiStatus: apiStatusConstants.initial,
    searchQuery: '',
  }

  componentDidMount() {
    this.getCities()
  }

  getCities = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    try {
      const url =
        'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const citiesData = data.results
        const updatedCities = citiesData.map(each => ({
          geonameId: each.geoname_id,
          asciiName: each.ascii_name,
          countryName: each.cou_name_en,
          population: each.population,
          timezone: each.timezone,
          lat: each.coordinates.lat,
          lon: each.coordinates.lon,
        }))
        this.setState({
          apiStatus: apiStatusConstants.success,
          list: updatedCities,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderOnLoading = () => (
    <img
      src="https://media.giphy.com/media/X6hiFJjvTDAAw/giphy.gif"
      alt="world"
    />
  )

  renderOnFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble</p>
      <button type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  onRetry = () => {
    this.getCities()
  }

  handleSearch = event => {
    this.setState({searchQuery: event.target.value})
  }

  renderOnSuccess = () => {
    const {list, searchQuery} = this.state

    const filteredList = list.filter(each =>
      each.asciiName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    return (
      <div className="table-container">
        <div className="table-wrapper">
          <input
            type="text"
            placeholder="Search by city name..."
            value={searchQuery}
            onChange={this.handleSearch}
            className="search-input"
          />
          <table className="table">
            <thead>
              <tr className="tRow">
                <th>Name</th>
                <th>Country</th>
                <th>Population</th>
                <th>Timezone</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map(each => (
                <tr className="tRow" key={each.geonameId}>
                  <td>
                    <Link
                      to={`/${each.geonameId}`}
                      style={{textDecoration: 'none'}}
                    >
                      <span className="span"> {each.asciiName}</span>
                    </Link>
                  </td>
                  <td>{each.countryName}</td>
                  <td>{each.population}</td>
                  <td>{each.timezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderOtpt = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.failure:
        return this.renderOnFailure()
      case apiStatusConstants.success:
        return this.renderOnSuccess()
      case apiStatusConstants.inProgress:
        return this.renderOnLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="CiDiv1">
        <img
          src="https://media.giphy.com/media/X6hiFJjvTDAAw/giphy.gif"
          alt="world"
          className="img"
        />
        {this.renderOtpt()}
      </div>
    )
  }
}

export default Home
