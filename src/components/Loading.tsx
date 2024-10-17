import React from 'react';
import Lottie from 'react-lottie-player'
import animationData from "../../public/loadingAnim2.json"; // Import the Lottie JSON
import { Grid } from '@mui/material';

const Loading = () => {
  return (
    <Grid container display={"flex"} alignItems={"start"} justifyContent={"center"} width={"100vw"} height={"100vh"}>
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ width: "50vw", height: "auto", marginTop:50, maxWidth: "250px"}}
      />
    </Grid>
  );
};

export default Loading;