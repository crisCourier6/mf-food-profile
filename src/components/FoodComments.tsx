import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { UserCommentsFood } from '../interfaces/UserCommentsFood';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

const FoodComments: React.FC<{ expanded: boolean; toggleExpand: () => void }> = ({ expanded, toggleExpand }) => {
    const { id } = useParams()
    const currentUserId = window.sessionStorage.getItem("id") || window.localStorage.getItem("id")
    const token = window.sessionStorage.getItem("token") || window.localStorage.getItem("token")
    const [comments, setComments] = useState<UserCommentsFood[]>([])
    const commentsURL = "/comments-food"
    const [selectedComment, setSelectedComment] = useState<UserCommentsFood | null>(null);
    const [selectedCommentParent, setSelectedCommentParent] = useState<UserCommentsFood | null>(null);
    const [editedContent, setEditedContent] = useState("");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [newCommentContent, setNewCommentContent] = useState("");

    useEffect(()=>{
        let queryParams = `?f=${id}&wc=true&op=true&wp=true&wu=true`
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
    },[])

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

    const addNewComment = (newComment: UserCommentsFood) => {
        if (selectedCommentParent){
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === selectedCommentParent.id) {
                        return {
                            ...comment,
                            commentHasChild: [
                                ...comment.commentHasChild,
                                {
                                    parentId: selectedCommentParent.id,
                                    childId: newComment.id,
                                    childComment: newComment,
                                },
                            ],
                        };
                    }
                    return comment;
                })
            );
        }
        else if (selectedComment){
            setComments((prevComments) =>
                prevComments.map((comment) => {
                    if (comment.id === selectedComment.id) {
                        return {
                            ...comment,
                            commentHasChild: [
                                ...comment.commentHasChild,
                                {
                                    parentId: selectedComment.id,
                                    childId: newComment.id,
                                    childComment: newComment,
                                },
                            ],
                        };
                    }
                    return comment;
                })
            );
        }
        else{
            setComments(prevComments => [newComment, ...prevComments]);
        }
        
    };

    const handleUpdateComment = () => {
        if (selectedComment) {
            const updatedComment = {
                ...selectedComment,
                content: editedContent
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
            })
        }
        setShowDeleteDialog(false);  // Close dialog after deleting
    }

    const openCreateDialog = (comment: UserCommentsFood|null, parentComment:UserCommentsFood|null) => {
        setSelectedComment(comment)
        setSelectedCommentParent(parentComment)
        setShowCreateDialog(true)
    };
    const closeCreateDialog = () => {
        setSelectedComment(null)
        setSelectedCommentParent(null)
        setNewCommentContent("")
        setShowCreateDialog(false)
    };

    const handleCreateComment = () => {
        const newComment = {
            content: selectedComment && selectedCommentParent?`(Respondiendo a ${selectedComment.user.name}) ${newCommentContent}`: newCommentContent,
            userId: currentUserId,
            foodLocalId: id,
            commentHasParent: selectedCommentParent? selectedCommentParent.id : selectedComment?.id || null
        };
        
        // Call your API to create a comment
        api.post(commentsURL, newComment, {
            withCredentials: true,
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => {
            console.log(res);
            addNewComment(res.data) // Call the parent's new comment function
            setNewCommentContent("");  // Clear the input fields after creating
            closeCreateDialog();
        }).catch(error => {
            console.log(error);
        })
        .finally(()=>{
            setSelectedComment(null)
            setSelectedCommentParent(null)
        })
    };
    

    const openEditDialog = (comment: UserCommentsFood, parentComment: UserCommentsFood | null) => {
        setSelectedComment(comment);
        setSelectedCommentParent(parentComment)
        setEditedContent(comment.content || "");
        setShowEditDialog(true);
    };

    // Open the delete confirmation dialog
    const openDeleteDialog = (comment: UserCommentsFood, parentComment: UserCommentsFood | null) => {
        setSelectedComment(comment);
        setSelectedCommentParent(parentComment)
        setShowDeleteDialog(true);
    };

    const closeEditDialog = () => {
        setSelectedComment(null)
        setSelectedCommentParent(null)
        setShowEditDialog(false)
    }

    const closeDeleteDialog = () => {
        setSelectedComment(null)
        setSelectedCommentParent(null)
        setShowDeleteDialog(false)
    }


    return ( <>
        <Box sx={{ 
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap:1,
        }}>
            <Paper elevation={0} square={true} sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                border: "3px solid",
                borderColor: "primary.main",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
            }}>
                <Typography variant='h6' sx={{color: "primary.contrastText"}}>
                    Comentarios
                </Typography>
                <Typography 
                width={"100%"} 
                variant='subtitle2' 
                color= "primary.contrastText" 
                textAlign={"right"}
                onClick={toggleExpand}>
                    {expanded ? "▲ Ocultar" : "▼ Expandir"}
                </Typography>
            </Paper>
            {expanded && <>
            <Box sx={{display: "flex", justifyContent: "flex-start", width: "100%"}}>
                <Button onClick={()=>openCreateDialog(null, null)} >
                    <AddIcon/>
                    <Typography variant='subtitle2' sx={{textDecoration: "underline", textAlign: "left"}}>
                        Agregar comentario
                    </Typography>
                </Button>
            </Box>
                
                {comments.map((comment, index) => {
                    return (
                        <Box key={comment.id} 
                        sx={{display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end", 
                        width:"100%",
                        borderLeft: "2px solid",
                        borderBottom: "2px solid",
                        borderColor: "primary.light",
                        mb: 2
                        }}>
                            <Box  sx={{ 
                                display: 'flex', 
                                width: "100%",
                                flexDirection: "column",
                                gap: 0.5,
                            }}> 
                                <Paper sx={{
                                    width:"100%", 
                                    bgcolor: "primary.light",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderRadius:0,
                                    gap: 1
                                }}>
                                    <Typography 
                                    variant="subtitle1" 
                                    color={"primary.dark"}
                                    sx={{flexGrow: 1, textAlign: "left", width: "80%", pl:1}}
                                    >
                                        {comment.user?.name} 
                                    </Typography>
                                    <Typography variant="subtitle2" textAlign={"right"} sx={{px:1, fontStyle: "italic"}}>
                                        {dayjs(comment.createdAt).format("DD/MM/YYYY")}
                                    </Typography>
                                    
                                </Paper>
                                <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                                    <Typography variant="subtitle2" textAlign={"justify"} sx={{px:1, fontStyle: comment.isHidden?"italic":"normal"}}>
                                        {comment.isHidden ? <>Comentario desactivado</> : <>{comment.content}</>}
                                    </Typography>
                                    {comment.userId === currentUserId  
                                        ?<Box sx={{display: "flex", width: "100%", justifyContent: "flex-end"}}>                                        
                                        <IconButton size="small" onClick={()=>openEditDialog(comment, null)}>
                                        <EditRoundedIcon sx={{ 
                                            color: "primary.dark",
                                            fontSize: 18
                                        }}/>
                                        </IconButton>    
                                        <IconButton size="small" onClick={()=>openDeleteDialog(comment, null)}>
                                            <DeleteForeverRoundedIcon sx={{ 
                                                color:"error.main", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
                                        <IconButton size="small" onClick={()=>openCreateDialog(comment, null)}>
                                            <ReplyRoundedIcon sx={{ 
                                                color:"primary.dark", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
                                        </Box>
                                        :<Box sx={{display: "flex", width: "100%", justifyContent: "flex-end"}}>
                                            <IconButton size="small" onClick={()=>openCreateDialog(null, comment)}>
                                            <ReplyRoundedIcon sx={{ 
                                                color:"primary.dark", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
                                        </Box>
                                    }
                                    
                                </Box>
                                
                            </Box>
                            {comment.commentHasChild.map(parentChild => {
                                return (
                                
                                    <Box key={parentChild.childComment.id} sx={{ 
                                        display: 'flex', 
                                        width: "90%",
                                        flexDirection: "column",
                                        borderLeft: "2px solid",
                                        borderColor: "primary.light",
                                        bgcolor: "inherit",
                                        gap: 0.5,
                                        alignItems: "flex-end"
                                        
                                    }}> 
                                        <Paper sx={{
                                            width:"100%", 
                                            bgcolor: "primary.light", 
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            borderRadius:0,
                                            gap: 1
                                        }}>
                                            <Typography 
                                            variant="subtitle1" 
                                            color={"primary.dark"}
                                            sx={{flexGrow: 1, textAlign: "left", width: "80%", pl:1}}
                                            >
                                                {parentChild.childComment.user?.name} 
                                            </Typography>
                                            <Typography variant="subtitle2" textAlign={"right"} sx={{px:1, fontStyle: "italic"}}>
                                                {dayjs(parentChild.childComment.createdAt).format("DD/MM/YYYY")}
                                            </Typography>
                                        </Paper>
                                        <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                                            <Typography variant="subtitle2" textAlign={"justify"} sx={{px:1, fontStyle:parentChild.childComment.isHidden?"italic":"normal"}}>
                                                {parentChild.childComment.isHidden
                                                 ?<>Comentario desactivado</>
                                                 :<> {parentChild.childComment.content}</>
                                                 }
                                            </Typography>
                                            {parentChild.childComment.userId === currentUserId ? 
                                            <Box sx={{display: "flex", width: "100%", justifyContent: "flex-end"}}>                                        
                                                <IconButton size="small" onClick={()=>openEditDialog(parentChild.childComment, comment)}>
                                                    <EditRoundedIcon sx={{ 
                                                        color: "primary.dark",
                                                        fontSize: 18
                                                    }}/>
                                                </IconButton>    
                                                <IconButton size="small" onClick={()=>openDeleteDialog(parentChild.childComment, comment)}>
                                                    <DeleteForeverRoundedIcon sx={{ 
                                                        color:"error.main", 
                                                        fontSize:18
                                                    }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={()=>openCreateDialog(parentChild.childComment, comment)}>
                                                    <ReplyRoundedIcon sx={{ 
                                                        color:"primary.dark", 
                                                        fontSize:18
                                                    }} />
                                                </IconButton>
                                            </Box>
                                            :  <Box sx={{display: "flex", width: "100%", justifyContent: "flex-end"}}>                  
                                                <IconButton size="small" onClick={()=>openCreateDialog(parentChild.childComment, comment)}>
                                                    <ReplyRoundedIcon sx={{ 
                                                        color:"primary.dark", 
                                                        fontSize:18
                                                    }} />
                                                </IconButton>
                                            </Box>
                                            }
                                        </Box>
                                    </Box>
                            
                                )
                            })}
                        </Box>  
                    )
                })
            }
            <Dialog open={showEditDialog} onClose={closeEditDialog}
                PaperProps={{
                    sx: {
                        maxHeight: '80vh', 
                        width: "100vw",
                        maxWidth: "450px",
                        margin: 0
                    }
                }} 
            >
                <DialogTitle>Editar Comentario</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Comentario"
                        inputProps = {{maxLength: 500}}
                        multiline
                        rows={4}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        sx={{mt:2}}
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditDialog}>Cancelar</Button>
                    <Button onClick={handleUpdateComment} variant="contained" disabled={editedContent==""}>Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Comment Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onClose={closeDeleteDialog}>
                <DialogTitle>Borrar comentario</DialogTitle>
                <DialogContent>
                    <Typography>¿Seguro que quieres borrar tu comentario?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>No</Button>
                    <Button onClick={handleDeleteComment} variant="contained">Sí</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showCreateDialog} onClose={closeCreateDialog}
            PaperProps={{
                sx: {
                    maxHeight: '80vh', 
                    width: "100vw",
                    maxWidth: "450px",
                    margin: 0
                }
            }} >
                <DialogTitle> 
                    {selectedComment 
                        ? <>Respondiendo a {selectedComment.user.name}</>
                        : <>Nuevo comentario</>}
                    </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Comentario"
                        fullWidth
                        inputProps = {{maxLength: 500}}
                        multiline
                        rows={4}
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        sx={{mt:2}}
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreateDialog}>Cancelar</Button>
                    <Button onClick={handleCreateComment} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            </>
        }
        </Box>
    </>
    )
};

export default FoodComments;