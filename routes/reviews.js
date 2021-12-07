const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { reviewSchema } = require('../schemas.js')
const Review = require("../models/review")
const Campground = require('../models/campground')
const {validateReview}=require('../middleware')
const { isLoggedIn ,validateCampground,isAuthor,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/',isLoggedIn,validateReview ,catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;