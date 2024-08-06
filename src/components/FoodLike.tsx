import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Card, CardMedia, CardContent, Grid, Typography } from '@mui/material';
import { FoodExternal } from '../interfaces/foodExternal';
import "./Components.css"
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import CircularProgress from '@mui/material/CircularProgress';

const FoodLike: React.FC = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [likedNumber, setLikedNumber] = useState(0)
    const [dislikedNumber, setDislikedNumber] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(null)
    const url = "http://192.168.100.6:8080/foodratings/"

    const handleLike = () => {
        setError(null)
        setIsFetching(true)
        let rating = "likes"
        if (liked){
            rating = "neutral"
        }
        axios.post(url, {
            userId: window.localStorage.id,
            foodLocalId: id,
            rating: rating
        }, {withCredentials: true, 
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            if (res.data.rating==rating){
                setLiked(!liked)
                setLikedNumber(likedNumber+1)
                if (disliked){
                    setDisliked(false)
                    setDislikedNumber(dislikedNumber-1)
                }
            }
            else if(res.data.affected){
                setLiked(!liked)
                setLikedNumber(likedNumber-1)
            }
            setIsFetching(false)
        })

    }

    const handleDislike = () => {
        setError(null)
        setIsFetching(true)
        let rating = "dislikes"
        if (disliked){
            rating = "neutral"
        }
        axios.post(url, {
            userId: window.localStorage.id,
            foodLocalId: id,
            rating: rating
        }, {withCredentials: true, 
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            if (res.data.rating==rating){
                setDisliked(!disliked)
                setDislikedNumber(dislikedNumber+1)
                if (liked){
                    setLiked(false)
                    setLikedNumber(likedNumber-1)
                }
            }
            else if(res.data.affected){
                setDisliked(!disliked)
                setDislikedNumber(dislikedNumber-1)
            }
            setIsFetching(false)
        })

    }

    useEffect(()=>{
        axios.get(url + "byuserandfood/" + id + "/" + window.localStorage.id, {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + window.localStorage.token
             }
        })
        .then((response)=>{
            if(!response.data){
            }
            else{
                if(response.data.rating=="likes"){
                    setLiked(true)
                }
                else if(response.data.rating=="dislikes"){
                    setDisliked(true)
                }
            }
            
        })
        axios.get(url + "byfood/" + id, {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + window.localStorage.token
             }
        })
        .then((response)=>{
            if(!response.data){
            }
            else{
                setLikedNumber(response.data.likes)
                setDislikedNumber(response.data.dislikes)
            }
            
        })
    },[id])

    return ( 
        <Box sx={{
            display: "flex",
            flexDirection: "row"
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column"
            }}>
                <IconButton disabled={isFetching} onClick={handleLike} 
                sx={{
                    color: liked?"secondary.dark":"gray"
                }}>
                    {isFetching? <CircularProgress/>:<ThumbUpRoundedIcon fontSize="large"/>}
                </IconButton>
                <Typography sx={{
                    color: liked?"secondary.dark":"gray"
                }}>
                    {likedNumber}
                </Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column"
            }}>
                <IconButton disabled={isFetching} onClick={handleDislike} 
                sx={{
                    color: disliked?"red":"gray"
                }}>
                    {isFetching? <CircularProgress/>:<ThumbDownRoundedIcon fontSize="large"/>}
                </IconButton>
                <Typography 
                sx={{
                    color: disliked?"red":"gray"
                }}>
                    {dislikedNumber}
                </Typography>
            </Box>
        </Box>
    )
};

export default FoodLike;