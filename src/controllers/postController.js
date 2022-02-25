const router = require('express').Router();

const { postServices } = require('../services/postServices');
const postDetailsController = require('../controllers/postDetailsController');
const { isUser } = require('../middlewares/authMiddleware');

router.get('/all-posts', async (req, res) => {
    const posts = await postServices.getAll();

    res.render('post/all-posts', { posts });
});

router.get('/create', isUser, (req, res) => {
    res.render('post/create');
});

router.post('/create', isUser, async (req, res) => {
    const { title, keyword, location, date, imageUrl, description } = req.body;

    try {
        await postServices.create({
            title,
            keyword,
            location,
            date,
            imageUrl,
            description,
            author: req.user?._id,
        })

        console.log(`A Post titled ${title} has been created on ${date}`);

        res.redirect('/posts/all-posts');
    } catch (error) {
        error.errors
            ? res.locals.errors = Object.keys(error.errors).map(x => error.errors[x].message)
            : res.locals.error = error.message;

        res.status(400).render('post/create');
    }
});

router.get('/:userId', async (req, res) => {
    const posts = await postServices.getPostsByAuthor(req.user?._id);

    res.render('post/my', { posts }); 
});

router.use('/:postId', postDetailsController);

module.exports = router;