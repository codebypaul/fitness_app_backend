## Backend

This backend was built using mongoose to create our Schemas and storing them online using mongoDB atlas.

link to client side repo `https://github.com/codebypaul/fitness_app_client`

## our models for workouts and nutrition

#### food schema

```js
const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: String,
    ingredients: [String],
    instructions : [String],
    nutritionData: [String],
    category: String,
    image : String
})

module.exports = mongoose.model('Food',foodSchema)
```

#### workout schema

```js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name:String,
    picture: String,
    category: String,
    sets: Number,
    reps: Number,
    description: String
})

module.exports = mongoose.model('workout', workoutSchema);
```
### oh no what went wrong

In the early stages of this project we were builing out the api in a seperate project `https://github.com/fmuwanguzi/fitness-api` and pulling from it's deployed link `https://general-fit.herokuapp.com/`.

While it was working fine they're was a merging issue and it had to be scraped due to a time constraint at this time it is working.

### the fix

Routes were adjusted to work directly from our back end repo/project.

## adding food 

Using an online website `https://www.eatyourselfskinny.com` to get information for food. This was done using request and cheerio. As well as carefully inspecting the pages for neccessary information. 

```js 
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

```

## Add Workouts

Adding to the api for workouts was done using the route below and using postman.

```js
router.post('/', async (req,res)=>{
    try{
        const workout = await Workout.findOne({name:req.body.name})
        if (!workout) {
            const newWorkout = new Workout({
                name: req.body.name,
                picture: req.body.image,
                category: req.body.category,
                sets: req.body.sets,
                reps: req.body.reps,
                description: req.body.description 
            });
            newWorkout.save()
            res.status(201).json(newWorkout)
        }
    }catch(err){
        res.status(400)
        console.log(err);
    }
})
```