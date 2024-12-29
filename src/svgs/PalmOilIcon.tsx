import React from 'react';
import IconProps from '../interfaces/IconProps';

const PalmOilIcon: React.FC<IconProps> = ({ width = "100%", height = "100%"}) => {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width} height={height}>
        <title>palm-oil</title>
	<path id="Path 0" fill-rule="evenodd" className="s0" style={{fill: "#ff9800"}} d="m282 0.5c-0.8 0.2-3.2 0.6-5.3 1-2.8 0.4-3.9 1.1-3.8 2.3 0 0.9 3.8 5.1 8.3 9.2 4.5 4.1 10.3 10.6 12.8 14.5 2.5 3.9 5.3 9.3 6.3 12 0.9 2.8 1.6 5.1 1.4 5.3-0.1 0.1-2.5-0.6-5.2-1.7-2.8-1-8.7-2.8-13.3-4-6-1.6-11.3-2.1-19.9-2.1-9.1 0-13.3 0.5-18.3 2.1-3.6 1.1-9.6 4.1-13.4 6.7-3.8 2.6-9.2 7.2-11.8 10.2-2.7 3-6.2 7.8-7.8 10.5-1.6 2.8-3 6-3 7.3 0 1.2 0.6 2.4 1.2 2.6 0.7 0.2 5.4-0.3 10.3-1.1 6.3-1.1 12.5-1.4 21-1 6.6 0.3 16.1 1.5 21 2.6 4.9 1.1 12.8 3.5 17.5 5.4 4.7 1.8 10.1 4.2 12 5.3l3.5 1.9c-17.1 1-24.5 1.8-27.5 2.4-3 0.6-9.1 2.5-13.5 4.1-4.4 1.6-10.4 4.7-13.4 6.7-3 2.1-7.4 6.1-9.9 8.8-2.5 2.8-6.1 8.4-8 12.5-1.9 4.1-4.1 10.8-4.8 14.8-0.8 3.9-1.4 10.6-1.4 14.7 0 4.1 0.5 10.8 1.1 14.8 0.6 3.9 1.9 10.2 3 14 1.4 4.9 2.4 6.7 3.6 6.7 1 0.1 3.7-2.4 6.2-5.7 2.5-3.2 7.6-9.4 11.5-13.8 3.9-4.4 10.2-10.7 14-14 3.8-3.3 9-7.4 11.5-9.1 2.5-1.7 7.1-4.6 10.1-6.4 3-1.8 8.2-4.3 11.5-5.7 3.3-1.4 9.4-3.3 13.5-4.4 4.1-1 11.6-2.2 16.5-2.5 5.4-0.4 11.2-0.2 14.5 0.5 3.2 0.6 8.8 3.1 13.5 5.9 4.8 2.9 11.2 8 16.5 13.3 5.7 5.8 10.3 11.6 14.1 18 3.1 5.2 7.4 13.9 9.6 19.4 2.2 5.5 4.8 12.9 5.6 16.5 0.9 3.6 2.6 11.1 3.7 16.8 1.1 5.6 2 12 2 14.2 0 2.9 0.5 4.2 1.8 4.6 1.2 0.4 3.8-1.7 9.6-7.8 4.3-4.6 9.3-10.5 11.1-13.3 1.8-2.7 4.4-7 5.8-9.5 1.4-2.5 3.7-8.1 5.2-12.5 2.2-6.5 2.7-9.8 2.7-17.5 0-8.2-0.4-10.6-3.1-17.5-1.7-4.4-4.5-10-6.2-12.5-1.8-2.5-5.7-7.1-8.8-10.3-3.1-3.3-8.7-8.2-12.6-11.1-3.9-2.9-8.6-6.1-10.5-7.2l-3.5-1.9c4.6-0.5 9.6-0.2 14 0.4 4.4 0.5 12.3 2.1 17.5 3.6 5.2 1.4 13.8 4.7 19 7.2 5.2 2.5 12.6 6.9 16.5 9.8 3.9 2.9 7.9 6.2 9 7.4 1.1 1.2 2.8 2.2 3.8 2.1 1 0 2.1-1.2 2.7-3.2 0.7-2 0.8-6.3 0.4-10.8-0.4-4.1-2-11.3-3.7-16-1.6-4.7-4.2-10.3-5.7-12.5-1.5-2.2-4.9-6.1-7.4-8.7-2.5-2.7-7-6.3-9.8-8.2-2.9-1.8-7.1-4.1-9.3-5.1-2.2-0.9-7.4-2.7-11.5-4-4.1-1.3-9.7-2.7-12.5-3.1-2.7-0.3-5.7-1-6.5-1.4-1.1-0.5 0.2-1.9 5-5.3 3.6-2.5 9-5.6 12-6.9 3-1.4 8.4-3.2 12-4.1 3.6-0.9 8.5-2 10.9-2.4 2.4-0.4 4.7-1.3 5.2-1.8 0.5-0.6 0.3-1.7-0.4-2.6-0.6-0.9-3.2-3.2-5.7-5.1-2.5-1.9-6.3-4.4-8.5-5.6-2.2-1.1-5.8-2.7-8-3.5-2.2-0.8-7.4-2.1-11.5-2.8-5.8-1-9.4-1-16-0.1-4.7 0.6-11.2 1.9-14.5 3-3.3 1.1-8.5 3.2-11.5 4.7-3 1.5-8.9 5-13 7.6-4.1 2.7-7.5 4.8-7.6 4.7 0-0.2-1.3-3-2.9-6.3-1.6-3.3-5.1-9.4-7.8-13.5-2.7-4.1-7.2-9.9-10.1-12.8-2.8-3-7.1-6.8-9.6-8.5-2.5-1.7-7.2-4.4-10.5-6-3.3-1.6-8.9-3.6-12.5-4.3-3.6-0.8-9.2-1.3-12.5-1.3-3.3 0.1-6.7 0.3-7.5 0.4zm-262.5 432.4c-2.2 1-5 2.9-6.2 4.2-1.2 1.3-2.9 4.1-3.7 6.2-1.2 2.8-1.6 7.5-1.6 19.7v16h11v-9h18v9h10c0-29.9-0.3-33.1-1.9-36.5-1-2.2-2.9-5-4.2-6.2-1.3-1.2-4.1-2.9-6.1-3.7-2.1-0.9-5.5-1.6-7.5-1.6-2.1 0-5.6 0.9-7.8 1.9zm5.6 8.9c1.1-0.2 3-0.2 4.2 0 1.2 0.1 3.3 1.4 4.7 2.8 2.1 2.1 2.5 3.7 3 15.4h-18v-6.2c-0.1-4.9 0.4-6.9 2-9 1.1-1.5 3-2.8 4.1-3zm305.2 2.7c-4.2 2.5-4.3 2.5-5.3 0.5-0.5-1.1-1.9-2-3-2-1.9 0-2 0.7-2 25v25h10v-16c4.7 2.3 7.7 3 9.8 3 2 0 5.6-0.9 8-2 3-1.4 5-3.3 6.9-6.7 2-3.6 2.7-6.2 2.7-10.3 0-3.9-0.7-6.8-2.5-10-1.7-3.2-3.7-5.1-6.9-6.8-2.7-1.3-6.3-2.2-9-2.2-3 0-6 0.9-8.7 2.5zm3.3 9.6c1.5-1.2 3.9-2.1 5.3-2.1 1.4-0.1 3.8 0.8 5.4 2 1.5 1.1 2.9 3.3 3.2 5 0.3 1.7-0.2 4.3-1 6-0.8 1.7-2.4 3.5-3.5 4-1.1 0.6-3.1 1-4.5 1-1.4 0-3.6-1.1-5-2.5-1.9-1.9-2.5-3.6-2.6-6.9-0.1-3.7 0.4-4.8 2.7-6.5zm145.1-9.8c-2.1 1.2-4.9 3.8-6.3 5.7-1.3 1.9-2.7 5.1-3 7-0.3 1.9-0.3 5.3 0 7.5 0.3 2.2 1.6 5.6 2.9 7.5 1.3 1.9 4.1 4.5 6.2 5.7 2.5 1.4 5.7 2.3 8.5 2.3 2.9 0 6.1-0.9 9-2.5 4.5-2.5 4.5-2.5 5.8-0.5 0.6 1.1 1.9 2 2.7 2 1.3 0 1.5-2.7 1.5-18 0-15.3-0.2-18-1.5-18-0.8 0-2.1 0.9-2.7 1.9-1.3 1.9-1.4 1.9-5.3-0.4-2.8-1.7-5.5-2.5-9-2.5-3.4 0-6.2 0.8-8.8 2.3zm4.6 8.4c0.6-0.3 2.7-0.6 4.5-0.6 2.3-0.1 3.9 0.7 5.7 2.7 1.7 1.7 2.6 3.8 2.5 6 0 2.2-0.9 4.2-2.9 6.2-2 2-3.9 3-6 3-2.2 0-3.8-0.9-5.6-3-1.4-1.6-2.5-4.1-2.5-5.5 0-1.4 0.7-3.8 1.5-5.4 0.8-1.6 2.1-3.1 2.8-3.4zm-167.8-307.7c-3.3 0.4-7.3 1.4-8.8 2.1-1.6 0.8-5.3 4.8-8.2 8.9-3 4.1-5.4 7.8-5.5 8.3 0 0.4-2.2 4.2-4.8 8.5-2.6 4.2-7.6 13.1-10.9 19.7-3.4 6.6-8.1 16.7-10.6 22.5-2.4 5.8-5.8 14.1-7.4 18.5-1.7 4.4-3.6 9.6-4.2 11.5-0.7 1.9-2.8 8.7-4.7 15-1.9 6.3-4.3 15.2-5.4 19.8-1.1 4.5-2 9.1-2 10.2 0 1.3-0.8 2.2-2.2 2.4-1.3 0.3-4.5 0.8-7.3 1.1-2.7 0.3-8.8 1.5-13.5 2.7-4.7 1.1-10.5 3-13 4.1-2.5 1.1-7 3.5-10 5.4-3 1.9-7.2 5.3-9.3 7.6-2 2.3-5.1 6.9-6.7 10.2-1.6 3.3-3.3 8.6-3.7 11.8-0.7 4.7-0.5 6 0.7 6.7 0.9 0.6 33 1 79.2 1 67.7 0 77.9-0.2 79.2-1.5 0.9-0.8 1.6-2.6 1.6-4 0-1.4-0.9-5.2-2-8.5-1.1-3.3-3.1-7.7-4.3-9.7-1.3-2.1-5-6.2-8.3-9.1-3.2-2.9-8.8-6.6-12.4-8.4-3.6-1.7-8.1-3.6-10-4.1-1.9-0.5-6.9-1.6-11-2.5-4.1-0.8-7.6-1.6-7.7-1.6-0.1-0.1 0.5-4.1 1.3-9.1 0.8-4.9 2-11.5 2.6-14.5 0.6-3 2.4-10.9 4-17.5 1.5-6.6 4.4-16.9 6.4-23 2-6 5.6-16.2 8.1-22.5 2.5-6.3 7.6-17.8 11.4-25.5 3.8-7.7 9.3-18.2 12.4-23.2 3-5.1 5.5-10 5.5-10.8 0-0.9-1.5-1.9-3.7-2.5-2.1-0.5-4.9-0.9-6.3-0.9-1.4 0.1-5.2 0.5-8.5 0.9zm29.8 54.3c-1.1 1.2-4 5.1-6.5 8.7-2.5 3.6-5.8 8.8-7.3 11.5-1.5 2.8-3.8 8.2-5.1 12-1.4 3.9-2.4 7.9-2.4 9 0 1.1 0.7 4 1.5 6.5 0.9 2.5 2.7 6.1 4 8 1.3 1.9 4.5 4.7 7.2 6.2 3.8 2.2 6.1 2.7 11.3 2.8 4.4 0 7.8-0.7 10.5-1.9 2.2-1.1 5.7-3.8 7.8-6 2.1-2.3 4.2-6 4.8-8.3 0.6-2.4 0.9-7 0.6-10.3-0.4-4.4-1.7-8.3-5.1-15-2.6-4.9-7.3-12.7-10.6-17.2-3.3-4.6-6.6-8.3-7.3-8.3-0.8 0-2.3 1-3.4 2.3zm-12.4 38.7c0.1-1.9 0.6-1.3 1.9 2.6 0.9 2.8 2.6 6.2 3.7 7.4 1.1 1.3 4.3 3.3 7 4.6 4.3 2 4.6 2.3 2.3 2.3-1.6 0.1-4.3-0.5-6-1.3-1.8-0.7-4.5-2.6-6-4.2-1.4-1.6-2.7-4.2-2.9-5.9-0.1-1.6-0.1-4.1 0-5.5zm-116.9 116.9c-1.9 0.4-5.3 1.6-7.4 2.7-2.2 1-5 3.3-6.4 4.9-1.4 1.6-3.3 4.8-4.3 7-1.2 2.6-1.9 6.3-1.8 10.5 0 5.2 0.5 7.5 2.7 11.3 1.5 2.7 4.3 6.1 6.2 7.6 1.9 1.5 4.9 3.3 6.5 4 1.7 0.7 5.7 1.2 9 1.3 3.3 0 7.6-0.7 9.5-1.5 1.9-0.8 4.4-2.2 5.5-3 2-1.5 2-1.5-0.7-5.6-1.6-2.2-3-4.1-3.3-4.1-0.3 0-2 0.9-3.7 2-1.8 1.1-4.9 2-6.8 1.9-1.9 0-5-0.8-6.9-1.7-1.9-0.9-4.3-2.8-5.3-4.2-1.1-1.4-2.1-4.5-2.4-7-0.4-3.2 0-5.5 1.3-7.9 1-1.9 2.9-4.3 4.3-5.3 1.4-1.1 4.5-2.2 7-2.5 3.6-0.5 5.3-0.1 8.7 1.8 2.4 1.3 4.4 2.2 4.6 1.9 0.2-0.3 1.4-2.2 2.8-4.4l2.4-3.8c-3.9-2.9-6.3-4.2-8-4.7-1.6-0.5-4.6-1.1-6.5-1.4-1.9-0.3-5.1-0.1-7 0.2zm31.5 13.3c-2.2 1.1-5.1 3.5-6.3 5.2-1.2 1.7-2.7 4.9-3.3 7.1-0.8 3-0.7 5.3 0.2 9 0.8 3.2 2.6 6.4 4.8 8.8 2 2.1 5.2 4.3 7.1 4.9 1.9 0.6 5.8 0.8 8.5 0.5 3.5-0.4 6.1-1.5 8.5-3.4 1.9-1.6 4.4-4.7 5.4-6.9 1.1-2.3 1.9-5.9 1.9-8.9-0.1-3-0.9-6.7-2.2-9.2-1.4-2.8-3.6-5.2-6.3-6.8-3-1.7-5.8-2.5-9.3-2.5-3.2 0-6.4 0.8-9 2.2zm3 10.3c1.5-1.6 3.5-2.5 5.5-2.5 1.9 0 3.9 0.9 5.5 2.5 1.8 1.8 2.5 3.6 2.5 6.3 0.1 2.6-0.7 4.5-2.5 6.5-1.5 1.6-3.6 2.7-5.2 2.7-1.8 0.1-3.9-1-5.6-2.7-2.1-2.1-2.8-3.7-2.7-6.6 0.1-2.6 0.9-4.6 2.5-6.2zm40.9-11.6c-1.6 0.3-3.8 1.3-4.7 2.1-1.6 1.3-1.9 1.3-3.5-0.2-0.9-1-2.3-1.8-2.9-1.8-1 0-1.3 4.3-1.3 18v18h10c-0.1-20.8 0.2-22.8 1.7-24.2 1-0.9 2.5-1.7 3.3-1.8 0.8-0.1 2.1-0.2 2.8-0.1 0.6 0 1.9 0.8 2.7 1.6 1.2 1.2 1.5 4.1 1.5 13v11.5h10c0-21.3-0.4-25.8-1.4-27.7-0.8-1.6-2.5-3.8-3.8-5-1.2-1.1-4.1-2.6-6.3-3.2-2.2-0.6-4.2-1-4.5-1-0.3 0.1-1.9 0.4-3.6 0.8zm-164.9 61.1c-1.2 0.5-2.6 1.8-3.3 2.9-0.7 1.3-0.9 3.1-0.4 4.7 0.4 1.5 1.5 3.1 2.5 3.5 0.9 0.5 2.7 0.9 4 0.9 1.2 0.1 3-0.7 3.9-1.7 1-1 1.8-2.9 1.8-4.3 0-1.4-0.5-3.2-1.2-4.1-0.7-1-2.2-1.9-3.3-2.2-1.1-0.3-2.9-0.2-4 0.3zm15.5 8c0 6.8-0.1 7-2.5 7-2.3 0-2.5 0.3-2.5 5 0 4.7 0.2 5 2.5 5 2.4 0 2.5 0.2 2.5 7.3 0.1 5.6 0.6 8 2.3 10.9 1.2 2.1 3.8 4.7 5.7 5.8q3.5 1.9 9.3 2h5.7c0-9 0-9-3.5-9-1.9 0-4.5-0.5-5.7-1.1-1.3-0.7-2.6-1.7-3-2.3-0.4-0.6-0.8-3.9-0.8-7.3v-6.3h13v-10h-13v-14h-10zm108 0.5c0 6.7-0.2 7.4-1.7 6.8-1-0.3-3.8-0.8-6.3-1.1-2.5-0.2-5.5-0.1-6.7 0.2-1.3 0.3-3.9 2.1-5.9 3.9-2 1.7-4.3 4.6-5.2 6.2-0.8 1.6-1.5 5.5-1.5 8.5 0 3.6 0.6 6.7 1.9 8.9 1 1.9 3.5 4.7 5.4 6.3 2.6 2.1 5 3 9 3.4 4.7 0.5 6.2 0.2 10.3-2 4.6-2.6 4.7-2.6 5.7-0.6 0.6 1.1 1.9 2 3 2 1.9 0 2-0.7 2-25v-25h-10zm-14.4 17.6c1.5-1.2 3.8-2.1 5.1-2.1 1.2 0 3.2 0.5 4.3 1 1.1 0.6 2.7 2.6 3.5 4.5 1.3 3.1 1.3 3.9 0 7-0.8 1.9-2.4 4-3.5 4.5-1.1 0.6-3.1 1-4.5 1-1.4 0-3.6-1.1-5-2.5-1.9-1.9-2.5-3.6-2.6-6.9-0.1-3.7 0.4-4.8 2.7-6.5zm167.4-0.1v25h10v-50h-10zm-341.9-10.1c-1.9 1-4.5 3.2-5.8 5-1.3 1.7-2.8 5-3.4 7.4-0.6 2.3-0.8 5.8-0.4 7.7 0.3 1.9 1.6 5.3 2.8 7.4 1.4 2.5 3.8 4.8 6.7 6.3 2.7 1.4 6.2 2.3 8.8 2.3 2.3 0 5.7-0.7 7.5-1.5 1.7-0.8 4.3-2.6 5.7-4l2.5-2.6-7-7.1c-4.4 4.2-6.5 5.2-8.5 5.2-1.7 0-4.1-1-5.7-2.4-2.1-1.8-2.8-3.4-2.8-5.9 0-2 0.9-4.8 2.1-6.4 1.5-2 3.1-2.9 5.7-3 2.8-0.2 4.3 0.3 6.2 2.2 1.4 1.4 3.1 2.2 3.8 1.9 0.6-0.3 2.3-1.9 3.7-3.5l2.5-3c-3.9-4-6.5-5.8-8.2-6.5-1.8-0.8-5.4-1.4-8-1.4-2.8 0-6.3 0.8-8.2 1.9zm33.9 0.9c-2.8 1.7-5.2 4.3-6.5 6.7-1.2 2.5-1.9 6.1-1.9 9.5-0.1 4.2 0.6 6.6 2.7 10.3 1.9 3.3 3.9 5.3 7 6.7 2.3 1.1 6.1 2 8.5 2 2.3 0 5.7-0.7 7.5-1.5 1.7-0.8 4.3-2.6 5.7-4l2.5-2.6-7-7.1c-4.2 4-6.4 5.2-7.7 5.2-2.1 0.1-2.2-0.1-0.8-1.7 0.8-1 4.5-5.5 8.2-10 4.9-6 6.6-8.8 6.1-9.9-0.5-0.9-2.6-2.7-4.8-4-2.9-1.7-5.6-2.4-9.5-2.4-4.3 0-6.5 0.6-10 2.8zm4.2 9.5c1.2-1.3 3.2-2.3 4.5-2.3 1.3 0 2.3 0.1 2.3 0.3 0.1 0.1-2 2.8-4.5 6-2.8 3.6-4.7 5.2-5.1 4.5-0.4-0.7-0.3-2.4 0.1-3.8 0.3-1.4 1.6-3.5 2.7-4.7zm79.3-10.7c-1.6 0.8-4.1 2.5-5.4 3.7-1.3 1.2-3 3.7-3.7 5.5-0.8 1.7-1.4 5.3-1.4 8 0 2.6 0.9 6.5 1.9 8.7 1 2.2 2.7 4.8 3.7 5.7 1 0.9 3.6 2.4 5.7 3.2 2 0.9 5.6 1.6 8 1.6 3 0 5.6-0.8 9-3 2.6-1.6 4.7-3.6 4.7-4.2 0-0.7-1.4-2.8-3-4.5l-3-3.3c-4.6 3.9-6.7 5-7.5 5-0.8 0-1.5-0.2-1.5-0.5 0-0.3 3.6-4.9 8-10.2 7.6-9.4 7.9-9.9 6.2-11.7-0.9-1-3.4-2.7-5.4-3.7-2.2-1.1-5.9-1.9-8.5-1.9-2.7 0-6.1 0.7-7.8 1.6zm2 10.9c1.3-1.4 3.5-2.5 4.7-2.5 2.2 0 2.1 0.3-1.9 6-2.4 3.3-4.5 6-4.8 6-0.3 0-0.5-1.6-0.5-3.5q0.1-3.6 2.5-6zm94-10.9c-1.6 0.8-4.1 2.5-5.4 3.7-1.3 1.2-3 3.7-3.7 5.5-0.8 1.7-1.4 5.3-1.4 8 0 2.6 0.9 6.5 1.9 8.7 1 2.2 2.7 4.8 3.7 5.7 1 0.9 3.6 2.4 5.7 3.2 2 0.9 5.6 1.6 8 1.6 3 0 5.6-0.8 9-3 2.6-1.6 4.7-3.6 4.7-4.2 0-0.7-1.5-2.7-3.3-4.5l-3.2-3.2c-4.3 3.8-6.2 4.9-7 4.9-0.8 0-1.5-0.2-1.5-0.5 0-0.3 3.6-4.9 8-10.2 7.6-9.4 7.9-9.9 6.2-11.7-0.9-1-3.4-2.7-5.4-3.7-2.2-1.1-5.9-1.9-8.5-1.9-2.7 0-6.1 0.7-7.8 1.6zm2 10.9c1.3-1.4 3.5-2.5 4.7-2.5 2.2 0 2.1 0.3-1.9 6-2.4 3.3-4.5 6-4.8 6-0.3 0-0.5-1.6-0.5-3.5q0.1-3.6 2.5-6zm94-10.9c-1.6 0.8-3.9 2.3-4.9 3.2-1 0.9-2.7 3.5-3.7 5.7-1 2.2-1.9 6-1.9 8.5 0 2.5 0.9 6.3 1.9 8.5 1 2.2 2.9 5 4.2 6.2 1.3 1.2 3.6 2.6 5.2 3.2 1.5 0.6 4.6 1.1 7 1.1 2.7 0 5.7-0.9 8.5-2.5l4.2-2.5c2.7 3.2 4.1 4.1 4.8 4 0.9 0 1.2-4.3 1.2-18 0-13.7-0.3-18-1.2-18-0.7-0.1-2.1 0.8-3 2l-1.8 2c-6.6-4.4-8.8-5.1-12.5-5-2.7 0-6.3 0.7-8 1.6zm2.4 10.3c1.3-1 3.9-1.9 5.7-1.9 2.6 0 4 0.8 5.9 3 1.4 1.7 2.5 4.3 2.5 6 0 2-1 4-2.9 6-1.9 2-3.9 3-5.8 3-1.5 0-3.9-0.9-5.3-2-2.1-1.6-2.5-2.7-2.5-7 0-4.2 0.4-5.5 2.4-7.1zm55.1-10.3c-2.6 1.1-4 1.3-5.2 0.5-1-0.6-2.2-1.1-2.8-1.1-0.6 0-1 6.7-1 18v18h10c0-18.2 0.4-24.1 0.8-24.8 0.4-0.7 2-1.2 3.7-1l3 0.3 0.5 25.5h10c0-23.3 0.1-24.1 2.3-25.5 1.5-1 2.7-1.1 4-0.5 1.5 0.9 1.7 2.6 1.7 13.5v12.5h10c0-24.7-0.3-26.9-2-29.7-1.1-1.8-3-3.9-4.2-4.7-1.3-0.8-3.9-1.7-5.8-2.1-2.6-0.4-4.7 0-7.5 1.4-3.4 1.8-4.2 1.9-5.5 0.7-0.8-0.8-3.1-1.7-5-2-2.2-0.4-4.8 0-7 1zm-304 17.4v18h10v-36h-10z"/>
    </svg>
  );
}

export default PalmOilIcon;