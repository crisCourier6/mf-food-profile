import { UserCommentsFood } from "./UserCommentsFood"

export interface CommentHasComment {
    parentId:string,
    childId:string,
    parentComment?:UserCommentsFood,
    childComment:UserCommentsFood
}