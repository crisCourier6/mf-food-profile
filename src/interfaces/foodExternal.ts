export interface FoodExternal{
    id:string
    product_name:string
    image_small_url:string
    brands: string,
    nutriments: object,
    nutrient_levels: object,
    allergens: object,
    nova_group: number,
    additives_tags: string[],
    environment_impact_level: string,
    nutriscore_grade: string,
    ecoscore_grade: string,    
    ingredients: object,
    ingredients_text: string,
    quantity: string,
    serving_quantity: string,
    serving_size: string,
    image_front_url: string,
    image_nutrition_url: string,
    image_url: string,
}