const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review')
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const imageSchema = new Schema(
   {
      url: String,
      filename: String
   }
)
imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema = new Schema({
   title: String,
   images: [imageSchema],
   price: { type: Number, min: 0 },
   description: String,
   location : String,
   geometry: {
      type:{
         type:String,
         enum :['Point'],
         required : true
      },
      coordinates :{
         type : [Number],
         required: true
      }
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Review'
      }
   ]
},opts);
CampgroundSchema.post('findOneAndDelete', async (doc) => {
   if (doc) {
      await Review.deleteMany({
         _id: {
            $in: doc.reviews
         }
      })
   }
})
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
   return `<strong><h6><a href='/campgrounds/${this._id}'>${this.title}</a></h6></strong>
   <p>${this.location}</p>`
 })
module.exports = mongoose.model('Campground', CampgroundSchema)