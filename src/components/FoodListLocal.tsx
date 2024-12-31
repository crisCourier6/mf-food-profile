import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import { FoodLocal } from '../interfaces/foodLocal';
import { Box, Button, IconButton, Tooltip, } from '@mui/material';
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid"
import { useNavigate } from 'react-router-dom';
import Visibility from "@mui/icons-material/Visibility"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { esES } from '@mui/x-data-grid/locales';
import FoodCommentsCount, { FoodCommentsCountRef } from './FoodCommentsCount';
import FoodCommentList from './FoodCommentList';

const FoodListLocal: React.FC = () => {
    const navigate = useNavigate()
    const [foodLocalList, setFoodLocalList] = useState<FoodLocal[] | null>()
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const [showCommentsDialog, setShowCommentsDialog] = useState(false)
    const [selectedFood, setSelectedFood] = useState<FoodLocal|null>(null)
    const foodURL = "/food/local"
    const commentCountRef = useRef<FoodCommentsCountRef>(null);
    useEffect(()=>{
        document.title = "Lista local de alimentos - EyesFood";
        api.get(foodURL, {
            withCredentials: true,
             headers: {
                 Authorization: "Bearer " + token
             }
        })
        .then((response)=>{
            setFoodLocalList(response.data)
        })
        
    },[])      
    const columns: GridColDef[] = [
        {field: "name", headerName: "Nombre", flex: 2, headerClassName: "header-colors"},
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerClassName: "header-colors",
            headerAlign: "center", 
            type: "actions",
            renderCell: (params: GridRenderCellParams) => (
                <Box key={params.row.id} sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    height: '100%',
                }}>
                    <Tooltip title={"Ver perfil de alimento"} key="view" placement="left" arrow={true}>
                        <IconButton color="primary" onClick={() => handleFoodProfile(params.row.id)}>
                            <Visibility/>
                        </IconButton>
                    </Tooltip>
                    <FoodCommentsCount id={params.row.id} onClick={()=>handleShowComments(params.row)} noneColor='lightgrey' someColor='primary.main' ref={commentCountRef}/>      
                    <Tooltip title="Editar" key="edit" placement="right" arrow={true}>
                        <IconButton color="primary" onClick={() => handleEditFood(params.row.id)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
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

    const handleFoodProfile = (id: string) => {
        return navigate("/food/" + id)
    }

    const handleCreateFood = () => {
        return navigate("/scan")
    }

    const handleEditFood = (id:string) => {
        return navigate(`/food/${id}/edit`)
    }

    const handleShowComments = (foodLocal:FoodLocal) => {
        setSelectedFood(foodLocal)
        setShowCommentsDialog(true)
    }

    const handleCloseComments = () => {
        setShowCommentsDialog(false)
    }

    const handleDeleteComment = () => {
        if (commentCountRef.current) {
            commentCountRef.current.refreshCommentCount(); // Trigger refresh
        }
    };

    const CustomToolbar: React.FC = () => (
        <GridToolbarContainer
        sx={{
            border: "2px solid",
            borderColor: 'primary.dark', // Change the background color
        }}>
            <GridToolbarFilterButton/>
            <GridToolbarExport />
            <Tooltip title="Crear notificación" key="create" placement="bottom">
                <Button
                    onClick={handleCreateFood}
                    sx={{fontSize: 13}}
                >
                    <AddIcon/>
                    Crear
                </Button>
            </Tooltip>
        </GridToolbarContainer>
    );

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
                slots={{ toolbar: CustomToolbar }}
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
                        maxWidth: "800px",
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
                <FoodCommentList 
                foodLocal={selectedFood} 
                show={showCommentsDialog} 
                hide={handleCloseComments} 
                onCommentDeleted={handleDeleteComment} 
                canEdit={true}/>
        </Box>
        
        </>
    )
}

export default FoodListLocal;