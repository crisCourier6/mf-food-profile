import React, { useEffect, useState } from 'react';
import api from '../api';
import { Box, Button, IconButton, Paper,Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { UserCommentsFood } from '../interfaces/UserCommentsFood';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FoodLocal } from '../interfaces/foodLocal';
import dayjs from 'dayjs';

const FoodCommentList: React.FC<{ foodLocal:FoodLocal|null, show:boolean, hide:()=>void }> = ({ foodLocal, show, hide }) => {
    const [comments, setComments] = useState<UserCommentsFood[]>([])
    const commentsURL = "/comments-food"
    const [selectedComment, setSelectedComment] = useState<UserCommentsFood | null>(null);
    const [selectedCommentParent, setSelectedCommentParent] = useState<UserCommentsFood | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    useEffect(()=>{
        if (foodLocal){
            let queryParams = `?f=${foodLocal.id}&wc=true&op=true&wp=true&wu=true`
            console.log(`${commentsURL}${queryParams}`)
            api.get(`${commentsURL}${queryParams}`, 
                {
                    withCredentials: true,
                    headers: {
                        Authorization: "Bearer " + window.localStorage.token
                    }
                }
            )
            .then(res => {
                console.log(res.data)
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
            console.log("actualice comments")
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
                headers: { Authorization: "Bearer " + window.localStorage.token },
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
                headers: { Authorization: "Bearer " + window.localStorage.token },
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
        setSelectedComment(null)
        setSelectedCommentParent(null)
        setShowDeleteDialog(false)
    }

    const openEditDialog = (comment: UserCommentsFood, parentComment: UserCommentsFood | null) => {
        setSelectedComment(comment);
        setSelectedCommentParent(parentComment)
        setShowEditDialog(true);
    };

    const closeEditDialog = () => {
        setSelectedComment(null)
        setSelectedCommentParent(null)
        setShowEditDialog(false)
    }


    return ( <>
        <Dialog open={show} onClose={hide} fullScreen
            PaperProps={{
                sx: {
                    maxHeight: '80vh', 
                    width: "95vw",
                    maxWidth: "450px"
                }
            }}
        >
            <DialogTitle>
                Comentarios en {foodLocal?.name}
            </DialogTitle>
            <DialogContent>
            
                {comments.map(comment => {
                    return (
                        <Box key={comment.id} sx={{display: "flex", flexDirection: "column", alignItems: "flex-end", width:"100%",}}>
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
                                        <IconButton size="small" onClick={()=>openDeleteDialog(comment, null)}>
                                            <DeleteForeverRoundedIcon sx={{ 
                                                color:"primary.contrastText", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
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
                                                <IconButton size="small" onClick={()=>openDeleteDialog(parentChild.childComment, comment)}>
                                                    <DeleteForeverRoundedIcon sx={{ 
                                                        color:"primary.contrastText", 
                                                        fontSize:18
                                                    }} />
                                                </IconButton>
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
                })}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={hide}>
                    Cerrar
                </Button>
            </DialogActions>
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
                            ?<>¿Seguro que desea desactivar este comentario? El comentario seguirá existiendo pero su contenido no será visible</>
                            :<>¿Seguro que desea restaurar este comentario? Su contenido será visible para todos</>
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