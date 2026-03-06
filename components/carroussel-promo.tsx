import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  import Autoplay from "embla-carousel-autoplay";
  import { Button } from "@/components/ui/button";
  
  const slides = [
    {
      title: "Mega Descontos de Verão",
      subtitle: "Até 50% em eletrônicos selecionados",
      image:
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1600&h=500&fit=crop",
      cta: "Comprar agora",
    },
    {
      title: "Novidades 2026",
      subtitle: "Descubra os produtos mais recentes",
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&h=500&fit=crop",
      cta: "Explorar",
    },
    {
      title: "Entrega Grátis",
      subtitle: "Em pedidos acima de 100€",
      image:
        "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?q=80&w=1600&h=500&fit=crop",
      cta: "Ver produtos",
    },
  ];
  
  export function PromoCarousel() {
    return (
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Carousel
         plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative h-[280px] sm:h-[280px] lg:h-[320px] overflow-hidden rounded-xl">
                  <img
                    src={slide.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
  
                  {/* overlay */}
                  <div className="absolute inset-0 bg-black/30" />
  
                  {/* content */}
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-white max-w-md">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {slide.title}
                    </h2>
                    <p className="mt-2 text-sm sm:text-base opacity-90">
                      {slide.subtitle}
                    </p>
  
                    <Button className="mt-4 rounded-xl bg-white text-black hover:bg-white/90">
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
  
          {/* controls */}
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    );
  }