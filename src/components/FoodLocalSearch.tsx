import React, { useEffect, useState } from 'react';
import api from '../api';
import { FoodLocal } from '../interfaces/foodLocal';
import { UserRatesFood } from '../interfaces/userRatesFood';
import { Box, Card, CardContent, CardMedia, Grid, IconButton, Typography, Alert, Button, 
    Dialog, DialogActions, DialogContent, InputAdornment, TextField, Snackbar, SnackbarCloseReason, 
    InputLabel, Select, OutlinedInput, Chip, MenuItem, DialogTitle, CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import NoPhoto from "../../public/no-photo.png"
import ClearIcon from '@mui/icons-material/Clear'; // Import the clear icon
import FoodRate from './FoodRate';
import ImagesScores from '../images/ImagesScores';
import FoodCommentsCount from './FoodCommentsCount';

type Allergen = { id: string; name: string};

const FoodLocalSearch: React.FC<{ isAppBarVisible: boolean }> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const currentUserId = window.sessionStorage.getItem("id") || window.localStorage.getItem("id")
    const userFoodPrefs = window.sessionStorage.getItem("food-prefs") || window.localStorage.getItem("food-prefs")
    const [openDialog, setOpenDialog] = useState(false);
    const getFoodLocalURL = "/food/local"
    const allergensURL = "/food/allergens"
    const [allergensAll, setAllergensAll] = useState<Allergen[]>([])
    const [foods, setFoods] = useState<FoodLocal[]>([])
    const [foodsFiltered, setFoodsFiltered] = useState<FoodLocal[]>([])
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false)
    const [codeQuery, setCodeQuery] = useState("")
    const [lacksAllergens, setLacksAllergens] = useState<Allergen[]>([])
    const [containsAllergens, setContainsAllergens] = useState<Allergen[]>([])
    const [filter, setFilter] = useState("all")
    const [successOpen, setSuccessOpen] = useState(false)
    const [allDone, setAllDone] = useState(false)

    useEffect(()=>{
        document.title = "Búsqueda - EyesFood";
        api.get(allergensURL, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            setAllergensAll(response.data);
        })
        .catch(error=>{
            console.log(error)
        })
        
    }, [])

    useEffect(()=>{
        setIsSearching(true)
        let searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search') || "";
        const la = searchParams.get('la') || "";
        const ca = searchParams.get('ca') || "";
        const id = searchParams.get('id') || "";

        setSearchQuery(search);
        setCodeQuery(id);

        const lacksAllergenIds = la.split(',').filter(id => id); // filter out empty values
        const containsAllergenIds = ca.split(',').filter(id => id);

        const lacksAllergensMatch = allergensAll.filter(allergen => lacksAllergenIds.includes(allergen.id));
        const containsAllergensMatch = allergensAll.filter(allergen => containsAllergenIds.includes(allergen.id));

        setLacksAllergens(lacksAllergensMatch);
        setContainsAllergens(containsAllergensMatch);

        if (search || lacksAllergenIds.length > 0 || containsAllergenIds.length > 0 || id) {
        
            api.get(`${getFoodLocalURL}?${searchParams.toString()}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(res => {
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
                setIsSearching(false)
            })
        }
        else {
            // If no parameters, reset foods to empty or a default state
            setFoods([]);
            setAllDone(true); // Set to true if you want to indicate loading is complete
            setIsSearching(false)
        }
            
  
    }, [location.search, allergensAll])

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

    useEffect(()=>{
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100); // Adjust the delay as needed
    }, [foodsFiltered])

    // const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter:string) => {
    //     if (newFilter === null) {
    //         return;
    //       }
    //     setFilter(newFilter);
    
    //     // Filter data based on the selected value
    //     if (newFilter === 'all') {
    //         setFoodsFiltered(foods);
    //     } 
    //     else {
    //         setFoodsFiltered(foods.filter(item => item.userRatesFood?.rating === newFilter));
    //     }
    // };

    const handleSearch = () => {
        let queryParams = new URLSearchParams(location.search);
        queryParams.set("wr", "true")
        if (currentUserId){
            queryParams.set("wu", currentUserId)
        }
        
        if (searchQuery!=""){
            queryParams.set('search', searchQuery);
        }
        if (lacksAllergens.length>0){
            const allergenIds = lacksAllergens.map(allergen => allergen.id).join(",");
            queryParams.set('la', allergenIds);
        }
        if (containsAllergens.length>0){
            const allergenIds = containsAllergens.map(allergen => allergen.id).join(",");
            queryParams.set('ca', allergenIds);
        }
        if (codeQuery!=""){
            queryParams.set('id', codeQuery);
        }
        
        navigate(`/search?${queryParams.toString()}`);
        
    }

    const handleClear = () => {
        setSearchQuery('')
        navigate(`/search`);
    }

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

    const onRatingChange = (oldFood: FoodLocal, newRating : UserRatesFood) => {
        if(oldFood.userRatesFood){
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
        else{
            if (newRating.rating==="likes"){
                setFoods(prevFoods => 
                    prevFoods.map(food => 
                        food.id === newRating.foodLocalId 
                            ? { 
                                ...food, 
                                likes:food.likes+1,
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
                                dislikes:food.dislikes+1,
                                userRatesFood: newRating } // replace userRatesFood
                            : food // keep the food unchanged
                    )
                );
            }
        }
        
    }

    const handleContainsAllergensChange = (event:any) => {
        const selectedIds = event.target.value;
        const selectedAllergens = allergensAll.filter(allergen => selectedIds.includes(allergen.id));
        setContainsAllergens(selectedAllergens); // Set the full objects
    };

    const handleLacksAllergensChange = (event:any) => {
        const selectedIds = event.target.value;
        const selectedAllergens = allergensAll.filter(allergen => selectedIds.includes(allergen.id));
        setLacksAllergens(selectedAllergens); // Set the full objects
    };

    const handleResetFilters = () => {
        setLacksAllergens([])
        setContainsAllergens([])
        setCodeQuery("")
    }

    const handleFillUserPrefs = () => {

        if (userFoodPrefs){
            let foodPrefsArray = userFoodPrefs.split(",")
            const matchingAllergens = allergensAll.filter(allergen => 
                foodPrefsArray.includes(allergen.id)
            );
            setLacksAllergens(matchingAllergens)
        }
    }

    function Scores(scores:string[]){
        return (<>
                <Box sx={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent: "space-around",
                    height:"100%",
                    gap:1
                }}>
                    {scores.map((score, i)=>{
                        return (
                            <Box
                                key={i}
                                component="img"
                                sx={{
                                    height: "95%",
                                }}
                                alt={score}
                                src={ImagesScores[score]}
                            />
                        )
                    })}
                </Box>
        </>
        )
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
                    borderBottom: "5px solid",
                    borderLeft: "5px solid",
                    borderRight: "5px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box"
                  }}
            >
                <Typography variant='h5' width="100%"  color="primary.contrastText" sx={{py:1, borderLeft: "3px solid",
                    borderRight: "3px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box",
                }}>
                    Búsqueda
                </Typography>
                {/* <ToggleButtonGroup
                    value={filter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="filter options"
                    sx={{ width:"100%",display:"flex",flexDirection:"row",justifyContent:"center" }}
                >
                    <ToggleButton value="all" sx={{flex:1, fontSize:{xs:16, md:20}, py: 0.5}}>Todos</ToggleButton>
                    <ToggleButton value="likes" sx={{flex:1, fontSize:{xs:16, md:20}, py: 0.5 }}>Me gustan</ToggleButton>
                    <ToggleButton value="dislikes" sx={{flex:1, fontSize:{xs:16, md:20}, py: 0.5}}>No me gustan</ToggleButton>
                </ToggleButtonGroup> */}
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "90%",
                gap:2
            }}>
                <TextField 
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    placeholder="Nombre o marca"
                    variant="standard"
                    fullWidth
                    sx={{mt: 0.5, maxWidth: "90%"}}
                    InputProps={{
                        endAdornment: (
                            searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClear} // Clear the input
                                        edge="end"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        ),
                    }}
                />
                <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                    Filtros
                </Button>
            </Box>
            <Button onClick={handleSearch} disabled={searchQuery.length<1 && containsAllergens.length===0 && lacksAllergens.length===0 && codeQuery.length===0} variant='contained'>
                Buscar
            </Button>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{
            sx: {
                maxHeight: '80vh', 
                width: "95vw",
                maxWidth: "500px"
            }}}> 
                <DialogTitle>Opciones</DialogTitle>
                <DialogContent sx={{display: "flex", flexDirection: "column", gap:2}}>
                        <InputLabel id="demo-multiple-chip-label">Contiene o puede contener</InputLabel>
                        <Select
                        variant='standard'
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        fullWidth
                        value={containsAllergens.map(a => a.id)}
                        onChange={handleContainsAllergensChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200, // Set your desired max height here
                                    overflowY: 'auto', // Enable scrolling if items exceed max height
                                },
                            },
                        }}
                        sx={{
                            maxHeight: 100, // Set your desired max height here for the input
                            overflow: 'hidden', // Prevent overflow if the content exceeds max height
                        }}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((id) => {
                                    const allergen = allergensAll.find(a => a.id === id); // Find the full object
                                    return <Chip key={id} label={allergen?.name} />;
                                })}
                            </Box>
                        )}
                        >
                        {allergensAll.map((allergen) => (
                            <MenuItem
                            key={allergen.id}
                            value={allergen.id}
                            sx={{
                                fontSize: 14
                            }}
                            >
                            {allergen.name}
                            </MenuItem>
                        ))}
                        </Select>

                        <InputLabel id="demo-multiple-chip-label">No debe contener</InputLabel>
                        <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        fullWidth
                        value={lacksAllergens.map(a => a.id)}
                        onChange={handleLacksAllergensChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200, // Set your desired max height here
                                    overflowY: 'auto', // Enable scrolling if items exceed max height
                                },
                            },
                        }}
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            maxHeight: 100,
                            overflowY: "scroll", // Prevent overflow if the content exceeds max height
                        }}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((id) => {
                                    const allergen = allergensAll.find(a => a.id === id); // Find the full object
                                    return <Chip key={id} label={allergen?.name} />;
                                })}
                            </Box>
                        )}
                        >
                        {allergensAll.map((allergen) => (
                            <MenuItem
                            key={allergen.id}
                            value={allergen.id}
                            sx={{
                                fontSize: 14
                            }}
                            >
                            {allergen.name}
                            </MenuItem>
                        ))}
                        </Select>
                        <Button variant='inverted' sx={{padding: 0.5}} disabled={!userFoodPrefs} onClick={handleFillUserPrefs}>
                            <Typography variant='subtitle2'>
                                Usar preferencias personales
                            </Typography>
                            
                        </Button>
                    <TextField 
                            value={codeQuery}
                            onChange={(e)=>setCodeQuery(e.target.value)}
                            placeholder="Código de barras"
                            variant="standard"
                            fullWidth
                            sx={{mt: 0.5, maxWidth: "100%"}}
                            InputProps={{
                                endAdornment: (
                                    searchQuery && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setCodeQuery('')} // Clear the input
                                                edge="end"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleResetFilters} color="primary">
                            Limpiar
                        </Button>
                        <Button variant={"contained"} onClick={() => setOpenDialog(false)} color="primary">
                            Guardar
                        </Button>
                        
                    </DialogActions>
                </Dialog>
            {allDone && <Typography variant='subtitle2'>{foodsFiltered.length} resultados</Typography>}
            {!isSearching 
                ? foodsFiltered.map((food)=>{
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
                                {Scores([   "eco_score_" + food.foodData?.ecoscore_grade, 
                                    "nutri_score_" + food.foodData?.nutriscore_grade,
                                    "nova_score_" + food.foodData?.nova_group as string
                                ])}     
                                
                            </Box>
                        </CardContent>
                    </Card>
                    )})
                : <CircularProgress/>
            }
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

export default FoodLocalSearch;