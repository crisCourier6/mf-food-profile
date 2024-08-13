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
    foodId: string;
    onRatingChange?: (foodId: string, rating: string) => void; // Callback prop to notify the parent
  }

const FoodLike: React.FC<FoodLikeProps> = (props) => {
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [likedNumber, setLikedNumber] = useState(0)
    const [dislikedNumber, setDislikedNumber] = useState(0)
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(null)
    const url = "http://192.168.100.6:8080/food/ratings/"

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
                setLiked(!liked)
                setLikedNumber(likedNumber+plus)
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
            props.onRatingChange?.(props.foodId, rating)
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
                setDisliked(!disliked)
                setDislikedNumber(dislikedNumber+plus)
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
            props.onRatingChange?.(props.foodId, rating)
        })

    }

    useEffect(()=>{
        axios.get(url + "byuserandfood/" + props.foodId + "/" + window.localStorage.id, {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + window.localStorage.token
             }
        })
        .then((response)=>{
            console.log(response.data)
            if(!response.data.rating){
                console.log("no estaba en el historial")
                axios.post(url, {
                    userId: window.localStorage.id,
                    foodLocalId: props.foodId,
                    rating: "neutral"
                }, {withCredentials: true, 
                    headers: {
                        Authorization: "Bearer " + window.localStorage.token
                    }
                })
                .then(res2 => {
                    if (!res2.data.rating){
                        console.log("error al registrar alimento en historial")
                    }
                })
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
        axios.get(url + "byfood/" + props.foodId, {
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
    },[props.foodId])

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
                    {isFetching? <CircularProgress size="20px" color='warning'/>:<ThumbUpRoundedIcon fontSize="medium"/>}
                </IconButton>
                <Typography sx={{
                    color: liked?"secondary.main":"#c9c9c9"
                }}>
                    {likedNumber}
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
                    {isFetching? <CircularProgress size="20px" color='warning'/>:<ThumbDownRoundedIcon fontSize="medium"/>}
                </IconButton>
                <Typography 
                sx={{
                    color: disliked?"warning.main":"#c9c9c9"
                }}>
                    {dislikedNumber}
                </Typography>
            </Box>
        </Box>
    )
};

export default FoodLike;