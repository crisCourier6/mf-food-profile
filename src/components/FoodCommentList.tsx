import React, { useEffect, useState } from 'react';
import api from '../api';
import { Box, Button, IconButton, Paper,Typography, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { UserCommentsFood } from '../interfaces/UserCommentsFood';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FoodLocal } from '../interfaces/foodLocal';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

const FoodCommentList: React.FC<{ foodLocal:FoodLocal|null, show:boolean, hide:()=>void, onCommentDeleted: () => void, canEdit: boolean }> = ({ foodLocal, show, hide, onCommentDeleted, canEdit }) => {
    const [comments, setComments] = useState<UserCommentsFood[]>([])
    const commentsURL = "/comments-food"
    const token = window.sessionStorage.getItem("token") ?? window.localStorage.getItem("token")
    const [selectedComment, setSelectedComment] = useState<UserCommentsFood | null>(null);
    const [selectedCommentParent, setSelectedCommentParent] = useState<UserCommentsFood | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    useEffect(()=>{
        if (foodLocal){
            let queryParams = `?f=${foodLocal.id}&wc=true&op=true&wp=true&wu=true`
            //console.log(`${commentsURL}${queryParams}`)
            api.get(`${commentsURL}${queryParams}`, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            .then(res => {
                setComments(res.data)
            })
            .catch(error => {
                console.log(error.response.data)
            })
        }   
        
    },[foodLocal])

    const updateComment = (updatedComment: UserCommentsFood) => {
        if (selectedCommentParent){
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === selectedCommentParent.id) {
                        return {
                            ...comment,
                            commentHasChild: comment.commentHasChild.map((child) =>
                                child.childId === updatedComment.id
                                    ? { ...child, childComment: updatedComment } // Update the childComment
                                    : child
                            ),
                        };
                    }
                    return comment;
                })
            );
        }
        else {
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === updatedComment.id ? updatedComment : comment
                )
            );
        }
        
    };

    // Function to delete a comment
    const deleteComment = (commentId: string) => {
        if (selectedCommentParent){
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === selectedCommentParent.id) {
                        return {
                            ...comment,
                            commentHasChild: comment.commentHasChild.filter(
                                (child) => child.childId !== commentId
                            ),
                        };
                    }
                    return comment;
                })
            );
        }
        else{
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
        }
        
    };

    const handleUpdateComment = () => {
        if (selectedComment) {
            const updatedComment = {
                ...selectedComment,
                isHidden: !selectedComment.isHidden
            };

            api.patch(`${commentsURL}/${selectedComment.id}`, updatedComment, {
                withCredentials: true,
                headers: { Authorization: "Bearer " + token },
            })
                .then(res => {
                    updateComment(updatedComment)
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(()=>{
                    setSelectedComment(null)
                    setSelectedCommentParent(null)
                })
        }
        setShowEditDialog(false);  // Close dialog after updating
    }

    const handleDeleteComment = () => {
        if (selectedComment) {
            api.delete(`${commentsURL}/${selectedComment.id}`, 
                {
                withCredentials: true,
                headers: { Authorization: "Bearer " + token },
                }
            )
            .then(res => {
                deleteComment(selectedComment.id)
            })
            .catch(error => {
                console.log(error);
            })
            .finally(()=>{
                setSelectedComment(null)
                setSelectedCommentParent(null)
                if (onCommentDeleted) {
                    onCommentDeleted(); // Notify parent to refresh count
                }
            })
        }
        setShowDeleteDialog(false);  // Close dialog after deleting
    }

    // Open the delete confirmation dialog
    
    const openDeleteDialog = (comment: UserCommentsFood, parentComment: UserCommentsFood | null) => {
        setSelectedComment(comment);
        setSelectedCommentParent(parentComment)
        setShowDeleteDialog(true);
    };
    const closeDeleteDialog = () => {
        setShowDeleteDialog(false)
    }

    const openEditDialog = (comment: UserCommentsFood, parentComment: UserCommentsFood | null) => {
        setSelectedComment(comment);
        setSelectedCommentParent(parentComment)
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setShowEditDialog(false)
    }


    return ( <>
        <Dialog open={show} onClose={hide} fullScreen
            PaperProps={{
                sx: {
                    maxHeight: '80vh', 
                    width: "95vw",
                    maxWidth: "600px",
                    height: "auto"
                }
            }}
        >
            <DialogTitle>
                <Box sx={{display:"flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                    Comentarios en {foodLocal?.name}
                    <IconButton
                    color="inherit"
                    onClick={hide}
                    sx={{p:0}}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", width:"100%", gap: 2}}>
                {comments.length>0 
                    ?   comments.map(comment => {
                        return (
                        <Box key={comment.id} sx={{display: "flex", flexDirection: "column", alignItems: "flex-end", width:"100%"}}>
                            <Box  sx={{ 
                                display: 'flex', 
                                width: "95%",
                                flexDirection: "column",
                                border: "2px solid",
                                borderColor: "primary.dark",
                                gap: 0.5,
                            }}> 
                                <Paper sx={{
                                    width:"100%", 
                                    bgcolor: "primary.dark", 
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderRadius:0
                                }}>
                                    <Typography 
                                    variant="subtitle1" 
                                    color={"primary.contrastText"}
                                    sx={{flexGrow: 1, textAlign: "left", width: "80%", pl:1}}
                                    >
                                        {comment.user?.name} 
                                    </Typography>

                                    {
                                        canEdit && <>
                                            <Tooltip title={comment.isHidden?"Restaurar comentario": "Desactivar comentario"} key="view" placement="left" arrow={true}>
                                                <IconButton size="small" onClick={()=>openEditDialog(comment, null)}>
                                                    {comment.isHidden
                                                        ?<Visibility sx={{ 
                                                            color:"primary.contrastText", 
                                                            fontSize:18
                                                        }} />
                                                        :<VisibilityOff sx={{ 
                                                            color:"primary.contrastText", 
                                                            fontSize:18
                                                        }} />
                                                    }
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={"Eliminar comentario"} key="delete" placement="right" arrow={true}>
                                                <IconButton size="small" onClick={()=>openDeleteDialog(comment, null)}>
                                                    <DeleteForeverRoundedIcon sx={{ 
                                                        color:"error.main", 
                                                        fontSize:18
                                                    }} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                    
                                </Paper>
                                <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                                    <Typography variant="subtitle2" textAlign={"justify"} sx={{px:1, fontStyle: comment.isHidden?"italic":"normal"}}>
                                        {comment.isHidden ? <>Comentario desactivado</> : <>{comment.content}</>}
                                    </Typography>
                                    <Typography variant="subtitle2" textAlign={"right"} sx={{px:1, fontStyle: "italic"}}>
                                        {dayjs(comment.createdAt).format("DD/MM/YYYY")}
                                    </Typography>
                                </Box>
                            </Box>
                            {comment.commentHasChild.map(parentChild => {
                                return (
                                
                                    <Box key={parentChild.childComment.id} sx={{ 
                                        display: 'flex', 
                                        width: "90%",
                                        flexDirection: "column",
                                        border: "2px solid",
                                        borderColor: "primary.dark",
                                        gap: 0.5,
                                        
                                    }}> 
                                        <Paper sx={{
                                            width:"100%", 
                                            bgcolor: "primary.dark", 
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderRadius:0
                                        }}>
                                            <Typography 
                                            variant="subtitle1" 
                                            color={"primary.contrastText"}
                                            sx={{flexGrow: 1, textAlign: "left", width: "80%", pl:1}}
                                            >
                                                {parentChild.childComment.user?.name} 
                                            </Typography>
                                            {
                                                canEdit && <>
                                                     <Tooltip title={parentChild.childComment.isHidden?"Restaurar comentario": "Desactivar comentario"} key="view" placement="left" arrow={true}>
                                                    <IconButton size="small" onClick={()=>openEditDialog(parentChild.childComment, comment)}>
                                                        {parentChild.childComment.isHidden
                                                            ?<Visibility sx={{ 
                                                                color:"primary.contrastText", 
                                                                fontSize:18
                                                            }} />
                                                            :<VisibilityOff sx={{ 
                                                                color:"primary.contrastText", 
                                                                fontSize:18
                                                            }} />
                                                        }
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={"Eliminar comentario"} key="delete" placement="right" arrow={true}>
                                                    <IconButton size="small" onClick={()=>openDeleteDialog(parentChild.childComment, comment)}>
                                                        <DeleteForeverRoundedIcon sx={{ 
                                                            color:"error.main", 
                                                            fontSize:18
                                                        }} />
                                                    </IconButton>
                                                </Tooltip>
                                                </>
                                            }
                                               
                                        </Paper>
                                        <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                                            <Typography variant="subtitle2" textAlign={"justify"} sx={{px:1, fontStyle:parentChild.childComment.isHidden?"italic":"normal"}}>
                                                {parentChild.childComment.isHidden
                                                 ?<>Comentario desactivado</>
                                                 :<> {parentChild.childComment.content}</>
                                                 }
                                            </Typography>
                                            <Typography variant="subtitle2" textAlign={"right"} sx={{px:1, fontStyle: "italic"}}>
                                                {dayjs(parentChild.childComment.createdAt).format("DD/MM/YYYY")}
                                            </Typography>
                                        </Box>
                                    </Box>
                            
                                )
                            })}
                        </Box>  
                    )
                })
                :   <Typography variant='subtitle1'>
                        Aún no hay comentarios en este alimento
                    </Typography>
            }
            </Box>
            </DialogContent>
        </Dialog>
            
            {/* Delete Comment Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
                <DialogTitle>Borrar comentario</DialogTitle>
                <DialogContent>
                    <Typography>¿Seguro que quieres borrar este comentario?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDeleteComment} variant="contained" color="error">Borrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showEditDialog} onClose={closeEditDialog}
                PaperProps={{
                    sx: {
                        maxHeight: '80vh', 
                        width: "85vw",
                        maxWidth: "450px"
                    }
                }} 
            >
                <DialogTitle>{selectedComment?.isHidden
                        ?<>Restaurar comentario</>
                        :<>Desactivar comentario</>
                    }
                </DialogTitle>
                <DialogContent>
                    <Typography variant='subtitle1'>
                        {selectedComment?.isHidden
                            ?<>
                                ¿Seguro que desea restaurar este comentario? 
                                <Typography variant='subtitle1' sx={{fontStyle: "italic", pt:1}}>"{selectedComment.content}"</Typography>
                            </>
                            :<>¿Seguro que desea desactivar este comentario? El comentario seguirá existiendo pero su contenido no será visible</>
                        }
                    </Typography>
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditDialog}>Cancelar</Button>
                    <Button onClick={handleUpdateComment} variant="contained">Aceptar</Button>
                </DialogActions>
            </Dialog>
        </>

    )
};

export default FoodCommentList;