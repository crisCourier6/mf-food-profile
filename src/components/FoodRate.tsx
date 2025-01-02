import React, { useState } from 'react';
import api from '../api';
import { Box, IconButton, Typography } from '@mui/material';
import { UserRatesFood } from '../interfaces/userRatesFood';
import "./Components.css"
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { FoodLocal } from '../interfaces/foodLocal';

interface FoodRateProps {
    food: FoodLocal
    onRatingChange: (food: FoodLocal, newRating: UserRatesFood) => void; // Callback prop to notify the parent
  }

const FoodRate: React.FC<FoodRateProps> = (props) => {
    const [isUpdating, setIsUpdating] = useState(false)
    const token = window.sessionStorage.getItem("token") ?? window.localStorage.getItem("token")
    const currentUserId = window.sessionStorage.getItem("id") ?? window.localStorage.getItem("id")
    const foodRatingsURL = "/food/ratings"

    const handleLike = (likedFood: FoodLocal) => {
        setIsUpdating(true)
        let newRating = {}
        if (likedFood.userRatesFood){
            newRating = {
                userId:likedFood.userRatesFood.userId, 
                foodLocalId:likedFood?.id, 
                rating: likedFood?.userRatesFood?.rating==="likes"?"neutral":"likes"
            }
        }
        else{
            newRating = {
                userId:currentUserId, 
                foodLocalId:likedFood?.id, 
                rating: "likes"
            }
        }
        api.post(foodRatingsURL, 
            newRating, {withCredentials: true, 
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            // Update foods by replacing the userRatesFood for the food with the same ID
            props.onRatingChange(props.food, res.data)
            
        })
        .catch(error=>{
            console.log(error)
        })
        .finally(()=>{
            setIsUpdating(false)
        })

    }

    const handleDislike = (dislikedFood:FoodLocal) => {
        setIsUpdating(true)
        let newRating = {}
        if (dislikedFood.userRatesFood){
            newRating = {
                userId:dislikedFood?.userRatesFood?.userId, 
                foodLocalId:dislikedFood?.id, 
                rating: dislikedFood?.userRatesFood?.rating==="dislikes"?"neutral":"dislikes"
            }
        }
        else{
            newRating = {
                userId:currentUserId, 
                foodLocalId:dislikedFood?.id, 
                rating: "dislikes"
            }
        }
        api.post(foodRatingsURL, 
            newRating, {withCredentials: true, 
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            // Update foods by replacing the userRatesFood for the food with the same ID
            props.onRatingChange(props.food, res.data)
            
        })
        .catch(error=>{
            console.log(error)
        })
        .finally(()=>{
            setIsUpdating(false)
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
                <IconButton disabled={isUpdating} onClick={()=> handleLike(props.food)} 
                sx={{
                    color: props.food.userRatesFood?.rating==="likes"?"secondary.main":"#c9c9c9"
                }}>
                    <ThumbUpRoundedIcon sx={{fontSize: {sm: 25, xs: 15}}}/>
                </IconButton>
                <Typography sx={{
                    color: props.food.userRatesFood?.rating==="likes"?"secondary.main":"#c9c9c9"
                }}>
                    {isUpdating? <CircularProgress size="20px" color='warning'/>:props.food.likes}
                </Typography>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}>
                <IconButton disabled={isUpdating} onClick={()=>{handleDislike(props.food)}} 
                sx={{
                    color: props.food.userRatesFood?.rating==="dislikes"?"warning.main":"#c9c9c9"
                }}>
                    <ThumbDownRoundedIcon sx={{fontSize: {sm: 25, xs: 15}}}/>
                </IconButton>
                <Typography 
                sx={{
                    color: props.food.userRatesFood?.rating==="dislikes"?"warning.main":"#c9c9c9"
                }}>
                    {isUpdating? <CircularProgress size="15px" color='warning'/>:props.food.dislikes}
                </Typography>
            </Box>
        </Box>
    )
};

export default FoodRate;