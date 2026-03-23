"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";

const testimonials = [
  {
    name: "Mariana Silva",
    username: "@mari",
    body: "Mudei de SP pra Campinas e tudo chegou impecável. Nem um arranhão no guarda-roupa! Recomendo demais.",
    img: "https://randomuser.me/api/portraits/women/32.jpg",
    city: "🏙️ São Paulo",
  },
  {
    name: "Rafael Costa",
    username: "@rafa",
    body: "Entrega no horário combinado, equipe super cuidadosa. Minha TV de 65 polegadas chegou perfeita.",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    city: "🌊 Rio de Janeiro",
  },
  {
    name: "Juliana Mendes",
    username: "@ju",
    body: "Impressionada com o cuidado! Embalaram tudo com proteção extra. Cada copo, cada prato — nada quebrou.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    city: "⛰️ Belo Horizonte",
  },
  {
    name: "Pedro Almeida",
    username: "@pedro",
    body: "Mudança interestadual em 2 dias. Achei que ia ser um caos, mas foi a experiência mais tranquila que já tive.",
    img: "https://randomuser.me/api/portraits/men/51.jpg",
    city: "🌲 Curitiba",
  },
  {
    name: "Camila Rocha",
    username: "@cami",
    body: "A equipe chegou pontualmente, desmontou e remontou tudo. Casa nova arrumada no mesmo dia!",
    img: "https://randomuser.me/api/portraits/women/53.jpg",
    city: "🏖️ Florianópolis",
  },
  {
    name: "Lucas Ferreira",
    username: "@lucas",
    body: "Meu piano de cauda chegou sem nenhum problema. O cuidado que tiveram foi absurdo. Nota 10!",
    img: "https://randomuser.me/api/portraits/men/33.jpg",
    city: "🏙️ São Paulo",
  },
  {
    name: "Isabela Santos",
    username: "@isa",
    body: "Tudo limpinho, organizado. Os móveis chegaram como se nunca tivessem saído do lugar. Serviço impecável.",
    img: "https://randomuser.me/api/portraits/women/45.jpg",
    city: "🌄 Brasília",
  },
  {
    name: "Thiago Oliveira",
    username: "@thiago",
    body: "Mudei com a família inteira e 3 gatos. Zero estresse. Até os brinquedos das crianças vieram organizados!",
    img: "https://randomuser.me/api/portraits/men/61.jpg",
    city: "🌊 Salvador",
  },
  {
    name: "Fernanda Lima",
    username: "@fer",
    body: "Rapidíssimo! Achei que levaria 2 dias, fizeram em 6 horas. E cada item com etiqueta de identificação.",
    img: "https://randomuser.me/api/portraits/women/85.jpg",
    city: "🏔️ Porto Alegre",
  },
];

function TestimonialCard({
  img,
  name,
  username,
  body,
  city,
}: (typeof testimonials)[number]) {
  return (
    <Card className="w-52">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name}{" "}
              <span className="text-xs">{city}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">
              {username}
            </p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-secondary-foreground leading-relaxed">
          {body}
        </blockquote>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          Depoimentos reais
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Cada caixa no lugar certo.{" "}
          <span className="text-primary">Cada cliente satisfeito.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Milhares de mudanças realizadas com cuidado, pontualidade e zero
          dor de cabeça.
        </p>
      </div>

      <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
          }}
        >
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:35s]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee
            vertical
            pauseOnHover
            reverse
            repeat={3}
            className="[--duration:40s]"
          >
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:45s]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee
            vertical
            pauseOnHover
            reverse
            repeat={3}
            className="[--duration:38s]"
          >
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>

          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white" />
        </div>
      </div>

      {/* Indicadores */}
      <div className="mx-auto max-w-4xl mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 px-6">
        {[
          { value: "2.400+", label: "Entregas realizadas" },
          { value: "98%", label: "Clientes satisfeitos" },
          { value: "24h", label: "Tempo médio de entrega" },
          { value: "4.8★", label: "Nota média" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-primary">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
