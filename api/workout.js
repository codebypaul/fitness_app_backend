const router = require('express').Router();
// const multer = require('multer')
// const cloudinary = require('cloudinary')
// const uploads = multer({dest:'./uploads'})
const Workout = require('../models/Workout')

// desc
// route GET /api/workouts
router.get('/', async (req, res) => {
    try {
        const workout = await Workout.find();
        res.json(workout);
    }catch(error){
        console.log(error);
        res.status(400)
    }
});

// desc
// route
router.get('/workout:id', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id)
        res.status(200).json(workout);
    }catch(error){
        console.log(error);
        res.status(400)
    }
});

// desc
// route
router.get('/category/:name', async (req, res) => {
    //console.log(req.body.category)
    try{
        const category = await Workout.find({category: req.params.name})
        res.status(200).json(category)
    }catch(error){
        console.log(error);
        res.status(400)
    }
})

// desc
// route POST /api/workouts
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

// desc
// route DELETE
router.delete('/:id' , async (req, res) => {
    try {
        //Find workout by the ID
        const workout = await Workout.findOneAndDelete({_id:req.params.id});
        res.status(202)
    } catch (error){
        console.log(error);
        res.status(400)
    }
});

module.exports = router; 