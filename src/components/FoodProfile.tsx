import React, { useRef, useEffect, useState } from 'react';
import api from '../api';
import { FoodLocal } from '../interfaces/foodLocal';
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Card, CardMedia, CardContent, Grid, Typography, 
    Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle, TableContainer, Table, 
    TableHead, TableCell, TableRow, TableBody, 
    Divider} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import NoPhoto from "../../public/no-photo.png"
import "./Components.css"
import ImagesScores from '../images/ImagesScores';
import ImagesAllergens from '../images/ImagesAllergens';
import QuickLookLogo from "../../public/QuickLookLogo.png"
import FoodComments from './FoodComments';
import FoodAdditive from './FoodAdditive';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import EditIcon from '@mui/icons-material/Edit';
import FoodRate from './FoodRate';
import { UserRatesFood } from '../interfaces/userRatesFood';
import FoodCommentsCount from './FoodCommentsCount';
import NavigateBack from './NavigateBack';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FoodHasAllergen } from '../interfaces/foodHasAllergen';
import { FoodHasAdditive } from '../interfaces/foodHasAdditive';

type NutritionValues = {
    id: string,
    hundred: any,
    serving: any
}

interface ImageDisplayProps {
    image: {img:string, alt:string}
  }

const ImageDisplay = (props:ImageDisplayProps) =>{   
    const [showImage, setShowImage] = useState(false)
    function handleImageClose(){
        setShowImage(false)
    }
    function handleImageOpen(){
        setShowImage(true)
    }
    return (
        <>
        <Card sx={{height:200, maxHeight: "500px", width:"100%", maxWidth: "500px", display: "flex", flexDirection:"column"}}>
            <CardMedia component="img" sx={{
            height: "90%", 
            borderBottom: "5px solid", 
            borderColor: "primary.main", 
            cursor :"pointer",
            objectFit: "contain",
            width: "100%"
            }}
                image={props.image.img==="noPhoto"? NoPhoto :props.image.img}
                title={props.image.alt}
                onClick={handleImageOpen}>      
            </CardMedia>
            <CardContent sx={{bgcolor: "primary.main", display:"flex", alignItems: "center", justifyContent: "center", height: "10%"}}>
                <Typography variant="h6" color="primary.contrastText">
                    {props.image.alt}
                </Typography>
            </CardContent>
        </Card>
        <Dialog open={showImage} onClose={handleImageClose} scroll='paper'   
        PaperProps={{
            sx: { 
                width: "90vw", 
                maxWidth: "400px",
                margin: 0
            }
        }}>
            <DialogTitle>
                <Box sx={{display:"flex", justifyContent: "space-between"}}>
                    {props.image.alt}
                    <IconButton
                    color="inherit"
                    onClick={handleImageClose}
                    sx={{p:0}}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <img
                    src={props.image.img}
                    alt={props.image.alt}
                    style={{ width: '100%', height: 'auto' }}
                />
            </DialogContent>
        </Dialog>
        </>
    )
}

type IconMappingKeys = "en:vegan" | "en:non-vegan" | "en:palm-oil" | "en:palm-oil-free" | "en:vegetarian" | "en:non-vegetarian";

const iconMapping: Record<IconMappingKeys, JSX.Element> = {
    "en:vegan": <Typography variant='h6' color={"secondary.dark"}>Vegano</Typography>,
    "en:non-vegan": <Typography variant='h6' color={"warning.main"}>No vegano</Typography>,
    "en:palm-oil": <Typography variant='h6' color={"warning.main"}>Contiene aceite de palma</Typography>,
    "en:palm-oil-free": <Typography variant='h6' color={"secondary.dark"}>Sin aceite de palma</Typography>,
    "en:vegetarian":<Typography variant='h6' color={"secondary.dark"}>Vegetariano</Typography>,
    "en:non-vegetarian": <Typography variant='h6' color={"warning.main"}>No vegetariano</Typography> 
};

