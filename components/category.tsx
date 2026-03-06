import { categories } from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card } from "@/components/ui/card"

const categorias = [
  {
    nome: "Eletrodomésticos",
    subs: ["Computadores", "Telemóveis", "TVs", "Eletroportáteis"],
  },
  {
    nome: "Roupas",
    subs: ["Calças", "Vestidos", "Camisetas", "Casacos"],
  },
  {
    nome: "Casa",
    subs: ["Móveis", "Decoração", "Iluminação", "Cozinha"],
  },
];

export default function CategoriasGrid() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Explore por Categoria</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categoria/${category.slug}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-center">{category.name}</h3>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}