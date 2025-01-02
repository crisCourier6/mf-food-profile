import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import { FoodLocal } from '../interfaces/foodLocal';
import { UserRatesFood } from '../interfaces/userRatesFood';
import { Box, Card, CardContent, CardMedia, Grid, IconButton, Typography, Alert, Button, 
    Dialog, DialogActions, DialogContent, InputAdornment, TextField, Snackbar, SnackbarCloseReason, DialogTitle, CircularProgress, 
    Divider, Pagination, Checkbox, FormGroup, FormControlLabel} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import NoPhoto from "../../public/no-photo.png"
import FoodRate from './FoodRate';
import ImagesScores from '../images/ImagesScores';
import CloseIcon from '@mui/icons-material/Close';
import FoodCommentsCount from './FoodCommentsCount';
import NavigateBack from './NavigateBack';
import ScannerIcon from '../svgs/ScannerIcon';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import { Allergen } from '../interfaces/allergen';
import FoodCommentList from './FoodCommentList';

const FoodLocalSearch: React.FC<{ isAppBarVisible: boolean }> = ({ isAppBarVisible }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const token = window.sessionStorage.getItem("token") ?? window.localStorage.getItem("token")
    const currentUserId = window.sessionStorage.getItem("id") ?? window.localStorage.getItem("id")
    const userFoodPrefs = window.sessionStorage.getItem("food-prefs") ?? window.localStorage.getItem("food-prefs")
    const [openDialog, setOpenDialog] = useState(false);
    const getFoodLocalURL = "/food/local"
    const allergensURL = "/food/allergens"
    const [allergensAll, setAllergensAll] = useState<Allergen[]>([])
    const usedAllergens = ["en:gluten", "en:milk", "en:eggs", "en:nuts", "en:peanuts", "en:sesame-seeds", 
        "en:soybeans", "en:celery", "en:mustard", "en:lupin", "en:fish", "en:crustaceans", 
        "en:molluscs", "en:sulphur-dioxide-and-sulphites"]
    const [foods, setFoods] = useState<FoodLocal[]>([])
    const [selectedFood, setSelectedFood] = useState<FoodLocal | null>(null)
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false)
    const [lacksAllergens, setLacksAllergens] = useState<Allergen[]>([])
    const [containsAllergens, setContainsAllergens] = useState<Allergen[]>([])
    const [successOpen, setSuccessOpen] = useState(false)
    const [page, setPage] = useState(1)
    const limit = 10
    const [showCommentsDialog, setShowCommentsDialog] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const [resultsTotal, setResultsTotal] = useState(0)
    const textFieldRef = useRef<HTMLInputElement>(null); // Create a ref to the TextField

    useEffect(()=>{
        document.title = "Búsqueda - EyesFood";
        api.get(allergensURL, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            let newAllergens:Allergen[] = []
            for (let allergen of response.data){
                if (usedAllergens.includes(allergen.id)){
                    newAllergens.push(allergen)
                }
            }
            setAllergensAll(newAllergens)
        })
        .catch(error=>{
            console.log(error)
        })
        
    }, [])

    useEffect(()=>{
        setIsSearching(true)
        let searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search') ?? "";
        const la = searchParams.get('la') ?? "";
        const ca = searchParams.get('ca') ?? "";
        const oldPage = searchParams.get("page") ?? page;
        setPage(Number(oldPage))

        setSearchQuery(search);

        const lacksAllergenIds = la.split(',').filter(id => id); // filter out empty values
        const containsAllergenIds = ca.split(',').filter(id => id);

        const lacksAllergensMatch = allergensAll.filter(allergen => lacksAllergenIds.includes(allergen.id));
        const containsAllergensMatch = allergensAll.filter(allergen => containsAllergenIds.includes(allergen.id));

        setLacksAllergens(lacksAllergensMatch);
        setContainsAllergens(containsAllergensMatch);

        if (search || lacksAllergenIds.length > 0 || containsAllergenIds.length > 0) {
        
            api.get(`${getFoodLocalURL}?${searchParams.toString()}`, {
                withCredentials: true,
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(res => {
                const updatedData = res.data.results.map((food:any) => {
                    let userRating = food.userRatesFood[0]
                    return {...food, userRatesFood: userRating}
                })
                setFoods(updatedData)
                setResultsTotal(res.data.total)
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
            //setFoods([]);
            setIsSearching(false)
        }
            
  
    }, [location.search, page])

    useEffect(()=>{
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100); // Adjust the delay as needed
    }, [foods])

    const handleSearch = (page: number, isPrevQuery:boolean) => {
        let queryParams = new URLSearchParams(location.search);
        queryParams.set("wr", "true")
        queryParams.set("page", page.toString()); // Add page query parameter
        queryParams.set("limit", limit.toString())
        if (isPrevQuery){
            return navigate(`/search?${queryParams.toString()}`, {replace:true});
        }
        if (currentUserId){
            queryParams.set("wu", currentUserId)
        }
        
        if (searchQuery!=""){
            queryParams.set('search', searchQuery);
        }
        else{
            queryParams.delete("search")
        }
        if (lacksAllergens.length>0){
            const allergenIds = lacksAllergens.map(allergen => allergen.id).join(",");
            queryParams.set('la', allergenIds);
        }
        else{
            queryParams.delete("la")
        }
        if (containsAllergens.length>0){
            const allergenIds = containsAllergens.map(allergen => allergen.id).join(",");
            queryParams.set('ca', allergenIds);
        }
        else{
            queryParams.delete("ca")
        }
        navigate(`/search?${queryParams.toString()}`, {replace:true});
        
    }

    const handleKeyDown = (event:any) => {
        if (event.key === "Enter" && searchQuery.length>1) {
            event.target.blur()
            return handleSearch(page, false)
        }
    };

    const handleClear = () => {
        setSearchQuery('')
        if (textFieldRef.current) {   // Focus the TextField
            textFieldRef.current.focus();
        }
    }

    const handleScan = () => {
        navigate("/scan")
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

      const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllergensAll((prevAllergens) => {
            const updatedAllergens = prevAllergens.map((allergen) =>
                allergen.id === event.target.id
                    ? { ...allergen, selected: !allergen.selected }
                    : allergen
            );
            // Update lacksAllergens directly within the same operation
            const selectedAllergens = updatedAllergens.filter((allergen) => allergen.selected);
            setLacksAllergens(selectedAllergens);
            return updatedAllergens; // Return the updated array for state
        });
      };

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
        const newAllergensAll = allergensAll.map(allergen => ({
            ...allergen,
            selected: false
        }));

        // Update state
        setAllergensAll(newAllergensAll);
    }

    const handlePageChange = (event:any, value:number) => {
        setPage(value);
        handleSearch(value, true)
    };

    const handleShowComments = (foodLocal:FoodLocal) => {
            setSelectedFood(foodLocal)
            setShowCommentsDialog(true)
    }

    const handleCloseComments = () => {
        setShowCommentsDialog(false)
    }

    const handleFillUserPrefs = () => {

        if (userFoodPrefs){
            let foodPrefsArray = userFoodPrefs.split(",");
        
            // Find allergens that match the user's preferences
            const matchingAllergens = allergensAll.filter(allergen => 
                foodPrefsArray.includes(allergen.id)
            );
    
            // Update the allergensAll with the correct 'selected' value
            const newAllergensAll = allergensAll.map(allergen => ({
                ...allergen,
                selected: foodPrefsArray.includes(allergen.id)
            }));
    
            // Update state
            setAllergensAll(newAllergensAll);
            setLacksAllergens(matchingAllergens);
        }
    }

    function Scores(scores:string[]){
        return (
                <Box sx={{
                    display:"flex",
                    flexDirection:"row",
                    justifyContent: "space-around",
                    height:"100%",
                    gap:1
                }}>
                    {scores.map(score=>{
                        return (
                            <Box
                                key={score}
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
        )
    }

    return (
        <Grid container display="flex" 
        flexDirection="column" 
        justifyContent="center"
        alignItems="center"
        sx={{width: "100vw", maxWidth:"500px", gap:1, flexWrap: "wrap"}}
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
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottom: "5px solid",
                    borderLeft: "5px solid",
                    borderRight: "5px solid",
                    borderColor: "secondary.main",
                    color: "primary.contrastText",
                    boxSizing: "border-box"
                  }}
            >
                <Box sx={{display: "flex", flex: 1}}>
                    <NavigateBack/>
                </Box>
                <Box sx={{display: "flex", flex: 4}}>
                    <Typography variant='h6' width="100%"  color="primary.contrastText" sx={{py:1}}>
                        Búsqueda
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flex: 1}}>
                </Box>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "90%",
                gap:2
                
            }}>
                <TextField 
                    value={searchQuery}
                    inputProps = {{maxLength: 100}}
                    type="search"
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    placeholder="Nombre o marca"
                    variant="standard"
                    fullWidth
                    inputRef={textFieldRef}  // Attach ref to TextField
                    onKeyDown={handleKeyDown}
                    sx={{maxWidth: "80%"}}
                    InputProps={{
                        endAdornment: (
                            searchQuery && (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClear} // Clear the input
                                        edge="end"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        ),
                    }}
                />
                <IconButton 
                onClick={()=>handleSearch(1, false)} 
                disabled={searchQuery.length<1 
                            && containsAllergens.length===0 
                            && lacksAllergens.length===0 
                }
                size='medium'
                >
                    <SearchIcon fontSize='large' 
                    sx={{
                        color: searchQuery.length>0?"primary.main":"default"}}
                    />
                </IconButton> 
                
            </Box>
            <Box sx={{display: "flex", width: "100%", justifyContent: "flex-start", alignItems: "center"}}>
                <Button onClick={()=>setOpenDialog(true)}>
                    <FilterAltIcon sx={{color: lacksAllergens.length===0? "primary.main" : "secondary.main"}}/>
                    <Typography variant='subtitle2' sx={{textDecoration: "underline"}}>
                        Filtros
                    </Typography>
                </Button>
                
                {/* {lacksAllergens.length===0 && 
                <IconButton onClick={()=>setLacksAllergens([])}>
                    <CloseIcon/>
                </IconButton>

                } */}
                <Divider orientation='vertical' flexItem/>
                <Button onClick={handleScan}>
                    <ScannerIcon width={"24px"} height={"24px"} />
                    <Typography variant='subtitle2' sx={{textDecoration: "underline"}}>
                        Escanear producto
                    </Typography>
                </Button>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{
            sx: {
                maxHeight: '80vh', 
                width: "100vw",
                maxWidth: "500px",
                margin: "auto"
            }}}> 
                <DialogTitle>
                    <Box sx={{display:"flex", justifyContent: "space-between"}}>
                        Filtros
                        {/* <IconButton
                        color="inherit"
                        onClick={()=>setOpenDialog(false)}
                        sx={{p:0}}
                        >
                            <CloseIcon />
                        </IconButton> */}
                    </Box>
                </DialogTitle>
                <DialogContent sx={{display: "flex", flexDirection: "column", gap:2}}>
                        
                        <Typography variant='subtitle1'>
                            Buscar alimentos:
                        </Typography>
                        <FormGroup>
                        {allergensAll.map(allergen => {
                            return (
                                <FormControlLabel 
                                key={allergen.id} 
                                control={
                                    <Checkbox 
                                        id={allergen.id.toString()}
                                        checked={!!allergen.selected}
                                        onChange={handleSwitchChange}
                                        size="small"
                                    />
                                } 
                                label={
                                    <Typography variant="subtitle2" textAlign={"left"}>
                                        Sin {allergen.name}
                                    </Typography>
                                }/>
                            )
                        })}
                        </FormGroup>
                        
                    </DialogContent>
                    <DialogActions>
                    <Button variant='inverted' sx={{padding: 0.5}} disabled={!userFoodPrefs} onClick={handleFillUserPrefs}>
                            <Typography variant='subtitle2'>
                                Rellenar con mis preferencias
                            </Typography>
                            
                        </Button>
                        <Button onClick={()=>{
                            handleResetFilters()
                        }} color="primary">
                            Limpiar
                        </Button>
                        <Button onClick={()=>{
                            setOpenDialog(false)
                            handleSearch(1, false)
                        }} variant="contained" color="primary">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            {allDone 
                ?   foods.length>0 
                    ?   <Typography variant='subtitle2'>
                            {(page*limit-limit)+1}-{Math.min(page*limit, resultsTotal)} de {resultsTotal} resultados
                        </Typography>
                    :   <Typography variant='subtitle2'>
                            No hay resultados
                        </Typography>
                :   <></>
            }
            {!isSearching 
                ? foods.map(food=>{
                    return (
                    <Card key={food.id} sx={{
                    border: "4px solid", 
                    borderColor: "primary.dark", 
                    bgcolor: "primary.contrastText",
                    width:"95%", 
                    height: 80, 
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
                            <Box sx={{
                            width:"100%", 
                            display:"flex", 
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "60%",
                            borderBottom: "4px solid", 
                            borderColor: "primary.dark", 
                            cursor:"pointer"
                            }}>
                                 <Typography 
                                variant="subtitle2" 
                                width="95%" 
                                height="60%" 
                                sx={{alignContent:"center", }}
                                onClick={()=> handleFoodClick(food.id)}>
                                    {food.name}
                                </Typography>
                            </Box>
                           
                            <Box sx={{
                            width:"100%", 
                            display:"flex", 
                            flexDirection: "row",
                            justifyContent: "space-between",
                            height: "40%",
                            bgcolor: "primary.dark"
                            }}>
                                
                                <FoodRate food={food} onRatingChange={onRatingChange}/>  
                                <FoodCommentsCount id={food.id} onClick={()=>{handleShowComments(food)}} noneColor='grey' someColor='#c9c9c9'/>
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
            {
                foods.length>0 && resultsTotal>limit &&
                <Box 
                sx={{
                    bottom: 0,
                    width:"100%",
                    maxWidth: "500px",
                    transition: "top 0.1s",
                    backgroundColor: 'primary.dark', // Ensure visibility over content
                    zIndex: 100,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderTop: "3px solid",
                    borderLeft: "3px solid",
                    borderRight: "3px solid",
                    borderColor: "secondary.main",
                    color: "primary.contrastText",
                    boxSizing: "border-box"
                  }}
                >
                    <Pagination count={Math.ceil(resultsTotal/limit)}
                    page={page}
                    onChange={handlePageChange}
                    color='secondary'
                    boundaryCount={1}
                    siblingCount={0}
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: 'primary.contrastText', // Color for normal page numbers
                        },
                        '& .MuiPaginationItem-root.Mui-selected': {
                            color: 'secondary.contrastText', // Text color for active page
                        },
                        '& .MuiPaginationItem-ellipsis': {
                            color: 'primary.contrastText', // Color for ellipsis
                        },
                        '& .MuiPaginationItem-root:hover': {
                            backgroundColor: 'primary.contrastText', // Hover color for page numbers
                            color: "primary.dark"
                        }
                    }}
                    />
                </Box>
                
            }
            <FoodCommentList 
                foodLocal={selectedFood} 
                show={showCommentsDialog} 
                hide={handleCloseComments} 
                onCommentDeleted={()=>{}} 
                canEdit={false}
            />
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
    )
}

export default FoodLocalSearch;