import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from "react-router-dom"
import { Box, Button, IconButton, Paper, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { UserCommentsFood } from '../interfaces/UserCommentsFood';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
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
            content: selectedComment?`(Respondiendo a ${selectedComment.user.name}) ${newCommentContent}`: newCommentContent,
            userId: currentUserId,
            foodLocalId: id,
            commentHasParent: selectedCommentParent? selectedCommentParent.id : null
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
            gap:2,
        }}>
            <Paper elevation={0} square={true} sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                border: "5px solid",
                borderColor: "primary.main",
                justifyContent: "flex-start",
                display: "flex",
                textIndent: 10,
                cursor: "pointer"
            }}>
                <Typography 
                width={"100%"} 
                variant='h6' 
                color= "primary.contrastText" 
                onClick={toggleExpand}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center" // Ensure vertical alignment
                }}>
                    <Box sx={{ }}>Comentarios</Box>  {/* FlexGrow pushes the next box to the right */}
                    <Box>{expanded ? "▲" : "▼"}</Box>
                </Typography>
            </Paper>
            {expanded && <>
                <Button variant='contained' onClick={()=>openCreateDialog(null, null)}>
                    Comentar
                </Button>
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
                                    {comment.userId === currentUserId  
                                        ?<>                                        
                                        <IconButton size="small" onClick={()=>openEditDialog(comment, null)}>
                                        <EditRoundedIcon sx={{ 
                                            color: "primary.contrastText",
                                            fontSize: 18
                                        }}/>
                                        </IconButton>    
                                        <IconButton size="small" onClick={()=>openDeleteDialog(comment, null)}>
                                            <DeleteForeverRoundedIcon sx={{ 
                                                color:"primary.contrastText", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
                                        <IconButton size="small" onClick={()=>openCreateDialog(null, comment)}>
                                            <ReplyRoundedIcon sx={{ 
                                                color:"primary.contrastText", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
                                        </>
                                        :<IconButton size="small" onClick={()=>openCreateDialog(null, comment)}>
                                            <ReplyRoundedIcon sx={{ 
                                                color:"primary.contrastText", 
                                                fontSize:18
                                            }} />
                                        </IconButton>
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
                                            {parentChild.childComment.userId === currentUserId && <>                                        
                                                <IconButton size="small" onClick={()=>openEditDialog(parentChild.childComment, comment)}>
                                                    <EditRoundedIcon sx={{ 
                                                        color: "primary.contrastText",
                                                        fontSize: 18
                                                    }}/>
                                                </IconButton>    
                                                <IconButton size="small" onClick={()=>openDeleteDialog(parentChild.childComment, comment)}>
                                                    <DeleteForeverRoundedIcon sx={{ 
                                                        color:"primary.contrastText", 
                                                        fontSize:18
                                                    }} />
                                                </IconButton>
                                                </>
                                            }
                                            <IconButton size="small" onClick={()=>openCreateDialog(parentChild.childComment, comment)}>
                                                <ReplyRoundedIcon sx={{ 
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
                })
            }
            <Dialog open={showEditDialog} onClose={closeEditDialog}
                PaperProps={{
                    sx: {
                        maxHeight: '80vh', 
                        width: "85vw",
                        maxWidth: "450px"
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
                    <Button onClick={closeDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDeleteComment} variant="contained" color="error">Borrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showCreateDialog} onClose={closeCreateDialog}
            PaperProps={{
                sx: {
                    maxHeight: '80vh', 
                    width: "85vw",
                    maxWidth: "450px"
                }
            }} >
                <DialogTitle>Nuevo comentario</DialogTitle>
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