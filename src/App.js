import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import LineGraph from "./Components/LineGraph";
import { sortData, prettyPrintStat } from "./Utils/util";
const App = () => {
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.807446,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [type, setType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]); //for creating a circle on the map
  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => {
            return {
              name: country.country, //united states,united kingdom
              value: country.countryInfo.iso2, //uk,us,etc
            };
          });
          const sorteddata = sortData(data);
          setTableData(sorteddata);
          setMapCountries(data);
          setCountry(countries);
        });
    };
    getCountries();
  }, []);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all" //for worldwide data fetching
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`; //for countrywise data fetching

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCountryInfo(data);
        countryCode !== "worldwide" &&
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  useEffect(() => {
    //to fetch the worldwide data at the first render
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {country &&
                country.map((country) => {
                  return (
                    <MenuItem key={country.name} value={country.value}>
                      {country.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox
            active={type === "cases"}
            isRed
            onClick={() => setType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
            active={type === "recovered"}
            onClick={() => setType("recovered")}
            title="Recovered Cases"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <InfoBox
            isRed
            active={type === "deaths"}
            onClick={() => setType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>
        <Map
          casesType={type}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">WorldWide new {type}</h3>
          <LineGraph className="app__graph" casesType={type} />
        </CardContent>
      </Card>
      {/*3  infoboxes*/}
      {/* tables */}
      {/* graph */}
      {/* maps */}
    </div>
  );
};

export default App;
