import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters';
import './styles.css';
import { barOptions, pieOptions } from './chart-options'
import Chart from 'react-apexcharts'
import axios from 'axios';
import { buildBarSeries, getPlatformChartData, getGenderChartData } from './helpers' 


type PieChartData = {
    labels: string[];
    series: number[];
}

type BarCharData = {
    x: string;
    y: number;
}

const initialPieData = {
    labels: [],
    series: []
}

const BASE_URL = 'http://localhost:8080'

const Charts = () => {
const [BarCharData, setBarCharData] = useState<BarCharData[]>([]);
const [PlatformDada, SetPlatformDada] = useState<PieChartData>(initialPieData);
const [genderDada, SetGenderDada] = useState<PieChartData>(initialPieData);

    useEffect(() => {
       async function getData() {
           const recordsResponse = await axios.get(`${BASE_URL}/records`);
           const gamesResponse = await axios.get(`${BASE_URL}/games`);

           const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);
           setBarCharData(barData);
           
           const platformCgartData = getPlatformChartData(recordsResponse.data.content);
           SetPlatformDada(platformCgartData);

           const genderChartData = getGenderChartData(recordsResponse.data.content);
           SetGenderDada(genderChartData);
       }
       getData();
    }, [])

    return (
      <div className="page-container">
          <Filters link="/records" linkText="VER TABELA"/>
          <div className="chart-container">
            <div className="top-related">
                <h1 className="top-related-title">
                    Jogos mais votados
                </h1> 
                <div className="games-container">
                  <Chart 
                    options={barOptions}
                    type="bar"
                    width="900"
                    height="650"
                    series={[{data: BarCharData }]}
                    />
                </div>
            </div>
            <div className="charts"> 
              <div className="platform-chart">
                <h2 className="chart-title">Plataformas</h2>
                <Chart 
                  options={{...pieOptions, labels: PlatformDada?.labels}}
                  type="donut"
                  series={PlatformDada?.series}
                  width="350"
                /> 
              </div>
              <div className="gender-chart">
                <h2 className="chart-title">Gêneros</h2>
                <Chart 
                  options={{...pieOptions, labels: genderDada?.labels}}
                  type="donut"
                  series={genderDada?.series}
                  width="350"
                />                 
              </div>
            </div>
          </div>
      </div>
    )
}

export default Charts;