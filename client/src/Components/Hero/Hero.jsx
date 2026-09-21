import Carousel, { CarouselItem } from "../Carousel/Carousel";
import './Hero.css'

/* Four association photographs, rotating in the hero frame. Chosen for the
   strongest read at small sizes: the full group shot leads, then the outdoor
   group, the selfie and the conference banner. The remaining supplied photos
   are used in the gallery section instead. */
const SLIDES = [
  { src: './Images/hero/hero-group.jpg', alt: 'GHABSA members gathered outdoors in association shirts' },
  { src: './Images/hero/hero-outdoors.jpg', alt: 'Biochemistry students together on campus grounds' },
  { src: './Images/hero/hero-selfie.jpg', alt: 'Students taking a group selfie at the College of Basic and Applied Sciences' },
  { src: './Images/hero/hero-conference.jpg', alt: 'Members outside the Department of Biochemistry, Cell and Molecular Biology' },
];

const Hero = () => {
  return (
    <div className="CarouselSlider">
      <div className="Carousel-container-div">
        <Carousel>
          {SLIDES.map((s) => (
            <CarouselItem key={s.src}>
              <img className="carousel-img" src={s.src} alt={s.alt} />
            </CarouselItem>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Hero;
