import ImageSlider from "../ImageSider/ImageSlider";

const NotHome=()=>{

    const images = [
        'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaalm2F60-vtEYeWNhHolAHwCm2TKrhAyDcphc8vZJEg&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5screXWP_4e1v2aWJ4trV5fTyzoFk9l4kUWmXZHZ5&s',
        
      ];
return(
    <div className="starry">
       <ImageSlider images={images}/>
        <div>timer</div>
        <div>memories</div>
        <div>Available tables</div>
        <div>footer</div>

    </div>
)
}

export default NotHome;