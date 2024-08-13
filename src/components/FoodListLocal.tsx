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
        axios.get("http://192.168.100.6:8080/food/local", {
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
        {field: "id", headerName: "Código", flex: 1, headerClassName: "header-colors"},
        {field: "name", headerName: "Nombre", flex: 1, headerClassName: "header-colors"},
        
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width:"90vw",
            maxWidth: "600px",
            overflow: "auto",
            
          }}>
            {foodLocalList 
                ? <DataGrid 
                rows={foodLocalList}
                columns={columns}
                rowHeight={32}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                onRowClick={handleRowClick}
                sx={{
                    cursor:"pointer", 
                    width: "100%", 
                    minWidth: 0,
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        backgroundColor: 'secondary.light', // Light grey for odd rows
                        fontFamily: "Montserrat"
                    },
                    '& .MuiDataGrid-row:nth-of-type(even)': {
                        backgroundColor: '#ffffff', // White for even rows
                        fontFamily: "Montserrat"
                    },
                    '& .header-colors': {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        fontFamily: "Righteous"
                    },
                    
                }}
                />
                :null}
        </Box>
    )
}

export default FoodListLocal;