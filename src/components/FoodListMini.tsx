import React, { useEffect, useState } from 'react';
import api from '../api';
import { FoodLocal } from '../interfaces/foodLocal';
import { UserRatesFood } from '../interfaces/userRatesFood';
import { Box, Card, CardContent, CardMedia, Grid, IconButton, Typography, ToggleButtonGroup, ToggleButton, 
    Alert, Backdrop, Button, Dialog, DialogActions, DialogContent, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import NoPhoto from "../../public/no-photo.png"
import { CircularProgress } from "@mui/material";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import FoodRate from './FoodRate';
import FoodCommentsCount from './FoodCommentsCount';
import NavigateBack from './NavigateBack';

const FoodListMini: React.FC<{ isAppBarVisible: boolean }> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const getFoodLocalURL = "/food/local"
    const foodRatingsURL = "/food/ratings"
    const [foods, setFoods] = useState<FoodLocal[]>([])
    const [selectedFood, setSelectedFood] = useState<FoodLocal|null>(null)
    const [foodsFiltered, setFoodsFiltered] = useState<FoodLocal[]>([])
    const [filter, setFilter] = useState("all")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const queryParams = `?u=${id}&wr=true`

    useEffect(()=>{
        document.title = "Mi historial de alimentos - EyesFood";
       api.get(`${getFoodLocalURL}${queryParams}`, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }) 
                .then( res => {
                    const updatedData = res.data.map((food:any) => {
                        let userRating = food.userRatesFood[0]
                        return {...food, userRatesFood: userRating}
                    })
                    setFoods(updatedData)
                })
                .catch(error=>{
                    console.log(error)
                })
                .finally(()=>{
                    setAllDone(true)
                })
    }, [])

    useEffect(() => {
        if (filter === 'all') {
            setFoodsFiltered(foods);
        } 
        else {
          setFoodsFiltered(foods.filter((food:FoodLocal) => {
            return food.userRatesFood?.rating === filter     
        }));
        }
        
      }, [foods]);

    const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter:string) => {
        if (newFilter === null) {
            return;
          }
        setFilter(newFilter);
    
        // Filter data based on the selected value
        if (newFilter === 'all') {
            setFoodsFiltered(foods);
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100); // Adjust the delay as needed
        } 
        else {
            setFoodsFiltered(foods.filter(item => item.userRatesFood?.rating === newFilter));
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100); // Adjust the delay as needed
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

    const handleFoodDelete = () => {
        api.delete(`${foodRatingsURL}/byuserandfood/${selectedFood?.userRatesFood?.userId}/${selectedFood?.userRatesFood?.foodLocalId}`, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(res => {
            setFoods(foods => foods?foods.filter(item => item.id !== selectedFood?.id):foods)
            setFoodsFiltered(foodsFiltered => foodsFiltered?foodsFiltered.filter(item => item.id !== selectedFood?.id):foodsFiltered)
            setShowDeleteDialog(false)
            setSuccessOpen(true)

        })
        .catch(error=>{
            console.log(error)
        })
    }

    const onRatingChange = (oldFood: FoodLocal, newRating : UserRatesFood) => {
        if (newRating.rating==="likes"){
            setFoods(prevFoods => 
                prevFoods.map(food => 
                    food.id === newRating.foodLocalId 
                        ? { 
                            ...food, 
                            likes:food.userRatesFood?.rating==="neutral"
                                                        ?food.likes+1:
                                                        food.userRatesFood?.rating==="dislikes"
                                                            ?food.likes+1
                                                            :food.likes-1,
                            dislikes: food.userRatesFood?.rating==="dislikes"?food.dislikes-1:food.dislikes,
                            userRatesFood: newRating } // replace userRatesFood
                        : food // keep the food unchanged
                )
            );
        }

        else if (newRating.rating ==="dislikes"){
            setFoods(prevFoods => 
                prevFoods.map(food => 
                    food.id === newRating.foodLocalId 
                        ? { 
                            ...food, 
                            dislikes:food.userRatesFood?.rating==="neutral"
                                                            ?food.dislikes+1:
                                                            food.userRatesFood?.rating==="likes"
                                                                ?food.dislikes+1
                                                                :food.dislikes-1,
                            likes: food.userRatesFood?.rating==="likes"?food.likes-1:food.likes,
                            userRatesFood: newRating } // replace userRatesFood
                        : food // keep the food unchanged
                )
            );
        }
        else if (newRating.rating ==="neutral"){
            setFoods(prevFoods => 
                prevFoods.map(food => 
                    food.id === newRating.foodLocalId 
                        ? { 
                            ...food, 
                            dislikes:food.userRatesFood?.rating==="dislikes"?food.dislikes-1:food.dislikes,
                            likes: food.userRatesFood?.rating==="likes"?food.likes-1:food.likes,
                            userRatesFood: newRating } // replace userRatesFood
                        : food // keep the food unchanged
                )
            );
        }
    }

    const handleDeleteDialog = (food:FoodLocal) => {
        setSelectedFood(food)
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
                    <Box sx={{
                        display: "flex", 
                        width: "100%", 
                        justifyContent: "space-between",
                        borderLeft: "3px solid",
                        borderRight: "3px solid",
                        borderColor: "secondary.main",
                        boxSizing: "border-box",
                        color: "primary.contrastText"
                    }}>
                        <Box sx={{display: "flex", flex:1}}>
                            <NavigateBack/>
                        </Box>
                        <Box sx={{display: "flex", flex:4}}>
                            <Typography variant='h6' width="100%"  color="primary.contrastText" sx={{py:1, 
                            }}>
                                Mi historial de alimentos
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", flex:1}}/>
                </Box>
                <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="filter options"
                    sx={{ width:"100%",display:"flex",flexDirection:"row",justifyContent:"center" }}
                >
                    <ToggleButton value="all" sx={{flex:1, fontSize:{xs:12, md:18}, py: 0.5}}>Todos</ToggleButton>
                    <ToggleButton value="likes" sx={{flex:1, fontSize:{xs:12, md:18}, py: 0.5 }}>Me gustan</ToggleButton>
                    <ToggleButton value="dislikes" sx={{flex:1, fontSize:{xs:12, md:18}, py: 0.5}}>No me gustan</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            
            { foodsFiltered.map((food)=>{
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
                        image={food.picture==="defaultFood.png"?NoPhoto:food.picture}
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
                            
                            <FoodRate food={food} onRatingChange={onRatingChange}/>
                            <FoodCommentsCount id={food.id} onClick={()=>{}} noneColor='grey' someColor='#c9c9c9'/>
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
                            ¿Borrar {selectedFood?.name} del historial?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setShowDeleteDialog(false)} variant='contained'>
                            No
                        </Button>
                        <Button onClick={handleFoodDelete} variant='contained'>
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