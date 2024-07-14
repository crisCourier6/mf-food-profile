import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FoodLocal } from '../interfaces/foodLocal';
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button } from '@mui/material';
import { FoodExternal } from '../interfaces/foodExternal';
      
const FoodProfile: React.FC = () => {
    const [foodExternalSingle, setFoodExternalSingle] = useState<FoodExternal | null>()
    const [foodFullName, setFoodFullName] = useState<string>("")
    const { id } = useParams()
    const navigate = useNavigate()
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
                return navigate("/food/" + id + "/edit")
                
            }
            else{
                console.log("si hay")
                setFoodExternalSingle(response.data.product)
                let foodName = ""
                if(response.data.product.product_name){
                    console.log("hola")
                    foodName = response.data.product.product_name
                }
                if(response.data.product.brands){
                    foodName = foodName + " - " + response.data.product.brands.split(",")[0]
                }
                if (response.data.product.quantity){
                    foodName = foodName + " - " + response.data.product.quantity
                }
                setFoodFullName(foodName)

            }
            
        })
    },[id])      

    return ( 
        <div>
            {foodExternalSingle ? 
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignContent: "center"

            }}>
                <h1>{foodFullName}</h1>
                <p>id: {foodExternalSingle.id}</p>
                <p>Marca: {!!foodExternalSingle.brands && foodExternalSingle.brands}</p>
                <Box
                    component="img"
                    sx={{
                    width: "auto"
                    }}
                    alt="EyesFood logo"
                    src={foodExternalSingle.image_front_url}
                /> 
                <Button variant='contained'
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
                    }}>COMENTARIOS</Button>
                
            </Box> :null}
        </div>
    )
};

export default FoodProfile;