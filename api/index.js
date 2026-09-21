const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/internpost");
const resourceRoute = require("./routes/addResource");
const PostRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const trendyRoutes = require("./routes/Trendy");
const multer = require("multer");
const cors = require('cors');
const fileRoutes = require('./routes/addResource');
const eventRoutes = require('./routes/event');
const GhabsaEventRoutes = require('./routes/ghabsaevent');
const internshipReqRoutes = require('./routes/InternshipRequest');
const AdvertRoutes = require('./routes/advertisement');
const BookingRoutes = require('./routes/Table');
const BookTableRoutes = require('./routes/Bookings');
const ticketRoutes = require('./routes/Ticket');
const timerRoutes = require('./routes/Timer');
const mailerRoutes = require('./routes/contactUs');
const path = require('path'); 
const companyRoutes = require('./routes/company');

dotenv.config();
app.use(express.json());
app.use(cors());

// Serve static files from the 'trendyPhoto' directory
app.use('/trendyPhoto', express.static(path.join(__dirname, 'trendyPhoto')));
app.use('/adverts', express.static(path.join(__dirname, 'adverts')));
// Serve uploaded images from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/Dinner', express.static(path.join(__dirname, 'Dinner')));
app.use('/profile', express.static(path.join(__dirname, 'profile')));

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to database');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Backend is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/internpost', postRoute);
app.use('/api/addResource', resourceRoute);
app.use('/api/post', PostRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/file', fileRoutes);
app.use('/api/trendy', trendyRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/ghabsaevent', GhabsaEventRoutes);
app.use('/api/internshipRequest', internshipReqRoutes);
app.use('/api/advertisement', AdvertRoutes);
app.use('/api/reservation', BookingRoutes);
app.use('/api/bookings', BookTableRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/mailer',mailerRoutes);
app.use('/api/organization', companyRoutes);
// dotenv.config()
// app.use(express.json());
// app.use(cors());

// mongoose.set('strictQuery', false);

// mongoose.connect(process.env.DATABASE_URL,{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
// }).then(console.log('Connected to database'))
//   .catch((err)=> console.log(err));




// app.use('/api/auth',authRoute)
// app.use('/api/user',userRoute)
// app.use('/api/internpost',postRoute)
// app.use('/api/addResource',resourceRoute)
// app.use('/api/posts',PostRoute)
app.use((err,req,res,next)=>{
const errorStatus =err.status||500
const errorMessage = err.message ||"Oops somethings went wrong!"
return res.status(errorStatus).json({
  success:false,
  status:errorStatus,
  message:errorMessage,
  stack:err.stack
})
})


// app.listen('5000',()=>{
//  console.log('backend is running');
// })