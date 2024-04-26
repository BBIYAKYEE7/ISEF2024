import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, RadialBarChart, RadialBar } from 'recharts';
import logo from './logo.png';
import icon from './location.png';
import './styles.css';

function App() {
  const [lineData, setLineData] = useState([]);
  const [scoreData, setScoreData] = useState({ name: 'Score', value: 0, fill: '#93EBB2' });
  const [depthData, setDepthData] = useState({ name: 'Depth', value: 0, fill: '#FBD869' });
  const [pressureData, setPressureData] = useState({ name: 'Pressure', value: 0, fill: '#767FE8' });
  const [isLive, setIsLive] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    document.title = "Rebeat"; // replace with your title

    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = logo;
    document.getElementsByTagName('head')[0].appendChild(link);

    const pusher = new Pusher('af314e57292c6a5efb2a', {
      cluster: 'ap3',
    });

    const channel = pusher.subscribe('my-channel');
    let timeoutId = null;

    channel.bind('my-event', (newData) => {
      if (!startTime) {
        setStartTime(new Date());
      }
      setIsLive(true);
      const transformedData = transformData(newData);
      setLineData((prevData) => {
        const updatedData = [...prevData, transformedData];
        const MAX_DATA_LENGTH = 30;
        return updatedData.slice(-MAX_DATA_LENGTH);
      });
      setScoreData({ name: 'Score', value: newData.score, fill: '#93EBB2' });
      setDepthData({ name: 'Depth', value: newData.depth, fill: '#FBD869' });
      setPressureData({ name: 'Pressure', value: newData.pressure, fill: '#767FE8' });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsLive(false);
      }, 1000);  // Change this line
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [startTime]);

  function transformData(newData) {
    const currentTime = startTime ? formatElapsedTime(new Date() - startTime) : "00:00:00";
    return { name: currentTime, ...newData };
  }

  function formatElapsedTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name} : ${payload[0].name}`}</p>
        </div>
      );
    }
  };

  return (
    <div className="contents">
      <div className="App-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="logo" style={{ marginRight: '10px', marginLeft: '20px' }} />
          <p style={{ color: '#000', fontSize: '30px', fontWeight: 'bold' }}>REBEAT</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '200px', marginLeft: '400px' }}>
          <img src={icon} alt="Location icon" style={{ width: '43px', height: '50px' }} />
          <p style={{ fontSize: '32px', marginTop: '4px', marginLeft: '10px', fontWeight: '600' }}>Los Angeles Convention Center</p>
        </div>
      </div>
      <div>
        <RadialBarChart width={500} height={510} innerRadius="10%" outerRadius="60%" data={[pressureData, depthData, scoreData]} startAngle={0} endAngle={360}>
          <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#000' }} background clockWise dataKey='value' />
          <Legend iconSize={10} width={120} height={210} layout='vertical' verticalAlign='bottom' align='right' />
          <Tooltip />
        </RadialBarChart>
      </div>
      <div>
        <p style={{ fontSize: '20px', fontWeight: '300', marginBottom: '-20px', marginLeft: '40%' }}>This is the graph of the score variance.</p>
        <LineChart
          width={1750}
          height={400}
          data={lineData}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} isAnimationActive={false} />
        </LineChart>
      </div>
      {isLive && <div style={{ position: 'absolute', top: 170, right: 100, padding: 10, backgroundColor: 'red', color: 'white', borderRadius: '40px' }}>Live</div>}
    </div>
  )
}

export default App;