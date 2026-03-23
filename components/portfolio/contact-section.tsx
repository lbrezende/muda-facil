"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contato" className="relative">
      <div className="sticky bottom-0 min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">
        <div className="w-full max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-[#009B3A] mb-4 font-medium">
              Vamos tomar um café?
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Bora construir algo{" "}
              <span className="text-[#009B3A]">incrível</span> juntos.
            </h2>
            <p className="text-white/60 text-lg max-w-lg mx-auto">
              Se você busca um Design Engineer que une pesquisa, estratégia e
              IA para mover métricas reais, estou pronto para conversar.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">&#9749;</div>
              <h3 className="text-2xl font-bold mb-2">Mensagem enviada!</h3>
              <p className="text-white/60">
                Vou responder em breve. Prepara o café!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="text-sm text-white/50 mb-1.5 block">
                  Nome
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm text-white/50 mb-1.5 block">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                />
              </div>
              <div>
                <label htmlFor="message" className="text-sm text-white/50 mb-1.5 block">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte sobre seu projeto ou desafio..."
                  required
                  rows={5}
                  className={cn(
                    "flex w-full rounded-md border bg-white/5 border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009B3A]/50 focus-visible:border-[#009B3A]",
                    "resize-none"
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#009B3A] hover:bg-[#009B3A]/90 text-white font-semibold text-base"
              >
                Enviar mensagem
              </Button>
            </form>
          )}

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>Leandro Rezende &mdash; Design Engineer Senior</p>
            <div className="flex gap-6">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
