import React from 'react';
import IconProps from '../interfaces/IconProps';

const VeganIcon: React.FC<IconProps> = ({ width = "100%", height = "100%"}) => {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width} height={height}>
        <title>vegan</title>
        <path id="Path 0" style={{fill: "#79d673",}} fillRule="evenodd" className="s0" d="m36 1.2c5.8-0.1 18.4 0.3 28 0.8 9.6 0.5 21.1 1.4 25.5 2 4.4 0.6 13.4 2 20 3.1 6.6 1.1 16.7 3.2 22.5 4.5 5.8 1.4 15.7 4.1 22 6.1 6.3 2 15.3 5.2 20 7.1 4.7 1.9 13.4 5.9 19.5 8.9 6.1 3 14.4 7.6 18.5 10.1 4.1 2.5 11.8 7.8 17 11.8 5.2 3.9 13.9 11.6 19.4 17 5.4 5.4 12.9 13.9 16.6 18.9 3.7 5 9.2 13 12.2 18 3.1 5 7.4 12.7 9.7 17.3 2.2 4.5 6 12.8 8.2 18.4 2.3 5.7 5.6 15 7.4 20.8 1.9 5.8 4.5 15 5.9 20.5 1.3 5.5 3.4 15.2 4.5 21.5 1.1 6.3 2.8 17.3 3.6 24.5 0.9 7.2 1.9 24.8 2.3 39.3 0.5 17.2 0.4 26.2-0.3 26.2-0.6 0-34.5-33.6-75.5-74.6-41-41-75.7-75.2-77.3-76-1.5-0.8-4.3-1.4-6.2-1.4-1.9 0-4.5 0.5-5.8 1.1-1.2 0.6-3.5 2.3-5 3.8-1.5 1.4-3.2 4.3-3.7 6.3-0.7 2.5-0.7 5.1 0 7.5 0.8 3.2 13.3 16.1 76.5 79.3 59.4 59.4 75.1 75.6 73.7 76.2-0.9 0.4-6.4 0.7-12.2 0.7-5.8 0-18.4-0.4-28-0.9-9.6-0.5-21.3-1.5-26-2.1-4.7-0.5-13.7-1.9-20-3-6.3-1.1-16.2-3.2-22-4.5-5.8-1.4-15-3.9-20.5-5.6-5.5-1.7-13.4-4.4-17.5-6-4.1-1.6-12.9-5.4-19.5-8.5-6.6-3.1-16.1-8.1-21-11.2-5-3-13.3-8.7-18.5-12.6-5.2-3.8-13.9-11.5-19.4-17-5.5-5.5-13.2-14.3-17.1-19.5-3.9-5.2-9.3-13.3-12.2-18-2.8-4.7-7.2-12.7-9.7-17.8-2.5-5-6.3-13.6-8.5-19-2.1-5.3-5.1-13.5-6.6-18.2-1.4-4.7-4-13.9-5.7-20.5-1.6-6.6-3.8-16.7-4.8-22.5-1.1-5.8-2.7-16.1-3.6-23-1-7.9-1.8-23.1-2.1-41.5-0.4-20.1-0.2-30.5 0.6-34 0.7-2.8 2-5.9 2.9-7.1 0.9-1.1 3-2.9 4.7-3.9 1.8-1.2 5.7-2.2 10-2.6 3.8-0.3 11.7-0.7 17.5-0.7zm443 95.2c20.2 0.1 21.7 0.2 25 2.3 1.9 1.2 4.4 3.7 5.5 5.5 1.9 3.1 2 5 1.9 28.8 0 21.7-0.3 27.4-2.2 38.5-1.3 7.1-3.4 17.3-4.7 22.5-1.3 5.2-3.8 13.6-5.5 18.5-1.8 4.9-5.4 13.5-8 19-2.7 5.5-7.7 14.3-11.2 19.5-3.7 5.6-10.6 13.9-16.8 20.1-6.4 6.5-14.2 13-20 16.8-5.2 3.5-14 8.5-19.5 11.2-5.5 2.6-15.2 6.6-21.5 8.7-6.3 2.2-15.8 4.9-21 6.1-5.2 1.1-13.8 2.8-19 3.6-5.2 0.8-11 1.5-12.8 1.5-3.2 0-3.2 0-2.1-3.3 0.5-1.7 1.4-10.6 2.8-36.2l31.5-31.5c17.3-17.3 32-32.7 32.5-34.3 0.6-1.5 1.1-4.2 1.1-6-0.1-1.7-1-4.8-2-6.7-1.1-1.9-3.7-4.5-5.8-5.7-2-1.2-5.2-2.2-7-2.3-1.7 0-4.7 0.7-6.5 1.6-1.7 0.9-12.7 11.1-24.4 22.7-19.3 19.3-21.2 21-21.7 18.7-0.3-1.4-1.2-8.1-2.1-15-0.9-6.9-2.9-19-4.5-27-1.6-8-4.5-20.1-6.6-27-2-6.9-3.8-13.2-4.1-14-0.3-0.9 2.4-4.3 7.1-8.8 4.2-3.9 10.9-9.6 14.8-12.5 4-3 10.2-7.1 13.8-9.1 3.6-2.1 9.4-5.2 13-6.8 3.6-1.6 10.1-4.3 14.5-6 4.4-1.6 13.9-4.5 21-6.3 7.1-1.8 18.4-4 25-4.9 6.6-0.9 13.4-1.8 15-2 1.6-0.2 12.7-0.3 24.5-0.2zm-454.5 279.6l10 33.5c5.5 18.4 10.2 33.5 10.5 33.5 0.3 0 5-15.1 20.5-67h12.2c6.8 0 12.3 0.3 12.3 0.7 0 0.5-7.7 24.1-34 104.3h-22l-17-51.8c-9.3-28.4-17-52-17-52.5 0-0.4 5.5-0.7 24.5-0.7zm180.5 23.1c2.5 0 7.4 1 11 2.2 3.6 1.2 8.9 3.9 17 9.7l3.7-4.5c2.8-3.4 4.5-4.5 9.3-4.5v34.2c0 18.9-0.5 37.2-1 40.8-0.5 3.6-2.2 9-3.7 12-1.5 3-5 7.7-7.8 10.5-2.8 2.7-7.8 6.3-11.1 8-5.3 2.7-7 3-27.4 3.5v-20h4.2c2.4 0 6.8-0.5 9.8-1 3-0.6 6.7-2 8.2-3.1 1.6-1 3.5-3.3 5.8-7.9l-3.8 1.6c-2 0.8-6.6 1.8-10.2 2.1-3.9 0.4-8.7 0.1-12-0.7-3-0.7-8.1-2.6-11.3-4.1-3.1-1.6-7.6-4.8-9.8-7.2-2.3-2.3-4.9-5.8-5.9-7.7-1-1.9-2.6-6.2-3.5-9.5-1.3-4.5-1.6-8.3-1.3-15 0.4-7.3 1-10.2 3.5-15.5 1.6-3.6 5-8.5 7.4-11 2.4-2.6 6.4-5.8 8.9-7.3 2.5-1.4 7-3.3 10-4.1 3-0.8 7.5-1.5 10-1.5zm-14.3 27.7c-1.5 1.8-3.1 4.9-3.7 6.9-0.5 2.1-1 5.8-1 8.3 0 2.5 0.9 6.3 1.9 8.5 1 2.2 2.9 5 4.2 6.2 1.3 1.2 4.1 2.9 6.1 3.7 2.1 0.9 5.1 1.6 6.8 1.6 1.6 0 4.7-0.7 6.7-1.6 2.1-0.8 4.9-2.5 6.1-3.7 1.3-1.2 3.2-3.8 4.2-5.7 0.9-1.9 2-5.1 2.4-7 0.4-2.1 0-5.6-0.9-8.8-1-3.4-2.8-6.5-5.3-9-2-2-5.5-4.3-7.7-4.9-2.2-0.7-5.1-1.3-6.5-1.3-1.4 0-4.3 0.9-6.5 1.9-2.2 0.9-5.2 3.2-6.8 4.9zm280.6-27.7c2-0.1 6.1 0.4 8.9 1 2.9 0.6 7.9 2.5 11.2 4.3 3.2 1.7 7.7 5.1 9.9 7.6 2.3 2.5 5.5 7.4 7.1 11 2.4 5.2 3.1 8.2 3.4 15 0.3 6.1 0 10.2-1.3 14.5-0.9 3.3-2.5 7.6-3.5 9.5-1 1.9-3.6 5.4-5.9 7.7-2.2 2.4-6 5.5-8.4 7-2.3 1.4-6.8 3.5-10 4.5-3.1 1-8.1 1.8-11 1.8-2.8 0-7.9-0.9-11.2-2-3.3-1.2-7.8-3.1-10-4.4-2.2-1.3-6-4.6-8.5-7.2-2.4-2.7-5.4-7.2-6.7-9.9-1.2-2.8-2.7-8.4-3.3-12.5-0.9-5.5-0.9-9.1-0.1-13.5 0.6-3.3 2.2-8.3 3.5-11 1.2-2.8 4.5-7.4 7.2-10.4 3-3.3 7.3-6.5 10.9-8.3 3.3-1.7 7.8-3.4 10-3.8 2.2-0.4 5.7-0.8 7.7-0.9zm-13 27.1c-1.8 1.8-3.7 4.9-4.4 6.8-0.6 1.9-1.1 5.7-1.1 8.5 0.1 3 0.9 6.6 2.1 9 1.1 2.2 3.1 5 4.4 6.2 1.2 1.2 4 2.9 6 3.7 2.1 0.9 5.3 1.6 7 1.6 1.8 0 5.3-1 7.8-2.2 2.6-1.4 5.7-4.1 7.5-6.6 2.7-4 3-5.1 3-12.2 0-7.1-0.3-8.2-3-12.1-1.7-2.4-4.4-5.1-6-6-1.7-1-5-2-7.5-2.3-2.9-0.4-6 0-8.5 0.9-2.2 0.8-5.5 3-7.3 4.7zm-331.2-27.1c2.5-0.1 7.6 0.8 11.5 2 3.8 1.2 8.3 3 10 4.2 1.6 1.1 4.9 3.9 7.3 6.1 2.3 2.3 4.2 4.4 4.2 4.8 0 0.5-7.5 9.9-16.7 21-9.1 11.2-17.6 21.4-20.8 25.1l5-0.6c2.7-0.2 6.9-1.4 9.2-2.6 2.4-1.2 5.3-3.7 8.8-9.3l3.9 4.4c2.1 2.3 5.5 6 11.1 11.8l-5 5c-2.8 2.7-7.4 6.1-10.3 7.5-2.8 1.4-8.8 3.1-13.2 3.7-7.2 1.2-8.8 1.1-14.8-0.5-3.7-1-9-3.3-11.7-5.2-2.8-1.8-6.5-5-8.4-7.1-1.9-2.2-4.8-6.8-6.5-10.4-2.9-6.1-3.1-7.2-3.1-18.5 0-11.3 0.2-12.4 2.9-18 1.7-3.3 5-8.2 7.5-10.8 2.6-2.7 6.6-6 9.1-7.4 2.5-1.3 7-3.1 10-3.8 3-0.7 7.5-1.4 10-1.4zm-6.3 22.3c-1.5 0.3-4.1 1.8-5.9 3.3-1.7 1.6-4 4.6-4.9 6.8-1.1 2.4-1.9 6.4-1.9 10 0 3.3 0.4 6.6 0.8 7.3 0.5 0.9 4.3-3.3 11.4-12.7 6-7.8 10.6-14.6 10.3-15.1-0.3-0.6-1.5-1-2.8-0.9-1.2 0-2.7 0.2-3.2 0.4-0.6 0.2-2.2 0.6-3.8 0.9zm175.3-22.3c1.9-0.1 6.4 0.7 10 1.8 3.6 1.1 9.1 3.8 18 10.1l3.7-4.5c2.8-3.2 4.6-4.4 9.3-4.5v79h-3c-2.5 0-3.6-0.9-10-10l-4.8 3.4c-2.6 1.9-6.7 4.4-9.2 5.5-2.5 1.1-7.4 2.3-11 2.7-4.6 0.5-8.3 0.2-12.8-1-3.4-0.9-7.9-2.4-10-3.5-2-1-5.5-3.6-7.7-5.7-2.2-2.2-5.3-6.2-6.8-8.9-1.6-2.8-3.5-7.5-4.3-10.5-0.8-3-1.4-8.2-1.4-11.5 0-3.3 0.7-8.7 1.6-12 0.8-3.3 2.7-8 4.2-10.5 1.5-2.5 4.7-6.5 7.2-8.8 2.5-2.4 6.7-5.5 9.5-6.8 2.7-1.3 7-2.8 9.5-3.3 2.5-0.5 6.1-0.9 8-1zm-13.7 27c-1.2 1.3-2.9 4.4-3.8 6.9-0.8 2.5-1.5 6.1-1.5 8 0 1.9 0.5 5.2 1 7.2 0.6 2.1 2.2 5.2 3.7 7 1.6 1.7 4.6 4 6.8 4.9 2.2 1 5.6 1.9 7.5 1.9 1.9 0 5.3-0.9 7.5-1.9 2.2-0.9 5.1-3.1 6.5-4.7 1.4-1.6 3.4-4.9 4.4-7.4 1.3-3.2 1.6-5.8 1.2-9-0.4-2.5-1.7-6.3-2.9-8.5-1.2-2.1-4-5.2-6.2-6.7-2.6-1.8-5.8-3-9-3.4-3.7-0.3-6.1 0-9 1.4-2.2 1.1-5 3-6.2 4.3zm104.4-25.1c5.1 0 9 0.7 13 2.2 3.5 1.3 7.8 4 10.7 6.7 2.6 2.5 5.8 6.4 6.9 8.6 1.2 2.2 2.7 5.8 3.4 8 0.9 2.8 1.3 11.7 1.3 54.5h-21v-24c0-20.8-0.2-24.5-1.8-27.6-0.9-2-3.1-4.5-4.7-5.5-1.7-1-5-1.9-7.5-1.9-3.1 0-5.6 0.7-8 2.2-1.9 1.3-4.3 3.9-5.2 5.8-1.6 3-1.8 6.6-1.8 51h-21v-79h3c2.2 0 3.7 0.9 5.7 3.5 1.6 1.9 3.2 3.5 3.8 3.5 0.5 0 1.7-0.7 2.5-1.5 0.8-0.8 4.2-2.6 7.5-4 4.5-1.8 7.8-2.5 13.2-2.5z"/>
    </svg>
  );
}

export default VeganIcon;