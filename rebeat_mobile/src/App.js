import React, { useEffect, useState, useRef } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, Label} from 'recharts';
import Pusher from 'pusher-js';
import logo from './logo.png';
import icon from './location.png';
import text_logo from './text_logo.png';
import './App.css';
import legend_s from './legand(s).png';
import legend_d from './legand(d).png';

function MobilePage() {
  const [data, setData] = useState({ score: [], depth: [], pressure: 0, cycle: 0, elapsed_time: 0 });
  const hours = Math.floor(data.elapsed_time / 3600);
  const minutes = Math.floor((data.elapsed_time % 3600) / 60);
  const seconds = data.elapsed_time % 60;

  const scrollRef = useRef();

  const CustomLabel = ({ x, y, stroke, value }) => (
    <text x={x} y={y - 10} dy={-4} fontSize={15} textAnchor="middle">
      {value}
    </text>
  );

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
        depth: [...prevData.depth, newData.depth],
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
          <p className="intro">{`Depth : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data.score], [data.depth]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={icon} alt="icon" style={{ height: '29.07px', marginLeft: '5.1%', marginRight: '10px', marginTop: '40px' }} />
        <h1 style={{ fontSize: '22.01px', marginTop: '53px', wordSpacing: '-2%', fontWeight: '600' }}>Los Angeles Convention Center</h1>
      </div>
      <p style={{ fontSize: '22.26px', marginTop: '15%', width: '150px', marginLeft: '40px', wordSpacing: '-2%' }}>Elapsed time</p>
      <p style={{ fontSize: '22.26px', fontWeight: 'bold', width: '150px', marginTop: '-20px', marginLeft: '40px', wordSpacing: '-2%' }}>{`${minutes.toString().padStart(2, '0')}min ${seconds.toString().padStart(2, '0')}sec`}</p>
      <h2 style={{ fontSize: '22.89px', marginTop: '34px', fontWeight: 'bold', width: '330px', marginLeft: '40px', wordSpacing: '-2%' }}>Real-time averages</h2>
      <p style={{ fontSize: '22.26px', marginTop: '-2px', width: '330px', marginLeft: '40px', wordSpacing: '-2%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ marginRight: '10px' }}>Composite CPR Score:</div>
          <div style={{ marginRight: '25px' }}>{Math.round(data.score[data.score.length - 1])}</div>
        </div>
      </p>
      <p style={{ fontSize: '22.26px', marginTop: '-15px', width: '330px', marginLeft: '40px', wordSpacing: '-2%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Compression Depth:</div>
          <div style={{ marginRight: '25px' }}>{(data.depth[data.depth.length - 1])}cm</div>
        </div>
      </p>
      <p style={{ fontSize: '22.26px', marginTop: '-15px', marginBottom: '40px', width: '330px', marginLeft: '40px', wordSpacing: '-2%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Compression Cycle:</div>
          <div style={{ marginRight: '25px' }}>{data.cycle}bpm</div>
        </div>
      </p>
      <img src={legend_s} alt="score" style={{ position: 'fixed', top: '53%', left: '10%', height: '0.5em', width: '0.5em' }} />
      <q style={{ position: 'fixed', top: '52.3%', left: '14%', fontSize: '1em', color: '#000', opacity: '50%' }}>Score</q>
      <img src={legend_d} alt="score" style={{ position: 'fixed', top: '56%', left: '10%', height: '0.5em', width: '0.5em' }} />
      <q style={{ position: 'fixed', top: '55.3%', left: '14%', fontSize: '1em', color: '#000', opacity: '50%'}}>Depth</q>
      <div style={{ position: 'relative', overflowX: 'scroll', marginBottom: '-200px' }} ref={scrollRef}> { }
        <ComposedChart
          width={Math.max(window.innerWidth, data.depth.length * 100)} // Set the width dynamically based on the number of data points
          height={370}
          data={data.depth.map((depth, index) => ({ time: index + 1, depth, score: data.score[index] }))}
          margin={{
            top: 30,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <Tooltip />
          <Area yAxisId="left" type="monotone" dataKey="depth" stroke="#6B62F1" fill="#6962E9" isAnimationActive={false} label={<CustomLabel/>}/>
          <Line yAxisId="right" type="monotone" dataKey="score" stroke="#ff7300" isAnimationActive={false} strokeWidth={2} label={<CustomLabel/>}/>
          </ComposedChart>
        <img src={text_logo} alt="text_logo" style={{ position: 'fixed', top: '95%', left: '73%', height: '1.5em', width: '4.8em', opacity:'50%'}} />
        <q style={{ position: 'fixed', top: '78%', left: '14%', fontSize: '1em', color: '#000', opacity: '50%' }}>CPR Compression Depth trend graph</q>
        </div>
    </div>
  );
}

export default MobilePage;