function Allergens(allergens:FoodHasAllergen[] | undefined){
    if (!allergens || allergens.length===0){
        return (
            <Paper elevation={0} sx={{p:2}}>
                <Typography variant='subtitle1' color= "primary.dark">
                Ningún alérgeno identificado
                </Typography>
            </Paper>
        )
    }
    let trueAllergens = allergens.filter(allergen => allergen.isAllergen)
    let traces = allergens.filter(allergen => allergen.isTrace)
    
    
    return (
        <Paper elevation={0}>
            <ul style={{ paddingLeft: 10 }}>
                {trueAllergens.map((trueAllergen, index) => {
                    return (
                        <Typography key={index} variant='subtitle1' color= "primary.dark">
                            <li> Contiene {trueAllergen.allergen.name || ""}</li>
                        </Typography>
                    )
                })}       
            </ul>
            <ul style={{ paddingLeft: 10 }}>
                {traces.map((trace, index) => {
                    return (
                        <Typography key={index} variant='subtitle1' color= "primary.dark">
                            <li> Puede contener {trace.allergen.name || ""}</li>
                        </Typography>
                    )
                })}       
            </ul>
        
        </Paper>
    )
}

function Additives(additives:FoodHasAdditive[]|undefined){
    if (!additives || additives.length == 0){
        return (
            <Paper elevation={0} sx={{p:2}}>
                <Typography variant='subtitle1' color= "primary.dark">
                    Ningún aditivo identificado
                </Typography>
            </Paper>
        )
    }
    
    return (
            <FoodAdditive additives={additives}/>
    )
}

function Ingredients(ingredients:string){
    if (!ingredients){
        return (
            <Typography color= "primary.dark" variant='subtitle1' textAlign={"center"} sx={{py:2}}>
                Lista de ingredientes no registrada
            </Typography>
        )
    }
    return (
        <Paper elevation={0} sx={{textAlign:"justify", pt: 1, pb: 1}}>
            <Typography variant='subtitle2'>
                {ingredients} 
            </Typography> 
        </Paper>
    )
}

