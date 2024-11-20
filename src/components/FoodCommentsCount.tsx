import React, { useEffect, useState } from 'react';
import api from '../api';
import { Box, IconButton, Typography, CircularProgress, } from '@mui/material';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';

const FoodCommentsCount: React.FC<{id:string | undefined, onClick: () => void, noneColor: string, someColor:string}> = ({id, onClick, noneColor, someColor}) => {
    const [commentsCount, setCommentsCount] = useState(0)
    const commentsURL = "/comments-food"
    const [allDone, setAllDone] = useState(false)
    
    useEffect(() => {
        if (id){
            let queryParams = `?f=${id}&oc=true`
            api.get(`${commentsURL}${queryParams}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + window.localStorage.token
                }
            })
            .then(res => {
                setCommentsCount(res.data.count)
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(()=>{
                setAllDone(true)
            })
        }
        
    }, []);

    return ( 
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        }}>
            <IconButton  onClick={onClick}
            sx={{
                color: commentsCount>0?someColor:noneColor
            }}>
                <CommentRoundedIcon sx={{fontSize: {sm: 25, xs: 15}}}/>
            </IconButton>
            <Typography 
            sx={{
                color: commentsCount>0?someColor:noneColor
            }}>
                {allDone? commentsCount:<CircularProgress size="15px" color='warning'/>}
            </Typography>
        </Box>
    )
}

export default FoodCommentsCount;