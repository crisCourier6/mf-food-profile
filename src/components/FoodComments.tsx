import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Card, CardMedia, CardContent, Grid, Typography } from '@mui/material';
import { DiscussionEmbed } from 'disqus-react';





const FoodComments: React.FC = () => {
    const { id } = useParams()
    return ( <>
        <Box sx={{padding: 3}}>
            <DiscussionEmbed shortname="eyesfood" 
            config={{
                url: window.location.href,
                identifier: id,
                title: id
            }}>

            </DiscussionEmbed>
        </Box>
    </>
    )
};

export default FoodComments;