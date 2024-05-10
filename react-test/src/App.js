import React, { useEffect, useState, useRef} from 'react';
import { AreaChart, Area, Tooltip } from 'recharts';
import Pusher from 'pusher-js';
import logo from './logo.png';
import icon from './location.png';
import text_logo from './text_logo.png';
import './App.css';

const CustomLabel = ({ x, y, value }) => {
  return (
    <g>
      <polygon points={`${x},${y} ${x+10},${y-10} ${x+70},${y-10} ${x+70},${y+10} ${x+10},${y+10}`} fill="#6B62F1" />
      <text x={x+15} y={y} fill="#fff" textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    </g>
  );
};

function MobilePage() {
  const [data, setData] = useState({ score: [], depth: 0, pressure: 0, cycle: 0, elapsed_time: 0 });
  const hours = Math.floor(data.elapsed_time / 3600);
  const minutes = Math.floor((data.elapsed_time % 3600) / 60);
  const seconds = data.elapsed_time % 60;

  const scrollRef = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden'
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
    channel.bind('my-event', function (newData) {
      setData(prevData => ({
        ...newData,
        score: [...prevData.score, newData.score],
      }));
    });

    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time : ${label}`}</p>
          <p className="intro">{`Score : ${payload[0].value}`}</p>
        </div>
      );
    }
    
    return null;
  };

  useEffect(() => {
    // Scroll to the start of the div whenever data.score changes
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data.score]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt="icon" style={{ height: '25.07px', width: '21px', marginRight: '10px', marginLeft: '40px', marginTop: '40px' }} />
        <h1 style={{ fontSize: '20px', marginTop: '51px', wordSpacing: '-2%' }}>Los Angeles Convention Center</h1>
      </div>
      <p style={{ fontSize: '20px',marginTop: '15%', width: '120px', marginLeft: '40px', wordSpacing: '-2%' }}>Elapsed time</p>
      <p style={{ fontWeight: '900', width: '120px', marginTop: '-20px', marginLeft: '40px', wordSpacing: '-2%' }}>{`${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}sec`}</p>
      <h2 style={{ marginTop: '34px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Real-time averages</h2>
      <p style={{ marginTop: '-5px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Composite CPR Score: {Math.round(data.score[data.score.length - 1])}</p>
      <p style={{ marginTop: '-5px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Depth: {data.depth}cm</p>
      <p style={{ marginTop: '-5px', width: '280px', marginLeft: '40px', wordSpacing: '-2%' }}>Compression Cycle: {data.cycle}bpm</p>
      <div style={{ position: 'relative', overflowX: 'scroll' }} ref={scrollRef}> {/* Change scrollRefq to scrollRef */}
        <AreaChart
          width={Math.max(window.innerWidth, data.score.length * 100)} // Set the width dynamically based on the number of data points
          height={400}
          data={data.score.map((score, index) => ({ time: index + 1, score }))}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CustomTooltip />
          <Tooltip />
          <Area type="monotone" dataKey="score" stroke="#6B62F1" fill="#6962e9" isAnimationActive={false} label={true}/>
        </AreaChart>
        <img src={text_logo} alt="text_logo" style={{ position: 'fixed', top: '95%', left: '73%', height: '1.5em', width: '4.8em' }} />
        <q style={{ position: 'fixed', top: '78%', left: '14%', fontSize: '1em', color: '#FFFFFF', opacity: '50%' }}>CPR Compression Depth trend graph</q>
      </div>
    </div>
  );
}

export default MobilePage;