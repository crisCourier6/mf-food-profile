import { CommentHasComment } from "./CommentHasComment"
import { User } from "./User"

export interface UserCommentsFood {
    id:string,
    foodLocalId:string,
    userId:string,
    createdAt: Date,
    updatedAt: Date
    content: string,
    isHidden: boolean,
    flags: number,
    user:User,
    commentHasParent:CommentHasComment
    commentHasChild:CommentHasComment[]
}