function NutritionTable(nutritionValues:NutritionValues[]|undefined){
    if (!nutritionValues || nutritionValues.length == 0){
        return (
            <Paper elevation={0} sx={{p:2}}>
                <Typography variant='subtitle1'>
                Información nutricional no disponible
                </Typography>
                
            </Paper>
        )
    }
    return (<>

        <TableContainer component={Paper} sx={{ marginBottom: 2, width:"100%",borderRadius:0 }}>
            <Table aria-label="user stats table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{bgcolor: "primary.main",  padding: '2px 4px'}}>
                            <Typography variant="subtitle2" sx={{color: "primary.contrastText"}}>
                                Item
                            </Typography>
                        </TableCell>
                        <TableCell sx={{bgcolor: "primary.main",  padding: '2px 4px'}} align="right">
                            <Typography variant="subtitle2" sx={{color: "primary.contrastText"}}>
                                100g/100 ml
                            </Typography>
                        </TableCell>
                        <TableCell sx={{bgcolor: "primary.main",  padding: '2px 4px'}} align="right">
                            <Typography variant="subtitle2" sx={{color: "primary.contrastText"}}>
                                1 porción
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {nutritionValues.map((nutriment, index)=> (
                        <TableRow key={index} sx={{ height: 30,  bgcolor: index % 2 === 0 ? "transparent" : "secondary.light"  }}>
                        <TableCell key={nutriment.id} sx={{ padding: '4px 8px' }}>
                            <Typography variant='subtitle2'>
                                <strong>{nutriment.id}</strong>
                            </Typography>
                        </TableCell>
                        <TableCell key={nutriment.hundred} align="right" sx={{ padding: '4px 8px' }}>
                            <Typography variant="subtitle2">
                                <strong>{nutriment.hundred}</strong>
                            </Typography>
                        </TableCell>
                        <TableCell key={nutriment.serving} align="right" sx={{ padding: '4px 8px' }}>
                            <Typography variant="subtitle2">
                                <strong>{nutriment.serving}</strong>
                            </Typography>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    </>
    )
}

function Scores(scores:string[]){
    return (<>
            <Box sx={{
                display:"flex",
                flexDirection:"row",
                justifyContent: "space-around",
                paddingTop: 2,
                paddingBottom: 2,
            }}>
                {scores.map((score, i)=>{
                    return (
                        <Box
                            key={i}
                            component="img"
                            sx={{
                                height: "120px",
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

function UserFoodPrefs(allergens:FoodHasAllergen[]){
    const foodPrefs =  window.sessionStorage.getItem("food-prefs") || window.localStorage.getItem("food-prefs")
    let userFoodPrefs:string[] = []
    if (foodPrefs){
        userFoodPrefs = foodPrefs.split(",")
    }
    let trueAllergens = allergens.filter(allergen => allergen.isAllergen)
    let traces = allergens.filter(allergen => allergen.isTrace)
    if ((allergens.length===0)){
        return (<></>)
    }
    return (<>
            <Box sx={{
                display:"flex",
                flexDirection:"row",
                flexWrap: "wrap",
                justifyContent: "space-around",
                pt:1
            }}>
                {trueAllergens.map(allergen=>{
                    
                        if(userFoodPrefs.includes(allergen.allergenId)){
                            return (
                                <Box key={allergen.allergenId} sx={{
                                    display:"flex",
                                    flexDirection:"column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "50%",
                                    pb:1,
                                    gap:1
                                }}>
                                    <Box
                                        component="img"
                                        alt={allergen.allergenId}
                                        sx={{width:"50%"}}
                                        src={ImagesAllergens[allergen.allergenId]}
                                    />
                                    <Typography textAlign="center" variant='subtitle1' fontWeight="bold" color="error">
                                        Contiene {allergen.allergen.name.toLowerCase()}
                                    </Typography>
                                </Box>
                            )
                        }})}
            {traces.map(allergen=>{
                    
                    if(userFoodPrefs.includes(allergen.allergenId)){
                        return (
                            <Box key={allergen.allergenId} sx={{
                                display:"flex",
                                flexDirection:"column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "50%",
                                pb:1,
                                gap:1
                            }}>
                                <Box
                                    component="img"
                                    alt={allergen.allergenId}
                                    sx={{width:"50%"}}
                                    src={ImagesAllergens[allergen.allergenId]}
                                />
                                <Typography textAlign="center" variant='subtitle1' fontWeight="bold" color="warning.main">
                                    Puede contener {allergen.allergen.name.toLowerCase()}
                                </Typography>
                            </Box>
                        )
                    }})}
            </Box>
    </>
    )
}

function IngredientsAnalysis(ingredientsAnalysis:string[]) {
    return (<>
        <Box sx={{
            display:"flex",
            flexDirection:"column",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            pt:1
        }}>
            {ingredientsAnalysis.map((item, index)=>{
                if (!item.includes("unknown")){
                    return (
                        <Box key={index} sx={{
                            display:"flex",
                            flexDirection:"column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            pb:1,
                            gap:1
                        }}>
                            {iconMapping[item as IconMappingKeys]}
                        </Box>
                    )
                }
            })}
        </Box>
    </>
    )
}

function truncateToDecimalPlaces(num:number, decimalPlaces:number) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
}
      
const FoodProfile: React.FC<{ isAppBarVisible: boolean, onReady: ()=>void}> = ({ isAppBarVisible, onReady }) => {
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const currentUserId = window.sessionStorage.getItem("id") || window.localStorage.getItem("id")
    const [foodExternalSingle, setFoodExternalSingle] = useState<FoodLocal|null>(null)
    const [foodFullName, setFoodFullName] = useState<string>("")
    const [foodIngredientsAnalysis, setFoodIngredientsAnalysis] = useState<string[]>([])
    const [firstTime, setFirstTime] = useState("")
    const [imageArr, setImageArr] = useState([{img:"",alt:""}])
    const [nutritionRows, setNutritionRows] = useState<NutritionValues[]>()
    const [showQuickLookInfo, setShowQuickLookInfo] = useState(false)
    const [animation, setAnimation] = useState<string>("none")
    const [transform, setTransform] = useState<string>("translatex(5px)")
    const commentsRef = useRef<HTMLDivElement>(null);
    const [expandedComments, setExpandedComments] = useState(true);
    const textRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const foodRatingsURL = "/food/ratings"
    const foodURL = "/food/external"
    const queryParams = `?wr=true&u=${currentUserId}`
    const [allDone, setAllDone] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    const handleQuickLookClose = () => {
        setShowQuickLookInfo(!showQuickLookInfo)
    }

    useEffect(() => {
        let fullTextWidth = 0
        let fullContainerWidth = 0
        if (textRef.current) {
            fullTextWidth = textRef.current.scrollWidth;
            
        }
        if (containerRef.current) {
            fullContainerWidth = containerRef.current.clientWidth - 40;
            
        }
        if (fullTextWidth  !== 0 && fullContainerWidth !== 0){
            
            if (fullTextWidth > fullContainerWidth){
                setAnimation(`scroll-text ${Math.round((fullTextWidth / fullContainerWidth) * 7)}s linear infinite`)
                setTransform(`translateX(-${fullTextWidth - fullContainerWidth + 10 }px)`)
            }
        }
       
    }, [foodFullName, textRef.current, containerRef.current]);

    useEffect(()=>{
    },[animation,transform])

    useEffect(()=>{
        // if (!window.localStorage.reloaded){
        //     window.localStorage.setItem("reloaded", "yes")
        //     window.location.reload()
        // }
        // else {
        //     window.localStorage.removeItem("reloaded")
        // }
        api.get(`${foodURL}/${id}${queryParams}`, {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + token
             }
        })
        .then((response)=>{
            if(!response.data){
                return navigate("/food/" + id + "/edit")
                
            }
            else{
                let newUserRatesFood = {}
                if (response.data.userRatesFood.length>0){
                    newUserRatesFood = response.data.userRatesFood[0]
                    
                }
                else{
                    setFirstTime(response.data.id)
                     newUserRatesFood = {userId: currentUserId, foodLocalId: response.data.id, rating: "neutral"}
                }
                let food = {...response.data, userRatesFood: newUserRatesFood}
                console.log(response.data)
                setFoodExternalSingle(food)
                setFoodFullName(food.name)
                document.title = `${food.foodData.product_name} - EyesFood`
                let images = []
                if (food.foodData.selected_images){
                    food.foodData.selected_images.front?.display
                        ? images.push({img: food.foodData.selected_images.front.display.es
                                            || food.foodData.selected_images.front.display.en 
                                            || food.foodData.selected_images.front.display.fr 
                                            || "noPhoto", alt:"Principal"}) 
                        : images.push({img:"noPhoto", alt:"Principal"})
                    food.foodData.selected_images.nutrition?.display
                        ? images.push({img: food.foodData.selected_images.nutrition.display.es
                                            || food.foodData.selected_images.nutrition.display.en 
                                            || food.foodData.selected_images.nutrition.display.fr
                                            || "noPhoto", alt:"Nutrición"}) 
                        : images.push({img:"noPhoto", alt:"Nutrición"})
                    // food.foodData.selected_images.packaging?.display
                    //     ? images.push({img: food.foodData.selected_images.packaging.display.es
                    //         || food.foodData.selected_images.packaging.display.en 
                    //         || food.foodData.selected_images.packaging.display.fr
                    //         || "noPhoto", alt:"Envasado"}) 
                    //     : images.push({img:"noPhoto", alt:"Envasado"})
                    food.foodData.selected_images.ingredients?.display
                        ? images.push({img: food.foodData.selected_images.ingredients.display.es
                            || food.foodData.selected_images.ingredients.display.en 
                            || food.foodData.selected_images.ingredients.display.fr
                            || "noPhoto", alt:"Ingredientes"}) 
                        : images.push({img:"noPhoto", alt:"Ingredientes"})
                }
                else{
                    images.push({img:"noPhoto", alt:"Principal"})
                    images.push({img:"noPhoto", alt:"Envasado"})
                    images.push({img:"noPhoto", alt:"Nutrición"})
                    images.push({img:"noPhoto", alt:"Ingredientes"})
                }

                let ingredientsAnalysis = food.foodData.ingredients_analysis_tags
                if (ingredientsAnalysis){
                   setFoodIngredientsAnalysis(ingredientsAnalysis)
                }
                else{
                    setFoodIngredientsAnalysis(["palm-oil-content-unknown", "vegan-status-unknown", "vegetarian-status-unknown"])
                }
                
                setImageArr(images)

                const { nutriments } = food.foodData;
                const nutrition:NutritionValues[] = []
                const pushNutrition = (id:string, hundred:any, serving:any) => {
                    nutrition.push({
                        id,
                        hundred: hundred !== undefined ? hundred : "",
                        serving: serving !== undefined ? serving : ""
                    });
                };


                if (nutriments.hasOwnProperty("energy-kcal_100g")) {
                    pushNutrition(
                        "Energía (kcal)",
                        nutriments["energy-kcal_100g"].toFixed(1),
                        nutriments["energy-kcal_serving"]?.toFixed(1) 
                    );
                }


                if (nutriments.hasOwnProperty("proteins_100g")) {
                    pushNutrition(
                        `Proteínas (${nutriments.proteins_unit})`,
                        nutriments.proteins_100g.toFixed(1),
                        nutriments.proteins_serving?.toFixed(1)
                    );
                }


                if (nutriments.hasOwnProperty("fat_100g")) {
                    pushNutrition(
                        `Grasas Totales (${nutriments.fat_unit})`,
                        nutriments.fat_100g.toFixed(1),
                        nutriments.fat_serving?.toFixed(1) 
                    );
                }


                if (nutriments.hasOwnProperty("saturated-fat_100g")) {
                    pushNutrition(
                        `G. Saturadas (${nutriments["saturated-fat_unit"]})`,
                        nutriments["saturated-fat_100g"].toFixed(1),
                        nutriments["saturated-fat_serving"]?.toFixed(1)
                    );
                }


                if (nutriments.hasOwnProperty("monounsaturated-fat_100g")) {
                    pushNutrition(
                        `G. Monoinsat. (${nutriments["monounsaturated-fat_unit"]})`,
                        nutriments["monounsaturated-fat_100g"].toFixed(1),
                        nutriments["monounsaturated-fat_serving"]?.toFixed(1) 
                    );
                }


                if (nutriments.hasOwnProperty("polyunsaturated-fat_100g")) {
                    pushNutrition(
                        `G. Poliinsat. (${nutriments["polyunsaturated-fat_unit"]})`,
                        nutriments["polyunsaturated-fat_100g"].toFixed(1),
                        nutriments["polyunsaturated-fat_serving"]?.toFixed(1)
                    );
                }


                if (nutriments.hasOwnProperty("trans-fat_100g")) {
                    pushNutrition(
                        `G. Trans (${nutriments["trans-fat_unit"]})`,
                        nutriments["trans-fat_100g"].toFixed(1),
                        nutriments["trans-fat_serving"]?.toFixed(1)
                    );
                }


                if (nutriments.hasOwnProperty("cholesterol_value")) {
                    let cholesterol_value =  truncateToDecimalPlaces(nutriments["cholesterol_100g"], 1)
                    let cholesterol_serving = truncateToDecimalPlaces(nutriments["cholesterol_serving"], 1)
                    if (nutriments["cholesterol_unit"]==="mg"){
                        cholesterol_value = truncateToDecimalPlaces(nutriments["cholesterol_100g"] * 1000, 1)
                        cholesterol_serving = truncateToDecimalPlaces(nutriments["cholesterol_serving"] * 1000, 1)
                    }
                    pushNutrition(
                        `Colesterol (${nutriments["cholesterol_unit"]})`,
                        cholesterol_value,
                        cholesterol_serving || ""
                    );
                }


                if (nutriments.hasOwnProperty("carbohydrates_100g")) {
                    pushNutrition(
                        `H. de C. Disp. (${nutriments["carbohydrates_unit"]})`,
                        nutriments["carbohydrates_100g"].toFixed(1),
                        nutriments["carbohydrates_serving"]?.toFixed(1) 
                    );
                }


                if (nutriments.hasOwnProperty("sugars_100g")) {
                    pushNutrition(
                        `Azúcares totales (${nutriments["sugars_unit"]})`,
                        nutriments["sugars_100g"].toFixed(1),
                        nutriments["sugars_serving"]?.toFixed(1) 
                    );
                }


                if (nutriments.hasOwnProperty("sodium_100g")) {
                    let sodium_value =  truncateToDecimalPlaces(nutriments["sodium_100g"], 1)
                    let sodium_serving = truncateToDecimalPlaces(nutriments["sodium_serving"], 1)
                    if (nutriments["sodium_unit"]==="mg"){
                        sodium_value = truncateToDecimalPlaces(nutriments["sodium_100g"] * 1000, 1)
                        sodium_serving = truncateToDecimalPlaces(nutriments["sodium_serving"] * 1000, 1)
                    }
                    pushNutrition(
                        `Sodio (${nutriments["sodium_unit"]})`,
                        sodium_value,
                        sodium_serving || ""
                    );
                }
                setNutritionRows(nutrition)

            }
            
        })
        .catch(error => {
            if (error.response.status === 404){
                return navigate("/food/" + id + "/edit?n=true")
            }
            else if (error.response.status>=500){
                console.log("OpenFoodFacts está caído probablemente")
            }
        })
        .finally(()=>{
            setAllDone(true)
            onReady()
        })
    },[])      

    useEffect(()=>{
        if (firstTime!=""){
            let neutralRating = {foodLocalId:firstTime, userId:currentUserId, rating:"neutral"}
            api.post(`${foodRatingsURL}`, 
                neutralRating, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then(res => {
            })
            .catch(error => {
                console.log(error)
            })
        }
        
    }, [firstTime])

    const onRatingChange = (food: FoodLocal, newRating : UserRatesFood) => {
        let newLikes = food.likes
        let newDislikes = food.dislikes
        
        if (newRating.rating==="likes") {
            newLikes = food.userRatesFood?.rating==="neutral"
                            ?food.likes+1
                            :food.userRatesFood?.rating==="dislikes"
                                ?food.likes+1
                                :food.likes-1

            newDislikes = food.userRatesFood?.rating==="dislikes"
                                ?food.dislikes-1
                                :food.dislikes
        }
        else if (newRating.rating === "dislikes"){
            newLikes = food.userRatesFood?.rating==="likes"
                            ?food.likes-1
                            :food.likes

            newDislikes = food.userRatesFood?.rating==="neutral"
                            ?food.dislikes+1:
                            food.userRatesFood?.rating==="likes"
                                ?food.dislikes+1
                                :food.dislikes-1
        }

        else if (newRating.rating === "neutral"){
            newDislikes = food.userRatesFood?.rating==="dislikes"
                            ?food.dislikes-1
                            :food.dislikes
            newLikes = food.userRatesFood?.rating==="likes"
                            ?food.likes-1
                            :food.likes
        }
        
        
        let newFood = {...food, userRatesFood: newRating, likes: newLikes, dislikes: newDislikes}
        setFoodExternalSingle(newFood)
    }

    const handleScrollToComments = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: 'smooth' });
            setExpandedComments(true); // Expand the comments
        }
    };

    return ( allDone?
        <>
            <Grid container 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center" 
                sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}
            >   
                {!!foodExternalSingle && foodFullName!== "" &&
                <Box 
                ref={containerRef}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: 'sticky',
                    top: isAppBarVisible?"50px":"0px",
                    width:"100%",
                    transition: "top 0.3s",
                    backgroundColor: 'primary.dark', // Ensure visibility over content
                    zIndex: 100,
                    boxShadow: 3,
                    overflow: "hidden", 
                    borderBottom: "5px solid",
                    borderLeft: "5px solid",
                    borderRight: "5px solid",
                    borderColor: "secondary.main",
                    boxSizing: "border-box",
                    color: "primary.contrastText"
                  }}
                >
                    <Box sx={{display: "flex", alignItems: "flex-start", width:"100%"}}>
                        <NavigateBack/>
                        <Box
                        sx={{
                            width: "100%", 
                            overflow: "hidden", // Hide overflowed content
                            whiteSpace: "nowrap", // Prevent text wrapping
                            position: "relative", // For positioning animation
                        }}
                        >
                            <Typography variant='h6' 
                                ref={textRef}
                                width="100%" 
                                sx={{pt:1, 
                                    color: "primary.contrastText",
                                    display:"inline-block", 
                                    whiteSpace: "nowrap", 
                                    animation: animation,
                                        '@keyframes scroll-text': {
                                            "0%": {
                                                transform: `translateX(10px)`,
                                            },
                                            "25%": {
                                                transform: `translateX(10px)`, 
                                            },
                                            "50%": {
                                                transform: transform,
                                            },
                                            "75%": {
                                                transform: transform, 
                                            },
                                            "100%": {
                                                transform: `translateX(10px)`, 
                                            },
                                        },   
                                }}>
                                    {foodFullName}
                            </Typography>
                        </Box>   
                    </Box>
                    
                    <Box 
                    sx={{
                    display: "flex", 
                    flexDirection: "row", 
                    width: "95%", 
                    justifyContent: "space-between",
                    alignItems: "center"}}>

                        <FoodRate food={foodExternalSingle} onRatingChange={onRatingChange} ></FoodRate>
                        <FoodCommentsCount id={id || ""} onClick={handleScrollToComments} noneColor='grey' someColor='#c9c9c9'/>
                        <Button variant='text' onClick={()=>navigate("edit")} 
                        sx={{
                            padding:0.2, 
                            color: "warning.main", 
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            height: "100%"
                        }}>
                            <EditIcon sx={{color: 'warning.main', fontSize: {sm: 25, xs: 20}}}/>
                            <Typography 
                            variant='subtitle1' 
                            color="warning.main" 
                            fontSize={14}
                            textAlign={"justify"}
                            sx={{textDecoration: "underline"}}>
                                Editar
                            </Typography>
                        </Button>
                    </Box>
                    
                </Box>}
                <Box sx={{
                        width:"90%",
                        display: "flex",
                        flexDirection: "column",
                }}> 
                    <Carousel 
                    navButtonsAlwaysVisible={true}
                    navButtonsProps={{          // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
                        style: {
                            backgroundColor: '#22323f',
                        }
                    }} 
                    NextIcon={<ArrowForwardIcon fontSize='small' sx={{color: "secondary.main"}}/>}
                    PrevIcon={<ArrowBackIcon fontSize='small' sx={{color: "secondary.main"}}/>}
                    navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
                        style: {
                            bottom: '0',
                            top: 'unset'
                        }
                    }} 
                    
                    >
                        {
                            imageArr.map((image, i) => <div key={i}><ImageDisplay  image={image}/></div>)
                        }
                    </Carousel>
                </Box>
                
                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        display:"flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        width:"100%",
                    }}>
                        <Box
                            component="img"
                            sx={{
                                height: "30px",
                                pl: 1
                            }}
                            alt="QuickLook"
                            src={QuickLookLogo}
                        />
                        <IconButton onClick={function () {setShowQuickLookInfo(true)}}>
                            <InfoOutlinedIcon sx={{color: "secondary.main", fontSize: 30}}></InfoOutlinedIcon>
                        </IconButton>
                    </Paper>
                    
                    {Scores([   "eco_score_" + foodExternalSingle?.foodData?.ecoscore_grade, 
                                "nutri_score_" + foodExternalSingle?.foodData?.nutriscore_grade,
                                "nova_score_" + foodExternalSingle?.foodData?.nova_group as string
                            ])}
                    <Divider/>
                    {UserFoodPrefs(foodExternalSingle?.foodHasAllergen || [])}
                    <Divider/>
                    {IngredientsAnalysis(foodIngredientsAnalysis)}
                </Box>
                
                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10,
                        pb:"5px"
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Información general
                        </Typography>
                    </Paper>
                    <Paper elevation={0}>
                    <ul style={{ paddingLeft: 10 }}>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Nombre: </span>{foodExternalSingle?.foodData?.product_name}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Cantidad: </span>{foodExternalSingle?.foodData?.quantity || "Desconocida"}</li>
                        </Typography>  
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Marca: </span>{foodExternalSingle?.foodData?.brands || "Desconocida"}</li>
                        </Typography>
                        <Typography variant='subtitle1' color= "primary.dark">
                            <li><span style={{fontWeight: "bold"}}>Código: </span>{foodExternalSingle?.foodData?.id || "Desconocido"}</li>
                        </Typography>
                    </ul>
                    </Paper>
                    
                </Box>

                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb:"5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Alérgenos
                        </Typography>
                    </Paper>
                    {Allergens(foodExternalSingle?.foodHasAllergen)}
                </Box>

                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb:"5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Aditivos
                        </Typography>
                    </Paper>
                    {Additives(foodExternalSingle?.foodHasAdditive)}
                </Box>

                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width:"90%"
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb:"5px",
                        width: "100%",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                         <Typography variant='h6' color= "primary.contrastText">
                        Ingredientes
                        </Typography>
                    </Paper>
                    <Box sx={{
                            width:"95%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                    }}>
                        {Ingredients(foodExternalSingle?.foodData?.ingredients_text as string)}
                    </Box>
                    
                </Box>

                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <Paper elevation={0} square={true} sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        pb:"5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        <Typography variant='h6' color= "primary.contrastText">
                        Información nutricional
                        </Typography>
                    </Paper>
                    <Box sx={{
                        display:"flex",
                        flexDirection:"column",
                        alignItems: "start",
                        pt: 1, 
                        pb: 1
                    }}>
                        <Typography variant='subtitle1' sx={{textIndent: 10}}>Porción: {foodExternalSingle?.foodData?.serving_size}</Typography>
                       
                    </Box>
                    {NutritionTable(nutritionRows)}
                </Box>
                
                <Box
                ref={commentsRef}
                sx={{
                    display: "flex",
                    width:"90%",
                }}
                > 
                    <FoodComments expanded={expandedComments} toggleExpand={() => setExpandedComments(!expandedComments)}></FoodComments>
                </Box>

                <Button variant="text" onClick={()=>navigate("history")} sx={{mb:8}}>
                    <HistoryIcon/>
                    <Typography variant='subtitle2' sx={{textDecoration: "underline"}}>
                        Ver historial de ediciones
                    </Typography>
                </Button>
                    <Dialog open={showQuickLookInfo} onClose={handleQuickLookClose} scroll='paper' 
                    sx={{width: "100vw", 
                        maxWidth: "500px", 
                        margin: "auto"
                    }}>
                        <DialogTitle textAlign="left">
                            QuickLook
                        </DialogTitle>
                        <DialogContent sx={{ display:"flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap:2}}>
                            <DialogContentText>
                                <Typography fontSize={15} fontWeight="bold">
                                    Eco-Score
                                </Typography>
                            </DialogContentText>
                            <DialogContentText fontSize={13} textAlign="justify" fontFamily="Montserrat">
                                Eco-Score clasifica los productos alimenticios de A (bajo) a E (alto) según su impacto en el medio ambiente.
                            </DialogContentText>
                            <Button variant="contained"
                                    component="a"
                                    href="https://blog.openfoodfacts.org/es/news/lanzamiento-del-eco-score-el-puntaje-ambiental-para-productos-alimenticios"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{textTransform: "none",
                                        display: "inline-flex",
                                        gap: 1

                                    }}>
                                        <LaunchRoundedIcon sx={{fontSize: 20}}></LaunchRoundedIcon>
                                    Más información 
                                    
                            </Button>
                            <DialogContentText>
                                <Typography fontSize={15} fontWeight="bold">
                                    Nutri-Score
                                </Typography>
                            </DialogContentText>
                            <DialogContentText fontSize={13} textAlign="justify" fontFamily="Montserrat">
                            Nutriscore actúa como un semáforo nutricional: es un sistema de clasificación de 5 letras y colores, en el que 
                            la A de color verde oscuro es la opción más saludable y la E roja la peor, pasando por la B, C y D.
                            </DialogContentText>
                            <Button variant="contained"
                                    component="a"
                                    href="https://www.ocu.org/alimentacion/comer-bien/informe/nutriscore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{textTransform: "none",
                                        display: "inline-flex",
                                        gap: 1

                                    }}>
                                        <LaunchRoundedIcon sx={{fontSize: 20}}></LaunchRoundedIcon>
                                    Más información 
                                    
                            </Button>
                            <DialogContentText>
                                <Typography fontSize={15} fontWeight="bold">
                                    Nova-Score
                                </Typography>
                            </DialogContentText>
                            <DialogContentText fontSize={13} textAlign="justify" fontFamily="Montserrat">
                                Nova-Score es un marco para agrupar sustancias comestibles en función del grado y el propósito del 
                                procesamiento de alimentos que se les aplica. Nova clasifica los alimentos en cuatro grupos:
                                <ol>
                                    <li>Alimentos no procesados ​o mínimamente procesados</li> 
                                    <li>Ingredientes culinarios procesados</li>
                                    <li>Alimentos procesados</li>
                                    <li>Alimentos ultraprocesados</li>
                                </ol>

                            </DialogContentText>
                            <Button variant="contained"
                                    component="a"
                                    href="https://es.openfoodfacts.org/nova"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{textTransform: "none",
                                        display: "inline-flex",
                                        gap: 1

                                    }}>
                                    <LaunchRoundedIcon sx={{fontSize: 20}}></LaunchRoundedIcon>
                                    Más información 
                                    
                            </Button>
                        </DialogContent>
                        <DialogActions>
                            <Button sx={{
                                color: "primary.contrastText", 
                                bgcolor: "primary.main", 
                                "&:hover": {
                                    color: "secondary.contrastText", 
                                    bgcolor: "secondary.main", 
                                }
                            }} 
                            onClick={handleQuickLookClose}>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
    
                {/* <Button variant='contained'
                    sx={{
                    height: "40px",
                    borderRadius: "25px",
                    border: "3px solid",
                    borderColor: "primary.main",
                    bgcolor:"primary.main",
                    margin: 5,
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: "fontWeightMedium",
                    "&:hover":{
                        border: "3px solid",
                        bordercolor: "primary.contrastText",
                        bgcolor: "primary.main"
                    }
                    }}>COMENTARIOS
                </Button> */}
                
            </Grid>
            
        </>
        :null
    )
};

export default FoodProfile;