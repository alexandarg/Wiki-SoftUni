const router = require('express').Router({ mergeParams: true });

const { postServices } = require('../services/postServices');
const { isUser, isGuest, isOwner } = require('../middlewares/authMiddleware');

router.get('/details', async (req, res) => {
    const post = await postServices.getById(req.params.postId);

    const postData = post.toObject();

    const isAuthor = post.author._id == req.user?._id;

    const isVoted = post.votes.some(x => x._id == req.user?._id);

    const votedUsers = post.getVotedUsers();

    res.render('post/details', { ...postData, isAuthor, isVoted, votedUsers });
});

router.get('/upvote', isUser, (req, res) => {
    postServices.vote('up', req.user?._id, req.params.postId);

    console.log(`User with the email \"${req.user?.email}\" has upvoted a post`);

    res.redirect(`/posts/${req.params.postId}/details`);
});

router.get('/downvote', isUser, (req, res) => {
    postServices.vote('down', req.user?._id, req.params.postId);

    console.log(`User with the email \"${req.user?.email}\" has downvoted a post`);

    res.redirect(`/posts/${req.params.postId}/details`);
});

router.get('/delete', isUser, isOwner, async (req, res) => {
    await postServices.remove(req.params.postId);

    console.log('Post has been deleted');

    res.redirect('/');
});

router.get('/edit', isUser, isOwner, async (req, res) => {
    const post = await postServices.getById(req.params.postId);

    res.render('post/edit', { ...post.toObject() });
});

router.post('/edit', isUser, isOwner, async (req, res) => {
    const { title, keyword, location, date, imageUrl, description } = req.body;

    try {
        await postServices.update(
            req.params.postId, 
            {title, keyword, location, date, imageUrl, description},
        );

        console.log('Post has been updated successfully!');

        res.redirect(`/posts/${req.params.postId}/details`);
    } catch (error) {
        error.errors
            ? res.locals.errors = Object.keys(error.errors).map(x => error.errors[x].message)
            : res.locals.error = error.message;

        res.status(400).render('post/edit');
    }
});

module.exports = router;