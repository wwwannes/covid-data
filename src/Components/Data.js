import React, {Component, createRef} from 'react';
import axios from 'axios';
import slugify from 'slugify'

import state from "../store"
import defaultMarkers from "./markers";

const worldUrl = state.apiUrl+"/world"
let worldData = {}
const dates = state.dates;
const selectCountry = createRef();

class Data extends Component {
    constructor(props){
        super(props);

        this.state = {
            countryList: defaultMarkers,
            confirmedTotal: null,
            confirmedNew: null,
            recoveredTotal: null,
            recoveredNew: null,
            deathsTotal: null,
            deathsNew: null
        }
    }

    handleChange = (event) => {
        const selectedData = event.target.value.split('#')
        this.searchDataForCountry(selectedData[0])
        
        // Update the info for the Globe component
        this.props.updateCountry({
            country: selectedData[0],
            coords: [selectedData[1], selectedData[2]]
        })
    }

    // Get the data from the api when a country is selected
    searchDataForCountry = async(country) => {
        try {
            const response = await axios.get(state.apiUrl+"/total/country/"+country+"?from="+dates.yesterday.year+"-"+dates.yesterday.month+"-"+dates.yesterday.day+"&to="+dates.today.year+"-"+dates.today.month+"-"+dates.today.day);
            const responseYesterday = await axios.get(state.apiUrl+"/total/country/"+country+"?from="+dates.dayBeforeYesterday.year+"-"+dates.dayBeforeYesterday.month+"-"+dates.dayBeforeYesterday.day+"&to="+dates.yesterday.year+"-"+dates.yesterday.month+"-"+dates.yesterday.day);

            const confirmedDifference = response.data[0].Confirmed - responseYesterday.data[0].Confirmed
            const recoveredDifference = response.data[0].Recovered - responseYesterday.data[0].Recovered
            const deathsDifference = response.data[0].Deaths - responseYesterday.data[0].Deaths

            const signConfirmed = (confirmedDifference < 0) ? "-" : "+"
            const signRecovered = (recoveredDifference < 0) ? "-" : "+"
            const signDeaths = (deathsDifference < 0) ? "-" : "+"

            this.setState({confirmedTotal: response.data[0].Confirmed.toLocaleString()})
            this.setState({confirmedNew: signConfirmed+confirmedDifference.toLocaleString()})
            this.setState({recoveredTotal: response.data[0].Recovered.toLocaleString()})
            this.setState({recoveredNew: signRecovered+recoveredDifference.toLocaleString()})
            this.setState({deathsTotal: response.data[0].Deaths.toLocaleString()})
            this.setState({deathsNew: signDeaths+deathsDifference.toLocaleString()})
        } catch (err) {
            this.setState({confirmedTotal: "Not available"})
            this.setState({confirmedNew: null})
            this.setState({recoveredTotal: "Not available"})
            this.setState({recoveredNew: null})
            this.setState({deathsTotal: "Not available"})
            this.setState({deathsNew: null})
        }
    }

    // Get the global data by default
    componentDidMount = async() => {
        try {
            const response = await axios.get(worldUrl+"?from="+dates.yesterday.year+"-"+dates.yesterday.month+"-"+dates.yesterday.day+"&to="+dates.today.year+"-"+dates.today.month+"-"+dates.today.day);

            const signConfirmed = (response.data[0].NewConfirmed < 0) ? "-" : "+"
            const signRecovered = (response.data[0].NewRecovered < 0) ? "-" : "+"
            const signDeaths = (response.data[0].NewDeaths < 0) ? "-" : "+"

            worldData = {
                confirmedTotal: response.data[0].TotalConfirmed.toLocaleString(),
                confirmedNew: signConfirmed+response.data[0].NewConfirmed.toLocaleString(),
                recoveredTotal: response.data[0].TotalRecovered.toLocaleString(),
                recoveredNew: signRecovered+response.data[0].NewRecovered.toLocaleString(),
                deathsTotal: response.data[0].TotalDeaths.toLocaleString(),
                deathsNew: signDeaths+response.data[0].NewDeaths.toLocaleString()
            }

            this.setState({confirmedTotal: worldData.confirmedTotal})
            this.setState({confirmedNew: worldData.confirmedNew})
            this.setState({recoveredTotal: worldData.recoveredTotal})
            this.setState({recoveredNew: worldData.recoveredNew})
            this.setState({deathsTotal: worldData.deathsTotal})
            this.setState({deathsNew: worldData.deathsNew})
        } catch (err) {
            console.error(err);
        }
    }

    componentDidUpdate = (props) => {

        // Set/search for data when a marker in the Globe component was clicked
        if(props.selectedCountry != this.props.selectedCountry){

            // Set the values to World data country is defocused
            if(this.props.selectedCountry.country === null){
                selectCountry.current.value = ""
                this.setState({confirmedTotal: worldData.confirmedTotal})
                this.setState({confirmedNew: worldData.confirmedNew})
                this.setState({recoveredTotal: worldData.recoveredTotal})
                this.setState({recoveredNew: worldData.recoveredNew})
                this.setState({deathsTotal: worldData.deathsTotal})
                this.setState({deathsNew: worldData.deathsNew})
            } else {
                selectCountry.current.value = this.props.selectedCountry.country+"#"+this.props.selectedCountry.coords[0]+"#"+this.props.selectedCountry.coords[1]
                this.searchDataForCountry(this.props.selectedCountry.country)
            }
        }
    }

    render = () => {
        return(
            <div id="data">
                <h2>COVID-19 DATA</h2>
                <ul>
                   {this.state.confirmedTotal !== null &&
                        <li><span className="label">Confirmed</span><span className="value">{this.state.confirmedTotal}
                            {this.state.confirmedNew !== null &&
                                <sup>{this.state.confirmedNew}</sup>
                            }
                            </span>
                        </li>
                   }
                   {this.state.recoveredTotal !== null &&
                        <li><span className="label">Recovered</span><span className="value">{this.state.recoveredTotal}
                            {this.state.recoveredNew !== null &&
                                <sup>{this.state.recoveredNew}</sup>
                            }
                            </span>
                        </li>
                   }
                    {this.state.deathsTotal !== null &&
                        <li><span className="label">Deaths</span><span className="value">{this.state.deathsTotal}
                            {this.state.deathsNew !== null &&
                                <sup>{this.state.deathsNew}</sup>
                            }
                            </span>
                        </li>
                    }   
                </ul>
                <select onChange={this.handleChange} ref={selectCountry}>
                    <option value="">World Wide</option>
                    {this.state.countryList
                    .sort((a, b) => a.country > b.country ? 1 : -1)
                    .map((data, index) => 
                        <option value={slugify(data.country, {lower: true, strict: true})+"#"+data.coordinates[0]+"#"+data.coordinates[1]} index={index} key={index}>{data.country}</option>
                    )}
                </select>
            </div>
        )
    }
}

export default Data