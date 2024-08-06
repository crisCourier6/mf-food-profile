import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Typography, Accordion, AccordionActions, AccordionDetails, AccordionSummary } from '@mui/material';
import { FoodExternal } from '../interfaces/foodExternal';
import "./Components.css"
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { ExpandMore } from '@mui/icons-material';

const FoodAdditive: React.FC<{name:string, wikidata:string}> = (props) => {
    const [description, setDescription] = useState("")
    const url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/"
    const url2 = "https://es.wikipedia.org/w/api.php"
    useEffect(()=>{
        fetch(url + props.wikidata + "?_fields=sitelinks")
        .then(response => response.json())
        .then((response)=>{
            if (response["sitelinks"]){
                let title = response["sitelinks"]["eswiki"]?response["sitelinks"]["eswiki"]["title"]:null
                if (!title){
                    setDescription("Sin descripción")
                    return
                }
                
                fetch(url2 + "?action=query&prop=extracts&formatversion=2&origin=*&format=json&explaintext=true&titles=" + title,)
                .then(response2 => response2.json())
                .then((response2)=>{
                    setDescription(response2["query"]["pages"][0]["extract"].split("\n\n\n")[0])
                })
            }
            else{
                setDescription("Sin descripción")
            }
            
        })
        
    },[])      
    return ( 
        <>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
                >
                    {props.name}
                </AccordionSummary>
                <AccordionDetails>
                    <Typography fontSize={12} textAlign="justify">{description.replace(/\[.*?\]/g, ' ').trim()}</Typography>
                    
                </AccordionDetails>
            </Accordion>
        </>
    )
};

export default FoodAdditive;