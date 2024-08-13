import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FoodLocal } from '../interfaces/foodLocal';
import { UserRatesFood } from '../interfaces/userRatesFood';
import { Box, Card, CardContent, CardMedia, Grid, IconButton, Paper, Typography, RadioGroup, FormControlLabel, Radio, ToggleButtonGroup, ToggleButton, Alert, Backdrop, Button, Dialog, DialogActions, DialogContent, InputAdornment, TextField, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import NoPhoto from "../../public/no-photo.png"
import { CircularProgress } from "@mui/material";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { watch } from 'fs';
import FoodLike from './FoodLike';
import FoodLikeNoGet from './FoodLikeNoGet';

type FoodMini = {
    id:string,
    userId:string,
    name:string,
    picture:string,
    likes:number,
    dislikes:number,
    rating:string
}

const FoodListMini: React.FC<{ isAppBarVisible: boolean }> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const getFoodRatingsURL = "http://192.168.100.6:8080/food/ratings/byFood/"
    const getUserRatingsURL = "http://192.168.100.6:8080/food/ratings/byUser/"
    const getFoodLocalURL = "http://192.168.100.6:8080/food/local/"
    const foodRatingsURL = "http://192.168.100.6:8080/food/ratings/byuserandfood/"
    const [userRatings, setUserRatings] = useState<UserRatesFood[]>([])
    const [foodMini, setFoodMini] = useState<FoodMini[]>([])
    const [foodToDelete, setFoodToDelete] = useState<FoodMini>({
        id:"",
        userId:"",
        name:"",
        picture:"",
        likes:0,
        dislikes:0,
        rating:""
    })
    const [foodMiniFiltered, setFoodMiniFiltered] = useState<FoodMini[]>([])
    const [filter, setFilter] = useState("all")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [allDone, setAllDone] = useState(false)
    useEffect(()=>{
       axios.get(getUserRatingsURL + id, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + window.localStorage.token
                    }
                }) 
                .then( async userRatingsResponse => {
                    
                    if (userRatingsResponse && userRatingsResponse.data.length>0){
                        setUserRatings(userRatingsResponse.data)
                        let tempFoodMini:FoodMini[]= []
                        for (var userRating of userRatingsResponse.data){
                            const foodRatingsResponse = await axios.get(getFoodRatingsURL + userRating.foodLocalId, {
                                withCredentials: true,
                                headers: {
                                    Authorization: "Bearer " + window.localStorage.token
                                }
                            })

                            const foodLocalResponse = await axios.get(getFoodLocalURL + userRating.foodLocalId, {
                                withCredentials: true,
                                headers: {
                                    Authorization: "Bearer " + window.localStorage.token
                                }
                            })
                            tempFoodMini.push({...foodLocalResponse.data, 
                                                ...foodRatingsResponse.data, 
                                                rating: userRating.rating,
                                                userId: userRating.userId,
                                                picture: foodLocalResponse.data.picture=="defaultFood.png"?NoPhoto:foodLocalResponse.data.picture})
                        }
                        setFoodMini(tempFoodMini)
                        setFoodMiniFiltered(tempFoodMini)
                    }
                    else{
                        setAllDone(true)
                    }
                })
                .finally(()=>{
                    setAllDone(true)
                })
    }, [id, getFoodRatingsURL, getUserRatingsURL, getFoodLocalURL])

    const handleRatingChange = (foodId: string, newRating: string, likedNumber:number, dislikedNumber:number) => {
        setFoodMini((prevFoodMini) =>
            prevFoodMini.map((food) =>
              food.id === foodId ? { ...food, rating: newRating, likes:likedNumber, dislikes:dislikedNumber  } : food
            )
        )
    }

    useEffect(() => {
        if (filter === 'all') {
            setFoodMiniFiltered(foodMini);
        } 
        else {
          setFoodMiniFiltered(foodMini.filter((item) => {
            return item.rating === filter     
        }));
        }
        
      }, [foodMini]);

    useEffect(()=>{
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100); // Adjust the delay as needed
    }, [foodMiniFiltered])

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter:string) => {
        if (newFilter === null) {
            return;
          }
        setFilter(newFilter);
    
        // Filter data based on the selected value
        if (newFilter === 'all') {
            setFoodMiniFiltered(foodMini);
        } 
        else {
            setFoodMiniFiltered(foodMini.filter(item => item.rating === newFilter));
        }
    };

    const handleFoodClick = (id:string) => {
        navigate("/food/" + id)
    }

    const handleSuccessClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
      ) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setSuccessOpen(false);
      }

    const handleFoodDelete = (userId:string, foodLocalId:string) => {
        axios.delete(foodRatingsURL + foodLocalId + "/" + userId, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + window.localStorage.token
            }
        })
        .then(response => {
            if (response.data.affected == 1){
                setFoodMini(foodMini => foodMini?foodMini.filter(item => item.id !== foodLocalId):foodMini)
                setFoodMiniFiltered(foodMiniFiltered => foodMiniFiltered?foodMiniFiltered.filter(item => item.id !== foodLocalId):foodMiniFiltered)
                setShowDeleteDialog(false)
                setSuccessOpen(true)
            }

        })
    }

    const handleDeleteDialog = (food:FoodMini) => {
        setFoodToDelete(food)
        setShowDeleteDialog(true)
    }

    return ( allDone?
        <Grid container display="flex" 
        flexDirection="column" 
        justifyContent="center"
        alignItems="center"
        sx={{width: "100vw", maxWidth:"500px", gap:2, flexWrap: "wrap", pb: 7}}
        >
            <Box 
                sx={{
                    position: 'sticky',
                    top: isAppBarVisible?"50px":"0px",
                    width:"100%",
                    maxWidth: "500px",
                    transition: "top 0.1s",
                    backgroundColor: 'primary.dark', // Ensure visibility over content
                    zIndex: 100,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    
                    boxSizing: "border-box"
                  }}
            >
                <Typography variant='h5' width="100%"  color="primary.contrastText" sx={{py:1, borderLeft: "3px solid",
                    borderRight: "3px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box",
                }}>
                    Mi historial de alimentos
                </Typography>
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="filter options"
                    sx={{ width:"100%",display:"flex",flexDirection:"row",justifyContent:"center" }}
                >
                    <ToggleButton value="all" sx={{flex:1, fontSize:{xs:16, md:20}, py: 0.5}}>Todos</ToggleButton>
                    <ToggleButton value="likes" sx={{flex:1, fontSize:{xs:16, md:20}, py: 0.5 }}>Me gustan</ToggleButton>
                    <ToggleButton value="dislikes" sx={{flex:1, fontSize:{xs:16, md:20}, py: 0.5}}>No me gustan</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            
            { foodMiniFiltered.map((food)=>{
                return (
                <Card key={food.id} sx={{
                border: "4px solid", 
                borderColor: "primary.dark", 
                bgcolor: "primary.contrastText",
                width:"90%", 
                height: "15vh", 
                minHeight: "80px",
                maxHeight: "120px", 
                display:"flex",
                }}>
                    <CardMedia sx={{width:"25%", borderRight: "4px solid", borderColor: "primary.dark", cursor: "pointer"}}
                        image={food.picture}
                        title={food.name}
                        onClick={()=> handleFoodClick(food.id)}>      
                    </CardMedia>
                    <CardContent sx={{
                    width:"75%",
                    height: "100%", 
                    display:"flex", 
                    flexDirection: "column", 
                    justifyContent: "center",
                    alignItems: "center",
                    padding:0,
                    }}>
                        <Typography 
                        variant="body2" 
                        color="primary.dark" 
                        fontSize={15} 
                        fontFamily="Montserrat"
                        width="100%" 
                        height="60%" 
                        sx={{alignContent:"center", borderBottom: "4px solid", borderColor: "primary.main", cursor:"pointer"}}
                        onClick={()=> handleFoodClick(food.id)}>
                            {food.name}
                        </Typography>
                        <Box sx={{
                            width:"100%", 
                            display:"flex", 
                            flexDirection: "row",
                            justifyContent: "space-between",
                            height: "40%",
                            bgcolor: "primary.dark"
                            }}>
                            <FoodLikeNoGet foodId={food.id} rating={food.rating} likes={food.likes} dislikes={food.dislikes} onRatingChange={handleRatingChange}/>
                            
                                <IconButton onClick={()=>handleDeleteDialog(food)}
                                sx={{
                                    color: "error.main"
                                }}>
                                    <DeleteForeverRoundedIcon fontSize="medium"/>
                                </IconButton>
                                
                            
                        </Box>
                    </CardContent>
                </Card>
                
                
                )
            })
            }
            <Backdrop open={showDeleteDialog} 
            sx={{width: "100vw"}}
            >
                
                <Dialog open={showDeleteDialog} scroll='paper' 
                sx={{width: "100%", 
                maxWidth: "500px", 
                margin: "auto"
                }}>
                    <DialogContent>
                        <Typography textAlign="justify">
                            ¿Borrar {foodToDelete.name} del historial?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setShowDeleteDialog(false)} variant='contained'>
                            No
                        </Button>
                        <Button onClick={()=>handleFoodDelete(foodToDelete.userId, foodToDelete.id)} variant='contained'>
                            Sí
                        </Button>
                    </DialogActions>
                </Dialog>
            </Backdrop>

            <Snackbar
                open = {successOpen}
                autoHideDuration={3000}
                onClose={handleSuccessClose}
                sx={{bottom: "3vh"}}
                >
                <Alert
                    severity="success"
                    variant="filled"
                    action={
                        <Button color="inherit" size="small" onClick={handleSuccessClose}>
                            OK
                        </Button>
                        }
                    sx={{ width: '100%',
                        color: "secondary.contrastText",
                        bgcolor: "secondary.main",
                        borderColor: "secondary.contrastText"
                    }}
                >
                    Alimento eliminado!
                </Alert>
            </Snackbar>  
   
        </Grid>
        
        :<CircularProgress/>   
    )
}

export default FoodListMini;