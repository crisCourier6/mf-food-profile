import { FoodExternal } from "./foodExternal"
import { FoodHasAdditive } from "./foodHasAdditive"
import { FoodHasAllergen } from "./foodHasAllergen"
import { UserRatesFood } from "./userRatesFood"

export interface FoodLocal{
    id:string
    name:string
    likes:number
    dislikes:number
    picture:string
    hasLocalAllergens: boolean
    hasLocalAdditives: boolean
    foodData?:FoodExternal
    userRatesFood?:UserRatesFood
    foodHasAllergen?:FoodHasAllergen[]
    foodHasAdditive?:FoodHasAdditive[]
}