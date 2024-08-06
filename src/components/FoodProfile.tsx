import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FoodLocal } from '../interfaces/foodLocal';
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Card, CardMedia, CardContent, Grid, Typography, Backdrop, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@mui/material';
import { FoodExternal } from '../interfaces/foodExternal';
import Carousel from 'react-material-ui-carousel';
import NoPhoto from "../../public/no-photo.png"
import "./Components.css"
import { GridColDef, DataGrid } from '@mui/x-data-grid';
import ImagesScores from '../images/ImagesScores';
import ImagesAllergens from '../images/ImagesAllergens';
import QuickLookLogo from "../../public/QuickLookLogo.png"
import FoodLike from './FoodLike';
import FoodComments from './FoodComments';
import FoodAdditive from './FoodAdditive';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

type NutritionValues = {
    id: string,
    hundred: any,
    serving: any
}

function Item(props:any)
{
    return (
        <Card sx={{border: "5px solid", borderColor: "primary.main", height:250}}>
            <CardMedia sx={{height: 200, borderBottom: "5px solid", borderColor: "primary.main"}}
                image={props.item.img}
                title={props.item.alt}>      
            </CardMedia>
            <CardContent>
                <Typography variant="body2" color="primary.dark">
                    {props.item.alt}
                </Typography>
            </CardContent>
        </Card>
    )
}

const allergensEngSpa: {[key: string]: string} = {
    "en:gluten": "Gluten",
    "en:eggs": "Huevos",
    "en:milk": "Leche",
    "en:nuts": "Frutos secos",
    "en:peanuts": "Maní",
    "en:sesame_seeds": "Sésamo",
    "en:soybeans": "Soya",
    "en:celery": "Apio",
    "en:mustard": "Mostaza",
    "en:lupin": "Altramuces",
    "en:fish": "Pescado",
    "en:crustaceans": "Crustáceos",
    "en:molluscs": "Moluscos",
    "en:sulphur-dioxide-and-sulphites": "Anhídrico sulfuroso"
}

function Allergens(allergens:string[], traces:string[]){
    console.log(traces)
    if ((!allergens || allergens.length == 0 || allergens.includes("en:none")) && (!traces || traces.length == 0)){
        return (
            <Paper elevation={0} sx={{p:2}}>
                Ningún alérgeno identificado
            </Paper>
        )
    }
    
    return (
        <Paper elevation={0} sx={{textIndent: 10}}>
            <ul>
                {allergens.map(eng => {
                    return (
                        <li> {allergensEngSpa[eng]}</li>
                    )
                })}       
            </ul>
            <ul>
                {traces.map(eng => {
                    return (
                        <li> Puede contener {allergensEngSpa[eng]}</li>
                    )
                })}       
            </ul>
        
        </Paper>
    )
}

function Additives(additives:string[]){
    if (!additives || additives.length == 0){
        return (
            <Paper elevation={0} sx={{p:2}}>
                Ningún aditivo identificado
            </Paper>
        )
    }
    
    return (
        <Paper elevation={0} sx={{textIndent: 10}}>
            <ul>
                {additives.map(data => {
                        return (
                                <FoodAdditive name = {data.split(",")[0]} wikidata={data.split(",")[1]}/>
                        )
                })} 
            </ul>
        </Paper>
    )
}

function Ingredients(ingredients:string){
    if (!ingredients){
        return (
            <Paper elevation={0} sx={{p:2}}>
                Lista de ingredientes no registrada
            </Paper>
        )
    }
    return (
        <Paper elevation={0} sx={{textAlign:"justify", pt: 1, pb: 1}}>
            {ingredients}  
        </Paper>
    )
}

