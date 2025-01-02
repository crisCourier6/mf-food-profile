import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import api from '../api';
import { Box, IconButton, Typography, CircularProgress, Tooltip, } from '@mui/material';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';

interface FoodCommentsCountProps {
    id: string; // Ensure 'id' is typed
    onClick: () => void;
    noneColor: string;
    someColor: string;
}

export interface FoodCommentsCountRef {
    refreshCommentCount: () => void;
}

const FoodCommentsCount= forwardRef(({id, onClick, noneColor, someColor}: FoodCommentsCountProps, ref) => {
    const [commentsCount, setCommentsCount] = useState(0)
    const commentsURL = "/comments-food"
    const token = window.sessionStorage.getItem("token") ?? window.localStorage.getItem("token")
    const [allDone, setAllDone] = useState(false)

    const fetchCommentCount = async () => {
        if (id){
            let queryParams = `?f=${id}&oc=true`
            api.get(`${commentsURL}${queryParams}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
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
    }
    
    useEffect(() => {
        fetchCommentCount()
    }, [id]);

    useImperativeHandle(ref, () => ({
        refreshCommentCount: fetchCommentCount,
    }));

    return ( 
        <Tooltip title={"Ver comentarios"} key="comments" placement="top" arrow={true}>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        }}>
            <IconButton onClick={() => {
                fetchCommentCount(); // Refresh when clicked if needed
                onClick();
            }}>
                <CommentRoundedIcon sx={{fontSize: {sm: 25, xs: 15}, color: commentsCount>0?someColor:noneColor}}/>
            </IconButton>
            <Typography 
            sx={{
                color: commentsCount>0?someColor:noneColor
            }}>
                {allDone? commentsCount:<CircularProgress size="15px" color='warning'/>}
            </Typography>
        </Box>
        </Tooltip>
    )
})

export default FoodCommentsCount;