import './App.css'
import {Switch, Route, Redirect} from 'react-router-dom'
import CitiesTable from './components/CitiesTable'
import CityDetails from './components/CityDetails'
import NotFound from './components/NotFound'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/" component={CitiesTable} />
    <Route
      path="/:geonameId"
      render={props => {
        const {location} = props
        const {state} = location
        return <CityDetails location={state} />
      }}
    />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
