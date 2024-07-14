import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FoodLocal } from '../interfaces/foodLocal';
import { Box } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid"
import { useNavigate } from 'react-router-dom';

const componentBreaks = {
    breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
}

const FoodListLocal: React.FC = () => {
    const navigate = useNavigate()
    const [foodLocalList, setFoodLocalList] = useState<FoodLocal[] | null>()
    console.log(window.localStorage.token)
    useEffect(()=>{
        axios.get("http://192.168.100.6:8080/foodlocal", {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + window.localStorage.token
             }
        })
        .then((response)=>{
            setFoodLocalList(response.data)
        })
        
    },[])      
    const columns: GridColDef[] = [
        {field: "id", headerName: "Código", width: 150},
        {field: "name", headerName: "Nombre", width: 300},
        
    ]

    const handleRowClick: GridEventListener<'rowClick'> = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
      ) => {
        return navigate("/food/" + params.row.id)
      };
      

    return ( 
        <Box sx={{
            display: "grid",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            b: 15,
          }}>
            {/* {foodLocalList ? foodLocalList.map((food)=>{
                return  <>
                            <p>{food.name}</p>
                            <p>{food.id}</p>
                            <Box
                                component="img"
                                sx={{
                                height: 30,
                                maxHeight: { xs: 233, md: 167 },
                                }}
                                alt="Imágen no disponible"
                                src={food.picture}
                            />
                        </>                       
            }):null} */}
            {foodLocalList ? <DataGrid 
                                rows={foodLocalList}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                onRowClick={handleRowClick}
                                

                            />:null}
        </Box>
    )
}

export default FoodListLocal;