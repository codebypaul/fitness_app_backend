const router = require('express').Router()
const Food = require('../models/Food')
const request = require('request')
const cheerio = require('cheerio')

router.get('/test', async (req,res)=>{
    request('https://www.eatyourselfskinny.com/cranberry-cocktail-meatballs/',(error,response,html)=>{
        if (!error && response.statusCode === 200){
            const $ = cheerio.load(html);
            const list = $('')
        }
    })
})


// desc get all the foods that are in the database
// route GET /foods/
router.get('/', async (req,res)=>{
    try{
        const foods = await Food.find()
        res.status(200).json(foods)
    }catch(err){
        console.log(err);
        res.status(400)
    }
    // res.send('connected to /foods')
})
// desc get back a specific food from db
// route GET /foods/:name
router.get('/food:name',async(req,res)=>{
    try{
        const food = await Food.findOne({name:req.params.name})
        res.status(200).json(food)
    }catch(err){
        console.log(err);
        res.status(400)
    }
})


router.get('/category:category', async (req,res)=>{
    try{
        const category = await Food.find({category:req.params.category})
        res.status(200).json(category)
    }catch(err){

    }
})

// desc add a new food to the database
// route POST /foods/
router.post('/', async (req,res)=>{
    console.log(req.body);
    try{
        const steps = []
        const ingredients = []
        const facts = []  
        let image  
        const url = `https://www.eatyourselfskinny.com/${req.body.food}`
        request(url, async (error,response,html)=>{
            if (!error && response.statusCode === 200){
                const $ = cheerio.load(html)
                $('.tasty-recipe-ingredients li').each((i,el)=>{
                    const ingredient = $(el).text()
                    ingredients.push(ingredient)
                })
                $('.tasty-recipe-instructions li').each((i,el)=>{
                    const step = $(el).text()
                    steps.push(step)
                })
                $('.tasty-recipes-nutrition').each((i,el)=>{
                    const fact = $(el).text().replace(/\t\t\t\t\t\t\t+/g,'')
                    facts.push(fact)
                })
                $('.tasty-recipes-image img').each((i,el)=>{
                    image = $(el).attr('src')
                })

                const food = await Food.findOne({name:req.body.food})
                if (!food){
                    const newFood = new Food({
                        name:req.body.food,
                        ingredients,
                        instructions: steps,
                        nutritionData:facts,
                        category: req.body.category,
                        image
                    })
                    newFood.save()
                    res.status(200).json(newFood)
                } else (
                    res.status(200).json(food)
                )
            }
        })
    }catch(err){
        console.log(err);
        res.status(400)
    }
})

// desc update a given food
// route PUT /foods/
router.put('/', async (req,res)=>{
    console.log(req.params.name);
    console.log(req.body);
    const {ingredients, difficulty} = req.body
    try{
        if (difficulty){
            const food = await Food.findOneAndUpdate({
                name: req.params.name
            },{$set : {difficulty:difficulty}}).then(food=>{
                res.send(food)
            })
        } 
    }catch(err){
        console.log(err);
    }
})
router.delete('/delete/:name', async (req,res)=>{
    try{
        await Food.findOneAndDelete({
            name: req.params.name
        }).then(food=>{
            res.send(food)
        })
        // res.status(204).json('completed')
    }catch(err){
        console.log(err);
        res.status(400)
    }
})
module.exports = router