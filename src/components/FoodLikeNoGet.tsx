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

interface FoodLikeProps {
    foodId: string
    likes:number
    dislikes:number
    rating: string
    onRatingChange?: (foodId: string, rating: string, likedNumber:number, dislikedNumber:number) => void; // Callback prop to notify the parent
  }

const FoodLikeNoGet: React.FC<FoodLikeProps> = (props) => {
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [neutral, setNeutral] = useState(false)
    const [likedNumber, setLikedNumber] = useState(0)
    const [dislikedNumber, setDislikedNumber] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(null)
    const url = "http://192.168.100.6:8080/food/ratings/"

    useEffect(()=>{
        setDislikedNumber(props.dislikes)
        setLikedNumber(props.likes)
        if (props.rating==="likes"){
            setLiked(true)
            setDisliked(false)
            setNeutral(false)
        }
        else if(props.rating==="dislikes"){
            setDisliked(true)
            setLiked(false)
            setNeutral(false)
        }
        else if(props.rating==="neutral"){
            setNeutral(true)
            setDisliked(false)
            setLiked(false)
        }
    },[props])

    const handleLike = () => {
        setError(null)
        setIsFetching(true)
        let rating = "likes"
        let plus = 1
        if (liked){
            rating = "neutral"
            plus = -1
        }
        axios.post(url, {
            userId: window.localStorage.id,
            foodLocalId: props.foodId,
            rating: rating
        }, {withCredentials: true, 
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            if (res.data.rating==rating){
                let newLikedNumber = likedNumber + plus;
                let newDislikedNumber = disliked ? dislikedNumber - 1 : dislikedNumber;
                setLiked(!liked)
                setLikedNumber(likedNumber+plus)
                if (disliked){
                    setDisliked(false)
                    setDislikedNumber(dislikedNumber-1)
                }
                props.onRatingChange?.(props.foodId, rating, newLikedNumber, newDislikedNumber)
            }
            
            else if(res.data.affected){
                let newLikedNumber = likedNumber - 1;
                setLiked(!liked)
                setLikedNumber(likedNumber-1)
                props.onRatingChange?.(props.foodId, rating, newLikedNumber, dislikedNumber)
            }
            setIsFetching(false)
        })
    }

    const handleDislike = () => {
        setError(null)
        setIsFetching(true)
        let rating = "dislikes"
        let plus = 1
        if (disliked){
            rating = "neutral"
            plus = -1
        }
        axios.post(url, {
            userId: window.localStorage.id,
            foodLocalId: props.foodId,
            rating: rating
        }, {withCredentials: true, 
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(res => {
            if (res.data.rating==rating){
                let newDislikedNumber = dislikedNumber + plus;
                let newLikedNumber = liked ? likedNumber - 1 : likedNumber;
                
                setDisliked(!disliked)
                setDislikedNumber(dislikedNumber+plus)
                if (liked){
                    setLiked(false)
                    setLikedNumber(likedNumber-1)
                }
                props.onRatingChange?.(props.foodId, rating, newLikedNumber, newDislikedNumber)
            }
            else if(res.data.affected){
                let newDislikedNumber = dislikedNumber - 1;
                setDisliked(!disliked)
                setDislikedNumber(dislikedNumber-1)
                props.onRatingChange?.(props.foodId, rating, likedNumber, newDislikedNumber)
            }
            else {
                setDisliked(false)
                setLiked(false)
            }
            setIsFetching(false)
            
        })

    }

    

    return ( 
        <Box sx={{
            display: "flex",
            flexDirection: "row"
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <IconButton disabled={isFetching} onClick={handleLike} 
                sx={{
                    color: liked?"secondary.main":"#c9c9c9"
                }}>
                    <ThumbUpRoundedIcon fontSize="medium"/>
                </IconButton>
                <Typography sx={{
                    color: liked?"secondary.main":"#c9c9c9"
                }}>
                    {isFetching? <CircularProgress size="20px" color='warning'/>:likedNumber}
                </Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <IconButton disabled={isFetching} onClick={handleDislike} 
                sx={{
                    color: disliked?"warning.main":"#c9c9c9"
                }}>
                    <ThumbDownRoundedIcon fontSize="medium"/>
                </IconButton>
                <Typography 
                sx={{
                    color: disliked?"warning.main":"#c9c9c9"
                }}>
                    {isFetching? <CircularProgress size="20px" color='warning'/>:dislikedNumber}
                </Typography>
            </Box>
        </Box>
    )
};

export default FoodLikeNoGet;