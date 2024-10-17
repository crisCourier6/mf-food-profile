import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Paper, Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import "./Components.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type accordionItemsType = {
    name:string,
    description:string,
    link:string
}

const FoodAdditive: React.FC<{additives:string[]}> = (props) => {
    const textLength = 450
    const [expanded, setExpanded] = useState<number|false>(false)
    const [isFullText, setIsFullText] = useState<Record<number, boolean>>({});

    const expandDescription = (panel:any) => (event:any, isExpanded:boolean) => {
        setExpanded(isExpanded?panel:null)
    }

    const shrinkDescription = (text:string, maxLength:number) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    const toggleText = (index: number) => {
        setIsFullText(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

     const fetchDescription = async (wikidata: string): Promise<Record<string, string>> => {
        const url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/";
        const url2 = "https://es.wikipedia.org/w/api.php";

        const response = await fetch(url + wikidata + "?_fields=sitelinks");
        const data = await response.json();

        if (data["sitelinks"]) {
            const title = data["sitelinks"]["eswiki"] ? data["sitelinks"]["eswiki"]["title"] : null;
            if (!title) return {};

            const response2 = await fetch(
                url2 +
                "?action=query&prop=extracts&formatversion=2&origin=*&format=json&explaintext=true&titles=" +
                title
            );
            const data2 = await response2.json();
            return {description: data2["query"]["pages"][0]["extract"].split("\n\n\n")[0].replace(/\[.*?\]/g, ' ').trim(), 
                    link:"https://es.wikipedia.org/wiki/" + title.replace(/ /g, "_")};
        }

        return {};
    };
 
    return ( <Paper elevation={0}>
        <>
        {props.additives.map((data, index) => {
            let name=data.split(",")[0] 
            let wikidata=data.split(",")[1]
            const [link, setLink] = useState<string>("");
            const [description, setDescription] = useState<string>("Sin descripción");

            useEffect(() => {
                fetchDescription(wikidata).then((res) => {
                    if (res.description){
                        setDescription(res.description)
                        setLink(res.link)
                    }
                })
                    
            }, [wikidata]);
            const isExpanded = expanded === index;
            const fullTextVisible = isFullText[index] || !isExpanded;
            return (
            <Accordion 
            key={name}
            expanded={isExpanded}
            onChange={() => setExpanded(isExpanded ? false : index)}
            
            >
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id={`panel${index}-header`}
                sx={{textAlign: "left"}}
                >
                    <Typography variant='subtitle1' color= "primary.dark">
                        {name}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography fontSize={12} textAlign="justify">
                        {fullTextVisible? description:shrinkDescription(description, textLength)}
                        {link!=="" && (
                            <a href={link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px' }}>
                                Fuente: Wikipedia
                            </a>
                        )}
                    </Typography>
                    {description.length > textLength && (
                    <Button
                        size="small"
                        onClick={() => toggleText(index)}
                        color="primary"
                    >
                        {fullTextVisible ? "Leer menos" : "Seguir leyendo"}
                        
                    </Button> 
                    )}
                    
                </AccordionDetails>
            </Accordion>   )           
        })} 
        </>
        </Paper>
        
            
        
    )
    
};

export default FoodAdditive;