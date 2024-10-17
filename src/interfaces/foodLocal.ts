import { FoodExternal } from "./foodExternal"
import { UserRatesFood } from "./userRatesFood"

export interface FoodLocal{
    id:string
    name:string
    likes:number
    dislikes:number
    picture:string
    foodData?:FoodExternal
    userRatesFood?:UserRatesFood
}