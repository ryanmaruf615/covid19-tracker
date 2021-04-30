import React, {useEffect, useState} from "react";
import {FormControl,MenuItem,Select } from "@material-ui/core";
import './App.css';
import Container from "@material-ui/core/Container";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "./Table";
import {prettyPrintStat, shortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import {Map as LeafletMap} from "react-leaflet";


function App() {
  const [countries,setCountries] = useState([]);
  const [country, setCountry] = useState("worldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
    const [mapCenter,setMapCenter] = useState({lat:35.80746 , lng:-40.4796});
    const [mapZoom,setMapZoom] = useState(3);
    const [mapCountries,setmapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

    useEffect(()=>{
         fetch("https://disease.sh/v3/covid-19/all")
            .then(response => response.json())
            .then(data =>{
                setCountryInfo(data);
            });
    },[]);


  useEffect(()=>{
      const getContriesData= async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) =>{
            const countries = data.map((country)=>({
              name:country.country,
              value:country.countryInfo.iso2
            }));

            const sortedData = shortData(data);
              setTableData(sortedData);
              setmapCountries(data);
              setCountries(countries);
          });
    };
      getContriesData();
  },[]);

  const onCountryChange = async (event)=>{
      const countryCode = event.target.value;
      const url = countryCode === "worldWide"
          ? 'https://disease.sh/v3/covid-19/all' :
          `https://disease.sh/v3/covid-19/countries/${countryCode}`;

       await fetch(url)
          .then(response =>response.json())
          .then(data =>{
              //get all of the data using the specific Code
              setCountry(countryCode);
              setCountryInfo(data);
              setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
              setMapZoom(4);

          });
  };

  return (
      <Container>
    <div className="app">
            <div className="app__left">
                <div className="app__header">
                    <h1 className="title">COVID-19 TRACKER</h1>
                    <FormControl className="app__dropdown">
                        <Select variant="outlined" onChange={onCountryChange} value={country}  >
                            <MenuItem value="worldWide">World Wide</MenuItem>
                            {countries.map(country => (
                                <MenuItem value={country.value}>{country.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="app__status">
                    {/*info box title=cases */}
                    <InfoBox
                        isRed
                        active={casesType === "cases"}
                        onClick={e =>setCasesType('cases')}
                        title="New Cases:" cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)} />
                    {/*info box title=recovery*/}
                    <InfoBox
                        active={casesType === "recovered"}
                        onClick={e =>setCasesType('recovered')}
                        title="Recovered:" cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}/>
                    {/*info box title=death*/}
                    <InfoBox
                        isRed
                        active={casesType === "deaths"}
                        onClick={e =>setCasesType('deaths')}
                        title="Deaths:" cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}/>
                </div>
                {/* table*/}
                {/* Graph*/}

                {/*Map */}
                <Map
                    casesType={casesType}
                    countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>
            <Card className="app__right">
                <CardContent>
                    <h2>Total cases by Country</h2>
                    {/* Table */}
                    <Table countries={tableData} />
                    <h2>Worldwide new {casesType}</h2>
                    {/* Graph */}
                    <LineGraph casesType={casesType}/>
                </CardContent>
            </Card>
    </div>
      </Container>
  );
}

export default App;
