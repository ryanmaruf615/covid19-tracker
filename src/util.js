import React from "react";
import numeral from "numeral";
import {Circle,Popup} from "react-leaflet";

const casesTypeColors ={
    cases:{
        hex:"#CC1034",
        rgb:"rgb(204,16,52)",
        multiplier:500,
    },
    recovered:{
        hex:"rgba(109,221,93,0.98)",
        rgb:"rgb(125,215,29)",
        multiplier:900,
    },
    deaths:{
        hex:"#fb4443",
        rgb:"rgb(251,215,29)",
        multiplier:2000,
    },
};



export const shortData = (data)=>{
    const sortedData = [...data];

    sortedData.sort((a,b)=>{
        if(a.cases > b.cases){
            return -1;
        }else {
            return 1;
        }
    })
    return sortedData;
};


export const prettyPrintStat=(stat)=>
    stat ? `+${numeral(stat).format("0.0a")}` : "+0";






export const showDataOnMap =(data,casesType='cases')=>(
    data.map(country =>(
        <Circle
        center={[country.countryInfo.lat,country.countryInfo.long]}
        fillOpacity={0.4}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        radius={
            Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }>
            <Popup >
                <div className="info__container">
                <div className="info__flag" style={{backgroundImage: `url(${country.countryInfo.flag})`,
                    marginLeft: "15px"}}/>
                <div className="info__name">{country.country}</div>
                    <div className="info__newCase">New Cases: {numeral(country.todayCases).format("0,0")}</div>
                    <div className="info__totalCase">TotalCases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info__totalRecovered">TotalRecovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info__totalDeath">TotalDeaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);