function NutritionTable(nutritionValues:NutritionValues[]|undefined){
    if (!nutritionValues || nutritionValues.length == 0){
        return (
            <Paper elevation={0} sx={{p:2}}>
                Información nutricional no disponible
            </Paper>
        )
    }
    return (<>

        <Box sx={{
            display:"flex",
            flexDirection:"row",
            justifyContent: "space-around",
            pb: 1
        }}>
            <Box sx={{
                display:"flex",
                flexDirection:"column",
                alignItems: "start"
            }}>
                <span>&nbsp;&nbsp;</span>
                {nutritionValues.map(row => {
                    return (
                        <Typography fontWeight="bold" fontSize={12}>{row.id}</Typography>
                    )
                })}
            </Box>
            <Box sx={{
                display:"flex",
                flexDirection:"column",
                alignItems: "end"
            }}>
                <Typography fontWeight="bold">100 g</Typography>
                {nutritionValues.map(row => {
                    return (
                        <Typography fontSize={12}>{row.hundred}</Typography>
                    )
                })}
            </Box>
            <Box sx={{
                display:"flex",
                flexDirection:"column",
                alignItems: "end"
            }}>
                <Typography fontWeight="bold">1 porción</Typography>
                {nutritionValues.map(row => {
                    return (
                        <Typography fontSize={12}>{row.serving}</Typography>
                    )
                })}
            </Box>
        </Box>

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
                {scores.map(score=>{
                    return (
                        <Box
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

function UserFoodPrefs(foodAllergens:string[], foodTraces: string[]){
    const userFoodPrefs:string[] = window.localStorage["food-prefs"].split(",")
    console.log(foodTraces)
    if ((!foodAllergens || foodAllergens.length == 0 || foodAllergens.includes("en:none")) && (!foodTraces || foodTraces.length == 0)){
        return (<></>)
    }
    return (<>
            <Box sx={{
                display:"flex",
                flexDirection:"row",
                flexWrap: "wrap",
                justifyContent: "space-around",
            }}>
                {userFoodPrefs.map(allergen=>{
                    
                        if(foodAllergens && foodAllergens.includes(allergen)){
                            return (
                                <Box sx={{
                                    display:"flex",
                                    flexDirection:"column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "30%",
                                    pb:1
                                }}>
                                    <Box
                                        component="img"
                                        alt={allergen}
                                        sx={{width:"80%"}}
                                        src={ImagesAllergens[allergen]}
                                    />
                                    <Typography textAlign="center" fontSize={12} fontWeight="bold">Contiene {allergensEngSpa[allergen].toLowerCase()}</Typography>
                                </Box>
                            )
                        }
                        else if(foodTraces && foodTraces.includes(allergen)){
                            return (
                                <Box sx={{
                                    display:"flex",
                                    flexDirection:"column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "30%",
                                    pb:1
                                }}>
                                    <Box
                                        component="img"
                                        alt={allergen}
                                        sx={{width: "80%"}}
                                        src={ImagesAllergens[allergen]}
                                    />
                                    <Typography textAlign="center" fontSize={12} fontWeight="bold">Puede contener {allergensEngSpa[allergen].toLowerCase()}</Typography>
                                </Box>
                            )
                        }
                })}
            </Box>
    </>
    )
}
      
const FoodProfile: React.FC = () => {
    const [foodExternalSingle, setFoodExternalSingle] = useState<FoodExternal>({id:"", allergens_tags:[]})
    const [foodFullName, setFoodFullName] = useState<string>("")
    const [imageArr, setImageArr] = useState([{img:"",alt:""}])
    const [nutritionRows, setNutritionRows] = useState<NutritionValues[]>()
    const [showQuickLookInfo, setShowQuickLookInfo] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    const handleQuickLookClose = () => {
        setShowQuickLookInfo(!showQuickLookInfo)
    }

    useEffect(()=>{
        const url = "http://192.168.100.6:8080/foodexternal/" + id

        axios.get(url, {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + window.localStorage.token
             }
        })
        .then((response)=>{
            console.log(response.data)
            if(!response.data){
                console.log("no hay")
                // return navigate("/food/" + id + "/edit")
                
            }
            else{
                setFoodExternalSingle(response.data.product)
                let foodName = ""
                if(response.data.product.product_name){
                    foodName = response.data.product.product_name
                }
                if(response.data.product.brands){
                    foodName = foodName + " - " + response.data.product.brands.split(",")[0]
                }
                if (response.data.product.quantity){
                    foodName = foodName + " - " + response.data.product.quantity
                }
                setFoodFullName(foodName)
                let images = []
                response.data.product.image_url 
                    ? images.push({img:response.data.product.image_url, alt:"Principal"}) 
                    : images.push({img:NoPhoto, alt:"Principal"})
                response.data.product.image_nutrition_url 
                    ? images.push({img:response.data.product.image_nutrition_url, alt:"Nutrición"}) 
                    : images.push({img:NoPhoto, alt:"Nutrición"})
                response.data.product.image_packaging_url 
                    ? images.push({img:response.data.product.image_packaging_url, alt:"Empaquetado"}) 
                    : images.push({img:NoPhoto, alt:"Empaquetado"})
                response.data.product.image_ingredients_url 
                    ? images.push({img:response.data.product.image_ingredients_url, alt:"Ingredientes"}) 
                    : images.push({img:NoPhoto, alt:"Ingredientes"})
                setImageArr(images)

                const nutrition = []
                response.data.product.nutriments["energy-kcal_100g"]
                    ? nutrition.push({  id: "Energía (kcal)", 
                                        hundred: response.data.product.nutriments["energy-kcal_100g"],
                                        serving: response.data.product.nutriments["energy-kcal_serving"]?response.data.product.nutriments["energy-kcal_serving"]:""})
                    :null
                response.data.product.nutriments.proteins_100g
                    ? nutrition.push({  id: "Proteínas (" +  response.data.product.nutriments.proteins_unit + ")", 
                                        hundred: response.data.product.nutriments.proteins_100g,
                                        serving: response.data.product.nutriments.proteins_serving?response.data.product.nutriments.proteins_serving:""})
                    :null
                response.data.product.nutriments.fat_100g
                    ? nutrition.push({  id: "Grasas Totales (" +  response.data.product.nutriments.fat_unit + ")", 
                                        hundred: response.data.product.nutriments.fat_100g,
                                        serving: response.data.product.nutriments.fat_serving?response.data.product.nutriments.fat_serving:""})
                    :null
                response.data.product.nutriments["saturated-fat_100g"]
                    ? nutrition.push({  id: "  G. Saturadas (" +  response.data.product.nutriments["saturated-fat_unit"] + ")", 
                                        hundred: response.data.product.nutriments["saturated-fat_100g"],
                                        serving: response.data.product.nutriments["saturated-fat_serving"]?response.data.product.nutriments["saturated-fat_serving"]:""})
                    :null
                response.data.product.nutriments["monounsaturated-fat_100g"]
                    ? nutrition.push({  id: "  G. Monoinsat. (" +  response.data.product.nutriments["monounsaturated-fat_unit"] + ")", 
                                        hundred: response.data.product.nutriments["monounsaturated-fat_100g"],
                                        serving: response.data.product.nutriments["monounsaturated-fat_serving"]?response.data.product.nutriments["monounsaturated-fat_serving"]:""})
                    :null
                response.data.product.nutriments["polyunsaturated-fat_100g"]
                    ? nutrition.push({  id: "  G. Poliinsat. (" +  response.data.product.nutriments["polyunsaturated-fat_unit"] + ")", 
                                        hundred: response.data.product.nutriments["polyunsaturated-fat_100g"],
                                        serving: response.data.product.nutriments["polyunsaturated-fat_serving"]?response.data.product.nutriments["polyunsaturated-fat_serving"]:""})
                    :null
                response.data.product.nutriments["trans-fat_100g"]
                    ? nutrition.push({  id: "  G. Trans (" +  response.data.product.nutriments["trans-fat_unit"] + ")", 
                                        hundred: response.data.product.nutriments["trans-fat_100g"],
                                        serving: response.data.product.nutriments["trans-fat_serving"]?response.data.product.nutriments["trans-fat_serving"]:""})
                    :null
                response.data.product.nutriments["cholesterol_100g"]
                    ? nutrition.push({  id: "Colesterol (" +  response.data.product.nutriments["cholesterol_unit"] + ")", 
                                        hundred: response.data.product.nutriments["cholesterol_100g"],
                                        serving: response.data.product.nutriments["cholesterol_serving"]?response.data.product.nutriments["cholesterol_serving"]:""})
                    :null
                response.data.product.nutriments["carbohydrates_100g"]
                    ? nutrition.push({  id: "H. de  C. Disp. (" +  response.data.product.nutriments["carbohydrates_unit"] + ")", 
                                        hundred: response.data.product.nutriments["carbohydrates_100g"],
                                        serving: response.data.product.nutriments["carbohydrates_serving"]?response.data.product.nutriments["carbohydrates_serving"]:""})
                    :null
                response.data.product.nutriments["sugars_100g"]
                    ? nutrition.push({  id: "  Azúcares totales (" +  response.data.product.nutriments["sugars_unit"] + ")", 
                                        hundred: response.data.product.nutriments["sugars_100g"],
                                        serving: response.data.product.nutriments["sugars_serving"]?response.data.product.nutriments["sugars_serving"]:""})
                    :null
                response.data.product.nutriments["salt_100g"]
                    ? nutrition.push({  id: "Sodio (" +  response.data.product.nutriments["salt_unit"] + ")", 
                                        hundred: response.data.product.nutriments["salt_100g"],
                                        serving: response.data.product.nutriments["salt_serving"]?response.data.product.nutriments["salt_serving"]:""})
                    :null
                setNutritionRows(nutrition)
            }
            
        })
    },[id])      

    return ( 
        <>
            {foodExternalSingle ? 
            <Grid container display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{width: "100vw", maxWidth:"500px", gap:"10px"}}>
                <h2>{foodFullName}</h2>
                <Box sx={{
                        width:"95%",
                }}> 
                    <Carousel navButtonsAlwaysVisible={true}>
                        {
                            imageArr.map((image, i) => <Item key={i} item={image}/>)
                        }
                    </Carousel>
                </Box>
                <FoodLike></FoodLike>
                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space_around",
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
                                height: "40px",
                                pl: 1
                            }}
                            alt="QuickLook"
                            src={QuickLookLogo}
                        />
                        <IconButton onClick={function () {setShowQuickLookInfo(true)}}>
                            <InfoOutlinedIcon sx={{color: "secondary.main", fontSize: 30}}></InfoOutlinedIcon>
                        </IconButton>
                    </Paper>
                    
                    {Scores([   "eco_score_" + foodExternalSingle.ecoscore_grade, 
                                "nutri_score_" + foodExternalSingle.nutriscore_grade,
                                "nova_score_" + foodExternalSingle.nova_group as string
                            ])}
                    {UserFoodPrefs(foodExternalSingle.allergens_tags as string[], foodExternalSingle.traces_tags as string[])}
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
                        py: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        Información general
                    </Paper>
                    <Paper elevation={0} sx={{textIndent: 10 }}>
                    <ul>
                        <li>Nombre: {foodExternalSingle.product_name}</li>
                        <li>Cantidad: {foodExternalSingle.quantity?foodExternalSingle.quantity:"Desconocida"}</li>
                        <li>Marca: {foodExternalSingle.brands?foodExternalSingle.brands:"Desconocida"}</li>
                        <li>Código: {foodExternalSingle.id?foodExternalSingle.id:"Desconocido"}</li>
                        
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
                        py: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        Alérgenos
                    </Paper>
                    {Allergens(foodExternalSingle.allergens_tags as string[], foodExternalSingle.traces_tags as string[])}
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
                        py: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        Aditivos
                    </Paper>
                    {Additives(foodExternalSingle.additives as string[])}
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
                        py: "5px",
                        width: "100%",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        Ingredientes
                    </Paper>
                    <Box sx={{
                            width:"95%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                    }}>
                        {Ingredients(foodExternalSingle.ingredients_text as string)}
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
                        py: "5px",
                        justifyContent: "flex-start",
                        display: "flex",
                        textIndent: 10
                    }}>
                        Información nutricional
                    </Paper>
                    <Box sx={{
                        display:"flex",
                        flexDirection:"column",
                        alignItems: "start",
                        pt: 1, 
                        pb: 1
                    }}>
                        <Typography sx={{textIndent: 10}}>Porción: {foodExternalSingle.serving_size}</Typography>
                        <Typography sx={{textIndent: 10}}>Porciones por envase: {foodExternalSingle.serving_quantity}</Typography>
                    </Box>
                    {NutritionTable(nutritionRows)}
                </Box>
                <Box
                sx={{
                    border: "5px solid",
                    borderColor: "primary.main",
                    width:"90%",
                }}
                > 
                    <FoodComments></FoodComments>
                </Box>
                <Backdrop open={showQuickLookInfo} onClick={handleQuickLookClose} sx={{width: "100%"}}>
                    <Dialog open={showQuickLookInfo} onClose={handleQuickLookClose} scroll='paper' 
                    sx={{width: "100%", 
                        maxWidth: "500px", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <DialogTitle>
                            Scores
                        </DialogTitle>
                        <DialogContent sx={{ display:"flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap:2}}>
                            <DialogContentText>
                                <Typography fontSize={15} fontWeight="bold">
                                    Eco-Score
                                </Typography>
                            </DialogContentText>
                            <DialogContentText fontSize={13} textAlign="justify">
                                Eco-Score clasifica los productos alimenticios de A (bajo) a E (alto) según su impacto en el medio ambiente.
                            </DialogContentText>
                            <Button variant="contained"
                                    component="a"
                                    href="https://docs.score-environnemental.com/v/en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{textTransform: "none",
                                        display: "inline-flex",
                                        gap: 1

                                    }}>
                                    Más información 
                                    <LaunchRoundedIcon sx={{fontSize: 20}}></LaunchRoundedIcon>
                            </Button>
                            <DialogContentText>
                                <Typography fontSize={15} fontWeight="bold">
                                    Nutri-Score
                                </Typography>
                            </DialogContentText>
                            <DialogContentText fontSize={13} textAlign="justify">
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
                                    Más información 
                                    <LaunchRoundedIcon sx={{fontSize: 20}}></LaunchRoundedIcon>
                            </Button>
                            <DialogContentText>
                                <Typography fontSize={15} fontWeight="bold">
                                    Nova-Score
                                </Typography>
                            </DialogContentText>
                            <DialogContentText fontSize={13} textAlign="justify">
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
                                    href="https://en.wikipedia.org/wiki/Nova_classification"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    sx={{textTransform: "none",
                                        display: "inline-flex",
                                        gap: 1

                                    }}>
                                    Más información 
                                    <LaunchRoundedIcon sx={{fontSize: 20}}></LaunchRoundedIcon>
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
                </Backdrop>
    
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
                
            </Grid> :null}
            
        </>
    )
};

export default FoodProfile;