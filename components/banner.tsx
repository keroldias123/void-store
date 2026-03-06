import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  
  import { Button } from "@/components/ui/button";
  
  const slides = [
    {
      title: "Mega Descontos de Verão",
      subtitle: "Até 50% em eletrônicos selecionados",
      image: "/banners/sale.jpg",
      cta: "Comprar agora",
    },
    {
      title: "Novidades 2026",
      subtitle: "Descubra os produtos mais recentes",
      image: "/banners/new.jpg",
      cta: "Explorar",
    },
    {
      title: "Entrega Grátis",
      subtitle: "Em pedidos acima de 100€",
      image: "/banners/shipping.jpg",
      cta: "Ver produtos",
    },
  ];
  
  export function PromoCarousel() {
    return (
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative h-[220px] sm:h-[280px] lg:h-[320px] overflow-hidden rounded-3xl">
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