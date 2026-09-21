const Trendy = require('../models/trendy');

const createTrendy = async (req,res,next)=>{
      // Access the uploaded image file
  const image = req.file;

  // Access the text data from the request body
  const title = req.body.text;

  // Create a new trendy object
  const trendy = new Trendy({
    title: title,
    imageUrl: image.filename,
  });

  try {
    // Save the trendy object to the database
    await trendy.save();

    // Send a response indicating the update was successful
    res.json({ message: 'Update successful' });
  } catch (error) {
   next(err)
  }
}

const getTrendy = async (req,res,next)=>{
    try {
        // Fetch all trendy documents from the database
        const trendyItems = await Trendy.find();
    
        res.json(trendyItems);
      } catch (error) {
        next(err)
      }

}

const updateTrendy = async (req,res,next)=>{
    // Access the uploaded image file
 const image = req.file;
  
 // Access the text data from the request body
 const title = req.body.text;

 try {
   // Find the most recent trendy object based on creation timestamp
   const trendy = await Trendy.findOne().sort({ createdAt: -1 });

   if (!trendy) {
     // Handle if no trendy objects are found
     return res.status(404).json({ error: 'No trendy objects found' });
   }

   // Update the title and/or image of the most recent trendy object
   trendy.title = title;
   trendy.imageUrl = image.filename;

   // Save the updated trendy object to the database
   await trendy.save();

   // Send a response indicating the update was successful
   res.json({ message: 'Update successful' });
 } catch (error) {
   next(err)
 }


}


module.exports = {createTrendy,getTrendy,updateTrendy }