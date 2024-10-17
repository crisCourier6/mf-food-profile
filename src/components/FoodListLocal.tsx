import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api';
import { FoodLocal } from '../interfaces/foodLocal';
import { Box, } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams } from "@mui/x-data-grid"
import { useNavigate } from 'react-router-dom';
import { esES } from '@mui/x-data-grid/locales';
import FoodCommentsCount from './FoodCommentsCount';
import FoodCommentList from './FoodCommentList';

const FoodListLocal: React.FC = () => {
    const navigate = useNavigate()
    const [foodLocalList, setFoodLocalList] = useState<FoodLocal[] | null>()
    const [showCommentsDialog, setShowCommentsDialog] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodLocal|null>(null)
    const foodURL = "/food/local"
    useEffect(()=>{
        document.title = "Lista local de alimentos - EyesFood";
        api.get(foodURL, {
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
        {field: "name", headerName: "Nombre", flex: 2, headerClassName: "header-colors"},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerClassName: "header-colors",
            headerAlign: "center", 
            type: "actions",
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    height: '100%',
                }}>
                            <FoodCommentsCount id={params.row.id} onClick={()=>handleShowComments(params.row)} noneColor='lightgrey' someColor='primary.main'/>        
                </Box>
            )
        }
    ]

    const handleRowClick: GridEventListener<'rowClick'> = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
      ) => {
        return navigate("/food/" + params.row.id)
      };

    const handleShowComments = (foodLocal:FoodLocal) => {
        setSelectedFood(foodLocal)
        setShowCommentsDialog(true)
    }

    const handleCloseComments = () => {
        setShowCommentsDialog(false)
    }

    return ( <>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width:"90vw",
            maxWidth: "1000px",
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
                localeText={esES.components.MuiDataGrid.defaultProps.localeText} // Apply locale directly
                    sx={{
                        
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
                        '& .MuiDataGrid-sortIcon': {
                            color: 'primary.contrastText', // Change sort icon color
                        },
                        '& .MuiDataGrid-menuIconButton': {
                            color: 'primary.contrastText', // Change column menu icon color
                        },
                        '& .header-colors': {
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: "bold",
                            fontFamily: "Righteous",
                            whiteSpace: "normal"
                        },
                        
                    }}
                />
                :null}
                <FoodCommentList foodLocal={selectedFood} show={showCommentsDialog} hide={handleCloseComments}/>
        </Box>
        
        </>
    )
}

export default FoodListLocal;